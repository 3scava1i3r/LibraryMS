import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseBooks from './pages/BrowseBooks';
import BookDetail from './pages/BookDetail';
import MyBooks from './pages/MyBooks';
import Dashboard from './pages/admin/Dashboard';
import ManageBooks from './pages/admin/ManageBooks';
import ManageMembers from './pages/admin/ManageMembers';
import Transactions from './pages/admin/Transactions';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/browse" element={<ProtectedRoute><div className="max-w-7xl mx-auto px-4 py-6"><BrowseBooks /></div></ProtectedRoute>} />
        <Route path="/books/:id" element={<ProtectedRoute><div className="max-w-7xl mx-auto px-4 py-6"><BookDetail /></div></ProtectedRoute>} />
        <Route path="/my-books" element={<ProtectedRoute><div className="max-w-7xl mx-auto px-4 py-6"><MyBooks /></div></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><div className="max-w-7xl mx-auto px-4 py-6"><Dashboard /></div></AdminRoute>} />
        <Route path="/admin/books" element={<AdminRoute><div className="max-w-7xl mx-auto px-4 py-6"><ManageBooks /></div></AdminRoute>} />
        <Route path="/admin/members" element={<AdminRoute><div className="max-w-7xl mx-auto px-4 py-6"><ManageMembers /></div></AdminRoute>} />
        <Route path="/admin/transactions" element={<AdminRoute><div className="max-w-7xl mx-auto px-4 py-6"><Transactions /></div></AdminRoute>} />
      </Routes>
    </div>
  );
}
