import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    status: 'published'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
    } else if (formData.content.trim().length > 10000) {
      newErrors.content = 'Content cannot exceed 10,000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Process tags - split by comma and clean up
      const processedTags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        status: formData.status,
        tags: processedTags
      };

      const response = await axios.post('/api/posts', postData);

      if (response.data.post) {
        // Redirect to the newly created post
        navigate(`/post/${response.data.post._id}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      
      if (err.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          if (error.includes('title')) backendErrors.title = error;
          else if (error.includes('content')) backendErrors.content = error;
          else backendErrors.general = error;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ 
          general: err.response?.data?.message || 'Failed to create post. Please try again.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.content) {
      if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="create-post-container">
      <div className="container">
        <div className="create-post-header">
          <h2>Scribble Your Mind</h2>
          <p>Transform your thoughts into captivating stories</p>
        </div>

        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter an engaging title for your post"
              required
              disabled={loading}
              className={errors.title ? 'error' : ''}
              maxLength={200}
            />
            {errors.title && (
              <span className="field-error">{errors.title}</span>
            )}
            <small className="char-count">
              {formData.title.length}/200 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="content">Post Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write your post content here... Share your ideas, experiences, or stories!"
              required
              disabled={loading}
              className={errors.content ? 'error' : ''}
              rows={15}
              maxLength={10000}
            />
            {errors.content && (
              <span className="field-error">{errors.content}</span>
            )}
            <small className="char-count">
              {formData.content.length}/10,000 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (Optional)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., technology, programming, react (separate with commas)"
              disabled={loading}
            />
            <small className="form-help">
              Add relevant tags to help others discover your post. Separate multiple tags with commas.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="status">Post Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="published">Published (visible to everyone)</option>
              <option value="draft">Draft (save for later)</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;