// helpers.js
// অ্যাপের একাধিক ট্যাব-কম্পোনেন্ট (Today/Study/Task/Notes) জুড়ে শেয়ার হওয়া ছোট ইউটিলিটি
// ফাংশন ও কনস্ট্যান্ট — মূল App__1_.jsx থেকে হুবহু (আচরণ অপরিবর্তিত) আলাদা করা হয়েছে,
// যাতে প্রতিটা ট্যাব ফাইল নিজে নিজে import করে ব্যবহার করতে পারে, কোনো কিছু ডুপ্লিকেট না হয়।

import { Capacitor } from "@capacitor/core";
import { Haptics } from "@capacitor/haptics";
import {
  GraduationCap, User2, Home, Tag, Target, ListChecks, CalendarDays,
} from "lucide-react";

// ---------- বাংলা সংখ্যা ----------
export const BN_DIGITS = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
export const toBn = (n) => String(n).split("").map(c => (c>='0'&&c<='9') ? BN_DIGITS[+c] : c).join("");
export const fromBn = (s) => String(s).split("").map(c => { const i = BN_DIGITS.indexOf(c); return i === -1 ? c : String(i); }).join("");
export const pad2 = (n) => String(n).padStart(2,"0");

// ---------- তারিখ ----------
export const dateKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;

// ---------- সপ্তাহ কোন দিন থেকে শুরু (Settings-এ কনফিগারযোগ্য, localStorage-এ সেভ) ----------
export const WEEK_START_DAY_KEY = "focusgo_week_start_day";
export const getWeekStartDay = () => {
  try {
    const v = parseInt(window.localStorage.getItem(WEEK_START_DAY_KEY), 10);
    if (!isNaN(v) && v >= 0 && v <= 6) return v;
  } catch (e) {}
  return 5; // ডিফল্ট: শুক্রবার
};
export const setWeekStartDay = (v) => {
  try { window.localStorage.setItem(WEEK_START_DAY_KEY, String(v)); } catch (e) {}
};
export const weekStartOffset = (jsDay) => { const s = getWeekStartDay(); return (jsDay - s + 7) % 7; };

// ---------- মাস/বার লেবেল ----------
export const WEEKDAYS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
export const WEEKDAYS_BN = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"];
export const WEEKDAYS_SHORT_EN = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
export const WEEKDAYS_SHORT_BN = ["রবি","সোম","মঙ্গল","বুধ","বৃহঃ","শুক্র","শনি"];
export const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const MONTHS_BN = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];

export const weekdayShortLabels = (lang) => {
  const bn = ["র","সো","ম","বু","বৃ","শু","শ"];
  const en = ["S","M","T","W","T","F","S"];
  const arr = lang === "bn" ? bn : en;
  const s = getWeekStartDay();
  return [...arr.slice(s), ...arr.slice(0, s)];
};

export const monthNameFor = (lang) => (i) => lang === "bn" ? MONTHS_BN[i] : MONTHS_EN[i];
export const weekdayNameFor = (lang) => (d) => lang === "bn" ? WEEKDAYS_BN[d.getDay()] : WEEKDAYS_EN[d.getDay()];
export const weekdayShortFor = (lang) => (d) => lang === "bn" ? WEEKDAYS_SHORT_BN[d.getDay()] : WEEKDAYS_SHORT_EN[d.getDay()];
// লেটার-স্পেসিং হেল্পার: বাংলা ফন্টে extra letter-spacing দিলে অক্ষর ভেঙে দেখায়, তাই বাংলায় সবসময় 0
export const lsFor = (lang) => (px) => (lang === "bn" ? 0 : px);
export const inkColorFor = (dark) => (dark ? "#F3F1F8" : "#1A1814");

// ---------- হ্যাপটিক (ভাইব্রেশন) ----------
export const HAPTICS_PREF_KEY = "focusgo_haptics_enabled";
export const isHapticsEnabled = () => {
  try { return window.localStorage.getItem(HAPTICS_PREF_KEY) !== "0"; } catch (e) { return true; }
};
export const vibrate = (pattern = 8) => {
  try {
    if (!isHapticsEnabled()) return;
    if (Capacitor.isNativePlatform()) {
      Haptics.vibrate({ duration: 8 }).catch(() => {});
    } else if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (e) {}
};

// ---------- Num — সংখ্যা রেন্ডার (Noto Sans Bengali ফন্টে) ----------
export const Num = ({ children }) => <span style={{ fontFamily: "'Noto Sans Bengali',serif" }}>{children}</span>;

// নোট এডিটরে "খাতার লাইন" টগল বাটনের আইকন
export const RuledPaperIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/>
  </svg>
);

// ---------- টাস্ক ক্যাটাগরি ----------
export const TASK_CATEGORY_ICONS = { GraduationCap, User2, Home, Tag, Target, ListChecks, CalendarDays };
export const taskCategoryIcon = (iconName) => TASK_CATEGORY_ICONS[iconName] || Tag;
export const findTaskCategory = (categories, key) => (categories || []).find(c => c.key === key) || { key, label: key, labelBn: key, icon: "Tag", color: "#8A8377" };

// ---------- নোট: রঙ প্যালেট ও হেল্পার ----------
export const NOTE_BG_PALETTE = [
  { key: null,     bg: null,      bgDark: null,      labelBn: "ডিফল্ট", labelEn: "Default" },
  { key: "white",  bg: "#FFFFFF", bgDark: "#FFFFFF", labelBn: "সাদা",   labelEn: "White", ink: "#242424", inkDark: "#242424" },
  { key: "black",  bg: "#1A1814", bgDark: "#1A1814", labelBn: "কালো",   labelEn: "Black", ink: "#F3F1F8", inkDark: "#F3F1F8" },
  { key: "yellow", bg: "#FFF3B0", bgDark: "#3A331A", labelBn: "হলুদ",   labelEn: "Yellow" },
  { key: "orange", bg: "#FCE0C4", bgDark: "#3A2C1B", labelBn: "কমলা",   labelEn: "Orange" },
  { key: "pink",   bg: "#FBD9E5", bgDark: "#35232B", labelBn: "গোলাপি", labelEn: "Pink" },
  { key: "purple", bg: "#E6D9F7", bgDark: "#2C2438", labelBn: "বেগুনি", labelEn: "Purple" },
  { key: "blue",   bg: "#CFE8F7", bgDark: "#1E2E3A", labelBn: "নীল",    labelEn: "Blue" },
  { key: "teal",   bg: "#CFF0EA", bgDark: "#1E332F", labelBn: "টিল",    labelEn: "Teal" },
  { key: "green",  bg: "#D7F0D0", bgDark: "#223626", labelBn: "সবুজ",   labelEn: "Green" },
  { key: "gray",   bg: "#E4E1D9", bgDark: "#2A2822", labelBn: "ধূসর",   labelEn: "Gray" },
];
export const NOTE_PAPER_BG = "#F7F1E3";
export const NOTE_PAPER_TEXT = "#242424";
export const NOTE_PAPER_MUTED = "#7C7361";

export function noteColorFor(category, allCategories) {
  const idx = Math.max(0, (allCategories || []).indexOf(category));
  return NOTE_BG_PALETTE[idx % NOTE_BG_PALETTE.length];
}
export function noteAccentTextFor(col, dark) {
  return dark ? (col.textDark || col.text) : col.text;
}
export function noteBgFor(colorKey, dark) {
  const found = NOTE_BG_PALETTE.find(c => c.key === (colorKey || null)) || NOTE_BG_PALETTE[0];
  const fallback = dark ? "#221E19" : NOTE_PAPER_BG;
  return (dark ? found.bgDark : found.bg) || fallback;
}
export function noteTextFor(colorKey, dark) {
  const found = NOTE_BG_PALETTE.find(c => c.key === (colorKey || null)) || NOTE_BG_PALETTE[0];
  if (found.ink) return dark ? (found.inkDark || found.ink) : found.ink;
  return dark ? "#F3F1F8" : NOTE_PAPER_TEXT;
}

export const NOTE_TEXT_COLORS = [
  { key: "red",    hex: "#C0392B" },
  { key: "green",  hex: "#2F8F46" },
  { key: "blue",   hex: "#1F6FB2" },
  { key: "orange", hex: "#D9770B" },
  { key: "yellow", hex: "#B8860B" },
];

// ---------- নোট: সাধারণ টেক্সট/HTML হেল্পার ----------
export function looksLikeHtml(str) {
  return !!str && /<\/?[a-z][\s\S]*>/i.test(String(str));
}
export function stripHtmlToText(str) {
  if (!str) return "";
  return String(str).replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|h1|h2|li)>/gi, "\n").replace(/<[^>]+>/g, "").replace(/\u00a0/g, " ").trim();
}
export function textToHtml(str) {
  if (!str) return "";
  const esc = String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(/\n/g, "<br>");
}
export function fullDateTimeLabel(iso, lang) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString(lang === "bn" ? "bn-BD" : "en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}
export function compressImageToDataUrl(file, maxDim = 800, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error("read failed"));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; }
          else { width = Math.round((width * maxDim) / height); height = maxDim; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        try {
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
