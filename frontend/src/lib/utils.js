import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Backend API base URL — single source of truth for image resolution */
const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * Resolve a product/avatar image URL.
 * - If the URL is already absolute (http/https), return as-is.
 * - If it's a relative path like `/uploads/products/...`, prepend the backend URL.
 * - If falsy, return the placeholder SVG.
 */
export function resolveImageUrl(img) {
  if (!img) return placeholderSvg;
  if (img.startsWith('http')) return img;
  return API_BASE + img;
}

/** Inline SVG data URI used as a fallback src for broken / missing images */
export const placeholderSvg = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">` +
  `<defs>` +
  `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">` +
  `<stop offset="0%" style="stop-color:#2a2a2a;stop-opacity:1"/>` +
  `<stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1"/>` +
  `</linearGradient>` +
  `</defs>` +
  `<rect width="100" height="100" fill="url(#bg)"/>` +
  `<g transform="translate(50,50)">` +
  `<rect x="-18" y="-18" width="36" height="36" rx="2" fill="none" stroke="#4a4a4a" stroke-width="1.5"/>` +
  `<circle cx="-8" cy="-8" r="3" fill="#4a4a4a"/>` +
  `<path d="M -18 10 L -5 -3 L 5 7 L 18 -6 L 18 18 L -18 18 Z" fill="#3a3a3a"/>` +
  `</g>` +
  `</svg>`
)}`;
