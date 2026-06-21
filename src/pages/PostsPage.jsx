import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPostsQuery, useCreatePostMutation, useUpdatePostMutation, useDeletePostMutation } from '../features/posts/postsApi';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import PostForm from '../features/posts/PostForm';
import { Plus, Edit2, Trash2, Eye } from 'react-feather';
import { toast } from 'react-hot-toast';

const PostsPage = () => {
  const navigate = useNavigate();
  const { data: postsData, isLoading, refetch } = useGetPostsQuery();
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const columns = [
    {
      header: 'Thumbnail',
      accessor: 'thumbnail',
      sortable: false,
      width: '80px',
      render: (row) => (
        row.thumbnail ? (
          <img
            src={row.thumbnail}
            alt={row.title}
            className="w-12 h-12 rounded-lg object-cover border border-gray-700"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700" />
        )
      ),
    },
    { header: 'Title', accessor: 'title', width: '32%' },
    {
      header: 'Category', 
      accessor: 'category',
      render: (row) => (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-violet-600/10 text-violet-400 capitalize">
          {row.category}
        </span>
      )
    },
    {
      header: 'Published',
      accessor: 'isPublished',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.isPublished ? 'bg-emerald-500' : 'bg-gray-500'}`} />
          <span className={`text-xs font-medium ${row.isPublished ? 'text-emerald-500' : 'text-gray-500'}`}>
            {row.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      ),
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  const handleCreate = () => {
    setEditingPost(null);
    setModalOpen(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setModalOpen(true);
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setConfirmOpen(true);
  };

  const onFormSubmit = async (formData) => {
    try {
      if (editingPost) {
        await updatePost({ id: editingPost._id, ...formData }).unwrap();
        toast.success('Post updated successfully');
      } else {
        await createPost(formData).unwrap();
        toast.success('Post created successfully');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  const onConfirmDelete = async () => {
    try {
      await deletePost(postToDelete._id).unwrap();
      toast.success('Post deleted successfully');
      setConfirmOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete post');
    }
  };

  const actions = [
    { label: 'View', icon: Eye, onClick: (row) => navigate(`/posts/${row._id}`) },
    { label: 'Edit', icon: Edit2, onClick: handleEdit },
    { label: 'Delete', icon: Trash2, variant: 'danger', onClick: handleDeleteClick },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Posts</h1>
          <p className="text-gray-400 text-sm">Create and manage your blog articles.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleCreate}>
          New Post
        </Button>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <DataTable
          columns={columns}
          data={postsData?.data || []}
          loading={isLoading}
          actions={actions}
          emptyMessage="No posts found"
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPost ? 'Edit Post' : 'Create New Post'}
        size="lg"
      >
        <PostForm
          initialData={editingPost}
          onSubmit={onFormSubmit}
          loading={isCreating || isUpdating}
        />
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        loading={isDeleting}
        title="Delete Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This will move it to the trash.`}
      />
    </div>
  );
};

export default PostsPage;
