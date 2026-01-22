export default function Sidebar({ recent }) {
  return (
    <aside className="space-y-6">
      {/* Recent Posts */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Recent Posts</h3>
        {recent.map(post => (
          <div key={post._id} className="flex gap-3 mb-3">
            <img
              src={post.image}
              className="w-14 h-14 object-cover rounded"
            />
            <p className="text-sm font-medium line-clamp-2">
              {post.title}
            </p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-3">Categories</h3>
        <ul className="text-sm space-y-2 text-gray-600">
          <li>⚛️ React</li>
          <li>🚀 DevOps</li>
          <li>☁️ Cloud</li>
          <li>🖥 Backend</li>
        </ul>
      </div>
    </aside>
  );
}
