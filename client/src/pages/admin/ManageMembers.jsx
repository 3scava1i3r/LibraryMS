import { useState, useEffect } from 'react';
import api from '../../api';

export default function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    api.get('/users', { params }).then(r => setMembers(r.data));
  }, [search]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this member? They must have no active borrows.')) return;
    try {
      await api.delete(`/users/${id}`);
      setMembers(members.filter(m => m.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Members</h1>
      <input type="text" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#0000FF]" />
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Joined</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {members.map(m => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{m.name}</td>
                <td className="p-4 text-gray-500">{m.email}</td>
                <td className="p-4 text-gray-500">{m.phone || '-'}</td>
                <td className="p-4 text-gray-500">{new Date(m.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan="5" className="text-center p-8 text-gray-400">No members found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
