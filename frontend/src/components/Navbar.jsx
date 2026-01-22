import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                <h1 className="text-xl font-bold text-gray-800">DevNote</h1>

                <ul className="flex gap-6 text-sm font-medium text-gray-600">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>React</li>
                    <li>DevOps</li>
                    <li>Cloud</li>
                    <li>About</li>
                    {!token && (
                        <li>
                            <Link to="/login">Admin Login</Link>
                        </li>
                    )}
                    {token && (
                        <>
                            <li>
                                <Link to="/admin">Admin</Link>
                            </li>
                            <li className="cursor-pointer text-red-600" onClick={handleLogout}>
                                Logout
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
