import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Flattens Strapi-style nested `attributes`/`data` objects.
 * @param data  eender welk type; objecten worden gerecursed.
 * @returns     hetzelfde type, maar met alle geneste `attributes`/`data` gemerged.
 */
export function flattenAttributes(data: unknown): unknown {
  // Niet-objecten (incl. null, Date, functies) gewoon teruggeven
  if (
    typeof data !== "object" ||
    data === null ||
    data instanceof Date ||
    typeof data === "function"
  ) {
    return data;
  }

  // Arrays recursief flattenen
  if (Array.isArray(data)) {
    return data.map((item) => flattenAttributes(item));
  }

  // Plain object flattenen
  const flattened: Record<string, unknown> = {};

  for (const key in data as Record<string, unknown>) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

    const value = (data as Record<string, unknown>)[key];

    if (
      (key === "attributes" || key === "data") &&
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      const nested = flattenAttributes(value);
      if (typeof nested === "object" && nested !== null) {
        Object.assign(flattened, nested as Record<string, unknown>);
      }
    } else {
      flattened[key] = flattenAttributes(value);
    }
  }

  return flattened;
}

export function getStrapiURL(): string {
  return process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
}

export function getStrapiMedia(url: string | null): string | null {
  if (url === null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return `${getStrapiURL()}${url}`;
}

export function extractYouTubeID(urlOrID: string): string | null {
  const idRegex = /^[a-zA-Z0-9_-]{11}$/;
  if (idRegex.test(urlOrID)) return urlOrID;

  const standardRegex = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
  const shortsRegex = /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;

  const matchStandard = urlOrID.match(standardRegex);
  if (matchStandard) return matchStandard[1];

  const matchShorts = urlOrID.match(shortsRegex);
  if (matchShorts) return matchShorts[1];

  return null;
}
