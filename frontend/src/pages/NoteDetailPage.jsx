import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from 'lucide-react';

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        toast.error('Failed to fetch the note');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success('Note deleted');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error('Please add a title or content');
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success('Note updated successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <Link to="/" className="btn btn-ghost btn-sm sm:btn-md">
              <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Back to Notes</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline btn-sm sm:btn-md"
            >
              <Trash2Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Delete Note</span>
              <span className="sm:hidden">Delete</span>
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body p-3 sm:p-6">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-sm sm:text-base">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered input-sm sm:input-md"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-sm sm:text-base">
                    Content
                  </span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-24 sm:h-32 text-sm sm:text-base"
                  value={note.content}
                  onChange={(e) =>
                    setNote({ ...note, content: e.target.value })
                  }
                />
              </div>

              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary btn-sm sm:btn-md"
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NoteDetailPage;
