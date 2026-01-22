import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [liked, setLiked] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [id]);

    async function fetchPost() {
        try {
            const res = await api.get(`/posts/${id}`);
            setPost(res.data);
        } catch (err) {
            setError('Failed to load post');
        } finally {
            setLoading(false);
        }
    }

    async function fetchComments() {
        try {
            const res = await api.get(`/comments/${id}`);
            setComments(res.data || []);
        } catch (err) {
            console.error('Failed to load comments:', err);
        }
    }

    async function handleLike() {
        try {
            const res = await api.post(`/posts/${id}/like`);
            setPost(res.data);
            setLiked(true);
            setTimeout(() => setLiked(false), 500);
        } catch (err) {
            console.error('Failed to like post:', err);
        }
    }

    async function handleCommentSubmit(e) {
        e.preventDefault();
        setError('');

        if (!name.trim() || !email.trim() || !message.trim()) {
            setError('All fields are required');
            return;
        }

        try {
            await api.post(`/comments/${id}`, { name, email, message });
            setName('');
            setEmail('');
            setMessage('');
            fetchComments();
        } catch (err) {
            setError(err?.response?.data?.msg || 'Failed to post comment');
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center h-screen">
                    <p className="text-gray-500">Loading post...</p>
                </div>
            </>
        );
    }

    if (!post) {
        return (
            <>
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 mt-8">
                    <p className="text-red-500">Post not found</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:underline mt-4"
                    >
                        Back to Home
                    </button>
                </div>
            </>
        );
    }

    const imageUrl = post.image
        ? `http://localhost:5001/uploads/${post.image}`
        : 'https://source.unsplash.com/1200x600/?blog';

    return (
        <>
            <Navbar />
            <article className="max-w-4xl mx-auto px-6 mt-8 pb-12">
                {/* Post Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-sm text-blue-600 font-semibold">{post.category}</span>
                            <h1 className="text-4xl font-bold mt-2">{post.title}</h1>
                            <p className="text-gray-500 mt-2">By {post.author}</p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Featured Image */}
                {post.image && (
                    <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-96 object-cover rounded-lg mb-8"
                    />
                )}

                {/* Post Content */}
                <div className="prose prose-lg max-w-none mb-8">
                    <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>

                {/* Like Section */}
                <div className="border-t border-b py-4 mb-8 flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition ${liked
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                            }`}
                    >
                        <span className="text-xl">❤️</span>
                        <span>{post.likes || 0} Likes</span>
                    </button>
                </div>

                {/* Comments Section */}
                {post.allowComments && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Comments</h2>

                        {/* Add Comment Form */}
                        <div className="bg-gray-50 p-6 rounded-lg mb-8">
                            <h3 className="font-semibold mb-4">Leave a Comment</h3>
                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                            <form onSubmit={handleCommentSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="border rounded px-4 py-2"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="border rounded px-4 py-2"
                                    />
                                </div>
                                <textarea
                                    placeholder="Your Comment"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows="5"
                                    className="w-full border rounded px-4 py-2 mb-4"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                >
                                    Post Comment
                                </button>
                            </form>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-6">
                            {comments.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment._id} className="border-l-4 border-blue-600 pl-4 py-4">
                                        <div className="flex justify-between">
                                            <div>
                                                <h4 className="font-semibold">{comment.name}</h4>
                                                <p className="text-sm text-gray-500">{comment.email}</p>
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <p className="text-gray-700 mt-2">{comment.message}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                            )}
                        </div>
                    </div>
                )}
            </article>
        </>
    );
}
