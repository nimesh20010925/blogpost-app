import { useEffect, useRef, useState } from 'react';
import api from '../api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Admin() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('Joe Smith');
    const [moderator, setModerator] = useState('Joe Smith');
    const [publishDate, setPublishDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [allowComments, setAllowComments] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const editorRef = useRef(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        setLoading(true);
        try {
            const res = await api.get('/posts/all');
            setPosts(res.data || []);
        } catch (err) {
            // ignore silently for now
        } finally {
            setLoading(false);
        }
    }

    function handleImageChange(e) {
        const f = e.target.files?.[0];
        if (!f) return setImagePreview(null);
        setImageFile(f);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(f);
    }

    function execCmd(cmd, value = null) {
        document.execCommand(cmd, false, value);
        editorRef.current?.focus();
    }

    async function handleSave(e) {
        e.preventDefault();
        setError('');
        const content = editorRef.current?.innerHTML || '';

        try {
            // Build payload
            const payload = { title, author, category: moderator, excerpt: '', content, publishDate, allowComments };

            // If image selected, upload as base64 (backend must accept 'image' field) - fallback to null
            if (imageFile) {
                payload.image = imagePreview; // simple approach: send data URL
            }

            await api.post('/posts', payload);
            // reset form
            setTitle('');
            setImageFile(null);
            setImagePreview(null);
            editorRef.current.innerHTML = '';
            fetchPosts();
            alert('Post created');
        } catch (err) {
            setError(err?.response?.data?.msg || 'Create failed');
        }
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Add Blog Post</h1>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded">ADD BLOG POST</button>
                        </div>

                        <form onSubmit={handleSave} className="bg-white p-6 rounded shadow">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left: Image */}
                                <div className="col-span-1">
                                    <label className="block w-full h-64 border border-dashed rounded overflow-hidden cursor-pointer">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">SELECT IMAGE</div>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>

                                {/* Right: main fields */}
                                <div className="col-span-2">
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold mb-1">Blog Title</label>
                                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Blog Title" className="w-full border px-3 py-2 rounded" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Author</label>
                                            <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full border px-3 py-2 rounded" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Blog Moderator</label>
                                            <select value={moderator} onChange={(e) => setModerator(e.target.value)} className="w-full border px-3 py-2 rounded">
                                                <option>Joe Smith</option>
                                                <option>Jane Doe</option>
                                                <option>Admin</option>
                                            </select>
                                            <div className="text-xs text-gray-500 mt-1">Blog comments will be sent to the moderator</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Publish Date</label>
                                            <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="w-full border px-3 py-2 rounded" />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="inline-flex items-center">
                                            <input type="checkbox" checked={allowComments} onChange={(e) => setAllowComments(e.target.checked)} className="mr-2" />
                                            <span className="font-medium">Allow Comments</span>
                                        </label>
                                    </div>

                                    {/* Editor toolbar */}
                                    <div className="mb-2 flex gap-2 items-center">
                                        <button type="button" onClick={() => execCmd('bold')} className="px-2 py-1 border rounded">B</button>
                                        <button type="button" onClick={() => execCmd('italic')} className="px-2 py-1 border rounded">I</button>
                                        <button type="button" onClick={() => execCmd('underline')} className="px-2 py-1 border rounded">U</button>
                                        <button type="button" onClick={() => execCmd('insertUnorderedList')} className="px-2 py-1 border rounded">• List</button>
                                        <button type="button" onClick={() => { const url = prompt('Enter URL'); if (url) execCmd('createLink', url); }} className="px-2 py-1 border rounded">Link</button>
                                    </div>

                                    {/* Editor area */}
                                    <div ref={editorRef} className="border p-4 min-h-[200px] rounded mb-4" contentEditable suppressContentEditableWarning placeholder="Type something here..." style={{ outline: 'none' }}>
                                    </div>

                                    {error && <div className="text-red-600 mb-2">{error}</div>}

                                    <div className="flex items-center justify-between mt-6">
                                        <button type="button" className="text-gray-600 px-4 py-2 border rounded">CANCEL</button>
                                        <div className="flex items-center gap-4">
                                            <button type="button" className="px-4 py-2 border rounded flex items-center gap-2">
                                                <span className="text-lg">+</span> CREATE POST SCHEDULE FOR SOCIAL MEDIA
                                            </button>
                                            <button type="submit" className="bg-black text-white px-6 py-2 rounded">SAVE</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Posts list (simple) */}
                        <section className="mt-8 bg-white p-6 rounded shadow">
                            <h2 className="text-lg font-semibold mb-4">Existing Posts</h2>
                            {loading ? <div>Loading...</div> : (
                                <div className="space-y-3">
                                    {posts.map(p => (
                                        <div key={p._id} className="flex items-center justify-between border px-4 py-3 rounded">
                                            <div>
                                                <div className="font-semibold">{p.title}</div>
                                                <div className="text-sm text-gray-500">{p.category} • {new Date(p.publishDate || p.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="lg:col-span-1">
                        <Sidebar recent={posts.slice(0, 5)} />
                    </div>
                </div>
            </div>
        </div>
    );
}
