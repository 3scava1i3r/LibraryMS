export default function Footer() {
  return (
    <footer className="border-t-[3px] border-black py-4">
      <p className="text-center font-mono text-xs uppercase tracking-widest text-gray-500">
        Made by HT &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
