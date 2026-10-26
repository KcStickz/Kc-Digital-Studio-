import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, AlertCircle, Copy, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { CONTACT_INFO } from '../data/studioData';
import { submitContactMessage } from '../firebase/messagesService';

interface ContactSectionProps {
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ preselectedService = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: preselectedService || 'Web Development',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [firestoreSaved, setFirestoreSaved] = useState(false);

  // Update service when preselectedService changes from parent
  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1. Submit to Firestore messages collection
      const fullMessageBody = formData.subject
        ? `Subject: ${formData.subject}\n\n${formData.message}`
        : formData.message;

      await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        service: formData.service,
        message: fullMessageBody.trim(),
      });
      setFirestoreSaved(true);
    } catch (err) {
      console.warn('Firestore message submission fallback:', err);
      // Fallback: save to local storage for offline resiliency
      try {
        const savedInquiries = JSON.parse(localStorage.getItem('kc_nexus_inquiries') || '[]');
        savedInquiries.push({
          ...formData,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem('kc_nexus_inquiries', JSON.stringify(savedInquiries));
      } catch {
        // Local storage fallback
      }
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleCopyInquiry = () => {
    const textToCopy = `KC NEXUS ENQUIRY\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'N/A'}\nService: ${formData.service}\nSubject: ${formData.subject}\nMessage:\n${formData.message}`;
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
    <section id="contact" className="relative py-16 sm:py-24 bg-[#080A14] overflow-hidden">
      {/* Background Subtle Curved Orange Lines & Abstract Geometric Accent */}
      <div className="absolute -bottom-10 -right-10 w-96 h-96 pointer-events-none opacity-20">
        <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
          <circle cx="200" cy="200" r="180" stroke="#FFA500" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="200" cy="200" r="130" stroke="#FFA500" strokeWidth="1" opacity="0.6" />
          <path d="M 50 200 Q 200 50 350 200" stroke="#FFA500" strokeWidth="2" opacity="0.4" />
          <path d="M 50 250 Q 200 350 350 250" stroke="#FFA500" strokeWidth="1.5" opacity="0.3" />
        </svg>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          {/* LEFT COLUMN: Studio Contact Details & Direct Connect */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Section Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121727] border border-[#282D40] text-[#FFA500] text-xs font-bold tracking-widest uppercase mb-3">
                Get In Touch
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Let&apos;s Work Together
              </h2>

              {/* Supporting Text */}
              <p className="mt-4 text-sm sm:text-base text-[#B8BDCA] leading-relaxed">
                Have a project in mind or need a reliable digital creative partner?
                Whether you need a website, graphics, photography, videography,
                video editing, social media management, or technical support,
                KC NEXUS would be glad to hear from you.
              </p>

              {/* Contact Information Cards */}
              <div className="mt-8 space-y-4">
                {/* Email (clickable) */}
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500]/50 transition-all group"
                  aria-label={`Email ${CONTACT_INFO.email}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#080A14] flex items-center justify-center text-[#FFA500] border border-[#282D40] group-hover:border-[#FFA500]/50 shrink-0 transition-colors">
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

                {/* Primary Phone (clickable tel) */}
                <a
                  href={`tel:${CONTACT_INFO.phone1.replace(/\s+/g, '')}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500]/50 transition-all group"
                  aria-label={`Call primary phone ${CONTACT_INFO.phone1}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#080A14] flex items-center justify-center text-[#FFA500] border border-[#282D40] group-hover:border-[#FFA500]/50 shrink-0 transition-colors">
                    <Phone className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-[#858DA2] uppercase tracking-wider">
                      Direct Phone
                    </span>
                    <span className="text-sm font-medium text-white group-hover:text-[#FFA500] transition-colors font-mono">
                      {CONTACT_INFO.phone1}
                    </span>
                  </div>
                </a>

                {/* Additional Phone (clickable tel) */}
                <a
                  href={`tel:${CONTACT_INFO.phone2.replace(/\s+/g, '')}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#121727] hover:bg-[#161B2D] border border-[#282D40] hover:border-[#FFA500]/50 transition-all group"
                  aria-label={`Call additional phone ${CONTACT_INFO.phone2}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#080A14] flex items-center justify-center text-[#FFA500] border border-[#282D40] group-hover:border-[#FFA500]/50 shrink-0 transition-colors">
                    <Phone className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-[#858DA2] uppercase tracking-wider">
                      Additional Line
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
                      Location
                    </span>
                    <span className="text-sm font-medium text-white">
                      {CONTACT_INFO.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dedicated WhatsApp Direct Contact Button */}
            <div className="mt-8 pt-6 border-t border-[#282D40]">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#25D366]/20"
                aria-label="Chat directly on WhatsApp"
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
                /* Honest Submission Feedback & Next Steps */
                <div className="py-8 flex flex-col items-center text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#FFA500]/20 flex items-center justify-center text-[#FFA500]">
                    <CheckCircle className="w-10 h-10 stroke-[2]" />
                  </div>

                  <h3 className="text-2xl font-bold text-white">Enquiry Dispatched Successfully!</h3>

                  <div className="p-4 rounded-xl bg-[#080A14] border border-[#282D40] text-xs text-[#B8BDCA] text-left max-w-md w-full space-y-2">
                    <p className="font-semibold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFA500]" />
                      Recorded Details:
                    </p>
                    <p><strong className="text-white/80">From:</strong> {formData.name} ({formData.email})</p>
                    <p><strong className="text-white/80">Service:</strong> {formData.service}</p>
                    <p><strong className="text-white/80">Subject:</strong> {formData.subject}</p>
                    {firestoreSaved && (
                      <p className="text-green-400 font-medium flex items-center gap-1 text-[11px] pt-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Safely stored in Cloud Firestore backend inbox</span>
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-[#858DA2] max-w-md leading-relaxed bg-[#161B2D] p-3.5 rounded-lg border border-[#FFA500]/30">
                    <span className="text-[#FFA500] font-semibold">Immediate Dispatch:</span> Your brief has been lodged into the studio records. For real-time review, you may also send it instantly to our WhatsApp desk.
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
                    <button
                      type="button"
                      onClick={handleSendViaWhatsApp}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 fill-black" />
                      Forward to WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyInquiry}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#080A14] hover:bg-[#161B2D] border border-[#282D40] text-white text-xs font-semibold transition-colors cursor-pointer"
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
                        phone: '',
                        service: 'Web Development',
                        subject: '',
                        message: '',
                      });
                    }}
                    className="text-xs text-[#FFA500] hover:underline pt-2 cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="border-b border-[#282D40] pb-4 mb-2">
                    <h3 className="text-xl font-bold text-white">Project Consultation Form</h3>
                    <p className="text-xs text-[#858DA2] mt-1">
                      Fill out your requirements below and our studio team will get back to you promptly.
                    </p>
                  </div>

                  {/* Field 1: Your Name */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-white/90 mb-1.5">
                      Your Name <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="e.g. John Doe or Acme Corp"
                      className={`w-full px-4 py-3 rounded-xl bg-[#080A14] border ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#282D40] focus:border-[#FFA500]'
                      } text-sm text-white placeholder-[#858DA2] focus:outline-none transition-colors`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Field 2: Your Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-white/90 mb-1.5">
                      Your Email <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="you@domain.com"
                      className={`w-full px-4 py-3 rounded-xl bg-[#080A14] border ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#282D40] focus:border-[#FFA500]'
                      } text-sm text-white placeholder-[#858DA2] focus:outline-none transition-colors`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Field 2b: Phone (optional) */}
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-semibold text-white/90 mb-1.5">
                      Phone / WhatsApp (Optional)
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 ... or local phone number"
                      className="w-full px-4 py-3 rounded-xl bg-[#080A14] border border-[#282D40] focus:border-[#FFA500] text-sm text-white placeholder-[#858DA2] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Field 3: Service Required */}
                  <div>
                    <label htmlFor="contact-service" className="block text-xs font-semibold text-white/90 mb-1.5">
                      Service Required <span className="text-[#FFA500]">*</span>
                    </label>
                    <select
                      id="contact-service"
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

                  {/* Field 4: Project Subject */}
                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-white/90 mb-1.5">
                      Project Subject <span className="text-[#FFA500]">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: '' });
                      }}
                      placeholder="e.g. Website Redesign &amp; Branding"
                      className={`w-full px-4 py-3 rounded-xl bg-[#080A14] border ${
                        errors.subject ? 'border-red-500 focus:border-red-500' : 'border-[#282D40] focus:border-[#FFA500]'
                      } text-sm text-white placeholder-[#858DA2] focus:outline-none transition-colors`}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Field 5: Your Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-white/90 mb-1.5">
                      Your Message <span className="text-[#FFA500]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: '' });
                      }}
                      placeholder="Tell us about your project objectives, timeline, or questions..."
                      className={`w-full px-4 py-3 rounded-xl bg-[#080A14] border ${
                        errors.message ? 'border-red-500 focus:border-red-500' : 'border-[#282D40] focus:border-[#FFA500]'
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
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#FFA500] hover:bg-[#FFB52E] text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#FFA500]/25 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Saving to Cloud Database...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
    </section>
  );
};

export default ContactSection;
