import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormInput from '../../components/ui/FormInput';
import TextArea from '../../components/ui/TextArea';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import TagInput from '../../components/ui/TagInput';
import Button from '../../components/ui/Button';

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  isCurrentlyWorking: z.boolean().default(false),
  technologies: z.array(z.string()).default([]),
  isPublished: z.boolean().default(true),
});

const ExperienceForm = ({ initialData, onSubmit, loading }) => {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData || {
      company: '',
      position: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentlyWorking: false,
      technologies: [],
      isPublished: true,
    },
  });

  const isCurrentlyWorking = watch('isCurrentlyWorking');

  useEffect(() => {
    if (isCurrentlyWorking) {
      setValue('endDate', '');
    }
  }, [isCurrentlyWorking, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Company"
          name="company"
          register={register}
          error={errors.company}
          required
        />
        <FormInput
          label="Position"
          name="position"
          register={register}
          error={errors.position}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Location"
          name="location"
          register={register}
          error={errors.location}
          placeholder="e.g. Dhaka, Bangladesh"
          required
        />
        <Controller
          name="technologies"
          control={control}
          render={({ field }) => (
            <TagInput
              label="Stack"
              value={field.value}
              onChange={field.onChange}
              error={errors.technologies}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Start Date"
          name="startDate"
          type="date"
          register={register}
          error={errors.startDate}
          required
        />
        <FormInput
          label="End Date"
          name="endDate"
          type="date"
          register={register}
          error={errors.endDate}
          disabled={isCurrentlyWorking}
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

      <div className="flex gap-6 p-4 bg-gray-800/30 rounded-xl border border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-300">Currently Working</span>
          <Controller
            name="isCurrentlyWorking"
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
          {isEdit ? 'Update Experience' : 'Save Experience'}
        </Button>
      </div>
    </form>
  );
};

export default ExperienceForm;
