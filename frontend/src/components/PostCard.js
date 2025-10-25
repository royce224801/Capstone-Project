import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
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

  // Truncate content for preview
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Extract first few words for preview
  const getContentPreview = (content) => {
    // Remove HTML tags if any and truncate
    const cleanContent = content.replace(/<[^>]*>/g, '');
    return truncateContent(cleanContent);
  };

  return (
    <article className="post-card">
      <div className="post-card-content">
        <header className="post-card-header">
          <h2 className="post-title">
            <Link to={`/post/${post._id}`} className="post-title-link">
              {post.title}
            </Link>
          </h2>
          
          <div className="post-meta">
            <span className="post-author">
              By {post.author?.name || 'Unknown Author'}
            </span>
            <span className="post-date">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </header>

        <div className="post-preview">
          <p className="post-excerpt">
            {getContentPreview(post.content)}
          </p>
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

        <footer className="post-card-footer">
          <div className="post-stats">
            <span className="post-views">
              👁️ {post.views || 0} views
            </span>
            <span className="post-likes">
              ❤️ {post.likesCount || post.likes?.length || 0} likes
            </span>
          </div>
          
          <Link to={`/post/${post._id}`} className="read-more-btn">
            Read More
          </Link>
        </footer>
      </div>
    </article>
  );
};

export default PostCard;