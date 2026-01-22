export default function Sidebar({ recent }) {
  return (
    <aside className="space-y-6">
      {/* Recent Posts */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Recent Posts</h3>
        {recent && recent.length > 0 ? (
          recent.map(post => {
            const imageUrl = post.image
              ? `http://localhost:5001/uploads/${post.image}`
              : 'https://source.unsplash.com/60x60/?blog';

            return (
              <div key={post._id} className="flex gap-3 mb-3">
                <img
                  src={imageUrl}
                  alt={post.title}
                  className="w-14 h-14 object-cover rounded"
                  onError={(e) => {
                    e.target.src = 'https://source.unsplash.com/60x60/?blog';
                  }}
                />
                <p className="text-sm font-medium line-clamp-2">
                  {post.title}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-400">No recent posts</p>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-3">Categories</h3>
        <ul className="text-sm space-y-2 text-gray-600">
          <li key="react">⚛️ React</li>
          <li key="devops">🚀 DevOps</li>
          <li key="cloud">☁️ Cloud</li>
          <li key="backend">🖥 Backend</li>
        </ul>
      </div>
    </aside>
  );
}
