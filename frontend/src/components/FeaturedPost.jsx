export default function FeaturedPost({ post }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-72 object-cover"
      />
      <div className="p-5">
        <p className="text-sm text-gray-500">{post.category}</p>
        <h2 className="text-2xl font-bold mt-2">{post.title}</h2>
        <p className="text-gray-600 mt-3 line-clamp-3">
          {post.excerpt}
        </p>
      </div>
    </div>
  );
}
