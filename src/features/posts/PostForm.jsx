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

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  thumbnail: z.any().optional(),
});

const PostForm = ({ initialData, onSubmit, loading }) => {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      content: '',
      category: '',
      tags: [],
      isPublished: true,
      thumbnail: null,
    },
  });

  const title = watch('title');

  // Slug generation logic
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
    { label: 'Technology', value: 'technology' },
    { label: 'Development', value: 'development' },
    { label: 'Design', value: 'design' },
    { label: 'Productivity', value: 'productivity' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          name="tags"
          control={control}
          render={({ field }) => (
            <TagInput
              label="Tags"
              value={field.value}
              onChange={field.onChange}
              error={errors.tags}
            />
          )}
        />
      </div>

      <TextArea
        label="Content"
        name="content"
        rows={6}
        register={register}
        error={errors.content}
        required
      />

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

      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-800">
        <span className="text-sm font-medium text-gray-300">Publish immediately?</span>
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

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
        <Button variant="primary" type="submit" loading={loading} className="w-full">
          {isEdit ? 'Update Post' : 'Save Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
