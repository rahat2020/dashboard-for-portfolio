import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPostQuery, useUpdatePostMutation, useDeletePostMutation } from '../features/posts/postsApi';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import PostForm from '../features/posts/PostForm';
import { ArrowLeft, Edit2, Trash2, Calendar } from 'react-feather';
import { toast } from 'react-hot-toast';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetPostQuery(id);
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const post = data?.data;

  const onFormSubmit = async (formData) => {
    try {
      await updatePost({ id, ...formData }).unwrap();
      toast.success('Post updated successfully');
      setEditOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  const onConfirmDelete = async () => {
    try {
      await deletePost(id).unwrap();
      toast.success('Post deleted successfully');
      navigate('/posts');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/posts')}>
          Back to Posts
        </Button>
        <p className="text-gray-400">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/posts')}>
          Back to Posts
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={Edit2} onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button variant="danger" icon={Trash2} onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full max-h-96 object-cover border-b border-gray-800"
          />
        )}

        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-white">{post.title}</h1>
            <div className="flex items-center gap-2 shrink-0">
              <div className={`w-2 h-2 rounded-full ${post.isPublished ? 'bg-emerald-500' : 'bg-gray-500'}`} />
              <span className={`text-xs font-medium ${post.isPublished ? 'text-emerald-500' : 'text-gray-500'}`}>
                {post.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-violet-600/10 text-violet-400 capitalize">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar size={14} />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          {post.tags?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-gray-800 text-gray-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap border-t border-gray-800 pt-5">
            {post.content}
          </p>
        </div>
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Post" size="lg">
        <PostForm initialData={post} onSubmit={onFormSubmit} loading={isUpdating} />
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        loading={isDeleting}
        title="Delete Post"
        message={`Are you sure you want to delete "${post.title}"? This will move it to the trash.`}
      />
    </div>
  );
};

export default PostDetailPage;
