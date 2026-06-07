"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type MediaItem = {
  url: string;
  type: "photo" | "video";
  name: string;
};

export default function MediaUploader({
  villaId,
  onUploaded,
}: {
  villaId?: string;
  onUploaded?: (item: MediaItem) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!villaId) {
      setError("Sla de villa eerst op voor je media uploadt.");
      return;
    }

    setUploading(true);
    setError("");
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith("video/");
      const ext = file.name.split(".").pop();
      const path = `${villaId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("villa-media")
        .upload(path, file, { contentType: file.type });

      if (uploadError) {
        setError(`Upload mislukt: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("villa-media")
        .getPublicUrl(path);

      const type = isVideo ? "video" : "photo";

      await supabase.from("villa_media").insert([{
        villa_id: villaId,
        url: urlData.publicUrl,
        type,
        sort_order: items.length,
      }]);

      const item: MediaItem = { url: urlData.publicUrl, type, name: file.name };
      setItems((prev) => [...prev, item]);
      onUploaded?.(item);
    }

    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-[#C9A84C]/25 p-10 text-center hover:border-[#C9A84C]/50 transition-colors cursor-pointer"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div>
            <div className="text-[#C9A84C] text-2xl mb-2 animate-pulse">⟳</div>
            <p className="text-[#F5F0E8]/40 text-sm">Uploaden...</p>
          </div>
        ) : (
          <div>
            <div className="text-3xl mb-3 opacity-30">📷</div>
            <p className="text-[#F5F0E8]/50 text-sm mb-1">
              Sleep foto&apos;s en video&apos;s hierheen
            </p>
            <p className="text-[#F5F0E8]/25 text-xs">
              of klik om te bladeren · JPG, PNG, MP4, MOV
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      {/* Uploaded items */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {items.map((item, i) => (
            <div key={i} className="relative aspect-video bg-[#243628] border border-[#C9A84C]/15 overflow-hidden">
              {item.type === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl opacity-40">🎬</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-[#1C2B1E]/80 px-2 py-1">
                <p className="text-[#F5F0E8]/50 text-[0.55rem] truncate">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
