import Navbar from '../components/Navbar';
import FeaturedPost from '../components/FeaturedPost';
import Sidebar from '../components/Sidebar';
import BlogCard from '../components/BlogCard';

export default function Home() {
  const featured = {
    title: "Mastering React Hooks",
    category: "React",
    excerpt: "A complete guide to useEffect, useMemo, and custom hooks.",
    image: "https://source.unsplash.com/1200x600/?coding"
  };

  const posts = Array(6).fill(featured);

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
      <section className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((p, i) => (
          <BlogCard key={i} post={p} />
        ))}
      </section>
    </>
  );
}
