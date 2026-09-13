import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App as CapacitorApp } from "@capacitor/app";
import { NavigationBar } from "@capgo/capacitor-navigation-bar";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Geolocation } from "@capacitor/geolocation";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { NativeSettings, AndroidSettings, IOSSettings } from "capacitor-native-settings";
import { LocalNotifications } from "@capacitor/local-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Plus, Play, Pause, RotateCcw, Calendar, ChevronLeft, ChevronRight, ChevronDown, X, Check, Trash2, Clock, Pencil, Home, CalendarDays, BarChart3, GraduationCap, Folder, Maximize2, User, LogOut, Sun, Moon, Contrast, Settings, Info, Eye, EyeOff, Mail, WifiOff, MoreVertical, Pin, PinOff, Tag, Flame, Target, TrendingUp, Bell, ListChecks, User2, Sparkles, FileText, Search, CalendarClock, List, CalendarRange, Repeat, Bold, Italic, Underline, Heading1, Heading2, RemoveFormatting, Palette, LayoutGrid, ArrowUpDown, ArrowUpRight, MapPin, Compass, Image as ImageIcon, KeyRound, AtSign, Link2, Cake, Loader2, Vibrate, Music, Volume2, VolumeX, CloudRain, Waves, Shield, ShieldAlert, BookOpen, Hourglass, Flag, Lightbulb, Cloud, UploadCloud, Globe, HelpCircle, Menu, Heart, Mic, Square, Brain, FlaskConical, Calculator, Landmark, Globe2, Music2, Palette as PaletteIcon, Code2, Languages } from "lucide-react";

// lucide-react-এর এই ভার্সনে Mars/Venus নেই, তাই নিজে ছোট SVG icon বানানো হলো
const Mars = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 10a5 5 0 1 1-3.5-4.77"/><path d="M14 4h6v6"/><path d="M20 4 13.5 10.5"/>
  </svg>
);
const Venus = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="6"/><path d="M12 15v7"/><path d="M9 19h6"/>
  </svg>
);
// ব্ল্যাক-থিম ফোকাস টাইমার কার্ডের ডানপাশের "Focus" (কুইক ডিউরেশন সেটিংস) বাটনের sliders আইকন
const SlidersIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
    <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
    <circle cx="4" cy="12" r="2" fill={color}/><circle cx="12" cy="10" r="2" fill={color}/><circle cx="20" cy="14" r="2" fill={color}/>
  </svg>
);
// নোট এডিটরে "খাতার লাইন" টগল বাটনের আইকন — লাইন-টানা পাতার মতো ছোট SVG
const RuledPaperIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/>
  </svg>
);
// সেটিংসে "সালাত টাইমার" রো ও Today ট্যাবের হেডারে ব্যবহৃত মসজিদ আইকন — গম্বুজ, দরজা, মিনার ও ক্রিসেন্ট চাঁদসহ
const MosqueIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 21h20"/>
    <path d="M7 21v-7M17 21v-7"/>
    <path d="M7 14a5 5 0 0 1 10 0"/>
    <path d="M10.5 21v-2.5a1.5 1.5 0 0 1 3 0V21"/>
    <path d="M12 9V6"/>
    <path d="M13.5 2.6a2 2 0 1 0 1.9 3.15A2.4 2.4 0 0 1 13.5 2.6z" fill={color} stroke="none"/>
  </svg>
);
// Tasks ট্যাবের "কোনো টাস্ক নেই" ইলাস্ট্রেশনে ব্যবহৃত ক্লিপবোর্ড-চেকলিস্ট আইকন — lucide-এ এত ডিটেইলড ভার্সন নেই
const ClipboardChecklistIcon = ({ size = 64, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="4" width="14" height="17" rx="2.2" stroke={color} strokeWidth="1.4"/>
    <rect x="9" y="2.2" width="6" height="3.4" rx="1" fill={color}/>
    <rect x="7.6" y="9.2" width="2.1" height="2.1" rx="0.5" stroke={color} strokeWidth="1.3"/>
    <path d="M11.5 10.2h5" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    <rect x="7.6" y="12.7" width="2.1" height="2.1" rx="0.5" stroke={color} strokeWidth="1.3"/>
    <path d="M11.5 13.7h5" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
    <rect x="7.6" y="16.2" width="2.1" height="2.1" rx="0.5" fill={color}/>
    <path d="M8.1 17.2l0.5 0.5 0.9-1" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.5 17.2h4" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
import TaskTab from "./TaskTab";
import { auth, db, googleProvider } from "./firebase";
import { setupNotifications } from "./notifications";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

// ---------- সোশ্যাল আইকন (lucide-react-এ brand logo নেই, তাই ছোট inline SVG) ----------
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.22 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.22 22 17.08 22 12.06Z"/></svg>
);
const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg>
);
const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>
);
const BehanceIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 10.3c.95-.45 1.47-1.2 1.47-2.32 0-2.17-1.62-2.98-3.6-2.98H1v13.9h4.9c2.13 0 4.3-.95 4.3-3.34 0-1.5-.7-2.7-2.4-3.26ZM3.4 6.98h2.1c.86 0 1.65.24 1.65 1.24 0 .93-.63 1.32-1.5 1.32H3.4V6.98Zm2.4 10h-2.4v-3h2.35c1.06 0 1.9.42 1.9 1.5 0 1.1-.86 1.5-1.85 1.5ZM19.7 5.9h-4.8v1.5h4.8V5.9ZM23 14.15c0-3.02-1.6-5.15-4.75-5.15-3 0-4.98 2.13-4.98 5.1 0 3.06 1.87 5.05 5 5.05 2.36 0 4-1.05 4.6-3.3h-2.36c-.2.7-1.02 1.15-2.16 1.15-1.53 0-2.44-.87-2.55-2.4h7.15c.03-.15.05-.3.05-.45Zm-7.15-1.4c.2-1.28 1.02-2 2.34-2 1.24 0 2.06.8 2.16 2h-4.5Z"/></svg>
);
const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .28.18.6.69.5A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/></svg>
);
// পাসওয়ার্ড ইনপুট — ডিফল্টে hidden (dots), পাশের চোখ আইকনে ক্লিক করলে চাইলে টেক্সট হিসেবে দেখা যাবে
function PasswordField({ value, onChange, placeholder, style, minLength, required, textMuted2, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        minLength={minLength}
        required={required}
        autoComplete={autoComplete}
        style={{ ...style, paddingRight: 40 }}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        tabIndex={-1}
        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", color: textMuted2, display: "flex", padding: 2 }}
        title={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

// ব্রাউজারেই (client-side) ছবি resize + compress করে একটা compact JPEG data URL বানানো হয় —
// Firebase Storage/Blaze প্ল্যান ছাড়াই ছোট ছবি সরাসরি Firestore ডকুমেন্টে সেভ করা যায় বলে
function resizeImageToDataUrl(file, maxDim = 320, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > height) {
        if (width > maxDim) { height = Math.round(height * (maxDim / width)); width = maxDim; }
      } else {
        if (height > maxDim) { width = Math.round(width * (maxDim / height)); height = maxDim; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("image load failed")); };
    img.src = url;
  });
}

// ---------- White Noise: Web Audio API দিয়ে রিয়েল-টাইমে জেনারেট করা (কোনো external mp3 ফাইল/হোস্টিং লাগে না,
// তাই অফলাইনেও কাজ করে এবং কোনো কপিরাইট/লাইসেন্স ইস্যু থাকে না) ----------
const WHITE_NOISE_TYPES = [
  { id: "none",  labelEn: "None",        labelBn: "কোনোটাই না", Icon: VolumeX },
  { id: "white", labelEn: "White Noise", labelBn: "হোয়াইট নয়েজ", Icon: Volume2 },
  { id: "pink",  labelEn: "Pink Noise",  labelBn: "পিংক নয়েজ",  Icon: Volume2 },
  { id: "brown", labelEn: "Brown Noise", labelBn: "ব্রাউন নয়েজ", Icon: Volume2 },
  { id: "rain",  labelEn: "Rain",        labelBn: "বৃষ্টি",       Icon: CloudRain },
  { id: "waves", labelEn: "Ocean Waves", labelBn: "সমুদ্রের ঢেউ", Icon: Waves },
];

// সাউন্ড আইডি অনুযায়ী ২ সেকেন্ডের একটা লুপেবল বাফার বানায় (white/pink/brown/rain/waves)
function buildNoiseBuffer(ctx, id) {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  if (id === "pink") {
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i=0;i<data.length;i++){
      const white = Math.random()*2-1;
      b0=0.99886*b0+white*0.0555179; b1=0.99332*b1+white*0.0750759;
      b2=0.96900*b2+white*0.1538520; b3=0.86650*b3+white*0.3104856;
      b4=0.55000*b4+white*0.5329522; b5=-0.7616*b5-white*0.0168980;
      data[i]=(b0+b1+b2+b3+b4+b5+b6+white*0.5362)*0.11; b6=white*0.115926;
    }
  } else if (id === "brown" || id === "waves") {
    let lastOut=0;
    for (let i=0;i<data.length;i++){
      const white = Math.random()*2-1;
      lastOut = (lastOut + 0.02*white) / 1.02;
      data[i] = lastOut * 3.5;
    }
  } else { // white / rain বেস
    for (let i=0;i<data.length;i++) data[i] = Math.random()*2-1;
  }
  return buffer;
}

// timerRunning/stopwatchRunning চালু থাকলে এবং সাউন্ড "none" না হলে ব্যাকগ্রাউন্ডে লুপ চালায়;
// এটা FocusGo কম্পোনেন্টের ভেতরে বসানো থাকে বলে ফুলস্ক্রিন টাইমারে গেলেও আওয়াজ বন্ধ হয় না।
function useWhiteNoise(soundId, volume, active) {
  const ctxRef = useRef(null);
  const nodesRef = useRef({});

  const stopNoise = () => {
    const n = nodesRef.current;
    try { n.source && n.source.stop(); } catch (e) {}
    try { n.lfo && n.lfo.stop(); } catch (e) {}
    try { n.source && n.source.disconnect(); } catch (e) {}
    try { n.filter && n.filter.disconnect(); } catch (e) {}
    try { n.modGain && n.modGain.disconnect(); } catch (e) {}
    try { n.gain && n.gain.disconnect(); } catch (e) {}
    nodesRef.current = {};
  };

  useEffect(() => {
    if (!active || soundId === "none") { stopNoise(); return; }
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctxRef.current = new AC();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume().catch(()=>{});

    stopNoise();
    const source = ctx.createBufferSource();
    source.buffer = buildNoiseBuffer(ctx, soundId);
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    let filter = null, lfo = null, modGain = null;
    if (soundId === "rain") {
      filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 1200;
      source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    } else if (soundId === "waves") {
      lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12; // ধীর ওঠানামা, ঢেউয়ের অনুভূতি
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.5;
      modGain = ctx.createGain();
      modGain.gain.value = 0.5;
      lfo.connect(lfoGain); lfoGain.connect(modGain.gain);
      source.connect(modGain); modGain.connect(gain); gain.connect(ctx.destination);
      lfo.start();
    } else {
      source.connect(gain); gain.connect(ctx.destination);
    }

    source.start();
    nodesRef.current = { source, gain, filter, lfo, modGain };
    return () => stopNoise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundId, active]);

  useEffect(() => {
    if (nodesRef.current.gain) nodesRef.current.gain.gain.value = volume;
  }, [volume]);

  useEffect(() => () => { stopNoise(); try { ctxRef.current && ctxRef.current.close(); } catch (e) {} }, []);
}

// ---------- Onboarding — নতুন ইউজারের জন্য ৩ স্লাইডের সংক্ষিপ্ত পরিচিতি ----------
function OnboardingScreen({ lang, dark, cardBg, textMain, textMuted2, accent, onDone }) {
  const [step, setStep] = useState(0);
  const isBn = lang === "bn";
  const bg = dark ? "#000000" : "#F7F6FA";
  const border = dark ? "#242424" : "#E7E5ED";

  const slides = [
    {
      Icon: Clock,
      ring: dark ? "#F3F1F8" : "#1A1814",
      title: isBn ? "একই জায়গায় সব সামলান" : "Everything in one place",
      body: isBn
        ? "পড়াশোনা, টাস্ক আর নোট — দিনের সব কাজ এক অ্যাপ থেকেই পরিকল্পনা ও ট্র্যাক করুন।"
        : "Study, tasks, and notes — plan and track your whole day from a single app.",
    },
    {
      Icon: MosqueIcon,
      ring: accent,
      title: isBn ? "পরীক্ষা ও সালাতের খেয়াল রাখুন" : "Never miss what matters",
      body: isBn
        ? "পরীক্ষার কাউন্টডাউন আর সালাতের সময় — দুটোই থাকবে চোখের সামনে।"
        : "Exam countdowns and salah times, always right where you can see them.",
    },
    {
      Icon: Flame,
      ring: "#6E8B5E",
      title: isBn ? "ধারাবাহিকতা ধরে রাখুন" : "Stay consistent",
      body: isBn
        ? "ডেইলি স্ট্রিক আর সাপ্তাহিক-মাসিক রিপোর্ট দেখে বুঝুন প্রতিদিন কতটা এগোলেন।"
        : "See your daily streak and weekly/monthly reports to know how each day added up.",
    },
  ];
  const isLast = step === slides.length - 1;
  const s = slides[step];

  return (
    <div style={{ minHeight: "100dvh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 380, background: cardBg, borderRadius: 14, padding: "32px 24px 24px", border: `1px solid ${border}` }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", minHeight: 220, justifyContent: "center" }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: `${s.ring}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <s.Icon size={32} color={s.ring} strokeWidth={2} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: textMain, marginBottom: 8 }}>{s.title}</div>
          <div style={{ fontSize: 13.5, color: textMuted2, lineHeight: 1.6, padding: "0 6px" }}>{s.body}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "20px 0 18px" }}>
          {slides.map((_, i) => (
            <span key={i} style={{
              width: i === step ? 18 : 6, height: 6, borderRadius: 3,
              background: i === step ? accent : border, transition: "all .2s ease",
            }} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onDone}
            style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${border}`, background: "transparent", color: textMuted2, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
          >
            {isBn ? "এড়িয়ে যান" : "Skip"}
          </button>
          <button
            onClick={() => (isLast ? onDone() : setStep(step + 1))}
            style={{ flex: 1.4, padding: "12px", borderRadius: 12, border: "none", background: accent, color: "#FFF", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
          >
            {isLast ? (isBn ? "শুরু করি" : "Get started") : (isBn ? "পরবর্তী" : "Next")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Email/Password Auth স্ক্রিন ----------
function AuthScreen({ t, lang, cardBg, cardBorder, textMain, textMuted2, accent, dark, onGuest }) {
  const breakpoint = useViewport(); // "mobile" | "tablet" | "desktop"
  const cardMaxWidth = breakpoint === "desktop" ? 440 : breakpoint === "tablet" ? 410 : 380;
  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const isBn = lang === "bn";
  const L = {
    title: "FocusGo",
    subtitle: isBn ? "পড়াশোনা, টাস্ক ও সালাতের সময় — সব একসাথে, যেকোনো ডিভাইস থেকে" : "Study, tasks, and salah times — all in one place, on any device",
    login: isBn ? "লগইন" : "Log In",
    signup: isBn ? "একাউন্ট খুলুন" : "Sign Up",
    name: isBn ? "নাম" : "Name",
    email: "Email",
    password: isBn ? "পাসওয়ার্ড" : "Password",
    submitLogin: isBn ? "লগইন করুন" : "Log In",
    submitSignup: isBn ? "একাউন্ট তৈরি করুন" : "Create Account",
    switchToSignup: isBn ? "একাউন্ট নেই? সাইন আপ করুন" : "No account? Sign up",
    switchToLogin: isBn ? "একাউন্ট আছে? লগইন করুন" : "Already have an account? Log in",
    forgot: isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot Password?",
    forgotTitle: isBn ? "পাসওয়ার্ড রিসেট করুন" : "Reset your password",
    forgotSubtitle: isBn ? "আপনার একাউন্টের ইমেইল লিখুন, আমরা একটা রিসেট লিংক পাঠাবো।" : "Enter your account's email and we'll send you a reset link.",
    sendResetLink: isBn ? "রিসেট লিংক পাঠান" : "Send reset link",
    backToLogin: isBn ? "লগইনে ফিরে যান" : "Back to log in",
    resetSent: isBn ? "রিসেট লিংক ইমেইলে পাঠানো হয়েছে।" : "Password reset link sent to your email.",
    or: isBn ? "অথবা" : "or",
    google: isBn ? "Google দিয়ে চালিয়ে যান" : "Continue with Google",
    guest: isBn ? "একাউন্ট ছাড়াই ব্যবহার করুন" : "Continue without an account",
    guestNote: isStandaloneApp()
      ? (isBn ? "একাউন্ট ছাড়া ব্যবহার করলে ডেটা এই ডিভাইসেই থাকবে (রিফ্রেশ করলেও থাকবে), কিন্তু অন্য ডিভাইসে সিঙ্ক হবে না।" : "Without an account your data stays on this device (survives refresh), but it won't sync to other devices.")
      : (isBn ? "একাউন্ট ছাড়া ব্যবহার করলে ডেটা কোথাও সেভ হয় না — রিফ্রেশ করলে বা সাইট থেকে বের হলেই হারিয়ে যাবে।" : "Without an account your data isn't saved anywhere — it'll be lost on refresh or when you leave the site."),
    errWeak: isBn ? "পাসওয়ার্ড কমপক্ষে ৮ ক্যারেক্টার হতে হবে।" : "Password must be at least 8 characters.",
    errWeakMix: isBn ? "পাসওয়ার্ডে অক্ষর ও সংখ্যা দুটোই থাকতে হবে।" : "Password must include both letters and numbers.",
    errWeakCommon: isBn ? "এই পাসওয়ার্ডটি অনেক সহজ/কমন — একটু কঠিন পাসওয়ার্ড দিন।" : "This password is too common/easy — please choose a stronger one.",
    pwHint: isBn ? "কমপক্ষে ৮ ক্যারেক্টার, অক্ষর ও সংখ্যা মিশিয়ে দিন" : "At least 8 characters, mix letters and numbers",
    errExists: isBn ? "এই ইমেইলে আগে থেকেই একাউন্ট আছে।" : "An account already exists with this email.",
    errInvalid: isBn ? "ইমেইল অথবা পাসওয়ার্ড ভুল।" : "Invalid email or password.",
    errGeneric: isBn ? "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন।" : "Something went wrong. Please try again.",
    needEmail: isBn ? "পাসওয়ার্ড রিসেট করতে আগে ইমেইল লিখুন।" : "Enter your email first to reset password.",
  };

  const mapError = (code) => {
    if (code === "auth/weak-password") return L.errWeak;
    if (code === "auth/email-already-in-use") return L.errExists;
    if (code === "auth/invalid-email") return isBn ? "সঠিক ইমেইল লিখুন।" : "Enter a valid email.";
    if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") return L.errInvalid;
    if (code === "auth/too-many-requests") return isBn ? "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।" : "Too many attempts. Please try again later.";
    if (code === "auth/network-request-failed") return isBn ? "ইন্টারনেট সংযোগের সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "A network error occurred. Please try again.";
    if (code === "auth/requires-recent-login") return isBn ? "নিরাপত্তার জন্য আবার লগইন করুন, তারপর চেষ্টা করুন।" : "For security, please sign in again and try again.";
    return L.errGeneric;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");
    if (!email || !password) return;
    if (mode === "signup") {
      const pwCode = passwordErrorCode(password);
      if (pwCode === "short") { setError(L.errWeak); return; }
      if (pwCode === "mix") { setError(L.errWeakMix); return; }
      if (pwCode === "common") { setError(L.errWeakCommon); return; }
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (name.trim()) {
          try { await updateProfile(cred.user, { displayName: name.trim() }); } catch (_) {}
        }
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err) {
      setError(mapError(err.code));
    } finally {
      setBusy(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");
    if (!forgotEmail) { setError(L.needEmail); return; }
    setBusy(true);
    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      setInfo(L.resetSent);
    } catch (err) {
      setError(mapError(err.code));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setBusy(true);
    try {
      if (Capacitor.isNativePlatform()) {
        // Native Android/iOS: সরাসরি native account picker (একদম PC/Android Studio বিল্ডের মতোই)
        const result = await FirebaseAuthentication.signInWithGoogle();
        const idToken = result?.credential?.idToken;
        if (!idToken) throw new Error("no-id-token");
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
      } else {
        // ব্রাউজার/Vercel এ চললে আগের মতোই popup flow
        await signInWithPopup(auth, googleProvider);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      if (err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request" || err?.message === "The user canceled the sign-in flow.") {
        setError(isBn ? "Google sign-in বাতিল করা হয়েছে।" : "Google sign-in was cancelled.");
      } else if (err?.code === "auth/account-exists-with-different-credential") {
        setError(isBn ? "এই ইমেইলে আগে থেকেই অন্যভাবে একাউন্ট আছে। আগে সেই পদ্ধতিতে লগইন করুন।" : "An account already exists with this email using a different sign-in method. Please sign in with that method first.");
      } else if (err?.code === "auth/unauthorized-domain") {
        setError(isBn ? "এই ডোমেইন Firebase-এ অনুমোদিত নয়। Firebase Authentication-এর Authorized domains-এ ডোমেইনটি যোগ করুন।" : "This domain is not authorized in Firebase. Add the domain under Firebase Authentication → Settings → Authorized domains.");
      } else if (err?.code === "auth/popup-blocked") {
        setError(isBn ? "ব্রাউজার Google login popup বন্ধ করে দিয়েছে। Popup allow করে আবার চেষ্টা করুন।" : "Your browser blocked the Google sign-in popup. Allow popups and try again.");
      } else {
        // সমস্যা খুঁজে বের করার জন্য সাময়িকভাবে আসল error code/message ও দেখানো হচ্ছে
        const debugInfo = err?.code || err?.message || String(err);
        setError(`${L.errGeneric} [${debugInfo}]`);
      }
    } finally {
      setBusy(false);
    }
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box", border: `1px solid ${cardBorder}`, background: dark ? "#242229" : "#FFFFFF",
    color: textMain, borderRadius:12, padding: "12px 14px", fontSize:14.5, outline: "none",
  };

  // আলাদা "পাসওয়ার্ড রিসেট" স্ক্রিন — লগইন/সাইন-আপ ফর্ম থেকে সম্পূর্ণ আলাদা, শুধু ইমেইল চাওয়া হয়
  if (mode === "forgot") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding:20, background: dark ? "#1A1814" : "#F8F5EF" }}>
        <div style={{ width: "100%", maxWidth: cardMaxWidth, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius:14, padding: "28px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap:8, marginBottom: 18 }}>
            <button type="button" onClick={() => { setMode("login"); setError(""); setInfo(""); setForgotEmail(""); }}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: textMuted2, padding:4, display: "flex" }}>
              <ChevronLeft size={20} />
            </button>
            <div style={{ fontSize:16.5, fontWeight: 800 }}>{L.forgotTitle}</div>
          </div>

          {!info && <div style={{ fontSize:13.5, color: textMuted2, marginBottom: 16, lineHeight: 1.6 }}>{L.forgotSubtitle}</div>}

          <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap:10 }}>
            <input type="email" placeholder={L.email} value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} style={inputStyle} required disabled={!!info} />
            {error && <div style={{ fontSize:12.5, color: "#C0553F", fontWeight: 600 }}>{error}</div>}
            {info && <div style={{ fontSize:12.5, color: "#6E8B5E", fontWeight: 600 }}>{info}</div>}
            {!info && (
              <button type="submit" disabled={busy} style={{
                marginTop: 4, border: "none", borderRadius:12, padding: "12px 0", fontSize:14.5, fontWeight: 800,
                background: accent, color: "#fff", cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1,
              }}>
                {busy ? "..." : L.sendResetLink}
              </button>
            )}
            <button type="button" onClick={() => { setMode("login"); setError(""); setInfo(""); setForgotEmail(""); }}
              style={{ background: "transparent", border: "none", color: textMuted2, fontSize:12.5, cursor: "pointer", textAlign: "center", marginTop: info ? 4 : 0 }}>
              {L.backToLogin}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding:20, background: dark ? "#1A1814" : "#F8F5EF" }}>
      <div style={{ width: "100%", maxWidth: cardMaxWidth, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius:14, padding: "28px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img src={dark ? LOGO_FULL_DARK : LOGO_FULL} alt="FocusGo" style={{height:30, width:"auto", objectFit:"contain", display:"block", margin:"0 auto"}}/>
          <div style={{ fontSize:12.5, color: textMuted2, marginTop: 8 }}>{L.subtitle}</div>
        </div>

        <div style={{ display: "flex", gap:8, marginBottom: 18 }}>
          <button type="button" onClick={() => { setMode("login"); setError(""); setInfo(""); }}
            style={{ flex: 1, padding: "9px 0", borderRadius:10, fontSize:13.5, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${mode === "login" ? accent : cardBorder}`,
              background: mode === "login" ? accent : "transparent", color: mode === "login" ? "#fff" : textMuted2 }}>
            {L.login}
          </button>
          <button type="button" onClick={() => { setMode("signup"); setError(""); setInfo(""); }}
            style={{ flex: 1, padding: "9px 0", borderRadius:10, fontSize:13.5, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${mode === "signup" ? accent : cardBorder}`,
              background: mode === "signup" ? accent : "transparent", color: mode === "signup" ? "#fff" : textMuted2 }}>
            {L.signup}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap:10 }}>
          {mode === "signup" && (
            <input type="text" placeholder={L.name} value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          )}
          <input type="email" placeholder={L.email} value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
          <PasswordField placeholder={L.password} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required minLength={8} textMuted2={textMuted2} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          {mode === "signup" && (
            <div style={{ fontSize:11.5, color: textMuted2, marginTop: -4 }}>{L.pwHint}</div>
          )}

          {error && <div style={{ fontSize:12.5, color: "#C0553F", fontWeight: 600 }}>{error}</div>}
          {info && <div style={{ fontSize:12.5, color: "#6E8B5E", fontWeight: 600 }}>{info}</div>}

          <button type="submit" disabled={busy} style={{
            marginTop: 4, border: "none", borderRadius:12, padding: "12px 0", fontSize:14.5, fontWeight: 800,
            background: accent, color: "#fff", cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1,
          }}>
            {busy ? "..." : (mode === "signup" ? L.submitSignup : L.submitLogin)}
          </button>

          {mode === "login" && (
            <button type="button" onClick={() => { setMode("forgot"); setForgotEmail(email); setError(""); setInfo(""); }} style={{ background: "transparent", border: "none", color: textMuted2, fontSize:12.5, cursor: "pointer", textAlign: "center" }}>
              {L.forgot}
            </button>
          )}
        </form>

        <div style={{ display: "flex", alignItems: "center", gap:10, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: cardBorder }} />
          <div style={{ fontSize:11.5, color: textMuted2 }}>{L.or}</div>
          <div style={{ flex: 1, height: 1, background: cardBorder }} />
        </div>

        <button type="button" onClick={handleGoogle} disabled={busy} style={{
          width: "100%", border: `1px solid ${cardBorder}`, background: "transparent", color: textMain,
          borderRadius:12, padding: "11px 0", fontSize:13.5, fontWeight: 700, cursor: "pointer",
        }}>
          {L.google}
        </button>

        <button type="button" onClick={onGuest} disabled={busy} style={{
          width: "100%", border: "none", background: "transparent", color: textMuted2,
          borderRadius:12, padding: "12px 0 2px", fontSize:13.5, fontWeight: 700, cursor: "pointer", textAlign: "center",
        }}>
          {L.guest}
        </button>
        <div style={{ fontSize:11.5, color: textMuted2, textAlign: "center", marginTop: 4, lineHeight: 1.5, opacity: 0.8 }}>
          {L.guestNote}
        </div>
      </div>
    </div>
  );
}

// সাইন ইন করার পর হেডারে শুধু একটা ইউজার আইকন দেখা যাবে — ক্লিক করলে প্রোফাইল মোডাল খুলবে
function UserMenu({ onOpenProfile, onOpenSettings, cardBorder, cardBg, textMain, textMuted2, user, profileLabel, settingsLabel }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{position:"relative", flexShrink:0}}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ border: `1px solid ${cardBorder}`, background: cardBg, color: textMain, borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, overflow:"hidden", padding:0 }}
        title={profileLabel}
      >
        {user && user.photoURL ? (
          <img src={user.photoURL} alt="" style={{width:"100%", height:"100%", objectFit:"cover"}}/>
        ) : (
          <User size={14} />
        )}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{position:"fixed", inset:0, zIndex:59}}/>
          <div style={{position:"absolute", right:0, top:"100%", marginTop:6, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:12, boxShadow:"0 4px 14px rgba(0,0,0,0.10)", zIndex:60, minWidth:160, overflow:"hidden", padding:4}}>
            <button onClick={() => { setOpen(false); onOpenProfile(); }} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:textMain, borderRadius:8, padding:"9px 10px", fontSize:13.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
              <User size={14} color={textMuted2}/> {profileLabel}
            </button>
            <button onClick={() => { setOpen(false); onOpenSettings(); }} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:textMain, borderRadius:8, padding:"9px 10px", fontSize:13.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
              <Settings size={14} color={textMuted2}/> {settingsLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Notification bell (header) ----------
// Shows recent in-app notifications: session done, exam reminders, streak, daily goal, inactivity.
function timeAgoLabel(iso, lang) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(diffMs / 60000));
  if (mins < 1) return lang === "bn" ? "এখনই" : "just now";
  if (mins < 60) return lang === "bn" ? `${mins} মিনিট আগে` : `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return lang === "bn" ? `${hrs} ঘণ্টা আগে` : `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return lang === "bn" ? `${days} দিন আগে` : `${days}d ago`;
}

function NotificationBell({ t, lang, notifications, onMarkAllRead, onClear, cardBorder, cardBg, textMain, textMuted2, accent, dark }) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => { setOpen(v => !v); if (!open) onMarkAllRead(); }}
        className="fg-btn-circle fg-btn-circle--sm"
        style={{ position: "relative" }}
        title={t.notifications}
      >
        <Bell size={13} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span style={{ position: "absolute", top: 1, right: 2, width: 8, height: 8, borderRadius: "50%", background: "#F0651E", border: `1.5px solid ${cardBg}` }} />
        )}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 59 }} />
          <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 6, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius:14, boxShadow: "0 4px 14px rgba(0,0,0,0.10)", zIndex: 60, width: 300, maxWidth: "88vw", maxHeight: 360, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: `1px solid ${cardBorder}` }}>
              <span style={{ fontSize:13.5, fontWeight: 800, color: textMain }}>{t.notifications}</span>
              {notifications.length > 0 && (
                <button onClick={onClear} style={{ border: "none", background: "transparent", color: textMuted2, fontSize:11.5, fontWeight: 700, cursor: "pointer", padding: 4 }}>{t.clearAll}</button>
              )}
            </div>
            <div style={{ overflowY: "auto" }}>
              {notifications.length === 0 && (
                <div style={{ padding: "28px 12px", textAlign: "center" }}>
                  <Bell size={20} color={textMuted2} strokeWidth={1.6} style={{opacity:0.5, marginBottom:8}}/>
                  <div style={{ fontSize:12.5, color: textMuted2 }}>{t.noNotifications}</div>
                </div>
              )}
              {notifications.map(n => (
                <div key={n.id} style={{ display: "flex", gap:8, padding: "10px 12px", borderBottom: `1px solid ${cardBorder}`, background: n.read ? "transparent" : (dark ? "#242424" : "#F8F5EE") }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: accent, flexShrink: 0, marginTop: 5, opacity: n.read ? 0 : 1 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize:12.5, fontWeight: 700, color: textMain }}>{n.title}</div>
                    <div style={{ fontSize:11.5, color: textMuted2, marginTop: 2, lineHeight: 1.4 }}>{n.body}</div>
                    <div style={{ fontSize:10.5, color: textMuted2, opacity: 0.7, marginTop: 3 }}>{timeAgoLabel(n.time, lang)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Universal Search — টাস্ক, নোট, সাবজেক্ট/টপিক, পরীক্ষা — সব একসাথে খোঁজার মডাল ----------
function UniversalSearchModal({
  lang, dark, cardBg, cardBorder, textMain, textMuted2, accent,
  tasks, notes, allSubjects, topicBank, examSubjects, examSchedule, sortMode,
  onClose, onOpenTask, onOpenNote, onOpenSubject, onOpenExam,
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  const isBn = lang === "bn";
  useEffect(() => { const id = setTimeout(() => inputRef.current && inputRef.current.focus(), 80); return () => clearTimeout(id); }, []);

  const query = q.trim().toLowerCase();

  const results = React.useMemo(() => {
    if (!query) return null;
    const out = { tasks: [], notes: [], subjects: [], topics: [], exams: [] };

    (tasks || []).forEach(x => {
      if (!x.deletedAt && (x.title || "").toLowerCase().includes(query)) out.tasks.push(x);
    });

    (notes || []).forEach(n => {
      if (n.deletedAt) return;
      const hay = ((n.title || "") + " " + stripHtmlToText(n.body || "")).toLowerCase();
      if (hay.includes(query)) out.notes.push(n);
    });

    (allSubjects || []).forEach(s => {
      if (s.toLowerCase().includes(query)) out.subjects.push(s);
    });

    const seenTopic = new Set();
    Object.entries(topicBank || {}).forEach(([subject, list]) => {
      (list || []).forEach(topic => {
        const k = subject + "::" + topic;
        if (topic.toLowerCase().includes(query) && !seenTopic.has(k)) { seenTopic.add(k); out.topics.push({ subject, topic }); }
      });
    });
    Object.entries(examSubjects || {}).forEach(([subject, data]) => {
      Object.keys((data && data.topics) || {}).forEach(topic => {
        const k = subject + "::" + topic;
        if (topic.toLowerCase().includes(query) && !seenTopic.has(k)) { seenTopic.add(k); out.topics.push({ subject, topic }); }
      });
    });

    (examSchedule || []).forEach(ex => {
      if ((ex.subject || "").toLowerCase().includes(query)) out.exams.push(ex);
    });

    // Today ট্যাবের sliders আইকন থেকে নির্বাচিত sort mode অনুযায়ী রেজাল্ট সাজানো —
    // priority/status শুধু টাস্কের ক্ষেত্রেই অর্থবহ, date আর name সব ধরনের রেজাল্টেই প্রযোজ্য যতটা সম্ভব
    const priorityRank = { high: 0, med: 1, low: 2 };
    if (sortMode === "priority") {
      out.tasks.sort((a, b) => (priorityRank[a.priority || "med"] - priorityRank[b.priority || "med"]));
    } else if (sortMode === "status") {
      out.tasks.sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
    } else if (sortMode === "name") {
      out.tasks.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      out.notes.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      out.subjects.sort((a, b) => a.localeCompare(b));
    } else { // "date" (ডিফল্ট)
      out.tasks.sort((a, b) => (a.dueDate || "9999").localeCompare(b.dueDate || "9999") || (a.reminderTime || "99:99").localeCompare(b.reminderTime || "99:99"));
      out.exams.sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
    }

    return out;
  }, [query, tasks, notes, allSubjects, topicBank, examSubjects, examSchedule, sortMode]);

  const totalCount = results ? Object.values(results).reduce((s, arr) => s + arr.length, 0) : 0;

  const sectionLabel = { fontSize: 11, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.4, margin: "16px 2px 6px" };
  const rowIconWrap = { width: 32, height: 32, borderRadius: 10, background: dark ? "#232129" : "#F1EEE5", display: "flex", alignItems: "center", justifyContent: "center", color: textMuted2, flexShrink: 0 };

  const Row = ({ icon, title, subtitle, onClick }) => (
    <button onClick={onClick} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, border: "none", background: "transparent", padding: "8px 4px", cursor: "pointer", textAlign: "left", borderRadius: 10 }}>
      <span style={rowIconWrap}>{icon}</span>
      <span style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: textMain, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
        {subtitle ? <div style={{ fontSize: 11.5, color: textMuted2, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{subtitle}</div> : null}
      </span>
    </button>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 70 }} className="fg-sheet-backdrop" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="fg-sheet" style={{ position: "absolute", inset: 0, background: cardBg, color: textMain, display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 16px 10px", flexShrink: 0 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, border: `1px solid ${cardBorder}`, borderRadius: 14, padding: "13px 14px" }}>
            <Search size={19} color={textMuted2} />
            <input
              ref={inputRef}
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={isBn ? "টাস্ক, নোট, সাবজেক্ট, পরীক্ষা খুঁজুন..." : "Search tasks, notes, subjects, exams..."}
              style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", color: textMain, fontSize: 16 }}
            />
            {q && (
              <button onClick={() => setQ("")} style={{ border: "none", background: "transparent", cursor: "pointer", color: textMuted2, display: "flex", padding: 0 }}><X size={16} /></button>
            )}
          </div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: textMuted2, fontSize: 13, fontWeight: 700, padding: "6px 2px", flexShrink: 0 }}>
            {isBn ? "বাতিল" : "Cancel"}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px" }}>
          {!query && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "70px 20px", opacity: 0.6 }}>
              <Search size={26} color={textMuted2} strokeWidth={1.6} />
              <div style={{ fontSize: 12.5, color: textMuted2, marginTop: 10, textAlign: "center" }}>
                {isBn ? "টাস্ক, নোট, সাবজেক্ট, টপিক বা পরীক্ষা খুঁজতে টাইপ করো" : "Type to search tasks, notes, subjects, topics or exams"}
              </div>
            </div>
          )}

          {query && totalCount === 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "70px 20px", opacity: 0.6 }}>
              <div style={{ fontSize: 12.5, color: textMuted2, textAlign: "center" }}>{isBn ? "কোনো ফলাফল পাওয়া যায়নি" : "No results found"}</div>
            </div>
          )}

          {query && totalCount > 0 && (
            <div>
              {results.tasks.length > 0 && (
                <div>
                  <div style={sectionLabel}>{isBn ? "টাস্ক" : "Tasks"}</div>
                  {results.tasks.slice(0, 8).map(x => (
                    <Row key={x.id} icon={<ListChecks size={15} />} title={x.title}
                      subtitle={x.dueDate || (x.done ? (isBn ? "সম্পন্ন" : "Completed") : undefined)}
                      onClick={() => onOpenTask(x)} />
                  ))}
                </div>
              )}
              {results.subjects.length > 0 && (
                <div>
                  <div style={sectionLabel}>{isBn ? "সাবজেক্ট" : "Subjects"}</div>
                  {results.subjects.slice(0, 8).map(s => (
                    <Row key={s} icon={<GraduationCap size={15} />} title={s} onClick={() => onOpenSubject(s)} />
                  ))}
                </div>
              )}
              {results.topics.length > 0 && (
                <div>
                  <div style={sectionLabel}>{isBn ? "টপিক" : "Topics"}</div>
                  {results.topics.slice(0, 10).map((x, i) => (
                    <Row key={i} icon={<Folder size={15} />} title={x.topic} subtitle={x.subject} onClick={() => onOpenSubject(x.subject)} />
                  ))}
                </div>
              )}
              {results.exams.length > 0 && (
                <div>
                  <div style={sectionLabel}>{isBn ? "পরীক্ষা" : "Exams"}</div>
                  {results.exams.slice(0, 8).map(ex => (
                    <Row key={ex.id} icon={<CalendarClock size={15} />} title={ex.subject} subtitle={ex.date} onClick={() => onOpenExam(ex)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ডেস্কটপ (≥1024px) এ bottom-nav এর বদলে বাম পাশে সাইডবার — বড় স্ক্রিনে familiar "app" লেআউট
function DesktopSidebar({ t, tab, setTab, vibrate, dark, cardBorder, textMain, textMuted2, accent, collapsed, onToggleCollapse, onHideAll, studyFeatureEnabled, tasksFeatureEnabled }) {
  const items = [
    { k: "today", Icon: Home },
    ...(studyFeatureEnabled ? [{ k: "study", Icon: GraduationCap }] : []),
    ...(tasksFeatureEnabled ? [{ k: "task", Icon: ListChecks }] : []),
  ];
  return (
    <div style={{
      width: collapsed ? 68 : 232, flexShrink: 0, borderRight: `1px solid ${cardBorder}`,
      padding: collapsed ? "28px 10px" : "28px 14px", display: "flex", flexDirection: "column", gap:4,
      position: "sticky", top: 0, height: "100dvh", boxSizing: "border-box",
      transition: "width .18s cubic-bezier(0.16,1,0.3,1), padding .18s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {!collapsed && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
          <button onClick={() => { vibrate(); setTab("today"); }} title={t.tabs.today}
            style={{ border: "none", background: "transparent", cursor: "pointer", padding:0, display: "flex", marginLeft: 8, overflow: "hidden" }}>
            <img src={dark ? LOGO_FULL_DARK : LOGO_FULL} alt="FocusGo" style={{ height: 26, width: "auto", objectFit: "contain" }} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap:6, flexShrink: 0 }}>
            <button onClick={() => { vibrate(); onToggleCollapse(); }} title="সাইডবার সংকুচিত করুন"
              style={{ border: `1px solid ${cardBorder}`, background: "transparent", color: textMuted2, borderRadius:8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <ChevronLeft size={14} />
            </button>
            {onHideAll && (
              <button onClick={() => { vibrate(); onHideAll(); }} title="সাইডবার সম্পূর্ণ লুকান"
                style={{ border: `1px solid ${cardBorder}`, background: "transparent", color: textMuted2, borderRadius:8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <EyeOff size={14} />
              </button>
            )}
          </div>
        </div>
      )}
      <div style={{ marginTop: collapsed ? 4 : 0, display: "flex", flexDirection: "column", gap:4 }}>
      {items.map(({ k, Icon }) => (
        <button key={k} onClick={() => { vibrate(); setTab(k); }} title={collapsed ? t.tabs[k] : undefined} style={{
          display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap:12, border: "none", borderRadius:12,
          padding: collapsed ? "11px 0" : "11px 12px", fontSize:14.5, fontWeight: 700, cursor: "pointer", textAlign: "left",
          background: "transparent",
          color: tab === k ? accent : textMuted2,
          transition: "background .2s ease, color .2s ease",
        }}>
          <Icon size={22} strokeWidth={tab === k ? 2.3 : 2} />
          {!collapsed && t.tabs[k]}
        </button>
      ))}
      </div>
      {collapsed && (
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap:8 }}>
          <button onClick={() => { vibrate(); onToggleCollapse(); }} title="সাইডবার দেখান"
            style={{ border: `1px solid ${cardBorder}`, background: "transparent", color: textMuted2, borderRadius:8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronRight size={14} />
          </button>
          {onHideAll && (
            <button onClick={() => { vibrate(); onHideAll(); }} title="সাইডবার সম্পূর্ণ লুকান"
              style={{ border: `1px solid ${cardBorder}`, background: "transparent", color: textMuted2, borderRadius:8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <EyeOff size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- ছোট, রি-ইউজেবল কাস্টম ড্রপডাউন — Settings-এ Week Starts On / Default Timer Duration-এ ব্যবহার হয় (বড় পিল-গ্রিডের বদলে কমপ্যাক্ট) ----------
function SettingsDropdown({ value, options, onChange, dark, cardBorder, textMain, textMuted2, accent }) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value);
  const wrapRef = useRef(null);
  // আগে এখানে ফুল-স্ক্রিন ইনভিজিবল ব্যাকড্রপ (position:fixed + onClick) দিয়ে "বাইরে ট্যাপ করলে বন্ধ" করা হতো।
  // মোবাইল WebView-তে একটা ট্যাপে touchend-এর কিছুক্ষণ পর একটা দেরিতে আসা/ঘোস্ট click ইভেন্ট আবার একই
  // কো-অর্ডিনেটে ফায়ার হয় — ততক্ষণে ব্যাকড্রপটা ঠিক সেই জায়গাতেই বসে যাওয়ায় সেটাই এই দ্বিতীয় ক্লিকটা ধরে
  // dropdown সাথে সাথে (প্রায় ১০০ms-এর মধ্যেই) বন্ধ করে দিত — তাই অপশন লিস্ট এক পলকের জন্য দেখা যেত, ট্যাপ করার
  // সময়ই পেত না কেউ। এখন salahMenuRef-এর মতো একই প্রমাণিত পদ্ধতি ব্যবহার করা হচ্ছে: ref + useEffect-এ
  // document-level mousedown/touchstart লিসেনার, যেটা কমিট হওয়ার পরে বসে বলে dropdown খোলার সেই একই
  // ট্যাপ/ক্লিকটা ধরে ফেলে না।
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("touchstart", handler); };
  }, [open]);
  return (
    <div ref={wrapRef} style={{position:"relative"}}>
      <button type="button" onClick={()=>setOpen(o=>!o)} style={{
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, width:"100%",
        border:`1px solid ${cardBorder}`, background: dark?"#0A0A0A":"#F8F5EE", color:textMain,
        borderRadius:10, padding:"10px 12px", fontSize:13.5, fontWeight:700, cursor:"pointer"
      }}>
        <span>{current ? current.label : ""}</span>
        <ChevronDown size={15} style={{transform: open ? "rotate(180deg)" : "none", transition:"transform .15s", flexShrink:0, color:textMuted2}}/>
      </button>
      {open && (
        <div style={{position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background: dark?"#121212":"#FFFFFF", border:`1px solid ${cardBorder}`, borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,0.25)", zIndex:60, maxHeight:220, overflowY:"auto", padding:6}}>
          {options.map(o => {
            const selected = o.value === value;
            return (
              <button key={o.value} type="button" onClick={()=>{ onChange(o.value); setOpen(false); }} style={{
                width:"100%", textAlign:"left", border:"none", background: selected ? `${accent}1A` : "transparent",
                color: selected ? accent : textMain, borderRadius:8, padding:"9px 10px", fontSize:13.5, fontWeight:700, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"space-between"
              }}>
                {o.label}{selected && <Check size={14} strokeWidth={3}/>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------- সেটিংসের এক লাইনের রো — আগে SettingsModal-এর ভেতরে ইনলাইন ডিফাইন করা হতো, যার ফলে
// SettingsModal-এর প্রতিটা re-render-এ (accordion খোলা/বন্ধ, dropdown থেকে ভ্যালু বদল, ভাষা/থিম বদল —
// এমনকি অন্য কোনো unrelated prop বদলালেও) Row একটা নতুন ফাংশন রেফারেন্স হয়ে যেত, আর React সেটাকে
// সম্পূর্ণ নতুন কম্পোনেন্ট টাইপ ধরে পুরো সাবট্রি unmount+remount করত — এর ভেতরে থাকা SettingsDropdown-এর
// নিজের "open" state-ও রিসেট হয়ে যেত, তাই ড্রপডাউন খুললেও তাৎক্ষণিক বন্ধ হয়ে যেত এবং অপশনে ট্যাপ
// করলেও তা সিলেক্ট হওয়ার আগেই কম্পোনেন্ট রিমাউন্ট হয়ে বন্ধ হয়ে যেত। এখন এটাকে module-level-এ স্থিতিশীল
// কম্পোনেন্ট হিসেবে বের করে আনা হলো, তাই পুরনো ইনস্ট্যান্স আর কখনো ধ্বংস হবে না — শুধু props বদলাবে।
function SettingsRow({ Icon, title, subtitle, right, onClick, href, expandKey, children, borderTop = true,
  cardBorder, textMain, textMuted2, iconBg, iconColor, openCard, toggleCard, vibrate, isBn }) {
  const isExpandable = !!expandKey;
  const open = isExpandable && openCard === expandKey;
  const handleClick = () => {
    vibrate();
    if (isExpandable) { toggleCard(expandKey); return; }
    if (onClick) onClick();
  };
  const inner = (
    <div onClick={href ? undefined : handleClick} style={{
        display:"flex", alignItems:"center", gap:12, padding:"13px 4px",
        borderTop: borderTop ? `1px solid ${cardBorder}` : "none",
        cursor: (onClick || href || isExpandable) ? "pointer" : "default",
      }}>
      <span style={{ width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Icon size={19} color={iconColor}/></span>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:14.5, fontWeight:700, color:textMain, marginBottom:1}}>{title}</div>
        {subtitle && <div style={{fontSize:12, color:textMuted2, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{subtitle}</div>}
      </div>
      {right !== undefined ? right : (
        isExpandable
          ? <ChevronDown size={16} color={textMuted2} style={{transform: open ? "rotate(180deg)" : "none", transition:"transform .15s", flexShrink:0}}/>
          : (isBn ? <ChevronLeft size={16} color={textMuted2} style={{flexShrink:0}}/> : <ChevronRight size={16} color={textMuted2} style={{flexShrink:0}}/>)
      )}
    </div>
  );
  return (
    <>
      {href ? <a href={href} onClick={()=>vibrate()} style={{textDecoration:"none", display:"block"}}>{inner}</a> : inner}
      {isExpandable && open && children && (
        <div style={{padding:"2px 4px 16px 46px"}}>{children}</div>
      )}
    </>
  );
}

// ---------- Settings quick menu — উপরের gear আইকনে ক্লিক করলে খুলে যাওয়া ছোট popup কার্ড, বর্তমান
// Settings পেজের সবগুলো সেকশনের শর্টকাট এক লিস্টে (আপাতত সবকিছু রাখা হয়েছে, পরে দরকার হলে কমানো যাবে) ----------
function SettingsQuickMenu({ isBn, dark, cardBg, cardBorder, textMain, textMuted2, accent, onSelect, onClose }) {
  const items = [
    { key: "profile", Icon: User, title: isBn ? "প্রোফাইল" : "Profile", subtitle: isBn ? "অ্যাকাউন্ট ও সিঙ্ক" : "Account and sync" },
    { key: "appearance", Icon: Palette, title: isBn ? "অ্যাপিয়ারেন্স" : "Appearance", subtitle: isBn ? "থিম, রং ও লেখার আকার" : "Theme, colors and text size" },
    { key: "weekStart", Icon: CalendarRange, title: isBn ? "সপ্তাহ শুরু" : "Week starts on", subtitle: isBn ? "ক্যালেন্ডার সেটিং" : "Calendar setting" },
    { key: "timer", Icon: Hourglass, title: isBn ? "ফোকাস টাইমার" : "Focus Timer", subtitle: isBn ? "ফোকাস ও বিরতির সময়" : "Focus and break length" },
    { key: "reminders", Icon: CalendarDays, title: isBn ? "স্টাডি রিমাইন্ডার" : "Study Reminders", subtitle: isBn ? "স্টাডির নোটিফিকেশন" : "Study notifications" },
    { key: "salah", Icon: MosqueIcon, title: isBn ? "সালাতের সময়" : "Salah Timer", subtitle: isBn ? "চালু/বন্ধ" : "On or off" },
    { key: "visibleTabs", Icon: LayoutGrid, title: isBn ? "ভিজিবল ট্যাব" : "Visible Tabs", subtitle: isBn ? "কোন ট্যাব দেখাবে" : "Which tabs to show" },
    { key: "notifications", Icon: Bell, title: isBn ? "নোটিফিকেশন" : "Notifications", subtitle: isBn ? "অ্যাপের নোটিফিকেশন" : "App notifications" },
    { key: "sound", Icon: Vibrate, title: isBn ? "হ্যাপটিক ফিডব্যাক" : "Haptic feedback", subtitle: isBn ? "কম্পন" : "Vibration" },
    { key: "backup", Icon: Cloud, title: isBn ? "ব্যাকআপ ও সিঙ্ক" : "Backup & Sync", subtitle: isBn ? "ক্লাউডে সংরক্ষণ" : "Save to the cloud" },
    { key: "export", Icon: UploadCloud, title: isBn ? "এক্সপোর্ট ডেটা" : "Export Data", subtitle: isBn ? "সাথে সাথে ডাউনলোড হবে" : "Downloads right away" },
    { key: "import", Icon: UploadCloud, title: isBn ? "ইমপোর্ট ডেটা" : "Import Data", subtitle: isBn ? "ফাইল বেছে নিন" : "Choose a file" },
    { key: "help", Icon: HelpCircle, title: isBn ? "সাহায্য ও সাপোর্ট" : "Help & Support", subtitle: isBn ? "মেইল অ্যাপ খুলবে" : "Opens your mail app" },
    { key: "about", Icon: Info, title: isBn ? "FocusGo সম্পর্কে" : "About FocusGo", subtitle: isBn ? "ভার্সন ও তথ্য" : "Version and info" },
  ];
  return (
    <div style={{position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center"}}>
      <div onClick={onClose} style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.42)"}}/>
      <div style={{
        position:"relative", width:"100%", maxWidth:480,
        background: dark ? "#171512" : "#FFFFFF",
        borderRadius:"22px 22px 0 0",
        boxShadow:"0 -8px 30px rgba(0,0,0,0.25)",
        maxHeight:"78vh", display:"flex", flexDirection:"column",
        paddingBottom:"env(safe-area-inset-bottom)",
      }}>
        <div style={{padding:"16px 18px 4px"}}>
          <div style={{display:"flex", justifyContent:"flex-end"}}>
            <button onClick={onClose} style={{
                width:28, height:28, borderRadius:"50%", border:"none",
                background: dark ? "rgba(255,255,255,0.08)" : "#F1EFE8",
                display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
              }}>
              <X size={15} color={textMuted2}/>
            </button>
          </div>
          <div style={{fontSize:19, fontWeight:600, color:textMain, marginTop:2}}>{isBn ? "সেটিংস" : "Settings"}</div>
          <div style={{fontSize:12.5, color:textMuted2, marginBottom:6}}>{isBn ? "যা খুলতে চান বেছে নিন" : "Choose what you'd like to open"}</div>
        </div>
        <div style={{overflowY:"auto", padding:"0 12px 10px"}}>
          {items.map(({ key, Icon, title, subtitle }) => (
            <button key={key} onClick={() => { vibrate(); onSelect(key); }} style={{
                width:"100%", display:"flex", alignItems:"center", gap:12, border:"none", background:"transparent",
                padding:"11px 6px", cursor:"pointer", textAlign:"left",
                borderTop: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #F0EEE8",
              }}>
              <div style={{
                  width:38, height:38, borderRadius:"50%", flexShrink:0,
                  background: dark ? "rgba(255,255,255,0.08)" : "#F0EEF5",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                <Icon size={17} color={textMuted2}/>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:14.5, fontWeight:600, color:textMain}}>{title}</div>
                <div style={{fontSize:12, color:textMuted2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{subtitle}</div>
              </div>
              <ChevronRight size={16} color={textMuted2} style={{flexShrink:0}}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Settings modal: Language, Theme, About Us ----------
function SettingsModal({ t, lang, setLang, themeMode, setThemeMode, accentKey, setAccentKey, notificationsEnabled, setNotificationsEnabled,
  examNotifEnabled, setExamNotifEnabled, taskNotifEnabled, setTaskNotifEnabled, salahNotifEnabled, setSalahNotifEnabled, timerNotifEnabled, setTimerNotifEnabled,
  alarmNotifEnabled, setAlarmNotifEnabled,
  salahFeatureEnabled, setSalahFeatureEnabled,
  studyFeatureEnabled, setStudyFeatureEnabled, tasksFeatureEnabled, setTasksFeatureEnabled,
  focusMinutes, setFocusMinutes, breakMinutes, setBreakMinutes, weekStartDay, setWeekStartDay,
  onClose, cardBg, cardBorder, textMain, textMuted2, accent, dark, asPage, onBack,
  user, isGuest, onOpenProfile, notes, tasks, subjects, setNotes, setTasks, setSubjects,
  textScale, setTextScale, TEXT_SCALE_OPTIONS, initialOpenCard, initialAction,
  headerNotifications, onMarkAllNotifRead, onClearNotifs, onOpenSearch }) {
  const [showAbout, setShowAbout] = useState(false);
  // প্রোফাইল কার্ডের পাশে ছোট্ট লগ-আউট আইকন — ট্যাপ করলে আগে একটা কনফার্মেশন পপ-ওভার দেখায়,
  // তারপর "হ্যাঁ" চাপলেই সরাসরি সাইন-আউট হয়ে যায় (আলাদা Account পেজে না গিয়েই)
  const [logoutConfirming, setLogoutConfirming] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const handleQuickSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try { await signOut(auth); } catch (err) { console.error("Sign out error:", err); }
    setSigningOut(false);
    setLogoutConfirming(false);
  };
  const [legalDoc, setLegalDoc] = useState(null); // null | "privacy" | "terms"
  const isBn = lang === "bn";
  // সপ্তাহ শুরুর দিনের লেবেল — 0=রবি...6=শনি, ট্রান্সলেশনের weekStart* কী থেকে বসানো হয়
  const weekStartDayLabel = (d) => ([t.weekStartSun, t.weekStartMon, t.weekStartTue, t.weekStartWed, t.weekStartThu, t.weekStartFri, t.weekStartSat][d]);

  // Notification sub-অপশনগুলো এখন ক্লিক করলে নিচে খুলবে (accordion) — মাস্টার টগলের সাথে সরাসরি বাঁধা নয়
  const [notifExpanded, setNotifExpanded] = useState(false);

  // হ্যাপটিক ফিডব্যাক অন/অফ — localStorage-এ সেভ থাকে, vibrate() ফাংশন এটা নিজেই চেক করে
  const [hapticsEnabled, setHapticsEnabled] = useState(() => {
    try { return window.localStorage.getItem("focusgo_haptics_enabled") !== "0"; } catch (e) { return true; }
  });
  const toggleHaptics = () => {
    setHapticsEnabled(v => {
      const next = !v;
      try { window.localStorage.setItem("focusgo_haptics_enabled", next ? "1" : "0"); } catch (e) {}
      return next;
    });
  };
  const toggleNotifications = () => setNotificationsEnabled(v => !v);

  // ---- নতুন Settings পেজের (কার্ড-গ্রিড ডিজাইন) জন্য এক্সট্রা state ----
  // কোন Preference কার্ড খোলা আছে — একসাথে একটাই খোলা থাকবে (accordion)
  const [openCard, setOpenCard] = useState(initialOpenCard || null); // null | "appearance" | "timer" | "notifications" | "reminders"
  const toggleCard = (key) => { vibrate(); setOpenCard(v => v === key ? null : key); };

  // স্টাডি রিমাইন্ডার — প্রতিদিন নির্দিষ্ট সময়ে পড়াশোনার রিমাইন্ডার অন/অফ ও সময়
  const [studyRemindersEnabled, setStudyRemindersEnabled] = useState(() => {
    try { return window.localStorage.getItem("focusgo_study_reminders_enabled") !== "0"; } catch (e) { return true; }
  });
  const [studyReminderHour, setStudyReminderHour] = useState(() => {
    try { return Number(window.localStorage.getItem("focusgo_study_reminder_hour") || 20); } catch (e) { return 20; }
  });
  const toggleStudyReminders = () => {
    vibrate();
    setStudyRemindersEnabled(v => {
      const next = !v;
      try { window.localStorage.setItem("focusgo_study_reminders_enabled", next ? "1" : "0"); } catch (e) {}
      return next;
    });
  };
  const setReminderHour = (h) => {
    setStudyReminderHour(h);
    try { window.localStorage.setItem("focusgo_study_reminder_hour", String(h)); } catch (e) {}
  };

  // ডেটা এক্সপোর্ট — নোট, টাস্ক ও সাবজেক্ট একটা .json ফাইলে ডাউনলোড হয়ে যায়
  const [exportDone, setExportDone] = useState(false);
  const exportData = () => {
    vibrate();
    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        app: "FocusGo", version: "1.0.0",
        notes: notes || [], tasks: tasks || [], subjects: subjects || [],
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url; a.download = `focusgo-export-${stamp}.json`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportDone(true);
      setTimeout(() => setExportDone(false), 2200);
    } catch (e) { /* silently ignore — ডাউনলোড সমর্থন না থাকলে কিছু করার নেই */ }
  };

  // ডেটা ইমপোর্ট — আগে এক্সপোর্ট করা .json ফাইল থেকে নোট/টাস্ক/সাবজেক্ট ফিরিয়ে আনা (লোকাল ব্যাকআপ রিস্টোর)
  const importFileInputRef = useRef(null);
  const [importState, setImportState] = useState("idle"); // idle | done | error
  const [importConfirm, setImportConfirm] = useState(null); // পার্স হওয়া ডেটা — কনফার্ম মোডাল দেখানোর জন্য অপেক্ষায়
  const triggerImport = () => { vibrate(); importFileInputRef.current && importFileInputRef.current.click(); };
  // Settings-এর উপরের কুইক মেনু (gear আইকনে ক্লিক করলে যে popup খোলে) থেকে সরাসরি
  // Export/Import/Help/About-এ ক্লিক করলে এই পেজটা খুলে সেই একশনটা নিজে থেকেই একবার চালিয়ে দেয়
  useEffect(() => {
    if (!initialAction) return;
    if (initialAction === "export") exportData();
    else if (initialAction === "import") triggerImport();
    else if (initialAction === "about") setShowAbout(true);
    else if (initialAction === "help") { try { window.location.href = `mailto:mazharul.mrf@gmail.com?subject=${encodeURIComponent(t.feedbackSubject)}`; } catch (e) {} }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onImportFileChosen = (e) => {
    const file = e.target.files && e.target.files[0];
    if (e.target) e.target.value = ""; // একই ফাইল আবার সিলেক্ট করলেও যেন change ইভেন্ট আসে
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || typeof parsed !== "object" || (!Array.isArray(parsed.notes) && !Array.isArray(parsed.tasks) && !Array.isArray(parsed.subjects))) {
          throw new Error("invalid backup file");
        }
        setImportConfirm(parsed);
      } catch (err) {
        setImportState("error");
        setTimeout(() => setImportState("idle"), 2500);
      }
    };
    reader.onerror = () => { setImportState("error"); setTimeout(() => setImportState("idle"), 2500); };
    reader.readAsText(file);
  };
  const confirmImport = () => {
    if (!importConfirm) return;
    vibrate();
    if (Array.isArray(importConfirm.notes)) setNotes(importConfirm.notes);
    if (Array.isArray(importConfirm.tasks)) setTasks(importConfirm.tasks);
    if (Array.isArray(importConfirm.subjects)) setSubjects(importConfirm.subjects);
    setImportConfirm(null);
    setImportState("done");
    setTimeout(() => setImportState("idle"), 2200);
  };


  const rowStyle = { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 2px", borderBottom:"1px solid var(--track)" };
  const labelStyle = { display:"flex", alignItems:"center", gap:10, fontSize:14.5, fontWeight:400, letterSpacing:"0.3px", fontFamily:"'Inter Tight','Inter','Helvetica Neue',sans-serif", color:"var(--text)" };
  const iconWrapStyle = { width:32, height:32, borderRadius:"50%", background: dark?"#0A0A0A":"#F8F5EE", border:`1px solid ${cardBorder}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color: dark ? "#B0ABC2" : "#6E6B7A" };
  // pill বাটন — নির্বাচিত হলে accent রঙে ভরাট থাকবে; Appearance সেকশনে (থিম ও অ্যাকসেন্ট) সরাসরি ইনলাইন ব্যবহার হয়
  const pillBase = { border:"1px solid transparent", borderRadius:999, padding:"9px 16px", fontSize:14, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" };
  // "System" সবার আগে দেখানো হয় — ডিভাইসের prefers-color-scheme অনুযায়ী লাইভ light/dark
  const themeInlineOptions = [{ key: "system", label: t.themeSystem }, ...THEME_ORDER.map(key => ({
    key,
    label: key === "light" ? t.themeLight : key === "dark" ? t.themeDark
         : key === "ivory" ? t.themeIvory : key === "graphite" ? t.themeGraphite : t.themeMist,
  }))];

  if (legalDoc) {
    const sections = legalDoc === "privacy" ? t.privacySections : t.termsSections;
    const title = legalDoc === "privacy" ? t.privacyPolicy : t.termsOfUse;
    return (
      <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={()=>setLegalDoc(null)}>
        <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"14px 14px 0 0", padding:"20px 20px 28px", color:textMain, maxHeight:"85vh", display:"flex", flexDirection:"column"}}>
          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:6, flexShrink:0}}>
            <button onClick={()=>setLegalDoc(null)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, padding:4, display:"flex"}}>
              <ChevronLeft size={20}/>
            </button>
            <div className="fg-section-header" style={{flex:1}}>{title}</div>
            <button onClick={()=>setLegalDoc(null)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
          </div>
          <div style={{fontSize:11.5, color:textMuted2, fontWeight:600, marginBottom:14, paddingLeft:32}}>{t.lastUpdated}: {t.effectiveDate}</div>
          <div style={{overflowY:"auto", paddingRight:2}}>
            {sections.map((sec, i) => (
              <div key={i} style={{marginBottom:18}}>
                <div style={{fontSize:14.5, fontWeight:800, marginBottom:6, color:textMain}}>{sec.title}</div>
                {sec.body.split("\n\n").map((para, j) => (
                  <div key={j} style={{fontSize:13.5, color:textMain, lineHeight:1.7, marginBottom:8, opacity:0.9}}>{para}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showAbout) {
    return (
      <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={()=>setShowAbout(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"14px 14px 0 0", padding:"20px 20px 28px", color:textMain}}>
          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:14}}>
            <button onClick={()=>setShowAbout(false)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, padding:4, display:"flex"}}>
              <ChevronLeft size={20}/>
            </button>
            <div className="fg-section-header" style={{flex:1}}>{t.aboutUs}</div>
            <button onClick={()=>setShowAbout(false)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
          </div>
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"8px 0 20px"}}>
            <img src={dark ? LOGO_FULL_DARK : LOGO_FULL} alt={t.appName} style={{height:34, width:"auto", objectFit:"contain", marginBottom:16}}/>
            <div style={{fontSize:13.5, color:textMain, lineHeight:1.7, textAlign:"center"}}>{t.aboutBody}</div>

            <div style={{width:"100%", borderTop:"1px solid var(--track)", marginTop:20, paddingTop:18}}>
              <div style={{fontSize:11.5, letterSpacing: isBn ? 0 : "1.3px", color:textMuted2, fontWeight:700, opacity:0.85, marginBottom:8}}>{t.creatorLabel}</div>
              <div style={{fontSize:16.5, fontWeight:800, color:textMain, marginBottom:14}}>Md. Mazharul Islam Maruf</div>

              <div style={{display:"flex", justifyContent:"center", gap:10, marginBottom:14}}>
                <a href="https://www.linkedin.com/in/mazharulmrf" target="_blank" rel="noopener noreferrer" title="LinkedIn"
                  style={{...iconWrapStyle, textDecoration:"none"}}><LinkedinIcon size={15}/></a>
                <a href="https://www.facebook.com/mazharul.mrf" target="_blank" rel="noopener noreferrer" title="Facebook"
                  style={{...iconWrapStyle, textDecoration:"none"}}><FacebookIcon size={15}/></a>
                <a href="https://www.behance.net/mazharulmrf" target="_blank" rel="noopener noreferrer" title="Behance"
                  style={{...iconWrapStyle, textDecoration:"none"}}><BehanceIcon size={15}/></a>
              </div>

              <a href="mailto:mazharul.mrf@gmail.com" style={{display:"inline-flex", alignItems:"center", gap:8, textDecoration:"none", color:textMuted2, fontSize:13.5, fontWeight:600}}>
                <Mail size={14}/> mazharul.mrf@gmail.com
              </a>
            </div>

            <div style={{width:"100%", borderTop:"1px solid var(--track)", marginTop:20, paddingTop:6}}>
              <div style={{fontSize:11.5, letterSpacing: isBn ? 0 : "1.3px", color:textMuted2, fontWeight:700, opacity:0.85, margin:"12px 0 2px", textAlign:"left"}}>{t.legalSection}</div>
              <button onClick={()=>setLegalDoc("privacy")} style={{width:"100%", border:"none", background:"transparent", cursor:"pointer", padding:"12px 0", display:"flex", alignItems:"center", justifyContent:"space-between", color:textMain}}>
                <span style={{fontSize:14.5, fontWeight:700}}>{t.privacyPolicy}</span>
                <ChevronRight size={16} style={{color:textMuted2}}/>
              </button>
              <button onClick={()=>setLegalDoc("terms")} style={{width:"100%", border:"none", background:"transparent", cursor:"pointer", padding:"12px 0", display:"flex", alignItems:"center", justifyContent:"space-between", color:textMain, borderTop:"1px solid var(--track)"}}>
                <span style={{fontSize:14.5, fontWeight:700}}>{t.termsOfUse}</span>
                <ChevronRight size={16} style={{color:textMuted2}}/>
              </button>
            </div>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", fontSize:12.5, color:textMuted2, paddingTop:14, borderTop:"1px solid var(--track)"}}>
            <span>{t.version}</span>
            <span>1.0.0</span>
          </div>
        </div>
      </div>
    );
  }

  const settingsRows = (
    <>
      {/* Language */}
      <div style={rowStyle}>
        <div style={labelStyle}><span style={iconWrapStyle}><span style={{fontSize:13.5, fontWeight:800}}>{lang==="bn"?"বাং":"EN"}</span></span>{t.language}</div>
        <button onClick={()=>setLang(l=>l==="bn"?"en":"bn")} style={{border:`1px solid ${cardBorder}`, background: dark?"#0A0A0A":"#F8F5EE", color:textMain, borderRadius:10, padding:"7px 12px", fontSize:12.5, fontWeight:700, cursor:"pointer"}}>
          {lang==="bn" ? "English" : "বাংলা"}
        </button>
      </div>

      {/* Appearance — theme & accent pills shown directly inline, no separate page to tap into */}
      <div style={{padding:"14px 2px", borderBottom:"1px solid var(--track)"}}>
        <div style={{...labelStyle, marginBottom:14}}>
          <span style={{...iconWrapStyle, background:"transparent", border:"none"}}>
            <span style={{width:20, height:20, borderRadius:"50%", background:accent, border:`1px solid ${cardBorder}`, display:"block"}}/>
          </span>
          {t.appearance}
        </div>

        <div style={{display:"flex", flexWrap:"wrap", gap:8, marginBottom:18}}>
          {themeInlineOptions.map(({key, label}) => {
            const selected = themeMode === key;
            const isSystem = key === "system";
            return (
              <button key={key} onClick={()=>setThemeMode(key)} style={{
                ...pillBase,
                display:"flex", alignItems:"center", gap:7,
                border: `1px solid ${selected ? accent : cardBorder}`,
                background: selected ? accent : (dark?"#0A0A0A":"#F8F5EE"),
                color: selected ? "#fff" : textMain,
              }}>
                {isSystem ? (
                  <Contrast size={14} style={{flexShrink:0}}/>
                ) : (
                  <span style={{width:12, height:12, borderRadius:"50%", background:themeFor(key).cardBg, border:`1px solid ${selected ? "rgba(255,255,255,0.6)" : cardBorder}`, flexShrink:0}}/>
                )}
                {label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Notifications on/off — মাস্টার টগল + ক্লিক করলে নিচে প্রতিটা ধরনের নোটিফিকেশন আলাদা করে দেখা/অন-অফ করা যায় (accordion) */}
      <div style={{...rowStyle, borderBottom: notifExpanded ? "none" : `1px solid ${cardBorder}`, cursor:"pointer"}} onClick={()=>setNotifExpanded(v=>!v)}>
        <div style={labelStyle}><span style={iconWrapStyle}><Bell size={15}/></span>{t.notifications}</div>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <button onClick={(e)=>{ e.stopPropagation(); toggleNotifications(); }} aria-pressed={notificationsEnabled} style={{
              width:44, height:26, borderRadius:12, border:"none", cursor:"pointer", padding:0,
              background: notificationsEnabled ? accent : (dark ? "#3A362E" : "#DCD5C4"),
              position:"relative", transition:"background 0.15s"
            }}>
            <span style={{
              position:"absolute", top:3, left: notificationsEnabled ? 21 : 3,
              width:20, height:20, borderRadius:"50%", background:"#fff",
              transition:"left 0.15s", boxShadow:"0 1px 2px rgba(0,0,0,0.25)"
            }}/>
          </button>
          <ChevronDown size={16} color={textMuted2} style={{transform: notifExpanded ? "rotate(180deg)" : "none", transition:"transform .15s", flexShrink:0}}/>
        </div>
      </div>

      {/* Notification fine-tuning — Notifications রো-তে ক্লিক করলে খোলে; মাস্টার টগল অফ থাকলে dim/disabled থাকে */}
      {notifExpanded && (
        <div style={{padding:"4px 2px 14px 42px", borderBottom:"1px solid var(--track)", display:"flex", flexDirection:"column", gap:12, opacity: notificationsEnabled ? 1 : 0.45, pointerEvents: notificationsEnabled ? "auto" : "none"}}>
          {[
            { label: t.notifExam, val: examNotifEnabled, set: setExamNotifEnabled },
            { label: t.notifTask, val: taskNotifEnabled, set: setTaskNotifEnabled },
            { label: t.notifSalah, val: salahNotifEnabled, set: setSalahNotifEnabled },
            { label: t.notifTimer, val: timerNotifEnabled, set: setTimerNotifEnabled },
            { label: t.notifAlarm, val: alarmNotifEnabled, set: setAlarmNotifEnabled },
          ].map(({label, val, set}) => (
            <div key={label} style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <span style={{fontSize:13, fontWeight:600, color:textMuted2}}>{label}</span>
              <button onClick={()=>set(v=>!v)} aria-pressed={val} style={{
                  width:36, height:21, borderRadius:11, border:"none", cursor:"pointer", padding:0,
                  background: val ? accent : (dark ? "#3A362E" : "#DCD5C4"),
                  position:"relative", transition:"background 0.15s", flexShrink:0
                }}>
                <span style={{
                  position:"absolute", top:2.5, left: val ? 18 : 2.5,
                  width:16, height:16, borderRadius:"50%", background:"#fff",
                  transition:"left 0.15s", boxShadow:"0 1px 2px rgba(0,0,0,0.25)"
                }}/>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Default Focus/Break duration — এখন দুইটা কমপ্যাক্ট ড্রপডাউন পাশাপাশি, টাইমার শুরু করার সময় এই মানই ডিফল্ট হিসেবে বসবে */}
      <div style={{padding:"14px 2px", borderBottom:"1px solid var(--track)"}}>
        <div style={{...labelStyle, marginBottom:12}}><span style={iconWrapStyle}><Clock size={15}/></span>{t.defaultTimerDuration}</div>
        <div style={{display:"flex", gap:10}}>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:11.5, fontWeight:800, color:textMuted2, letterSpacing:0.3, textTransform:"uppercase", marginBottom:7, paddingLeft:2}}>{t.focusLabel}</div>
            <SettingsDropdown
              value={focusMinutes}
              options={[15,20,25,30,45,60].map(mins => ({ value: mins, label: `${mins} ${t.minutes}` }))}
              onChange={setFocusMinutes}
              dark={dark} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}
            />
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:11.5, fontWeight:800, color:textMuted2, letterSpacing:0.3, textTransform:"uppercase", marginBottom:7, paddingLeft:2}}>{t.breakLabel}</div>
            <SettingsDropdown
              value={breakMinutes}
              options={[5,10,15].map(mins => ({ value: mins, label: `${mins} ${t.minutes}` }))}
              onChange={setBreakMinutes}
              dark={dark} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}
            />
          </div>
        </div>
      </div>

      {/* Haptic feedback on/off */}
      <div style={rowStyle}>
        <div style={labelStyle}><span style={iconWrapStyle}><Vibrate size={15}/></span>{t.hapticFeedback}</div>
        <button onClick={toggleHaptics} aria-pressed={hapticsEnabled} style={{
            width:44, height:26, borderRadius:12, border:"none", cursor:"pointer", padding:0,
            background: hapticsEnabled ? accent : (dark ? "#3A362E" : "#DCD5C4"),
            position:"relative", transition:"background 0.15s"
          }}>
          <span style={{
            position:"absolute", top:3, left: hapticsEnabled ? 21 : 3,
            width:20, height:20, borderRadius:"50%", background:"#fff",
            transition:"left 0.15s", boxShadow:"0 1px 2px rgba(0,0,0,0.25)"
          }}/>
        </button>
      </div>

      {/* Send feedback — সরাসরি মেইল অ্যাপ খুলে ডেভেলপারের ইমেইলে ফিডব্যাক পাঠানো যায় */}
      <a href={`mailto:mazharul.mrf@gmail.com?subject=${encodeURIComponent(t.feedbackSubject)}`} style={{textDecoration:"none", display:"block"}}>
        <div style={rowStyle}>
          <div style={labelStyle}><span style={iconWrapStyle}><Mail size={15}/></span>{t.sendFeedback}</div>
          {isBn ? <ChevronLeft size={16} color={textMuted2}/> : <ChevronRight size={16} color={textMuted2}/>}
        </div>
      </a>

      {/* About Us */}
      <button onClick={()=>setShowAbout(true)} style={{width:"100%", border:"none", background:"transparent", cursor:"pointer", padding:0}}>
        <div style={{...rowStyle, borderBottom:"none"}}>
          <div style={labelStyle}><span style={iconWrapStyle}><Info size={15}/></span>{t.aboutUs}</div>
          {isBn ? <ChevronLeft size={16} color={textMuted2}/> : <ChevronRight size={16} color={textMuted2}/>}
        </div>
      </button>
    </>
  );

  // asPage=true: বাকি ট্যাবগুলোর (Today/Study/Task/Notes) মতোই সরাসরি কন্টেন্ট এরিয়ায় বসবে —
  // নতুন কার্ড-গ্রিড ডিজাইন: হিরো হেডার + প্রোফাইল কার্ড + Preferences গ্রিড + Data & Sync + More
  if (asPage) {
    const themeLabelFor = (key) => key === "system" ? t.themeSystem : key === "light" ? t.themeLight : key === "dark" ? t.themeDark
      : key === "ivory" ? t.themeIvory : key === "graphite" ? t.themeGraphite : t.themeMist;
    const currentThemeLabel = themeLabelFor(themeMode);

    const displayName = (user && (user.displayName || user.email)) ? (user.displayName || user.email) : (isBn ? "গেস্ট ইউজার" : "Guest User");
    const displayEmail = (user && user.email) ? user.email : (isBn ? "সাইন ইন করা হয়নি — ট্যাপ করুন" : "Not signed in — tap to sign in");

    const hourLabel = (h) => {
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const suffix = h < 12 ? t.amLabel : t.pmLabel;
      return `${h12}:00 ${suffix}`;
    };

    // ---- ছোট রি-ইউজেবল টগল সুইচ ----
    const Toggle = ({ on, onClick }) => (
      <button onClick={onClick} aria-pressed={on} style={{
          width:44, height:26, borderRadius:12, border:"none", cursor:"pointer", padding:0, flexShrink:0,
          background: on ? accent : (dark ? "#3A362E" : "#DCD5C4"), position:"relative", transition:"background 0.15s"
        }}>
        <span style={{ position:"absolute", top:3, left: on ? 21 : 3, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left 0.15s", boxShadow:"0 1px 2px rgba(0,0,0,0.25)" }}/>
      </button>
    );

    // ---- মিনিমাল, মনোক্রোম আইকন র‍্যাপ — গ্রিডের বদলে এখন সব প্রেফারেন্স এক লিস্টে, রঙের ভ্যারাইটি বাদ দিয়ে একটাই নিউট্রাল টোন ----
    const neutralIconBg = dark ? "#242229" : "#F0EEF5";
    const neutralIconColor = dark ? "#B0ABC2" : "#6E6B7A";

    // এক লাইনের সেটিংস রো — module-level SettingsRow কম্পোনেন্ট ব্যবহার হয় (উপরে দেখুন কেন — একটা
    // ইনলাইন wrapper ফাংশন এখানে রাখলে সেটাও প্রতি render-এ নতুন রেফারেন্স হয়ে একই সমস্যা ফিরিয়ে আনত,
    // তাই তার বদলে শুধু একটা plain props অবজেক্ট বানানো হলো — এটা কম্পোনেন্ট নয়, তাই re-render-এ
    // নতুন অবজেক্ট বানালেও SettingsRow-এর component identity অপরিবর্তিত থাকে, remount হয় না)।
    const rowCtx = { cardBorder, textMain, textMuted2, iconBg: neutralIconBg, iconColor: neutralIconColor,
      openCard, toggleCard, vibrate, isBn };

    // overflow:"hidden" আগে এখানে ছিল, কিন্তু এই কার্ডের ভেতরের accordion (Focus Timer / Study Reminders)
    // খুললে SettingsDropdown-এর ফ্লাইআউট মেনু position:absolute হয়ে কার্ডের বর্ডারের বাইরে বসতে চায় —
    // overflow hidden থাকায় সেটা ক্লিপ হয়ে যেত, তাই অপশনে ট্যাপ করলেও কিছু হতো না (ক্লিক অদৃশ্য অংশে পড়ত)
    const groupCardStyle = { background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"0 12px", overflow:"visible" };
    const sectionHeadingStyle = { fontSize:12.5, fontWeight:800, color:"var(--muted)", letterSpacing:0.4, textTransform:"uppercase", opacity:0.75, margin:"22px 4px 8px" };

    return (
      <div className="fg-tab-panel" style={{marginTop:18, paddingBottom:8}}>

        {/* ---- হেডার — ছোট, একরঙা, বাড়তি সাবটেক্সট ছাড়া; ডানপাশে ভাষা পিল — Preferences লিস্ট থেকে
             আলাদা রো সরিয়ে এখানে আনা হলো, যাতে লিস্টে একটা আইটেম কমে আর ভাষা সবসময় এক ট্যাপে বদলানো যায় ---- */}
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, gap:10}}>
          <div style={{display:"flex", alignItems:"center", gap:10, minWidth:0}}>
            {onBack && (
              <button onClick={()=>{vibrate(); onBack();}} aria-label={isBn ? "ফিরে যান" : "Back"} style={{
                  border:`1px solid ${cardBorder}`, background: dark?"#0A0A0A":"#fff", color:textMain, borderRadius:"50%",
                  width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0,
                }}>
                {isBn ? <ChevronRight size={17}/> : <ChevronLeft size={17}/>}
              </button>
            )}
            <div className="fg-title">{onBack ? t.profile : t.settings}</div>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:6, flexShrink:0}}>
            {onBack && onOpenSearch && (
              <button onClick={()=>{vibrate(); onOpenSearch();}} title={lang==="bn" ? "খুঁজুন" : "Search"} className="fg-btn-circle fg-btn-circle--sm">
                <Search size={13} strokeWidth={1.8}/>
              </button>
            )}
            {onBack && headerNotifications && (
              <NotificationBell
                t={t} lang={lang} notifications={headerNotifications}
                onMarkAllRead={onMarkAllNotifRead} onClear={onClearNotifs}
                cardBorder={cardBorder} cardBg={cardBg} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}
              />
            )}
            <span onClick={()=>{vibrate(); setLang(l=>l==="bn"?"en":"bn");}} style={{border:`1px solid ${cardBorder}`, background: dark?"#0A0A0A":"#fff", color:textMain, borderRadius:999, padding:"6px 14px", fontSize:13, fontWeight:800, cursor:"pointer", flexShrink:0}}>
              {lang==="bn" ? "বাং" : "EN"}
            </span>
          </div>
        </div>

        {/* ---- প্রোফাইল রো — ডানপাশে এখন ছোট্ট LogOut আইকনও আছে, ট্যাপ করলে কনফার্ম করে সরাসরি সাইন-আউট হয়।
             বাইরের div-টা শুধু রাউন্ডেড কার্ড + পপ-ওভারের জন্য position:relative রাখে (overflow:visible, নাহলে
             নিচের কনফার্ম পপ-ওভার কেটে যেত); ভেতরের flex row-টায় আলাদাভাবে overflow:hidden দেওয়া আছে,
             যাতে LogOut আইকন কোনোভাবেই কার্ডের রাউন্ডেড বর্ডার ছাড়িয়ে বাইরে দেখা না যায় ---- */}
        <div style={{...groupCardStyle, padding:0, width:"100%", marginBottom:20, position:"relative", overflow:"visible"}}>
          <div style={{display:"flex", alignItems:"center", gap:10, padding:"12px 14px", overflow:"hidden"}}>
            <button onClick={() => { vibrate(); onOpenProfile && onOpenProfile(); }} style={{
                flex:1, minWidth:0, display:"flex", alignItems:"center", gap:14, border:"none", background:"transparent",
                padding:0, cursor:"pointer", textAlign:"left",
              }}>
              <span style={{width:44, height:44, borderRadius:"50%", background: dark?"#0A0A0A":"#F8F5EE", border:`1px solid ${cardBorder}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden"}}>
                {user && user.photoURL ? (
                  <img src={user.photoURL} alt="" style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                ) : (
                  <User size={18} color={dark ? "#B0ABC2" : "#6E6B7A"}/>
                )}
              </span>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:15, fontWeight:800, color:textMain, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{displayName}</div>
                <div style={{fontSize:12, color:textMuted2, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{displayEmail}</div>
              </div>
            </button>
            <ChevronRight size={17} color={textMuted2} style={{flexShrink:0}}/>
            {!isGuest && user && (
              <button onClick={()=>{ vibrate(); setLogoutConfirming(v=>!v); }} title={isBn ? "লগ-আউট" : "Log out"} style={{
                  border:"none", background:"transparent", color:"#C0553F", cursor:"pointer", flexShrink:0,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:4, borderRadius:8,
                }}>
                <LogOut size={17}/>
              </button>
            )}
          </div>
          {logoutConfirming && (
            <>
              <div onClick={()=>setLogoutConfirming(false)} style={{position:"fixed", inset:0, zIndex:59}}/>
              <div style={{position:"absolute", right:10, top:"100%", marginTop:6, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:12, boxShadow:"0 4px 14px rgba(0,0,0,0.14)", zIndex:60, minWidth:210, padding:12}}>
                <div style={{fontSize:12.5, fontWeight:700, color:textMain, marginBottom:10}}>
                  {isBn ? "সত্যিই লগ-আউট করবেন?" : "Really log out?"}
                </div>
                <div style={{display:"flex", gap:8}}>
                  <button onClick={()=>{vibrate(); setLogoutConfirming(false);}} style={{flex:1, border:`1px solid ${cardBorder}`, background:"transparent", color:textMain, borderRadius:9, padding:"8px 0", fontWeight:700, fontSize:12.5, cursor:"pointer"}}>
                    {isBn ? "বাতিল" : "Cancel"}
                  </button>
                  <button onClick={()=>{vibrate(); handleQuickSignOut();}} disabled={signingOut} style={{flex:1, border:"none", background:"#C0553F", color:"#fff", borderRadius:9, padding:"8px 0", fontWeight:700, fontSize:12.5, cursor: signingOut ? "default" : "pointer", opacity: signingOut ? 0.7 : 1}}>
                    {isBn ? "লগ-আউট" : "Log out"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ---- Preferences — একটাই কার্ডে সব প্রেফারেন্স, প্রতিটা রো accordion হিসেবে খোলে ---- */}
        <div style={{...sectionHeadingStyle, marginTop:0}}>{isBn ? "পছন্দসমূহ" : "Preferences"}</div>
        <div style={groupCardStyle}>
          <SettingsRow {...rowCtx} Icon={Palette} title={isBn ? "অ্যাপিয়ারেন্স" : "Appearance"} borderTop={false}
            subtitle={isBn ? `টেক্সট সাইজ: ${textScale}%` : `Text size: ${textScale}%`}
            expandKey="appearance"
            right={
              <div style={{display:"flex", alignItems:"center", gap:2, background: dark?"#0A0A0A":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:999, padding:3, flexShrink:0}} onClick={(e)=>e.stopPropagation()}>
                {themeInlineOptions.map(({key, label}) => {
                  const selected = themeMode === key;
                  const SegIcon = key === "system" ? Contrast : (key === "light" ? Sun : Moon);
                  return (
                    <button
                      key={key}
                      onClick={(e) => { e.stopPropagation(); vibrate(); setThemeMode(key); }}
                      title={label}
                      aria-label={label}
                      style={{
                        width:30, height:30, borderRadius:999, border:"none", display:"flex", alignItems:"center", justifyContent:"center",
                        background: selected ? accent : "transparent", color: selected ? "#fff" : textMuted2,
                        cursor:"pointer", transition:"background .15s, color .15s", flexShrink:0,
                      }}
                    >
                      <SegIcon size={14} strokeWidth={2.3}/>
                    </button>
                  );
                })}
              </div>
            }>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <span style={{display:"flex", alignItems:"center", gap:10, fontSize:13.5, fontWeight:700, color:textMain}}><Heading1 size={15} color={textMuted2}/>{isBn ? "ফন্ট ও ডিসপ্লে সাইজ" : "Font & display size"}</span>
              <div style={{display:"flex", alignItems:"center", gap:8, flexShrink:0}}>
                <button
                  onClick={()=>{ vibrate(); const i = TEXT_SCALE_OPTIONS.indexOf(textScale); if (i > 0) setTextScale(TEXT_SCALE_OPTIONS[i-1]); }}
                  disabled={textScale === TEXT_SCALE_OPTIONS[0]}
                  aria-label={isBn ? "ছোট করো" : "Decrease"}
                  style={{width:28, height:28, borderRadius:"50%", border:`1px solid ${cardBorder}`, background:"transparent", color: textScale === TEXT_SCALE_OPTIONS[0] ? textMuted2 : textMain, opacity: textScale === TEXT_SCALE_OPTIONS[0] ? 0.4 : 1, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:15, fontWeight:600, padding:0}}
                >−</button>
                <span style={{fontSize:12.5, fontWeight:700, color:textMain, minWidth:32, textAlign:"center"}}>{textScale}%</span>
                <button
                  onClick={()=>{ vibrate(); const i = TEXT_SCALE_OPTIONS.indexOf(textScale); if (i < TEXT_SCALE_OPTIONS.length-1) setTextScale(TEXT_SCALE_OPTIONS[i+1]); }}
                  disabled={textScale === TEXT_SCALE_OPTIONS[TEXT_SCALE_OPTIONS.length-1]}
                  aria-label={isBn ? "বড় করো" : "Increase"}
                  style={{width:28, height:28, borderRadius:"50%", border:`1px solid ${cardBorder}`, background:"transparent", color: textScale === TEXT_SCALE_OPTIONS[TEXT_SCALE_OPTIONS.length-1] ? textMuted2 : textMain, opacity: textScale === TEXT_SCALE_OPTIONS[TEXT_SCALE_OPTIONS.length-1] ? 0.4 : 1, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:15, fontWeight:600, padding:0}}
                >+</button>
              </div>
            </div>
          </SettingsRow>

          <SettingsRow {...rowCtx} Icon={CalendarRange} title={t.weekStartsOn} subtitle={weekStartDayLabel(weekStartDay)} expandKey="weekStart">
            <SettingsDropdown
              value={weekStartDay}
              options={[6,0,1,2,3,4,5].map(d => ({ value: d, label: weekStartDayLabel(d) }))}
              onChange={(v)=>{ vibrate(); setWeekStartDay(v); }}
              dark={dark} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}/>
          </SettingsRow>

          <SettingsRow {...rowCtx} Icon={Hourglass} title={isBn ? "ফোকাস টাইমার" : "Focus Timer"} subtitle={`${focusMinutes} / ${breakMinutes} ${t.minutes}`} expandKey="timer">
            <div style={{display:"flex", gap:10}}>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:11.5, fontWeight:800, color:textMuted2, letterSpacing:0.3, textTransform:"uppercase", marginBottom:7, paddingLeft:2}}>{t.focusLabel}</div>
                <SettingsDropdown value={focusMinutes} options={[15,20,25,30,45,60].map(m => ({value:m, label:`${m} ${t.minutes}`}))} onChange={setFocusMinutes}
                  dark={dark} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}/>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:11.5, fontWeight:800, color:textMuted2, letterSpacing:0.3, textTransform:"uppercase", marginBottom:7, paddingLeft:2}}>{t.breakLabel}</div>
                <SettingsDropdown value={breakMinutes} options={[5,10,15].map(m => ({value:m, label:`${m} ${t.minutes}`}))} onChange={setBreakMinutes}
                  dark={dark} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}/>
              </div>
            </div>
          </SettingsRow>

          <SettingsRow {...rowCtx} Icon={CalendarDays} title={isBn ? "স্টাডি রিমাইন্ডার" : "Study Reminders"}
            subtitle={studyRemindersEnabled ? (isBn ? "প্রতিদিনের রিমাইন্ডার" : "Daily reminders") : (isBn ? "বন্ধ" : "Off")} expandKey="reminders">
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: studyRemindersEnabled ? 14 : 0}}>
              <span style={{fontSize:13.5, fontWeight:700, color:textMain}}>{isBn ? "দৈনিক স্টাডি রিমাইন্ডার" : "Daily study reminder"}</span>
              <Toggle on={studyRemindersEnabled} onClick={toggleStudyReminders}/>
            </div>
            {studyRemindersEnabled && (
              <div>
                <div style={{fontSize:11.5, fontWeight:800, color:textMuted2, letterSpacing:0.3, textTransform:"uppercase", marginBottom:7, paddingLeft:2}}>{isBn ? "রিমাইন্ডারের সময়" : "Reminder time"}</div>
                <SettingsDropdown value={studyReminderHour} options={[6,7,8,9,10,17,18,19,20,21,22].map(h => ({value:h, label:hourLabel(h)}))} onChange={setReminderHour}
                  dark={dark} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}/>
              </div>
            )}
          </SettingsRow>

          <SettingsRow {...rowCtx} Icon={MosqueIcon} title={isBn ? "সালাতের সময়" : "Salah Timer"}
            subtitle={salahFeatureEnabled ? (isBn ? "চালু আছে" : "On") : (isBn ? "বন্ধ" : "Off")}
            right={<Toggle on={salahFeatureEnabled} onClick={()=>{vibrate(); setSalahFeatureEnabled(v=>!v);}}/>}
            onClick={()=>{vibrate(); setSalahFeatureEnabled(v=>!v);}}/>

          {/* Visible Tabs — Study/Tasks বটম ন্যাভ থেকে দেখানো/লুকানো; Today ও Settings সবসময় থাকে (তাই এখানে টগল নেই) */}
          <SettingsRow {...rowCtx} Icon={LayoutGrid} title={isBn ? "ভিজিবল ট্যাব" : "Visible Tabs"}
            subtitle={[studyFeatureEnabled && (isBn ? "স্টাডি" : "Study"), tasksFeatureEnabled && (isBn ? "টাস্ক" : "Tasks")].filter(Boolean).join(", ") || (isBn ? "সব বন্ধ" : "All off")}
            expandKey="visibleTabs">
            <div style={{display:"flex", flexDirection:"column", gap:12}}>
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                <span style={{fontSize:13.5, fontWeight:700, color:textMain}}>{isBn ? "স্টাডি" : "Study"}</span>
                <Toggle on={studyFeatureEnabled} onClick={()=>{vibrate(); setStudyFeatureEnabled(v=>!v);}}/>
              </div>
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                <span style={{fontSize:13.5, fontWeight:700, color:textMain}}>{isBn ? "টাস্ক" : "Tasks"}</span>
                <Toggle on={tasksFeatureEnabled} onClick={()=>{vibrate(); setTasksFeatureEnabled(v=>!v);}}/>
              </div>
              <div style={{fontSize:11.5, color:textMuted2, lineHeight:1.5, paddingTop:10, borderTop:`1px dashed ${cardBorder}`}}>
                {isBn
                  ? "বন্ধ করলে সেই ট্যাব বটম নেভিগেশন থেকে সরে যাবে। স্টাডি বন্ধ করলে Exam banner ও Today's Study কার্ডও Today ট্যাব থেকে লুকাবে; টাস্ক বন্ধ করলে Today's Tasks কার্ড লুকাবে।"
                  : "Turning one off removes it from the bottom navigation. Turning Study off also hides the Exam banner and Today's Study card from the Today tab; turning Tasks off hides the Today's Tasks card."}
              </div>
            </div>
          </SettingsRow>

          <SettingsRow {...rowCtx} Icon={Bell} title={t.notifications}
            subtitle={notificationsEnabled ? (isBn ? "চালু আছে" : "On") : (isBn ? "বন্ধ" : "Off")}
            right={<Toggle on={notificationsEnabled} onClick={()=>{vibrate(); toggleNotifications();}}/>}
            onClick={()=>{vibrate(); toggleNotifications();}}/>

          <SettingsRow {...rowCtx} Icon={Vibrate} title={t.hapticFeedback}
            subtitle={hapticsEnabled ? (isBn ? "চালু আছে" : "On") : (isBn ? "বন্ধ" : "Off")}
            right={<Toggle on={hapticsEnabled} onClick={toggleHaptics}/>}
            onClick={toggleHaptics}/>
        </div>

        {/* ---- Data & Sync ---- */}
        <div style={sectionHeadingStyle}>{isBn ? "ডেটা ও সিঙ্ক" : "Data & Sync"}</div>
        <div style={groupCardStyle}>
          <SettingsRow {...rowCtx} Icon={Cloud} borderTop={false}
            title={isBn ? "ব্যাকআপ ও সিঙ্ক" : "Backup & Sync"}
            subtitle={isGuest ? (isBn ? "সাইন ইন করুন — সিঙ্ক বন্ধ আছে" : "Sign in to enable sync") : (isBn ? "সব ডিভাইসে অটো-সিঙ্ক চালু আছে" : "Auto-syncing across your devices")}
            onClick={() => { onOpenProfile && onOpenProfile(); }}/>
          <SettingsRow {...rowCtx} Icon={UploadCloud}
            title={isBn ? "এক্সপোর্ট ডেটা" : "Export Data"}
            subtitle={exportDone ? (isBn ? "ডাউনলোড হয়ে গেছে ✓" : "Downloaded ✓") : (isBn ? "নোট ও ডেটা এক্সপোর্ট করুন" : "Export your notes and data")}
            onClick={exportData}/>
          <SettingsRow {...rowCtx} Icon={UploadCloud}
            title={isBn ? "ইমপোর্ট ডেটা" : "Import Data"}
            subtitle={
              importState === "done" ? (isBn ? "রিস্টোর সম্পন্ন হয়েছে ✓" : "Restored ✓")
              : importState === "error" ? (isBn ? "ফাইলটি সঠিক নয়" : "Invalid backup file")
              : (isBn ? "ব্যাকআপ ফাইল থেকে ডেটা ফিরিয়ে আনুন" : "Restore from a backup file")
            }
            onClick={triggerImport}/>
          <input ref={importFileInputRef} type="file" accept="application/json,.json" onChange={onImportFileChosen} style={{display:"none"}}/>
        </div>

        {importConfirm && (
          <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20}} onClick={()=>setImportConfirm(null)}>
            <div onClick={(e)=>e.stopPropagation()} style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:20, maxWidth:340, width:"100%"}}>
              <div style={{fontSize:16.5, fontWeight:800, color:textMain, marginBottom:8}}>{isBn ? "ডেটা রিস্টোর করবেন?" : "Restore this backup?"}</div>
              <div style={{fontSize:13.5, color:textMuted2, fontWeight:600, lineHeight:1.5, marginBottom:16}}>
                {isBn
                  ? "এটি আপনার বর্তমান নোট, টাস্ক ও সাবজেক্ট মুছে ব্যাকআপ ফাইলের ডেটা দিয়ে প্রতিস্থাপন করবে। এই কাজটি ফিরিয়ে নেওয়া যাবে না।"
                  : "This will replace your current notes, tasks, and subjects with the data from this backup file. This cannot be undone."}
              </div>
              <div style={{display:"flex", gap:10}}>
                <button onClick={()=>setImportConfirm(null)} style={{flex:1, border:`1px solid ${cardBorder}`, background:"transparent", color:textMain, borderRadius:12, padding:"10px 0", fontWeight:700, fontSize:13.5, cursor:"pointer"}}>{isBn ? "বাতিল" : "Cancel"}</button>
                <button onClick={confirmImport} style={{flex:1, border:"none", background:accent, color:"#fff", borderRadius:12, padding:"10px 0", fontWeight:700, fontSize:13.5, cursor:"pointer"}}>{isBn ? "রিস্টোর করুন" : "Restore"}</button>
              </div>
            </div>
          </div>
        )}

        {/* ---- More ---- */}
        <div style={sectionHeadingStyle}>{isBn ? "আরও" : "More"}</div>
        <div style={groupCardStyle}>
          <SettingsRow {...rowCtx} Icon={HelpCircle} borderTop={false}
            title={isBn ? "সাহায্য ও সাপোর্ট" : "Help & Support"} subtitle={isBn ? "প্রশ্ন, মতামত ও সহায়তা" : "FAQs, feedback and help"}
            href={`mailto:mazharul.mrf@gmail.com?subject=${encodeURIComponent(t.feedbackSubject)}`}/>
          <SettingsRow {...rowCtx} Icon={Info}
            title={isBn ? "FocusGo সম্পর্কে" : "About FocusGo"} subtitle={`${t.version} 1.0.0`}
            onClick={()=>{vibrate(); setShowAbout(true);}}/>
        </div>
      </div>
    );
  }

  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"14px 14px 0 0", padding:"20px 20px 28px", color:textMain}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
          <div className="fg-section-header">{t.settings}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>
        {settingsRows}
      </div>
    </div>
  );
}

// প্রোফাইল ট্যাব/মোডাল — নাম, ইমেইল, পাসওয়ার্ড, প্রোফাইল ছবি এডিট করা যায় এবং সাইন আউট করার অপশন থাকে
function ProfileModal({ t, lang, user, isGuest, onExitGuest, onClose, onUserUpdate, cardBg, cardBorder, textMain, textMuted2, accent, dark }) {
  const isBn = lang === "bn";
  // ডেস্কটপে (≥1024px) এটা নিচ থেকে উঠে আসা bottom-sheet না হয়ে, স্ক্রিনের মাঝে একটা সেন্টার্ড ডায়ালগ হিসেবে দেখাবে —
  // মোবাইল/ট্যাবলেটে আগের মতোই bottom-sheet থাকবে
  const breakpoint = useViewport();
  const isDesktop = breakpoint === "desktop";
  const overlayStyle = { position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems: isDesktop ? "center" : "flex-end", justifyContent:"center", zIndex:50, padding: isDesktop ? 16 : 0 };
  const sheetRadius = isDesktop ? 22 : "14px 14px 0 0";

  // গেস্ট মোডে কোনো real user অবজেক্ট নেই — সংক্ষিপ্ত "sign in to save" কার্ড দেখানো, এডিট ফর্ম নয়
  if (isGuest) {
    const gL = {
      title: isBn ? "গেস্ট হিসেবে ব্যবহার করছেন" : "You're using FocusGo as a guest",
      body: isStandaloneApp()
        ? (isBn ? "আপনার ডেটা এই ডিভাইসেই থাকছে, রিফ্রেশ করলেও হারাবে না — তবে অন্য কোনো ডিভাইসে সিঙ্ক হচ্ছে না। অন্য ডিভাইস থেকেও অ্যাক্সেস করতে বা হারানোর ঝুঁকি এড়াতে লগইন বা একাউন্ট খুলুন।"
            : "Your data stays on this device and survives refresh — but it isn't syncing to any other device. Log in or create an account to access it elsewhere or avoid losing it.")
        : (isBn ? "আপনার ডেটা কোথাও সেভ হচ্ছে না। ট্যাব বন্ধ করলে, রিফ্রেশ করলে, বা সাইট থেকে বের হলেই হারিয়ে যাবে। সেভ করে রাখতে লগইন বা একাউন্ট খুলুন।"
            : "Your data isn't being saved anywhere. It'll be lost if you close the tab, refresh, or leave the site. Log in or create an account to keep it."),
      cta: isBn ? "লগইন / একাউন্ট খুলুন" : "Log in / Sign up",
    };
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:sheetRadius, padding:"20px 20px 28px", color:textMain}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14}}>
            <div className="fg-section-header">{t.profile}</div>
            <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:16}}>
            <div style={{width:56, height:56, borderRadius:"50%", background: dark?"#0A0A0A":"#F8F5EE", border:`1px solid ${cardBorder}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
              <User size={24} color={dark ? "#B0ABC2" : "#6E6B7A"}/>
            </div>
            <div style={{fontSize:14.5, fontWeight:800}}>{gL.title}</div>
          </div>
          <div style={{fontSize:13.5, color:textMuted2, lineHeight:1.6, marginBottom:20}}>{gL.body}</div>
          <button onClick={onExitGuest} style={{width:"100%", border:"none", borderRadius:12, padding:"12px 0", fontSize:14.5, fontWeight:800, background:accent, color:"#fff", cursor:"pointer"}}>
            {gL.cta}
          </button>
        </div>
      </div>
    );
  }

  const hasPassword = Array.isArray(user.providerData) && user.providerData.some(p => p.providerId === "password");
  const fileInputRef = useRef(null);

  // মূল ভিউ-তে মেনু লিস্ট (Personal Info / Email / Password / Social Links) — কোনটায় ক্লিক করা
  // হয়েছে সেটা এখানে ট্র্যাক হয়, null মানে মেইন মেনু দেখানো হচ্ছে
  const [section, setSection] = useState(null); // null | "personal" | "email" | "password" | "social"

  const [name, setName] = useState(user.displayName || "");
  const [gender, setGender] = useState(user.gender || "");
  const [dob, setDob] = useState(user.dob || "");
  const [personalBusy, setPersonalBusy] = useState(false);
  const [personalError, setPersonalError] = useState("");
  const [personalInfo, setPersonalInfoMsg] = useState("");

  const [email, setEmail] = useState(user.email || "");
  const [confirmPw, setConfirmPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwInfo, setPwInfo] = useState("");

  const [links, setLinks] = useState({
    facebook: (user.socialLinks && user.socialLinks.facebook) || "",
    instagram: (user.socialLinks && user.socialLinks.instagram) || "",
    linkedin: (user.socialLinks && user.socialLinks.linkedin) || "",
    website: (user.socialLinks && user.socialLinks.website) || "",
  });
  const [linksBusy, setLinksBusy] = useState(false);
  const [linksInfo, setLinksInfo] = useState("");

  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const L = {
    nameLabel: isBn ? "নাম" : "Name",
    emailLabel: isBn ? "ইমেইল" : "Email",
    genderLabel: isBn ? "জেন্ডার" : "Gender",
    male: isBn ? "পুরুষ" : "Male",
    female: isBn ? "মহিলা" : "Female",
    dobLabel: isBn ? "জন্ম তারিখ" : "Date of Birth",
    currentPasswordLabel: isBn ? "বর্তমান পাসওয়ার্ড" : "Current Password",
    newPasswordLabel: isBn ? "নতুন পাসওয়ার্ড" : "New Password",
    confirmPasswordLabel: isBn ? "নতুন পাসওয়ার্ড আবার লিখুন" : "Confirm new password",
    personalInfo: isBn ? "ব্যক্তিগত তথ্য" : "Personal Info",
    changeEmail: isBn ? "ইমেইল পরিবর্তন" : "Change Email",
    changePassword: isBn ? "পাসওয়ার্ড পরিবর্তন করুন" : "Change Password",
    socialLinks: isBn ? "সোশ্যাল মিডিয়া লিংক" : "Social Media Links",
    saveChanges: isBn ? "সংরক্ষণ করুন" : "Save Changes",
    changePhoto: isBn ? "ছবি পরিবর্তন" : "Change Photo",
    profileUpdated: isBn ? "প্রোফাইল আপডেট হয়েছে।" : "Profile updated.",
    passwordUpdated: isBn ? "পাসওয়ার্ড পরিবর্তন হয়েছে।" : "Password updated.",
    linksUpdated: isBn ? "লিংক সংরক্ষণ হয়েছে।" : "Links saved.",
    needCurrentPw: isBn ? "ইমেইল পরিবর্তন করতে বর্তমান পাসওয়ার্ড দিন।" : "Enter your current password to change email.",
    wrongPassword: isBn ? "বর্তমান পাসওয়ার্ড ভুল।" : "Current password is incorrect.",
    pwMismatch: isBn ? "নতুন পাসওয়ার্ড দুটো মিলছে না।" : "New passwords don't match.",
    weakPassword: isBn ? "পাসওয়ার্ড কমপক্ষে ৮ ক্যারেক্টার হতে হবে।" : "Password must be at least 8 characters.",
    weakPasswordMix: isBn ? "পাসওয়ার্ডে অক্ষর ও সংখ্যা দুটোই থাকতে হবে।" : "Password must include both letters and numbers.",
    weakPasswordCommon: isBn ? "এই পাসওয়ার্ডটি অনেক সহজ/কমন — একটু কঠিন পাসওয়ার্ড দিন।" : "This password is too common/easy — please choose a stronger one.",
    pwHint: isBn ? "কমপক্ষে ৮ ক্যারেক্টার, অক্ষর ও সংখ্যা মিশিয়ে দিন" : "At least 8 characters, mix letters and numbers",
    emailInUse: isBn ? "এই ইমেইলে আগে থেকেই একাউন্ট আছে।" : "This email is already in use.",
    invalidEmail: isBn ? "সঠিক ইমেইল লিখুন।" : "Enter a valid email.",
    genericErr: isBn ? "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন।" : "Something went wrong. Please try again.",
    noPasswordAccount: isBn ? "Google একাউন্টের জন্য পাসওয়ার্ড পরিবর্তন করা যায় না।" : "Password can't be changed for Google-linked accounts.",
    photoTooLarge: isBn ? "ছবির সাইজ খুব বড়, ১০MB-এর কম ছবি দিন।" : "Image too large — please pick one under 10MB.",
    photoUploadErr: isBn ? "ছবি আপলোড করা যায়নি, আবার চেষ্টা করুন।" : "Couldn't upload the photo — please try again.",
  };

  const inputStyle = { width:"100%", boxSizing:"border-box", background: dark?"#0A0A0A":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"11px 13px", fontSize:14.5, color:textMain, outline:"none", fontFamily:"inherit" };
  const labelStyle = { fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6 };
  const rowStyle = { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 2px", borderBottom:"1px solid var(--track)", cursor:"pointer" };
  const menuLabelStyle = { display:"flex", alignItems:"center", gap:10, fontSize:14.5, fontWeight:700, color:textMain };
  const iconWrapStyle = { width:32, height:32, borderRadius:"50%", background: dark?"#0A0A0A":"#F8F5EE", border:`1px solid ${cardBorder}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color: dark ? "#B0ABC2" : "#6E6B7A" };

  const emailChanged = email.trim() !== (user.email || "");

  const openSection = (key) => {
    setName(user.displayName || ""); setGender(user.gender || ""); setDob(user.dob || "");
    setEmail(user.email || ""); setConfirmPw("");
    setError(""); setInfo(""); setPersonalError(""); setPersonalInfoMsg("");
    setCurPw(""); setNewPw(""); setNewPw2(""); setPwError(""); setPwInfo("");
    setLinksInfo("");
    setSection(key);
  };
  const closeSection = () => setSection(null);

  const handleSignOut = async () => {
    setBusy(true);
    try { await signOut(auth); } catch (err) { console.error("Sign out error:", err); }
    setBusy(false);
    onClose();
  };

  // নাম, জেন্ডার, জন্ম তারিখ — নাম Firebase Auth-এ, বাকিদুটো Firestore-এ (Auth এই ফিল্ডগুলো সাপোর্ট করে না)
  const handleSavePersonal = async () => {
    setPersonalError(""); setPersonalInfoMsg("");
    const trimmedName = name.trim();
    setPersonalBusy(true);
    try {
      if (trimmedName !== (user.displayName || "")) {
        await updateProfile(user, { displayName: trimmedName });
      }
      await setDoc(doc(db, "users", user.uid), { gender, dob }, { merge: true });
      onUserUpdate({ displayName: trimmedName, gender, dob });
      setPersonalInfoMsg(L.profileUpdated);
    } catch (err) {
      setPersonalError(L.genericErr);
    } finally {
      setPersonalBusy(false);
    }
  };

  const handleSaveEmail = async () => {
    setError(""); setInfo("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) { setError(L.invalidEmail); return; }
    if (emailChanged && hasPassword && !confirmPw) { setError(L.needCurrentPw); return; }
    if (!emailChanged) { return; }
    setBusy(true);
    try {
      if (hasPassword) {
        await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, confirmPw));
      }
      await updateEmail(user, trimmedEmail);
      onUserUpdate({ email: trimmedEmail });
      setInfo(L.profileUpdated);
      setConfirmPw("");
    } catch (err) {
      if (err.code === "auth/wrong-password") setError(L.wrongPassword);
      else if (err.code === "auth/email-already-in-use") setError(L.emailInUse);
      else setError(L.genericErr);
    } finally {
      setBusy(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError(""); setPwInfo("");
    if (!hasPassword) { setPwError(L.noPasswordAccount); return; }
    const pwCode = passwordErrorCode(newPw);
    if (pwCode === "short") { setPwError(L.weakPassword); return; }
    if (pwCode === "mix") { setPwError(L.weakPasswordMix); return; }
    if (pwCode === "common") { setPwError(L.weakPasswordCommon); return; }
    if (newPw !== newPw2) { setPwError(L.pwMismatch); return; }
    setPwBusy(true);
    try {
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, curPw));
      await updatePassword(user, newPw);
      setPwInfo(L.passwordUpdated);
      setCurPw(""); setNewPw(""); setNewPw2("");
    } catch (err) {
      if (err.code === "auth/wrong-password") setPwError(L.wrongPassword);
      else if (err.code === "auth/weak-password") setPwError(L.weakPassword);
      else setPwError(L.genericErr);
    } finally {
      setPwBusy(false);
    }
  };

  const handleSaveLinks = async () => {
    setLinksInfo("");
    setLinksBusy(true);
    try {
      await setDoc(doc(db, "users", user.uid), { socialLinks: links }, { merge: true });
      onUserUpdate({ socialLinks: links });
      setLinksInfo(L.linksUpdated);
    } catch (err) {
      setLinksInfo("");
    } finally {
      setLinksBusy(false);
    }
  };

  const handlePickPhoto = () => fileInputRef.current && fileInputRef.current.click();
  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setPhotoError("");
    if (file.size > 10 * 1024 * 1024) { setPhotoError(L.photoTooLarge); return; }
    setPhotoBusy(true);
    // ছবিটা প্রথমে ব্রাউজারেই ছোট (resize) ও কমপ্রেস করে একটা compact base64 বানানো হয়, তারপর
    // Firestore-এর users/{uid} ডকুমেন্টে সেভ হয় (Firebase Storage ব্যবহার হয়নি — সেটার জন্য
    // Blaze/পেইড প্ল্যান লাগে, Spark ফ্রি প্ল্যানে নেই)। Firestore-এর প্রতি ডকুমেন্ট 1MB লিমিটের
    // মধ্যে resize করা ছোট ছবি অনায়াসে ফিট হয়ে যায়। আগে সরাসরি বড় base64 Firebase Auth-এর
    // photoURL ফিল্ডে সেভ করার চেষ্টা হতো — কিন্তু ওই ফিল্ডের ~2048 ক্যারেক্টার লিমিটের কারণে
    // সাইলেন্টলি ফেইল হতো, এটাই "ছবি বদলাচ্ছে না" বাগের আসল কারণ ছিল।
    resizeImageToDataUrl(file, 320, 0.82)
      .then(async (dataUrl) => {
        try {
          await setDoc(doc(db, "users", user.uid), { photoURL: dataUrl }, { merge: true });
          onUserUpdate({ photoURL: dataUrl });
        } catch (err) {
          setPhotoError(L.photoUploadErr);
        } finally {
          setPhotoBusy(false);
        }
      })
      .catch(() => { setPhotoBusy(false); setPhotoError(L.genericErr); });
  };

  const AvatarCircle = ({ size }) => (
    <div style={{width:size, height:size, borderRadius:"50%", background: dark?"#0A0A0A":"#F8F5EE", border:`1px solid ${cardBorder}`, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", flexShrink:0}}>
      {user.photoURL ? (
        <img src={user.photoURL} alt="" style={{width:"100%", height:"100%", objectFit:"cover"}}/>
      ) : user.gender === "female" ? (
        <Venus size={Math.round(size*0.43)} color={dark ? "#B0ABC2" : "#6E6B7A"}/>
      ) : user.gender === "male" ? (
        <Mars size={Math.round(size*0.43)} color={dark ? "#B0ABC2" : "#6E6B7A"}/>
      ) : (
        <User size={Math.round(size*0.43)} color={dark ? "#B0ABC2" : "#6E6B7A"}/>
      )}
    </div>
  );

  const SubHeader = ({ title }) => (
    <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:18}}>
      <button onClick={closeSection} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, padding:4, display:"flex"}}>
        <ChevronLeft size={20}/>
      </button>
      <div className="fg-section-header" style={{flex:1}}>{title}</div>
      <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
    </div>
  );

  // ---------- Personal Info sub-page ----------
  if (section === "personal") {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:sheetRadius, padding:"20px 20px 28px", color:textMain, maxHeight:"88vh", overflowY:"auto"}}>
          <SubHeader title={L.personalInfo}/>
          <div style={{display:"flex", flexDirection:"column", gap:14}}>
            <div>
              <div style={labelStyle}>{L.nameLabel}</div>
              <input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} />
            </div>
            <div>
              <div style={labelStyle}>{L.genderLabel}</div>
              <div style={{display:"flex", gap:8}}>
                {[{key:"male", label:L.male, Icon:Mars}, {key:"female", label:L.female, Icon:Venus}].map(({key,label,Icon}) => {
                  const selected = gender === key;
                  return (
                    <button key={key} onClick={()=>setGender(key)} style={{
                      flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                      border:`1px solid ${selected ? accent : cardBorder}`, background: selected ? `${accent}12` : "transparent",
                      borderRadius:12, padding:"11px 0", cursor:"pointer", color:textMain
                    }}>
                      <Icon size={15} color={selected ? accent : textMuted2}/>
                      <span style={{fontSize:13.5, fontWeight:700}}>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div style={labelStyle}>{L.dobLabel}</div>
              <input type="date" style={inputStyle} value={dob} onChange={e=>setDob(e.target.value)} max={new Date().toISOString().slice(0,10)} />
            </div>
            {personalError && <div style={{fontSize:12.5, color:"#C0553F", fontWeight:600}}>{personalError}</div>}
            {personalInfo && <div style={{fontSize:12.5, color:"#6E8B5E", fontWeight:600}}>{personalInfo}</div>}
            <button onClick={handleSavePersonal} disabled={personalBusy} style={{border:"none", borderRadius:12, padding:"12px 0", fontSize:14.5, fontWeight:800, background:accent, color:"#fff", cursor: personalBusy?"default":"pointer", opacity: personalBusy?0.7:1}}>
              {personalBusy ? "..." : L.saveChanges}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Change Email sub-page ----------
  if (section === "email") {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:sheetRadius, padding:"20px 20px 28px", color:textMain, maxHeight:"88vh", overflowY:"auto"}}>
          <SubHeader title={L.changeEmail}/>
          <div style={{display:"flex", flexDirection:"column", gap:14}}>
            <div>
              <div style={labelStyle}>{L.emailLabel}</div>
              <input type="email" style={inputStyle} value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            {emailChanged && hasPassword && (
              <div>
                <div style={labelStyle}>{L.currentPasswordLabel}</div>
                <PasswordField style={inputStyle} value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} textMuted2={textMuted2} autoComplete="current-password" />
              </div>
            )}
            {error && <div style={{fontSize:12.5, color:"#C0553F", fontWeight:600}}>{error}</div>}
            {info && <div style={{fontSize:12.5, color:"#6E8B5E", fontWeight:600}}>{info}</div>}
            <button onClick={handleSaveEmail} disabled={busy || !emailChanged} style={{border:"none", borderRadius:12, padding:"12px 0", fontSize:14.5, fontWeight:800, background:accent, color:"#fff", cursor: (busy||!emailChanged)?"default":"pointer", opacity: (busy||!emailChanged)?0.6:1}}>
              {busy ? "..." : L.saveChanges}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Change Password sub-page ----------
  if (section === "password") {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:sheetRadius, padding:"20px 20px 28px", color:textMain, maxHeight:"88vh", overflowY:"auto"}}>
          <SubHeader title={L.changePassword}/>
          {!hasPassword ? (
            <div style={{fontSize:13.5, color:textMuted2, lineHeight:1.6}}>{L.noPasswordAccount}</div>
          ) : (
            <div style={{display:"flex", flexDirection:"column", gap:14}}>
              <div>
                <div style={labelStyle}>{L.currentPasswordLabel}</div>
                <PasswordField style={inputStyle} value={curPw} onChange={e=>setCurPw(e.target.value)} textMuted2={textMuted2} autoComplete="current-password" />
              </div>
              <div>
                <div style={labelStyle}>{L.newPasswordLabel}</div>
                <PasswordField style={inputStyle} value={newPw} onChange={e=>setNewPw(e.target.value)} minLength={8} textMuted2={textMuted2} autoComplete="new-password" />
                <div style={{fontSize:11.5, color:textMuted2, marginTop:4}}>{L.pwHint}</div>
              </div>
              <div>
                <div style={labelStyle}>{L.confirmPasswordLabel}</div>
                <PasswordField style={inputStyle} value={newPw2} onChange={e=>setNewPw2(e.target.value)} minLength={8} textMuted2={textMuted2} autoComplete="new-password" />
              </div>
              {pwError && <div style={{fontSize:12.5, color:"#C0553F", fontWeight:600}}>{pwError}</div>}
              {pwInfo && <div style={{fontSize:12.5, color:"#6E8B5E", fontWeight:600}}>{pwInfo}</div>}
              <button onClick={handleChangePassword} disabled={pwBusy} style={{border:"none", borderRadius:12, padding:"12px 0", fontSize:14.5, fontWeight:800, background:accent, color:"#fff", cursor: pwBusy?"default":"pointer", opacity: pwBusy?0.7:1}}>
                {pwBusy ? "..." : L.saveChanges}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- Social Links sub-page ----------
  if (section === "social") {
    const fields = [
      { key:"facebook", label:"Facebook", Icon:FacebookIcon, placeholder:"https://facebook.com/..." },
      { key:"instagram", label:"Instagram", Icon:InstagramIcon, placeholder:"https://instagram.com/..." },
      { key:"linkedin", label:"LinkedIn", Icon:LinkedinIcon, placeholder:"https://linkedin.com/in/..." },
      { key:"website", label: isBn ? "ওয়েবসাইট / অন্যান্য" : "Website / Other", Icon:Link2, placeholder:"https://..." },
    ];
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:sheetRadius, padding:"20px 20px 28px", color:textMain, maxHeight:"88vh", overflowY:"auto"}}>
          <SubHeader title={L.socialLinks}/>
          <div style={{display:"flex", flexDirection:"column", gap:14}}>
            {fields.map(({key, label, Icon, placeholder}) => (
              <div key={key}>
                <div style={{...labelStyle, display:"flex", alignItems:"center", gap:6}}><Icon size={13}/> {label}</div>
                <input style={inputStyle} value={links[key]} placeholder={placeholder}
                  onChange={e=>setLinks(l=>({...l, [key]: e.target.value}))} />
              </div>
            ))}
            {linksInfo && <div style={{fontSize:12.5, color:"#6E8B5E", fontWeight:600}}>{linksInfo}</div>}
            <button onClick={handleSaveLinks} disabled={linksBusy} style={{border:"none", borderRadius:12, padding:"12px 0", fontSize:14.5, fontWeight:800, background:accent, color:"#fff", cursor: linksBusy?"default":"pointer", opacity: linksBusy?0.7:1}}>
              {linksBusy ? "..." : L.saveChanges}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- মূল মেনু ----------
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:sheetRadius, padding:"20px 20px 28px", color:textMain, maxHeight:"88vh", overflowY:"auto"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18}}>
          <div className="fg-section-header">{t.profile}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>

        {/* Avatar */}
        <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:8}}>
          <div style={{position:"relative", flexShrink:0}}>
            <AvatarCircle size={56}/>
            <button onClick={handlePickPhoto} disabled={photoBusy} title={L.changePhoto} style={{
              position:"absolute", right:-2, bottom:-2, width:22, height:22, borderRadius:"50%",
              border:`2px solid ${cardBg}`, background:accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
              cursor: photoBusy ? "default" : "pointer", opacity: photoBusy ? 0.6 : 1,
            }}>
              {photoBusy ? <Loader2 size={11} style={{animation:"spin 0.8s linear infinite"}}/> : <Pencil size={11}/>}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{display:"none"}}/>
          </div>
          <div style={{minWidth:0, flex:1}}>
            <div style={{fontSize:16.5, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{user.displayName || (user.email ? user.email.split("@")[0] : "Account")}</div>
            {user.email && <div style={{fontSize:12.5, color:textMuted2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{user.email}</div>}
          </div>
        </div>
        {photoError && <div style={{fontSize:12.5, color:"#C0553F", fontWeight:600, marginBottom:10}}>{photoError}</div>}

        {/* মেনু লিস্ট */}
        <div style={{marginTop:10, marginBottom:18}}>
          <div onClick={()=>openSection("personal")} style={rowStyle}>
            <div style={menuLabelStyle}><span style={iconWrapStyle}><User size={15}/></span>{L.personalInfo}</div>
            {isBn ? <ChevronLeft size={16} color={textMuted2}/> : <ChevronRight size={16} color={textMuted2}/>}
          </div>
          <div onClick={()=>openSection("email")} style={rowStyle}>
            <div style={menuLabelStyle}><span style={iconWrapStyle}><AtSign size={15}/></span>{L.changeEmail}</div>
            {isBn ? <ChevronLeft size={16} color={textMuted2}/> : <ChevronRight size={16} color={textMuted2}/>}
          </div>
          <div onClick={()=>openSection("password")} style={rowStyle}>
            <div style={menuLabelStyle}><span style={iconWrapStyle}><KeyRound size={15}/></span>{L.changePassword}</div>
            {isBn ? <ChevronLeft size={16} color={textMuted2}/> : <ChevronRight size={16} color={textMuted2}/>}
          </div>
          <div onClick={()=>openSection("social")} style={{...rowStyle, borderBottom:"none"}}>
            <div style={menuLabelStyle}><span style={iconWrapStyle}><Link2 size={15}/></span>{L.socialLinks}</div>
            {isBn ? <ChevronLeft size={16} color={textMuted2}/> : <ChevronRight size={16} color={textMuted2}/>}
          </div>
        </div>

        <button
          onClick={handleSignOut}
          disabled={busy}
          style={{ width:"100%", marginTop:4, border:`1px solid ${dark?"rgba(192,85,63,0.30)":"rgba(192,85,63,0.22)"}`, borderRadius:12, padding:"12px 0", fontSize:14.5, fontWeight:800, background: dark?"rgba(192,85,63,0.10)":"rgba(192,85,63,0.07)", color:"#C0553F", cursor: busy?"default":"pointer", opacity: busy?0.7:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
        >
          <LogOut size={16}/> {t.signOut}
        </button>
      </div>
    </div>
  );
}

// ---------- logo ----------
const LOGO_FULL = "data:image/png;base64,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";
const LOGO_FULL_DARK = "data:image/png;base64,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";

// ---------- helpers ----------
const BN_DIGITS = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
const toBn = (n) => String(n).split("").map(c => (c>='0'&&c<='9') ? BN_DIGITS[+c] : c).join("");
const fromBn = (s) => String(s).split("").map(c => { const i = BN_DIGITS.indexOf(c); return i === -1 ? c : String(i); }).join("");
const pad2 = (n) => String(n).padStart(2,"0");

// ---------- সালাত টাইমার হিসাব — কোনো npm প্যাকেজ ছাড়াই (Karachi method, Shafi madhab) ----------
// সূত্র: standard astronomical prayer-time algorithm (sun declination + equation of time), praytimes.org-এর মতোই
const _D2R = Math.PI / 180, _R2D = 180 / Math.PI;
const _dsin = (d) => Math.sin(d * _D2R);
const _dcos = (d) => Math.cos(d * _D2R);
const _dtan = (d) => Math.tan(d * _D2R);
const _darcsin = (x) => Math.asin(x) * _R2D;
const _darccos = (x) => Math.acos(Math.max(-1, Math.min(1, x))) * _R2D;
const _darctan2 = (y, x) => Math.atan2(y, x) * _R2D;
const _darccot = (x) => Math.atan(1 / x) * _R2D;
const _fixHour = (a) => { a = a - 24 * Math.floor(a / 24); return a < 0 ? a + 24 : a; };
const _fixAngle = (a) => { a = a - 360 * Math.floor(a / 360); return a < 0 ? a + 360 : a; };
// exam.id (যেমন "1735000000000_ab3f9") থেকে একটা স্থিতিশীল পজিটিভ integer বানানো হয় —
// @capacitor/local-notifications-এর notification id অবশ্যই integer হতে হয়, string চলে না।
// একই exam.id সবসময় একই নাম্বার দেবে (djb2-স্টাইল হ্যাশ), তাই বারবার schedule/cancel মিলিয়ে করা যায়।
function examIdToNotifId(examId) {
  let hash = 5381;
  for (let i = 0; i < examId.length; i++) {
    hash = ((hash << 5) + hash + examId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 2147483647 || 1; // 0 হলে সমস্যা করতে পারে তাই fallback 1
}
// উপরের হ্যাশ ফাংশনটা exam ছাড়াও যেকোনো string key (timer, streak, goal ইত্যাদি notification flagKey)
// থেকে stable integer notification-id বানাতে ব্যবহার করা হয় — তাই একটা generic নামেও রাখা হলো।
const strToNotifId = examIdToNotifId;

function _julianDate(y, m, d) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}
function _sunPosition(jd) {
  const D = jd - 2451545.0;
  const g = _fixAngle(357.529 + 0.98560028 * D);
  const q = _fixAngle(280.459 + 0.98564736 * D);
  const L = _fixAngle(q + 1.915 * _dsin(g) + 0.020 * _dsin(2 * g));
  const e = 23.439 - 0.00000036 * D;
  let RA = _fixHour(_darctan2(_dcos(e) * _dsin(L), _dcos(L)) / 15);
  const eqt = q / 15 - RA;
  const decl = _darcsin(_dsin(e) * _dsin(L));
  return { decl, eqt };
}
// date: JS Date (স্থানীয় দিন হিসেবে ধরা হয়), lat/lng: ডিগ্রি — রিটার্ন করে {fajr, sunrise, dhuhr, asr, maghrib, isha} প্রতিটা একটা JS Date অবজেক্ট হিসেবে
function computeSalahTimesForDate(date, lat, lng, asrFactor = 1) {
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
  const tzOffset = -date.getTimezoneOffset() / 60; // ফোনের টাইমজোন থেকেই ধরে নেওয়া হয় (লোকেশনের সাথে মিলে যাবে বেশিরভাগ ক্ষেত্রে)
  const jDate = _julianDate(y, m, d) - lng / (15 * 24);
  const { decl, eqt } = _sunPosition(jDate + 0.5);
  const noon = _fixHour(12 - eqt);
  const timeForAngle = (angle, before) => {
    const cosArg = (-_dsin(angle) - _dsin(decl) * _dsin(lat)) / (_dcos(decl) * _dcos(lat));
    if (cosArg > 1 || cosArg < -1) return noon; // মেরু অঞ্চলে সূর্য ওই কোণে পৌঁছায় না — fallback হিসেবে দুপুর ধরা হলো
    const T = (1 / 15) * _darccos(cosArg);
    return before ? noon - T : noon + T;
  };
  const FAJR_ANGLE = 18, ISHA_ANGLE = 18, ASR_FACTOR = asrFactor; // Karachi method; ASR_FACTOR: Hanafi=2, Shafi/Maliki/Hanbali=1
  const asrAngle = -_darccot(ASR_FACTOR + _dtan(Math.abs(lat - decl)));
  const raw = {
    fajr: timeForAngle(FAJR_ANGLE, true),
    sunrise: timeForAngle(0.833, true),
    dhuhr: noon,
    asr: timeForAngle(asrAngle, false),
    maghrib: timeForAngle(0.833, false),
    isha: timeForAngle(ISHA_ANGLE, false),
  };
  const toDate = (hour) => {
    const h = _fixHour(hour + tzOffset - lng / 15);
    const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    const dt = new Date(y, m - 1, d, hh, mm >= 60 ? 0 : mm);
    if (mm >= 60) dt.setHours(dt.getHours() + 1);
    return dt;
  };
  return {
    fajr: toDate(raw.fajr), sunrise: toDate(raw.sunrise), dhuhr: toDate(raw.dhuhr),
    asr: toDate(raw.asr), maghrib: toDate(raw.maghrib), isha: toDate(raw.isha),
  };
}
// গ্রেগরিয়ান তারিখ থেকে হিজরি তারিখ (Tabular Islamic calendar / Kuwaiti algorithm — নির্ভুলতা স্থানীয় চাঁদ দেখার সাপেক্ষে ±1 দিন হতে পারে)
function gregorianToHijri(date) {
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
  const jd = Math.floor((1461 * (y + 4800 + Math.floor((m - 14) / 12))) / 4)
    + Math.floor((367 * (m - 2 - 12 * Math.floor((m - 14) / 12))) / 12)
    - Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100)) / 4)
    + d - 32075;
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const hMonth = Math.floor((24 * l) / 709);
  const hDay = l - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;
  return { day: hDay, month: hMonth, year: hYear };
}
const HIJRI_MONTHS_EN = ["Muharram","Safar","Rabi al-Awwal","Rabi al-Thani","Jumada al-Awwal","Jumada al-Thani","Rajab","Sha'ban","Ramadan","Shawwal","Dhu al-Qi'dah","Dhu al-Hijjah"];
const HIJRI_MONTHS_BN = ["মুহাররম","সফর","রবিউল আউয়াল","রবিউস সানি","জমাদিউল আউয়াল","জমাদিউস সানি","রজব","শাবান","রমজান","শাওয়াল","জিলক্বদ","জিলহজ"];
// কিবলার দিক (কাবার সাপেক্ষে, উত্তর থেকে ডিগ্রি) — great-circle bearing ফর্মুলা
function calcQiblaBearing(lat, lng) {
  const KAABA_LAT = 21.4225, KAABA_LNG = 39.8262;
  const toRad = (deg) => (deg * Math.PI) / 180, toDeg = (rad) => (rad * 180) / Math.PI;
  const phiK = toRad(KAABA_LAT), lambdaK = toRad(KAABA_LNG), phi = toRad(lat), lambda = toRad(lng);
  const psi = Math.atan2(
    Math.sin(lambdaK - lambda),
    Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
  );
  return (toDeg(psi) + 360) % 360;
}
// কোঅর্ডিনেট থেকে এলাকার নাম (OpenStreetMap Nominatim — ফ্রি, API key লাগে না; শুধু লোকেশন বদলালেই একবার কল হয়, ফলাফল ক্যাশ থাকে)
async function reverseGeocodeSalah(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10&accept-language=en`);
    if (!res.ok) return "";
    const data = await res.json();
    const addr = data?.address || {};
    const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || addr.state || "";
    const country = addr.country || "";
    return [city, country].filter(Boolean).join(", ");
  } catch (e) { return ""; }
}
const to12h = (h24) => ((h24 % 12) || 12);
const isPm = (h24) => h24 >= 12;
// "HH:MM" (24-hour string, as stored for study-plan entries) -> { h12, m, pm }
const parseTime12 = (hhmm) => {
  if (!hhmm) return null;
  const [hStr, mStr] = String(hhmm).split(":");
  const h24 = parseInt(hStr, 10);
  if (Number.isNaN(h24)) return null;
  return { h12: to12h(h24), m: mStr || "00", pm: isPm(h24) };
};

// ---------- password strength check ----------
// লগইন-এর মিনিমাম নিরাপত্তার জন্য: কমপক্ষে ৮ ক্যারেক্টার, অক্ষর+সংখ্যা মিশ্রণ, খুব সহজ/কমন পাসওয়ার্ড বাতিল
const COMMON_WEAK_PASSWORDS = new Set([
  "password","password1","12345678","123456789","1234567890","qwerty123","qwertyuiop",
  "11111111","00000000","letmein1","iloveyou1","admin1234","abcdefgh","87654321",
  "football1","1q2w3e4r","zxcvbnm1","passw0rd","welcome1","changeme","p@ssw0rd"
]);
function isSequentialChars(s) {
  const t = s.toLowerCase();
  let asc = true, desc = true;
  for (let i = 1; i < t.length; i++) {
    const d = t.charCodeAt(i) - t.charCodeAt(i - 1);
    if (d !== 1) asc = false;
    if (d !== -1) desc = false;
  }
  return asc || desc;
}
// return: null (ঠিক আছে) | "short" | "mix" | "common"
function passwordErrorCode(pw) {
  if (!pw || pw.length < 8) return "short";
  if (!/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) return "mix";
  if (/^(.)\1+$/.test(pw)) return "common";
  if (isSequentialChars(pw)) return "common";
  if (COMMON_WEAK_PASSWORDS.has(pw.toLowerCase())) return "common";
  return null;
}
const dateKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
// সবসময় বাংলাদেশের (Asia/Dhaka) ওয়াল-ক্লক সময় অনুযায়ী আজকের তারিখ + "HH:MM" বের করে —
// ইউজারের ডিভাইসের টাইমজোন যাই হোক না কেন, এক্সামের তারিখ/সময় বিবেচনা করার সময় এটাই ব্যবহার হবে
const dhakaNowParts = (d = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(d);
  const get = (type) => parts.find(p => p.type === type)?.value;
  const hh = get("hour") === "24" ? "00" : get("hour");
  return { dateKey: `${get("year")}-${get("month")}-${get("day")}`, hhmm: `${hh}:${get("minute")}` };
};
// একটা এক্সাম-শিডিউল এন্ট্রি বাস্তবে সময় পার হয়ে গেছে কি না — শুধু তারিখ না, endTime (না থাকলে startTime) ধরেও হিসাব করে,
// যাতে আজকের যে এক্সাম ইতিমধ্যে শেষ হয়ে গেছে সেটা "Upcoming" এ আটকে না থেকে "Past"-এ চলে যায়
// ফোনের ফিজিক্যাল ব্যাক বাটন / ব্রাউজার ব্যাক জেসচার দিয়ে ফুল-স্ক্রিন ওভারলে (Settings/Profile পেজ ইত্যাদি) বন্ধ করার হুক।
// ওয়েব/PWA কনটেক্সটে (যেমন Chrome ট্যাবে চালানো হলে) Capacitor-এর backButton লিসেনার কাজ করে না, কারণ সেটা শুধু
// নেটিভ অ্যাপ শেলের জন্য। তাই ওভারলে খোলার সময় একটা history entry পুশ করা হয়, আর popstate ধরে ওভারলে বন্ধ করে দেওয়া হয় —
// এতে ফিজিক্যাল ব্যাক বাটন এবং উপরের অন-স্ক্রিন ব্যাক অ্যারো, দুটোই ঠিকভাবে কাজ করে।
const useBackableOverlay = (isOpen, onClose) => {
  const suppressPopRef = useRef(false);
  useEffect(() => {
    if (!isOpen) return;
    window.history.pushState({ fgOverlay: true }, "");
    const onPopState = () => {
      suppressPopRef.current = true;
      onClose();
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      if (!suppressPopRef.current) {
        window.history.back();
      }
      suppressPopRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
};
const isExamPast = (ex, nowParts) => {
  if (!ex?.date) return false;
  const { dateKey: nowKey, hhmm: nowHHMM } = nowParts || dhakaNowParts();
  if (ex.date < nowKey) return true;
  if (ex.date > nowKey) return false;
  const cutoff = ex.endTime || ex.startTime;
  if (!cutoff) return false; // সময় দেওয়া নেই — শুধু তারিখের ভিত্তিতে আজকেরটাকে এখনই "past" ধরা হবে না
  return nowHHMM >= cutoff;
};
// রিপিটিং টাস্ক সম্পন্ন হলে পরবর্তী occurrence-এর due date বের করার হেল্পার
const nextDueDateFromKey = (dk, repeat) => {
  const d = new Date(dk + "T00:00:00");
  if (repeat === "daily") d.setDate(d.getDate() + 1);
  else if (repeat === "weekly") d.setDate(d.getDate() + 7);
  else if (repeat === "monthly") d.setMonth(d.getMonth() + 1);
  else return dk;
  return dateKey(d);
};

// বাংলাদেশ সরকারি ছুটির তালিকা (২০২৬) — সাধারণ ছুটি + নির্বাহী আদেশে ছুটি (জনপ্রশাসন মন্ত্রণালয়ের প্রজ্ঞাপন অনুযায়ী)।
// চাঁদ দেখার উপর নির্ভরশীল তারিখগুলো (ঈদ, শব-ই-বরাত, শব-ই-ক্বদর, আশুরা ইত্যাদি) সরকারি ঘোষণার সাথে ১ দিন এদিক-ওদিক হতে পারে।
// পরের বছর নতুন তালিকা প্রকাশ হলে এখানে হাতে আপডেট করে নিতে হবে।
const BD_HOLIDAYS_2026 = {
  "2026-02-04": { bn: "শব-ই-বরাত", en: "Shab-e-Barat" },
  "2026-02-21": { bn: "শহিদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস", en: "Shaheed Day & Int'l Mother Language Day" },
  "2026-03-17": { bn: "শব-ই-ক্বদর", en: "Shab-e-Qadr" },
  "2026-03-19": { bn: "ঈদ-উল-ফিতরের ছুটি", en: "Eid-ul-Fitr holiday" },
  "2026-03-20": { bn: "জুমাতুল বিদা", en: "Jumatul Bidah" },
  "2026-03-21": { bn: "ঈদ-উল-ফিতর", en: "Eid-ul-Fitr" },
  "2026-03-22": { bn: "ঈদ-উল-ফিতরের ছুটি", en: "Eid-ul-Fitr holiday" },
  "2026-03-23": { bn: "ঈদ-উল-ফিতরের ছুটি", en: "Eid-ul-Fitr holiday" },
  "2026-03-26": { bn: "স্বাধীনতা ও জাতীয় দিবস", en: "Independence & National Day" },
  "2026-04-13": { bn: "চৈত্র সংক্রান্তি", en: "Choitro Sangkranti" },
  "2026-04-14": { bn: "বাংলা নববর্ষ", en: "Bengali New Year" },
  "2026-05-01": { bn: "মে দিবস ও বুদ্ধ পূর্ণিমা", en: "May Day & Buddha Purnima" },
  "2026-05-26": { bn: "ঈদ-উল-আজহার ছুটি", en: "Eid-ul-Adha holiday" },
  "2026-05-27": { bn: "ঈদ-উল-আজহার ছুটি", en: "Eid-ul-Adha holiday" },
  "2026-05-28": { bn: "ঈদ-উল-আজহা", en: "Eid-ul-Adha" },
  "2026-05-29": { bn: "ঈদ-উল-আজহার ছুটি", en: "Eid-ul-Adha holiday" },
  "2026-05-30": { bn: "ঈদ-উল-আজহার ছুটি", en: "Eid-ul-Adha holiday" },
  "2026-05-31": { bn: "ঈদ-উল-আজহার ছুটি", en: "Eid-ul-Adha holiday" },
  "2026-06-26": { bn: "আশুরা", en: "Ashura" },
  "2026-08-05": { bn: "জুলাই গণঅভ্যুত্থান দিবস", en: "July Uprising Day" },
  "2026-08-26": { bn: "ঈদে মিলাদুন্নবী (সা.)", en: "Eid-e-Miladunnabi" },
  "2026-09-04": { bn: "জন্মাষ্টমী", en: "Janmashtami" },
  "2026-10-20": { bn: "দুর্গাপূজা (নবমী)", en: "Durga Puja (Nabami)" },
  "2026-10-21": { bn: "দুর্গাপূজা (বিজয়া দশমী)", en: "Durga Puja (Bijoya Dashami)" },
  "2026-12-16": { bn: "বিজয় দিবস", en: "Victory Day" },
  "2026-12-25": { bn: "যিশু খ্রিষ্টের জন্মদিন (বড়দিন)", en: "Christmas Day" },
};
const isHolidayKey = (dk) => Object.prototype.hasOwnProperty.call(BD_HOLIDAYS_2026, dk);
const holidayName = (dk, lang) => { const h = BD_HOLIDAYS_2026[dk]; if (!h) return ""; return lang === "bn" ? h.bn : h.en; };


// ---------- সপ্তাহ কোন দিন থেকে শুরু হবে (রবি থেকে শনি — যেকোনো একদিন) — Settings থেকে পাল্টানো যায়, localStorage-এ সেভ থাকে ----------
// মান 0-6 (0=রবি...6=শনি)। localStorage থেকে সরাসরি পড়া হয় বলে Settings-এ বদলানোর পর যেকোনো
// পরের রি-রেন্ডারেই (ট্যাব সুইচ, ক্যালেন্ডার খোলা ইত্যাদি) নতুন মান অনুযায়ী সপ্তাহ হিসাব হবে।
const WEEK_START_DAY_KEY = "focusgo_week_start_day";
const getWeekStartDay = () => {
  try {
    const v = parseInt(window.localStorage.getItem(WEEK_START_DAY_KEY), 10);
    if (!isNaN(v) && v >= 0 && v <= 6) return v;
  } catch (e) {}
  return 5; // ডিফল্ট: শুক্রবার (বাংলাদেশে সাধারণত সপ্তাহ শুক্রবার থেকে ধরা হয়)
};
const setWeekStartDay = (v) => {
  try { window.localStorage.setItem(WEEK_START_DAY_KEY, String(v)); } catch (e) {}
};
const weekStartOffset = (jsDay) => { const s = getWeekStartDay(); return (jsDay - s + 7) % 7; };
const WEEKDAY_PICKER_LABELS = {
  en: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
  bn: ["রবি","সোম","মঙ্গল","বুধ","বৃহঃ","শুক্র","শনি"],
};
const weekdayShortLabels = (lang) => {
  const bn = ["র","সো","ম","বু","বৃ","শু","শ"];
  const en = ["S","M","T","W","T","F","S"];
  const arr = lang === "bn" ? bn : en;
  const s = getWeekStartDay();
  return [...arr.slice(s), ...arr.slice(0, s)];
};

const startOfWeek = (d) => { const x = new Date(d); const day = weekStartOffset(x.getDay()); x.setDate(x.getDate()-day); x.setHours(0,0,0,0); return x; };
const stripTime = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };

// একগুচ্ছ ডেট-কি (YYYY-MM-DD) এর entries থেকে Subject+Topic নাম মিলিয়ে ইউনিক টপিক লিস্ট বানায়।
// একই নামের টপিক যেকোনো দিন done থাকলে সম্পূর্ণ ধরা হয়, নাহলে বাদ পড়েছে (missed) ধরা হয়।
const buildTopicSummary = (dateKeys, entries) => {
  const map = new Map();
  dateKeys.forEach(dk => {
    (entries[dk] || []).forEach(e => {
      const key = `${e.subject}||${e.topic}`;
      const cur = map.get(key);
      if (cur) { if (e.done) cur.done = true; }
      else map.set(key, { subject: e.subject, topic: e.topic, done: !!e.done });
    });
  });
  const all = Array.from(map.values());
  return {
    covered: all.filter(x => x.done),
    missed: all.filter(x => !x.done),
  };
};

// ---------- guest mode persistence ----------
// "অ্যাপ" (হোমস্ক্রিনে ইনস্টল করা / standalone) হিসেবে চলছে কিনা সেটা বোঝার উপায়।
// ব্রাউজার ট্যাবে (সাধারণ ওয়েবসাইট হিসেবে) চললে এটা false — তখন গেস্ট ডেটা কোথাও সেভ হয় না, রিফ্রেশ/সাইট ছাড়লেই হারিয়ে যায়।
// ইনস্টল করা অ্যাপ হিসেবে চললে true — তখন গেস্ট ডেটা এই ডিভাইসেই (localStorage-এ) থেকে যায়, রিফ্রেশ করলেও হারায় না।
function isStandaloneApp() {
  try {
    if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
    if (window.navigator && window.navigator.standalone === true) return true; // iOS "Add to Home Screen"
    return false;
  } catch (e) {
    return false;
  }
}
const GUEST_STORAGE_KEY = "focusgo_guest_data_v1";
function loadGuestData() {
  try {
    const raw = window.localStorage.getItem(GUEST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function saveGuestData(data) {
  try { window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* localStorage unavailable — silently skip */ }
}
function clearGuestData() {
  try { window.localStorage.removeItem(GUEST_STORAGE_KEY); } catch (e) { /* ignore */ }
}
const monthKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth()+1)}`;

// ---------- Responsive breakpoint hook ----------
// "mobile" < 640px, "tablet" 640–1024px, "desktop" > 1024px.
// একটাই window resize listener দিয়ে সব জায়গায় (container width, padding ইত্যাদি) ব্যবহারযোগ্য।
function getBreakpoint(w) {
  // Chrome-এর মোবাইলে "Request desktop site" mode সাধারণত ~980px width রিপোর্ট করে —
  // আগে threshold 1024 থাকায় সেটা "tablet" ধরা হতো আর desktop sidebar কখনো দেখাতো না।
  // 900px-এ নামিয়ে আনায় এখন "Desktop site" mode-এও সঠিকভাবে sidebar layout দেখাবে।
  if (w >= 900) return "desktop";
  if (w >= 640) return "tablet";
  return "mobile";
}
function useViewport() {
  const [breakpoint, setBreakpoint] = useState(() => {
    try { return getBreakpoint(window.innerWidth); } catch (e) { return "mobile"; }
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = null;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setBreakpoint(getBreakpoint(window.innerWidth)));
    };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return breakpoint;
}

// ---------- orientation hook (fullscreen focus timer layout) ----------
// "portrait" -> stacked (mm উপরে, ss নিচে) বড় সংখ্যা দেখানোর জন্য
// "landscape" -> পাশাপাশি (mm : ss), বাম পাশে vertical progress bar
function useOrientation() {
  const [orientation, setOrientation] = useState(() => {
    try { return (window.matchMedia && window.matchMedia("(orientation: portrait)").matches) ? "portrait" : "landscape"; }
    catch (e) { return "portrait"; }
  });
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(orientation: portrait)");
    const handler = () => setOrientation(mq.matches ? "portrait" : "landscape");
    if (mq.addEventListener) mq.addEventListener("change", handler); else mq.addListener(handler);
    return () => { if (mq.removeEventListener) mq.removeEventListener("change", handler); else mq.removeListener(handler); };
  }, []);
  return orientation;
}

// ---------- time-range helpers ----------
const timeToMinutes = (hhmm) => { const [h,m] = (hhmm||"00:00").split(":").map(Number); return (h||0)*60 + (m||0); };
const minutesToTime = (mins) => { const m = ((mins % 1440) + 1440) % 1440; return `${pad2(Math.floor(m/60))}:${pad2(m%60)}`; };
const diffMinutes = (start, end) => { let d = timeToMinutes(end) - timeToMinutes(start); if (d <= 0) d += 1440; return d; };
const formatDuration = (mins, lang, nf) => {
  const h = Math.floor(mins/60), m = mins % 60;
  if (lang === "bn") {
    if (h > 0 && m > 0) return <>{<Num>{nf(h)}</Num>}ঘ {<Num>{nf(m)}</Num>}মি</>;
    if (h > 0) return <>{<Num>{nf(h)}</Num>}ঘ</>;
    return <>{<Num>{nf(m)}</Num>}মি</>;
  }
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
};

const WEEKDAYS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WEEKDAYS_BN = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"];
const WEEKDAYS_SHORT_EN = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const WEEKDAYS_SHORT_BN = ["রবি","সোম","মঙ্গল","বুধ","বৃহঃ","শুক্র","শনি"];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_BN = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
const MONTHS_SHORT_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_SHORT_BN = ["জানু","ফেব্রু","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টে","অক্টো","নভে","ডিসে"];

const T = {
  en: {
    tagline: "Make Every Day Count",
    tabs: { today: "Today", study: "Study", task: "Tasks", settings: "Settings", stats: "Stats", plan: "Plan", exam: "Exam" },
    planViewStudy: "Study Plan", planViewExam: "Exam",
    taskTitle: "Tasks", taskSubtitle: "All your tasks, in one place", taskAdd: "New task", taskEmpty: "No tasks in this list",
    taskStudy: "Study", taskPersonal: "Personal", taskAll: "All",
    taskPrHigh: "High", taskPrMed: "Medium", taskPrLow: "Low",
    taskTitlePlaceholder: "What needs to be done?", taskCategory: "Category", taskPriority: "Priority",
    taskAddCategory: "Add category", taskNewCategoryPlaceholder: "New category name",
    taskDone: "done", taskLinkHint: "You can start a \"Study\" task directly with the Focus Timer — it'll auto-complete when the session ends.",
    taskLeftLabel: "left", taskAllDoneLabel: "All done",
    taskFilterToday: "Today", taskFilterUpcoming: "Upcoming", taskFilterDone: "Done", taskFilterOverdue: "Overdue",
    notesTitle: "Notes", notesSubtitle: "Capture ideas, lessons, and things to remember", notesSearch: "Search notes...", notesNew: "New Note", notesEmpty: "No notes yet", notesEmptySub: "Save an idea, lesson, or reminder here.", notesTitlePlaceholder: "Note title", notesBodyPlaceholder: "Write your note...", notesSave: "Save Note", notesEdit: "Edit Note", notesDelete: "Delete",
    taskDueDate: "Due Date", taskDueDateOptional: "Due Date (optional)", taskNoDueDate: "No due date",
    taskDueToday: "Today", taskDueTomorrow: "Tomorrow", taskOverdue: "Overdue", taskCompleted: "Completed",
    taskSectionToday: "Today", taskSectionUpcoming: "Upcoming", taskSectionNoDate: "No Due Date", taskSectionCompletedToday: "Completed today",
    taskEmptyToday: "Nothing due today", taskEmptyUpcoming: "Nothing upcoming", taskEmptyDone: "No completed tasks yet", taskEmptyOverdue: "No overdue tasks",
    taskEmptySub: "Add your first task to start planning your day.", taskEmptyTodaySub: "You're all caught up for today.", taskEmptyUpcomingSub: "Nothing scheduled ahead — enjoy the calm.", taskEmptyDoneSub: "Complete a task and it'll show up here.", taskEmptyOverdueSub: "Nice! Nothing slipped through the cracks.",
    taskEmptyTodayHome: "No tasks today", taskAddBtn: "Add Task",
    taskViewList: "List", taskViewCalendar: "Calendar",
    taskViewListHint: "All your tasks, grouped by due date", taskViewCalendarHint: "Tap a day on the calendar to see its tasks",
    taskRepeat: "Repeat", taskRepeatNone: "Never", taskRepeatDaily: "Daily", taskRepeatWeekly: "Weekly", taskRepeatMonthly: "Monthly",
    taskRepeatBadge: "Repeats", taskCalNoDate: "No due date", taskCalPickDay: "Tap a day to see its tasks",
    taskCalEmptyDay: "No tasks due this day", taskCalNoDateTasks: "Tasks without a due date",
    taskCalMonthOverview: "This Month", taskCalMonthTotal: "Total", taskCalMonthCompleted: "Completed", taskCalMonthOverdue: "Overdue",
    focusTimer: "Focus Timer", start: "Start", pause: "Pause", reset: "Reset", stopBtn: "Stop", lapBtn: "Lap",
    focusTimeLabel: "Focus Time", stayFocusedLabel: "Stay focused", sessionGoalLabel: "Session Goal", sessionsUnit: "sessions",
    pickTopicForTimer: "Pick a topic to focus on", freeSession: "Free Session",
    timerMode: "Timer", stopwatchMode: "Stopwatch",
    sessionTypeLabel: "Session Type", focusOption: "Focus", breakOption: "Break",
    sessionLabel: "Session", focusCompleteTitle: "Focus complete", takeBreakQuestion: "Take a", breakQSuffix: "min break?",
    startBreakBtn: "Start Break", skipBreakBtn: "Skip",
    editTopicTitle: "Edit Topic", save: "Save", edit: "Edit",
    yourRhythm: "Your Rhythm", todaysStudy: "Today's Study", todaysProgress: "Today's Progress", addTopic: "Add Topic",
    noTopicsToday: "No study planned yet", noTopicsTodaySub: "Add a topic to start your study session.",
    thisWeek: "This Week", thisMonth: "This Month",
    longView: "Long View", syllabusProgress: "Subject Progress", complete: "Complete",
    weeklySummary: "Weekly Summary", monthlySummary: "Monthly Summary",
    covered: "Covered", missed: "Missed",
    noneCovered: "Nothing covered yet.", noneMissed: "Nothing missed — great job!",
    summaryPendingWeek: "Summary will show once this week ends.",
    summaryPendingMonth: "Summary will show once this month ends.",
    addTopicTitle: "Add a topic", subjectLabel: "Subject", subjectPlaceholder: "e.g. Physics, বাংলা...",
    pickSubject: "Pick a subject, or type a new one below", newSubjectAutoSaved: "A new subject you type here is added to your subject list too.",
    chooseFromList: "Choose from list", hideSubjectList: "Hide list",
    lightMode: "Switch to light mode", darkMode: "Switch to dark mode",
    hapticFeedback: "Haptic feedback",
    topicLabel: "Topic", topicPlaceholder: "e.g. Newton's Laws",
    durationLabel: "Duration (minutes)", cancel: "Cancel", add: "Add",
    dayDetail: "Day Detail", planned: "Planned", done: "Done", notDone: "Not Done", noData: "No study data for this day.",
    noSubjectData: "No subject data for this period.",
    minutes: "min", close: "Close", deleteTopic: "Delete",
    timeRemainingLabel: "remaining",
    dayFocusedLabel: "focused", tasksRemainingLabel: "tasks remaining",
    confirmDeleteTopic: "Delete this topic?", confirmDelete: "Yes, delete",
    confirmDeleteAttempt: "Delete this attempt?", confirmDeleteCombinedExam: "Delete this combined exam?",
    monthOverview: "Month Overview", back: "Back",
    todaysGoal: "Today's Goal", adjustGoal: "Adjust Goal", topics: "topics",
    doneCount: "Done", remaining: "Remaining", setGoal: "Set Goal",
    progressLabel: "Progress", progressCompletedLabel: "Completed", tipLabel: "Tip",
    progressTip: "Progress is calculated from today's tasks & study.",
    goalLabel: "Number of topics to finish today", statusDone: "done",
    seeAll: "See all", showLess: "Show less",
    offlineBadge: "Offline", offlineNote: "No internet — your changes are saved on this device and will sync once you're back online.",
    pickFromBank: "Pick a topic, or type a new one below", newTopicAutoSaved: "A new topic you type here is saved for next time too.",
    bulkAddTopics: "Add multiple at once", bulkAddPlaceholder: "One topic per line (or comma-separated)\ne.g.\nChapter 1\nChapter 2",
    manageSubjects: "Manage Subjects", noSubjectsYet: "No subjects yet. Add your syllabus subjects here.",
    addSubjectsFirst: "Add subjects in Syllabus first.", selectSubject: "Select Subject",
    startTimeLabel: "Start Time", endTimeLabel: "End Time",
    addTimeToggle: "Add a specific time", addDurationToggle: "Add an expected duration", noTimeSet: "No time set", amLabel: "AM", pmLabel: "PM",
    remainingHeader: "Remaining", doneHeader: "Done",
    next7Days: "Next 7 Days", subjectTimeBreakdown: "Time by subject", noTimeData: "No completed topics yet.",
    overview: "Overview", caughtUpNote: "Caught up later",
    examSubjects: "Exam Subjects", manageExams: "Manage Exams", addExam: "Add exam subject",
    examDateLabel: "Exam date (optional)", noExamSubjects: "No exam subjects yet. Add the subjects you're being examined on.",
    noDateSet: "No date set", daysLeftLabel: "days left", examToday: "Exam Today", examPassed: "Exam Passed",
    removeExam: "Remove", examOverview: "Overview across all your exam subjects",
    examScores: "Test Scores", average: "Average", obtainedPlaceholder: "Marks", outOfPlaceholder: "Out Of", noScoresYet: "No scores added yet",
    examGivenLabel: "Exam Given", examsCompletedLabel: "exams given",
    topicsLabel: "Topics", addTopicBtn: "Add Topic", noTopicsInSubject: "No topics yet.",
    topicNamePlaceholder: "Topic name (e.g. কারক)", attemptsLabel: "attempts", attemptsCountLabel: "Attempts",
    addAttempt: "Add Attempt", attemptDateLabel: "Date", noAttemptsYet: "No attempts yet",
    generalTopic: "General", completedBadge: "Completed",
    nextExamCard: "Next Exam", setNextExam: "Set next exam", editNextExam: "Edit", clearNextExam: "Clear",
    chooseSubject: "Choose Subject", chooseTopic: "Choose topic or type new", noSubjectsForExam: "Add an exam subject first.",
    monthlySummaryExam: "Monthly Summary", totalExams: "Total Exams", totalAttempts: "Total Attempts",
    avgScoreLabel: "Average Score", maxScoreLabel: "Highest Score", subjectBreakdown: "Subject Breakdown",
    examsCol: "Exams", attemptsCol: "Attempts", avgCol: "Avg", noExamDataMonth: "No exam data this month.",
    deleteTopicConfirmNote: "This removes all attempts under this topic.",
    signIn: "Sign In", signOut: "Sign Out", syncing: "Syncing…", profile: "Profile",
    nameExists: "This name is already used.",
    themeSystem: "System", themeLight: "Light", themeDark: "Dark",
    themeIvory: "Ivory", themeGraphite: "Graphite", themeMist: "Mist",
    appearance: "Appearance", accentColor: "Accent Color",
    settings: "Settings", language: "Language", theme: "Theme",
    aboutUs: "About Us", appName: "FocusGo", version: "Version",
    sendFeedback: "Send Feedback", feedbackSubject: "FocusGo App Feedback",
    notifExam: "Exam reminders", notifTask: "Task reminders", notifSalah: "Prayer time alerts", notifTimer: "Timer end alerts", notifAlarm: "Alarm alerts",
    alarmSetConfirm: "Alarm set for {time}", alarmWebWarning: "Note: alarms only show as notifications in the installed FocusGo app, not in this browser preview.",
    alarmCancelBtn: "Cancel alarm", alarmCancelledMsg: "Alarm cancelled", nextAlarmLabel: "Alarm",
    weekStartsOn: "Week Starts On", weekStartSun: "Sunday", weekStartMon: "Monday",
    weekStartTue: "Tuesday", weekStartWed: "Wednesday", weekStartThu: "Thursday", weekStartFri: "Friday", weekStartSat: "Saturday",
    defaultTimerDuration: "Default Timer Duration", focusLabel: "Focus", breakLabel: "Break",
    aboutTagline: "Make every day count.",
    aboutBody: "FocusGo is your all-in-one daily companion — plan your study and tasks, jot down notes, track exams and focus sessions, and stay on top of your salah times, all in one place to help you make every day count.",
    creatorLabel: "Creator",
    privacyPolicy: "Privacy Policy", termsOfUse: "Terms of Use", legalSection: "Legal",
    lastUpdated: "Last updated", effectiveDate: "August 16, 2026",
    privacySections: [
      { title: "1. Information We Collect", body: "Account information: your email, name (if provided), and basic profile info from Google when you sign in with Google.\n\nStudy data: what you add in the app — subjects, topics, study time, exam results, and related notes.\n\nTechnical information: basic settings needed to run the app, such as theme and language preference.\n\nWe do not collect your location, contacts, or any other personal data from your device." },
      { title: "2. How We Use This Information", body: "To create and manage your account and login.\n\nTo save and sync your study data so you can access it across devices.\n\nTo power app features such as progress tracking, calendar, and statistics.\n\nWe do not use your information for advertising, and we do not sell it to any third party." },
      { title: "3. Where Your Data Is Stored", body: "Your account and study data are stored on Google Firebase (Authentication and Firestore), a third-party cloud service. Data is encrypted according to Firebase's own security and privacy standards. We only use what's necessary to run the app." },
      { title: "4. Your Rights", body: "You can update your profile information (name, email, password) at any time.\n\nYou can request deletion of your account and all associated data — contact us at the email below.\n\nYou can also reach out with any questions about your data." },
      { title: "5. Changes", body: "This privacy policy may be updated from time to time. Significant changes will be communicated within the app." },
      { title: "6. Contact", body: "For any questions: mazharul.mrf@gmail.com" },
    ],
    termsSections: [
      { title: "1. Description of Service", body: "FocusGo is a study-tracking and planning app where you can plan by subject/topic, track study time, view progress, and stay organized for exam preparation." },
      { title: "2. Your Account", body: "You are responsible for providing accurate information when creating your account.\n\nYou are responsible for keeping your login credentials (password) secure. You are responsible for any activity that happens under your account.\n\nPlease notify us promptly if you notice any suspicious activity." },
      { title: "3. Acceptable Use", body: "You agree to use the app only for personal, lawful purposes, and not to attempt anything harmful (spam, malware, or unauthorized access attempts) against any part of the app." },
      { title: "4. Disclaimer", body: "FocusGo is an organizational tool only. It does not guarantee study outcomes, exam scores, or academic success. You are responsible for the accuracy of the data you store in the app.\n\nWe make reasonable efforts to keep the app running smoothly, but we cannot guarantee it will always be free of technical issues, downtime, or data loss. We recommend keeping your own backup of important information." },
      { title: "5. Changes and Termination", body: "We reserve the right to change, add, or remove app features at any time. We also reserve the right to suspend your account if needed, particularly for violations of these terms." },
      { title: "6. Changes to These Terms", body: "These terms may be updated from time to time. Continuing to use the app after changes means you accept the updated terms." },
      { title: "7. Contact", body: "For any questions: mazharul.mrf@gmail.com" },
    ],
    combinedExams: "Combined Exams", manageCombinedExams: "Manage", addCombinedExam: "Add Combined Exam",
    noCombinedExams: "No combined exams yet. Combine multiple subjects into one recurring exam.",
    combinedExamName: "Exam name", combinedExamNamePlaceholder: "e.g. Weekly Class Test", typeLabel: "Type",
    typeDaily: "Daily", typeWeekly: "Weekly", typeMonthly: "Monthly",
    subjectsLabel: "Subjects", selectSubjectsNote: "Pick the subjects covered by this exam",
    noSubjectsForCombined: "Add subjects in Syllabus first.",
    editCombinedExam: "Edit combined exam", deleteCombinedExam: "Delete",
    deleteCombinedExamConfirmNote: "This removes all recorded attempts for this combined exam.",
    selectTodaysTopic: "Select Today's Topic", freeSessionOption: "Free Session",
    noTopicsPlanned: "No study topics planned", noTopicsPlannedSub: "Add your first topic to get started.",
    totalPlannedLabel: "Total planned",
    studyOverview: "Study Overview", focusedLabel: "total time focused", topicsCompletedLabel: "topics completed",
    completionLabel: "completion rate", streakLabel: "day streak", weeklyActivity: "Weekly Activity",
    monthlyActivity: "Monthly Activity", weekLabelShort: "W",
    subjectProgressSubtitle: "How far you've covered in each subject",
    statsPageTitle: "Stats", statsPageSubtitle: "Track your progress",
    dailyGoalLabel: "Daily goal", completeShort: "Complete", noTopicsYetCaps: "NO TOPICS YET",
    calendarLegendCompleted: "Study completed", calendarLegendExam: "Exam", calendarLegendPlanned: "Planned",
    calendarLegendHoliday: "Govt holiday",
    noTopicsSubjectShort: "No topics yet", addTopicsShort: "Add Topics",
    examSetupTitle: "Set up your exam", examSetupSubtitle: "Get your exam prep organized in a few quick steps.",
    addExamCta: "Add Exam",
    examSetupStep1: "Add exam subjects", examSetupStep2: "Set exam date", examSetupStep3: "Create combined exams",
    preparationLabel: "Preparation",
    quickAdd: "Quick Add", addStudyTopicQuick: "Study Topic", addSubjectQuick: "Subject",
    addExamQuick: "Exam", addCombinedExamQuick: "Combined Exam",
    notifications: "Notifications", noNotifications: "No notifications yet",
    markAllRead: "Mark all as read", clearAll: "Clear all",
    notifSessionDoneTitle: "Focus session done!", notifSessionDoneBody: "Great job — time for a short break.",
    notifBreakDoneTitle: "Break's over", notifBreakDoneBody: "Next focus session is starting.",
    notifTopicDoneTitle: "Topic complete!", notifTopicDoneBody: "You've finished the full planned time for this topic.",
    notifExamTodayTitle: "Exam today", notifExamTomorrowTitle: "Exam tomorrow",
    notifExamSoonTitle: "Exam in {days} days",
    notifStreakTitle: "Keep your streak alive", notifStreakBody: "You haven't studied today yet — don't break the streak!",
    notifGoalTitle: "Daily goal reached!", notifGoalBody: "You've hit your study target for today. Keep it up!",
    notifInactiveTitle: "We miss you", notifInactiveBody: "No study logged in a couple of days — come back and pick up where you left off.",
  },
  bn: {
    tagline: "প্রতিটা দিন অর্থবহ করে তোলো",
    tabs: { today: "আজ", study: "স্টাডি", task: "টাস্ক", settings: "সেটিংস", stats: "স্ট্যাটস", plan: "প্ল্যান", exam: "এক্সাম" },
    planViewStudy: "স্টাডি প্ল্যান", planViewExam: "এক্সাম",
    taskTitle: "টাস্ক", taskSubtitle: "সব কাজ, এক জায়গায়", taskAdd: "নতুন টাস্ক", taskEmpty: "এই তালিকায় কোনো টাস্ক নেই",
    taskStudy: "স্টাডি", taskPersonal: "পার্সোনাল", taskAll: "সব",
    taskPrHigh: "জরুরি", taskPrMed: "মিডিয়াম", taskPrLow: "কম",
    taskTitlePlaceholder: "কী করতে হবে?", taskCategory: "ক্যাটাগরি", taskPriority: "প্রায়োরিটি",
    taskAddCategory: "ক্যাটাগরি যোগ করো", taskNewCategoryPlaceholder: "নতুন ক্যাটাগরির নাম",
    taskDone: "সম্পন্ন", taskLinkHint: "\"স্টাডি\" ক্যাটাগরির টাস্ক চাইলে সরাসরি Focus Timer দিয়ে শুরু করা যাবে — সেশন শেষ হলে টাস্ক অটো-সম্পন্ন হবে।",
    taskLeftLabel: "বাকি", taskAllDoneLabel: "সব সম্পন্ন",
    taskFilterToday: "আজ", taskFilterUpcoming: "আসন্ন", taskFilterDone: "সম্পন্ন", taskFilterOverdue: "মেয়াদ শেষ",
    notesTitle: "নোট", notesSubtitle: "আইডিয়া, পড়ার বিষয় ও দরকারি তথ্য সংরক্ষণ করো", notesSearch: "নোট খুঁজুন...", notesNew: "নতুন নোট", notesEmpty: "এখনো কোনো নোট নেই", notesEmptySub: "আইডিয়া, পড়ার বিষয় বা দরকারি কিছু এখানে রাখো।", notesTitlePlaceholder: "নোটের শিরোনাম", notesBodyPlaceholder: "নোট লিখুন...", notesSave: "নোট সেভ", notesEdit: "নোট এডিট", notesDelete: "মুছুন",
    taskDueDate: "ডিউ ডেট", taskDueDateOptional: "ডিউ ডেট (ঐচ্ছিক)", taskNoDueDate: "কোনো ডিউ ডেট নেই",
    taskDueToday: "আজ", taskDueTomorrow: "আগামীকাল", taskOverdue: "মেয়াদ শেষ", taskCompleted: "সম্পন্ন হয়েছে",
    taskSectionToday: "আজ", taskSectionUpcoming: "আসন্ন", taskSectionNoDate: "ডিউ ডেট নেই", taskSectionCompletedToday: "আজ সম্পন্ন হয়েছে",
    taskEmptyToday: "আজ কিছু বাকি নেই", taskEmptyUpcoming: "আসন্ন কিছু নেই", taskEmptyDone: "এখনো কোনো টাস্ক সম্পন্ন হয়নি", taskEmptyOverdue: "মেয়াদ-শেষ কোনো টাস্ক নেই",
    taskEmptySub: "প্রথম টাস্কটা যোগ করে আজকের দিন সাজিয়ে ফেলুন।", taskEmptyTodaySub: "আজকের সব কাজ শেষ, দারুণ!", taskEmptyUpcomingSub: "আসন্ন কোনো কাজ নেই — নিশ্চিন্তে থাকুন।", taskEmptyDoneSub: "কোনো টাস্ক সম্পন্ন করলে এখানে দেখা যাবে।", taskEmptyOverdueSub: "চমৎকার! মেয়াদ-শেষ কোনো কাজ নেই।",
    taskEmptyTodayHome: "আজ কোনো টাস্ক নেই", taskAddBtn: "টাস্ক যোগ করুন",
    taskViewList: "লিস্ট", taskViewCalendar: "ক্যালেন্ডার",
    taskViewListHint: "তোমার সব টাস্ক, ডিউ ডেট অনুযায়ী সাজানো", taskViewCalendarHint: "ক্যালেন্ডারে কোনো দিনে ট্যাপ করে সেদিনের টাস্ক দেখো",
    taskRepeat: "রিপিট", taskRepeatNone: "একবারই", taskRepeatDaily: "প্রতিদিন", taskRepeatWeekly: "প্রতি সপ্তাহে", taskRepeatMonthly: "প্রতি মাসে",
    taskRepeatBadge: "রিপিট হয়", taskCalNoDate: "ডিউ ডেট নেই", taskCalPickDay: "কোনো দিনে ট্যাপ করে সেদিনের টাস্ক দেখুন",
    taskCalEmptyDay: "এই দিনে কোনো টাস্ক নেই", taskCalNoDateTasks: "ডিউ ডেট ছাড়া টাস্ক",
    taskCalMonthOverview: "এই মাস", taskCalMonthTotal: "মোট", taskCalMonthCompleted: "সম্পন্ন", taskCalMonthOverdue: "মেয়াদ শেষ",
    focusTimer: "ফোকাস টাইমার", start: "শুরু", pause: "থামাও", reset: "রিসেট", stopBtn: "স্টপ", lapBtn: "ল্যাপ",
    focusTimeLabel: "ফোকাস টাইম", stayFocusedLabel: "মনোযোগী থাকো", sessionGoalLabel: "সেশন গোল", sessionsUnit: "সেশন",
    pickTopicForTimer: "ফোকাস করার জন্য একটা টপিক বাছাই করো", freeSession: "ফ্রি সেশন",
    timerMode: "টাইমার", stopwatchMode: "স্টপওয়াচ",
    sessionTypeLabel: "সেশন টাইপ", focusOption: "ফোকাস", breakOption: "ব্রেক",
    sessionLabel: "সেশন", focusCompleteTitle: "ফোকাস সম্পন্ন হয়েছে", takeBreakQuestion: "", breakQSuffix: "মিনিট ব্রেক নেবে?",
    startBreakBtn: "ব্রেক শুরু করো", skipBreakBtn: "স্কিপ",
    editTopicTitle: "টপিক এডিট করুন", save: "সেভ করো", edit: "এডিট",
    yourRhythm: "আপনার ছন্দ", todaysStudy: "আজকের পড়া", todaysProgress: "আজকের অগ্রগতি", addTopic: "টপিক যোগ করো",
    noTopicsToday: "এখনো কোনো পড়া প্ল্যান করা নেই", noTopicsTodaySub: "পড়া শুরু করতে একটা টপিক যোগ করুন।",
    thisWeek: "এই সপ্তাহ", thisMonth: "এই মাস",
    longView: "সামগ্রিক দৃশ্য", syllabusProgress: "বিষয়ভিত্তিক অগ্রগতি", complete: "সম্পন্ন",
    weeklySummary: "সাপ্তাহিক সারাংশ", monthlySummary: "মাসিক সারাংশ",
    covered: "কভার হয়েছে", missed: "বাদ পড়েছে",
    noneCovered: "এখনো কিছু কভার হয়নি।", noneMissed: "কিছুই বাদ পড়েনি — চমৎকার!",
    summaryPendingWeek: "এই সপ্তাহ শেষ হলে সারাংশ দেখা যাবে।",
    summaryPendingMonth: "এই মাস শেষ হলে সারাংশ দেখা যাবে।",
    addTopicTitle: "টপিক যোগ করুন", subjectLabel: "সাবজেক্ট", subjectPlaceholder: "যেমন: Physics, বাংলা...",
    pickSubject: "একটা সাবজেক্ট বেছে নাও, বা নিচে নতুন লিখো", newSubjectAutoSaved: "এখানে নতুন যা লিখবে সেটাও তোমার সাবজেক্ট লিস্টে যোগ হয়ে যাবে।",
    chooseFromList: "লিস্ট থেকে বেছে নাও", hideSubjectList: "লিস্ট লুকাও",
    lightMode: "লাইট মোডে যান", darkMode: "ডার্ক মোডে যান",
    hapticFeedback: "কম্পন (Haptic Feedback)",
    topicLabel: "টপিক", topicPlaceholder: "যেমন: নিউটনের সূত্র",
    durationLabel: "সময়কাল (মিনিট)", cancel: "বাতিল", add: "যোগ করো",
    dayDetail: "দিনের বিবরণ", planned: "পরিকল্পিত", done: "সম্পন্ন", notDone: "সম্পন্ন হয়নি", noData: "এই দিনের কোনো তথ্য নেই।",
    noSubjectData: "এই সময়ের জন্য কোনো সাবজেক্ট তথ্য নেই।",
    minutes: "মিনিট", close: "বন্ধ", deleteTopic: "মুছুন",
    timeRemainingLabel: "বাকি আছে",
    dayFocusedLabel: "ফোকাস করা হয়েছে", tasksRemainingLabel: "টি টাস্ক বাকি",
    confirmDeleteTopic: "এই টপিকটি মুছে ফেলবে?", confirmDelete: "হ্যাঁ, মুছে ফেলো",
    confirmDeleteAttempt: "এই এন্ট্রিটি মুছে ফেলবে?", confirmDeleteCombinedExam: "এই কম্বাইন্ড এক্সামটি মুছে ফেলবে?",
    monthOverview: "মাসের সংক্ষিপ্ত দৃশ্য", back: "পেছনে",
    todaysGoal: "আজকের লক্ষ্য", adjustGoal: "লক্ষ্য পরিবর্তন করুন", topics: "টপিক",
    doneCount: "সম্পন্ন", remaining: "বাকি", setGoal: "লক্ষ্য সেট করুন",
    progressLabel: "প্রগ্রেস", progressCompletedLabel: "সম্পন্ন", tipLabel: "টিপ",
    progressTip: "আজকের টাস্ক ও পড়া থেকে প্রগ্রেস হিসাব করা হয়েছে।",
    goalLabel: "আজ কতগুলো টপিক শেষ করবেন", statusDone: "সম্পন্ন",
    seeAll: "সব দেখুন", showLess: "কম দেখান",
    offlineBadge: "অফলাইন", offlineNote: "ইন্টারনেট নেই — তোমার পরিবর্তনগুলো এই ডিভাইসেই সেভ থাকছে, নেট ফিরলে অটো sync হয়ে যাবে।",
    pickFromBank: "একটা টপিক বেছে নাও, বা নিচে নতুন লিখো", newTopicAutoSaved: "এখানে নতুন যা লিখবে সেটাও পরের বারের জন্য সেভ হয়ে যাবে।",
    bulkAddTopics: "একসাথে একাধিক যোগ করো", bulkAddPlaceholder: "প্রতি লাইনে একটা টপিক (বা কমা দিয়ে আলাদা)\nযেমন:\nChapter 1\nChapter 2",
    manageSubjects: "সাবজেক্ট ম্যানেজ করো", noSubjectsYet: "এখনো কোনো সাবজেক্ট নেই। এখানে সিলেবাসের সাবজেক্ট যোগ করো।",
    addSubjectsFirst: "আগে সিলেবাসে সাবজেক্ট যোগ করো।", selectSubject: "সাবজেক্ট বেছে নাও",
    startTimeLabel: "শুরুর সময়", endTimeLabel: "শেষের সময়",
    addTimeToggle: "নির্দিষ্ট সময় যোগ করবো", addDurationToggle: "সময়কাল (কতক্ষণ পড়বো) যোগ করবো", noTimeSet: "সময় নির্ধারিত নেই", amLabel: "AM", pmLabel: "PM",
    remainingHeader: "বাকি আছে", doneHeader: "শেষ হয়েছে",
    next7Days: "পরের ৭ দিন", subjectTimeBreakdown: "সাবজেক্ট অনুযায়ী সময়ের হিসাব", noTimeData: "এখনো কোনো টপিক শেষ হয়নি।",
    overview: "সারসংক্ষেপ", caughtUpNote: "পরে শেষ হয়েছে",
    examSubjects: "এক্সাম সাবজেক্ট", manageExams: "এক্সাম ম্যানেজ করো", addExam: "এক্সাম সাবজেক্ট যোগ করো",
    examDateLabel: "এক্সামের তারিখ (ঐচ্ছিক)", noExamSubjects: "এখনো কোনো এক্সাম সাবজেক্ট নেই। যেসব বিষয়ে এক্সাম দিচ্ছেন সেগুলো যোগ করুন।",
    noDateSet: "তারিখ নির্ধারিত নেই", daysLeftLabel: "দিন বাকি", examToday: "আজ এক্সাম", examPassed: "এক্সাম শেষ",
    removeExam: "মুছুন", examOverview: "সব এক্সাম সাবজেক্টের সামগ্রিক চিত্র",
    examScores: "টেস্ট স্কোর", average: "গড়", obtainedPlaceholder: "নম্বর", outOfPlaceholder: "মোট নম্বর", noScoresYet: "এখনো কোনো স্কোর যোগ করা হয়নি",
    examGivenLabel: "এক্সাম দেয়া হয়েছে", examsCompletedLabel: "টা এক্সাম দেয়া হয়েছে",
    topicsLabel: "টপিক", addTopicBtn: "টপিক যোগ করো", noTopicsInSubject: "এখনো কোনো টপিক নেই।",
    topicNamePlaceholder: "টপিকের নাম (যেমন: কারক)", attemptsLabel: "বার", attemptsCountLabel: "প্রচেষ্টা",
    addAttempt: "নতুন স্কোর যোগ করো", attemptDateLabel: "তারিখ", noAttemptsYet: "এখনো কোনো স্কোর যোগ হয়নি",
    generalTopic: "সাধারণ", completedBadge: "সম্পন্ন",
    nextExamCard: "পরবর্তী পরীক্ষা", setNextExam: "পরবর্তী পরীক্ষা সেট করো", editNextExam: "এডিট", clearNextExam: "মুছুন",
    chooseSubject: "সাবজেক্ট বেছে নাও", chooseTopic: "টপিক বেছে নাও বা নতুন লেখো", noSubjectsForExam: "আগে একটা এক্সাম সাবজেক্ট যোগ করো।",
    monthlySummaryExam: "মাসিক সারাংশ", totalExams: "মোট পরীক্ষা", totalAttempts: "মোট প্রচেষ্টা",
    avgScoreLabel: "গড় স্কোর", maxScoreLabel: "সর্বোচ্চ স্কোর", subjectBreakdown: "সাবজেক্ট অনুযায়ী হিসাব",
    examsCol: "পরীক্ষা", attemptsCol: "প্রচেষ্টা", avgCol: "গড়", noExamDataMonth: "এই মাসে কোনো এক্সামের তথ্য নেই।",
    deleteTopicConfirmNote: "এই টপিকের সব স্কোর মুছে যাবে।",
    signIn: "সাইন ইন", signOut: "সাইন আউট", syncing: "সিঙ্ক হচ্ছে…", profile: "প্রোফাইল",
    nameExists: "এই নামটি আগে থেকেই আছে।",
    themeSystem: "সিস্টেম", themeLight: "লাইট", themeDark: "ডার্ক",
    themeIvory: "আইভরি", themeGraphite: "গ্র্যাফাইট", themeMist: "মিস্ট",
    appearance: "অ্যাপিয়ারেন্স", accentColor: "অ্যাকসেন্ট রং",
    settings: "সেটিংস", language: "ভাষা", theme: "থিম",
    aboutUs: "আমাদের সম্পর্কে", appName: "FocusGo", version: "ভার্সন",
    sendFeedback: "ফিডব্যাক পাঠান", feedbackSubject: "FocusGo অ্যাপ ফিডব্যাক",
    notifExam: "পরীক্ষার রিমাইন্ডার", notifTask: "টাস্ক রিমাইন্ডার", notifSalah: "নামাজের সময়ের নোটিফিকেশন", notifTimer: "টাইমার শেষের নোটিফিকেশন", notifAlarm: "অ্যালার্ম নোটিফিকেশন",
    alarmSetConfirm: "{time}-এ অ্যালার্ম সেট হয়েছে", alarmWebWarning: "খেয়াল করুন: অ্যালার্ম নোটিফিকেশন শুধু ইনস্টল করা FocusGo অ্যাপেই দেখাবে, এই ব্রাউজার প্রিভিউতে দেখাবে না।",
    alarmCancelBtn: "অ্যালার্ম বাতিল করুন", alarmCancelledMsg: "অ্যালার্ম বাতিল হয়েছে", nextAlarmLabel: "অ্যালার্ম",
    weekStartsOn: "সপ্তাহ শুরু হবে", weekStartSun: "রবিবার", weekStartMon: "সোমবার",
    weekStartTue: "মঙ্গলবার", weekStartWed: "বুধবার", weekStartThu: "বৃহস্পতিবার", weekStartFri: "শুক্রবার", weekStartSat: "শনিবার",
    defaultTimerDuration: "ডিফল্ট টাইমার সময়", focusLabel: "ফোকাস", breakLabel: "বিরতি",
    aboutTagline: "Make every day count.",
    aboutBody: "FocusGo একটি অল-ইন-ওয়ান দৈনন্দিন সঙ্গী — পড়াশোনা ও টাস্ক পরিকল্পনা করা, নোট রাখা, পরীক্ষা ও ফোকাস সেশন ট্র্যাক করা, আর সালাতের সময় মনে রাখা — সবকিছু এক জায়গায়, প্রতিটা দিনকে অর্থবহ করে তুলতে।",
    creatorLabel: "নির্মাতা",
    privacyPolicy: "প্রাইভেসি পলিসি", termsOfUse: "শর্তাবলি", legalSection: "লিগ্যাল",
    lastUpdated: "সর্বশেষ আপডেট", effectiveDate: "১৬ আগস্ট, ২০২৬",
    privacySections: [
      { title: "১. আমরা কী তথ্য সংগ্রহ করি", body: "অ্যাকাউন্ট তথ্য: আপনার ইমেইল, নাম (যদি দেন), এবং Google দিয়ে সাইন-ইন করলে Google থেকে পাওয়া বেসিক প্রোফাইল তথ্য।\n\nস্টাডি ডেটা: আপনি অ্যাপে যা যোগ করেন — সাবজেক্ট, টপিক, পড়াশোনার সময়, পরীক্ষার ফলাফল, এবং সংশ্লিষ্ট নোট।\n\nটেকনিক্যাল তথ্য: অ্যাপ ঠিকভাবে চালানোর জন্য প্রয়োজনীয় বেসিক সেটিং, যেমন থিম ও ভাষা প্রেফারেন্স।\n\nআমরা আপনার লোকেশন, কন্টাক্ট লিস্ট, বা ডিভাইসের অন্য কোনো ব্যক্তিগত ডেটা সংগ্রহ করি না।" },
      { title: "২. কীভাবে আমরা এই তথ্য ব্যবহার করি", body: "আপনার অ্যাকাউন্ট তৈরি ও লগইন পরিচালনা করতে।\n\nআপনার স্টাডি ডেটা সেভ ও সিঙ্ক রাখতে, যাতে বিভিন্ন ডিভাইস থেকে অ্যাক্সেস করতে পারেন।\n\nঅ্যাপের ফিচার (প্রোগ্রেস ট্র্যাকিং, ক্যালেন্ডার, পরিসংখ্যান) কাজ করানোর জন্য।\n\nআমরা আপনার তথ্য বিজ্ঞাপনের জন্য ব্যবহার করি না, এবং কোনো তৃতীয়পক্ষের কাছে বিক্রি করি না।" },
      { title: "৩. তথ্য কোথায় সংরক্ষিত হয়", body: "আপনার অ্যাকাউন্ট ও স্টাডি ডেটা Google Firebase (Authentication ও Firestore)-এ সংরক্ষিত হয়, যা একটি তৃতীয়পক্ষের ক্লাউড সার্ভিস। Firebase-এর নিজস্ব সিকিউরিটি ও প্রাইভেসি স্ট্যান্ডার্ড অনুযায়ী ডেটা এনক্রিপ্টেড থাকে। আমরা শুধুমাত্র আমাদের অ্যাপ পরিচালনার জন্য প্রয়োজনীয় অংশটুকু ব্যবহার করি।" },
      { title: "৪. আপনার অধিকার", body: "আপনি যেকোনো সময় আপনার প্রোফাইল তথ্য (নাম, ইমেইল, পাসওয়ার্ড) পরিবর্তন করতে পারেন।\n\nআপনি চাইলে আপনার অ্যাকাউন্ট ও সংশ্লিষ্ট সব ডেটা ডিলিট করার অনুরোধ করতে পারেন — এর জন্য নিচের ইমেইলে যোগাযোগ করুন।\n\nআপনার ডেটা সংক্রান্ত যেকোনো প্রশ্নের জন্যও যোগাযোগ করতে পারেন।" },
      { title: "৫. পরিবর্তন", body: "এই প্রাইভেসি পলিসি সময়ে সময়ে আপডেট হতে পারে। বড় কোনো পরিবর্তন হলে অ্যাপের মধ্যে জানিয়ে দেওয়া হবে।" },
      { title: "৬. যোগাযোগ", body: "কোনো প্রশ্ন থাকলে: mazharul.mrf@gmail.com" },
    ],
    termsSections: [
      { title: "১. সার্ভিসের বর্ণনা", body: "FocusGo একটি স্টাডি-ট্র্যাকিং ও প্ল্যানিং অ্যাপ, যেখানে আপনি সাবজেক্ট/টপিক অনুযায়ী পড়াশোনার প্ল্যান করতে, সময় ট্র্যাক করতে, প্রোগ্রেস দেখতে, এবং পরীক্ষার প্রস্তুতি সংগঠিত রাখতে পারেন।" },
      { title: "২. অ্যাকাউন্ট", body: "অ্যাকাউন্ট তৈরির সময় সঠিক তথ্য দেওয়ার দায়িত্ব আপনার।\n\nআপনার লগইন তথ্য (পাসওয়ার্ড) নিরাপদ রাখার দায়িত্বও আপনার। আপনার অ্যাকাউন্টে ঘটা যেকোনো কার্যকলাপের জন্য আপনি দায়ী।\n\nসন্দেহজনক কোনো অ্যাক্টিভিটি দেখলে দ্রুত আমাদের জানান।" },
      { title: "৩. সঠিক ব্যবহার", body: "আপনি সম্মত হচ্ছেন যে অ্যাপটি শুধুমাত্র ব্যক্তিগত, বৈধ উদ্দেশ্যে ব্যবহার করবেন, এবং অ্যাপের কোনো অংশে ক্ষতিকর কিছু (স্প্যাম, ম্যালওয়্যার, বা অননুমোদিত অ্যাক্সেসের চেষ্টা) করবেন না।" },
      { title: "৪. দায়বদ্ধতা সীমাবদ্ধতা", body: "FocusGo একটি organizational টুল মাত্র। পড়াশোনার ফলাফল, পরীক্ষার নম্বর, বা একাডেমিক সাফল্যের কোনো গ্যারান্টি এই অ্যাপ দেয় না। অ্যাপে সংরক্ষিত ডেটার নির্ভুলতা বজায় রাখার দায়িত্ব ব্যবহারকারীর নিজের।\n\nআমরা যথাসাধ্য চেষ্টা করি অ্যাপ নির্বিঘ্নে চালু রাখতে, তবে টেকনিক্যাল সমস্যা, ডাউনটাইম, বা ডেটা লসের সম্পূর্ণ ঝুঁকিমুক্ত নিশ্চয়তা দেওয়া সম্ভব না। গুরুত্বপূর্ণ তথ্যের ক্ষেত্রে নিজের ব্যাকআপ রাখার পরামর্শ দেওয়া হচ্ছে।" },
      { title: "৫. পরিবর্তন ও বন্ধ হওয়া", body: "আমরা যেকোনো সময় অ্যাপের ফিচার পরিবর্তন, যোগ, বা বন্ধ করার অধিকার রাখি। প্রয়োজনে আপনার অ্যাকাউন্ট বন্ধ করারও অধিকার রাখি, বিশেষত এই শর্তাবলি লঙ্ঘন করা হলে।" },
      { title: "৬. শর্তাবলির পরিবর্তন", body: "এই শর্তাবলি সময়ে সময়ে আপডেট হতে পারে। পরিবর্তনের পর অ্যাপ ব্যবহার চালিয়ে যাওয়া মানে নতুন শর্তে সম্মতি।" },
      { title: "৭. যোগাযোগ", body: "কোনো প্রশ্ন থাকলে: mazharul.mrf@gmail.com" },
    ],
    combinedExams: "কম্বাইন্ড এক্সাম", manageCombinedExams: "ম্যানেজ", addCombinedExam: "কম্বাইন্ড এক্সাম যোগ করো",
    noCombinedExams: "এখনো কোনো কম্বাইন্ড এক্সাম নেই। একাধিক সাবজেক্ট মিলিয়ে একটা রিকারিং এক্সাম বানাও।",
    combinedExamName: "এক্সামের নাম", combinedExamNamePlaceholder: "যেমন: সাপ্তাহিক ক্লাস টেস্ট", typeLabel: "ধরন",
    typeDaily: "দৈনিক", typeWeekly: "সাপ্তাহিক", typeMonthly: "মাসিক",
    subjectsLabel: "সাবজেক্ট", selectSubjectsNote: "এই এক্সামে কোন কোন সাবজেক্ট থাকবে বেছে নাও",
    noSubjectsForCombined: "আগে সিলেবাসে সাবজেক্ট যোগ করো।",
    editCombinedExam: "কম্বাইন্ড এক্সাম এডিট করো", deleteCombinedExam: "মুছুন",
    deleteCombinedExamConfirmNote: "এই কম্বাইন্ড এক্সামের সব স্কোর মুছে যাবে।",
    selectTodaysTopic: "আজকের টপিক বেছে নাও", freeSessionOption: "ফ্রি সেশন",
    noTopicsPlanned: "এখনো কোনো টপিক প্ল্যান করা হয়নি", noTopicsPlannedSub: "শুরু করতে প্রথম টপিকটি যোগ করুন।",
    totalPlannedLabel: "মোট পরিকল্পিত সময়",
    studyOverview: "পড়াশোনার সারসংক্ষেপ", focusedLabel: "মোট ফোকাস সময়", topicsCompletedLabel: "টি টপিক সম্পন্ন",
    completionLabel: "সম্পন্ন হার", streakLabel: "দিনের স্ট্রিক", weeklyActivity: "সাপ্তাহিক কার্যক্রম",
    monthlyActivity: "মাসিক কার্যক্রম", weekLabelShort: "সপ্তাহ ",
    subjectProgressSubtitle: "প্রতিটি সাবজেক্টে তুমি কতদূর পড়েছ",
    statsPageTitle: "স্ট্যাটস", statsPageSubtitle: "তোমার অগ্রগতি ট্র্যাক করো",
    dailyGoalLabel: "দৈনিক লক্ষ্য", completeShort: "সম্পন্ন", noTopicsYetCaps: "এখনো টপিক নেই",
    calendarLegendCompleted: "পড়া সম্পন্ন", calendarLegendExam: "পরীক্ষা", calendarLegendPlanned: "পরিকল্পিত",
    calendarLegendHoliday: "সরকারি ছুটি",
    noTopicsSubjectShort: "এখনো কোনো টপিক নেই", addTopicsShort: "টপিক যোগ করো",
    examSetupTitle: "তোমার এক্সাম সেট করো", examSetupSubtitle: "কয়েকটি সহজ ধাপে এক্সাম প্রস্তুতি গুছিয়ে নাও।",
    noExamYetTitle: "এখনো কোনো এক্সাম যোগ করা হয়নি", noExamYetSubtitle: "প্রস্তুতি ট্র্যাক করা শুরু করতে তোমার প্রথম এক্সামটি যোগ করো।",
    addExamCta: "এক্সাম যোগ করো",
    examSetupStep1: "এক্সাম সাবজেক্ট যোগ করো", examSetupStep2: "এক্সামের তারিখ ঠিক করো", examSetupStep3: "কম্বাইন্ড এক্সাম তৈরি করো",
    preparationLabel: "প্রস্তুতি",
    quickAdd: "কুইক অ্যাড", addStudyTopicQuick: "স্টাডি টপিক", addSubjectQuick: "সাবজেক্ট",
    addExamQuick: "এক্সাম", addCombinedExamQuick: "কম্বাইন্ড এক্সাম",
    notifications: "নোটিফিকেশন", noNotifications: "এখনো কোনো নোটিফিকেশন নেই",
    markAllRead: "সব পড়া হয়েছে বলে মার্ক করো", clearAll: "সব মুছে ফেলো",
    notifSessionDoneTitle: "ফোকাস সেশন শেষ!", notifSessionDoneBody: "দারুণ হয়েছে — এখন একটু ব্রেক নাও।",
    notifBreakDoneTitle: "ব্রেক শেষ", notifBreakDoneBody: "পরবর্তী ফোকাস সেশন শুরু হচ্ছে।",
    notifTopicDoneTitle: "টপিক সম্পন্ন!", notifTopicDoneBody: "এই টপিকের জন্য পরিকল্পিত পুরো সময় শেষ করেছো।",
    notifExamTodayTitle: "আজকে এক্সাম", notifExamTomorrowTitle: "আগামীকাল এক্সাম",
    notifExamSoonTitle: "আর {days} দিন পর এক্সাম",
    notifStreakTitle: "স্ট্রিক ধরে রাখো", notifStreakBody: "আজকে এখনো পড়াশোনা করা হয়নি — স্ট্রিক ভেঙো না!",
    notifGoalTitle: "আজকের গোল পূরণ হয়েছে!", notifGoalBody: "আজকের স্টাডি টার্গেট পূরণ হয়ে গেছে। এভাবেই চালিয়ে যাও!",
    notifInactiveTitle: "তোমাকে মিস করছি", notifInactiveBody: "কয়েকদিন ধরে কোনো পড়াশোনা লগ হয়নি — ফিরে এসে আবার শুরু করো।",
  }
};

// রঙগুলো আগের চেয়ে কম saturated/softer করা হয়েছে (সব ট্যাবেই subject-tag, bar, badge ইত্যাদিতে
// ব্যবহৃত হয় বলে এখানে বদলালেই পুরো অ্যাপ জুড়ে রঙ একটু মিইয়ে আসবে)
const SUBJECT_COLORS = [
  { bg: "#4F8181", bgSoft: "rgba(79,129,129,0.12)" },
  { bg: "#798D6F", bgSoft: "rgba(121,141,111,0.12)" },
  { bg: "#988FC1", bgSoft: "rgba(152,143,193,0.12)" },
  { bg: "#B18D50", bgSoft: "rgba(177,141,80,0.12)" },
  { bg: "#66919F", bgSoft: "rgba(102,145,159,0.12)" },
  { bg: "#AA7996", bgSoft: "rgba(170,121,150,0.12)" },
  { bg: "#7D86B5", bgSoft: "rgba(125,134,181,0.12)" },
  { bg: "#8A7B67", bgSoft: "rgba(138,123,103,0.12)" },
];
const colorForSubject = (name, subjects) => {
  // Position-ভিত্তিক index ব্যবহার করলে subject ডিলিট/reorder হলে বা derivedSubjects-এর
  // order বদলালে রঙও বদলে যেত (একই subject ভিন্ন সময়ে ভিন্ন রঙ পেত)। তার বদলে নামের
  // উপর একটা stable hash বানিয়ে রঙ ঠিক করা হচ্ছে, যাতে subject-এর identity অপরিবর্তিত থাকা পর্যন্ত রঙও অপরিবর্তিত থাকে।
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return SUBJECT_COLORS[hash % SUBJECT_COLORS.length];
};

// সাবজেক্টের নাম দেখে একটা প্রাসঙ্গিক আইকন বেছে নেওয়া হয় (Stats ট্যাবের Subject Progress কার্ডে ব্যবহৃত) —
// ডেটা মডেলে সাবজেক্টের নিজস্ব আইকন ফিল্ড নেই, তাই নামের কিওয়ার্ড ম্যাচ করে সবচেয়ে কাছাকাছি আইকন দেওয়া হচ্ছে
const iconForSubject = (name) => {
  const n = (name || "").toLowerCase();
  if (/general knowledge|\bgk\b|সাধারণ জ্ঞান/.test(n)) return Brain;
  if (/science|physics|chemistry|biology|বিজ্ঞান|পদার্থ|রসায়ন|জীববিজ্ঞান/.test(n)) return FlaskConical;
  if (/math|গণিত|অংক/.test(n)) return Calculator;
  if (/history|geography|social|ইতিহাস|ভূগোল|সমাজ/.test(n)) return Landmark;
  if (/english|literature|grammar|ইংরেজি|সাহিত্য/.test(n)) return BookOpen;
  if (/programming|code|computer|আইসিটি|কম্পিউটার/.test(n)) return Code2;
  if (/language|ভাষা/.test(n)) return Languages;
  if (/art|drawing|আর্ট|চিত্র/.test(n)) return PaletteIcon;
  if (/music|সংগীত/.test(n)) return Music2;
  return BookOpen;
};

// টাস্ক ক্যাটাগরির নাম -> lucide আইকন কম্পোনেন্ট (dynamic custom category-র জন্য)
const TASK_CATEGORY_ICONS = { GraduationCap, User2, Home, Tag, Target, ListChecks, CalendarDays };
const taskCategoryIcon = (iconName) => TASK_CATEGORY_ICONS[iconName] || Tag;
const findTaskCategory = (categories, key) => (categories || []).find(c => c.key === key) || { key, label: key, labelBn: key, icon: "Tag", color: "#8A8377" };

// মোবাইলে সফট-কিবোর্ড খুললে visual viewport ছোট হয়ে যায় (layout viewport না) — এই হুক দিয়ে
// bottom-sheet মোডালগুলোকে আসল দৃশ্যমান উচ্চতার সাথে মিলিয়ে রাখা যায়, তাই কিবোর্ড খোলা অবস্থাতেও
// মোডালের নিচের অংশ (ক্যাটাগরি, প্রায়োরিটি, Add বাটন) কিবোর্ডের আড়ালে হারিয়ে না গিয়ে স্ক্রল করে দেখা যায়।
function useVisualViewportHeight() {
  const [vh, setVh] = useState(() => {
    try { return (window.visualViewport ? window.visualViewport.height : window.innerHeight); } catch (e) { return 800; }
  });
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const vv = window.visualViewport;
    const onResize = () => setVh(vv.height);
    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);
    onResize();
    return () => { vv.removeEventListener("resize", onResize); vv.removeEventListener("scroll", onResize); };
  }, []);
  return vh;
}

// Looks through all past entries (every date, not just today) and returns the topic names
// previously used for one specific subject — most recently added first, no duplicates.
// This is what powers the "recent topic" suggestion chips, so nobody has to retype a topic
// they've already studied before. Nothing is stored separately; it's derived from `entries`.
const recentTopicsForSubject = (entries, subject, limit = 8) => {
  if (!subject) return [];
  const matches = Object.values(entries).flat().filter(e => e.subject === subject && (e.topic || "").trim());
  matches.sort((a, b) => {
    const ta = parseInt(String(a.id || "").split("-")[0], 10) || 0;
    const tb = parseInt(String(b.id || "").split("-")[0], 10) || 0;
    return tb - ta; // newest id first
  });
  const seen = new Set();
  const result = [];
  for (const e of matches) {
    const topic = e.topic.trim();
    if (seen.has(topic)) continue;
    seen.add(topic);
    result.push(topic);
    if (result.length >= limit) break;
  }
  return result;
};

// Topic Bank quick-pick order for one subject: topics that haven't been used/studied yet come first
// (still pending), then previously-used bank topics ordered most-recent-first. Topics typed as
// free text that aren't in the bank yet simply don't show up here — the plain input field below
// is always the fallback, and whatever gets typed there is auto-saved into the bank on submit.
const topicPickList = (topicBank, entries, subject) => {
  if (!subject) return [];
  const bank = (topicBank && topicBank[subject]) || [];
  if (bank.length === 0) return [];
  const recent = recentTopicsForSubject(entries || {}, subject, 999); // most-recent-first, every topic ever used
  const recentSet = new Set(recent);
  const neverUsed = bank.filter(x => !recentSet.has(x));
  const usedInBankOrder = recent.filter(x => bank.includes(x));
  return [...neverUsed, ...usedInBankOrder];
};

// Small reusable row of tappable "recent topic" chips shown under the Topic field.
// Tapping a chip fills the topic input; typing a new topic still works as before.
// ---------- Accent color options — ইউজার Settings থেকে বেছে নিতে পারবে, orange ডিফল্ট/প্রথম অপশন হিসেবে থাকছে ----------
const ACCENT_OPTIONS = [
  { key: "violet", labelBn: "ভায়োলেট", labelEn: "Violet", light: "#7C5CFC", dark: "#A78BFA" },
  { key: "orange", labelBn: "কমলা",  labelEn: "Orange", light: "#D97757", dark: "#D97757" },
  { key: "lilac", labelBn: "লাইলাক", labelEn: "Lilac", light: "#8E7DBE", dark: "#AC9EDB" },
  { key: "moss",  labelBn: "মস",     labelEn: "Moss",  light: "#4C7A52", dark: "#6FA377" },
];
function accentHexFor(key, dark) {
  // ইউজারের অনুরোধে আবার আগের মতো — Settings-এ যেই accent সেভ থাকুক না কেন,
  // পুরো অ্যাপ সবসময় ভায়োলেট রঙেই দেখাবে।
  return dark ? "#A78BFA" : "#7C5CFC";
}
// হেক্স রঙকে percent অনুযায়ী গাঢ়/হালকা করে — Next Exam কার্ডের মতো জায়গায় accent থেকে গ্রেডিয়েন্ট/শ্যাডো রং বানাতে ব্যবহার হয়
function shadeColor(hex, percent) {
  const h = hex.replace("#", "");
  const num = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00FF) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000FF) + Math.round(255 * (percent / 100));
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

// ---------- Appearance themes — Light / Dark / Ivory / Graphite / Mist ----------
// প্রতিটা থিমের নিজস্ব bg/cardBg/cardBorder/textMain/textMuted2 আছে। `dark` ফ্ল্যাগটা
// অ্যাপ জুড়ে ছড়িয়ে থাকা ছোটখাটো `dark ? A : B` (icon/shadow/ওভারলে) সিদ্ধান্তগুলোর জন্য —
// Dark ও Graphite এই দুইটা "dark" গ্রুপে, বাকি তিনটা "light" গ্রুপে পড়ে।
const THEME_PALETTES = {
  light:    { key:"light",    labelBn:"লাইট",     labelEn:"Light",    dark:false, bg:"#F7F6FA", cardBg:"#FFFFFF", cardBorder:"#E7E5ED", textMain:"#262433", textMuted2:"#79768A", subtleBg:"#F8F5EE" },
  dark:     { key:"dark",     labelBn:"ডার্ক",     labelEn:"Dark",     dark:true,  bg:"#000000", cardBg:"#121212", cardBorder:"#242424", textMain:"#FFFFFF", textMuted2:"#9B9B9B", subtleBg:"#0A0A0A" },
  ivory:    { key:"ivory",    labelBn:"আইভরি",    labelEn:"Ivory",    dark:false, bg:"#FBF6EA", cardBg:"#FFFDF7", cardBorder:"#EDE6D6", textMain:"#2E2A22", textMuted2:"#8A8270", subtleBg:"#FAF3E4" },
  graphite: { key:"graphite", labelBn:"গ্র্যাফাইট", labelEn:"Graphite", dark:true,  bg:"#1D1E22", cardBg:"#24262B", cardBorder:"#34363C", textMain:"#ECEDEF", textMuted2:"#A0A3AA", subtleBg:"#1A1B1F" },
  mist:     { key:"mist",     labelBn:"মিস্ট",     labelEn:"Mist",     dark:false, bg:"#EFF4F6", cardBg:"#F5F8FA", cardBorder:"#DCE4E8", textMain:"#26333A", textMuted2:"#74858D", subtleBg:"#EDF3F5" },
};
const THEME_ORDER = ["light", "dark"];
function themeFor(mode) {
  return THEME_PALETTES[mode] || THEME_PALETTES.light;
}
function normalizeThemeMode(mode) {
  if (mode === "system") return "system";
  if (THEME_ORDER.includes(mode)) return mode;
  return "system";
}

function RecentTopicChips({ topics, onPick, accent, cardBorder, textMuted2, dark }) {
  if (!topics.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap:6, marginTop: 8 }}>
      {topics.map((topic) => (
        <button
          key={topic}
          type="button"
          onClick={() => onPick(topic)}
          title={topic}
          style={{
            border: `1px solid ${cardBorder}`,
            background: dark ? "#0A0A0A" : "#F8F5EE",
            color: textMuted2,
            borderRadius:14,
            padding: "6px 12px",
            fontSize:12.5,
            fontWeight: 600,
            cursor: "pointer",
            maxWidth: 220,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}


// Renders digits in Noto Sans Bengali (clean, reliable Bengali numeral rendering, Google-hosted).
const Num = ({ children }) => <span style={{ fontFamily: "'Noto Sans Bengali',serif" }}>{children}</span>;

// Light haptic tick for navigation (tabs, opening calendar/day views, etc).
// নেটিভ অ্যাপে (Capacitor build) navigator.vibrate() কাজ করে না — তাই নেটিভ প্ল্যাটফর্মে আসল Haptics প্লাগিন ব্যবহার করা হচ্ছে,
// আর ব্রাউজার/PWA-তে আগের মতোই Web Vibration API fallback হিসেবে থাকছে।
// নোট: ImpactStyle.Light অনেক Android ডিভাইসে এখনও বেশ শক্তিশালী অনুভূত হয়, তাই তার বদলে
// Haptics.vibrate() দিয়ে খুব কম duration (ms) সেট করে সত্যিকারের হালকা tick তৈরি করা হচ্ছে।
// Settings থেকে ইউজার হ্যাপটিক বন্ধ/চালু করতে পারে (localStorage-এ সেভ থাকে) — বন্ধ থাকলে কিছুই হয় না।
const HAPTICS_PREF_KEY = "focusgo_haptics_enabled";
const isHapticsEnabled = () => {
  try { return window.localStorage.getItem(HAPTICS_PREF_KEY) !== "0"; } catch (e) { return true; }
};
const vibrate = (pattern = 8) => {
  try {
    if (!isHapticsEnabled()) return;
    if (Capacitor.isNativePlatform()) {
      Haptics.vibrate({ duration: 8 }).catch(() => {});
    } else if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (e) {}
};

// Settings থেকে ইউজার notification বন্ধ/চালু করতে পারে (localStorage-এ সেভ থাকে) — বন্ধ থাকলে
// কোনো OS (system tray) notification শিডিউল/পাঠানো হবে না। ইন-অ্যাপ notification bell-এর তালিকা
// (header-এর 🔔 আইকন) অবশ্য এর দ্বারা প্রভাবিত হয় না, কারণ ওটা অ্যাপ খোলা থাকা অবস্থাতেই দেখা যায়।
const NOTIFICATIONS_PREF_KEY = "focusgo_notifications_enabled";
const isNotificationsEnabled = () => {
  try { return window.localStorage.getItem(NOTIFICATIONS_PREF_KEY) !== "0"; } catch (e) { return true; }
};

const APP_ICON = "data:image/png;base64,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";

const FOCUSGO_MOTIVATIONS = {
  en: {
    start: [
      "Let's make today count, {name}.",
      "Every big goal starts with a small step, {name}.",
      "Today's a blank page — write something good, {name}.",
      "One focused hour today beats zero, {name}.",
      "Start now — future you will thank you, {name}.",
      "The secret of getting ahead is getting started, {name}.",
      "A little progress today adds up, {name}.",
      "Small steps still move you forward, {name}.",
      "Begin now, {name} — momentum builds from action.",
      "You don't have to be great to start, {name}, just start.",
    ],
    progress: [
      "Good start, {name} — keep the momentum going.",
      "You're on a roll, {name}. A bit more today.",
      "Nice progress, {name} — finish what you started.",
      "Halfway is still moving forward, {name}.",
      "Stay with it, {name} — you're closer than you think.",
      "Keep going, {name} — don't stop now.",
      "You're building something real today, {name}.",
      "One more topic, {name} — you've got this.",
      "Consistency is what you're building, {name}.",
      "Push a little further today, {name}.",
    ],
    done: [
      "All done for today, {name}! Great work.",
      "Today's goals: complete, {name}. Well earned rest.",
      "You showed up and finished, {name}. That's the habit.",
      "Nailed it today, {name}. See you tomorrow.",
      "Solid day, {name} — everything's checked off.",
      "Today's a win, {name}. Proud of the effort.",
      "You finished strong today, {name}.",
      "That's a wrap for today, {name} — excellent work.",
      "Every box checked, {name}. Well done.",
      "Today counted, {name}. Rest up for tomorrow.",
    ],
  },
  bn: {
    start: [
      "আজকের দিনটা কাজে লাগাই, {name}।",
      "ছোট একটা শুরু থেকেই বড় কিছু হয়, {name}।",
      "আজ একটা নতুন সুযোগ, {name} — শুরু করে দাও।",
      "একটা মনোযোগী ঘণ্টাও অনেক কিছু, {name}।",
      "এখনই শুরু করো, {name} — পরে ভালো লাগবে।",
      "শুরু করাটাই সবচেয়ে গুরুত্বপূর্ণ, {name}।",
      "আজকের একটু চেষ্টাও জমা হতে থাকবে, {name}।",
      "ছোট পদক্ষেপও তোমাকে এগিয়ে নেয়, {name}।",
      "শুরু করো, {name} — গতি এমনিই তৈরি হবে।",
      "নিখুঁত হতে হবে না, {name}, শুধু শুরু করো।",
    ],
    progress: [
      "ভালো শুরু হয়েছে, {name} — এভাবেই চালিয়ে যাও।",
      "গতি ধরে রাখো, {name}। আর একটু বাকি।",
      "চমৎকার অগ্রগতি, {name} — যা শুরু করেছ শেষ করো।",
      "অর্ধেক হয়ে গেছে, {name} — এটাও এগিয়ে যাওয়া।",
      "লেগে থাকো, {name} — তুমি ভাবছ তার চেয়ে কাছে চলে এসেছ।",
      "চালিয়ে যাও, {name} — এখন থামলে চলবে না।",
      "আজ তুমি ভালো কিছু গড়ছ, {name}।",
      "আর একটা টপিক, {name} — তুমি পারবে।",
      "ধারাবাহিকতাই তুমি গড়ে তুলছ, {name}।",
      "আজ আর একটু এগিয়ে যাও, {name}।",
    ],
    done: [
      "আজকের সব শেষ, {name}! দারুণ কাজ।",
      "আজকের লক্ষ্য সম্পন্ন, {name}। এবার একটু বিশ্রাম নাও।",
      "তুমি লেগে থেকে শেষ করেছ, {name}। এটাই অভ্যাস গড়ে তোলে।",
      "আজকের দিনটা দারুণ গেল, {name}। কাল দেখা হবে।",
      "ভালো একটা দিন গেল, {name} — সব কাজ শেষ।",
      "আজ তুমি জিতেছ, {name}। পরিশ্রম স্বার্থক।",
      "আজ দারুণভাবে শেষ করেছ, {name}।",
      "আজকের মতো শেষ, {name} — চমৎকার কাজ।",
      "সব কাজ সম্পন্ন, {name}। খুব ভালো।",
      "আজকের দিনটা কাজে লেগেছে, {name}। কাল আবার দেখা হবে।",
    ],
  },
};

function FocusGoInner() {
  // দ্বিতীয় স্তরের সুরক্ষা: Android WebView-তে কখনো কখনো "backspace = back navigation"
  // আচরণটা এমন লেভেলে ট্রিগার হয় যেটা নিচের keydown guard-ও সবসময় ধরতে পারে না
  // (একাধিকবার Backspace চাপলে দ্বিতীয়/তৃতীয়বারে অ্যাপ পুরো বন্ধ হয়ে যাচ্ছিল)।
  // তাই এখানে history-তে একটা স্থায়ী "trap" entry রাখা হচ্ছে — কোনোভাবে back navigation
  // (popstate) ঘটলেই সাথে সাথে সেই entry আবার পুশ করে দেওয়া হয়, ফলে অ্যাপ visually
  // কখনো পিছিয়ে যায় না বা বন্ধ হয় না, উৎসটা backspace হোক বা hardware back বাটন।
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, []);

  // Android WebView-এ (বিশেষত Capacitor অ্যাপে) একটা পুরনো আচরণ আছে — Backspace key যদি কোনো
  // প্রকৃত এডিটেবল ফিল্ডের (input/textarea/contentEditable) বাইরে বা তার "সক্রিয়" স্টেটের বাইরে
  // চাপা হয়, তাহলে ব্রাউজার সেটাকে "history.back()" হিসেবে ধরে নেয়। নোট এডিটরে এটাই bug তৈরি করছিল:
  // Backspace চাপলে সেভ না হয়েই এডিটর বন্ধ হয়ে, ইতিহাসের আর কোনো entry না থাকলে পুরো অ্যাপই বন্ধ হয়ে যেত।
  // এখানে capture-phase এ Backspace ধরে, target আসলেই এডিটেবল কিনা যাচাই করে — না হলে navigation
  // থামিয়ে দিই। এডিটেবল ফিল্ডে স্বাভাবিক backspace আচরণ (delete character) অক্ষতই থাকে।
  useEffect(() => {
    const guardBackspaceNav = (e) => {
      if (e.key !== "Backspace") return;
      const target = e.target;
      const tag = (target && target.tagName || "").toLowerCase();
      const isEditable = tag === "input" || tag === "textarea" || (target && target.isContentEditable);
      if (!isEditable) {
        e.preventDefault();
        return;
      }
      // এডিটেবল ফিল্ডের ভেতরেও: cursor একদম শুরুতে থাকলে (মানে ডিলিট করার মতো কোনো
      // ক্যারেক্টার নেই — যেমন খালি নোট ফিল্ড, বা সব লেখা মুছে ফেলার পর আরেকবার Backspace),
      // কিছু Android WebView তখনও এটাকে "history.back()" হিসেবে ধরে নেয় এবং পুরো অ্যাপ বন্ধ
      // করে দেয়। এখানে সেই স্পেসিফিক কেসে navigation আটকে দেওয়া হচ্ছে; যেখানে সত্যিই ডিলিট
      // করার কিছু আছে, স্বাভাবিক backspace আচরণ অক্ষত থাকছে।
      if (tag === "input" || tag === "textarea") {
        const atStart = target.selectionStart === 0 && target.selectionEnd === 0;
        if (atStart) {
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", guardBackspaceNav, true);
    return () => document.removeEventListener("keydown", guardBackspaceNav, true);
  }, []);

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = APP_ICON;
    document.title = "FocusGo - Make every day count.";
  }, []);

  // মোবাইল কিবোর্ড খুললে যেন লেআউট viewport কিবোর্ডের জায়গা বাদ দিয়ে resize হয় (overlay হয়ে না থাকে) —
  // সাপোর্টেড ব্রাউজারে (Chrome/Android) এটাই bottom-sheet মোডালের ইনপুট/বাটন কিবোর্ডের নিচে হারিয়ে যাওয়া আটকায়।
  // অসমর্থিত ব্রাউজারে (iOS Safari ইত্যাদি) নিরাপদে ignore হয়ে যায় — visualViewport হুকই তখন মূল ভরসা।
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    const base = "width=device-width, initial-scale=1, viewport-fit=cover";
    if (!/interactive-widget/.test(meta.content || "")) {
      meta.content = `${meta.content ? meta.content + ", " : base + ", "}interactive-widget=resizes-content`;
    }
  }, []);


  // ---------- Font loading (fixed) ----------
  // আগে ফন্টগুলো `@import` দিয়ে একটা <style> ট্যাগে লোড হতো, যেটা শুধু লগইন/লোডিং স্ক্রিন পার হয়ে
  // মূল UI রেন্ডার হওয়ার পরে DOM-এ যোগ হতো। ফলে: (১) শুরুর স্ক্রিনগুলোতে ফন্ট রিকোয়েস্টই যেত না,
  // (২) `@import` ব্রাউজার অনুযায়ী ভিন্নভাবে/দেরিতে লোড হয়, তাই রিফ্রেশ বা ডিপ্লয়ের পর মাঝেমধ্যে
  // ফলব্যাক (সিস্টেম) ফন্ট দেখা যেত — এটাই "ফন্ট চেঞ্জ হয়ে যাওয়া" সমস্যার আসল কারণ।
  // এখন: real <link rel="stylesheet"> ট্যাগ দিয়ে, কম্পোনেন্ট মাউন্ট হওয়ার সাথে সাথেই (যেকোনো
  // loading/auth স্ক্রিনের আগেই) একবার লোড হয় — সব ব্রাউজারে consistent ও ক্যাশযোগ্য।
  useEffect(() => {
    const addLink = (rel, href, extra = {}) => {
      const selector = `link[rel="${rel}"][href="${href}"]`;
      if (document.querySelector(selector)) return;
      const el = document.createElement("link");
      el.rel = rel;
      el.href = href;
      Object.entries(extra).forEach(([k, v]) => { el[k] = v; });
      document.head.appendChild(el);
    };
    // preconnect — DNS/TLS আগেভাগে শুরু করে দেয়, তাই আসল CSS/ফন্ট ফাইল দ্রুত আসে
    addLink("preconnect", "https://fonts.googleapis.com");
    addLink("preconnect", "https://fonts.gstatic.com", { crossOrigin: "anonymous" });
    // আসল ফন্ট stylesheet — এবার real <link>, তাই ব্রাউজার এটাকে render-blocking resource
    // হিসেবে priority দিয়ে আগেভাগে ফেচ করে, `@import`-এর মতো দেরি করে না
    addLink("stylesheet", "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap");
  }, []);

  const breakpoint = useViewport(); // "mobile" | "tablet" | "desktop"
  const [lang, setLang] = useState("en");
  // থিম: system / light / dark / ivory / graphite / mist — ডিফল্ট "system",
  // ডিভাইসের prefers-color-scheme অনুযায়ী লাইভ ঠিক হয় (নিচে systemPrefersDark দেখুন)
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const saved = window.localStorage.getItem("focusgo_theme_mode_v2");
      if (saved === "system" || THEME_ORDER.includes(saved)) return saved;
      // একদম নতুন ইউজার (কোনো saved value নেই) — ডিফল্ট "system"
      return "system";
    } catch (e) {
      return "system";
    }
  }); // "system" | "light" | "dark" | "ivory" | "graphite" | "mist"

  // Keep the selected theme across browser refreshes without waiting for Firestore.
  useEffect(() => {
    try { window.localStorage.setItem("focusgo_theme_mode_v2", themeMode); } catch (e) {}
  }, [themeMode]);
  // অ্যাকসেন্ট রং — orange ডিফল্ট, ইউজার Settings > Theme থেকে বদলাতে পারবে
  const [accentKey, setAccentKey] = useState(() => {
    try {
      const saved = window.localStorage.getItem("focusgo_accent_key_v1");
      return ACCENT_OPTIONS.some(a => a.key === saved) ? saved : "violet";
    } catch (e) {
      return "violet";
    }
  });
  useEffect(() => {
    try { window.localStorage.setItem("focusgo_accent_key_v1", accentKey); } catch (e) {}
  }, [accentKey]);
  // ফন্ট/ডিসপ্লে সাইজ — Settings > Appearance থেকে ইউজার বদলাতে পারবে, পুরো অ্যাপ CSS zoom দিয়ে স্কেল হয় (Android WebView Chromium-বেসড বলে zoom কাজ করে, লেআউট ভাঙে না)
  const TEXT_SCALE_OPTIONS = [85, 92.5, 100, 107.5, 115, 122.5];
  const [textScale, setTextScale] = useState(() => {
    try {
      const saved = Number(window.localStorage.getItem("focusgo_text_scale_v1"));
      return TEXT_SCALE_OPTIONS.includes(saved) ? saved : 100;
    } catch (e) {
      return 100;
    }
  });
  useEffect(() => {
    try { window.localStorage.setItem("focusgo_text_scale_v1", String(textScale)); } catch (e) {}
  }, [textScale]);
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    try { return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches; } catch (e) { return false; }
  });
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setSystemPrefersDark(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler); else mq.addListener(handler);
    return () => { if (mq.removeEventListener) mq.removeEventListener("change", handler); else mq.removeListener(handler); };
  }, []);
  // themeMode "system" হলে ডিভাইসের লাইভ prefers-color-scheme অনুযায়ী light/dark রেজল্ভ হয়
  const resolvedThemeKey = themeMode === "system" ? (systemPrefersDark ? "dark" : "light") : themeMode;
  const dark = themeFor(resolvedThemeKey).dark;
  // সালাত টাইমার সংক্রান্ত state — লাইভ লোকেশন (lat/lng) একবার পারমিশন পেলে localStorage-এ ক্যাশ থাকে, আইকনে আবার চাপলে re-select করা যায়
  const [salahCoords, setSalahCoords] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem("focusgo_salah_coords") || "null"); } catch (e) { return null; }
  });
  // আসরের হিসাব: হানাফি (factor 2) বা শাফি/মালিকি/হাম্বলি (factor 1) — সেটিং সেভ থাকে
  const [salahMadhab, setSalahMadhab] = useState(() => {
    try { return window.localStorage.getItem("focusgo_salah_madhab") || "hanafi"; } catch (e) { return "hanafi"; }
  });
  useEffect(() => {
    try { window.localStorage.setItem("focusgo_salah_madhab", salahMadhab); } catch (e) {}
  }, [salahMadhab]);
  // কোঅর্ডিনেট থেকে reverse-geocode করা এলাকার নাম (যেমন "Dhaka, Bangladesh") — লোকেশন বদলালে রিফ্রেশ হয়
  const [salahLocationName, setSalahLocationName] = useState(() => {
    try { return window.localStorage.getItem("focusgo_salah_location_name") || ""; } catch (e) { return ""; }
  });
  const [showSalahDropdown, setShowSalahDropdown] = useState(false);
  const [salahLocLoading, setSalahLocLoading] = useState(false);
  const [salahLocError, setSalahLocError] = useState("");
  // পারমিশন একবার "Don't ask again" সহ ডিনাই হয়ে গেলে Android আর নিজে থেকে পারমিশন ডায়ালগ দেখায় না —
  // requestPermissions() চুপচাপ denied-ই ফেরত দেয়। তখন ইউজারকে বারবার নিজে থেকে অ্যাপ ইনফো > পারমিশন-এ
  // গিয়ে অন করতে হতো। এই flag true হলে UI-তে "Open Settings" বাটন দেখিয়ে সরাসরি সেই স্ক্রিনে নিয়ে যাওয়া হবে।
  const [salahPermDenied, setSalahPermDenied] = useState(false);
  const openLocationSettings = () => {
    vibrate();
    try {
      NativeSettings.open({
        optionAndroid: AndroidSettings.ApplicationDetails,
        optionIOS: IOSSettings.App,
      }).catch(() => {});
    } catch (e) { /* প্লাগিন না থাকলে বা ওয়েবে চললে চুপচাপ ইগনোর */ }
  };
  // কোন দিনে কোন সালাত আদায় করা হয়েছে তার হিসাব — প্রতিদিন আলাদা, তারিখ অনুযায়ী সেভ থাকে
  const [salahCompleted, setSalahCompleted] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem("focusgo_salah_completed") || "{}"); } catch (e) { return {}; }
  });
  // সালাত টাইমার ফিচার (Today ট্যাবের মসজিদ আইকন + সময়সূচি) পুরোপুরি অন/অফ — সেটিংস থেকে নিয়ন্ত্রিত
  const [salahFeatureEnabled, setSalahFeatureEnabled] = useState(() => {
    try { return window.localStorage.getItem("focusgo_salah_feature_enabled") !== "0"; } catch (e) { return true; }
  });
  useEffect(() => {
    try { window.localStorage.setItem("focusgo_salah_feature_enabled", salahFeatureEnabled ? "1" : "0"); } catch (e) {}
  }, [salahFeatureEnabled]);
  useEffect(() => {
    try { window.localStorage.setItem("focusgo_salah_completed", JSON.stringify(salahCompleted)); } catch (e) {}
  }, [salahCompleted]);
  // ওয়েদার — Open-Meteo (ফ্রি, API key লাগে না)। সালাতের জন্য নেওয়া লোকেশন (salahCoords) পুনরায়
  // ব্যবহার করা হয়, যাতে আলাদা করে আরেকবার লোকেশন পারমিশন চাইতে না হয়। ক্যাশ localStorage-এ থাকে
  // বলে অ্যাপ খোলার সাথে সাথেই আগের রিডিং দেখানো যায়, তারপর ব্যাকগ্রাউন্ডে রিফ্রেশ হয়।
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [weatherData, setWeatherData] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem("focusgo_weather_cache") || "null"); } catch (e) { return null; }
  });
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const salahMenuRef = useRef(null);

  const [tab, setTab] = useState("today");
  // Visible Tabs — Study/Tasks/Notes বটম ন্যাভ থেকে দেখানো/লুকানো যায় (Today ও Settings সবসময় থাকে)।
  // OFF করলে সংশ্লিষ্ট ফিচার-রিলেটেড সবকিছু Today ট্যাব থেকেও লুকায় (নিচে দেখুন)।
  const [studyFeatureEnabled, setStudyFeatureEnabled] = useState(() => {
    try { return window.localStorage.getItem("focusgo_tab_study_enabled") !== "0"; } catch (e) { return true; }
  });
  const [tasksFeatureEnabled, setTasksFeatureEnabled] = useState(() => {
    try { return window.localStorage.getItem("focusgo_tab_tasks_enabled") !== "0"; } catch (e) { return true; }
  });
  useEffect(() => { try { window.localStorage.setItem("focusgo_tab_study_enabled", studyFeatureEnabled ? "1" : "0"); } catch (e) {} }, [studyFeatureEnabled]);
  useEffect(() => { try { window.localStorage.setItem("focusgo_tab_tasks_enabled", tasksFeatureEnabled ? "1" : "0"); } catch (e) {} }, [tasksFeatureEnabled]);
  // চালু থাকা ট্যাবের ফিচার সেটিংস থেকে বন্ধ হয়ে গেলে (bottom nav-এ আর নেই এমন ট্যাবে আটকে থাকা এড়াতে)
  // সাথে সাথে "Today"-তে ফিরিয়ে আনা হয়; Notes ট্যাব সম্পূর্ণ সরিয়ে দেওয়া হয়েছে, তাই পুরনো সেভ করা tab="notes" থাকলেও Today-তে ফেরত পাঠানো হয়
  useEffect(() => {
    if ((tab === "study" && !studyFeatureEnabled) || (tab === "task" && !tasksFeatureEnabled) || tab === "notes") {
      setTab("today");
    }
  }, [tab, studyFeatureEnabled, tasksFeatureEnabled]);
  // ব্যাক বাটন চাপলে "Today" ছাড়া অন্য কোনো ট্যাবে থাকলে অ্যাপ বন্ধ না হয়ে সরাসরি "Today" ট্যাবে ফিরে যাবে
  // দেখাতে এই toast ব্যবহার হয় ("Today" ট্যাবে থেকেও একবার ব্যাক চাপলে অ্যাপ বন্ধ হবে না, দ্বিতীয়বার চাপলে বন্ধ হবে)
  const [showExitToast, setShowExitToast] = useState(false);
  const exitToastTimerRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false); // "Continue without an account" — data stays in-memory only, never synced
  const [onboardingDone, setOnboardingDone] = useState(() => {
    try { return window.localStorage.getItem("focusgo_onboarding_v1") === "1"; } catch (e) { return true; } // localStorage না থাকলে অনবোর্ডিং আটকে না রাখাই ভালো
  });
  const finishOnboarding = () => {
    try { window.localStorage.setItem("focusgo_onboarding_v1", "1"); } catch (e) {}
    setOnboardingDone(true);
  };
  const [authChecked, setAuthChecked] = useState(false); // Firebase প্রথমবার auth স্টেট জানিয়েছে কিনা
  const [now, setNow] = useState(new Date());
  const [entries, setEntries] = useState({}); // dateKey -> [{id, subject, topic, time, endTime, duration, done}]
  const [subjects, setSubjects] = useState([]); // manually managed syllabus subjects
  // এই পুরনো (ইউজার-নির্দিষ্ট নয় এমন) localStorage key শুধু প্রথমবার লোড হওয়ার জন্য fallback হিসেবে রাখা হয়েছে,
  // যাতে আপডেটের আগে যাদের টাস্ক শুধু এই ডিভাইসে সেভ ছিল তারা সেটা হারিয়ে না ফেলে — লগইন করলে এই ডেটা
  // একবার Firestore-এ মাইগ্রেট হয়ে যাবে (নিচের sync effect দেখুন), এরপর থেকে আর এই key ব্যবহার হবে না
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem("focusgo_tasks_v1") || "[]"); } catch (e) { return []; }
  }); // {id, title, category:"study"|"personal", priority:"high"|"med"|"low", done}[]

  // ---- Undo toast: যেকোনো ডিলিট action-এর পর কয়েক সেকেন্ডের জন্য ফিরিয়ে আনার সুযোগ ----
  const [undoToast, setUndoToast] = useState(null); // { message, onUndo } | null
  const undoTimerRef = useRef(null);
  const showUndoToast = (message, onUndo) => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoToast({ message, onUndo });
    undoTimerRef.current = setTimeout(() => setUndoToast(null), 5000);
  };
  const dismissUndoToast = () => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoToast(null);
  };

  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // এডিট করার জন্য সিলেক্টেড টাস্ক অবজেক্ট, নাহলে null
  const [taskMenuOpenId, setTaskMenuOpenId] = useState(null); // কোন টাস্ক কার্ডের "..." মেনু খোলা আছে
  const [taskDeleteConfirmId, setTaskDeleteConfirmId] = useState(null); // ভুলে ডিলিট এড়াতে — মেনুর ভেতরেই কনফার্ম ধাপ
  const [taskDetailId, setTaskDetailId] = useState(null); // টাস্ক রো-তে ট্যাপ করলে যেই টাস্কের ডিটেইল শিট খোলে
  const closeTaskMenu = () => { setTaskMenuOpenId(null); setTaskDeleteConfirmId(null); };
  const [taskAddDefaultDate, setTaskAddDefaultDate] = useState(null); // Calendar view-এ কোনো দিন সিলেক্ট করা অবস্থায় + চাপলে সেই দিনটাই নতুন টাস্কের due date হিসেবে prefill হয়
  // কাস্টম টাস্ক ক্যাটাগরি — ডিফল্টে Study/Personal, ইউজার চাইলে আরো ক্যাটাগরি যোগ করতে পারবে (localStorage-এ সেভ থাকে)
  const [taskCategories, setTaskCategories] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("focusgo_task_categories_v1"));
      if (Array.isArray(saved) && saved.length) return saved;
    } catch (e) {}
    return [
      { key: "study", label: "Study", labelBn: "স্টাডি", icon: "GraduationCap", color: "#4C8FA6" },
      { key: "personal", label: "Personal", labelBn: "পার্সোনাল", icon: "User2", color: "#6E8B5E" },
    ];
  });
  useEffect(() => {
    try { window.localStorage.setItem("focusgo_task_categories_v1", JSON.stringify(taskCategories)); } catch (e) {}
  }, [taskCategories]);
  const addTaskCategory = (name) => {
    const label = (name || "").trim();
    if (!label) return null;
    const key = `c_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
    const palette = ["#D97757","#6E8B5E","#7E6EC9","#C08A2E","#4C8FA6","#B25B8F"];
    const color = palette[taskCategories.length % palette.length];
    const cat = { key, label, labelBn: label, icon: "Tag", color };
    setTaskCategories(prev => [...prev, cat]);
    return cat;
  };
  // notes-এর জন্যও একই কারণে পুরনো localStorage key শুধু one-time fallback হিসেবে রাখা — লগইন করলে
  // Firestore-এ মাইগ্রেট হয়ে যাবে, তারপর থেকে সেটাই source of truth থাকবে (নিচের sync effect দেখুন)
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem("focusgo_notes_v1") || "[]"); } catch (e) { return []; }
  });
  const [noteSearch, setNoteSearch] = useState("");
  const [taskFilter, setTaskFilter] = useState("all"); // all | study | personal
  const [taskListStatusFilter, setTaskListStatusFilter] = useState("all"); // "all" | "done" | "overdue" — Tasks ট্যাবের উপরের All/Done/Overdue পিল
  const [taskSearchQuery, setTaskSearchQuery] = useState(""); // Tasks ট্যাবের সার্চ বার
  const [taskListDay, setTaskListDay] = useState(() => new Date()); // "All" ফিল্টারে সব তারিখের টাস্ক একসাথে দেখালে অগোছালো লাগে,
  // তাই এক দিনের টাস্কই দেখানো হয় — এই স্টেট সেই দিনটা ধরে রাখে, ডিফল্ট আজ
  const [taskViewMode, setTaskViewMode] = useState("list"); // "list" | "calendar" — Task tab-এর ভিউ টগল
  const [taskCalMonth, setTaskCalMonth] = useState(new Date()); // Task calendar view-এ কোন মাস দেখাচ্ছে
  const [taskCalSelectedDay, setTaskCalSelectedDay] = useState(null); // Task calendar-এ সিলেক্টেড দিনের dateKey | null
  const [studySection, setStudySection] = useState("plan"); // "plan" | "stats" — sub-tab inside the Study tab (Study Plan / Stats)
  const toggleTask = (id) => setTasks(ts => {
    const target = ts.find(x => x.id === id);
    // রিপিটিং টাস্ক "done" করলে সেটাকে সম্পন্ন হিসেবে রেখে পরের occurrence অটো-তৈরি হবে
    if (target && !target.done && target.repeat) {
      const base = target.dueDate || todayKey;
      const nextDue = nextDueDateFromKey(base, target.repeat);
      // repeatGoal সেট থাকলে (যেমন সপ্তাহে ৭ বার) স্ট্রিক কাউন্ট বাড়বে, গোল ছুঁলে পরের সাইকেলে ০ থেকে আবার শুরু হবে
      const prevCount = target.streakCount || 0;
      const nextCount = target.repeatGoal ? (prevCount + 1 >= target.repeatGoal ? 0 : prevCount + 1) : prevCount;
      const nextInstance = { ...target, id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`, dueDate: nextDue, done: false, doneAt: null, streakCount: nextCount };
      return [nextInstance, ...ts.map(x => x.id === id ? { ...x, done: true, doneAt: todayKey, streakCount: target.repeatGoal ? Math.min(prevCount + 1, target.repeatGoal) : prevCount } : x)];
    }
    return ts.map(x => x.id === id ? { ...x, done: !x.done, doneAt: !x.done ? todayKey : null } : x);
  });
  const toggleTaskFavorite = (id) => setTasks(ts => ts.map(x => x.id === id ? { ...x, favorite: !x.favorite } : x));
  const playingAudioRef = useRef(null);
  const playTaskAudio = (task) => {
    if (!task || !task.audioData) return;
    try { playingAudioRef.current?.pause(); } catch (e) {}
    const audio = new Audio(task.audioData);
    playingAudioRef.current = audio;
    audio.play().catch(() => {});
  };
  const deleteTask = (id) => {
    const removed = tasks.find(x => x.id === id);
    setTasks(ts => ts.filter(x => x.id !== id));
    if (removed) {
      showUndoToast(lang === "bn" ? "টাস্ক ডিলিট হয়েছে" : "Task deleted", () => {
        setTasks(ts => [...ts, removed]);
      });
    }
  };
  const addTask = (newTask) => setTasks(ts => [newTask, ...ts]);
  const updateTask = (updated) => setTasks(ts => ts.map(x => x.id === updated.id ? { ...x, ...updated } : x));
  const [topicBank, setTopicBank] = useState({}); // subject -> [topicName, ...] — pre-added topics for Today's Study/Plan, subject-scoped (mirrors examSubjects' subject->topics shape but as a flat list, no attempts)
  const [showManageTopicsFor, setShowManageTopicsFor] = useState(null); // subject name | null — which subject's topic-bank editor is open
  const [examSubjects, setExamSubjects] = useState({}); // subject -> { topics: { [topicName]: { attempts: [{id, date, obtained, total}] } } }
  const [combinedExams, setCombinedExams] = useState({}); // id -> { name, type: "daily"|"weekly"|"monthly", subjects: [names], attempts: [{id, date, obtained, total}] }
  const [nextExam, setNextExam] = useState(null); // { subject, topic, date } | null — পুরনো একক "next exam" ফিল্ড, ব্যাকওয়ার্ড-কম্প্যাটিবিলিটির জন্য রাখা হয়েছে
  const [examSchedule, setExamSchedule] = useState([]); // [{id, subject, date, startTime, endTime}] — একাধিক তারিখ-সহ পরীক্ষার পূর্ণ রুটিন (Home + Study ট্যাব দুই জায়গাতেই দেখা যায়)
  const [showExamSchedule, setShowExamSchedule] = useState(false); // Study ট্যাবের "Exams" কার্ডে ট্যাপ করলে এই ম্যানেজার মডাল খোলে
  // ---- In-app notifications: session done, exam reminders, streak, daily goal, inactivity ----
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem("focusgo_notifications") || "[]"); } catch (e) { return []; }
  });
  useEffect(() => {
    try { window.localStorage.setItem("focusgo_notifications", JSON.stringify(notifications.slice(0, 50))); } catch (e) {}
  }, [notifications]);
  // guards so each notification type fires at most once per relevant day/state (persisted so refresh doesn't repeat)
  const notifiedFlagsRef = useRef((() => {
    try { return JSON.parse(window.localStorage.getItem("focusgo_notif_flags") || "{}"); } catch (e) { return {}; }
  })());
  const saveNotifiedFlags = () => {
    try { window.localStorage.setItem("focusgo_notif_flags", JSON.stringify(notifiedFlagsRef.current)); } catch (e) {}
  };
  // ইউজার Settings থেকে OS (system tray) notification বন্ধ/চালু করতে পারে — বন্ধ থাকলে
  // exam/task reminder ও Focus Timer শেষের নোটিফিকেশন কোনোটাই ডিভাইসে শিডিউল হবে না।
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => isNotificationsEnabled());
  useEffect(() => {
    try { window.localStorage.setItem(NOTIFICATIONS_PREF_KEY, notificationsEnabled ? "1" : "0"); } catch (e) {}
  }, [notificationsEnabled]);
  // নোটিফিকেশনের ধরন অনুযায়ী আলাদা অন/অফ — মাস্টার টগল অন থাকলেই শুধু এগুলো কাজ করে
  const [examNotifEnabled, setExamNotifEnabled] = useState(() => { try { return window.localStorage.getItem("focusgo_notif_exam") !== "0"; } catch (e) { return true; } });
  useEffect(() => { try { window.localStorage.setItem("focusgo_notif_exam", examNotifEnabled ? "1" : "0"); } catch (e) {} }, [examNotifEnabled]);
  const [taskNotifEnabled, setTaskNotifEnabled] = useState(() => { try { return window.localStorage.getItem("focusgo_notif_task") !== "0"; } catch (e) { return true; } });
  useEffect(() => { try { window.localStorage.setItem("focusgo_notif_task", taskNotifEnabled ? "1" : "0"); } catch (e) {} }, [taskNotifEnabled]);
  const [salahNotifEnabled, setSalahNotifEnabled] = useState(() => { try { return window.localStorage.getItem("focusgo_notif_salah") !== "0"; } catch (e) { return true; } });
  useEffect(() => { try { window.localStorage.setItem("focusgo_notif_salah", salahNotifEnabled ? "1" : "0"); } catch (e) {} }, [salahNotifEnabled]);
  const [timerNotifEnabled, setTimerNotifEnabled] = useState(() => { try { return window.localStorage.getItem("focusgo_notif_timer") !== "0"; } catch (e) { return true; } });
  useEffect(() => { try { window.localStorage.setItem("focusgo_notif_timer", timerNotifEnabled ? "1" : "0"); } catch (e) {} }, [timerNotifEnabled]);
  const [alarmNotifEnabled, setAlarmNotifEnabled] = useState(() => { try { return window.localStorage.getItem("focusgo_notif_alarm") !== "0"; } catch (e) { return true; } });
  useEffect(() => { try { window.localStorage.setItem("focusgo_notif_alarm", alarmNotifEnabled ? "1" : "0"); } catch (e) {} }, [alarmNotifEnabled]);
  // সপ্তাহ কোন দিন থেকে শুরু হবে — ক্যালেন্ডার গ্রিড ও উইকলি ভিউ সব জায়গায় প্রযোজ্য, Settings থেকে বদলানো যায়
  // (React state হিসেবে রাখা হয়েছে যাতে Settings-এ বদলালে সাথে সাথে পুরো অ্যাপ রি-রেন্ডার হয়ে নতুন মান দেখায়)
  const [weekStartDay, setWeekStartDayState] = useState(getWeekStartDay);
  const changeWeekStartDay = (v) => { setWeekStartDay(v); setWeekStartDayState(v); };
  // skipNative: Focus Timer-এর session/break/topic-done ইভেন্টগুলোর জন্য OS notification
  // আগে থেকেই scheduleTimerEndNotif দিয়ে শিডিউল করা থাকে, তাই এখানে আবার একই নোটিফিকেশন
  // পাঠালে ডুপ্লিকেট হয়ে যাবে — সেসব কল-সাইট থেকে skipNative=true পাঠানো হয়।
  const pushNotification = (title, body, flagKey, skipNative) => {
    if (flagKey) {
      if (notifiedFlagsRef.current[flagKey]) return;
      notifiedFlagsRef.current[flagKey] = true;
      saveNotifiedFlags();
    }
    setNotifications(prev => [{ id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, title, body, time: new Date().toISOString(), read: false }, ...prev].slice(0, 50));
    // in-app bell-এর পাশাপাশি একটা আসল OS (system tray) notification-ও পাঠানো হচ্ছে,
    // যাতে অ্যাপ ব্যাকগ্রাউন্ডে/মিনিমাইজড থাকলেও ইউজার নোটিফিকেশনটা দেখতে পায়।
    if (!skipNative && notificationsEnabled && Capacitor.isNativePlatform()) {
      const nid = strToNotifId(flagKey || `${title}_${Date.now()}`);
      LocalNotifications.schedule({
        notifications: [{ id: nid, title, body, schedule: { at: new Date(Date.now() + 500) } }],
      }).catch(() => {});
    }
  };
  const [examMonth, setExamMonth] = useState(new Date());
  const [showExams, setShowExams] = useState(false);
  const [showCombinedExamEditor, setShowCombinedExamEditor] = useState(false);
  const [editingCombinedExam, setEditingCombinedExam] = useState(null); // {id, name, type, subjects} | null when adding new
  const [showNextExamEditor, setShowNextExamEditor] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addTargetKey, setAddTargetKey] = useState(null);
  const [showSubjects, setShowSubjects] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // Universal search — টাস্ক/নোট/সাবজেক্ট/পরীক্ষা একসাথে খোঁজার মডাল
  // Today ট্যাবের search bar-এর sliders আইকন — ট্যাপ করলে sort অপশন মেনু খোলে, নির্বাচিত sort mode
  // Universal Search Modal-এর টাস্ক রেজাল্ট সাজাতে ব্যবহার হয় (localStorage-এ সেভ থাকে)
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchSortMode, setSearchSortMode] = useState(() => {
    try { return window.localStorage.getItem("focusgo_search_sort_mode") || "date"; } catch (e) { return "date"; }
  });
  const changeSearchSortMode = (m) => {
    setSearchSortMode(m);
    try { window.localStorage.setItem("focusgo_search_sort_mode", m); } catch (e) {}
  };
  const [showAllSubjectsProgress, setShowAllSubjectsProgress] = useState(false); // Stats-এ Subject Progress গ্রিড — সাবজেক্ট বেশি হলে ডিফল্টে ৬টা দেখায়, "See all" চাপলে বাকিগুলো
  const [statsRange, setStatsRange] = useState("week"); // "week" | "month" — Stats কার্ডের "This Week/This Month" ড্রপডাউন সিলেকশন
  const [showStatsRangeMenu, setShowStatsRangeMenu] = useState(false);
  const [planDate, setPlanDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; });
  // Plan tab-এর "Next N Days" strip কতদিন দেখাবে — 7/15/30/60/90, পছন্দ localStorage-এ মনে থাকে
  const [planRange, setPlanRange] = useState(() => {
    try { const saved = parseInt(window.localStorage.getItem("focusgo_plan_range"), 10); return [7,15,30,60,90].includes(saved) ? saved : 7; } catch (e) { return 7; }
  });
  useEffect(() => {
    try { window.localStorage.setItem("focusgo_plan_range", String(planRange)); } catch (e) {}
  }, [planRange]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // হেডারের প্রোফাইল আইকনে ক্লিক করলে এখন সরাসরি Settings-পেজের মতোই ডিজাইন (প্রোফাইল কার্ড + Preferences)
  // একটা আলাদা ফুল-পেজ হিসেবে খোলে — কিন্তু নিচে ৫-ট্যাব বার ছাড়া, উপরে একটা ব্যাক বাটন সহ
  const [showProfilePage, setShowProfilePage] = useState(false);
  // ফোনের ব্যাক বাটন/জেসচার দিয়ে এই ফুল-স্ক্রিন ওভারলে বন্ধ করা যাবে (ব্রাউজার/PWA কনটেক্সটেও)
  useBackableOverlay(showProfilePage, () => setShowProfilePage(false));
  // উপরের gear আইকনে ক্লিক করলে এখন সরাসরি Settings পেজে না গিয়ে একটা ছোট quick-menu popup খোলে,
  // সেখান থেকে যে আইটেমে ক্লিক করা হয় সেই অনুযায়ী Settings পেজ নির্দিষ্ট সেকশন expand করে খোলে
  // (initialOpenCard), অথবা Export/Import/About/Help এর ক্ষেত্রে সেই একশনটা সরাসরি ট্রিগার হয়
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  // বটম নেভের পাশে ভাসমান "+" বাটনের quick-add popup (Study/Task সরাসরি Add করার শর্টকাট)
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);
  const [settingsInitialOpenCard, setSettingsInitialOpenCard] = useState(null);
  const [settingsInitialAction, setSettingsInitialAction] = useState(null);
  const handleSettingsMenuSelect = (key) => {
    setShowSettingsMenu(false);
    if (key === "profile" || key === "backup") { setShowProfile(true); return; }
    if (key === "help") { try { window.location.href = `mailto:mazharul.mrf@gmail.com?subject=${encodeURIComponent(t.feedbackSubject)}`; } catch (e) {} return; }
    const cardMap = { appearance: "appearance", weekStart: "weekStart", timer: "timer", reminders: "reminders", visibleTabs: "visibleTabs", notifications: "notifications" };
    const actionMap = { export: "export", import: "import", about: "about" };
    setSettingsInitialOpenCard(cardMap[key] || null);
    setSettingsInitialAction(actionMap[key] || null);
    setShowProfilePage(true);
  };
  // ডেস্কটপ সাইডবার collapse/expand করা যায় কিনা — চাইলে ইউজার লুকিয়ে রাখতে পারবে,
  // পছন্দটা localStorage-এ থেকে যায় (রিফ্রেশ করলেও মনে থাকবে)।
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return window.localStorage.getItem("focusgo_sidebar_collapsed") === "1"; } catch (e) { return false; }
  });
  useEffect(() => {
    try { window.localStorage.setItem("focusgo_sidebar_collapsed", sidebarCollapsed ? "1" : "0"); } catch (e) {}
  }, [sidebarCollapsed]);
  // ডেস্কটপ সাইডবার সম্পূর্ণ hide/unhide করার অপশন — collapse (icon-only) থেকে আলাদা,
  // এটা সাইডবারটাকে পুরোপুরি সরিয়ে দেয়, শুধু ছোট একটা "show" বাটন থেকে যায়।
  const [sidebarHidden, setSidebarHidden] = useState(() => {
    try { return window.localStorage.getItem("focusgo_sidebar_hidden") === "1"; } catch (e) { return false; }
  });
  useEffect(() => {
    try { window.localStorage.setItem("focusgo_sidebar_hidden", sidebarHidden ? "1" : "0"); } catch (e) {}
  }, [sidebarHidden]);
  const [calMonth, setCalMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [weekStripDay, setWeekStripDay] = useState(() => new Date());
  const [statsMonthDay, setStatsMonthDay] = useState(() => new Date()); // shared "selected day" for the whole Stats tab (week strip + month grid)
  const [statsCalMonth, setStatsCalMonth] = useState(() => new Date());
  // Weekly/Monthly topic summary (Stats tab) — নেভিগেশন অ্যাংকর, ডিফল্টে সর্বশেষ সম্পূর্ণ হওয়া সপ্তাহ/মাস দেখানো হয়
  const [summaryWeekAnchor, setSummaryWeekAnchor] = useState(() => { const d = new Date(); d.setDate(d.getDate()-7); return d; });
  const [summaryMonthAnchor, setSummaryMonthAnchor] = useState(() => { const d = new Date(); d.setMonth(d.getMonth()-1); return d; });
  const [timerTopicId, setTimerTopicId] = useState(null);
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [showFocusQuickSettings, setShowFocusQuickSettings] = useState(false); // ব্ল্যাক-থিম টাইমার কার্ডে ডানপাশের "Focus" (sliders) বাটনে কুইক ডিউরেশন সেটিংস
  const [freeSessionTouched, setFreeSessionTouched] = useState(false); // Free Session pill explicitly click না করা পর্যন্ত duration presets দেখানো হয় না
  const [timerSeconds, setTimerSeconds] = useState(30*60);
  const [timerTotal, setTimerTotal] = useState(30*60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [editingDuration, setEditingDuration] = useState(false);
  const [durationInput, setDurationInput] = useState("");
  const [focusMode, setFocusMode] = useState("timer"); // "timer" | "stopwatch"
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [lapTimes, setLapTimes] = useState([]); // Stopwatch mode-এর Lap লিস্ট — Reset হলে খালি হয়ে যায়
  const [focusFullscreen, setFocusFullscreen] = useState(false);
  const [showFocusTimerPage, setShowFocusTimerPage] = useState(false); // নতুন ফুল-স্ক্রিন Focus Timer পেজ (Timer/Stopwatch, রিং, Session Goal) — এটাই এখন টাইমার শুরু করলে দেখা যায়; পুরনো কালো ইমার্সিভ ক্লক (FullscreenFocus) এই পেজের ভেতরের expand আইকন থেকে খোলা যায়
  const focusFullscreenActiveRef = useRef(false); // popstate হ্যান্ডলারের ভেতর থেকে সবসময় সবশেষ ফুলস্ক্রিন অবস্থা জানার জন্য
  // ---- White Noise: পছন্দ localStorage-এ থেকে যায়, টাইমার/স্টপওয়াচ চললেই ব্যাকগ্রাউন্ডে বাজে ----
  const [whiteNoiseSound, setWhiteNoiseSound] = useState(() => { try { return window.localStorage.getItem("focusgo_white_noise") || "none"; } catch (e) { return "none"; } });
  const [whiteNoiseVolume, setWhiteNoiseVolume] = useState(() => { try { const v = Number(window.localStorage.getItem("focusgo_white_noise_vol")); return Number.isFinite(v) && v > 0 ? v : 0.5; } catch (e) { return 0.5; } });
  const [showWhiteNoisePicker, setShowWhiteNoisePicker] = useState(false);
  useEffect(() => { try { window.localStorage.setItem("focusgo_white_noise", whiteNoiseSound); } catch (e) {} }, [whiteNoiseSound]);
  useEffect(() => { try { window.localStorage.setItem("focusgo_white_noise_vol", String(whiteNoiseVolume)); } catch (e) {} }, [whiteNoiseVolume]);
  useWhiteNoise(whiteNoiseSound, whiteNoiseVolume, timerRunning || stopwatchRunning);

  // ---- Strict Mode: টাইমার/স্টপওয়াচ চলাকালীন অ্যাপ ছেড়ে গেলে ধরা পড়বে এবং একটা গ্রেস-পিরিয়ডের মধ্যে
  // না ফিরলে সেশনটা ফেইল ধরে রিসেট হয়ে যাবে। কোনো OS-level "app block" সম্ভব না (Android/iOS পারমিশন দেয় না),
  // তাই এই approach-টাই বাস্তবসম্মত: ছেড়ে যাওয়াটাকে costly করে তোলা। ----
  const STRICT_GRACE_SECONDS = 15;
  const [strictModeEnabled, setStrictModeEnabled] = useState(() => { try { return window.localStorage.getItem("focusgo_strict_mode") === "1"; } catch (e) { return false; } });
  useEffect(() => { try { window.localStorage.setItem("focusgo_strict_mode", strictModeEnabled ? "1" : "0"); } catch (e) {} }, [strictModeEnabled]);
  const [strictGraceLeft, setStrictGraceLeft] = useState(null); // null = away নয় / গ্রেস চলছে না; সংখ্যা হলে বাকি সেকেন্ড
  const todayKeyStr = () => new Date().toISOString().slice(0, 10);
  const [distractionCount, setDistractionCount] = useState(() => {
    try { return Number(window.localStorage.getItem("focusgo_distractions_" + todayKeyStr())) || 0; } catch (e) { return 0; }
  });
  const strictActive = strictModeEnabled && (timerRunning || stopwatchRunning);
  const strictAwaySinceRef = useRef(null);

  const failStrictSession = () => {
    setStrictGraceLeft(null);
    strictAwaySinceRef.current = null;
    vibrate(30);
    if (focusMode === "timer") { setTimerRunning(false); setTimerSeconds(timerTotal); }
    else { setStopwatchRunning(false); setStopwatchSeconds(0); setLapTimes([]); }
    setDistractionCount(c => {
      const next = c + 1;
      try { window.localStorage.setItem("focusgo_distractions_" + todayKeyStr(), String(next)); } catch (e) {}
      return next;
    });
    pushNotification(
      lang === "bn" ? "সেশন ফেইল হয়েছে" : "Session failed",
      lang === "bn" ? "স্ট্রিক্ট মোডে ফোকাস ভেঙে যাওয়ায় সেশনটি বাতিল হয়ে গেছে" : "You left the app in Strict Mode — this session was cancelled",
      null
    );
  };

  // অ্যাপ minimize/tab-switch/অন্য অ্যাপে গেলে ডিটেক্ট করা — ওয়েবে visibilitychange, নেটিভে Capacitor App plugin
  useEffect(() => {
    if (!strictActive) { strictAwaySinceRef.current = null; setStrictGraceLeft(null); return; }
    const onLeave = () => {
      if (strictAwaySinceRef.current) return; // already tracking
      strictAwaySinceRef.current = Date.now();
      setStrictGraceLeft(STRICT_GRACE_SECONDS);
      pushNotification(
        lang === "bn" ? "সেশন বিপদে!" : "Session at risk!",
        lang === "bn" ? `${STRICT_GRACE_SECONDS} সেকেন্ডের মধ্যে না ফিরলে সেশন ফেইল হবে` : `Return within ${STRICT_GRACE_SECONDS}s or the session will fail`,
        null
      );
    };
    const onReturn = () => {
      if (!strictAwaySinceRef.current) return;
      strictAwaySinceRef.current = null;
      setStrictGraceLeft(null); // সময়মতো ফিরে এসেছে — গ্রেস কাউন্টডাউন বাতিল
    };
    const onVisibility = () => { if (document.hidden) onLeave(); else onReturn(); };
    document.addEventListener("visibilitychange", onVisibility);

    let capListenerHandle = null;
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener("appStateChange", ({ isActive }) => { if (!isActive) onLeave(); else onReturn(); })
        .then(h => { capListenerHandle = h; });
    }
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      capListenerHandle && capListenerHandle.remove();
    };
  }, [strictActive, lang]);

  // গ্রেস কাউন্টডাউন টিকার — ০-তে পৌঁছালে সেশন ফেইল
  useEffect(() => {
    if (strictGraceLeft === null) return;
    if (strictGraceLeft <= 0) { failStrictSession(); return; }
    const id = setTimeout(() => setStrictGraceLeft(s => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strictGraceLeft]);

  // ব্রাউজারে ট্যাব বন্ধ/রিফ্রেশ করলে সতর্ক করা (ওয়েব ডিপ্লয়মেন্টে "কঠিন করে তোলার" আরেকটা স্তর)
  useEffect(() => {
    if (!strictActive) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [strictActive]);
  const pushedFocusHistoryRef = useRef(false); // ফুলস্ক্রিন টাইমার খোলার সময় history-তে state push করেছি কিনা
  const [editTopic, setEditTopic] = useState(null);
  // ---- Pomodoro: session type (focus/break), remembered durations, and cycle progress ----
  const [sessionType, setSessionType] = useState("focus"); // "focus" | "break"
  const [focusMinutes, setFocusMinutes] = useState(() => { try { return Number(window.localStorage.getItem("focusgo_default_focus_min")) || 30; } catch (e) { return 30; } }); // last-selected Focus duration (minutes)
  const [breakMinutes, setBreakMinutes] = useState(() => { try { return Number(window.localStorage.getItem("focusgo_default_break_min")) || 5; } catch (e) { return 5; } }); // last-selected Break duration (minutes)
  useEffect(() => { try { window.localStorage.setItem("focusgo_default_focus_min", String(focusMinutes)); } catch (e) {} }, [focusMinutes]);
  useEffect(() => { try { window.localStorage.setItem("focusgo_default_break_min", String(breakMinutes)); } catch (e) {} }, [breakMinutes]);
  const [pomodoroSession, setPomodoroSession] = useState(1); // current Focus session number, 1..pomodoroTotalSessions
  const [pomodoroTotalSessions, setPomodoroTotalSessions] = useState(4); // সাধারণ ফ্রি সেশনে ৪, টপিক-লিঙ্কড মাল্টি-সেশনে dynamic (ceil(target/chunk))
  const TOPIC_SESSION_CHUNK_MIN = 30; // টপিক থেকে টাইমার শুরু করলে প্রতিটি ফোকাস সেশনের ডিফল্ট দৈর্ঘ্য (মিনিট) — ৩০ মিনিটের বেশি হলে একাধিক সেশনে ভাগ হয়ে যাবে
  const [timerTargetMinutes, setTimerTargetMinutes] = useState(null); // টপিক-লিঙ্কড মাল্টি-সেশন চললে মোট টার্গেট মিনিট, নাহলে null (ফ্রি সেশন — পুরনো আচরণ)
  const [timerElapsedMinutes, setTimerElapsedMinutes] = useState(0); // এই টপিকের জন্য এ পর্যন্ত সম্পন্ন হওয়া ফোকাস মিনিট (target-এর বিপরীতে)
  const [showBreakPrompt, setShowBreakPrompt] = useState(false); // "Focus complete — take a break?" prompt

  // ---- Android হার্ডওয়্যার ব্যাক বাটন ----
  // ক্রম: প্রথমে যদি কোনো মোডাল/ওভারলে খোলা থাকে সেটা বন্ধ হবে; কিছু খোলা না থাকলে আর "Today" ছাড়া অন্য
  // ট্যাবে থাকলে সরাসরি "Today" ট্যাবে ফিরে যাবে; "Today" ট্যাবে থেকেও কিছু খোলা না থাকলে একবার ব্যাক চাপলে
  // অ্যাপ বন্ধ হবে না (শুধু টোস্ট দেখাবে), ২ সেকেন্ডের মধ্যে দ্বিতীয়বার চাপলে তবেই অ্যাপ বন্ধ হবে।
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const listenerPromise = CapacitorApp.addListener("backButton", () => {
      if (focusFullscreen) {
        if (strictActive) {
          const leave = window.confirm(
            lang === "bn"
              ? "স্ট্রিক্ট মোড চালু আছে। এখন বের হলে সেশনটি ফেইল ধরা হবে। আপনি কি নিশ্চিত?"
              : "Strict Mode is on. Leaving now will fail this session. Are you sure?"
          );
          if (!leave) return;
          failStrictSession();
        }
        setFocusFullscreen(false);
        return;
      }
      if (showFocusTimerPage) { setShowFocusTimerPage(false); return; }
      if (showSearch) { setShowSearch(false); return; }
      if (taskDetailId) { setTaskDetailId(null); return; }
      if (showAddTask || editingTask) { setShowAddTask(false); setEditingTask(null); return; }
      if (selectedDay) { setSelectedDay(null); return; }
      if (showCombinedExamEditor) { setShowCombinedExamEditor(false); setEditingCombinedExam(null); return; }
      if (showNextExamEditor) { setShowNextExamEditor(false); return; }
      if (showManageTopicsFor) { setShowManageTopicsFor(null); return; }
      if (showExamSchedule) { setShowExamSchedule(false); return; }
      if (showExams) { setShowExams(false); return; }
      if (showAdd) { setShowAdd(false); return; }
      if (showSubjects) { setShowSubjects(false); return; }
      if (showAllSubjectsProgress) { setShowAllSubjectsProgress(false); return; }
      if (showCalendar) { setShowCalendar(false); return; }
      if (showProfile) { setShowProfile(false); return; }
      if (showProfilePage) { setShowProfilePage(false); return; }
      if (showTopicPicker) { setShowTopicPicker(false); return; }
      if (showBreakPrompt) { setShowBreakPrompt(false); return; }
      if (tab !== "today") { setTab("today"); return; }
      if (exitToastTimerRef.current) {
        clearTimeout(exitToastTimerRef.current);
        exitToastTimerRef.current = null;
        setShowExitToast(false);
        CapacitorApp.exitApp();
      } else {
        setShowExitToast(true);
        exitToastTimerRef.current = setTimeout(() => {
          setShowExitToast(false);
          exitToastTimerRef.current = null;
        }, 2000);
      }
    });
    return () => { listenerPromise.then(h => h.remove()); };
  }, [
    tab, focusFullscreen, showFocusTimerPage, taskDetailId, showAddTask, editingTask, selectedDay,
    showCombinedExamEditor, showNextExamEditor, showManageTopicsFor, showExamSchedule,
    showExams, showAdd, showSubjects, showAllSubjectsProgress, showCalendar,
    showProfile, showProfilePage, showTopicPicker, showBreakPrompt, showSearch, strictActive, lang,
  ]);

  const timerRef = useRef(null);
  const stopwatchRef = useRef(null);
  const timerEndAtRef = useRef(null);
  const stopwatchStartAtRef = useRef(null);
  // refs so the running timer's tick() always sees the latest values without restarting the interval
  const sessionTypeRef = useRef(sessionType);
  useEffect(() => { sessionTypeRef.current = sessionType; }, [sessionType]);
  const pomodoroSessionRef = useRef(pomodoroSession);
  useEffect(() => { pomodoroSessionRef.current = pomodoroSession; }, [pomodoroSession]);
  const pomodoroTotalSessionsRef = useRef(pomodoroTotalSessions);
  useEffect(() => { pomodoroTotalSessionsRef.current = pomodoroTotalSessions; }, [pomodoroTotalSessions]);
  const timerTargetMinutesRef = useRef(timerTargetMinutes);
  useEffect(() => { timerTargetMinutesRef.current = timerTargetMinutes; }, [timerTargetMinutes]);
  const timerElapsedMinutesRef = useRef(timerElapsedMinutes);
  useEffect(() => { timerElapsedMinutesRef.current = timerElapsedMinutes; }, [timerElapsedMinutes]);
  const timerTopicIdRef = useRef(null);
  useEffect(() => { timerTopicIdRef.current = timerTopicId; }, [timerTopicId]);
  const focusMinutesRef = useRef(focusMinutes);
  useEffect(() => { focusMinutesRef.current = focusMinutes; }, [focusMinutes]);
  const breakMinutesRef = useRef(breakMinutes);
  useEffect(() => { breakMinutesRef.current = breakMinutes; }, [breakMinutes]);
  const audioCtxRef = useRef(null);
  const compressorRef = useRef(null);
  const guestLoadedOnceRef = useRef(false); // এই গেস্ট সেশনে localStorage থেকে একবারই লোড হবে
  // "loaded" শুধু UI-তে splash/loading screen সরানোর জন্য (cache থেকে instant দেখাতে ব্যবহার হয়) —
  // কিন্তু Firestore-এ write করার অনুমতি এই flag দিয়ে দিলে বিপদ: cache-এ যদি পুরনো/ফাঁকা data থাকে
  // এবং Firestore থেকে আসল data আসতে দেরি হয় (স্লো নেটওয়ার্ক), তাহলে সেই stale cache-ই আগে
  // Firestore-এ লেখা হয়ে যায় ও আসল data (অন্য device-এ যোগ করা subjects ইত্যাদি) overwrite/মুছে ফেলে।
  // তাই write-permission-এর জন্য আলাদা flag — যেটা শুধু Firestore থেকে confirm আসার পরেই true হয়।
  const [serverSynced, setServerSynced] = useState(false);
  // এখান দিয়ে আমরা নিজেরা সবশেষ কী data Firestore-এ লিখেছি সেটা মনে রাখা হয় —
  // এটা না থাকলে: নিজে write করি → সাথে সাথে নিজেরই সেই write-এর "echo" real-time listener-এ ফিরে আসে
  // → আবার setState → আবার auto-save effect ট্রিগার → আবার write... (অপ্রয়োজনীয় লুপ)।
  // Real-time listener থেকে data এলে সেটা এই ref-এর সাথে মিলিয়ে দেখা হয়; মিললে সেটা আমাদেরই echo,
  // তাই আবার setState/re-save করার দরকার নেই। না মিললে সেটা অন্য device থেকে আসা আসল পরিবর্তন — সাথে সাথে UI-তে বসিয়ে দেওয়া হয়।
  const lastSavedPayloadRef = useRef(null);
  const skipNextWriteRef = useRef(false); // Firestore snapshot থেকে আসা ডেটা লোকাল state-এ বসানোর পরপরই যেন সেটা আবার Firestore-এ write-back না হয় (echo/race safety)
  const hadServerDataRef = useRef(false); // এই ইউজারের Firestore-এ কখনো real (খালি নয়) ডেটা দেখা গেছে কিনা — accidental wipe আটকাতে ব্যবহার হয়
  const pendingLocalWriteRef = useRef(false); // local এ change হয়েছে কিন্তু এখনো Firestore-এ সেভ হয়নি — এই অবস্থায় onSnapshot থেকে আসা পুরনো ডেটা যেন fresher local change (যেমন ট্র্যাশ ডিলিট) ওভাররাইট করে না দেয়, তাই এই flag থাকা অবস্থায় incoming snapshot ignore করা হয়
  // থিম/ভাষা ব্যাকগ্রাউন্ডে (Firestore/cache থেকে) শুধু সেশনের প্রথমবার লোড হবে —
  // এরপর ইউজার Settings থেকে যা বদলায় তা যেন token-refresh বা re-sync-এ চুপচাপ পুরনো
  // মান দিয়ে ওভাররাইট না হয়ে যায় (এটাই "Light সিলেক্ট করলেও Dark-ই থেকে যায়" বাগের কারণ ছিল)
  const themeLoadedOnceRef = useRef(false);

  // ---- অফলাইন সাপোর্ট (ওয়েব-অনলি) ----
  // navigator.onLine + online/offline ইভেন্ট দিয়ে নেট আছে কিনা ট্র্যাক করা হয়, যাতে ইউজারকে ছোট একটা
  // ব্যাজ দেখানো যায় ("অফলাইন — ডেটা পরে sync হবে")। ডেটা নিজে (Firestore) অফলাইনে কাজ করার জন্য
  // enableIndexedDbPersistence() লাগবে real firebase.js ফাইলে — এই preview mock-এ সেটা প্রযোজ্য না,
  // নিচের কমেন্টে ঠিক কী করতে হবে লেখা আছে।
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => { window.removeEventListener("online", goOnline); window.removeEventListener("offline", goOffline); };
  }, []);

  // অ্যাপ শেল (HTML/JS/CSS) অফলাইনে লোড হওয়ার জন্য একটা Service Worker রেজিস্টার করা —
  // এটা শুধু static asset ক্যাশিং করে, কোনো "Add to Home Screen"/install prompt দেখায় না (manifest নেই বলে)।
  // /public/sw.js ফাইলটা আলাদাভাবে যোগ করতে হবে (এই কম্পোনেন্ট ফাইলে না) — নিচের নোট দেখো।
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // sw.js ফাইল না থাকলে বা রেজিস্ট্রেশন ব্যর্থ হলে চুপচাপ ignore — অ্যাপ স্বাভাবিকভাবেই চলবে, শুধু অফলাইন ক্যাশিং কাজ করবে না
    });
  }, []);

  // Lightweight beep generator (Web Audio API) — no external sound files needed.
  // একটা DynamicsCompressor বসানো হয়েছে যাতে gain 1.0-এর কাছাকাছি নিলেও সাউন্ড ক্লিপ/ক্র্যাক না করে,
  // আর প্রতিটা বিপে দুইটা oscillator (মূল টোন + এক অক্টেভ নিচে সাব-টোন) লেয়ার করা — শুধু "জোরে" না, "ভরাট" শোনাবে বলে কানে বেশি জোরে মনে হয়।
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(()=>{});
    }
    return audioCtxRef.current;
  };
  const getCompressor = (ctx) => {
    if (!compressorRef.current) {
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.knee.value = 12;
      comp.ratio.value = 8;
      comp.attack.value = 0.002;
      comp.release.value = 0.15;
      comp.connect(ctx.destination);
      compressorRef.current = comp;
    }
    return compressorRef.current;
  };
  const beep = (freq = 880, duration = 0.16, when = 0, volume = 1) => {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const out = getCompressor(ctx);
      // মূল টোন
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + when);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + when + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + duration);
      osc.connect(gain);
      gain.connect(out);
      osc.start(ctx.currentTime + when);
      osc.stop(ctx.currentTime + when + duration + 0.04);
      // এক অক্টেভ নিচের সাব-টোন — ভরাট/জোরে শোনানোর জন্য
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.value = freq / 2;
      gain2.gain.setValueAtTime(0.0001, ctx.currentTime + when);
      gain2.gain.exponentialRampToValueAtTime(volume * 0.55, ctx.currentTime + when + 0.008);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + duration);
      osc2.connect(gain2);
      gain2.connect(out);
      osc2.start(ctx.currentTime + when);
      osc2.stop(ctx.currentTime + when + duration + 0.04);
    } catch (e) { /* audio unsupported or blocked — fail silently */ }
  };
  const playStartSound = () => beep(880, 0.18, 0, 1);
  const playEndSound = () => { beep(659, 0.2, 0, 1); beep(880, 0.2, 0.18, 1); beep(1046, 0.34, 0.36, 1); };

  // ফোকাস টাইমার ফুলস্ক্রিন হলে ব্রাউজারের Fullscreen API + Screen Orientation API
  // ব্যবহার করে অরিয়েন্টেশন "unlock" করে দেওয়া হয় — এতে ফোনের OS-এ auto-rotate বন্ধ
  // থাকলেও শুধু এই ফুলস্ক্রিন ভিউ-তে ফোন ঘোরালে স্ক্রিন ঘুরে যাবে (ল্যান্ডস্কেপে ক্লক-ও
  // বড় হয়ে দেখাবে, কারণ ক্লকের সাইজ vw-ভিত্তিক)। বন্ধ করলে আবার স্বাভাবিক অবস্থায় ফিরে আসে।
  useEffect(() => {
    // নেটিভ অ্যাপে (Capacitor) ব্রাউজারের Screen Orientation API-এর বদলে @capacitor/screen-orientation
    // প্লাগিন ব্যবহার করা হচ্ছে — এটা সরাসরি Android Activity-র requestedOrientation সেট করে, তাই
    // ফোনের সিস্টেম "Auto-rotate" টগল বন্ধ থাকলেও শুধু এই ফুলস্ক্রিন ফোকাস টাইমার স্ক্রিনে ফোন কাত
    // করলে ক্লক ঘুরে যাবে (landscape/portrait দুটোতেই)। বন্ধ করলে আবার অ্যাপের normal portrait লক ফিরে আসে।
    if (Capacitor.isNativePlatform()) {
      if (focusFullscreen) {
        ScreenOrientation.unlock().catch(() => {});
      } else {
        ScreenOrientation.lock({ orientation: "portrait" }).catch(() => {});
      }
    }
    const el = document.documentElement;
    if (focusFullscreen) {
      const reqFs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
      const lockOrientation = () => {
        if (Capacitor.isNativePlatform()) return; // নেটিভে উপরের ScreenOrientation প্লাগিনই যথেষ্ট
        try {
          // Chrome (regular, non-installed tab)-এ lock("any") ব্যর্থ হয়ে fullscreen-এর
          // orientation ফ্রিজ করে রাখে, তাই Chrome-এর ক্ষেত্রে regular ট্যাবে এটা স্কিপ
          // করে ডিভাইসের normal OS auto-rotate-এর উপর ছেড়ে দেওয়া হচ্ছে। অন্য ব্রাউজারে
          // (Firefox, Samsung Internet, Edge, Opera ইত্যাদি) এই সমস্যা না থাকায় সেগুলোতে
          // সবসময় lock() ট্রাই করা হচ্ছে যাতে OS auto-rotate বন্ধ থাকলেও rotate করা যায়।
          const ua = navigator.userAgent || "";
          const isChrome = /Chrome\//i.test(ua) && !/Edg\/|OPR\/|SamsungBrowser\//i.test(ua);
          const skip = isChrome && !isStandaloneApp();
          if (skip) return;
          if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
            window.screen.orientation.lock("any").catch(() => {});
          } else if (window.screen && window.screen.lockOrientation) {
            window.screen.lockOrientation("any");
          } else if (window.screen && window.screen.mozLockOrientation) {
            window.screen.mozLockOrientation("any");
          } else if (window.screen && window.screen.msLockOrientation) {
            window.screen.msLockOrientation("any");
          }
        } catch (e) { /* orientation lock unsupported — ignore */ }
      };
      if (reqFs) {
        const result = reqFs.call(el);
        if (result && result.then) result.then(lockOrientation).catch(() => {});
        else lockOrientation();
      } else {
        lockOrientation();
      }
    } else {
      try {
        if (window.screen && window.screen.orientation && window.screen.orientation.unlock) {
          window.screen.orientation.unlock();
        }
      } catch (e) { /* ignore */ }
      const exitFs = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
      if (document.fullscreenElement && exitFs) {
        exitFs.call(document).catch(() => {});
      }
      // ফুলস্ক্রিন থেকে বের হওয়ার পর মোবাইল ব্রাউজারে address bar ফিরে আসার সময়
      // viewport height রিক্যালকুলেট হয়, কিন্তু page-এর scroll position পুরনো
      // মান থেকে যাওয়ায় Study ট্যাবের উপরে ফাঁকা জায়গা দেখা যাচ্ছিল আর পুরো
      // কনটেন্ট নিচে নেমে যাচ্ছিল — তাই এক্সিট করার পর জোর করে scroll top-এ
      // রিসেট করা হচ্ছে (address bar animation শেষ হওয়ার সময় দেওয়ার জন্য দুইবার)।
      requestAnimationFrame(() => window.scrollTo(0, 0));
      setTimeout(() => window.scrollTo(0, 0), 350);
    }
  }, [focusFullscreen]);

  useEffect(() => { focusFullscreenActiveRef.current = focusFullscreen; }, [focusFullscreen]);

  // ফুলস্ক্রিন টাইমার খোলার সময় history-তে একটা state push করা হয়, যাতে হার্ডওয়্যার/ব্রাউজার
  // ব্যাক বাটনে পুরো অ্যাপ থেকে বের না হয়ে শুধু ফুলস্ক্রিন বন্ধ হয়ে যায়। যেহেতু ছোট টাইমার
  // widget শুধু Study ট্যাবেই আছে (Today ট্যাবে টাইমার চলাকালীন খুঁজে পাওয়া যায় না), ব্যাক
  // চাপলে বা "✕" চাপলে — যেখান থেকেই শুরু হোক না কেন — সবসময় Study ট্যাবে নিয়ে যাওয়া হয়,
  // যাতে ইউজার সবসময় জানে চলমান টাইমারটা কোথায় খুঁজে পাবে।
  useEffect(() => {
    if (focusFullscreen) {
      window.history.pushState({ fgFocusTimer: true }, "");
      pushedFocusHistoryRef.current = true;
    }
  }, [focusFullscreen]);

  useEffect(() => {
    const onPop = () => {
      if (focusFullscreenActiveRef.current) {
        setFocusFullscreen(false);
        setTab("study");
      }
      pushedFocusHistoryRef.current = false;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const closeFocusTimerPage = () => setShowFocusTimerPage(false);

  const closeFocusFullscreen = () => {
    if (pushedFocusHistoryRef.current) {
      pushedFocusHistoryRef.current = false;
      window.history.back(); // popstate হ্যান্ডলারই setFocusFullscreen(false) + setTab("study") করবে
    } else {
      setFocusFullscreen(false);
      setTab("study");
    }
  };

  // Toggle helpers used by both the mini timer card and the fullscreen view,
  // so the start sound + auto-fullscreen behavior stays consistent everywhere.
  const toggleTimerRunning = () => {
    setTimerRunning(r => {
      const next = !r;
      if (next) { setShowFocusTimerPage(true); playStartSound(); vibrate(); }
      return next;
    });
  };
  const toggleStopwatchRunning = () => {
    setStopwatchRunning(r => {
      const next = !r;
      if (next) { setShowFocusTimerPage(true); playStartSound(); vibrate(); }
      return next;
    });
  };
  const addLap = () => {
    if (!stopwatchRunning) return;
    vibrate();
    setLapTimes(prev => [...prev, stopwatchSeconds]);
  };

  const t = T[lang];
  // Bengali conjuncts (যুক্তাক্ষর) visually break apart under CSS letter-spacing,
  // so only apply the wide "eyebrow label" tracking in English.
  const ls = (px) => (lang === "bn" ? 0 : px);
  const today = new Date();
  const todayKey = dateKey(today);

  // Real Firebase auth state — login/logout changes are handled here
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);

      if (u) {
        setIsGuest(false); // real sign-in — stop treating as guest
        clearGuestData();
        setServerSynced(false); // নতুন user/session — Firestore থেকে confirm না আসা পর্যন্ত write বন্ধ

        // Restore the last known data for THIS Firebase user immediately.
        // Firestore will refresh it in the background, so refresh no longer
        // shows an empty app/loading screen while the network request completes.
        try {
          const raw = window.localStorage.getItem(`focusgo_cache_v2_${u.uid}`);
          if (raw) {
            const cached = JSON.parse(raw);
            if (cached && typeof cached === "object") {
              if (cached.entries) setEntries(cached.entries);
              if (cached.subjects) setSubjects(cached.subjects);
              if (cached.topicBank) setTopicBank(cached.topicBank);
              if (cached.examSubjects) setExamSubjects(cached.examSubjects);
              if (cached.combinedExams) setCombinedExams(cached.combinedExams);
              if (cached.nextExam !== undefined) setNextExam(cached.nextExam);
              if (cached.examSchedule) setExamSchedule(cached.examSchedule);
              // cached.tasks/cached.notes ইচ্ছাকৃতভাবে এখানে সেট করা হয়নি — এই ইউজারের জন্য এখনো কোনো cache
              // তৈরি না হয়ে থাকলে (আপডেটের পর প্রথমবার), init-এ থাকা পুরনো localStorage fallback-টাই থেকে যাবে,
              // এবং নিচের Firestore listener এসে সেটাকেই cloud-এ মাইগ্রেট করে দেবে
              if (cached.tasks) setTasks(cached.tasks);
              if (cached.notes) setNotes(cached.notes);
              if (cached.lang) setLang(cached.lang);
              if (cached.themeMode && !themeLoadedOnceRef.current) { setThemeMode(normalizeThemeMode(cached.themeMode)); themeLoadedOnceRef.current = true; }
              if (cached.accentKey && ACCENT_OPTIONS.some(a => a.key === cached.accentKey)) { setAccentKey(cached.accentKey); }
              if (cached.textScale && TEXT_SCALE_OPTIONS.includes(cached.textScale)) { setTextScale(cached.textScale); }
              setLoaded(true);
            }
          }
        } catch (e) {
          // Ignore broken/old local cache; Firestore remains the source of truth.
        }
        // ক্যাশ থাকুক বা না থাকুক, এখনই UI দেখিয়ে দেওয়া হচ্ছে — নেটওয়ার্ক স্লো হলে বা এই ডিভাইসে
        // এই ইউজারের কোনো cache আগে থেকে না থাকলে (প্রথমবার লগইন) আগে পুরো app Firestore-এর জন্য
        // wait করত, যেটা "app খুলছে কিন্তু data আসতে সময় লাগছে" সমস্যার মূল কারণ ছিল। এখন app সাথে
        // সাথেই খুলে যাবে (ক্যাশ না থাকলে খালি অবস্থা থেকে শুরু), আর নিচের onSnapshot listener ডেটা
        // এলে নিজে থেকেই fill করে দেবে।
        setLoaded(true);
      } else {
        // Sign out — remove the previous user's in-memory data (tasks/notes-ও, নাহলে একই ডিভাইসে
        // অন্য একাউন্টে লগইন করলে আগের ইউজারের টাস্ক/নোট দেখা যাওয়ার ঝুঁকি থাকে)
        setEntries({}); setSubjects([]); setTopicBank({}); setExamSubjects({}); setCombinedExams({}); setNextExam(null); setExamSchedule([]);
        setTasks([]); setNotes([]);
        setLoaded(false);
        setServerSynced(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Native (Android) splash screen — capacitor.config.json-এ SplashScreen.launchAutoHide:false
  // সেট করা আছে, তাই এটা নিজে থেকে সরে না। আগে এটা authChecked (Firebase auth স্টেট জানা হওয়া)
  // পর্যন্ত অপেক্ষা করত, কিন্তু Firebase-এর network round-trip মাঝেমধ্যে ১-২ সেকেন্ড পর্যন্ত সময়
  // নিতে পারে — ততক্ষণ ইউজার শুধু স্ট্যাটিক লোগো দেখতেন, যেটাই "অ্যাপ লোড হতে দেরি হচ্ছে" মনে হওয়ার
  // মূল কারণ। এখন component মাউন্ট হওয়ামাত্রই splash হাইড করা হয় — ততক্ষণে React নিজের
  // "Loading your data…" স্ক্রিন (নিচে "!loaded" ব্লক, একই লোগো ব্যবহার করে) দেখানো শুরু করে দিয়েছে,
  // তাই দুই স্ক্রিনের মধ্যে কোনো ফাঁক/ফ্ল্যাশ চোখে পড়ে না অথচ boot করতে যতটুকু সময় লাগার কথা ঠিক ততটুকুই লাগে।
  useEffect(() => {
    SplashScreen.hide().catch(() => {});
  }, []);

  // গেস্ট মোডে কোনো Firestore লোড নেই। ইনস্টল করা "অ্যাপ" হিসেবে চললে আগের সেভ করা গেস্ট ডেটা (localStorage) থাকলে সেটা লোড করা হয়;
  // ব্রাউজার/ওয়েব ভার্সনে এই ডেটা কখনোই সেভ হয় না, তাই সবসময় ফাঁকা অবস্থা থেকে শুরু হবে।
  useEffect(() => {
    if (isGuest && !user && !guestLoadedOnceRef.current) {
      guestLoadedOnceRef.current = true;
      if (isStandaloneApp()) {
        const saved = loadGuestData();
        if (saved) {
          if (saved.entries) setEntries(saved.entries);
          if (saved.subjects) setSubjects(saved.subjects);
          if (saved.topicBank) setTopicBank(saved.topicBank);
          if (saved.examSubjects) setExamSubjects(saved.examSubjects);
          if (saved.combinedExams) setCombinedExams(saved.combinedExams);
          if (saved.nextExam !== undefined) setNextExam(saved.nextExam);
          if (saved.examSchedule) setExamSchedule(saved.examSchedule);
          if (saved.tasks) setTasks(saved.tasks);
          if (saved.notes) setNotes(saved.notes);
          if (saved.lang) setLang(saved.lang);
          if (saved.themeMode && !themeLoadedOnceRef.current) { setThemeMode(normalizeThemeMode(saved.themeMode)); themeLoadedOnceRef.current = true; }
          if (saved.accentKey && ACCENT_OPTIONS.some(a => a.key === saved.accentKey)) { setAccentKey(saved.accentKey); }
          if (saved.textScale && TEXT_SCALE_OPTIONS.includes(saved.textScale)) { setTextScale(saved.textScale); }
        }
      }
      setLoaded(true);
    }
    if (!isGuest) guestLoadedOnceRef.current = false; // পরের বার গেস্ট মোডে ঢুকলে আবার fresh load হবে
  }, [isGuest, user]);

  // গেস্ট ডেটা বদলালে (debounce করে) শুধু ইনস্টল করা অ্যাপ হিসেবে চললে localStorage-এ সেভ করা —
  // ব্রাউজারে/ওয়েব ভার্সনে এই effect কিছুই সেভ করে না, তাই রিফ্রেশ বা সাইট ছাড়লেই ডেটা হারিয়ে যায়।
  useEffect(() => {
    if (!loaded || user || !isGuest) return;
    if (!isStandaloneApp()) return;
    const timer = setTimeout(() => {
      saveGuestData({ entries, subjects, topicBank, examSubjects, combinedExams, nextExam, examSchedule, tasks, notes, lang, themeMode, accentKey, textScale });
    }, 600);
    return () => clearTimeout(timer);
  }, [entries, subjects, topicBank, examSubjects, combinedExams, nextExam, examSchedule, tasks, notes, lang, themeMode, accentKey, textScale, loaded, user, isGuest]);

  // ইউজার লগইন করার পর Firestore-এর সাথে real-time sync (users/{uid}) —
  // getDoc দিয়ে একবার read করার বদলে onSnapshot দিয়ে live listen করা হয়, তাই অন্য কোনো
  // device-এ data বদলালে এই device-এও app খোলা অবস্থাতেই সাথে সাথে (auto, refresh ছাড়াই) দেখা যাবে।
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        try {
          if (snap.exists()) {
            const data = snap.data();
            const nonEmpty = (data.entries && Object.keys(data.entries).length) ||
              (data.subjects && data.subjects.length) ||
              (data.topicBank && Object.keys(data.topicBank).length) ||
              (data.examSubjects && Object.keys(data.examSubjects).length) ||
              (data.combinedExams && Object.keys(data.combinedExams).length) ||
              (data.examSchedule && data.examSchedule.length) ||
              (data.tasks && data.tasks.length) ||
              (data.notes && data.notes.length);
            if (nonEmpty) hadServerDataRef.current = true;
            const incomingKey = JSON.stringify({
              entries: data.entries, subjects: data.subjects, topicBank: data.topicBank, examSubjects: data.examSubjects,
              combinedExams: data.combinedExams, nextExam: data.nextExam, examSchedule: data.examSchedule, tasks: data.tasks, notes: data.notes,
              lang: data.lang, themeMode: data.themeMode, accentKey: data.accentKey, textScale: data.textScale,
            });
            // যদি এই data আমাদেরই সবশেষ write-এর echo হয়, আবার setState করে re-render/re-save লুপ তৈরি করার দরকার নেই।
            // এছাড়াও, যদি local-এ এখনো unsaved change থাকে (pendingLocalWriteRef), তাহলে এই incoming data
            // পুরনো (stale) হতে পারে — সেটা দিয়ে fresher local state (যেমন এইমাত্র ট্র্যাশ ডিলিট করা) ওভাররাইট করা যাবে না।
            if (incomingKey !== lastSavedPayloadRef.current && !pendingLocalWriteRef.current) {
              // এই setState-গুলো থেকে যেই write-effect ট্রিগার হবে, সেটা যেন আবার এই একই ডেটা
              // Firestore-এ ফেরত না লেখে — নাহলে দুর্বল নেটওয়ার্ক/race অবস্থায় আসল ডেটা ওভাররাইট হয়ে যাওয়ার ঝুঁকি থাকে
              skipNextWriteRef.current = true;
              if (data.entries) setEntries(data.entries);
              if (data.subjects) setSubjects(data.subjects);
              if (data.topicBank) setTopicBank(data.topicBank);
              if (data.examSubjects) {
                const raw = data.examSubjects;
                // migrate old shape { date, scores:[...] } -> new shape { topics: { General: { attempts:[...] } } }
                let migratedNextExam = null;
                const migrated = {};
                Object.entries(raw).forEach(([subj, info]) => {
                  if (info && info.topics) { migrated[subj] = info; return; }
                  const scores = (info && info.scores) || [];
                  const attempts = scores.map(s => ({ id: s.id, date: info?.date || null, obtained: s.obtained, total: s.total }));
                  migrated[subj] = { topics: attempts.length ? { General: { attempts } } : {} };
                  if (info?.date && scores.length === 0 && !migratedNextExam) {
                    migratedNextExam = { subject: subj, topic: "", date: info.date };
                  }
                });
                setExamSubjects(migrated);
                if (migratedNextExam) setNextExam(prev => prev || migratedNextExam);
              }
              if (data.combinedExams) setCombinedExams(data.combinedExams);
              if (data.nextExam !== undefined) setNextExam(data.nextExam);
              if (data.examSchedule) setExamSchedule(data.examSchedule);
              // data.tasks/data.notes না থাকলে (এই ইউজারের জন্য এখনো কোনোদিন cloud-এ সেভ হয়নি — যেমন এই
              // ফিক্সের পর প্রথমবার) লোকাল state (পুরনো localStorage থেকে আসা) অপরিবর্তিত থাকবে, যাতে সেটা
              // মুছে না গিয়ে বরং নিচের write effect এটাকেই প্রথমবার Firestore-এ মাইগ্রেট করে দেয়
              if (data.tasks) setTasks(data.tasks);
              if (data.notes) setNotes(data.notes);
              if (data.lang) setLang(data.lang);
              if (data.themeMode && !themeLoadedOnceRef.current) { setThemeMode(normalizeThemeMode(data.themeMode)); themeLoadedOnceRef.current = true; }
              if (data.accentKey && ACCENT_OPTIONS.some(a => a.key === data.accentKey)) { setAccentKey(data.accentKey); }
              if (data.textScale && TEXT_SCALE_OPTIONS.includes(data.textScale)) { setTextScale(data.textScale); }
              // প্রোফাইল এক্সট্রা ফিল্ড (Auth-এ রাখা যায় না/সমস্যা হয় বলে Firestore-এ সেভ হয়) —
              // gender, জন্মতারিখ, সোশ্যাল লিংক, আর প্রোফাইল ছবি (resize করা base64, Storage ছাড়াই)
              if (data.gender !== undefined || data.dob !== undefined || data.socialLinks !== undefined || data.photoURL !== undefined) {
                setUser(u => u ? ({ ...u, gender: data.gender, dob: data.dob, socialLinks: data.socialLinks || {}, photoURL: data.photoURL || u.photoURL }) : u);
              }
            }
          }
        } finally {
          // The cached UI is already visible; Firestore now becomes the
          // authoritative source without forcing another full-page loading state.
          setLoaded(true);
          // এখন থেকেই Firestore-এ write করা নিরাপদ — server state অন্তত একবার confirm হয়ে গেছে
          // (এই flag true হওয়ার আগে কোনো stale cache accidentally Firestore-এ লেখা হবে না)
          setServerSynced(true);
        }
      },
      (e) => {
        console.error("Firestore live sync error:", e);
        setLoaded(true);
      }
    );
    return () => unsubscribe();
  }, [user]);

  // ডেটা বদলালে (debounce করে) Firestore-এ সেভ করা — শুধু লগইন করা অবস্থায়, এবং শুধু তখনই
  // যখন Firestore থেকে আসল server data একবার confirm হয়ে গেছে (নাহলে stale cache
  // ভুলবশত আসল data মুছে দিতে পারে — দেখুন serverSynced-এর উপরের কমেন্ট)
  useEffect(() => {
    if (!serverSynced || !user) return;
    if (skipNextWriteRef.current) { skipNextWriteRef.current = false; return; } // এইমাত্র Firestore থেকেই ডেটা এসেছে — সেটাই আবার লেখার দরকার নেই

    // সেফটি গার্ড: এই ইউজারের Firestore-এ আগে real ডেটা থাকতে দেখেছি (hadServerDataRef), কিন্তু এখন local
    // state পুরোপুরি খালি — এমন অবস্থায় write করলে কোনো bug/race condition-এর কারণে ভুলবশত আসল ডেটা
    // মুছে যেতে পারে। তাই সন্দেহজনক এই "সব খালি" write আটকে দেওয়া হচ্ছে, শুধু console-এ warning থাকবে।
    const isEffectivelyEmpty = Object.keys(entries).length === 0 &&
      subjects.length === 0 &&
      Object.keys(topicBank).length === 0 &&
      Object.keys(examSubjects).length === 0 &&
      Object.keys(combinedExams).length === 0 &&
      examSchedule.length === 0 &&
      tasks.length === 0 &&
      notes.length === 0;
    if (isEffectivelyEmpty && hadServerDataRef.current) {
      console.warn("FocusGo: সন্দেহজনক খালি write আটকে দেওয়া হলো — Firestore-এর আসল ডেটা সুরক্ষিত থাকল।");
      return;
    }

    // local state এখন Firestore-এর সাথে out-of-sync (নতুন change আছে যা এখনো সেভ হয়নি) —
    // এই সময়ে onSnapshot থেকে পুরনো data এলে সেটা যেন local state ওভাররাইট না করে
    pendingLocalWriteRef.current = true;

    const payload = {
      entries, subjects, topicBank, examSubjects, combinedExams, nextExam, examSchedule, tasks, notes, lang, themeMode, accentKey, textScale,
      updatedAt: new Date().toISOString(),
    };

    // Local cache makes the next refresh feel instant. It is only a UI cache;
    // Firestore remains the persistent source of truth.
    try {
      window.localStorage.setItem(`focusgo_cache_v2_${user.uid}`, JSON.stringify(payload));
    } catch (e) {}

    const t = setTimeout(() => {
      // এই মুহূর্তে যা লিখছি তার একটা "ছাপ" রেখে দেওয়া — real-time listener পরে এই একই data
      // ফেরত পেলে বুঝবে এটা নিজেরই echo, আবার setState/re-save করবে না
      lastSavedPayloadRef.current = JSON.stringify({ entries, subjects, topicBank, examSubjects, combinedExams, nextExam, examSchedule, tasks, notes, lang, themeMode, accentKey, textScale });
      setDoc(doc(db, "users", user.uid), payload, { merge: true })
        .catch(e => console.error("Firestore save error:", e))
        .finally(() => { pendingLocalWriteRef.current = false; }); // সেভ সফল হোক বা ব্যর্থ — এখন local আবার "in sync" ধরে নেওয়া হচ্ছে, নাহলে flag চিরকাল আটকে থাকতে পারে
      // দৈনিক অটো-ব্যাকআপ — প্রতিদিন একবার (তারিখ অনুযায়ী ডকুমেন্ট আইডি, তাই বারবার ওভাররাইট হয়, জমতে থাকে না)।
      // ভবিষ্যতে কোনো bug বা ভুলবশত ডিলিট হলে এখান থেকে আগের দিনের ডেটা ফিরিয়ে আনা যাবে।
      if (!isEffectivelyEmpty) {
        const backupId = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        setDoc(doc(db, "users", user.uid, "backups", backupId), payload)
          .catch(e => console.error("Firestore backup save error:", e));
      }
    }, 600); // দ্রুত একের পর এক change হলে বারবার write না করে একবারে সেভ করা
    return () => clearTimeout(t);
  }, [entries, subjects, topicBank, examSubjects, combinedExams, nextExam, examSchedule, tasks, notes, lang, themeMode, accentKey, textScale, serverSynced, user]);

  // clock tick — শুধু minute display-এর জন্য, তাই প্রতি সেকেন্ডে না বদলে প্রতি মিনিটে একবার বদলালেই যথেষ্ট।
  // আগে setInterval(...,1000) পুরো App কম্পোনেন্টকে (পুরো UI ট্রি) সেকেন্ডে একবার re-render করাতো,
  // এমনকি timer/stopwatch চলছে না থাকলেও — এটা ব্যাটারি আর স্মুথনেসে প্রভাব ফেলছিল। এখন
  // পরের মিনিট-বাউন্ডারিতে align করে আপডেট হয়, তাই re-render ৬০ গুণ কমে যায় (৩৬০০/ঘণ্টা → ৬০/ঘণ্টা)।
  useEffect(() => {
    let id;
    const scheduleNext = () => {
      const msToNextMinute = 60000 - (Date.now() % 60000);
      id = setTimeout(() => { setNow(new Date()); scheduleNext(); }, msToNextMinute);
    };
    scheduleNext();
    return () => clearTimeout(id);
  }, []);

  // Focus Timer শেষ হওয়ার exact সময়টা আগে থেকেই OS-এ একটা LocalNotification হিসেবে
  // শিডিউল করে রাখা হয় (ঠিক exam reminder-এর প্যাটার্নে) — তাই timer চলাকালীন অ্যাপ থেকে
  // বের হয়ে গেলে বা অ্যাপ পুরোপুরি বন্ধ/মিনিমাইজড থাকলেও নির্দিষ্ট সময়ে system notification আসবে।
  const timerNotifIdRef = useRef(strToNotifId("focusgo_timer_end"));
  const scheduleTimerEndNotif = (atMs, kind) => {
    if (!Capacitor.isNativePlatform() || !notificationsEnabled || !timerNotifEnabled) return;
    const title = kind === "break" ? t.notifBreakDoneTitle : t.notifSessionDoneTitle;
    const body = kind === "break" ? t.notifBreakDoneBody : t.notifSessionDoneBody;
    LocalNotifications.schedule({
      notifications: [{ id: timerNotifIdRef.current, title, body, schedule: { at: new Date(atMs) } }],
    }).catch(() => {});
  };
  const cancelTimerEndNotif = () => {
    if (!Capacitor.isNativePlatform()) return;
    LocalNotifications.cancel({ notifications: [{ id: timerNotifIdRef.current }] }).catch(() => {});
  };

  // timer tick
  // মোবাইলে অ্যাপ থেকে বের হয়ে (ব্যাকগ্রাউন্ডে) থাকলে ব্রাউজার setInterval-কে
  // থ্রটল/পজ করে দেয়, তাই আগের কোডে (প্রতি টিকে -1 করে) ফিরে এসে ঘড়ি "থেমে/আটকে"
  // আছে মনে হতো। এখন আসল ওয়াল-ক্লক সময় (Date.now()) দিয়ে হিসাব হয় এবং ট্যাব আবার
  // visible হলে সাথে সাথে রিক্যালকুলেট হয়, তাই ফিরে এসেই সঠিক সময় দেখা যাবে।
  useEffect(() => {
    if (timerRunning) {
      timerEndAtRef.current = Date.now() + Math.max(0, timerSeconds) * 1000;
      scheduleTimerEndNotif(timerEndAtRef.current, sessionTypeRef.current);
      const tick = () => {
        const remaining = Math.max(0, Math.round((timerEndAtRef.current - Date.now()) / 1000));
        setTimerSeconds(remaining);
        if (remaining <= 0) {
          playEndSound();
          if (sessionTypeRef.current === "focus") {
            // একটা Focus session শেষ
            setTimerRunning(false);
            vibrate();
            const target = timerTargetMinutesRef.current;
            if (target) {
              // টপিক-লিঙ্কড মাল্টি-সেশন চলছে — সদ্য শেষ হওয়া চাঙ্কটা মোট এলাপসড-এ যোগ হবে
              const newElapsed = timerElapsedMinutesRef.current + focusMinutesRef.current;
              if (newElapsed >= target) {
                // মোট টার্গেট সময় সম্পন্ন — আর ব্রেক প্রম্পট দেখানো হবে না, টপিকটা অটো-কমপ্লিট হয়ে যাবে
                setTimerElapsedMinutes(0);
                setTimerTargetMinutes(null);
                setShowBreakPrompt(false);
                if (timerTopicIdRef.current) markTopicDoneFor(todayKey, timerTopicIdRef.current);
                pushNotification(t.notifTopicDoneTitle, t.notifTopicDoneBody, null, true);
                return;
              }
              setTimerElapsedMinutes(newElapsed);
            }
            setShowBreakPrompt(true);
            pushNotification(t.notifSessionDoneTitle, t.notifSessionDoneBody, null, true);
          } else {
            // Break শেষ — পরের Focus session সাথে সাথে শুরু হয়ে যাবে, timer running-ই থাকবে (তাই interval restart লাগবে না)
            vibrate();
            pushNotification(t.notifBreakDoneTitle, t.notifBreakDoneBody, null, true);
            const totalSessions = pomodoroTotalSessionsRef.current;
            const nextSession = pomodoroSessionRef.current >= totalSessions ? 1 : pomodoroSessionRef.current + 1;
            setPomodoroSession(nextSession);
            setSessionType("focus");
            const target = timerTargetMinutesRef.current;
            const mins = target ? Math.max(1, Math.min(TOPIC_SESSION_CHUNK_MIN, target - timerElapsedMinutesRef.current)) : focusMinutesRef.current;
            setFocusMinutes(mins);
            const newTotal = mins * 60;
            setTimerTotal(newTotal);
            setTimerSeconds(newTotal);
            timerEndAtRef.current = Date.now() + newTotal * 1000;
            scheduleTimerEndNotif(timerEndAtRef.current, "focus");
            setFocusFullscreen(true);
          }
        }
      };
      timerRef.current = setInterval(tick, 1000);
      const onVisible = () => { if (document.visibilityState === "visible") tick(); };
      document.addEventListener("visibilitychange", onVisible);
      window.addEventListener("focus", onVisible);
      return () => {
        clearInterval(timerRef.current);
        document.removeEventListener("visibilitychange", onVisible);
        window.removeEventListener("focus", onVisible);
        cancelTimerEndNotif(); // pause/reset হলে আগে শিডিউল করা timer-end notification ক্যানসেল হয়ে যাবে
      };
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [timerRunning]);

  // stopwatch tick — একই কারণে (ব্যাকগ্রাউন্ড থ্রটলিং) স্টার্ট-টাইম ধরে রেখে
  // Date.now() দিয়ে হিসাব করা হচ্ছে, শুধু আগের ভ্যালুতে +1 করার বদলে।
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchStartAtRef.current = Date.now() - Math.max(0, stopwatchSeconds) * 1000;
      const tick = () => {
        setStopwatchSeconds(Math.max(0, Math.round((Date.now() - stopwatchStartAtRef.current) / 1000)));
      };
      stopwatchRef.current = setInterval(tick, 1000);
      const onVisible = () => { if (document.visibilityState === "visible") tick(); };
      document.addEventListener("visibilitychange", onVisible);
      window.addEventListener("focus", onVisible);
      return () => {
        clearInterval(stopwatchRef.current);
        document.removeEventListener("visibilitychange", onVisible);
        window.removeEventListener("focus", onVisible);
      };
    } else if (stopwatchRef.current) {
      clearInterval(stopwatchRef.current);
    }
  }, [stopwatchRunning]);

  // keep screen awake while timer or stopwatch is running
  const wakeLockRef = useRef(null);
  useEffect(() => {
    const isActive = timerRunning || stopwatchRunning;
    let cancelled = false;

    const requestLock = async () => {
      try {
        if (navigator.wakeLock && !wakeLockRef.current) {
          const lock = await navigator.wakeLock.request("screen");
          if (cancelled) { lock.release().catch(()=>{}); return; }
          wakeLockRef.current = lock;
          lock.addEventListener("release", () => { wakeLockRef.current = null; });
        }
      } catch (err) {
        // wake lock unsupported or blocked (e.g. low battery, permissions) — fail silently
      }
    };

    const releaseLock = () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(()=>{});
        wakeLockRef.current = null;
      }
    };

    if (isActive) {
      requestLock();
      const onVisibility = () => { if (document.visibilityState === "visible") requestLock(); };
      document.addEventListener("visibilitychange", onVisibility);
      return () => { cancelled = true; document.removeEventListener("visibilitychange", onVisibility); releaseLock(); };
    } else {
      releaseLock();
    }
  }, [timerRunning, stopwatchRunning]);

  const todayTopics = entries[todayKey] || [];
  const derivedSubjects = Array.from(new Set(Object.values(entries).flat().map(e => e.subject)));
  const allSubjects = Array.from(new Set([...subjects, ...derivedSubjects]));
  const timerTopic = todayTopics.find(x => x.id === timerTopicId);

  // ---- plan tab: next N days, starting tomorrow (N = planRange: 7/15/30/60/90) ----
  const planDays = Array.from({ length: planRange }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i + 1); return d; });
  const planKey = dateKey(planDate);
  const isPlanToday = planKey === todayKey;
  const planTopics = entries[planKey] || [];

  // ---- generalized entry CRUD (works for any date, so Plan tab can reuse) ----
  const addTopicFor = (dk, { subject, topic, time, endTime, duration }) => {
    setEntries(prev => {
      const list = prev[dk] ? [...prev[dk]] : [];
      list.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`, subject, topic, duration: duration || 0, done: false, time, endTime });
      return { ...prev, [dk]: list };
    });
  };

  const toggleDoneFor = (dk, id) => {
    setEntries(prev => {
      const list = (prev[dk] || []).map(x => x.id === id ? { ...x, done: !x.done } : x);
      return { ...prev, [dk]: list };
    });
  };

  // টপিক-লিঙ্কড মাল্টি-সেশন টাইমার টার্গেট সময় শেষ হলে টপিকটা অটো-কমপ্লিট মার্ক করার জন্য
  // (toggle না, সরাসরি done:true — যাতে ইতিমধ্যে done থাকলেও ভুলবশত আনডান না হয়ে যায়)
  const markTopicDoneFor = (dk, id) => {
    setEntries(prev => {
      const list = (prev[dk] || []).map(x => x.id === id ? { ...x, done: true } : x);
      return { ...prev, [dk]: list };
    });
  };

  const saveEditFor = (dk, { id, subject, topic, time, endTime, duration }) => {
    setEntries(prev => {
      const list = (prev[dk] || []).map(x => x.id === id ? { ...x, subject, topic, time, endTime, duration } : x);
      return { ...prev, [dk]: list };
    });
  };

  const deleteTopicFor = (dk, id) => {
    const removed = (entries[dk] || []).find(x => x.id === id);
    setEntries(prev => {
      const list = (prev[dk] || []).filter(x => x.id !== id);
      return { ...prev, [dk]: list };
    });
    if (timerTopicId === id) setTimerTopicId(null);
    if (removed) {
      showUndoToast(lang === "bn" ? "টপিক ডিলিট হয়েছে" : "Topic deleted", () => {
        setEntries(prev => ({ ...prev, [dk]: [...(prev[dk] || []), removed] }));
      });
    }
  };

  // ---- today-tab wrappers ----
  const addTopic = (data) => {
    addTopicFor(addTargetKey || todayKey, data);
    setShowAdd(false);
  };
  const saveEditTopic = (data) => {
    saveEditFor((editTopic && editTopic._dk) || todayKey, data);
    setEditTopic(null);
  };

  // ---- syllabus subject management ----
  const addSubject = (name) => setSubjects(prev => prev.includes(name) ? prev : [...prev, name]);
  const removeSubject = (name) => {
    setSubjects(prev => prev.filter(s => s !== name));
    setTopicBank(prev => { if (!prev[name]) return prev; const next = { ...prev }; delete next[name]; return next; });
    setCombinedExams(prev => {
      let changed = false;
      const next = {};
      Object.entries(prev).forEach(([id, ce]) => {
        if (ce.subjects && ce.subjects.includes(name)) {
          changed = true;
          next[id] = { ...ce, subjects: ce.subjects.filter(s => s !== name) };
        } else {
          next[id] = ce;
        }
      });
      return changed ? next : prev;
    });
  };
  const addExamSubject = (name) => setExamSubjects(prev => prev[name] ? prev : ({ ...prev, [name]: { topics: {} } }));
  const removeExamSubject = (name) => {
    setExamSubjects(prev => { const next = { ...prev }; delete next[name]; return next; });
    setNextExam(prev => (prev && prev.subject === name) ? null : prev);
  };
  // ---- Exam Schedule: একাধিক তারিখ-সহ পরীক্ষার পূর্ণ রুটিন — subject + date + start/end time ----
  const addExamScheduleItem = (item) => {
    setExamSchedule(prev => [...prev, { id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`, ...item }]);
  };
  const updateExamScheduleItem = (id, patch) => {
    setExamSchedule(prev => prev.map(x => x.id === id ? { ...x, ...patch } : x));
  };
  const removeExamScheduleItem = (id) => {
    setExamSchedule(prev => prev.filter(x => x.id !== id));
  };
  const addExamTopic = (subj, topicName) => {
    const name = (topicName || "").trim();
    if (!name) return;
    setExamSubjects(prev => {
      const cur = prev[subj] || { topics: {} };
      if (cur.topics[name]) return prev;
      return { ...prev, [subj]: { ...cur, topics: { ...cur.topics, [name]: { attempts: [] } } } };
    });
  };
  const removeExamTopic = (subj, topicName) => {
    setExamSubjects(prev => {
      const cur = prev[subj];
      if (!cur) return prev;
      const topics = { ...cur.topics };
      delete topics[topicName];
      return { ...prev, [subj]: { ...cur, topics } };
    });
    setNextExam(prev => (prev && prev.subject === subj && prev.topic === topicName) ? null : prev);
  };
  const addExamAttempt = (subj, topicName, date, obtained, total) => {
    setExamSubjects(prev => {
      const cur = prev[subj] || { topics: {} };
      const curTopic = cur.topics[topicName] || { attempts: [] };
      const attempts = [...(curTopic.attempts || []), { id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`, date: date || null, obtained, total }];
      return { ...prev, [subj]: { ...cur, topics: { ...cur.topics, [topicName]: { attempts } } } };
    });
  };
  const removeExamAttempt = (subj, topicName, attemptId) => {
    setExamSubjects(prev => {
      const cur = prev[subj];
      if (!cur) return prev;
      const curTopic = cur.topics[topicName];
      if (!curTopic) return prev;
      const attempts = (curTopic.attempts || []).filter(a => a.id !== attemptId);
      return { ...prev, [subj]: { ...cur, topics: { ...cur.topics, [topicName]: { attempts } } } };
    });
  };
  const editExamAttempt = (subj, topicName, attemptId, obtained, total, date) => {
    setExamSubjects(prev => {
      const cur = prev[subj];
      if (!cur) return prev;
      const curTopic = cur.topics[topicName];
      if (!curTopic) return prev;
      const attempts = (curTopic.attempts || []).map(a => a.id === attemptId ? { ...a, obtained, total, date: date !== undefined ? date : a.date } : a);
      return { ...prev, [subj]: { ...cur, topics: { ...cur.topics, [topicName]: { attempts } } } };
    });
  };
  // সাবজেক্টের নাম বদলালে সেটা syllabus তালিকা, সব দিনের এন্ট্রি, এক্সাম সাবজেক্ট আর নেক্সট-এক্সাম — সবখানে আপডেট হয়
  const renameSubject = (oldName, newName) => {
    const n = (newName || "").trim();
    if (!n || n === oldName) return false;
    if (subjects.includes(n)) return false; // নাম আগে থেকেই আছে
    setSubjects(prev => prev.map(s => s === oldName ? n : s));
    setEntries(prev => {
      const next = {};
      Object.entries(prev).forEach(([dk, list]) => {
        next[dk] = list.map(e => e.subject === oldName ? { ...e, subject: n } : e);
      });
      return next;
    });
    setTopicBank(prev => {
      if (!prev[oldName]) return prev;
      const next = { ...prev };
      next[n] = next[oldName];
      delete next[oldName];
      return next;
    });
    setExamSubjects(prev => {
      if (!prev[oldName]) return prev;
      const next = { ...prev };
      next[n] = next[oldName];
      delete next[oldName];
      return next;
    });
    setNextExam(prev => (prev && prev.subject === oldName) ? { ...prev, subject: n } : prev);
    setCombinedExams(prev => {
      let changed = false;
      const next = {};
      Object.entries(prev).forEach(([id, ce]) => {
        if (ce.subjects && ce.subjects.includes(oldName)) {
          changed = true;
          next[id] = { ...ce, subjects: ce.subjects.map(s => s === oldName ? n : s) };
        } else {
          next[id] = ce;
        }
      });
      return changed ? next : prev;
    });
    return true;
  };

  // ---- topic bank (Subject → pre-added Topics, ব্যবহৃত হয় Today's Study / Plan-এ) ----
  const addTopicToBank = (subj, topicName) => {
    const n = (topicName || "").trim();
    if (!subj || !n) return;
    setTopicBank(prev => {
      const list = prev[subj] || [];
      if (list.includes(n)) return prev;
      return { ...prev, [subj]: [...list, n] };
    });
  };
  // bulk add — একসাথে একাধিক টপিক (নতুন লাইনে বা কমা দিয়ে আলাদা করে) যোগ করা যায়, কোনো আপার লিমিট নেই
  const addTopicsBulkToBank = (subj, rawText) => {
    const names = (rawText || "").split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    if (!subj || names.length === 0) return;
    setTopicBank(prev => {
      const list = prev[subj] || [];
      const merged = [...list];
      names.forEach(n => { if (!merged.includes(n)) merged.push(n); });
      return { ...prev, [subj]: merged };
    });
  };
  const removeTopicFromBank = (subj, topicName) => {
    setTopicBank(prev => {
      const list = prev[subj];
      if (!list) return prev;
      return { ...prev, [subj]: list.filter(x => x !== topicName) };
    });
    showUndoToast(lang === "bn" ? "টপিক মুছে ফেলা হয়েছে" : "Topic removed", () => {
      setTopicBank(prev => {
        const list = prev[subj] || [];
        if (list.includes(topicName)) return prev;
        return { ...prev, [subj]: [...list, topicName] };
      });
    });
  };
  // টপিক rename হলে ব্যাংকের পাশাপাশি এই সাবজেক্ট+টপিকের আগের সব Today's Study/Plan এন্ট্রিতেও propagate হয়,
  // নাহলে Stats-এর হিসাব ভেঙে যাবে (একই টপিক দুই নামে গণনা হবে)
  const renameTopicInBank = (subj, oldTopic, newTopic) => {
    const n = (newTopic || "").trim();
    if (!subj || !n || n === oldTopic) return false;
    const list = topicBank[subj] || [];
    if (list.includes(n)) return false; // নাম আগে থেকেই আছে
    setTopicBank(prev => ({ ...prev, [subj]: (prev[subj] || []).map(x => x === oldTopic ? n : x) }));
    setEntries(prev => {
      const next = {};
      Object.entries(prev).forEach(([dk, dayList]) => {
        next[dk] = dayList.map(e => (e.subject === subj && e.topic === oldTopic) ? { ...e, topic: n } : e);
      });
      return next;
    });
    return true;
  };
  const renameExamTopic = (subj, oldTopic, newTopic) => {
    const n = (newTopic || "").trim();
    if (!n || n === oldTopic) return false;
    const cur = examSubjects[subj];
    if (!cur || !cur.topics[oldTopic] || cur.topics[n]) return false; // নাম আগে থেকেই আছে
    setExamSubjects(prev => {
      const c = prev[subj];
      if (!c || !c.topics[oldTopic] || c.topics[n]) return prev;
      const topics = { ...c.topics };
      topics[n] = topics[oldTopic];
      delete topics[oldTopic];
      return { ...prev, [subj]: { ...c, topics } };
    });
    setNextExam(prev => (prev && prev.subject === subj && prev.topic === oldTopic) ? { ...prev, topic: n } : prev);
    return true;
  };

  // ---- combined exam management (একসাথে একাধিক সাবজেক্ট নিয়ে daily/weekly/monthly পরীক্ষা) ----
  const addCombinedExam = (name, type, subjectsList) => {
    const n = (name || "").trim();
    if (!n) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    setCombinedExams(prev => ({ ...prev, [id]: { name: n, type: type || "weekly", subjects: subjectsList || [], attempts: [] } }));
  };
  const removeCombinedExam = (id) => {
    setCombinedExams(prev => { const next = { ...prev }; delete next[id]; return next; });
  };
  const editCombinedExam = (id, name, type, subjectsList) => {
    const n = (name || "").trim();
    if (!n) return;
    setCombinedExams(prev => {
      const cur = prev[id];
      if (!cur) return prev;
      return { ...prev, [id]: { ...cur, name: n, type: type || cur.type, subjects: subjectsList || cur.subjects } };
    });
  };
  const addCombinedExamAttempt = (id, date, obtained, total) => {
    setCombinedExams(prev => {
      const cur = prev[id];
      if (!cur) return prev;
      const attempts = [...(cur.attempts || []), { id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`, date: date || null, obtained, total }];
      return { ...prev, [id]: { ...cur, attempts } };
    });
  };
  const removeCombinedExamAttempt = (id, attemptId) => {
    setCombinedExams(prev => {
      const cur = prev[id];
      if (!cur) return prev;
      const attempts = (cur.attempts || []).filter(a => a.id !== attemptId);
      return { ...prev, [id]: { ...cur, attempts } };
    });
  };
  const editCombinedExamAttempt = (id, attemptId, obtained, total, date) => {
    setCombinedExams(prev => {
      const cur = prev[id];
      if (!cur) return prev;
      const attempts = (cur.attempts || []).map(a => a.id === attemptId ? { ...a, obtained, total, date: date !== undefined ? date : a.date } : a);
      return { ...prev, [id]: { ...cur, attempts } };
    });
  };

  // একটা টপিকের মোট সময়কে (duration) দরকার হলে ৩০-মিনিট চাঙ্কে ভাগ করে timer/target state সেট করে দেয় —
  // startTimerFor আর selectTimerTopic দুই জায়গাতেই ব্যবহৃত হয়, যাতে আচরণ সবসময় একই থাকে।
  const applyTopicDurationSplit = (totalMins) => {
    const needsSplit = totalMins > TOPIC_SESSION_CHUNK_MIN;
    const chunk = needsSplit ? TOPIC_SESSION_CHUNK_MIN : totalMins;
    setTimerTargetMinutes(needsSplit ? totalMins : null);
    setTimerElapsedMinutes(0);
    setPomodoroTotalSessions(needsSplit ? Math.ceil(totalMins / TOPIC_SESSION_CHUNK_MIN) : 4);
    setFocusMinutes(chunk);
    setTimerSeconds(chunk*60);
    setTimerTotal(chunk*60);
  };

  const startTimerFor = (id, duration) => {
    setTimerTopicId(id);
    applyTopicDurationSplit(duration || 30);
    setSessionType("focus");
    setPomodoroSession(1);
    setShowBreakPrompt(false);
    setTimerRunning(true);
    setShowFocusTimerPage(true);
    playStartSound();
    vibrate();
  };

  // Pick a topic to attach to the (not-yet-running) timer/stopwatch, without starting it —
  // used by the "Select Today's Topic" picker under the Focus Timer card.
  const selectTimerTopic = (item) => {
    vibrate();
    if (item) {
      setTimerTopicId(item.id);
      if (focusMode === "timer" && sessionType === "focus") {
        setPomodoroSession(1);
        applyTopicDurationSplit(item.duration || 30);
      }
    } else {
      setTimerTopicId(null);
      setTimerTargetMinutes(null);
      setTimerElapsedMinutes(0);
      setPomodoroTotalSessions(4);
    }
    setShowTopicPicker(false);
  };

  const adjustTimer = (deltaMin) => {
    if (timerRunning) return;
    setTimerTotal(prev => {
      const next = Math.max(5*60, Math.min(180*60, prev + deltaMin*60));
      setTimerSeconds(next);
      return next;
    });
  };

  // Session Type dropdown-এ Focus/Break পাল্টালে সেই টাইপের শেষবার বেছে নেওয়া duration আবার বসে যায়
  const changeSessionType = (type) => {
    if (timerRunning) return;
    setSessionType(type);
    const mins = type === "focus" ? focusMinutes : breakMinutes;
    setTimerTotal(mins*60);
    setTimerSeconds(mins*60);
  };

  const setPresetDuration = (mins) => {
    if (timerRunning) return;
    setTimerTotal(mins*60);
    setTimerSeconds(mins*60);
    if (sessionType === "focus") setFocusMinutes(mins); else setBreakMinutes(mins);
  };

  const startEditDuration = () => {
    if (timerRunning) return;
    setDurationInput(String(Math.round(timerTotal/60)));
    setEditingDuration(true);
  };
  const commitDurationEdit = () => {
    const mins = Math.max(1, Math.min(180, parseInt(durationInput, 10) || Math.round(timerTotal/60)));
    setTimerTotal(mins*60);
    setTimerSeconds(mins*60);
    setEditingDuration(false);
    if (sessionType === "focus") setFocusMinutes(mins); else setBreakMinutes(mins);
  };

  // "Focus complete — Take a X min break?" প্রম্পটে ইউজার ব্রেক শুরু করলে
  const acceptBreak = () => {
    setShowBreakPrompt(false);
    setSessionType("break");
    const mins = breakMinutes;
    setTimerTotal(mins*60);
    setTimerSeconds(mins*60);
    setTimerRunning(true);
    setShowFocusTimerPage(true);
    playStartSound();
    vibrate();
  };
  // ব্রেক স্কিপ করে সরাসরি পরের Focus session-এ চলে যাওয়া
  const skipBreak = () => {
    setShowBreakPrompt(false);
    const nextSession = pomodoroSession >= pomodoroTotalSessions ? 1 : pomodoroSession + 1;
    setPomodoroSession(nextSession);
    setSessionType("focus");
    const mins = timerTargetMinutes ? Math.max(1, Math.min(TOPIC_SESSION_CHUNK_MIN, timerTargetMinutes - timerElapsedMinutes)) : focusMinutes;
    setFocusMinutes(mins);
    setTimerTotal(mins*60);
    setTimerSeconds(mins*60);
  };

  // ---- week data ----
  const weekStart = startOfWeek(today);
  const weekDays = Array.from({length:7}, (_,i) => { const d = new Date(weekStart); d.setDate(d.getDate()+i); return d; });

  // Stats tab: one shared "selected day" for both the week strip and the month grid.
  // Keeps the visible month in sync so a week-strip tap near a month boundary still shows correctly.
  const selectStatsDay = (d) => {
    setStatsMonthDay(d);
    setStatsCalMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  // ---- subject progress across all entries ----
  const subjectProgress = {};
  Object.values(entries).flat().forEach(e => {
    if (!subjectProgress[e.subject]) subjectProgress[e.subject] = { done: 0, total: 0 };
    subjectProgress[e.subject].total += 1;
    if (e.done) subjectProgress[e.subject].done += 1;
  });

  // ---- overall study overview (Stats tab) — total focused minutes, topics done, completion %, streak ----
  const studyOverview = (() => {
    let totalMin = 0, doneCount = 0, totalCount = 0;
    Object.values(entries).flat().forEach(e => {
      totalCount += 1;
      if (e.done) { doneCount += 1; totalMin += (e.duration || 0); }
    });
    const pct = totalCount ? Math.round((doneCount/totalCount)*100) : 0;
    // streak: consecutive days up to today with at least one completed topic.
    // আজকে এখনো কিছু done না হলেও গতকালের স্ট্রিক ভাঙা উচিত না (দিনের শুরুতেই ০ দেখানো ভুল লজিক ছিল) —
    // তাই আজ কিছু done না থাকলে গতকাল থেকে গোনা শুরু হয়, শুধু "আজ" থেকেই না
    let streak = 0;
    let cursor = new Date(today);
    if (!(entries[dateKey(cursor)] || []).some(x=>x.done)) {
      cursor.setDate(cursor.getDate()-1);
    }
    while (true) {
      const dk = dateKey(cursor);
      const list = entries[dk] || [];
      if (list.some(x=>x.done)) { streak += 1; cursor.setDate(cursor.getDate()-1); }
      else break;
    }
    return { totalMin, doneCount, pct, streak };
  })();

  // ---- notification triggers: exam reminder, streak-at-risk, daily goal, inactivity ----
  // চেক করা হয় প্রতি মিনিটে একবার (now-কে মিনিট-এ রাউন্ড করে dependency হিসেবে ব্যবহার করা হয়েছে,
  // যাতে ক্লক টিক (প্রতি সেকেন্ডে) এর জন্য বারবার re-run না হয়)। pushNotification নিজেই flagKey দিয়ে
  // ডুপ্লিকেট আটকায়, তাই একবার নোটিফাই হয়ে গেলে একই দিনে আর দেখাবে না।
  const nowMinute = Math.floor(now.getTime() / 60000);
  useEffect(() => {
    if (!loaded) return;
    const DAILY_GOAL_MIN = 120; // ডিফল্ট দৈনিক টার্গেট (মিনিট) — কোনো সেটিংস UI নেই বলে একটা যুক্তিসঙ্গত ডিফল্ট ব্যবহার করা হয়েছে

    // 1) Exam reminder — nextExam-এর তারিখ ৩ দিন, ১ দিন, বা আজকে হলে (পুরনো একক ফিল্ড, ব্যাকওয়ার্ড কম্প্যাটিবিলিটি)
    if (nextExam?.date) {
      const diff = Math.round((new Date(nextExam.date + "T00:00:00") - new Date(todayKey + "T00:00:00")) / 86400000);
      const examLabel = `${nextExam.subject}${nextExam.topic ? " · " + nextExam.topic : ""}`;
      if (diff === 0) {
        pushNotification(t.notifExamTodayTitle, examLabel, `exam_${nextExam.date}_0`);
      } else if (diff === 1) {
        pushNotification(t.notifExamTomorrowTitle, examLabel, `exam_${nextExam.date}_1`);
      } else if (diff === 3) {
        pushNotification(t.notifExamSoonTitle.replace("{days}", String(diff)), examLabel, `exam_${nextExam.date}_3`);
      }
    }
    // 1b) Exam Schedule — একাধিক পরীক্ষার প্রতিটার জন্য আলাদাভাবে একই ৩/১/০ দিনের রিমাইন্ডার
    examSchedule.forEach(ex => {
      if (!ex.date) return;
      const diff = Math.round((new Date(ex.date + "T00:00:00") - new Date(todayKey + "T00:00:00")) / 86400000);
      const examLabel = ex.subject;
      if (diff === 0) {
        pushNotification(t.notifExamTodayTitle, examLabel, `examsch_${ex.id}_0`);
      } else if (diff === 1) {
        pushNotification(t.notifExamTomorrowTitle, examLabel, `examsch_${ex.id}_1`);
      } else if (diff === 3) {
        pushNotification(t.notifExamSoonTitle.replace("{days}", String(diff)), examLabel, `examsch_${ex.id}_3`);
      }
    });

    // 2) Streak-at-risk — গতকাল streak সচল ছিল কিন্তু আজ সন্ধ্যা ৮টার পরও কোনো টপিক done হয়নি
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayHadStudy = (entries[dateKey(yesterday)] || []).some(x => x.done);
    const todayHasStudy = (entries[todayKey] || []).some(x => x.done);
    if (yesterdayHadStudy && !todayHasStudy && now.getHours() >= 20) {
      pushNotification(t.notifStreakTitle, t.notifStreakBody, `streak_${todayKey}`);
    }

    // 3) Daily goal reached — আজকের done টপিকের মোট সময় target ছুঁয়ে ফেললে
    const todayMinutes = (entries[todayKey] || []).filter(x => x.done).reduce((s, x) => s + (x.duration || 0), 0);
    if (todayMinutes >= DAILY_GOAL_MIN) {
      pushNotification(t.notifGoalTitle, t.notifGoalBody, `goal_${todayKey}`);
    }

    // 4) Inactivity — শেষ যেদিন কোনো entry ছিল তার পর থেকে ৩+ দিন কিছু log হয়নি
    const pastKeysWithEntries = Object.keys(entries).filter(k => k < todayKey && (entries[k] || []).length > 0).sort();
    if (pastKeysWithEntries.length > 0) {
      const lastKey = pastKeysWithEntries[pastKeysWithEntries.length - 1];
      const gapDays = Math.round((new Date(todayKey + "T00:00:00") - new Date(lastKey + "T00:00:00")) / 86400000);
      if (gapDays >= 3) {
        pushNotification(t.notifInactiveTitle, t.notifInactiveBody, `inactive_${todayKey}`);
      }
    }
  }, [loaded, nowMinute, nextExam, examSchedule, todayKey, entries]);

  // ---- weekly activity — minutes studied per day, this week (for the Stats mini bar chart) ----
  const weeklyActivity = weekDays.map(d => {
    const list = entries[dateKey(d)] || [];
    const min = list.filter(x=>x.done).reduce((s,x)=>s+(x.duration||0), 0);
    return { day: d, min };
  });

  // ---- monthly activity — minutes studied per week, this month (for the Stats mini bar chart) ----
  const monthlyActivity = (() => {
    const y = today.getFullYear(), m = today.getMonth();
    const daysInMonth = new Date(y, m+1, 0).getDate();
    const weeks = [];
    let cur = [];
    for (let d = 1; d <= daysInMonth; d++) {
      cur.push(d);
      const weekEndDay = (weekStartDay + 6) % 7; // সপ্তাহ যেদিন শুরু, তার ঠিক আগের দিনে শেষ হয়
      const isWeekEnd = new Date(y, m, d).getDay() === weekEndDay;
      if (isWeekEnd || d === daysInMonth) { weeks.push(cur); cur = []; }
    }
    return weeks.map((wDays, i) => {
      const min = wDays.reduce((s, d) => {
        const list = entries[dateKey(new Date(y, m, d))] || [];
        return s + list.filter(x=>x.done).reduce((ss,x)=>ss+(x.duration||0), 0);
      }, 0);
      return { weekNum: i+1, min }; // label formatted at render time (t/nf not ready yet here)
    });
  })();

  // ---- weekly topic summary (Subject+Topic matched, covered vs missed) — শুধু সপ্তাহ সম্পূর্ণ শেষ হলেই দেখানো হয় ----
  const summaryWeekStart = startOfWeek(summaryWeekAnchor);
  const summaryWeekEnd = (() => { const d = new Date(summaryWeekStart); d.setDate(d.getDate()+6); return d; })();
  const summaryWeekComplete = summaryWeekEnd < stripTime(today);
  const summaryWeekDayKeys = Array.from({length:7}, (_,i) => { const d = new Date(summaryWeekStart); d.setDate(d.getDate()+i); return dateKey(d); });
  const summaryWeekTopics = buildTopicSummary(summaryWeekDayKeys, entries, allSubjects);
  const nextSummaryWeekStart = (() => { const d = new Date(summaryWeekStart); d.setDate(d.getDate()+7); return d; })();
  const canGoNextSummaryWeek = (() => { const d = new Date(nextSummaryWeekStart); d.setDate(d.getDate()+6); return d < stripTime(today); })();

  // ---- monthly topic summary (Subject+Topic matched, covered vs missed) — শুধু মাস সম্পূর্ণ শেষ হলেই দেখানো হয় ----
  const summaryMonthY = summaryMonthAnchor.getFullYear(), summaryMonthM = summaryMonthAnchor.getMonth();
  const summaryMonthDaysCount = new Date(summaryMonthY, summaryMonthM+1, 0).getDate();
  const summaryMonthLastDay = new Date(summaryMonthY, summaryMonthM, summaryMonthDaysCount);
  const summaryMonthComplete = summaryMonthLastDay < stripTime(today);
  const summaryMonthDayKeys = Array.from({length:summaryMonthDaysCount}, (_,i) => dateKey(new Date(summaryMonthY, summaryMonthM, i+1)));
  const summaryMonthTopics = buildTopicSummary(summaryMonthDayKeys, entries, allSubjects);
  const canGoNextSummaryMonth = (() => { const lastDayNext = new Date(summaryMonthY, summaryMonthM+2, 0); return lastDayNext < stripTime(today); })();

  // ---- dates with an exam attempt or the set next-exam date (for the Stats calendar legend) ----
  const examDateKeys = (() => {
    const set = new Set();
    Object.values(examSubjects).forEach(s => Object.values(s.topics || {}).forEach(tp => (tp.attempts||[]).forEach(a => a.date && set.add(a.date))));
    Object.values(combinedExams).forEach(ce => (ce.attempts||[]).forEach(a => a.date && set.add(a.date)));
    if (nextExam?.date) set.add(nextExam.date);
    examSchedule.forEach(ex => ex.date && set.add(ex.date));
    return set;
  })();

  // ---- Exam Schedule sorted soonest-first, and the single nearest upcoming one (Home countdown card) ----
  const sortedExamSchedule = [...examSchedule].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const nearestUpcomingExam = sortedExamSchedule.find(ex => ex.date && !isExamPast(ex)) || null;

  // ---- weekly / monthly summary ----
  const rangeEntries = (days) => days.flatMap(d => (entries[dateKey(d)] || []).map(e => ({...e, _dk: dateKey(d)})));
  const weekEntries = rangeEntries(weekDays);
  const monthDays = (() => {
    const y = today.getFullYear(), m = today.getMonth();
    const days = [];
    const last = new Date(y, m+1, 0).getDate();
    for (let i=1;i<=last;i++) days.push(new Date(y,m,i));
    return days;
  })();
  const monthEntries = rangeEntries(monthDays.filter(d => d <= today));

  const nf = (n) => lang === "bn" ? toBn(n) : n;

  // সালাত টাইমার — coordinates থাকলে adhan লাইব্রেরি দিয়ে আজকের ৫ ওয়াক্তের শুরু/শেষ সময় বের করা হয় (Karachi method, Shafi madhab)
  // নেটিভ অ্যাপে (Capacitor) @capacitor/geolocation প্লাগিন ব্যবহার করা হচ্ছে — এই প্লাগিনের নিজের
  // AndroidManifest.xml-এই লোকেশন পারমিশন ডিক্লেয়ার করা থাকে, বিল্ডের সময় সেটা অটোমেটিক্যালি
  // অ্যাপের মূল manifest-এর সাথে merge হয়ে যায়, তাই আলাদা করে manifest এডিট করার দরকার নেই।
  // ওয়েবে চালালে navigator.geolocation-এ fallback হবে
  // Geolocation প্লাগিনের নির্দিষ্ট error code অনুযায়ী স্পষ্ট মেসেজ — এতে আসল কারণ (Play Services,
  // timeout, নাকি সিস্টেম লোকেশন বন্ধ) সহজে বোঝা যাবে
  const salahErrMsg = (e) => {
    const code = e && e.code;
    const map = {
      "OS-PLUG-GLOC-0007": lang === "bn" ? "ফোনের Location সার্ভিস বন্ধ আছে — Settings থেকে চালু করুন" : "Device location services are off — turn them on in Settings",
      "OS-PLUG-GLOC-0009": lang === "bn" ? "Location চালু করার অনুরোধ বাতিল হয়েছে" : "Request to enable location was declined",
      "OS-PLUG-GLOC-0010": lang === "bn" ? "লোকেশন খুঁজে পেতে বেশি সময় লাগছে — খোলা জায়গায়/জানালার কাছে গিয়ে আবার চেষ্টা করুন" : "Timed out finding location — try again outdoors or near a window",
      "OS-PLUG-GLOC-0014": lang === "bn" ? "Google Play Services-এ সমস্যা (আপডেট করা লাগতে পারে)" : "Google Play Services issue (may need an update)",
      "OS-PLUG-GLOC-0015": lang === "bn" ? "Google Play Services এভেইলেবল না" : "Google Play Services not available on this device",
      "OS-PLUG-GLOC-0016": lang === "bn" ? "ডিভাইসের Location সেটিংসে সমস্যা" : "Device location settings issue",
      "OS-PLUG-GLOC-0017": lang === "bn" ? "Network ও Location দুটোই বন্ধ আছে — Location অন করুন" : "Both Network and Location are off — turn Location on",
      "OS-PLUG-GLOC-0018": lang === "bn" ? "অ্যাপে লোকেশন পারমিশন ডিক্লেয়ার নেই (নতুন বিল্ড দরকার)" : "Location permission not declared in this build (rebuild needed)",
    };
    return map[code] || (lang === "bn" ? "লোকেশন পাওয়া যায়নি — ফোনের Location (GPS) অন আছে কিনা দেখুন" : "Couldn't get location — check your phone's Location (GPS) is turned on");
  };
  const requestSalahLocation = async () => {
    setSalahLocLoading(true);
    setSalahLocError("");
    setSalahPermDenied(false);
    const saveCoords = (lat, lng) => {
      const coords = { lat, lng };
      setSalahCoords(coords);
      try { window.localStorage.setItem("focusgo_salah_coords", JSON.stringify(coords)); } catch (e) {}
      // পুরনো এলাকার নাম সরিয়ে নতুন করে reverse-geocode — ব্যর্থ হলে পুরনো নামই থেকে যাবে (silently, UI-তে "লোড হচ্ছে" আটকে থাকবে না)
      reverseGeocodeSalah(lat, lng).then((name) => {
        if (name) {
          setSalahLocationName(name);
          try { window.localStorage.setItem("focusgo_salah_location_name", name); } catch (e) {}
        }
      });
    };
    if (Capacitor.isNativePlatform()) {
      try {
        let status = await Geolocation.checkPermissions();
        if (status.location !== "granted" && status.coarseLocation !== "granted") {
          status = await Geolocation.requestPermissions();
        }
        if (status.location !== "granted" && status.coarseLocation !== "granted") {
          // status.location === "denied" মানে ইউজার আগে একবার "Don't allow"/"বন্ধ" চেপেছে —
          // Android এখন থেকে আর নিজে থেকে পারমিশন ডায়ালগ দেখাবে না, তাই সরাসরি Settings-এ পাঠাতে হবে
          setSalahPermDenied(status.location === "denied" || status.coarseLocation === "denied");
          setSalahLocError(lang === "bn" ? "লোকেশন পারমিশন পাওয়া যায়নি — নিচের বাটনে ট্যাপ করে সেটিংস থেকে অন করুন" : "Location permission denied — tap below to enable it from Settings");
          setSalahLocLoading(false);
          return;
        }
        // প্রথমে GPS (high accuracy) দিয়ে চেষ্টা — নেটওয়ার্ক দুর্বল থাকলেও এটা কাজ করবে;
        // এটা ব্যর্থ হলে network-based লোকেশন দিয়ে আরেকবার চেষ্টা করা হয়
        let pos, lastErr;
        try {
          pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 20000 });
        } catch (gpsErr) {
          lastErr = gpsErr;
          try {
            pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 20000 });
          } catch (netErr) {
            lastErr = netErr;
          }
        }
        if (pos) saveCoords(pos.coords.latitude, pos.coords.longitude);
        else setSalahLocError(salahErrMsg(lastErr));
        // এখানে পৌঁছালে মানে permission granted-ই ছিল, শুধু GPS/timeout জাতীয় সমস্যা —
        // এইজন্য Settings বাটন আর দেখানোর দরকার নেই
        setSalahPermDenied(false);
      } catch (e) {
        setSalahLocError(salahErrMsg(e));
      } finally {
        setSalahLocLoading(false);
      }
      return;
    }
    if (!navigator.geolocation) { setSalahLocError(lang === "bn" ? "লোকেশন সাপোর্ট নেই" : "Location not supported"); setSalahLocLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        saveCoords(pos.coords.latitude, pos.coords.longitude);
        setSalahLocLoading(false);
      },
      (err) => {
        setSalahPermDenied(err && err.code === 1); // 1 = PERMISSION_DENIED
        setSalahLocError(lang === "bn" ? "লোকেশন পারমিশন পাওয়া যায়নি" : "Location permission denied");
        setSalahLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 3600000 }
    );
  };
  // Open-Meteo থেকে বর্তমান তাপমাত্রা + সূর্যোদয়/সূর্যাস্ত আনা হয় — কোনো API key লাগে না।
  // ৩০ মিনিটের মধ্যে একই কোঅর্ডিনেটের জন্য আবার কল করা হলে ক্যাশড ডেটাই থেকে যায় (force দিলে বাদে)
  const fetchWeather = async (lat, lng, force) => {
    if (!force && weatherData && weatherData.lat === lat && weatherData.lng === lng && (Date.now() - weatherData.fetchedAt) < 30 * 60 * 1000) return;
    setWeatherLoading(true);
    setWeatherError("");
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto`);
      const json = await res.json();
      const data = {
        lat, lng,
        temp: json.current && json.current.temperature_2m != null ? Math.round(json.current.temperature_2m) : null,
        code: json.current ? json.current.weather_code : null,
        sunrise: (json.daily && json.daily.sunrise && json.daily.sunrise[0]) || null,
        sunset: (json.daily && json.daily.sunset && json.daily.sunset[0]) || null,
        fetchedAt: Date.now(),
      };
      setWeatherData(data);
      try { window.localStorage.setItem("focusgo_weather_cache", JSON.stringify(data)); } catch (e) {}
    } catch (e) {
      setWeatherError(lang === "bn" ? "আবহাওয়ার তথ্য আনা যায়নি" : "Couldn't fetch weather");
    } finally {
      setWeatherLoading(false);
    }
  };
  // salahCoords পাওয়া গেলে/পরিবর্তন হলে ওয়েদার আনা হয়
  useEffect(() => {
    if (salahCoords) fetchWeather(salahCoords.lat, salahCoords.lng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salahCoords]);
  // প্রতি ৩০ মিনিটে অটো-রিফ্রেশ, যাতে তাপমাত্রা পুরনো না থেকে যায়
  useEffect(() => {
    if (!salahCoords) return;
    const id = setInterval(() => fetchWeather(salahCoords.lat, salahCoords.lng, true), 30 * 60 * 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salahCoords]);
  // WMO weather code → সংক্ষিপ্ত বর্ণনা + আইকন (Open-Meteo-র স্ট্যান্ডার্ড কোড অনুযায়ী)
  const weatherInfo = (code) => {
    const map = {
      0: { en: "Clear sky", bn: "পরিষ্কার আকাশ", Icon: Sun },
      1: { en: "Mainly clear", bn: "মোটামুটি পরিষ্কার", Icon: Sun },
      2: { en: "Partly cloudy", bn: "আংশিক মেঘলা", Icon: Cloud },
      3: { en: "Overcast", bn: "মেঘলা", Icon: Cloud },
      45: { en: "Foggy", bn: "কুয়াশাচ্ছন্ন", Icon: Cloud },
      48: { en: "Foggy", bn: "কুয়াশাচ্ছন্ন", Icon: Cloud },
      51: { en: "Light drizzle", bn: "হালকা গুঁড়ি বৃষ্টি", Icon: CloudRain },
      53: { en: "Drizzle", bn: "গুঁড়ি বৃষ্টি", Icon: CloudRain },
      55: { en: "Dense drizzle", bn: "ঘন গুঁড়ি বৃষ্টি", Icon: CloudRain },
      56: { en: "Freezing drizzle", bn: "হিমায়িত গুঁড়ি বৃষ্টি", Icon: CloudRain },
      57: { en: "Freezing drizzle", bn: "হিমায়িত গুঁড়ি বৃষ্টি", Icon: CloudRain },
      61: { en: "Light rain", bn: "হালকা বৃষ্টি", Icon: CloudRain },
      63: { en: "Rain", bn: "বৃষ্টি", Icon: CloudRain },
      65: { en: "Heavy rain", bn: "ভারী বৃষ্টি", Icon: CloudRain },
      66: { en: "Freezing rain", bn: "হিমায়িত বৃষ্টি", Icon: CloudRain },
      67: { en: "Freezing rain", bn: "হিমায়িত বৃষ্টি", Icon: CloudRain },
      71: { en: "Light snow", bn: "হালকা তুষারপাত", Icon: Cloud },
      73: { en: "Snow", bn: "তুষারপাত", Icon: Cloud },
      75: { en: "Heavy snow", bn: "ভারী তুষারপাত", Icon: Cloud },
      77: { en: "Snow grains", bn: "তুষারকণা", Icon: Cloud },
      80: { en: "Light showers", bn: "হালকা বৃষ্টি ঝরছে", Icon: CloudRain },
      81: { en: "Showers", bn: "বৃষ্টি ঝরছে", Icon: CloudRain },
      82: { en: "Heavy showers", bn: "ভারী বৃষ্টি ঝরছে", Icon: CloudRain },
      85: { en: "Snow showers", bn: "তুষার ঝরছে", Icon: Cloud },
      86: { en: "Snow showers", bn: "তুষার ঝরছে", Icon: Cloud },
      95: { en: "Thunderstorm", bn: "বজ্রঝড়", Icon: CloudRain },
      96: { en: "Thunderstorm w/ hail", bn: "শিলাসহ বজ্রঝড়", Icon: CloudRain },
      99: { en: "Thunderstorm w/ hail", bn: "শিলাসহ বজ্রঝড়", Icon: CloudRain },
    };
    return map[code] || { en: "—", bn: "—", Icon: Cloud };
  };
  const salahTimes = React.useMemo(() => {
    if (!salahCoords) return null;
    try {
      const asrFactor = salahMadhab === "hanafi" ? 2 : 1;
      const today0 = new Date();
      const tomorrow0 = new Date(today0); tomorrow0.setDate(tomorrow0.getDate() + 1);
      const pt = computeSalahTimesForDate(today0, salahCoords.lat, salahCoords.lng, asrFactor);
      const ptTomorrow = computeSalahTimesForDate(tomorrow0, salahCoords.lat, salahCoords.lng, asrFactor);
      return [
        { key: "fajr", label: lang === "bn" ? "ফজর" : "Fajr", start: pt.fajr, end: pt.sunrise },
        { key: "dhuhr", label: lang === "bn" ? "যোহর" : "Dhuhr", start: pt.dhuhr, end: pt.asr },
        { key: "asr", label: lang === "bn" ? "আসর" : "Asr", start: pt.asr, end: pt.maghrib },
        { key: "maghrib", label: lang === "bn" ? "মাগরিব" : "Maghrib", start: pt.maghrib, end: pt.isha },
        { key: "isha", label: lang === "bn" ? "এশা" : "Isha", start: pt.isha, end: ptTomorrow.fajr },
      ];
    } catch (e) { return null; }
  }, [salahCoords, salahMadhab, lang, todayKey]);
  const fmtSalahTime = (d) => {
    if (!d) return "--:--";
    const h12 = ((d.getHours() % 12) || 12);
    const ampm = d.getHours() >= 12 ? t.pmLabel : t.amLabel;
    return `${nf(h12)}:${nf(pad2(d.getMinutes()))} ${ampm}`;
  };
  const activeSalahKey = React.useMemo(() => {
    if (!salahTimes) return null;
    const found = salahTimes.find(w => now >= w.start && now < w.end);
    return found ? found.key : null;
  }, [salahTimes, now]);
  // পরবর্তী নামাজের বাকি সময় (কাউন্টডাউন) — 'now' প্রতি মিনিটে আপডেট হয় বলে এটাও লাইভ থাকবে
  const nextSalahCountdown = React.useMemo(() => {
    if (!salahTimes || !salahCoords) return null;
    const upcoming = salahTimes.find(w => now < w.start);
    let label, target;
    if (upcoming) {
      label = upcoming.label; target = upcoming.start;
    } else {
      const asrFactor = salahMadhab === "hanafi" ? 2 : 1;
      const tmr = new Date(now); tmr.setDate(tmr.getDate() + 1);
      try {
        const pt = computeSalahTimesForDate(tmr, salahCoords.lat, salahCoords.lng, asrFactor);
        label = lang === "bn" ? "ফজর" : "Fajr";
        target = pt.fajr;
      } catch (e) { return null; }
    }
    const diffMin = Math.max(0, Math.round((target - now) / 60000));
    const h = Math.floor(diffMin / 60), m = diffMin % 60;
    const text = h > 0 ? `${nf(h)}${lang === "bn" ? "ঘ" : "h"} ${nf(m)}${lang === "bn" ? "মি" : "m"}` : `${nf(m)}${lang === "bn" ? "মি" : "m"}`;
    return { label, text };
  }, [salahTimes, now, salahCoords, salahMadhab, lang, nf]);
  // কিবলার দিক — কোঅর্ডিনেট বদলালেই একবার হিসাব হয়
  const qiblaBearing = React.useMemo(() => {
    if (!salahCoords) return null;
    return Math.round(calcQiblaBearing(salahCoords.lat, salahCoords.lng));
  }, [salahCoords]);
  // আজকের হিজরি তারিখ
  const hijriDateLabel = React.useMemo(() => {
    try {
      const h = gregorianToHijri(today);
      const mName = lang === "bn" ? HIJRI_MONTHS_BN[h.month - 1] : HIJRI_MONTHS_EN[h.month - 1];
      return `${nf(h.day)} ${mName}, ${nf(h.year)} AH`;
    } catch (e) { return ""; }
  }, [today, lang, nf]);
  // আজকের যে সালাতগুলো আদায় করা হয়েছে বলে টিক দেওয়া আছে
  const todaySalahDone = salahCompleted[todayKey] || [];
  const toggleSalahDone = (key) => {
    vibrate();
    setSalahCompleted(prev => {
      const list = prev[todayKey] || [];
      const nextList = list.includes(key) ? list.filter(k => k !== key) : [...list, key];
      const merged = { ...prev, [todayKey]: nextList };
      // ৯০ দিনের বেশি পুরনো এন্ট্রি মুছে ফেলা হয়, যাতে localStorage অযথা বড় না হয়
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 90);
      const cutoffKey = dateKey(cutoff);
      Object.keys(merged).forEach(k => { if (k < cutoffKey) delete merged[k]; });
      return merged;
    });
  };
  const monthName = (i) => lang === "bn" ? MONTHS_BN[i] : MONTHS_EN[i];
  const monthShort = (i) => lang === "bn" ? MONTHS_SHORT_BN[i] : MONTHS_SHORT_EN[i];
  const weekdayName = (d) => lang === "bn" ? WEEKDAYS_BN[d.getDay()] : WEEKDAYS_EN[d.getDay()];
  const weekdayShort = (d) => lang === "bn" ? WEEKDAYS_SHORT_BN[d.getDay()] : WEEKDAYS_SHORT_EN[d.getDay()];

  const fmtTime = (h, m, s) => <>{<Num>{nf(pad2(h))}</Num>}:{<Num>{nf(pad2(m))}</Num>}{s !== undefined ? <>:{<Num>{nf(pad2(s))}</Num>}</> : null}</>;

  // theme tokens — active appearance theme (System resolves live to Light/Dark; or Light / Dark / Ivory / Graphite / Mist)
  const activeTheme = themeFor(resolvedThemeKey);
  const bg = activeTheme.bg;
  const cardBg = activeTheme.cardBg;
  const cardBorder = activeTheme.cardBorder;
  const subtleBg = activeTheme.subtleBg;
  const textMain = activeTheme.textMain;
  const textMuted2 = activeTheme.textMuted2;
  const accent = accentHexFor(accentKey, dark);
  // "মিড টিল" সরিয়ে সেকেন্ডারি স্ট্যাটাস কালার হিসেবে থিম-অ্যাডাপ্টিভ "কালো" ব্যবহার হচ্ছে (dark থিমে অফ-হোয়াইট, light থিমে near-black) —
  // এক্সাম মার্কারে আগে থেকেই এই একই কনভেনশন ছিল, এখন Planned/Study/Timer হাইলাইটেও সেটাই মিলিয়ে নেওয়া হলো
  const inkColor = dark ? "#F3F1F8" : "#1A1814";
  const inkA = (o) => dark ? `rgba(243,241,248,${o})` : `rgba(26,24,20,${o})`;
  const accentLight = dark ? `${accent}22` : `${accent}14`; // primary light — নির্বাচিত accent-এর হালকা tint, active/selected state-এর background-এ ব্যবহার হবে
  const neutralIconBg = dark ? "#242229" : "#F0EEF5"; // decorative icon/avatar background — purple নয়, neutral lavender-gray
  const neutralIconColor = dark ? "#B0ABC2" : "#6E6B7A"; // decorative icon color — muted purple-gray

  // ডেস্কটপ (≥1024px): বাম সাইডবার নেভিগেশন থাকবে, bottom dock হাইড হবে, আর content column
  // single-column-এই থাকবে কিন্তু zoom দিয়ে গোটা কনটেন্ট একসাথে বড় দেখানো হয় (অন্য অ্যাপগুলোর মতো)
  const isDesktop = breakpoint === "desktop";
  // আগে zoom 1.4 আর maxWidth cap 1080px ছিল — বড় স্ক্রিনে সবকিছু অনেক বেশি "চাপানো"/ঠাসা লাগছিল।
  // এখন একটু কমিয়ে আনা হলো, যাতে বড় দেখাবে কিন্তু ঘিঞ্জি না লাগে।
  // মোবাইলেও পুরো অ্যাপটা একটু ছোট (compact) দেখানোর জন্য সামান্য zoom-out (0.92x) প্রয়োগ করা হলো।
  const desktopZoom = isDesktop ? 1.18 : (breakpoint === "tablet" ? 1 : 0.97);
  const containerMaxWidth = isDesktop
    ? 1400
    : breakpoint === "tablet" ? 640 : 480;
  const containerPadding = isDesktop ? "24px 28px 36px" : breakpoint === "tablet" ? "22px 24px 28px" : "10px 16px 24px";

  const styles = {
    page: { minHeight: "100dvh", background: bg, color: textMain, fontFamily: lang === "bn" ? "'Noto Sans Bengali',sans-serif" : "'Inter','Helvetica Neue',sans-serif", transition: "background .22s ease,color .22s ease", display:"flex", flexDirection:"column", paddingTop:"var(--fg-safe-top, env(safe-area-inset-top))" },
    container: { maxWidth: containerMaxWidth, margin: "0 auto", padding: containerPadding, width:"100%", boxSizing:"border-box", flex:"1 0 auto", transition: "max-width .2s ease" },
  };

  // Keep the browser/Android UI (status bar + Chrome toolbar area) synced
  // with FocusGo's ACTUAL selected theme. This prevents the purple browser
  // bars that appear when the phone system theme differs from the app theme.
  // ব্যতিক্রম: focus timer fullscreen খোলা থাকলে এই বার কালো থাকবে (immersive mode),
  // বাকি সময় app-এর নিজস্ব light/dark theme অনুযায়ী রঙ ফিরে আসবে।
  useEffect(() => {
    try {
      const themeColor = focusFullscreen ? "#000000" : bg;

      document.documentElement.style.background = themeColor;
      document.body.style.background = themeColor;
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
      document.body.style.margin = "0";
      // overscrollBehaviorY:"contain" শুধু installed/native অ্যাপে (Capacitor বা "Add to
      // Home Screen" করা PWA) সেট করা হচ্ছে — সাধারণ ব্রাউজার ট্যাবে (Chrome-এ ঠিকানা বার
      // দেখা যায় এমন অবস্থায়) এটা সেট করা হচ্ছে না, যাতে ব্রাউজারের নিজস্ব "টেনে রিফ্রেশ"
      // (pull-to-refresh) গেসচার স্বাভাবিকভাবে কাজ করে। অ্যাপ মোডে যেহেতু কোনো address bar
      // নেই আর pull-to-refresh-এর কোনো ব্যবহারও নেই, তাই সেখানে শুধু bounce বন্ধ রাখা হচ্ছে
      // (আগের কালো ব্যাকগ্রাউন্ড reveal বাগ এড়াতে)।
      const isAppMode = Capacitor.isNativePlatform() || isStandaloneApp();
      document.documentElement.style.overscrollBehaviorY = isAppMode ? "contain" : "";
      document.body.style.overscrollBehaviorY = isAppMode ? "contain" : "";

      // Update <meta name=\"theme-color\"> dynamically. Chrome/Android uses
      // this for the browser/status/navigation UI around the web app.
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", themeColor);

      // Also update the light/dark variants if the browser supports them.
      let lightMeta = document.querySelector('meta[name="theme-color"][media*="light"]');
      let darkMeta = document.querySelector('meta[name="theme-color"][media*="dark"]');
      if (!lightMeta) {
        lightMeta = document.createElement("meta");
        lightMeta.name = "theme-color";
        lightMeta.media = "(prefers-color-scheme: light)";
        document.head.appendChild(lightMeta);
      }
      if (!darkMeta) {
        darkMeta = document.createElement("meta");
        darkMeta.name = "theme-color";
        darkMeta.media = "(prefers-color-scheme: dark)";
        document.head.appendChild(darkMeta);
      }
      lightMeta.setAttribute("content", themeColor);
      darkMeta.setAttribute("content", themeColor);

      // Native Android status bar (Capacitor) — app এর dark/light theme এর সাথে মিলিয়ে
      // status bar background আর icon color (dark/light) সেট করা হচ্ছে।
      // ওয়েবে (browser/Vercel) চললে এই কলগুলো চুপচাপ fail করবে, তাই .catch() দিয়ে ignore করা হলো।
      // Android 15 (targetSdk 35)+ এ এজ-টু-এজ বাধ্যতামূলক হওয়ায় setBackgroundColor অনেক সময় আর
      // কাজ করে না — status bar এর জায়গায় নিচের কনটেন্ট transparent হয়ে দেখা যায়, তাতে system-এর
      // default (হালকা) রঙ দেখা যেতে পারে। Focus টাইমার ফুলস্ক্রিন (immersive) মোডে তাই status bar
      // রঙ বদলানোর বদলে সরাসরি হাইড করে দেওয়া হচ্ছে — ফলাফল: উপর-নিচ সবটাই পুরোপুরি কালো।
      if (focusFullscreen) {
        StatusBar.hide().catch(() => {});
        // Android 15+ এজ-টু-এজ ডিভাইসে মাঝে মাঝে hide() একাই status bar এরিয়া পুরোপুরি সরাতে
        // পারে না (সিস্টেম ডিফল্ট হালকা রঙের একটা সরু স্ট্রিপ থেকে যেতে পারে)। তাই ব্যাকআপ হিসেবে
        // overlaysWebView(true) করা হচ্ছে, যাতে WebView (এখন কালো ব্যাকগ্রাউন্ড) সরাসরি status bar
        // এরিয়ার নিচ পর্যন্ত/মধ্য দিয়ে extend করে — hide() ব্যর্থ হলেও উপরটা কালোই দেখাবে।
        StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
        StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      } else {
        StatusBar.show().catch(()=>{});
        StatusBar.setOverlaysWebView({ overlay: false }).catch(()=>{});
        StatusBar.setBackgroundColor({ color: themeColor }).catch(()=>{});
        StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(()=>{});
      }

      // নিচের Android navigation bar (গেসচার বার) — এটা StatusBar প্লাগিনের আওতায় পড়ে না,
      // তাই আলাদাভাবে থিমের সাথে মিলিয়ে সেট করা হচ্ছে, যাতে নিচে কালো ফাঁকা অংশ না দেখায়।
      if (Capacitor.isNativePlatform()) {
        NavigationBar.setNavigationBarColor({ color: themeColor, darkButtons: !dark }).catch(()=>{});
      }
    } catch (e) { /* status-bar effect failed — ignore */ }
  }, [dark, bg, focusFullscreen]);

  // Native app খুললে notification permission চাওয়া হবে (একবারই) —
  // এটা না করলে Android নিজেই ধরে নেয় app টা কোনো notification পাঠায় না,
  // এবং system settings-এ toggle disabled/off দেখায়।
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setupNotifications().catch(() => {});
    }
  }, []);

  // Local Notifications-এর জন্য আলাদা পারমিশন — উপরেরটা (setupNotifications) সম্ভবত রিমোট/পুশ নোটিফিকেশনের জন্য,
  // কিন্তু "কালকে পরীক্ষা" রিমাইন্ডারটা ফোনেই শিডিউল হয়ে থাকা লোকাল নোটিফিকেশন, তাই এর পারমিশন আলাদাভাবে চাওয়া দরকার
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      LocalNotifications.requestPermissions().catch(() => {});
    }
  }, []);

  // Google Sign-In (native) — @capacitor-firebase/authentication google-services.json থেকে নিজে থেকেই
  // client id নেয়, তাই আলাদা করে initialize() কল করার দরকার নেই।

  // এক্সাম শিডিউল বদলালেই (যোগ/এডিট/ডিলিট) — আগে শিডিউল করা সব "পরীক্ষার আগের রাতের রিমাইন্ডার" ক্যানসেল করে,
  // বর্তমান examSchedule অনুযায়ী নতুন করে শিডিউল করা হয়। এভাবে সবসময় ডেটার সাথে নোটিফিকেশন সিঙ্কে থাকে।
  const scheduledExamNotifIdsRef = useRef([]); // আগের রানে কোন কোন notification id শিডিউল করা হয়েছিল, তার হিসাব
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !loaded) return;
    const REMINDER_HOUR = 20; // রাত ৮টা — এক্সামের আগের সন্ধ্যায় রিমাইন্ডার আসবে
    (async () => {
      try {
        // আগের সব এক্সাম-রিমাইন্ডার ক্যানসেল করা, যাতে ডিলিট/এডিট হওয়া এক্সামের পুরনো নোটিফিকেশন থেকে না যায়
        if (scheduledExamNotifIdsRef.current.length > 0) {
          await LocalNotifications.cancel({ notifications: scheduledExamNotifIdsRef.current.map(id => ({ id })) });
        }
        const newIds = [];
        const toSchedule = [];
        if (notificationsEnabled && examNotifEnabled) {
          examSchedule.forEach(ex => {
            if (!ex.date) return;
            const examDate = new Date(ex.date + "T00:00:00");
            const reminderAt = new Date(examDate);
            reminderAt.setDate(reminderAt.getDate() - 1);
            reminderAt.setHours(REMINDER_HOUR, 0, 0, 0);
            if (reminderAt.getTime() <= Date.now()) return; // সময় চলে গেলে আর শিডিউল করার দরকার নেই
            const id = examIdToNotifId(ex.id);
            newIds.push(id);
            toSchedule.push({
              id,
              title: lang === "bn" ? "📚 রিভিশন রিমাইন্ডার" : "📚 Revision Reminder",
              body: lang === "bn" ? `আগামীকাল পরীক্ষা: ${ex.subject} — রিভিশন শেষ করেছ?` : `Tomorrow's exam: ${ex.subject} — finished revising?`,
              schedule: { at: reminderAt },
            });
          });
        }
        if (toSchedule.length > 0) {
          await LocalNotifications.schedule({ notifications: toSchedule });
        }
        scheduledExamNotifIdsRef.current = newIds;
      } catch (e) { /* নেটিভ প্লাগইন না থাকলে (যেমন ব্রাউজারে) চুপচাপ ইগনোর করা হয় */ }
    })();
  }, [examSchedule, lang, loaded, notificationsEnabled, examNotifEnabled]);

  // টাস্ক রিমাইন্ডার — যেসব টাস্কে due date + reminder time (ঐচ্ছিক) সেট করা আছে, সেগুলোর জন্য ঠিক সেই মুহূর্তে
  // লোকাল নোটিফিকেশন শিডিউল হয়। tasks বদলালেই (add/edit/delete/done) আগের সব টাস্ক-রিমাইন্ডার ক্যানসেল করে
  // নতুন করে শিডিউল করা হয়, তাই সবসময় বর্তমান ডেটার সাথে সিঙ্কে থাকে।
  const scheduledTaskNotifIdsRef = useRef([]);
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !loaded) return;
    (async () => {
      try {
        if (scheduledTaskNotifIdsRef.current.length > 0) {
          await LocalNotifications.cancel({ notifications: scheduledTaskNotifIdsRef.current.map(id => ({ id })) });
        }
        const newIds = [];
        const toSchedule = [];
        if (notificationsEnabled && taskNotifEnabled) {
          tasks.forEach(task => {
            if (task.done || !task.dueDate || !task.reminderTime) return;
            const [hh, mm] = task.reminderTime.split(":").map(Number);
            const at = new Date(task.dueDate + "T00:00:00");
            at.setHours(hh, mm, 0, 0);
            if (at.getTime() <= Date.now()) return; // সময় চলে গেলে আর শিডিউল করার দরকার নেই
            const id = strToNotifId(`task_${task.id}`);
            newIds.push(id);
            toSchedule.push({
              id,
              title: lang === "bn" ? "✅ টাস্ক রিমাইন্ডার" : "✅ Task Reminder",
              body: task.title,
              schedule: { at },
            });
          });
        }
        if (toSchedule.length > 0) {
          await LocalNotifications.schedule({ notifications: toSchedule });
        }
        scheduledTaskNotifIdsRef.current = newIds;
      } catch (e) { /* নেটিভ প্লাগইন না থাকলে (যেমন ব্রাউজারে) চুপচাপ ইগনোর করা হয় */ }
    })();
  }, [tasks, lang, loaded, notificationsEnabled, taskNotifEnabled]);

  // সালাতের সময় শুরু হলে নোটিফিকেশন — প্রতিটা ওয়াক্ত শুরুর মুহূর্তে একটা লোকাল নোটিফিকেশন শিডিউল হয়।
  // salahTimes বদলালেই (লোকেশন/মাযহাব/দিন বদল) আগের শিডিউল করা সালাত-নোটিফিকেশন ক্যানসেল করে নতুন করে শিডিউল করা হয়।
  const scheduledSalahNotifIdsRef = useRef([]);
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !loaded) return;
    (async () => {
      try {
        if (scheduledSalahNotifIdsRef.current.length > 0) {
          await LocalNotifications.cancel({ notifications: scheduledSalahNotifIdsRef.current.map(id => ({ id })) });
        }
        const newIds = [];
        const toSchedule = [];
        if (notificationsEnabled && salahNotifEnabled && salahFeatureEnabled && salahTimes) {
          salahTimes.forEach(w => {
            if (!w.start || w.start.getTime() <= Date.now()) return; // সময় চলে গেলে আর শিডিউল করার দরকার নেই
            const id = strToNotifId(`salah_${w.key}_${todayKey}`);
            newIds.push(id);
            toSchedule.push({
              id,
              title: lang === "bn" ? "🕌 নামাজের সময় হয়েছে" : "🕌 Prayer Time",
              body: lang === "bn" ? `${w.label}-এর ওয়াক্ত শুরু হয়েছে` : `It's time for ${w.label}`,
              schedule: { at: w.start },
            });
          });
        }
        if (toSchedule.length > 0) {
          await LocalNotifications.schedule({ notifications: toSchedule });
        }
        scheduledSalahNotifIdsRef.current = newIds;
      } catch (e) { /* নেটিভ প্লাগইন না থাকলে (যেমন ব্রাউজারে) চুপচাপ ইগনোর করা হয় */ }
    })();
  }, [salahTimes, todayKey, lang, loaded, notificationsEnabled, salahNotifEnabled, salahFeatureEnabled]);


  // Firebase এখনো auth স্টেট জানায়নি — একটা ছোট লোডিং স্ক্রিন
  if (!authChecked) {
    return (
      <div style={{
        minHeight:"100dvh",
        width:"100%",
        background:dark ? "#11100F" : "#FFFFFF",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        overflow:"hidden",
        fontFamily:lang === "bn" ? "'Noto Sans Bengali',sans-serif" : "'Inter','Helvetica Neue',sans-serif",
      }}>
        <div style={{
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
          justifyContent:"center",
          gap:16,
          animation:"fg-splash-in .22s ease-out"
        }}>
          <img
            src="/app-icon.png"
            alt="FocusGo"
            style={{
              width:"clamp(104px, 30vw, 150px)",
              height:"clamp(104px, 30vw, 150px)",
              objectFit:"contain",
              display:"block"
            }}
          />
          <div style={{
            fontSize:13.5,
            fontWeight:700,
            letterSpacing:".08em",
            color:dark ? "#B8B1A7" : "#8E877C"
          }}>
            FocusGo
          </div>
        </div>
        <style>{`
          @keyframes fg-splash-in {
            from { opacity:0; transform:scale(.96); }
            to { opacity:1; transform:scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // লগইন করা নেই আর গেস্ট মোডও না — Email/Password (বা Google) দিয়ে লগইন/সাইন-আপ স্ক্রিন দেখানো, সাথে "একাউন্ট ছাড়াই ব্যবহার করুন" অপশন
  if (!user && !isGuest) {
    return <AuthScreen t={t} lang={lang} cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}
      onGuest={() => { setIsGuest(true); }} />;
  }

  // লগইন/গেস্ট হয়ে গেছে কিন্তু এই ডিভাইসে আগে অনবোর্ডিং দেখানো হয়নি — একবারই দেখানো হবে
  if (!onboardingDone) {
    return <OnboardingScreen lang={lang} dark={dark} cardBg={cardBg} textMain={textMain} textMuted2={textMuted2} accent={accent}
      onDone={finishOnboarding} />;
  }

  // লগইন হয়ে গেছে কিন্তু Firestore থেকে ডেটা এখনো আসেনি
  if (!loaded) {
    return (
      <div style={{
        ...styles.page,
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        minHeight:"100dvh"
      }}>
        <div style={{
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
          gap:16,
          animation:"fg-splash-in .22s ease-out"
        }}>
          <img
            src="/app-icon.png"
            alt="FocusGo"
            style={{
              width:"clamp(92px, 27vw, 135px)",
              height:"clamp(92px, 27vw, 135px)",
              objectFit:"contain",
              display:"block"
            }}
          />
          <div style={{
            fontSize:12.5,
            fontWeight:700,
            letterSpacing:".08em",
            color:textMuted2
          }}>
            Loading your data…
          </div>
        </div>
        <style>{`
          @keyframes fg-splash-in {
            from { opacity:0; transform:scale(.96); }
            to { opacity:1; transform:scale(1); }
          }
        `}</style>
      </div>
    );
  }


  return (
    <div style={{...styles.page, flexDirection: isDesktop ? "row" : "column", zoom: `${textScale}%`}}>
      <style>{`
        :root {
          --text: ${textMain};
          --muted: ${textMuted2};
          --strong: ${textMain};
          --track: ${cardBorder};
          --card-bg: ${cardBg};
        }
        html, body { margin:0; padding:0; background:${bg}; ${(Capacitor.isNativePlatform() || isStandaloneApp()) ? "overscroll-behavior-y: contain;" : ""} }
        #root, #__next { background:${bg}; ${(Capacitor.isNativePlatform() || isStandaloneApp()) ? "overscroll-behavior-y: contain;" : ""} }
        * { -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none; }

        /* ---- design tokens: titles / section headers / body labels / circular buttons / dividers ---- */
        .fg-title {
          font-family: 'Inter Tight', 'Inter', 'Helvetica Neue', sans-serif;
          font-size: 22px; line-height: 28px; font-weight: 600; letter-spacing: -0.7px;
          color: var(--text); margin: 0;
        }
        .fg-section-header {
          font-family: 'Inter Tight', 'Inter', 'Helvetica Neue', sans-serif;
          font-size: 19px; line-height: 24px; font-weight: 600; letter-spacing: -0.6px;
          color: var(--text); margin: 0;
        }
        .fg-body-label {
          font-family: 'Inter Tight', 'Inter', 'Helvetica Neue', sans-serif;
          font-size: 14.5px; line-height: 18px; font-weight: 400; letter-spacing: 0.3px;
          color: var(--text); margin: 0;
        }
        .fg-body-label--muted { color: var(--muted); }

        .fg-divider { height: 1px; width: 100%; background: var(--track); border: none; margin: 0; }
        .fg-task-row + .fg-task-row { border-top: 1px solid var(--track); }

        .fg-btn-circle {
          -webkit-appearance: none; appearance: none;
          width: 42px; height: 42px; border-radius: 50%; border: none; padding: 0;
          display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
          background: var(--card-bg); color: var(--strong); cursor: pointer;
          box-shadow: inset 0 1px 0 ${dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.65)"},
                      inset 0 -1px 2px rgba(0,0,0,${dark ? "0.35" : "0.05"}),
                      0 2px 6px rgba(0,0,0,${dark ? "0.4" : "0.09"}),
                      0 1px 2px rgba(0,0,0,${dark ? "0.3" : "0.05"});
          transition: transform .16s cubic-bezier(0.16,1,0.3,1), box-shadow .2s ease;
        }
        .fg-btn-circle:active:not(:disabled) { transform: scale(0.94); }
        .fg-btn-circle--sm { width: 29px; height: 29px; }
        .fg-btn-circle--lg { width: 46px; height: 46px; }

        .fg-card-flat {
          border: none; border-radius: 14px; background: var(--card-bg);
          box-shadow: 0 1px 2px rgba(0,0,0,${dark ? "0.4" : "0.04"}),
                      0 8px 20px rgba(0,0,0,${dark ? "0.35" : "0.06"});
        }
        .fg-card-deep {
          border: none; border-radius: 18px; background: var(--card-bg);
          box-shadow: 0 2px 4px rgba(0,0,0,${dark ? "0.45" : "0.05"}),
                      0 14px 32px rgba(0,0,0,${dark ? "0.4" : "0.09"});
        }

        /* ---- subtle motion: tab switches, buttons, cards ---- */
        @keyframes fg-fade-up { from { opacity:0; transform:translateY(7px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fg-fade { from { opacity:0; } to { opacity:1; } }
        @keyframes fg-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        .fg-spin { animation: fg-spin .8s linear infinite; }
        .fg-tab-panel { animation: fg-fade-up .32s cubic-bezier(0.16,1,0.3,1); }
        button { transition: transform .16s cubic-bezier(0.16,1,0.3,1), opacity .16s ease, background-color .2s ease, box-shadow .2s ease; }
        button:active:not(:disabled) { transform: scale(0.96); }
        .fg-card { transition: transform .16s cubic-bezier(0.16,1,0.3,1), box-shadow .2s ease, border-color .2s ease; }
        .fg-card:active { transform: scale(0.985); }
        input:focus, select:focus, textarea:focus { outline: 2px solid rgba(217,119,87,0.30); outline-offset: 1px; transition: outline-color .15s ease; }
        .fg-week-strip { scrollbar-width: none; -ms-overflow-style: none; }
        .fg-week-strip::-webkit-scrollbar { display: none; }
        .fg-chip-row { scrollbar-width: none; -ms-overflow-style: none; }
        .fg-chip-row::-webkit-scrollbar { display: none; }

        /* ---- micro-interactions: timer / task completion / progress ---- */
        @keyframes fg-pulse-soft { 0%, 100% { opacity:1; text-shadow: 0 0 0 rgba(217,119,87,0); } 50% { opacity:0.82; text-shadow: 0 0 22px rgba(217,119,87,0.35); } }
        .fg-timer-running { animation: fg-pulse-soft 2.2s ease-in-out infinite; }
        @keyframes fg-check-pop { 0% { transform:scale(0.6); } 60% { transform:scale(1.15); } 100% { transform:scale(1); } }
        .fg-check-pop { animation: fg-check-pop .28s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes fg-ring-pop { 0% { transform:scale(1); } 50% { transform:scale(1.06); } 100% { transform:scale(1); } }
        .fg-ring-pop { animation: fg-ring-pop .35s cubic-bezier(0.34,1.56,0.64,1); }

        /* ---- bottom-sheet modals (New task, Settings, ইত্যাদি) — নিচ থেকে স্মুথলি স্লাইড করে উঠবে,
           backdrop আলাদাভাবে ফেড হবে, যাতে "ঝাঁকুনি" না লেগে একটাই মসৃণ মোশন মনে হয় ---- */
        @keyframes fg-sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fg-backdrop-in { from { opacity:0; } to { opacity:1; } }
        .fg-sheet-backdrop { animation: fg-backdrop-in .18s ease-out; }
        .fg-sheet { animation: fg-sheet-up .26s cubic-bezier(0.16,1,0.3,1); will-change: transform; }
      `}</style>
      {isDesktop && !sidebarHidden && (
        <DesktopSidebar t={t} tab={tab} setTab={setTab} vibrate={vibrate} dark={dark} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(v => !v)} onHideAll={() => setSidebarHidden(true)}
          studyFeatureEnabled={studyFeatureEnabled} tasksFeatureEnabled={tasksFeatureEnabled} />
      )}
      {isDesktop && sidebarHidden && (
        <div style={{ width: 40, flexShrink: 0, borderRight: `1px solid ${cardBorder}`, display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 8px", position: "sticky", top: 0, height: "100dvh", boxSizing: "border-box" }}>
          <button type="button" onClick={() => { vibrate(); setSidebarHidden(false); }} title="সাইডবার দেখান"
            style={{ border: `1px solid ${cardBorder}`, background: cardBg, color: textMuted2, borderRadius:8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Eye size={14} />
          </button>
        </div>
      )}
      <div style={{flex:"1 1 auto", display:"flex", flexDirection:"column", minWidth:0, zoom: desktopZoom}}>
      <div style={styles.container}>
        {/* Header row: logo | toggles (search circular icon next to bell, like before) */}
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8}}>
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <button onClick={()=>{vibrate(); setTab("today");}} title={t.tabs.today}
              style={{display:"flex", alignItems:"center", gap:10, border:"none", background:"transparent", cursor:"pointer", padding:0}}>
              <img src={dark ? LOGO_FULL_DARK : LOGO_FULL} alt="FocusGo" style={{height:32, width:"auto", objectFit:"contain"}}/>
            </button>
          </div>

          <div style={{display:"flex", alignItems:"center", gap:6}}>
            {!isOnline && (
              <div title={t.offlineNote} style={{display:"flex", alignItems:"center", gap:4, background: dark?"#242424":"#F8F5EE", color:textMuted2, borderRadius:14, padding:"5px 9px 5px 8px", fontSize:11.5, fontWeight:700, flexShrink:0}}>
                <WifiOff size={12}/> {t.offlineBadge}
              </div>
            )}
            <button onClick={()=>{vibrate(); setShowSearch(true);}}
              title={lang==="bn" ? "খুঁজুন" : "Search"}
              className="fg-btn-circle fg-btn-circle--sm"
              style={{display: tab === "today" ? "none" : "flex"}}>
              <Search size={13} strokeWidth={1.8}/>
            </button>
            {salahFeatureEnabled && (
              <button
                onClick={() => { vibrate(); setShowSalahDropdown(v => !v); if (!salahCoords) requestSalahLocation(); }}
                title={lang === "bn" ? "সালাতের সময়" : "Salah times"}
                className="fg-btn-circle fg-btn-circle--sm">
                <MosqueIcon size={14} color="currentColor"/>
              </button>
            )}
            <NotificationBell
              t={t} lang={lang} notifications={notifications}
              onMarkAllRead={()=>setNotifications(prev => prev.map(n => ({...n, read:true})))}
              onClear={()=>setNotifications([])}
              cardBorder={cardBorder} cardBg={cardBg} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}
            />
            <div style={{position:"relative", flexShrink:0}}>
              <button onClick={()=>{vibrate(); setSettingsInitialOpenCard(null); setSettingsInitialAction(null); setShowProfilePage(true);}}
                title={t.settings}
                className="fg-btn-circle fg-btn-circle--sm">
                <Settings size={14}/>
              </button>
            </div>
          </div>
        </div>

        {/* Today tab-এর top search bar — ট্যাপ করলে বিদ্যমান Universal Search মডাল খোলে
            (টাস্ক/নোট/সাবজেক্ট/পরীক্ষা একসাথে খোঁজার জন্য যেটা আগে থেকেই আছে)।
            ডানপাশের sliders আইকনটা আলাদা বাটন — এটাতে ট্যাপ করলে sort মেনু খোলে, সেই sort
            অনুযায়ী Universal Search-এর টাস্ক রেজাল্ট সাজানো হবে। */}
        {tab === "today" && (
        <div style={{marginTop:14, position:"relative"}}>
          <div style={{
              width:"100%", boxSizing:"border-box", display:"flex", alignItems:"center", gap:10,
              background: dark ? "rgba(255,255,255,0.06)" : "#FFFFFF",
              border:`1px solid ${cardBorder}`, borderRadius:16, padding:"12px 14px",
            }}>
            <button onClick={()=>{vibrate(); setShowSearch(true);}}
              style={{flex:1, minWidth:0, display:"flex", alignItems:"center", gap:10, textAlign:"left", border:"none", background:"transparent", cursor:"pointer", fontFamily:"inherit", padding:0}}>
              <Search size={17} color={textMuted2} strokeWidth={2} style={{flexShrink:0}}/>
              <span style={{flex:1, minWidth:0, fontSize:13.5, color:textMuted2, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                {lang==="bn" ? "টপিক, টাস্ক, সাবজেক্ট খুঁজুন..." : "Search topics, tasks, subjects..."}
              </span>
            </button>
            <span style={{width:1, height:18, background:cardBorder, flexShrink:0}}/>
            <button onClick={(e)=>{e.stopPropagation(); vibrate(); setShowSortMenu(v=>!v);}}
              title={lang==="bn" ? "সাজানোর ধরন" : "Sort order"}
              style={{border:"none", background:"transparent", cursor:"pointer", padding:2, display:"flex", flexShrink:0}}>
              <SlidersIcon size={16} color={accent}/>
            </button>
          </div>

          {showSortMenu && (() => {
            const sortOptions = [
              { key:"date", label: lang==="bn" ? "তারিখ/সময় অনুযায়ী" : "Date/time", Icon: Calendar },
              { key:"priority", label: lang==="bn" ? "প্রায়োরিটি (উচ্চ→নিম্ন)" : "Priority (high→low)", Icon: Flag },
              { key:"name", label: lang==="bn" ? "নাম অনুযায়ী (A-Z)" : "Name (A-Z)", Icon: ArrowUpDown },
              { key:"status", label: lang==="bn" ? "সম্পন্ন/অসম্পন্ন" : "Done/Not done", Icon: Check },
            ];
            return (
              <>
                <div style={{position:"fixed", inset:0, zIndex:59}} onClick={()=>setShowSortMenu(false)}/>
                <div style={{position:"absolute", top:"calc(100% + 6px)", right:0, zIndex:60, minWidth:210,
                    background: dark ? cardBg : "#FFFFFF", border:`1px solid ${cardBorder}`, borderRadius:14,
                    boxShadow:"0 8px 24px rgba(0,0,0,0.16)", padding:6}}>
                  {sortOptions.map(opt => {
                    const sel = searchSortMode === opt.key;
                    return (
                      <button key={opt.key} onClick={()=>{vibrate(); changeSearchSortMode(opt.key); setShowSortMenu(false);}}
                        style={{width:"100%", display:"flex", alignItems:"center", gap:9, border:"none", cursor:"pointer", fontFamily:"inherit",
                          background: sel ? (dark ? `${accent}22` : `${accent}14`) : "transparent", color: sel ? accent : textMain,
                          borderRadius:10, padding:"9px 10px", fontSize:12.5, fontWeight:600, textAlign:"left"}}>
                        <opt.Icon size={14} strokeWidth={2.3} style={{flexShrink:0}}/>
                        <span style={{flex:1}}>{opt.label}</span>
                        {sel && <Check size={13} strokeWidth={3}/>}
                      </button>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>
        )}

        {/* Date row — Today tab এর নিজস্ব অ্যাঙ্কর (weekday + বড় তারিখ + লাইভ ক্লক), তাই শুধু Today-তেই দেখানো হয়।
            Plan-এর নিজস্ব date-selector আছে বলে এখানে আলাদা "আজকের" হেডার লাগে না (দুই তারিখ পাশাপাশি দেখালে বিভ্রান্তি হয়),
            আর Stats/Exam-এ এর কোনো কাজ নেই — শুধু ছোট মোবাইল স্ক্রিনে জায়গা নিত এবং প্রতি সেকেন্ডে অপ্রয়োজনীয় re-render ঘটাত। */}
        {tab === "today" && (
        <div style={{marginTop:10, padding:"3px 0 5px", boxSizing:"border-box", position:"relative"}}>
          <div style={{marginBottom:2, position:"relative"}}>
            {(() => {
              const fullName = (user?.displayName || "").trim();
              const parts = fullName.split(/\s+/).filter(Boolean);
              // Md./Mr./Mrs./Miss/Ms./Dr. এই ধরনের honorific প্রথম word হিসেবে থাকলে বাদ দিয়ে তার পরের word-টাকে First Name ধরা হয়
              const HONORIFIC_RE = /^(md|mr|mrs|miss|ms|dr|mohammad|mohammed)\.?$/i;
              const firstName = parts.find(p => !HONORIFIC_RE.test(p)) || (lang === "bn" ? "বন্ধু" : "Friend");
              const dayHash = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 86400000);

              // আজকের study progress অনুযায়ী motivation-এর টোন ঠিক করা হয় — শুরু/চলমান/সম্পন্ন
              const doneToday = todayTopics.filter(x => x.done).length;
              const totalToday = todayTopics.length;
              const stage = totalToday === 0 ? "start" : (doneToday >= totalToday ? "done" : "progress");

              const pool = FOCUSGO_MOTIVATIONS[lang === "bn" ? "bn" : "en"][stage];
              // নাম উপরের বড় হেডিং-এই দেখানো হয় (উপরে ছোট করে সময়ভিত্তিক গ্রিটিং), তাই motivation লাইনের ভেতর থেকে {name} বাদ দিয়ে বাক্যটা পরিষ্কার করা হয়
              const line = pool[dayHash % pool.length]
                .replace("{name}", "")
                .replace(/\s*,\s*,/g, ",")
                .replace(/,\s*([.।])/g, "$1")
                .replace(/,\s*—/g, " —")
                .replace(/\s{2,}/g, " ")
                .trim();

              // সময় অনুযায়ী গ্রিটিং — Good morning / noon / afternoon / evening / night
              // সবসময় বাংলাদেশের সময় (Asia/Dhaka) অনুযায়ী হিসাব হয়, ইউজারের ডিভাইসের টাইমজোন যাই হোক না কেন
              const hr = parseInt(new Intl.DateTimeFormat("en-US", { hour: "2-digit", hour12: false, timeZone: "Asia/Dhaka" }).format(now), 10) % 24;
              const greetKey = hr < 5 ? "night" : hr < 12 ? "morning" : hr < 14 ? "noon" : hr < 17 ? "afternoon" : hr < 21 ? "evening" : "night";
              const greetingEn = { morning: "Good Morning", noon: "Good Noon", afternoon: "Good Afternoon", evening: "Good Evening", night: "Good Night" }[greetKey];
              const greetingBn = { morning: "শুভ সকাল", noon: "শুভ দুপুর", afternoon: "শুভ বিকেল", evening: "শুভ সন্ধ্যা", night: "শুভ রাত্রি" }[greetKey];
              // সময়ভিত্তিক subtle gradient + icon — greeting card-টাকে আরেকটু জীবন্ত করতে
              const greetTheme = {
                morning:   { grad: dark ? "rgba(224,168,58,0.10)" : "#E0A83A0F", Icon: Sun,  iconColor: "#E0A83A" },
                noon:      { grad: dark ? "rgba(237,236,242,0.10)" : "#1A18140F", Icon: Sun,  iconColor: dark ? "#F3F1F8" : "#1A1814" },
                afternoon: { grad: `${accent}${dark ? "18" : "0F"}`, Icon: Sun,  iconColor: accent },
                evening:   { grad: dark ? "rgba(155,107,158,0.11)" : "#9B6B9E0F", Icon: Moon, iconColor: "#9B6B9E" },
                night:     { grad: dark ? "rgba(75,90,150,0.12)" : "#4B5A960F", Icon: Moon, iconColor: dark ? "#8FA0E0" : "#4B5A96" },
              }[greetKey];

              const GreetIcon = greetTheme.Icon;
              return (
                <>
                  <div style={{
                    padding:"10px 14px 9px", marginBottom:0, position:"relative", borderRadius:18,
                    background: dark
                      ? `linear-gradient(135deg, ${greetTheme.grad}, transparent 70%)`
                      : `linear-gradient(135deg, ${greetTheme.grad}, #FFFFFF 75%)`,
                  }} ref={salahMenuRef}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:8}}>
                      <div style={{minWidth:0, flex:1}}>
                        <div
                          onClick={() => { vibrate(); setShowWeatherModal(true); if (!salahCoords) requestSalahLocation(); }}
                          style={{fontSize:12.5, fontWeight:600, color:accent, letterSpacing:0.2, marginBottom:3, display:"flex", alignItems:"center", gap:6, cursor:"pointer"}}
                          title={lang === "bn" ? "আবহাওয়া দেখুন" : "View weather"}
                        >
                          <GreetIcon size={13} color={greetTheme.iconColor} strokeWidth={2.2}/>
                          {lang === "bn" ? greetingBn : greetingEn}
                          {weatherData && weatherData.temp != null && (
                            <span
                              onClick={(e) => { e.stopPropagation(); vibrate(); setShowWeatherModal(true); if (!salahCoords) requestSalahLocation(); }}
                              style={{display:"inline-flex", alignItems:"center", fontSize:12.5, fontWeight:600, color:accent, cursor:"pointer"}}
                              title={lang === "bn" ? "আবহাওয়া দেখুন" : "View weather"}
                            >
                              · <Num>{nf(weatherData.temp)}</Num>°C
                            </span>
                          )}
                        </div>
                        <div style={{fontSize:21,fontWeight:600,letterSpacing:-0.5,color:"var(--text)", fontFamily:"'Inter Tight','Inter','Helvetica Neue',sans-serif", display:"inline-block"}}>
                          {firstName}
                        </div>
                      </div>
                      <div style={{display:"flex", alignItems:"center", gap:10, flexShrink:0}}>
                        {/* মিনিমাল ডেট ব্যাজ — উপরে ছোট করে দিনের নাম + মাস, নিচে accent রঙের সার্কেলের মধ্যে আজকের তারিখ। ট্যাপ করলে ফুল ক্যালেন্ডার খোলে, সময় আর দেখানো হয় না — সবসময় সবচেয়ে ডানে থাকবে */}
                        <button onClick={()=>{vibrate(); setShowCalendar(true); setCalMonth(new Date());}} style={{display:"flex", flexDirection:"column", alignItems:"center", gap:4, border:"none", background:"transparent", padding:0, cursor:"pointer", position:"relative"}}>
                          <span style={{fontSize:9.5, fontWeight:600, color:"var(--muted)", letterSpacing:0.1, whiteSpace:"nowrap"}}>
                            {weekdayShort(today)}, {monthShort(today.getMonth())}
                          </span>
                          <span style={{width:32, height:32, borderRadius:"50%", background:accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#FFFFFF"}}>
                            <Num>{nf(today.getDate())}</Num>
                          </span>
                          {examDateKeys.has(todayKey) && (
                            <span style={{
                              position:"absolute", top:-2, left:-10,
                              width:7, height:7, borderRadius:"50%",
                              background:"#C0392B",
                              border:`1.5px solid ${dark ? cardBg : "#FFFFFF"}`,
                            }}/>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                    {salahFeatureEnabled && showSalahDropdown && (
                      <div onClick={() => setShowSalahDropdown(false)} style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:70}}>
                        <div onClick={(e) => e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:420, maxHeight:"85vh", overflowY:"auto", WebkitOverflowScrolling:"touch", borderRadius:"14px 14px 0 0", padding:"8px 16px 18px", color:textMain}}>
                          <div style={{width:32, height:3.5, borderRadius:4, background:cardBorder, margin:"2px auto 10px"}}/>

                          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10}}>
                            <div style={{minWidth:0}}>
                              <div style={{fontSize:15, fontWeight:800, color:textMain}}>{lang === "bn" ? "সালাতের সময়" : "Salah Times"}</div>
                              <div style={{display:"flex", alignItems:"center", gap:5, marginTop:2, minHeight:14}}>
                                <MapPin size={11} color={textMuted2} strokeWidth={2.4}/>
                                <span style={{fontSize:12.5, color:textMuted2, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                                  {salahLocLoading
                                    ? (lang === "bn" ? "লোকেশন খোঁজা হচ্ছে…" : "Getting location…")
                                    : salahCoords
                                      ? [salahLocationName, hijriDateLabel].filter(Boolean).join(" · ")
                                      : (lang === "bn" ? "লোকেশন সেট করা নেই" : "Location not set")}
                                </span>
                              </div>
                            </div>
                            {/* লোকেশন আইকন — ক্লিক করলে লাইভ লোকেশন নেয়া/আপডেট হবে; সেট থাকলে accent রঙে দেখাবে */}
                            <button
                              onClick={(e) => { e.stopPropagation(); vibrate(); requestSalahLocation(); }}
                              disabled={salahLocLoading}
                              title={
                                salahLocLoading
                                  ? (lang === "bn" ? "লোকেশন খোঁজা হচ্ছে…" : "Getting location…")
                                  : salahCoords
                                    ? (lang === "bn" ? "লোকেশন পরিবর্তন করুন" : "Change location")
                                    : (lang === "bn" ? "লাইভ লোকেশন নিন" : "Get live location")
                              }
                              style={{
                                width:28, height:28, borderRadius:"50%", flexShrink:0, border:"none", padding:0,
                                background: salahCoords ? accent : (dark ? "#242229" : "#F0EEF5"),
                                display:"flex", alignItems:"center", justifyContent:"center",
                                cursor: salahLocLoading ? "default" : "pointer",
                                opacity: salahLocLoading ? 0.55 : 1,
                                transition:"background .18s ease, opacity .18s ease",
                              }}
                            >
                              <MapPin size={13.5} color={salahCoords ? "#fff" : textMuted2} strokeWidth={2.4}/>
                            </button>
                          </div>

                          {!salahCoords && !salahLocLoading && (
                            <div style={{marginTop:10, fontSize:12.5, color:textMuted2, lineHeight:1.5}}>
                              {salahLocError || (lang === "bn" ? "উপরের লোকেশন আইকনে ট্যাপ করে আপনার এলাকা সেট করুন।" : "Tap the location icon above to set your area.")}
                            </div>
                          )}
                          {salahCoords && salahLocError && (
                            <div style={{marginTop:10, fontSize:13, color:"#C0392B", lineHeight:1.5}}>{salahLocError}</div>
                          )}
                          {/* পারমিশন permanently denied থাকলে সরাসরি অ্যাপের সিস্টেম সেটিংস স্ক্রিনে নিয়ে যাওয়ার বাটন —
                              ইউজারকে নিজে থেকে অ্যাপ ইনফো > পারমিশন-এ গিয়ে খুঁজে বের করতে হবে না */}
                          {salahPermDenied && Capacitor.isNativePlatform() && (
                            <button
                              onClick={openLocationSettings}
                              style={{
                                marginTop:10, width:"100%", border:"none", borderRadius:12, padding:"10px 0",
                                background: accent, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer",
                              }}
                            >
                              {lang === "bn" ? "সেটিংস থেকে লোকেশন অন করুন" : "Enable location in Settings"}
                            </button>
                          )}

                          {salahCoords && salahTimes && (
                            <>
                              {/* পরবর্তী নামাজের কাউন্টডাউন */}
                              {nextSalahCountdown && (
                                <div style={{marginTop:10, background: accent, borderRadius:14, padding:"9px 13px", display:"flex", alignItems:"center", justifyContent:"space-between", color:"#fff"}}>
                                  <div>
                                    <div style={{fontSize:10, fontWeight:700, opacity:0.85, letterSpacing:0.4}}>{lang === "bn" ? "পরবর্তী" : "UP NEXT"}</div>
                                    <div style={{fontSize:14.5, fontWeight:800, marginTop:1}}>
                                      {lang === "bn" ? `${nextSalahCountdown.label} — বাকি ${nextSalahCountdown.text}` : `${nextSalahCountdown.label} in ${nextSalahCountdown.text}`}
                                    </div>
                                  </div>
                                  <Bell size={15} strokeWidth={2.2} style={{opacity:0.9, flexShrink:0}}/>
                                </div>
                              )}

                              {/* আসরের হিসাব: হানাফি / শাফি */}
                              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12, marginBottom:2}}>
                                <span style={{fontSize:10, fontWeight:800, color:textMuted2, letterSpacing:0.4}}>{lang === "bn" ? "আসরের হিসাব" : "ASR CALCULATION"}</span>
                                <div style={{display:"flex", background: dark ? "#242229" : "#F0EEF5", borderRadius:999, padding:2}}>
                                  {["hanafi","shafi"].map(mkey => (
                                    <button key={mkey} onClick={() => { vibrate(); setSalahMadhab(mkey); }} style={{
                                      border:"none", padding:"4px 10px", borderRadius:999, fontSize:10.5, fontWeight:800, cursor:"pointer",
                                      background: salahMadhab === mkey ? accent : "transparent",
                                      color: salahMadhab === mkey ? "#fff" : textMuted2,
                                    }}>{mkey === "hanafi" ? (lang === "bn" ? "হানাফি" : "Hanafi") : (lang === "bn" ? "শাফি" : "Shafi")}</button>
                                  ))}
                                </div>
                              </div>

                              <div style={{marginTop:6}}>
                                {salahTimes.map(w => {
                                  const isActive = w.key === activeSalahKey;
                                  const isDone = todaySalahDone.includes(w.key);
                                  return (
                                    <div key={w.key} style={{
                                      display:"flex", justifyContent:"space-between", alignItems:"center", gap:8,
                                      padding:"7px 9px", borderRadius:12, marginBottom:3, transition:"background .2s ease, border-color .2s ease",
                                      background: isDone ? (dark ? "rgba(78,144,104,0.14)" : "#EEF4EC") : isActive ? (dark ? "rgba(217,119,87,0.16)" : "#EFEBF7") : "transparent",
                                      border: `1px solid ${isDone ? (dark ? "rgba(78,144,104,0.35)" : "#D7E6D2") : isActive ? (dark ? "rgba(217,119,87,0.4)" : "#F0CBB8") : "transparent"}`,
                                    }}>
                                      <span style={{display:"flex", alignItems:"center", gap:8, minWidth:0}}>
                                        {/* সালাত আদায় হয়ে গেলে এখানে ট্যাপ করে টিক দেওয়া যায় — প্রতিদিনের হিসাব আলাদাভাবে সেভ থাকে */}
                                        <button
                                          onClick={(e) => { e.stopPropagation(); toggleSalahDone(w.key); }}
                                          title={isDone ? (lang === "bn" ? "আদায় হয়েছে — বাতিল করতে ট্যাপ করুন" : "Marked done — tap to undo") : (lang === "bn" ? "আদায় হলে টিক দিন" : "Tap to mark as prayed")}
                                          style={{
                                            width:21, height:21, borderRadius:"50%", flexShrink:0, padding:0, cursor:"pointer",
                                            border: isDone ? "none" : `2px solid ${isActive ? accent : cardBorder}`,
                                            background: isDone ? "#4E9068" : "transparent",
                                            display:"flex", alignItems:"center", justifyContent:"center",
                                            transition:"background .18s ease, border-color .18s ease",
                                            boxShadow: isDone ? "0 2px 6px rgba(78,144,104,0.35)" : "none",
                                          }}
                                        >
                                          {isDone && <Check size={11.5} color="#fff" strokeWidth={3.2}/>}
                                        </button>
                                        <span style={{
                                          color: isDone ? "#4E9068" : isActive ? accent : textMain,
                                          fontWeight: isActive ? 700 : 600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                                          fontSize:13.5,
                                        }}>{w.label}</span>
                                      </span>
                                      <span style={{color: isDone ? "#4E9068" : isActive ? accent : textMuted2, fontWeight: isActive ? 700 : 500, fontSize:12, fontVariantNumeric:"tabular-nums", flexShrink:0, opacity: isDone ? 0.85 : 1}}>
                                        {fmtSalahTime(w.start)} – {fmtSalahTime(w.end)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* নিচে: আজকের প্রগ্রেস ডট + কিবলার দিক */}
                              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:10, paddingTop:8, borderTop:"1px solid var(--track)"}}>
                                <div style={{display:"flex", alignItems:"center", gap:7}}>
                                  <div style={{display:"flex", gap:3}}>
                                    {salahTimes.map(w => (
                                      <div key={w.key} style={{width:6, height:6, borderRadius:"50%", background: todaySalahDone.includes(w.key) ? "#4E9068" : cardBorder}}/>
                                    ))}
                                  </div>
                                  <span style={{fontSize:11.5, fontWeight:700, color:textMuted2}}>{nf(todaySalahDone.length)}/5 {lang === "bn" ? "আজ" : "today"}</span>
                                </div>
                                {qiblaBearing != null && (
                                  <span title={lang === "bn" ? "কিবলার দিক (উত্তর থেকে)" : "Qibla direction (from North)"} style={{display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:800, color:accent}}>
                                    <Compass size={13} strokeWidth={2.3}/> {lang === "bn" ? "কিবলা" : "Qibla"} {nf(qiblaBearing)}°
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ওয়েদার — Salah dropdown-এর মতোই bottom-sheet, একই লোকেশন (salahCoords) ব্যবহার করে */}
                    {showWeatherModal && (
                      <div onClick={() => setShowWeatherModal(false)} style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:70}}>
                        <div onClick={(e) => e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:420, maxHeight:"85vh", overflowY:"auto", WebkitOverflowScrolling:"touch", borderRadius:"14px 14px 0 0", padding:"8px 16px 18px", color:textMain}}>
                          <div style={{width:32, height:3.5, borderRadius:4, background:cardBorder, margin:"2px auto 10px"}}/>

                          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10}}>
                            <div style={{minWidth:0}}>
                              <div style={{fontSize:15, fontWeight:800, color:textMain}}>{lang === "bn" ? "আবহাওয়া" : "Weather"}</div>
                              <div style={{display:"flex", alignItems:"center", gap:5, marginTop:2, minHeight:14}}>
                                <MapPin size={11} color={textMuted2} strokeWidth={2.4}/>
                                <span style={{fontSize:12.5, color:textMuted2, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                                  {salahLocLoading
                                    ? (lang === "bn" ? "লোকেশন খোঁজা হচ্ছে…" : "Getting location…")
                                    : salahCoords
                                      ? (salahLocationName || (lang === "bn" ? "লোকেশন সেট করা আছে" : "Location set"))
                                      : (lang === "bn" ? "লোকেশন সেট করা নেই" : "Location not set")}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); vibrate(); requestSalahLocation(); }}
                              disabled={salahLocLoading}
                              title={
                                salahLocLoading
                                  ? (lang === "bn" ? "লোকেশন খোঁজা হচ্ছে…" : "Getting location…")
                                  : salahCoords
                                    ? (lang === "bn" ? "লোকেশন পরিবর্তন করুন" : "Change location")
                                    : (lang === "bn" ? "লাইভ লোকেশন নিন" : "Get live location")
                              }
                              style={{
                                width:28, height:28, borderRadius:"50%", flexShrink:0, border:"none", padding:0,
                                background: salahCoords ? accent : (dark ? "#242229" : "#F0EEF5"),
                                display:"flex", alignItems:"center", justifyContent:"center",
                                cursor: salahLocLoading ? "default" : "pointer",
                                opacity: salahLocLoading ? 0.55 : 1,
                                transition:"background .18s ease, opacity .18s ease",
                              }}
                            >
                              <MapPin size={13.5} color={salahCoords ? "#fff" : textMuted2} strokeWidth={2.4}/>
                            </button>
                          </div>

                          {!salahCoords && !salahLocLoading && (
                            <div style={{marginTop:10, fontSize:12.5, color:textMuted2, lineHeight:1.5}}>
                              {salahLocError || (lang === "bn" ? "উপরের লোকেশন আইকনে ট্যাপ করে আপনার এলাকা সেট করুন।" : "Tap the location icon above to set your area.")}
                            </div>
                          )}
                          {salahCoords && salahLocError && (
                            <div style={{marginTop:10, fontSize:13, color:"#C0392B", lineHeight:1.5}}>{salahLocError}</div>
                          )}
                          {salahPermDenied && Capacitor.isNativePlatform() && (
                            <button
                              onClick={openLocationSettings}
                              style={{
                                marginTop:10, width:"100%", border:"none", borderRadius:12, padding:"10px 0",
                                background: accent, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer",
                              }}
                            >
                              {lang === "bn" ? "সেটিংস থেকে লোকেশন অন করুন" : "Enable location in Settings"}
                            </button>
                          )}

                          {salahCoords && weatherLoading && !weatherData && (
                            <div style={{marginTop:14, fontSize:13, color:textMuted2}}>
                              {lang === "bn" ? "আবহাওয়ার তথ্য আনা হচ্ছে…" : "Fetching weather…"}
                            </div>
                          )}
                          {weatherError && (
                            <div style={{marginTop:10, fontSize:13, color:"#C0392B", lineHeight:1.5}}>{weatherError}</div>
                          )}

                          {salahCoords && weatherData && weatherData.temp != null && (() => {
                            const info = weatherInfo(weatherData.code);
                            const WIcon = info.Icon;
                            const sunriseD = weatherData.sunrise ? new Date(weatherData.sunrise) : null;
                            const sunsetD = weatherData.sunset ? new Date(weatherData.sunset) : null;
                            return (
                              <>
                                <div style={{marginTop:14, background:`${accent}${dark ? "1E" : "0F"}`, borderRadius:14, padding:"16px 14px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                                  <div>
                                    <div style={{fontSize:32.5, fontWeight:800, color:textMain, letterSpacing:-1, lineHeight:1}}>
                                      <Num>{nf(weatherData.temp)}</Num>°C
                                    </div>
                                    <div style={{fontSize:13, fontWeight:600, color:textMuted2, marginTop:4}}>
                                      {lang === "bn" ? info.bn : info.en}
                                    </div>
                                  </div>
                                  <WIcon size={36} color={accent} strokeWidth={1.8}/>
                                </div>

                                {(sunriseD || sunsetD) && (
                                  <div style={{display:"flex", gap:8, marginTop:10}}>
                                    {sunriseD && (
                                      <div style={{flex:1, border:`1px solid ${cardBorder}`, borderRadius:12, padding:"9px 10px", display:"flex", alignItems:"center", gap:8}}>
                                        <Sun size={16} color="#E0A83A" strokeWidth={2}/>
                                        <div>
                                          <div style={{fontSize:10, fontWeight:700, color:textMuted2, letterSpacing:0.3}}>{lang === "bn" ? "সূর্যোদয়" : "SUNRISE"}</div>
                                          <div style={{fontSize:13, fontWeight:700, color:textMain}}>{fmtSalahTime(sunriseD)}</div>
                                        </div>
                                      </div>
                                    )}
                                    {sunsetD && (
                                      <div style={{flex:1, border:`1px solid ${cardBorder}`, borderRadius:12, padding:"9px 10px", display:"flex", alignItems:"center", gap:8}}>
                                        <Moon size={16} color={dark ? "#8FA0E0" : "#4B5A96"} strokeWidth={2}/>
                                        <div>
                                          <div style={{fontSize:10, fontWeight:700, color:textMuted2, letterSpacing:0.3}}>{lang === "bn" ? "সূর্যাস্ত" : "SUNSET"}</div>
                                          <div style={{fontSize:13, fontWeight:700, color:textMain}}>{fmtSalahTime(sunsetD)}</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                </>
              );
            })()}
          </div>

        </div>
        )}

        {/* Study Plan header — Stats এখন Study-র sub-section না, তাই এই হেডার শুধু Plan-এ দেখানো হয় */}
        {tab === "study" && studySection === "plan" && (
          <div className="fg-tab-panel" style={{marginTop:16, marginBottom:2}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:10}}>
              <div style={{minWidth:0}}>
                <div className="fg-title" style={{fontSize:21}}>{lang==="bn" ? "স্টাডি" : "Study"}</div>
                <div style={{fontSize:12.5, color:"var(--muted)", marginTop:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                  {lang==="bn" ? "তোমার পড়াশোনার যাত্রা ট্র্যাক করো" : "Track your learning journey"}
                </div>
              </div>
              <button onClick={()=>{vibrate(); setShowExamSchedule(true);}} className="fg-btn-circle fg-btn-circle--sm" style={{position:"relative"}} title={lang==="bn" ? "এক্সাম" : "Exam"}>
                <Calendar size={15} strokeWidth={2.1}/>
                {nearestUpcomingExam && (
                  <span style={{position:"absolute", top:2, right:3, width:6, height:6, borderRadius:"50%", background:"#C0392B", border:`1.5px solid ${cardBg}`}}/>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Stats header — এখন এটা সরাসরি নিজস্ব ট্যাব, Study-র কোনো sub-section না। একটাই টাইটেল + সাবটাইটেল
            (আগে নিচে Subject Progress কার্ডের উপরেও আরেকটা "Stats" টাইটেল ছিল — সেটা ডুপ্লিকেট বলে সরানো হয়েছে) */}
        {tab === "study" && studySection === "stats" && (
          <div className="fg-tab-panel" style={{marginTop:16, marginBottom:2}}>
            <div className="fg-title" style={{fontSize:21}}>{t.statsPageTitle}</div>
            <div style={{fontSize:13.5, color:textMuted2, fontWeight:500, marginTop:2}}>{t.statsPageSubtitle}</div>
          </div>
        )}

        {/* Focus Timer preview row — screenshot অনুযায়ী সাদা কার্ড, আইকন + টাইটেল + ডিউরেশন, Play বাটন আর chevron;
            ক্লিক করলে নতুন ফুল-স্ক্রিন Focus Timer পেজ (FocusTimerPage) খোলে। শুধু Study Plan-এ দেখানো হয় (Today ট্যাবে না —
            ওটা dashboard, টপিক বাছাইয়ের flow Study-তেই হয়)। */}
        {tab === "study" && studySection === "plan" && (
        <div className="fg-card fg-card-flat fg-tab-panel" style={{
          marginTop:8, padding:"14px 14px 12px", position:"relative", overflow:"hidden",
          background: dark
            ? `linear-gradient(135deg, ${accent}2E, var(--card-bg) 68%)`
            : `linear-gradient(135deg, ${accent}22, #FFFFFF 68%)`,
        }}>
          {/* সফট ভায়োলেট gradient-এর উপর দুটো ব্লব-শেপ — একটা accent-টিন্টেড, একটা সাদা/ট্রান্সপারেন্ট wave —
              wave-এর মতো লেয়ার্ড লুক দিতে; zIndex:-1 রাখা হয়েছে যাতে কার্ডের কন্টেন্টের পেছনে থাকে (overflow:hidden দিয়ে ক্লিপ করা) */}
          <div style={{position:"absolute", top:-46, right:-30, width:130, height:130, borderRadius:"50%", background: dark ? `${accent}1F` : `${accent}17`, zIndex:-1, pointerEvents:"none"}} />
          <div style={{position:"absolute", bottom:-70, right:-25, width:190, height:190, borderRadius:"50%", background: dark ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.6)", zIndex:-1, pointerEvents:"none"}} />
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:10}}>
            <div onClick={()=>{ vibrate(); setShowFocusTimerPage(true); }} style={{display:"flex", alignItems:"center", gap:12, minWidth:0, cursor:"pointer"}}>
              <div style={{position:"relative", width:42, height:42, flexShrink:0}}>
                <div style={{width:42, height:42, borderRadius:"50%", background: dark ? `${accent}29` : `${accent}1A`, display:"flex", alignItems:"center", justifyContent:"center", color:accent}}>
                  <Hourglass size={19}/>
                </div>
                {/* কর্নার ব্যাজ — বোঝাতে যে ট্যাপ করলে নতুন (ফুলস্ক্রিন) পেজ খোলে */}
                <div style={{position:"absolute", bottom:-2, right:-2, width:16, height:16, borderRadius:"50%", background:accent, border:`2px solid ${dark ? cardBg : "#FFFFFF"}`, display:"flex", alignItems:"center", justifyContent:"center"}}>
                  <ArrowUpRight size={9} color="#fff" strokeWidth={3}/>
                </div>
              </div>
              <div style={{textAlign:"left", minWidth:0}}>
                <div style={{fontSize:15, fontWeight:800, color:textMain, whiteSpace:"nowrap"}}>{t.focusTimer}</div>
                <div style={{fontSize:11.5, fontWeight:500, color:textMuted2, marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                  {lang==="bn" ? "মনোযোগী থাকো, কাজ শেষ করো।" : "Stay focused, get things done."}
                </div>
              </div>
            </div>
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0}}>
              <button onClick={(e)=>{ e.stopPropagation(); if (timerRunning) { toggleTimerRunning(); } else { selectTimerTopic(null); setFocusMode("timer"); setTimerRunning(true); setShowFocusTimerPage(true); playStartSound(); vibrate(); } }}
                style={{display:"flex", alignItems:"center", justifyContent:"center", background:accent, border:"none", borderRadius:"50%", width:44, height:44, color:"#fff", cursor:"pointer", flexShrink:0}}>
                {timerRunning ? <Pause size={17} fill="#fff"/> : <Play size={17} fill="#fff" style={{marginLeft:2}}/>}
              </button>
              <span style={{fontSize:11, fontWeight:700, color:textMain, whiteSpace:"nowrap"}}>
                {timerRunning ? (lang==="bn" ? "চলছে" : "Running") : (lang==="bn" ? "শুরু" : "Start")}
              </span>
            </div>
          </div>
          <div style={{display:"flex", gap:7, marginTop:12}}>
            {[25,30,45,60].map(m => {
              const sel = Math.round(timerTotal/60) === m;
              return (
                <button key={m} disabled={timerRunning} onClick={()=>{ vibrate(); setTimerTotal(m*60); setTimerSeconds(m*60); }}
                  style={{
                    flex:1, border:"none", fontFamily:"inherit", fontSize:12.5, fontWeight:600,
                    padding:"8px 0", borderRadius:999,
                    background: sel ? accent : (dark ? "rgba(255,255,255,0.08)" : "rgba(20,17,24,0.05)"),
                    color: sel ? "#FFFFFF" : textMuted2,
                    cursor: timerRunning ? "default" : "pointer",
                    opacity: (timerRunning && !sel) ? 0.5 : 1,
                    transition:"background .15s ease, color .15s ease"
                  }}>
                  <Num>{nf(m)}</Num> {t.minutes}
                </button>
              );
            })}
          </div>
        </div>
        )}

        {/* Today's study overview card - Today tab + Study tab (shown above Study Plan/Exam) — Option 2: circular progress, premium look
            এখন accent color ব্যবহার হচ্ছে (আগে dark teal ছিল, সেই রঙ Next Exam কার্ডে সরানো হয়েছে) */}
        {((tab === "today" && studyFeatureEnabled) || (tab === "study" && studySection === "plan")) && (() => {
          if (tab === "today") {
            const doneToday = todayTopics.filter(x => x.done).length;
            const totalToday = todayTopics.length;

            return (
              <div className="fg-tab-panel" style={{
                marginTop:10, background: dark ? cardBg : "#FFFFFF", borderRadius:16,
                padding:"14px 16px", position:"relative", overflow:"hidden",
                border:`1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(20,17,24,0.045)"}`,
                boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.32)" : "0 4px 18px rgba(32,34,43,0.06)",
                display:"flex", alignItems:"center", gap:12,
              }}>
                <div style={{display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0}}>
                  <span style={{width:38, height:38, borderRadius:"50%", background: dark?`${accent}29`:`${accent}1A`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                    <BookOpen size={18} color={accent}/>
                  </span>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:11.5, fontWeight:600, color:textMuted2}}>{lang === "bn" ? "আজ" : "Today"}</div>
                    <div style={{fontSize:15.5, fontWeight:700, color:textMain, letterSpacing:-0.2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                      {lang === "bn"
                        ? <><Num>{nf(doneToday)}</Num>/<Num>{nf(totalToday)}</Num> {t.doneCount}</>
                        : <><Num>{nf(doneToday)}</Num> of <Num>{nf(totalToday)}</Num> {t.doneCount.toLowerCase()}</>}
                    </div>
                    <div style={{fontSize:10.5, color:textMuted2, marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                      {totalToday === 0
                        ? (lang==="bn" ? "প্রোডাক্টিভ দিনের জন্য একটা ফ্রেশ শুরু!" : "A fresh start for a productive day!")
                        : (lang==="bn" ? "চালিয়ে যাও!" : "Keep it up!")}
                    </div>
                  </div>
                </div>
                <div style={{width:1, alignSelf:"stretch", background: dark ? "rgba(255,255,255,0.08)" : "rgba(20,17,24,0.08)", flexShrink:0}}/>
                <div style={{display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0}}>
                  <span style={{width:38, height:38, borderRadius:"50%", background: dark?`${accent}29`:`${accent}1A`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                    <Flame size={18} color={accent} fill={`${accent}55`}/>
                  </span>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:15.5, fontWeight:700, color:textMain, letterSpacing:-0.2, whiteSpace:"nowrap"}}>
                      <Num>{nf(studyOverview.streak)}</Num> <span style={{fontWeight:600}}>{t.streakLabel}</span>
                    </div>
                    <div style={{fontSize:10.5, color:textMuted2, marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                      {lang==="bn" ? "স্ট্রিক ধরে রাখো!" : "Keep your streak alive!"}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          return (
        <div className="fg-tab-panel" style={{
            marginTop: 16,
            background: dark ? cardBg : "#FFFFFF",
            borderRadius: 16,
            padding: "14px 16px",
            position:"relative", overflow:"hidden",
            boxShadow: dark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(32,34,43,0.05)",
            display:"flex", alignItems:"center", gap:12,
          }}>
          <div style={{display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0}}>
            <span style={{width:38, height:38, borderRadius:"50%", background: dark?`${accent}29`:`${accent}1A`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
              <BookOpen size={18} color={accent}/>
            </span>
            <div style={{minWidth:0}}>
              <div style={{fontSize:11.5, fontWeight:600, color:inkA(0.6)}}>{lang==="bn" ? "আজ" : "Today"}</div>
              <div style={{fontSize:15.5, fontWeight:700, color:inkColor, letterSpacing:-0.2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                <Num>{nf(todayTopics.filter(x=>x.done).length)}</Num> {lang==="bn" ? "এর মধ্যে" : "of"} <Num>{nf(todayTopics.length)}</Num> {lang==="bn" ? "সম্পন্ন" : "done"}
              </div>
              <div style={{fontSize:10.5, color:inkA(0.5), marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                {todayTopics.length === 0
                  ? (lang==="bn" ? "চলো শুরু করি!" : "Let's make it count!")
                  : (lang==="bn" ? "চালিয়ে যাও!" : "Keep it up!")}
              </div>
            </div>
          </div>
          <div style={{width:1, alignSelf:"stretch", background:`${accent}22`, flexShrink:0}}/>
          <div style={{display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0}}>
            <span style={{width:38, height:38, borderRadius:"50%", background: dark?`${accent}29`:`${accent}1A`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
              <Flame size={18} color={accent} fill={`${accent}55`}/>
            </span>
            <div style={{minWidth:0}}>
              <div style={{fontSize:15.5, fontWeight:700, color:inkColor, letterSpacing:-0.2, whiteSpace:"nowrap"}}>
                <Num>{nf(studyOverview.streak)}</Num> <span style={{fontWeight:600}}>{t.streakLabel}</span>
              </div>
              <div style={{fontSize:10.5, color:inkA(0.5), marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                {lang==="bn" ? "চালিয়ে যাও!" : "Keep going!"}
              </div>
            </div>
          </div>
        </div>
          );
        })()}

        {/* Salah countdown pill (Home tab) — আপাতত hidden, per user request (২৭ আগস্ট থেকে) */}
        {false && tab === "today" && nextSalahCountdown && (
          <div style={{marginTop:14}}>
            <button
              onClick={() => { vibrate(); setShowSalahDropdown(true); if (!salahCoords) requestSalahLocation(); }}
              style={{display:"flex", alignItems:"center", gap:7, maxWidth:"100%", border:`1px solid ${cardBorder}`, background:cardBg, color:textMain, borderRadius:999, padding:"9px 14px", cursor:"pointer", boxShadow: dark ? "0 4px 10px rgba(0,0,0,0.18)" : "0 4px 10px rgba(0,0,0,0.05)"}}
            >
              <Moon size={14} color={accent} fill={`${accent}33`} strokeWidth={2.2}/>
              <span style={{fontSize:13, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                {lang === "bn" ? `${nextSalahCountdown.label} বাকি ${nextSalahCountdown.text}` : `${nextSalahCountdown.label} in ${nextSalahCountdown.text}`}
              </span>
            </button>
          </div>
        )}

        {/* Exam ব্যানার — হোমপেজ মকআপের মতো ফুল-উইথ কালো বার: ক্যালেন্ডার আইকন | "Exam" | ডিভাইডার | সাবজেক্ট | "X Days Left" পিল | শেভরন */}
        {tab === "today" && studyFeatureEnabled && nearestUpcomingExam && (() => {
          const diffDays = Math.round((new Date(nearestUpcomingExam.date + "T00:00:00") - new Date(todayKey + "T00:00:00")) / 86400000);
          const daysLabel = diffDays <= 0 ? (lang==="bn" ? "আজ" : "Today")
            : diffDays === 1 ? (lang==="bn" ? "১ দিন বাকি" : "1 Day Left")
            : (lang==="bn" ? `${nf(diffDays)} দিন বাকি` : `${diffDays} Days Left`);
          return (
            <div
              onClick={() => { vibrate(); setTab("study"); setStudySection("plan"); setShowExamSchedule(true); }}
              role="button" tabIndex={0}
              style={{
                display:"flex", flexWrap:"nowrap", alignItems:"center", width:"100%", boxSizing:"border-box",
                marginTop:8, background:"#141118", color:"#fff", borderRadius:14, padding:"10px 13px",
                cursor:"pointer", boxShadow:"0 6px 16px rgba(0,0,0,0.28)",
              }}
            >
              <CalendarDays size={16} color="#fff" strokeWidth={2.2} style={{flexShrink:0}}/>
              <span style={{fontSize:14, fontWeight:600, color:"#fff", flexShrink:0, marginLeft:9}}>
                {lang==="bn" ? "পরীক্ষা" : "Exam"}
              </span>
              <span style={{width:1, alignSelf:"stretch", background:"rgba(255,255,255,0.28)", flexShrink:0, margin:"0 11px"}}/>
              <span style={{flex:"1 1 auto", minWidth:0, fontSize:13.5, fontWeight:500, color:"rgba(255,255,255,0.88)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                {nearestUpcomingExam.subject}
              </span>
              <span style={{fontSize:11.5, fontWeight:600, color:"#fff", background:accent, borderRadius:999, padding:"6px 11px", whiteSpace:"nowrap", flexShrink:0, marginLeft:10}}>
                {daysLabel}
              </span>
              <ChevronRight size={17} color="#fff" strokeWidth={2.2} style={{flexShrink:0, marginLeft:8, opacity:0.85}}/>
            </div>
          );
        })()}


        {/* Today's study list - Today tab + Study tab (shown above Study Plan/Exam)
            Today ট্যাবে এখন এটা নিজের একটা আলাদা কার্ডে বসানো, যাতে নিচের Today's Tasks সেকশনের
            সাথে মিশে না গিয়ে স্পষ্টভাবে আলাদা একটা ব্লক মনে হয় */}
        {((tab === "today" && studyFeatureEnabled) || (tab === "study" && studySection === "plan")) && (
        <div className="fg-tab-panel" style={{marginTop: tab === "today" ? 14 : 12}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
            <div style={{display:"flex", alignItems:"center", gap:8}}>
              <span style={{width:26, height:26, borderRadius:10, background: dark ? `${accent}29` : `${accent}1A`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                <GraduationCap size={14} color={accent} strokeWidth={2.2}/>
              </span>
              <div style={{fontSize:16.5, fontWeight:600, letterSpacing:-0.3, color:textMain}}>{t.todaysStudy}</div>
            </div>
            {tab === "today" ? (
              <button onClick={()=>{vibrate(); setTab("study"); setStudySection("plan");}} style={{border:"none", background:"transparent", color:accent, fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:2, cursor:"pointer", padding:0, flexShrink:0}}>
                {t.seeAll}<ChevronRight size={15}/>
              </button>
            ) : (
              <button onClick={()=>{setAddTargetKey(todayKey); setShowAdd(true);}} title={t.addTopic} style={{display:"flex",alignItems:"center",justifyContent:"center", width:28, height:28, background: dark ? `${accent}29` : `${accent}1A`, color: accent, border:"none", borderRadius:"50%", padding:0, cursor:"pointer", flexShrink:0}}>
                <Plus size={17}/>
              </button>
            )}
          </div>

          {tab === "today" ? (
            <div style={{
              background: dark ? cardBg : "#FFFFFF", borderRadius:16, padding: todayTopics.length ? "4px 13px" : "8px",
              border:`1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(20,17,24,0.045)"}`,
              boxShadow: dark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 2px 10px rgba(32,34,43,0.05)",
            }}>
              <TopicsList items={todayTopics} allSubjects={allSubjects} t={t} nf={nf} lang={lang}
                cardBg={cardBg} cardBorder={cardBorder} textMuted2={textMuted2} textMain={textMain} accent={accent}
                onToggle={(id)=>toggleDoneFor(todayKey, id)} onStartTimer={startTimerFor}
                activeTimerId={timerTopicId} timerRunning={timerRunning} timerSeconds={timerSeconds} onToggleRun={toggleTimerRunning}
                onEdit={(item)=>setEditTopic({...item, _dk: todayKey})} onDelete={(id)=>deleteTopicFor(todayKey, id)}
                onRename={(item, newTopic)=>saveEditFor(todayKey, {...item, topic:newTopic})}
                emptyText={t.noTopicsToday} emptySubtext={t.noTopicsTodaySub} emptyIcon={Sparkles} useAccentColor
                onEmptyAdd={()=>{vibrate(); setAddTargetKey(todayKey); setShowAdd(true);}}
                emptyAddLabel={lang==="bn" ? "টপিক যোগ করুন" : "Add Study Topic"}
                rowDividerColor={dark ? "rgba(255,255,255,0.07)" : "rgba(20,17,24,0.06)"}/>
            </div>
          ) : (
            <div style={{
              background: dark ? cardBg : "#FFFFFF", borderRadius:16, padding: todayTopics.length ? "4px 13px" : "8px",
              border:`1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(20,17,24,0.045)"}`,
              boxShadow: dark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 2px 10px rgba(32,34,43,0.05)",
            }}>
              <TopicsList items={todayTopics} allSubjects={allSubjects} t={t} nf={nf} lang={lang}
                cardBg={cardBg} cardBorder={cardBorder} textMuted2={textMuted2} textMain={textMain} accent={accent}
                onToggle={(id)=>toggleDoneFor(todayKey, id)} onStartTimer={startTimerFor}
                activeTimerId={timerTopicId} timerRunning={timerRunning} timerSeconds={timerSeconds} onToggleRun={toggleTimerRunning}
                onEdit={(item)=>setEditTopic({...item, _dk: todayKey})} onDelete={(id)=>deleteTopicFor(todayKey, id)}
                onRename={(item, newTopic)=>saveEditFor(todayKey, {...item, topic:newTopic})}
                emptyText={t.noTopicsToday} emptySubtext={t.noTopicsTodaySub} emptyIcon={Sparkles} useAccentColor
                onEmptyAdd={()=>{vibrate(); setAddTargetKey(todayKey); setShowAdd(true);}}
                emptyAddLabel={lang==="bn" ? "টপিক যোগ করুন" : "Add Study Topic"}
                rowDividerColor={dark ? "rgba(255,255,255,0.07)" : "rgba(20,17,24,0.06)"}/>
            </div>
          )}
        </div>
        )}

        {/* Section spacer — separates Today's Study above from the Next-Days plan below, only in Study tab */}
        {tab === "study" && studySection === "plan" && (
        <div className="fg-tab-panel" style={{marginTop:14}}/>
        )}

        {/* Today's Tasks — after Today's Study; extra top margin keeps it visually separate from the
            Today's Study card above so the two sections never read as one merged block */}
        {tab === "today" && tasksFeatureEnabled && (() => {
          const homeTodayTasks = tasks.filter(x => x.dueDate === todayKey);
          return (
          <div className="fg-tab-panel" style={{marginTop:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <span style={{width:26, height:26, borderRadius:10, background: inkA(dark ? 0.2 : 0.12), display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                  <ListChecks size={14} color={inkColor} strokeWidth={2.2}/>
                </span>
                <div style={{fontSize:16.5,fontWeight:600,letterSpacing:-0.3,color:textMain}}>
                  {lang==="bn" ? "আজকের টাস্ক" : "Today's Tasks"}
                </div>
                {homeTodayTasks.length > 0 && (
                  <span style={{fontSize:12.5, fontWeight:600, color: homeTodayTasks.every(x=>x.done) ? "#6E8B5E" : textMuted2, background: inkA(dark?0.16:0.08), borderRadius:999, padding:"2px 8px"}}>
                    <Num>{nf(homeTodayTasks.filter(x=>x.done).length)}</Num>/<Num>{nf(homeTodayTasks.length)}</Num>
                  </span>
                )}
              </div>
              <button onClick={()=>{vibrate(); setTab("task");}} style={{border:"none", background:"transparent", color:accent, fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:2, cursor:"pointer", padding:0, flexShrink:0}}>
                {t.seeAll}<ChevronRight size={15}/>
              </button>
            </div>
            {homeTodayTasks.length === 0 ? (
              <div style={{border:`1px dashed ${inkA(0.35)}`, borderRadius:12, padding:"9px 11px", background:inkA(0.06)}}>
                <div style={{display:"flex", alignItems:"center", gap:8}}>
                  <span style={{width:24, height:24, borderRadius:"50%", background:inkA(0.14), display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                    <ListChecks size={13} color={inkColor} strokeWidth={2}/>
                  </span>
                  <div style={{minWidth:0}}>
                    <div style={{fontWeight:600, color:textMain, fontSize:12.5}}>{t.taskEmptyTodayHome}</div>
                    <div style={{color:textMuted2, fontSize:11, marginTop:1}}>{lang==="bn" ? "আজকের একটা টাস্ক যোগ করুন।" : "Add a task to plan your day."}</div>
                  </div>
                </div>
                <button onClick={()=>{vibrate(); setTaskAddDefaultDate(todayKey); setShowAddTask(true);}} style={{marginTop:10, width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:6, border:"none", borderRadius:10, padding:"10px 0", background:inkA(0.14), color:inkColor, fontWeight:700, fontSize:13, cursor:"pointer"}}>
                  <Plus size={15}/> {t.taskAddBtn}
                </button>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {homeTodayTasks.map(x => (
                  <div key={x.id} style={{display:"flex",alignItems:"center",gap:11,background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:14,padding:"8px 13px",boxSizing:"border-box",boxShadow: dark ? "none" : "0 2px 8px rgba(0,0,0,0.04)"}}>
                    <button onClick={()=>{vibrate();toggleTask(x.id);}} style={{width:23,height:23,borderRadius:"50%",flexShrink:0,border:`2px solid ${x.done?"#6E8B5E":cardBorder}`,background:x.done?"#6E8B5E":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:0}}>
                      {x.done && <Check size={13} color="#fff" strokeWidth={3}/>}
                    </button>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13.5,fontWeight:500,color:x.done?textMuted2:textMain,opacity:x.done?0.7:0.85,textDecoration:"none",overflow:"visible",whiteSpace:"normal",wordBreak:"break-word",lineHeight:1.35}}>
                        {x.title}
                      </div>
                      {x.done && (
                        <div style={{fontSize:11.5, fontWeight:500, color:"#6E8B5E", marginTop:2}}>
                          {lang==="bn" ? "সম্পন্ন হয়েছে" : "Completed"}
                        </div>
                      )}
                    </div>
                    <div style={{position:"relative", flexShrink:0}}>
                      <button onClick={(e)=>{ e.stopPropagation(); setTaskMenuOpenId(v => v===x.id ? null : x.id); setTaskDeleteConfirmId(null); }} style={{border:"none",background:"transparent",color:textMuted2,cursor:"pointer",padding:10, margin:-6, display:"flex", alignItems:"center", justifyContent:"center", touchAction:"manipulation"}}>
                        <MoreVertical size={16}/>
                      </button>
                      {taskMenuOpenId === x.id && (
                        <>
                          <div onClick={closeTaskMenu} style={{position:"fixed", inset:0, zIndex:59}}/>
                          <div style={{position:"absolute", right:0, top:"100%", marginTop:4, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:10, boxShadow:"0 4px 12px rgba(0,0,0,0.08)", zIndex:60, minWidth:150, overflow:"hidden"}}>
                            {taskDeleteConfirmId === x.id ? (
                              <>
                                <div style={{padding:"9px 12px", fontSize:12.5, color:textMuted2, fontWeight:500}}>{lang==="bn"?"টাস্কটি ডিলিট করবেন?":"Delete this task?"}</div>
                                <button onClick={()=>{ closeTaskMenu(); vibrate(); deleteTask(x.id); }} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:13.5, fontWeight:500, cursor:"pointer", textAlign:"left"}}>
                                  <Trash2 size={13}/> {lang==="bn"?"ডিলিট নিশ্চিত করুন":"Confirm delete"}
                                </button>
                                <button onClick={()=>setTaskDeleteConfirmId(null)} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:13.5, fontWeight:500, cursor:"pointer", textAlign:"left"}}>
                                  {t.cancel}
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={()=>{closeTaskMenu(); setEditingTask(x);}} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:13.5, fontWeight:500, cursor:"pointer", textAlign:"left"}}>
                                  <Pencil size={13}/> {lang==="bn"?"এডিট":"Edit"}
                                </button>
                                <button onClick={()=>setTaskDeleteConfirmId(x.id)} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:13.5, fontWeight:500, cursor:"pointer", textAlign:"left"}}>
                                  <Trash2 size={13}/> {lang==="bn"?"ডিলিট":"Delete"}
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          );
        })()}

        {tab === "today" && (
          <div style={{marginTop:22, marginBottom:6, textAlign:"center", padding:"0 20px"}}>
            <div style={{fontSize:13, fontWeight:500, color:inkA(0.55), fontStyle:"italic", lineHeight:1.5}}>
              {lang==="bn" ? "\u201c\u09a8\u09bf\u09df\u09ae\u09bf\u09a4 \u099b\u09cb\u099f \u09aa\u09a6\u0995\u09cd\u09b7\u09c7\u09aa\u0987 \u09ac\u09a1\u09bc \u09ab\u09b2\u09be\u09ab\u09b2 \u098f\u09a8\u09c7 \u09a6\u09c7\u0964\u201d" : "\u201cConsistently small steps lead to big results.\u201d"}
            </div>
            <div style={{marginTop:6, fontSize:11, fontWeight:600, color:inkA(0.4), display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
              <span style={{width:14, height:1, background:inkA(0.25)}}/>
              {lang==="bn" ? "\u098f\u0997\u09bf\u09df\u09c7 \u099a\u09b2\u0964" : "Keep going"}
              <span style={{width:14, height:1, background:inkA(0.25)}}/>
            </div>
          </div>
        )}

        {/* STUDY planning section */}
        {tab === "study" && studySection === "plan" && (
          <div key="plan" className="fg-tab-panel" style={{marginTop:12}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, marginBottom:10}}>
              <div style={{fontSize:10.5, letterSpacing:ls(1.5), color:textMuted2, fontWeight:500, opacity:0.85}}>
                {lang === "bn" ? `পরের ${nf(planRange)} দিন` : `Next ${nf(planRange)} Days`}
              </div>
              {/* range selector: 7/15/30/60/90 দিনের মধ্যে বেছে নেওয়া যায়, পছন্দ মনে থাকে —
                  লেবেলের একই লাইনে, ছোট compact pill, হালকা background */}
              <div style={{display:"flex", gap:2, background: subtleBg, border:`1px solid ${cardBorder}`, borderRadius:10, padding:2, flexShrink:0}}>
                {[7,15,30,60,90].map(r => (
                  <button key={r} onClick={()=>{vibrate(); setPlanRange(r);}} style={{
                    border:"none", cursor:"pointer", fontFamily:"inherit", fontWeight:500, fontSize:11.5,
                    padding:"4px 9px", borderRadius:8,
                    background: planRange===r ? accent : "transparent",
                    color: planRange===r ? "#FFFFFF" : textMuted2,
                    transition:"background .15s ease, color .15s ease"
                  }}>
                    <Num>{nf(r)}</Num>
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:"flex", gap:8, padding:"5px 2px 3px",
              overflowX: planRange > 7 ? "auto" : "visible", WebkitOverflowScrolling:"touch"}}>
              {planDays.map((d,i) => {
                const dk = dateKey(d);
                const isSel = dk === planKey;
                const dayList = entries[dk] || [];
                const hasAny = dayList.length > 0;
                const doneAll = hasAny && dayList.every(x=>x.done);
                const statusColor = !hasAny ? (dark ? "#3A3A3A" : "#D9D5E8") : (doneAll ? "#6E8B5E" : inkColor);
                return (
                  <div key={i} onClick={()=>setPlanDate(d)} style={{
                    textAlign:"center", cursor:"pointer",
                    flex: planRange > 7 ? "0 0 56px" : 1,
                    borderRadius:16, padding:"10px 4px 12px",
                    background: isSel ? (dark ? `${accent}29` : `${accent}1A`) : (dark ? cardBg : "#FFFFFF"),
                    border: isSel ? `1px solid ${accent}40` : `1px solid ${cardBorder}`,
                    transition:"background .18s ease, border-color .18s ease"
                  }}>
                    <div style={{fontSize:10, fontWeight:700, letterSpacing:0.5, textTransform:"uppercase",
                      color: isSel ? accent : textMuted2, opacity: isSel ? 1 : 0.85, marginBottom:8}}>
                      {weekdayShort(d)}
                    </div>
                    {/* selected day gets a solid filled circle badge, others show a plain number */}
                    <div style={{width:34,height:34, borderRadius:"50%", display:"flex",alignItems:"center",justifyContent:"center", margin:"0 auto", fontSize:13.5, fontWeight:700,
                      transition:"background .18s ease, color .18s ease",
                      background: isSel ? accent : "transparent", color: isSel ? "#FFFFFF" : textMain}}>
                      <Num>{nf(d.getDate())}</Num>
                    </div>
                    {/* status dot — same legend colors as Calendar (green completed / accent planned); selected day always shows accent color */}
                    <div style={{marginTop:8, display:"flex", justifyContent:"center"}}>
                      <span style={{width:6, height:6, borderRadius:"50%", background: isSel && !hasAny ? accent : statusColor}}/>
                    </div>
                  </div>
                );
              })}
            </div>
            {planRange > 7 && (
              <div style={{marginTop:6, fontSize:11.5, color:textMuted2, textAlign:"center", opacity:0.8}}>
                {lang === "bn" ? "← স্ক্রল করে বাকি দিনগুলো দেখো →" : "← scroll to see more days →"}
              </div>
            )}

            <div style={{marginTop:14, marginBottom:9, paddingBottom:9, borderBottom:`0.5px solid ${cardBorder}`}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:8}}>
                <div style={{fontSize:20.5, fontWeight:600, letterSpacing:-0.3}}>
                  {isPlanToday ? t.todaysStudy : <>{weekdayName(planDate)}, <Num>{nf(planDate.getDate())}</Num> {monthName(planDate.getMonth())}</>}
                </div>
                <button onClick={()=>{setAddTargetKey(planKey); setShowAdd(true);}} title={t.addTopic} style={{display:"flex",alignItems:"center",justifyContent:"center", width:28, height:28, background: dark ? `${accent}29` : `${accent}1A`, color: accent, border:"none", borderRadius:"50%", padding:0, cursor:"pointer", flexShrink:0}}>
                  <Plus size={17}/>
                </button>
              </div>
              {planTopics.length > 0 && (() => {
                const totalMin = planTopics.reduce((sum,x)=>sum+(x.duration||0), 0);
                const h = Math.floor(totalMin/60), m = totalMin%60;
                return (
                  <div style={{fontSize:12, color:textMuted2, fontWeight:500, marginTop:4}}>
                    {t.totalPlannedLabel}: <span style={{color:textMain, fontWeight:600}}>{h > 0 && <><Num>{nf(h)}</Num>h </>}<Num>{nf(m)}</Num>m</span>
                  </div>
                );
              })()}
            </div>

            <TopicsList items={planTopics} allSubjects={allSubjects} t={t} nf={nf} lang={lang}
              cardBg={cardBg} cardBorder={cardBorder} textMuted2={textMuted2} textMain={textMain} accent={accent}
              onToggle={isPlanToday ? (id)=>toggleDoneFor(planKey, id) : null}
              onStartTimer={isPlanToday ? startTimerFor : null}
              activeTimerId={isPlanToday ? timerTopicId : null} timerRunning={timerRunning} timerSeconds={timerSeconds} onToggleRun={toggleTimerRunning}
              onEdit={(item)=>setEditTopic({...item, _dk: planKey})}
              onDelete={(id)=>deleteTopicFor(planKey, id)}
              onRename={(item, newTopic)=>saveEditFor(planKey, {...item, topic:newTopic})}
              emptyText={t.noTopicsPlanned} emptySubtext={t.noTopicsPlannedSub}
              onEmptyAdd={()=>{vibrate(); setAddTargetKey(planKey); setShowAdd(true);}}
              emptyAddLabel={lang==="bn" ? "টপিক যোগ করুন" : "Add Study Topic"}/>
          </div>
        )}

        {/* TASK tab — screenshot অনুযায়ী হুবহু: টাইটেল + ডেট পিল, All/Done/Overdue ফিল্টার পিল, সার্চ বার,
            তালিকা খালি থাকলে ক্লিপবোর্ড ইলাস্ট্রেশন + "Create Your First Task" বাটন + একটা উক্তি।
            "All"-এ সব তারিখের টাস্ক একসাথে দেখালে অগোছালো লাগে, তাই সেটা এখন এক দিনের টাস্কই দেখায় (taskListDay,
            ডিফল্ট আজ) — পিলের দুইপাশের ছোট অ্যারো দিয়ে আগের/পরের দিনে যাওয়া যায়, পিলে ট্যাপ করলে আজকে ফিরে আসে। */}
        {tab === "task" && (() => {
          const overdueCount = tasks.filter(x => !x.done && x.dueDate && x.dueDate < todayKey).length;
          const doneCount = tasks.filter(x => x.done).length;
          const q = taskSearchQuery.trim().toLowerCase();
          const dayKeyForList = dateKey(taskListDay);
          const isListToday = dayKeyForList === todayKey;
          const visibleTasks = tasks.filter(x => {
            if (taskListStatusFilter === "all" && x.dueDate && x.dueDate !== dayKeyForList) return false;
            if (taskListStatusFilter === "done" && !x.done) return false;
            if (taskListStatusFilter === "overdue" && !(!x.done && x.dueDate && x.dueDate < todayKey)) return false;
            if (q && !(x.title || "").toLowerCase().includes(q)) return false;
            return true;
          });
          const dateLabel = isListToday
            ? (lang==="bn" ? "আজ" : "Today")
            : `${weekdayShort(taskListDay)}, ${nf(taskListDay.getDate())} ${monthShort(taskListDay.getMonth())}`;
          const quotePool = lang === "bn"
            ? ["\u201cছোট পদক্ষেপই বড় অগ্রগতি আনে।\u201d", "\u201cআজকের এক কাজ, আগামীর একধাপ এগিয়ে।\u201d"]
            : ["\u201cSmall steps make big progress.\u201d", "\u201cOne task at a time.\u201d"];
          const quote = quotePool[Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 86400000) % quotePool.length];

          return (
          <div className="fg-tab-panel" style={{marginTop:16}}>
            {/* Title row + date pill — পিলে ট্যাপ করলেই ক্যালেন্ডার ভিউ খুলবে/বন্ধ হবে, আলাদা কোনো টগল বাটন বা অ্যারো নেই */}
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginBottom:14}}>
              <div style={{minWidth:0}}>
                <div className="fg-title" style={{fontSize:21}}>{t.taskTitle}</div>
                <div style={{fontSize:12.5, color:textMuted2, marginTop:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                  {t.taskSubtitle}
                </div>
              </div>
              <button onClick={()=>{vibrate(); if (taskViewMode === "calendar") { setTaskViewMode("list"); } else { setTaskCalMonth(new Date(taskListDay)); setTaskViewMode("calendar"); } }}
                style={{display:"flex", alignItems:"center", gap:6, border:`1px solid ${accent}33`, background: taskViewMode==="calendar" ? accent : "transparent", borderRadius:999, padding:"7px 12px", cursor:"pointer", flexShrink:0}}>
                <Calendar size={13} color={taskViewMode==="calendar" ? "#FFFFFF" : accent} strokeWidth={2.2}/>
                <span style={{fontSize:12.5, fontWeight:700, color: taskViewMode==="calendar" ? "#FFFFFF" : accent, whiteSpace:"nowrap"}}>{dateLabel}</span>
              </button>
            </div>

            {/* সপ্তাহের streak strip — সপ্তাহ শুরুর দিন Settings-এর সেটিং অনুযায়ী; আজকের আগের দিনগুলোতে
                সেদিনের সব টাস্ক শেষ হলে ভরাট চেকমার্ক, আজকে একটা flame আইকন (streak চলছে বোঝাতে),
                আর ভবিষ্যতের দিনগুলো হালকা ধূসর — এখনো পৌঁছায়নি সেটা বোঝাতে */}
            <div style={{display:"flex", justifyContent:"space-between", gap:6, marginBottom:14}}>
              {(() => {
                const weekStart = startOfWeek(today);
                const days = Array.from({length:7}, (_,i) => { const d = new Date(weekStart); d.setDate(d.getDate()+i); return d; });
                return days.map((d,i) => {
                  const dk = dateKey(d);
                  const isToday = dk === todayKey;
                  const isFuture = d > stripTime(today);
                  const isPast = d < stripTime(today);
                  const dayTasks = tasks.filter(x => x.dueDate === dk);
                  const allDone = dayTasks.length > 0 && dayTasks.every(x=>x.done);
                  let circleBg, circleBorder, content;
                  if (isToday) {
                    circleBg = "#F59E0B22"; circleBorder = "transparent";
                    content = <Flame size={14} color="#F59E0B" fill="#F59E0B55"/>;
                  } else if (isPast) {
                    circleBg = allDone ? textMain : "transparent";
                    circleBorder = allDone ? "transparent" : cardBorder;
                    content = <Check size={12} color={allDone ? bg : textMuted2} strokeWidth={3}/>;
                  } else {
                    circleBg = dark ? "rgba(255,255,255,0.06)" : "rgba(20,17,24,0.045)";
                    circleBorder = "transparent";
                    content = <Check size={12} color={textMuted2} strokeWidth={3} opacity={0.45}/>;
                  }
                  return (
                    <button key={i} onClick={()=>{vibrate(); setTaskListDay(d); setTaskViewMode("list");}}
                      style={{display:"flex", flexDirection:"column", alignItems:"center", gap:6, border:"none", background:"transparent", cursor:"pointer", fontFamily:"inherit", flex:1, padding:0}}>
                      <span style={{fontSize:10.5, fontWeight:700, color: isToday ? "#F59E0B" : textMuted2}}>{weekdayShort(d)}</span>
                      <span style={{width:30, height:30, borderRadius:"50%", background:circleBg, border:`1px solid ${circleBorder}`, display:"flex", alignItems:"center", justifyContent:"center"}}>
                        {content}
                      </span>
                    </button>
                  );
                });
              })()}
            </div>

            {/* All / Done / Overdue filter pills */}
            <div style={{display:"flex", gap:8, marginBottom:12}}>
              {[
                { key:"all", label: lang==="bn" ? "সব" : "All", count: tasks.filter(x=>!x.dueDate || x.dueDate===dayKeyForList).length, Icon: ListChecks },
                { key:"done", label: t.taskFilterDone, count: doneCount, Icon: Check },
                { key:"overdue", label: t.taskFilterOverdue, count: overdueCount, Icon: Clock },
              ].map(f => {
                const sel = taskListStatusFilter === f.key;
                return (
                  <button key={f.key} onClick={()=>{vibrate(); setTaskListStatusFilter(f.key);}}
                    style={{
                      flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                      border: sel ? "none" : `1px solid ${cardBorder}`, cursor:"pointer", fontFamily:"inherit",
                      borderRadius:14, padding:"10px 6px",
                      background: sel ? accent : (dark ? cardBg : "#FFFFFF"),
                      color: sel ? "#FFFFFF" : textMuted2,
                      boxShadow: sel ? `0 4px 12px ${accent}40` : "none",
                    }}>
                    <f.Icon size={13} strokeWidth={2.4}/>
                    <span style={{fontSize:12.5, fontWeight:700, whiteSpace:"nowrap"}}>{f.label} (<Num>{nf(f.count)}</Num>)</span>
                  </button>
                );
              })}
            </div>

            {/* Search bar */}
            <div style={{display:"flex", alignItems:"center", gap:8, background: dark ? "rgba(255,255,255,0.06)" : "rgba(20,17,24,0.045)", border:`1px solid ${cardBorder}`, borderRadius:14, padding:"11px 14px", marginBottom:18}}>
              <Search size={16} color={textMuted2}/>
              <input value={taskSearchQuery} onChange={e=>setTaskSearchQuery(e.target.value)}
                placeholder={lang==="bn" ? "টাস্ক খুঁজুন..." : "Search tasks..."}
                style={{flex:1, minWidth:0, border:"none", outline:"none", background:"transparent", fontFamily:"inherit", fontSize:13.5, color:textMain}}/>
            </div>

            {/* Calendar view — মাসের গ্রিডে প্রতিটা দিনে ডট দিয়ে বোঝানো হয় (সবুজ = সব সম্পন্ন, accent = বাকি আছে,
                লাল = মেয়াদোত্তীর্ণ); কোনো দিনে ট্যাপ করলে সেই দিনের লিস্ট ভিউতে চলে যায় */}
            {taskViewMode === "calendar" && (() => {
              const y = taskCalMonth.getFullYear(), m = taskCalMonth.getMonth();
              const firstDay = new Date(y, m, 1);
              const startOffset = weekStartOffset(firstDay.getDay());
              const daysInMonth = new Date(y, m+1, 0).getDate();
              const calCells = [];
              for (let i=0;i<startOffset;i++) calCells.push(null);
              for (let d=1; d<=daysInMonth; d++) calCells.push(new Date(y,m,d));
              const shortDays = weekdayShortLabels(lang);
              return (
                <div style={{marginBottom:18, background: dark ? cardBg : "#FFFFFF", border:`1px solid ${cardBorder}`, borderRadius:16, padding:14}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
                    <button onClick={()=>{vibrate(); setTaskCalMonth(new Date(y,m-1,1));}} style={{border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:10, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:textMain}}>
                      <ChevronLeft size={15}/>
                    </button>
                    <div style={{fontWeight:700, fontSize:14.5, color:textMain}}>{monthName(m)} <Num>{nf(y)}</Num></div>
                    <button onClick={()=>{vibrate(); setTaskCalMonth(new Date(y,m+1,1));}} style={{border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:10, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:textMain}}>
                      <ChevronRight size={15}/>
                    </button>
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:4}}>
                    {shortDays.map((d,i)=>(<div key={i} style={{textAlign:"center", fontSize:10, fontWeight:700, color:textMuted2}}>{d}</div>))}
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3}}>
                    {calCells.map((d,i) => {
                      if (!d) return <div key={i}/>;
                      const dk = dateKey(d);
                      const dayTasks = tasks.filter(x => x.dueDate === dk);
                      const hasAny = dayTasks.length > 0;
                      const doneAll = hasAny && dayTasks.every(x=>x.done);
                      const hasOverdue = dayTasks.some(x => !x.done && dk < todayKey);
                      const isToday = dk === todayKey;
                      const isSel = dk === dayKeyForList;
                      return (
                        <button key={i} onClick={()=>{vibrate(); setTaskListDay(d); setTaskViewMode("list");}}
                          style={{position:"relative", aspectRatio:"1", border: isSel ? `1.5px solid ${accent}` : (isToday ? `1px solid ${accent}66` : "1px solid transparent"), borderRadius:10, background: dark?"#0A0A0A":"#F8F5EE", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3}}>
                          <span style={{fontSize:12, fontWeight:600, color:textMain}}><Num>{nf(d.getDate())}</Num></span>
                          <span style={{width:5, height:5, borderRadius:"50%", background: !hasAny ? "transparent" : (doneAll ? "#6E8B5E" : (hasOverdue ? "#C0392B" : accent))}}/>
                        </button>
                      );
                    })}
                  </div>
                  <div style={{display:"flex", justifyContent:"center", gap:12, marginTop:12, flexWrap:"wrap"}}>
                    <span style={{display:"flex", alignItems:"center", gap:4, fontSize:10.5, color:textMuted2, fontWeight:600}}><span style={{width:6,height:6,borderRadius:"50%", background:"#6E8B5E"}}/>{lang==="bn" ? "সম্পন্ন" : "Done"}</span>
                    <span style={{display:"flex", alignItems:"center", gap:4, fontSize:10.5, color:textMuted2, fontWeight:600}}><span style={{width:6,height:6,borderRadius:"50%", background:accent}}/>{lang==="bn" ? "বাকি" : "Pending"}</span>
                    <span style={{display:"flex", alignItems:"center", gap:4, fontSize:10.5, color:textMuted2, fontWeight:600}}><span style={{width:6,height:6,borderRadius:"50%", background:"#C0392B"}}/>{lang==="bn" ? "মেয়াদোত্তীর্ণ" : "Overdue"}</span>
                  </div>
                </div>
              );
            })()}

            {taskViewMode === "list" && (visibleTasks.length === 0 ? (
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"18px 10px 6px"}}>
                <div style={{position:"relative", width:120, height:120, marginBottom:18}}>
                  <div style={{position:"absolute", inset:0, borderRadius:"50%", background: dark ? `${accent}22` : `${accent}14`}}/>
                  <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <ClipboardChecklistIcon size={56} color={accent}/>
                  </div>
                  <span style={{position:"absolute", top:6, right:2, width:10, height:16, borderRadius:4, background:`${accent}55`, transform:"rotate(20deg)"}}/>
                  <span style={{position:"absolute", bottom:14, left:0, width:10, height:16, borderRadius:4, background:`${accent}55`, transform:"rotate(-25deg)"}}/>
                </div>
                <div style={{fontSize:17.5, fontWeight:800, color:textMain}}>
                  {tasks.length === 0 ? t.taskEmpty : (lang==="bn" ? "কোনো টাস্ক পাওয়া যায়নি" : "No tasks found")}
                </div>
                <div style={{fontSize:13, color:textMuted2, marginTop:6, maxWidth:260, lineHeight:1.4}}>
                  {tasks.length === 0
                    ? (lang==="bn" ? "দিনটা পরিকল্পনা করতে প্রথম টাস্কটা যোগ করো।" : "Add your first task to start planning your day.")
                    : (taskListStatusFilter === "all" && !q)
                      ? (lang==="bn" ? "এই দিনে কোনো টাস্ক নেই।" : "No tasks for this day.")
                      : (lang==="bn" ? "ফিল্টার বা সার্চ পরিবর্তন করে দেখো।" : "Try changing the filter or search.")}
                </div>
                {tasks.length === 0 && (
                  <button onClick={()=>{vibrate(); setTaskAddDefaultDate(todayKey); setShowAddTask(true);}}
                    style={{display:"flex", alignItems:"center", gap:8, marginTop:20, border:"none", cursor:"pointer", fontFamily:"inherit",
                      background: dark ? `${accent}29` : `${accent}1A`, color:accent, fontWeight:700, fontSize:14, borderRadius:14, padding:"13px 22px"}}>
                    <Sparkles size={16}/> {lang==="bn" ? "প্রথম টাস্ক তৈরি করো" : "Create Your First Task"}
                  </button>
                )}
                {tasks.length > 0 && taskListStatusFilter === "all" && !q && (
                  <button onClick={()=>{vibrate(); setTaskAddDefaultDate(dayKeyForList); setShowAddTask(true);}}
                    style={{display:"flex", alignItems:"center", gap:8, marginTop:20, border:"none", cursor:"pointer", fontFamily:"inherit",
                      background: dark ? `${accent}29` : `${accent}1A`, color:accent, fontWeight:700, fontSize:14, borderRadius:14, padding:"13px 22px"}}>
                    <Plus size={16}/> {lang==="bn" ? "এই দিনে টাস্ক যোগ করো" : "Add Task for This Day"}
                  </button>
                )}
                {tasks.length === 0 && (
                  <div style={{marginTop:34, fontSize:12.5, color:textMuted2, fontStyle:"italic"}}>{quote}</div>
                )}
                {tasks.length === 0 && (
                  <div style={{display:"flex", alignItems:"center", gap:8, marginTop:6, fontSize:11.5, color:textMuted2, fontWeight:600}}>
                    <span style={{width:18, height:1, background:cardBorder}}/>
                    {lang==="bn" ? "চালিয়ে যাও" : "Keep going"}
                    <span style={{width:18, height:1, background:cardBorder}}/>
                  </div>
                )}
              </div>
            ) : (
              <div style={{display:"flex", flexDirection:"column", gap:4}}>
                {(() => {
                  // reminderTime ("HH:MM") অনুযায়ী গ্রুপ — সময় নির্ধারিত থাকা টাস্কগুলো সময় অনুযায়ী সাজানো,
                  // যাদের কোনো নির্দিষ্ট সময় নেই তারা সবার শেষে একটা "Anytime" গ্রুপে
                  const timeLabel = (hhmm) => {
                    const [hh, mm] = hhmm.split(":").map(Number);
                    const period = hh < 12 ? t.amLabel : t.pmLabel;
                    const h12 = hh % 12 === 0 ? 12 : hh % 12;
                    return `${nf(h12)}:${nf(pad2(mm))} ${period}`;
                  };
                  const timed = visibleTasks.filter(x => x.reminderTime).sort((a,b)=> a.reminderTime.localeCompare(b.reminderTime));
                  const anytime = visibleTasks.filter(x => !x.reminderTime);
                  const groupsMap = new Map();
                  timed.forEach(x => {
                    if (!groupsMap.has(x.reminderTime)) groupsMap.set(x.reminderTime, []);
                    groupsMap.get(x.reminderTime).push(x);
                  });
                  const groups = [...groupsMap.entries()].map(([time, items]) => ({ heading: timeLabel(time), items }));
                  if (anytime.length) groups.push({ heading: lang==="bn" ? "যেকোনো সময়" : "Anytime", items: anytime });

                  return groups.map((g, gi) => (
                    <div key={gi} style={{marginBottom:14}}>
                      <div style={{fontSize:12, fontWeight:700, color:textMuted2, marginBottom:8, marginLeft:2}}>{g.heading}</div>
                      <div style={{display:"flex", flexDirection:"column", gap:8}}>
                        {g.items.map(x => {
                          const overdue = !x.done && x.dueDate && x.dueDate < todayKey;
                          const pr = x.priority || "med";
                          const prColor = {high:"#C0392B", med:accent, low:"#6E8B5E"}[pr];
                          return (
                            <div key={x.id} onClick={()=>setTaskDetailId(x.id)}
                              style={{display:"flex", alignItems:"center", gap:11, background: dark ? cardBg : "#FFFFFF", border:`1px solid ${cardBorder}`, borderRadius:14, padding:"12px 13px", cursor:"pointer"}}>
                              <button onClick={(e)=>{e.stopPropagation(); vibrate(); toggleTask(x.id);}}
                                style={{width:22, height:22, borderRadius:"50%", border:`2px solid ${x.done ? "#6E8B5E" : prColor}`, background: x.done ? "#6E8B5E" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer", padding:0}}>
                                {x.done && <Check size={13} color="#fff" strokeWidth={3}/>}
                              </button>
                              <div style={{flex:1, minWidth:0}}>
                                <div style={{fontSize:14, fontWeight:600, color: x.done ? textMuted2 : textMain, textDecoration: x.done ? "line-through" : "none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                                  {x.title}
                                </div>
                                {x.dueDate && (
                                  <div style={{fontSize:11, fontWeight:600, color: overdue ? "#C0392B" : textMuted2, marginTop:2}}>{x.dueDate}</div>
                                )}
                              </div>
                              {x.favorite && <Pin size={14} color={accent} fill={`${accent}55`} style={{flexShrink:0}}/>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            ))}
          </div>
          );
        })()}

        {/* SETTINGS tab — অন্য ট্যাবগুলোর মতোই সরাসরি পেজ হিসেবে (আগে বটম-শিট মোডাল ছিল) */}
        {tab === "settings" && (
          <SettingsModal t={t} lang={lang} setLang={setLang} themeMode={themeMode} setThemeMode={setThemeMode}
            accentKey={accentKey} setAccentKey={setAccentKey}
            notificationsEnabled={notificationsEnabled} setNotificationsEnabled={setNotificationsEnabled} asPage
            examNotifEnabled={examNotifEnabled} setExamNotifEnabled={setExamNotifEnabled}
            taskNotifEnabled={taskNotifEnabled} setTaskNotifEnabled={setTaskNotifEnabled}
            salahNotifEnabled={salahNotifEnabled} setSalahNotifEnabled={setSalahNotifEnabled}
            timerNotifEnabled={timerNotifEnabled} setTimerNotifEnabled={setTimerNotifEnabled}
            alarmNotifEnabled={alarmNotifEnabled} setAlarmNotifEnabled={setAlarmNotifEnabled}
            salahFeatureEnabled={salahFeatureEnabled} setSalahFeatureEnabled={setSalahFeatureEnabled}
            studyFeatureEnabled={studyFeatureEnabled} setStudyFeatureEnabled={setStudyFeatureEnabled}
            tasksFeatureEnabled={tasksFeatureEnabled} setTasksFeatureEnabled={setTasksFeatureEnabled}
            focusMinutes={focusMinutes} setFocusMinutes={setFocusMinutes}
            breakMinutes={breakMinutes} setBreakMinutes={setBreakMinutes}
            weekStartDay={weekStartDay} setWeekStartDay={changeWeekStartDay}
            user={user} isGuest={isGuest} onOpenProfile={() => setShowProfile(true)}
            notes={notes} tasks={tasks} subjects={subjects} setNotes={setNotes} setTasks={setTasks} setSubjects={setSubjects}
            textScale={textScale} setTextScale={setTextScale} TEXT_SCALE_OPTIONS={TEXT_SCALE_OPTIONS}
            cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
        )}

        {/* STATS sub-section (inside Study tab) - week + subjects + month, one shared day-detail card at the bottom */}
        {tab === "study" && studySection === "stats" && (
          <div key="stats" className="fg-tab-panel" style={{marginTop:14}}>
            {/* একীভূত Stats কার্ড — উপরে আইকন + Total Time Focused হেডলাইন + "This Week/This Month" ড্রপডাউন,
                নিচে ৫টা ইউনিক সেকেন্ডারি স্ট্যাট এক সারিতে, প্রতিটির নিজস্ব রঙিন গোল আইকন।
                "This Week" পিলে ক্লিক করলে এখন সত্যিকারের ড্রপডাউন খোলে (This Week / This Month), আর হেডলাইনের
                সময়টাও সিলেকশন অনুযায়ী সাপ্তাহিক/মাসিক অ্যাক্টিভিটি ডেটা থেকে হিসাব হয়ে বদলে যায়। */}
            {(() => {
              const DAILY_GOAL_MIN = 120;
              const todayMinutes = (entries[todayKey] || []).filter(x=>x.done).reduce((s,x)=>s+(x.duration||0),0);
              const goalPct = Math.min(100, Math.round((todayMinutes/DAILY_GOAL_MIN)*100));
              const rangeMin = statsRange === "month"
                ? monthlyActivity.reduce((s,w)=>s+w.min,0)
                : weeklyActivity.reduce((s,w)=>s+w.min,0);
              const h = Math.floor(rangeMin/60), m = rangeMin%60;
              const statItems = [
                { Icon: BookOpen, color:"#3B82F6", value: nf(subjects.length), label: lang==="bn" ? "সাবজেক্ট" : "Subjects" },
                { Icon: Check, color:"#22C55E", value: nf(studyOverview.doneCount), label: t.topicsCompletedLabel },
                { Icon: TrendingUp, color:"#8B5CF6", value: `${nf(studyOverview.pct)}%`, label: t.completionLabel },
                { Icon: Target, color:"#EC4899", value: `${nf(goalPct)}%`, label: t.dailyGoalLabel },
                { Icon: Flame, color:"#F59E0B", value: nf(studyOverview.streak), label: t.streakLabel },
              ];
              return (
                <div style={{background: dark ? cardBg : "#FFFFFF", borderRadius:16, padding:"18px 16px 16px", marginBottom:22, boxShadow: dark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(32,34,43,0.05)"}}>
                  <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10}}>
                    <div style={{display:"flex", alignItems:"center", gap:12}}>
                      <div style={{width:44, height:44, borderRadius:12, flexShrink:0, background: dark ? "rgba(139,92,246,0.18)" : "rgba(139,92,246,0.12)", display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <BarChart3 size={20} color="#8B5CF6"/>
                      </div>
                      <div>
                        <div style={{fontSize:22, fontWeight:800, letterSpacing:-0.4, color:textMain, lineHeight:1.15}}>{h > 0 && <><Num>{nf(h)}</Num>h </>}<Num>{nf(m)}</Num>m</div>
                        <div style={{fontSize:12, color:textMuted2, fontWeight:500, marginTop:2}}>{t.focusedLabel}</div>
                      </div>
                    </div>
                    <div style={{position:"relative", flexShrink:0}}>
                      <button onClick={()=>{vibrate(); setShowStatsRangeMenu(v=>!v);}} style={{display:"flex", alignItems:"center", gap:3, border:"none", cursor:"pointer", fontFamily:"inherit", background: dark ? "rgba(139,92,246,0.14)" : "rgba(139,92,246,0.10)", color: dark ? "#C4B5FD" : "#7C3AED", borderRadius:20, padding:"7px 11px", fontSize:11.5, fontWeight:700, whiteSpace:"nowrap"}}>
                        {statsRange === "month" ? t.thisMonth : t.thisWeek} <ChevronDown size={13} style={{transform: showStatsRangeMenu ? "rotate(180deg)" : "none", transition:"transform .15s ease"}}/>
                      </button>
                      {showStatsRangeMenu && (
                        <>
                          <div onClick={()=>setShowStatsRangeMenu(false)} style={{position:"fixed", inset:0, zIndex:44}}/>
                          <div style={{position:"absolute", right:0, top:"100%", marginTop:6, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:12, boxShadow: dark ? "0 8px 22px rgba(0,0,0,0.35)" : "0 8px 22px rgba(0,0,0,0.14)", zIndex:45, minWidth:140, overflow:"hidden"}}>
                            <button onClick={()=>{vibrate(); setStatsRange("week"); setShowStatsRangeMenu(false);}} style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, width:"100%", border:"none", background: statsRange==="week" ? (dark?"rgba(139,92,246,0.14)":"rgba(139,92,246,0.10)") : "transparent", color:textMain, padding:"10px 12px", fontSize:13, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                              {t.thisWeek} {statsRange==="week" && <Check size={13} color="#8B5CF6" strokeWidth={3}/>}
                            </button>
                            <button onClick={()=>{vibrate(); setStatsRange("month"); setShowStatsRangeMenu(false);}} style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, width:"100%", border:"none", background: statsRange==="month" ? (dark?"rgba(139,92,246,0.14)":"rgba(139,92,246,0.10)") : "transparent", color:textMain, padding:"10px 12px", fontSize:13, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                              {t.thisMonth} {statsRange==="month" && <Check size={13} color="#8B5CF6" strokeWidth={3}/>}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{display:"flex", marginTop:18, paddingTop:16, borderTop:`1px solid ${cardBorder}`}}>
                    {statItems.map((it, i) => (
                      <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, textAlign:"center"}}>
                        <div style={{width:32, height:32, borderRadius:"50%", background:`${it.color}20`, display:"flex", alignItems:"center", justifyContent:"center"}}>
                          <it.Icon size={15} color={it.color}/>
                        </div>
                        <div style={{fontSize:15, fontWeight:800, color:textMain, letterSpacing:-0.2, lineHeight:1.1}}>{it.value}</div>
                        <div style={{fontSize:9.5, color:textMuted2, fontWeight:500, lineHeight:1.2}}>{it.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Subject Progress — right after the merged stats card. আলাদা "+" বাটন সরানো হয়েছে —
                সাবজেক্ট/টপিক যোগ করা এখন নিচের নচ-বার FAB থেকেই হবে, পেজে একাধিক "+" রাখা হয়নি। */}
            <div style={{marginTop:6, marginBottom:14}}>
              <div className="fg-section-header" style={{fontSize:16.5}}>{t.syllabusProgress}</div>
              <div style={{fontSize:11.5, color:"var(--muted)", fontWeight:500, marginTop:2}}>{t.subjectProgressSubtitle}</div>
            </div>

            <div style={{display:"flex", flexDirection:"column", gap:12, marginBottom:16}}>
              {(() => {
                const sorted = [...allSubjects].sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:"base"}));
                const COLLAPSE_AT = 4; // max 4 subjects shown in the grid — rest via "See more"
                const isLong = sorted.length > COLLAPSE_AT;
                const visible = (isLong && !showAllSubjectsProgress) ? sorted.slice(0, COLLAPSE_AT) : sorted;
                if (sorted.length === 0) {
                  return <div style={{fontSize:13.5, color:textMuted2, padding:"14px 0", textAlign:"center"}}>—</div>;
                }
                return (
                  <>
                    {visible.map(subj => {
                      const v = subjectProgress[subj] || { done:0, total:0 };
                      const c = colorForSubject(subj, allSubjects);
                      const SubjIcon = iconForSubject(subj);
                      const pct = v.total ? Math.round((v.done/v.total)*100) : 0;
                      return (
                        <button key={subj} className="fg-card" onClick={()=>{vibrate(); setShowManageTopicsFor(subj); setShowSubjects(true);}}
                          style={{display:"flex", alignItems:"center", gap:12, background: dark ? cardBg : "#FFFFFF", border:"none", borderRadius:16, padding:"14px 14px", cursor:"pointer", textAlign:"left", width:"100%", boxShadow: dark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(32,34,43,0.05)"}}>
                          <div style={{width:46, height:46, borderRadius:14, flexShrink:0, background: c.bgSoft, display:"flex", alignItems:"center", justifyContent:"center"}}>
                            <SubjIcon size={20} color={c.bg}/>
                          </div>
                          <div style={{flex:1, minWidth:0}}>
                            <div style={{fontSize:11, fontWeight:800, letterSpacing:0.4, color:c.bg, textTransform:"uppercase", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{v.total ? `${nf(pct)}%` : t.noTopicsYetCaps}</div>
                            <div style={{fontSize:15, fontWeight:800, color:textMain, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{subj}</div>
                            {v.total > 0 ? (
                              <>
                                <div style={{height:6, borderRadius:8, background: dark?"#242424":"#EFEBDF", overflow:"hidden", marginTop:8}}>
                                  <div style={{width:`${pct}%`, height:"100%", borderRadius:8, background:c.bg, transition:"width .25s ease"}}/>
                                </div>
                                <div style={{fontSize:11.5, color:textMuted2, fontWeight:500, opacity:0.75, marginTop:5}}><Num>{nf(v.done)}</Num>/<Num>{nf(v.total)}</Num> {t.completeShort}</div>
                              </>
                            ) : null}
                          </div>
                          <div style={{display:"flex", alignItems:"center", gap:8, flexShrink:0}}>
                            {v.total > 0 ? (
                              <span style={{width:36, height:36, borderRadius:"50%", background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                                <Play size={14} color="#fff" fill="#fff" strokeWidth={0}/>
                              </span>
                            ) : (
                              <span style={{width:36, height:36, borderRadius:"50%", background:c.bgSoft, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:c.bg}}>
                                <Plus size={17} strokeWidth={2.4}/>
                              </span>
                            )}
                            <ChevronRight size={16} color={textMuted2} style={{opacity:0.6}}/>
                          </div>
                        </button>
                      );
                    })}
                    {isLong && (
                      <button onClick={()=>{vibrate(); setShowAllSubjectsProgress(v=>!v);}} style={{display:"flex", alignItems:"center", justifyContent:"center", gap:4, width:"100%", border:`1px solid ${cardBorder}`, background: dark ? cardBg : "#FFFFFF", color:textMain, borderRadius:16, padding:"13px 0", fontSize:12.5, fontWeight:700, cursor:"pointer"}}>
                        {showAllSubjectsProgress ? t.showLess : t.seeAll} <ChevronDown size={14} style={{transform: showAllSubjectsProgress ? "rotate(180deg)" : "none", transition:"transform .15s ease"}}/>
                      </button>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Weekly Activity — bar chart with value labels and accent-weighted bars */}
            <div style={{background: dark ? cardBg : "#FFFFFF", borderRadius:14, padding:"14px 14px 6px", marginBottom:20, boxShadow: dark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(32,34,43,0.05)"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:4}}>
              <span style={{fontSize:10.5, letterSpacing:ls(1.5), color:textMuted2, fontWeight:700, opacity:0.85}}>{t.weeklyActivity}</span>
              <span style={{fontSize:11.5, fontWeight:700, color:textMuted2}}>
                {(() => {
                  const total = weeklyActivity.reduce((s,w)=>s+w.min,0);
                  const h = Math.floor(total/60), m = total%60;
                  return <>{h > 0 && <><Num>{nf(h)}</Num>h </>}<Num>{nf(m)}</Num>m {lang==="bn" ? "মোট" : "total"}</>;
                })()}
              </span>
            </div>
            <div style={{background:"transparent", borderRadius:14, padding:"14px 0 12px", display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:6, height:118}}>
              {(() => {
                const maxMin = Math.max(1, ...weeklyActivity.map(w=>w.min));
                return weeklyActivity.map((w,i) => {
                  const h = Math.max(4, Math.round((w.min/maxMin)*62));
                  const isToday = dateKey(w.day) === todayKey;
                  const hh = Math.floor(w.min/60), mm = w.min%60;
                  return (
                    <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, height:"100%", justifyContent:"flex-end"}}>
                      {w.min > 0 ? (
                        <span style={{fontSize:10.5, fontWeight:700, color: isToday ? accent : textMuted2, opacity: isToday?1:0.75, whiteSpace:"nowrap"}}>
                          {hh > 0 ? <><Num>{nf(hh)}</Num>h<Num>{nf(mm)}</Num></> : <Num>{nf(mm)}</Num>}
                        </span>
                      ) : <span style={{fontSize:10.5, height:11}}/>}
                      <div style={{width:"100%", maxWidth:22, height:h, borderRadius:8, background: w.min>0 ? (isToday ? accent : inkA(0.33)) : (dark?"#3A342A":"#F2ECDF"), border: w.min>0 ? "none" : `1px dashed ${textMuted2}55`, boxSizing:"border-box", transition:"height .3s"}}/>
                      <span style={{fontSize:10.5, fontWeight:700, color: isToday?accent:textMuted2}}>{weekdayShort(w.day)}</span>
                    </div>
                  );
                });
              })()}
            </div>
            </div>

            {/* Monthly Activity — same bar-chart style as Weekly Activity, grouped by week-of-month */}
            <div style={{background: dark ? cardBg : "#FFFFFF", borderRadius:14, padding:"14px 14px 6px", marginBottom:20, boxShadow: dark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(32,34,43,0.05)"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:4}}>
              <span style={{fontSize:10.5, letterSpacing:ls(1.5), color:textMuted2, fontWeight:700, opacity:0.85}}>{t.monthlyActivity}</span>
              <span style={{fontSize:11.5, fontWeight:700, color:textMuted2}}>
                {(() => {
                  const total = monthlyActivity.reduce((s,w)=>s+w.min,0);
                  const h = Math.floor(total/60), m = total%60;
                  return <>{h > 0 && <><Num>{nf(h)}</Num>h </>}<Num>{nf(m)}</Num>m {lang==="bn" ? "মোট" : "total"}</>;
                })()}
              </span>
            </div>
            <div style={{background:"transparent", borderRadius:14, padding:"14px 0 12px", display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:6, height:118}}>
              {(() => {
                const maxMin = Math.max(1, ...monthlyActivity.map(w=>w.min));
                const currentWeekNum = (() => {
                  const d = today.getDate();
                  let w = 1;
                  for (let i=1;i<d;i++) { if (new Date(today.getFullYear(), today.getMonth(), i).getDay() === 6) w += 1; }
                  return w;
                })();
                return monthlyActivity.map((w,i) => {
                  const h = Math.max(4, Math.round((w.min/maxMin)*62));
                  const isCurrent = w.weekNum === currentWeekNum;
                  const hh = Math.floor(w.min/60), mm = w.min%60;
                  return (
                    <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, height:"100%", justifyContent:"flex-end"}}>
                      {w.min > 0 ? (
                        <span style={{fontSize:10.5, fontWeight:700, color: isCurrent ? accent : textMuted2, opacity: isCurrent?1:0.75, whiteSpace:"nowrap"}}>
                          {hh > 0 ? <><Num>{nf(hh)}</Num>h<Num>{nf(mm)}</Num></> : <Num>{nf(mm)}</Num>}
                        </span>
                      ) : <span style={{fontSize:10.5, height:11}}/>}
                      <div style={{width:"100%", maxWidth:22, height:h, borderRadius:8, background: w.min>0 ? (isCurrent ? accent : inkA(0.33)) : (dark?"#3A342A":"#F2ECDF"), border: w.min>0 ? "none" : `1px dashed ${textMuted2}55`, boxSizing:"border-box", transition:"height .3s"}}/>
                      <span style={{fontSize:10.5, fontWeight:700, color: isCurrent?accent:textMuted2}}>{t.weekLabelShort}<Num>{nf(w.weekNum)}</Num></span>
                    </div>
                  );
                });
              })()}
            </div>
            </div>

            <div style={{display:"flex", alignItems:"center", gap:10, margin:"4px 0 16px"}}>
              <div style={{flex:1, height:1, background:cardBorder}}/>
              <span style={{fontSize:11.5, fontWeight:700, letterSpacing:0.8, color:textMuted2, textTransform:"uppercase", opacity:0.85}}>{lang==="bn" ? "মাস" : "Month"}</span>
              <div style={{flex:1, height:1, background:cardBorder}}/>
            </div>

            <InlineMonthCalendar calMonth={statsCalMonth} setCalMonth={setStatsCalMonth} entries={entries}
              selectedKey={dateKey(statsMonthDay)} onSelectDay={(d)=>{selectStatsDay(d); setSelectedDay(d);}} lang={lang} nf={nf} monthName={monthName} today={today}
              examDateKeys={examDateKeys}
              cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>

            {/* Calendar legend */}
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:16, marginTop:10, flexWrap:"wrap", marginBottom:20}}>
              <span style={{display:"flex", alignItems:"center", gap:4, fontSize:11.5, color:textMuted2, fontWeight:600}}>
                <span style={{width:7,height:7,borderRadius:"50%", background:"#6E8B5E"}}/>{t.calendarLegendCompleted}
              </span>
              <span style={{display:"flex", alignItems:"center", gap:4, fontSize:11.5, color:textMuted2, fontWeight:600}}>
                <span style={{width:7,height:7,borderRadius:"50%", background: dark ? "#F3F1F8" : "#1A1814"}}/>{t.calendarLegendExam}
              </span>
              <span style={{display:"flex", alignItems:"center", gap:4, fontSize:11.5, color:textMuted2, fontWeight:600}}>
                <span style={{width:7,height:7,borderRadius:"50%", background:inkColor}}/>{t.calendarLegendPlanned}
              </span>
              <span style={{display:"flex", alignItems:"center", gap:4, fontSize:11.5, color:textMuted2, fontWeight:600}}>
                <span style={{width:7,height:7,borderRadius:"50%", background:"#C0392B"}}/>{t.calendarLegendHoliday}
              </span>
            </div>

            <TopicSummaryPeriodCard
              label={t.weeklySummary}
              rangeLabel={`${nf(summaryWeekStart.getDate())} ${monthName(summaryWeekStart.getMonth())} – ${nf(summaryWeekEnd.getDate())} ${monthName(summaryWeekEnd.getMonth())}`}
              isComplete={summaryWeekComplete}
              pendingText={t.summaryPendingWeek}
              covered={summaryWeekTopics.covered} missed={summaryWeekTopics.missed}
              canGoPrev={true} canGoNext={canGoNextSummaryWeek}
              onPrev={()=>setSummaryWeekAnchor(d=>{const x=new Date(d); x.setDate(x.getDate()-7); return x;})}
              onNext={()=>setSummaryWeekAnchor(d=>{const x=new Date(d); x.setDate(x.getDate()+7); return x;})}
              sourceLabel={t.planViewStudy} sourceColor={inkColor}
              t={t} nf={nf} cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}/>

            <TopicSummaryPeriodCard
              label={t.monthlySummary}
              rangeLabel={`${monthName(summaryMonthM)} ${nf(summaryMonthY)}`}
              isComplete={summaryMonthComplete}
              pendingText={t.summaryPendingMonth}
              covered={summaryMonthTopics.covered} missed={summaryMonthTopics.missed}
              canGoPrev={true} canGoNext={canGoNextSummaryMonth}
              onPrev={()=>setSummaryMonthAnchor(d=>new Date(d.getFullYear(), d.getMonth()-1, 1))}
              onNext={()=>setSummaryMonthAnchor(d=>new Date(d.getFullYear(), d.getMonth()+1, 1))}
              sourceLabel={t.planViewStudy} sourceColor={inkColor}
              t={t} nf={nf} cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}/>
          </div>
        )}

      </div>

      {/* Bottom nav — নচ-কাট ফ্ল্যাট বার + মাঝখানে উঁচু "Add" FAB (Instagram/food-delivery অ্যাপ স্টাইল)।
          Today/Study বাম পাশে, Task/Stats ডান পাশে; Stats আসলে Study ট্যাবেরই studySection="stats" ভিউ
          (আলাদা কোনো নতুন কন্টেন্ট স্ট্রাকচার লাগেনি)। Add বাটন context-aware: Study(Plan)-এ থাকলে সরাসরি
          Add Study, Task ট্যাবে থাকলে সরাসরি Add Task, নাহলে (Today/Stats) ছোট choice popup দেখায়।
          দুইয়ের একটা ফিচার বন্ধ থাকলে popup-ই লাগে না — Add সবসময় সরাসরি সেটাই খোলে। */}
      {!isDesktop && (() => {
        const addEnabled = studyFeatureEnabled || tasksFeatureEnabled;
        const onlyStudy = studyFeatureEnabled && !tasksFeatureEnabled;
        const onlyTask = tasksFeatureEnabled && !studyFeatureEnabled;
        const isStudyActive = tab === "study" && studySection === "plan";
        const isStatsActive = tab === "study" && studySection === "stats";

        const handleAddTap = () => {
          vibrate();
          if (onlyStudy) { setAddTargetKey(todayKey); setShowAdd(true); return; }
          if (onlyTask) { setTaskAddDefaultDate(todayKey); setShowAddTask(true); return; }
          if (tab === "study" && studySection === "plan") { setAddTargetKey(todayKey); setShowAdd(true); return; }
          if (tab === "task") { setTaskAddDefaultDate(todayKey); setShowAddTask(true); return; }
          setShowQuickAddMenu(v=>!v);
        };

        const leftTabs = [
          {k:"today", Icon: Home, label: t.tabs.today, active: tab === "today", onClick: ()=>{vibrate(); setTab("today");}},
          ...(studyFeatureEnabled ? [{k:"study", Icon: GraduationCap, label: t.tabs.study, active: isStudyActive, onClick: ()=>{vibrate(); setTab("study"); setStudySection("plan");}}] : []),
        ];
        const rightTabs = [
          ...(tasksFeatureEnabled ? [{k:"task", Icon: ListChecks, label: t.tabs.task, active: tab === "task", onClick: ()=>{vibrate(); setTab("task");}}] : []),
          ...(studyFeatureEnabled ? [{k:"stats", Icon: BarChart3, label: t.tabs.stats, active: isStatsActive, onClick: ()=>{vibrate(); setTab("study"); setStudySection("stats");}}] : []),
        ];

        const TabBtn = ({Icon, label, active, onClick}) => (
          <button onClick={onClick} style={{
            flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4,
            border:"none", background:"transparent", cursor:"pointer", padding:"3px 2px 0",
            color: active ? accent : textMuted2,
          }}>
            <Icon size={21} strokeWidth={active?2.3:1.9}/>
            <span style={{fontSize:10.5, fontWeight:600, lineHeight:1}}>{label}</span>
          </button>
        );

        const BAR_H = 54, NOTCH_R = 30, FAB = 50;

        if (!addEnabled) {
          // শুধু Today ট্যাব থাকলে (Study/Task দুটোই বন্ধ) — সাধারণ ফ্ল্যাট বার, নচ/FAB লাগবে না
          return (
            <div style={{
              position:"sticky", left:0, right:0, bottom:0, zIndex:40,
              background: cardBg, borderTop:`1px solid ${cardBorder}`,
              paddingTop:5, paddingBottom:"calc(8px + env(safe-area-inset-bottom))",
              boxShadow: dark ? "0 -2px 12px rgba(0,0,0,0.25)" : "0 -2px 12px rgba(0,0,0,0.05)",
            }}>
              <div style={{width:"100%", maxWidth:480, margin:"0 auto", display:"flex"}}>
                <TabBtn Icon={Home} label={t.tabs.today} active={true} onClick={()=>{}}/>
              </div>
            </div>
          );
        }

        return (
          <div style={{position:"sticky", left:0, right:0, bottom:0, zIndex:40}}>
            <div style={{position:"relative", width:"100%", maxWidth:480, margin:"0 auto"}}>
              <svg width="100%" height={BAR_H + 4} viewBox={`0 0 480 ${BAR_H + 4}`} preserveAspectRatio="none" style={{display:"block"}}>
                <path
                  d={`M0,4
                      L${240 - NOTCH_R - 14},4
                      C${240 - NOTCH_R + 2},4 ${240 - NOTCH_R + 6},${NOTCH_R * 0.9} ${240},${NOTCH_R * 0.9}
                      C${240 + NOTCH_R - 6},${NOTCH_R * 0.9} ${240 + NOTCH_R - 2},4 ${240 + NOTCH_R + 14},4
                      L480,4
                      L480,${BAR_H + 4}
                      L0,${BAR_H + 4}
                      Z`}
                  fill={cardBg} stroke={cardBorder} strokeWidth="1"
                />
              </svg>

              <div style={{position:"absolute", top:4, left:0, right:0, height:BAR_H, display:"flex", alignItems:"stretch", paddingBottom:"env(safe-area-inset-bottom)"}}>
                <div style={{flex:1, display:"flex"}}>{leftTabs.map(tb => <TabBtn key={tb.k} {...tb}/>)}</div>
                <div style={{width:NOTCH_R*2}}/>
                <div style={{flex:1, display:"flex"}}>{rightTabs.map(tb => <TabBtn key={tb.k} {...tb}/>)}</div>
              </div>

              {showQuickAddMenu && (
                <>
                  <div onClick={()=>setShowQuickAddMenu(false)} style={{position:"fixed", inset:0, zIndex:44}}/>
                  <div style={{
                    position:"absolute", bottom:BAR_H + 26, left:"50%", transform:"translateX(-50%)", zIndex:45,
                    background: cardBg, border:`1px solid ${cardBorder}`, borderRadius:14,
                    boxShadow: dark ? "0 8px 22px rgba(0,0,0,0.35)" : "0 8px 22px rgba(0,0,0,0.14)",
                    minWidth:172, padding:6,
                  }}>
                    {studyFeatureEnabled && (
                      <button onClick={()=>{ vibrate(); setShowQuickAddMenu(false); setAddTargetKey(todayKey); setShowAdd(true); }} style={{
                          width:"100%", display:"flex", alignItems:"center", gap:10, border:"none", background:"transparent",
                          padding:"9px 10px", borderRadius:10, cursor:"pointer", textAlign:"left",
                        }}>
                        <GraduationCap size={16} color={textMuted2}/>
                        <span style={{fontSize:13.5, fontWeight:600, color:textMain}}>{lang==="bn" ? "স্টাডি যোগ করো" : "Add Study"}</span>
                      </button>
                    )}
                    {tasksFeatureEnabled && (
                      <button onClick={()=>{ vibrate(); setShowQuickAddMenu(false); setTaskAddDefaultDate(todayKey); setShowAddTask(true); }} style={{
                          width:"100%", display:"flex", alignItems:"center", gap:10, border:"none", background:"transparent",
                          padding:"9px 10px", borderRadius:10, cursor:"pointer", textAlign:"left",
                        }}>
                        <ListChecks size={16} color={textMuted2}/>
                        <span style={{fontSize:13.5, fontWeight:600, color:textMain}}>{lang==="bn" ? "টাস্ক যোগ করো" : "Add Task"}</span>
                      </button>
                    )}
                  </div>
                </>
              )}

              <button onClick={handleAddTap} style={{
                  position:"absolute", left:"50%", top: -FAB/2 + 8, transform:"translateX(-50%)",
                  width:FAB, height:FAB, borderRadius:"50%", border:"none",
                  background: dark ? "#F3F1F8" : "#1A1814",
                  color: dark ? "#1A1814" : "#FFFFFF",
                  display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
                  boxShadow: dark ? "0 6px 18px rgba(0,0,0,0.5)" : "0 6px 16px rgba(26,24,20,0.35)",
                  zIndex:46,
                }}>
                <Plus size={20} strokeWidth={2.4}/>
              </button>
            </div>
          </div>
        );
      })()}
      </div>

      {/* নতুন Focus Timer পেজ (screenshot ডিজাইন) — Timer/Stopwatch টগল, রিং, Session Goal, Lap লিস্ট */}
      {showFocusTimerPage && !focusFullscreen && (
        <FocusTimerPage
          t={t} lang={lang} nf={nf} accent={accent} dark={dark}
          cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2}
          focusMode={focusMode} setFocusMode={setFocusMode}
          timerRunning={timerRunning} timerSeconds={timerSeconds} timerTotal={timerTotal}
          onToggleTimer={toggleTimerRunning}
          onStopTimer={()=>{ vibrate(); setTimerRunning(false); }}
          onResetTimer={()=>{ vibrate(); setTimerRunning(false); setTimerSeconds(timerTotal); }}
          stopwatchRunning={stopwatchRunning} stopwatchSeconds={stopwatchSeconds}
          onToggleStopwatch={toggleStopwatchRunning}
          onResetStopwatch={()=>{ vibrate(); setStopwatchRunning(false); setStopwatchSeconds(0); setLapTimes([]); }}
          lapTimes={lapTimes} onAddLap={addLap}
          pomodoroSession={pomodoroSession} pomodoroTotalSessions={pomodoroTotalSessions}
          onClose={closeFocusTimerPage}
          onExpand={()=>{ vibrate(); setFocusFullscreen(true); }}
          vibrate={vibrate}
        />
      )}

      {/* Fullscreen focus timer (পুরনো কালো ইমার্সিভ ফ্লিপ-ক্লক) — এখন শুধু FocusTimerPage-এর expand আইকন থেকে খোলে */}
      {focusFullscreen && (
        <FullscreenFocus
          t={t} nf={nf} mode={focusMode} now={now}
          seconds={focusMode === "timer" ? timerSeconds : stopwatchSeconds}
          total={timerTotal}
          running={focusMode === "timer" ? timerRunning : stopwatchRunning}
          topicLabel={timerTopic ? `${timerTopic.subject} — ${timerTopic.topic}` : (focusMode === "timer" ? t.freeSession : t.pickTopicForTimer)}
          accent={accent} dark={dark} bg={bg} textMain={textMain} textMuted2={textMuted2}
          onToggleRun={focusMode === "timer" ? toggleTimerRunning : toggleStopwatchRunning}
          onReset={()=>{
            if (focusMode === "timer") { setTimerRunning(false); setTimerSeconds(timerTotal); }
            else { setStopwatchRunning(false); setStopwatchSeconds(0); setLapTimes([]); }
          }}
          onClose={closeFocusFullscreen}
          sessionType={sessionType} pomodoroSession={pomodoroSession} pomodoroTotalSessions={pomodoroTotalSessions}
          timerTargetMinutes={timerTargetMinutes} timerElapsedMinutes={timerElapsedMinutes}
        />
      )}

      {/* "Focus complete — Take a X min break?" প্রম্পট */}
      {showBreakPrompt && (
        <BreakPromptModal t={t} nf={nf} breakMinutes={breakMinutes} accent={accent}
          onAccept={acceptBreak} onSkip={skipBreak}/>
      )}

      {/* Add topic modal */}
      {showAdd && (
        <AddModal t={t} nf={nf} subjects={subjects} entries={entries} topicBank={topicBank} onAddTopicToBank={addTopicToBank} onAddSubject={addSubject} defaultStart={`${pad2(now.getHours())}:${pad2(now.getMinutes())}`}
          onClose={()=>setShowAdd(false)} onAdd={addTopic}
          cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
      )}

      {/* Add / Edit task modal */}
      {(showAddTask || editingTask) && (
        <AddTaskModal t={t} lang={lang} onClose={()=>{setShowAddTask(false);setEditingTask(null);setTaskAddDefaultDate(null);}}
          onSubmit={editingTask ? updateTask : addTask} initialTask={editingTask} defaultDueDate={taskAddDefaultDate}
          categories={taskCategories} onAddCategory={addTaskCategory}
          cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark} bg={bg}/>
      )}

      {/* টাস্ক ডিটেইল শিট — লিস্টের রো-তে ট্যাপ করলে খোলে, ফুল টাইটেল/নোট/মেটা দেখায়, "এডিট" চাপলে AddTaskModal খোলে */}
      {taskDetailId && (() => {
        const x = tasks.find(tk => tk.id === taskDetailId);
        if (!x) return null;
        const pr = x.priority || "med";
        return (
          <TaskDetailSheet
            task={x} priorityLabel={{high:t.taskPrHigh, med:t.taskPrMed, low:t.taskPrLow}[pr]}
            priorityColor={{high:"#C0392B", med:accent, low:"#6E8B5E"}[pr]}
            lang={lang} nf={nf}
            onClose={()=>setTaskDetailId(null)}
            onToggleDone={()=>{vibrate(); toggleTask(x.id);}}
            onToggleFavorite={()=>{vibrate(); toggleTaskFavorite(x.id);}}
            onPlayAudio={()=>playTaskAudio(x)}
            onEdit={()=>{setTaskDetailId(null); setEditingTask(x);}}
            onDelete={()=>{ setTaskDetailId(null); vibrate(); deleteTask(x.id); }}
            cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark} bg={bg}/>
        );
      })()}

      {/* Edit topic modal */}
      {editTopic && (
        <EditModal t={t} nf={nf} subjects={subjects} entries={entries} topicBank={topicBank} onAddTopicToBank={addTopicToBank} item={editTopic} onClose={()=>setEditTopic(null)} onSave={saveEditTopic} cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
      )}

      {/* Manage subjects modal (Syllabus — সাবজেক্ট + প্রতি সাবজেক্টের Topic Bank) */}
      {showSubjects && (
        <SubjectsModal t={t} subjects={subjects} onAdd={addSubject} onRemove={removeSubject} onRename={renameSubject} onClose={()=>setShowSubjects(false)}
          topicBank={topicBank} onAddTopic={addTopicToBank} onAddTopicsBulk={addTopicsBulkToBank} onRemoveTopic={removeTopicFromBank} onRenameTopic={renameTopicInBank}
          expandedSubject={showManageTopicsFor} onToggleExpand={(s)=>setShowManageTopicsFor(prev => prev===s ? null : s)}
          cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
      )}

      {/* Universal search — টাস্ক/নোট/সাবজেক্ট/টপিক/পরীক্ষা সব একসাথে খোঁজার মডাল, হেডারের সার্চ আইকন থেকে খোলে */}
      {showSearch && (
        <UniversalSearchModal
          lang={lang} dark={dark} cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}
          tasks={tasks} notes={notes} allSubjects={allSubjects} topicBank={topicBank} examSubjects={examSubjects} examSchedule={examSchedule} sortMode={searchSortMode}
          onClose={()=>setShowSearch(false)}
          onOpenTask={(x)=>{ setShowSearch(false); setTab("task"); setTaskDetailId(x.id); }}
          onOpenNote={()=>{ setShowSearch(false); }}
          onOpenSubject={(s)=>{ setShowSearch(false); setTab("study"); setStudySection("plan"); setShowManageTopicsFor(s); setShowSubjects(true); }}
          onOpenExam={()=>{ setShowSearch(false); setTab("study"); setStudySection("plan"); setShowExamSchedule(true); }}
        />
      )}

      {/* Manage exams modal */}
      {showExams && (
        <ExamsModal t={t} nf={nf} subjects={allSubjects} examSubjects={examSubjects} onAdd={addExamSubject} onRemove={removeExamSubject} onClose={()=>setShowExams(false)}
          cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
      )}

      {/* Combined exam add/edit modal */}
      {showCombinedExamEditor && (
        <CombinedExamEditorModal t={t} allSubjects={allSubjects} editingCombinedExam={editingCombinedExam}
          onSave={(name,type,subjectsList)=>{
            if (editingCombinedExam) editCombinedExam(editingCombinedExam.id, name, type, subjectsList);
            else addCombinedExam(name, type, subjectsList);
            setShowCombinedExamEditor(false); setEditingCombinedExam(null);
          }}
          onClose={()=>{setShowCombinedExamEditor(false); setEditingCombinedExam(null);}}
          cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
      )}

      {/* Next exam editor modal */}
      {showNextExamEditor && (
        <NextExamModal t={t} examSubjects={examSubjects} nextExam={nextExam} onSave={(val)=>{setNextExam(val); setShowNextExamEditor(false);}}
          onClose={()=>setShowNextExamEditor(false)}
          cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
      )}

      {/* Exam Schedule ম্যানেজার — একাধিক তারিখ-সহ পরীক্ষা যোগ/এডিট/ডিলিট করার মডাল, Home ও Study দুই ট্যাবের কার্ড থেকেই খোলে */}
      {showExamSchedule && (
        <ExamScheduleModal t={t} lang={lang} nf={nf} allSubjects={allSubjects} examSchedule={examSchedule}
          onAdd={addExamScheduleItem} onUpdate={updateExamScheduleItem} onRemove={removeExamScheduleItem}
          onClose={()=>setShowExamSchedule(false)}
          cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark} bg={bg}/>
      )}

      {/* Calendar month view */}
      {showCalendar && (
        <CalendarModal t={t} lang={lang} nf={nf} monthName={monthName} weekdayShort={weekdayShort}
          calMonth={calMonth} setCalMonth={setCalMonth} entries={entries} examDateKeys={examDateKeys}
          onClose={()=>setShowCalendar(false)} onSelectDay={(d)=>{setSelectedDay(d); setShowCalendar(false);}}
          cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark} today={today}/>
      )}

      {/* Day detail modal */}
      {selectedDay && (
        <DayDetailModal t={t} lang={lang} nf={nf} weekdayName={weekdayName} monthName={monthName}
          day={selectedDay} entries={entries[dateKey(selectedDay)] || []} allSubjects={allSubjects} tasks={tasks}
          onClose={()=>setSelectedDay(null)} cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
      )}

      {/* Profile tab — user icon-এ ক্লিক করলে এটা খোলে */}
      {showProfile && (
        <ProfileModal t={t} lang={lang} user={user} isGuest={isGuest} onClose={()=>setShowProfile(false)}
          onExitGuest={() => { clearGuestData(); setIsGuest(false); setShowProfile(false); }}
          onUserUpdate={(patch)=>setUser(u=>({...u, ...patch}))}
          cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
      )}

      {/* Profile full-page — হেডারের প্রোফাইল আইকনে ক্লিক করলে খোলে। Settings ট্যাবের মতোই ডিজাইন
          (প্রোফাইল কার্ড + Preferences), কিন্তু পুরো স্ক্রিন ঢেকে রাখে বলে নিচের ৫-ট্যাব বার দেখা যায় না,
          আর উপরে "Settings" এর বদলে একটা ব্যাক বাটন থাকে (onBack প্রপ দেওয়া থাকলে) */}
      {showProfilePage && (
        <div style={{position:"fixed", inset:0, zIndex:70, background:bg, overflowY:"auto"}}>
          <div style={{...styles.container, minHeight:"100%", boxSizing:"border-box"}}>
            <SettingsModal t={t} lang={lang} setLang={setLang} themeMode={themeMode} setThemeMode={setThemeMode}
              accentKey={accentKey} setAccentKey={setAccentKey}
              notificationsEnabled={notificationsEnabled} setNotificationsEnabled={setNotificationsEnabled} asPage
              onBack={()=>{ setShowProfilePage(false); setSettingsInitialOpenCard(null); setSettingsInitialAction(null); }}
              initialOpenCard={settingsInitialOpenCard} initialAction={settingsInitialAction}
              headerNotifications={notifications} onMarkAllNotifRead={()=>setNotifications(prev => prev.map(n => ({...n, read:true})))}
              onClearNotifs={()=>setNotifications([])} onOpenSearch={()=>{ setShowProfilePage(false); setShowSearch(true); }}
              examNotifEnabled={examNotifEnabled} setExamNotifEnabled={setExamNotifEnabled}
              taskNotifEnabled={taskNotifEnabled} setTaskNotifEnabled={setTaskNotifEnabled}
              salahNotifEnabled={salahNotifEnabled} setSalahNotifEnabled={setSalahNotifEnabled}
              timerNotifEnabled={timerNotifEnabled} setTimerNotifEnabled={setTimerNotifEnabled}
              alarmNotifEnabled={alarmNotifEnabled} setAlarmNotifEnabled={setAlarmNotifEnabled}
              salahFeatureEnabled={salahFeatureEnabled} setSalahFeatureEnabled={setSalahFeatureEnabled}
              studyFeatureEnabled={studyFeatureEnabled} setStudyFeatureEnabled={setStudyFeatureEnabled}
              tasksFeatureEnabled={tasksFeatureEnabled} setTasksFeatureEnabled={setTasksFeatureEnabled}
              focusMinutes={focusMinutes} setFocusMinutes={setFocusMinutes}
              breakMinutes={breakMinutes} setBreakMinutes={setBreakMinutes}
              weekStartDay={weekStartDay} setWeekStartDay={changeWeekStartDay}
              user={user} isGuest={isGuest} onOpenProfile={() => { setShowProfilePage(false); setShowProfile(true); }}
              notes={notes} tasks={tasks} subjects={subjects} setNotes={setNotes} setTasks={setTasks} setSubjects={setSubjects}
              textScale={textScale} setTextScale={setTextScale} TEXT_SCALE_OPTIONS={TEXT_SCALE_OPTIONS}
              cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
          </div>
        </div>
      )}

      {/* Undo toast — যেকোনো ডিলিটের পর কয়েক সেকেন্ড দেখা যায়, চাপলে আগের অবস্থায় ফিরে যায় */}
      {undoToast && (
        <div style={{position:"fixed", left:"50%", bottom:isDesktop?24:88, transform:"translateX(-50%)", zIndex:80,
          background: dark?"#242424":"#262433", color:"#F3F1F8", borderRadius:12, padding:"11px 12px 11px 16px",
          display:"flex", alignItems:"center", gap:16, boxShadow:"0 5px 16px rgba(0,0,0,0.16)",
          maxWidth:"calc(100vw - 32px)", animation:"fg-fade-up .2s cubic-bezier(0.16,1,0.3,1)"}}>
          <span style={{fontSize:13.5, fontWeight:600, whiteSpace:"nowrap"}}>{undoToast.message}</span>
          <button onClick={()=>{ const fn = undoToast.onUndo; dismissUndoToast(); vibrate(); fn && fn(); }}
            style={{border:"none", background:"transparent", color:accent, fontSize:13.5, fontWeight:800, cursor:"pointer", padding:"4px 4px", flexShrink:0, textTransform:"uppercase", letterSpacing:0.3}}>
            {lang==="bn" ? "আনডু" : "Undo"}
          </button>
          <button onClick={dismissUndoToast} aria-label={lang==="bn"?"বন্ধ করুন":"Dismiss"}
            style={{border:"none", background:"transparent", color:"#8A8272", cursor:"pointer", padding:2, display:"flex", flexShrink:0}}>
            <X size={14}/>
          </button>
        </div>
      )}

      {/* Strict Mode গ্রেস কাউন্টডাউন — অ্যাপ ছেড়ে গিয়ে দ্রুত ফিরে এলে এই ব্যানারটা সংক্ষিপ্ত সময়ের জন্য দেখা যেতে পারে */}
      {strictGraceLeft !== null && (
        <div style={{position:"fixed", left:"50%", top:14, transform:"translateX(-50%)", zIndex:90,
          background:"#C0392B", color:"#fff", borderRadius:14, padding:"10px 16px",
          display:"flex", alignItems:"center", gap:8, boxShadow:"0 6px 18px rgba(192,57,43,0.4)",
          maxWidth:"calc(100vw - 32px)", animation:"fg-fade-up .2s cubic-bezier(0.16,1,0.3,1)"}}>
          <ShieldAlert size={16}/>
          <span style={{fontSize:13.5, fontWeight:700, whiteSpace:"nowrap"}}>
            {lang==="bn" ? `ফিরে আসুন! সেশন ফেইল হতে বাকি ${strictGraceLeft} সেকেন্ড` : `Come back! Session fails in ${strictGraceLeft}s`}
          </span>
        </div>
      )}

      {/* Exit toast — "Today" ট্যাবে ব্যাক বাটন চাপলে দেখা যায়; ২ সেকেন্ডের মধ্যে আবার চাপলে অ্যাপ বন্ধ হবে */}
      {showExitToast && (
        <div style={{position:"fixed", left:"50%", bottom:isDesktop?24:88, transform:"translateX(-50%)", zIndex:80,
          background: dark?"#242424":"#262433", color:"#F3F1F8", borderRadius:12, padding:"11px 16px",
          display:"flex", alignItems:"center", boxShadow:"0 5px 16px rgba(0,0,0,0.16)",
          maxWidth:"calc(100vw - 32px)", animation:"fg-fade-up .2s cubic-bezier(0.16,1,0.3,1)"}}>
          <span style={{fontSize:13.5, fontWeight:600, whiteSpace:"nowrap"}}>
            {lang==="bn" ? "বের হতে আবার ব্যাক বাটন চাপুন" : "Press back again to exit"}
          </span>
        </div>
      )}
    </div>
  );
}

// লগইন/গেস্ট-মোডে ঢোকার পর (onboarding/loading/মূল অ্যাপ রেন্ডার করার সময়) যদি কোনো JS error হয়,
// আগে পুরো স্ক্রিন সাদা/ফাঁকা হয়ে যেত (React ক্র্যাশ করে কিছুই রেন্ডার করত না) — কোনো error message
// চোখেই পড়ত না, তাই বাগ খুঁজে বের করা কঠিন ছিল। এই ErrorBoundary সেই ক্র্যাশ ধরে ফেলে এবং আসল error
// message + stack trace স্ক্রিনে দেখায়, সাথে "আবার চেষ্টা করুন" বাটন — এতে সমস্যাটা ঠিক কোথায় তা
// সহজেই বোঝা যাবে, আর ইউজারও পুরোপুরি আটকে থাকবেন না।
class FocusGoErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("FocusGo crashed:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20, background: "#F8F5EF", color: "#1A1814", fontFamily: "system-ui, sans-serif",
        }}>
          <div style={{ width: "100%", maxWidth: 440, background: "#fff", border: "1px solid #E7E5ED", borderRadius: 14, padding: "24px 20px" }}>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 10, color: "#C0553F" }}>
              অ্যাপ একটা সমস্যায় আটকে গেছে
            </div>
            <div style={{ fontSize: 13, color: "#6E6B7A", marginBottom: 14, lineHeight: 1.5 }}>
              নিচের error message-টা স্ক্রিনশট নিয়ে পাঠিয়ে দিলে সমস্যাটা ঠিক করে দেওয়া যাবে।
            </div>
            <pre style={{
              fontSize: 11.5, background: "#F7F6FA", border: "1px solid #E7E5ED", borderRadius: 10,
              padding: 12, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 260, overflowY: "auto",
            }}>
              {String(this.state.error && (this.state.error.stack || this.state.error.message || this.state.error))}
            </pre>
            <button onClick={() => window.location.reload()} style={{
                marginTop: 16, width: "100%", border: "none", borderRadius: 12, padding: "12px 0",
                fontSize: 14, fontWeight: 800, background: "#1A1814", color: "#fff", cursor: "pointer",
              }}>
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function FocusGo() {
  return (
    <FocusGoErrorBoundary>
      <FocusGoInner />
    </FocusGoErrorBoundary>
  );
}

// Big flip-clock-style digit block for the fullscreen focus timer.
// stacked=true -> vertical (portrait) layout: wider block, bigger digits.
// running=true -> timer চলছে, তখন কালো ব্যাকগ্রাউন্ডে মিশে যাওয়ার জন্য কার্ডের বক্স/বর্ডার সরিয়ে দেওয়া হয়।
function FlipBlock({ children, textMain, dark, stacked, running, blockWidth, blockHeight }) {
  const width = blockWidth || (stacked ? "clamp(190px, 70vw, 320px)" : "clamp(120px, 28vw, 240px)");
  const height = blockHeight || (stacked ? "clamp(110px, 40vw, 200px)" : "clamp(95px, 24vw, 170px)");
  return (
    <div style={{
      position:"relative",
      background: running ? "transparent" : (dark ? "#1F1B17" : "#FFFFFF"),
      border: running ? "1px solid rgba(245,241,232,0.28)" : `1px solid ${dark ? "#332E25" : "#F0DCC9"}`,
      borderRadius:14,
      width,
      height,
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      overflow:"hidden",
      boxShadow: (!running && !dark) ? "0 6px 18px rgba(33,29,24,0.06)" : "none",
    }}>
      <div style={{
        fontFamily:"'Bebas Neue','Noto Sans Bengali',sans-serif",
        fontSize: stacked ? "clamp(100px, 36vw, 230px)" : "clamp(80px, 20vw, 170px)",
        fontWeight:400,
        lineHeight:1,
        color:textMain,
        fontVariantNumeric:"tabular-nums",
        letterSpacing:2,
        textAlign:"center",
      }}>
        {children}
      </div>
      {!running && (
        <div style={{position:"absolute", left:0, right:0, top:"50%", height:1, background: dark ? "rgba(0,0,0,0.35)" : "rgba(33,29,24,0.08)"}}/>
      )}
    </div>
  );
}

// Fullscreen focus session view, entered when the timer/stopwatch is started.
// পুরো fullscreen সবসময় কালো — অ্যাপের light/dark/system theme যাই থাকুক না কেন,
// আর running/paused যেকোনো অবস্থাতেই (শুধু running হলে বদলাতো না, এখন expand করলেই কালো)।
// "Focus complete — Take a X min break?" প্রম্পট — Focus session শেষ হলে টাইমারের ওপর ওভারলে হিসেবে দেখা যায়
function BreakPromptModal({ t, nf, breakMinutes, accent, onAccept, onSkip }) {
  return (
    <div style={{position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
      <div style={{background:"#1A1A1A", color:"#F5F1E8", borderRadius:14, padding:"26px 22px", maxWidth:320, width:"100%", textAlign:"center"}}>
        <div style={{fontSize:18.5, fontWeight:800, marginBottom:8}}>{t.focusCompleteTitle}</div>
        <div style={{fontSize:14.5, color:"#B8B2A2", marginBottom:20}}>
          {t.takeBreakQuestion} <Num>{nf(breakMinutes)}</Num> {t.breakQSuffix}
        </div>
        <div style={{display:"flex", gap:10}}>
          <button onClick={onSkip} style={{flex:1, background:"#333029", border:"none", borderRadius:12, padding:"10px 0", color:"#F5F1E8", fontWeight:700, fontSize:13.5, cursor:"pointer"}}>
            {t.skipBreakBtn}
          </button>
          <button onClick={onAccept} style={{flex:1, background:accent, border:"none", borderRadius:12, padding:"10px 0", color:"#fff", fontWeight:700, fontSize:13.5, cursor:"pointer"}}>
            {t.startBreakBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

// নতুন ফুল-স্ক্রিন Focus Timer পেজ — screenshot অনুযায়ী: হালকা ব্যাকগ্রাউন্ড, Timer/Stopwatch পিল-টগল,
// Timer মোডে বড় সার্কুলার প্রগ্রেস রিং + Stop/Start/Reset, নিচে Session Goal কার্ড;
// Stopwatch মোডে বড় ডিজিট + Lap লিস্ট + Reset/Start/Lap। উপরের ডান কোণার expand আইকনে পুরনো কালো
// ইমার্সিভ ফ্লিপ-ক্লক (FullscreenFocus) খোলে।
function FocusTimerPage({
  t, lang, nf, accent, dark, cardBg, cardBorder, textMain, textMuted2,
  focusMode, setFocusMode,
  timerRunning, timerSeconds, timerTotal, onToggleTimer, onStopTimer, onResetTimer,
  stopwatchRunning, stopwatchSeconds, onToggleStopwatch, onResetStopwatch, lapTimes, onAddLap,
  pomodoroSession, pomodoroTotalSessions,
  onClose, onExpand, vibrate,
}) {
  const screenBg = dark ? "#141414" : "#F7F5FB";
  const pillTrackBg = dark ? "#1E1E1E" : "#EEEBF7";
  const isTimer = focusMode === "timer";
  const runningNow = isTimer ? timerRunning : stopwatchRunning;
  const mm = pad2(Math.floor(Math.max(0, (isTimer ? timerSeconds : stopwatchSeconds)) / 60));
  const ss = pad2(Math.max(0, (isTimer ? timerSeconds : stopwatchSeconds)) % 60);
  const ringSize = 260, ringStroke = 10;
  const r = (ringSize - ringStroke) / 2;
  const circumference = 2 * Math.PI * r;
  const donePct = timerTotal > 0 ? Math.min(100, Math.max(0, ((timerTotal - timerSeconds) / timerTotal) * 100)) : 0;
  const ringOffset = circumference - (donePct / 100) * circumference;
  const sessionPct = pomodoroTotalSessions > 0 ? Math.min(100, Math.max(0, (pomodoroSession / pomodoroTotalSessions) * 100)) : 0;

  return (
    <div style={{position:"fixed", inset:0, zIndex:90, background:screenBg, color:textMain, display:"flex", flexDirection:"column", overflowY:"auto"}}>
      {/* Header */}
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"calc(14px + var(--fg-safe-top, env(safe-area-inset-top, 0px))) 18px 0", flexShrink:0}}>
        <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMain, display:"flex", padding:6}}>
          <ChevronLeft size={22}/>
        </button>
        <div style={{fontSize:16.5, fontWeight:800}}>{t.focusTimer}</div>
        <button onClick={onExpand} style={{border:"none", background:"transparent", cursor:"pointer", color:textMain, display:"flex", padding:6}}>
          <Maximize2 size={19}/>
        </button>
      </div>

      {/* Timer / Stopwatch পিল টগল */}
      <div style={{padding:"18px 18px 0", flexShrink:0}}>
        <div style={{display:"flex", gap:4, background:pillTrackBg, borderRadius:14, padding:4}}>
          <button
            onClick={()=>{ if (timerRunning || stopwatchRunning) return; vibrate(); setFocusMode("timer"); }}
            disabled={timerRunning || stopwatchRunning}
            style={{flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, border:"none", borderRadius:11, padding:"10px 0",
              background: isTimer ? (dark ? `${accent}33` : `${accent}26`) : "transparent",
              color: isTimer ? accent : textMuted2, fontWeight:700, fontSize:14, cursor:(timerRunning||stopwatchRunning) ? "default" : "pointer",
              opacity:(timerRunning||stopwatchRunning) && !isTimer ? 0.5 : 1}}>
            <Hourglass size={15}/>{t.timerMode}
          </button>
          <button
            onClick={()=>{ if (timerRunning || stopwatchRunning) return; vibrate(); setFocusMode("stopwatch"); }}
            disabled={timerRunning || stopwatchRunning}
            style={{flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, border:"none", borderRadius:11, padding:"10px 0",
              background: !isTimer ? (dark ? `${accent}33` : `${accent}26`) : "transparent",
              color: !isTimer ? accent : textMuted2, fontWeight:700, fontSize:14, cursor:(timerRunning||stopwatchRunning) ? "default" : "pointer",
              opacity:(timerRunning||stopwatchRunning) && isTimer ? 0.5 : 1}}>
            <Clock size={15}/>{t.stopwatchMode}
          </button>
        </div>
      </div>

      <div style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 18px 20px", minHeight:0}}>
        {isTimer ? (
          <>
            {/* বড় সার্কুলার প্রগ্রেস রিং — ভেতরে "Focus Time" + mm:ss + "Stay focused" */}
            <div style={{position:"relative", width:ringSize, height:ringSize, flexShrink:0}}>
              <svg width={ringSize} height={ringSize} style={{transform:"rotate(-90deg)"}}>
                <circle cx={ringSize/2} cy={ringSize/2} r={r} fill="none" stroke={dark ? "#2A2A33" : "#E6E1F5"} strokeWidth={ringStroke}/>
                <circle cx={ringSize/2} cy={ringSize/2} r={r} fill="none" stroke={accent} strokeWidth={ringStroke}
                  strokeDasharray={circumference} strokeDashoffset={ringOffset} strokeLinecap="round"
                  style={{transition: runningNow ? "stroke-dashoffset 1s linear" : "stroke-dashoffset .3s ease"}}/>
              </svg>
              <div style={{position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4}}>
                <div style={{fontSize:14, fontWeight:600, color:textMuted2}}>{t.focusTimeLabel}</div>
                <div style={{fontSize:44, fontWeight:800, letterSpacing:-1, fontVariantNumeric:"tabular-nums", color:textMain}}>
                  <Num>{nf(mm)}</Num>:<Num>{nf(ss)}</Num>
                </div>
                <div style={{display:"flex", alignItems:"center", gap:5, fontSize:13, fontWeight:500, color:textMuted2}}>
                  {t.stayFocusedLabel} <Heart size={13} color={accent} fill={accent}/>
                </div>
              </div>
            </div>

            {/* Stop / Start / Reset */}
            <div style={{display:"flex", alignItems:"center", gap:22, marginTop:34}}>
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
                <button onClick={onStopTimer} disabled={!timerRunning} style={{width:54, height:54, borderRadius:"50%", border:`1px solid ${cardBorder}`, background:cardBg, display:"flex", alignItems:"center", justifyContent:"center", cursor: timerRunning ? "pointer" : "default", opacity: timerRunning ? 1 : 0.45, color:textMain}}>
                  <Square size={18} fill={textMain}/>
                </button>
                <span style={{fontSize:12, fontWeight:600, color:textMuted2}}>{t.stopBtn}</span>
              </div>
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
                <button onClick={onToggleTimer} style={{width:64, height:64, borderRadius:"50%", border:"none", background:accent, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:`0 8px 20px ${accent}55`}}>
                  {timerRunning ? <Pause size={24} fill="#fff" color="#fff"/> : <Play size={24} fill="#fff" color="#fff" style={{marginLeft:3}}/>}
                </button>
                <span style={{fontSize:12, fontWeight:600, color:textMuted2}}>{timerRunning ? t.pause : t.start}</span>
              </div>
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
                <button onClick={onResetTimer} style={{width:54, height:54, borderRadius:"50%", border:`1px solid ${cardBorder}`, background:cardBg, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:textMain}}>
                  <RotateCcw size={18}/>
                </button>
                <span style={{fontSize:12, fontWeight:600, color:textMuted2}}>{t.reset}</span>
              </div>
            </div>

            {/* Session Goal কার্ড */}
            <div style={{width:"100%", maxWidth:400, marginTop:32, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:"14px 16px", display:"flex", alignItems:"center", gap:12}}>
              <div style={{width:36, height:36, borderRadius:"50%", background: dark ? `${accent}29` : `${accent}1A`, display:"flex", alignItems:"center", justifyContent:"center", color:accent, flexShrink:0}}>
                <Target size={17}/>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:14, fontWeight:700, color:textMain}}>{t.sessionGoalLabel}</div>
                <div style={{fontSize:12, fontWeight:500, color:textMuted2, marginTop:1, marginBottom:6}}>
                  <Num>{nf(pomodoroSession)}</Num>/<Num>{nf(pomodoroTotalSessions)}</Num> {t.sessionsUnit}
                </div>
                <div style={{height:5, borderRadius:3, background: dark ? "#2A2A33" : "#E6E1F5", overflow:"hidden"}}>
                  <div style={{width:`${sessionPct}%`, height:"100%", background:accent, borderRadius:3, transition:"width .3s ease"}}/>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Stopwatch: বড় ডিজিট + Lap লিস্ট */}
            <div style={{fontSize:52, fontWeight:800, letterSpacing:-1, fontVariantNumeric:"tabular-nums", color:textMain, marginTop:20}}>
              <Num>{nf(mm)}</Num>:<Num>{nf(ss)}</Num>
            </div>

            <div style={{width:"100%", maxWidth:400, marginTop:24, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, overflow:"hidden"}}>
              {lapTimes.length === 0 ? (
                <div style={{padding:"18px 16px", textAlign:"center", fontSize:13, color:textMuted2}}>
                  {lang === "bn" ? "এখনো কোনো ল্যাপ নেই" : "No laps yet"}
                </div>
              ) : (
                [...lapTimes].map((sec, idx) => idx).reverse().map((idx) => {
                  const sec = lapTimes[idx];
                  const lm = pad2(Math.floor(sec/60)), ls = pad2(sec%60);
                  const isLatest = idx === lapTimes.length - 1;
                  return (
                    <div key={idx} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderBottom: idx===0 ? "none" : `1px solid ${cardBorder}`}}>
                      <span style={{fontSize:13.5, fontWeight:700, color: isLatest ? accent : textMain}}>{lang === "bn" ? `ল্যাপ ${nf(idx+1)}` : `Lap ${idx+1}`}</span>
                      <span style={{fontSize:13.5, fontWeight:600, fontVariantNumeric:"tabular-nums", color: isLatest ? accent : textMuted2}}><Num>{nf(lm)}</Num>:<Num>{nf(ls)}</Num></span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Reset / Start / Lap */}
            <div style={{display:"flex", alignItems:"center", gap:22, marginTop:32}}>
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
                <button onClick={onResetStopwatch} style={{width:54, height:54, borderRadius:"50%", border:`1px solid ${cardBorder}`, background:cardBg, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:textMain}}>
                  <RotateCcw size={18}/>
                </button>
                <span style={{fontSize:12, fontWeight:600, color:textMuted2}}>{t.reset}</span>
              </div>
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
                <button onClick={onToggleStopwatch} style={{width:64, height:64, borderRadius:"50%", border:"none", background:accent, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:`0 8px 20px ${accent}55`}}>
                  {stopwatchRunning ? <Pause size={24} fill="#fff" color="#fff"/> : <Play size={24} fill="#fff" color="#fff" style={{marginLeft:3}}/>}
                </button>
                <span style={{fontSize:12, fontWeight:600, color:textMuted2}}>{stopwatchRunning ? t.pause : t.start}</span>
              </div>
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
                <button onClick={onAddLap} disabled={!stopwatchRunning} style={{width:54, height:54, borderRadius:"50%", border:`1px solid ${cardBorder}`, background:cardBg, display:"flex", alignItems:"center", justifyContent:"center", cursor: stopwatchRunning ? "pointer" : "default", opacity: stopwatchRunning ? 1 : 0.45, color:textMain}}>
                  <Flag size={18}/>
                </button>
                <span style={{fontSize:12, fontWeight:600, color:textMuted2}}>{t.lapBtn}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FullscreenFocus({ t, nf, mode, seconds, total, running, topicLabel, accent, dark, bg, textMain, textMuted2, onToggleRun, onReset, onClose, now, sessionType, pomodoroSession, pomodoroTotalSessions, timerTargetMinutes, timerElapsedMinutes }) {
  // মাউন্ট হওয়ার সাথে সাথেই (রেন্ডারের আগেই, browser paint হওয়ার আগে) html/body-এর ব্যাকগ্রাউন্ড
  // কালো করে দেওয়া হচ্ছে — যাতে উপরের status bar/notch এরিয়াতে আগের (হালকা রঙের) ব্যাকগ্রাউন্ডের
  // এক ঝলক (flash) দেখা না যায়, যেটা মূল theme-color useEffect (parent-এ) একটু দেরিতে চালু হওয়ায় হতে পারত।
  useLayoutEffect(() => {
    const prevHtmlBg = document.documentElement.style.background;
    const prevBodyBg = document.body.style.background;
    document.documentElement.style.background = "#000000";
    document.body.style.background = "#000000";
    return () => {
      document.documentElement.style.background = prevHtmlBg;
      document.body.style.background = prevBodyBg;
    };
  }, []);
  const orientation = useOrientation();
  const stacked = orientation === "portrait"; // portrait -> mm উপরে/ss নিচে (বড় সংখ্যা), landscape -> পাশাপাশি
  const mm = pad2(Math.floor(Math.max(0,seconds)/60));
  const ss = pad2(Math.max(0,seconds)%60);
  const pct = mode === "timer" && total ? Math.min(100, Math.max(0, Math.round(((total-seconds)/total)*100))) : null;

  // fullscreen-এ সবসময় fixed কালো প্যালেট — app theme (light/dark/system) থেকে independent।
  const screenBg = "#000000";
  const fgMain = "#F5F1E8";
  const fgMuted = "#8A8272";
  const trackColor = "#2A2A2A";
  const trackBorder = "rgba(255,255,255,0.08)";
  const resetBtnBg = "#1E1E1E";
  const blockWidth = stacked ? "clamp(190px, 70vw, 320px)" : "clamp(120px, 28vw, 240px)";
  const blockHeight = stacked ? "clamp(110px, 40vw, 200px)" : "clamp(95px, 24vw, 170px)";

  // stacked (portrait) লেআউটে mm বক্স উপরে, ss বক্স নিচে — তাই এখানে সেপারেটর হিসেবে
  // ভার্টিক্যাল কোলন (দুইটা ডট উপর-নিচ) না দেখিয়ে দুইটা ডট পাশাপাশি (হরাইজন্টাল) দেখানো হচ্ছে,
  // যাতে দুই বক্সের মাঝের গ্যাপে ঠিকভাবে সেন্টার্ড দেখায়।
  const separator = stacked ? (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:"clamp(7px,1.8vw,11px)", margin:"clamp(10px,2.4vw,16px) 0"}}>
      <span style={{width:"clamp(7px,1.8vw,11px)", height:"clamp(7px,1.8vw,11px)", borderRadius:"50%", background:fgMuted}}/>
      <span style={{width:"clamp(7px,1.8vw,11px)", height:"clamp(7px,1.8vw,11px)", borderRadius:"50%", background:fgMuted}}/>
    </div>
  ) : (
    <div style={{fontFamily:"'Bebas Neue','Noto Sans Bengali',sans-serif", fontSize:"clamp(55px,11vw,100px)", fontWeight:400, color:fgMuted, marginBottom:6}}>:</div>
  );

  const clockDigits = (
    <>
      <FlipBlock textMain={fgMain} dark={true} running={true} stacked={stacked} blockWidth={blockWidth} blockHeight={blockHeight}>{nf(mm)}</FlipBlock>
      {separator}
      <FlipBlock textMain={fgMain} dark={true} running={true} stacked={stacked} blockWidth={blockWidth} blockHeight={blockHeight}>{nf(ss)}</FlipBlock>
    </>
  );

  // ছোট আইকন বাটন — reset উপরে, start/pause নিচে (landscape-এ seconds বক্সের ডান পাশে বসবে)
  const sideButtons = (
    <div style={{display:"flex", flexDirection:"column", gap:10, marginLeft:"clamp(8px,1.6vw,16px)"}}>
      <button onClick={onReset} title={t.reset} style={{background:resetBtnBg, border:"none", borderRadius:14, width:48, height:48, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer"}}>
        <RotateCcw size={18} color={fgMain}/>
      </button>
      <button onClick={onToggleRun} title={running ? t.pause : t.start} style={{background:accent, border:"none", borderRadius:14, width:48, height:48, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer"}}>
        {running ? <Pause size={18} fill="#fff" color="#fff"/> : <Play size={18} fill="#fff" color="#fff"/>}
      </button>
    </div>
  );

  const liveClock = now && (
    <div style={{textAlign:"center", fontSize:12.5, fontWeight:700, color:fgMuted, fontVariantNumeric:"tabular-nums", letterSpacing:0.8, opacity:0.75, marginBottom: stacked ? 14 : 12}}>
      <Num>{nf(pad2(((now.getHours()%12)||12)))}</Num>:<Num>{nf(pad2(now.getMinutes()))}</Num> <span style={{fontSize:10.5}}>{now.getHours()>=12 ? t.pmLabel : t.amLabel}</span>
    </div>
  );

  // Pomodoro cycle progress — Timer mode-এই শুধু দেখা যাবে (Stopwatch-এ প্রযোজ্য না)
  const pomodoroIndicator = mode === "timer" && pomodoroSession ? (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:4, marginTop:16}}>
      <div style={{fontSize:11.5, fontWeight:700, color:fgMuted, letterSpacing:0.6}}>
        {t.sessionLabel} <Num>{nf(pomodoroSession)}</Num>/<Num>{nf(pomodoroTotalSessions || 4)}</Num>
      </div>
      <div style={{display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center", maxWidth:220}}>
        {Array.from({length:pomodoroTotalSessions || 4}, (_,i)=>i+1).map(i => (
          <span key={i} style={{fontSize:13.5, lineHeight:1, color: i===pomodoroSession ? accent : fgMuted, opacity: i===pomodoroSession ? 1 : 0.5}}>
            {i===pomodoroSession ? "●" : "○"}
          </span>
        ))}
      </div>
      {timerTargetMinutes && (
        <div style={{fontSize:11.5, color:fgMuted, fontWeight:600, opacity:0.8}}>
          <Num>{nf(timerElapsedMinutes || 0)}</Num>/<Num>{nf(timerTargetMinutes)}</Num> {t.minutes}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div style={{position:"fixed", inset:0, zIndex:100, background:screenBg, color:fgMain, display:"flex", flexDirection:"column", isolation:"isolate", overflow:"hidden", WebkitBackfaceVisibility:"hidden"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"calc(14px + var(--fg-safe-top, env(safe-area-inset-top, 0px))) 20px 0", flexShrink:0}}>
        <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:fgMuted, display:"flex", alignItems:"center", padding:6}}>
          <ChevronDown size={22}/>
        </button>
        <div/>
        <div style={{width:34}}/>
      </div>

      {/* মূল কনটেন্ট এরিয়া উলম্বভাবে center করা — real-time ঘড়ি এখন এই ব্লকের অংশ, তাই স্ক্রিনের মাঝামাঝি বসে */}
      <div style={{flex:1, minHeight:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:"0 24px", overflow:"hidden"}}>
        {stacked ? (
          // ---- vertical/stacked layout: আগের মতোই — mm উপরে, ss নিচে, bar নিচে; শুধু real-time একটু নিচে নেমে এসেছে ----
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:0}}>
            {liveClock}
            {clockDigits}
            {pct !== null && (
              <div style={{marginTop:16, height:6, width:blockWidth, borderRadius:4, background:trackColor, border:`1px solid ${trackBorder}`, overflow:"hidden"}}>
                <div style={{height:"100%", width:`${pct}%`, background:accent, borderRadius:4, transition:"width .3s"}}/>
              </div>
            )}
            {pomodoroIndicator}
          </div>
        ) : (
          // ---- horizontal layout: real-time উপরে center-এ, নিচে bar + mm : ss + (reset উপরে/play-pause নিচে) seconds-এর ডান পাশে ----
          // পুরো গ্রুপটা সামান্য উপরে সরানো হয়েছে, যাতে real-time + digits একসাথে দেখতে সেন্টার্ড লাগে
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", transform:"translateY(-6vh)"}}>
            {liveClock}
            <div style={{display:"flex", alignItems:"stretch", gap:"clamp(10px,2vw,16px)"}}>
              <div style={{width:48, flexShrink:0, display:"flex", justifyContent:"center", alignItems:"flex-end"}}>
                {pct !== null && (
                  <div style={{width:8, borderRadius:4, background:trackColor, border:`1px solid ${trackBorder}`, overflow:"hidden", display:"flex", alignItems:"flex-end", alignSelf:"stretch"}}>
                    <div style={{width:"100%", height:`${pct}%`, background:accent, borderRadius:4, transition:"height .3s"}}/>
                  </div>
                )}
              </div>
              <div style={{display:"flex", alignItems:"center", gap:"clamp(4px,1vw,10px)"}}>
                {clockDigits}
              </div>
              <div style={{width:48, flexShrink:0, display:"flex", justifyContent:"center", alignItems:"center"}}>
                {sideButtons}
              </div>
            </div>
            {pomodoroIndicator}
          </div>
        )}
      </div>

      {/* portrait/vertical মোডে বাটন আগের মতোই নিচে থাকবে */}
      {stacked && (
        <div style={{display:"flex", gap:16, padding:"0 30px 64px", justifyContent:"center", alignItems:"center", flexShrink:0}}>
          <button onClick={onToggleRun} title={running ? t.pause : t.start} style={{background:accent, border:"none", borderRadius:14, width:56, height:56, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer"}}>
            {running ? <Pause size={20} fill="#fff" color="#fff"/> : <Play size={20} fill="#fff" color="#fff"/>}
          </button>
          <button onClick={onReset} title={t.reset} style={{background:resetBtnBg, border:"none", borderRadius:14, width:56, height:56, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer"}}>
            <RotateCcw size={20} color={fgMain}/>
          </button>
        </div>
      )}
    </div>
  );
}
function PercentRing({ pct, size = 56, stroke = 5, accent, trackColor, textMain, nf, caption, captionColor }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clampedPct = Math.min(100, Math.max(0, pct));
  const offset = c - (clampedPct / 100) * c;
  const roundedPct = Math.round(clampedPct);
  const [pop, setPop] = useState(false);
  const prevPctRef = useRef(roundedPct);
  useEffect(() => {
    if (prevPctRef.current === roundedPct) return;
    prevPctRef.current = roundedPct;
    setPop(true);
    const timeout = setTimeout(() => setPop(false), 350);
    return () => clearTimeout(timeout);
  }, [roundedPct]);
  return (
    <div className={pop ? "fg-ring-pop" : undefined} style={{display:"inline-flex", flexShrink:0}}>
    <svg width={size} height={size} style={{transform:"rotate(-90deg)", flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={accent} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{transition:"stroke-dashoffset .5s cubic-bezier(0.34,1.2,0.64,1)"}}/>
      <text x="50%" y="50%" fill={accent} fontSize={size*(caption?0.24:0.24)} fontWeight={800}
        textAnchor="middle" dominantBaseline="central" style={{transform:`rotate(90deg)`, transformOrigin:"center"}}>
        <tspan x="50%" dy={caption ? -size*0.07 : 0}>{nf(pct)}%</tspan>
        {caption && <tspan x="50%" dy={size*0.19} fontSize={size*0.13} fontWeight={600} fill={captionColor || textMain}>{caption}</tspan>}
      </text>
    </svg>
    </div>
  );
}

// "..." মেনু + এডিট/ডিলিট, ডিলিটে চাপলে মেনুর ভেতরেই ইনলাইন কনফার্ম দেখায় (Tasks ও TopicsList-এ যে প্যাটার্ন আগে থেকে ছিল, সেটাই এখানে reusable করা হলো)
// নিচে যথেষ্ট জায়গা না থাকলে (viewport-এর শেষ প্রান্তের কাছে) মেনুটা স্বয়ংক্রিয়ভাবে উপরের দিকে (flip-up) খোলে
function DeleteMenuButton({ onEdit, onDelete, editLabel, deleteLabel, confirmText, confirmLabel, cancelLabel, cardBg, cardBorder, textMuted2, iconSize = 16 }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const btnRef = useRef(null);
  const close = () => { setOpen(false); setConfirming(false); };
  const toggleOpen = (e) => {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      // মেনুর আনুমানিক সর্বোচ্চ উচ্চতা ~130px (confirm state-এ সবচেয়ে লম্বা) — নিচে এর চেয়ে কম জায়গা থাকলে উপরে খুলবে
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUp(spaceBelow < 140);
    }
    setOpen(o => !o);
    setConfirming(false);
  };
  return (
    <div ref={btnRef} style={{position:"relative", flexShrink:0}}>
      <button onClick={toggleOpen} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, padding:4, display:"flex"}}>
        <MoreVertical size={iconSize}/>
      </button>
      {open && (
        <>
          <div onClick={close} style={{position:"fixed", inset:0, zIndex:59}}/>
          <div style={{
            position:"absolute", right:0, zIndex:60, minWidth:180, overflow:"hidden",
            background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:10,
            boxShadow:"0 4px 12px rgba(0,0,0,0.08)",
            ...(openUp ? { bottom:"100%", marginBottom:4 } : { top:"100%", marginTop:4 }),
          }}>
            {confirming ? (
              <>
                <div style={{padding:"9px 12px", fontSize:12.5, color:textMuted2, fontWeight:600}}>{confirmText}</div>
                <button onClick={()=>{ close(); onDelete(); }} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:13.5, fontWeight:700, cursor:"pointer", textAlign:"left"}}>
                  <Trash2 size={13}/> {confirmLabel}
                </button>
                <button onClick={()=>setConfirming(false)} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:13.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                  {cancelLabel}
                </button>
              </>
            ) : (
              <>
                {onEdit && (
                  <button onClick={()=>{close(); onEdit();}} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:13.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                    <Pencil size={13}/> {editLabel}
                  </button>
                )}
                <button onClick={()=>setConfirming(true)} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:13.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                  <Trash2 size={13}/> {deleteLabel}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function TopicFolderCard({ subj, topicName, attempts, t, nf, lang, cardBg, cardBorder, textMuted2, accent, dark, onAddAttempt, onEditAttempt, onRemoveAttempt, onRenameTopic, onRemoveTopic }) {
  const ls = (px) => (lang === "bn" ? 0 : px);
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState(() => { const d = new Date(); return dateKey(d); });
  const [obtained, setObtained] = useState("");
  const [total, setTotal] = useState("");
  const green = "#6E8B5E";

  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(topicName);
  const [renameError, setRenameError] = useState("");

  const [editingAttemptId, setEditingAttemptId] = useState(null);
  const [editObtained, setEditObtained] = useState("");
  const [editTotal, setEditTotal] = useState("");
  const [editDate, setEditDate] = useState("");
  const [confirmingDeleteTopic, setConfirmingDeleteTopic] = useState(false);

  const avgPct = attempts.length
    ? Math.round(attempts.reduce((sum, s) => sum + (s.total ? (s.obtained / s.total) * 100 : 0), 0) / attempts.length)
    : null;
  const completed = attempts.length > 0;

  const submitAttempt = () => {
    const o = parseFloat(obtained), tt = parseFloat(total);
    if (!isFinite(o) || !isFinite(tt) || tt <= 0) return;
    onAddAttempt(date, o, tt);
    setObtained(""); setTotal("");
  };

  const startRename = () => { setRenaming(true); setRenameValue(topicName); setRenameError(""); };
  const cancelRename = () => { setRenaming(false); setRenameError(""); };
  const submitRename = () => {
    const v = renameValue.trim();
    if (!v || v === topicName) { setRenaming(false); setRenameError(""); return; }
    const ok = onRenameTopic(v);
    if (ok === false) { setRenameError(t.nameExists); return; }
    setRenaming(false); setRenameError("");
  };

  const startEditAttempt = (a) => {
    setEditingAttemptId(a.id); setEditObtained(String(a.obtained)); setEditTotal(String(a.total)); setEditDate(a.date || "");
  };
  const cancelEditAttempt = () => setEditingAttemptId(null);
  const saveEditAttempt = () => {
    const o = parseFloat(editObtained), tt = parseFloat(editTotal);
    if (!isFinite(o) || !isFinite(tt) || tt <= 0) return;
    onEditAttempt(editingAttemptId, o, tt, editDate || null);
    setEditingAttemptId(null);
  };

  const smallInput = { width:56, border:`1px solid ${cardBorder}`, borderRadius:8, padding:"6px 8px", fontSize:12.5, background: dark?"#0A0A0A":"#F8F5EE", color: dark?"#F3F1F8":"#262433", outline:"none" };
  const dateInput = { border:`1px solid ${cardBorder}`, borderRadius:8, padding:"6px 8px", fontSize:12.5, background: dark?"#0A0A0A":"#F8F5EE", color: dark?"#F3F1F8":"#262433", outline:"none", flex:1 };

  return (
    <div className="fg-card" style={{background: completed ? (dark?"rgba(110,139,94,0.10)":"rgba(110,139,94,0.07)") : cardBg, border: completed ? `1px solid rgba(110,139,94,0.4)` : `1px solid ${cardBorder}`, borderRadius:14, padding:"12px 14px", transition:"background .2s ease, border-color .2s ease, transform .16s cubic-bezier(0.16,1,0.3,1), box-shadow .2s ease"}}>
      {renaming ? (
        <div style={{display:"flex", flexDirection:"column", gap:6}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex", gap:6, alignItems:"center"}}>
            <Folder size={14} style={{color:textMuted2, flexShrink:0}}/>
            <input autoFocus value={renameValue} onChange={e=>setRenameValue(e.target.value)}
              onKeyDown={e=>{ if (e.key==="Enter") submitRename(); if (e.key==="Escape") cancelRename(); }}
              style={{flex:1, border:`1px solid ${cardBorder}`, borderRadius:8, padding:"6px 8px", fontSize:13.5, background: dark?"#0A0A0A":"#F8F5EE", color: dark?"#F3F1F8":"#262433", outline:"none"}}/>
            <button onClick={submitRename} style={{border:"none", background:"transparent", cursor:"pointer", color:accent, flexShrink:0}}><Check size={16}/></button>
            <button onClick={cancelRename} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, flexShrink:0}}><X size={16}/></button>
          </div>
          {renameError && <div style={{fontSize:11.5, color:"#C0553F", fontWeight:600, paddingLeft:22}}>{renameError}</div>}
        </div>
      ) : (
        <button onClick={()=>setExpanded(x=>!x)} style={{width:"100%", border:"none", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", padding:0, color:"inherit", textAlign:"left"}}>
          <div style={{display:"flex", alignItems:"center", gap:8, minWidth:0}}>
            <Folder size={14} style={{color:textMuted2, flexShrink:0}}/>
            <span style={{fontWeight:700, fontSize:14.5, wordBreak:"break-word"}}>{topicName}</span>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:6, flexShrink:0}}>
            {completed ? (
              <span style={{fontSize:11.5, fontWeight:700, color:green, background: dark?"rgba(110,139,94,0.18)":"rgba(110,139,94,0.15)", padding:"3px 8px", borderRadius:14, display:"flex", alignItems:"center", gap:4}}>
                <Check size={10}/> {t.completedBadge}
              </span>
            ) : (
              <span style={{fontSize:11.5, color:textMuted2, fontWeight:600}}>{t.noAttemptsYet}</span>
            )}
            <ChevronDown size={15} style={{color:textMuted2, transform: expanded ? "rotate(180deg)" : "none", transition:"transform .15s"}}/>
          </div>
        </button>
      )}

      {attempts.length > 0 && (
        <div style={{display:"flex", gap:10, marginTop:8, paddingLeft:22, fontSize:12.5, color:textMuted2, fontWeight:600, flexWrap:"wrap"}}>
          <span><Num>{nf(attempts.length)}</Num> {t.attemptsLabel}</span>
          {avgPct !== null && <span style={{color:(dark ? "#F3F1F8" : "#1A1814"), fontWeight:700}}>{t.average} <Num>{nf(avgPct)}</Num>%</span>}
        </div>
      )}

      {expanded && (
        <div style={{marginTop:12, paddingTop:12, borderTop:`1px dashed ${cardBorder}`, animation:"fg-fade-up .22s cubic-bezier(0.16,1,0.3,1)"}}>
          {attempts.length === 0 ? (
            <div style={{fontSize:12.5, color:textMuted2, marginBottom:10, textAlign:"center", padding:"10px 0"}}>{t.noAttemptsYet}</div>
          ) : (
            <div style={{display:"flex", flexDirection:"column", gap:6, marginBottom:12, background: dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"9px 10px"}}>
              {[...attempts].sort((a,b)=>(a.date||"").localeCompare(b.date||"")).map(a => (
                editingAttemptId === a.id ? (
                  <div key={a.id} style={{display:"flex", alignItems:"center", gap:6}}>
                    <input type="date" value={editDate} onChange={e=>setEditDate(e.target.value)} style={dateInput}/>
                    <input type="number" inputMode="decimal" value={editObtained} onChange={e=>setEditObtained(e.target.value)} style={smallInput}/>
                    <span style={{color:textMuted2, fontSize:12.5, fontWeight:700}}>/</span>
                    <input type="number" inputMode="decimal" value={editTotal} onChange={e=>setEditTotal(e.target.value)} style={smallInput}/>
                    <button onClick={saveEditAttempt} style={{border:"none", borderRadius:8, width:26, height:26, background:accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0}}><Check size={13}/></button>
                    <button onClick={cancelEditAttempt} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, flexShrink:0}}><X size={16}/></button>
                  </div>
                ) : (
                  <div key={a.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"3px 0"}}>
                    <span style={{fontSize:13.5, fontWeight:600}}>
                      {a.date && <span style={{color:textMuted2, fontWeight:500, marginRight:6}}>{a.date}</span>}
                      <Num>{nf(a.obtained)}</Num> / <Num>{nf(a.total)}</Num>
                      <span style={{color:textMuted2, fontWeight:500}}> (<Num>{nf(a.total ? Math.round((a.obtained/a.total)*100) : 0)}</Num>%)</span>
                    </span>
                    <DeleteMenuButton
                      onEdit={()=>startEditAttempt(a)}
                      onDelete={()=>onRemoveAttempt(a.id)}
                      editLabel={t.edit} deleteLabel={t.deleteTopic}
                      confirmText={t.confirmDeleteAttempt} confirmLabel={t.confirmDelete} cancelLabel={t.cancel}
                      cardBg={cardBg} cardBorder={cardBorder} textMuted2={textMuted2} iconSize={14}
                    />
                  </div>
                )
              ))}
            </div>
          )}

          <div style={{background: dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"10px", marginBottom:10}}>
            <div style={{fontSize:10.5, fontWeight:700, letterSpacing:ls(0.8), color:textMuted2, opacity:0.85, marginBottom:8, textTransform:"uppercase"}}>{t.addAttempt}</div>
            <div style={{display:"flex", alignItems:"center", gap:6}}>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={dateInput}/>
              <input type="number" inputMode="decimal" placeholder={t.obtainedPlaceholder} value={obtained} onChange={e=>setObtained(e.target.value)} style={smallInput}/>
              <span style={{color:textMuted2, fontSize:12.5, fontWeight:700}}>/</span>
              <input type="number" inputMode="decimal" placeholder={t.outOfPlaceholder} value={total} onChange={e=>setTotal(e.target.value)} style={smallInput}/>
              <button onClick={submitAttempt} style={{border:"none", borderRadius:8, width:30, height:30, background:accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, boxShadow:`0 3px 8px ${accent}40`}}>
                <Plus size={15}/>
              </button>
            </div>
          </div>

          {confirmingDeleteTopic ? (
            <div style={{display:"flex", alignItems:"center", gap:10, flexWrap:"wrap"}}>
              <span style={{fontSize:11.5, fontWeight:600, color:textMuted2}}>{t.confirmDeleteTopic}</span>
              <button onClick={onRemoveTopic} style={{border:"none", background:"transparent", cursor:"pointer", color:"#C0392B", fontSize:11.5, fontWeight:700, padding:0}}>{t.confirmDelete}</button>
              <button onClick={()=>setConfirmingDeleteTopic(false)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, fontSize:11.5, fontWeight:700, padding:0}}>{t.cancel}</button>
            </div>
          ) : (
            <div style={{display:"flex", gap:16}}>
              <button onClick={startRename} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, fontSize:11.5, fontWeight:700, display:"flex", alignItems:"center", gap:4, padding:0}}>
                <Pencil size={12}/> {t.edit}
              </button>
              <button onClick={()=>setConfirmingDeleteTopic(true)} style={{border:"none", background:"transparent", cursor:"pointer", color:"#C0553F", fontSize:11.5, fontWeight:700, display:"flex", alignItems:"center", gap:4, padding:0}}>
                <Trash2 size={12}/> {t.deleteTopic}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddTopicInline({ t, accent, cardBorder, textMuted2, dark, onAdd }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const submit = () => {
    const v = name.trim();
    if (!v) { setAdding(false); return; }
    onAdd(v);
    setName(""); setAdding(false);
  };
  if (!adding) {
    return (
      <button onClick={()=>setAdding(true)} style={{display:"flex", alignItems:"center", gap:4, border:`1px dashed ${cardBorder}`, background:"transparent", color:textMuted2, borderRadius:12, padding:"9px 12px", fontSize:12.5, fontWeight:700, cursor:"pointer", alignSelf:"flex-start", transition:"border-color .2s ease, color .2s ease"}}>
        <Plus size={12}/> {t.addTopicBtn}
      </button>
    );
  }
  return (
    <div style={{display:"flex", alignItems:"center", gap:6, background: dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)", border:`1px solid ${cardBorder}`, borderRadius:12, padding:8, animation:"fg-fade-up .18s cubic-bezier(0.16,1,0.3,1)"}}>
      <input autoFocus value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") submit(); if(e.key==="Escape"){setAdding(false); setName("");}}}
        placeholder={t.topicNamePlaceholder}
        style={{flex:1, border:`1px solid ${cardBorder}`, borderRadius:8, padding:"7px 10px", fontSize:13.5, background: dark?"#0A0A0A":"#F8F5EE", color: dark?"#F3F1F8":"#262433", outline:"none"}}/>
      <button onClick={submit} style={{border:"none", borderRadius:8, width:30, height:30, background:accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, boxShadow:`0 3px 8px ${accent}40`}}>
        <Check size={15}/>
      </button>
    </div>
  );
}

function CombinedExamCard({ id, combinedExam, t, nf, lang, allSubjects, cardBg, cardBorder, textMuted2, accent, dark, onAddAttempt, onEditAttempt, onRemoveAttempt, onEdit, onRemove }) {
  const ls = (px) => (lang === "bn" ? 0 : px);
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState(() => dateKey(new Date()));
  const [obtained, setObtained] = useState("");
  const [total, setTotal] = useState("");
  const green = "#6E8B5E";

  const [editingAttemptId, setEditingAttemptId] = useState(null);
  const [editObtained, setEditObtained] = useState("");
  const [editTotal, setEditTotal] = useState("");
  const [editDate, setEditDate] = useState("");
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const { name, type, subjects, attempts = [] } = combinedExam;
  const typeLabel = type === "daily" ? t.typeDaily : type === "monthly" ? t.typeMonthly : t.typeWeekly;

  const avgPct = attempts.length
    ? Math.round(attempts.reduce((sum, s) => sum + (s.total ? (s.obtained / s.total) * 100 : 0), 0) / attempts.length)
    : null;
  const hasAttempts = attempts.length > 0;

  const submitAttempt = () => {
    const o = parseFloat(obtained), tt = parseFloat(total);
    if (!isFinite(o) || !isFinite(tt) || tt <= 0) return;
    onAddAttempt(date, o, tt);
    setObtained(""); setTotal("");
  };

  const startEditAttempt = (a) => {
    setEditingAttemptId(a.id); setEditObtained(String(a.obtained)); setEditTotal(String(a.total)); setEditDate(a.date || "");
  };
  const cancelEditAttempt = () => setEditingAttemptId(null);
  const saveEditAttempt = () => {
    const o = parseFloat(editObtained), tt = parseFloat(editTotal);
    if (!isFinite(o) || !isFinite(tt) || tt <= 0) return;
    onEditAttempt(editingAttemptId, o, tt, editDate || null);
    setEditingAttemptId(null);
  };

  const smallInput = { width:56, border:`1px solid ${cardBorder}`, borderRadius:8, padding:"6px 8px", fontSize:12.5, background: dark?"#0A0A0A":"#F8F5EE", color: dark?"#F3F1F8":"#262433", outline:"none" };
  const dateInput = { border:`1px solid ${cardBorder}`, borderRadius:8, padding:"6px 8px", fontSize:12.5, background: dark?"#0A0A0A":"#F8F5EE", color: dark?"#F3F1F8":"#262433", outline:"none", flex:1 };

  return (
    <div className="fg-card" style={{background: hasAttempts ? (dark?"rgba(110,139,94,0.10)":"rgba(110,139,94,0.07)") : cardBg, border: hasAttempts ? `1px solid rgba(110,139,94,0.4)` : `1px solid ${cardBorder}`, borderRadius:14, padding:"12px 14px", transition:"background .2s ease, border-color .2s ease"}}>
      <button onClick={()=>setExpanded(x=>!x)} style={{width:"100%", border:"none", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", padding:0, color:"inherit", textAlign:"left"}}>
        <div style={{display:"flex", alignItems:"center", gap:8, minWidth:0}}>
          <GraduationCap size={14} style={{color:textMuted2, flexShrink:0}}/>
          <span style={{fontWeight:700, fontSize:14.5, wordBreak:"break-word"}}>{name}</span>
          <span style={{fontSize:10.5, fontWeight:700, letterSpacing:ls(0.5), color:textMuted2, background: dark?"#242229":"#F0EEF5", padding:"2px 7px", borderRadius:14, flexShrink:0, textTransform:"uppercase"}}>{typeLabel}</span>
        </div>
        <ChevronDown size={15} style={{color:textMuted2, transform: expanded ? "rotate(180deg)" : "none", transition:"transform .15s", flexShrink:0}}/>
      </button>

      <div style={{display:"flex", flexWrap:"wrap", gap:4, marginTop:8, paddingLeft:22}}>
        {(subjects || []).map(s => {
          const c = colorForSubject(s, allSubjects);
          return <span key={s} style={{fontSize:11.5, fontWeight:700, color:c.bg, background:c.bgSoft, padding:"2px 8px", borderRadius:14}}>{s}</span>;
        })}
      </div>

      {hasAttempts && (
        <div style={{display:"flex", gap:10, marginTop:8, paddingLeft:22, fontSize:12.5, color:textMuted2, fontWeight:600}}>
          <span><Num>{nf(attempts.length)}</Num> {t.attemptsLabel}</span>
          {avgPct !== null && <span style={{color:(dark ? "#F3F1F8" : "#1A1814"), fontWeight:700}}>{t.average} <Num>{nf(avgPct)}</Num>%</span>}
        </div>
      )}

      {expanded && (
        <div style={{marginTop:12, paddingTop:12, borderTop:`1px dashed ${cardBorder}`, animation:"fg-fade-up .22s cubic-bezier(0.16,1,0.3,1)"}}>
          {attempts.length === 0 ? (
            <div style={{fontSize:12.5, color:textMuted2, marginBottom:10, textAlign:"center", padding:"10px 0"}}>{t.noAttemptsYet}</div>
          ) : (
            <div style={{display:"flex", flexDirection:"column", gap:6, marginBottom:12, background: dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"9px 10px"}}>
              {[...attempts].sort((a,b)=>(a.date||"").localeCompare(b.date||"")).map(a => (
                editingAttemptId === a.id ? (
                  <div key={a.id} style={{display:"flex", alignItems:"center", gap:6}}>
                    <input type="date" value={editDate} onChange={e=>setEditDate(e.target.value)} style={dateInput}/>
                    <input type="number" inputMode="decimal" value={editObtained} onChange={e=>setEditObtained(e.target.value)} style={smallInput}/>
                    <span style={{color:textMuted2, fontSize:12.5, fontWeight:700}}>/</span>
                    <input type="number" inputMode="decimal" value={editTotal} onChange={e=>setEditTotal(e.target.value)} style={smallInput}/>
                    <button onClick={saveEditAttempt} style={{border:"none", borderRadius:8, width:26, height:26, background:accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0}}><Check size={13}/></button>
                    <button onClick={cancelEditAttempt} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, flexShrink:0}}><X size={16}/></button>
                  </div>
                ) : (
                  <div key={a.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"3px 0"}}>
                    <span style={{fontSize:13.5, fontWeight:600}}>
                      {a.date && <span style={{color:textMuted2, fontWeight:500, marginRight:6}}>{a.date}</span>}
                      <Num>{nf(a.obtained)}</Num> / <Num>{nf(a.total)}</Num>
                      <span style={{color:textMuted2, fontWeight:500}}> (<Num>{nf(a.total ? Math.round((a.obtained/a.total)*100) : 0)}</Num>%)</span>
                    </span>
                    <DeleteMenuButton
                      onEdit={()=>startEditAttempt(a)}
                      onDelete={()=>onRemoveAttempt(a.id)}
                      editLabel={t.edit} deleteLabel={t.deleteTopic}
                      confirmText={t.confirmDeleteAttempt} confirmLabel={t.confirmDelete} cancelLabel={t.cancel}
                      cardBg={cardBg} cardBorder={cardBorder} textMuted2={textMuted2} iconSize={14}
                    />
                  </div>
                )
              ))}
            </div>
          )}

          <div style={{background: dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"10px", marginBottom:10}}>
            <div style={{fontSize:10.5, fontWeight:700, letterSpacing:ls(0.8), color:textMuted2, opacity:0.85, marginBottom:8, textTransform:"uppercase"}}>{t.addAttempt}</div>
            <div style={{display:"flex", alignItems:"center", gap:6}}>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={dateInput}/>
              <input type="number" inputMode="decimal" placeholder={t.obtainedPlaceholder} value={obtained} onChange={e=>setObtained(e.target.value)} style={smallInput}/>
              <span style={{color:textMuted2, fontSize:12.5, fontWeight:700}}>/</span>
              <input type="number" inputMode="decimal" placeholder={t.outOfPlaceholder} value={total} onChange={e=>setTotal(e.target.value)} style={smallInput}/>
              <button onClick={submitAttempt} style={{border:"none", borderRadius:8, width:30, height:30, background:accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, boxShadow:`0 3px 8px ${accent}40`}}>
                <Plus size={15}/>
              </button>
            </div>
          </div>

          {confirmingRemove ? (
            <div style={{display:"flex", alignItems:"center", gap:10, flexWrap:"wrap"}}>
              <span style={{fontSize:11.5, fontWeight:600, color:textMuted2}}>{t.confirmDeleteCombinedExam}</span>
              <button onClick={onRemove} style={{border:"none", background:"transparent", cursor:"pointer", color:"#C0392B", fontSize:11.5, fontWeight:700, padding:0}}>{t.confirmDelete}</button>
              <button onClick={()=>setConfirmingRemove(false)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, fontSize:11.5, fontWeight:700, padding:0}}>{t.cancel}</button>
            </div>
          ) : (
            <div style={{display:"flex", gap:16}}>
              <button onClick={onEdit} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, fontSize:11.5, fontWeight:700, display:"flex", alignItems:"center", gap:4, padding:0}}>
                <Pencil size={12}/> {t.edit}
              </button>
              <button onClick={()=>setConfirmingRemove(true)} style={{border:"none", background:"transparent", cursor:"pointer", color:"#C0553F", fontSize:11.5, fontWeight:700, display:"flex", alignItems:"center", gap:4, padding:0}}>
                <Trash2 size={12}/> {t.deleteCombinedExam}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// একাধিক তারিখ-সহ পরীক্ষার সম্পূর্ণ রুটিন ম্যানেজার — সাবজেক্ট + তারিখ + সময় দিয়ে একের পর এক এন্ট্রি যোগ করা যায়,
// তারিখ অনুযায়ী সাজানো থাকে, আসন্নগুলো উপরে হাইলাইট, চলে যাওয়া তারিখগুলো নিচে আলাদা "সম্পন্ন" সেকশনে ধূসর হয়ে থাকে
const EXAM_TYPE_OPTIONS = [
  { key: "quiz", en: "Quiz", bn: "কুইজ" },
  { key: "mid", en: "Mid", bn: "মিড" },
  { key: "final", en: "Final", bn: "ফাইনাল" },
  { key: "assignment", en: "Assignment", bn: "অ্যাসাইনমেন্ট" },
  { key: "presentation", en: "Presentation", bn: "প্রেজেন্টেশন" },
  { key: "classtest", en: "Class Test", bn: "ক্লাস টেস্ট" },
  { key: "viva", en: "Viva", bn: "ভাইভা" },
];
const MONTHS_ABBR_EN = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function ExamScheduleModal({ t, lang, nf, allSubjects, examSchedule, onAdd, onUpdate, onRemove, onClose, cardBg, cardBorder, textMain, textMuted2, accent, dark, bg }) {
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [statusTab, setStatusTab] = useState("upcoming");
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [showAllMissed, setShowAllMissed] = useState(false);
  const nowParts = dhakaNowParts();
  const monthName = (i) => lang === "bn" ? MONTHS_BN[i] : MONTHS_EN[i];
  const weekdayName = (d) => lang === "bn" ? WEEKDAYS_BN[d.getDay()] : WEEKDAYS_EN[d.getDay()];
  const typeLabel = (key) => { const o = EXAM_TYPE_OPTIONS.find(x => x.key === key); return o ? (lang === "bn" ? o.bn : o.en) : ""; };

  const inputStyle = { border:`1px solid ${cardBorder}`, borderRadius:10, padding:"10px 12px", fontSize:14.5, background: dark?"#0A0A0A":"#F8F5EE", color: dark?"#F3F1F8":"#262433", outline:"none", width:"100%", boxSizing:"border-box" };

  const resetForm = () => { setSubject(""); setExamType(""); setDate(""); setStartTime(""); setEndTime(""); setEditingId(null); };

  const submit = () => {
    if (!subject.trim() || !date) return;
    if (editingId) {
      onUpdate(editingId, { subject: subject.trim(), examType, date, startTime, endTime });
    } else {
      onAdd({ subject: subject.trim(), examType, date, startTime, endTime });
    }
    resetForm();
  };

  const startEdit = (ex) => {
    setEditingId(ex.id);
    setSubject(ex.subject);
    setExamType(ex.examType || "");
    setDate(ex.date);
    setStartTime(ex.startTime || "");
    setEndTime(ex.endTime || "");
    setFormOpen(true);
  };

  // exam.status ম্যানুয়ালি সেট করার জন্য — এখন থেকে তারিখ না পেরুলেও "Given" বা "Missed" হিসেবে চিহ্নিত করা যাবে
  const setExamStatus = (ex, status) => {
    if (status === "completed") onUpdate(ex.id, { given: true, missed: false });
    else if (status === "missed") onUpdate(ex.id, { missed: true, given: false });
    else onUpdate(ex.id, { given: false, missed: false });
  };
  const examStatus = (ex) => {
    if (ex.missed) return "missed";
    if (ex.given || isExamPast(ex, nowParts)) return "completed";
    return "upcoming";
  };

  const sorted = [...examSchedule].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const upcoming = sorted.filter(ex => examStatus(ex) === "upcoming");
  const pastAll = [...sorted].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const completed = pastAll.filter(ex => examStatus(ex) === "completed");
  const missed = pastAll.filter(ex => examStatus(ex) === "missed");
  const total = examSchedule.length;

  const dateLabel = (dk) => {
    const d = new Date(dk + "T00:00:00");
    return `${weekdayName(d)}, ${nf(d.getDate())} ${monthName(d.getMonth())}`;
  };

  const ExamRow = ({ ex, kind }) => {
    const d = new Date(ex.date + "T00:00:00");
    const badgeColor = kind === "missed" ? "#C0392B" : kind === "completed" ? "#6E8B5E" : accent;
    return (
      <div style={{display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background: dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)", border:`1px solid ${cardBorder}`, borderRadius:12, opacity: kind === "missed" ? 0.75 : 1}}>
        <div style={{flexShrink:0, width:42, height:42, borderRadius:10, background: dark ? `${badgeColor}22` : `${badgeColor}14`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", lineHeight:1}}>
          <div style={{fontSize:14.5, fontWeight:800, color:badgeColor}}><Num>{nf(d.getDate())}</Num></div>
          <div style={{fontSize:8.5, fontWeight:700, color:badgeColor, letterSpacing:0.3}}>{MONTHS_ABBR_EN[d.getMonth()]}</div>
        </div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:13.5, fontWeight:800, color:textMain, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
            {ex.examType ? `(${typeLabel(ex.examType)}) ` : ""}{ex.subject}
          </div>
          <div style={{fontSize:11.5, color:textMuted2, marginTop:2}}>
            {dateLabel(ex.date)}{ex.startTime ? ` · ${ex.startTime}${ex.endTime ? "–"+ex.endTime : ""}` : ""}
          </div>
        </div>
        {kind === "upcoming" && ex.date === nowParts.dateKey && (
          <div style={{flexShrink:0, fontSize:11.5, fontWeight:800, color:accent, background: dark?"rgba(217,119,87,0.16)":"#EFEBF7", padding:"4px 9px", borderRadius:999}}>
            {lang==="bn"?"আজ":"Today"}
          </div>
        )}
        {kind === "upcoming" && (
          <div style={{display:"flex", alignItems:"center", gap:2, flexShrink:0}}>
            <button onClick={()=>setExamStatus(ex, "completed")} title={lang==="bn"?"দেওয়া হয়েছে হিসেবে চিহ্নিত করুন":"Mark as given"}
              style={{border:"none", background:"transparent", cursor:"pointer", color:"#6E8B5E", display:"flex", padding:4}}>
              <Check size={14}/>
            </button>
            <button onClick={()=>setExamStatus(ex, "missed")} title={lang==="bn"?"মিস হিসেবে চিহ্নিত করুন":"Mark as missed"}
              style={{border:"none", background:"transparent", cursor:"pointer", color:"#C0392B", display:"flex", padding:4}}>
              <X size={14}/>
            </button>
          </div>
        )}
        {kind !== "upcoming" && (
          <button onClick={()=>setExamStatus(ex, kind === "missed" ? "completed" : "missed")} title={kind === "missed" ? (lang==="bn"?"সম্পন্ন হিসেবে চিহ্নিত করুন":"Mark as completed") : (lang==="bn"?"মিস হিসেবে চিহ্নিত করুন":"Mark as missed")}
            style={{border:"none", background:"transparent", cursor:"pointer", color: kind === "missed" ? "#6E8B5E" : "#C0392B", display:"flex", padding:4, flexShrink:0}}>
            {kind === "missed" ? <Check size={14}/> : <X size={14}/>}
          </button>
        )}
        <button onClick={()=>startEdit(ex)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, display:"flex", padding:4, flexShrink:0}}>
          <Pencil size={14}/>
        </button>
        <button onClick={()=>onRemove(ex.id)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, display:"flex", padding:4, flexShrink:0}}>
          <Trash2 size={14}/>
        </button>
      </div>
    );
  };

  const StatCard = ({ icon: Icon, value, label, color, onClick, active }) => (
    <button onClick={onClick} disabled={!onClick} style={{flex:1, border: active ? `1.5px solid ${color}` : "1.5px solid transparent", background: dark ? `${color}1E` : `${color}12`, borderRadius:14, padding:"10px 6px", display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor: onClick ? "pointer" : "default", WebkitTapHighlightColor:"transparent"}}>
      <Icon size={15} color={color}/>
      <div style={{fontSize:16.5, fontWeight:800, color:textMain}}><Num>{nf(value)}</Num></div>
      <div style={{fontSize:10.5, fontWeight:600, color:textMuted2, whiteSpace:"nowrap"}}>{label}</div>
    </button>
  );

  const activeList = statusTab === "upcoming" ? upcoming : statusTab === "completed" ? completed : missed;
  const showAll = statusTab === "upcoming" ? showAllUpcoming : statusTab === "completed" ? showAllCompleted : showAllMissed;
  const setShowAll = statusTab === "upcoming" ? setShowAllUpcoming : statusTab === "completed" ? setShowAllCompleted : setShowAllMissed;
  const visibleList = showAll ? activeList : activeList.slice(0, 4);
  const emptyLabel = statusTab === "upcoming" ? (lang==="bn"?"কোনো আসন্ন পরীক্ষা নেই":"No upcoming exams")
    : statusTab === "completed" ? (lang==="bn"?"এখনো কোনো পরীক্ষা সম্পন্ন হয়নি":"No completed exams yet")
    : (lang==="bn"?"কোনো পরীক্ষা মিস হয়নি":"No missed exams");

  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, maxHeight:"min(80dvh, calc(100dvh - 24px))", borderRadius:"14px 14px 0 0", padding:"20px 20px 28px", color:textMain, display:"flex", flexDirection:"column", gap:16, overflow:"hidden"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0}}>
          <div style={{fontSize:16.5, fontWeight:800}}>{lang==="bn" ? "পরীক্ষার সময়সূচি" : "Exam Schedule"}</div>
          <div style={{display:"flex", alignItems:"center", gap:6}}>
            <button onClick={()=>{ resetForm(); setFormOpen(true); }} title={lang==="bn"?"নতুন পরীক্ষা যোগ করুন":"Add an exam"} style={{position:"relative", border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:10, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:accent}}>
              <Calendar size={15}/>
              <span style={{position:"absolute", bottom:-2, right:-2, width:12, height:12, borderRadius:"50%", background:accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center"}}><Plus size={8} strokeWidth={3}/></span>
            </button>
            <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
          </div>
        </div>

        <div style={{flex:1, minHeight:0, overflowY:"auto", display:"flex", flexDirection:"column", gap:16, WebkitOverflowScrolling:"touch"}}>
          {/* Add / edit form — collapsible */}
          <div style={{background: dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)", border:`1px solid ${cardBorder}`, borderRadius:14, padding:12, display:"flex", flexDirection:"column", gap: formOpen ? 8 : 0, flexShrink:0}}>
            <button onClick={()=>setFormOpen(v=>!v)} style={{display:"flex", alignItems:"center", justifyContent:"space-between", border:"none", background:"transparent", padding:0, cursor:"pointer", width:"100%"}}>
              <span style={{display:"flex", alignItems:"center", gap:8, fontSize:12.5, fontWeight:800, color:textMain}}>
                <CalendarDays size={14} color={accent}/>
                {editingId ? (lang==="bn"?"এডিট করুন":"Edit Exam") : (lang==="bn"?"নতুন পরীক্ষা যোগ করুন":"Add an Exam")}
              </span>
              <ChevronDown size={16} color={textMuted2} style={{transform: formOpen ? "rotate(180deg)" : "none", transition:"transform .15s ease"}}/>
            </button>
            {formOpen && (
              <>
                <input list="fg-exam-subject-list" value={subject} onChange={e=>setSubject(e.target.value)} placeholder={lang==="bn"?"কোর্স/সাবজেক্ট (যেমন HRM 5101)":"Course / subject (e.g. HRM 5101)"} style={inputStyle}/>
                <datalist id="fg-exam-subject-list">
                  {allSubjects.map(s => <option key={s} value={s}/>)}
                </datalist>
                <select value={examType} onChange={e=>setExamType(e.target.value)} style={{...inputStyle, color: examType ? (dark?"#F3F1F8":"#262433") : textMuted2}}>
                  <option value="">{lang==="bn"?"টাইপ বাছাই করুন":"Select type"}</option>
                  {EXAM_TYPE_OPTIONS.map(o => <option key={o.key} value={o.key}>{lang==="bn"?o.bn:o.en}</option>)}
                </select>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inputStyle}/>
                <div style={{display:"flex", gap:8}}>
                  <input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} style={inputStyle}/>
                  <input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} style={inputStyle}/>
                </div>
                <div style={{display:"flex", gap:8}}>
                  <button onClick={submit} disabled={!subject.trim() || !date} style={{flex:1, border:"none", borderRadius:10, padding:"10px 0", background: (!subject.trim() || !date) ? (dark?"#2A261F":"#E9E2D3") : accent, color: (!subject.trim() || !date) ? textMuted2 : "#fff", fontWeight:800, fontSize:13.5, cursor: (!subject.trim() || !date) ? "default" : "pointer"}}>
                    {editingId ? (lang==="bn"?"সেভ করুন":"Save") : (lang==="bn"?"যোগ করুন":"Add Exam")}
                  </button>
                  {editingId && (
                    <button onClick={resetForm} style={{border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:10, padding:"10px 16px", color:textMuted2, fontWeight:700, fontSize:13.5, cursor:"pointer"}}>
                      {lang==="bn"?"বাতিল":"Cancel"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Overview */}
          <div style={{display:"flex", flexDirection:"column", gap:8}}>
            <div style={{fontSize:10.5, fontWeight:700, letterSpacing:0.8, color:textMuted2, opacity:0.85, textTransform:"uppercase"}}>
              {lang==="bn"?"সারসংক্ষেপ":"Overview"}
            </div>
            <div style={{display:"flex", gap:8}}>
              <StatCard icon={Calendar} value={total} label={lang==="bn"?"মোট":"Total"} color={accent}/>
              <StatCard icon={Clock} value={upcoming.length} label={lang==="bn"?"আসন্ন":"Upcoming"} color={(dark ? "#F3F1F8" : "#1A1814")} onClick={()=>setStatusTab("upcoming")} active={statusTab==="upcoming"}/>
              <StatCard icon={Check} value={completed.length} label={lang==="bn"?"সম্পন্ন":"Completed"} color="#6E8B5E" onClick={()=>setStatusTab("completed")} active={statusTab==="completed"}/>
              <StatCard icon={TrendingUp} value={missed.length} label={lang==="bn"?"মিস":"Missed"} color="#C0392B" onClick={()=>setStatusTab("missed")} active={statusTab==="missed"}/>
            </div>
          </div>

          {/* Status tabs */}
          <div style={{display:"flex", gap:20, borderBottom:"1px solid var(--track)", flexShrink:0}}>
            {[
              { key:"upcoming", label: lang==="bn"?"আসন্ন":"Upcoming", count: upcoming.length },
              { key:"completed", label: lang==="bn"?"সম্পন্ন":"Completed", count: completed.length },
              { key:"missed", label: lang==="bn"?"মিস":"Missed", count: missed.length },
            ].map(tabDef => (
              <button key={tabDef.key} onClick={()=>setStatusTab(tabDef.key)} style={{border:"none", background:"transparent", cursor:"pointer", padding:"0 0 9px", fontSize:13.5, fontWeight:800, color: statusTab===tabDef.key ? textMain : textMuted2, borderBottom: statusTab===tabDef.key ? `2px solid ${accent}` : "2px solid transparent", marginBottom:-1}}>
                {tabDef.label} ({nf(tabDef.count)})
              </button>
            ))}
          </div>

          {/* Active list */}
          {activeList.length === 0 ? (
            statusTab === "upcoming" && total > 0 ? (
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"18px 10px 4px", gap:8}}>
                <div style={{width:60, height:60, borderRadius:"50%", background: dark?"rgba(110,139,94,0.18)":"rgba(110,139,94,0.14)", display:"flex", alignItems:"center", justifyContent:"center"}}>
                  <Check size={28} color="#6E8B5E" strokeWidth={2.5}/>
                </div>
                <div style={{fontSize:15.5, fontWeight:800, color:textMain}}>{lang==="bn"?"সব পরীক্ষা সম্পন্ন!":"All exams completed!"}</div>
                <div style={{fontSize:13, color:textMuted2, lineHeight:1.5, maxWidth:280}}>
                  {lang==="bn"?"দারুণ! আপনার নির্ধারিত সব পরীক্ষা শেষ হয়ে গেছে।":"Great job! You've completed all your scheduled exams."}
                </div>
                <button onClick={()=>{ resetForm(); setFormOpen(true); }} style={{marginTop:4, border:"none", background:accent, color:"#fff", borderRadius:12, padding:"9px 16px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6}}>
                  <Plus size={13}/> {lang==="bn"?"নতুন পরীক্ষা যোগ করুন":"Add New Exam"}
                </button>
                <div style={{marginTop:6, width:"100%", display:"flex", alignItems:"center", gap:8, background: dark?"rgba(110,139,94,0.14)":"rgba(110,139,94,0.10)", border:`1px solid ${dark?"rgba(110,139,94,0.3)":"rgba(110,139,94,0.25)"}`, borderRadius:12, padding:"10px 12px", textAlign:"left"}}>
                  <Sparkles size={15} color="#6E8B5E" style={{flexShrink:0}}/>
                  <span style={{fontSize:12.5, color:textMain, lineHeight:1.5}}>
                    {lang==="bn"?"একটু বিশ্রাম নিন আর নিজের পরিশ্রমকে উদযাপন করুন! 🎉":"Take some time to relax and celebrate your hard work! 🎉"}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{fontSize:13.5, color:textMuted2, textAlign:"center", padding:"14px 0"}}>{emptyLabel}</div>
            )
          ) : (
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {visibleList.map(ex => <ExamRow key={ex.id} ex={ex} kind={statusTab}/>)}
              {activeList.length > 4 && (
                <button onClick={()=>setShowAll(v=>!v)} style={{border:"none", background:"transparent", cursor:"pointer", color:accent, fontSize:12.5, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:4, padding:"4px 0"}}>
                  {showAll ? (lang==="bn"?"কম দেখান":"Show less") : (lang==="bn"?"সব দেখুন":"View All")}
                  <ChevronDown size={13} style={{transform: showAll ? "rotate(180deg)" : "none", transition:"transform .15s ease"}}/>
                </button>
              )}
              {statusTab === "upcoming" && (
                <div style={{display:"flex", alignItems:"center", gap:8, background: dark?"rgba(217,119,87,0.10)":"#EFEBF7", border:`1px solid ${dark?"rgba(217,119,87,0.3)":"#F0CBB8"}`, borderRadius:12, padding:"10px 12px", marginTop:4}}>
                  <Info size={15} color={accent} style={{flexShrink:0}}/>
                  <span style={{fontSize:12, color:textMain, lineHeight:1.5}}>
                    <b>{lang==="bn"?"টিপ:":"Tip:"}</b> {lang==="bn"?" আগেভাগে পরীক্ষা যোগ করে প্রস্তুত থাকুন। আপনি পারবেন! 💪":" Add your exams early and stay prepared. You've got this! 💪"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NextExamModal({ t, examSubjects, nextExam, onSave, onClose, cardBg, cardBorder, textMain, textMuted2, accent, dark }) {
  const subjectNames = Object.keys(examSubjects);
  const [subject, setSubject] = useState(nextExam?.subject || subjectNames[0] || "");
  const [topic, setTopic] = useState(nextExam?.topic || "");
  const [date, setDate] = useState(nextExam?.date || "");
  const topicOptions = Object.keys(examSubjects[subject]?.topics || {});

  const inputStyle = { border:`1px solid ${cardBorder}`, borderRadius:10, padding:"10px 12px", fontSize:14.5, background: dark?"#0A0A0A":"#F8F5EE", color: dark?"#F3F1F8":"#262433", outline:"none", width:"100%" };

  const submit = () => {
    if (!subject || !date) return;
    onSave({ subject, topic: topic.trim(), date });
  };

  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"14px 14px 0 0", padding:"20px 20px 28px", color:textMain, display:"flex", flexDirection:"column", gap:16}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{fontSize:16.5, fontWeight:800}}>{t.setNextExam}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>

        {subjectNames.length === 0 ? (
          <div style={{fontSize:13.5, color:textMuted2, textAlign:"center", padding:"10px 0"}}>{t.noSubjectsForExam}</div>
        ) : (
          <>
            <div>
              <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.chooseSubject}</div>
              <select style={inputStyle} value={subject} onChange={e=>{setSubject(e.target.value); setTopic("");}}>
                {subjectNames.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.chooseTopic}</div>
              <input style={inputStyle} list="next-exam-topics" value={topic} onChange={e=>setTopic(e.target.value)} placeholder={t.topicNamePlaceholder}/>
              <datalist id="next-exam-topics">
                {topicOptions.map(tp => <option key={tp} value={tp}/>)}
              </datalist>
            </div>
            <div>
              <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.examDateLabel}</div>
              <input type="date" style={inputStyle} value={date} onChange={e=>setDate(e.target.value)}/>
            </div>
            <button onClick={submit} style={{border:"none", borderRadius:12, padding:"12px 0", background:accent, color:"#fff", fontWeight:700, cursor:"pointer"}}>
              {t.save}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function CombinedExamEditorModal({ t, allSubjects, editingCombinedExam, onSave, onClose, cardBg, cardBorder, textMain, textMuted2, accent, dark }) {
  const [name, setName] = useState(editingCombinedExam?.name || "");
  const [type, setType] = useState(editingCombinedExam?.type || "weekly");
  const [picked, setPicked] = useState(editingCombinedExam?.subjects || []);

  const inputStyle = { border:`1px solid ${cardBorder}`, borderRadius:10, padding:"10px 12px", fontSize:14.5, background: dark?"#0A0A0A":"#F8F5EE", color: dark?"#F3F1F8":"#262433", outline:"none", width:"100%" };
  const typeOptions = [
    { k:"daily", label:t.typeDaily }, { k:"weekly", label:t.typeWeekly }, { k:"monthly", label:t.typeMonthly },
  ];

  const toggleSubject = (s) => setPicked(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev, s]);

  const submit = () => {
    const n = name.trim();
    if (!n || picked.length === 0) return;
    onSave(n, type, picked);
  };

  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"14px 14px 0 0", padding:"20px 20px 28px", color:textMain, display:"flex", flexDirection:"column", gap:16, maxHeight:"85vh", overflowY:"auto"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{fontSize:16.5, fontWeight:800}}>{editingCombinedExam ? t.editCombinedExam : t.addCombinedExam}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>

        {allSubjects.length === 0 ? (
          <div style={{fontSize:13.5, color:textMuted2, textAlign:"center", padding:"10px 0"}}>{t.noSubjectsForCombined}</div>
        ) : (
          <>
            <div>
              <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.combinedExamName}</div>
              <input autoFocus style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder={t.combinedExamNamePlaceholder}/>
            </div>
            <div>
              <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.typeLabel}</div>
              <div style={{display:"flex", gap:8}}>
                {typeOptions.map(o => (
                  <button key={o.k} onClick={()=>setType(o.k)} style={{flex:1, border:`1px solid ${type===o.k ? accent : cardBorder}`, background: type===o.k ? (dark?"rgba(217,119,87,0.15)":"rgba(217,119,87,0.1)") : "transparent", color: type===o.k ? accent : textMuted2, borderRadius:10, padding:"9px 0", fontSize:13.5, fontWeight:700, cursor:"pointer"}}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:2}}>{t.subjectsLabel}</div>
              <div style={{fontSize:11.5, color:textMuted2, opacity:0.85, marginBottom:8}}>{t.selectSubjectsNote}</div>
              <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                {allSubjects.map(s => {
                  const on = picked.includes(s);
                  const c = colorForSubject(s, allSubjects);
                  return (
                    <button key={s} onClick={()=>toggleSubject(s)} style={{display:"flex", alignItems:"center", gap:4, border:`1px solid ${on ? c.bg : cardBorder}`, background: on ? c.bgSoft : "transparent", color: on ? c.bg : textMuted2, borderRadius:14, padding:"6px 12px", fontSize:12.5, fontWeight:700, cursor:"pointer"}}>
                      {on && <Check size={11}/>} {s}
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={submit} style={{border:"none", borderRadius:12, padding:"12px 0", background:accent, color:"#fff", fontWeight:700, cursor:"pointer", opacity: (name.trim() && picked.length>0) ? 1 : 0.5}}>
              {t.save}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ExamMonthlySummary({ t, nf, lang, ls, monthName, examSubjects, examMonth, setExamMonth, allSubjects, cardBg, cardBorder, textMain, textMuted2, accent, dark }) {
  const y = examMonth.getFullYear(), m = examMonth.getMonth();
  const prefix = `${y}-${pad2(m+1)}`;

  const perSubject = {};
  let totalAttempts = 0, totalScorePct = 0, maxScorePct = 0;
  const examTopicSet = new Set();

  Object.entries(examSubjects).forEach(([subj, info]) => {
    Object.entries(info?.topics || {}).forEach(([topicName, topicInfo]) => {
      (topicInfo?.attempts || []).forEach(a => {
        if (!a.date || !a.date.startsWith(prefix)) return;
        const pct = a.total ? (a.obtained/a.total)*100 : 0;
        totalAttempts += 1;
        totalScorePct += pct;
        if (pct > maxScorePct) maxScorePct = pct;
        examTopicSet.add(`${subj}::${topicName}`);
        if (!perSubject[subj]) perSubject[subj] = { attempts:0, scoreSum:0, topics:new Set() };
        perSubject[subj].attempts += 1;
        perSubject[subj].scoreSum += pct;
        perSubject[subj].topics.add(topicName);
      });
    });
  });

  const avgScorePct = totalAttempts ? Math.round(totalScorePct/totalAttempts) : null;
  const totalExams = examTopicSet.size;
  const rows = Object.entries(perSubject).sort((a,b)=>a[0].localeCompare(b[0]));

  const statBox = { background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"12px 14px" };

  return (
    <div style={{marginTop:26}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <div className="fg-section-header">{t.monthlySummaryExam}</div>
          <span style={{fontSize:10.5, fontWeight:800, letterSpacing:0.3, padding:"2px 7px", borderRadius:10, background: dark?"#242229":"#F0EEF5", color: dark?"#B0ABC2":"#6E6B7A", flexShrink:0}}>
            {t.planViewExam}
          </span>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:6}}>
          <button onClick={()=>setExamMonth(new Date(y,m-1,1))} style={{border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:8, width:28,height:28, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer", color:textMain}}><ChevronLeft size={14}/></button>
          <div style={{fontSize:13.5, fontWeight:700, minWidth:76, textAlign:"center"}}>{monthName(m)} <Num>{nf(y)}</Num></div>
          <button onClick={()=>setExamMonth(new Date(y,m+1,1))} style={{border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:8, width:28,height:28, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer", color:textMain}}><ChevronRight size={14}/></button>
        </div>
      </div>

      {totalAttempts === 0 ? (
        <div style={{textAlign:"center", padding:"22px 10px", color:textMuted2, fontSize:13.5, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:14, marginTop:14}}>
          {t.noExamDataMonth}
        </div>
      ) : (
        <>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:14}}>
            <div style={statBox}>
              <div style={{fontSize:11.5, color:textMuted2, fontWeight:700, letterSpacing:ls(0.5)}}>{t.totalExams}</div>
              <div style={{fontSize:24.5, fontWeight:800, marginTop:4}}><Num>{nf(totalExams)}</Num></div>
            </div>
            <div style={statBox}>
              <div style={{fontSize:11.5, color:textMuted2, fontWeight:700, letterSpacing:ls(0.5)}}>{t.totalAttempts}</div>
              <div style={{fontSize:24.5, fontWeight:800, marginTop:4}}><Num>{nf(totalAttempts)}</Num></div>
            </div>
            <div style={statBox}>
              <div style={{fontSize:11.5, color:textMuted2, fontWeight:700, letterSpacing:ls(0.5)}}>{t.avgScoreLabel}</div>
              <div style={{fontSize:24.5, fontWeight:800, marginTop:4, color:(dark ? "#F3F1F8" : "#1A1814")}}><Num>{nf(avgScorePct)}</Num>%</div>
            </div>
            <div style={statBox}>
              <div style={{fontSize:11.5, color:textMuted2, fontWeight:700, letterSpacing:ls(0.5)}}>{t.maxScoreLabel}</div>
              <div style={{fontSize:24.5, fontWeight:800, marginTop:4, color:"#6E8B5E"}}><Num>{nf(Math.round(maxScorePct))}</Num>%</div>
            </div>
          </div>

          <div style={{marginTop:16}}>
            <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:8}}>{t.subjectBreakdown}</div>
            <div style={{border:`1px solid ${cardBorder}`, borderRadius:14, overflow:"hidden"}}>
              <div style={{display:"grid", gridTemplateColumns:"1.6fr 0.8fr 0.8fr 0.8fr", padding:"8px 12px", background: dark?"#0A0A0A":"#F8F5EE", fontSize:11.5, fontWeight:700, color:textMuted2}}>
                <span>{t.subjectLabel}</span><span style={{textAlign:"right"}}>{t.examsCol}</span><span style={{textAlign:"right"}}>{t.attemptsCol}</span><span style={{textAlign:"right"}}>{t.avgCol}</span>
              </div>
              {rows.map(([subj, d]) => {
                const c = colorForSubject(subj, allSubjects);
                const avg = Math.round(d.scoreSum/d.attempts);
                return (
                  <div key={subj} style={{display:"grid", gridTemplateColumns:"1.6fr 0.8fr 0.8fr 0.8fr", padding:"9px 12px", fontSize:13.5, fontWeight:600, borderTop:"1px solid var(--track)", alignItems:"center"}}>
                    <span style={{display:"flex", alignItems:"center", gap:6, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                      <span style={{width:7,height:7,borderRadius:"50%", background:c.bg, flexShrink:0}}/>{subj}
                    </span>
                    <span style={{textAlign:"right"}}><Num>{nf(d.topics.size)}</Num></span>
                    <span style={{textAlign:"right"}}><Num>{nf(d.attempts)}</Num></span>
                    <span style={{textAlign:"right", color:(dark ? "#F3F1F8" : "#1A1814"), fontWeight:700}}><Num>{nf(avg)}</Num>%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


function SummaryView({ t, lang, nf, entries, title, rangeLabel, cardBg, cardBorder, textMuted2, accent, dark, allSubjects, mode, crossWeekResolve }) {
  const ls = (px) => (lang === "bn" ? 0 : px);
  const textMain = dark ? "#F3F1F8" : "#262433";
  // Subject-level catch-up: if a subject has any completed entry in this range,
  // its not-yet-done entries in the same range are treated as caught up too.
  const doneSubjects = new Set(entries.filter(e => e.done).map(e => e.subject));
  const effectiveEntries = entries.map(e => {
    if (!e.done && crossWeekResolve && doneSubjects.has(e.subject)) {
      return { ...e, done: true, _caughtUp: true };
    }
    return e;
  });

  const totalCount = effectiveEntries.length;
  const doneCount = effectiveEntries.filter(e => e.done).length;
  const overallPct = totalCount ? Math.round((doneCount/totalCount)*100) : 0;
  const trackColor = dark ? "#242424" : "#E7E5ED";

  const subjTotals = {};
  effectiveEntries.forEach(e => {
    if (!subjTotals[e.subject]) subjTotals[e.subject] = { done:0, total:0 };
    subjTotals[e.subject].total += 1;
    if (e.done) subjTotals[e.subject].done += 1;
  });

  const subjMinutes = {};
  effectiveEntries.filter(e => e.done).forEach(e => {
    subjMinutes[e.subject] = (subjMinutes[e.subject] || 0) + (e.duration || 0);
  });
  const maxMinutes = Math.max(1, ...Object.values(subjMinutes).length ? Object.values(subjMinutes) : [0]);

  return (
    <div style={{marginTop:20}}>
      <div style={{fontSize:20.5, fontWeight:800, letterSpacing:-0.3}}>{title}</div>
      <div style={{fontSize:12.5, color:textMuted2, marginBottom:16, fontWeight:600}}>{rangeLabel}</div>

      {/* Overview card */}
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"14px 16px", marginBottom:20}}>
        <div>
          <div style={{fontSize:10.5, letterSpacing:ls(1.5), color:textMuted2, fontWeight:700, opacity:0.85, marginBottom:8}}>{t.overview}</div>
          <div style={{display:"flex", gap:16}}>
            <div>
              <div style={{fontSize:20.5, fontWeight:800, color:"#6E8B5E"}}><Num>{nf(doneCount)}</Num></div>
              <div style={{fontSize:11.5, color:textMuted2, fontWeight:600}}>{t.doneCount}</div>
            </div>
            <div>
              <div style={{fontSize:20.5, fontWeight:800}}><Num>{nf(totalCount - doneCount)}</Num></div>
              <div style={{fontSize:11.5, color:textMuted2, fontWeight:600}}>{t.remaining}</div>
            </div>
          </div>
          <div style={{marginTop:10, height:6, width:120, borderRadius:4, background:trackColor, border:`1px solid ${cardBorder}`, overflow:"hidden"}}>
            <div style={{height:"100%", width:`${overallPct}%`, background:accent, borderRadius:4, transition:"width .3s"}}/>
          </div>
        </div>
        <PercentRing pct={overallPct} accent={accent} trackColor={trackColor} textMain={dark?"#F3F1F8":"#262433"} nf={nf}/>
      </div>

      {mode === "duration" ? (
        <div style={{marginBottom:20}}>
          <div style={{fontSize:10.5, letterSpacing:ls(1.5), color:textMuted2, fontWeight:700, opacity:0.85, marginBottom:10}}>{t.subjectTimeBreakdown}</div>
          <div style={{display:"flex", flexDirection:"column", gap:10}}>
            {Object.keys(subjMinutes).length === 0 && (
              <div style={{textAlign:"center", padding:"26px 10px", color:textMuted2, fontSize:13.5, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:14, display:"flex", flexDirection:"column", alignItems:"center", gap:8}}>
                <BarChart3 size={20} style={{opacity:0.6}}/>
                {t.noTimeData}
              </div>
            )}
            {Object.entries(subjMinutes).sort((a,b)=>b[1]-a[1]).map(([subj, mins]) => {
              const c = colorForSubject(subj, allSubjects);
              const pct = Math.round((mins/maxMinutes)*100);
              return (
                <div key={subj} className="fg-card" style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"12px 16px"}}>
                  <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
                    <span style={{fontWeight:700, fontSize:13.5}}>{subj}</span>
                    <span style={{fontSize:12.5, fontWeight:700, color:c.bg}}>{formatDuration(mins, lang, nf)}</span>
                  </div>
                  <div style={{height:6, borderRadius:4, background: dark? "#242424":"#E7E5ED", border:`1px solid ${cardBorder}`, overflow:"hidden"}}>
                    <div style={{height:"100%", width:`${pct}%`, background:c.bg, borderRadius:4, transition:"width .3s"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{display:"flex", flexDirection:"column", gap:10, marginBottom:20}}>
          {Object.entries(subjTotals).length === 0 && (
            <div style={{textAlign:"center", padding:"26px 10px", color:textMuted2, fontSize:13.5, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:14, display:"flex", flexDirection:"column", alignItems:"center", gap:8}}>
              <Calendar size={20} style={{opacity:0.6}}/>
              {t.noSubjectData}
            </div>
          )}
          {Object.entries(subjTotals).map(([subj,v]) => {
            const c = colorForSubject(subj, allSubjects);
            const pct = v.total ? Math.round((v.done/v.total)*100) : 0;
            return (
              <div key={subj} className="fg-card" style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"12px 16px"}}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
                  <span style={{fontWeight:700, fontSize:13.5}}>{subj}</span>
                  <span style={{fontSize:12.5, fontWeight:700, color:c.bg}}><Num>{nf(pct)}</Num>%</span>
                </div>
                <div style={{height:6, borderRadius:4, background: dark? "#242424":"#E7E5ED", border:`1px solid ${cardBorder}`, overflow:"hidden"}}>
                  <div style={{height:"100%", width:`${pct}%`, background:c.bg, borderRadius:4, transition:"width .3s"}}/>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SubjectGroupedList entries={effectiveEntries} nf={nf} t={t}
        remainingLabel={t.missed} doneLabel={t.covered}
        remainingEmptyText={t.noneMissed} doneEmptyText={t.noneCovered}
        cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}/>
    </div>
  );
}

// Read-only subject-grouped list: remaining topics first, then done topics.
function SubjectGroupedList({ entries, nf, t, remainingLabel, doneLabel, remainingEmptyText, doneEmptyText, cardBg, cardBorder, textMain, textMuted2, accent }) {
  // ডিফল্টে বন্ধ থাকবে, হেডারে ট্যাপ করলে খুলবে
  const [openRemaining, setOpenRemaining] = useState(false);
  const [openDone, setOpenDone] = useState(false);
  const remaining = {}, done = {};
  entries.forEach(e => {
    const bucket = e.done ? done : remaining;
    if (!bucket[e.subject]) bucket[e.subject] = [];
    bucket[e.subject].push(e);
  });
  const remainingSubjects = Object.keys(remaining);
  const doneSubjects = Object.keys(done);
  const remainingCount = remainingSubjects.reduce((a,s)=>a+remaining[s].length, 0);
  const doneCount = doneSubjects.reduce((a,s)=>a+done[s].length, 0);
  return (
    <div style={{display:"flex", flexDirection:"column", gap:16}}>
      <div>
        <button onClick={()=>setOpenRemaining(o=>!o)} style={{width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", background:"transparent", border:"none", padding:0, marginBottom:8, cursor:"pointer", color:textMain}}>
          <span style={{fontSize:12.5, fontWeight:700}}>✕ {remainingLabel} (<Num>{nf(remainingCount)}</Num>)</span>
          <ChevronDown size={16} style={{color:textMuted2, transform: openRemaining ? "rotate(180deg)" : "rotate(0deg)", transition:"transform .15s"}}/>
        </button>
        {openRemaining && (remainingSubjects.length === 0 ?
          <div style={{textAlign:"center", padding:"18px 10px", color:textMuted2, fontSize:12.5, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:14, display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
            <Check size={16} style={{opacity:0.7, color:"#6E8B5E"}}/>
            {remainingEmptyText}
          </div> :
          <div style={{display:"flex", flexDirection:"column", gap:10}}>
            {remainingSubjects.map(subj => (
              <div key={subj}>
                <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:4}}>{subj}</div>
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  {remaining[subj].map(e => (
                    <div key={e.id+(e._dk||"")} className="fg-card" style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:12, padding:"9px 12px", fontSize:13.5}}>{e.topic}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>)}
      </div>
      <div>
        <button onClick={()=>setOpenDone(o=>!o)} style={{width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", background:"transparent", border:"none", padding:0, marginBottom:8, cursor:"pointer"}}>
          <span style={{fontSize:12.5, fontWeight:700, color:"#6E8B5E"}}>✓ {doneLabel} (<Num>{nf(doneCount)}</Num>)</span>
          <ChevronDown size={16} style={{color:textMuted2, transform: openDone ? "rotate(180deg)" : "rotate(0deg)", transition:"transform .15s"}}/>
        </button>
        {openDone && (doneSubjects.length === 0 ?
          <div style={{textAlign:"center", padding:"18px 10px", color:textMuted2, fontSize:12.5, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:14, display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
            <Folder size={16} style={{opacity:0.6}}/>
            {doneEmptyText}
          </div> :
          <div style={{display:"flex", flexDirection:"column", gap:10}}>
            {doneSubjects.map(subj => (
              <div key={subj}>
                <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:4}}>{subj}</div>
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  {done[subj].map(e => (
                    <div key={e.id+(e._dk||"")} className="fg-card" style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:12, padding:"9px 12px", fontSize:13.5, display:"flex", alignItems:"center", justifyContent:"space-between", gap:8}}>
                      <span>{e.topic}</span>
                      {e._caughtUp && <span style={{fontSize:10.5, fontWeight:700, color:textMuted2, flexShrink:0}}>{t?.caughtUpNote}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>)}
      </div>
    </div>
  );
}

// সাপ্তাহিক/মাসিক টপিক সারাংশ কার্ড — নেভিগেশন হেডার + covered/missed লিস্ট (Subject+Topic নাম মিলিয়ে)।
// পিরিয়ড শেষ না হলে শুধু একটা "pending" মেসেজ দেখায়, কোনো ভুল/অসম্পূর্ণ হিসেব দেখায় না।
function TopicSummaryPeriodCard({ label, rangeLabel, isComplete, pendingText, covered, missed, canGoPrev, canGoNext, onPrev, onNext, t, nf, cardBg, cardBorder, textMain, textMuted2, accent, sourceLabel, sourceColor }) {
  const toEntry = (x, done) => ({ id: `${x.subject}||${x.topic}`, subject: x.subject, topic: x.topic, done });
  const entries = [
    ...missed.map(x => toEntry(x, false)),
    ...covered.map(x => toEntry(x, true)),
  ];
  return (
    <div style={{marginTop:20}}>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10}}>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <div style={{fontSize:10.5, letterSpacing:0.5, color:textMuted2, fontWeight:700, opacity:0.85}}>{label}</div>
          {sourceLabel && (
            <span style={{fontSize:10.5, fontWeight:800, letterSpacing:0.3, padding:"2px 7px", borderRadius:10, background:`${sourceColor}1F`, color:sourceColor, flexShrink:0}}>
              {sourceLabel}
            </span>
          )}
        </div>
        <div style={{display:"flex", alignItems:"center", gap:4}}>
          <button onClick={onPrev} disabled={!canGoPrev} style={{border:`1px solid ${cardBorder}`, background:cardBg, color: canGoPrev?textMain:textMuted2, borderRadius:8, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", cursor: canGoPrev?"pointer":"default", opacity: canGoPrev?1:0.4}}>
            <ChevronLeft size={14}/>
          </button>
          <span style={{fontSize:12.5, fontWeight:700, color:textMain, minWidth:0, whiteSpace:"nowrap"}}>{rangeLabel}</span>
          <button onClick={onNext} disabled={!canGoNext} style={{border:`1px solid ${cardBorder}`, background:cardBg, color: canGoNext?textMain:textMuted2, borderRadius:8, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", cursor: canGoNext?"pointer":"default", opacity: canGoNext?1:0.4}}>
            <ChevronRight size={14}/>
          </button>
        </div>
      </div>
      {!isComplete ? (
        <div style={{textAlign:"center", padding:"22px 10px", color:textMuted2, fontSize:13.5, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:14}}>
          {pendingText}
        </div>
      ) : (
        <SubjectGroupedList entries={entries} nf={nf} t={t}
          remainingLabel={t.missed} doneLabel={t.covered}
          remainingEmptyText={t.noneMissed} doneEmptyText={t.noneCovered}
          cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}/>
      )}
    </div>
  );
}

// Read-only-capable list of topics used by the Today and Plan tabs.
function TopicsList({ items, allSubjects, t, nf, lang, cardBg, cardBorder, textMuted2, textMain, accent, onToggle, onStartTimer, onEdit, onDelete, onRename, emptyText, emptySubtext, emptyIcon: EmptyIcon, onEmptyAdd, emptyAddLabel, activeTimerId, timerRunning, timerSeconds, onToggleRun, useAccentColor, rowDividerColor }) {
  const ls = (px) => (lang === "bn" ? 0 : px);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const closeMenu = () => { setOpenMenuId(null); setConfirmDeleteId(null); };
  if (items.length === 0) {
    return (
      <div style={{border:`1px dashed ${cardBorder}`, borderRadius:12, padding:"9px 11px", textAlign:"left", background: `${accent}08`}}>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          {EmptyIcon && (
            <span style={{width:24, height:24, borderRadius:"50%", background:`${accent}1A`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
              <EmptyIcon size={13} color={accent} strokeWidth={2}/>
            </span>
          )}
          <div style={{minWidth:0}}>
            <div style={{fontWeight:600, color:textMain, fontSize:12.5}}>{emptyText}</div>
            {emptySubtext && <div style={{fontSize:11, color:textMuted2, marginTop:1, lineHeight:1.3}}>{emptySubtext}</div>}
          </div>
        </div>
        {onEmptyAdd && emptyAddLabel && (
          <button onClick={onEmptyAdd} style={{marginTop:10, width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:6, border:"none", borderRadius:10, padding:"10px 0", background:`${accent}1A`, color:accent, fontWeight:700, fontSize:13, cursor:"pointer"}}>
            <Plus size={15}/> {emptyAddLabel}
          </button>
        )}
      </div>
    );
  }
  return (
    <div style={{display:"flex", flexDirection:"column", gap:0}}>
      {items.map((item, idx) => {
        const c = useAccentColor ? { bg: accent, bgSoft: `${accent}1A` } : colorForSubject(item.subject, allSubjects);
        const isActiveTimer = activeTimerId && activeTimerId === item.id;
        return (
          <div key={item.id} className="fg-task-row" style={{
            background: isActiveTimer ? `${c.bg}0F` : "transparent",
            borderRadius: isActiveTimer ? 14 : 0, padding: isActiveTimer ? "12px 13px" : "13px 2px", position:"relative",
            borderBottom: (!isActiveTimer && rowDividerColor && idx < items.length - 1) ? `1px solid ${rowDividerColor}` : "none",
            transition:"background .15s ease",
          }}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8}}>
              <div style={{display:"flex", alignItems:"center", gap:9, minWidth:0, flex:1}}>
                <button onClick={onToggle ? ()=>onToggle(item.id) : undefined} disabled={!onToggle} title={item.done ? t.markUndone || t.done : t.markDone || t.done}
                  style={{width:17, height:17, borderRadius:"50%", flexShrink:0, border:`2px solid ${item.done ? "#6E8B5E" : c.bg}`, background: item.done ? "#6E8B5E" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor: onToggle?"pointer":"default", padding:0, transition:"background-color .2s ease, border-color .2s ease"}}>
                  {item.done && <Check size={10} color="#fff" strokeWidth={3.4}/>}
                </button>
                <span style={{fontSize:13.5, fontWeight:500, wordBreak:"break-word", opacity: item.done ? 0.55 : 0.85, lineHeight:1.3, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:textMain}}>{item.topic}</span>
              </div>
              <div style={{display:"flex", alignItems:"center", gap:4, flexShrink:0}}>
                {onStartTimer && !item.done && (
                  isActiveTimer ? (
                    <button onClick={onToggleRun} title={timerRunning ? t.pause : t.start} style={{width:24,height:24, borderRadius:"50%", border:"none", flexShrink:0, cursor:"pointer", background: c.bg, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 2px 6px ${c.bg}59`}}>
                      {timerRunning ? <Pause size={10} fill="#fff" color="#fff"/> : <Play size={10} fill="#fff" color="#fff"/>}
                    </button>
                  ) : (
                    <button onClick={()=>onStartTimer(item.id, item.duration)} title={t.start} style={{width:24,height:24, borderRadius:"50%", border:"none", flexShrink:0, cursor:"pointer", background: c.bg, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 2px 6px ${c.bg}59`}}>
                      <Play size={10} fill="#fff" color="#fff"/>
                    </button>
                  )
                )}
                {(onEdit || onDelete) && (
                  <div style={{position:"relative", flexShrink:0}}>
                    <button onClick={()=>{ setOpenMenuId(v => v===item.id ? null : item.id); setConfirmDeleteId(null); }} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, padding:4}}>
                      <MoreVertical size={15}/>
                    </button>
                    {openMenuId === item.id && (
                      <>
                        <div onClick={closeMenu} style={{position:"fixed", inset:0, zIndex:59}}/>
                        <div style={{position:"absolute", right:0, top:"100%", marginTop:4, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:10, boxShadow:"0 4px 12px rgba(0,0,0,0.08)", zIndex:60, minWidth:150, overflow:"hidden"}}>
                          {confirmDeleteId === item.id ? (
                            <>
                              <div style={{padding:"9px 12px", fontSize:12.5, color:textMuted2, fontWeight:500}}>{t.confirmDeleteTopic || t.deleteTopic}</div>
                              <button onClick={()=>{ closeMenu(); onDelete(item.id); }} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:13.5, fontWeight:500, cursor:"pointer", textAlign:"left"}}>
                                <Trash2 size={13}/> {t.confirmDelete || t.deleteTopic}
                              </button>
                              <button onClick={()=>setConfirmDeleteId(null)} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:13.5, fontWeight:500, cursor:"pointer", textAlign:"left"}}>
                                {t.cancel}
                              </button>
                            </>
                          ) : (
                            <>
                              {onEdit && (
                                <button onClick={()=>{closeMenu(); onEdit(item);}} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:13.5, fontWeight:500, cursor:"pointer", textAlign:"left"}}>
                                  <Pencil size={13}/> {t.edit}
                                </button>
                              )}
                              {onDelete && (
                                <button onClick={()=>setConfirmDeleteId(item.id)} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:13.5, fontWeight:500, cursor:"pointer", textAlign:"left"}}>
                                  <Trash2 size={13}/> {t.deleteTopic}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {isActiveTimer && (
              <div style={{marginTop:6, marginLeft:26}}>
                <div className={timerRunning ? "fg-timer-running" : undefined} style={{fontSize:12.5, fontWeight:600, fontVariantNumeric:"tabular-nums", color:c.bg, whiteSpace:"nowrap"}}>
                  <Num>{nf(pad2(Math.floor(timerSeconds/60)))}:{nf(pad2(timerSeconds%60))}</Num> <span style={{fontSize:10.5, fontWeight:500, opacity:0.85}}>{t.timeRemainingLabel}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AddModal({ t, nf, subjects, entries, topicBank, onAddTopicToBank, onAddSubject, defaultStart, onClose, onAdd, cardBg, cardBorder, textMain, textMuted2, accent, dark }) {
  const [subject, setSubject] = useState(subjects[0] || "");
  const [topic, setTopic] = useState("");
  const [useTime, setUseTime] = useState(false);
  const [startTime, setStartTime] = useState(defaultStart);
  const [endTime, setEndTime] = useState(minutesToTime(timeToMinutes(defaultStart) + 30));
  const [useDuration, setUseDuration] = useState(false);
  const [durationInput, setDurationInput] = useState(30);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false); // সাবজেক্ট চিপ লিস্ট ডিফল্টে লুকানো থাকে (অনেকগুলো সাবজেক্ট থাকলে huge space নিত) — "Choose from list" চাপলেই খুলবে
  const inputStyle = { width:"100%", boxSizing:"border-box", background: dark?"#0A0A0A":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"11px 13px", fontSize:14.5, color:textMain, outline:"none", fontFamily:"inherit" };
  const duration = useTime ? diffMinutes(startTime, endTime) : (useDuration ? (Number(durationInput) || 0) : 0);
  const canSubmit = subject.trim() && topic.trim();
  // সাবজেক্ট চিপ লিস্ট — আগে থেকে যোগ করা সাবজেক্টগুলো, ক্লিক করলেই সিলেক্ট হয়ে যাবে (টপিক চিপের মতোই)
  const subjectChips = [...subjects].sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:"base"}));
  const submit = () => {
    if (!canSubmit) return;
    const subj = subject.trim();
    onAddSubject && onAddSubject(subj);
    onAddTopicToBank && onAddTopicToBank(subj, topic.trim());
    onAdd({subject: subj, topic:topic.trim(), time: useTime ? startTime : null, endTime: useTime ? endTime : null, duration});
  };
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"14px 14px 0 0", padding:"20px 20px 28px", color:textMain}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
          <div className="fg-section-header">{t.addTopicTitle}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:12}}>
          <div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6}}>
              <div style={{fontSize:11.5, fontWeight:700, color:textMuted2}}>{t.subjectLabel}</div>
              {subjectChips.length > 0 && (
                <button type="button" onClick={()=>setShowSubjectPicker(v=>!v)} style={{display:"flex", alignItems:"center", gap:3, border:"none", background:"transparent", color:accent, cursor:"pointer", fontSize:11.5, fontWeight:700, padding:0}}>
                  {showSubjectPicker ? t.hideSubjectList : t.chooseFromList}
                  <ChevronDown size={12} style={{transform: showSubjectPicker ? "rotate(180deg)" : "none", transition:"transform .15s ease"}}/>
                </button>
              )}
            </div>
            {showSubjectPicker && subjectChips.length > 0 && (
              <>
                <div style={{fontSize:10.5, fontWeight:700, color:textMuted2, opacity:0.8, marginBottom:0}}>{t.pickSubject}</div>
                <RecentTopicChips topics={subjectChips} onPick={(s)=>{setSubject(s); setShowSubjectPicker(false);}} accent={accent} cardBorder={cardBorder} textMuted2={textMuted2} dark={dark}/>
              </>
            )}
            <input style={{...inputStyle, marginTop: (showSubjectPicker && subjectChips.length) ? 8 : 0}} value={subject} onChange={e=>setSubject(e.target.value)} placeholder={t.subjectPlaceholder}/>
            <div style={{fontSize:11.5, color:textMuted2, opacity:0.75, marginTop:5}}>{t.newSubjectAutoSaved}</div>
          </div>
          <div>
            <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.topicLabel}</div>
            <input style={inputStyle} value={topic} onChange={e=>setTopic(e.target.value)} placeholder={t.topicPlaceholder}/>
            <div style={{fontSize:11.5, color:textMuted2, opacity:0.75, marginTop:5}}>{t.newTopicAutoSaved}</div>
          </div>

          <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", userSelect:"none"}}>
            <input type="checkbox" checked={useTime} onChange={e=>setUseTime(e.target.checked)}
              style={{width:16, height:16, accentColor:accent, cursor:"pointer"}}/>
            <span style={{fontSize:13.5, fontWeight:600, color:textMain}}>{t.addTimeToggle}</span>
          </label>

          {useTime ? (
            <div style={{display:"flex", gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.startTimeLabel}</div>
                <input type="time" style={inputStyle} value={startTime} onChange={e=>setStartTime(e.target.value)}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.endTimeLabel}</div>
                <input type="time" style={inputStyle} value={endTime} onChange={e=>setEndTime(e.target.value)}/>
              </div>
            </div>
          ) : (
            <>
              <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", userSelect:"none"}}>
                <input type="checkbox" checked={useDuration} onChange={e=>setUseDuration(e.target.checked)}
                  style={{width:16, height:16, accentColor:accent, cursor:"pointer"}}/>
                <span style={{fontSize:13.5, fontWeight:600, color:textMain}}>{t.addDurationToggle}</span>
              </label>
              {useDuration && (
                <div>
                  <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.durationLabel}</div>
                  <input type="number" min="1" style={inputStyle} value={durationInput} onChange={e=>setDurationInput(e.target.value)}/>
                </div>
              )}
            </>
          )}

          {duration > 0 && <div style={{fontSize:12.5, color:textMuted2, fontWeight:600}}><Num>{nf(duration)}</Num> {t.minutes}</div>}
        </div>
        <div style={{display:"flex", gap:10, marginTop:20}}>
          <button onClick={onClose} style={{flex:1, padding:"12px 0", borderRadius:12, border:`1px solid ${cardBorder}`, background:"transparent", color:textMain, fontWeight:700, cursor:"pointer"}}>{t.cancel}</button>
          <button onClick={submit} disabled={!canSubmit}
            style={{flex:1, padding:"12px 0", borderRadius:12, border:"none", background:accent, color:"#fff", fontWeight:700, cursor: canSubmit?"pointer":"not-allowed", opacity: canSubmit?1:0.45}}>{t.add}</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ t, nf, subjects, entries, topicBank, onAddTopicToBank, item, onClose, onSave, cardBg, cardBorder, textMain, textMuted2, accent, dark }) {
  const subjectOptions = Array.from(new Set([item.subject, ...subjects]));
  const [subject, setSubject] = useState(item.subject);
  const [topic, setTopic] = useState(item.topic);
  const [useTime, setUseTime] = useState(!!item.time);
  const [startTime, setStartTime] = useState(item.time || "09:00");
  const [endTime, setEndTime] = useState(item.endTime || minutesToTime(timeToMinutes(item.time || "09:00") + (item.duration || 30)));
  const [useDuration, setUseDuration] = useState(!!item.duration);
  const [durationInput, setDurationInput] = useState(item.duration || 30);
  const inputStyle = { width:"100%", boxSizing:"border-box", background: dark?"#0A0A0A":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"11px 13px", fontSize:14.5, color:textMain, outline:"none", fontFamily:"inherit" };
  const duration = useTime ? diffMinutes(startTime, endTime) : (useDuration ? (Number(durationInput) || 0) : 0);
  const pickTopics = topicPickList(topicBank, entries, subject).filter(tp => tp !== item.topic);
  const submit = () => {
    if (!(subject && topic.trim())) return;
    onAddTopicToBank && onAddTopicToBank(subject, topic.trim());
    onSave({id:item.id, subject, topic:topic.trim(), time: useTime ? startTime : null, endTime: useTime ? endTime : null, duration});
  };
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"14px 14px 0 0", padding:"20px 20px 28px", color:textMain}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
          <div className="fg-section-header">{t.editTopicTitle}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:12}}>
          <div>
            <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.subjectLabel}</div>
            <select style={inputStyle} value={subject} onChange={e=>setSubject(e.target.value)}>
              {[...subjectOptions].sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:"base"})).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.topicLabel}</div>
            {pickTopics.length > 0 && (
              <div style={{fontSize:10.5, fontWeight:700, color:textMuted2, opacity:0.8, marginBottom:6}}>{t.pickFromBank}</div>
            )}
            <RecentTopicChips topics={pickTopics} onPick={setTopic} accent={accent} cardBorder={cardBorder} textMuted2={textMuted2} dark={dark}/>
            <input style={{...inputStyle, marginTop: pickTopics.length ? 8 : 0}} value={topic} onChange={e=>setTopic(e.target.value)} placeholder={t.topicPlaceholder}/>
          </div>

          <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", userSelect:"none"}}>
            <input type="checkbox" checked={useTime} onChange={e=>setUseTime(e.target.checked)}
              style={{width:16, height:16, accentColor:accent, cursor:"pointer"}}/>
            <span style={{fontSize:13.5, fontWeight:600, color:textMain}}>{t.addTimeToggle}</span>
          </label>

          {useTime ? (
            <div style={{display:"flex", gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.startTimeLabel}</div>
                <input type="time" style={inputStyle} value={startTime} onChange={e=>setStartTime(e.target.value)}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.endTimeLabel}</div>
                <input type="time" style={inputStyle} value={endTime} onChange={e=>setEndTime(e.target.value)}/>
              </div>
            </div>
          ) : (
            <>
              <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", userSelect:"none"}}>
                <input type="checkbox" checked={useDuration} onChange={e=>setUseDuration(e.target.checked)}
                  style={{width:16, height:16, accentColor:accent, cursor:"pointer"}}/>
                <span style={{fontSize:13.5, fontWeight:600, color:textMain}}>{t.addDurationToggle}</span>
              </label>
              {useDuration && (
                <div>
                  <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.durationLabel}</div>
                  <input type="number" min="1" style={inputStyle} value={durationInput} onChange={e=>setDurationInput(e.target.value)}/>
                </div>
              )}
            </>
          )}

          {duration > 0 && <div style={{fontSize:12.5, color:textMuted2, fontWeight:600}}><Num>{nf(duration)}</Num> {t.minutes}</div>}
        </div>
        <div style={{display:"flex", gap:10, marginTop:20}}>
          <button onClick={onClose} style={{flex:1, padding:"12px 0", borderRadius:12, border:`1px solid ${cardBorder}`, background:"transparent", color:textMain, fontWeight:700, cursor:"pointer"}}>{t.cancel}</button>
          <button onClick={submit}
            style={{flex:1, padding:"12px 0", borderRadius:12, border:"none", background:accent, color:"#fff", fontWeight:700, cursor:"pointer", opacity: (subject&&topic.trim())?1:0.5}}>{t.save}</button>
        </div>
      </div>
    </div>
  );
}

function SubjectsModal({ t, subjects, onAdd, onRemove, onRename, onClose, topicBank, onAddTopic, onAddTopicsBulk, onRemoveTopic, onRenameTopic, expandedSubject, onToggleExpand, cardBg, cardBorder, textMain, textMuted2, accent, dark }) {
  const [name, setName] = useState("");
  const [editingSubject, setEditingSubject] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState("");
  const inputStyle = { width:"100%", boxSizing:"border-box", background: dark?"#0A0A0A":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"11px 13px", fontSize:14.5, color:textMain, outline:"none", fontFamily:"inherit" };
  const submit = () => {
    const v = name.trim();
    if (!v || subjects.includes(v)) return;
    onAdd(v);
    setName("");
  };
  const startEdit = (s) => { setEditingSubject(s); setEditValue(s); setEditError(""); };
  const cancelEdit = () => { setEditingSubject(null); setEditError(""); };
  const saveEdit = () => {
    const v = editValue.trim();
    if (!v || v === editingSubject) { cancelEdit(); return; }
    const ok = onRename(editingSubject, v);
    if (ok === false) { setEditError(t.nameExists); return; }
    setEditingSubject(null); setEditError("");
  };
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"14px 14px 0 0", padding:"20px 20px 28px", color:textMain, maxHeight:"82vh", display:"flex", flexDirection:"column"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
          <div className="fg-section-header">{t.manageSubjects}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>
        <div style={{display:"flex", gap:8, marginBottom:16}}>
          <input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder={t.subjectPlaceholder}
            onKeyDown={e=>{ if (e.key === "Enter") submit(); }}/>
          <button onClick={submit} style={{border:"none", borderRadius:12, padding:"0 16px", background:accent, color:"#fff", fontWeight:700, cursor:"pointer"}}>{t.add}</button>
        </div>
        <div style={{overflowY:"auto", display:"flex", flexDirection:"column", gap:8}}>
          {subjects.length === 0 && <div style={{fontSize:13.5, color:textMuted2, textAlign:"center", padding:"20px 0"}}>{t.noSubjectsYet}</div>}
          {[...subjects].sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:"base"})).map(s => (
            <div key={s} style={{border:`1px solid ${cardBorder}`, borderRadius:12, padding:"10px 14px"}}>
              {editingSubject === s ? (
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  <div style={{display:"flex", gap:6, alignItems:"center"}}>
                    <input autoFocus style={{...inputStyle, padding:"8px 10px", fontSize:13.5}} value={editValue} onChange={e=>setEditValue(e.target.value)}
                      onKeyDown={e=>{ if (e.key==="Enter") saveEdit(); if (e.key==="Escape") cancelEdit(); }}/>
                    <button onClick={saveEdit} style={{border:"none", background:"transparent", cursor:"pointer", color:accent, flexShrink:0}}><Check size={17}/></button>
                    <button onClick={cancelEdit} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, flexShrink:0}}><X size={17}/></button>
                  </div>
                  {editError && <div style={{fontSize:11.5, color:"#C0553F", fontWeight:600}}>{editError}</div>}
                </div>
              ) : (
                <>
                  <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <button onClick={()=>onToggleExpand(s)} style={{display:"flex", alignItems:"center", gap:6, border:"none", background:"transparent", cursor:"pointer", padding:0, color:textMain}}>
                      <ChevronDown size={14} style={{transform: expandedSubject===s ? "rotate(0deg)" : "rotate(-90deg)", transition:"transform .15s ease", color:textMuted2, flexShrink:0}}/>
                      <span style={{fontSize:14.5, fontWeight:600, textAlign:"left"}}>{s}</span>
                      <span style={{fontSize:11.5, fontWeight:700, color:textMuted2, opacity:0.8}}>· <Num>{((topicBank && topicBank[s]) || []).length}</Num> {t.topicsLabel.toLowerCase()}</span>
                    </button>
                    <div style={{display:"flex", gap:16, alignItems:"center"}}>
                      <button onClick={()=>startEdit(s)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><Pencil size={14}/></button>
                      <button onClick={()=>onRemove(s)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><Trash2 size={15}/></button>
                    </div>
                  </div>
                  {expandedSubject === s && (
                    <SubjectTopicBank t={t} subject={s} topics={(topicBank && topicBank[s]) || []}
                      onAddTopic={onAddTopic} onAddTopicsBulk={onAddTopicsBulk} onRemoveTopic={onRemoveTopic} onRenameTopic={onRenameTopic}
                      cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// প্রতিটা সাবজেক্টের নিজস্ব Topic Bank — SubjectsModal-এর ভেতরে expand করলে দেখা যায়।
// এখানে একটা করে বা বাল্ক (এক লাইনে একটা করে / কমা দিয়ে আলাদা) টপিক যোগ করা যায়, কোনো আপার লিমিট নেই।
function SubjectTopicBank({ t, subject, topics, onAddTopic, onAddTopicsBulk, onRemoveTopic, onRenameTopic, cardBorder, textMain, textMuted2, accent, dark }) {
  const [single, setSingle] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [editingTopic, setEditingTopic] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState("");
  const smallInput = { width:"100%", boxSizing:"border-box", background: dark?"#0A0A0A":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:10, padding:"8px 10px", fontSize:13.5, color:textMain, outline:"none", fontFamily:"inherit" };
  const addSingle = () => { const v = single.trim(); if (!v) return; onAddTopic(subject, v); setSingle(""); };
  const addBulk = () => { if (!bulkText.trim()) return; onAddTopicsBulk(subject, bulkText); setBulkText(""); setBulkOpen(false); };
  const startEdit = (tp) => { setEditingTopic(tp); setEditValue(tp); setEditError(""); };
  const saveEdit = () => {
    const v = editValue.trim();
    if (!v || v === editingTopic) { setEditingTopic(null); return; }
    const ok = onRenameTopic(subject, editingTopic, v);
    if (ok === false) { setEditError(t.nameExists); return; }
    setEditingTopic(null); setEditError("");
  };
  return (
    <div style={{marginTop:12, paddingTop:12, borderTop:"1px solid var(--track)"}}>
      <div style={{display:"flex", gap:6, marginBottom:8}}>
        <input style={smallInput} value={single} onChange={e=>setSingle(e.target.value)} placeholder={t.topicNamePlaceholder}
          onKeyDown={e=>{ if (e.key==="Enter") addSingle(); }}/>
        <button onClick={addSingle} style={{border:"none", borderRadius:10, padding:"0 12px", background:accent, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:12.5, flexShrink:0}}>{t.add}</button>
      </div>
      {!bulkOpen ? (
        <button onClick={()=>setBulkOpen(true)} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", fontSize:11.5, fontWeight:700, padding:0, marginBottom:10}}>
          + {t.bulkAddTopics}
        </button>
      ) : (
        <div style={{marginBottom:10}}>
          <textarea value={bulkText} onChange={e=>setBulkText(e.target.value)} placeholder={t.bulkAddPlaceholder} rows={3}
            style={{...smallInput, resize:"vertical", marginBottom:6}}/>
          <div style={{display:"flex", gap:6}}>
            <button onClick={addBulk} style={{border:"none", borderRadius:10, padding:"6px 12px", background:accent, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:12.5}}>{t.add}</button>
            <button onClick={()=>{setBulkOpen(false); setBulkText("");}} style={{border:`1px solid ${cardBorder}`, borderRadius:10, padding:"6px 12px", background:"transparent", color:textMain, fontWeight:700, cursor:"pointer", fontSize:12.5}}>{t.cancel}</button>
          </div>
        </div>
      )}
      <div style={{display:"flex", flexDirection:"column", gap:6}}>
        {topics.length === 0 && <div style={{fontSize:12.5, color:textMuted2, opacity:0.85}}>{t.noTopicsInSubject}</div>}
        {topics.map(tp => (
          <div key={tp} style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, background: dark?"#0A0A0A":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:10, padding:"7px 10px"}}>
            {editingTopic === tp ? (
              <div style={{display:"flex", flexDirection:"column", gap:4, flex:1}}>
                <div style={{display:"flex", gap:6, alignItems:"center"}}>
                  <input autoFocus style={{...smallInput, padding:"5px 8px", fontSize:12.5}} value={editValue} onChange={e=>setEditValue(e.target.value)}
                    onKeyDown={e=>{ if (e.key==="Enter") saveEdit(); if (e.key==="Escape") setEditingTopic(null); }}/>
                  <button onClick={saveEdit} style={{border:"none", background:"transparent", cursor:"pointer", color:accent, flexShrink:0}}><Check size={15}/></button>
                  <button onClick={()=>setEditingTopic(null)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, flexShrink:0}}><X size={15}/></button>
                </div>
                {editError && <div style={{fontSize:11.5, color:"#C0553F", fontWeight:600}}>{editError}</div>}
              </div>
            ) : (
              <>
                <span style={{fontSize:12.5, fontWeight:600, wordBreak:"break-word"}}>{tp}</span>
                <DeleteMenuButton
                  onEdit={()=>startEdit(tp)}
                  onDelete={()=>onRemoveTopic(subject, tp)}
                  editLabel={t.edit} deleteLabel={t.deleteTopic}
                  confirmText={t.confirmDeleteTopic} confirmLabel={t.confirmDelete} cancelLabel={t.cancel}
                  cardBg={dark?"#1A1814":"#FFFFFF"} cardBorder={cardBorder} textMuted2={textMuted2} iconSize={14}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExamsModal({ t, nf, subjects, examSubjects, onAdd, onRemove, onClose, cardBg, cardBorder, textMain, textMuted2, accent, dark }) {
  const availableSubjects = subjects.filter(s => !examSubjects[s]);
  const [subject, setSubject] = useState(availableSubjects[0] || "");
  const inputStyle = { width:"100%", boxSizing:"border-box", background: dark?"#0A0A0A":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"11px 13px", fontSize:14.5, color:textMain, outline:"none", fontFamily:"inherit" };
  const submit = () => {
    if (!subject) return;
    onAdd(subject);
    const next = availableSubjects.filter(s => s !== subject);
    setSubject(next[0] || "");
  };
  const examList = Object.entries(examSubjects).sort((a,b)=>a[0].localeCompare(b[0], undefined, {sensitivity:"base"}));
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"14px 14px 0 0", padding:"20px 20px 28px", color:textMain, maxHeight:"80vh", display:"flex", flexDirection:"column"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
          <div className="fg-section-header">{t.manageExams}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:10, marginBottom:16}}>
          {availableSubjects.length === 0 ? (
            <div style={{fontSize:13.5, color:textMuted2}}>{subjects.length === 0 ? t.addSubjectsFirst : "—"}</div>
          ) : (
            <>
              <div>
                <div style={{fontSize:11.5, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.subjectLabel}</div>
                <select style={inputStyle} value={subject} onChange={e=>setSubject(e.target.value)}>
                  {[...availableSubjects].sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:"base"})).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button onClick={submit} style={{border:"none", borderRadius:12, padding:"12px 0", background:accent, color:"#fff", fontWeight:700, cursor:"pointer"}}>
                {t.addExam}
              </button>
            </>
          )}
        </div>

        <div style={{overflowY:"auto", display:"flex", flexDirection:"column", gap:8}}>
          {examList.length === 0 && <div style={{fontSize:13.5, color:textMuted2, textAlign:"center", padding:"20px 0"}}>{t.noExamSubjects}</div>}
          {examList.map(([s, info]) => {
            const topicCount = Object.keys(info?.topics || {}).length;
            return (
              <div key={s} style={{display:"flex", alignItems:"center", justifyContent:"space-between", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"10px 14px"}}>
                <div>
                  <div style={{fontSize:14.5, fontWeight:600}}>{s}</div>
                  <div style={{fontSize:11.5, color:textMuted2, fontWeight:600, marginTop:2}}><Num>{nf(topicCount)}</Num> {t.topicsLabel}</div>
                </div>
                <button onClick={()=>onRemove(s)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><Trash2 size={15}/></button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WeekDayStrip({ days, entries, selectedKey, onSelectDay, todayKey, weekdayShort, nf, accent, dark, textMuted2, textMain, cardBg, cardBorder }) {
  return (
    <div className="fg-week-strip" style={{display:"flex", gap:8, overflowX:"auto", paddingBottom:2, scrollSnapType:"x proximity", WebkitMaskImage:"linear-gradient(to right, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)", maskImage:"linear-gradient(to right, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)"}}>
      {days.map((d,i) => {
        const dk = dateKey(d);
        const isToday = dk === todayKey;
        const isSelected = dk === selectedKey;
        const list = entries[dk] || [];
        const hasAny = list.length > 0;
        const doneAll = hasAny && list.every(x=>x.done);
        const dotColor = !hasAny ? textMuted2 : (doneAll ? "#6E8B5E" : (dark ? "#F3F1F8" : "#1A1814"));
        return (
          <button key={i} onClick={()=>onSelectDay(d)} style={{
            flex:"0 0 auto", width:56, display:"flex", flexDirection:"column", alignItems:"center", gap:6,
            padding:"10px 0 11px", borderRadius:14, scrollSnapAlign:"start",
            border: isSelected ? "1px solid transparent" : (isToday ? `1px solid ${accent}` : `1px solid ${cardBorder}`),
            background: cardBg,
            cursor:"pointer", transition:"background .15s ease, border-color .15s ease",
          }}>
            <span style={{fontSize:11.5, fontWeight:700, color: isSelected ? accent : (isToday ? accent : textMuted2)}}>{weekdayShort(d)}</span>
            <span style={{
              width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
              background: isSelected ? (dark ? "rgba(217,119,87,0.22)" : "rgba(217,119,87,0.14)") : "transparent",
              boxShadow: isSelected ? `0 0 0 1.5px ${accent}` : "none",
              fontSize:16.5, fontWeight:800, color: isSelected ? accent : textMain, transition:"background .15s ease",
            }}><Num>{nf(d.getDate())}</Num></span>
            <span style={{width:6, height:6, borderRadius:"50%", background: dotColor, opacity: hasAny ? 1 : 0.35, flexShrink:0}}/>
          </button>
        );
      })}
    </div>
  );
}

function DaySelectedCard({ day, entries, allSubjects, t, nf, lang, weekdayName, monthName, cardBg, innerBg, cardBorder, textMain, textMuted2, accent, onToggle }) {
  const list = entries || [];
  const doneCount = list.filter(x=>x.done).length;
  return (
    <div style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"14px 16px", marginTop:14}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
        <span style={{fontSize:14.5, fontWeight:700}}>{weekdayName(day)}, <Num>{nf(day.getDate())}</Num> {monthName(day.getMonth())}</span>
        {list.length > 0 && <span style={{fontSize:12.5, color:textMuted2, fontWeight:600}}><Num>{nf(doneCount)}</Num>/<Num>{nf(list.length)}</Num></span>}
      </div>
      <TopicsList items={list} allSubjects={allSubjects} t={t} nf={nf} lang={lang}
        cardBg={innerBg} cardBorder={cardBorder} textMuted2={textMuted2}
        onToggle={onToggle} emptyText={t.noData}/>
    </div>
  );
}

function InlineMonthCalendar({ calMonth, setCalMonth, entries, selectedKey, onSelectDay, lang, nf, monthName, today, examDateKeys, cardBg, cardBorder, textMain, textMuted2, accent, dark }) {
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const firstDay = new Date(y, m, 1);
  const startOffset = weekStartOffset(firstDay.getDay());
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const cells = [];
  for (let i=0;i<startOffset;i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(y,m,d));
  const shortDays = weekdayShortLabels(lang);

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
        <button onClick={()=>setCalMonth(new Date(y,m-1,1))} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", display:"flex", padding:4}}><ChevronLeft size={18}/></button>
        <span style={{fontSize:14.5, fontWeight:800}}>{monthName(m)} <Num>{nf(y)}</Num></span>
        <button onClick={()=>setCalMonth(new Date(y,m+1,1))} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", display:"flex", padding:4}}><ChevronRight size={18}/></button>
      </div>
      <div style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"14px 12px"}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:8}}>
          {shortDays.map((d,i)=>(<div key={i} style={{textAlign:"center", fontSize:11.5, fontWeight:700, color:textMuted2}}>{d}</div>))}
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", rowGap:6}}>
          {cells.map((d,i) => {
            if (!d) return <div key={i}/>;
            const dk = dateKey(d);
            const list = entries[dk] || [];
            const hasAny = list.length > 0;
            const doneAll = hasAny && list.every(x=>x.done);
            const isExam = examDateKeys ? examDateKeys.has(dk) : false;
            const isHoliday = isHolidayKey(dk);
            const isToday = dk === dateKey(today);
            const isSelected = dk === selectedKey;
            const future = d > today;
            return (
              <button key={i} onClick={()=>onSelectDay(d)} disabled={future && !hasAny}
                title={isHoliday ? holidayName(dk, lang) : undefined}
                style={{display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"4px 0", border:"none", background:"transparent", cursor:(future&&!hasAny)?"default":"pointer", opacity:(future&&!hasAny)?0.4:1}}>
                <div style={{position:"relative", width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12.5, fontWeight:700,
                  background: isSelected ? accent : "transparent",
                  border: isToday && !isSelected ? `1px solid ${accent}` : "none",
                  color: isSelected ? "#fff" : textMain}}>
                  {isExam && <span style={{position:"absolute", top:-2, right:-2, width:5, height:5, borderRadius:"50%", background: dark ? "#F3F1F8" : "#1A1814"}}/>}
                  {isHoliday && <span style={{position:"absolute", top:-2, left:-2, width:5, height:5, borderRadius:"50%", background:"#C0392B"}}/>}
                  <Num>{nf(d.getDate())}</Num>
                </div>
                <span style={{width:4, height:4, borderRadius:"50%", background: !hasAny ? "transparent" : (doneAll ? "#6E8B5E" : (dark ? "#F3F1F8" : "#1A1814"))}}/>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// ---------- Notes: subject/category রঙ প্যালেট (Keep-এর মতো প্রতিটা subject-এর নিজের রঙ) ----------
const NOTE_COLOR_PALETTE = [
  { bg: "#FDE7C8", bgDark: "#3A3120", text: "#7A5010", textDark: "#F0C177" },
  { bg: "#D9EAD3", bgDark: "#22301F", text: "#3E6B2E", textDark: "#8FCB7A" },
  { bg: "#CFE2F3", bgDark: "#1E2C36", text: "#2B5F8A", textDark: "#7FB8E8" },
  { bg: "#F4CCCC", bgDark: "#3A2323", text: "#A14444", textDark: "#E58A8A" },
  { bg: "#E6D9F5", bgDark: "#2E2536", text: "#6B4A9E", textDark: "#C0A3EA" },
  { bg: "#D0ECE7", bgDark: "#1F332F", text: "#2E7D6E", textDark: "#7FD1BE" },
  { bg: "#FCE4EC", bgDark: "#332126", text: "#B03A63", textDark: "#EC8FAE" },
  { bg: "#FFF2CC", bgDark: "#332C1B", text: "#8A7217", textDark: "#E8C862" },
];
function noteColorFor(category, allCategories) {
  const idx = Math.max(0, (allCategories || []).indexOf(category));
  return NOTE_COLOR_PALETTE[idx % NOTE_COLOR_PALETTE.length];
}
// note.category-এর রঙ কার্ডে ব্যবহারের সময় (আইকন/চেকবক্স/লেবেল টেক্সট) — dark mode-এ হালকা টোন,
// আগে সবসময় লাইট-মোডের গাঢ় "text" রঙ ব্যবহার হতো, তাই dark card-এর উপর লো-কনট্রাস্ট/অস্পষ্ট দেখাতো
function noteAccentTextFor(col, dark) {
  return dark ? (col.textDark || col.text) : col.text;
}

// ---------- Notes: নোট কার্ডের ব্যাকগ্রাউন্ড রঙ (ঐচ্ছিক) — প্রতি নোট আলাদা রঙ করে রাখা যাবে, যাতে চোখের দেখায় দ্রুত খুঁজে পাওয়া যায় ----------
const NOTE_BG_PALETTE = [
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
function noteBgFor(colorKey, dark) {
  const found = NOTE_BG_PALETTE.find(c => c.key === (colorKey || null)) || NOTE_BG_PALETTE[0];
  const fallback = dark ? "#221E19" : NOTE_PAPER_BG;
  return (dark ? found.bgDark : found.bg) || fallback;
}
// সাদা/কালো ব্যাকগ্রাউন্ড বেছে নিলে লেখার রঙও (ইঙ্ক) মানানসই হতে হবে — যেমন কালো ব্যাকগ্রাউন্ডে হালকা রঙের লেখা, থিম যাই হোক না কেন
function noteTextFor(colorKey, dark) {
  const found = NOTE_BG_PALETTE.find(c => c.key === (colorKey || null)) || NOTE_BG_PALETTE[0];
  if (found.ink) return dark ? (found.inkDark || found.ink) : found.ink;
  return dark ? "#F3F1F8" : NOTE_PAPER_TEXT;
}

// ---------- Notes: লেখার রঙ (টেক্সট কালার) — সিলেক্ট করা অংশে প্রয়োগ হয়, কিছু সাধারণ রঙ যথেষ্ট ----------
const NOTE_TEXT_COLORS = [
  { key: "red",    hex: "#C0392B" },
  { key: "green",  hex: "#2F8F46" },
  { key: "blue",   hex: "#1F6FB2" },
  { key: "orange", hex: "#D9770B" },
  { key: "yellow", hex: "#B8860B" },
];

// ---------- সহজ **bold** / *italic* মার্কডাউন রেন্ডারার (Keep-এর মতো ফরম্যাটিং দেখানোর জন্য) ----------
function renderFormattedText(str) {
  if (!str) return null;
  const parts = String(str).split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(s => s !== "");
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// ---------- রিচ টেক্সট এডিটর (Bold/Italic/Underline/H1/H2) — নোটের body এখন HTML হতে পারে ----------
// পুরনো নোটগুলো plain text/markdown, নতুনগুলো contentEditable থেকে HTML — দুটোই আলাদাভাবে চেনার জন্য এই হেল্পার
function looksLikeHtml(str) {
  return !!str && /<\/?[a-z][\s\S]*>/i.test(String(str));
}
// প্রিভিউ কার্ডে "খালি কিনা" চেক করা বা সার্চের জন্য HTML থেকে প্লেইন টেক্সট বের করা
function stripHtmlToText(str) {
  if (!str) return "";
  return String(str).replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|h1|h2|li)>/gi, "\n").replace(/<[^>]+>/g, "").replace(/\u00a0/g, " ").trim();
}
// পুরনো প্লেইন-টেক্সট নোট contentEditable-এ দেখানোর আগে সেফলি HTML-এ কনভার্ট করা হয় (লাইন ব্রেক ঠিক রেখে)
function textToHtml(str) {
  if (!str) return "";
  const esc = String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(/\n/g, "<br>");
}

// ---------- ফুল date + time (Created / Last edited দেখানোর জন্য) ----------
function fullDateTimeLabel(iso, lang) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString(lang === "bn" ? "bn-BD" : "en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

// নোট নিজেই সবসময় অফ-হোয়াইট (পেপার-এর মতো) থাকবে — অ্যাপের ডার্ক মোড থিম আলাদা, এটা শুধু নোটের জন্য
const NOTE_PAPER_BG = "#F7F1E3";
const NOTE_PAPER_TEXT = "#242424";
const NOTE_PAPER_MUTED = "#7C7361";

// নোটে যোগ করা ছবি সরাসরি Firestore-এর একটামাত্র ডকুমেন্টে (users/{uid}) সেভ হয়, যেটার সাইজ লিমিট ~1MB।
// তাই আসল ছবি না রেখে, ক্যানভাসে এঁকে ছোট (max ৮০০px) ও কম্প্রেসড JPEG বানিয়ে base64 হিসেবে সেভ করা হয় —
// এতে একটা ছবি সাধারণত ৩০-১৫০KB-র মধ্যে থাকে, পুরো নোট ডকুমেন্ট ফুলে যায় না
function compressImageToDataUrl(file, maxDim = 800, quality = 0.6) {
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


// টাস্ক রো-তে ট্যাপ করলে খোলা রিড-অনলি ডিটেইল শিট — ফুল টাইটেল, প্রায়োরিটি, ক্যাটাগরি/ডিউ-ডেট, নোট দেখায়; এডিট করতে পেন্সিল আইকনে চাপলে AddTaskModal খোলে
function TaskDetailSheet({ task, priorityLabel, priorityColor, lang, nf, onClose, onToggleDone, onToggleFavorite, onPlayAudio, onEdit, onDelete, cardBg, cardBorder, textMain, textMuted2, accent, dark, bg }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const closeMenu = () => { setMenuOpen(false); setConfirmDelete(false); };
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:420, maxHeight:"80vh", overflowY:"auto", WebkitOverflowScrolling:"touch", borderRadius:"14px 14px 0 0", padding:"18px 20px 26px", color:textMain}}>
        <div style={{width:36, height:4, borderRadius:4, background:cardBorder, margin:"0 auto 14px"}}/>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10}}>
          <div style={{flex:1, fontSize:16.5, fontWeight:700, lineHeight:1.35, wordBreak:"break-word", opacity: task.done?0.6:1}}>
            {task.title}
          </div>
          <button onClick={onToggleFavorite} title={lang==="bn"?"ফেভারিট":"Favorite"} style={{border:"none", background:bg, color: task.favorite ? "#D9445E" : textMuted2, width:34, height:34, borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
            <Heart size={15} fill={task.favorite ? "#D9445E" : "none"}/>
          </button>
          <div style={{position:"relative", flexShrink:0}}>
            <button onClick={(e)=>{ e.stopPropagation(); setMenuOpen(v=>!v); setConfirmDelete(false); }} title={lang==="bn"?"আরও অপশন":"More options"} style={{border:"none", background:bg, color:textMuted2, width:34, height:34, borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", touchAction:"manipulation"}}>
              <MoreVertical size={16}/>
            </button>
            {menuOpen && (
              <>
                <div onClick={closeMenu} style={{position:"fixed", inset:0, zIndex:59}}/>
                <div style={{position:"absolute", right:0, top:"100%", marginTop:4, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:10, boxShadow:"0 4px 12px rgba(0,0,0,0.08)", zIndex:60, minWidth:150, overflow:"hidden"}}>
                  {confirmDelete ? (
                    <>
                      <div style={{padding:"9px 12px", fontSize:12.5, color:textMuted2, fontWeight:600}}>{lang==="bn"?"টাস্কটি ডিলিট করবেন?":"Delete this task?"}</div>
                      <button onClick={()=>{ closeMenu(); onDelete(); }} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:13.5, fontWeight:700, cursor:"pointer", textAlign:"left"}}>
                        <Trash2 size={13}/> {lang==="bn"?"ডিলিট নিশ্চিত করুন":"Confirm delete"}
                      </button>
                      <button onClick={()=>setConfirmDelete(false)} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:13.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                        {lang==="bn"?"বাতিল":"Cancel"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={()=>{ closeMenu(); onEdit(); }} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:13.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                        <Pencil size={13}/> {lang==="bn"?"এডিট":"Edit"}
                      </button>
                      <button onClick={()=>setConfirmDelete(true)} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:13.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                        <Trash2 size={13}/> {lang==="bn"?"ডিলিট":"Delete"}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <button onClick={onClose} style={{border:"none", background:bg, color:textMuted2, width:30, height:30, borderRadius:"50%", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
            <X size={16}/>
          </button>
        </div>

        <button onClick={onToggleDone} style={{display:"flex", alignItems:"center", gap:8, border:`1px solid ${task.done ? "#6E8B5E" : cardBorder}`, background: task.done ? "rgba(110,139,94,0.1)" : "transparent", color: task.done ? "#6E8B5E" : textMuted2, borderRadius:12, padding:"8px 12px", fontSize:13.5, fontWeight:700, cursor:"pointer", marginTop:14}}>
          <span style={{width:16, height:16, borderRadius:"50%", border:`2px solid ${task.done ? "#6E8B5E" : textMuted2}`, background: task.done ? "#6E8B5E" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
            {task.done && <Check size={10} color="#fff" strokeWidth={3}/>}
          </span>
          {task.done ? (lang==="bn" ? "সম্পন্ন হয়েছে" : "Completed") : (lang==="bn" ? "সম্পন্ন হিসেবে চিহ্নিত করুন" : "Mark as done")}
        </button>

        <div style={{fontSize:10.5, fontWeight:700, letterSpacing:0.5, color:textMuted2, textTransform:"uppercase", marginTop:18, marginBottom:6}}>{lang==="bn"?"প্রায়োরিটি":"Priority"}</div>
        <span style={{display:"inline-flex", alignItems:"center", gap:4, fontSize:12.5, fontWeight:700, color:priorityColor, background:`${priorityColor}1A`, borderRadius:8, padding:"5px 10px"}}>
          <span style={{width:6,height:6,borderRadius:"50%", background:priorityColor}}/>
          {priorityLabel}
        </span>

        {task.dueDate && (
          <>
            <div style={{fontSize:10.5, fontWeight:700, letterSpacing:0.5, color:textMuted2, textTransform:"uppercase", marginTop:16, marginBottom:6}}>{lang==="bn"?"ডিউ ডেট":"Due Date"}</div>
            <div style={{fontSize:13.5, fontWeight:500, color:textMain}}>
              {new Date(task.dueDate+"T00:00:00").toLocaleDateString(lang==="bn"?"bn-BD":"en-US", {day:"numeric", month:"short", year:"numeric"})}
            </div>
          </>
        )}

        <div style={{fontSize:10.5, fontWeight:700, letterSpacing:0.5, color:textMuted2, textTransform:"uppercase", marginTop:16, marginBottom:6}}>{lang==="bn"?"নোট":"Note"}</div>
        <div style={{fontSize:13.5, fontWeight:400, lineHeight:1.55, color: task.note ? textMain : textMuted2, background:bg, borderRadius:12, padding:"10px 12px", minHeight:20, whiteSpace:"pre-wrap", wordBreak:"break-word"}}>
          {task.note || (lang==="bn" ? "কোনো নোট নেই — এডিট করে যোগ করুন।" : "No note yet — tap edit to add one.")}
        </div>

        {task.audioDuration && (
          <>
            <div style={{fontSize:10.5, fontWeight:700, letterSpacing:0.5, color:textMuted2, textTransform:"uppercase", marginTop:16, marginBottom:6}}>{lang==="bn"?"ভয়েস নোট":"Voice Note"}</div>
            <button onClick={onPlayAudio} style={{display:"flex", alignItems:"center", gap:8, border:"none", background:bg, color:textMain, borderRadius:12, padding:"10px 12px", fontSize:13.5, fontWeight:600, cursor:"pointer", width:"100%"}}>
              <Play size={14} fill={textMain}/> {task.audioDuration}
            </button>
          </>
        )}

        {task.repeatGoal && (
          <>
            <div style={{fontSize:10.5, fontWeight:700, letterSpacing:0.5, color:textMuted2, textTransform:"uppercase", marginTop:16, marginBottom:6}}>{lang==="bn"?"স্ট্রিক":"Streak"}</div>
            <div style={{fontSize:13.5, fontWeight:600, color:textMain}}><Num>{nf(task.streakCount||0)}</Num> / <Num>{nf(task.repeatGoal)}</Num></div>
          </>
        )}

        {typeof task.progress === "number" && (
          <>
            <div style={{fontSize:10.5, fontWeight:700, letterSpacing:0.5, color:textMuted2, textTransform:"uppercase", marginTop:16, marginBottom:6}}>{lang==="bn"?"প্রোগ্রেস":"Progress"}</div>
            <div style={{display:"flex", alignItems:"center", gap:10}}>
              <div style={{flex:1, height:8, borderRadius:4, background:bg, overflow:"hidden"}}>
                <div style={{width:`${task.progress}%`, height:"100%", background:"#E0607A", borderRadius:4}}/>
              </div>
              <span style={{fontSize:12.5, fontWeight:700, color:textMain}}><Num>{nf(task.progress)}</Num>%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


function AddTaskModal({ t, lang, onClose, onSubmit, initialTask, defaultDueDate, categories, onAddCategory, cardBg, cardBorder, textMain, textMuted2, accent, dark, bg }) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const category = initialTask?.category || (categories && categories[0] && categories[0].key) || "study"; // category picker সরিয়ে দেওয়া হয়েছে (functional filter/group ছিল না, শুধু মেটাডেটা) — ডিফল্ট ভ্যালুই সেভ হবে
  const [priority, setPriority] = useState(initialTask?.priority || "med");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || defaultDueDate || "");
  const [repeat, setRepeat] = useState(initialTask?.repeat || "none"); // "none" | "daily" | "weekly" | "monthly"
  const [reminderTime, setReminderTime] = useState(initialTask?.reminderTime || "");
  const [note, setNote] = useState(initialTask?.note || "");
  const [favorite, setFavorite] = useState(initialTask?.favorite || false);
  const [repeatGoal, setRepeatGoal] = useState(initialTask?.repeatGoal ? String(initialTask.repeatGoal) : "");
  const [progress, setProgress] = useState(typeof initialTask?.progress === "number" ? initialTask.progress : null);
  const [audioData, setAudioData] = useState(initialTask?.audioData || null);
  const [audioDuration, setAudioDuration] = useState(initialTask?.audioDuration || "");
  const [isRecording, setIsRecording] = useState(false);
  const [recordElapsed, setRecordElapsed] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recordElapsedRef = useRef(0);
  const recordTimerRef = useRef(null);

  const fmtDuration = (sec) => `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      recordElapsedRef.current = 0;
      setRecordElapsed(0);
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioData(reader.result);
          setAudioDuration(fmtDuration(recordElapsedRef.current || 1));
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(tr => tr.stop());
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setIsRecording(true);
      recordTimerRef.current = setInterval(() => {
        recordElapsedRef.current += 1;
        setRecordElapsed(recordElapsedRef.current);
      }, 1000);
    } catch (err) {
      alert(lang === "bn" ? "মাইক্রোফোন অ্যাক্সেস পাওয়া যায়নি।" : "Couldn't access the microphone.");
    }
  };
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    clearInterval(recordTimerRef.current);
  };
  const deleteRecording = () => { setAudioData(null); setAudioDuration(""); };
  useEffect(() => () => clearInterval(recordTimerRef.current), []);
  // ডিফল্টে শুধু Title + Date দেখানো হয় (দ্রুত টাস্ক যোগ করার জন্য) — Priority/Repeat/Note "More options"-এর নিচে লুকানো,
  // এডিট করার সময় বা কেউ আগে থেকে এগুলো সেট করে থাকলে খোলাই দেখানো হয়
  const [showMore, setShowMore] = useState(
    !!initialTask && (initialTask.priority !== "med" || !!initialTask.repeat || !!initialTask.note || !!initialTask.reminderTime)
  );
  const sheetRef = useRef(null);
  const titleInputRef = useRef(null);
  const vh = useVisualViewportHeight(); // কিবোর্ড খোলা অবস্থায় দৃশ্যমান উচ্চতা — sheet-কে এর মধ্যেই ধরে রাখা হয়
  const isEditing = !!initialTask;

  // sheet-এর slide-up animation শেষ হওয়ার পরেই input-এ focus করে কিবোর্ড খোলা হচ্ছে —
  // নাহলে মডাল ওঠা আর কিবোর্ড খোলা একই সাথে হয়ে দুটো আলাদা "ঝাঁকুনি" মনে হয়
  useEffect(() => {
    const timer = setTimeout(() => titleInputRef.current?.focus(), 260);
    return () => clearTimeout(timer);
  }, []);

  const submit = () => {
    if (!title.trim()) return;
    onSubmit({
      id: initialTask?.id || `${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      title: title.trim(), category, priority, dueDate: dueDate || null,
      repeat: repeat === "none" ? null : repeat,
      reminderTime: (dueDate && reminderTime) ? reminderTime : null,
      note: note.trim(),
      favorite,
      repeatGoal: (repeat !== "none" && repeatGoal) ? Number(repeatGoal) : null,
      streakCount: initialTask?.streakCount || 0,
      progress: (progress === null || progress === "") ? null : Number(progress),
      audioData: audioData || null,
      audioDuration: audioData ? audioDuration : null,
      done: initialTask?.done || false
    });
    onClose();
  };

  const prColor = { high: "#C0392B", med: accent, low: "#6E8B5E" };
  const prLabel = { high: t.taskPrHigh, med: t.taskPrMed, low: t.taskPrLow };

  return (
    <div className="fg-sheet-backdrop" style={{position:"fixed", left:0, top:0, width:"100%", height:vh, transition:"height .18s ease", background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div ref={sheetRef} className="fg-sheet" onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:420, maxHeight:Math.max(320, vh - 24), transition:"max-height .18s ease", overflowY:"auto", WebkitOverflowScrolling:"touch", borderRadius:"20px 20px 0 0", padding:"14px 16px 18px", color:textMain}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
          <div style={{fontSize:15.5, fontWeight:800}}>{isEditing ? (lang==="bn" ? "টাস্ক এডিট করুন" : "Edit Task") : t.taskAdd}</div>
          <div style={{display:"flex", alignItems:"center", gap:6}}>
            <button onClick={()=>setFavorite(v=>!v)} title={lang==="bn" ? "ফেভারিট" : "Favorite"} style={{border:"none", background:"transparent", color: favorite ? "#D9445E" : textMuted2, cursor:"pointer", padding:2, display:"flex"}}>
              <Heart size={18} fill={favorite ? "#D9445E" : "none"}/>
            </button>
            <button onClick={onClose} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", padding:2}}><X size={18}/></button>
          </div>
        </div>

        <textarea ref={titleInputRef} value={title} onChange={e=>setTitle(e.target.value)} placeholder={t.taskTitlePlaceholder} rows={2}
          onFocus={(e)=>{ setTimeout(()=>{ try { e.target.scrollIntoView({block:"center"}); } catch(err){} }, 250); }}
          style={{width:"100%", boxSizing:"border-box", background:bg, border:"none", borderRadius:16, padding:"16px 16px", fontSize:16, color:textMain, outline:"none", fontFamily:"inherit", resize:"none", lineHeight:1.4, marginBottom:12}}/>

        <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:16}}>
          <div style={{flex:1, minWidth:0, display:"flex", alignItems:"center", gap:6, background:bg, border:"none", borderRadius:12, padding:"10px 12px"}}>
            <CalendarDays size={14} color={textMuted2} style={{flexShrink:0}}/>
            <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}
              style={{flex:1, minWidth:0, width:"100%", border:"none", background:"transparent", fontSize:13.5, color:textMain, outline:"none", fontFamily:"inherit"}}/>
          </div>

          {/* রিমাইন্ডার — ডেট ফিল্ডের ঠিক পাশে, "More options" খোলার দরকার নেই। ডেট সিলেক্ট না থাকলে নিষ্ক্রিয়/ঘোলা দেখাবে। */}
          <div title={!dueDate ? (lang==="bn" ? "আগে তারিখ সিলেক্ট করুন" : "Select a date first") : undefined}
            style={{flex:1, minWidth:0, display:"flex", alignItems:"center", gap:6, background:bg, border:"none", borderRadius:12, padding:"10px 12px", opacity: dueDate ? 1 : 0.55}}>
            <Bell size={14} color={textMuted2} style={{flexShrink:0}}/>
            <input type="time" value={reminderTime} disabled={!dueDate} onChange={e=>setReminderTime(e.target.value)}
              style={{flex:1, minWidth:0, width:"100%", border:"none", background:"transparent", fontSize:13.5, color:textMain, outline:"none", fontFamily:"inherit"}}/>
          </div>

          {(dueDate || reminderTime) && (
            <button onClick={()=>{setDueDate(""); setReminderTime("");}} style={{border:"none", background:bg, color:textMuted2, cursor:"pointer", borderRadius:9, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
              <X size={12}/>
            </button>
          )}
        </div>

        <button onClick={submit} disabled={!isEditing && !title.trim()} style={{width:"100%", padding:"14px 0", borderRadius:14, border:"none", background:accent, color:"#fff", fontWeight:700, fontSize:14.5, cursor: (isEditing || title.trim()) ? "pointer" : "not-allowed", opacity: (isEditing || title.trim()) ? 1 : 0.45, marginBottom:14}}>
          {isEditing ? (lang==="bn" ? "সেভ করুন" : "Save Changes") : t.taskAddBtn}
        </button>

        <button onClick={()=>setShowMore(v=>!v)} style={{display:"flex", alignItems:"center", justifyContent:"center", gap:5, width:"100%", border:"none", background:"transparent", color:textMuted2, cursor:"pointer", padding:"2px 0", fontSize:12, fontWeight:800, marginBottom: showMore ? 10 : 0}}>
          {showMore ? (lang==="bn" ? "কম দেখাও" : "Fewer options") : (lang==="bn" ? "আরও অপশন" : "More options")}
          <ChevronDown size={13} style={{transform: showMore ? "rotate(180deg)" : "none", transition:"transform .15s ease"}}/>
        </button>

        {showMore && (
          <>
            <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.taskPriority}</div>
            <div style={{display:"flex", gap:6, marginBottom:12}}>
              {["high","med","low"].map(p => (
                <button key={p} onClick={()=>setPriority(p)} style={{
                  flex:1, padding:"6px 0", borderRadius:10, cursor:"pointer",
                  border:`1.5px solid ${priority===p ? prColor[p] : cardBorder}`,
                  background: priority===p ? `${prColor[p]}14` : "transparent",
                  color: priority===p ? prColor[p] : textMuted2, fontWeight:700, fontSize:12.5,
                }}>
                  {prLabel[p]}
                </button>
              ))}
            </div>

            <div style={{display:"flex", alignItems:"center", gap:5, marginBottom:6}}>
              <Repeat size={11} color={textMuted2}/>
              <div style={{fontSize:11, fontWeight:700, color:textMuted2}}>{t.taskRepeat}</div>
            </div>
            <div style={{display:"flex", gap:6, marginBottom:12, overflowX:"auto"}}>
              {[["none", t.taskRepeatNone], ["daily", t.taskRepeatDaily], ["weekly", t.taskRepeatWeekly], ["monthly", t.taskRepeatMonthly]].map(([r,label]) => (
                <button key={r} onClick={()=>setRepeat(r)} style={{
                  flex:1, padding:"6px 4px", borderRadius:10, cursor:"pointer", flexShrink:0, whiteSpace:"nowrap",
                  border:`1.5px solid ${repeat===r ? accent : cardBorder}`,
                  background: repeat===r ? "rgba(217,119,87,0.08)" : "transparent",
                  color: repeat===r ? accent : textMuted2, fontWeight:700, fontSize:12,
                }}>
                  {label}
                </button>
              ))}
            </div>

            {repeat !== "none" && (
              <>
                <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>
                  {lang==="bn" ? "স্ট্রিক গোল (ঐচ্ছিক, যেমন সপ্তাহে ৭ বার)" : "Streak goal (optional, e.g. 7 per cycle)"}
                </div>
                <input type="number" min="1" value={repeatGoal} onChange={e=>setRepeatGoal(e.target.value)}
                  placeholder={lang==="bn" ? "যেমনঃ 7" : "e.g. 7"}
                  style={{width:"100%", boxSizing:"border-box", background:bg, border:`1px solid ${cardBorder}`, borderRadius:10, padding:"8px 10px", fontSize:13, color:textMain, outline:"none", fontFamily:"inherit", marginBottom:12}}/>
              </>
            )}

            <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{lang==="bn" ? "নোট (ঐচ্ছিক)" : "Note (optional)"}</div>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={lang==="bn" ? "কোনো নোট লিখুন..." : "Add a note..."}
              style={{width:"100%", boxSizing:"border-box", minHeight:46, background:bg, border:`1px solid ${cardBorder}`, borderRadius:10, padding:"7px 10px", fontSize:13, color:textMain, outline:"none", fontFamily:"inherit", resize:"none", marginBottom:12}}/>

            <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{lang==="bn" ? "ভয়েস নোট (ঐচ্ছিক)" : "Voice note (optional)"}</div>
            <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:12}}>
              {audioData ? (
                <>
                  <audio controls src={audioData} style={{flex:1, minWidth:0, height:34}}/>
                  <button onClick={deleteRecording} title={lang==="bn"?"মুছে ফেলুন":"Delete"} style={{border:"none", background:bg, color:"#C0392B", width:34, height:34, borderRadius:9, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                    <Trash2 size={14}/>
                  </button>
                </>
              ) : isRecording ? (
                <button onClick={stopRecording} style={{display:"flex", alignItems:"center", gap:8, border:"none", background:"#C0392B", color:"#fff", borderRadius:10, padding:"8px 14px", fontSize:13, fontWeight:700, cursor:"pointer"}}>
                  <Square size={13} fill="#fff"/> {lang==="bn" ? "রেকর্ডিং থামান" : "Stop recording"} · {fmtDuration(recordElapsed)}
                </button>
              ) : (
                <button onClick={startRecording} style={{display:"flex", alignItems:"center", gap:8, border:`1.5px solid ${cardBorder}`, background:"transparent", color:textMuted2, borderRadius:10, padding:"8px 14px", fontSize:13, fontWeight:700, cursor:"pointer"}}>
                  <Mic size={14}/> {lang==="bn" ? "রেকর্ড করুন" : "Record a note"}
                </button>
              )}
            </div>

            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6}}>
              <div style={{fontSize:11, fontWeight:700, color:textMuted2}}>{lang==="bn" ? "প্রোগ্রেস রিং (ঐচ্ছিক)" : "Progress ring (optional)"}</div>
              {progress !== null && (
                <button onClick={()=>setProgress(null)} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", fontSize:11, fontWeight:700}}>{lang==="bn"?"মুছুন":"Clear"}</button>
              )}
            </div>
            <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:12}}>
              <input type="range" min="0" max="100" value={progress ?? 0} onChange={e=>setProgress(Number(e.target.value))}
                style={{flex:1, accentColor:accent}}/>
              <span style={{fontSize:12.5, fontWeight:700, color:textMain, width:36, textAlign:"right"}}>{progress ?? 0}%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CalendarModal({ t, lang, nf, monthName, weekdayShort, calMonth, setCalMonth, entries, onClose, onSelectDay, examDateKeys, cardBg, cardBorder, textMain, textMuted2, accent, dark, today }) {
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const firstDay = new Date(y, m, 1);
  const startOffset = weekStartOffset(firstDay.getDay());
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const cells = [];
  for (let i=0;i<startOffset;i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(y,m,d));

  const shortDays = weekdayShortLabels(lang);

  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:420, borderRadius:14, padding:20, color:textMain}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6}}>
          <div style={{fontSize:16.5, fontWeight:800}}>{t.monthOverview}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"10px 0 14px"}}>
          <button onClick={()=>setCalMonth(new Date(y,m-1,1))} style={{border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:10, width:32,height:32, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer", color:textMain}}><ChevronLeft size={16}/></button>
          <div style={{fontWeight:700, fontSize:16.5}}>{monthName(m)} <Num>{nf(y)}</Num></div>
          <button onClick={()=>setCalMonth(new Date(y,m+1,1))} style={{border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:10, width:32,height:32, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer", color:textMain}}><ChevronRight size={16}/></button>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:6}}>
          {shortDays.map((d,i)=>(<div key={i} style={{textAlign:"center", fontSize:10.5, fontWeight:700, color:textMuted2}}>{d}</div>))}
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4}}>
          {cells.map((d,i) => {
            if (!d) return <div key={i}/>;
            const dk = dateKey(d);
            const list = entries[dk] || [];
            const hasAny = list.length > 0;
            const doneAll = hasAny && list.every(x=>x.done);
            const isToday = dk === dateKey(today);
            const isExam = examDateKeys ? examDateKeys.has(dk) : false;
            const isHoliday = isHolidayKey(dk);
            const future = d > today;
            return (
              <button key={i} onClick={()=>onSelectDay(d)} disabled={future && !hasAny}
                title={isHoliday ? holidayName(dk, lang) : undefined}
                style={{position:"relative", aspectRatio:"1", border: isToday ? `1.5px solid ${accent}` : "1px solid transparent", borderRadius:10, background: dark?"#0A0A0A":"#F8F5EE", cursor:(future&&!hasAny)?"default":"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, opacity: (future&&!hasAny)?0.4:1}}>
                {isExam && <span style={{position:"absolute", top:4, right:4, width:5, height:5, borderRadius:"50%", background: dark ? "#F3F1F8" : "#1A1814"}}/>}
                {isHoliday && <span style={{position:"absolute", top:4, left:4, width:5, height:5, borderRadius:"50%", background:"#C0392B"}}/>}
                <span style={{fontSize:12.5, fontWeight:600, color:textMain}}><Num>{nf(d.getDate())}</Num></span>
                <span style={{width:5,height:5,borderRadius:"50%", background: !hasAny ? "transparent" : (doneAll ? "#6E8B5E" : (dark ? "#F3F1F8" : "#1A1814"))}}/>
              </button>
            );
          })}
        </div>
        {/* Calendar legend */}
        <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:12, marginTop:14, flexWrap:"wrap"}}>
          <span style={{display:"flex", alignItems:"center", gap:4, fontSize:10.5, color:textMuted2, fontWeight:600}}>
            <span style={{width:6,height:6,borderRadius:"50%", background:"#6E8B5E"}}/>{t.calendarLegendCompleted}
          </span>
          <span style={{display:"flex", alignItems:"center", gap:4, fontSize:10.5, color:textMuted2, fontWeight:600}}>
            <span style={{width:6,height:6,borderRadius:"50%", background: dark ? "#F3F1F8" : "#1A1814"}}/>{t.calendarLegendExam}
          </span>
          <span style={{display:"flex", alignItems:"center", gap:4, fontSize:10.5, color:textMuted2, fontWeight:600}}>
            <span style={{width:6,height:6,borderRadius:"50%", background:(dark ? "#F3F1F8" : "#1A1814")}}/>{t.calendarLegendPlanned}
          </span>
          <span style={{display:"flex", alignItems:"center", gap:4, fontSize:10.5, color:textMuted2, fontWeight:600}}>
            <span style={{width:6,height:6,borderRadius:"50%", background:"#C0392B"}}/>{t.calendarLegendHoliday}
          </span>
        </div>
      </div>
    </div>
  );
}

function DayDetailModal({ t, lang, nf, weekdayName, monthName, day, entries, allSubjects, tasks, onClose, cardBg, cardBorder, textMain, textMuted2, accent, dark }) {
  const dk = dateKey(day);
  const doneCount = entries.filter(e => e.done).length;
  const focusedMin = entries.filter(e => e.done).reduce((s,e) => s + (e.duration || 0), 0);
  const fh = Math.floor(focusedMin/60), fm = focusedMin%60;
  const tasksRemaining = (tasks || []).filter(x => x.dueDate === dk && !x.done).length;
  const hasAnyStat = doneCount > 0 || focusedMin > 0 || tasksRemaining > 0;
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"14px 14px 0 0", padding:"20px 20px 28px", color:textMain, maxHeight:"75vh", overflowY:"auto"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4}}>
          <div>
            <div style={{fontSize:11.5, fontWeight:700, color:textMuted2}}>{weekdayName(day)}</div>
            <div style={{fontSize:20.5, fontWeight:800, letterSpacing:-0.3}}><Num>{nf(day.getDate())}</Num> {monthName(day.getMonth())}, <Num>{nf(day.getFullYear())}</Num></div>
          </div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>
        {isHolidayKey(dk) && (
          <div style={{marginTop:12, display:"flex", alignItems:"center", gap:8, border:`1px solid ${cardBorder}`, borderRadius:12, padding:"9px 12px"}}>
            <span style={{width:8,height:8,borderRadius:"50%", background:"#C0392B", flexShrink:0}}/>
            <span style={{fontSize:13.5, fontWeight:700, color:textMain}}>{holidayName(dk, lang)}</span>
          </div>
        )}
        {hasAnyStat && (
          <div style={{display:"flex", flexDirection:"column", gap:8, marginTop:14, background: dark?"rgba(237,236,242,0.08)":"rgba(26,24,20,0.05)", border:`1px solid ${cardBorder}`, borderRadius:14, padding:"12px 14px"}}>
            {doneCount > 0 && (
              <div style={{display:"flex", alignItems:"center", gap:8, fontSize:13.5, fontWeight:600, color:"#6E8B5E"}}>
                <Check size={14} strokeWidth={3}/><span><Num>{nf(doneCount)}</Num> {t.topicsCompletedLabel}</span>
              </div>
            )}
            {focusedMin > 0 && (
              <div style={{display:"flex", alignItems:"center", gap:8, fontSize:13.5, fontWeight:600, color:(dark ? "#F3F1F8" : "#1A1814")}}>
                <Clock size={14}/><span>{fh > 0 && <><Num>{nf(fh)}</Num>h </>}<Num>{nf(fm)}</Num>m {t.dayFocusedLabel}</span>
              </div>
            )}
            {tasksRemaining > 0 && (
              <div style={{display:"flex", alignItems:"center", gap:8, fontSize:13.5, fontWeight:600, color:textMuted2}}>
                <span style={{width:14, display:"flex", justifyContent:"center"}}>○</span><span><Num>{nf(tasksRemaining)}</Num> {t.tasksRemainingLabel}</span>
              </div>
            )}
          </div>
        )}
        <div style={{marginTop:16}}>
          <TopicsList items={entries} allSubjects={allSubjects} t={t} nf={nf} lang={lang}
            cardBg={cardBg} cardBorder={cardBorder} textMuted2={textMuted2} textMain={textMain} accent={accent}
            emptyText={t.noData}/>
        </div>
      </div>
    </div>
  );
}
