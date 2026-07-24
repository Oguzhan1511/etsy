"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, ServerCrash, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";

interface ErrorLog {
  id: string;
  message: string;
  stack: string | null;
  source: string;
  resolved: boolean;
  createdAt: string;
}

export default function AdminErrorsPage() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchErrors = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/errors");
      const data = await res.json();
      if (data.success) {
        setErrors(data.errors);
      }
    } catch (err) {
      console.error("Failed to fetch errors", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            Sistem Hataları
          </h1>
          <p className="text-white/50 mt-1">Platformda meydana gelen backend ve API (Etsy vb.) hatalarını canlı izleyin.</p>
        </div>
        
        <button 
          onClick={fetchErrors}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Yenile
        </button>
      </div>

      {isLoading && errors.length === 0 ? (
        <div className="h-40 w-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {errors.map((error) => (
            <div key={error.id} className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 shrink-0 mt-1">
                  <ServerCrash className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="font-bold text-red-100 truncate">{error.message}</h3>
                    <span className="shrink-0 text-xs text-white/40 font-mono">
                      {new Date(error.createdAt).toLocaleString('tr-TR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white/70 uppercase tracking-wider">
                      Kaynak: {error.source}
                    </span>
                    {!error.resolved && (
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase tracking-wider">
                        Çözülmedi
                      </span>
                    )}
                  </div>

                  {error.stack && (
                    <div className="mt-3 p-3 rounded-xl bg-black/50 border border-white/5 overflow-x-auto">
                      <pre className="text-xs text-red-200/60 font-mono whitespace-pre-wrap break-words">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {errors.length === 0 && !isLoading && (
            <div className="p-12 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sistem Harika Çalışıyor!</h3>
              <p className="text-white/50">Şu an veritabanında kaydedilmiş herhangi bir hata kaydı (Error Log) bulunmuyor.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
