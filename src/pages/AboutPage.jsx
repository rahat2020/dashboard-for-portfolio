import { useState } from 'react';
import {
  useGetAboutQuery,
  useCreateAboutMutation,
  useUpdateAboutMutation,
  useDeleteAboutMutation,
} from '../features/about/aboutApi';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import AboutForm from '../features/about/AboutForm';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit2,
  Trash2,
  Plus,
  Linkedin,
  GitHub,
  Twitter,
  Instagram,
  Globe,
  Youtube,
  Facebook,
  MessageSquare,
  CheckCircle,
  Clock,
  Award,
  AlertCircle,
  ExternalLink,
} from 'react-feather';

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="flex flex-col items-center gap-1.5 p-5 bg-gray-800/40 border border-gray-700/60 rounded-xl hover:border-violet-500/30 transition-colors">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
      <Icon size={18} className="text-white" />
    </div>
    <span className="text-2xl font-bold text-white">{value}</span>
    <span className="text-xs text-gray-400 text-center leading-tight">{label}</span>
  </div>
);

const SocialLink = ({ href, icon: Icon, label, color }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200
        bg-gray-800/40 border-gray-700/60 text-gray-300
        hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 group`}
    >
      <Icon size={15} className={`${color} group-hover:scale-110 transition-transform`} />
      <span className="truncate max-w-[140px]">{label}</span>
      <ExternalLink size={11} className="ml-auto text-gray-600 group-hover:text-violet-400 flex-shrink-0" />
    </a>
  );
};

const SkillBadge = ({ skill }) => (
  <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-violet-600/15 border border-violet-500/25 text-violet-300">
    {skill}
  </span>
);

const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-800/60 last:border-0">
      <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-md bg-gray-800 mt-0.5">
        <Icon size={13} className="text-violet-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-sm text-gray-200 mt-0.5 break-all">{value}</p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Empty / Loading states
// ─────────────────────────────────────────────

const SkeletonBlock = ({ h = 'h-4', w = 'w-full' }) => (
  <div className={`${h} ${w} bg-gray-800/70 rounded animate-pulse`} />
);

const AboutSkeleton = () => (
  <div className="space-y-6">
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-4">
        <SkeletonBlock h="h-20" w="w-20" />
        <div className="space-y-2 flex-1">
          <SkeletonBlock h="h-6" w="w-48" />
          <SkeletonBlock h="h-4" w="w-32" />
        </div>
      </div>
      <SkeletonBlock h="h-4" />
      <SkeletonBlock h="h-4" w="w-3/4" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <SkeletonBlock key={i} h="h-24" />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

const AboutPage = () => {
  const { data: aboutResponse, isLoading, refetch } = useGetAboutQuery();
  const [createAbout, { isLoading: isCreating }] = useCreateAboutMutation();
  const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutMutation();
  const [deleteAbout, { isLoading: isDeleting }] = useDeleteAboutMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const about = aboutResponse?.data || null;
  const hasData = !!about;

  const handleCreate = () => setModalOpen(true);
  const handleEdit = () => setModalOpen(true);

  const onFormSubmit = async (formData) => {
    try {
      if (hasData) {
        await updateAbout(formData).unwrap();
        toast.success('About info updated successfully!');
      } else {
        await createAbout(formData).unwrap();
        toast.success('About info created successfully!');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const onConfirmDelete = async () => {
    try {
      await deleteAbout().unwrap();
      toast.success('About info deleted.');
      setConfirmOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete about info.');
    }
  };

  const socialLinks = about
    ? [
        { href: about.linkedin_link, icon: Linkedin, label: 'LinkedIn', color: 'text-blue-400' },
        { href: about.github_link, icon: GitHub, label: 'GitHub', color: 'text-gray-300' },
        { href: about.twitter_link, icon: Twitter, label: 'Twitter / X', color: 'text-sky-400' },
        { href: about.facebook_link, icon: Facebook, label: 'Facebook', color: 'text-blue-500' },
        { href: about.instagram_link, icon: Instagram, label: 'Instagram', color: 'text-pink-400' },
        { href: about.whatsapp_link, icon: MessageSquare, label: 'WhatsApp', color: 'text-emerald-400' },
        { href: about.youtube_link, icon: Youtube, label: 'YouTube', color: 'text-red-400' },
        { href: about.website_link, icon: Globe, label: 'Website', color: 'text-violet-400' },
      ].filter((s) => !!s.href)
    : [];

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">About Me</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Manage your personal profile and portfolio identity.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasData && (
            <>
              <Button
                variant="ghost"
                icon={Trash2}
                onClick={() => setConfirmOpen(true)}
                className="!border-red-500/30 !text-red-400 hover:!bg-red-500/10 hover:!border-red-500/50"
              >
                Delete
              </Button>
              <Button variant="primary" icon={Edit2} onClick={handleEdit}>
                Edit Profile
              </Button>
            </>
          )}
          {!hasData && !isLoading && (
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              Create Profile
            </Button>
          )}
        </div>
      </div>

      {/* ── Loading ── */}
      {isLoading && <AboutSkeleton />}

      {/* ── No Data ── */}
      {!isLoading && !hasData && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-gray-900/50 border border-dashed border-gray-700 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-2">
            <User size={28} className="text-gray-500" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-200">No profile found</h3>
            <p className="text-gray-500 text-sm mt-1">
              Create your About Me profile to display it on your portfolio.
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleCreate}>
            Create Profile
          </Button>
        </div>
      )}

      {/* ── Profile View ── */}
      {!isLoading && hasData && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* ── Left / Main Column ── */}
          <div className="xl:col-span-2 space-y-5">
            {/* Hero Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 rounded-2xl p-6">
              {/* Decorative gradient blob */}
              <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl" />

              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {about.avatar ? (
                    <img
                      src={about.avatar}
                      alt={about.full_name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-violet-500/30 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <span className="text-2xl font-bold text-white select-none">
                        {about.short_name?.charAt(0) || about.full_name?.charAt(0) || 'R'}
                      </span>
                    </div>
                  )}
                  {about.open_to_work && (
                    <div className="absolute -bottom-1.5 -right-1.5 flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      OPEN
                    </div>
                  )}
                </div>

                {/* Identity */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white truncate">{about.full_name}</h2>
                    {about.open_to_work && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 rounded-full">
                        Open to Work
                      </span>
                    )}
                  </div>
                  <p className="text-violet-400 font-medium text-sm">{about.job_title}</p>
                  {about.location && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-gray-500 text-xs">
                      <MapPin size={12} />
                      <span>{about.location}</span>
                    </div>
                  )}
                  <p className="text-gray-400 text-sm mt-3 leading-relaxed line-clamp-2">
                    {about.header_description}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                icon={Clock}
                value={about.years_of_experience}
                label="Years of Experience"
                color="bg-violet-600/80"
              />
              <StatCard
                icon={Award}
                value={about.projects_completed}
                label="Projects Completed"
                color="bg-blue-600/80"
              />
              <StatCard
                icon={CheckCircle}
                value={socialLinks.length}
                label="Social Profiles"
                color="bg-emerald-600/80"
              />
              <StatCard
                icon={Briefcase}
                value={about.skills?.length || 0}
                label="Skills Listed"
                color="bg-amber-600/80"
              />
            </div>

            {/* About Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-3">{about.about_title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{about.about_description}</p>
            </div>

            {/* Skills */}
            {about.skills?.length > 0 && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-base font-semibold text-white mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {about.skills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} />
                  ))}
                </div>
              </div>
            )}

            {/* SEO Card */}
            {(about.meta_title || about.meta_description) && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-semibold text-white">SEO Info</h3>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/15 border border-blue-500/25 text-blue-400 rounded-full">
                    Meta
                  </span>
                </div>
                <div className="space-y-3">
                  {about.meta_title && (
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Meta Title
                      </p>
                      <p className="text-sm text-gray-200 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                        {about.meta_title}
                      </p>
                    </div>
                  )}
                  {about.meta_description && (
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Meta Description
                      </p>
                      <p className="text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50 leading-relaxed">
                        {about.meta_description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Right / Sidebar Column ── */}
          <div className="space-y-5">
            {/* Contact Info */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Contact Info</h3>
              <div className="space-y-0.5">
                <InfoRow icon={Mail} label="Email" value={about.email} />
                <InfoRow icon={Phone} label="Phone" value={about.phone} />
                <InfoRow icon={MapPin} label="Location" value={about.location} />
                {about.linkedin_title && (
                  <InfoRow icon={Linkedin} label="LinkedIn Title" value={about.linkedin_title} />
                )}
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Social Links</h3>
                <div className="grid grid-cols-1 gap-2">
                  {socialLinks.map(({ href, icon, label, color }) => (
                    <SocialLink
                      key={label}
                      href={href}
                      icon={icon}
                      label={label}
                      color={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Portfolio Links</h3>
              <div className="space-y-2">
                {about.resume_url ? (
                  <a
                    href={about.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <Briefcase size={14} />
                    View Resume
                    <ExternalLink size={11} />
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle size={14} />
                    No resume URL set
                  </div>
                )}
                {about.avatar ? (
                  <a
                    href={about.avatar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <User size={14} />
                    View Avatar
                    <ExternalLink size={11} />
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle size={14} />
                    No avatar URL set
                  </div>
                )}
              </div>
            </div>

            {/* Record Info */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Record Info</h3>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>ID</span>
                  <span className="font-mono text-gray-400 truncate max-w-[120px]">{about._id}</span>
                </div>
                {about.createdAt && (
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span className="text-gray-400">
                      {new Date(about.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {about.updatedAt && (
                  <div className="flex justify-between">
                    <span>Updated</span>
                    <span className="text-gray-400">
                      {new Date(about.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit / Create Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={hasData ? 'Edit About Profile' : 'Create About Profile'}
        size="xl"
      >
        <div className="max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">
          <AboutForm
            initialData={about}
            onSubmit={onFormSubmit}
            loading={isCreating || isUpdating}
            isEdit={hasData}
          />
        </div>
      </Modal>

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        loading={isDeleting}
        title="Delete About Profile"
        message="Are you sure you want to delete your about profile? This action cannot be undone."
      />
    </div>
  );
};

export default AboutPage;
