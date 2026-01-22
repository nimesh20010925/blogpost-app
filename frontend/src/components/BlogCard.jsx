export default function BlogCard({ post }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <img
        src={post.image}
        className="h-44 w-full object-cover"
      />
      <div className="p-4">
        <span className="text-xs text-blue-600 font-medium">
          {post.category}
        </span>
        <h3 className="font-semibold mt-2 line-clamp-2">
          {post.title}
        </h3>
      </div>
    </div>
  );
}
