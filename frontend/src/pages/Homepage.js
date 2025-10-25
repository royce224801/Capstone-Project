import React from 'react';
import PostList from '../components/PostList';

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to MindScribble</h1>
            <p className="hero-subtitle">
              Where thoughts become words, and words become stories. Share your mind's creations with the world.
            </p>
          </div>
        </section>

        {/* Posts Section */}
        <section className="posts-section">
          <PostList />
        </section>
      </div>
    </div>
  );
};

export default Homepage;