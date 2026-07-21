import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import ClientShell from "../components/ClientShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "PrintySell — Dashboard",
  description: "Premium SaaS dashboard for PrintySell",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex h-screen overflow-hidden bg-[#09090b] text-[#f1f0ff] antialiased">
        <AuthProvider>
          <ClientShell>{children}</ClientShell>
        </AuthProvider>
      </body>
    </html>
  );
}
