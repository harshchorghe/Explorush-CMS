import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | Explorush",
  description: "Contact us for support, inquiries, feedback, or booking information.",
};

export default function ContactUsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-cream text-charcoal min-h-screen py-16 font-sans">
        <div className="max-w-4xl mx-auto px-6 bg-white border border-primary/10 rounded-3xl p-8 md:p-12 shadow-xl mt-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">Contact Us</h1>
          <p className="text-charcoal/60 text-sm mb-8">Have questions, feedback, booking issues, or business inquiries? Reach out to us. We usually reply within 24 to 48 hours.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-charcoal/80">
            {/* Contact Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-semibold text-primary">Direct Contact Info</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cream rounded-xl text-accent border border-primary/5">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary text-sm">Email Address</h3>
                    <a href="mailto:explorushofficial@gmail.com" className="text-sm text-charcoal/70 hover:text-accent underline font-mono">
                      explorushofficial@gmail.com
                    </a>
                  </div>
                </div>


                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cream rounded-xl text-accent border border-primary/5">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary text-sm">Support Hours</h3>
                    <p className="text-sm text-charcoal/70">
                      Monday to Saturday: 10:00 AM – 7:00 PM (IST)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Merchant Details */}
            <div className="p-6 bg-cream/40 rounded-2xl border border-primary/5 space-y-4">
              <h2 className="text-lg font-serif font-semibold text-primary">Operator Information</h2>
              <p className="text-xs text-charcoal/60 leading-relaxed">This website is operated by Harsh Chorghe. All booking collections, invoices, and service contracts are processed under these credentials.</p>

              <div className="space-y-2 text-xs font-mono text-charcoal/80 leading-normal">
                <div>
                  <strong>Operator Name:</strong> Harsh Chorghe
                </div>
                <div>
                  <strong> Website:</strong> https://explorush.in
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
