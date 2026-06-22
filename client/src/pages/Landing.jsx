import { useRef } from 'react';
import { Link } from 'react-router-dom';
import TextCursorProximity from '../components/TextCursorProximity';

export default function Landing() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.1),transparent_50%)]" />

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          <TextCursorProximity
            label="LibraryMS"
            containerRef={containerRef}
            radius={150}
            falloff="gaussian"
            styles={{
              color: { from: '#c7d2fe', to: '#fff' },
              scale: { from: 1, to: 1.15 },
            }}
          />
        </h1>

        <p className="text-xl md:text-2xl text-indigo-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          <TextCursorProximity
            label="Manage your library. Discover great books."
            containerRef={containerRef}
            radius={120}
            falloff="exponential"
            styles={{
              color: { from: '#a5b4fc', to: '#fff' },
            }}
          />
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="bg-white text-indigo-900 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white hover:text-indigo-900 hover:scale-105 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
          <div className="text-3xl mb-3">📚</div>
          <h3 className="text-white font-semibold mb-2">Browse Books</h3>
          <p className="text-indigo-200 text-sm">Explore a curated collection across every genre.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="text-white font-semibold mb-2">Track Borrowing</h3>
          <p className="text-indigo-200 text-sm">Borrow and return with ease. Always know what's due.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
          <div className="text-3xl mb-3">⚙️</div>
          <h3 className="text-white font-semibold mb-2">Admin Tools</h3>
          <p className="text-indigo-200 text-sm">Manage members, inventory, and transactions in one place.</p>
        </div>
      </div>
    </div>
  );
}
