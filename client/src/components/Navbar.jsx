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
    <nav className="bg-black border-b-[3px] border-black text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-raw text-xl tracking-widest uppercase">LibraryMS</Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <div className="flex gap-3 text-sm uppercase tracking-wider">
                    <Link to="/admin" className="hover:underline">Dashboard</Link>
                    <Link to="/admin/books" className="hover:underline">Books</Link>
                    <Link to="/admin/members" className="hover:underline">Members</Link>
                    <Link to="/admin/transactions" className="hover:underline">Transactions</Link>
                  </div>
                )}
                {user.role === 'member' && (
                  <div className="flex gap-3 text-sm uppercase tracking-wider">
                    <Link to="/browse" className="hover:underline">Browse</Link>
                    <Link to="/my-books" className="hover:underline">My Books</Link>
                  </div>
                )}
                <span className="text-sm text-gray-400 ml-4">{user.name}</span>
                <button onClick={handleLogout} className="bg-white text-black px-3 py-1 font-mono text-sm uppercase tracking-wider border-[3px] border-black hover:bg-black hover:text-white">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 text-sm uppercase tracking-wider">
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
