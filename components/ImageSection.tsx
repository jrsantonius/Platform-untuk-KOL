"use client";

import { useState, useEffect } from "react";
import type { TweetImage } from "@/lib/types";
import { Image as ImageIcon, ExternalLink, Search, User } from "lucide-react";

interface ImageSectionProps {
  imageQuery?: string;
  maxImages?: number;
  compact?: boolean;
}

function SearchLinks({ query, compact }: { query: string; compact?: boolean }) {
  const q = encodeURIComponent(query);
  const links = [
    {
      label: "Google Images",
      url: `https://www.google.com/search?q=${q}&tbm=isch`,
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
    {
      label: "Pexels",
      url: `https://www.pexels.com/search/${q}/`,
      color: "bg-green-50 text-green-600 hover:bg-green-100",
    },
    {
      label: "Unsplash",
      url: `https://unsplash.com/s/photos/${encodeURIComponent(query.replace(/ /g, "-"))}`,
      color: "bg-slate-50 text-slate-600 hover:bg-slate-100",
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 mt-2">
        <Search size={10} className="text-slate-400 flex-shrink-0" />
        <span className="text-[10px] text-slate-400 truncate">"{query}"</span>
        <div className="flex gap-1">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${l.color} transition-colors`}
            >
              {l.label.split(" ")[0]}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <ImageIcon size={12} className="text-slate-400" />
        <span className="text-xs text-slate-500 font-medium">Cari gambar untuk:</span>
        <span className="text-xs font-semibold text-slate-700">"{query}"</span>
      </div>
      <div className="flex gap-2">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg ${l.color} transition-colors`}
          >
            <ExternalLink size={10} />
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function RealImages({ images, query }: { images: TweetImage[]; query?: string }) {
  const count = images.length;
  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-slate-100">
      {count === 1 && (
        <div className="relative group">
          <img src={images[0].url} alt={images[0].alt} className="w-full h-48 object-cover" />
          <a
            href={images[0].photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <User size={9} /> {images[0].photographer}
          </a>
        </div>
      )}
      {count === 2 && (
        <div className="grid grid-cols-2 gap-0.5">
          {images.map((img, i) => (
            <img key={i} src={img.url} alt={img.alt} className="w-full h-36 object-cover" />
          ))}
        </div>
      )}
      {count === 3 && (
        <div className="grid grid-cols-2 gap-0.5">
          <img src={images[0].url} alt={images[0].alt} className="w-full h-40 object-cover row-span-2" />
          <img src={images[1].url} alt={images[1].alt} className="w-full h-[78px] object-cover" />
          <img src={images[2].url} alt={images[2].alt} className="w-full h-[78px] object-cover" />
        </div>
      )}
      {count >= 4 && (
        <div className="grid grid-cols-2 gap-0.5">
          {images.slice(0, 4).map((img, i) => (
            <img key={i} src={img.url} alt={img.alt} className="w-full h-28 object-cover" />
          ))}
        </div>
      )}
      {query && (
        <div className="px-2 py-1 bg-slate-50 flex items-center gap-1">
          <ImageIcon size={9} className="text-slate-400" />
          <span className="text-[10px] text-slate-400">"{query}" • Pexels</span>
        </div>
      )}
    </div>
  );
}

export default function ImageSection({ imageQuery, maxImages = 4, compact = false }: ImageSectionProps) {
  const [images, setImages] = useState<TweetImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasPexelsKey, setHasPexelsKey] = useState<boolean | null>(null);

  useEffect(() => {
    if (!imageQuery) return;

    setLoading(true);
    fetch(`/api/images?q=${encodeURIComponent(imageQuery)}&count=${maxImages}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error === "PEXELS_API_KEY not set") {
          setHasPexelsKey(false);
        } else if (data.images?.length > 0) {
          setHasPexelsKey(true);
          setImages(data.images);
        } else {
          setHasPexelsKey(false);
        }
      })
      .catch(() => setHasPexelsKey(false))
      .finally(() => setLoading(false));
  }, [imageQuery, maxImages]);

  if (!imageQuery) return null;

  if (loading) {
    return <div className={`mt-3 skeleton rounded-xl ${compact ? "h-6" : "h-32"}`} />;
  }

  if (hasPexelsKey && images.length > 0) {
    return <RealImages images={images} query={imageQuery} />;
  }

  return <SearchLinks query={imageQuery} compact={compact} />;
}
