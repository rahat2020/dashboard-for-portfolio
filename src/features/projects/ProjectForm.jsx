import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormInput from '../../components/ui/FormInput';
import TextArea from '../../components/ui/TextArea';
import Select from '../../components/ui/Select';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import TagInput from '../../components/ui/TagInput';
import ImageUpload from '../../components/ui/ImageUpload';
import Button from '../../components/ui/Button';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  liveUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  technologies: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  thumbnail: z.any().optional(),
});

const ProjectForm = ({ initialData, onSubmit, loading }) => {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      description: '',
      liveUrl: '',
      githubUrl: '',
      category: '',
      technologies: [],
      isFeatured: false,
      isPublished: true,
      thumbnail: null,
    },
  });

  const title = watch('title');

  useEffect(() => {
    if (title && !isEdit) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [title, isEdit, setValue]);

  const categories = [
    { label: 'Full Stack', value: 'fullstack' },
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' },
    { label: 'Mobile App', value: 'mobile' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Title"
          name="title"
          register={register}
          error={errors.title}
          required
        />
        <FormInput
          label="Slug"
          name="slug"
          register={register}
          error={errors.slug}
          required
        />
      </div>

      <TextArea
        label="Description"
        name="description"
        rows={4}
        register={register}
        error={errors.description}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Live URL"
          name="liveUrl"
          register={register}
          error={errors.liveUrl}
        />
        <FormInput
          label="GitHub URL"
          name="githubUrl"
          register={register}
          error={errors.githubUrl}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Category"
          name="category"
          options={categories}
          register={register}
          error={errors.category}
          required
        />
        <Controller
          name="technologies"
          control={control}
          render={({ field }) => (
            <TagInput
              label="Technologies"
              value={field.value}
              onChange={field.onChange}
              error={errors.technologies}
            />
          )}
        />
      </div>

      <Controller
        name="thumbnail"
        control={control}
        render={({ field }) => (
          <ImageUpload
            label="Thumbnail"
            value={field.value}
            onChange={field.onChange}
            error={errors.thumbnail}
          />
        )}
      />

      <div className="flex gap-6 p-4 bg-gray-800/30 rounded-xl border border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-300">Featured</span>
          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-300">Published</span>
          <Controller
            name="isPublished"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
        <Button variant="primary" type="submit" loading={loading} className="w-full">
          {isEdit ? 'Update Project' : 'Save Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
