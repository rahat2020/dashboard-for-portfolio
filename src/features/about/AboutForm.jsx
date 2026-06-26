import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormInput from '../../components/ui/FormInput';
import TextArea from '../../components/ui/TextArea';
import TagInput from '../../components/ui/TagInput';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import Button from '../../components/ui/Button';
import ImageUpload from '../../components/ui/ImageUpload';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Link,
  Linkedin,
  Twitter,
  Instagram,
  GitHub,
  Youtube,
  Globe,
  Facebook,
  MessageSquare,
} from 'react-feather';

const urlOrEmpty = z.string().url('Must be a valid URL').or(z.literal('')).optional();

const aboutSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  short_name: z.string().min(1, 'Short name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  avatar: z.string().optional(),
  resume_url: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  location: z.string().min(1, 'Location is required'),
  header_title: z.string().min(1, 'Header title is required'),
  header_description: z.string().min(1, 'Header description is required'),
  about_title: z.string().min(1, 'About title is required'),
  about_description: z.string().min(1, 'About description is required'),
  linkedin_title: z.string().optional(),
  linkedin_link: urlOrEmpty,
  facebook_link: urlOrEmpty,
  twitter_link: urlOrEmpty,
  instagram_link: urlOrEmpty,
  whatsapp_link: urlOrEmpty,
  github_link: urlOrEmpty,
  youtube_link: urlOrEmpty,
  website_link: urlOrEmpty,
  years_of_experience: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => v >= 0, 'Must be 0 or greater'),
  projects_completed: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((v) => v >= 0, 'Must be 0 or greater'),
  open_to_work: z.boolean().default(true),
  skills: z.array(z.string()).default([]),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

const DEFAULT_VALUES = {
  full_name: '',
  short_name: '',
  job_title: '',
  avatar: '',
  resume_url: '',
  email: '',
  phone: '',
  location: '',
  header_title: '',
  header_description: '',
  about_title: 'About Me',
  about_description: '',
  linkedin_title: '',
  linkedin_link: '',
  facebook_link: '',
  twitter_link: '',
  instagram_link: '',
  whatsapp_link: '',
  github_link: '',
  youtube_link: '',
  website_link: '',
  years_of_experience: 0,
  projects_completed: 0,
  open_to_work: true,
  skills: [],
  meta_title: '',
  meta_description: '',
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-widest">{title}</h3>
    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
  </div>
);

const AboutForm = ({ initialData, onSubmit, loading, isEdit }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(aboutSchema),
    defaultValues: initialData || DEFAULT_VALUES,
  });

  // Sync when initialData arrives (e.g. after fetch)
  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ── Personal Info ── */}
      <div className="bg-gray-800/30 border border-gray-800 rounded-xl p-5">
        <SectionHeader title="Personal Info" subtitle="Your basic identity details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Full Name"
            name="full_name"
            register={register}
            error={errors.full_name}
            placeholder="Rahat Ahmed"
            icon={<User size={15} />}
            required
          />
          <FormInput
            label="Short Name"
            name="short_name"
            register={register}
            error={errors.short_name}
            placeholder="Rahat"
            icon={<User size={15} />}
            required
          />
          <FormInput
            label="Job Title"
            name="job_title"
            register={register}
            error={errors.job_title}
            placeholder="Full Stack Developer"
            required
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            placeholder="you@example.com"
            icon={<Mail size={15} />}
            required
          />
          <FormInput
            label="Phone"
            name="phone"
            register={register}
            error={errors.phone}
            placeholder="+88 01800000000"
            icon={<Phone size={15} />}
            required
          />
          <FormInput
            label="Location"
            name="location"
            register={register}
            error={errors.location}
            placeholder="Dhaka, Bangladesh"
            icon={<MapPin size={15} />}
            required
          />
        </div>
        <div className="mt-6 space-y-4">
          <Controller
            name="avatar"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ImageUpload
                label="Avatar Profile Image"
                value={value}
                onChange={onChange}
                error={errors.avatar}
              />
            )}
          />
          <FormInput
            label="Resume URL"
            name="resume_url"
            register={register}
            error={errors.resume_url}
            placeholder="https://..."
            icon={<Link size={15} />}
          />
        </div>
      </div>

      {/* ── Header & About Content ── */}
      <div className="bg-gray-800/30 border border-gray-800 rounded-xl p-5">
        <SectionHeader title="Content" subtitle="Hero section & about section text" />
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            label="Header Title"
            name="header_title"
            register={register}
            error={errors.header_title}
            placeholder="Hi, I'm Rahat 👋"
            required
          />
          <TextArea
            label="Header Description"
            name="header_description"
            register={register}
            error={errors.header_description}
            rows={2}
            placeholder="A short intro for the hero section…"
            required
          />
          <FormInput
            label="About Title"
            name="about_title"
            register={register}
            error={errors.about_title}
            placeholder="About Me"
            required
          />
          <TextArea
            label="About Description"
            name="about_description"
            register={register}
            error={errors.about_description}
            rows={3}
            placeholder="I build modern web applications…"
            required
          />
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="bg-gray-800/30 border border-gray-800 rounded-xl p-5">
        <SectionHeader title="Stats" subtitle="Highlight numbers displayed on the portfolio" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Years of Experience"
            name="years_of_experience"
            type="number"
            register={register}
            error={errors.years_of_experience}
            placeholder="3"
          />
          <FormInput
            label="Projects Completed"
            name="projects_completed"
            type="number"
            register={register}
            error={errors.projects_completed}
            placeholder="20"
          />
        </div>
        <div className="flex items-center gap-3 mt-4 p-3 bg-gray-800/40 rounded-lg border border-gray-700/50">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-300">Open to Work</p>
            <p className="text-xs text-gray-500">Show a hiring badge on your portfolio</p>
          </div>
          <Controller
            name="open_to_work"
            control={control}
            render={({ field }) => (
              <ToggleSwitch checked={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </div>

      {/* ── Skills ── */}
      <div className="bg-gray-800/30 border border-gray-800 rounded-xl p-5">
        <SectionHeader title="Skills" subtitle="Press Enter or comma to add a skill tag" />
        <Controller
          name="skills"
          control={control}
          render={({ field }) => (
            <TagInput
              label="Skills"
              value={field.value}
              onChange={field.onChange}
              error={errors.skills}
              placeholder="React, Node.js, etc."
            />
          )}
        />
      </div>

      {/* ── Social Links ── */}
      <div className="bg-gray-800/30 border border-gray-800 rounded-xl p-5">
        <SectionHeader title="Social Links" subtitle="Leave empty to hide from your portfolio" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="LinkedIn Title"
            name="linkedin_title"
            register={register}
            error={errors.linkedin_title}
            placeholder="Connect with me on LinkedIn"
          />
          <FormInput
            label="LinkedIn URL"
            name="linkedin_link"
            register={register}
            error={errors.linkedin_link}
            placeholder="https://linkedin.com/in/..."
            icon={<Linkedin size={15} />}
          />
          <FormInput
            label="GitHub URL"
            name="github_link"
            register={register}
            error={errors.github_link}
            placeholder="https://github.com/..."
            icon={<GitHub size={15} />}
          />
          <FormInput
            label="Facebook URL"
            name="facebook_link"
            register={register}
            error={errors.facebook_link}
            placeholder="https://facebook.com/..."
            icon={<Facebook size={15} />}
          />
          <FormInput
            label="Twitter / X URL"
            name="twitter_link"
            register={register}
            error={errors.twitter_link}
            placeholder="https://twitter.com/..."
            icon={<Twitter size={15} />}
          />
          <FormInput
            label="Instagram URL"
            name="instagram_link"
            register={register}
            error={errors.instagram_link}
            placeholder="https://instagram.com/..."
            icon={<Instagram size={15} />}
          />
          <FormInput
            label="WhatsApp Link"
            name="whatsapp_link"
            register={register}
            error={errors.whatsapp_link}
            placeholder="https://wa.me/88..."
            icon={<MessageSquare size={15} />}
          />
          <FormInput
            label="YouTube URL"
            name="youtube_link"
            register={register}
            error={errors.youtube_link}
            placeholder="https://youtube.com/..."
            icon={<Youtube size={15} />}
          />
          <FormInput
            label="Website URL"
            name="website_link"
            register={register}
            error={errors.website_link}
            placeholder="https://rahat.dev"
            icon={<Globe size={15} />}
          />
        </div>
      </div>

      {/* ── SEO ── */}
      <div className="bg-gray-800/30 border border-gray-800 rounded-xl p-5">
        <SectionHeader title="SEO" subtitle="Meta info for search engines" />
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            label="Meta Title"
            name="meta_title"
            register={register}
            error={errors.meta_title}
            placeholder="Rahat Ahmed — Full Stack Developer"
          />
          <TextArea
            label="Meta Description"
            name="meta_description"
            register={register}
            error={errors.meta_description}
            rows={2}
            placeholder="A short description for search engines…"
          />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex justify-end pt-2">
        <Button variant="primary" type="submit" loading={loading} className="min-w-[160px]">
          {isEdit ? 'Update About Info' : 'Save About Info'}
        </Button>
      </div>
    </form>
  );
};

export default AboutForm;
