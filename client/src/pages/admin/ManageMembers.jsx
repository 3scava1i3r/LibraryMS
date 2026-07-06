import { useState, useEffect } from 'react';
import api from '../../api';

export default function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (search) params.search = search;
    api.get('/users', { params }).then(r => {
      setMembers(r.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load members');
      setLoading(false);
    });
  }, [search]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setDeleteConfirm(null);
      setMembers(members.filter(m => m.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', addForm);
      setShowAdd(false);
      setAddForm({ name: '', email: '', password: '', phone: '' });
      const params = {};
      if (search) params.search = search;
      const { data } = await api.get('/users', { params });
      setMembers(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add member');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-raw text-5xl uppercase tracking-wider">Manage Members</h1>
        <button onClick={() => setShowAdd(true)} className="bg-black text-white px-4 py-2 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-white hover:text-black">
          + Add Member
        </button>
      </div>
      {error && <div className="bg-white text-[#FF0000] p-3 mb-4 text-sm border-[3px] border-[#FF0000] font-mono">{error}</div>}
      <input type="text" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full bg-[#F0F0F0] border-[3px] border-black px-4 py-2 mb-4 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
      {loading ? (
        <p className="text-center text-gray-500 py-12 font-mono">Loading members...</p>
      ) : (
      <div className="bg-white border-[3px] border-black">
        <table className="w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Name</th>
              <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Email</th>
              <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Phone</th>
              <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Joined</th>
              <th className="text-center p-4 font-mono uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {members.length === 0 ? (
              <tr><td colSpan="5" className="text-center p-8 text-gray-500 font-mono">No members found</td></tr>
            ) : members.map(m => (
              <tr key={m.id} className="hover:bg-black hover:text-white">
                <td className="p-4 font-medium">{m.name}</td>
                <td className="p-4 text-gray-500">{m.email}</td>
                <td className="p-4 text-gray-500">{m.phone || '-'}</td>
                <td className="p-4 text-gray-500">{new Date(m.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-center">
                  <button onClick={() => setDeleteConfirm(m)} className="text-[#FF0000] hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-[3px] border-black p-6 w-full max-w-sm">
            <h2 className="font-raw text-lg uppercase tracking-wider text-black mb-2">Delete Member</h2>
            <p className="text-gray-500 text-sm mb-4 font-mono">Delete "{deleteConfirm.name}"? They must have no active borrows.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 bg-[#FF0000] text-white py-2 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-black hover:text-[#FF0000]">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-white text-black py-2 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-black hover:text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-[3px] border-black p-6 w-full max-w-md">
            <h2 className="font-raw text-xl uppercase tracking-wider text-black mb-4">Add Member</h2>
            <form onSubmit={handleAddMember} className="space-y-3">
              <input type="text" placeholder="Full Name" required value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
              <input type="email" placeholder="Email" required value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
              <input type="password" placeholder="Password" required value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })}
                className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
              <input type="text" placeholder="Phone (optional)" value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                className="w-full bg-[#F0F0F0] border-[3px] border-black px-3 py-2 text-black placeholder:text-gray-500 font-mono text-[15px] focus:outline-none focus:border-[5px]" />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-black text-white py-2 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-white hover:text-black">Add Member</button>
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 bg-white text-black py-2 font-mono text-sm uppercase tracking-widest border-[3px] border-black hover:bg-black hover:text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
