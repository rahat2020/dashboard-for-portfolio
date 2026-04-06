import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

const UserForm = ({ initialData, onSubmit, loading }) => {
  const isEdit = !!initialData;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      isEdit 
        ? userSchema.extend({ password: z.string().optional().or(z.literal('')) }) 
        : userSchema.extend({ password: z.string().min(6, 'Password must be at least 6 characters') })
    ),
    defaultValues: initialData || {
      name: '',
      email: '',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Name"
        name="name"
        register={register}
        error={errors.name}
        required
      />
      <FormInput
        label="Email"
        name="email"
        type="email"
        register={register}
        error={errors.email}
        required
      />
      {!isEdit && (
        <FormInput
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          required
        />
      )}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
        <Button variant="primary" type="submit" loading={loading} className="w-full">
          {isEdit ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
