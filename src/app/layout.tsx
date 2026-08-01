import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Lexend } from "next/font/google";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

// 1. DUAL FONT SYSTEM
// Inter for highly readable body text
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

// Lexend for modern, punchy headings and titles
const lexend = Lexend({ 
  subsets: ["latin"],
  variable: "--font-heading",
});

// 2. RICH METADATA FOR SEO & SOCIAL SHARING
export const metadata: Metadata = {
  title: {
    default: "Quizzzy | AI-Powered Trivia & Quizzes",
    template: "%s", // Automatically formats child page titles (e.g. "Dashboard | Quizzzy")
  },
  description: "Generate personalized quizzes on any topic instantly using the power of AI. Test your knowledge with multiple choice or open-ended questions.",
  keywords: ["quiz", "ai", "trivia", "education", "learning", "nextjs", "openrouter"],
  authors: [
    {
      name: "Vaibhav Samdani",
      url: "https://vaibhavsamdani.dev",
    },
  ],
  creator: "Vaibhav Samdani",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/Vaibhav-Samdani/quizzzy-ai",
    title: "Quizzzy | AI-Powered Trivia & Quizzes",
    description: "Generate personalized quizzes on any topic instantly using the power of AI.",
    siteName: "Quizzzy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quizzzy | AI-Powered Trivia & Quizzes",
    description: "Generate personalized quizzes on any topic instantly using the power of AI.",
  },
};

// 3. VIEWPORT CONFIGURATION
export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // {/* suppressHydrationWarning is MANDATORY when using next-themes to prevent console errors */}
    <html lang="en" className="dark" suppressHydrationWarning>
      <body 
        className={cn(
          inter.variable,
          lexend.variable,
          "font-sans antialiased min-h-screen bg-background text-foreground selection:bg-primary/30"
        )}
      >
        <Providers>
          
        
          <main className="flex-1 pt-2 pb-8">
            {children}
          </main>
          
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}