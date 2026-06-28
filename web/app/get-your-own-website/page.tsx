"use client";

import { useState } from "react";
import { Share2, Compass } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function GetYourOwnWebsitePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);

  const handleShare = async () => {
    const shareData = {
      title: "Explorush - Get Your Own Website",
      text: "Get your own custom-built premium website! Inquire here.",
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        showToast("Thanks for sharing Explorush!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        showToast("Link copied successfully!");
      })
      .catch(() => {
        showToast("Failed to copy link.");
      });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <>
      <Navbar />

      <main className="bg-cream text-charcoal min-h-screen font-sans">
        {/* HEADER SECTION */}
        <section className="max-w-4xl mx-auto px-6 pt-14 pb-8 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans">
            Connect & Services
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-primary mt-2">
            Get Your Own Website
          </h1>
          <p className="text-charcoal/70 text-sm md:text-base leading-relaxed max-w-lg mx-auto font-sans">
            Looking for a premium, custom-designed website to showcase your brand, portfolios, or travel business? Share your vision and let's bring it to life!
          </p>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 hover:border-primary text-primary hover:bg-primary/5 font-sans font-semibold text-xs tracking-widest uppercase rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              aria-label="Share this services page link"
            >
              <Share2 className="w-3.5 h-3.5 text-accent" />
              <span>Share Form</span>
            </button>
          </div>
        </section>

        {/* GOOGLE FORM EMBED */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="w-full max-w-[940px] mx-auto bg-white rounded-2xl shadow-lg border border-primary/10 overflow-hidden my-4 relative min-h-[400px]">
            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 gap-3">
                <Compass className="w-8 h-8 text-primary animate-spin-slow" />
                <p className="text-xs text-charcoal/50 font-sans tracking-widest uppercase font-semibold">Loading Form...</p>
              </div>
            )}
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScQ4HM7s_UF7uAORemyS7ppJnRJ11W6wHWKE7CiPOifInpM7Q/viewform?embedded=true"
              width="100%"
              height="2800"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Get Your Own Website Form"
              className="w-full block"
              loading="lazy"
              onLoad={() => setIframeLoading(false)}
            >
              Loading…
            </iframe>
          </div>
        </section>
      </main>

      <Footer />

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-primary text-cream rounded-xl shadow-2xl border border-accent/20 flex items-center gap-3 font-sans text-sm font-medium"
          >
            <Compass className="w-4 h-4 text-accent animate-spin-slow" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
