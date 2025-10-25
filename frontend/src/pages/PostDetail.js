import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await axios.get(`/api/posts/${id}`);
        setPost(response.data.post);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle like/unlike
  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLikeLoading(true);
    try {
      const response = await axios.post(`/api/posts/${id}/like`);
      
      // Update post state with new like status
      setPost(prev => ({
        ...prev,
        likes: response.data.liked 
          ? [...(prev.likes || []), { user: user._id }]
          : (prev.likes || []).filter(like => like.user !== user._id),
        likesCount: response.data.likesCount
      }));
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setLikeLoading(false);
    }
  };

  // Handle delete post
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    try {
      await axios.delete(`/api/posts/${id}`);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Error deleting post:', err);
      alert(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Check if current user liked the post
  const isLikedByUser = post?.likes?.some(like => 
    like.user === user?._id || like.user?._id === user?._id
  ) || false;

  // Check if current user is the author
  const isAuthor = post?.author?._id === user?._id;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">
          <h3>Loading post...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          {error}
        </div>
        <Link to="/" className="back-home-btn">
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="not-found">
        <h2>Post Not Found</h2>
        <p>The post you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="back-home-btn">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <div className="container">
        {/* Navigation */}
        <div className="post-nav">
          <Link to="/" className="back-btn">
            ← Back to Posts
          </Link>
          
          {isAuthor && (
            <div className="author-actions">
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="delete-btn"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Post'}
              </button>
            </div>
          )}
        </div>

        {/* Post Content */}
        <article className="post-detail">
          <header className="post-header">
            <h1 className="post-title">{post.title}</h1>
            
            <div className="post-meta">
              <div className="author-info">
                <span className="author-name">
                  By {post.author?.name || 'Unknown Author'}
                </span>
                <span className="post-date">
                  Published on {formatDate(post.createdAt)}
                </span>
                {post.updatedAt !== post.createdAt && (
                  <span className="updated-date">
                    (Updated {formatDate(post.updatedAt)})
                  </span>
                )}
              </div>
              
              <div className="post-stats">
                <span className="views">👁️ {post.views || 0} views</span>
                <span className="likes">❤️ {post.likesCount || 0} likes</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="post-content">
            <div className="content-text">
              {post.content.split('\n').map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index}>{paragraph}</p>
                ) : (
                  <br key={index} />
                )
              ))}
            </div>
          </div>

          <footer className="post-footer">
            <div className="post-actions">
              {isAuthenticated && (
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`like-btn ${isLikedByUser ? 'liked' : ''}`}
                >
                  {likeLoading ? '...' : (isLikedByUser ? '❤️ Liked' : '🤍 Like')}
                  {post.likesCount > 0 && ` (${post.likesCount})`}
                </button>
              )}
              
              {!isAuthenticated && (
                <div className="auth-prompt">
                  <Link to="/login" className="login-to-like">
                    Login to like this post
                  </Link>
                </div>
              )}
            </div>

            <div className="share-section">
              <p className="share-label">Share this post:</p>
              <div className="share-buttons">
                <button 
                  onClick={() => navigator.clipboard?.writeText(window.location.href)}
                  className="share-btn"
                  title="Copy link"
                >
                  🔗 Copy Link
                </button>
              </div>
            </div>
          </footer>
        </article>

        {/* Author Bio Section */}
        <section className="author-section">
          <div className="author-bio">
            <h3>About the Author</h3>
            <div className="author-details">
              <strong>{post.author?.name || 'Unknown Author'}</strong>
              <p>Member since {formatDate(post.author?.createdAt || post.createdAt)}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetail;