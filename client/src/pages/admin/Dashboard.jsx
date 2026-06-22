import { useState, useEffect } from 'react';
import api from '../../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.get('/dashboard').then(r => setStats(r.data)); }, []);

  if (!stats) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  const cards = [
    { label: 'Total Books', value: stats.totalBooks, color: 'bg-blue-500' },
    { label: 'Members', value: stats.totalMembers, color: 'bg-green-500' },
    { label: 'Borrowed', value: stats.borrowedBooks, color: 'bg-yellow-500' },
    { label: 'Overdue', value: stats.overdueBooks, color: 'bg-red-500' },
    { label: 'Returned Today', value: stats.returnedToday, color: 'bg-teal-500' },
    { label: 'Transactions', value: stats.totalTransactions, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className={`w-3 h-3 rounded-full ${c.color} mb-2`}></div>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-semibold mb-4">Recent Borrows</h2>
          {stats.recentBorrows.length === 0 ? (
            <p className="text-gray-400 text-sm">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {stats.recentBorrows.map(r => (
                <div key={r.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{r.title} <span className="text-gray-400">- {r.user_name}</span></span>
                  <span className="text-gray-400 text-xs">{new Date(r.borrow_date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="font-semibold mb-4">Popular Books</h2>
          {stats.popularBooks.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.popularBooks.map((b, i) => (
                <div key={b.id} className="flex justify-between text-sm">
                  <span><span className="text-gray-400 mr-2">#{i + 1}</span>{b.title}</span>
                  <span className="text-indigo-600 font-medium">{b.borrow_count} borrows</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
