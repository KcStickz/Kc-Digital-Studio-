import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, AlertCircle, Copy, Check, ArrowRight, Sparkles } from 'lucide-react';
import { CONTACT_INFO } from '../data/studioData';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const serviceFromQuery = searchParams.get('service');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: serviceFromQuery || 'Web Development',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    if (serviceFromQuery) {
      setFormData((prev) => ({ ...prev, service: serviceFromQuery }));
    }
  }, [serviceFromQuery]);

  const serviceOptions = [
    'Web Development',
    'Software Development',
    'Graphic Design',
    'Photography',
    'Videography',
    'Video Editing',
    'Social Media Management',
    'IT Support',
    'Other',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your name';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.service) {
      errs.service = 'Please select a required service';
    }
    if (!formData.subject.trim()) {
      errs.subject = 'Please enter a project subject';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please describe your project or enquiry';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Please provide at least 10 characters in your message';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const savedInquiries = JSON.parse(localStorage.getItem('kc_nexus_inquiries') || '[]');
        savedInquiries.push({
          ...formData,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem('kc_nexus_inquiries', JSON.stringify(savedInquiries));
      } catch {
        // local storage fallback
      }

      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  const handleCopyInquiry = () => {
    const textToCopy = `KC NEXUS ENQUIRY\nName: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\nSubject: ${formData.subject}\nMessage:\n${formData.message}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handleSendViaWhatsApp = () => {
    const encoded = encodeURIComponent(
      `Hello KC NEXUS,\nMy name is ${formData.name || 'a client'}.\nI'm inquiring about *${formData.service}*.\nSubject: ${formData.subject || 'Creative Consultation'}\nDetails: ${formData.message || 'I would like to discuss a project.'}`
    );
    window.open(`https://wa.me/2348145691772?text=${encoded}`, '_blank');
  };

  return (
    <div className="pt-28 pb-20">
      {/* Background Curved Lines */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 pointer-events-none opacity-20">
        <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
          <circle cx="200" cy="200" r="180" stroke="#FFA500" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="200" cy="200" r="130" stroke="#FFA500" strokeWidth="1" opacity="0.6" />
          <path d="M 50 200 Q 200 50 350 200" stroke="#FFA500" strokeWidth="2" opacity="0.4" />
        </svg>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121727] border border-[#FFA500]/40 text-[#FFA500] text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Communication</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Let's Work Together
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#B8BDCA] max-w-2xl leading-relaxed">
            Have a project in mind or need a reliable digital creative partner? Whether you need a website, graphics, photography, videography, video editing, social media management, or technical IT support, reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          {/* LEFT COLUMN: Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Studio Direct Channels</h3>

              {/* Email */}
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#080A14] flex items-center justify-center text-[#FFA500] border border-[#282D40] shrink-0">
                  <Mail className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-semibold text-[#858DA2] uppercase tracking-wider">
                    Official Email
                  </span>
                  <span className="text-sm font-medium text-white group-hover:text-[#FFA500] transition-colors truncate">
                    {CONTACT_INFO.email}
                  </span>
                </div>
              </a>

              {/* Phone 1 */}
              <a
                href={`tel:${CONTACT_INFO.phone1.replace(/\s+/g, '')}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#080A14] flex items-center justify-center text-[#FFA500] border border-[#282D40] shrink-0">
                  <Phone className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-[#858DA2] uppercase tracking-wider">
                    Direct Phone Line
                  </span>
                  <span className="text-sm font-medium text-white group-hover:text-[#FFA500] transition-colors font-mono">
                    {CONTACT_INFO.phone1}
                  </span>
                </div>
              </a>

              {/* Phone 2 */}
              <a
                href={`tel:${CONTACT_INFO.phone2.replace(/\s+/g, '')}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#080A14] flex items-center justify-center text-[#FFA500] border border-[#282D40] shrink-0">
                  <Phone className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-[#858DA2] uppercase tracking-wider">
                    Additional Mobile
                  </span>
                  <span className="text-sm font-medium text-white group-hover:text-[#FFA500] transition-colors font-mono">
                    {CONTACT_INFO.phone2}
                  </span>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#121727] border border-[#282D40]">
                <div className="w-10 h-10 rounded-lg bg-[#080A14] flex items-center justify-center text-[#FFA500] border border-[#282D40] shrink-0">
                  <MapPin className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-[#858DA2] uppercase tracking-wider">
                    Studio Location
                  </span>
                  <span className="text-sm font-medium text-white">
                    {CONTACT_INFO.location}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Integration Button */}
            <div className="pt-4">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#25D366]/20"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#121727] border border-[#282D40] p-6 sm:p-8 lg:p-10 shadow-2xl relative">
              {submitted ? (
                <div className="py-8 flex flex-col items-center text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#FFA500]/20 flex items-center justify-center text-[#FFA500]">
                    <CheckCircle className="w-10 h-10 stroke-[2]" />
                  </div>

                  <h3 className="text-2xl font-bold text-white">Enquiry Prepared Successfully!</h3>

                  <div className="p-4 rounded-xl bg-[#080A14] border border-[#282D40] text-xs text-[#B8BDCA] text-left max-w-md w-full space-y-2">
                    <p className="font-semibold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFA500]" />
                      Recorded Details:
                    </p>
                    <p><strong className="text-white/80">From:</strong> {formData.name} ({formData.email})</p>
                    <p><strong className="text-white/80">Service:</strong> {formData.service}</p>
                    <p><strong className="text-white/80">Subject:</strong> {formData.subject}</p>
                  </div>

                  <div className="text-xs text-[#858DA2] max-w-md leading-relaxed bg-[#161B2D] p-3.5 rounded-lg border border-[#FFA500]/30">
                    <span className="text-[#FFA500] font-semibold">Production Status:</span> Inquiry is saved locally in studio records. To deliver your message immediately via WhatsApp or Email, use the direct buttons below.
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
                    <button
                      type="button"
                      onClick={handleSendViaWhatsApp}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 fill-black" />
                      Forward to WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyInquiry}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#080A14] hover:bg-[#161B2D] border border-[#282D40] text-white text-xs font-semibold transition-colors"
                    >
                      {copiedNotification ? <Check className="w-4 h-4 text-[#FFA500]" /> : <Copy className="w-4 h-4 text-[#FFA500]" />}
                      {copiedNotification ? 'Copied to Clipboard' : 'Copy Inquiry Text'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        service: 'Web Development',
                        subject: '',
                        message: '',
                      });
                    }}
                    className="text-xs text-[#FFA500] hover:underline pt-2"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="border-b border-[#282D40] pb-4 mb-2">
                    <h3 className="text-xl font-bold text-white">Project Consultation Form</h3>
                    <p className="text-xs text-[#858DA2] mt-1">
                      Direct brief submission to OKO-OBENI KELECHI SALVATION.
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-white/90 mb-1.5">
                      Your Name <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="e.g. John Doe or Brand Name"
                      className={`w-full px-4 py-3 rounded-xl bg-[#080A14] border ${
                        errors.name ? 'border-red-500' : 'border-[#282D40] focus:border-[#FFA500]'
                      } text-sm text-white placeholder-[#858DA2] focus:outline-none transition-colors`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-white/90 mb-1.5">
                      Your Email <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="you@domain.com"
                      className={`w-full px-4 py-3 rounded-xl bg-[#080A14] border ${
                        errors.email ? 'border-red-500' : 'border-[#282D40] focus:border-[#FFA500]'
                      } text-sm text-white placeholder-[#858DA2] focus:outline-none transition-colors`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Service Required */}
                  <div>
                    <label htmlFor="service" className="block text-xs font-semibold text-white/90 mb-1.5">
                      Service Required <span className="text-[#FFA500]">*</span>
                    </label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => {
                        setFormData({ ...formData, service: e.target.value });
                        if (errors.service) setErrors({ ...errors, service: '' });
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-[#080A14] border border-[#282D40] focus:border-[#FFA500] text-sm text-white focus:outline-none transition-colors"
                    >
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#080A14] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold text-white/90 mb-1.5">
                      Project Subject <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: '' });
                      }}
                      placeholder="e.g. Website Redesign & Branding"
                      className={`w-full px-4 py-3 rounded-xl bg-[#080A14] border ${
                        errors.subject ? 'border-red-500' : 'border-[#282D40] focus:border-[#FFA500]'
                      } text-sm text-white placeholder-[#858DA2] focus:outline-none transition-colors`}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-white/90 mb-1.5">
                      Your Message <span className="text-[#FFA500]">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: '' });
                      }}
                      placeholder="Tell us about your project objectives, timeline, or questions..."
                      className={`w-full px-4 py-3 rounded-xl bg-[#080A14] border ${
                        errors.message ? 'border-red-500' : 'border-[#282D40] focus:border-[#FFA500]'
                      } text-sm text-white placeholder-[#858DA2] focus:outline-none transition-colors resize-none`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#FFA500] hover:bg-[#FFB52E] text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#FFA500]/25 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Processing Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
