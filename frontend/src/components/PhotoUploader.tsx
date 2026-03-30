import { useState, useRef } from "react";
import { Upload, Camera, X, User } from "lucide-react";

interface PhotoUploaderProps {
  label?: string;
  hint?: string;
  onPhotoChange?: (url: string | null) => void;
  photoUrl?: string | null;
}

const PhotoUploader = ({
  label = "上传照片",
  hint = "支持 JPG、PNG 格式，建议使用正面全身照",
  onPhotoChange = () => {},
  photoUrl = null,
}: PhotoUploaderProps) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    console.log("PhotoUploader: 已选择图片", file.name);
    onPhotoChange(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div data-cmp="PhotoUploader" className="w-full">
      <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
      <div
        onClick={() => !photoUrl && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden
          ${photoUrl ? "border-transparent cursor-default" : "cursor-pointer hover:border-primary"}
          ${dragging ? "border-primary bg-secondary" : "border-border bg-muted"}
        `}
        style={{ minHeight: "280px" }}
      >
        {photoUrl ? (
          <div className="relative w-full h-full" style={{ minHeight: "280px" }}>
            <img
              src={photoUrl}
              alt="上传的照片"
              className="w-full h-full object-cover"
              style={{ minHeight: "280px" }}
            />
            <button
              onClick={handleRemove}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card shadow-custom flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-10" style={{ minHeight: "280px" }}>
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <Upload className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">点击上传</span>
                <span className="text-sm text-muted-foreground">或拖拽到此处</span>
              </div>
              <p className="text-xs text-muted-foreground">{hint}</p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary">
              <Camera className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">建议使用均匀光线</span>
            </div>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default PhotoUploader;