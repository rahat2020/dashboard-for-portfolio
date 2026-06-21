import { useState } from 'react';
import { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../features/users/usersApi';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import UserForm from '../features/users/UserForm';
import { UserPlus, Edit2, Trash2, Copy } from 'react-feather';
import { toast } from 'react-hot-toast';

const UsersPage = () => {
  const { data: usersData, isLoading, refetch } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleCopyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success('Email copied to clipboard');
    } catch {
      toast.error('Failed to copy email');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    {
      header: 'Email',
      accessor: 'email',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.email}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyEmail(row.email);
            }}
            title="Copy email"
            className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <Copy size={13} />
          </button>
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
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setConfirmOpen(true);
  };

  const onFormSubmit = async (formData) => {
    try {
      if (editingUser) {
        await updateUser({ id: editingUser._id, ...formData }).unwrap();
        toast.success('User updated successfully');
      } else {
        await createUser(formData).unwrap();
        toast.success('User created successfully');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  const onConfirmDelete = async () => {
    try {
      await deleteUser(userToDelete._id).unwrap();
      toast.success('User deleted successfully');
      setConfirmOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete user');
    }
  };

  const actions = [
    { label: 'Edit', icon: Edit2, onClick: handleEdit },
    { label: 'Delete', icon: Trash2, variant: 'danger', onClick: handleDeleteClick },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm">Manage administrative access.</p>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={handleCreate}>
          Add User
        </Button>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <DataTable
          columns={columns}
          data={usersData?.data || []}
          loading={isLoading}
          actions={actions}
          emptyMessage="No users found"
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="md"
      >
        <UserForm
          initialData={editingUser}
          onSubmit={onFormSubmit}
          loading={isCreating || isUpdating}
        />
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        loading={isDeleting}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default UsersPage;
