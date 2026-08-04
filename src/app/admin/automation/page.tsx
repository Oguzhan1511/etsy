"use client";
import React, { useEffect, useState } from "react";
import { Play, RefreshCw, CheckCircle, XCircle, Clock, Download, ExternalLink } from "lucide-react";

interface VideoJob {
  id: string;
  status: string;
  script: string | null;
  voiceoverUrl: string | null;
  videoUrl: string | null;
  finalVideoUrl: string | null;
  youtubeUrl: string | null;
  errorMessage: string | null;
  falRequestId: string | null;
  createdAt: string;
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'text-yellow-400',
  generating_script: 'text-blue-400',
  generating_audio: 'text-purple-400',
  generating_video: 'text-orange-400',
  merging: 'text-cyan-400',
  uploading: 'text-indigo-400',
  done: 'text-emerald-400',
  failed: 'text-red-400',
};

const STATUS_LABEL: Record<string, string> = {
  pending: '⏳ Bekliyor',
  generating_script: '✍️ Senaryo Yazılıyor',
  generating_audio: '🎙️ Ses Üretiliyor',
  generating_video: '🎬 Video Üretiliyor',
  merging: '🔗 Birleştiriliyor',
  uploading: '📤 Yükleniyor',
  done: '✅ Tamamlandı',
  failed: '❌ Hata',
};

export default function AutomationPage() {
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [selectedJob, setSelectedJob] = useState<VideoJob | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    const res = await fetch('/api/automation/status');
    const data = await res.json();
    setJobs(data.jobs || []);
    setLoading(false);
  };

  const triggerVideo = async () => {
    setTriggering(true);
    const secret = process.env.NEXT_PUBLIC_CRON_SECRET || 'printysell_cron_secret';
    const res = await fetch(`/api/automation/trigger?secret=${secret}`);
    const data = await res.json();
    alert(data.message || data.error || 'Tetiklendi!');
    setTriggering(false);
    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 15000); // auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">🎬 Video Otomasyon Paneli</h1>
            <p className="text-zinc-400 mt-1">PrintySell TikTok & Shorts otomatik video üretim sistemi</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchJobs}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Yenile
            </button>
            <button
              onClick={triggerVideo}
              disabled={triggering}
              className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #7c6af7 0%, #a855f7 100%)' }}
            >
              <Play className="w-4 h-4" />
              {triggering ? 'Tetikleniyor...' : 'Yeni Video Üret'}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {['done', 'generating_video', 'failed', 'pending'].map(s => (
            <div key={s} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className={`text-2xl font-bold ${STATUS_COLOR[s]}`}>
                {jobs.filter(j => j.status === s).length}
              </div>
              <div className="text-zinc-500 text-sm mt-1">{STATUS_LABEL[s]}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jobs List */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-300 mb-4">Son Görevler</h2>
            {jobs.length === 0 && (
              <div className="text-center py-16 text-zinc-600">Henüz görev yok. İlk videoyu üretmek için butona tıklayın.</div>
            )}
            {jobs.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedJob?.id === job.id
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-bold ${STATUS_COLOR[job.status]}`}>
                    {STATUS_LABEL[job.status] || job.status}
                  </span>
                  <span className="text-xs text-zinc-600">
                    {new Date(job.createdAt).toLocaleString('tr-TR')}
                  </span>
                </div>
                {job.script && (
                  <p className="text-xs text-zinc-500 line-clamp-2">{job.script.slice(0, 120)}...</p>
                )}
                {job.errorMessage && (
                  <p className="text-xs text-red-400 mt-1">{job.errorMessage}</p>
                )}
                <div className="flex gap-2 mt-3">
                  {job.voiceoverUrl && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">🎙️ Ses Hazır</span>
                  )}
                  {job.finalVideoUrl && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">🎬 Video Hazır</span>
                  )}
                  {job.youtubeUrl && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">▶️ YouTube&apos;da</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Job Detail */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-8 h-fit">
            {!selectedJob ? (
              <div className="text-center py-16 text-zinc-600">
                <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Detayları görmek için bir göreve tıklayın</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  {selectedJob.status === 'done' ? <CheckCircle className="text-emerald-400 w-5 h-5" /> : selectedJob.status === 'failed' ? <XCircle className="text-red-400 w-5 h-5" /> : <Clock className="text-yellow-400 w-5 h-5" />}
                  <span className={`font-bold ${STATUS_COLOR[selectedJob.status]}`}>{STATUS_LABEL[selectedJob.status]}</span>
                </div>

                {selectedJob.script && (
                  <div>
                    <h3 className="text-xs uppercase font-bold text-zinc-500 mb-2">Senaryo</h3>
                    <div className="bg-black/40 rounded-xl p-3 text-xs text-zinc-300 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                      {selectedJob.script}
                    </div>
                  </div>
                )}

                {selectedJob.voiceoverUrl && (
                  <div>
                    <h3 className="text-xs uppercase font-bold text-zinc-500 mb-2">Seslendirme</h3>
                    <audio controls className="w-full" src={selectedJob.voiceoverUrl} />
                  </div>
                )}

                {selectedJob.finalVideoUrl && (
                  <div>
                    <h3 className="text-xs uppercase font-bold text-zinc-500 mb-2">Video</h3>
                    <video controls className="w-full rounded-xl border border-zinc-700" src={selectedJob.finalVideoUrl} />
                    <a
                      href={selectedJob.finalVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 mt-2 text-xs text-violet-400 hover:text-violet-300"
                    >
                      <Download className="w-3.5 h-3.5" /> Video İndir
                    </a>
                  </div>
                )}

                {selectedJob.youtubeUrl && (
                  <a
                    href={selectedJob.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    YouTube&apos;da İzle
                  </a>
                )}

                {selectedJob.falRequestId && (
                  <div className="text-xs text-zinc-600">
                    fal.ai Request ID: <code className="text-zinc-400">{selectedJob.falRequestId}</code>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
