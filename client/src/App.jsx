import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
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
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><BrowseBooks /></ProtectedRoute>} />
          <Route path="/books/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
          <Route path="/my-books" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/books" element={<AdminRoute><ManageBooks /></AdminRoute>} />
          <Route path="/admin/members" element={<AdminRoute><ManageMembers /></AdminRoute>} />
          <Route path="/admin/transactions" element={<AdminRoute><Transactions /></AdminRoute>} />
        </Routes>
      </main>
    </div>
  );
}
