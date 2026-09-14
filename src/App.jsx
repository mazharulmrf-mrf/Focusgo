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
          <span style={{ position: "absolute", top: 1, right: 2, width: 8, height: 8, borderRadius: "50%", background: accent, border: `1.5px solid ${cardBg}` }} />
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
    { key: "appearance", Icon: Palette, title: isBn ? "অ্যাপিয়ারেন্স" : "Appearance", subtitle: isBn ? "থিম, রং, লেখার আকার ও সপ্তাহ শুরু" : "Theme, text size and week start" },
    { key: "timer", Icon: Hourglass, title: isBn ? "ফোকাস টাইমার" : "Focus Timer", subtitle: isBn ? "ফোকাস ও বিরতির সময়" : "Focus and break length" },
    { key: "reminders", Icon: CalendarDays, title: isBn ? "স্টাডি রিমাইন্ডার" : "Study Reminders", subtitle: isBn ? "স্টাডির নোটিফিকেশন" : "Study notifications" },
    { key: "salah", Icon: MosqueIcon, title: isBn ? "সালাতের সময়" : "Salah Timer", subtitle: isBn ? "চালু/বন্ধ" : "On or off" },
    { key: "alerts", Icon: Bell, title: isBn ? "অ্যালার্ট" : "Alerts", subtitle: isBn ? "নোটিফিকেশন ও হ্যাপটিক" : "Notifications and haptics" },
    { key: "backup", Icon: Cloud, title: isBn ? "ব্যাকআপ" : "Backup", subtitle: isBn ? "এক্সপোর্ট/ইমপোর্ট ডেটা" : "Export or import your data" },
    { key: "supportInfo", Icon: HelpCircle, title: isBn ? "সাহায্য ও তথ্য" : "Help & Info", subtitle: isBn ? "ফিডব্যাক ও ভার্সন তথ্য" : "Feedback and version info" },
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
  const [openCard, setOpenCard] = useState(initialOpenCard || null); // null | "appearance" | "timer" | "reminders" | "alerts" | "backup" | "supportInfo"
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

    // ---- রঙিন আইকন ব্যাজ — প্রতিটা প্রেফারেন্স ক্যাটাগরির নিজস্ব হালকা টিন্ট রঙ, যাতে লিস্টটা স্ক্যান করা সহজ হয়;
    // Backup/Help-এর মতো নিরপেক্ষ আইটেমের জন্য এখনো একটা মিউটেড neutral টোন ফলব্যাক হিসেবে থাকছে ----
    const neutralIconBg = dark ? "#242229" : "#F0EEF5";
    const neutralIconColor = dark ? "#B0ABC2" : "#6E6B7A";
    const tint = (hex) => (dark ? `${hex}33` : `${hex}1F`);
    const iconColors = {
      appearance: { iconBg: tint("#7C5CFC"), iconColor: dark ? "#A78BFA" : "#7C5CFC" },
      timer:      { iconBg: tint("#4C8FA6"), iconColor: dark ? "#7FB4C7" : "#4C8FA6" },
      reminders:  { iconBg: tint("#6E8B5E"), iconColor: dark ? "#93B682" : "#6E8B5E" },
      salah:      { iconBg: tint("#C08A2E"), iconColor: dark ? "#E0AE5C" : "#C08A2E" },
      alerts:     { iconBg: tint("#D97757"), iconColor: dark ? "#E59A80" : "#D97757" },
    };

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
                {!isGuest && user && (
                  <div style={{display:"flex", alignItems:"center", gap:5, marginTop:3}}>
                    <span style={{width:6, height:6, borderRadius:"50%", background:"#6E8B5E", flexShrink:0}}/>
                    <span style={{fontSize:11, color:textMuted2, fontWeight:600}}>{isBn ? "সব ডিভাইসে সিঙ্ক আছে" : "Synced across devices"}</span>
                  </div>
                )}
              </div>
            </button>
            <ChevronRight size={17} color={textMuted2} style={{flexShrink:0}}/>
          </div>
        </div>

        {/* ---- Preferences — একটাই কার্ডে সব প্রেফারেন্স, প্রতিটা রো accordion হিসেবে খোলে ---- */}
        <div style={{...sectionHeadingStyle, marginTop:0}}>{isBn ? "পছন্দসমূহ" : "Preferences"}</div>
        <div style={groupCardStyle}>
          <SettingsRow {...rowCtx} {...iconColors.appearance} Icon={Palette} title={isBn ? "অ্যাপিয়ারেন্স" : "Appearance"} borderTop={false}
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
            <div style={{marginTop:14, paddingTop:14, borderTop:`1px dashed ${cardBorder}`}}>
              <div style={{display:"flex", alignItems:"center", gap:10, fontSize:13.5, fontWeight:700, color:textMain, marginBottom:10}}><CalendarRange size={15} color={textMuted2}/>{t.weekStartsOn}</div>
              <SettingsDropdown
                value={weekStartDay}
                options={[6,0,1,2,3,4,5].map(d => ({ value: d, label: weekStartDayLabel(d) }))}
                onChange={(v)=>{ vibrate(); setWeekStartDay(v); }}
                dark={dark} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}/>
            </div>
          </SettingsRow>

          <SettingsRow {...rowCtx} {...iconColors.timer} Icon={Hourglass} title={isBn ? "ফোকাস টাইমার" : "Focus Timer"} subtitle={`${focusMinutes} / ${breakMinutes} ${t.minutes}`} expandKey="timer">
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

          <SettingsRow {...rowCtx} {...iconColors.reminders} Icon={CalendarDays} title={isBn ? "স্টাডি রিমাইন্ডার" : "Study Reminders"}
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

          <SettingsRow {...rowCtx} {...iconColors.salah} Icon={MosqueIcon} title={isBn ? "সালাতের সময়" : "Salah Timer"}
            subtitle={salahFeatureEnabled ? (isBn ? "চালু আছে" : "On") : (isBn ? "বন্ধ" : "Off")}
            right={<Toggle on={salahFeatureEnabled} onClick={()=>{vibrate(); setSalahFeatureEnabled(v=>!v);}}/>}
            onClick={()=>{vibrate(); setSalahFeatureEnabled(v=>!v);}}/>

          <SettingsRow {...rowCtx} {...iconColors.alerts} Icon={Bell} title={isBn ? "অ্যালার্ট" : "Alerts"}
            subtitle={isBn ? "নোটিফিকেশন ও হ্যাপটিক" : "Notifications and haptics"}
            expandKey="alerts">
            <div style={{display:"flex", flexDirection:"column", gap:14}}>
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                <span style={{fontSize:13.5, fontWeight:700, color:textMain}}>{t.notifications}</span>
                <Toggle on={notificationsEnabled} onClick={()=>{vibrate(); toggleNotifications();}}/>
              </div>
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                <span style={{fontSize:13.5, fontWeight:700, color:textMain}}>{t.hapticFeedback}</span>
                <Toggle on={hapticsEnabled} onClick={toggleHaptics}/>
              </div>
            </div>
          </SettingsRow>
        </div>

        {/* ---- Data & Support — আগে "Data & Sync" আর "More" আলাদা ছিল, এখন একটাই গ্রুপে; Backup &
             Sync স্ট্যাটাস রো সরিয়ে প্রোফাইল কার্ডে নেওয়া হয়েছে, Export/Import একটা "ব্যাকআপ" accordion-এ,
             আর Help/About একটা "সাহায্য ও তথ্য" accordion-এ মার্জ করা হলো ---- */}
        <div style={sectionHeadingStyle}>{isBn ? "ডেটা ও সাপোর্ট" : "Data & Support"}</div>
        <div style={groupCardStyle}>
          <SettingsRow {...rowCtx} Icon={Cloud} borderTop={false}
            title={isBn ? "ব্যাকআপ" : "Backup"}
            subtitle={isBn ? "এক্সপোর্ট/ইমপোর্ট ডেটা" : "Export or import your data"}
            expandKey="backup">
            <div style={{display:"flex", flexDirection:"column", gap:10}}>
              <button onClick={exportData} style={{display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:12, padding:"11px 14px", cursor:"pointer", textAlign:"left"}}>
                <span style={{fontSize:13.5, fontWeight:700, color:textMain}}>{isBn ? "এক্সপোর্ট ডেটা" : "Export data"}</span>
                <span style={{fontSize:11.5, fontWeight:600, color: exportDone ? "#6E8B5E" : textMuted2}}>{exportDone ? (isBn ? "ডাউনলোড হয়েছে ✓" : "Downloaded ✓") : (isBn ? "ডাউনলোড" : "Download")}</span>
              </button>
              <button onClick={triggerImport} style={{display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:12, padding:"11px 14px", cursor:"pointer", textAlign:"left"}}>
                <span style={{fontSize:13.5, fontWeight:700, color:textMain}}>{isBn ? "ইমপোর্ট ডেটা" : "Import data"}</span>
                <span style={{fontSize:11.5, fontWeight:600, color: importState === "done" ? "#6E8B5E" : importState === "error" ? "#C0553F" : textMuted2}}>
                  {importState === "done" ? (isBn ? "রিস্টোর হয়েছে ✓" : "Restored ✓") : importState === "error" ? (isBn ? "ফাইল সঠিক নয়" : "Invalid file") : (isBn ? "ফাইল বাছুন" : "Choose file")}
                </span>
              </button>
            </div>
          </SettingsRow>
          <SettingsRow {...rowCtx} Icon={HelpCircle}
            title={isBn ? "সাহায্য ও তথ্য" : "Help & Info"}
            subtitle={isBn ? "ফিডব্যাক ও ভার্সন তথ্য" : "Feedback and version info"}
            expandKey="supportInfo">
            <div style={{display:"flex", flexDirection:"column", gap:10}}>
              <a href={`mailto:mazharul.mrf@gmail.com?subject=${encodeURIComponent(t.feedbackSubject)}`} onClick={()=>vibrate()} style={{display:"flex", alignItems:"center", justifyContent:"space-between", textDecoration:"none", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"11px 14px"}}>
                <span style={{fontSize:13.5, fontWeight:700, color:textMain}}>{isBn ? "ফিডব্যাক পাঠান" : "Send feedback"}</span>
                <Mail size={15} color={textMuted2}/>
              </a>
              <button onClick={()=>{vibrate(); setShowAbout(true);}} style={{display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:12, padding:"11px 14px", cursor:"pointer", textAlign:"left"}}>
                <span style={{fontSize:13.5, fontWeight:700, color:textMain}}>{isBn ? "FocusGo সম্পর্কে" : "About FocusGo"}</span>
                <span style={{fontSize:11.5, fontWeight:600, color:textMuted2}}>{`${t.version} 1.0.0`}</span>
              </button>
            </div>
          </SettingsRow>
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

        {/* Avatar — এখন সালাত টাইমারের "UP NEXT" কার্ডের মতো সলিড accent ব্যানারে, সাদা বর্ডার-রিং সহ */}
        <div style={{borderRadius:18, background:accent, padding:"16px 14px 18px", marginBottom:18, display:"flex", alignItems:"center", gap:14}}>
          <div style={{position:"relative", flexShrink:0}}>
            <div style={{padding:3, background:"rgba(255,255,255,0.92)", borderRadius:"50%", display:"flex"}}>
              <AvatarCircle size={56}/>
            </div>
            <button onClick={handlePickPhoto} disabled={photoBusy} title={L.changePhoto} style={{
              position:"absolute", right:-2, bottom:-2, width:22, height:22, borderRadius:"50%",
              border:`2px solid ${accent}`, background:"#fff", color:accent, display:"flex", alignItems:"center", justifyContent:"center",
              cursor: photoBusy ? "default" : "pointer", opacity: photoBusy ? 0.6 : 1,
            }}>
              {photoBusy ? <Loader2 size={11} style={{animation:"spin 0.8s linear infinite"}}/> : <Pencil size={11}/>}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{display:"none"}}/>
          </div>
          <div style={{minWidth:0, flex:1}}>
            <div style={{fontSize:16.5, fontWeight:800, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{user.displayName || (user.email ? user.email.split("@")[0] : "Account")}</div>
            {user.email && <div style={{fontSize:12.5, color:"rgba(255,255,255,0.82)", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginTop:2}}>{user.email}</div>}
          </div>
        </div>
        {photoError && <div style={{fontSize:12.5, color:"#C0553F", fontWeight:600, marginBottom:10}}>{photoError}</div>}

        {/* মেনু লিস্ট — প্রতিটা আইটেমের নিজস্ব রঙিন আইকন ব্যাজ (Settings পেজের সাথে মিলিয়ে); Social Media
             Links রো ইউজারের অনুরোধে সম্পূর্ণ বাদ দেওয়া হলো */}
        <div style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"0 12px", marginBottom:18}}>
          <div onClick={()=>openSection("personal")} style={{...rowStyle, borderBottom:`1px solid ${cardBorder}`}}>
            <div style={menuLabelStyle}><span style={{...iconWrapStyle, background: dark?"#7C5CFC33":"#7C5CFC1F", border:"none", color: dark?"#A78BFA":"#7C5CFC"}}><User size={15}/></span>{L.personalInfo}</div>
            {isBn ? <ChevronLeft size={16} color={textMuted2}/> : <ChevronRight size={16} color={textMuted2}/>}
          </div>
          <div onClick={()=>openSection("email")} style={{...rowStyle, borderBottom:`1px solid ${cardBorder}`}}>
            <div style={menuLabelStyle}><span style={{...iconWrapStyle, background: dark?"#4C8FA633":"#4C8FA61F", border:"none", color: dark?"#7FB4C7":"#4C8FA6"}}><AtSign size={15}/></span>{L.changeEmail}</div>
            {isBn ? <ChevronLeft size={16} color={textMuted2}/> : <ChevronRight size={16} color={textMuted2}/>}
          </div>
          <div onClick={()=>openSection("password")} style={{...rowStyle, borderBottom:"none"}}>
            <div style={menuLabelStyle}><span style={{...iconWrapStyle, background: dark?"#C08A2E33":"#C08A2E1F", border:"none", color: dark?"#E0AE5C":"#C08A2E"}}><KeyRound size={15}/></span>{L.changePassword}</div>
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
const LOGO_FULL = "data:image/png;base64,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DMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDGNW/H8zpW4dF2Tn2AAAAABJRU5ErkJggg==";
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
    if (key === "profile") { setShowProfile(true); return; }
    const cardMap = { appearance: "appearance", timer: "timer", reminders: "reminders", salah: null, alerts: "alerts", backup: "backup", supportInfo: "supportInfo" };
    const actionMap = {};
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
              // আগের বোল্ড ভায়োলেট gradient-টা নিচের "Today's Focus" কার্ডের সাথে একদম একরকম দেখাচ্ছিল বলে
              // ফিরিয়ে আনা হলো refined light card লুক — সময়ভিত্তিক subtle tint + icon, বড় ও bold নাম
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
                    padding:"18px 20px 17px", marginBottom:0, position:"relative", borderRadius:18,
                    background: dark
                      ? `linear-gradient(135deg, ${greetTheme.grad}, transparent 70%)`
                      : "#FFFFFF",
                  }} ref={salahMenuRef}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:10}}>
                      <div style={{minWidth:0, flex:1}}>
                        <div
                          onClick={() => { vibrate(); setShowWeatherModal(true); if (!salahCoords) requestSalahLocation(); }}
                          style={{fontSize:13, fontWeight:600, color:accent, letterSpacing:0.3, marginBottom:5, display:"flex", alignItems:"center", gap:7, cursor:"pointer"}}
                          title={lang === "bn" ? "আবহাওয়া দেখুন" : "View weather"}
                        >
                          <GreetIcon size={14} color={greetTheme.iconColor} strokeWidth={2.2}/>
                          {lang === "bn" ? greetingBn : greetingEn}
                          {weatherData && weatherData.temp != null && (
                            <span
                              onClick={(e) => { e.stopPropagation(); vibrate(); setShowWeatherModal(true); if (!salahCoords) requestSalahLocation(); }}
                              style={{display:"inline-flex", alignItems:"center", fontSize:13, fontWeight:600, color:accent, cursor:"pointer"}}
                              title={lang === "bn" ? "আবহাওয়া দেখুন" : "View weather"}
                            >
                              · <Num>{nf(weatherData.temp)}</Num>°C
                            </span>
                          )}
                        </div>
                        <div style={{fontSize:27,fontWeight:700,letterSpacing:-0.6,color:"var(--text)", fontFamily:"'Inter Tight','Inter','Helvetica Neue',sans-serif", display:"inline-block"}}>
                          {firstName}
                        </div>
                      </div>
                      <div style={{display:"flex", alignItems:"center", gap:10, flexShrink:0}}>
                        {/* মিনিমাল ডেট ব্যাজ — উপরে ছোট করে দিনের নাম + মাস, নিচে accent রঙের সার্কেলের মধ্যে আজকের তারিখ। ট্যাপ করলে ফুল ক্যালেন্ডার খোলে, সময় আর দেখানো হয় না — সবসময় সবচেয়ে ডানে থাকবে */}
                        <button onClick={()=>{vibrate(); setShowCalendar(true); setCalMonth(new Date());}} style={{display:"flex", flexDirection:"column", alignItems:"center", gap:5, border:"none", background:"transparent", padding:0, cursor:"pointer", position:"relative"}}>
                          <span style={{fontSize:10, fontWeight:600, color:"var(--muted)", letterSpacing:0.2, whiteSpace:"nowrap"}}>
                            {weekdayShort(today)}, {monthShort(today.getMonth())}
                          </span>
                          <span style={{width:36, height:36, borderRadius:"50%", background:accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#FFFFFF"}}>
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

        {/* Study Plan header — Stats এখন Study-র sub-section না, তাই এই হেডার শুধু Plan-এ দেখানো হয়।
            আগে এখানে নিচে একটা "This day's plan" গ্রেডিয়েন্ট hero কার্ড ছিল — সেটা বাদ দিয়ে ওই একই
            violet gradient লুকটা এখন নিচের Focus Timer কার্ডে ব্যবহার করা হচ্ছে। */}
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

        {/* Focus Timer preview row — এখন "This day's plan"-এর সেই violet gradient hero লুকটাই এই কার্ডে,
            আইকন + টাইটেল + ডিউরেশন পিলগুলো সাদা/ট্রান্সলুসেন্ট টোনে যাতে গ্রেডিয়েন্টের উপর পড়া যায়।
            ক্লিক করলে ফুল-স্ক্রিন Focus Timer পেজ (FocusTimerPage) খোলে। Study Plan-এর হেডারের ঠিক নিচে
            দেখানো হয় (Stats সাব-সেকশনে না, Today ট্যাবেও না)। */}
        {tab === "study" && studySection === "plan" && (
        <div className="fg-card fg-tab-panel" style={{
          marginTop:14, padding:"16px 16px 14px", position:"relative", overflow:"hidden", borderRadius:20,
          background:`linear-gradient(135deg, ${accent} 0%, ${shadeColor(accent, -14)} 100%)`,
          boxShadow:`0 12px 24px ${accent}38`,
        }}>
          <svg style={{position:"absolute", right:-8, bottom:-8, width:140, height:56, opacity:0.5, pointerEvents:"none"}} viewBox="0 0 140 56" fill="none">
            <path d="M0 28 C 22 6, 40 50, 68 28 S 116 6, 140 28" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none"/>
          </svg>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, position:"relative"}}>
            <div onClick={()=>{ vibrate(); setShowFocusTimerPage(true); }} style={{display:"flex", alignItems:"center", gap:12, minWidth:0, cursor:"pointer"}}>
              <div style={{position:"relative", width:42, height:42, flexShrink:0}}>
                <div style={{width:42, height:42, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff"}}>
                  <Hourglass size={19}/>
                </div>
                {/* কর্নার ব্যাজ — বোঝাতে যে ট্যাপ করলে নতুন (ফুলস্ক্রিন) পেজ খোলে */}
                <div style={{position:"absolute", bottom:-2, right:-2, width:16, height:16, borderRadius:"50%", background:"#fff", border:`2px solid ${shadeColor(accent, -14)}`, display:"flex", alignItems:"center", justifyContent:"center"}}>
                  <ArrowUpRight size={9} color={accent} strokeWidth={3}/>
                </div>
              </div>
              <div style={{textAlign:"left", minWidth:0}}>
                <div style={{fontSize:15, fontWeight:800, color:"#fff", whiteSpace:"nowrap"}}>{t.focusTimer}</div>
                <div style={{fontSize:11.5, fontWeight:500, color:"rgba(255,255,255,0.85)", marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                  {lang==="bn" ? "মনোযোগী থাকো, কাজ শেষ করো।" : "Stay focused, get things done."}
                </div>
              </div>
            </div>
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0}}>
              <button onClick={(e)=>{ e.stopPropagation(); if (timerRunning) { toggleTimerRunning(); } else { selectTimerTopic(null); setFocusMode("timer"); setTimerRunning(true); setShowFocusTimerPage(true); playStartSound(); vibrate(); } }}
                style={{display:"flex", alignItems:"center", justifyContent:"center", background:"#fff", border:"none", borderRadius:"50%", width:44, height:44, color:accent, cursor:"pointer", flexShrink:0}}>
                {timerRunning ? <Pause size={17} fill={accent}/> : <Play size={17} fill={accent} style={{marginLeft:2}}/>}
              </button>
              <span style={{fontSize:11, fontWeight:700, color:"#fff", whiteSpace:"nowrap"}}>
                {timerRunning ? (lang==="bn" ? "চলছে" : "Running") : (lang==="bn" ? "শুরু" : "Start")}
              </span>
            </div>
          </div>
          <div style={{display:"flex", gap:7, marginTop:12, position:"relative"}}>
            {[25,30,45,60].map(m => {
              const sel = Math.round(timerTotal/60) === m;
              return (
                <button key={m} disabled={timerRunning} onClick={()=>{ vibrate(); setTimerTotal(m*60); setTimerSeconds(m*60); }}
                  style={{
                    flex:1, border:"none", fontFamily:"inherit", fontSize:12.5, fontWeight:700,
                    padding:"8px 0", borderRadius:999,
                    background: sel ? "#fff" : "rgba(255,255,255,0.18)",
                    color: sel ? accent : "rgba(255,255,255,0.85)",
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


        {/* Stats header — এখন এটা সরাসরি নিজস্ব ট্যাব, Study-র কোনো sub-section না। একটাই টাইটেল + সাবটাইটেল
            (আগে নিচে Subject Progress কার্ডের উপরেও আরেকটা "Stats" টাইটেল ছিল — সেটা ডুপ্লিকেট বলে সরানো হয়েছে) */}
        {tab === "study" && studySection === "stats" && (
          <div className="fg-tab-panel" style={{marginTop:16, marginBottom:2}}>
            <div className="fg-title" style={{fontSize:21}}>{t.statsPageTitle}</div>
            <div style={{fontSize:13.5, color:textMuted2, fontWeight:500, marginTop:2}}>{t.statsPageSubtitle}</div>
          </div>
        )}


        {/* Today's study overview card - Today tab + Study tab (shown above Study Plan/Exam) — Option 2: circular progress, premium look
            এখন accent color ব্যবহার হচ্ছে (আগে dark teal ছিল, সেই রঙ Next Exam কার্ডে সরানো হয়েছে) */}
        {((tab === "today" && studyFeatureEnabled) || (tab === "study" && studySection === "plan")) && (() => {
          if (tab === "today") {
            const doneToday = todayTopics.filter(x => x.done).length;
            const totalToday = todayTopics.length;
            const pctToday = totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0;
            const heroHeadline = totalToday === 0
              ? (lang==="bn" ? "প্রোডাক্টিভ দিনের জন্য একটা ফ্রেশ শুরু!" : "A fresh start for a productive day!")
              : (lang==="bn"
                  ? <><Num>{nf(doneToday)}</Num>/<Num>{nf(totalToday)}</Num> {t.doneCount}</>
                  : <><Num>{nf(doneToday)}</Num> of <Num>{nf(totalToday)}</Num> {t.doneCount.toLowerCase()}</>);

            return (
              <>
                {/* Hero card — accent gradient, wavy decoration, circular progress ring */}
                <div className="fg-tab-panel" style={{
                  marginTop:10, borderRadius:20, padding:"18px 20px 20px", position:"relative", overflow:"hidden",
                  background:`linear-gradient(135deg, ${accent} 0%, ${shadeColor(accent, -14)} 100%)`,
                  boxShadow:`0 14px 28px ${accent}40`,
                }}>
                  <svg style={{position:"absolute", right:-8, top:14, width:150, height:60, opacity:0.5, pointerEvents:"none"}} viewBox="0 0 150 60" fill="none">
                    <path d="M0 30 C 25 5, 45 55, 75 30 S 125 5, 150 30" stroke="rgba(255,255,255,0.65)" strokeWidth="2" fill="none"/>
                  </svg>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, position:"relative"}}>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.85)"}}>{lang==="bn" ? "আজকের ফোকাস" : "Today's focus"}</div>
                      <div style={{fontSize:18, fontWeight:800, color:"#fff", letterSpacing:-0.3, marginTop:8, lineHeight:1.35, maxWidth:210}}>
                        {heroHeadline}
                      </div>
                    </div>
                    <div style={{width:52, height:52, borderRadius:"50%", flexShrink:0, background:`conic-gradient(#fff 0% ${pctToday}%, rgba(255,255,255,0.28) ${pctToday}% 100%)`, display:"flex", alignItems:"center", justifyContent:"center"}}>
                      <div style={{width:40, height:40, borderRadius:"50%", background:shadeColor(accent, -24), display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <span style={{color:"#fff", fontWeight:800, fontSize:12}}><Num>{nf(pctToday)}</Num>%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two colorful stat cards — today's progress + streak */}
                <div style={{display:"flex", gap:10, marginTop:10}}>
                  <div style={{flex:1, borderRadius:18, padding:"14px 14px 12px", minHeight:88, background:"#B6F27A", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                    <div style={{fontSize:12, fontWeight:600, color:"#171522", opacity:0.75}}>{lang==="bn" ? "আজকের অগ্রগতি" : "Today's progress"}</div>
                    <div>
                      <div style={{fontFamily:"'Inter Tight', sans-serif", fontWeight:800, fontSize:18, color:"#171522", letterSpacing:-0.3, marginTop:6}}>
                        {heroHeadline}
                      </div>
                      <div style={{fontSize:11, color:"#171522", opacity:0.7, marginTop:2}}>
                        {totalToday === 0 ? (lang==="bn" ? "চলো শুরু করি!" : "Let's get started!") : (lang==="bn" ? "চালিয়ে যাও!" : "Keep it up!")}
                      </div>
                    </div>
                  </div>
                  <div style={{flex:1, borderRadius:18, padding:"14px 14px 12px", minHeight:88, background:"#F5A85A", display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                    <div style={{fontSize:12, fontWeight:600, color:"#171522", opacity:0.75}}>{t.streakLabel}</div>
                    <div>
                      <div style={{fontFamily:"'Inter Tight', sans-serif", fontWeight:800, fontSize:18, color:"#171522", letterSpacing:-0.3, marginTop:6}}>
                        <Num>{nf(studyOverview.streak)}</Num> {lang==="bn" ? "দিন" : "days"}
                      </div>
                      <div style={{fontSize:11, color:"#171522", opacity:0.7, marginTop:2}}>
                        {lang==="bn" ? "স্ট্রিক ধরে রাখো!" : "Keep your streak alive!"}
                      </div>
                    </div>
                  </div>
                </div>
              </>
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
                      background: sel ? "#171522" : (dark ? cardBg : "#FFFFFF"),
                      color: sel ? "#FFFFFF" : textMuted2,
                      boxShadow: sel ? "0 4px 12px rgba(23,21,34,0.35)" : "none",
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
                              style={{display:"flex", alignItems:"center", gap:11,
                                background: overdue ? (dark ? "#2A1614" : "#FFF6F4") : (dark ? cardBg : "#FFFFFF"),
                                border:`1px solid ${overdue ? "#E2604533" : cardBorder}`, borderRadius:16, padding:"12px 13px", cursor:"pointer"}}>
                              <button onClick={(e)=>{e.stopPropagation(); vibrate(); toggleTask(x.id);}}
                                style={{width:22, height:22, borderRadius:"50%", border:`2px solid ${x.done ? "#6E8B5E" : prColor}`, background: x.done ? "#6E8B5E" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer", padding:0}}>
                                {x.done && <Check size={13} color="#fff" strokeWidth={3}/>}
                              </button>
                              <div style={{flex:1, minWidth:0}}>
                                <div style={{fontSize:14, fontWeight:600, color: x.done ? textMuted2 : textMain, textDecoration: x.done ? "line-through" : "none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                                  {x.title}
                                </div>
                                <div style={{display:"flex", alignItems:"center", gap:6, marginTop:4}}>
                                  {x.done ? (
                                    <span style={{fontSize:10.5, fontWeight:700, color:"#3F8A3B", background: dark?"#1E3A1C":"#E3F5DC", padding:"2px 8px", borderRadius:999}}>
                                      {lang==="bn" ? "সম্পন্ন" : "Done"}
                                    </span>
                                  ) : overdue ? (
                                    <span style={{fontSize:10.5, fontWeight:700, color:"#E25B45", background: dark?"#3A1E1A":"#FDE7E2", padding:"2px 8px", borderRadius:999}}>
                                      {lang==="bn" ? "মেয়াদ পার" : "Overdue"}
                                    </span>
                                  ) : x.dueDate && (
                                    <span style={{fontSize:11, fontWeight:600, color:textMuted2}}>{x.dueDate}</span>
                                  )}
                                </div>
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

            {/* Weekly Activity — dark card, lime highlighted bar for today (matches new home/plan design language) */}
            <div style={{background:"#171522", borderRadius:20, padding:"16px 16px 14px", marginBottom:20, boxShadow:"0 12px 24px rgba(23,21,34,0.22)"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:14}}>
              <span style={{fontSize:12, fontWeight:700, color:"#FFFFFF"}}>{t.weeklyActivity}</span>
              <span style={{fontSize:12, fontWeight:800, color:"#B6F27A"}}>
                {(() => {
                  const total = weeklyActivity.reduce((s,w)=>s+w.min,0);
                  const h = Math.floor(total/60), m = total%60;
                  return <>{h > 0 && <><Num>{nf(h)}</Num>h </>}<Num>{nf(m)}</Num>m {lang==="bn" ? "মোট" : "total"}</>;
                })()}
              </span>
            </div>
            <div style={{background:"transparent", borderRadius:14, padding:"0 0 4px", display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:6, height:118}}>
              {(() => {
                const maxMin = Math.max(1, ...weeklyActivity.map(w=>w.min));
                return weeklyActivity.map((w,i) => {
                  const h = Math.max(4, Math.round((w.min/maxMin)*62));
                  const isToday = dateKey(w.day) === todayKey;
                  const hh = Math.floor(w.min/60), mm = w.min%60;
                  return (
                    <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, height:"100%", justifyContent:"flex-end"}}>
                      {w.min > 0 ? (
                        <span style={{fontSize:10, fontWeight:700, color: isToday ? "#B6F27A" : "#8B889A", whiteSpace:"nowrap"}}>
                          {hh > 0 ? <><Num>{nf(hh)}</Num>h<Num>{nf(mm)}</Num></> : <Num>{nf(mm)}</Num>}
                        </span>
                      ) : <span style={{fontSize:10, height:11}}/>}
                      <div style={{width:"100%", maxWidth:22, height:h, borderRadius:7, background: w.min>0 ? (isToday ? "#B6F27A" : "#3A3650") : "rgba(255,255,255,0.06)", boxSizing:"border-box", transition:"height .3s"}}/>
                      <span style={{fontSize:10, fontWeight:700, color: isToday? "#FFFFFF" : "#8B889A"}}>{weekdayShort(w.day)}</span>
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
            flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3,
            border:"none", background:"transparent", cursor:"pointer", padding:"2px 2px 0", fontFamily:"inherit",
            color: active ? (dark ? "#FFFFFF" : accent) : (dark ? "#8B889A" : textMuted2),
          }}>
            <Icon size={20} strokeWidth={active?2.3:1.9}/>
            <span style={{fontSize:9.5, fontWeight:600, lineHeight:1}}>{label}</span>
          </button>
        );

        const FAB = 50;
        const navBarBg = dark ? "#171522" : "#FFFFFF";

        if (!addEnabled) {
          // শুধু Today ট্যাব থাকলে (Study/Task দুটোই বন্ধ) — normal ফুল-উইদথ বার, স্ক্রিনের একদম নিচে ফিক্সড, FAB লাগবে না
          return (
            <div style={{position:"sticky", left:0, right:0, bottom:0, zIndex:40, background:navBarBg, borderTop: dark ? "none" : `1px solid ${cardBorder}`, paddingBottom:"env(safe-area-inset-bottom)"}}>
              <div style={{display:"flex", padding:"10px 10px 8px"}}>
                <TabBtn Icon={Home} label={t.tabs.today} active={true} onClick={()=>{}}/>
              </div>
            </div>
          );
        }

        return (
          <div style={{position:"sticky", left:0, right:0, bottom:0, zIndex:40, background:navBarBg, borderTop: dark ? "none" : `1px solid ${cardBorder}`, paddingBottom:"env(safe-area-inset-bottom)"}}>
            <div style={{position:"relative", width:"100%"}}>
              <div style={{
                display:"flex", alignItems:"stretch", justifyContent:"space-around",
                padding:"8px 8px 6px",
              }}>
                <div style={{flex:1, display:"flex"}}>{leftTabs.map(tb => <TabBtn key={tb.k} {...tb}/>)}</div>
                <div style={{width:FAB, flexShrink:0}}/>
                <div style={{flex:1, display:"flex"}}>{rightTabs.map(tb => <TabBtn key={tb.k} {...tb}/>)}</div>
              </div>

              {showQuickAddMenu && (
                <>
                  <div onClick={()=>setShowQuickAddMenu(false)} style={{position:"fixed", inset:0, zIndex:44}}/>
                  <div style={{
                    position:"absolute", bottom:"100%", marginBottom:22, left:"50%", transform:"translateX(-50%)", zIndex:45,
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
                  position:"absolute", left:"50%", top:-14, transform:"translateX(-50%)",
                  width:FAB, height:FAB, borderRadius:"50%", border:`3px solid ${navBarBg}`,
                  background: accent,
                  color:"#171522",
                  display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
                  boxShadow:`0 6px 14px ${accent}55`,
                  zIndex:46,
                }}>
                <Plus size={22} strokeWidth={2.6}/>
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
