import { Link } from 'react-router-dom';

export default function FeaturedPost({ post }) {
  // Build image URL - if image exists, use it from uploads folder, otherwise use placeholder
  const imageUrl = post.image
    ? `http://localhost:5001/uploads/${post.image}`
    : 'https://source.unsplash.com/1200x600/?featured';

  return (
    <Link to={post._id ? `/post/${post._id}` : '#'} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-72 object-cover"
          onError={(e) => {
            e.target.src = 'https://source.unsplash.com/1200x600/?featured';
          }}
        />
        <div className="p-5">
          <p className="text-sm text-gray-500">{post.category}</p>
          <h2 className="text-2xl font-bold mt-2">{post.title}</h2>
          <p className="text-gray-600 mt-3 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>❤️ {post.likes || 0}</span>
            <span>💬 {post.comments || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
