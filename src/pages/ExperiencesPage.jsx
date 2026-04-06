import { useState } from 'react';
import { useGetExperiencesQuery, useCreateExperienceMutation, useUpdateExperienceMutation, useDeleteExperienceMutation } from '../features/experiences/experiencesApi';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ExperienceForm from '../features/experiences/ExperienceForm';
import { Plus, Edit2, Trash2, Calendar } from 'react-feather';
import { toast } from 'react-hot-toast';

const ExperiencesPage = () => {
  const { data: experiencesData, isLoading, refetch } = useGetExperiencesQuery();
  const [createExperience, { isLoading: isCreating }] = useCreateExperienceMutation();
  const [updateExperience, { isLoading: isUpdating }] = useUpdateExperienceMutation();
  const [deleteExperience, { isLoading: isDeleting }] = useDeleteExperienceMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);

  const columns = [
    { header: 'Company', accessor: 'company', width: '25%' },
    { header: 'Position', accessor: 'position', width: '25%' },
    { 
      header: 'Duration', 
      accessor: 'startDate',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar size={12} />
          {new Date(row.startDate).toLocaleDateString()} - {row.isCurrentlyWorking ? 'Present' : new Date(row.endDate).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'isPublished',
      render: (row) => (
        <span className={`text-xs font-medium ${row.isPublished ? 'text-emerald-500' : 'text-gray-500'}`}>
          {row.isPublished ? 'Published' : 'Hidden'}
        </span>
      ),
    },
  ];

  const handleCreate = () => {
    setEditingExperience(null);
    setModalOpen(true);
  };

  const handleEdit = (exp) => {
    setEditingExperience(exp);
    setModalOpen(true);
  };

  const handleDeleteClick = (exp) => {
    setExperienceToDelete(exp);
    setConfirmOpen(true);
  };

  const onFormSubmit = async (formData) => {
    try {
      if (editingExperience) {
        await updateExperience({ id: editingExperience._id, ...formData }).unwrap();
        toast.success('Experience updated successfully');
      } else {
        await createExperience(formData).unwrap();
        toast.success('Experience created successfully');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  const onConfirmDelete = async () => {
    try {
      await deleteExperience(experienceToDelete._id).unwrap();
      toast.success('Experience deleted successfully');
      setConfirmOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete experience');
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
          <h1 className="text-2xl font-bold text-white">Experience</h1>
          <p className="text-gray-400 text-sm">Manage your career history.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleCreate}>
          New Experience
        </Button>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <DataTable
          columns={columns}
          data={experiencesData?.data || []}
          loading={isLoading}
          actions={actions}
          emptyMessage="No experiences found"
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExperience ? 'Edit Experience' : 'Add New Experience'}
        size="lg"
      >
        <ExperienceForm
          initialData={editingExperience}
          onSubmit={onFormSubmit}
          loading={isCreating || isUpdating}
        />
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        loading={isDeleting}
        title="Delete Experience"
        message={`Are you sure you want to delete experience at ${experienceToDelete?.company}?`}
      />
    </div>
  );
};

export default ExperiencesPage;
