const express = require('express');
const Post = require('../models/Post');
const authenticate = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'published', author, tag, search } = req.query;
    
    // Build query
    const query = { status };
    
    if (author) {
      query.author = author;
    }
    
    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPosts = await Post.countDocuments(query);
    
    // Get posts with author information
    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Calculate pagination info
    const totalPages = Math.ceil(totalPosts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      message: 'Posts retrieved successfully',
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPosts,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      message: 'Server error retrieving posts'
    });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('likes.user', 'name');

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // Increment view count
    await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      message: 'Post retrieved successfully',
      post
    });

  } catch (error) {
    console.error('Get post error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid post ID'
      });
    }
    
    res.status(500).json({
      message: 'Server error retrieving post'
    });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, status = 'published', tags } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        message: 'Title and content are required'
      });
    }

    // Process tags
    const processedTags = tags ? 
      tags.filter(tag => tag.trim()).map(tag => tag.trim().toLowerCase()) : [];

    // Create new post
    const post = new Post({
      title: title.trim(),
      content: content.trim(),
      author: req.userId,
      status,
      tags: processedTags
    });

    // Save post
    await post.save();

    // Populate author information before sending response
    await post.populate('author', 'name email');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });

  } catch (error) {
    console.error('Create post error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Post with this slug already exists'
      });
    }

    res.status(500).json({
      message: 'Server error creating post'
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private (Author only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, content, status, tags } = req.body;

    // Find post
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // Check if user is the author of the post
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only update your own posts'
      });
    }

    // Validate required fields if provided
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        message: 'Title cannot be empty'
      });
    }

    if (content !== undefined && !content.trim()) {
      return res.status(400).json({
        message: 'Content cannot be empty'
      });
    }

    // Process tags
    const processedTags = tags ? 
      tags.filter(tag => tag.trim()).map(tag => tag.trim().toLowerCase()) : post.tags;

    // Update fields
    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (content !== undefined) updateFields.content = content.trim();
    if (status !== undefined) updateFields.status = status;
    if (tags !== undefined) updateFields.tags = processedTags;

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });

  } catch (error) {
    console.error('Update post error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid post ID'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Server error updating post'
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (Author only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Find post
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // Check if user is the author of the post
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only delete your own posts'
      });
    }

    // Delete post
    await Post.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid post ID'
      });
    }

    res.status(500).json({
      message: 'Server error deleting post'
    });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/Unlike a post
// @access  Private
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // Check if user already liked the post
    const existingLike = post.likes.find(
      like => like.user.toString() === req.userId.toString()
    );

    if (existingLike) {
      // Unlike: Remove the like
      post.likes = post.likes.filter(
        like => like.user.toString() !== req.userId.toString()
      );
      await post.save();

      return res.json({
        message: 'Post unliked successfully',
        liked: false,
        likesCount: post.likes.length
      });
    } else {
      // Like: Add the like
      post.likes.push({ user: req.userId });
      await post.save();

      return res.json({
        message: 'Post liked successfully',
        liked: true,
        likesCount: post.likes.length
      });
    }

  } catch (error) {
    console.error('Like post error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid post ID'
      });
    }

    res.status(500).json({
      message: 'Server error processing like'
    });
  }
});

// @route   GET /api/posts/user/:userId
// @desc    Get posts by specific user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'published' } = req.query;
    
    // Build query
    const query = { 
      author: req.params.userId,
      status 
    };

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPosts = await Post.countDocuments(query);
    
    // Get posts
    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Calculate pagination info
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      message: 'User posts retrieved successfully',
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid user ID'
      });
    }

    res.status(500).json({
      message: 'Server error retrieving user posts'
    });
  }
});

module.exports = router;