"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, X, AlertCircle } from "lucide-react";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issueType, setIssueType] = useState("bug");
  const [description, setDescription] = useState("");
  const [activeInfoModal, setActiveInfoModal] = useState<"terms" | "privacy" | "refunds" | null>(null);

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<"terms" | "privacy" | "refunds">;
      if (customEvent.detail) {
        setActiveInfoModal(customEvent.detail);
      }
    };
    window.addEventListener("open-footer-modal", handleOpenModal);
    return () => {
      window.removeEventListener("open-footer-modal", handleOpenModal);
    };
  }, []);

  const termsContent = (
    <div className="space-y-4">
      <p className="font-semibold text-primary">Welcome to Explorush!</p>
      <p>By accessing or using Explorush, you agree to comply with and be bound by these Terms of Service. If you do not agree with these terms, please do not use this website.</p>
      
      <div className="space-y-1">
        <h4 className="font-bold text-primary">1. Use of the Website</h4>
        <p>Explorush is intended to provide travel content, blogs, videos, trip information, collaboration opportunities, and website development services.</p>
        <p>You agree to use this website only for lawful purposes and in a manner that does not interfere with the experience of other users.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">2. Intellectual Property</h4>
        <p>Unless otherwise stated, all content available on Explorush—including text, photographs, videos, graphics, logos, branding, website design, and other original materials—is the property of Explorush and may not be copied, reproduced, distributed, or used without prior written permission.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">3. User Submissions</h4>
        <p>By submitting any information through our forms (including feedback, collaboration requests, trip registrations, or website inquiries), you confirm that:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>The information provided is accurate.</li>
          <li>You have the right to submit the information.</li>
          <li>You grant Explorush permission to contact you regarding your inquiry.</li>
        </ul>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">4. Third-Party Services</h4>
        <p>Explorush may integrate or link to third-party platforms such as:</p>
        <p className="text-xs text-charcoal/60">Google Forms, Google Maps, YouTube, Instagram, WhatsApp, and other external services.</p>
        <p>We are not responsible for the privacy practices or content of third-party websites.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">5. Trip Registrations</h4>
        <p>Submitting a trip registration form does not automatically confirm your booking. Trip confirmation is subject to availability, communication, and any additional terms shared during the booking process.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">6. Website Development Services</h4>
        <p>Any pricing displayed or discussed through Explorush is considered an estimated quotation. Final pricing, timelines, deliverables, and project scope will be finalized only after a detailed discussion with the client.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">7. Limitation of Liability</h4>
        <p>While we strive to keep all information accurate and up to date, Explorush does not guarantee that all content is error-free or uninterrupted. Use of this website is at your own discretion.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">8. Changes to These Terms</h4>
        <p>These Terms may be updated from time to time without prior notice. Continued use of the website constitutes acceptance of the updated Terms.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">9. Contact Details</h4>
        <p>If you have any questions regarding these Terms, please contact us at:</p>
        <p className="text-xs">
          <strong>Operator:</strong> Harsh Chorghe<br />
          <strong>Email:</strong> explorushofficial@gmail.com<br />
          <strong>Location:</strong> Mumbai, Maharashtra, India
        </p>
      </div>
    </div>
  );

  const privacyContent = (
    <div className="space-y-4">
      <p className="font-semibold text-primary">Your Privacy Matters</p>
      <p>Explorush respects your privacy and is committed to protecting your personal information.</p>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">Information We Collect</h4>
        <p>Depending on how you interact with our website, we may collect:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Name, Email address, Phone number</li>
          <li>Instagram username</li>
          <li>Feedback responses</li>
          <li>Website inquiry details & Collaboration requests</li>
          <li>Trip registration information</li>
          <li>Any information you voluntarily submit through forms</li>
        </ul>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">How We Use Your Information</h4>
        <p>Your information may be used to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Respond to inquiries</li>
          <li>Contact you regarding collaborations</li>
          <li>Discuss website development projects</li>
          <li>Manage trip registrations</li>
          <li>Improve our website and services</li>
          <li>Analyze user feedback</li>
          <li>Provide customer support</li>
        </ul>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">Data Storage</h4>
        <p>Information submitted through forms may be securely stored using trusted third-party services such as Google Forms, Google Sheets, or other secure platforms used by Explorush.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">Cookies</h4>
        <p>Explorush may use cookies or similar technologies to improve website performance and enhance user experience. You may disable cookies through your browser settings if you prefer.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">Third-Party Services</h4>
        <p>Our website may contain links or integrations with external services including Google, YouTube, Instagram, WhatsApp, and other trusted platforms. These services have their own privacy policies, and we encourage you to review them.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">Data Sharing</h4>
        <p>We do not sell or rent your personal information to third parties. Your information is only used for the purposes described in this Privacy Policy unless required by law.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">Data Security</h4>
        <p>We take reasonable measures to protect your information from unauthorized access, misuse, or disclosure. However, no online platform can guarantee 100% security.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">Your Rights</h4>
        <p>You may request to access your personal information, correct inaccurate information, or request deletion of your information (where applicable). To make such a request, please contact us through the website.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">Children's Privacy</h4>
        <p>Explorush is not intended for children under the age of 13. We do not knowingly collect personal information from children.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">Changes to This Privacy Policy</h4>
        <p>This Privacy Policy may be updated from time to time. Any updates will be published on this page.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">Contact Us</h4>
        <p>If you have any questions about this Privacy Policy or how your information is handled, please contact us at:</p>
        <p className="text-xs">
          <strong>Operator:</strong> Harsh Chorghe<br />
          <strong>Email:</strong> explorushofficial@gmail.com<br />
          <strong>Location:</strong> Mumbai, Maharashtra, India
        </p>
      </div>
    </div>
  );

  const refundsContent = (
    <div className="space-y-4">
      <p className="font-semibold text-primary">Refund & Cancellation Policy</p>
      <p>At Explorush, we want you to have a great experience. Please read our cancellation and refund policies carefully before booking any trips or services.</p>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">1. Trip / Tour Bookings</h4>
        <p>Because tour planning involves advanced bookings (stays, transit, and local guides), the following cancellation charges apply:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Cancellation 15 days or more before departure:</strong> 100% refund of the booking amount.</li>
          <li><strong>Cancellation between 7 to 14 days before departure:</strong> 50% refund of the booking amount.</li>
          <li><strong>Cancellation less than 7 days before departure:</strong> No refund will be provided.</li>
        </ul>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">2. Service & Digital Deliverables</h4>
        <p>For custom digital solutions, photography licensing, or website development services, cancellations and milestone payments are governed by the project agreement signed between Explorush and the client. Completed milestone works are non-refundable.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">3. Refund Processing Timeline</h4>
        <p>Once a refund request is approved, the refund will be processed and automatically credited back to your original payment method (Credit/Debit Card, Net Banking, UPI, or Wallet) within <strong>5 to 7 business days</strong>.</p>
      </div>

      <div className="space-y-1">
        <h4 className="font-bold text-primary">4. Contact for Refunds</h4>
        <p>To request a cancellation or refund, please email us at <a href="mailto:explorushofficial@gmail.com" className="text-accent underline font-semibold">explorushofficial@gmail.com</a> with your booking ID and details.</p>
      </div>
    </div>
  );


  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const subject = `[Explorush Support] ${issueType.toUpperCase()}: ${description.slice(0, 30)}${description.length > 30 ? "..." : ""}`;
    const body = `Hello Explorush Team,

I am reporting the following issue or providing feedback on Explorush.

Category: ${issueType.toUpperCase()}
Description:
${description}

--
Sent from Explorush App`;

    const mailtoUrl = `mailto:explorushofficial@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    setDescription("");
    setIsModalOpen(false);
  };
  return (
    <footer className="bg-primary text-cream/90 pt-6 pb-4 border-t border-secondary/30 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-y-6 md:gap-x-8">
        {/* Col 1: About */}
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-serif font-bold text-accent tracking-wide">
            <Compass className="w-5 h-5 text-accent" />
            EXPLORUSH
          </Link>
          <p className="text-xs text-cream/70 font-sans leading-relaxed max-w-sm">
            Real journeys. Raw stories. Every trip a chapter, every destination a world undiscovered. Explore the world through the eyes of a creator.
          </p>
          {/* Social Links */}
          <div className="flex gap-3 pt-1">
            <a href="https://www.instagram.com/_explorush_/" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary/30 hover:bg-secondary/60 rounded-full text-accent transition-all duration-300" title="Instagram">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@Harsh_Chorghe" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary/30 hover:bg-secondary/60 rounded-full text-accent transition-all duration-300" title="YouTube">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/harsh-chorghe-4b65b231b/" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary/30 hover:bg-secondary/60 rounded-full text-accent transition-all duration-300" title="LinkedIn">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-2">
          <h4 className="text-xs font-serif font-bold text-accent tracking-wider uppercase">Navigation</h4>
          <ul className="flex flex-col gap-1.5 font-sans text-xs">
            <li><Link href="/" className="hover:text-accent transition-colors duration-200">Home</Link></li>
            <li><Link href="/about" className="hover:text-accent transition-colors duration-200">About Us</Link></li>
            <li><Link href="/trips" className="hover:text-accent transition-colors duration-200">Destinations</Link></li>
            <li><Link href="/blogs" className="hover:text-accent transition-colors duration-200">Travel Blogs</Link></li>
            <li><Link href="/vlogs" className="hover:text-accent transition-colors duration-200">Vlogs</Link></li>
            <li><Link href="/about#contact" className="hover:text-accent transition-colors duration-200">Contact</Link></li>
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div className="space-y-2">
          <h4 className="text-xs font-serif font-bold text-accent tracking-wider uppercase">Content Info</h4>
          <ul className="flex flex-col gap-1.5 font-sans text-xs">
            <li><Link href="/trips" className="hover:text-accent transition-colors duration-200">Featured Group Tours</Link></li>
            <li><Link href="/blogs" className="hover:text-accent transition-colors duration-200">Travel Guides</Link></li>
            <li><Link href="/about" className="hover:text-accent transition-colors duration-200">Collaborations</Link></li>
            <li>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="hover:text-accent transition-colors duration-200 text-left font-sans text-xs focus:outline-none"
              >
                Report an Issue
              </button>
            </li>
            <li><Link href="/admin" className="hover:text-accent transition-colors duration-200">CMS Admin Dashboard</Link></li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div className="space-y-2">
          <h4 className="text-xs font-serif font-bold text-accent tracking-wider uppercase">Newsletter</h4>
          <p className="text-[11px] text-cream/70 font-sans leading-relaxed">
            Subscribe to get notifications about upcoming group trips, workshops, and exclusive travel diaries.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 pt-1">
            <input
              type="email"
              placeholder="Your email address"
              className="px-3 py-1.5 bg-secondary/20 border border-secondary/40 rounded-lg text-cream placeholder-cream/40 text-xs focus:outline-none focus:border-accent w-full"
              required
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-accent hover:bg-accent/90 text-primary font-sans font-semibold text-xs uppercase rounded-lg transition-colors duration-300"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-secondary/20 mt-6 pt-3 flex flex-col md:flex-row items-center justify-between text-[11px] text-cream/50 gap-3">
        <p>© {new Date().getFullYear()} Explorush. All rights reserved.</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center md:justify-end">
          <button
            onClick={() => setActiveInfoModal("terms")}
            className="hover:text-accent transition-colors duration-200 cursor-pointer outline-none font-sans text-xs text-cream/50"
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveInfoModal("privacy")}
            className="hover:text-accent transition-colors duration-200 cursor-pointer outline-none font-sans text-xs text-cream/50"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveInfoModal("refunds")}
            className="hover:text-accent transition-colors duration-200 cursor-pointer outline-none font-sans text-xs text-cream/50"
          >
            Refunds & Cancellations
          </button>
        </div>
      </div>

      {/* Support & Issue Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-cream border border-secondary/35 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative p-6 space-y-4 text-charcoal">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-1.5 rounded-full text-charcoal/60 hover:text-primary hover:bg-secondary/20 transition-all duration-300 absolute top-4 right-4"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
                <Compass className="w-5 h-5 text-accent animate-spin-slow" />
                Report an Issue
              </h3>
              <p className="text-xs text-charcoal/60">
                Help us improve Explorush. Share what went wrong, and we will open a free email draft for you to send.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitIssue} className="space-y-4 pt-1">
              {/* Category */}
              <div className="space-y-1">
                <label htmlFor="issue-category" className="text-[10px] uppercase tracking-wider text-primary font-bold">
                  Issue Type
                </label>
                <select
                  id="issue-category"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-primary/10 rounded-xl font-sans text-xs focus:outline-none focus:border-primary text-charcoal outline-none cursor-pointer"
                >
                  <option value="bug">Bug / Technical Issue</option>
                  <option value="content_error">Content Error</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="general_feedback">General Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label htmlFor="issue-description" className="text-[10px] uppercase tracking-wider text-primary font-bold">
                  Problem Description *
                </label>
                <textarea
                  id="issue-description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail. If applicable, mention the page URL or what action caused the error..."
                  className="w-full px-3 py-2.5 bg-white border border-primary/10 rounded-xl font-sans text-xs focus:outline-none focus:border-primary text-charcoal outline-none resize-none h-28"
                />
              </div>

              {/* Notice */}
              <p className="text-[10px] text-charcoal/50 leading-relaxed">
                Clicking submit will open a draft email pre-filled with your description using your device's native email client. Sending is 100% free.
              </p>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-accent/90 text-primary font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
              >
                Open Email Draft
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Terms / Privacy Modal */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-[60] bg-primary/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-cream border border-secondary/35 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh] p-6 text-charcoal">
            {/* Close Button */}
            <button
              onClick={() => setActiveInfoModal(null)}
              className="p-1.5 rounded-full text-charcoal/60 hover:text-primary hover:bg-secondary/20 transition-all duration-300 absolute top-4 right-4 cursor-pointer outline-none"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="border-b border-primary/5 pb-3">
              <h3 className="font-serif font-bold text-2xl text-primary">
                {activeInfoModal === "terms" && "Terms of Service"}
                {activeInfoModal === "privacy" && "Privacy Policy"}
                {activeInfoModal === "refunds" && "Refund & Cancellation Policy"}
              </h3>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pr-2 mt-4 font-sans text-xs sm:text-sm leading-relaxed text-charcoal/80">
              {activeInfoModal === "terms" && termsContent}
              {activeInfoModal === "privacy" && privacyContent}
              {activeInfoModal === "refunds" && refundsContent}
            </div>

            {/* Footer Action */}
            <div className="border-t border-primary/5 pt-4 mt-4 flex justify-end">
              <button
                onClick={() => setActiveInfoModal(null)}
                className="px-6 py-2 bg-primary hover:bg-secondary text-cream font-sans font-semibold text-xs uppercase tracking-wider rounded-xl transition duration-300 shadow-md cursor-pointer outline-none"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
