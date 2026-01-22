import { Link } from 'react-router-dom';

export default function BlogCard({ post }) {
  // Build image URL - if image exists, use it from uploads folder, otherwise use placeholder
  const imageUrl = post.image
    ? `http://localhost:5001/uploads/${post.image}`
    : 'https://source.unsplash.com/1200x600/?blog';

  return (
    <Link to={`/post/${post._id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
        <img
          src={imageUrl}
          alt={post.title}
          className="h-44 w-full object-cover"
          onError={(e) => {
            e.target.src = 'https://source.unsplash.com/1200x600/?blog';
          }}
        />
        <div className="p-4">
          <span className="text-xs text-blue-600 font-medium">
            {post.category}
          </span>
          <h3 className="font-semibold mt-2 line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span>❤️ {post.likes || 0}</span>
            <span>💬 {post.comments || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}