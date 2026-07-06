import { useRef } from 'react';
import { Link } from 'react-router-dom';
import TextCursorProximity from '../components/TextCursorProximity';

export default function Landing() {
  const containerRef = useRef(null);

  const tcpStyles = {
    color: { from: '#000000', to: '#0000FF' },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div
        ref={containerRef}
        className="relative flex-1 w-full flex flex-col justify-center items-center cursor-default overflow-hidden bg-white text-black"
      >
        <TextCursorProximity
          label="DIGITAL"
          styles={tcpStyles}
          containerRef={containerRef}
          radius={150}
          falloff="exponential"
          className="font-raw text-7xl sm:text-8xl uppercase tracking-wider leading-none"
        />
        <TextCursorProximity
          label="LIBRARY"
          styles={tcpStyles}
          containerRef={containerRef}
          radius={150}
          falloff="exponential"
          className="font-raw text-7xl sm:text-8xl uppercase tracking-wider leading-none mt-2"
        />
        <p className="font-mono text-sm mt-8 uppercase tracking-widest text-gray-600">
          {new Date().toLocaleDateString()}
        </p>
        <div className="flex gap-4 mt-10">
          <Link
            to="/login"
            className="px-6 py-3 font-mono text-sm uppercase tracking-widest border-[3px] bg-black text-white border-black hover:bg-white hover:text-black"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 font-mono text-sm uppercase tracking-widest border-[3px] bg-transparent text-black border-black hover:bg-black hover:text-white"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
