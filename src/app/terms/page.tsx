"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import TermsContent from '@/components/TermsContent';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl backdrop-blur-sm">
        
        <Link href="/login" className="inline-flex items-center text-sm text-violet-400 hover:text-violet-300 transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Geri Dön
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
          Kullanıcı ve Abonelik Sözleşmesi
        </h1>

        <TermsContent />
      </div>
    </div>
  );
}
