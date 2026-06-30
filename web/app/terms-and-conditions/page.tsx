import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms and Conditions | Explorush",
  description: "Terms and Conditions for Explorush - Rules and guidelines for using our website.",
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream text-charcoal min-h-screen py-16 font-sans">
        <div className="max-w-4xl mx-auto px-6 bg-white border border-primary/10 rounded-3xl p-8 md:p-12 shadow-xl mt-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">Terms of Service</h1>
          <p className="text-charcoal/60 text-xs mb-8">Last Updated: June 30, 2026</p>
          
          <div className="space-y-6 text-sm md:text-base leading-relaxed text-charcoal/80">
            <p>Welcome to Explorush! By accessing or using our website <a href="https://explorush.vercel.app" className="text-accent underline font-semibold">explorush.vercel.app</a>, you agree to comply with and be bound by these Terms of Service. Please read them carefully.</p>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">1. Use of the Website</h2>
              <p>Explorush is designed to provide travel content, logs, dynamic map guides, blogs, videos, and options for upcoming tour bookings. You agree to use this site only for lawful and genuine purposes.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">2. Intellectual Property</h2>
              <p>All content available on this site, including text, photographs, layouts, videos, graphics, logos, and website code, is the property of Explorush and is protected by copyright laws. You may not copy, modify, distribute, or publish our content without express written permission.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">3. User Submissions & Bookings</h2>
              <p>When you submit feedback, issues, collaboration queries, or trip registration details, you guarantee that all details provided are accurate and complete. Submitting a registration form does not constitute a guaranteed booking slot; bookings are subject to manual validation, confirmation, and receipt of payments.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">4. Pricing & Service Quotations</h2>
              <p>Pricing for individual trips, tours, or custom website creation services listed on the website represents estimates. Final pricing structures will be detailed in custom agreements or finalized billing quotes before checkout completion.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">5. Third-Party Integrations</h2>
              <p>We work with trusted external platforms (like YouTube, Google Forms, WhatsApp, and merchant service providers). We are not responsible for the performance, reliability, or privacy practices of these third-party platforms.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">6. Limitation of Liability</h2>
              <p>While we make every effort to display correct coordinates, itineraries, prices, and travel parameters, Explorush does not guarantee that the site is entirely error-free. We shall not be liable for any indirect or consequential damages arising from the use of this website.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">7. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">8. Operator Contact Details</h2>
              <p>If you have any questions regarding these Terms, you can contact the website operator at:</p>
              <div className="bg-cream/40 p-4 rounded-xl border border-primary/5 text-xs md:text-sm font-mono text-charcoal/80 space-y-1 leading-normal">
                <strong>Operator:</strong> Harsh Chorghe<br />
                <strong>Email:</strong> explorushofficial@gmail.com<br />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
