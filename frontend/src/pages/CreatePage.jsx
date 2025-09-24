import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';
import api from '../lib/axios';

const CreatePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/notes', {
        title,
        content,
      });

      toast.success('Note created successfully!');
      navigate('/');
    } catch (error) {
      if (error.response.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: '💀',
        });
      } else {
        toast.error('Failed to create note');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 w-full overflow-x-hidden">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 w-full max-w-full">
        <div className="max-w-2xl mx-auto w-full">
          <Link
            to={'/'}
            className="btn btn-ghost btn-sm sm:btn-md mb-4 sm:mb-6"
          >
            <ArrowLeftIcon className="size-4 sm:size-5" />
            <span className="hidden sm:inline">Back to Notes</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="card bg-base-100 w-full">
            <div className="card-body p-3 sm:p-6 w-full">
              <h2 className="card-title text-xl sm:text-2xl mb-4 break-words">
                Create New Note
              </h2>
              <form onSubmit={handleSubmit} className="w-full">
                <div className="form-control mb-4 w-full">
                  <label className="label">
                    <span className="label-text text-sm sm:text-base">
                      Title
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered input-sm sm:input-md w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4 w-full">
                  <label className="label">
                    <span className="label-text text-sm sm:text-base">
                      Content
                    </span>
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered h-24 sm:h-32 text-sm sm:text-base w-full resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="card-actions justify-end w-full">
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm sm:btn-md"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Note'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
