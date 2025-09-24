import { Link } from 'react-router';
import { PlusIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary font-mono tracking-tight truncate">
            Dex-Note-Taking-App
          </h1>
          <Link to={'/create'} className="btn btn-primary btn-sm sm:btn-md">
            <PlusIcon className="size-4 sm:size-5" />
            <span className="hidden sm:inline">New Note</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
