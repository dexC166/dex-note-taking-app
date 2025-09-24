import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router';
import { formatDate } from '../lib/utils';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const NoteCard = ({ note, setNotes }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault(); // get rid of the navigation behaviour

    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id)); // get rid of the deleted one
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  return (
    <Link
      to={`/note/${note._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-t-4 border-solid border-[#66d9e8] h-full w-full overflow-hidden"
    >
      <div className="card-body p-2 sm:p-3 md:p-4 w-full">
        <h3 className="card-title text-base-content text-sm sm:text-base line-clamp-2 break-words">
          {note.title}
        </h3>
        <p className="text-base-content/70 line-clamp-3 text-xs sm:text-sm break-words">
          {note.content}
        </p>
        <div className="card-actions justify-between items-center mt-2 sm:mt-3 md:mt-4 w-full">
          <span className="text-xs sm:text-sm text-base-content/60 truncate flex-1 min-w-0 mr-2">
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <PenSquareIcon className="size-3 sm:size-4" />
            <button
              className="btn btn-ghost btn-xs text-error p-1"
              onClick={(e) => handleDelete(e, note._id)}
            >
              <Trash2Icon className="size-3 sm:size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default NoteCard;
