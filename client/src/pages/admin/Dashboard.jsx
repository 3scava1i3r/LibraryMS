import { useState, useEffect } from 'react';
import api from '../../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(r => setStats(r.data)).catch(() => {});
  }, []);

  if (!stats) return <div className="text-center py-20 text-gray-500 font-mono">Loading...</div>;

  const cards = [
    { label: 'Total Books', value: stats.totalBooks },
    { label: 'Members', value: stats.totalMembers },
    { label: 'Borrowed', value: stats.borrowedBooks },
    { label: 'Overdue', value: stats.overdueBooks },
    { label: 'Returned Today', value: stats.returnedToday },
    { label: 'Transactions', value: stats.totalTransactions },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-raw text-5xl uppercase tracking-wider">Admin Dashboard</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white border-[3px] border-black p-4">
            <div className="w-3 h-3 bg-black mb-2"></div>
            <p className="text-2xl font-raw text-black">{c.value}</p>
            <p className="text-sm font-mono uppercase tracking-wider text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-[3px] border-black p-6">
          <h2 className="font-raw uppercase tracking-wider text-black mb-4">Recent Borrows</h2>
          {stats.recentBorrows.length === 0 ? (
            <p className="text-gray-500 text-sm font-mono">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {stats.recentBorrows.map(r => (
                <div key={r.id} className="flex justify-between text-sm font-mono">
                  <span className="text-black">{r.title} <span className="text-gray-500">- {r.user_name}</span></span>
                  <span className="text-gray-500 text-xs">{new Date(r.borrow_date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border-[3px] border-black p-6">
          <h2 className="font-raw uppercase tracking-wider text-black mb-4">Popular Books</h2>
          {stats.popularBooks.length === 0 ? (
            <p className="text-gray-500 text-sm font-mono">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.popularBooks.map((b, i) => (
                <div key={b.id} className="flex justify-between text-sm font-mono">
                  <span className="text-black"><span className="text-gray-500 mr-2">#{i + 1}</span>{b.title}</span>
                  <span className="text-black font-medium">{b.borrow_count} borrows</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
