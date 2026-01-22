import { useEffect, useRef, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { 
  Plus, 
  Image as ImageIcon, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Video, 
  Undo, 
  Redo, 
  Code,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  Folder,
  X,
  Check,
  Save,
  ChevronDown,
  Hash,
  Grid
} from 'lucide-react';

export default function Admin() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    
    // Form states
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('Joe Smith');
    const [moderator, setModerator] = useState('Joe Smith');
    const [publishDate, setPublishDate] = useState('2023-02-22');
    const [allowComments, setAllowComments] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newTag, setNewTag] = useState('');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showTagModal, setShowTagModal] = useState(false);
    const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'categories', 'tags'
    
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);

    // Fetch initial data
    useEffect(() => {
        fetchPosts();
        fetchCategories();
        fetchTags();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/posts/all');
            setPosts(response.data);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await api.get('/tags');
            setTags(response.data);
        } catch (err) {
            console.error('Error fetching tags:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        
        if (!content.trim()) {
            setError('Content is required');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('author', author);
            formData.append('moderator', moderator);
            formData.append('publishDate', publishDate);
            formData.append('allowComments', allowComments);
            formData.append('content', content);
            formData.append('category', selectedCategory);
            
            // Add selected tags
            selectedTags.forEach(tag => {
                formData.append('tags[]', tag);
            });
            
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            // Reset form
            setTitle('');
            setAuthor('Joe Smith');
            setModerator('Joe Smith');
            setPublishDate('2023-02-22');
            setAllowComments(true);
            setImagePreview(null);
            setImageFile(null);
            setContent('');
            setSelectedCategory('');
            setSelectedTags([]);
            if (editorRef.current) {
                editorRef.current.innerHTML = 'Type something';
                editorRef.current.classList.add('italic');
                editorRef.current.classList.add('text-gray-400');
            }
            
            // Refresh posts list
            fetchPosts();
            
            alert('Post created successfully!');
            
        } catch (err) {
            console.error('Error creating post:', err);
            setError('Failed to create post');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await api.delete(`/posts/${postId}`);
            fetchPosts(); // Refresh the posts list
            alert('Post deleted successfully!');
        } catch (err) {
            console.error('Error deleting post:', err);
            setError('Failed to delete post');
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.trim()) {
            setError('Category name is required');
            return;
        }

        try {
            const response = await api.post('/categories', { name: newCategory });
            setCategories([...categories, response.data]);
            setNewCategory('');
            setShowCategoryModal(false);
            alert('Category created successfully!');
        } catch (err) {
            console.error('Error creating category:', err);
            setError('Failed to create category');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            await api.delete(`/categories/${categoryId}`);
            setCategories(categories.filter(c => c._id !== categoryId));
            alert('Category deleted successfully!');
        } catch (err) {
            console.error('Error deleting category:', err);
            setError('Failed to delete category');
        }
    };

    const handleCreateTag = async () => {
        if (!newTag.trim()) {
            setError('Tag name is required');
            return;
        }

        try {
            const response = await api.post('/tags', { name: newTag });
            setTags([...tags, response.data]);
            setNewTag('');
            setShowTagModal(false);
            alert('Tag created successfully!');
        } catch (err) {
            console.error('Error creating tag:', err);
            setError('Failed to create tag');
        }
    };

    const handleDeleteTag = async (tagId) => {
        if (!window.confirm('Are you sure you want to delete this tag?')) {
            return;
        }

        try {
            await api.delete(`/tags/${tagId}`);
            setTags(tags.filter(t => t._id !== tagId));
            alert('Tag deleted successfully!');
        } catch (err) {
            console.error('Error deleting tag:', err);
            setError('Failed to delete tag');
        }
    };

    const handleTagSelect = (tagId) => {
        if (selectedTags.includes(tagId)) {
            setSelectedTags(selectedTags.filter(id => id !== tagId));
        } else {
            setSelectedTags([...selectedTags, tagId]);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const triggerFileInput = () => fileInputRef.current.click();

    function handleImageChange(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        
        // Validate file type
        if (!f.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }
        
        // Validate file size (max 5MB)
        if (f.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }
        
        setImageFile(f);
        setError('');
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(f);
    }

    function execCmd(cmd, value = null) {
        document.execCommand(cmd, false, value);
        editorRef.current?.focus();
        updateContent();
    }

    function updateContent() {
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
    }

    const handleEditorInput = () => {
        updateContent();
    };

    const handleUndo = () => {
        document.execCommand('undo', false, null);
        editorRef.current?.focus();
        updateContent();
    };

    const handleRedo = () => {
        document.execCommand('redo', false, null);
        editorRef.current?.focus();
        updateContent();
    };

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Render Content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'categories':
                return renderCategoriesTab();
            case 'tags':
                return renderTagsTab();
            case 'posts':
            default:
                return renderPostsTab();
        }
    };

    const renderCategoriesTab = () => (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
                <button 
                    onClick={() => setShowCategoryModal(true)}
                    className="bg-[#3b608a] text-white px-4 py-2 rounded flex items-center gap-2 uppercase text-sm font-semibold tracking-wide hover:bg-[#2d4a6d] transition-colors"
                >
                    <Plus size={16} />
                    Add New Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div key={category._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                            <div className="flex gap-2">
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                    {category.postCount || 0} posts
                                </span>
                                <button 
                                    onClick={() => handleDeleteCategory(category._id)}
                                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                        <p className="text-xs text-gray-400 mt-2">
                            Created: {formatDate(category.createdAt)}
                        </p>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-12">
                    <Folder size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No categories yet</h3>
                    <p className="text-gray-500 mb-6">Create your first category to organize posts!</p>
                </div>
            )}
        </div>
    );

    const renderTagsTab = () => (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Tags</h2>
                <button 
                    onClick={() => setShowTagModal(true)}
                    className="bg-[#3b608a] text-white px-4 py-2 rounded flex items-center gap-2 uppercase text-sm font-semibold tracking-wide hover:bg-[#2d4a6d] transition-colors"
                >
                    <Plus size={16} />
                    Add New Tag
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                    <div 
                        key={tag._id} 
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg"
                    >
                        <Hash size={14} />
                        <span className="font-medium">{tag.name}</span>
                        <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                            {tag.postCount || 0}
                        </span>
                        <button 
                            onClick={() => handleDeleteTag(tag._id)}
                            className="text-red-600 hover:text-red-800 ml-2"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {tags.length === 0 && (
                <div className="text-center py-12">
                    <Tag size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No tags yet</h3>
                    <p className="text-gray-500 mb-6">Create tags to help organize and search posts!</p>
                </div>
            )}
        </div>
    );

    const renderPostsTab = () => {
        if (showForm) {
            return renderPostForm();
        } else {
            return renderPostsTable();
        }
    };

    const renderPostForm = () => (
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Column: Image Selection */}
                <div className="md:col-span-4">
                    <div 
                        onClick={triggerFileInput}
                        className="aspect-square bg-[#e5e5e5] rounded flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-transparent hover:border-gray-400 transition-all overflow-hidden"
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <ImageIcon size={64} className="text-gray-400 mb-2" />
                                <span className="text-gray-500 uppercase font-bold text-sm">Select Image</span>
                            </>
                        )}
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        className="hidden" 
                        accept="image/*" 
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Recommended: 1200x800px, max 5MB
                    </p>
                </div>

                {/* Right Column: Fields */}
                <div className="md:col-span-8 space-y-6">
                    {/* Blog Title */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-lg">Blog Title *</label>
                        <input 
                            type="text"
                            placeholder="Enter Blog Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border-gray-300 border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* Category and Tags Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category Selection */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-gray-700 font-bold">Category *</label>
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryModal(true)}
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    <Plus size={14} />
                                    Add New
                                </button>
                            </div>
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full border p-2 rounded bg-white"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tags Selection */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-gray-700 font-bold">Tags</label>
                                <button
                                    type="button"
                                    onClick={() => setShowTagModal(true)}
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    <Plus size={14} />
                                    Add New
                                </button>
                            </div>
                            <div className="border rounded p-2 min-h-[42px]">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedTags.map(tagId => {
                                        const tag = tags.find(t => t._id === tagId);
                                        return tag ? (
                                            <span 
                                                key={tagId}
                                                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                                            >
                                                {tag.name}
                                                <button 
                                                    type="button"
                                                    onClick={() => handleTagSelect(tagId)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                                <div className="relative">
                                    <select 
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                handleTagSelect(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                        className="w-full p-1 border-none focus:outline-none focus:ring-0"
                                    >
                                        <option value="">Select tags...</option>
                                        {tags.filter(tag => !selectedTags.includes(tag._id)).map((tag) => (
                                            <option key={tag._id} value={tag._id}>
                                                {tag.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Author, Moderator, Date Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-1">Author</label>
                            <input 
                                value={author} 
                                onChange={e => setAuthor(e.target.value)} 
                                className="w-full border p-2 rounded" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-1">Blog Moderator</label>
                            <select 
                                value={moderator} 
                                onChange={e => setModerator(e.target.value)}
                                className="w-full border p-2 rounded bg-white"
                            >
                                <option>Joe Smith</option>
                                <option>Jane Doe</option>
                                <option>John Doe</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Blog comments will be sent to the moderator</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-1">Publish Date</label>
                            <input 
                                type="date" 
                                value={formatDateForInput(publishDate)} 
                                onChange={e => setPublishDate(e.target.value)} 
                                className="w-full border p-2 rounded" 
                            />
                        </div>
                    </div>

                    {/* Allow Comments */}
                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="comments" 
                            checked={allowComments} 
                            onChange={e => setAllowComments(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="comments" className="text-gray-800 font-bold text-lg">Allow Comments</label>
                    </div>

                    {/* WYSIWYG Editor */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-lg">Content *</label>
                        <div className="border rounded overflow-hidden">
                            {/* Toolbar */}
                            <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1 items-center text-gray-600">
                                <button type="button" onClick={() => execCmd('bold')} className="p-1 hover:bg-gray-200 rounded"><Bold size={18} /></button>
                                <button type="button" onClick={() => execCmd('italic')} className="p-1 hover:bg-gray-200 rounded"><Italic size={18} /></button>
                                <button type="button" onClick={() => execCmd('underline')} className="p-1 hover:bg-gray-200 rounded"><Underline size={18} /></button>
                                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-1 hover:bg-gray-200 rounded"><List size={18} /></button>
                                <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-1 hover:bg-gray-200 rounded"><ListOrdered size={18} /></button>
                                <button type="button" onClick={() => execCmd('formatBlock', 'blockquote')} className="p-1 hover:bg-gray-200 rounded"><Quote size={18} /></button>
                                <button type="button" onClick={handleUndo} className="p-1 hover:bg-gray-200 rounded ml-auto"><Undo size={18} /></button>
                                <button type="button" onClick={handleRedo} className="p-1 hover:bg-gray-200 rounded"><Redo size={18} /></button>
                                <button type="button" className="p-1 hover:bg-gray-200 rounded"><Code size={18} /></button>
                            </div>
                            {/* Editable Area */}
                            <div 
                                ref={editorRef}
                                contentEditable 
                                className="min-h-[200px] p-4 outline-none text-gray-800"
                                onInput={handleEditorInput}
                                onFocus={(e) => { 
                                    if(e.target.innerText === 'Type something') {
                                        e.target.innerText = '';
                                        e.target.classList.remove('italic');
                                        e.target.classList.remove('text-gray-400');
                                    }
                                }}
                                onBlur={(e) => {
                                    if(e.target.innerText.trim() === '') {
                                        e.target.innerText = 'Type something';
                                        e.target.classList.add('italic');
                                        e.target.classList.add('text-gray-400');
                                    }
                                }}
                                suppressContentEditableWarning={true}
                            >
                                Type something
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">* Required field</p>
                    </div>
                </div>
            </form>

            {/* Footer Actions */}
            <div className="mt-12 flex flex-col items-center gap-6">
                <button 
                    type="button"
                    className="flex items-center gap-3 text-gray-800 font-black text-2xl uppercase hover:text-blue-600 transition-colors"
                >
                    <span className="bg-[#555] text-white rounded-full p-1 hover:bg-blue-600 transition-colors">
                        <Plus size={24} />
                    </span>
                    Create Post Schedule for Social Media
                </button>

                <div className="flex gap-4">
                    <button 
                        type="button"
                        onClick={() => {
                            // Reset form
                            setTitle('');
                            setAuthor('Joe Smith');
                            setModerator('Joe Smith');
                            setPublishDate('2023-02-22');
                            setAllowComments(true);
                            setImagePreview(null);
                            setImageFile(null);
                            setContent('');
                            setSelectedCategory('');
                            setSelectedTags([]);
                            setError('');
                            if (editorRef.current) {
                                editorRef.current.innerHTML = 'Type something';
                                editorRef.current.classList.add('italic');
                                editorRef.current.classList.add('text-gray-400');
                            }
                        }}
                        className="bg-[#ccc] text-white px-10 py-2 rounded font-bold uppercase tracking-wider hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-[#333] text-white px-10 py-2 rounded font-bold uppercase tracking-wider hover:bg-black transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );

    const renderPostsTable = () => (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">All Blog Posts</h2>
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-[#3b608a] text-white px-4 py-2 rounded flex items-center gap-2 uppercase text-sm font-semibold tracking-wide hover:bg-[#2d4a6d] transition-colors"
                >
                    <Plus size={16} />
                    Add New Post
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3b608a]"></div>
                    <p className="mt-4 text-gray-600">Loading posts...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12">
                    <Folder size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-6">Get started by creating your first blog post!</p>
                    <button 
                        onClick={() => setShowForm(true)}
                        className="bg-[#3b608a] text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto hover:bg-[#2d4a6d] transition-colors"
                    >
                        <Plus size={20} />
                        Create Your First Post
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Post
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category & Tags
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Author
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Publish Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {posts.map((post) => (
                                <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {post.image ? (
                                                    <img 
                                                        className="h-10 w-10 rounded object-cover" 
                                                        src={`http://localhost:5000/uploads/${post.image}`} 
                                                        alt={post.title} 
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                                                        <ImageIcon size={20} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {post.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {truncateText(post.content)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            {post.category && (
                                                <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                                    {post.category.name || post.category}
                                                </span>
                                            )}
                                            <div className="flex flex-wrap gap-1">
                                                {post.tags && post.tags.map((tag, index) => (
                                                    <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                        {tag.name || tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <User size={16} className="text-gray-400 mr-2" />
                                            <div className="text-sm text-gray-900">{post.author}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Calendar size={16} className="text-gray-400 mr-2" />
                                            <div className="text-sm text-gray-900">{formatDate(post.publishDate)}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {post.status === 'published' ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                title="View Post"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button 
                                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                                title="Edit Post"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeletePost(post._id)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                title="Delete Post"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Table Summary */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{posts.length}</span> posts
                            </p>
                            <div className="flex items-center gap-2">
                                <Tag size={16} className="text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {posts.filter(p => p.status === 'published').length} published, 
                                    {' '}{posts.filter(p => p.status === 'draft').length} drafts
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar />
            
            <div className="max-w-7xl mx-auto mt-6 px-4">
                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button 
                        onClick={() => {
                            setActiveTab('posts');
                            setShowForm(true);
                        }}
                        className={`px-4 py-2 rounded flex items-center gap-2 uppercase text-sm font-semibold tracking-wide ${activeTab === 'posts' && showForm ? 'bg-[#3b608a] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        <Plus size={16} />
                        Add New Post
                    </button>
                    <button 
                        onClick={() => {
                            setActiveTab('posts');
                            setShowForm(false);
                        }}
                        className={`px-4 py-2 rounded flex items-center gap-2 uppercase text-sm font-semibold tracking-wide ${activeTab === 'posts' && !showForm ? 'bg-[#3b608a] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        View All Posts ({posts.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('categories')}
                        className={`px-4 py-2 rounded flex items-center gap-2 uppercase text-sm font-semibold tracking-wide ${activeTab === 'categories' ? 'bg-[#3b608a] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        <Grid size={16} />
                        Categories ({categories.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('tags')}
                        className={`px-4 py-2 rounded flex items-center gap-2 uppercase text-sm font-semibold tracking-wide ${activeTab === 'tags' ? 'bg-[#3b608a] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        <Hash size={16} />
                        Tags ({tags.length})
                    </button>
                </div>

                {/* Render Active Content */}
                {renderContent()}

                {/* Category Creation Modal */}
                {showCategoryModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Create New Category</h3>
                                <button 
                                    onClick={() => setShowCategoryModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Enter category name"
                                className="w-full border p-3 rounded mb-4"
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowCategoryModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateCategory}
                                    className="bg-[#3b608a] text-white px-4 py-2 rounded hover:bg-[#2d4a6d]"
                                >
                                    Create Category
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tag Creation Modal */}
                {showTagModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Create New Tag</h3>
                                <button 
                                    onClick={() => setShowTagModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Enter tag name"
                                className="w-full border p-3 rounded mb-4"
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowTagModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateTag}
                                    className="bg-[#3b608a] text-white px-4 py-2 rounded hover:bg-[#2d4a6d]"
                                >
                                    Create Tag
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}