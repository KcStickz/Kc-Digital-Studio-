import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  LogOut,
  ExternalLink,
  Plus,
  FolderSync,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
  Inbox,
  HardDrive,
  AlertTriangle,
  Upload,
  Link as LinkIcon,
  X,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  Image as ImageIcon,
  AlertCircle,
  Check,
  Video,
  Play,
  Info,
  Copy,
  Database,
} from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth as useFirebaseAuth } from '../../firebase/authContext';
import { useSupabaseAuth } from '../../supabase/authContext';
import {
  getAllProjectsForAdmin,
  createProject,
  updateProject,
  deleteProject,
  seedInitialProjects,
  ProjectRecord,
  ProjectDeleteResult,
} from '../../supabase/projectsService';
import {
  uploadPortfolioMedia,
  validateMediaFile,
} from '../../supabase/storageService';
import {
  SUPABASE_URL,
  PORTFOLIO_STORAGE_BUCKET,
  isSupabaseConfigured,
} from '../../supabase/client';
import {
  validateImageUrl,
  parseAndConvertVideoUrl,
  isEmbedVideo,
  getEmbedVideoUrl,
} from '../../utils/mediaUtils';
import {
  getMessagesForAdmin,
  updateMessageStatus,
  deleteMessage,
  ContactMessageRecord,
} from '../../firebase/messagesService';
import { PortfolioCategory, STUDIO_PROJECTS } from '../../data/studioData';
import firebaseConfig from '../../../firebase-applet-config.json';

const CATEGORIES: PortfolioCategory[] = [
  'Graphic Design',
  'Video Editing',
  'Photography',
  'Videography',
  'Web Development',
  'Software Development',
  'Social Media Management',
  'IT Support',
];

export const AdminDashboardPage: React.FC = () => {
  const { user: fbUser, isAdmin: isFbAdmin, loading: fbAuthLoading, logout: fbLogout } = useFirebaseAuth();
  const {
    user: sbUser,
    isAdmin: isSbAdmin,
    loading: sbAuthLoading,
    signOut: sbSignOut,
    signInWithEmail: sbSignInWithEmail,
    isAuthenticating: sbAuthenticating,
  } = useSupabaseAuth();

  const user = sbUser || fbUser;
  const isAdmin = Boolean(isSbAdmin || isFbAdmin);
  const authLoading = Boolean(sbAuthLoading || fbAuthLoading);

  const [isSupabaseAuthModalOpen, setIsSupabaseAuthModalOpen] = useState<boolean>(false);
  const [supabaseLoginPassword, setSupabaseLoginPassword] = useState<string>('');
  const [supabaseLoginError, setSupabaseLoginError] = useState<string | null>(null);

  const handleSupabaseQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseLoginError(null);
    if (!supabaseLoginPassword) {
      setSupabaseLoginError('Please enter your Supabase administrator password.');
      return;
    }
    const res = await sbSignInWithEmail('okoobenikelechisalvation@gmail.com', supabaseLoginPassword);
    if (res.success) {
      setIsSupabaseAuthModalOpen(false);
      setSupabaseLoginPassword('');
      showToast('Connected to Supabase! Direct media uploads are now enabled.');
    } else if (res.error) {
      setSupabaseLoginError(res.error);
    }
  };

  const logout = async () => {
    await sbSignOut();
    await fbLogout();
    navigate('/admin/login', { replace: true });
  };

  const navigate = useNavigate();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'projects' | 'messages' | 'categories' | 'system'>('projects');

  // Projects state
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Messages state
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // Delete confirmation modal state
  const [projectToDelete, setProjectToDelete] = useState<ProjectRecord | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState<PortfolioCategory>('Web Development');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formDescription, setFormDescription] = useState('');
  const [formFullOverview, setFormFullOverview] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formProjectLink, setFormProjectLink] = useState('');
  const [formClientScope, setFormClientScope] = useState('');
  const [formYear, setFormYear] = useState('2026');
  const [formDeliverableInput, setFormDeliverableInput] = useState('');
  const [formDeliverables, setFormDeliverables] = useState<string[]>([]);

  const [imageError, setImageError] = useState<string | null>(null);
  const [imageVerified, setImageVerified] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Supabase Storage upload states
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [imageUploadProgress, setImageUploadProgress] = useState<string>('');
  const [videoUploading, setVideoUploading] = useState<boolean>(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<string>('');

  const DRAFT_STORAGE_KEY = 'kcnexus_admin_project_draft';

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Redirect if unauthorized
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAdmin, authLoading, navigate]);

  // Load projects
  const loadProjects = async () => {
    setProjectsLoading(true);
    try {
      const data = await getAllProjectsForAdmin();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Load messages
  const loadMessages = async () => {
    setMessagesLoading(true);
    try {
      const data = await getMessagesForAdmin();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadProjects();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin && activeTab === 'messages') {
      loadMessages();
    }
  }, [isAdmin, activeTab]);

  // Seed baseline projects
  const handleSeedDatabase = async () => {
    setProjectsLoading(true);
    try {
      const count = await seedInitialProjects();
      showToast(`Successfully populated ${count} baseline projects into Supabase database.`);
      await loadProjects();
    } catch (err) {
      console.error('Seed error:', err);
      showToast('Error populating database.');
    } finally {
      setProjectsLoading(false);
    }
  };

  // Open modal for Create (restores draft if available)
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setSaveError(null);
    setImageError(null);
    setImageVerified(false);

    try {
      const savedDraft = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setFormTitle(parsed.title || '');
        setFormSlug(parsed.slug || '');
        setFormCategory(parsed.category || 'Web Development');
        setFormStatus(parsed.status || 'published');
        setFormDescription(parsed.description || '');
        setFormFullOverview(parsed.fullOverview || '');
        setFormImage(parsed.image || '');
        setFormVideoUrl(parsed.videoUrl || '');
        setFormProjectLink(parsed.projectLink || '');
        setFormClientScope(parsed.clientScope || '');
        setFormYear(parsed.year || '2026');
        setFormDeliverables(parsed.deliverables || ['Responsive Web App', 'UI/UX Design']);
        setIsModalOpen(true);
        return;
      }
    } catch (e) {
      console.warn('Could not read draft from session storage:', e);
    }

    setFormTitle('');
    setFormSlug('');
    setFormCategory('Web Development');
    setFormStatus('published');
    setFormDescription('');
    setFormFullOverview('');
    setFormImage('');
    setFormVideoUrl('');
    setFormProjectLink('');
    setFormClientScope('');
    setFormYear('2026');
    setFormDeliverables(['Responsive Web App', 'UI/UX Design']);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (proj: ProjectRecord) => {
    setEditingProject(proj);
    setSaveError(null);
    setImageError(null);
    setImageVerified(Boolean(proj.image));

    setFormTitle(proj.title);
    setFormSlug(proj.slug);
    setFormCategory(proj.filterCategory);
    setFormStatus(proj.status);
    setFormDescription(proj.description);
    setFormFullOverview(proj.fullOverview);
    setFormImage(proj.image || '');
    setFormVideoUrl(proj.videoUrl || '');
    setFormProjectLink(proj.projectLink || '');
    setFormClientScope(proj.clientScope || '');
    setFormYear(proj.year || '2026');
    setFormDeliverables(proj.deliverables || []);
    setIsModalOpen(true);
  };

  // Helper to persist draft while creating
  const updateDraft = (patch: Record<string, unknown>) => {
    if (editingProject) return;
    try {
      const current = {
        title: formTitle,
        slug: formSlug,
        category: formCategory,
        status: formStatus,
        description: formDescription,
        fullOverview: formFullOverview,
        image: formImage,
        videoUrl: formVideoUrl,
        projectLink: formProjectLink,
        clientScope: formClientScope,
        year: formYear,
        deliverables: formDeliverables,
        ...patch,
      };
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(current));
    } catch {
      // Storage quota or private browsing restriction
    }
  };

  // Auto-generate slug when title changes
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    let generated = formSlug;
    if (!editingProject) {
      generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setFormSlug(generated);
      updateDraft({ title: val, slug: generated });
    }
  };

  // Handle Image URL change with real-time validation
  const handleImageChange = (val: string) => {
    setFormImage(val);
    setImageVerified(false);
    setSaveError(null);

    const trimmed = val.trim();
    if (!trimmed) {
      setImageError(null);
      updateDraft({ image: '' });
      return;
    }

    const check = validateImageUrl(trimmed);
    if (!check.isValid) {
      setImageError(check.error || 'Invalid Image URL.');
    } else {
      setImageError(null);
    }
    updateDraft({ image: trimmed });
  };

  // Handle Video URL change
  const handleVideoChange = (val: string) => {
    setFormVideoUrl(val);
    setSaveError(null);
    updateDraft({ videoUrl: val.trim() });
  };

  // Handle direct image file upload to Supabase Storage "portfolio-media"
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setImageUploadProgress('Uploading to portfolio-media bucket...');
    setImageError(null);
    setSaveError(null);

    try {
      const res = await uploadPortfolioMedia(file, 'images', formSlug || 'project');
      if (res.success && res.publicUrl) {
        setFormImage(res.publicUrl);
        setImageVerified(true);
        setImageError(null);
        updateDraft({ image: res.publicUrl });
        showToast('Image uploaded directly to Supabase Storage!');
      } else {
        setImageError(res.error || 'Failed to upload image.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed.';
      setImageError(msg);
    } finally {
      setImageUploading(false);
      setImageUploadProgress('');
      e.target.value = '';
    }
  };

  // Handle direct video file upload to Supabase Storage "portfolio-media"
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoUploading(true);
    setVideoUploadProgress('Uploading video to portfolio-media bucket...');
    setSaveError(null);

    try {
      const res = await uploadPortfolioMedia(file, 'videos', formSlug || 'project');
      if (res.success && res.publicUrl) {
        setFormVideoUrl(res.publicUrl);
        updateDraft({ videoUrl: res.publicUrl });
        showToast('Video uploaded directly to Supabase Storage!');
      } else {
        setSaveError(res.error || 'Failed to upload video.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed.';
      setSaveError(msg);
    } finally {
      setVideoUploading(false);
      setVideoUploadProgress('');
      e.target.value = '';
    }
  };

  // Add deliverable tag
  const handleAddDeliverable = () => {
    if (formDeliverableInput.trim()) {
      if (!formDeliverables.includes(formDeliverableInput.trim())) {
        const next = [...formDeliverables, formDeliverableInput.trim()];
        setFormDeliverables(next);
        updateDraft({ deliverables: next });
      }
      setFormDeliverableInput('');
    }
  };

  // Remove deliverable tag
  const handleRemoveDeliverable = (tag: string) => {
    const next = formDeliverables.filter((t) => t !== tag);
    setFormDeliverables(next);
    updateDraft({ deliverables: next });
  };

  // Clear draft
  const handleClearDraft = () => {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    setFormTitle('');
    setFormSlug('');
    setFormCategory('Web Development');
    setFormStatus('published');
    setFormDescription('');
    setFormFullOverview('');
    setFormImage('');
    setFormVideoUrl('');
    setFormProjectLink('');
    setFormClientScope('');
    setFormYear('2026');
    setFormDeliverables(['Responsive Web App', 'UI/UX Design']);
    setImageError(null);
    setImageVerified(false);
    setSaveError(null);
    showToast('Draft cleared.');
  };

  // Helper to copy project structure formatted for src/data/studioData.ts
  const handleCopyProjectCode = (proj: {
    id?: string;
    slug?: string;
    title?: string;
    category?: string;
    filterCategory?: PortfolioCategory;
    description?: string;
    fullOverview?: string;
    image?: string;
    videoUrl?: string;
    projectLink?: string;
    deliverables?: string[];
    clientScope?: string;
    year?: string;
  }) => {
    const slug = proj.slug || 'my-project-slug';
    const title = proj.title || 'My Project Name';
    const category = proj.category || 'Web Development';
    const filterCategory = proj.filterCategory || 'Web Development';
    const description = proj.description || '';
    const fullOverview = proj.fullOverview || '';
    const deliverables = proj.deliverables && proj.deliverables.length > 0 ? proj.deliverables : ['Responsive Design', 'Interactive UI'];
    const clientScope = proj.clientScope || 'Client Engagement';
    const year = proj.year || '2026';

    const snippet = `  {
    id: ${JSON.stringify(slug)},
    slug: ${JSON.stringify(slug)},
    title: ${JSON.stringify(title)},
    category: ${JSON.stringify(category)},
    filterCategory: ${JSON.stringify(filterCategory)},
    description: ${JSON.stringify(description)},
    fullOverview: ${JSON.stringify(fullOverview)},${proj.image ? `\n    image: ${JSON.stringify(proj.image)},` : ''}${proj.videoUrl ? `\n    videoUrl: ${JSON.stringify(proj.videoUrl)},` : ''}${proj.projectLink ? `\n    projectLink: ${JSON.stringify(proj.projectLink)},` : ''}
    deliverables: ${JSON.stringify(deliverables)},
    clientScope: ${JSON.stringify(clientScope)},
    year: ${JSON.stringify(year)},
  },`;

    navigator.clipboard.writeText(snippet)
      .then(() => {
        showToast('TypeScript code copied! You can paste it into src/data/studioData.ts');
      })
      .catch(() => {
        showToast('Code ready to copy into src/data/studioData.ts.');
      });
  };

  // Save Project with comprehensive validation and dual-persistence resilience
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalLoading) return;
    setSaveError(null);

    const title = formTitle.trim();
    const slug = formSlug.trim();
    const description = formDescription.trim();
    const fullOverview = formFullOverview.trim();
    const image = formImage.trim();
    const videoUrl = formVideoUrl.trim();

    if (!title || !slug || !description || !fullOverview) {
      setSaveError('Please fill in required fields: Project Title, URL Slug, Short Description, and Full Overview.');
      return;
    }

    // Image validation if provided
    if (image) {
      const imgCheck = validateImageUrl(image);
      if (!imgCheck.isValid) {
        setSaveError(imgCheck.error || 'Please enter a valid HTTP or HTTPS image URL.');
        return;
      }
    }

    // Video validation if provided
    let cleanVideoUrl = videoUrl;
    if (videoUrl) {
      const vidCheck = parseAndConvertVideoUrl(videoUrl);
      if (!vidCheck.isValid) {
        setSaveError(vidCheck.error || 'Please enter a valid YouTube, Vimeo, or video stream URL.');
        return;
      }
      if (vidCheck.embedUrl) {
        cleanVideoUrl = vidCheck.embedUrl;
      }
    }

    setModalLoading(true);
    try {
      if (editingProject) {
        // Update existing project
        const result = await updateProject(editingProject.id, {
          title,
          slug,
          category: formCategory,
          filterCategory: formCategory,
          status: formStatus,
          description,
          fullOverview,
          image,
          videoUrl: cleanVideoUrl,
          projectLink: formProjectLink.trim(),
          clientScope: formClientScope.trim(),
          year: formYear.trim(),
          deliverables: formDeliverables,
        });
        if (result.syncedToCloud) {
          showToast(`Project "${title}" updated in Supabase database.`);
        } else {
          showToast(`Project "${title}" updated. (${result.message})`);
        }
      } else {
        // Create new project
        const result = await createProject({
          title,
          slug,
          category: formCategory,
          filterCategory: formCategory,
          status: formStatus,
          description,
          fullOverview,
          image,
          videoUrl: cleanVideoUrl,
          projectLink: formProjectLink.trim(),
          clientScope: formClientScope.trim(),
          year: formYear.trim(),
          deliverables: formDeliverables,
        });
        if (result.syncedToCloud) {
          showToast(`Project "${title}" created and saved to Supabase!`);
        } else {
          showToast(`Project "${title}" saved. (${result.message})`);
        }
      }

      // Cleanup draft on successful persist
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      setIsModalOpen(false);
      await loadProjects();
    } catch (err: unknown) {
      console.error('Save failed:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setSaveError(`Failed to save project: ${errMsg}. All entered information has been preserved.`);
      showToast('Error saving project. Your entered information is preserved.');
      // Keep modal open so administrator does not lose inputs
    } finally {
      setModalLoading(false);
    }
  };

  // Toggle publish / draft
  const handleToggleStatus = async (proj: ProjectRecord) => {
    const nextStatus = proj.status === 'published' ? 'draft' : 'published';
    try {
      await updateProject(proj.id, { status: nextStatus });
      setProjects((prev) =>
        prev.map((p) => (p.id === proj.id ? { ...p, status: nextStatus } : p))
      );
      showToast(`Project "${proj.title}" set to ${nextStatus}.`);
    } catch (err) {
      console.error('Toggle status failed:', err);
      showToast('Failed to update project status.');
    }
  };

  // Open Delete confirmation modal
  const handleOpenDeleteModal = (proj: ProjectRecord) => {
    setProjectToDelete(proj);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete project
  const handleConfirmDelete = async () => {
    if (!projectToDelete || deleteLoading) return;

    if (!isAdmin) {
      setDeleteError('Action restricted: Only the authorized studio administrator can delete projects.');
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const result: ProjectDeleteResult = await deleteProject(projectToDelete.id, projectToDelete.slug);
      setProjects((prev) =>
        prev.filter((p) => p.id !== projectToDelete.id && p.slug !== projectToDelete.slug)
      );
      showToast(result.message || `Project "${projectToDelete.title}" deleted successfully.`);
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
      await loadProjects();
    } catch (err: unknown) {
      console.warn('Delete failed:', err);
      const msg = err instanceof Error ? err.message : 'Failed to delete project.';
      setDeleteError(msg);
      showToast(`Delete failed: ${msg}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Message status update
  const handleMessageStatus = async (
    msg: ContactMessageRecord,
    newStatus: ContactMessageRecord['status']
  ) => {
    try {
      await updateMessageStatus(msg.id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: newStatus } : m))
      );
      showToast(`Inquiry marked as ${newStatus}.`);
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Delete message
  const handleDeleteMessage = async (msg: ContactMessageRecord) => {
    try {
      await deleteMessage(msg.id);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      showToast('Inquiry deleted.');
    } catch (err) {
      console.error('Delete message failed:', err);
      showToast('Failed to delete inquiry.');
    }
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = categoryFilter === 'All' || p.filterCategory === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#080A14] flex items-center justify-center text-gray-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin" />
          <span>Verifying administrator permissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080A14] text-white flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#FF6A00] text-white text-sm font-medium rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-30 bg-[#0B0E1B]/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Logo size={36} showText={true} />
            </div>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#FF6A00]/15 text-[#FF6A00] text-xs font-semibold uppercase tracking-wider border border-[#FF6A00]/30">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Link
              to="/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs transition-colors border border-white/5"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </Link>

            {sbUser ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-300">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="hidden sm:inline font-mono">Supabase Auth:</span>
                <span>Active</span>
              </div>
            ) : (
              <button
                onClick={() => setIsSupabaseAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF6A00]/15 hover:bg-[#FF6A00]/25 border border-[#FF6A00]/40 text-xs text-[#FF6A00] font-semibold transition-colors cursor-pointer"
                title="Sign in with your Supabase administrator password to enable direct media uploads"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Connect Supabase</span>
              </button>
            )}

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="truncate max-w-[160px]">{user?.email}</span>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs border border-red-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-white/5 bg-[#0A0D18]">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#FF6A00] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Projects & Portfolio</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-black/30">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-[#FF6A00] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Inquiries & Messages</span>
            {messages.filter((m) => m.status === 'new').length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-amber-500 text-black font-bold">
                {messages.filter((m) => m.status === 'new').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#FF6A00] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Categories (8)</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'system'
                ? 'bg-[#FF6A00] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Database & Storage</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* ===================== TAB 1: PROJECTS ===================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Top metrics and actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0F1424] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Total Records</p>
                  <p className="text-2xl font-bold text-white mt-1">{projects.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1424] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Published</p>
                  <p className="text-2xl font-bold text-green-400 mt-1">{publishedCount}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0F1424] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Drafts (Hidden)</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">{draftCount}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-[#0F1424] border border-white/5">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#e65f00] text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-[#FF6A00]/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>

                <button
                  onClick={handleSeedDatabase}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                  title="Upload baseline showcase projects into Firestore"
                >
                  <FolderSync className="w-4 h-4 text-[#FF6A00]" />
                  <span>Seed Baseline Projects</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="pl-9 pr-3 py-2 bg-black/30 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]"
                  />
                </div>

                {/* Category select */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {/* Status select */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6A00]"
                >
                  <option value="All">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Projects List */}
            {projectsLoading ? (
              <div className="p-12 text-center text-gray-400">
                <div className="w-6 h-6 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <span>Fetching projects from Cloud Firestore...</span>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-12 text-center rounded-xl bg-[#0F1424] border border-white/5">
                <Layers className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-300 font-medium">No projects found</p>
                <p className="text-xs text-gray-500 mt-1">
                  Adjust your search filters or click &ldquo;Seed Baseline Projects&rdquo; to populate initial records.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    className="group rounded-2xl bg-[#0F1424] border border-white/5 overflow-hidden flex flex-col hover:border-[#FF6A00]/40 transition-all duration-300 shadow-lg"
                  >
                    {/* Media thumbnail */}
                    <div className="relative h-44 bg-black/40 overflow-hidden">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <FileText className="w-12 h-12 stroke-[1.2]" />
                        </div>
                      )}

                      {/* Status badge */}
                      <div className="absolute top-3 left-3">
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 cursor-pointer transition-colors ${
                            p.status === 'published'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/40 hover:bg-green-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          }`}
                          title="Click to toggle publish/draft"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.status === 'published' ? 'bg-green-400' : 'bg-amber-400'
                            }`}
                          />
                          <span>{p.status}</span>
                        </button>
                      </div>

                      {/* Category tag */}
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-gray-300 text-[10px] font-medium border border-white/10">
                        {p.filterCategory}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-white group-hover:text-[#FF6A00] transition-colors line-clamp-1">
                          {p.title}
                        </h3>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">/projects/{p.slug}</p>
                        <p className="text-xs text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>

                        {/* Deliverables tags */}
                        {p.deliverables && p.deliverables.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {p.deliverables.slice(0, 3).map((d) => (
                              <span
                                key={d}
                                className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-gray-400 border border-white/5"
                              >
                                {d}
                              </span>
                            ))}
                            {p.deliverables.length > 3 && (
                              <span className="text-[10px] text-gray-500 self-center">
                                +{p.deliverables.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
                        <Link
                          to={`/projects/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </Link>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyProjectCode(p)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                            title="Copy TypeScript snippet for src/data/studioData.ts"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#FF6A00] transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(p)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: INQUIRIES & MESSAGES ===================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Client Inquiries & Briefs</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Direct inquiries received from the public website contact form
                </p>
              </div>
              <button
                onClick={loadMessages}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FolderSync className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span>Refresh Inbox</span>
              </button>
            </div>

            {messagesLoading ? (
              <div className="p-12 text-center text-gray-400">
                <div className="w-6 h-6 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <span>Loading messages from Cloud Firestore...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center rounded-xl bg-[#0F1424] border border-white/5">
                <Inbox className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-300 font-medium">No inquiries received yet</p>
                <p className="text-xs text-gray-500 mt-1">
                  When potential clients submit the contact form, messages appear here securely in real time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-6 rounded-2xl bg-[#0F1424] border transition-all ${
                      m.status === 'new'
                        ? 'border-[#FF6A00]/40 shadow-lg shadow-[#FF6A00]/5'
                        : 'border-white/5'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FF6A00]/15 text-[#FF6A00] flex items-center justify-center font-bold text-sm">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-white">{m.name}</h4>
                          <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                            <span>{new Date(m.createdAt).toLocaleString()}</span>
                            <span>&bull;</span>
                            <span className="text-[#FF6A00] font-medium">{m.service}</span>
                          </p>
                        </div>
                      </div>

                      {/* Status badges & actions */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            m.status === 'new'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : m.status === 'read'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}
                        >
                          {m.status.toUpperCase()}
                        </span>

                        <select
                          value={m.status}
                          onChange={(e) =>
                            handleMessageStatus(m, e.target.value as ContactMessageRecord['status'])
                          }
                          className="px-2 py-1 bg-black/40 border border-white/10 rounded text-xs text-gray-300 focus:outline-none"
                        >
                          <option value="new">Mark New</option>
                          <option value="read">Mark Read</option>
                          <option value="responded">Mark Responded</option>
                          <option value="archived">Mark Archived</option>
                        </select>

                        <button
                          onClick={() => handleDeleteMessage(m)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Contact metadata */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-300 mb-4 pb-4 border-b border-white/5">
                      <a
                        href={`mailto:${m.email}`}
                        className="flex items-center gap-1.5 text-gray-300 hover:text-[#FF6A00] transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{m.email}</span>
                      </a>
                      {m.phone && (
                        <a
                          href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-gray-300 hover:text-green-400 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{m.phone} (WhatsApp)</span>
                        </a>
                      )}
                    </div>

                    {/* Message Body */}
                    <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap bg-black/20 p-4 rounded-xl border border-white/5 font-sans">
                      {m.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: CATEGORIES ===================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Portfolio Taxonomy & Categories</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                The 8 verified disciplines supported across the KC NEXUS portfolio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((cat, idx) => {
                const count = projects.filter((p) => p.filterCategory === cat).length;
                return (
                  <div
                    key={cat}
                    className="p-5 rounded-2xl bg-[#0F1424] border border-white/5 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-mono text-[#FF6A00]">0{idx + 1}</span>
                      <h4 className="text-base font-semibold text-white mt-1">{cat}</h4>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <span>{count} Project{count !== 1 ? 's' : ''}</span>
                      <span className="text-green-400 font-medium">Active</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: SYSTEM & DATABASE ===================== */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Cloud Infrastructure & Security</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Real-time Firebase backend connection details and zero-trust policies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supabase kc-nexus details */}
              <div className="p-6 rounded-2xl bg-[#0F1424] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-[#FF6A00] flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Supabase Cloud</h3>
                    <p className="text-xs text-green-400 font-medium">
                      {isSupabaseConfigured() ? 'Active & Connected' : 'Project Configured (Publishable Key Pending)'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Project Name</span>
                    <span className="text-white font-semibold">kc-nexus</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Project Endpoint</span>
                    <span className="text-white truncate max-w-[210px]" title={SUPABASE_URL}>
                      {SUPABASE_URL}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Storage Bucket</span>
                    <span className="text-[#FF6A00] font-semibold">{PORTFOLIO_STORAGE_BUCKET}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-400">Database Engine</span>
                    <span className="text-white">PostgreSQL with Row Level Security</span>
                  </div>
                </div>
              </div>

              {/* Zero-Trust Security */}
              <div className="p-6 rounded-2xl bg-[#0F1424] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Zero-Trust ABAC Security</h3>
                    <p className="text-xs text-blue-300 font-medium">PostgreSQL Row Level Security (RLS)</p>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>Public visitors can ONLY read records where <code className="text-[#FF6A00]">status = &apos;published&apos;</code>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>Draft projects are hidden at the PostgreSQL engine level.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>Direct file uploads to <code className="text-[#FF6A00]">portfolio-media</code> are restricted to the authorized administrator.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>Existing baseline portfolio projects always remain available as safe fallback.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Supabase Schema & Storage Policies SQL Reference */}
            <div className="p-6 rounded-2xl bg-[#0F1424] border border-white/10 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6A00]/15 text-[#FF6A00] flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Database &amp; Storage SQL Policies</h3>
                    <p className="text-xs text-gray-400">
                      Run this script in your Supabase SQL Editor if you need to create the table or configure Storage policies
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const sql = `-- Supabase Schema & Storage Policies for KC NEXUS
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  filter_category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  description TEXT NOT NULL,
  full_overview TEXT NOT NULL,
  image TEXT,
  video_url TEXT,
  project_link TEXT,
  client_scope TEXT,
  year TEXT DEFAULT '2026',
  deliverables JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published projects" ON public.projects
  FOR SELECT USING (status = 'published' OR (auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com');

CREATE POLICY "Admin insert projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com');

CREATE POLICY "Admin update projects" ON public.projects
  FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com');

CREATE POLICY "Admin delete projects" ON public.projects
  FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com');

-- Storage Policies for portfolio-media:
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Read Portfolio Media" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-media');

CREATE POLICY "Admin Upload Portfolio Media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'portfolio-media' AND (auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com'
  );

CREATE POLICY "Admin Update Portfolio Media" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'portfolio-media' AND (auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com'
  );

CREATE POLICY "Admin Delete Portfolio Media" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'portfolio-media' AND (auth.jwt() ->> 'email') = 'okoobenikelechisalvation@gmail.com'
  );`;
                    navigator.clipboard.writeText(sql).then(() => {
                      showToast('Full Supabase SQL script copied to clipboard!');
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#FF6A00]/15 hover:bg-[#FF6A00]/25 text-[#FF6A00] text-xs font-semibold border border-[#FF6A00]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL Script</span>
                </button>
              </div>

              <div className="bg-black/60 rounded-xl p-4 border border-white/5 font-mono text-[11px] text-gray-300 max-h-48 overflow-y-auto leading-relaxed">
                <span className="text-[#FF6A00]">-- 1. Storage bucket configuration</span><br />
                INSERT INTO storage.buckets (id, name, public) VALUES (&apos;portfolio-media&apos;, &apos;portfolio-media&apos;, true);<br />
                <br />
                <span className="text-[#FF6A00]">-- 2. Storage RLS policies for administrator uploads</span><br />
                CREATE POLICY &quot;Admin Upload Portfolio Media&quot; ON storage.objects<br />
                &nbsp;&nbsp;FOR INSERT TO authenticated WITH CHECK (<br />
                &nbsp;&nbsp;&nbsp;&nbsp;bucket_id = &apos;portfolio-media&apos; AND (auth.jwt() -&gt;&gt; &apos;email&apos;) = &apos;okoobenikelechisalvation@gmail.com&apos;<br />
                &nbsp;&nbsp;);
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===================== PROJECT EDIT / CREATE MODAL ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0F1424] border border-white/10 rounded-2xl p-6 shadow-2xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h3>
                <p className="text-xs text-gray-400">
                  Fill in the details to publish or stage a creative work
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProject} className="space-y-4">
              {/* Save / Validation Error Banner */}
              {saveError && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-300">Action Required</p>
                    <p className="mt-0.5 leading-relaxed">{saveError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSaveError(null)}
                    className="text-red-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.preventDefault();
                    }}
                    placeholder="e.g. Minimalist Identity System"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    URL Slug * (auto-generated)
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => {
                      setFormSlug(e.target.value);
                      updateDraft({ slug: e.target.value });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.preventDefault();
                    }}
                    placeholder="e.g. minimalist-identity-system"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white font-mono placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Portfolio Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const cat = e.target.value as PortfolioCategory;
                      setFormCategory(cat);
                      updateDraft({ category: cat });
                    }}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#FF6A00]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Publication Status *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormStatus('published');
                        updateDraft({ status: 'published' });
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        formStatus === 'published'
                          ? 'bg-green-500/20 text-green-300 border-green-500/50'
                          : 'bg-black/30 text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span>Published (Live)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormStatus('draft');
                        updateDraft({ status: 'draft' });
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        formStatus === 'draft'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-black/30 text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Draft (Hidden)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Short Description (Synopsis) *
                </label>
                <input
                  type="text"
                  required
                  value={formDescription}
                  onChange={(e) => {
                    setFormDescription(e.target.value);
                    updateDraft({ description: e.target.value });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  placeholder="A concise one-line summary for grid previews"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              {/* Full Overview */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Full Project Overview &amp; Case Study *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formFullOverview}
                  onChange={(e) => {
                    setFormFullOverview(e.target.value);
                    updateDraft({ fullOverview: e.target.value });
                  }}
                  placeholder="Detailed project context, methodology, tools, and results..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00] resize-y"
                />
              </div>

              {/* ==================== 1. IMAGE HANDLING (Supabase Storage & Direct URLs) ==================== */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#FF6A00]" />
                    <span>Featured Image (Supabase Storage or Direct Image URL)</span>
                  </label>
                  {formImage && formImage.includes('supabase.co/storage') && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-500/20 text-green-300 border border-green-500/40 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Supabase Storage</span>
                    </span>
                  )}
                </div>

                {/* Notice if administrator has not connected Supabase session yet */}
                {!sbUser && (
                  <div className="p-3 rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-xs text-orange-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#FF6A00] shrink-0" />
                      <span>Direct device uploads to Supabase Storage require an active Supabase administrator session.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSupabaseAuthModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-[#FF6A00] hover:bg-[#e65f00] text-white text-[11px] font-semibold cursor-pointer shrink-0 transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                {/* Direct Upload Button to portfolio-media */}
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF6A00]/15 hover:bg-[#FF6A00]/25 border border-[#FF6A00]/40 text-[#FF6A00] text-xs font-semibold cursor-pointer transition-colors">
                    {imageUploading ? (
                      <div className="w-3.5 h-3.5 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {imageUploading
                        ? imageUploadProgress
                        : 'Upload Image from Device (portfolio-media)'}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                      disabled={imageUploading}
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-gray-500">or paste direct image URL below</span>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => handleImageChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.preventDefault();
                    }}
                    placeholder="https://... direct image link or uploaded file URL"
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]"
                  />
                  {formImage && (
                    <button
                      type="button"
                      onClick={() => handleImageChange('')}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white text-xs p-0.5"
                      title="Clear image URL"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Image Error Alert */}
                {imageError && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{imageError}</span>
                  </div>
                )}

                {/* Image Live Preview */}
                {formImage && !imageError && (
                  <div className="mt-2 flex items-start gap-4 p-3 rounded-lg bg-black/40 border border-white/5">
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0">
                      <img
                        src={formImage}
                        alt="Project Preview"
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          setImageVerified(true);
                          setImageError(null);
                        }}
                        onError={() => {
                          setImageVerified(false);
                          setImageError('Could not load image from this URL. Please verify the URL points directly to an image file.');
                        }}
                      />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center gap-1.5 text-green-400 font-medium mb-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>{imageVerified ? 'Image Verified & Loaded' : 'Validating image...'}</span>
                      </div>
                      <p className="text-gray-400 text-[11px] truncate max-w-sm font-mono">
                        {formImage}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Ready for display on public portfolio.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ==================== 2. VIDEO HANDLING (Supabase Storage & YouTube Embeds) ==================== */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#FF6A00]" />
                    <span>Video Presentation (Direct Upload or YouTube/Vimeo)</span>
                  </label>
                  {formVideoUrl && formVideoUrl.includes('supabase.co/storage') ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-500/20 text-green-300 border border-green-500/40 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Supabase Video</span>
                    </span>
                  ) : formVideoUrl ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {parseAndConvertVideoUrl(formVideoUrl).platform.toUpperCase()}
                    </span>
                  ) : null}
                </div>

                {/* Direct Video Upload Button to portfolio-media */}
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 text-xs font-semibold cursor-pointer transition-colors">
                    {videoUploading ? (
                      <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {videoUploading
                        ? videoUploadProgress
                        : 'Upload Video File (MP4, WebM, MOV)'}
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/ogg"
                      disabled={videoUploading}
                      onChange={handleVideoFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-gray-500">or paste YouTube / video stream URL below</span>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    value={formVideoUrl}
                    onChange={(e) => handleVideoChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.preventDefault();
                    }}
                    placeholder="https://... video URL or YouTube watch/shorts link"
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]"
                  />
                  {formVideoUrl && (
                    <button
                      type="button"
                      onClick={() => handleVideoChange('')}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white text-xs p-0.5"
                      title="Clear video URL"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Video Preview Player */}
                {formVideoUrl && (
                  <div className="mt-2 p-3 rounded-lg bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <span className="flex items-center gap-1.5 text-green-400 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>Ready for Portfolio Embedding</span>
                      </span>
                    </div>

                    <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-white/10 bg-black">
                      {isEmbedVideo(formVideoUrl) ? (
                        <iframe
                          src={getEmbedVideoUrl(formVideoUrl)}
                          title="Video Player Preview"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={formVideoUrl}
                          controls
                          className="w-full h-full object-contain bg-black"
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Demo Link */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Live Project URL (Optional)
                </label>
                <input
                  type="url"
                  value={formProjectLink}
                  onChange={(e) => {
                    setFormProjectLink(e.target.value);
                    updateDraft({ projectLink: e.target.value });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              {/* Client Scope & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Client Engagement Scope
                  </label>
                  <input
                    type="text"
                    value={formClientScope}
                    onChange={(e) => {
                      setFormClientScope(e.target.value);
                      updateDraft({ clientScope: e.target.value });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.preventDefault();
                    }}
                    placeholder="e.g. Commercial Brand Identity"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Year</label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => {
                      setFormYear(e.target.value);
                      updateDraft({ year: e.target.value });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.preventDefault();
                    }}
                    placeholder="2026"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]"
                  />
                </div>
              </div>

              {/* Deliverables Tags */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Deliverables &amp; Technology Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formDeliverableInput}
                    onChange={(e) => setFormDeliverableInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDeliverable();
                      }
                    }}
                    placeholder="Type tag and press Add..."
                    className="flex-1 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {formDeliverables.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-200 flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(tag)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Buttons & Safety Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  {!editingProject && (
                    <button
                      type="button"
                      onClick={handleClearDraft}
                      disabled={modalLoading}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      Clear Unsaved Draft
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyProjectCode({
                        slug: formSlug,
                        title: formTitle,
                        category: formCategory,
                        filterCategory: formCategory,
                        description: formDescription,
                        fullOverview: formFullOverview,
                        image: formImage,
                        videoUrl: formVideoUrl,
                        projectLink: formProjectLink,
                        deliverables: formDeliverables,
                        clientScope: formClientScope,
                        year: formYear,
                      })
                    }
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Copy this project as a TypeScript object to paste into src/data/studioData.ts"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#FF6A00]" />
                    <span>Copy for studioData.ts</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={modalLoading}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="px-5 py-2 rounded-xl bg-[#FF6A00] hover:bg-[#e65f00] text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {modalLoading && (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>
                      {modalLoading
                        ? 'Saving Project...'
                        : editingProject
                        ? 'Update Project'
                        : 'Create Project'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== DELETE CONFIRMATION MODAL ===================== */}
      {isDeleteModalOpen && projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0F1424] border border-red-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Project</h3>
                <p className="text-xs text-gray-400">This action permanently deletes the project record</p>
              </div>
            </div>

            <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-4 text-xs text-gray-300 space-y-1.5">
              <p className="font-semibold text-white text-sm">{projectToDelete.title}</p>
              <p className="font-mono text-gray-400 text-[11px]">/projects/{projectToDelete.slug}</p>
              <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1">
                <span>Category: <strong className="text-[#FF6A00]">{projectToDelete.filterCategory}</strong></span>
                <span>&bull;</span>
                <span className="capitalize">Status: <strong>{projectToDelete.status}</strong></span>
              </div>
            </div>

            {deleteError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-300">Deletion Notice</p>
                  <p className="mt-0.5 leading-relaxed">{deleteError}</p>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400 mb-5 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">&ldquo;{projectToDelete.title}&rdquo;</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProjectToDelete(null);
                  setDeleteError(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-red-600/20"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting Project...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== QUICK SUPABASE AUTH MODAL ===================== */}
      {isSupabaseAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0F1424] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF6A00]/15 flex items-center justify-center text-[#FF6A00]">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Connect Supabase Session</h3>
                  <p className="text-[11px] text-gray-400">Enables direct uploads to portfolio-media bucket</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSupabaseAuthModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {supabaseLoginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{supabaseLoginError}</span>
              </div>
            )}

            <form onSubmit={handleSupabaseQuickLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Administrator Email
                </label>
                <input
                  type="email"
                  disabled
                  value="okoobenikelechisalvation@gmail.com"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-gray-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Supabase Password
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={supabaseLoginPassword}
                  onChange={(e) => setSupabaseLoginPassword(e.target.value)}
                  placeholder="Enter your administrator password"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSupabaseAuthModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sbAuthenticating}
                  className="px-4 py-2 rounded-xl bg-[#FF6A00] hover:bg-[#e65f00] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {sbAuthenticating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-3.5 h-3.5" />
                      <span>Authenticate Session</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
