import { useState, useEffect, useCallback } from "react";
import { Sparkles, Camera, Info, ChevronRight, Wand2 } from "lucide-react";
import PhotoUploader from "../components/PhotoUploader";
import ClothingSelector, { ClothingItem } from "../components/ClothingSelector";
import TryOnProgress from "../components/TryOnProgress";
import TryOnResult from "../components/TryOnResult";

type StepType = "upload" | "select" | "generating" | "result";

interface VirtualTryOnPageProps {
  onNavigate?: (page: string) => void;
}

const TIPS = [
  "使用正面全身照，效果最佳",
  "确保背景简洁，人物轮廓清晰",
  "建议穿着合身的基础服装拍照",
  "光线均匀可提升 AI 识别准确率",
];

const VirtualTryOnPage = ({ onNavigate = () => {} }: VirtualTryOnPageProps) => {
  const [step, setStep] = useState<StepType>("upload");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeTip, setActiveTip] = useState(0);

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % TIPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate generation progress
  useEffect(() => {
    if (step !== "generating") return;
    setProgress(0);
    console.log("VirtualTryOn: 开始生成试穿效果");

    const totalDuration = 4000;
    const tickInterval = 80;
    const increment = (tickInterval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [step]);

  const handlePhotoChange = (url: string | null) => {
    setPhotoUrl(url);
    console.log("VirtualTryOn: 照片已更新", url ? "已上传" : "已移除");
  };

  const handleClothingSelect = (item: ClothingItem) => {
    setSelectedClothing(item);
    console.log("VirtualTryOn: 选择服装", item.name);
  };

  const handleGenerate = () => {
    if (!photoUrl || !selectedClothing) return;
    setStep("generating");
    console.log("VirtualTryOn: 开始生成 -", selectedClothing.name);
  };

  const handleGenerationComplete = useCallback(() => {
    console.log("VirtualTryOn: 生成完成，展示结果");
    setStep("result");
  }, []);

  const handleRetry = () => {
    setStep("select");
    setProgress(0);
    console.log("VirtualTryOn: 重新生成");
  };

  const handleReset = () => {
    setStep("upload");
    setPhotoUrl(null);
    setSelectedClothing(null);
    setProgress(0);
  };

  const canGenerate = !!photoUrl && !!selectedClothing;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="gradient-hero px-12 py-10">
        <div style={{ width: "1440px", margin: "0 auto", paddingLeft: "3rem", paddingRight: "3rem" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <Camera className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xs font-medium text-primary-foreground/70 uppercase tracking-widest">AI 虚拟试穿</span>
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2 tracking-tight">
            上身效果，一眼可见
          </h1>
          <p className="text-primary-foreground/70 text-sm max-w-md">
            上传你的照片，选择心仪服装，AI 实时为你生成试穿效果图，购买更有把握。
          </p>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mt-6">
            {[
              { key: "upload", label: "上传照片" },
              { key: "select", label: "选择服装" },
              { key: "generating", label: "AI 生成" },
              { key: "result", label: "查看结果" },
            ].map((s, i, arr) => {
              const stepOrder: StepType[] = ["upload", "select", "generating", "result"];
              const currentIdx = stepOrder.indexOf(step);
              const sIdx = stepOrder.indexOf(s.key as StepType);
              const isDone = sIdx < currentIdx;
              const isActive = sIdx === currentIdx;
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                    ${isActive ? "bg-primary-foreground text-primary" : isDone ? "bg-primary-foreground/30 text-primary-foreground" : "bg-primary-foreground/10 text-primary-foreground/50"}
                  `}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs
                      ${isActive ? "bg-primary text-primary-foreground" : isDone ? "bg-accent text-accent-foreground" : "bg-primary-foreground/20 text-primary-foreground/50"}
                    `}>
                      {isDone ? "✓" : i + 1}
                    </span>
                    {s.label}
                  </div>
                  {i < arr.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-primary-foreground/30" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 py-8" style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <div className="flex gap-8">
          {/* LEFT PANEL */}
          <div className="flex flex-col gap-6" style={{ width: "420px", minWidth: "420px" }}>

            {/* Photo Upload Card */}
            <div className={`bg-card rounded-2xl p-6 shadow-custom border transition-all duration-300
              ${step === "upload" ? "border-primary" : "border-border"}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${photoUrl ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {photoUrl ? "✓" : "1"}
                </div>
                <h2 className="text-sm font-bold text-foreground">上传你的照片</h2>
              </div>
              <PhotoUploader
                label=""
                hint="支持 JPG、PNG 格式，建议使用正面全身照"
                onPhotoChange={handlePhotoChange}
                photoUrl={photoUrl}
              />
              {photoUrl && !selectedClothing && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-primary/30">
                  <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                  <p className="text-xs text-primary font-medium">照片已上传！请在下方选择要试穿的服装。</p>
                </div>
              )}
            </div>

            {/* Tips Card */}
            <div className="bg-card rounded-2xl p-5 shadow-custom border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-semibold text-foreground">拍摄小贴士</h3>
              </div>
              <div className="relative overflow-hidden" style={{ height: "28px" }}>
                {TIPS.map((tip, i) => (
                  <p
                    key={i}
                    className="absolute w-full text-xs text-muted-foreground transition-all duration-500"
                    style={{
                      transform: `translateY(${(i - activeTip) * 36}px)`,
                      opacity: i === activeTip ? 1 : 0,
                    }}
                  >
                    · {tip}
                  </p>
                ))}
              </div>
              <div className="flex gap-1 mt-3">
                {TIPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${i === activeTip ? "bg-accent w-4" : "bg-border w-1.5"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CENTER PANEL - Clothing Selector or Result */}
          <div className="flex-1 min-w-0">
            {(step === "upload" || step === "select") && (
              <div className="bg-card rounded-2xl p-6 shadow-custom border border-border h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${selectedClothing ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {selectedClothing ? "✓" : "2"}
                  </div>
                  <h2 className="text-sm font-bold text-foreground">选择要试穿的服装</h2>
                </div>
                <ClothingSelector
                  selectedId={selectedClothing?.id ?? ""}
                  onSelect={handleClothingSelect}
                />

                {/* Generate Button */}
                <div className="mt-6 pt-5 border-t border-border">
                  {selectedClothing && (
                    <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-secondary border border-border">
                      <span className="text-2xl">{selectedClothing.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{selectedClothing.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedClothing.brand} · {selectedClothing.category}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </div>
                  )}
                  <button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all duration-200
                      ${canGenerate
                        ? "bg-primary text-primary-foreground hover:opacity-90 shadow-custom hover-lift"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                  >
                    <Wand2 className="w-5 h-5" />
                    {!photoUrl ? "请先上传照片" : !selectedClothing ? "请选择服装" : "开始 AI 试穿"}
                  </button>
                  {!canGenerate && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      需要上传照片并选择服装后才能生成效果图
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Generating State */}
            {step === "generating" && (
              <div className="bg-card rounded-2xl p-8 shadow-custom border border-primary h-full flex flex-col justify-center">
                <TryOnProgress
                  isGenerating={step === "generating"}
                  progress={progress}
                  onComplete={handleGenerationComplete}
                />

                {/* Preview of selected items */}
                <div className="mt-8 p-4 rounded-xl bg-muted">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">正在处理</p>
                  <div className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-border shrink-0">
                      {photoUrl && <img src={photoUrl} alt="你的照片" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-border" />
                      <Wand2 className="w-4 h-4 text-primary" />
                      <div className="w-6 h-0.5 bg-border" />
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center text-2xl shrink-0">
                      {selectedClothing?.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{selectedClothing?.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedClothing?.brand}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Result State */}
            {step === "result" && (
              <div className="bg-card rounded-2xl p-6 shadow-custom border border-border">
                <TryOnResult
                  originalUrl={photoUrl ?? ""}
                  resultUrl={""}
                  clothingName={selectedClothing?.name ?? ""}
                  onRetry={handleRetry}
                />
                <div className="mt-4 pt-4 border-t border-border">
                  <button
                    onClick={handleReset}
                    className="w-full py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-200"
                  >
                    重新开始（更换照片或服装）
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL - Info & Related */}
          <div className="flex flex-col gap-5" style={{ width: "280px", minWidth: "280px" }}>
            {/* AI Features */}
            <div className="bg-card rounded-2xl p-5 shadow-custom border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">AI 试穿技术</h3>
              </div>
              {[
                { emoji: "🎯", title: "姿态识别", desc: "精准识别 17 个人体关键节点" },
                { emoji: "🧠", title: "深度融合", desc: "服装纹理、褶皱自然融合" },
                { emoji: "✨", title: "细节渲染", desc: "保留服装品牌与版型特征" },
                { emoji: "⚡", title: "秒级生成", desc: "3-5 秒内完成高质量输出" },
              ].map((feat) => (
                <div key={feat.title} className="flex gap-3 mb-3 last:mb-0">
                  <span className="text-lg shrink-0">{feat.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{feat.title}</p>
                    <p className="text-xs text-muted-foreground">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Popular combinations */}
            <div className="bg-card rounded-2xl p-5 shadow-custom border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">热门试穿组合</h3>
              {[
                { emoji: "👚+👖", name: "简约通勤套装", count: "1.2k 人试穿" },
                { emoji: "🧥+👗", name: "法式优雅搭配", count: "856 人试穿" },
                { emoji: "👕+🪄", name: "学院风日常", count: "634 人试穿" },
              ].map((combo) => (
                <div key={combo.name} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                  <span className="text-base shrink-0">{combo.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{combo.name}</p>
                    <p className="text-xs text-muted-foreground">{combo.count}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>

            {/* CTA to wardrobe */}
            <div className="rounded-2xl p-5 gradient-hero">
              <p className="text-xs font-semibold text-primary-foreground/80 mb-1">更多衣物选择</p>
              <p className="text-sm font-bold text-primary-foreground mb-3">从你的衣橱中选取衣物进行试穿</p>
              <button
                onClick={() => onNavigate("wardrobe")}
                className="w-full py-2 rounded-xl bg-primary-foreground/20 text-primary-foreground text-xs font-medium hover:bg-primary-foreground/30 transition-colors duration-200 flex items-center justify-center gap-1.5"
              >
                前往我的衣橱
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOnPage;