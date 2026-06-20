"use client";

import { useState } from "react";
import { Send, CheckCircle2, User, Mail, FileText, MessageSquare } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="py-20 bg-cream border-t border-primary/5">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-secondary font-semibold font-sans">
            Get in touch
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-2">
            Let's Collaborate
          </h2>
          <p className="text-charcoal/70 text-sm max-w-md mx-auto mt-4 font-sans leading-relaxed">
            Interested in booking a custom travel consult, planning a project, or partnering on a sponsorship? Fill out the form below.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-primary/10 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden transition-all duration-300">
          {isSubmitted ? (
            /* Success State */
            <div className="text-center py-12 flex flex-col items-center justify-center gap-6 animate-scaleIn">
              <div className="p-4 bg-accent/10 text-accent rounded-full border border-accent/20">
                <CheckCircle2 className="w-16 h-16 text-primary fill-accent animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif font-bold text-primary">
                  Journal Entry Logged!
                </h3>
                <p className="text-sm text-charcoal/70 max-w-sm mx-auto font-sans leading-relaxed">
                  Thank you for reaching out. Your message has been routed directly to our inbox. We will get back to you within 24-48 hours.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-primary text-cream hover:bg-secondary font-sans font-semibold tracking-wider text-xs uppercase rounded-lg shadow transition-colors duration-300"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* Form Fields */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2 relative">
                  <label htmlFor="name" className="text-xs uppercase tracking-wider text-primary font-bold font-sans">
                    Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-charcoal/40">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 bg-cream/35 border border-primary/10 rounded-xl font-sans text-sm focus:outline-none focus:border-accent focus:bg-white text-charcoal transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2 relative">
                  <label htmlFor="email" className="text-xs uppercase tracking-wider text-primary font-bold font-sans">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-charcoal/40">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                      className="w-full pl-10 pr-4 py-3 bg-cream/35 border border-primary/10 rounded-xl font-sans text-sm focus:outline-none focus:border-accent focus:bg-white text-charcoal transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2 relative">
                <label htmlFor="subject" className="text-xs uppercase tracking-wider text-primary font-bold font-sans">
                  Subject
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-charcoal/40">
                    <FileText className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject of inquiry"
                    className="w-full pl-10 pr-4 py-3 bg-cream/35 border border-primary/10 rounded-xl font-sans text-sm focus:outline-none focus:border-accent focus:bg-white text-charcoal transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2 relative">
                <label htmlFor="message" className="text-xs uppercase tracking-wider text-primary font-bold font-sans">
                  Message
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-charcoal/40">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your travel mission or collaboration request details here..."
                    className="w-full pl-10 pr-4 py-3 bg-cream/35 border border-primary/10 rounded-xl font-sans text-sm focus:outline-none focus:border-accent focus:bg-white text-charcoal transition-all duration-300 resize-y"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-primary font-sans font-semibold tracking-widest text-sm uppercase rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Transmitting...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 fill-primary stroke-none" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
