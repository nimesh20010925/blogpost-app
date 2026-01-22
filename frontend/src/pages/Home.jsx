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
      // 使用 /posts 而不是 /posts/all，因为 /posts 只返回已发布的文章
      const res = await api.get('/posts');
      console.log('Fetched published posts:', res.data);
      
      // 额外过滤确保只显示已发布文章
      const publishedPosts = res.data.filter(post => post.status === 'published');
      console.log('Filtered published posts:', publishedPosts);
      
      setPosts(publishedPosts);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      console.error('Error response:', err.response?.data);
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

  // 如果没有已发布的文章
  if (posts.length === 0) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 mt-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">No Published Posts Yet</h1>
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

  // 只从已发布的文章中选择特色文章
  const featured = posts.length > 0 ? posts[0] : null;

  // 如果没有特色文章，显示一个占位符
  if (!featured) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 mt-8">
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <h1 className="text-2xl font-bold text-gray-700">Welcome to Our Blog</h1>
            <p className="text-gray-600 mt-2">Our first article is coming soon!</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - 特色文章 */}
        <div className="lg:col-span-2">
          <FeaturedPost post={featured} />
        </div>

        {/* Right - 侧边栏 */}
        <Sidebar recent={posts.slice(0, 3)} />
      </main>

      {/* 博客网格 */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <h2 className="text-2xl font-bold mb-8">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 跳过第一个（特色文章），显示其余的 */}
          {posts.slice(1).map((post, index) => (
            <BlogCard key={post._id || index} post={post} />
          ))}
        </div>
      </section>

      {/* 调试信息（生产环境移除） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-7xl mx-auto px-6 mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <p>Total published posts: {posts.length}</p>
          <p>Featured post status: {featured?.status || 'N/A'}</p>
          <p>Featured post title: {featured?.title || 'N/A'}</p>
          <button 
            onClick={() => {
              console.log('All posts:', posts);
              console.log('Featured post:', featured);
            }}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Log Details
          </button>
        </div>
      )}
    </>
  );
}