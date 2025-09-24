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
      border-t-4 border-solid border-[#66d9e8] h-full"
    >
      <div className="card-body p-3 sm:p-4">
        <h3 className="card-title text-base sm:text-lg line-clamp-2">
          {note.title}
        </h3>
        <p className="text-base-content/70 line-clamp-3 text-xs sm:text-sm">
          {note.content}
        </p>
        <div className="card-actions justify-between items-center mt-3 sm:mt-4">
          <span className="text-xs sm:text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className="flex items-center gap-1 sm:gap-2">
            <PenSquareIcon className="size-3 sm:size-4 text-base-content/60" />
            <button
              className="btn btn-ghost btn-xs text-error p-1 sm:p-2"
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
