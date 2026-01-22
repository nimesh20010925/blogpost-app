import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/admin/login', { username, password });
            const { token } = res.data;
            localStorage.setItem('token', token);
            navigate('/admin');
        } catch (err) {
            setError(err?.response?.data?.msg || 'Login failed');
        }
    }

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Username</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded" />
                </div>

                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded" />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded">Sign In</button>
                </div>
            </form>
        </div>
    );
}
