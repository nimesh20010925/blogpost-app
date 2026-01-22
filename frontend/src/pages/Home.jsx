import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import FeaturedPost from '../components/FeaturedPost';
import Sidebar from '../components/Sidebar';
import BlogCard from '../components/BlogCard';
import api from '../api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await api.get('/posts/all'); // Changed from '/posts' to '/posts/all'
      console.log('Fetched posts:', res.data); // Debug log
      setPosts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      console.error('Error response:', err.response?.data); // More error details
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Loading posts...</p>
            <div className="mt-4 w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </>
    );
  }

  // Handle case when no posts exist
  if (posts.length === 0) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 mt-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">No Posts Yet</h1>
            <p className="text-gray-600 mb-8">Check back soon for new content!</p>
            <button 
              onClick={fetchPosts} 
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </main>
      </>
    );
  }

  const featured = posts.length > 0 ? posts[0] : {
    title: "Welcome to Our Blog",
    category: "Blog",
    excerpt: "This is where you'll find our latest articles and updates.",
    image: null,
    author: "Admin",
    publishDate: new Date().toISOString().split('T')[0]
  };

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2">
          <FeaturedPost post={featured} />
        </div>

        {/* Right */}
        <Sidebar recent={posts.slice(0, 3)} />
      </main>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <h2 className="text-2xl font-bold mb-8">Recent Posts</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard key={post._id || index} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-7xl mx-auto px-6 mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <p>Total posts: {posts.length}</p>
          <p>First post title: {posts[0]?.title || 'N/A'}</p>
        </div>
      )}
    </>
  );
}