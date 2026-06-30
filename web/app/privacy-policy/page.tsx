import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | Explorush",
  description: "Privacy Policy for Explorush - Learn how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream text-charcoal min-h-screen py-16 font-sans">
        <div className="max-w-4xl mx-auto px-6 bg-white border border-primary/10 rounded-3xl p-8 md:p-12 shadow-xl mt-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">Privacy Policy</h1>
          <p className="text-charcoal/60 text-xs mb-8">Last Updated: June 30, 2026</p>
          
          <div className="space-y-6 text-sm md:text-base leading-relaxed text-charcoal/80">
            <p>Explorush ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your details when you visit our website <a href="https://explorush.vercel.app" className="text-accent underline font-semibold">explorush.vercel.app</a>.</p>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">1. Information We Collect</h2>
              <p>Depending on how you interact with our website, we may collect the following information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Personal Identifiable Information:</strong> Name, email address, phone number, Instagram username, and billing/shipping address (when registering for trips or inquiries).</li>
                <li><strong>Feedback & Form Responses:</strong> Any details you voluntarily provide through our support forms, trip registrations, or collaboration applications.</li>
                <li><strong>Automatic Data:</strong> IP address, browser type, operating system, and viewing behavior through analytics tools.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">2. How We Use Your Information</h2>
              <p>We use the collected information for purposes including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Managing, executing, and confirming your trip registrations and tour bookings.</li>
                <li>Responding to your support queries, bug reports, and feedback.</li>
                <li>Communicating details about website development queries or collaborations.</li>
                <li>Analyzing visitor behavior to improve website speeds, user interface, and overall user experience.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">3. Data Controller & Security</h2>
              <p>The Data Controller for your information is <strong>Harsh Chorghe</strong>. We implement appropriate technical and organizational measures to safeguard your personal data from unauthorized access, modification, or disclosure. However, please note that no internet transmission is 100% secure.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">4. Cookies</h2>
              <p>We may use cookies and similar tracking technologies to store settings, optimize performance, and personalize content. You can manage or disable cookies via your browser settings.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">5. Third-Party Services</h2>
              <p>Our website integrates with or links to third-party services such as Google, YouTube, Instagram, WhatsApp, and our payment gateways (e.g., PayU). These external sites have separate and independent privacy policies. We encourage you to review their policies upon redirection.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">6. Your Rights</h2>
              <p>You have the right to access, update, correct, or request deletion of your personal data collected by us. If you wish to execute any of these rights, please email us directly.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">7. Contact Details</h2>
              <p>For any privacy-related queries, you can reach out to us at:</p>
              <div className="bg-cream/40 p-4 rounded-xl border border-primary/5 text-xs md:text-sm font-mono text-charcoal/80 space-y-1 leading-normal">
                <strong>Operator/Data Controller:</strong> Harsh Chorghe<br />
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
