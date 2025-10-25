import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Fetch posts from the API
  const fetchPosts = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page,
        limit: 10
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await axios.get('/api/posts', { params });
      
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.response?.data?.message || 'Failed to fetch posts. Please try again later.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for search
    const timeout = setTimeout(() => {
      fetchPosts(1, searchTerm);
    }, 500); // 500ms delay

    setSearchTimeout(timeout);

    // Cleanup timeout on unmount
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPosts(newPage, searchTerm);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading && posts.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading">
          <h3>Loading posts...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="post-list-container">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search through the scribblings..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={clearSearch} className="clear-search-btn">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Posts Header */}
      <div className="posts-header">
        <h2>
          {searchTerm ? `Search Results for "${searchTerm}"` : 'Latest Mind Scribblings'}
        </h2>
        <p className="posts-count">
          {pagination.totalPosts > 0 
            ? `Showing ${posts.length} of ${pagination.totalPosts} posts`
            : 'No posts found'
          }
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-container">
          <div className="error-message">
            {error}
          </div>
          <button 
            onClick={() => fetchPosts(pagination.currentPage, searchTerm)}
            className="retry-btn"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : !loading && !error && (
        <div className="no-posts">
          <h3>No posts found</h3>
          <p>
            {searchTerm 
              ? `No scribblings match your search for "${searchTerm}". Try a different search term.`
              : 'Be the first to scribble your mind!'
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      {posts.length > 0 && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage || loading}
            className="pagination-btn"
          >
            ← Previous
          </button>

          <div className="pagination-info">
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage || loading}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {loading && posts.length > 0 && (
        <div className="loading-overlay">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default PostList;