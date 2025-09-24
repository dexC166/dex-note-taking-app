import { Link } from 'react-router';
import { PlusIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between min-w-0">
          <h1 className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold text-primary font-mono tracking-tight truncate flex-1 min-w-0 mr-2">
            Dex-Note-Taking-App
          </h1>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Link
              to={'/create'}
              className="btn btn-primary btn-xs sm:btn-sm md:btn-md"
            >
              <PlusIcon className="size-3 sm:size-4 md:size-5" />
              <span className="hidden md:inline">New Note</span>
              <span className="hidden sm:inline md:hidden">New</span>
              <span className="sm:hidden">+</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
