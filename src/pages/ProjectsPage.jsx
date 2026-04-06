import { useState } from 'react';
import { useGetProjectsQuery, useCreateProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation } from '../features/projects/projectsApi';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ProjectForm from '../features/projects/ProjectForm';
import { Plus, Edit2, Trash2, Eye, Star } from 'react-feather';
import { toast } from 'react-hot-toast';

const ProjectsPage = () => {
  const { data: projectsData, isLoading, refetch } = useGetProjectsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const columns = [
    { 
      header: 'Title', 
      accessor: 'title',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.title}</span>
          {row.isFeatured && (
            <Star size={14} className="text-amber-400 fill-amber-400" />
          )}
        </div>
      )
    },
    { 
      header: 'Category', 
      accessor: 'category',
      render: (row) => (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-600/10 text-blue-400 capitalize">
          {row.category}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'isPublished',
      render: (row) => (
        <span className={`text-xs font-medium ${row.isPublished ? 'text-emerald-500' : 'text-gray-500'}`}>
          {row.isPublished ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      header: 'Technologies',
      accessor: 'technologies',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.technologies?.slice(0, 3).map((tech) => (
            <span key={tech} className="px-1.5 py-0.5 text-[10px] bg-gray-800 border border-gray-700 rounded text-gray-400">
              {tech}
            </span>
          ))}
          {row.technologies?.length > 3 && (
            <span className="text-[10px] text-gray-500">+{row.technologies.length - 3}</span>
          )}
        </div>
      )
    },
  ];

  const handleCreate = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setConfirmOpen(true);
  };

  const onFormSubmit = async (formData) => {
    try {
      if (editingProject) {
        await updateProject({ id: editingProject._id, ...formData }).unwrap();
        toast.success('Project updated successfully');
      } else {
        await createProject(formData).unwrap();
        toast.success('Project created successfully');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  const onConfirmDelete = async () => {
    try {
      await deleteProject(projectToDelete._id).unwrap();
      toast.success('Project deleted successfully');
      setConfirmOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete project');
    }
  };

  const actions = [
    { label: 'View', icon: Eye, onClick: (row) => window.open(row.liveUrl, '_blank') },
    { label: 'Edit', icon: Edit2, onClick: handleEdit },
    { label: 'Delete', icon: Trash2, variant: 'danger', onClick: handleDeleteClick },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 text-sm">Showcase your best work.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleCreate}>
          New Project
        </Button>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <DataTable
          columns={columns}
          data={projectsData?.data || []}
          loading={isLoading}
          actions={actions}
          emptyMessage="No projects found"
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        size="lg"
      >
        <ProjectForm
          initialData={editingProject}
          onSubmit={onFormSubmit}
          loading={isCreating || isUpdating}
        />
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        loading={isDeleting}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.title}"?`}
      />
    </div>
  );
};

export default ProjectsPage;
