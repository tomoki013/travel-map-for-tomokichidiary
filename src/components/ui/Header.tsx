

export function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-20 px-6 py-4 flex justify-between items-center pointer-events-none">
      <div className="pointer-events-auto">
        <h1 className="font-serif text-2xl font-bold tracking-tight">
          Tomokichi <span className="text-gray-400 font-light">Globe</span>
        </h1>
      </div>
      <nav className="pointer-events-auto flex gap-6 text-sm font-medium items-center">
        <a 
          href="https://travel.tomokichidiary.com/" 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10 text-white"
        >
          <span>← Back to Main</span>
        </a>
      </nav>
    </header>
  );
}
