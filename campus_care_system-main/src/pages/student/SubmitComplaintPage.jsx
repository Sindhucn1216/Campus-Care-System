import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_PRIORITIES,
  CAMPUS_LOCATIONS,
} from '../../constants';
import {
  PlusCircle,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Camera,
  MapPin,
  Building,
} from 'lucide-react';

const SAMPLE_PRESET_IMAGES = [
  { label: 'Wi-Fi / Network Issue', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600' },
  { label: 'AC / Water Dripping', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=600' },
  { label: 'Waste / Cleanliness', url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=600' },
  { label: 'Broken Step / Tile', url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&q=80&w=600' },
];

export const SubmitComplaintPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createNewComplaint } = useComplaints();
  const { currentUser } = useAuth();

  const prefillCat = searchParams.get('category') || '';

  const [formData, setFormData] = useState({
    title: '',
    categoryName: prefillCat || 'IT and Wi-Fi',
    categoryId: 'cat-2',
    location: CAMPUS_LOCATIONS[0],
    specificLocation: '',
    description: '',
    priority: 'Medium',
    imageUrl: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCategorySelect = (cat) => {
    setFormData((prev) => ({
      ...prev,
      categoryName: cat.name,
      categoryId: cat.id,
    }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image size exceeds 5MB limit.' }));
      return;
    }

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: 'Please upload a JPEG, PNG, or WebP image.' }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: null }));
    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (preset) => {
    setImagePreview(preset.url);
    setFileName(preset.label);
    setFormData((prev) => ({ ...prev, imageUrl: preset.url }));
    setErrors((prev) => ({ ...prev, image: null }));
  };

  const removeImage = () => {
    setImagePreview(null);
    setFileName('');
    setFormData((prev) => ({ ...prev, imageUrl: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Complaint title is required.';
    else if (formData.title.trim().length < 8) newErrors.title = 'Title must be at least 8 characters long.';

    if (!formData.description.trim()) newErrors.description = 'Please provide a detailed description.';
    else if (formData.description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters.';

    if (!formData.location) newErrors.location = 'Campus location is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const result = await createNewComplaint(formData);
      setSubmittedComplaint(result);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (submittedComplaint?.complaintCode) {
      navigator.clipboard.writeText(submittedComplaint.complaintCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedComplaint) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Grievance Successfully Registered
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-900">
              Complaint ID Generated
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Your grievance has been cataloged and routed to the corresponding department desk.
            </p>
          </div>

          {/* Ticket ID Box */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between max-w-sm mx-auto">
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-blue-600">
                Official Tracking Code
              </p>
              <p className="font-mono text-xl font-extrabold text-blue-900 mt-0.5">
                {submittedComplaint.complaintCode}
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="p-2.5 rounded-xl bg-white border border-blue-200 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm flex items-center gap-1.5 text-xs font-semibold"
              title="Copy ID"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Ticket Details Summary */}
          <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Title:</span>
              <span className="font-semibold text-slate-800">{submittedComplaint.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target Department:</span>
              <span className="font-semibold text-slate-800">{submittedComplaint.departmentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold text-slate-800">{submittedComplaint.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-semibold text-blue-600">Submitted (Pending Triage)</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/track?id=${submittedComplaint.complaintCode}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25"
            >
              <span>Track Resolution Live</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                setSubmittedComplaint(null);
                setFormData({
                  title: '',
                  categoryName: 'IT and Wi-Fi',
                  categoryId: 'cat-2',
                  location: CAMPUS_LOCATIONS[0],
                  specificLocation: '',
                  description: '',
                  priority: 'Medium',
                  imageUrl: null,
                });
                setImagePreview(null);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-medium transition-colors"
            >
              Submit Another Grievance
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Note: In production with the MySQL backend, complaint ID sequences are guaranteed atomic by the database schema.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Campus Helpdesk Intake
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-900 mt-2">
          Lodge a Campus Complaint
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Submitting as <span className="font-semibold text-slate-800">{currentUser?.name}</span> ({currentUser?.role || 'Student'}). All valid reports receive assigned technician tracking within 4 business hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            1. Select Grievance Category *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {COMPLAINT_CATEGORIES.map((cat) => {
              const isSelected = formData.categoryName === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold">{cat.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">{cat.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            2. Complaint Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, title: e.target.value }));
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            placeholder="e.g., Broken projector HDMI connection in Turing Hall 102"
            className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              errors.title ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-blue-500'
            }`}
          />
          {errors.title && (
            <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Location & Room Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              3. Campus Building / Block *
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Specific Floor / Room / Lab (Optional)
            </label>
            <input
              type="text"
              value={formData.specificLocation}
              onChange={(e) => setFormData((prev) => ({ ...prev, specificLocation: e.target.value }))}
              placeholder="e.g. 2nd Floor, Room 204 or Lab 3B"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            4. Perceived Urgency / Priority
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Object.values(COMPLAINT_PRIORITIES).map((pri) => (
              <button
                key={pri}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, priority: pri }))}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  formData.priority === pri
                    ? pri === 'Urgent'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20'
                      : pri === 'High'
                      ? 'bg-orange-50 border-orange-500 text-orange-700 ring-2 ring-orange-500/20'
                      : pri === 'Medium'
                      ? 'bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-500/20'
                      : 'bg-slate-100 border-slate-400 text-slate-800 ring-2 ring-slate-400/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {pri}
              </button>
            ))}
          </div>
        </div>

        {/* Description with Character Counter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              5. Comprehensive Description *
            </label>
            <span
              className={`text-xs ${
                formData.description.length < 20
                  ? 'text-amber-600 font-medium'
                  : 'text-slate-400'
              }`}
            >
              {formData.description.length} characters (min 20)
            </span>
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, description: e.target.value }));
              if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
            }}
            rows={4}
            placeholder="Clearly describe the malfunction, when it started, and any hazards or academic impact..."
            className={`w-full p-3.5 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              errors.description ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-blue-500'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Optional Image Upload with Preview & Presets */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            6. Photo Evidence Attachment (Optional)
          </label>

          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-w-sm">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end justify-between p-3 text-white">
                <span className="text-xs truncate max-w-[200px] font-mono">{fileName || 'Attached Image'}</span>
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-xs font-semibold text-slate-700">Click to upload photo evidence</span>
                <span className="text-[11px] text-slate-400 mt-0.5">JPEG, PNG, or WebP up to 5MB</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Or attach quick sample:</span>
                {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {errors.image && (
            <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.image}
            </p>
          )}
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/25 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            {isSubmitting ? 'Registering Grievance...' : 'Submit Grievance'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitComplaintPage;
