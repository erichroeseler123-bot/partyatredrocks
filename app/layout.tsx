import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import "@/styles/globals.css"; // Ensure your global styles are imported

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-black text-white">
        <Navbar />
        {children}
        <Footer />
        
        {/* Your Verified GTM ID from the screenshot */}
        <GoogleTagManager gtmId="GTM-TG86VJC" />
      </body>
    </html>
  );
}
