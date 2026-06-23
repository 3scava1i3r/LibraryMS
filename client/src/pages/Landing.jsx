import { useRef } from 'react';
import { Link } from 'react-router-dom';
import TextCursorProximity from '../components/TextCursorProximity';

const ASCII = ["\u270E", "\u2710", "\u2711", "\u2711"];

export default function Landing() {
  const containerRef = useRef(null);

  return (
    <div className="min-h-screen flex flex-col" ref={containerRef}>
      <div
        className="relative flex-1 w-full cursor-pointer overflow-hidden flex justify-start items-start text-white"
        style={{
          backgroundColor: "#0000FF",
        }}
      >
        <div className="flex flex-col justify-center uppercase leading-none pt-4 pl-6">
          <TextCursorProximity
            label="DIGITAL"
            className="text-3xl will-change-transform sm:text-6xl md:text-6xl lg:text-7xl"
            styles={{
              transform: {
                from: "scale(1)",
                to: "scale(1.4)",
              },
              color: {
                from: "#FFFFFF",
                to: "#FF4444",
              },
            }}
            falloff="gaussian"
            radius={100}
            containerRef={containerRef}
          />
          <TextCursorProximity
            label="LIBRARY"
            className="leading-none text-3xl will-change-transform sm:text-6xl md:text-6xl lg:text-7xl"
            styles={{
              transform: {
                from: "scale(1)",
                to: "scale(1.4)",
              },
              color: {
                from: "#FFFFFF",
                to: "#FF4444",
              },
            }}
            falloff="gaussian"
            radius={100}
            containerRef={containerRef}
          />
        </div>

        <TextCursorProximity
          className="absolute top-6 right-6 hidden sm:block text-xs"
          label="15/01/2025"
          styles={{
            transform: {
              from: "scale(1)",
              to: "scale(1.4)",
            },
            color: {
              from: "#FFFFFF",
              to: "#FF4444",
            },
          }}
          falloff="linear"
          radius={10}
          containerRef={containerRef}
        />

        <div className="absolute bottom-2 flex w-full items-center justify-between px-6">
          <div className="flex gap-6">
            {ASCII.map((pencil, i) => (
              <span key={i} className="text-2xl opacity-80" style={{ fontFamily: "serif" }}>
                {pencil}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="text-xs bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition">
              Sign In
            </Link>
            <Link to="/register" className="text-xs border border-white/30 px-3 py-1 rounded hover:bg-white/20 transition">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
