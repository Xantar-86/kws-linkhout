export interface ResolvedVideo {
  kind: "video" | "iframe" | "link";
  src: string;
  ratio: string; // CSS aspect-ratio waarde, bv. "16 / 9"
}

// Bepaalt hoe een video getoond moet worden:
// - geüpload bestand of directe .mp4/.webm link -> <video>
// - YouTube/Vimeo/Facebook/Instagram -> ingesloten iframe
// - onbekend -> gewone link
export function resolveVideo(input: { url?: string; bestand?: string }): ResolvedVideo | null {
  const file = input.bestand?.trim();
  if (file) return { kind: "video", src: file, ratio: "16 / 9" };

  const raw = input.url?.trim();
  if (!raw) return null;

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(raw)) {
    return { kind: "video", src: raw, ratio: "16 / 9" };
  }

  const yt = raw.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}`, ratio: "16 / 9" };

  const vm = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: "iframe", src: `https://player.vimeo.com/video/${vm[1]}`, ratio: "16 / 9" };

  const ig = raw.match(/instagram\.com\/(reel|p|tv)\/([\w-]+)/);
  if (ig) {
    return { kind: "iframe", src: `https://www.instagram.com/${ig[1]}/${ig[2]}/embed`, ratio: "4 / 5" };
  }

  if (/facebook\.com\//.test(raw) || /fb\.watch\//.test(raw)) {
    return {
      kind: "iframe",
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(raw)}&show_text=false`,
      ratio: "16 / 9",
    };
  }

  return { kind: "link", src: raw, ratio: "16 / 9" };
}
