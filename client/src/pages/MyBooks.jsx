import { useState, useEffect } from 'react';
import api from '../api';

export default function MyBooks() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/borrow/my').then(r => {
      setRecords(r.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load records');
      setLoading(false);
    });
  }, []);

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  const statusChip = (r) => {
    if (r.status === 'returned') return <span className="text-xs font-mono uppercase tracking-wider border-[2px] border-[#008000] text-[#008000] px-2 py-1">Returned</span>;
    if (isOverdue(r.due_date)) return <span className="text-xs font-mono uppercase tracking-wider border-[2px] border-[#FF0000] text-[#FF0000] px-2 py-1">Overdue</span>;
    return <span className="text-xs font-mono uppercase tracking-wider border-[2px] border-[#FFA500] text-[#FFA500] px-2 py-1">Borrowed</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-raw text-5xl uppercase tracking-wider">My Borrowed Books</h1>
      </div>
      {loading ? (
        <p className="text-center text-gray-500 py-12 font-mono">Loading records...</p>
      ) : error ? (
        <p className="text-center text-[#FF0000] py-12 font-mono">{error}</p>
      ) : records.length === 0 ? (
        <p className="text-center text-gray-500 py-12 font-mono">No borrowing history yet</p>
      ) : (
        <div className="bg-white border-[3px] border-black">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Book</th>
                <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Author</th>
                <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Borrowed</th>
                <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Due Date</th>
                <th className="text-left p-4 font-mono uppercase tracking-wider text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-black hover:text-white">
                  <td className="p-4 font-medium">{r.title}</td>
                  <td className="p-4 text-gray-500">{r.author}</td>
                  <td className="p-4 text-gray-500">{new Date(r.borrow_date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={isOverdue(r.due_date) && r.status === 'borrowed' ? 'text-[#FF0000] font-medium' : 'text-gray-500'}>
                      {new Date(r.due_date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">{statusChip(r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
