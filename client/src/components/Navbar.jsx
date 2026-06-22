import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">📚 LibraryMS</Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <div className="flex gap-3 text-sm">
                    <Link to="/admin" className="hover:text-indigo-200">Dashboard</Link>
                    <Link to="/admin/books" className="hover:text-indigo-200">Books</Link>
                    <Link to="/admin/members" className="hover:text-indigo-200">Members</Link>
                    <Link to="/admin/transactions" className="hover:text-indigo-200">Transactions</Link>
                  </div>
                )}
                {user.role === 'member' && (
                  <div className="flex gap-3 text-sm">
                    <Link to="/browse" className="hover:text-indigo-200">Browse</Link>
                    <Link to="/my-books" className="hover:text-indigo-200">My Books</Link>
                  </div>
                )}
                <span className="text-sm text-indigo-200 ml-4">{user.name}</span>
                <button onClick={handleLogout} className="text-sm bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-500">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 text-sm">
                <Link to="/login" className="hover:text-indigo-200">Login</Link>
                <Link to="/register" className="hover:text-indigo-200">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
