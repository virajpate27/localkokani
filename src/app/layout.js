// src/app/layout.js
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import JsonLd from "@/components/ui/JsonLd";
import { generateOrganizationSchema } from "@/utils/helpers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // ✅ already set
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap", // ✅ already set
});

export const metadata = {
  metadataBase: new URL("https://localkokani.vercel.app"),
  title: {
    default: "StayFinder | Book Hotels & Explore Top Destinations",
    template: "%s | StayFinder",
  },
  description:
    "Discover handpicked hotels across top destinations. Best prices, verified stays, instant WhatsApp booking assistance.",
  keywords: ["hotel booking", "destinations", "travel", "hotels"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "StayFinder",
  },
  twitter: {
    card: "summary_large_image",
    title: "StayFinder | Book Hotels & Explore Top Destinations",
    description:
      "Discover handpicked hotels across top destinations. Best prices, verified stays.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans bg-gray-50 text-gray-900 antialiased">
         <JsonLd data={generateOrganizationSchema()} />
        <AuthProvider>
          <NextTopLoader color="#3193a6" showSpinner={false} height={3} />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}