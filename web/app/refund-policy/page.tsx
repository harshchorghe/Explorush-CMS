import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Refund and Cancellation Policy | Explorush",
  description: "Refund and Cancellation Policy for Explorush - Terms regarding trip cancellations and service refunds.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream text-charcoal min-h-screen py-16 font-sans">
        <div className="max-w-4xl mx-auto px-6 bg-white border border-primary/10 rounded-3xl p-8 md:p-12 shadow-xl mt-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">Refund & Cancellation Policy</h1>
          <p className="text-charcoal/60 text-xs mb-8">Last Updated: June 30, 2026</p>
          
          <div className="space-y-6 text-sm md:text-base leading-relaxed text-charcoal/80">
            <p>At Explorush, we aim to provide exceptional travel planning and group experiences. Please read our cancellation and refund policies carefully before booking any trips, activities, or digital services.</p>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">1. Trip & Tour Bookings Cancellation</h2>
              <p>Since tour arrangements, bookings (stays, transit permits, local resources, and guides) involve advanced payments, the following refund terms apply if you cancel your participation:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Cancellation 15 days or more before trip departure:</strong> 100% refund of the booking amount.</li>
                <li><strong>Cancellation between 7 to 14 days before trip departure:</strong> 50% refund of the booking amount.</li>
                <li><strong>Cancellation less than 7 days before trip departure:</strong> No refund will be provided.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">2. Service & Digital Solutions</h2>
              <p>For custom digital web applications, professional photography licenses, or project development contracts, cancellations and payment milestones are strictly guided by the custom project agreement signed between Explorush and the client. Already completed work milestones are non-refundable.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">3. Refund Processing Timelines</h2>
              <p>Once a cancellation request is submitted and approved by our team, refunds are processed automatically back to the customer's original payment method (Credit/Debit Card, Net Banking, UPI, or Wallet) within <strong>5 to 7 working days</strong> (business days).</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif font-semibold text-primary">4. Submission of Refund Requests</h2>
              <p>To register a refund or cancellation request, please email us directly at <a href="mailto:explorushofficial@gmail.com" className="text-accent underline font-semibold">explorushofficial@gmail.com</a> containing your Booking ID, contact details, and transaction confirmation details. Our support team will respond within 24–48 hours.</p>
            </div>
            
            <div className="space-y-2 pt-4 border-t border-primary/5">
              <h2 className="text-base font-serif font-semibold text-primary">5. Contact & Support Details</h2>
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
