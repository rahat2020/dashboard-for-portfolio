import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProjectQuery, useUpdateProjectMutation, useDeleteProjectMutation } from '../features/projects/projectsApi';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ProjectForm from '../features/projects/ProjectForm';
import { ArrowLeft, Edit2, Trash2, ExternalLink, GitHub, Star } from 'react-feather';
import { toast } from 'react-hot-toast';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetProjectQuery(id);
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const project = data?.data;

  const onFormSubmit = async (formData) => {
    try {
      await updateProject({ id, ...formData }).unwrap();
      toast.success('Project updated successfully');
      setEditOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  const onConfirmDelete = async () => {
    try {
      await deleteProject(id).unwrap();
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete project');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
        <p className="text-gray-400">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/projects')}>
          Back to Projects
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
        {project.thumbnail && (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full max-h-96 object-cover border-b border-gray-800"
          />
        )}

        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              {project.title}
              {project.isFeatured && (
                <Star size={18} className="text-amber-400 fill-amber-400" />
              )}
            </h1>
            <span className={`text-xs font-medium shrink-0 ${project.isPublished ? 'text-emerald-500' : 'text-gray-500'}`}>
              {project.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-600/10 text-blue-400 capitalize">
              {project.category}
            </span>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300"
              >
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200"
              >
                <GitHub size={14} /> Source
              </a>
            )}
          </div>

          {project.technologies?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-2.5 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-gray-400">
                  {tech}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap border-t border-gray-800 pt-5">
            {project.description}
          </p>
        </div>
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Project" size="lg">
        <ProjectForm initialData={project} onSubmit={onFormSubmit} loading={isUpdating} />
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        loading={isDeleting}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.title}"?`}
      />
    </div>
  );
};

export default ProjectDetailPage;
