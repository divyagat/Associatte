// components/YouTubeShorts.tsx

interface YouTubeShortsProps {
  videoId: string; // The ID from the YouTube URL
  title?: string;  // For accessibility (screen readers)
  className?: string; // Optional Tailwind classes for the wrapper
  autoplay?: boolean;
  loop?: boolean;
}

export default function YouTubeShorts({ 
  videoId, 
  title = "YouTube Short", 
  className = "", 
  autoplay = false,
  loop = false
}: YouTubeShortsProps) {
  
  // Build URL parameters
  const params = new URLSearchParams();
  if (autoplay) {
    params.append('autoplay', '1');
    params.append('mute', '1'); // Browsers require videos to be muted to autoplay
  }
  if (loop) {
    params.append('loop', '1');
    params.append('playlist', videoId); // YouTube requires the playlist param to loop a single video
  }

  const queryString = params.toString();
  // Using youtube-nocookie.com is better for GDPR/privacy compliance
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`;

  return (
    <div className={`relative w-full max-w-[360px] aspect-[9/16] mx-auto ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        className="absolute inset-0 w-full h-full rounded-2xl shadow-xl border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}