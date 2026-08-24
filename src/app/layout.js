// src/app/layout.js
import { Inter, Poppins, Fraunces } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import JsonLd from "@/components/ui/JsonLd";
import { generateOrganizationSchema } from "@/utils/helpers";
import { WishlistProvider } from "@/context/WishlistContext";
import Link from "next/link";
import { ThemeProvider } from "@/context/ThemeContext";
import { OwnerAuthProvider } from "@/context/OwnerAuthContext";
import { getSiteSettings } from "@/lib/services/settingsService";
import { SITE_NAME } from "@/lib/siteConfig";

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

const fraunces = Fraunces({ // ⬅️ ADD
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://localkokani.vercel.app"),
  title: {
    default: `${SITE_NAME} | Book Hotels & Explore Top Destinations`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Discover handpicked hotels across top destinations. Best prices, verified stays, instant WhatsApp booking assistance.",
  keywords: ["hotel booking", "destinations", "travel", "hotels"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Book Hotels & Explore Top Destinations`,
    description: "Discover handpicked hotels across top destinations. Best prices, verified stays.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${fraunces.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('Local Kokani_theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans bg-gray-50 dark:bg-gray-950 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased transition-colors">
        <Link
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Skip to main content
        </Link>
        <JsonLd data={generateOrganizationSchema()} />
        <ThemeProvider>
          <AuthProvider>
            <OwnerAuthProvider>
              <WishlistProvider>
                <NextTopLoader color="#3193a6" showSpinner={false} height={3} />
                <Navbar logoUrl={settings.logo?.url} />
                <main id="main-content" className="min-h-screen">
                  {children}
                </main>
                 <Footer logoUrl={settings.logo?.url} />
                <Toaster position="top-center" />
              </WishlistProvider>
            </OwnerAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}