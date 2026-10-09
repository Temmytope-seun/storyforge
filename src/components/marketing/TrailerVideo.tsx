"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

export function TrailerVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    videoRef.current?.play();
  }

  return (
    <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-studio-border-strong bg-elevated shadow-2xl">
      <video
        ref={videoRef}
        className="aspect-video w-full bg-base"
        src="/marketing/brag.mp4"
        poster="/marketing/brag-poster.jpg"
        controls={playing}
        preload="metadata"
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <button
          onClick={handlePlay}
          aria-label="Play trailer"
          className="group absolute inset-0 flex items-center justify-center bg-void/20 transition-colors hover:bg-void/30"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-tally shadow-[0_0_24px_-2px_rgba(245,158,11,0.6)] transition-transform group-hover:scale-110">
            <Play className="h-6 w-6 translate-x-0.5 fill-tally-on text-tally-on" />
          </span>
        </button>
      )}
    </div>
  );
}
