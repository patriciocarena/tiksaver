export interface TikTokVideoInfo {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
  duration: number;
  playCount: number;
  likeCount: number;
  downloadUrl: string;
  musicTitle: string;
}

const TIKTOK_URL_REGEX =
  /^https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com\/@?[\w.-]+(\/video\/\d+)?/i;

const SHORT_LINK_REGEX = /^https?:\/\/(vm|vt)\.tiktok\.com\/[\w]+\/?$/i;

export function isValidTikTokUrl(url: string): boolean {
  const trimmed = url.trim();
  return TIKTOK_URL_REGEX.test(trimmed) || SHORT_LINK_REGEX.test(trimmed);
}

export function formatCount(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export async function fetchVideoInfo(
  url: string,
): Promise<TikTokVideoInfo> {
  const trimmed = url.trim();

  // Try tikwm.com API
  const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(trimmed)}`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const json = await response.json();

  if (json.code !== 0 || !json.data) {
    throw new Error(json.msg || "Failed to fetch video info");
  }

  const data = json.data;

  return {
    id: data.id || String(Date.now()),
    title: data.title || "TikTok Video",
    author: data.author?.nickname || data.author?.unique_id || "Unknown",
    authorAvatar: data.author?.avatar
      ? `https://www.tikwm.com${data.author.avatar}`
      : "",
    thumbnail: data.cover
      ? `https://www.tikwm.com${data.cover}`
      : data.origin_cover
        ? `https://www.tikwm.com${data.origin_cover}`
        : "",
    duration: data.duration || 0,
    playCount: data.play_count || 0,
    likeCount: data.digg_count || 0,
    downloadUrl: data.play
      ? `https://www.tikwm.com${data.play}`
      : "",
    musicTitle: data.music_info?.title || data.music || "Original Sound",
  };
}

export async function downloadVideo(downloadUrl: string): Promise<string> {
  // On web, we trigger a download via anchor tag
  // Return the URL directly for the download trigger
  return downloadUrl;
}
