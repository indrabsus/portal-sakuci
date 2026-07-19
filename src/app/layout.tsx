import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, Italianno } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TopLoadingBar } from "@/components/top-loading-bar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontCertificate = Italianno({
  variable: "--font-certificate",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Portal Sakuci",
  description: "Portal e-learning & manajemen akademik",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${fontSans.variable} ${fontMono.variable} ${fontCertificate.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <TopLoadingBar />
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
