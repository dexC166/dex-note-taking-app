import { NotebookIcon } from 'lucide-react';
import { Link } from 'react-router';

const NotesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-16 space-y-4 sm:space-y-6 max-w-md mx-auto text-center px-4">
      <div className="bg-primary/10 rounded-full p-6 sm:p-8">
        <NotebookIcon className="size-8 sm:size-10 text-primary" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold">No notes yet</h3>
      <p className="text-base-content/70 text-sm sm:text-base">
        Ready to organize your thoughts? Create your first note to get started
        on your journey.
      </p>
      <Link to="/create" className="btn btn-primary btn-sm sm:btn-md">
        Create Your First Note
      </Link>
    </div>
  );
};
export default NotesNotFound;
