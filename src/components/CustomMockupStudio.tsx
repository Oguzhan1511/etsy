"use client";

import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import { get, set } from "idb-keyval";
import { useLanguage } from "@/context/LanguageContext";
import { UploadCloud, Download, Image as ImageIcon, Trash2, X, Plus } from "lucide-react";

interface DesignItem {
  id: string;
  name: string;
  url: string;
  createdAt: number;
}

interface MockupTemplate {
  id: string;
  url: string;
  createdAt: number;
}

export default function CustomMockupStudio() {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<MockupTemplate[]>([]);
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  
  const [activeTemplate, setActiveTemplate] = useState<MockupTemplate | null>(null);
  const [activeDesign, setActiveDesign] = useState<DesignItem | null>(null);
  
  const [isExporting, setIsExporting] = useState(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTemplates = await get<MockupTemplate[]>("custom_mockups_library");
        if (storedTemplates) setTemplates(storedTemplates);
        
        const storedDesigns = await get<DesignItem[]>("ai_designs_library");
        if (storedDesigns && Array.isArray(storedDesigns)) {
          const realDesigns = storedDesigns.filter(d => 
            d && 
            d.id && 
            !d.id.startsWith("mock-") &&
            !d.url?.includes("unsplash.com")
          );
          setDesigns(realDesigns);
        }
      } catch (err) {
        console.error("Failed to load local data", err);
      }
    };
    loadData();
  }, []);

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newTemplate: MockupTemplate = {
          id: crypto.randomUUID(),
          url: reader.result as string,
          createdAt: Date.now(),
        };
        const newTemplates = [newTemplate, ...templates];
        setTemplates(newTemplates);
        await set("custom_mockups_library", newTemplates);
        setActiveTemplate(newTemplate);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t("mockupPublish.deleteTemplate") + "?")) {
      const newTemplates = templates.filter(t => t.id !== id);
      setTemplates(newTemplates);
      await set("custom_mockups_library", newTemplates);
      if (activeTemplate?.id === id) setActiveTemplate(null);
    }
  };

  const handleExport = async () => {
    if (!captureRef.current || !activeTemplate) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(captureRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2 // High quality
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `mockup_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
      {/* Sidebar: Templates */}
      <div className="lg:w-1/4 space-y-4">
        <div className="bg-card border border-border p-4 rounded-xl">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-400" />
            Şablonlar
          </h3>
          
          <label className="flex items-center justify-center gap-2 w-full p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg cursor-pointer transition-all mb-4 text-sm font-semibold">
            <UploadCloud className="w-4 h-4" />
            {t("mockupPublish.uploadTemplate")}
            <input type="file" accept="image/*" className="hidden" onChange={handleTemplateUpload} />
          </label>

          <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {templates.length === 0 ? (
              <p className="col-span-2 text-xs text-muted text-center py-4">{t("mockupPublish.noTemplates")}</p>
            ) : (
              templates.map((tpl) => (
                <div 
                  key={tpl.id}
                  onClick={() => setActiveTemplate(tpl)}
                  className={`relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer group transition-all ${
                    activeTemplate?.id === tpl.id ? "border-purple-500" : "border-border hover:border-purple-500/50"
                  }`}
                >
                  <img src={tpl.url} alt="Template" className="w-full h-full object-cover" />
                  <button 
                    onClick={(e) => handleDeleteTemplate(tpl.id, e)}
                    className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="lg:w-3/4 flex flex-col">
        <div className="bg-card border border-border p-4 rounded-xl flex-1 flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden">
          
          {/* Toolbar */}
          {activeTemplate && (
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
              <button 
                onClick={() => setIsDesignModalOpen(true)}
                className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 hover:border-purple-500/50 text-foreground text-sm font-semibold rounded-lg transition-all"
              >
                <Plus className="w-4 h-4 text-purple-400" />
                {t("mockupPublish.selectDesign")}
              </button>

              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-purple-500 text-white hover:bg-purple-600 text-sm font-bold rounded-lg shadow-lg disabled:opacity-50 transition-all"
              >
                <Download className="w-4 h-4" />
                {isExporting ? "İndiriliyor..." : t("mockupPublish.downloadMockup")}
              </button>
            </div>
          )}

          {/* Canvas Wrapper */}
          {activeTemplate ? (
            <div 
              ref={captureRef}
              className="relative shadow-2xl bg-black"
              style={{ width: "500px", height: "600px" }}
            >
              {/* Background Template */}
              <img 
                src={activeTemplate.url} 
                alt="Active Template" 
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Overlay Design via Rnd */}
              {activeDesign && (
                <Rnd
                  default={{
                    x: 150,
                    y: 200,
                    width: 200,
                    height: 200,
                  }}
                  bounds="parent"
                  lockAspectRatio={true}
                  className="group"
                >
                  <div className="relative w-full h-full">
                    <img 
                      src={activeDesign.url} 
                      alt="Design Overlay" 
                      className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-purple-500/0 group-hover:border-purple-500/50 pointer-events-none transition-colors" />
                    <button 
                      onClick={() => setActiveDesign(null)}
                      className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20 cursor-pointer pointer-events-auto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </Rnd>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-muted">
              <ImageIcon className="w-16 h-16 opacity-30" />
              <p>Başlamak için sol taraftan bir şablon yükleyin veya seçin.</p>
            </div>
          )}
        </div>
      </div>

      {/* Design Selection Modal */}
      {isDesignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border p-6 rounded-2xl max-w-4xl w-full max-h-[80vh] flex flex-col relative">
            <button 
              onClick={() => setIsDesignModalOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              {t("mockupPublish.selectDesign")}
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto p-1 flex-1">
              {designs.length === 0 ? (
                <div className="col-span-full py-10 text-center text-secondary">
                  {t("mockupPublish.noDesigns")}
                </div>
              ) : (
                designs.map(d => (
                  <div 
                    key={d.id}
                    onClick={() => {
                      setActiveDesign(d);
                      setIsDesignModalOpen(false);
                    }}
                    className="relative aspect-square rounded-xl bg-black border border-border overflow-hidden cursor-pointer hover:border-purple-500 transition-all group"
                  >
                    <img src={d.url} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
