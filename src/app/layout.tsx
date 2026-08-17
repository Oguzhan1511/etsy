import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext";
import { TokenProvider } from "../context/TokenContext";
import ClientShell from "../components/ClientShell";
import CountdownBanner from "../components/CountdownBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "PrintySell — Dashboard",
  description: "Premium SaaS dashboard for PrintySell",
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

import { ThemeProvider } from "../components/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className="flex flex-col h-screen overflow-hidden bg-background text-foreground antialiased transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
          <LanguageProvider>
              <TokenProvider>
                <CountdownBanner />
                <div className="flex flex-1 overflow-hidden w-full relative">
                  <ClientShell>{children}</ClientShell>
                </div>
              </TokenProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
