import React, { useState, useEffect, useRef } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { Plus, Play, Pause, RotateCcw, Calendar, ChevronLeft, ChevronRight, ChevronDown, X, Check, Trash2, Clock, Pencil, Home, CalendarDays, BarChart3, GraduationCap, Folder, FolderOpen, Maximize2, User, LogOut, Sun, Moon, Contrast, Settings, Info, Eye, EyeOff, Mail, WifiOff, MoreVertical, Pin, PinOff, Tag, Flame, Target, TrendingUp, Bell, ListChecks, User2, Sparkles, FileText, Search, CalendarClock, List, CalendarRange, Repeat, Lightbulb, Bold, Italic, Underline, Heading1, Heading2, RemoveFormatting, Palette } from "lucide-react";
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
    subtitle: isBn ? "পড়াশোনার সময় ট্র্যাক করুন, যেকোনো ডিভাইস থেকে" : "Track your study time, from any device",
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
        const googleUser = await GoogleAuth.signIn();
        const idToken = googleUser?.authentication?.idToken;
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
    width: "100%", boxSizing: "border-box", border: `1px solid ${cardBorder}`, background: dark ? "#26231D" : "#FFFFFF",
    color: textMain, borderRadius: 12, padding: "12px 14px", fontSize: 14, outline: "none",
  };

  // আলাদা "পাসওয়ার্ড রিসেট" স্ক্রিন — লগইন/সাইন-আপ ফর্ম থেকে সম্পূর্ণ আলাদা, শুধু ইমেইল চাওয়া হয়
  if (mode === "forgot") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: dark ? "#1A1814" : "#F8F5EF" }}>
        <div style={{ width: "100%", maxWidth: cardMaxWidth, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: "28px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <button type="button" onClick={() => { setMode("login"); setError(""); setInfo(""); setForgotEmail(""); }}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: textMuted2, padding: 4, display: "flex" }}>
              <ChevronLeft size={20} />
            </button>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{L.forgotTitle}</div>
          </div>

          {!info && <div style={{ fontSize: 12.5, color: textMuted2, marginBottom: 16, lineHeight: 1.6 }}>{L.forgotSubtitle}</div>}

          <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input type="email" placeholder={L.email} value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} style={inputStyle} required disabled={!!info} />
            {error && <div style={{ fontSize: 12, color: "#C0553F", fontWeight: 600 }}>{error}</div>}
            {info && <div style={{ fontSize: 12, color: "#6E8B5E", fontWeight: 600 }}>{info}</div>}
            {!info && (
              <button type="submit" disabled={busy} style={{
                marginTop: 4, border: "none", borderRadius: 12, padding: "12px 0", fontSize: 14, fontWeight: 800,
                background: accent, color: "#fff", cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1,
              }}>
                {busy ? "..." : L.sendResetLink}
              </button>
            )}
            <button type="button" onClick={() => { setMode("login"); setError(""); setInfo(""); setForgotEmail(""); }}
              style={{ background: "transparent", border: "none", color: textMuted2, fontSize: 12, cursor: "pointer", textAlign: "center", marginTop: info ? 4 : 0 }}>
              {L.backToLogin}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: dark ? "#1A1814" : "#F8F5EF" }}>
      <div style={{ width: "100%", maxWidth: cardMaxWidth, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: "28px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img src={dark ? LOGO_FULL_DARK : LOGO_FULL} alt="FocusGo" style={{height:30, width:"auto", objectFit:"contain", display:"block", margin:"0 auto"}}/>
          <div style={{ fontSize: 12, color: textMuted2, marginTop: 8 }}>{L.subtitle}</div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <button type="button" onClick={() => { setMode("login"); setError(""); setInfo(""); }}
            style={{ flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${mode === "login" ? accent : cardBorder}`,
              background: mode === "login" ? accent : "transparent", color: mode === "login" ? "#fff" : textMuted2 }}>
            {L.login}
          </button>
          <button type="button" onClick={() => { setMode("signup"); setError(""); setInfo(""); }}
            style={{ flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
              border: `1px solid ${mode === "signup" ? accent : cardBorder}`,
              background: mode === "signup" ? accent : "transparent", color: mode === "signup" ? "#fff" : textMuted2 }}>
            {L.signup}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mode === "signup" && (
            <input type="text" placeholder={L.name} value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          )}
          <input type="email" placeholder={L.email} value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
          <PasswordField placeholder={L.password} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required minLength={8} textMuted2={textMuted2} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          {mode === "signup" && (
            <div style={{ fontSize: 11, color: textMuted2, marginTop: -4 }}>{L.pwHint}</div>
          )}

          {error && <div style={{ fontSize: 12, color: "#C0553F", fontWeight: 600 }}>{error}</div>}
          {info && <div style={{ fontSize: 12, color: "#6E8B5E", fontWeight: 600 }}>{info}</div>}

          <button type="submit" disabled={busy} style={{
            marginTop: 4, border: "none", borderRadius: 12, padding: "12px 0", fontSize: 14, fontWeight: 800,
            background: accent, color: "#fff", cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1,
          }}>
            {busy ? "..." : (mode === "signup" ? L.submitSignup : L.submitLogin)}
          </button>

          {mode === "login" && (
            <button type="button" onClick={() => { setMode("forgot"); setForgotEmail(email); setError(""); setInfo(""); }} style={{ background: "transparent", border: "none", color: textMuted2, fontSize: 12, cursor: "pointer", textAlign: "center" }}>
              {L.forgot}
            </button>
          )}
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: cardBorder }} />
          <div style={{ fontSize: 11, color: textMuted2 }}>{L.or}</div>
          <div style={{ flex: 1, height: 1, background: cardBorder }} />
        </div>

        <button type="button" onClick={handleGoogle} disabled={busy} style={{
          width: "100%", border: `1px solid ${cardBorder}`, background: "transparent", color: textMain,
          borderRadius: 12, padding: "11px 0", fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>
          {L.google}
        </button>

        <button type="button" onClick={onGuest} disabled={busy} style={{
          width: "100%", border: "none", background: "transparent", color: textMuted2,
          borderRadius: 12, padding: "12px 0 2px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", textAlign: "center",
        }}>
          {L.guest}
        </button>
        <div style={{ fontSize: 10.5, color: textMuted2, textAlign: "center", marginTop: 4, lineHeight: 1.5, opacity: 0.8 }}>
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
        style={{ border: `1px solid ${cardBorder}`, background: cardBg, color: textMain, borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, overflow:"hidden", padding:0 }}
        title={profileLabel}
      >
        {user && user.photoURL ? (
          <img src={user.photoURL} alt="" style={{width:"100%", height:"100%", objectFit:"cover"}}/>
        ) : (
          <User size={16} />
        )}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{position:"fixed", inset:0, zIndex:59}}/>
          <div style={{position:"absolute", right:0, top:"100%", marginTop:6, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:12, boxShadow:"0 8px 22px rgba(0,0,0,0.18)", zIndex:60, minWidth:160, overflow:"hidden", padding:4}}>
            <button onClick={() => { setOpen(false); onOpenProfile(); }} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:textMain, borderRadius:8, padding:"9px 10px", fontSize:12.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
              <User size={14} color={textMuted2}/> {profileLabel}
            </button>
            <button onClick={() => { setOpen(false); onOpenSettings(); }} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:textMain, borderRadius:8, padding:"9px 10px", fontSize:12.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
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
        style={{ position: "relative", border: `1px solid ${cardBorder}`, background: cardBg, color: textMuted2, borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
        title={t.notifications}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span style={{ position: "absolute", top: -2, right: -2, minWidth: 15, height: 15, padding: "0 3px", borderRadius: "50%", background: "#C0392B", color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 59 }} />
          <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 6, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 14, boxShadow: "0 8px 22px rgba(0,0,0,0.18)", zIndex: 60, width: 300, maxWidth: "88vw", maxHeight: 360, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: `1px solid ${cardBorder}` }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: textMain }}>{t.notifications}</span>
              {notifications.length > 0 && (
                <button onClick={onClear} style={{ border: "none", background: "transparent", color: textMuted2, fontSize: 10.5, fontWeight: 700, cursor: "pointer", padding: 4 }}>{t.clearAll}</button>
              )}
            </div>
            <div style={{ overflowY: "auto" }}>
              {notifications.length === 0 && (
                <div style={{ padding: "24px 12px", textAlign: "center", fontSize: 12, color: textMuted2 }}>{t.noNotifications}</div>
              )}
              {notifications.map(n => (
                <div key={n.id} style={{ display: "flex", gap: 8, padding: "10px 12px", borderBottom: `1px solid ${cardBorder}`, background: n.read ? "transparent" : (dark ? "#2C2820" : "#F8F5EE") }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: accent, flexShrink: 0, marginTop: 5, opacity: n.read ? 0 : 1 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: textMain }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: textMuted2, marginTop: 2, lineHeight: 1.4 }}>{n.body}</div>
                    <div style={{ fontSize: 9.5, color: textMuted2, opacity: 0.7, marginTop: 3 }}>{timeAgoLabel(n.time, lang)}</div>
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

// ডেস্কটপ (≥1024px) এ bottom-nav এর বদলে বাম পাশে সাইডবার — বড় স্ক্রিনে familiar "app" লেআউট
function DesktopSidebar({ t, tab, setTab, vibrate, dark, cardBorder, textMain, textMuted2, accent, collapsed, onToggleCollapse, onHideAll }) {
  const items = [
    { k: "today", Icon: Home },
    { k: "study", Icon: GraduationCap },
    { k: "task", Icon: ListChecks },
    { k: "notes", Icon: FileText },
  ];
  return (
    <div style={{
      width: collapsed ? 68 : 232, flexShrink: 0, borderRight: `1px solid ${cardBorder}`,
      padding: collapsed ? "28px 10px" : "28px 14px", display: "flex", flexDirection: "column", gap: 3,
      position: "sticky", top: 0, height: "100dvh", boxSizing: "border-box",
      transition: "width .18s cubic-bezier(0.16,1,0.3,1), padding .18s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {!collapsed && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
          <button onClick={() => { vibrate(); setTab("today"); }} title={t.tabs.today}
            style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, display: "flex", marginLeft: 8, overflow: "hidden" }}>
            <img src={dark ? LOGO_FULL_DARK : LOGO_FULL} alt="FocusGo" style={{ height: 26, width: "auto", objectFit: "contain" }} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <button onClick={() => { vibrate(); onToggleCollapse(); }} title="সাইডবার সংকুচিত করুন"
              style={{ border: `1px solid ${cardBorder}`, background: "transparent", color: textMuted2, borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <ChevronLeft size={14} />
            </button>
            {onHideAll && (
              <button onClick={() => { vibrate(); onHideAll(); }} title="সাইডবার সম্পূর্ণ লুকান"
                style={{ border: `1px solid ${cardBorder}`, background: "transparent", color: textMuted2, borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <EyeOff size={14} />
              </button>
            )}
          </div>
        </div>
      )}
      <div style={{ marginTop: collapsed ? 4 : 0, display: "flex", flexDirection: "column", gap: 3 }}>
      {items.map(({ k, Icon }) => (
        <button key={k} onClick={() => { vibrate(); setTab(k); }} title={collapsed ? t.tabs[k] : undefined} style={{
          display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 12, border: "none", borderRadius: 12,
          padding: collapsed ? "11px 0" : "11px 12px", fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "left",
          background: tab === k ? "rgba(217,119,87,0.14)" : "transparent",
          color: tab === k ? accent : textMuted2,
          transition: "background .2s ease, color .2s ease",
        }}>
          <Icon size={22} strokeWidth={tab === k ? 2.3 : 2} />
          {!collapsed && t.tabs[k]}
        </button>
      ))}
      </div>
      {collapsed && (
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <button onClick={() => { vibrate(); onToggleCollapse(); }} title="সাইডবার দেখান"
            style={{ border: `1px solid ${cardBorder}`, background: "transparent", color: textMuted2, borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronRight size={14} />
          </button>
          {onHideAll && (
            <button onClick={() => { vibrate(); onHideAll(); }} title="সাইডবার সম্পূর্ণ লুকান"
              style={{ border: `1px solid ${cardBorder}`, background: "transparent", color: textMuted2, borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <EyeOff size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Settings modal: Language, Theme, About Us ----------
function SettingsModal({ t, lang, setLang, themeMode, setThemeMode, onClose, cardBg, cardBorder, textMain, textMuted2, accent, dark }) {
  const [showAbout, setShowAbout] = useState(false);
  const [legalDoc, setLegalDoc] = useState(null); // null | "privacy" | "terms"
  const isBn = lang === "bn";

  const rowStyle = { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 2px", borderBottom:`1px solid ${cardBorder}` };
  const labelStyle = { display:"flex", alignItems:"center", gap:10, fontSize:14, fontWeight:700, color:textMain };
  const iconWrapStyle = { width:32, height:32, borderRadius:"50%", background: dark?"#121110":"#F8F5EE", border:`1px solid ${cardBorder}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color: dark ? "#C9C0AC" : "#6B6353" };

  if (legalDoc) {
    const sections = legalDoc === "privacy" ? t.privacySections : t.termsSections;
    const title = legalDoc === "privacy" ? t.privacyPolicy : t.termsOfUse;
    return (
      <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
        <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"22px 22px 0 0", padding:"20px 20px 28px", color:textMain, maxHeight:"85vh", display:"flex", flexDirection:"column"}}>
          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:6, flexShrink:0}}>
            <button onClick={()=>setLegalDoc(null)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, padding:4, display:"flex"}}>
              <ChevronLeft size={20}/>
            </button>
            <div style={{fontSize:17, fontWeight:800, flex:1}}>{title}</div>
            <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
          </div>
          <div style={{fontSize:11, color:textMuted2, fontWeight:600, marginBottom:14, paddingLeft:32}}>{t.lastUpdated}: {t.effectiveDate}</div>
          <div style={{overflowY:"auto", paddingRight:2}}>
            {sections.map((sec, i) => (
              <div key={i} style={{marginBottom:18}}>
                <div style={{fontSize:13.5, fontWeight:800, marginBottom:6, color:textMain}}>{sec.title}</div>
                {sec.body.split("\n\n").map((para, j) => (
                  <div key={j} style={{fontSize:13, color:textMain, lineHeight:1.7, marginBottom:8, opacity:0.9}}>{para}</div>
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
      <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
        <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"22px 22px 0 0", padding:"20px 20px 28px", color:textMain}}>
          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:14}}>
            <button onClick={()=>setShowAbout(false)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, padding:4, display:"flex"}}>
              <ChevronLeft size={20}/>
            </button>
            <div style={{fontSize:17, fontWeight:800, flex:1}}>{t.aboutUs}</div>
            <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
          </div>
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"8px 0 20px"}}>
            <img src={dark ? LOGO_FULL_DARK : LOGO_FULL} alt={t.appName} style={{height:34, width:"auto", objectFit:"contain", marginBottom:16}}/>
            <div style={{fontSize:13, color:textMain, lineHeight:1.7, textAlign:"center"}}>{t.aboutBody}</div>

            <div style={{width:"100%", borderTop:`1px solid ${cardBorder}`, marginTop:20, paddingTop:18}}>
              <div style={{fontSize:10.5, letterSpacing: isBn ? 0 : "1.3px", color:textMuted2, fontWeight:700, opacity:0.85, marginBottom:8}}>{t.creatorLabel}</div>
              <div style={{fontSize:15, fontWeight:800, color:textMain, marginBottom:14}}>Md. Mazharul Islam Maruf</div>

              <div style={{display:"flex", justifyContent:"center", gap:10, marginBottom:14}}>
                <a href="https://www.linkedin.com/in/mazharulmrf" target="_blank" rel="noopener noreferrer" title="LinkedIn"
                  style={{...iconWrapStyle, textDecoration:"none"}}><LinkedinIcon size={15}/></a>
                <a href="https://www.facebook.com/mazharul.mrf" target="_blank" rel="noopener noreferrer" title="Facebook"
                  style={{...iconWrapStyle, textDecoration:"none"}}><FacebookIcon size={15}/></a>
                <a href="https://www.behance.net/mazharulmrf" target="_blank" rel="noopener noreferrer" title="Behance"
                  style={{...iconWrapStyle, textDecoration:"none"}}><BehanceIcon size={15}/></a>
              </div>

              <a href="mailto:mazharul.mrf@gmail.com" style={{display:"inline-flex", alignItems:"center", gap:7, textDecoration:"none", color:textMuted2, fontSize:12.5, fontWeight:600}}>
                <Mail size={14}/> mazharul.mrf@gmail.com
              </a>
            </div>

            <div style={{width:"100%", borderTop:`1px solid ${cardBorder}`, marginTop:20, paddingTop:6}}>
              <div style={{fontSize:10.5, letterSpacing: isBn ? 0 : "1.3px", color:textMuted2, fontWeight:700, opacity:0.85, margin:"12px 0 2px", textAlign:"left"}}>{t.legalSection}</div>
              <button onClick={()=>setLegalDoc("privacy")} style={{width:"100%", border:"none", background:"transparent", cursor:"pointer", padding:"12px 0", display:"flex", alignItems:"center", justifyContent:"space-between", color:textMain}}>
                <span style={{fontSize:13.5, fontWeight:700}}>{t.privacyPolicy}</span>
                <ChevronRight size={16} style={{color:textMuted2}}/>
              </button>
              <button onClick={()=>setLegalDoc("terms")} style={{width:"100%", border:"none", background:"transparent", cursor:"pointer", padding:"12px 0", display:"flex", alignItems:"center", justifyContent:"space-between", color:textMain, borderTop:`1px solid ${cardBorder}`}}>
                <span style={{fontSize:13.5, fontWeight:700}}>{t.termsOfUse}</span>
                <ChevronRight size={16} style={{color:textMuted2}}/>
              </button>
            </div>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", fontSize:11.5, color:textMuted2, paddingTop:14, borderTop:`1px solid ${cardBorder}`}}>
            <span>{t.version}</span>
            <span>1.0.0</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"22px 22px 0 0", padding:"20px 20px 28px", color:textMain}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
          <div style={{fontSize:17, fontWeight:800, letterSpacing:-0.2}}>{t.settings}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>

        {/* Language */}
        <div style={rowStyle}>
          <div style={labelStyle}><span style={iconWrapStyle}><span style={{fontSize:13, fontWeight:800}}>{lang==="bn"?"বাং":"EN"}</span></span>{t.language}</div>
          <button onClick={()=>setLang(l=>l==="bn"?"en":"bn")} style={{border:`1px solid ${cardBorder}`, background: dark?"#121110":"#F8F5EE", color:textMain, borderRadius:10, padding:"7px 12px", fontSize:12, fontWeight:700, cursor:"pointer"}}>
            {lang==="bn" ? "English" : "বাংলা"}
          </button>
        </div>

        {/* About Us */}
        <button onClick={()=>setShowAbout(true)} style={{width:"100%", border:"none", background:"transparent", cursor:"pointer", padding:0}}>
          <div style={{...rowStyle, borderBottom:"none"}}>
            <div style={labelStyle}><span style={iconWrapStyle}><Info size={15}/></span>{t.aboutUs}</div>
            {isBn ? <ChevronLeft size={16} color={textMuted2}/> : <ChevronRight size={16} color={textMuted2}/>}
          </div>
        </button>
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
  const sheetRadius = isDesktop ? 22 : "22px 22px 0 0";

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
            <div style={{fontSize:17, fontWeight:800, letterSpacing:-0.2}}>{t.profile}</div>
            <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:14, marginBottom:16}}>
            <div style={{width:56, height:56, borderRadius:"50%", background: dark?"#121110":"#F8F5EE", border:`1px solid ${cardBorder}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
              <User size={24} color={dark ? "#C9C0AC" : "#6B6353"}/>
            </div>
            <div style={{fontSize:14, fontWeight:800}}>{gL.title}</div>
          </div>
          <div style={{fontSize:12.5, color:textMuted2, lineHeight:1.6, marginBottom:20}}>{gL.body}</div>
          <button onClick={onExitGuest} style={{width:"100%", border:"none", borderRadius:12, padding:"12px 0", fontSize:14, fontWeight:800, background:accent, color:"#fff", cursor:"pointer"}}>
            {gL.cta}
          </button>
        </div>
      </div>
    );
  }

  const hasPassword = Array.isArray(user.providerData) && user.providerData.some(p => p.providerId === "password");
  const fileInputRef = useRef(null);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user.displayName || "");
  const [email, setEmail] = useState(user.email || "");
  const [confirmPw, setConfirmPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [pwOpen, setPwOpen] = useState(false);
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwInfo, setPwInfo] = useState("");

  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const L = {
    nameLabel: isBn ? "নাম" : "Name",
    emailLabel: isBn ? "ইমেইল" : "Email",
    currentPasswordLabel: isBn ? "বর্তমান পাসওয়ার্ড" : "Current Password",
    newPasswordLabel: isBn ? "নতুন পাসওয়ার্ড" : "New Password",
    confirmPasswordLabel: isBn ? "নতুন পাসওয়ার্ড আবার লিখুন" : "Confirm new password",
    changePassword: isBn ? "পাসওয়ার্ড পরিবর্তন করুন" : "Change Password",
    saveChanges: isBn ? "সংরক্ষণ করুন" : "Save Changes",
    changePhoto: isBn ? "ছবি পরিবর্তন" : "Change Photo",
    profileUpdated: isBn ? "প্রোফাইল আপডেট হয়েছে।" : "Profile updated.",
    passwordUpdated: isBn ? "পাসওয়ার্ড পরিবর্তন হয়েছে।" : "Password updated.",
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
    photoTooLarge: isBn ? "ছবির সাইজ খুব বড়, ২MB-এর কম ছবি দিন।" : "Image too large — please pick one under 2MB.",
  };

  const inputStyle = { width:"100%", boxSizing:"border-box", background: dark?"#121110":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"11px 13px", fontSize:14, color:textMain, outline:"none", fontFamily:"inherit" };
  const labelStyle = { fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6 };

  const emailChanged = email.trim() !== (user.email || "");

  const startEdit = () => {
    setName(user.displayName || ""); setEmail(user.email || ""); setConfirmPw("");
    setError(""); setInfo(""); setEditMode(true);
  };
  const cancelEdit = () => { setEditMode(false); setError(""); setInfo(""); };

  const handleSignOut = async () => {
    setBusy(true);
    try { await signOut(auth); } catch (err) { console.error("Sign out error:", err); }
    setBusy(false);
    onClose();
  };

  const handleSaveProfile = async () => {
    setError(""); setInfo("");
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) { setError(L.invalidEmail); return; }
    if (emailChanged && hasPassword && !confirmPw) { setError(L.needCurrentPw); return; }
    setBusy(true);
    try {
      if (emailChanged) {
        if (hasPassword) {
          await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, confirmPw));
        }
        await updateEmail(user, trimmedEmail);
      }
      if (trimmedName !== (user.displayName || "")) {
        await updateProfile(user, { displayName: trimmedName });
      }
      onUserUpdate({ displayName: trimmedName, email: trimmedEmail });
      setInfo(L.profileUpdated);
      setEditMode(false);
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
      setTimeout(() => setPwOpen(false), 900);
    } catch (err) {
      if (err.code === "auth/wrong-password") setPwError(L.wrongPassword);
      else if (err.code === "auth/weak-password") setPwError(L.weakPassword);
      else setPwError(L.genericErr);
    } finally {
      setPwBusy(false);
    }
  };

  const handlePickPhoto = () => fileInputRef.current && fileInputRef.current.click();
  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setPhotoError("");
    if (file.size > 2 * 1024 * 1024) { setPhotoError(L.photoTooLarge); return; }
    setPhotoBusy(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        // Profile photo is stored in Firebase Auth as a data URL for now.
        await updateProfile(user, { photoURL: reader.result });
        onUserUpdate({ photoURL: reader.result });
      } catch (err) {
        setPhotoError(L.genericErr);
      } finally {
        setPhotoBusy(false);
      }
    };
    reader.onerror = () => { setPhotoBusy(false); setPhotoError(L.genericErr); };
    reader.readAsDataURL(file);
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:sheetRadius, padding:"20px 20px 28px", color:textMain, maxHeight:"88vh", overflowY:"auto"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18}}>
          <div style={{fontSize:17, fontWeight:800, letterSpacing:-0.2}}>{t.profile}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>

        {/* Avatar */}
        <div style={{display:"flex", alignItems:"center", gap:14, marginBottom:20}}>
          <div style={{position:"relative", flexShrink:0}}>
            <div style={{width:56, height:56, borderRadius:"50%", background: dark?"#121110":"#F8F5EE", border:`1px solid ${cardBorder}`, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden"}}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="" style={{width:"100%", height:"100%", objectFit:"cover"}}/>
              ) : (
                <User size={24} color={dark ? "#C9C0AC" : "#6B6353"}/>
              )}
            </div>
            <button onClick={handlePickPhoto} disabled={photoBusy} title={L.changePhoto} style={{
              position:"absolute", right:-2, bottom:-2, width:22, height:22, borderRadius:"50%",
              border:`2px solid ${cardBg}`, background:accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
              cursor: photoBusy ? "default" : "pointer", opacity: photoBusy ? 0.6 : 1,
            }}>
              <Pencil size={11}/>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{display:"none"}}/>
          </div>
          {!editMode && (
            <div style={{minWidth:0, flex:1}}>
              <div style={{fontSize:15, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{user.displayName || (user.email ? user.email.split("@")[0] : "Account")}</div>
              {user.email && <div style={{fontSize:12, color:textMuted2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{user.email}</div>}
            </div>
          )}
          {!editMode && (
            <button onClick={startEdit} style={{border:`1px solid ${cardBorder}`, background:"transparent", color:textMain, borderRadius:10, padding:"7px 9px", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, flexShrink:0}}>
              <Pencil size={12}/> {t.edit}
            </button>
          )}
        </div>
        {photoError && <div style={{fontSize:12, color:"#C0553F", fontWeight:600, marginTop:-10, marginBottom:14}}>{photoError}</div>}

        {/* Name + Email edit form */}
        {editMode && (
          <div style={{display:"flex", flexDirection:"column", gap:10, marginBottom:18}}>
            <div>
              <div style={labelStyle}>{L.nameLabel}</div>
              <input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} />
            </div>
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
            {error && <div style={{fontSize:12, color:"#C0553F", fontWeight:600}}>{error}</div>}
            {info && <div style={{fontSize:12, color:"#6E8B5E", fontWeight:600}}>{info}</div>}
            <div style={{display:"flex", gap:8, marginTop:2}}>
              <button onClick={cancelEdit} disabled={busy} style={{flex:1, border:`1px solid ${cardBorder}`, background:"transparent", color:textMain, borderRadius:12, padding:"11px 0", fontSize:13, fontWeight:700, cursor:"pointer"}}>{t.cancel}</button>
              <button onClick={handleSaveProfile} disabled={busy} style={{flex:1, border:"none", borderRadius:12, padding:"11px 0", fontSize:13, fontWeight:800, background:accent, color:"#fff", cursor: busy?"default":"pointer", opacity: busy?0.7:1}}>{busy ? "..." : L.saveChanges}</button>
            </div>
          </div>
        )}
        {!editMode && info && <div style={{fontSize:12, color:"#6E8B5E", fontWeight:600, marginBottom:14}}>{info}</div>}

        {/* Change password */}
        <div style={{border:`1px solid ${cardBorder}`, borderRadius:14, overflow:"hidden", marginBottom:18}}>
          <button onClick={()=>{ if (!hasPassword) { setPwOpen(false); setPwError(L.noPasswordAccount); return; } setPwOpen(o=>!o); setPwError(""); setPwInfo(""); }}
            style={{width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", border:"none", background:"transparent", color:textMain, padding:"12px 14px", fontSize:13, fontWeight:700, cursor:"pointer"}}>
            {L.changePassword}
            <ChevronDown size={16} style={{transform: pwOpen ? "rotate(180deg)" : "none", transition:"transform 0.15s", color:textMuted2}}/>
          </button>
          {pwOpen && hasPassword && (
            <div style={{padding:"0 14px 14px", display:"flex", flexDirection:"column", gap:10}}>
              <div>
                <div style={labelStyle}>{L.currentPasswordLabel}</div>
                <PasswordField style={inputStyle} value={curPw} onChange={e=>setCurPw(e.target.value)} textMuted2={textMuted2} autoComplete="current-password" />
              </div>
              <div>
                <div style={labelStyle}>{L.newPasswordLabel}</div>
                <PasswordField style={inputStyle} value={newPw} onChange={e=>setNewPw(e.target.value)} minLength={8} textMuted2={textMuted2} autoComplete="new-password" />
                <div style={{fontSize:11, color:textMuted2, marginTop:4}}>{L.pwHint}</div>
              </div>
              <div>
                <div style={labelStyle}>{L.confirmPasswordLabel}</div>
                <PasswordField style={inputStyle} value={newPw2} onChange={e=>setNewPw2(e.target.value)} minLength={8} textMuted2={textMuted2} autoComplete="new-password" />
              </div>
              {pwError && <div style={{fontSize:12, color:"#C0553F", fontWeight:600}}>{pwError}</div>}
              {pwInfo && <div style={{fontSize:12, color:"#6E8B5E", fontWeight:600}}>{pwInfo}</div>}
              <button onClick={handleChangePassword} disabled={pwBusy} style={{border:"none", borderRadius:12, padding:"11px 0", fontSize:13, fontWeight:800, background:accent, color:"#fff", cursor: pwBusy?"default":"pointer", opacity: pwBusy?0.7:1}}>
                {pwBusy ? "..." : L.saveChanges}
              </button>
            </div>
          )}
          {pwError && !pwOpen && <div style={{padding:"0 14px 12px", fontSize:12, color:"#C0553F", fontWeight:600}}>{pwError}</div>}
        </div>

        <button
          onClick={handleSignOut}
          disabled={busy}
          style={{ width:"100%", marginTop:4, border:`1px solid ${dark?"rgba(192,85,63,0.30)":"rgba(192,85,63,0.22)"}`, borderRadius:12, padding:"12px 0", fontSize:14, fontWeight:800, background: dark?"rgba(192,85,63,0.10)":"rgba(192,85,63,0.07)", color:"#C0553F", cursor: busy?"default":"pointer", opacity: busy?0.7:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
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
const pad2 = (n) => String(n).padStart(2,"0");
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


const startOfWeek = (d) => { const x = new Date(d); const day = x.getDay(); x.setDate(x.getDate()-day); x.setHours(0,0,0,0); return x; };
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

const T = {
  en: {
    tagline: "Study Smarter",
    tabs: { today: "Today", study: "Study", task: "Tasks", notes: "Notes", stats: "Stats", plan: "Plan", exam: "Exam" },
    planViewStudy: "Study Plan", planViewExam: "Exam",
    taskTitle: "Tasks", taskSubtitle: "Today's to-do list", taskAdd: "New task", taskEmpty: "No tasks in this list",
    taskStudy: "Study", taskPersonal: "Personal", taskAll: "All",
    taskPrHigh: "High", taskPrMed: "Medium", taskPrLow: "Low",
    taskTitlePlaceholder: "What needs to be done?", taskCategory: "Category", taskPriority: "Priority", taskAddBtn: "Add task",
    taskAddCategory: "Add category", taskNewCategoryPlaceholder: "New category name",
    taskDone: "done", taskLinkHint: "You can start a \"Study\" task directly with the Focus Timer — it'll auto-complete when the session ends.",
    taskLeftLabel: "left", taskAllDoneLabel: "All done",
    taskFilterToday: "Today", taskFilterUpcoming: "Upcoming", taskFilterDone: "Done",
    notesTitle: "Notes", notesSubtitle: "Capture ideas, lessons, and things to remember", notesSearch: "Search notes...", notesNew: "New Note", notesEmpty: "No notes yet", notesEmptySub: "Save an idea, lesson, or reminder here.", notesTitlePlaceholder: "Note title", notesBodyPlaceholder: "Write your note...", notesSave: "Save Note", notesEdit: "Edit Note", notesDelete: "Delete",
    taskDueDate: "Due Date", taskDueDateOptional: "Due Date (optional)", taskNoDueDate: "No due date",
    taskDueToday: "Today", taskDueTomorrow: "Tomorrow", taskOverdue: "Overdue", taskCompleted: "Completed",
    taskSectionToday: "Today", taskSectionUpcoming: "Upcoming", taskSectionNoDate: "No Due Date",
    taskEmptyToday: "Nothing due today", taskEmptyUpcoming: "Nothing upcoming", taskEmptyDone: "No completed tasks yet",
    taskViewList: "List", taskViewCalendar: "Calendar",
    taskViewListHint: "All your tasks, grouped by due date", taskViewCalendarHint: "Tap a day on the calendar to see its tasks",
    taskRepeat: "Repeat", taskRepeatNone: "Never", taskRepeatDaily: "Daily", taskRepeatWeekly: "Weekly", taskRepeatMonthly: "Monthly",
    taskRepeatBadge: "Repeats", taskCalNoDate: "No due date", taskCalPickDay: "Tap a day to see its tasks",
    taskCalEmptyDay: "No tasks due this day", taskCalNoDateTasks: "Tasks without a due date",
    taskCalMonthOverview: "This Month", taskCalMonthTotal: "Total", taskCalMonthCompleted: "Completed", taskCalMonthOverdue: "Overdue",
    focusTimer: "Focus Timer", start: "Start Focus", pause: "Pause", reset: "Reset",
    pickTopicForTimer: "Pick a topic to focus on", freeSession: "Free Session",
    timerMode: "Timer", stopwatchMode: "Stopwatch",
    sessionTypeLabel: "Session Type", focusOption: "Focus", breakOption: "Break",
    sessionLabel: "Session", focusCompleteTitle: "Focus complete", takeBreakQuestion: "Take a", breakQSuffix: "min break?",
    startBreakBtn: "Start Break", skipBreakBtn: "Skip",
    editTopicTitle: "Edit Topic", save: "Save", edit: "Edit",
    yourRhythm: "Your Rhythm", todaysStudy: "Today's Study", todaysProgress: "Today's Progress", addTopic: "Add Topic",
    noTopicsToday: "No topics yet. Add one to start your rhythm.",
    thisWeek: "This Week",
    longView: "Long View", syllabusProgress: "Subject Progress", complete: "Complete",
    weeklySummary: "Weekly Summary", monthlySummary: "Monthly Summary",
    covered: "Covered", missed: "Missed",
    noneCovered: "Nothing covered yet.", noneMissed: "Nothing missed — great job!",
    summaryPendingWeek: "Summary will show once this week ends.",
    summaryPendingMonth: "Summary will show once this month ends.",
    addTopicTitle: "Add a topic", subjectLabel: "Subject", subjectPlaceholder: "e.g. Physics, বাংলা...",
    pickSubject: "Pick a subject, or type a new one below", newSubjectAutoSaved: "A new subject you type here is added to your subject list too.",
    lightMode: "Switch to light mode", darkMode: "Switch to dark mode",
    themeSystem: "System", themeLight: "Light", themeDark: "Dark",
    topicLabel: "Topic", topicPlaceholder: "e.g. Newton's Laws",
    durationLabel: "Duration (minutes)", cancel: "Cancel", add: "Add",
    dayDetail: "Day Detail", planned: "Planned", done: "Done", notDone: "Not Done", noData: "No study data for this day.",
    noSubjectData: "No subject data for this period.",
    minutes: "min", close: "Close", deleteTopic: "Delete",
    confirmDeleteTopic: "Delete this topic?", confirmDelete: "Yes, delete",
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
    addTimeToggle: "Add a specific time", noTimeSet: "No time set", amLabel: "AM", pmLabel: "PM",
    remainingHeader: "Remaining", doneHeader: "Done",
    next7Days: "Next 7 Days", subjectTimeBreakdown: "Time by subject", noTimeData: "No completed topics yet.",
    overview: "Overview", caughtUpNote: "Caught up later",
    examSubjects: "Exam Subjects", manageExams: "Manage Exams", addExam: "Add exam subject",
    examDateLabel: "Exam date (optional)", noExamSubjects: "No exam subjects yet. Add the subjects you're being examined on.",
    noDateSet: "No date set", daysLeftLabel: "days left", examToday: "Exam Today", examPassed: "Exam Passed",
    removeExam: "Remove", nextExam: "Next Exam", noUpcomingExam: "No upcoming exam dates set", examOverview: "Overview across all your exam subjects",
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
    settings: "Settings", language: "Language", theme: "Theme",
    aboutUs: "About Us", appName: "FocusGo", version: "Version",
    aboutTagline: "Make every day count.",
    aboutBody: "FocusGo is a study companion built to help students plan, focus, and track their progress day by day.",
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
    calendarLegendCompleted: "Study completed", calendarLegendExam: "Exam", calendarLegendPlanned: "Planned",
    calendarLegendHoliday: "Govt holiday",
    noTopicsSubjectShort: "No topics yet", addTopicsShort: "Add Topics",
    examSetupTitle: "Set up your exam", examSetupSubtitle: "Get your exam prep organized in a few quick steps.",
    noExamYetTitle: "No exam scheduled yet", noExamYetSubtitle: "Add your first exam to start tracking your preparation.",
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
    tagline: "নিজের গতিতে পড়ো",
    tabs: { today: "আজ", study: "স্টাডি", task: "টাস্ক", notes: "নোট", stats: "স্ট্যাটস", plan: "প্ল্যান", exam: "এক্সাম" },
    planViewStudy: "স্টাডি প্ল্যান", planViewExam: "এক্সাম",
    taskTitle: "টাস্ক", taskSubtitle: "আজকের করণীয় তালিকা", taskAdd: "নতুন টাস্ক", taskEmpty: "এই তালিকায় কোনো টাস্ক নেই",
    taskStudy: "স্টাডি", taskPersonal: "পার্সোনাল", taskAll: "সব",
    taskPrHigh: "জরুরি", taskPrMed: "মিডিয়াম", taskPrLow: "কম",
    taskTitlePlaceholder: "কী করতে হবে?", taskCategory: "ক্যাটাগরি", taskPriority: "প্রায়োরিটি", taskAddBtn: "যোগ করো",
    taskAddCategory: "ক্যাটাগরি যোগ করো", taskNewCategoryPlaceholder: "নতুন ক্যাটাগরির নাম",
    taskDone: "সম্পন্ন", taskLinkHint: "\"স্টাডি\" ক্যাটাগরির টাস্ক চাইলে সরাসরি Focus Timer দিয়ে শুরু করা যাবে — সেশন শেষ হলে টাস্ক অটো-সম্পন্ন হবে।",
    taskLeftLabel: "বাকি", taskAllDoneLabel: "সব সম্পন্ন",
    taskFilterToday: "আজ", taskFilterUpcoming: "আসন্ন", taskFilterDone: "সম্পন্ন",
    notesTitle: "নোট", notesSubtitle: "আইডিয়া, পড়ার বিষয় ও দরকারি তথ্য সংরক্ষণ করো", notesSearch: "নোট খুঁজুন...", notesNew: "নতুন নোট", notesEmpty: "এখনো কোনো নোট নেই", notesEmptySub: "আইডিয়া, পড়ার বিষয় বা দরকারি কিছু এখানে রাখো।", notesTitlePlaceholder: "নোটের শিরোনাম", notesBodyPlaceholder: "নোট লিখুন...", notesSave: "নোট সেভ", notesEdit: "নোট এডিট", notesDelete: "মুছুন",
    taskDueDate: "ডিউ ডেট", taskDueDateOptional: "ডিউ ডেট (ঐচ্ছিক)", taskNoDueDate: "কোনো ডিউ ডেট নেই",
    taskDueToday: "আজ", taskDueTomorrow: "আগামীকাল", taskOverdue: "মেয়াদ শেষ", taskCompleted: "সম্পন্ন হয়েছে",
    taskSectionToday: "আজ", taskSectionUpcoming: "আসন্ন", taskSectionNoDate: "ডিউ ডেট নেই",
    taskEmptyToday: "আজ কিছু বাকি নেই", taskEmptyUpcoming: "আসন্ন কিছু নেই", taskEmptyDone: "এখনো কোনো টাস্ক সম্পন্ন হয়নি",
    taskViewList: "লিস্ট", taskViewCalendar: "ক্যালেন্ডার",
    taskViewListHint: "তোমার সব টাস্ক, ডিউ ডেট অনুযায়ী সাজানো", taskViewCalendarHint: "ক্যালেন্ডারে কোনো দিনে ট্যাপ করে সেদিনের টাস্ক দেখো",
    taskRepeat: "রিপিট", taskRepeatNone: "একবারই", taskRepeatDaily: "প্রতিদিন", taskRepeatWeekly: "প্রতি সপ্তাহে", taskRepeatMonthly: "প্রতি মাসে",
    taskRepeatBadge: "রিপিট হয়", taskCalNoDate: "ডিউ ডেট নেই", taskCalPickDay: "কোনো দিনে ট্যাপ করে সেদিনের টাস্ক দেখুন",
    taskCalEmptyDay: "এই দিনে কোনো টাস্ক নেই", taskCalNoDateTasks: "ডিউ ডেট ছাড়া টাস্ক",
    taskCalMonthOverview: "এই মাস", taskCalMonthTotal: "মোট", taskCalMonthCompleted: "সম্পন্ন", taskCalMonthOverdue: "মেয়াদ শেষ",
    focusTimer: "ফোকাস টাইমার", start: "ফোকাস শুরু", pause: "থামাও", reset: "রিসেট",
    pickTopicForTimer: "ফোকাস করার জন্য একটা টপিক বাছাই করো", freeSession: "ফ্রি সেশন",
    timerMode: "টাইমার", stopwatchMode: "স্টপওয়াচ",
    sessionTypeLabel: "সেশন টাইপ", focusOption: "ফোকাস", breakOption: "ব্রেক",
    sessionLabel: "সেশন", focusCompleteTitle: "ফোকাস সম্পন্ন হয়েছে", takeBreakQuestion: "", breakQSuffix: "মিনিট ব্রেক নেবে?",
    startBreakBtn: "ব্রেক শুরু করো", skipBreakBtn: "স্কিপ",
    editTopicTitle: "টপিক এডিট করুন", save: "সেভ করো", edit: "এডিট",
    yourRhythm: "আপনার ছন্দ", todaysStudy: "আজকের পড়া", todaysProgress: "আজকের অগ্রগতি", addTopic: "টপিক যোগ করো",
    noTopicsToday: "এখনো কোনো টপিক নেই। শুরু করতে একটা যোগ করুন।",
    thisWeek: "এই সপ্তাহ",
    longView: "সামগ্রিক দৃশ্য", syllabusProgress: "বিষয়ভিত্তিক অগ্রগতি", complete: "সম্পন্ন",
    weeklySummary: "সাপ্তাহিক সারাংশ", monthlySummary: "মাসিক সারাংশ",
    covered: "কভার হয়েছে", missed: "বাদ পড়েছে",
    noneCovered: "এখনো কিছু কভার হয়নি।", noneMissed: "কিছুই বাদ পড়েনি — চমৎকার!",
    summaryPendingWeek: "এই সপ্তাহ শেষ হলে সারাংশ দেখা যাবে।",
    summaryPendingMonth: "এই মাস শেষ হলে সারাংশ দেখা যাবে।",
    addTopicTitle: "টপিক যোগ করুন", subjectLabel: "সাবজেক্ট", subjectPlaceholder: "যেমন: Physics, বাংলা...",
    pickSubject: "একটা সাবজেক্ট বেছে নাও, বা নিচে নতুন লিখো", newSubjectAutoSaved: "এখানে নতুন যা লিখবে সেটাও তোমার সাবজেক্ট লিস্টে যোগ হয়ে যাবে।",
    lightMode: "লাইট মোডে যান", darkMode: "ডার্ক মোডে যান",
    themeSystem: "সিস্টেম", themeLight: "লাইট", themeDark: "ডার্ক",
    topicLabel: "টপিক", topicPlaceholder: "যেমন: নিউটনের সূত্র",
    durationLabel: "সময়কাল (মিনিট)", cancel: "বাতিল", add: "যোগ করো",
    dayDetail: "দিনের বিবরণ", planned: "পরিকল্পিত", done: "সম্পন্ন", notDone: "সম্পন্ন হয়নি", noData: "এই দিনের কোনো তথ্য নেই।",
    noSubjectData: "এই সময়ের জন্য কোনো সাবজেক্ট তথ্য নেই।",
    minutes: "মিনিট", close: "বন্ধ", deleteTopic: "মুছুন",
    confirmDeleteTopic: "এই টপিকটি মুছে ফেলবে?", confirmDelete: "হ্যাঁ, মুছে ফেলো",
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
    addTimeToggle: "নির্দিষ্ট সময় যোগ করবো", noTimeSet: "সময় নির্ধারিত নেই", amLabel: "AM", pmLabel: "PM",
    remainingHeader: "বাকি আছে", doneHeader: "শেষ হয়েছে",
    next7Days: "পরের ৭ দিন", subjectTimeBreakdown: "সাবজেক্ট অনুযায়ী সময়ের হিসাব", noTimeData: "এখনো কোনো টপিক শেষ হয়নি।",
    overview: "সারসংক্ষেপ", caughtUpNote: "পরে শেষ হয়েছে",
    examSubjects: "এক্সাম সাবজেক্ট", manageExams: "এক্সাম ম্যানেজ করো", addExam: "এক্সাম সাবজেক্ট যোগ করো",
    examDateLabel: "এক্সামের তারিখ (ঐচ্ছিক)", noExamSubjects: "এখনো কোনো এক্সাম সাবজেক্ট নেই। যেসব বিষয়ে এক্সাম দিচ্ছেন সেগুলো যোগ করুন।",
    noDateSet: "তারিখ নির্ধারিত নেই", daysLeftLabel: "দিন বাকি", examToday: "আজ এক্সাম", examPassed: "এক্সাম শেষ",
    removeExam: "মুছুন", nextExam: "পরবর্তী এক্সাম", noUpcomingExam: "কোনো এক্সামের তারিখ নির্ধারিত নেই", examOverview: "সব এক্সাম সাবজেক্টের সামগ্রিক চিত্র",
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
    settings: "সেটিংস", language: "ভাষা", theme: "থিম",
    aboutUs: "আমাদের সম্পর্কে", appName: "FocusGo", version: "ভার্সন",
    aboutTagline: "Make every day count.",
    aboutBody: "FocusGo একটি স্টাডি সঙ্গী — শিক্ষার্থীদের পরিকল্পনা করতে, মনোযোগী থাকতে, এবং দিন-প্রতিদিন অগ্রগতি ট্র্যাক করতে সাহায্য করার জন্য বানানো।",
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

const SUBJECT_COLORS = [
  { bg: "#3B8686", bgSoft: "rgba(59,134,134,0.14)" },
  { bg: "#6E8B5E", bgSoft: "rgba(110,139,94,0.14)" },
  { bg: "#7E6EC9", bgSoft: "rgba(126,110,201,0.14)" },
  { bg: "#C08A2E", bgSoft: "rgba(192,138,46,0.14)" },
  { bg: "#4C8FA6", bgSoft: "rgba(76,143,166,0.14)" },
  { bg: "#B25B8F", bgSoft: "rgba(178,91,143,0.14)" },
  { bg: "#5C6BC0", bgSoft: "rgba(92,107,192,0.14)" },
  { bg: "#8A7355", bgSoft: "rgba(138,115,85,0.14)" },
];
const colorForSubject = (name, subjects) => {
  const idx = subjects.indexOf(name);
  return SUBJECT_COLORS[(idx < 0 ? 0 : idx) % SUBJECT_COLORS.length];
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
function RecentTopicChips({ topics, onPick, accent, cardBorder, textMuted2, dark }) {
  if (!topics.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {topics.map((topic) => (
        <button
          key={topic}
          type="button"
          onClick={() => onPick(topic)}
          title={topic}
          style={{
            border: `1px solid ${cardBorder}`,
            background: dark ? "#121110" : "#F8F5EE",
            color: textMuted2,
            borderRadius: 20,
            padding: "6px 12px",
            fontSize: 11.5,
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
const Num = ({ children }) => <span style={{ fontFamily: "'Noto Sans Bengali','Hind Siliguri',serif" }}>{children}</span>;

// Light haptic tick for navigation (tabs, opening calendar/day views, etc). No-op on devices/browsers without support.
const vibrate = (pattern = 12) => {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
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

export default function FocusGo() {
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
    addLink("stylesheet", "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&family=Bebas+Neue&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap");
  }, []);

  const breakpoint = useViewport(); // "mobile" | "tablet" | "desktop"
  const [lang, setLang] = useState("en");
  // থিম: system / light / dark — ডিফল্ট "system", ডিভাইসের prefers-color-scheme অনুযায়ী ঠিক হয়
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const saved = window.localStorage.getItem("focusgo_theme_mode_v2");
      return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
    } catch (e) {
      return "system";
    }
  }); // "system" | "light" | "dark"

  // Keep the selected theme across browser refreshes without waiting for Firestore.
  useEffect(() => {
    try { window.localStorage.setItem("focusgo_theme_mode_v2", themeMode); } catch (e) {}
  }, [themeMode]);
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
  const dark = themeMode === "system" ? systemPrefersDark : themeMode === "dark";
  const [tab, setTab] = useState("today");
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false); // "Continue without an account" — data stays in-memory only, never synced
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
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // এডিট করার জন্য সিলেক্টেড টাস্ক অবজেক্ট, নাহলে null
  const [taskMenuOpenId, setTaskMenuOpenId] = useState(null); // কোন টাস্ক কার্ডের "..." মেনু খোলা আছে
  const [taskDeleteConfirmId, setTaskDeleteConfirmId] = useState(null); // ভুলে ডিলিট এড়াতে — মেনুর ভেতরেই কনফার্ম ধাপ
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
      const nextInstance = { ...target, id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`, dueDate: nextDue, done: false };
      return [nextInstance, ...ts.map(x => x.id === id ? { ...x, done: true } : x)];
    }
    return ts.map(x => x.id === id ? { ...x, done: !x.done } : x);
  });
  const deleteTask = (id) => setTasks(ts => ts.filter(x => x.id !== id));
  const addTask = (newTask) => setTasks(ts => [newTask, ...ts]);
  const updateTask = (updated) => setTasks(ts => ts.map(x => x.id === updated.id ? { ...x, ...updated } : x));
  const [topicBank, setTopicBank] = useState({}); // subject -> [topicName, ...] — pre-added topics for Today's Study/Plan, subject-scoped (mirrors examSubjects' subject->topics shape but as a flat list, no attempts)
  const [showManageTopicsFor, setShowManageTopicsFor] = useState(null); // subject name | null — which subject's topic-bank editor is open
  const [examSubjects, setExamSubjects] = useState({}); // subject -> { topics: { [topicName]: { attempts: [{id, date, obtained, total}] } } }
  const [combinedExams, setCombinedExams] = useState({}); // id -> { name, type: "daily"|"weekly"|"monthly", subjects: [names], attempts: [{id, date, obtained, total}] }
  const [nextExam, setNextExam] = useState(null); // { subject, topic, date } | null
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
  const pushNotification = (title, body, flagKey) => {
    if (flagKey) {
      if (notifiedFlagsRef.current[flagKey]) return;
      notifiedFlagsRef.current[flagKey] = true;
      saveNotifiedFlags();
    }
    setNotifications(prev => [{ id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, title, body, time: new Date().toISOString(), read: false }, ...prev].slice(0, 50));
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
  const [showAllSubjectsProgress, setShowAllSubjectsProgress] = useState(false); // Stats-এ Subject Progress গ্রিড — সাবজেক্ট বেশি হলে ডিফল্টে ৬টা দেখায়, "See all" চাপলে বাকিগুলো
  const [planDate, setPlanDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; });
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
  const [freeSessionTouched, setFreeSessionTouched] = useState(false); // Free Session pill explicitly click না করা পর্যন্ত duration presets দেখানো হয় না
  const [timerSeconds, setTimerSeconds] = useState(30*60);
  const [timerTotal, setTimerTotal] = useState(30*60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [editingDuration, setEditingDuration] = useState(false);
  const [durationInput, setDurationInput] = useState("");
  const [focusMode, setFocusMode] = useState("timer"); // "timer" | "stopwatch"
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [focusFullscreen, setFocusFullscreen] = useState(false);
  const focusFullscreenActiveRef = useRef(false); // popstate হ্যান্ডলারের ভেতর থেকে সবসময় সবশেষ ফুলস্ক্রিন অবস্থা জানার জন্য
  const pushedFocusHistoryRef = useRef(false); // ফুলস্ক্রিন টাইমার খোলার সময় history-তে state push করেছি কিনা
  const [editTopic, setEditTopic] = useState(null);
  // ---- Pomodoro: session type (focus/break), remembered durations, and cycle progress ----
  const [sessionType, setSessionType] = useState("focus"); // "focus" | "break"
  const [focusMinutes, setFocusMinutes] = useState(30); // last-selected Focus duration (minutes)
  const [breakMinutes, setBreakMinutes] = useState(5); // last-selected Break duration (minutes)
  const [pomodoroSession, setPomodoroSession] = useState(1); // current Focus session number, 1..pomodoroTotalSessions
  const [pomodoroTotalSessions, setPomodoroTotalSessions] = useState(4); // সাধারণ ফ্রি সেশনে ৪, টপিক-লিঙ্কড মাল্টি-সেশনে dynamic (ceil(target/chunk))
  const TOPIC_SESSION_CHUNK_MIN = 30; // টপিক থেকে টাইমার শুরু করলে প্রতিটি ফোকাস সেশনের ডিফল্ট দৈর্ঘ্য (মিনিট) — ৩০ মিনিটের বেশি হলে একাধিক সেশনে ভাগ হয়ে যাবে
  const [timerTargetMinutes, setTimerTargetMinutes] = useState(null); // টপিক-লিঙ্কড মাল্টি-সেশন চললে মোট টার্গেট মিনিট, নাহলে null (ফ্রি সেশন — পুরনো আচরণ)
  const [timerElapsedMinutes, setTimerElapsedMinutes] = useState(0); // এই টপিকের জন্য এ পর্যন্ত সম্পন্ন হওয়া ফোকাস মিনিট (target-এর বিপরীতে)
  const [showBreakPrompt, setShowBreakPrompt] = useState(false); // "Focus complete — take a break?" prompt
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
    const el = document.documentElement;
    if (focusFullscreen) {
      const reqFs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
      const lockOrientation = () => {
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
      if (next) { setFocusFullscreen(true); playStartSound(); vibrate(); }
      return next;
    });
  };
  const toggleStopwatchRunning = () => {
    setStopwatchRunning(r => {
      const next = !r;
      if (next) { setFocusFullscreen(true); playStartSound(); vibrate(); }
      return next;
    });
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
              // cached.tasks/cached.notes ইচ্ছাকৃতভাবে এখানে সেট করা হয়নি — এই ইউজারের জন্য এখনো কোনো cache
              // তৈরি না হয়ে থাকলে (আপডেটের পর প্রথমবার), init-এ থাকা পুরনো localStorage fallback-টাই থেকে যাবে,
              // এবং নিচের Firestore listener এসে সেটাকেই cloud-এ মাইগ্রেট করে দেবে
              if (cached.tasks) setTasks(cached.tasks);
              if (cached.notes) setNotes(cached.notes);
              if (cached.lang) setLang(cached.lang);
              if (cached.themeMode && !themeLoadedOnceRef.current) { setThemeMode(cached.themeMode); themeLoadedOnceRef.current = true; }
              setLoaded(true);
            }
          }
        } catch (e) {
          // Ignore broken/old local cache; Firestore remains the source of truth.
        }
      } else {
        // Sign out — remove the previous user's in-memory data (tasks/notes-ও, নাহলে একই ডিভাইসে
        // অন্য একাউন্টে লগইন করলে আগের ইউজারের টাস্ক/নোট দেখা যাওয়ার ঝুঁকি থাকে)
        setEntries({}); setSubjects([]); setTopicBank({}); setExamSubjects({}); setCombinedExams({}); setNextExam(null);
        setTasks([]); setNotes([]);
        setLoaded(false);
        setServerSynced(false);
      }
    });
    return () => unsubscribe();
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
          if (saved.tasks) setTasks(saved.tasks);
          if (saved.notes) setNotes(saved.notes);
          if (saved.lang) setLang(saved.lang);
          if (saved.themeMode && !themeLoadedOnceRef.current) { setThemeMode(saved.themeMode); themeLoadedOnceRef.current = true; }
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
      saveGuestData({ entries, subjects, topicBank, examSubjects, combinedExams, nextExam, tasks, notes, lang, themeMode });
    }, 600);
    return () => clearTimeout(timer);
  }, [entries, subjects, topicBank, examSubjects, combinedExams, nextExam, tasks, notes, lang, themeMode, loaded, user, isGuest]);

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
              (data.tasks && data.tasks.length) ||
              (data.notes && data.notes.length);
            if (nonEmpty) hadServerDataRef.current = true;
            const incomingKey = JSON.stringify({
              entries: data.entries, subjects: data.subjects, topicBank: data.topicBank, examSubjects: data.examSubjects,
              combinedExams: data.combinedExams, nextExam: data.nextExam, tasks: data.tasks, notes: data.notes,
              lang: data.lang, themeMode: data.themeMode,
            });
            // যদি এই data আমাদেরই সবশেষ write-এর echo হয়, আবার setState করে re-render/re-save লুপ তৈরি করার দরকার নেই
            if (incomingKey !== lastSavedPayloadRef.current) {
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
              // data.tasks/data.notes না থাকলে (এই ইউজারের জন্য এখনো কোনোদিন cloud-এ সেভ হয়নি — যেমন এই
              // ফিক্সের পর প্রথমবার) লোকাল state (পুরনো localStorage থেকে আসা) অপরিবর্তিত থাকবে, যাতে সেটা
              // মুছে না গিয়ে বরং নিচের write effect এটাকেই প্রথমবার Firestore-এ মাইগ্রেট করে দেয়
              if (data.tasks) setTasks(data.tasks);
              if (data.notes) setNotes(data.notes);
              if (data.lang) setLang(data.lang);
              if (data.themeMode && !themeLoadedOnceRef.current) { setThemeMode(data.themeMode); themeLoadedOnceRef.current = true; }
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
      tasks.length === 0 &&
      notes.length === 0;
    if (isEffectivelyEmpty && hadServerDataRef.current) {
      console.warn("FocusGo: সন্দেহজনক খালি write আটকে দেওয়া হলো — Firestore-এর আসল ডেটা সুরক্ষিত থাকল।");
      return;
    }

    const payload = {
      entries, subjects, topicBank, examSubjects, combinedExams, nextExam, tasks, notes, lang, themeMode,
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
      lastSavedPayloadRef.current = JSON.stringify({ entries, subjects, topicBank, examSubjects, combinedExams, nextExam, tasks, notes, lang, themeMode });
      setDoc(doc(db, "users", user.uid), payload, { merge: true })
        .catch(e => console.error("Firestore save error:", e));
      // দৈনিক অটো-ব্যাকআপ — প্রতিদিন একবার (তারিখ অনুযায়ী ডকুমেন্ট আইডি, তাই বারবার ওভাররাইট হয়, জমতে থাকে না)।
      // ভবিষ্যতে কোনো bug বা ভুলবশত ডিলিট হলে এখান থেকে আগের দিনের ডেটা ফিরিয়ে আনা যাবে।
      if (!isEffectivelyEmpty) {
        const backupId = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        setDoc(doc(db, "users", user.uid, "backups", backupId), payload)
          .catch(e => console.error("Firestore backup save error:", e));
      }
    }, 600); // দ্রুত একের পর এক change হলে বারবার write না করে একবারে সেভ করা
    return () => clearTimeout(t);
  }, [entries, subjects, topicBank, examSubjects, combinedExams, nextExam, tasks, notes, lang, themeMode, serverSynced, user]);

  // clock tick
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // timer tick
  // মোবাইলে অ্যাপ থেকে বের হয়ে (ব্যাকগ্রাউন্ডে) থাকলে ব্রাউজার setInterval-কে
  // থ্রটল/পজ করে দেয়, তাই আগের কোডে (প্রতি টিকে -1 করে) ফিরে এসে ঘড়ি "থেমে/আটকে"
  // আছে মনে হতো। এখন আসল ওয়াল-ক্লক সময় (Date.now()) দিয়ে হিসাব হয় এবং ট্যাব আবার
  // visible হলে সাথে সাথে রিক্যালকুলেট হয়, তাই ফিরে এসেই সঠিক সময় দেখা যাবে।
  useEffect(() => {
    if (timerRunning) {
      timerEndAtRef.current = Date.now() + Math.max(0, timerSeconds) * 1000;
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
                pushNotification(t.notifTopicDoneTitle, t.notifTopicDoneBody);
                return;
              }
              setTimerElapsedMinutes(newElapsed);
            }
            setShowBreakPrompt(true);
            pushNotification(t.notifSessionDoneTitle, t.notifSessionDoneBody);
          } else {
            // Break শেষ — পরের Focus session সাথে সাথে শুরু হয়ে যাবে, timer running-ই থাকবে (তাই interval restart লাগবে না)
            vibrate();
            pushNotification(t.notifBreakDoneTitle, t.notifBreakDoneBody);
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

  // ---- plan tab: next 7 days, starting tomorrow ----
  const planDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i + 1); return d; });
  const planKey = dateKey(planDate);
  const isPlanToday = planKey === todayKey;
  const planTopics = entries[planKey] || [];

  // ---- generalized entry CRUD (works for any date, so Plan tab can reuse) ----
  const addTopicFor = (dk, { subject, topic, time, endTime, duration }) => {
    setEntries(prev => {
      const list = prev[dk] ? [...prev[dk]] : [];
      list.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`, subject, topic, duration: duration || 30, done: false, time, endTime });
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
    setEntries(prev => {
      const list = (prev[dk] || []).filter(x => x.id !== id);
      return { ...prev, [dk]: list };
    });
    if (timerTopicId === id) setTimerTopicId(null);
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
    setFocusFullscreen(true);
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
    setFocusFullscreen(true);
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
    // streak: consecutive days up to today with at least one completed topic
    let streak = 0;
    let cursor = new Date(today);
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

    // 1) Exam reminder — nextExam-এর তারিখ ৩ দিন, ১ দিন, বা আজকে হলে
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
  }, [loaded, nowMinute, nextExam, todayKey, entries]);

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
      const isWeekEnd = new Date(y, m, d).getDay() === 6; // Saturday closes a week (weeks start Sunday)
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
    return set;
  })();

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
  const monthName = (i) => lang === "bn" ? MONTHS_BN[i] : MONTHS_EN[i];
  const weekdayName = (d) => lang === "bn" ? WEEKDAYS_BN[d.getDay()] : WEEKDAYS_EN[d.getDay()];
  const weekdayShort = (d) => lang === "bn" ? WEEKDAYS_SHORT_BN[d.getDay()] : WEEKDAYS_SHORT_EN[d.getDay()];

  const fmtTime = (h, m, s) => <>{<Num>{nf(pad2(h))}</Num>}:{<Num>{nf(pad2(m))}</Num>}{s !== undefined ? <>:{<Num>{nf(pad2(s))}</Num>}</> : null}</>;

  // theme tokens
  const bg = dark ? "#121110" : "#FAFAF8";
  const cardBg = dark ? "#1B1815" : "#FFFFFF";
  const cardBorder = dark ? "#2C2820" : "#E9E3D6";
  const textMain = dark ? "#F3EFE7" : "#211D18";
  const textMuted = dark ? "#9C948400" : "#8A8272";
  const textMuted2 = dark ? "#A69E8C" : "#8A8272";
  const accent = "#D97757";
  const accentLight = dark ? "#3A2A22" : "#FBEAE0"; // primary light — very light peach, শুধু active/selected state-এর হালকা background-এ ব্যবহার হবে
  const neutralIconBg = dark ? "#26231D" : "#F3EEE3"; // decorative icon/avatar background — orange নয়, warm neutral
  const neutralIconColor = dark ? "#C9C0AC" : "#6B6353"; // decorative icon color — warm gray, orange নয়

  // ডেস্কটপ (≥1024px): বাম সাইডবার নেভিগেশন থাকবে, bottom dock হাইড হবে, আর content column
  // single-column-এই থাকবে কিন্তু zoom দিয়ে গোটা কনটেন্ট একসাথে বড় দেখানো হয় (অন্য অ্যাপগুলোর মতো)
  const isDesktop = breakpoint === "desktop";
  // আগে zoom 1.4 আর maxWidth cap 1080px ছিল — বড় স্ক্রিনে সবকিছু অনেক বেশি "চাপানো"/ঠাসা লাগছিল।
  // এখন একটু কমিয়ে আনা হলো, যাতে বড় দেখাবে কিন্তু ঘিঞ্জি না লাগে।
  const desktopZoom = isDesktop ? 1.18 : 1;
  const containerMaxWidth = isDesktop
    ? 1400
    : breakpoint === "tablet" ? 640 : 480;
  const containerPadding = isDesktop ? "24px 28px 36px" : breakpoint === "tablet" ? "22px 24px 28px" : "18px 16px 24px";

  const styles = {
    page: { minHeight: "100dvh", background: bg, color: textMain, fontFamily: lang === "bn" ? "'Hind Siliguri','Noto Sans Bengali',sans-serif" : "'Inter','Helvetica Neue',sans-serif", transition: "background .22s ease,color .22s ease", display:"flex", flexDirection:"column" },
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
      // আগে এখানে overscrollBehaviorY:"none" সেট করা হতো, যেটা ব্রাউজারের নিজস্ব
      // "উপর থেকে টেনে রিফ্রেশ" (pull-to-refresh) গেসচারটাও বন্ধ করে দিচ্ছিল।
      // এখন সেটা সরিয়ে দেওয়া হলো, যাতে ইউজার চাইলে উপর থেকে নিচে ধীরে টেনে
      // পেজ ম্যানুয়ালি রিফ্রেশ করতে পারে (কোনো auto-refresh নেই, শুধু এই gesture)।

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
      StatusBar.setBackgroundColor({ color: themeColor }).catch(()=>{});
      StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(()=>{});
    } catch (e) { /* ignore */ }
  }, [dark, bg, focusFullscreen]);

  // Native app খুললে notification permission চাওয়া হবে (একবারই) —
  // এটা না করলে Android নিজেই ধরে নেয় app টা কোনো notification পাঠায় না,
  // এবং system settings-এ toggle disabled/off দেখায়।
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setupNotifications().catch(() => {});
    }
  }, []);


  // Firebase এখনো auth স্টেট জানায়নি — একটা ছোট লোডিং স্ক্রিন
  if (!authChecked) {
    return (
      <div style={{
        minHeight:"100dvh",
        width:"100%",
        background:dark ? "#11100F" : "#F7F3ED",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        overflow:"hidden",
        fontFamily:lang === "bn" ? "'Hind Siliguri','Noto Sans Bengali',sans-serif" : "'Inter','Helvetica Neue',sans-serif",
      }}>
        <div style={{
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
          justifyContent:"center",
          gap:18,
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
            fontSize:13,
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
          gap:18,
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
            fontSize:12,
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
    <div style={{...styles.page, flexDirection: isDesktop ? "row" : "column"}}>
      <style>{`
        html, body { margin:0; padding:0; background:${bg}; }
        #root, #__next { background:${bg}; }

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
      `}</style>
      {isDesktop && !sidebarHidden && (
        <DesktopSidebar t={t} tab={tab} setTab={setTab} vibrate={vibrate} dark={dark} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(v => !v)} onHideAll={() => setSidebarHidden(true)} />
      )}
      {isDesktop && sidebarHidden && (
        <div style={{ width: 40, flexShrink: 0, borderRight: `1px solid ${cardBorder}`, display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 8px", position: "sticky", top: 0, height: "100dvh", boxSizing: "border-box" }}>
          <button type="button" onClick={() => { vibrate(); setSidebarHidden(false); }} title="সাইডবার দেখান"
            style={{ border: `1px solid ${cardBorder}`, background: cardBg, color: textMuted2, borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Eye size={14} />
          </button>
        </div>
      )}
      <div style={{flex:"1 1 auto", display:"flex", flexDirection:"column", minWidth:0, ...(isDesktop ? { zoom: desktopZoom } : {})}}>
      <div style={styles.container}>
        {/* Header row: logo | clock | toggles */}
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap: 8}}>
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <button onClick={()=>{vibrate(); setTab("today");}} title={t.tabs.today}
              style={{display:"flex", alignItems:"center", gap:10, border:"none", background:"transparent", cursor:"pointer", padding:0}}>
              <img src={dark ? LOGO_FULL_DARK : LOGO_FULL} alt="FocusGo" style={{height:26, width:"auto", objectFit:"contain"}}/>
            </button>
          </div>

          <div style={{display:"flex", alignItems:"center", gap:6}}>
            {!isOnline && (
              <div title={t.offlineNote} style={{display:"flex", alignItems:"center", gap:4, border:`1px solid ${cardBorder}`, background: dark?"#2C2820":"#F8F5EE", color:textMuted2, borderRadius:20, padding:"5px 9px 5px 8px", fontSize:10.5, fontWeight:700, flexShrink:0}}>
                <WifiOff size={12}/> {t.offlineBadge}
              </div>
            )}
            <button onClick={()=>{vibrate(); setThemeMode(themeMode==="system" ? "light" : themeMode==="light" ? "dark" : "system");}}
              title={themeMode==="system" ? t.themeSystem : themeMode==="light" ? t.themeLight : t.themeDark}
              style={{border:`1px solid ${cardBorder}`, background:cardBg, color:textMuted2, borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0}}>
              {themeMode==="system" ? <Contrast size={16}/> : themeMode==="light" ? <Sun size={16}/> : <Moon size={16}/>}
            </button>
            <NotificationBell
              t={t} lang={lang} notifications={notifications}
              onMarkAllRead={()=>setNotifications(prev => prev.map(n => ({...n, read:true})))}
              onClear={()=>setNotifications([])}
              cardBorder={cardBorder} cardBg={cardBg} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}
            />
            <UserMenu
              onOpenProfile={()=>{vibrate(); setShowProfile(true);}}
              onOpenSettings={()=>{vibrate(); setShowSettings(true);}}
              cardBorder={cardBorder} cardBg={cardBg} textMain={textMain} textMuted2={textMuted2}
              user={user} profileLabel={t.profile} settingsLabel={t.settings}
            />
          </div>
        </div>

        {/* Date row — Today tab এর নিজস্ব অ্যাঙ্কর (weekday + বড় তারিখ + লাইভ ক্লক), তাই শুধু Today-তেই দেখানো হয়।
            Plan-এর নিজস্ব date-selector আছে বলে এখানে আলাদা "আজকের" হেডার লাগে না (দুই তারিখ পাশাপাশি দেখালে বিভ্রান্তি হয়),
            আর Stats/Exam-এ এর কোনো কাজ নেই — শুধু ছোট মোবাইল স্ক্রিনে জায়গা নিত এবং প্রতি সেকেন্ডে অপ্রয়োজনীয় re-render ঘটাত। */}
        {tab === "today" && (
        <div style={{marginTop:18}}>
          <div style={{marginBottom:2}}>
            {(() => {
              const fullName = (user?.displayName || "").trim();
              const parts = fullName.split(/\s+/).filter(Boolean);
              // Md./Mr./Mrs./Miss/Ms./Dr. এই ধরনের honorific প্রথম word হিসেবে থাকলে বাদ দিয়ে তার পরের word-টাকে First Name ধরা হয়
              const HONORIFIC_RE = /^(md|mr|mrs|miss|ms|dr|mohammad|mohammed)\.?$/i;
              const firstName = parts.find(p => !HONORIFIC_RE.test(p)) || (lang === "bn" ? "বন্ধু" : "Maruf");
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

              // সময় অনুযায়ী গ্রিটিং — Good morning / afternoon / evening / night
              const hr = now.getHours();
              const greetKey = hr < 12 ? "morning" : hr < 17 ? "afternoon" : hr < 21 ? "evening" : "night";
              const greetingEn = { morning: "Good Morning", afternoon: "Good Afternoon", evening: "Good Evening", night: "Good Night" }[greetKey];
              const greetingBn = { morning: "শুভ সকাল", afternoon: "শুভ বিকেল", evening: "শুভ সন্ধ্যা", night: "শুভ রাত্রি" }[greetKey];

              return (
                <>
                  <div style={{fontSize:13, fontWeight:700, color:textMuted2, letterSpacing:0.2}}>
                    {lang === "bn" ? greetingBn : greetingEn}
                  </div>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                    <div style={{fontSize:22,fontWeight:800,letterSpacing:-0.4,color:textMain}}>
                      {firstName}
                    </div>
                    <button onClick={()=>{vibrate(); setShowCalendar(true); setCalMonth(new Date());}} style={{
                      border:"none",
                      background:"transparent",
                      borderRadius:10,
                      width:34,
                      height:34,
                      padding:0,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      cursor:"pointer",
                      flexShrink:0,
                      position:"relative",
                    }}>
                      <CalendarDays size={22} color={accent} strokeWidth={2}/>
                      {examDateKeys.has(todayKey) && (
                        <span style={{
                          position:"absolute", top:4, right:4,
                          width:7, height:7, borderRadius:"50%",
                          background:"#C0392B",
                          border:`1.5px solid ${cardBg}`,
                        }}/>
                      )}
                    </button>
                  </div>
                  <div style={{fontSize:12,color:textMuted2,marginTop:0,lineHeight:1.4}}>
                    {line}
                  </div>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8}}>
                    <span style={{fontSize:13, fontWeight:600, color:textMain, letterSpacing:-0.1}}>
                      {weekdayName(today)}, <Num>{nf(today.getDate())}</Num> {monthName(today.getMonth())}
                    </span>
                    <span style={{
                      fontSize:13, color:textMuted2, fontWeight:500, fontVariantNumeric:"tabular-nums",
                    }}>
                      <Num>{nf(pad2(((now.getHours()%12)||12)))}</Num>:<Num>{nf(pad2(now.getMinutes()))}</Num> {now.getHours()>=12 ? t.pmLabel : t.amLabel}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
        )}

        {tab === "study" && (
          <div className="fg-tab-panel" style={{marginTop:18, marginBottom:-2}}>
            <div style={{fontSize:21, fontWeight:800, letterSpacing:-0.4, color:textMain}}>Study</div>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginTop:3}}>
              <div style={{fontSize:12, color:textMuted2}}>Plan, focus, and track your study.</div>
              <button onClick={()=>{vibrate(); setShowCalendar(true); setCalMonth(new Date());}} style={{
                border:"none",
                background:"transparent",
                borderRadius:"50%",
                width:32,
                height:32,
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer",
                flexShrink:0,
                position:"relative",
              }}>
                <CalendarDays size={22} color={accent} strokeWidth={2}/>
                {examDateKeys.has(todayKey) && (
                  <span style={{
                    position:"absolute", top:3, right:3,
                    width:7, height:7, borderRadius:"50%",
                    background:"#C0392B",
                    border:`1.5px solid ${cardBg}`,
                  }}/>
                )}
              </button>
            </div>
            <div style={{display:"flex", gap:22, marginTop:16, borderBottom:`1px solid ${cardBorder}`}}>
              <button onClick={()=>{vibrate(); setStudySection("plan");}} style={{border:"none", background:"transparent", cursor:"pointer", padding:"0 0 10px", fontSize:13.5, fontWeight:800, color: studySection==="plan" ? textMain : textMuted2, borderBottom: studySection==="plan" ? `2px solid ${accent}` : "2px solid transparent", marginBottom:-1, transition:"color .18s ease, border-color .18s ease"}}>
                {t.planViewStudy}
              </button>
              <button onClick={()=>{vibrate(); setStudySection("stats");}} style={{border:"none", background:"transparent", cursor:"pointer", padding:"0 0 10px", fontSize:13.5, fontWeight:800, color: studySection==="stats" ? textMain : textMuted2, borderBottom: studySection==="stats" ? `2px solid ${accent}` : "2px solid transparent", marginBottom:-1, transition:"color .18s ease, border-color .18s ease"}}>
                {lang==="bn" ? "স্ট্যাটস" : "Stats"}
              </button>
            </div>
          </div>
        )}
        {/* Focus timer - main home of Study tab (Study Plan sub-section) */}
        {tab === "study" && studySection === "plan" && (
        <div className="fg-tab-panel" style={{marginTop:14, background: cardBg, border:`1px solid ${cardBorder}`, borderRadius:24, padding:"18px 20px 20px", color:textMain, boxShadow: dark ? "0 10px 28px rgba(0,0,0,0.35)" : `0 10px 28px ${accent}1F`, position:"relative", overflow:"hidden"}}>
          <div style={{position:"absolute", top:-60, right:-60, width:160, height:160, borderRadius:"50%", background:`${accent}14`, pointerEvents:"none"}}/>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative"}}>
            <span style={{fontSize:11, letterSpacing:ls(1.5), fontWeight:800, color:textMuted2}}>{t.focusTimer}</span>
            <div style={{display:"flex", alignItems:"center", gap:6}}>
              <div style={{display:"flex", background: dark?"#121110":"#fff", borderRadius:10, padding:2, gap:2}}>
                <button onClick={()=>setFocusMode("timer")} style={{border:"none", borderRadius:8, padding:"3px 8px", fontSize:10, fontWeight:700, cursor:"pointer", background: focusMode==="timer" ? textMain : "transparent", color: focusMode==="timer" ? cardBg : textMuted2}}>{t.timerMode}</button>
                <button onClick={()=>setFocusMode("stopwatch")} style={{border:"none", borderRadius:8, padding:"3px 8px", fontSize:10, fontWeight:700, cursor:"pointer", background: focusMode==="stopwatch" ? textMain : "transparent", color: focusMode==="stopwatch" ? cardBg : textMuted2}}>{t.stopwatchMode}</button>
              </div>
              <button onClick={()=>{vibrate(); setFocusFullscreen(true);}} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, display:"flex", alignItems:"center", padding:4}}>
                <Maximize2 size={15}/>
              </button>
            </div>
          </div>

          {focusMode === "timer" ? (
            <>
              {/* Session Type dropdown: Focus নাকি Break এখন সেট করা হচ্ছে */}
              <div style={{display:"flex", justifyContent:"center", marginTop:8}}>
                <select
                  value={sessionType}
                  disabled={timerRunning}
                  onChange={(e)=>changeSessionType(e.target.value)}
                  title={t.sessionTypeLabel}
                  style={{border:`1px solid ${cardBorder}`, borderRadius:10, padding:"4px 22px 4px 10px", fontSize:11, fontWeight:700, background: dark?"#121110":"#fff", color:textMain, cursor: timerRunning?"default":"pointer", outline:"none", appearance:"auto"}}>
                  <option value="focus">{t.focusOption}</option>
                  <option value="break">{t.breakOption}</option>
                </select>
              </div>
              <div style={{textAlign:"center", margin: timerRunning ? "10px 0 6px" : "6px 0 2px", transition:"margin .25s ease"}}>
                {editingDuration ? (
                  <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:4}}>
                    <input
                      type="number"
                      autoFocus
                      value={durationInput}
                      onChange={(e)=>setDurationInput(e.target.value)}
                      onBlur={commitDurationEdit}
                      onKeyDown={(e)=>{ if (e.key==="Enter") { e.preventDefault(); commitDurationEdit(); } if (e.key==="Escape") setEditingDuration(false); }}
                      min={1}
                      max={180}
                      style={{width:90, fontSize:32, fontWeight:800, fontVariantNumeric:"tabular-nums", letterSpacing:1, color:textMain, background:"transparent", border:"none", borderBottom:`2px solid ${textMain}`, textAlign:"center", outline:"none"}}
                    />
                    <span style={{fontSize:14, fontWeight:700, color:textMuted2}}>{t.minutes}</span>
                  </div>
                ) : (
                  <div onClick={!timerRunning ? startEditDuration : undefined} title={!timerRunning ? t.durationLabel : undefined} style={{fontSize: timerRunning ? 60 : 46, fontWeight:800, fontVariantNumeric:"tabular-nums", letterSpacing:0.5, color: textMain, transition:"font-size .25s ease", cursor: timerRunning ? "default" : "pointer", lineHeight:1}}>
                    <Num>{nf(pad2(Math.floor(timerSeconds/60)))}:{nf(pad2(timerSeconds%60))}</Num>
                  </div>
                )}
                {timerTopic && (
                  !timerRunning ? (
                    <button onClick={()=>{ const next=!showTopicPicker; setShowTopicPicker(next); if (next) setFreeSessionTouched(false); }} style={{display:"inline-flex", alignItems:"center", gap:3, border:"none", background:"transparent", cursor:"pointer", color:textMuted2, fontSize:12, marginTop:2, padding:0}}>
                      {`${timerTopic.subject} — ${timerTopic.topic}`}
                      <ChevronDown size={12} style={{transform: showTopicPicker ? "rotate(180deg)" : "none", transition:"transform .15s ease"}}/>
                    </button>
                  ) : (
                    <div style={{fontSize:12, color:textMuted2, marginTop:2}}>
                      {`${timerTopic.subject} — ${timerTopic.topic}`}
                    </div>
                  )
                )}
                {!timerTopic && !timerRunning && (
                  <button onClick={()=>{ const next=!showTopicPicker; setShowTopicPicker(next); if (next) setFreeSessionTouched(false); }} style={{display:"inline-flex", alignItems:"center", border:"none", background:"transparent", cursor:"pointer", color:textMuted2, marginTop:4, padding:2}}>
                    <ChevronDown size={13} style={{transform: showTopicPicker ? "rotate(180deg)" : "none", transition:"transform .15s ease"}}/>
                  </button>
                )}
                {!timerRunning && showTopicPicker && (
                  <div style={{display:"flex", flexWrap:"wrap", justifyContent:"center", gap:6, marginTop:8}}>
                    <button onClick={()=>{ vibrate(); setTimerTopicId(null); setFreeSessionTouched(true); }} style={{border:`1px solid ${!timerTopic ? "#4C8FA6" : cardBorder}`, background: !timerTopic ? "#4C8FA61A" : "transparent", color: !timerTopic ? "#4C8FA6" : textMuted2, borderRadius:20, padding:"5px 11px", fontSize:11, fontWeight:700, cursor:"pointer"}}>
                      {t.freeSessionOption}
                    </button>
                    {todayTopics.filter(x=>!x.done).map(x => (
                      <button key={x.id} onClick={()=>selectTimerTopic(x)} style={{border:`1px solid ${timerTopicId===x.id ? "#4C8FA6" : cardBorder}`, background: timerTopicId===x.id ? "#4C8FA61A" : "transparent", color: timerTopicId===x.id ? "#4C8FA6" : textMuted2, borderRadius:20, padding:"5px 11px", fontSize:11, fontWeight:700, cursor:"pointer", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                        {x.topic}
                      </button>
                    ))}
                  </div>
                )}
                {!timerRunning && showTopicPicker && freeSessionTouched && (
                  <div style={{display:"flex", justifyContent:"center", gap:6, marginTop:6, flexWrap:"wrap"}}>
                    {(sessionType === "focus" ? [25,30,45,50,60] : [5,10,15]).map(mins => {
                      const active = Math.round(timerTotal/60) === mins;
                      return (
                        <button key={mins} onClick={()=>setPresetDuration(mins)} style={{border:`1px solid ${active ? "#4C8FA6" : cardBorder}`, background: active ? "#4C8FA61A" : "transparent", color: active ? "#4C8FA6" : textMuted2, borderRadius:20, padding:"4px 10px", fontSize:11, fontWeight:700, cursor:"pointer"}}>
                          <Num>{nf(mins)}</Num> {t.minutes}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div style={{display:"flex", gap:8, marginTop:14}}>
                <button
                  onClick={toggleTimerRunning}
                  style={{flex:1, background: accent, border:"none", borderRadius:16, padding:"14px 0", color:"#fff", fontWeight:800, fontSize:15, display:"flex",alignItems:"center",justifyContent:"center", gap:7, cursor:"pointer", boxShadow:`0 8px 18px ${accent}59`}}>
                  {timerRunning ? <Pause size={17} fill="#fff"/> : <Play size={17} fill="#fff"/>} {timerRunning ? t.pause : t.start}
                </button>
                <button onClick={()=>{setTimerRunning(false); setTimerSeconds(timerTotal);}} style={{background: dark?"#332E25":"#F0DCC9", border:"none", borderRadius:16, width:50, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer"}}>
                  <RotateCcw size={17} color={textMain}/>
                </button>
              </div>
              {/* Pomodoro cycle progress: Session X/N + ●●○○○ — N dynamic হয় যদি টপিক থেকে multi-session শুরু হয় */}
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:4, marginTop:10}}>
                <div style={{fontSize:11, fontWeight:700, color:textMuted2}}>
                  {t.sessionLabel} <Num>{nf(pomodoroSession)}</Num>/<Num>{nf(pomodoroTotalSessions)}</Num>
                </div>
                <div style={{display:"flex", gap:5, flexWrap:"wrap", justifyContent:"center", maxWidth:180}}>
                  {Array.from({length:pomodoroTotalSessions}, (_,i)=>i+1).map(i => (
                    <span key={i} style={{fontSize:13, lineHeight:1, color: i===pomodoroSession ? textMain : textMuted2, opacity: i===pomodoroSession ? 1 : 0.45}}>
                      {i===pomodoroSession ? "●" : "○"}
                    </span>
                  ))}
                </div>
                {timerTargetMinutes && (
                  <div style={{fontSize:10.5, color:textMuted2, fontWeight:600, opacity:0.75}}>
                    <Num>{nf(timerElapsedMinutes)}</Num>/<Num>{nf(timerTargetMinutes)}</Num> {t.minutes}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{textAlign:"center", margin: stopwatchRunning ? "10px 0 6px" : "6px 0 2px", transition:"margin .25s ease"}}>
                <div style={{fontSize: stopwatchRunning ? 60 : 46, fontWeight:800, fontVariantNumeric:"tabular-nums", letterSpacing:0.5, color: textMain, transition:"font-size .25s ease", lineHeight:1}}>
                  <Num>{nf(pad2(Math.floor(stopwatchSeconds/60)))}:{nf(pad2(stopwatchSeconds%60))}</Num>
                </div>
                {!stopwatchRunning ? (
                  <button onClick={()=>setShowTopicPicker(v=>!v)} style={{display:"inline-flex", alignItems:"center", gap:3, border:"none", background:"transparent", cursor:"pointer", color:textMuted2, fontSize:12, marginTop:2, padding:0}}>
                    {timerTopic ? `${timerTopic.subject} — ${timerTopic.topic}` : t.pickTopicForTimer}
                    <ChevronDown size={12} style={{transform: showTopicPicker ? "rotate(180deg)" : "none", transition:"transform .15s ease"}}/>
                  </button>
                ) : (
                  <div style={{fontSize:12, color:textMuted2, marginTop:2}}>
                    {timerTopic ? `${timerTopic.subject} — ${timerTopic.topic}` : t.pickTopicForTimer}
                  </div>
                )}
                {!stopwatchRunning && showTopicPicker && (
                  <div style={{display:"flex", flexWrap:"wrap", justifyContent:"center", gap:6, marginTop:8}}>
                    <button onClick={()=>selectTimerTopic(null)} style={{border:`1px solid ${!timerTopic ? "#4C8FA6" : cardBorder}`, background: !timerTopic ? "#4C8FA61A" : "transparent", color: !timerTopic ? "#4C8FA6" : textMuted2, borderRadius:20, padding:"5px 11px", fontSize:11, fontWeight:700, cursor:"pointer"}}>
                      {t.freeSessionOption}
                    </button>
                    {todayTopics.filter(x=>!x.done).map(x => (
                      <button key={x.id} onClick={()=>selectTimerTopic(x)} style={{border:`1px solid ${timerTopicId===x.id ? "#4C8FA6" : cardBorder}`, background: timerTopicId===x.id ? "#4C8FA61A" : "transparent", color: timerTopicId===x.id ? "#4C8FA6" : textMuted2, borderRadius:20, padding:"5px 11px", fontSize:11, fontWeight:700, cursor:"pointer", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                        {x.topic}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{display:"flex", gap:8, marginTop:14}}>
                <button
                  onClick={toggleStopwatchRunning}
                  style={{flex:1, background: accent, border:"none", borderRadius:16, padding:"14px 0", color:"#fff", fontWeight:800, fontSize:15, display:"flex",alignItems:"center",justifyContent:"center", gap:7, cursor:"pointer", boxShadow:`0 8px 18px ${accent}59`}}>
                  {stopwatchRunning ? <Pause size={17} fill="#fff"/> : <Play size={17} fill="#fff"/>} {stopwatchRunning ? t.pause : t.start}
                </button>
                <button onClick={()=>{setStopwatchRunning(false); setStopwatchSeconds(0);}} style={{background: dark?"#332E25":"#F0DCC9", border:"none", borderRadius:16, width:50, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer"}}>
                  <RotateCcw size={17} color={textMain}/>
                </button>
              </div>
            </>
          )}
        </div>
        )}

        {/* Today's study overview card - Today tab + Study tab (shown above Study Plan/Exam) — Option 2: circular progress, premium look */}
        {(tab === "today" || (tab === "study" && studySection === "plan")) && (
        <div className="fg-tab-panel" style={{marginTop:10, background: dark ? "#1E1A16" : cardBg, border: dark ? `1px solid ${accent}40` : `1px solid ${cardBorder}`, borderRadius:16, padding:"16px", position:"relative", overflow:"hidden"}}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:14}}>
            <div style={{display:"flex", alignItems:"center", gap:14, minWidth:0}}>
              <PercentRing pct={todayTopics.length ? Math.round((todayTopics.filter(x=>x.done).length/todayTopics.length)*100) : 0}
                size={72} stroke={6.5} accent={accent} trackColor={dark?"#2C2820":"#EFE9DC"} textMain={textMain}
                caption={t.progressLabel} captionColor={textMuted2} nf={nf}/>
              <div style={{minWidth:0}}>
                <div style={{fontSize:14.5, fontWeight:800, color:textMain, marginBottom:8}}>{t.todaysProgress}</div>
                <div style={{display:"flex", alignItems:"center", gap:7, flexWrap:"wrap"}}>
                  <span style={{display:"inline-flex", alignItems:"center", gap:5, color:"#6E8B5E", background: dark?"rgba(110,139,94,0.18)":"rgba(110,139,94,0.14)", padding:"4px 10px", borderRadius:20, fontSize:12, fontWeight:700}}>
                    <Check size={12} strokeWidth={3}/> <Num>{nf(todayTopics.filter(x=>x.done).length)}</Num> {t.progressCompletedLabel}
                  </span>
                  <span style={{display:"inline-flex", alignItems:"center", gap:5, color:"#C08A2E", background: dark?"rgba(192,138,46,0.2)":"rgba(192,138,46,0.14)", padding:"4px 10px", borderRadius:20, fontSize:12, fontWeight:700}}>
                    <Clock size={12}/> <Num>{nf(todayTopics.length - todayTopics.filter(x=>x.done).length)}</Num> {t.remaining}
                  </span>
                </div>
              </div>
            </div>
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0, gap:3, paddingLeft:14, borderLeft: `1px solid ${cardBorder}`}}>
              <div style={{width:30, height:30, borderRadius:"50%", background: dark?"rgba(192,138,46,0.2)":"rgba(192,138,46,0.12)", display:"flex", alignItems:"center", justifyContent:"center"}}>
                <Flame size={16} color="#C08A2E" fill="#C08A2E55"/>
              </div>
              <div style={{fontSize:16, fontWeight:800, color:"#C08A2E", lineHeight:1}}><Num>{nf(studyOverview.streak)}</Num></div>
              <div style={{fontSize:9, color:textMuted2, fontWeight:600, opacity:0.85, whiteSpace:"nowrap"}}>{t.streakLabel}</div>
            </div>
          </div>
        </div>
        )}

        {/* Today's study list - Today tab + Study tab (shown above Study Plan/Exam) */}
        {(tab === "today" || (tab === "study" && studySection === "plan")) && (
        <div className="fg-tab-panel" style={{marginTop:18}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
            <div style={{fontSize:19, fontWeight:800, letterSpacing:-0.3, color:textMain}}>{t.todaysStudy}</div>
            <button onClick={()=>{setAddTargetKey(todayKey); setShowAdd(true);}} style={{display:"flex",alignItems:"center",gap:5, background: accent, color: "#FFFFFF", border:"none", borderRadius:12, padding:"8px 12px", fontSize:11.5, fontWeight:700, cursor:"pointer"}}>
              <Plus size={13}/> {t.addTopic}
            </button>
          </div>

          <TopicsList items={todayTopics} allSubjects={allSubjects} t={t} nf={nf} lang={lang}
            cardBg={cardBg} cardBorder={cardBorder} textMuted2={textMuted2} textMain={textMain} accent={accent}
            onToggle={(id)=>toggleDoneFor(todayKey, id)} onStartTimer={startTimerFor}
            onEdit={(item)=>setEditTopic({...item, _dk: todayKey})} onDelete={(id)=>deleteTopicFor(todayKey, id)}
            onRename={(item, newTopic)=>saveEditFor(todayKey, {...item, topic:newTopic})}
            emptyText={t.noTopicsToday}/>
        </div>
        )}

        {/* Section spacer — separates "Today's Study" from the Next 7 Days plan below, only in Study tab */}
        {tab === "study" && studySection === "plan" && (
        <div className="fg-tab-panel" style={{marginTop:30}}/>
        )}

        {/* Today's Tasks — after Today's Study */}
        {tab === "today" && (
          <div className="fg-tab-panel" style={{marginTop:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:7,fontSize:19,fontWeight:800,letterSpacing:-0.3,color:textMain}}>
                <ListChecks size={17} color={textMuted2}/>
                Today's Tasks
              </div>
              <span style={{fontSize:11.5,fontWeight:700,color:textMuted2}}>
                {(() => {
                  const left = tasks.filter(x => !x.done).length;
                  return left > 0 ? <><Num>{nf(left)}</Num> {t.taskLeftLabel}</> : t.taskAllDoneLabel;
                })()}
              </span>
            </div>
            {tasks.length > 0 && (() => {
              const doneCount = tasks.filter(x => x.done).length;
              const pct = Math.round((doneCount / tasks.length) * 100);
              return (
                <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:12}}>
                  <div style={{flex:1, height:6, borderRadius:6, background: dark?"#2C2820":"#EFE9DC", overflow:"hidden"}}>
                    <div style={{width:`${pct}%`, height:"100%", borderRadius:6, background:"#6E8B5E", transition:"width .25s ease"}}/>
                  </div>
                  <div style={{fontSize:10.5, fontWeight:700, color:textMuted2, flexShrink:0}}><Num>{nf(pct)}</Num>%</div>
                </div>
              );
            })()}
            {tasks.length === 0 ? (
              <div style={{background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:16,padding:"17px 14px",textAlign:"center",color:textMuted2,fontSize:12}}>
                No tasks for today
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {tasks.map(x => (
                  <div key={x.id} style={{display:"flex",alignItems:"center",gap:10,background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:14,padding:"10px 12px",opacity:x.done?0.55:1}}>
                    <button onClick={()=>{vibrate();toggleTask(x.id);}} style={{width:21,height:21,borderRadius:"50%",flexShrink:0,border:`2px solid ${x.done?"#6E8B5E":cardBorder}`,background:x.done?"#6E8B5E":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:0}}>
                      {x.done && <Check size={12} color="#fff" strokeWidth={3}/>}
                    </button>
                    <div style={{flex:1,minWidth:0,fontSize:12.5,fontWeight:650,color:textMain,textDecoration:x.done?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {x.title}
                    </div>
                    <div style={{position:"relative", flexShrink:0}}>
                      <button onClick={(e)=>{ e.stopPropagation(); setTaskMenuOpenId(v => v===x.id ? null : x.id); setTaskDeleteConfirmId(null); }} style={{border:"none",background:"transparent",color:textMuted2,cursor:"pointer",padding:5}}>
                        <MoreVertical size={16}/>
                      </button>
                      {taskMenuOpenId === x.id && (
                        <>
                          <div onClick={closeTaskMenu} style={{position:"fixed", inset:0, zIndex:59}}/>
                          <div style={{position:"absolute", right:0, top:"100%", marginTop:4, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:10, boxShadow:"0 6px 18px rgba(0,0,0,0.15)", zIndex:60, minWidth:150, overflow:"hidden"}}>
                            {taskDeleteConfirmId === x.id ? (
                              <>
                                <div style={{padding:"9px 12px", fontSize:11.5, color:textMuted2, fontWeight:600}}>{lang==="bn"?"টাস্কটি ডিলিট করবেন?":"Delete this task?"}</div>
                                <button onClick={()=>{ closeTaskMenu(); vibrate(); deleteTask(x.id); }} style={{display:"flex", alignItems:"center", gap:7, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:12.5, fontWeight:700, cursor:"pointer", textAlign:"left"}}>
                                  <Trash2 size={13}/> {lang==="bn"?"ডিলিট নিশ্চিত করুন":"Confirm delete"}
                                </button>
                                <button onClick={()=>setTaskDeleteConfirmId(null)} style={{display:"flex", alignItems:"center", gap:7, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:12.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                                  {t.cancel}
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={()=>{closeTaskMenu(); setEditingTask(x);}} style={{display:"flex", alignItems:"center", gap:7, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:12.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                                  <Pencil size={13}/> {lang==="bn"?"এডিট":"Edit"}
                                </button>
                                <button onClick={()=>setTaskDeleteConfirmId(x.id)} style={{display:"flex", alignItems:"center", gap:7, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:12.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
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
        )}

        {/* STUDY planning section */}
        {tab === "study" && studySection === "plan" && (
          <div key="plan" className="fg-tab-panel" style={{marginTop:20}}>
            <div style={{fontSize:10, letterSpacing:ls(1.5), color:textMuted2, fontWeight:700, opacity:0.85, marginBottom:10}}>{t.next7Days}</div>
            <div style={{display:"flex", justifyContent:"space-between", gap:2, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:"16px 8px"}}>
              {planDays.map((d,i) => {
                const dk = dateKey(d);
                const isSel = dk === planKey;
                const dayList = entries[dk] || [];
                const hasAny = dayList.length > 0;
                const doneAll = hasAny && dayList.every(x=>x.done);
                const statusColor = !hasAny ? textMuted2 : (doneAll ? "#6E8B5E" : "#4C8FA6");
                return (
                  <div key={i} onClick={()=>setPlanDate(d)} style={{textAlign:"center", cursor:"pointer", flex:1, padding:"0 2px"}}>
                    <div style={{fontSize:9, fontWeight:700, color: isSel ? accent : textMuted2, opacity: isSel ? 1 : 0.85, marginBottom:8, letterSpacing:0.3}}>{weekdayShort(d)}</div>
                    <div style={{width:34,height:34, borderRadius:"50%", display:"flex",alignItems:"center",justifyContent:"center", margin:"0 auto", fontSize:13, fontWeight:800,
                      transition:"background .18s ease, color .18s ease, box-shadow .18s ease", boxShadow: isSel ? `0 0 0 1.5px ${accent}` : "none",
                      background:"transparent", color: isSel ? accent : textMain}}>
                      <Num>{nf(d.getDate())}</Num>
                    </div>
                    {/* status dot — same legend colors as Calendar (green completed / blue planned) */}
                    <div style={{marginTop:8, display:"flex", justifyContent:"center"}}>
                      <span style={{width:6, height:6, borderRadius:"50%", background: statusColor, opacity: hasAny ? 1 : 0.3}}/>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:20, marginBottom:12}}>
              <div style={{fontSize:19, fontWeight:800, letterSpacing:-0.3}}>
                {isPlanToday ? t.todaysStudy : <>{weekdayName(planDate)}, <Num>{nf(planDate.getDate())}</Num> {monthName(planDate.getMonth())}</>}
              </div>
              <button onClick={()=>{setAddTargetKey(planKey); setShowAdd(true);}} style={{display:"flex",alignItems:"center",gap:5, background: accent, color: "#FFFFFF", border:"none", borderRadius:12, padding:"9px 13px", fontSize:12, fontWeight:700, cursor:"pointer"}}>
                <Plus size={14}/> {t.addTopic}
              </button>
            </div>

            <TopicsList items={planTopics} allSubjects={allSubjects} t={t} nf={nf} lang={lang}
              cardBg={cardBg} cardBorder={cardBorder} textMuted2={textMuted2} textMain={textMain} accent={accent}
              onToggle={isPlanToday ? (id)=>toggleDoneFor(planKey, id) : null}
              onStartTimer={isPlanToday ? startTimerFor : null}
              onEdit={(item)=>setEditTopic({...item, _dk: planKey})}
              onDelete={(id)=>deleteTopicFor(planKey, id)}
              onRename={(item, newTopic)=>saveEditFor(planKey, {...item, topic:newTopic})}
              emptyText={t.noTopicsPlanned} emptySubtext={t.noTopicsPlannedSub}/>

            {planTopics.length > 0 && (() => {
              const totalMin = planTopics.reduce((sum,x)=>sum+(x.duration||0), 0);
              const h = Math.floor(totalMin/60), m = totalMin%60;
              return (
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12, padding:"10px 14px", background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14}}>
                  <span style={{fontSize:12, fontWeight:700, color:textMuted2}}>{t.totalPlannedLabel}</span>
                  <span style={{fontSize:13, fontWeight:800, color:textMain}}>
                    {h > 0 && <><Num>{nf(h)}</Num>h </>}<Num>{nf(m)}</Num>m
                  </span>
                </div>
              );
            })()}
          </div>
        )}

        {/* TASK tab - simple to-do list, separate from study sessions */}
        {tab === "task" && (() => {
          const prColor = { high: "#C0392B", med: accent, low: "#6E8B5E" };
          const prLabel = { high: t.taskPrHigh, med: t.taskPrMed, low: t.taskPrLow };
          const doneCount = tasks.filter(x => x.done).length;
          const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

          // ---- Due-date helpers: bucket a task into "today" (today/overdue/no-date) or "upcoming" ----
          const tomorrowKey = dateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate()+1));
          const bucketOf = (x) => (!x.dueDate || x.dueDate <= todayKey) ? "today" : "upcoming";
          const dueLabel = (dk) => {
            if (!dk) return null;
            if (dk === todayKey) return { text: t.taskDueToday, color: accent };
            if (dk < todayKey) return { text: t.taskOverdue, color: "#C0392B" };
            if (dk === tomorrowKey) return { text: t.taskDueTomorrow, color: textMuted2 };
            const d = new Date(dk + "T00:00:00");
            const diffDays = Math.round((d - new Date(todayKey + "T00:00:00")) / 86400000);
            if (diffDays > 1 && diffDays < 7) return { text: (lang==="bn" ? WEEKDAYS_BN : WEEKDAYS_EN)[d.getDay()], color: textMuted2 };
            return { text: `${nf(d.getDate())} ${monthName(d.getMonth())}`, color: textMuted2 };
          };

          const filterChips = [
            ["all", t.taskAll, ListChecks],
            ["today", t.taskFilterToday, Calendar],
            ["upcoming", t.taskFilterUpcoming, CalendarDays],
            ["done", t.taskFilterDone, Check],
          ];

          let filteredTasks;
          if (taskFilter === "done") filteredTasks = tasks.filter(x => x.done);
          else if (taskFilter === "today") filteredTasks = tasks.filter(x => bucketOf(x) === "today");
          else if (taskFilter === "upcoming") filteredTasks = tasks.filter(x => bucketOf(x) === "upcoming");
          else filteredTasks = tasks;

          // ---- টাস্ক কার্ড: Study Plan-এর TopicsList কার্ডের মতোই — বড় গোল toggle বাটন, উপরে ক্যাটাগরি ব্যাজ (subject ট্যাগের মতো) ----
          const renderTask = (x) => {
            const isOverdue = !x.done && x.dueDate && x.dueDate < todayKey;
            const cat = findTaskCategory(taskCategories, x.category);
            const CatIcon = taskCategoryIcon(cat.icon);
            const catLabel = x.category === "study" ? t.taskStudy : x.category === "personal" ? t.taskPersonal : (lang === "bn" ? (cat.labelBn || cat.label) : cat.label);
            return (
              <div key={x.id} style={{
                background: x.done ? "rgba(110,139,94,0.07)" : cardBg,
                border: `1px solid ${x.done ? "rgba(110,139,94,0.35)" : cardBorder}`,
                borderRadius:16, padding:"10px 12px", display:"flex", alignItems:"center", gap:10, position:"relative",
                transition:"background .15s ease, border-color .15s ease",
              }}>
                <button onClick={()=>{vibrate(); toggleTask(x.id);}} style={{width:28, height:28, borderRadius:"50%", border:"none", flexShrink:0, cursor:"pointer", background: x.done ? "#6E8B5E" : `${cat.color}1F`, display:"flex", alignItems:"center", justifyContent:"center"}}>
                  {x.done ? <Check size={14} color="#fff" strokeWidth={3}/> : <span style={{width:8,height:8,borderRadius:"50%", background:cat.color}}/>}
                </button>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13.5, fontWeight:500, color:textMain, wordBreak:"break-word", textDecoration: x.done?"line-through":"none", opacity: x.done?0.6:1, marginBottom:4, lineHeight:1.3}}>{x.title}</div>
                  <div style={{display:"flex", alignItems:"center", gap:8, flexWrap:"wrap"}}>
                    {/* আজকের বাইরের যেকোনো টাস্কে ছোট করে শুধু তারিখের নাম্বার (যেমন ০১, ২৮) — done/pending সব ক্ষেত্রেই */}
                    {x.dueDate && x.dueDate !== todayKey && (
                      <span style={{display:"inline-flex", alignItems:"center", fontSize:10, fontWeight:600, color:textMuted2, padding:"3px 7px", borderRadius:20, border:`1px solid ${cardBorder}`, flexShrink:0}}>
                        <Num>{nf(pad2(new Date(x.dueDate+"T00:00:00").getDate()))}</Num>
                      </span>
                    )}
                    {/* ক্যাটাগরি ব্যাজ — আগে টাইটেলের উপরে আলাদা লাইনে ছিল, এখন এখানে মেটা রো-তে দিয়ে কার্ড কম্প্যাক্ট করা হয়েছে */}
                    <span style={{display:"inline-flex", alignItems:"center", gap:4, fontSize:9.5, fontWeight:600, letterSpacing:0.5, color:cat.color, background:`${cat.color}1F`, borderRadius:6, padding:"2px 7px", flexShrink:0}}>
                      <CatIcon size={10}/> {catLabel}
                    </span>
                    <span style={{display:"inline-flex", alignItems:"center", gap:3, fontSize:10, fontWeight:600, color: isOverdue ? "#C0392B" : prColor[x.priority]}}>
                      <span style={{width:5,height:5,borderRadius:"50%", background: isOverdue ? "#C0392B" : prColor[x.priority]}}/>
                      {prLabel[x.priority]}
                    </span>
                    {x.repeat && (
                      <span title={t.taskRepeatBadge} style={{display:"inline-flex", alignItems:"center", color:textMuted2}}>
                        <Repeat size={11}/>
                      </span>
                    )}
                    {x.done ? (
                      <span style={{fontSize:10, fontWeight:600, color:"#6E8B5E"}}>{t.taskCompleted}</span>
                    ) : (() => {
                      const dl = dueLabel(x.dueDate);
                      return dl ? <span style={{fontSize:10, fontWeight:600, color:dl.color}}>{dl.text}</span> : null;
                    })()}
                  </div>
                </div>
                <div style={{position:"relative", flexShrink:0}}>
                  <button onClick={(e)=>{ e.stopPropagation(); setTaskMenuOpenId(v => v===x.id ? null : x.id); setTaskDeleteConfirmId(null); }} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", padding:4}}>
                    <MoreVertical size={16}/>
                  </button>
                  {taskMenuOpenId === x.id && (
                    <>
                      <div onClick={closeTaskMenu} style={{position:"fixed", inset:0, zIndex:59}}/>
                      <div style={{position:"absolute", right:0, top:"100%", marginTop:4, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:10, boxShadow:"0 6px 18px rgba(0,0,0,0.15)", zIndex:60, minWidth:150, overflow:"hidden"}}>
                        {taskDeleteConfirmId === x.id ? (
                          <>
                            <div style={{padding:"9px 12px", fontSize:11.5, color:textMuted2, fontWeight:600}}>{lang==="bn"?"টাস্কটি ডিলিট করবেন?":"Delete this task?"}</div>
                            <button onClick={()=>{ closeTaskMenu(); vibrate(); deleteTask(x.id); }} style={{display:"flex", alignItems:"center", gap:7, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:12.5, fontWeight:700, cursor:"pointer", textAlign:"left"}}>
                              <Trash2 size={13}/> {lang==="bn"?"ডিলিট নিশ্চিত করুন":"Confirm delete"}
                            </button>
                            <button onClick={()=>setTaskDeleteConfirmId(null)} style={{display:"flex", alignItems:"center", gap:7, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:12.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                              {t.cancel}
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={()=>{closeTaskMenu(); setEditingTask(x);}} style={{display:"flex", alignItems:"center", gap:7, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:12.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                              <Pencil size={13}/> {lang==="bn"?"এডিট":"Edit"}
                            </button>
                            <button onClick={()=>setTaskDeleteConfirmId(x.id)} style={{display:"flex", alignItems:"center", gap:7, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:12.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                              <Trash2 size={13}/> {lang==="bn"?"ডিলিট":"Delete"}
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          };


          const emptyMsg = taskFilter === "today" ? t.taskEmptyToday : taskFilter === "upcoming" ? t.taskEmptyUpcoming : taskFilter === "done" ? t.taskEmptyDone : t.taskEmpty;

          // ---- Calendar view: Stats ট্যাবের InlineMonthCalendar-এর মতোই একই ভিজ্যুয়াল স্টাইল (গ্রিড + legend), শুধু ডট রঙ টাস্ক অনুযায়ী (completed/pending/overdue) ----
          const renderTaskCalendarView = () => {
            const y = taskCalMonth.getFullYear(), m = taskCalMonth.getMonth();
            const firstDay = new Date(y, m, 1);
            const startOffset = firstDay.getDay();
            const daysInMonth = new Date(y, m+1, 0).getDate();
            const cells = [];
            for (let i=0;i<startOffset;i++) cells.push(null);
            for (let d=1; d<=daysInMonth; d++) cells.push(new Date(y,m,d));
            const shortDays = lang==="bn" ? ["র","সো","ম","বু","বৃ","শু","শ"] : ["S","M","T","W","T","F","S"];

            const tasksByDay = {};
            tasks.forEach(x => { if (x.dueDate) (tasksByDay[x.dueDate] = tasksByDay[x.dueDate] || []).push(x); });
            const noDateTasks = tasks.filter(x => !x.dueDate);
            const selectedKey = taskCalSelectedDay || todayKey;
            const dayTasks = tasksByDay[selectedKey] || [];
            const selectedDateObj = new Date(selectedKey + "T00:00:00");

            // এই মাসের সামারি — মোট / সম্পন্ন / মেয়াদ-শেষ টাস্ক (calendar গ্রিডের উপরে ছোট overview strip)
            const monthPrefix = `${y}-${pad2(m+1)}-`;
            const monthTasks = tasks.filter(x => x.dueDate && x.dueDate.startsWith(monthPrefix));
            const monthTotal = monthTasks.length;
            const monthDone = monthTasks.filter(x => x.done).length;
            const monthOverdue = monthTasks.filter(x => !x.done && x.dueDate < todayKey).length;
            const monthPct = monthTotal ? Math.round((monthDone/monthTotal)*100) : 0;

            return (
              <div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
                  <button onClick={()=>{vibrate(); setTaskCalMonth(new Date(y,m-1,1));}} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", display:"flex", padding:4}}><ChevronLeft size={18}/></button>
                  <span style={{fontSize:14.5, fontWeight:800, color:textMain}}>{monthName(m)} <Num>{nf(y)}</Num></span>
                  <button onClick={()=>{vibrate(); setTaskCalMonth(new Date(y,m+1,1));}} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", display:"flex", padding:4}}><ChevronRight size={18}/></button>
                </div>

                {/* Month overview strip — মোট/সম্পন্ন/মেয়াদ-শেষ + completion %, একনজরে পুরো মাসের প্যাটার্ন বোঝার জন্য */}
                <div style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:"13px 15px", marginBottom:12}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
                    <div style={{fontSize:11, letterSpacing:ls(1.4), color:textMuted2, fontWeight:700, opacity:0.85}}>{t.taskCalMonthOverview}</div>
                    {monthTotal > 0 && <div style={{fontSize:11.5, fontWeight:800, color:"#6E8B5E"}}><Num>{nf(monthPct)}</Num>%</div>}
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8}}>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:17, fontWeight:800, color:textMain}}><Num>{nf(monthTotal)}</Num></div>
                      <div style={{fontSize:9.5, color:textMuted2, fontWeight:500, opacity:0.65, marginTop:2}}>{t.taskCalMonthTotal}</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:17, fontWeight:800, color:"#6E8B5E"}}><Num>{nf(monthDone)}</Num></div>
                      <div style={{fontSize:9.5, color:textMuted2, fontWeight:500, opacity:0.65, marginTop:2}}>{t.taskCalMonthCompleted}</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:17, fontWeight:800, color: monthOverdue > 0 ? "#C0392B" : textMain}}><Num>{nf(monthOverdue)}</Num></div>
                      <div style={{fontSize:9.5, color:textMuted2, fontWeight:500, opacity:0.65, marginTop:2}}>{t.taskCalMonthOverdue}</div>
                    </div>
                  </div>
                </div>

                <div style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:"14px 12px", marginBottom:14}}>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:8}}>
                    {shortDays.map((d,i)=>(<div key={i} style={{textAlign:"center", fontSize:10.5, fontWeight:700, color:textMuted2}}>{d}</div>))}
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", rowGap:6}}>
                    {cells.map((d,i) => {
                      if (!d) return <div key={i}/>;
                      const dk = dateKey(d);
                      const list = tasksByDay[dk] || [];
                      const hasAny = list.length > 0;
                      const doneAll = hasAny && list.every(x=>x.done);
                      const hasOverdue = list.some(x => !x.done && dk < todayKey);
                      const isToday = dk === todayKey;
                      const isSelected = dk === selectedKey;
                      return (
                        <button key={i} onClick={()=>{vibrate(); setTaskCalSelectedDay(dk);}} style={{
                          display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"4px 0", border:"none", background:"transparent", cursor:"pointer",
                        }}>
                          <div style={{position:"relative", width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700,
                            background: isSelected ? accent : "transparent",
                            border: isToday && !isSelected ? `1px solid ${accent}` : "none",
                            color: isSelected ? "#fff" : (hasOverdue ? "#C0392B" : textMain)}}>
                            <Num>{nf(d.getDate())}</Num>
                          </div>
                          <span style={{width:4, height:4, borderRadius:"50%", background: !hasAny ? "transparent" : (doneAll ? "#6E8B5E" : (hasOverdue ? "#C0392B" : "#4C8FA6"))}}/>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calendar legend — Stats-এর ক্যালেন্ডার legend-এর মতোই একই স্টাইল */}
                <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:14, marginBottom:18, flexWrap:"wrap"}}>
                  <span style={{display:"flex", alignItems:"center", gap:5, fontSize:10.5, color:textMuted2, fontWeight:600}}>
                    <span style={{width:7,height:7,borderRadius:"50%", background:"#6E8B5E"}}/>{t.calendarLegendCompleted}
                  </span>
                  <span style={{display:"flex", alignItems:"center", gap:5, fontSize:10.5, color:textMuted2, fontWeight:600}}>
                    <span style={{width:7,height:7,borderRadius:"50%", background:"#4C8FA6"}}/>{t.calendarLegendPlanned}
                  </span>
                  <span style={{display:"flex", alignItems:"center", gap:5, fontSize:10.5, color:textMuted2, fontWeight:600}}>
                    <span style={{width:7,height:7,borderRadius:"50%", background:"#C0392B"}}/>{t.taskOverdue}
                  </span>
                </div>

                <div style={{fontSize:19, fontWeight:800, letterSpacing:-0.3, color:textMain, marginBottom:12}}>
                  {selectedKey === todayKey ? (lang==="bn" ? "আজ" : "Today") : <>{weekdayName(selectedDateObj)}, <Num>{nf(selectedDateObj.getDate())}</Num> {monthName(selectedDateObj.getMonth())}</>}
                </div>
                {dayTasks.length === 0 ? (
                  <div style={{textAlign:"center", padding:"20px 0", color:textMuted2, fontSize:12.5, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:16, marginBottom: noDateTasks.length ? 18 : 0}}>{t.taskCalEmptyDay}</div>
                ) : (
                  <div style={{display:"flex", flexDirection:"column", gap:9, marginBottom: noDateTasks.length ? 18 : 0}}>{dayTasks.map(renderTask)}</div>
                )}

                {noDateTasks.length > 0 && (
                  <div>
                    <div style={{fontSize:11, fontWeight:800, letterSpacing:ls(1), color:textMuted2, opacity:0.85, marginBottom:9}}>{t.taskCalNoDateTasks}</div>
                    <div style={{display:"flex", flexDirection:"column", gap:9}}>{noDateTasks.map(renderTask)}</div>
                  </div>
                )}
              </div>
            );
          };

          return (
            <>
            <div key="task" className="fg-tab-panel" style={{marginTop:20}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14}}>
                <div style={{fontSize:19, fontWeight:800, letterSpacing:-0.3, color:textMain}}>{t.taskTitle}</div>
                <div style={{display:"flex", alignItems:"center", gap:6, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:20, padding:"6px 12px"}}>
                  <Flame size={13} color={accent}/>
                  <span style={{fontSize:12, fontWeight:700, color:textMain}}><Num>{nf(doneCount)}</Num>/<Num>{nf(tasks.length)}</Num> {t.taskDone}</span>
                </div>
              </div>

              <div style={{height:8, borderRadius:20, background: dark?"#2C2820":"#EFE9DC", marginBottom:16, overflow:"hidden"}}>
                <div style={{height:"100%", width:`${pct}%`, background:accent, borderRadius:20, transition:"width .3s ease"}}/>
              </div>

              {/* List / Calendar ভিউ টগল — Study Plan/Stats-এর মতো একই underline-tab স্টাইল */}
              <div style={{display:"flex", gap:22, marginBottom:12, borderBottom:`1px solid ${cardBorder}`}}>
                {[["list", t.taskViewList, List], ["calendar", t.taskViewCalendar, CalendarRange]].map(([key,label,Icon]) => {
                  const active = taskViewMode === key;
                  return (
                    <button key={key} onClick={()=>{vibrate(); setTaskViewMode(key);}} style={{
                      display:"flex", alignItems:"center", gap:6, border:"none", background:"transparent", cursor:"pointer",
                      padding:"0 0 10px", fontSize:13.5, fontWeight:800,
                      color: active ? textMain : textMuted2,
                      borderBottom: active ? `2px solid ${accent}` : "2px solid transparent",
                      marginBottom:-1, transition:"color .18s ease, border-color .18s ease",
                    }}>
                      <Icon size={14} color={active ? accent : textMuted2}/>
                      {label}
                    </button>
                  );
                })}
              </div>
              <div style={{fontSize:11, color:textMuted2, fontWeight:600, marginBottom:14, opacity:0.85}}>
                {taskViewMode === "list" ? t.taskViewListHint : t.taskViewCalendarHint}
              </div>

              {taskViewMode === "list" ? (
                <>
                  <div style={{display:"flex", gap:8, marginBottom:14, overflowX:"auto"}}>
                    {filterChips.map(([key,label,Icon]) => (
                      <button key={key} onClick={()=>{vibrate(); setTaskFilter(key);}} style={{
                        display:"flex", alignItems:"center", gap:5, padding:"7px 13px", borderRadius:20, cursor:"pointer", flexShrink:0,
                        border:`1px solid ${taskFilter===key ? accent : cardBorder}`,
                        background: taskFilter===key ? accent : "transparent",
                        color: taskFilter===key ? "#fff" : textMuted2, fontWeight:700, fontSize:12,
                      }}>
                        <Icon size={12}/> {label}
                      </button>
                    ))}
                  </div>

                  {filteredTasks.length === 0 && (
                    <div style={{textAlign:"center", padding:"40px 0", color:textMuted2, fontSize:13}}>
                      <Sparkles size={22} style={{marginBottom:8, opacity:0.5}}/>
                      <div>{emptyMsg}</div>
                    </div>
                  )}

                  {filteredTasks.length > 0 && taskFilter === "all" ? (() => {
                    const todayBucket = filteredTasks.filter(x => bucketOf(x) === "today");
                    const upcomingBucket = filteredTasks.filter(x => bucketOf(x) === "upcoming");
                    return (
                      <>
                        {todayBucket.length > 0 && (
                          <div style={{marginBottom: upcomingBucket.length ? 18 : 0}}>
                            <div style={{fontSize:11, fontWeight:600, letterSpacing:ls(1), color:textMuted2, opacity:0.85, marginBottom:9}}>{t.taskSectionToday}</div>
                            <div style={{display:"flex", flexDirection:"column", gap:9}}>{todayBucket.map(renderTask)}</div>
                          </div>
                        )}
                        {upcomingBucket.length > 0 && (
                          <div>
                            <div style={{fontSize:11, fontWeight:600, letterSpacing:ls(1), color:textMuted2, opacity:0.85, marginBottom:9}}>{t.taskSectionUpcoming}</div>
                            <div style={{display:"flex", flexDirection:"column", gap:9}}>{upcomingBucket.map(renderTask)}</div>
                          </div>
                        )}
                      </>
                    );
                  })() : (
                    <div style={{display:"flex", flexDirection:"column", gap:9}}>
                      {filteredTasks.map(renderTask)}
                    </div>
                  )}
                </>
              ) : renderTaskCalendarView()}
            </div>

            {/* ফ্লোটিং + বাটন — ".fg-tab-panel"-এর বাইরে (sibling হিসেবে) রাখা হয়েছে যাতে পেজ-লোড অ্যানিমেশনের transform এটাকে
                উপর থেকে নিচে স্লাইড করিয়ে না আনে — সবসময় বটম-ন্যাভের ঠিক উপরে স্থির থাকবে;
                Calendar view-এ থাকলে ও কোনো দিন সিলেক্ট করা থাকলে সেই দিনটাই নতুন টাস্কের due date হিসেবে prefill হয়ে যাবে */}
            <button onClick={()=>{vibrate(); setTaskAddDefaultDate(taskViewMode === "calendar" ? (taskCalSelectedDay || todayKey) : null); setShowAddTask(true);}} title={t.taskAdd} style={{
              position:"fixed", right:20, bottom: isDesktop ? 28 : 96, zIndex:41,
              width:46, height:46, borderRadius:"50%", border:"none", background:accent, color:"#fff",
              display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
              boxShadow: dark ? "0 8px 20px rgba(0,0,0,0.45)" : "0 8px 20px rgba(217,119,87,0.45)",
            }}>
              <Plus size={21} strokeWidth={2.5}/>
            </button>
          </>
          );
        })()}

        {/* NOTES tab */}
        {tab === "notes" && (
          <NotesView t={t} lang={lang} notes={notes} setNotes={setNotes} search={noteSearch} setSearch={setNoteSearch}
            cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} bg={bg}
            textMuted2={textMuted2} accent={accent} dark={dark} isDesktop={isDesktop}/>
        )}

        {/* STATS sub-section (inside Study tab) - week + subjects + month, one shared day-detail card at the bottom */}
        {tab === "study" && studySection === "stats" && (
          <div key="stats" className="fg-tab-panel" style={{marginTop:22}}>
            {/* Study Overview — headline numbers, justifies the "Stats" name */}
            <div style={{fontSize:19, fontWeight:800, letterSpacing:-0.3, color:textMain, marginBottom:12}}>{t.studyOverview}</div>

            {/* Hero stat — total focused time, the headline number of the whole page */}
            {(() => {
              const h = Math.floor(studyOverview.totalMin/60), m = studyOverview.totalMin%60;
              return (
                <div style={{background: dark ? "linear-gradient(135deg, rgba(76,143,166,0.16), rgba(76,143,166,0.03))" : "linear-gradient(135deg, #4C8FA614, #4C8FA603)", border:`1px solid ${cardBorder}`, borderRadius:18, padding:"22px 18px 20px", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:8, marginBottom:10}}>
                  <div style={{width:44,height:44, borderRadius:13, background: dark?"rgba(76,143,166,0.22)":"#4C8FA61F", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginBottom:2}}>
                    <Clock size={21} color="#4C8FA6"/>
                  </div>
                  <div style={{fontSize:26, fontWeight:800, letterSpacing:-0.6, color:textMain, lineHeight:1.1}}>{h > 0 && <><Num>{nf(h)}</Num>h </>}<Num>{nf(m)}</Num>m</div>
                  <div style={{fontSize:11.5, color:textMuted2, fontWeight:600, opacity:0.8}}>{t.focusedLabel}</div>
                </div>
              );
            })()}

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20}}>
              <div style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"16px 8px 14px", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:8}}>
                <div style={{width:30,height:30, borderRadius:9, background:`rgba(110,139,94,0.15)`, display:"flex", alignItems:"center", justifyContent:"center"}}><Check size={14} color="#6E8B5E"/></div>
                <div style={{fontSize:16, fontWeight:800, letterSpacing:-0.2, color:textMain, lineHeight:1.1}}><Num>{nf(studyOverview.doneCount)}</Num></div>
                <div style={{fontSize:9.5, color:textMuted2, fontWeight:500, opacity:0.65}}>{t.topicsCompletedLabel}</div>
              </div>
              <div style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"16px 8px 14px", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:8}}>
                <div style={{width:30,height:30, borderRadius:9, background: dark?"#26231D":"#F3EEE3", display:"flex", alignItems:"center", justifyContent:"center"}}><TrendingUp size={14} color={dark ? "#C9C0AC" : "#6B6353"}/></div>
                <div style={{fontSize:16, fontWeight:800, letterSpacing:-0.2, color:textMain, lineHeight:1.1}}><Num>{nf(studyOverview.pct)}</Num>%</div>
                <div style={{fontSize:9.5, color:textMuted2, fontWeight:500, opacity:0.65}}>{t.completionLabel}</div>
              </div>
              <div style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"16px 8px 14px", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:8}}>
                <div style={{width:30,height:30, borderRadius:9, background: dark?"#2C2820":"#EFE9DC", display:"flex", alignItems:"center", justifyContent:"center"}}><Flame size={14} color={textMain}/></div>
                <div style={{fontSize:16, fontWeight:800, letterSpacing:-0.2, color:textMain, lineHeight:1.1}}><Num>{nf(studyOverview.streak)}</Num></div>
                <div style={{fontSize:9.5, color:textMuted2, fontWeight:500, opacity:0.65}}>{t.streakLabel}</div>
              </div>
            </div>

            {/* Subject Progress — right after Study Overview */}
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginTop:6, marginBottom:16}}>
              <div style={{display:"flex", alignItems:"center", gap:10, minWidth:0}}>
                <div style={{width:36,height:36, borderRadius:11, background: dark?"#26231D":"#F3EEE3", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                  <GraduationCap size={18} color={dark ? "#C9C0AC" : "#6B6353"}/>
                </div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:16.5, fontWeight:800, letterSpacing:-0.2, color:textMain}}>{t.syllabusProgress}</div>
                  <div style={{fontSize:11, color:textMuted2, fontWeight:500, opacity:0.75}}>{t.subjectProgressSubtitle}</div>
                </div>
              </div>
              {/* সাবজেক্ট ম্যানেজ করার শর্টকাট — আগে টেক্সট বাটন হিসেবে নিচে আলাদা লাইনে ছিল, এখন হেডিং-এর পাশেই ছোট + আইকন হিসেবে হাইলাইট করা */}
              <button onClick={()=>{vibrate(); setShowSubjects(true);}} title={t.manageSubjects} style={{width:32, height:32, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", border:"none", borderRadius:"50%", background:accent, color:"#fff", cursor:"pointer", boxShadow: dark ? "0 4px 12px rgba(0,0,0,0.35)" : "0 4px 12px rgba(217,119,87,0.35)"}}>
                <Plus size={16} strokeWidth={2.5}/>
              </button>
            </div>

            <div style={{marginBottom:20}}>
              {(() => {
                const sorted = [...allSubjects].sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:"base"}));
                const COLLAPSE_AT = 4; // max 4 subjects shown in the grid — rest via "See more"
                const isLong = sorted.length > COLLAPSE_AT;
                const visible = (isLong && !showAllSubjectsProgress) ? sorted.slice(0, COLLAPSE_AT) : sorted;
                return (
                  <>
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
                      {sorted.length === 0 && (
                        <div style={{fontSize:13, color:textMuted2, padding:"14px 0", gridColumn:"1 / -1"}}>—</div>
                      )}
                      {visible.map(subj => {
                        const v = subjectProgress[subj] || { done:0, total:0 };
                        const c = colorForSubject(subj, allSubjects);
                        const pct = v.total ? Math.round((v.done/v.total)*100) : 0;
                        if (v.total === 0) {
                          return (
                            <div key={subj} style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"12px 12px", minWidth:0}}>
                              <div style={{fontWeight:700, fontSize:12.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:6, color:textMain}}>{subj}</div>
                              <div style={{fontSize:10.5, color:textMuted2, fontWeight:500, opacity:0.75, marginBottom:6}}>{t.noTopicsSubjectShort}</div>
                              <button onClick={()=>{vibrate(); setShowManageTopicsFor(subj); setShowSubjects(true);}} style={{display:"flex", alignItems:"center", gap:3, border:"none", background:"transparent", color:c.bg, fontSize:10.5, fontWeight:700, cursor:"pointer", padding:0}}>
                                <Plus size={11}/> {t.addTopicsShort}
                              </button>
                            </div>
                          );
                        }
                        return (
                          <div key={subj} style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"12px", display:"flex", alignItems:"center", gap:10, minWidth:0}}>
                            <PercentRing pct={pct} size={46} stroke={4.5} accent={c.bg} trackColor={dark?"#2C2820":"#EFE9DC"} textMain={textMain} nf={nf}/>
                            <div style={{minWidth:0, flex:1}}>
                              <div style={{fontWeight:700, fontSize:12.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:textMain}}>{subj}</div>
                              <div style={{fontSize:10.5, color:textMuted2, fontWeight:500, opacity:0.75, marginTop:2}}><Num>{nf(v.done)}</Num>/<Num>{nf(v.total)}</Num> {t.complete}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {isLong && (
                      <button onClick={()=>{vibrate(); setShowAllSubjectsProgress(v=>!v);}} style={{display:"flex", alignItems:"center", justifyContent:"center", gap:4, width:"100%", border:"none", background:"transparent", color:textMain, borderRadius:10, padding:"10px 0 2px", fontSize:12, fontWeight:700, cursor:"pointer"}}>
                        {showAllSubjectsProgress ? t.showLess : t.seeAll} <ChevronDown size={14} style={{transform: showAllSubjectsProgress ? "rotate(180deg)" : "none", transition:"transform .15s ease"}}/>
                      </button>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Task Overview */}
            {(() => {
              const taskTotal = tasks.length;
              const taskDone = tasks.filter(x => x.done).length;
              const taskRemaining = taskTotal - taskDone;
              const taskPct = taskTotal ? Math.round((taskDone / taskTotal) * 100) : 0;
              return (
                <div style={{background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:16,padding:"13px 15px",marginBottom:20}}>
                  <div style={{fontSize:11,letterSpacing:ls(1.4),color:textMuted2,fontWeight:700,opacity:0.85,marginBottom:10}}>
                    {lang === "bn" ? "টাস্ক ওভারভিউ" : "Task Overview"}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:17,fontWeight:800,color:textMain}}><Num>{nf(taskDone)}</Num></div>
                      <div style={{fontSize:9.5,color:textMuted2}}>{lang === "bn" ? "সম্পন্ন" : "Completed"}</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:17,fontWeight:800,color:textMain}}><Num>{nf(taskRemaining)}</Num></div>
                      <div style={{fontSize:9.5,color:textMuted2}}>{lang === "bn" ? "বাকি" : "Remaining"}</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:17,fontWeight:800,color:textMain}}><Num>{nf(taskPct)}</Num>%</div>
                      <div style={{fontSize:9.5,color:textMuted2}}>{lang === "bn" ? "সম্পন্নের হার" : "Completion"}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Weekly Activity — bar chart with value labels and accent-weighted bars */}
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10}}>
              <span style={{fontSize:10, letterSpacing:ls(1.5), color:textMuted2, fontWeight:700, opacity:0.85}}>{t.weeklyActivity}</span>
              <span style={{fontSize:11, fontWeight:700, color:textMuted2}}>
                {(() => {
                  const total = weeklyActivity.reduce((s,w)=>s+w.min,0);
                  const h = Math.floor(total/60), m = total%60;
                  return <>{h > 0 && <><Num>{nf(h)}</Num>h </>}<Num>{nf(m)}</Num>m {lang==="bn" ? "মোট" : "total"}</>;
                })()}
              </span>
            </div>
            <div style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:"18px 12px 12px", display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:6, height:118, marginBottom:20}}>
              {(() => {
                const maxMin = Math.max(1, ...weeklyActivity.map(w=>w.min));
                return weeklyActivity.map((w,i) => {
                  const h = Math.max(4, Math.round((w.min/maxMin)*62));
                  const isToday = dateKey(w.day) === todayKey;
                  const hh = Math.floor(w.min/60), mm = w.min%60;
                  return (
                    <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, height:"100%", justifyContent:"flex-end"}}>
                      {w.min > 0 ? (
                        <span style={{fontSize:8.5, fontWeight:700, color: isToday ? accent : textMuted2, opacity: isToday?1:0.75, whiteSpace:"nowrap"}}>
                          {hh > 0 ? <><Num>{nf(hh)}</Num>h<Num>{nf(mm)}</Num></> : <Num>{nf(mm)}</Num>}
                        </span>
                      ) : <span style={{fontSize:8.5, height:11}}/>}
                      <div style={{width:"100%", maxWidth:22, height:h, borderRadius:6, background: w.min>0 ? (isToday ? accent : "#4C8FA655") : (dark?"#2C2820":"#EFE9DC"), transition:"height .3s"}}/>
                      <span style={{fontSize:9, fontWeight:700, color: isToday?accent:textMuted2}}>{weekdayShort(w.day)}</span>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Monthly Activity — same bar-chart style as Weekly Activity, grouped by week-of-month */}
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10}}>
              <span style={{fontSize:10, letterSpacing:ls(1.5), color:textMuted2, fontWeight:700, opacity:0.85}}>{t.monthlyActivity}</span>
              <span style={{fontSize:11, fontWeight:700, color:textMuted2}}>
                {(() => {
                  const total = monthlyActivity.reduce((s,w)=>s+w.min,0);
                  const h = Math.floor(total/60), m = total%60;
                  return <>{h > 0 && <><Num>{nf(h)}</Num>h </>}<Num>{nf(m)}</Num>m {lang==="bn" ? "মোট" : "total"}</>;
                })()}
              </span>
            </div>
            <div style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:"18px 12px 12px", display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:6, height:118, marginBottom:20}}>
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
                        <span style={{fontSize:8.5, fontWeight:700, color: isCurrent ? accent : textMuted2, opacity: isCurrent?1:0.75, whiteSpace:"nowrap"}}>
                          {hh > 0 ? <><Num>{nf(hh)}</Num>h<Num>{nf(mm)}</Num></> : <Num>{nf(mm)}</Num>}
                        </span>
                      ) : <span style={{fontSize:8.5, height:11}}/>}
                      <div style={{width:"100%", maxWidth:22, height:h, borderRadius:6, background: w.min>0 ? (isCurrent ? accent : "#4C8FA655") : (dark?"#2C2820":"#EFE9DC"), transition:"height .3s"}}/>
                      <span style={{fontSize:9, fontWeight:700, color: isCurrent?accent:textMuted2}}>{t.weekLabelShort}<Num>{nf(w.weekNum)}</Num></span>
                    </div>
                  );
                });
              })()}
            </div>

            <div style={{fontSize:10, letterSpacing:ls(1.5), color:textMuted2, fontWeight:700, opacity:0.85, marginBottom:10}}>{t.thisWeek}</div>
            <div style={{display:"flex", justifyContent:"space-between", gap:2, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:"16px 8px", marginBottom:20}}>
              {weekDays.map((d,i) => {
                const dk = dateKey(d);
                const isSel = dk === dateKey(statsMonthDay);
                const dayList = entries[dk] || [];
                const hasAny = dayList.length > 0;
                const doneAll = hasAny && dayList.every(x=>x.done);
                const statusColor = !hasAny ? textMuted2 : (doneAll ? "#6E8B5E" : "#4C8FA6");
                return (
                  <div key={i} onClick={()=>selectStatsDay(d)} style={{textAlign:"center", cursor:"pointer", flex:1, padding:"0 2px"}}>
                    <div style={{fontSize:9, fontWeight:700, color: isSel ? accent : textMuted2, opacity: isSel ? 1 : 0.85, marginBottom:8, letterSpacing:0.3}}>{weekdayShort(d)}</div>
                    <div style={{width:34,height:34, borderRadius:"50%", display:"flex",alignItems:"center",justifyContent:"center", margin:"0 auto", fontSize:13, fontWeight:800,
                      transition:"background .18s ease, color .18s ease, box-shadow .18s ease", boxShadow: isSel ? `0 0 0 1.5px ${accent}` : "none",
                      background:"transparent", color: isSel ? accent : textMain}}>
                      <Num>{nf(d.getDate())}</Num>
                    </div>
                    <div style={{marginTop:8, display:"flex", justifyContent:"center"}}>
                      <span style={{width:6, height:6, borderRadius:"50%", background: statusColor, opacity: hasAny ? 1 : 0.3}}/>
                    </div>
                  </div>
                );
              })}
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
              sourceLabel={t.planViewStudy} sourceColor="#4C8FA6"
              t={t} nf={nf} cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}/>

            <div style={{display:"flex", alignItems:"center", gap:10, margin:"20px 0 16px"}}>
              <div style={{flex:1, height:1, background:cardBorder}}/>
              <span style={{fontSize:10.5, fontWeight:700, letterSpacing:0.8, color:textMuted2, textTransform:"uppercase", opacity:0.85}}>{lang==="bn" ? "মাস" : "Month"}</span>
              <div style={{flex:1, height:1, background:cardBorder}}/>
            </div>

            <InlineMonthCalendar calMonth={statsCalMonth} setCalMonth={setStatsCalMonth} entries={entries}
              selectedKey={dateKey(statsMonthDay)} onSelectDay={selectStatsDay} lang={lang} nf={nf} monthName={monthName} today={today}
              examDateKeys={examDateKeys}
              cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>

            {/* Calendar legend */}
            <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:14, marginTop:10, flexWrap:"wrap"}}>
              <span style={{display:"flex", alignItems:"center", gap:5, fontSize:10.5, color:textMuted2, fontWeight:600}}>
                <span style={{width:7,height:7,borderRadius:"50%", background:"#6E8B5E"}}/>{t.calendarLegendCompleted}
              </span>
              <span style={{display:"flex", alignItems:"center", gap:5, fontSize:10.5, color:textMuted2, fontWeight:600}}>
                <span style={{width:7,height:7,borderRadius:"50%", background:"#1A1814"}}/>{t.calendarLegendExam}
              </span>
              <span style={{display:"flex", alignItems:"center", gap:5, fontSize:10.5, color:textMuted2, fontWeight:600}}>
                <span style={{width:7,height:7,borderRadius:"50%", background:"#4C8FA6"}}/>{t.calendarLegendPlanned}
              </span>
              <span style={{display:"flex", alignItems:"center", gap:5, fontSize:10.5, color:textMuted2, fontWeight:600}}>
                <span style={{width:7,height:7,borderRadius:"50%", background:"#C0392B"}}/>{t.calendarLegendHoliday}
              </span>
            </div>

            <TopicSummaryPeriodCard
              label={t.monthlySummary}
              rangeLabel={`${monthName(summaryMonthM)} ${nf(summaryMonthY)}`}
              isComplete={summaryMonthComplete}
              pendingText={t.summaryPendingMonth}
              covered={summaryMonthTopics.covered} missed={summaryMonthTopics.missed}
              canGoPrev={true} canGoNext={canGoNextSummaryMonth}
              onPrev={()=>setSummaryMonthAnchor(d=>new Date(d.getFullYear(), d.getMonth()-1, 1))}
              onNext={()=>setSummaryMonthAnchor(d=>new Date(d.getFullYear(), d.getMonth()+1, 1))}
              sourceLabel={t.planViewStudy} sourceColor="#4C8FA6"
              t={t} nf={nf} cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent}/>
          </div>
        )}

      </div>

      {/* Bottom nav — মোবাইল/ট্যাবলেটে; ডেস্কটপে সাইডবার থাকায় এটা হাইড */}
      {!isDesktop && (
      <div style={{position:"sticky", left:0, right:0, bottom:0, display:"flex", justifyContent:"center", padding:"10px 16px 12px", zIndex:40, background: `linear-gradient(to top, ${bg} 60%, transparent)`}}>
        <div style={{
          width:"100%", maxWidth:480, display:"flex",
          background: dark ? "rgba(18,17,16,0.6)" : "rgba(255,255,255,0.55)",
          border:`1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.6)"}`,
          borderRadius:16, padding:"4px",
          backdropFilter:"blur(18px) saturate(160%)",
          WebkitBackdropFilter:"blur(18px) saturate(160%)",
          boxShadow: dark
            ? "0 6px 18px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 6px 18px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)"
        }}>
          {[
            {k:"today", Icon: Home},
            {k:"study", Icon: GraduationCap},
            {k:"task", Icon: ListChecks},
            {k:"notes", Icon: FileText},
          ].map(({k, Icon}) => (
            <button key={k} onClick={()=>{vibrate(); setTab(k);}} style={{
              flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, border:"none", borderRadius:11, padding:"7px 4px", fontSize:9.5, fontWeight:700, cursor:"pointer",
              background: tab===k ? "rgba(217,119,87,0.15)" : "transparent",
              color: tab===k ? accent : textMuted2,
              transform: tab===k ? "translateY(-1px)" : "none",
              transition:"background .2s ease, color .2s ease, transform .2s cubic-bezier(0.16,1,0.3,1)"
            }}>
              <Icon size={20} strokeWidth={tab===k?2.3:2} style={{transition:"stroke-width .15s ease"}}/>
              {t.tabs[k]}
            </button>
          ))}
        </div>
      </div>
      )}
      </div>

      {/* Fullscreen focus timer */}
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
            else { setStopwatchRunning(false); setStopwatchSeconds(0); }
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
          day={selectedDay} entries={entries[dateKey(selectedDay)] || []} allSubjects={allSubjects}
          onClose={()=>setSelectedDay(null)} cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
      )}

      {/* Profile tab — user icon-এ ক্লিক করলে এটা খোলে */}
      {showProfile && (
        <ProfileModal t={t} lang={lang} user={user} isGuest={isGuest} onClose={()=>setShowProfile(false)}
          onExitGuest={() => { clearGuestData(); setIsGuest(false); setShowProfile(false); }}
          onUserUpdate={(patch)=>setUser(u=>({...u, ...patch}))}
          cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
      )}

      {/* Settings — Language, Theme, About Us */}
      {showSettings && (
        <SettingsModal t={t} lang={lang} setLang={setLang} themeMode={themeMode} setThemeMode={setThemeMode}
          onClose={()=>setShowSettings(false)}
          cardBg={cardBg} cardBorder={cardBorder} textMain={textMain} textMuted2={textMuted2} accent={accent} dark={dark}/>
      )}
    </div>
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
      borderRadius:26,
      width,
      height,
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      overflow:"hidden",
      boxShadow: (!running && !dark) ? "0 6px 18px rgba(33,29,24,0.06)" : "none",
    }}>
      <div style={{
        fontFamily:"'Bebas Neue','Hind Siliguri',sans-serif",
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
      <div style={{background:"#1A1A1A", color:"#F5F1E8", borderRadius:20, padding:"26px 22px", maxWidth:320, width:"100%", textAlign:"center"}}>
        <div style={{fontSize:17, fontWeight:800, marginBottom:8}}>{t.focusCompleteTitle}</div>
        <div style={{fontSize:14, color:"#B8B2A2", marginBottom:20}}>
          {t.takeBreakQuestion} <Num>{nf(breakMinutes)}</Num> {t.breakQSuffix}
        </div>
        <div style={{display:"flex", gap:10}}>
          <button onClick={onSkip} style={{flex:1, background:"#333029", border:"none", borderRadius:12, padding:"10px 0", color:"#F5F1E8", fontWeight:700, fontSize:13, cursor:"pointer"}}>
            {t.skipBreakBtn}
          </button>
          <button onClick={onAccept} style={{flex:1, background:accent, border:"none", borderRadius:12, padding:"10px 0", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer"}}>
            {t.startBreakBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

function FullscreenFocus({ t, nf, mode, seconds, total, running, topicLabel, accent, dark, bg, textMain, textMuted2, onToggleRun, onReset, onClose, now, sessionType, pomodoroSession, pomodoroTotalSessions, timerTargetMinutes, timerElapsedMinutes }) {
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
    <div style={{fontFamily:"'Bebas Neue','Hind Siliguri',sans-serif", fontSize:"clamp(55px,11vw,100px)", fontWeight:400, color:fgMuted, marginBottom:6}}>:</div>
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
    <div style={{textAlign:"center", fontSize:12, fontWeight:700, color:fgMuted, fontVariantNumeric:"tabular-nums", letterSpacing:0.8, opacity:0.75, marginBottom: stacked ? 14 : 12}}>
      <Num>{nf(pad2(((now.getHours()%12)||12)))}</Num>:<Num>{nf(pad2(now.getMinutes()))}</Num> <span style={{fontSize:10}}>{now.getHours()>=12 ? t.pmLabel : t.amLabel}</span>
    </div>
  );

  // Pomodoro cycle progress — Timer mode-এই শুধু দেখা যাবে (Stopwatch-এ প্রযোজ্য না)
  const pomodoroIndicator = mode === "timer" && pomodoroSession ? (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:5, marginTop:16}}>
      <div style={{fontSize:11, fontWeight:700, color:fgMuted, letterSpacing:0.6}}>
        {t.sessionLabel} <Num>{nf(pomodoroSession)}</Num>/<Num>{nf(pomodoroTotalSessions || 4)}</Num>
      </div>
      <div style={{display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center", maxWidth:220}}>
        {Array.from({length:pomodoroTotalSessions || 4}, (_,i)=>i+1).map(i => (
          <span key={i} style={{fontSize:13, lineHeight:1, color: i===pomodoroSession ? accent : fgMuted, opacity: i===pomodoroSession ? 1 : 0.5}}>
            {i===pomodoroSession ? "●" : "○"}
          </span>
        ))}
      </div>
      {timerTargetMinutes && (
        <div style={{fontSize:10.5, color:fgMuted, fontWeight:600, opacity:0.8}}>
          <Num>{nf(timerElapsedMinutes || 0)}</Num>/<Num>{nf(timerTargetMinutes)}</Num> {t.minutes}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div style={{position:"fixed", inset:0, zIndex:100, background:screenBg, color:fgMain, display:"flex", flexDirection:"column"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px 0"}}>
        <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:fgMuted, display:"flex", alignItems:"center", padding:6}}>
          <ChevronDown size={22}/>
        </button>
        <div/>
        <div style={{width:34}}/>
      </div>

      {/* মূল কনটেন্ট এরিয়া উলম্বভাবে center করা — real-time ঘড়ি এখন এই ব্লকের অংশ, তাই স্ক্রিনের মাঝামাঝি বসে */}
      <div style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:18, padding:"0 24px"}}>
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
        <div style={{display:"flex", gap:14, padding:"0 30px 64px", justifyContent:"center", alignItems:"center"}}>
          <button onClick={onToggleRun} title={running ? t.pause : t.start} style={{background:accent, border:"none", borderRadius:16, width:56, height:56, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer"}}>
            {running ? <Pause size={20} fill="#fff" color="#fff"/> : <Play size={20} fill="#fff" color="#fff"/>}
          </button>
          <button onClick={onReset} title={t.reset} style={{background:resetBtnBg, border:"none", borderRadius:16, width:56, height:56, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer"}}>
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
  const offset = c - (Math.min(100, Math.max(0, pct)) / 100) * c;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)", flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={accent} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{transition:"stroke-dashoffset .3s"}}/>
      <text x="50%" y="50%" fill={accent} fontSize={size*(caption?0.24:0.24)} fontWeight={800}
        textAnchor="middle" dominantBaseline="central" style={{transform:`rotate(90deg)`, transformOrigin:"center"}}>
        <tspan x="50%" dy={caption ? -size*0.07 : 0}>{nf(pct)}%</tspan>
        {caption && <tspan x="50%" dy={size*0.19} fontSize={size*0.13} fontWeight={600} fill={captionColor || textMain}>{caption}</tspan>}
      </text>
    </svg>
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

  const smallInput = { width:56, border:`1px solid ${cardBorder}`, borderRadius:8, padding:"6px 8px", fontSize:12, background: dark?"#121110":"#F8F5EE", color: dark?"#F3EFE7":"#211D18", outline:"none" };
  const dateInput = { border:`1px solid ${cardBorder}`, borderRadius:8, padding:"6px 8px", fontSize:12, background: dark?"#121110":"#F8F5EE", color: dark?"#F3EFE7":"#211D18", outline:"none", flex:1 };

  return (
    <div className="fg-card" style={{background: completed ? (dark?"rgba(110,139,94,0.10)":"rgba(110,139,94,0.07)") : cardBg, border: completed ? `1px solid rgba(110,139,94,0.4)` : `1px solid ${cardBorder}`, borderRadius:16, padding:"12px 14px", transition:"background .2s ease, border-color .2s ease, transform .16s cubic-bezier(0.16,1,0.3,1), box-shadow .2s ease"}}>
      {renaming ? (
        <div style={{display:"flex", flexDirection:"column", gap:6}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex", gap:6, alignItems:"center"}}>
            <Folder size={14} style={{color:textMuted2, flexShrink:0}}/>
            <input autoFocus value={renameValue} onChange={e=>setRenameValue(e.target.value)}
              onKeyDown={e=>{ if (e.key==="Enter") submitRename(); if (e.key==="Escape") cancelRename(); }}
              style={{flex:1, border:`1px solid ${cardBorder}`, borderRadius:8, padding:"6px 8px", fontSize:13, background: dark?"#121110":"#F8F5EE", color: dark?"#F3EFE7":"#211D18", outline:"none"}}/>
            <button onClick={submitRename} style={{border:"none", background:"transparent", cursor:"pointer", color:accent, flexShrink:0}}><Check size={16}/></button>
            <button onClick={cancelRename} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, flexShrink:0}}><X size={16}/></button>
          </div>
          {renameError && <div style={{fontSize:11, color:"#C0553F", fontWeight:600, paddingLeft:22}}>{renameError}</div>}
        </div>
      ) : (
        <button onClick={()=>setExpanded(x=>!x)} style={{width:"100%", border:"none", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", padding:0, color:"inherit", textAlign:"left"}}>
          <div style={{display:"flex", alignItems:"center", gap:8, minWidth:0}}>
            <Folder size={14} style={{color:textMuted2, flexShrink:0}}/>
            <span style={{fontWeight:700, fontSize:13.5, wordBreak:"break-word"}}>{topicName}</span>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:6, flexShrink:0}}>
            {completed ? (
              <span style={{fontSize:10.5, fontWeight:700, color:green, background: dark?"rgba(110,139,94,0.18)":"rgba(110,139,94,0.15)", padding:"3px 8px", borderRadius:20, display:"flex", alignItems:"center", gap:3}}>
                <Check size={10}/> {t.completedBadge}
              </span>
            ) : (
              <span style={{fontSize:11, color:textMuted2, fontWeight:600}}>{t.noAttemptsYet}</span>
            )}
            <ChevronDown size={15} style={{color:textMuted2, transform: expanded ? "rotate(180deg)" : "none", transition:"transform .15s"}}/>
          </div>
        </button>
      )}

      {attempts.length > 0 && (
        <div style={{display:"flex", gap:10, marginTop:8, paddingLeft:22, fontSize:11.5, color:textMuted2, fontWeight:600, flexWrap:"wrap"}}>
          <span><Num>{nf(attempts.length)}</Num> {t.attemptsLabel}</span>
          {avgPct !== null && <span style={{color:"#4C8FA6", fontWeight:700}}>{t.average} <Num>{nf(avgPct)}</Num>%</span>}
        </div>
      )}

      {expanded && (
        <div style={{marginTop:12, paddingTop:12, borderTop:`1px dashed ${cardBorder}`, animation:"fg-fade-up .22s cubic-bezier(0.16,1,0.3,1)"}}>
          {attempts.length === 0 ? (
            <div style={{fontSize:12, color:textMuted2, marginBottom:10, textAlign:"center", padding:"10px 0"}}>{t.noAttemptsYet}</div>
          ) : (
            <div style={{display:"flex", flexDirection:"column", gap:6, marginBottom:12, background: dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"9px 10px"}}>
              {[...attempts].sort((a,b)=>(a.date||"").localeCompare(b.date||"")).map(a => (
                editingAttemptId === a.id ? (
                  <div key={a.id} style={{display:"flex", alignItems:"center", gap:6}}>
                    <input type="date" value={editDate} onChange={e=>setEditDate(e.target.value)} style={dateInput}/>
                    <input type="number" inputMode="decimal" value={editObtained} onChange={e=>setEditObtained(e.target.value)} style={smallInput}/>
                    <span style={{color:textMuted2, fontSize:12, fontWeight:700}}>/</span>
                    <input type="number" inputMode="decimal" value={editTotal} onChange={e=>setEditTotal(e.target.value)} style={smallInput}/>
                    <button onClick={saveEditAttempt} style={{border:"none", borderRadius:8, width:26, height:26, background:accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0}}><Check size={13}/></button>
                    <button onClick={cancelEditAttempt} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, flexShrink:0}}><X size={16}/></button>
                  </div>
                ) : (
                  <div key={a.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"3px 0"}}>
                    <span style={{fontSize:12.5, fontWeight:600}}>
                      {a.date && <span style={{color:textMuted2, fontWeight:500, marginRight:6}}>{a.date}</span>}
                      <Num>{nf(a.obtained)}</Num> / <Num>{nf(a.total)}</Num>
                      <span style={{color:textMuted2, fontWeight:500}}> (<Num>{nf(a.total ? Math.round((a.obtained/a.total)*100) : 0)}</Num>%)</span>
                    </span>
                    <div style={{display:"flex", gap:10}}>
                      <button onClick={()=>startEditAttempt(a)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, display:"flex"}}>
                        <Pencil size={13}/>
                      </button>
                      <button onClick={()=>onRemoveAttempt(a.id)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, display:"flex"}}>
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          <div style={{background: dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"10px", marginBottom:10}}>
            <div style={{fontSize:10, fontWeight:700, letterSpacing:ls(0.8), color:textMuted2, opacity:0.85, marginBottom:8, textTransform:"uppercase"}}>{t.addAttempt}</div>
            <div style={{display:"flex", alignItems:"center", gap:6}}>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={dateInput}/>
              <input type="number" inputMode="decimal" placeholder={t.obtainedPlaceholder} value={obtained} onChange={e=>setObtained(e.target.value)} style={smallInput}/>
              <span style={{color:textMuted2, fontSize:12, fontWeight:700}}>/</span>
              <input type="number" inputMode="decimal" placeholder={t.outOfPlaceholder} value={total} onChange={e=>setTotal(e.target.value)} style={smallInput}/>
              <button onClick={submitAttempt} style={{border:"none", borderRadius:8, width:30, height:30, background:accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, boxShadow:`0 3px 8px ${accent}40`}}>
                <Plus size={15}/>
              </button>
            </div>
          </div>

          <div style={{display:"flex", gap:14}}>
            <button onClick={startRename} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:4, padding:0}}>
              <Pencil size={12}/> {t.edit}
            </button>
            <button onClick={onRemoveTopic} style={{border:"none", background:"transparent", cursor:"pointer", color:"#C0553F", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:4, padding:0}}>
              <Trash2 size={12}/> {t.deleteTopic}
            </button>
          </div>
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
      <button onClick={()=>setAdding(true)} style={{display:"flex", alignItems:"center", gap:4, border:`1px dashed ${cardBorder}`, background:"transparent", color:textMuted2, borderRadius:12, padding:"9px 12px", fontSize:12, fontWeight:700, cursor:"pointer", alignSelf:"flex-start", transition:"border-color .2s ease, color .2s ease"}}>
        <Plus size={12}/> {t.addTopicBtn}
      </button>
    );
  }
  return (
    <div style={{display:"flex", alignItems:"center", gap:6, background: dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)", border:`1px solid ${cardBorder}`, borderRadius:12, padding:8, animation:"fg-fade-up .18s cubic-bezier(0.16,1,0.3,1)"}}>
      <input autoFocus value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") submit(); if(e.key==="Escape"){setAdding(false); setName("");}}}
        placeholder={t.topicNamePlaceholder}
        style={{flex:1, border:`1px solid ${cardBorder}`, borderRadius:8, padding:"7px 10px", fontSize:12.5, background: dark?"#121110":"#F8F5EE", color: dark?"#F3EFE7":"#211D18", outline:"none"}}/>
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

  const smallInput = { width:56, border:`1px solid ${cardBorder}`, borderRadius:8, padding:"6px 8px", fontSize:12, background: dark?"#121110":"#F8F5EE", color: dark?"#F3EFE7":"#211D18", outline:"none" };
  const dateInput = { border:`1px solid ${cardBorder}`, borderRadius:8, padding:"6px 8px", fontSize:12, background: dark?"#121110":"#F8F5EE", color: dark?"#F3EFE7":"#211D18", outline:"none", flex:1 };

  return (
    <div className="fg-card" style={{background: hasAttempts ? (dark?"rgba(110,139,94,0.10)":"rgba(110,139,94,0.07)") : cardBg, border: hasAttempts ? `1px solid rgba(110,139,94,0.4)` : `1px solid ${cardBorder}`, borderRadius:16, padding:"12px 14px", transition:"background .2s ease, border-color .2s ease"}}>
      <button onClick={()=>setExpanded(x=>!x)} style={{width:"100%", border:"none", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", padding:0, color:"inherit", textAlign:"left"}}>
        <div style={{display:"flex", alignItems:"center", gap:8, minWidth:0}}>
          <GraduationCap size={14} style={{color:textMuted2, flexShrink:0}}/>
          <span style={{fontWeight:700, fontSize:13.5, wordBreak:"break-word"}}>{name}</span>
          <span style={{fontSize:9.5, fontWeight:700, letterSpacing:ls(0.5), color:textMuted2, background: dark?"#26231D":"#F3EEE3", padding:"2px 7px", borderRadius:20, flexShrink:0, textTransform:"uppercase"}}>{typeLabel}</span>
        </div>
        <ChevronDown size={15} style={{color:textMuted2, transform: expanded ? "rotate(180deg)" : "none", transition:"transform .15s", flexShrink:0}}/>
      </button>

      <div style={{display:"flex", flexWrap:"wrap", gap:5, marginTop:8, paddingLeft:22}}>
        {(subjects || []).map(s => {
          const c = colorForSubject(s, allSubjects);
          return <span key={s} style={{fontSize:10.5, fontWeight:700, color:c.bg, background:c.bgSoft, padding:"2px 8px", borderRadius:20}}>{s}</span>;
        })}
      </div>

      {hasAttempts && (
        <div style={{display:"flex", gap:10, marginTop:8, paddingLeft:22, fontSize:11.5, color:textMuted2, fontWeight:600}}>
          <span><Num>{nf(attempts.length)}</Num> {t.attemptsLabel}</span>
          {avgPct !== null && <span style={{color:"#4C8FA6", fontWeight:700}}>{t.average} <Num>{nf(avgPct)}</Num>%</span>}
        </div>
      )}

      {expanded && (
        <div style={{marginTop:12, paddingTop:12, borderTop:`1px dashed ${cardBorder}`, animation:"fg-fade-up .22s cubic-bezier(0.16,1,0.3,1)"}}>
          {attempts.length === 0 ? (
            <div style={{fontSize:12, color:textMuted2, marginBottom:10, textAlign:"center", padding:"10px 0"}}>{t.noAttemptsYet}</div>
          ) : (
            <div style={{display:"flex", flexDirection:"column", gap:6, marginBottom:12, background: dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"9px 10px"}}>
              {[...attempts].sort((a,b)=>(a.date||"").localeCompare(b.date||"")).map(a => (
                editingAttemptId === a.id ? (
                  <div key={a.id} style={{display:"flex", alignItems:"center", gap:6}}>
                    <input type="date" value={editDate} onChange={e=>setEditDate(e.target.value)} style={dateInput}/>
                    <input type="number" inputMode="decimal" value={editObtained} onChange={e=>setEditObtained(e.target.value)} style={smallInput}/>
                    <span style={{color:textMuted2, fontSize:12, fontWeight:700}}>/</span>
                    <input type="number" inputMode="decimal" value={editTotal} onChange={e=>setEditTotal(e.target.value)} style={smallInput}/>
                    <button onClick={saveEditAttempt} style={{border:"none", borderRadius:8, width:26, height:26, background:accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0}}><Check size={13}/></button>
                    <button onClick={cancelEditAttempt} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, flexShrink:0}}><X size={16}/></button>
                  </div>
                ) : (
                  <div key={a.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"3px 0"}}>
                    <span style={{fontSize:12.5, fontWeight:600}}>
                      {a.date && <span style={{color:textMuted2, fontWeight:500, marginRight:6}}>{a.date}</span>}
                      <Num>{nf(a.obtained)}</Num> / <Num>{nf(a.total)}</Num>
                      <span style={{color:textMuted2, fontWeight:500}}> (<Num>{nf(a.total ? Math.round((a.obtained/a.total)*100) : 0)}</Num>%)</span>
                    </span>
                    <div style={{display:"flex", gap:10}}>
                      <button onClick={()=>startEditAttempt(a)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, display:"flex"}}>
                        <Pencil size={13}/>
                      </button>
                      <button onClick={()=>onRemoveAttempt(a.id)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, display:"flex"}}>
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          <div style={{background: dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"10px", marginBottom:10}}>
            <div style={{fontSize:10, fontWeight:700, letterSpacing:ls(0.8), color:textMuted2, opacity:0.85, marginBottom:8, textTransform:"uppercase"}}>{t.addAttempt}</div>
            <div style={{display:"flex", alignItems:"center", gap:6}}>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={dateInput}/>
              <input type="number" inputMode="decimal" placeholder={t.obtainedPlaceholder} value={obtained} onChange={e=>setObtained(e.target.value)} style={smallInput}/>
              <span style={{color:textMuted2, fontSize:12, fontWeight:700}}>/</span>
              <input type="number" inputMode="decimal" placeholder={t.outOfPlaceholder} value={total} onChange={e=>setTotal(e.target.value)} style={smallInput}/>
              <button onClick={submitAttempt} style={{border:"none", borderRadius:8, width:30, height:30, background:accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, boxShadow:`0 3px 8px ${accent}40`}}>
                <Plus size={15}/>
              </button>
            </div>
          </div>

          <div style={{display:"flex", gap:14}}>
            <button onClick={onEdit} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:4, padding:0}}>
              <Pencil size={12}/> {t.edit}
            </button>
            <button onClick={onRemove} style={{border:"none", background:"transparent", cursor:"pointer", color:"#C0553F", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:4, padding:0}}>
              <Trash2 size={12}/> {t.deleteCombinedExam}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NextExamModal({ t, examSubjects, nextExam, onSave, onClose, cardBg, cardBorder, textMain, textMuted2, accent, dark }) {
  const subjectNames = Object.keys(examSubjects);
  const [subject, setSubject] = useState(nextExam?.subject || subjectNames[0] || "");
  const [topic, setTopic] = useState(nextExam?.topic || "");
  const [date, setDate] = useState(nextExam?.date || "");
  const topicOptions = Object.keys(examSubjects[subject]?.topics || {});

  const inputStyle = { border:`1px solid ${cardBorder}`, borderRadius:10, padding:"10px 12px", fontSize:13.5, background: dark?"#121110":"#F8F5EE", color: dark?"#F3EFE7":"#211D18", outline:"none", width:"100%" };

  const submit = () => {
    if (!subject || !date) return;
    onSave({ subject, topic: topic.trim(), date });
  };

  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"22px 22px 0 0", padding:"20px 20px 28px", color:textMain, display:"flex", flexDirection:"column", gap:14}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{fontSize:16, fontWeight:800}}>{t.setNextExam}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>

        {subjectNames.length === 0 ? (
          <div style={{fontSize:13, color:textMuted2, textAlign:"center", padding:"10px 0"}}>{t.noSubjectsForExam}</div>
        ) : (
          <>
            <div>
              <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.chooseSubject}</div>
              <select style={inputStyle} value={subject} onChange={e=>{setSubject(e.target.value); setTopic("");}}>
                {subjectNames.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.chooseTopic}</div>
              <input style={inputStyle} list="next-exam-topics" value={topic} onChange={e=>setTopic(e.target.value)} placeholder={t.topicNamePlaceholder}/>
              <datalist id="next-exam-topics">
                {topicOptions.map(tp => <option key={tp} value={tp}/>)}
              </datalist>
            </div>
            <div>
              <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.examDateLabel}</div>
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

  const inputStyle = { border:`1px solid ${cardBorder}`, borderRadius:10, padding:"10px 12px", fontSize:13.5, background: dark?"#121110":"#F8F5EE", color: dark?"#F3EFE7":"#211D18", outline:"none", width:"100%" };
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
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"22px 22px 0 0", padding:"20px 20px 28px", color:textMain, display:"flex", flexDirection:"column", gap:14, maxHeight:"85vh", overflowY:"auto"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{fontSize:16, fontWeight:800}}>{editingCombinedExam ? t.editCombinedExam : t.addCombinedExam}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>

        {allSubjects.length === 0 ? (
          <div style={{fontSize:13, color:textMuted2, textAlign:"center", padding:"10px 0"}}>{t.noSubjectsForCombined}</div>
        ) : (
          <>
            <div>
              <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.combinedExamName}</div>
              <input autoFocus style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder={t.combinedExamNamePlaceholder}/>
            </div>
            <div>
              <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.typeLabel}</div>
              <div style={{display:"flex", gap:8}}>
                {typeOptions.map(o => (
                  <button key={o.k} onClick={()=>setType(o.k)} style={{flex:1, border:`1px solid ${type===o.k ? accent : cardBorder}`, background: type===o.k ? (dark?"rgba(217,119,87,0.15)":"rgba(217,119,87,0.1)") : "transparent", color: type===o.k ? accent : textMuted2, borderRadius:10, padding:"9px 0", fontSize:12.5, fontWeight:700, cursor:"pointer"}}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:2}}>{t.subjectsLabel}</div>
              <div style={{fontSize:11, color:textMuted2, opacity:0.85, marginBottom:8}}>{t.selectSubjectsNote}</div>
              <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                {allSubjects.map(s => {
                  const on = picked.includes(s);
                  const c = colorForSubject(s, allSubjects);
                  return (
                    <button key={s} onClick={()=>toggleSubject(s)} style={{display:"flex", alignItems:"center", gap:5, border:`1px solid ${on ? c.bg : cardBorder}`, background: on ? c.bgSoft : "transparent", color: on ? c.bg : textMuted2, borderRadius:20, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer"}}>
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
        <div style={{display:"flex", alignItems:"center", gap:7}}>
          <div style={{fontSize:17, fontWeight:800, letterSpacing:-0.2}}>{t.monthlySummaryExam}</div>
          <span style={{fontSize:9, fontWeight:800, letterSpacing:0.3, padding:"2px 7px", borderRadius:10, background: dark?"#26231D":"#F3EEE3", color: dark?"#C9C0AC":"#6B6353", flexShrink:0}}>
            {t.planViewExam}
          </span>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:6}}>
          <button onClick={()=>setExamMonth(new Date(y,m-1,1))} style={{border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:9, width:28,height:28, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer", color:textMain}}><ChevronLeft size={14}/></button>
          <div style={{fontSize:12.5, fontWeight:700, minWidth:76, textAlign:"center"}}>{monthName(m)} <Num>{nf(y)}</Num></div>
          <button onClick={()=>setExamMonth(new Date(y,m+1,1))} style={{border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:9, width:28,height:28, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer", color:textMain}}><ChevronRight size={14}/></button>
        </div>
      </div>

      {totalAttempts === 0 ? (
        <div style={{textAlign:"center", padding:"22px 10px", color:textMuted2, fontSize:13, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:16, marginTop:14}}>
          {t.noExamDataMonth}
        </div>
      ) : (
        <>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:14}}>
            <div style={statBox}>
              <div style={{fontSize:10.5, color:textMuted2, fontWeight:700, letterSpacing:ls(0.5)}}>{t.totalExams}</div>
              <div style={{fontSize:22, fontWeight:800, marginTop:4}}><Num>{nf(totalExams)}</Num></div>
            </div>
            <div style={statBox}>
              <div style={{fontSize:10.5, color:textMuted2, fontWeight:700, letterSpacing:ls(0.5)}}>{t.totalAttempts}</div>
              <div style={{fontSize:22, fontWeight:800, marginTop:4}}><Num>{nf(totalAttempts)}</Num></div>
            </div>
            <div style={statBox}>
              <div style={{fontSize:10.5, color:textMuted2, fontWeight:700, letterSpacing:ls(0.5)}}>{t.avgScoreLabel}</div>
              <div style={{fontSize:22, fontWeight:800, marginTop:4, color:"#4C8FA6"}}><Num>{nf(avgScorePct)}</Num>%</div>
            </div>
            <div style={statBox}>
              <div style={{fontSize:10.5, color:textMuted2, fontWeight:700, letterSpacing:ls(0.5)}}>{t.maxScoreLabel}</div>
              <div style={{fontSize:22, fontWeight:800, marginTop:4, color:"#6E8B5E"}}><Num>{nf(Math.round(maxScorePct))}</Num>%</div>
            </div>
          </div>

          <div style={{marginTop:16}}>
            <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:8}}>{t.subjectBreakdown}</div>
            <div style={{border:`1px solid ${cardBorder}`, borderRadius:14, overflow:"hidden"}}>
              <div style={{display:"grid", gridTemplateColumns:"1.6fr 0.8fr 0.8fr 0.8fr", padding:"8px 12px", background: dark?"#121110":"#F8F5EE", fontSize:10.5, fontWeight:700, color:textMuted2}}>
                <span>{t.subjectLabel}</span><span style={{textAlign:"right"}}>{t.examsCol}</span><span style={{textAlign:"right"}}>{t.attemptsCol}</span><span style={{textAlign:"right"}}>{t.avgCol}</span>
              </div>
              {rows.map(([subj, d]) => {
                const c = colorForSubject(subj, allSubjects);
                const avg = Math.round(d.scoreSum/d.attempts);
                return (
                  <div key={subj} style={{display:"grid", gridTemplateColumns:"1.6fr 0.8fr 0.8fr 0.8fr", padding:"9px 12px", fontSize:12.5, fontWeight:600, borderTop:`1px solid ${cardBorder}`, alignItems:"center"}}>
                    <span style={{display:"flex", alignItems:"center", gap:6, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                      <span style={{width:7,height:7,borderRadius:"50%", background:c.bg, flexShrink:0}}/>{subj}
                    </span>
                    <span style={{textAlign:"right"}}><Num>{nf(d.topics.size)}</Num></span>
                    <span style={{textAlign:"right"}}><Num>{nf(d.attempts)}</Num></span>
                    <span style={{textAlign:"right", color:"#4C8FA6", fontWeight:700}}><Num>{nf(avg)}</Num>%</span>
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
  const trackColor = dark ? "#2C2820" : "#EFE9DC";

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
      <div style={{fontSize:19, fontWeight:800, letterSpacing:-0.3}}>{title}</div>
      <div style={{fontSize:12, color:textMuted2, marginBottom:16, fontWeight:600}}>{rangeLabel}</div>

      {/* Overview card */}
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:"14px 16px", marginBottom:20}}>
        <div>
          <div style={{fontSize:10, letterSpacing:ls(1.5), color:textMuted2, fontWeight:700, opacity:0.85, marginBottom:8}}>{t.overview}</div>
          <div style={{display:"flex", gap:16}}>
            <div>
              <div style={{fontSize:20, fontWeight:800, color:"#6E8B5E"}}><Num>{nf(doneCount)}</Num></div>
              <div style={{fontSize:11, color:textMuted2, fontWeight:600}}>{t.doneCount}</div>
            </div>
            <div>
              <div style={{fontSize:20, fontWeight:800}}><Num>{nf(totalCount - doneCount)}</Num></div>
              <div style={{fontSize:11, color:textMuted2, fontWeight:600}}>{t.remaining}</div>
            </div>
          </div>
          <div style={{marginTop:10, height:6, width:120, borderRadius:4, background:trackColor, border:`1px solid ${cardBorder}`, overflow:"hidden"}}>
            <div style={{height:"100%", width:`${overallPct}%`, background:accent, borderRadius:4, transition:"width .3s"}}/>
          </div>
        </div>
        <PercentRing pct={overallPct} accent={accent} trackColor={trackColor} textMain={dark?"#F3EFE7":"#211D18"} nf={nf}/>
      </div>

      {mode === "duration" ? (
        <div style={{marginBottom:20}}>
          <div style={{fontSize:10, letterSpacing:ls(1.5), color:textMuted2, fontWeight:700, opacity:0.85, marginBottom:10}}>{t.subjectTimeBreakdown}</div>
          <div style={{display:"flex", flexDirection:"column", gap:10}}>
            {Object.keys(subjMinutes).length === 0 && (
              <div style={{textAlign:"center", padding:"26px 10px", color:textMuted2, fontSize:13, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:16, display:"flex", flexDirection:"column", alignItems:"center", gap:8}}>
                <BarChart3 size={20} style={{opacity:0.45}}/>
                {t.noTimeData}
              </div>
            )}
            {Object.entries(subjMinutes).sort((a,b)=>b[1]-a[1]).map(([subj, mins]) => {
              const c = colorForSubject(subj, allSubjects);
              const pct = Math.round((mins/maxMinutes)*100);
              return (
                <div key={subj} className="fg-card" style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:"12px 16px"}}>
                  <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
                    <span style={{fontWeight:700, fontSize:13}}>{subj}</span>
                    <span style={{fontSize:12, fontWeight:700, color:c.bg}}>{formatDuration(mins, lang, nf)}</span>
                  </div>
                  <div style={{height:6, borderRadius:4, background: dark? "#2C2820":"#EFE9DC", border:`1px solid ${cardBorder}`, overflow:"hidden"}}>
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
            <div style={{textAlign:"center", padding:"26px 10px", color:textMuted2, fontSize:13, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:16, display:"flex", flexDirection:"column", alignItems:"center", gap:8}}>
              <Calendar size={20} style={{opacity:0.45}}/>
              {t.noSubjectData}
            </div>
          )}
          {Object.entries(subjTotals).map(([subj,v]) => {
            const c = colorForSubject(subj, allSubjects);
            const pct = v.total ? Math.round((v.done/v.total)*100) : 0;
            return (
              <div key={subj} className="fg-card" style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:"12px 16px"}}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
                  <span style={{fontWeight:700, fontSize:13}}>{subj}</span>
                  <span style={{fontSize:12, fontWeight:700, color:c.bg}}><Num>{nf(pct)}</Num>%</span>
                </div>
                <div style={{height:6, borderRadius:4, background: dark? "#2C2820":"#EFE9DC", border:`1px solid ${cardBorder}`, overflow:"hidden"}}>
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
        cardBg={cardBg} cardBorder={cardBorder} textMuted2={textMuted2} accent={accent}/>
    </div>
  );
}

// Read-only subject-grouped list: remaining topics first, then done topics.
function SubjectGroupedList({ entries, nf, t, remainingLabel, doneLabel, remainingEmptyText, doneEmptyText, cardBg, cardBorder, textMuted2, accent }) {
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
    <div style={{display:"flex", flexDirection:"column", gap:18}}>
      <div>
        <div style={{fontSize:12, fontWeight:700, color:"#211D18", marginBottom:8}}>✕ {remainingLabel} (<Num>{nf(remainingCount)}</Num>)</div>
        {remainingSubjects.length === 0 ?
          <div style={{textAlign:"center", padding:"18px 10px", color:textMuted2, fontSize:12, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:14, display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
            <Check size={16} style={{opacity:0.45, color:"#6E8B5E"}}/>
            {remainingEmptyText}
          </div> :
          <div style={{display:"flex", flexDirection:"column", gap:10}}>
            {remainingSubjects.map(subj => (
              <div key={subj}>
                <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:4}}>{subj}</div>
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  {remaining[subj].map(e => (
                    <div key={e.id+(e._dk||"")} className="fg-card" style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:12, padding:"9px 12px", fontSize:13}}>{e.topic}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>}
      </div>
      <div>
        <div style={{fontSize:12, fontWeight:700, color:"#6E8B5E", marginBottom:8}}>✓ {doneLabel} (<Num>{nf(doneCount)}</Num>)</div>
        {doneSubjects.length === 0 ?
          <div style={{textAlign:"center", padding:"18px 10px", color:textMuted2, fontSize:12, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:14, display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
            <Folder size={16} style={{opacity:0.45}}/>
            {doneEmptyText}
          </div> :
          <div style={{display:"flex", flexDirection:"column", gap:10}}>
            {doneSubjects.map(subj => (
              <div key={subj}>
                <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:4}}>{subj}</div>
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  {done[subj].map(e => (
                    <div key={e.id+(e._dk||"")} className="fg-card" style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:12, padding:"9px 12px", fontSize:13, display:"flex", alignItems:"center", justifyContent:"space-between", gap:8}}>
                      <span>{e.topic}</span>
                      {e._caughtUp && <span style={{fontSize:10, fontWeight:700, color:textMuted2, flexShrink:0}}>{t?.caughtUpNote}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>}
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
        <div style={{display:"flex", alignItems:"center", gap:7}}>
          <div style={{fontSize:10, letterSpacing:0.5, color:textMuted2, fontWeight:700, opacity:0.85}}>{label}</div>
          {sourceLabel && (
            <span style={{fontSize:9, fontWeight:800, letterSpacing:0.3, padding:"2px 7px", borderRadius:10, background:`${sourceColor}1F`, color:sourceColor, flexShrink:0}}>
              {sourceLabel}
            </span>
          )}
        </div>
        <div style={{display:"flex", alignItems:"center", gap:4}}>
          <button onClick={onPrev} disabled={!canGoPrev} style={{border:`1px solid ${cardBorder}`, background:cardBg, color: canGoPrev?textMain:textMuted2, borderRadius:8, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", cursor: canGoPrev?"pointer":"default", opacity: canGoPrev?1:0.4}}>
            <ChevronLeft size={14}/>
          </button>
          <span style={{fontSize:11.5, fontWeight:700, color:textMain, minWidth:0, whiteSpace:"nowrap"}}>{rangeLabel}</span>
          <button onClick={onNext} disabled={!canGoNext} style={{border:`1px solid ${cardBorder}`, background:cardBg, color: canGoNext?textMain:textMuted2, borderRadius:8, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", cursor: canGoNext?"pointer":"default", opacity: canGoNext?1:0.4}}>
            <ChevronRight size={14}/>
          </button>
        </div>
      </div>
      {!isComplete ? (
        <div style={{textAlign:"center", padding:"22px 10px", color:textMuted2, fontSize:12.5, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:16}}>
          {pendingText}
        </div>
      ) : (
        <SubjectGroupedList entries={entries} nf={nf} t={t}
          remainingLabel={t.missed} doneLabel={t.covered}
          remainingEmptyText={t.noneMissed} doneEmptyText={t.noneCovered}
          cardBg={cardBg} cardBorder={cardBorder} textMuted2={textMuted2} accent={accent}/>
      )}
    </div>
  );
}

// Read-only-capable list of topics used by the Today and Plan tabs.
function TopicsList({ items, allSubjects, t, nf, lang, cardBg, cardBorder, textMuted2, textMain, accent, onToggle, onStartTimer, onEdit, onDelete, onRename, emptyText, emptySubtext }) {
  const ls = (px) => (lang === "bn" ? 0 : px);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const closeMenu = () => { setOpenMenuId(null); setConfirmDeleteId(null); };
  if (items.length === 0) {
    return (
      <div style={{textAlign:"center", padding:"30px 10px", color:textMuted2, fontSize:13, background:cardBg, border:`1px dashed ${cardBorder}`, borderRadius:16}}>
        <div>{emptyText}</div>
        {emptySubtext && <div style={{fontSize:12, opacity:0.8, marginTop:4}}>{emptySubtext}</div>}
      </div>
    );
  }
  return (
    <div style={{display:"flex", flexDirection:"column", gap:10}}>
      {items.map(item => {
        const c = colorForSubject(item.subject, allSubjects);
        return (
          <div key={item.id} style={{
            background: item.done ? "rgba(110,139,94,0.07)" : cardBg,
            border: `1px solid ${item.done ? "rgba(110,139,94,0.35)" : cardBorder}`,
            borderRadius:16, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, position:"relative",
            transition:"background .15s ease, border-color .15s ease",
          }}>
            <button onClick={onToggle ? ()=>onToggle(item.id) : undefined} disabled={!onToggle}
              style={{width:34,height:34, borderRadius:"50%", border:"none", flexShrink:0, cursor: onToggle?"pointer":"default", background: item.done ? "#6E8B5E" : c.bgSoft, display:"flex",alignItems:"center",justifyContent:"center"}}>
              {item.done ? <Check size={16} color="#fff" strokeWidth={3}/> : <span style={{width:9,height:9,borderRadius:"50%", background:c.bg}}/>}
            </button>
            <div style={{flex:1, minWidth:0}}>
              <span style={{display:"inline-block", fontSize:9.5, fontWeight:800, letterSpacing:ls(0.5), color:c.bg, background:c.bgSoft, borderRadius:6, padding:"2px 7px", marginBottom:3}}>{item.subject.toUpperCase()}</span>
              <div style={{fontSize:14, fontWeight:600, wordBreak:"break-word", textDecoration: item.done ? "line-through" : "none", opacity: item.done ? 0.6 : 1}}>{item.topic}</div>
            </div>
            <div style={{textAlign:"right", flexShrink:0}}>
              <div style={{fontSize:11.5, fontWeight:500, color:textMuted2, opacity:0.85}}>
                {item.time ? (() => {
                  const st = parseTime12(item.time);
                  const et = item.endTime ? parseTime12(item.endTime) : null;
                  if (!st) return t.noTimeSet;
                  const stPart = <><Num>{nf(st.h12)}</Num>:<Num>{nf(pad2(st.m))}</Num> <span style={{fontSize:9.5}}>{st.pm ? t.pmLabel : t.amLabel}</span></>;
                  if (!et) return stPart;
                  const etPart = <><Num>{nf(et.h12)}</Num>:<Num>{nf(pad2(et.m))}</Num> <span style={{fontSize:9.5}}>{et.pm ? t.pmLabel : t.amLabel}</span></>;
                  return <>{stPart}–{etPart}</>;
                })() : t.noTimeSet}
              </div>
              <div style={{fontSize:10.5, fontWeight:500, color:textMuted2, opacity:0.6, marginTop:2}}><Num>{nf(item.duration)}</Num> {t.minutes}</div>
            </div>
            {onStartTimer && !item.done && (
              <button onClick={()=>onStartTimer(item.id, item.duration)} title={t.start} style={{width:30,height:30, borderRadius:"50%", border:"none", flexShrink:0, cursor:"pointer", background: c.bg, display:"flex", alignItems:"center", justifyContent:"center"}}>
                <Play size={13} fill="#fff" color="#fff"/>
              </button>
            )}
            {(onEdit || onDelete) && (
              <div style={{position:"relative", flexShrink:0}}>
                <button onClick={()=>{ setOpenMenuId(v => v===item.id ? null : item.id); setConfirmDeleteId(null); }} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, padding:4}}>
                  <MoreVertical size={16}/>
                </button>
                {openMenuId === item.id && (
                  <>
                    <div onClick={closeMenu} style={{position:"fixed", inset:0, zIndex:59}}/>
                    <div style={{position:"absolute", right:0, top:"100%", marginTop:4, background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:10, boxShadow:"0 6px 18px rgba(0,0,0,0.15)", zIndex:60, minWidth:150, overflow:"hidden"}}>
                      {confirmDeleteId === item.id ? (
                        <>
                          <div style={{padding:"9px 12px", fontSize:11.5, color:textMuted2, fontWeight:600}}>{t.confirmDeleteTopic || t.deleteTopic}</div>
                          <button onClick={()=>{ closeMenu(); onDelete(item.id); }} style={{display:"flex", alignItems:"center", gap:7, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:12.5, fontWeight:700, cursor:"pointer", textAlign:"left"}}>
                            <Trash2 size={13}/> {t.confirmDelete || t.deleteTopic}
                          </button>
                          <button onClick={()=>setConfirmDeleteId(null)} style={{display:"flex", alignItems:"center", gap:7, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:12.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                            {t.cancel}
                          </button>
                        </>
                      ) : (
                        <>
                          {onEdit && (
                            <button onClick={()=>{closeMenu(); onEdit(item);}} style={{display:"flex", alignItems:"center", gap:7, width:"100%", border:"none", background:"transparent", color:textMuted2, padding:"9px 12px", fontSize:12.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
                              <Pencil size={13}/> {t.edit}
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={()=>setConfirmDeleteId(item.id)} style={{display:"flex", alignItems:"center", gap:7, width:"100%", border:"none", background:"transparent", color:"#C0392B", padding:"9px 12px", fontSize:12.5, fontWeight:600, cursor:"pointer", textAlign:"left"}}>
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
  const [durationInput, setDurationInput] = useState(30);
  const inputStyle = { width:"100%", boxSizing:"border-box", background: dark?"#121110":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"11px 13px", fontSize:14, color:textMain, outline:"none", fontFamily:"inherit" };
  const duration = useTime ? diffMinutes(startTime, endTime) : (Number(durationInput) || 0);
  const canSubmit = subject.trim() && topic.trim();
  // Topic Bank quick-pick: not-yet-used topics first (still pending), then previously-used ones by recency —
  // ফ্রি-টেক্সট ফলব্যাক এখনো আছে (নিচের input), নতুন কিছু লিখলে সেটাও অটো ব্যাংকে যোগ হয়ে যাবে
  const pickTopics = topicPickList(topicBank, entries, subject);
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
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"22px 22px 0 0", padding:"20px 20px 28px", color:textMain}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
          <div style={{fontSize:17, fontWeight:800, letterSpacing:-0.2}}>{t.addTopicTitle}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:12}}>
          <div>
            <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.subjectLabel}</div>
            {subjectChips.length > 0 && (
              <div style={{fontSize:10, fontWeight:700, color:textMuted2, opacity:0.8, marginBottom:0}}>{t.pickSubject}</div>
            )}
            <RecentTopicChips topics={subjectChips} onPick={setSubject} accent={accent} cardBorder={cardBorder} textMuted2={textMuted2} dark={dark}/>
            <input style={{...inputStyle, marginTop: subjectChips.length ? 8 : 0}} value={subject} onChange={e=>setSubject(e.target.value)} placeholder={t.subjectPlaceholder}/>
            <div style={{fontSize:10.5, color:textMuted2, opacity:0.75, marginTop:5}}>{t.newSubjectAutoSaved}</div>
          </div>
          <div>
            <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.topicLabel}</div>
            {pickTopics.length > 0 && (
              <div style={{fontSize:10, fontWeight:700, color:textMuted2, opacity:0.8, marginBottom:6}}>{t.pickFromBank}</div>
            )}
            <RecentTopicChips topics={pickTopics} onPick={setTopic} accent={accent} cardBorder={cardBorder} textMuted2={textMuted2} dark={dark}/>
            <input style={{...inputStyle, marginTop: pickTopics.length ? 8 : 0}} value={topic} onChange={e=>setTopic(e.target.value)} placeholder={t.topicPlaceholder}/>
            <div style={{fontSize:10.5, color:textMuted2, opacity:0.75, marginTop:5}}>{t.newTopicAutoSaved}</div>
          </div>

          <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", userSelect:"none"}}>
            <input type="checkbox" checked={useTime} onChange={e=>setUseTime(e.target.checked)}
              style={{width:16, height:16, accentColor:accent, cursor:"pointer"}}/>
            <span style={{fontSize:13, fontWeight:600, color:textMain}}>{t.addTimeToggle}</span>
          </label>

          {useTime ? (
            <div style={{display:"flex", gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.startTimeLabel}</div>
                <input type="time" style={inputStyle} value={startTime} onChange={e=>setStartTime(e.target.value)}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.endTimeLabel}</div>
                <input type="time" style={inputStyle} value={endTime} onChange={e=>setEndTime(e.target.value)}/>
              </div>
            </div>
          ) : (
            <div>
              <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.durationLabel}</div>
              <input type="number" min="1" style={inputStyle} value={durationInput} onChange={e=>setDurationInput(e.target.value)}/>
            </div>
          )}

          <div style={{fontSize:12, color:textMuted2, fontWeight:600}}><Num>{nf(duration)}</Num> {t.minutes}</div>
        </div>
        <div style={{display:"flex", gap:10, marginTop:20}}>
          <button onClick={onClose} style={{flex:1, padding:"12px 0", borderRadius:12, border:`1px solid ${cardBorder}`, background:"transparent", color:textMain, fontWeight:700, cursor:"pointer"}}>{t.cancel}</button>
          <button onClick={submit}
            style={{flex:1, padding:"12px 0", borderRadius:12, border:"none", background:accent, color:"#fff", fontWeight:700, cursor:"pointer", opacity: canSubmit?1:0.5}}>{t.add}</button>
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
  const [durationInput, setDurationInput] = useState(item.duration || 30);
  const inputStyle = { width:"100%", boxSizing:"border-box", background: dark?"#121110":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"11px 13px", fontSize:14, color:textMain, outline:"none", fontFamily:"inherit" };
  const duration = useTime ? diffMinutes(startTime, endTime) : (Number(durationInput) || 0);
  const pickTopics = topicPickList(topicBank, entries, subject).filter(tp => tp !== item.topic);
  const submit = () => {
    if (!(subject && topic.trim())) return;
    onAddTopicToBank && onAddTopicToBank(subject, topic.trim());
    onSave({id:item.id, subject, topic:topic.trim(), time: useTime ? startTime : null, endTime: useTime ? endTime : null, duration});
  };
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"22px 22px 0 0", padding:"20px 20px 28px", color:textMain}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
          <div style={{fontSize:17, fontWeight:800, letterSpacing:-0.2}}>{t.editTopicTitle}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:12}}>
          <div>
            <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.subjectLabel}</div>
            <select style={inputStyle} value={subject} onChange={e=>setSubject(e.target.value)}>
              {[...subjectOptions].sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:"base"})).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.topicLabel}</div>
            {pickTopics.length > 0 && (
              <div style={{fontSize:10, fontWeight:700, color:textMuted2, opacity:0.8, marginBottom:6}}>{t.pickFromBank}</div>
            )}
            <RecentTopicChips topics={pickTopics} onPick={setTopic} accent={accent} cardBorder={cardBorder} textMuted2={textMuted2} dark={dark}/>
            <input style={{...inputStyle, marginTop: pickTopics.length ? 8 : 0}} value={topic} onChange={e=>setTopic(e.target.value)} placeholder={t.topicPlaceholder}/>
          </div>

          <label style={{display:"flex", alignItems:"center", gap:8, cursor:"pointer", userSelect:"none"}}>
            <input type="checkbox" checked={useTime} onChange={e=>setUseTime(e.target.checked)}
              style={{width:16, height:16, accentColor:accent, cursor:"pointer"}}/>
            <span style={{fontSize:13, fontWeight:600, color:textMain}}>{t.addTimeToggle}</span>
          </label>

          {useTime ? (
            <div style={{display:"flex", gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.startTimeLabel}</div>
                <input type="time" style={inputStyle} value={startTime} onChange={e=>setStartTime(e.target.value)}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.endTimeLabel}</div>
                <input type="time" style={inputStyle} value={endTime} onChange={e=>setEndTime(e.target.value)}/>
              </div>
            </div>
          ) : (
            <div>
              <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.durationLabel}</div>
              <input type="number" min="1" style={inputStyle} value={durationInput} onChange={e=>setDurationInput(e.target.value)}/>
            </div>
          )}

          <div style={{fontSize:12, color:textMuted2, fontWeight:600}}><Num>{nf(duration)}</Num> {t.minutes}</div>
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
  const inputStyle = { width:"100%", boxSizing:"border-box", background: dark?"#121110":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"11px 13px", fontSize:14, color:textMain, outline:"none", fontFamily:"inherit" };
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
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"22px 22px 0 0", padding:"20px 20px 28px", color:textMain, maxHeight:"82vh", display:"flex", flexDirection:"column"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
          <div style={{fontSize:17, fontWeight:800, letterSpacing:-0.2}}>{t.manageSubjects}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>
        <div style={{display:"flex", gap:8, marginBottom:16}}>
          <input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder={t.subjectPlaceholder}
            onKeyDown={e=>{ if (e.key === "Enter") submit(); }}/>
          <button onClick={submit} style={{border:"none", borderRadius:12, padding:"0 16px", background:accent, color:"#fff", fontWeight:700, cursor:"pointer"}}>{t.add}</button>
        </div>
        <div style={{overflowY:"auto", display:"flex", flexDirection:"column", gap:8}}>
          {subjects.length === 0 && <div style={{fontSize:13, color:textMuted2, textAlign:"center", padding:"20px 0"}}>{t.noSubjectsYet}</div>}
          {[...subjects].sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:"base"})).map(s => (
            <div key={s} style={{border:`1px solid ${cardBorder}`, borderRadius:12, padding:"10px 14px"}}>
              {editingSubject === s ? (
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  <div style={{display:"flex", gap:6, alignItems:"center"}}>
                    <input autoFocus style={{...inputStyle, padding:"8px 10px", fontSize:13}} value={editValue} onChange={e=>setEditValue(e.target.value)}
                      onKeyDown={e=>{ if (e.key==="Enter") saveEdit(); if (e.key==="Escape") cancelEdit(); }}/>
                    <button onClick={saveEdit} style={{border:"none", background:"transparent", cursor:"pointer", color:accent, flexShrink:0}}><Check size={17}/></button>
                    <button onClick={cancelEdit} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, flexShrink:0}}><X size={17}/></button>
                  </div>
                  {editError && <div style={{fontSize:11, color:"#C0553F", fontWeight:600}}>{editError}</div>}
                </div>
              ) : (
                <>
                  <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <button onClick={()=>onToggleExpand(s)} style={{display:"flex", alignItems:"center", gap:6, border:"none", background:"transparent", cursor:"pointer", padding:0, color:textMain}}>
                      <ChevronDown size={14} style={{transform: expandedSubject===s ? "rotate(0deg)" : "rotate(-90deg)", transition:"transform .15s ease", color:textMuted2, flexShrink:0}}/>
                      <span style={{fontSize:14, fontWeight:600, textAlign:"left"}}>{s}</span>
                      <span style={{fontSize:10.5, fontWeight:700, color:textMuted2, opacity:0.8}}>· <Num>{((topicBank && topicBank[s]) || []).length}</Num> {t.topicsLabel.toLowerCase()}</span>
                    </button>
                    <div style={{display:"flex", gap:14, alignItems:"center"}}>
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
  const smallInput = { width:"100%", boxSizing:"border-box", background: dark?"#121110":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:10, padding:"8px 10px", fontSize:13, color:textMain, outline:"none", fontFamily:"inherit" };
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
    <div style={{marginTop:12, paddingTop:12, borderTop:`1px solid ${cardBorder}`}}>
      <div style={{display:"flex", gap:6, marginBottom:8}}>
        <input style={smallInput} value={single} onChange={e=>setSingle(e.target.value)} placeholder={t.topicNamePlaceholder}
          onKeyDown={e=>{ if (e.key==="Enter") addSingle(); }}/>
        <button onClick={addSingle} style={{border:"none", borderRadius:10, padding:"0 12px", background:accent, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:12, flexShrink:0}}>{t.add}</button>
      </div>
      {!bulkOpen ? (
        <button onClick={()=>setBulkOpen(true)} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", fontSize:11, fontWeight:700, padding:0, marginBottom:10}}>
          + {t.bulkAddTopics}
        </button>
      ) : (
        <div style={{marginBottom:10}}>
          <textarea value={bulkText} onChange={e=>setBulkText(e.target.value)} placeholder={t.bulkAddPlaceholder} rows={3}
            style={{...smallInput, resize:"vertical", marginBottom:6}}/>
          <div style={{display:"flex", gap:6}}>
            <button onClick={addBulk} style={{border:"none", borderRadius:10, padding:"6px 12px", background:accent, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:11.5}}>{t.add}</button>
            <button onClick={()=>{setBulkOpen(false); setBulkText("");}} style={{border:`1px solid ${cardBorder}`, borderRadius:10, padding:"6px 12px", background:"transparent", color:textMain, fontWeight:700, cursor:"pointer", fontSize:11.5}}>{t.cancel}</button>
          </div>
        </div>
      )}
      <div style={{display:"flex", flexDirection:"column", gap:6}}>
        {topics.length === 0 && <div style={{fontSize:12, color:textMuted2, opacity:0.85}}>{t.noTopicsInSubject}</div>}
        {topics.map(tp => (
          <div key={tp} style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, background: dark?"#121110":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:10, padding:"7px 10px"}}>
            {editingTopic === tp ? (
              <div style={{display:"flex", flexDirection:"column", gap:4, flex:1}}>
                <div style={{display:"flex", gap:6, alignItems:"center"}}>
                  <input autoFocus style={{...smallInput, padding:"5px 8px", fontSize:12}} value={editValue} onChange={e=>setEditValue(e.target.value)}
                    onKeyDown={e=>{ if (e.key==="Enter") saveEdit(); if (e.key==="Escape") setEditingTopic(null); }}/>
                  <button onClick={saveEdit} style={{border:"none", background:"transparent", cursor:"pointer", color:accent, flexShrink:0}}><Check size={15}/></button>
                  <button onClick={()=>setEditingTopic(null)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2, flexShrink:0}}><X size={15}/></button>
                </div>
                {editError && <div style={{fontSize:10.5, color:"#C0553F", fontWeight:600}}>{editError}</div>}
              </div>
            ) : (
              <>
                <span style={{fontSize:11.5, fontWeight:600, wordBreak:"break-word"}}>{tp}</span>
                <div style={{display:"flex", gap:10, alignItems:"center", flexShrink:0}}>
                  <button onClick={()=>startEdit(tp)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><Pencil size={12.5}/></button>
                  <button onClick={()=>onRemoveTopic(subject, tp)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><Trash2 size={13}/></button>
                </div>
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
  const inputStyle = { width:"100%", boxSizing:"border-box", background: dark?"#121110":"#F8F5EE", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"11px 13px", fontSize:14, color:textMain, outline:"none", fontFamily:"inherit" };
  const submit = () => {
    if (!subject) return;
    onAdd(subject);
    const next = availableSubjects.filter(s => s !== subject);
    setSubject(next[0] || "");
  };
  const examList = Object.entries(examSubjects).sort((a,b)=>a[0].localeCompare(b[0], undefined, {sensitivity:"base"}));
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"22px 22px 0 0", padding:"20px 20px 28px", color:textMain, maxHeight:"80vh", display:"flex", flexDirection:"column"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
          <div style={{fontSize:17, fontWeight:800, letterSpacing:-0.2}}>{t.manageExams}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:10, marginBottom:16}}>
          {availableSubjects.length === 0 ? (
            <div style={{fontSize:13, color:textMuted2}}>{subjects.length === 0 ? t.addSubjectsFirst : "—"}</div>
          ) : (
            <>
              <div>
                <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:6}}>{t.subjectLabel}</div>
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
          {examList.length === 0 && <div style={{fontSize:13, color:textMuted2, textAlign:"center", padding:"20px 0"}}>{t.noExamSubjects}</div>}
          {examList.map(([s, info]) => {
            const topicCount = Object.keys(info?.topics || {}).length;
            return (
              <div key={s} style={{display:"flex", alignItems:"center", justifyContent:"space-between", border:`1px solid ${cardBorder}`, borderRadius:12, padding:"10px 14px"}}>
                <div>
                  <div style={{fontSize:14, fontWeight:600}}>{s}</div>
                  <div style={{fontSize:11, color:textMuted2, fontWeight:600, marginTop:2}}><Num>{nf(topicCount)}</Num> {t.topicsLabel}</div>
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
        const dotColor = !hasAny ? textMuted2 : (doneAll ? "#6E8B5E" : "#4C8FA6");
        return (
          <button key={i} onClick={()=>onSelectDay(d)} style={{
            flex:"0 0 auto", width:56, display:"flex", flexDirection:"column", alignItems:"center", gap:6,
            padding:"10px 0 11px", borderRadius:16, scrollSnapAlign:"start",
            border: isSelected ? "1px solid transparent" : (isToday ? `1px solid ${accent}` : `1px solid ${cardBorder}`),
            background: cardBg,
            cursor:"pointer", transition:"background .15s ease, border-color .15s ease",
          }}>
            <span style={{fontSize:10.5, fontWeight:700, color: isSelected ? accent : (isToday ? accent : textMuted2)}}>{weekdayShort(d)}</span>
            <span style={{
              width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
              background: isSelected ? (dark ? "rgba(217,119,87,0.22)" : "rgba(217,119,87,0.14)") : "transparent",
              boxShadow: isSelected ? `0 0 0 1.5px ${accent}` : "none",
              fontSize:16, fontWeight:800, color: isSelected ? accent : textMain, transition:"background .15s ease",
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
    <div style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:"14px 16px", marginTop:14}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
        <span style={{fontSize:13.5, fontWeight:700}}>{weekdayName(day)}, <Num>{nf(day.getDate())}</Num> {monthName(day.getMonth())}</span>
        {list.length > 0 && <span style={{fontSize:11.5, color:textMuted2, fontWeight:600}}><Num>{nf(doneCount)}</Num>/<Num>{nf(list.length)}</Num></span>}
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
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const cells = [];
  for (let i=0;i<startOffset;i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(y,m,d));
  const shortDays = lang==="bn" ? ["র","সো","ম","বু","বৃ","শু","শ"] : ["S","M","T","W","T","F","S"];

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
        <button onClick={()=>setCalMonth(new Date(y,m-1,1))} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", display:"flex", padding:4}}><ChevronLeft size={18}/></button>
        <span style={{fontSize:14.5, fontWeight:800}}>{monthName(m)} <Num>{nf(y)}</Num></span>
        <button onClick={()=>setCalMonth(new Date(y,m+1,1))} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", display:"flex", padding:4}}><ChevronRight size={18}/></button>
      </div>
      <div style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:"14px 12px"}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:8}}>
          {shortDays.map((d,i)=>(<div key={i} style={{textAlign:"center", fontSize:10.5, fontWeight:700, color:textMuted2}}>{d}</div>))}
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
                style={{display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"4px 0", border:"none", background:"transparent", cursor:(future&&!hasAny)?"default":"pointer", opacity:(future&&!hasAny)?0.4:1}}>
                <div style={{position:"relative", width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700,
                  background: isSelected ? accent : "transparent",
                  border: isToday && !isSelected ? `1px solid ${accent}` : "none",
                  color: isSelected ? "#fff" : textMain}}>
                  {isExam && <span style={{position:"absolute", top:-2, right:-2, width:5, height:5, borderRadius:"50%", background:"#1A1814"}}/>}
                  {isHoliday && <span style={{position:"absolute", top:-2, left:-2, width:5, height:5, borderRadius:"50%", background:"#C0392B"}}/>}
                  <Num>{nf(d.getDate())}</Num>
                </div>
                <span style={{width:4, height:4, borderRadius:"50%", background: !hasAny ? "transparent" : (doneAll ? "#6E8B5E" : "#4C8FA6")}}/>
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
  { bg: "#FDE7C8", bgDark: "#3A3120", text: "#7A5010" },
  { bg: "#D9EAD3", bgDark: "#22301F", text: "#3E6B2E" },
  { bg: "#CFE2F3", bgDark: "#1E2C36", text: "#2B5F8A" },
  { bg: "#F4CCCC", bgDark: "#3A2323", text: "#A14444" },
  { bg: "#E6D9F5", bgDark: "#2E2536", text: "#6B4A9E" },
  { bg: "#D0ECE7", bgDark: "#1F332F", text: "#2E7D6E" },
  { bg: "#FCE4EC", bgDark: "#332126", text: "#B03A63" },
  { bg: "#FFF2CC", bgDark: "#332C1B", text: "#8A7217" },
];
function noteColorFor(category, allCategories) {
  const idx = Math.max(0, (allCategories || []).indexOf(category));
  return NOTE_COLOR_PALETTE[idx % NOTE_COLOR_PALETTE.length];
}

// ---------- Notes: নোট কার্ডের ব্যাকগ্রাউন্ড রঙ (ঐচ্ছিক) — প্রতি নোট আলাদা রঙ করে রাখা যাবে, যাতে চোখের দেখায় দ্রুত খুঁজে পাওয়া যায় ----------
const NOTE_BG_PALETTE = [
  { key: null,     bg: null,      bgDark: null,      labelBn: "ডিফল্ট", labelEn: "Default" },
  { key: "white",  bg: "#FFFFFF", bgDark: "#FFFFFF", labelBn: "সাদা",   labelEn: "White", ink: "#2C2820", inkDark: "#2C2820" },
  { key: "black",  bg: "#1A1814", bgDark: "#1A1814", labelBn: "কালো",   labelEn: "Black", ink: "#F3EFE7", inkDark: "#F3EFE7" },
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
  return dark ? "#F3EFE7" : NOTE_PAPER_TEXT;
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

// ---------- ফুল date + time (Created / Last edited দেখানোর জন্য) ----------
function fullDateTimeLabel(iso, lang) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString(lang === "bn" ? "bn-BD" : "en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

// নোট নিজেই সবসময় অফ-হোয়াইট (পেপার-এর মতো) থাকবে — অ্যাপের ডার্ক মোড থিম আলাদা, এটা শুধু নোটের জন্য
const NOTE_PAPER_BG = "#F7F1E3";
const NOTE_PAPER_TEXT = "#2C2820";
const NOTE_PAPER_MUTED = "#7C7361";

function NotesView({ t, lang, notes, setNotes, search, setSearch, onNew, cardBg, cardBorder, textMain, textMuted2, accent, dark, isDesktop, bg }) {
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("General");
  const [checklist, setChecklist] = useState([]);
  const checklistInputRefs = useRef({}); // চেকলিস্টের প্রতিটা আইটেমের input DOM এলিমেন্ট — Enter/Backspace চাপার পর ঠিক জায়গায় ফোকাস আনতে ব্যবহার হয়
  const [focusChecklistId, setFocusChecklistId] = useState(null); // নতুন/মার্জ হওয়া আইটেমে অটো-ফোকাস করতে
  const focusCaretPosRef = useRef(null); // ফোকাস করার সময় কার্সার ঠিক কোন জায়গায় বসবে (null মানে টেক্সটের শেষে)
  const [fontSize, setFontSize] = useState(14.5); // নোটের ডিফল্ট/বেস ফন্ট সাইজ — নতুন লেখা (যেখানে আলাদা সাইজ সেট করা হয়নি) এই সাইজেই দেখা যায়
  const [activeFontSize, setActiveFontSize] = useState(14.5); // কার্সার/সিলেকশনে এখন যে ফন্ট সাইজ আছে — A-/A+ বাটনের disable অবস্থা ও পরের সাইজ হিসাব করতে ব্যবহার হয়
  const [noteColor, setNoteColor] = useState(null); // নোট কার্ডের ব্যাকগ্রাউন্ড রঙ — null মানে ডিফল্ট বেইজ রঙ, প্রতি নোটে আলাদাভাবে সেভ থাকে
  const [activeFolder, setActiveFolder] = useState("All Notes");
  const [openMenu, setOpenMenu] = useState(null);
  const [showSearch, setShowSearch] = useState(false); // উপরের সার্চ আইকনে ট্যাপ করলে সার্চ বার দেখা যায়
  const [fabOpen, setFabOpen] = useState(false); // নিচের ফ্লোটিং + বাটনে ট্যাপ করলে Note/Checklist অপশন দেখা যায়
  const [pinnedDraft, setPinnedDraft] = useState(false); // এডিটরের ভেতরের pin টগল (এখনো সেভ না হওয়া নোটের জন্যও কাজ করে)
  const [showChecklist, setShowChecklist] = useState(false); // বটম টুলবারের checklist আইকন দিয়ে টগল হয়
  const [showColorPicker, setShowColorPicker] = useState(false); // বটম টুলবারের palette আইকন দিয়ে টগল হয়
  const [showBgColorPicker, setShowBgColorPicker] = useState(false); // বটম টুলবারের নতুন রঙ (Palette) আইকন দিয়ে টগল হয় — নোট কার্ডের ব্যাকগ্রাউন্ড রঙ বাছাই
  const [showMoreMenu, setShowMoreMenu] = useState(false); // এডিটর হেডারের ⋮ মেনু
  const [showFormatBar, setShowFormatBar] = useState(false); // বটম টুলবারের "Aa" আইকন দিয়ে টগল হয় — Bold/Italic/Underline/H1/H2 রো
  const [categoryMenuFor, setCategoryMenuFor] = useState(null); // কোন ক্যাটাগরি চিপ লং-প্রেস করা হয়েছে — Rename/Delete মেনু দেখানোর জন্য
  const catPressTimerRef = useRef(null); // ক্যাটাগরি চিপ লং-প্রেস ডিটেক্ট করার টাইমার
  const [filterDate, setFilterDate] = useState(null); // নির্দিষ্ট তারিখে ফিল্টার — ক্যালেন্ডার আইকন দিয়ে সিলেক্ট করলে সেট হয়
  const [showDatePicker, setShowDatePicker] = useState(false); // সার্চের পাশের ক্যালেন্ডার আইকনে ট্যাপ করলে ছোট ডেট-পিকার দেখা যায়
  const [calMonth, setCalMonth] = useState(new Date()); // ডেট-পিকারে বর্তমানে কোন মাস দেখানো হচ্ছে
  const [draggingId, setDraggingId] = useState(null); // লং-প্রেস করে যে নোটটা এখন ড্র্যাগ হচ্ছে
  const [overId, setOverId] = useState(null); // ড্র্যাগ করা নোটটা এখন কোন নোটের উপর আছে (drop target)
  const dragRef = useRef({ id: null, startX: 0, startY: 0, dragging: false, timeout: null }); // ড্র্যাগের রানটাইম তথ্য (রি-রেন্ডার ছাড়াই দরকার)
  const justDraggedRef = useRef(false); // ড্র্যাগ শেষ হওয়ার পর একই ট্যাপে যেন নোট এডিটর খুলে না যায়
  const nf = (n) => (lang === "bn" ? toBn(n) : n); // সংখ্যা — বাংলা হলে বাংলা অংক
  const bodyRef = useRef(null); // contentEditable বডি — রিচ টেক্সট ফরম্যাটিং প্রয়োগ করতে ব্যবহার হয়
  const searchRef = useRef(null); // সার্চ আইকনে ট্যাপ করলে ইনপুটে অটো-ফোকাস করতে
  const vh = useVisualViewportHeight(); // কীবোর্ড খোলা অবস্থায় দৃশ্যমান উচ্চতা — মোডাল সবসময় এর মধ্যেই থাকবে, কীবোর্ডের নিচে চাপা পড়বে না
  const pushedHistoryRef = useRef(false); // নোট এডিটর খোলার সময় history-তে state push করেছি কিনা (ব্যাক বাটন হ্যান্ডল করতে)
  const editingActiveRef = useRef(false); // popstate হ্যান্ডলারের ভেতর থেকে সবসময় সবশেষ editing অবস্থা জানার জন্য
  // উপরের ব্যাক অ্যারোতে ট্যাপ করলে save() নিজেই history.back() ডাকে, যেটা popstate ইভেন্ট ট্রিগার করে —
  // আর popstate হ্যান্ডলারও save() ডাকে (হার্ডওয়্যার ব্যাক হ্যান্ডল করতে)। savedRef ছাড়া এই দুটো মিলে একই নোট
  // দুইবার সেভ হয়ে ডুপ্লিকেট নোট তৈরি করছিল — এই ফ্ল্যাগ নিশ্চিত করে একটা এডিটর সেশনে নোট একবারই সেভ হয়
  const savedRef = useRef(false);

  useEffect(() => { editingActiveRef.current = !!editing; }, [editing]);

  // popstate লিসেনার একবারই বসে (মাউন্টে), তাই ওর ভেতরের ক্লোজার সবসময় পুরনো/স্টেল title-body-ইত্যাদি ধরে রাখতো —
  // saveRef প্রতি রেন্ডারে সবশেষ save() ফাংশনটা ধরে রাখে, যাতে popstate সবসময় সবশেষ লেখাটাই সেভ করে
  const saveRef = useRef(() => {});

  // হার্ডওয়্যার/ব্রাউজার ব্যাক বাটন (বা ফোনের "ব্যাক" জেসচার) চাপলে নোট এডিটর বন্ধ হওয়ার আগে এখন পর্যন্ত যা লেখা হয়েছে
  // সেটা সেভ করে তারপর নোটস ট্যাবে ফিরে আসবে — আগে এখানে সেভ ছাড়াই বন্ধ হয়ে যেত, শুধু উপরের ব্যাক অ্যারো চাপলে সেভ হতো
  useEffect(() => {
    const onPop = () => {
      // history ইতিমধ্যে পপ হয়ে গেছে, তাই pushedHistoryRef আগেই false করে দিচ্ছি — নাহলে save()-এর ভেতরের
      // closeEditor() আরেকবার history.back() ডাকতে চাইবে
      pushedHistoryRef.current = false;
      if (editingActiveRef.current) {
        saveRef.current();
        setEditing(null); // খালি নোট হলে save() কিছু না করেই রিটার্ন করে, তাও এডিটর যেন বন্ধ হয় সেটা নিশ্চিত করা
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const closeEditor = () => {
    if (pushedHistoryRef.current) {
      pushedHistoryRef.current = false;
      window.history.back();
    } else {
      setEditing(null);
    }
  };

  // মোবাইলে টুলবারের বাটনে ট্যাপ করলেই প্রায়ই সিলেকশন হারিয়ে যায় (touch/blur এর কারণে) — তাই সিলেকশন করার সাথে সাথেই
  // সেটা এখানে সেভ করে রাখি, আর প্রতিটা ফরম্যাটিং অ্যাকশনের ঠিক আগে সেটা আবার বসিয়ে দিই। এতে Bold/Italic/Color/ফন্ট সাইজ —
  // সবগুলো বাটনই আসলে যে টেক্সট সিলেক্ট করা হয়েছিল, ঠিক সেটার উপরেই কাজ করে, বারবার নতুন করে সিলেক্ট করা লাগে না
  const savedRangeRef = useRef(null);
  const saveBodySelection = () => {
    const el = bodyRef.current;
    const sel = window.getSelection();
    if (el && sel && sel.rangeCount > 0 && el.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };
  const restoreBodySelection = () => {
    const el = bodyRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel) return;
    if (savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    } else if (sel.rangeCount === 0 || !el.contains(sel.anchorNode)) {
      const r = document.createRange();
      r.selectNodeContents(el);
      r.collapse(false);
      sel.removeAllRanges();
      sel.addRange(r);
    }
  };
  // টুলবার বাটনে ট্যাপ করার পর ফরম্যাটিং প্রয়োগ করা হয়ে গেলে, নতুন সিলেকশনটাই (যা এখন এডিট হলো) আবার সেভ করে রাখা —
  // যাতে পরপর কয়েকবার ক্লিক করলে (যেমন ফন্ট আরও বড় করা) প্রতিবারই ঠিক একই অংশের উপর কাজ করে
  const applyBodyCommand = (fn) => {
    const el = bodyRef.current;
    if (!el) return;
    restoreBodySelection();
    fn();
    setBody(el.innerHTML);
    saveBodySelection();
    syncActiveFontSize();
  };

  // নোট বডিতে "1. " দিয়ে লাইন শুরু করে Enter চাপলে পরের লাইনে অটো ২, ৩, ৪... বসে —
  // আর খালি নাম্বারড লাইনে (মানে ডাবল Enter) আবার Enter চাপলে নাম্বারিং থেমে গিয়ে লাইনটা প্লেইন খালি লাইন হয়ে যায়
  const handleBodyEnterKey = (e) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    const el = bodyRef.current;
    if (!el) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const anchor = sel.anchorNode;
    if (!anchor || !el.contains(anchor)) return;

    // কার্সার যে লাইনে আছে, সেই লাইনের ব্লক-লেভেল এলিমেন্ট খুঁজে বের করা (bodyRef-এর সরাসরি চাইল্ড)
    let block = anchor;
    while (block && block !== el && block.parentNode !== el) block = block.parentNode;
    if (!block || block === el) return; // প্রথম লাইনে এখনো কোনো wrapping div তৈরি হয়নি — স্বাভাবিক Enter চলবে

    const lineText = block.textContent || "";
    const m = /^(\d+)\.[ \u00A0]?(.*)$/.exec(lineText);
    if (!m) return; // নাম্বারড লাইন না হলে স্বাভাবিক Enter আচরণই চলবে

    e.preventDefault();
    const currentNum = parseInt(m[1], 10);
    const restText = m[2];

    if (restText.trim() === "") {
      // ডাবল এন্টার — নাম্বার মুছে লাইনটা প্লেইন খালি লাইন করে দেওয়া, নতুন লাইন তৈরি না করে এখানেই থামা
      block.innerHTML = "<br>";
      const r = document.createRange();
      r.setStart(block, 0);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
    } else {
      // execCommand("insertHTML")-এ নতুন <div> insert করা মোবাইল WebView-তে অনির্ভরযোগ্য — মাঝেমধ্যে
      // নতুন ব্লক তৈরি না করে ইনলাইন টেক্সট হিসেবে বসিয়ে দেয় (যেমন "1. Maruf2." একই লাইনে)।
      // তাই সরাসরি DOM/Range API দিয়ে কার্সারের পরের অংশ কেটে একটা আসল নতুন <div> বানিয়ে বসানো হচ্ছে —
      // এতে সবসময় নতুন লাইনেই নাম্বারিং শুরু হবে।
      const nextNum = currentNum + 1;
      const range = sel.getRangeAt(0);
      const afterRange = document.createRange();
      afterRange.setStart(range.endContainer, range.endOffset);
      afterRange.setEnd(block, block.childNodes.length);
      const afterFragment = afterRange.extractContents();

      const newDiv = document.createElement("div");
      const prefix = document.createTextNode(`${nextNum}.\u00A0`);
      newDiv.appendChild(prefix);
      newDiv.appendChild(afterFragment);
      block.parentNode.insertBefore(newDiv, block.nextSibling);

      const newRange = document.createRange();
      newRange.setStart(newDiv, 1);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
    if (bodyRef.current) setBody(bodyRef.current.innerHTML);
  };

  // ---- ফন্ট সাইজ: পুরো বক্স না, শুধু সিলেক্ট করা অংশ বা কার্সার থেকে যা টাইপ হবে তার সাইজ বদলায় ----
  const FONT_MIN = 12, FONT_MAX = 26, FONT_STEP = 1.5;

  // কার্সার/সিলেকশনের জায়গায় এখন আসলে কত পিক্সেল ফন্ট সাইজ আছে, সেটা বের করা (নাহলে fallback)
  const getCaretFontSizePx = (el, fallback) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !el) return fallback;
    let node = sel.anchorNode;
    if (!node || !el.contains(node)) return fallback;
    if (node.nodeType === 3) node = node.parentElement;
    if (!node) return fallback;
    const px = parseFloat(window.getComputedStyle(node).fontSize);
    return isNaN(px) ? fallback : px;
  };

  // সিলেকশন/কার্সার বদলালে A-/A+ বাটনের অবস্থা (disable ও পরের ধাপের হিসাব) আপডেট রাখা
  const syncActiveFontSize = () => {
    if (!bodyRef.current) return;
    const px = getCaretFontSizePx(bodyRef.current, fontSize);
    setActiveFontSize(Math.round(px * 10) / 10);
    saveBodySelection();
  };

  // A-/A+: কিছু সিলেক্ট করা থাকলে শুধু সিলেকশনের সাইজ বদলায়; কিছু সিলেক্ট না থাকলে কার্সার থেকে
  // এরপর যা টাইপ হবে সেটাই নতুন সাইজে আসতে থাকে — পুরো নোটের সাইজ আর বদলায় না
  const applyFontSizeDelta = (delta) => {
    const el = bodyRef.current;
    if (!el) return;
    // বাটনে ট্যাপ করার সময় সিলেকশন হারিয়ে যেতে পারে — যা সিলেক্ট করা ছিল সেটাই ফিরিয়ে আনা
    restoreBodySelection();
    const sel = window.getSelection();
    if (!sel) return;
    const current = getCaretFontSizePx(el, activeFontSize);
    const next = Math.max(FONT_MIN, Math.min(FONT_MAX, Math.round((current + delta) * 10) / 10));

    // পুরনো ট্রিক: execCommand("fontSize") দিয়ে সিলেকশন/কার্সারে <font size="7"> বসিয়ে সেটাকে
    // নির্দিষ্ট px সাইজের <span>-এ বদলে দেওয়া — এভাবে যেকোনো px সাইজ প্রয়োগ করা যায়
    document.execCommand("styleWithCSS", false, false);
    document.execCommand("fontSize", false, "7");
    el.querySelectorAll('font[size="7"]').forEach((f) => {
      const span = document.createElement("span");
      span.style.fontSize = next + "px";
      while (f.firstChild) span.appendChild(f.firstChild);
      f.replaceWith(span);
      // span-টা বসানোর পর পুরনো নোড ডিটাচড হয়ে যায়, তাই ব্রাউজারের সিলেকশন এমনিতেই হারিয়ে যায় — টেক্সট
      // সিলেক্ট করা ছিল বা না ছিল, দুই ক্ষেত্রেই span-এর কনটেন্টের উপর সিলেকশন আবার বসিয়ে দেওয়া হচ্ছে,
      // যাতে বারবার A+/A- চাপলে প্রতিবার আবার সিলেক্ট করা না লাগে
      const r2 = document.createRange();
      if (span.firstChild) {
        r2.selectNodeContents(span);
      } else {
        r2.setStart(span, 0);
        r2.collapse(true);
      }
      sel.removeAllRanges();
      sel.addRange(r2);
    });
    setBody(el.innerHTML);
    setActiveFontSize(next);
    saveBodySelection();
  };
  const [categories, setCategories] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("focusgo_note_categories_v1") || "[]");
      return Array.isArray(saved) && saved.length ? saved : ["General", "Study", "Personal", "Ideas"];
    } catch (e) {
      return ["General", "Study", "Personal", "Ideas"];
    }
  });

  useEffect(() => {
    try { window.localStorage.setItem("focusgo_note_categories_v1", JSON.stringify(categories)); } catch (e) {}
  }, [categories]);

  // ক্যাটাগরি চিপে চেপে ধরে রাখলে (long-press) Rename/Delete মেনু দেখানোর জন্য টাইমার শুরু/বাতিল
  const startCatPress = (cat) => {
    cancelCatPress();
    catPressTimerRef.current = setTimeout(() => { vibrate(); setCategoryMenuFor(cat); }, 480);
  };
  const cancelCatPress = () => {
    if (catPressTimerRef.current) { clearTimeout(catPressTimerRef.current); catPressTimerRef.current = null; }
  };

  const openNew = (startWithChecklist) => {
    savedRef.current = false;
    setEditing({ id: null });
    setTitle("");
    setBody("");
    setCategory(activeFolder !== "All Notes" && activeFolder !== "Pinned" ? activeFolder : "General");
    if (startWithChecklist) {
      const firstId = `${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
      setChecklist([{ id: firstId, text: "", done: false }]);
      focusCaretPosRef.current = 0;
      setFocusChecklistId(firstId);
    } else {
      setChecklist([]);
    }
    setFontSize(14.5);
    setActiveFontSize(14.5);
    setNoteColor(null);
    setOpenMenu(null);
    setFabOpen(false);
    setPinnedDraft(false);
    setShowChecklist(!!startWithChecklist);
    setShowColorPicker(false);
    setShowBgColorPicker(false);
    setShowMoreMenu(false);
    setShowFormatBar(false);
    window.history.pushState({ fgNoteEditor: true }, "");
    pushedHistoryRef.current = true;
  };

  const openEdit = (note) => {
    savedRef.current = false;
    setEditing(note);
    setTitle(note.title || "");
    setBody(note.body || "");
    setCategory(note.category || "General");
    setChecklist(Array.isArray(note.checklist) ? note.checklist : []);
    setFontSize(note.fontSize || 14.5);
    setActiveFontSize(note.fontSize || 14.5);
    setNoteColor(note.color || null);
    setOpenMenu(null);
    setPinnedDraft(!!note.pinned);
    setShowChecklist(Array.isArray(note.checklist) && note.checklist.length > 0);
    setShowColorPicker(false);
    setShowBgColorPicker(false);
    setShowMoreMenu(false);
    setShowFormatBar(false);
    window.history.pushState({ fgNoteEditor: true }, "");
    pushedHistoryRef.current = true;
  };

  const save = () => {
    // এই এডিটর সেশনে ইতিমধ্যে সেভ হয়ে গেছে — ব্যাক অ্যারো ক্লিকের পর history.back() যে popstate ট্রিগার করে,
    // সেটা আবার save() ডাকলেও যেন দ্বিতীয় একটা ডুপ্লিকেট নোট তৈরি না হয়
    if (savedRef.current) { closeEditor(); return; }
    const bodyIsEmpty = !stripHtmlToText(body);
    if (!title.trim() && bodyIsEmpty && checklist.length === 0) { closeEditor(); return; }
    const now = new Date().toISOString();
    const cleanChecklist = checklist
      .map(x => ({
        id: x.id || `${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
        text: (x.text || "").trim(),
        done: !!x.done
      }))
      .filter(x => x.text);

    const cleanBody = bodyIsEmpty ? "" : body;
    if (editing?.id) {
      setNotes(prev => prev.map(n => n.id === editing.id
        ? { ...n, title: title.trim() || "Untitled", body: cleanBody, category, checklist: cleanChecklist, pinned: pinnedDraft, fontSize, color: noteColor, updatedAt: now }
        : n
      ));
    } else {
      setNotes(prev => [{
        id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
        title: title.trim() || "Untitled",
        body: cleanBody,
        category,
        checklist: cleanChecklist,
        pinned: pinnedDraft,
        fontSize,
        color: noteColor,
        createdAt: now,
        updatedAt: now,
        order: Date.now()
      }, ...prev]);
    }
    savedRef.current = true;
    closeEditor();
  };
  useEffect(() => { saveRef.current = save; });

  const remove = (id) => {
    if (!window.confirm("Delete this note?")) return;
    setNotes(prev => prev.filter(n => n.id !== id));
    setOpenMenu(null);
    if (editing) closeEditor(); else setEditing(null);
  };

  const togglePin = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
    setOpenMenu(null);
  };

  const addCategory = () => {
    const name = window.prompt("Category name");
    const clean = (name || "").trim();
    if (!clean) return;
    if (!categories.some(c => c.toLowerCase() === clean.toLowerCase())) {
      setCategories(prev => [...prev, clean]);
    }
    setCategory(clean);
  };

  const deleteCategory = (name) => {
    if (name === "General") return; // "General" সবসময় থাকবে, কারণ ডিলিট হওয়া ক্যাটাগরির নোট এখানেই আসে
    if (!window.confirm(`Delete category "${name}"? Notes will move to General.`)) return;
    setCategories(prev => prev.filter(c => c !== name));
    setNotes(prev => prev.map(n => n.category === name ? { ...n, category: "General" } : n));
    if (activeFolder === name) setActiveFolder("All Notes");
  };

  // যেকোনো ফোল্ডার/ক্যাটাগরির নাম পরিবর্তন — tap-and-hold বা "..." মেনু থেকে কল হয়
  const renameCategory = (name) => {
    const next = window.prompt(lang === "bn" ? "নতুন নাম" : "New name", name);
    const clean = (next || "").trim();
    if (!clean || clean === name) return;
    if (categories.some(c => c.toLowerCase() === clean.toLowerCase())) {
      window.alert(lang === "bn" ? "এই নামে আগে থেকেই একটা ক্যাটাগরি আছে।" : "A category with this name already exists.");
      return;
    }
    setCategories(prev => prev.map(c => c === name ? clean : c));
    setNotes(prev => prev.map(n => (n.category || "General") === name ? { ...n, category: clean } : n));
    if (activeFolder === name) setActiveFolder(clean);
    if (category === name) setCategory(clean);
  };

  // চেকলিস্ট আইটেম এখন নিজেই এডিটেবল — Google Keep-এর মতো Enter চাপলে কার্সারের জায়গা থেকে টেক্সট ভেঙে
  // একটা নতুন আইটেম তৈরি হয় (নিচের অংশটা নতুন আইটেমে যায়), আর খালি আইটেমের শুরুতে Backspace চাপলে
  // আগের আইটেমের সাথে জুড়ে যায় — ঠিক যেভাবে Keep-এ কাজ করে
  const updateChecklistText = (id, text) => {
    setChecklist(prev => prev.map(x => x.id === id ? { ...x, text } : x));
  };

  const splitChecklistItem = (index, before, after) => {
    const newId = `${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
    setChecklist(prev => {
      const next = prev.map((x, i) => i === index ? { ...x, text: before } : x);
      next.splice(index + 1, 0, { id: newId, text: after, done: false });
      return next;
    });
    focusCaretPosRef.current = 0;
    setFocusChecklistId(newId);
  };

  const mergeChecklistItemWithPrev = (index) => {
    if (index <= 0) return;
    const prevItem = checklist[index - 1];
    const curItem = checklist[index];
    if (!prevItem || !curItem) return;
    const boundary = (prevItem.text || "").length;
    setChecklist(prev => {
      const next = prev.filter((_, i) => i !== index);
      next[index - 1] = { ...next[index - 1], text: (prevItem.text || "") + (curItem.text || "") };
      return next;
    });
    focusCaretPosRef.current = boundary;
    setFocusChecklistId(prevItem.id);
  };

  const appendChecklistItem = () => {
    const newId = `${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
    setChecklist(prev => [...prev, { id: newId, text: "", done: false }]);
    focusCaretPosRef.current = null;
    setFocusChecklistId(newId);
  };

  // নতুন/মার্জ হওয়া আইটেম রেন্ডার হওয়ার পর ঠিক জায়গায় (কার্সার-সহ) ফোকাস বসানো
  useEffect(() => {
    if (!focusChecklistId) return;
    const el = checklistInputRefs.current[focusChecklistId];
    if (el) {
      el.focus();
      const pos = focusCaretPosRef.current != null ? focusCaretPosRef.current : el.value.length;
      try { el.setSelectionRange(pos, pos); } catch (err) {}
    }
    focusCaretPosRef.current = null;
    setFocusChecklistId(null);
  }, [focusChecklistId, checklist]);

  const filtered = notes
    .filter(n => {
      if (activeFolder === "Pinned") return !!n.pinned;
      if (activeFolder !== "All Notes") return (n.category || "General") === activeFolder;
      return true;
    })
    .filter(n => {
      const q = search.toLowerCase().trim();
      if (!q) return true;
      const checklistText = Array.isArray(n.checklist) ? n.checklist.map(x => x.text).join(" ") : "";
      return `${n.title} ${n.body} ${n.category || ""} ${checklistText}`.toLowerCase().includes(q);
    })
    .filter(n => {
      // ক্যালেন্ডার আইকন দিয়ে কোনো তারিখ সিলেক্ট করা থাকলে শুধু সেদিনের নোটগুলোই দেখাবে
      if (!filterDate) return true;
      const created = n.createdAt ? new Date(n.createdAt) : null;
      return created && dateKey(created) === dateKey(filterDate);
    })
    .sort((a, b) =>
      Number(!!b.pinned) - Number(!!a.pinned) ||
      (b.order ?? new Date(b.updatedAt || 0).getTime()) - (a.order ?? new Date(a.updatedAt || 0).getTime())
    );

  // লং-প্রেস করে ড্র্যাগ করে নোটের অবস্থান বদলানো — draggedId-কে targetId-এর জায়গায় নিয়ে বাকিদের নতুন করে সাজানো হয়
  const reorderNotes = (draggedId, targetId) => {
    const list = [...filtered];
    const fromIdx = list.findIndex(n => n.id === draggedId);
    const toIdx = list.findIndex(n => n.id === targetId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    const base = Date.now();
    const orderMap = {};
    list.forEach((n, i) => { orderMap[n.id] = base - i; });
    setNotes(prev => prev.map(n => (orderMap[n.id] !== undefined ? { ...n, order: orderMap[n.id] } : n)));
  };

  // পয়েন্টার (মাউস/টাচ দুটোতেই কাজ করে) দিয়ে ড্র্যাগ শুরু — কার্ডে অল্প সময় চেপে ধরে রাখলে (long-press) ড্র্যাগ মোড চালু হয়, তার আগ পর্যন্ত সাধারণ ট্যাপ/স্ক্রল হিসেবেই কাজ করে
  const handleCardPointerDown = (e, note) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const { clientX, clientY } = e;
    dragRef.current.id = note.id;
    dragRef.current.startX = clientX;
    dragRef.current.startY = clientY;
    dragRef.current.dragging = false;
    clearTimeout(dragRef.current.timeout);
    dragRef.current.timeout = setTimeout(() => {
      if (dragRef.current.id !== note.id) return;
      dragRef.current.dragging = true;
      setDraggingId(note.id);
      if (navigator.vibrate) navigator.vibrate(12);
    }, 350);
  };
  const handleCardPointerMove = (e) => {
    if (!dragRef.current.id) return;
    const dx = Math.abs(e.clientX - dragRef.current.startX);
    const dy = Math.abs(e.clientY - dragRef.current.startY);
    if (!dragRef.current.dragging) {
      if (dx > 10 || dy > 10) { clearTimeout(dragRef.current.timeout); dragRef.current.id = null; }
      return;
    }
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const cardEl = el && el.closest && el.closest("[data-note-id]");
    if (cardEl) {
      const id = cardEl.getAttribute("data-note-id");
      if (id !== dragRef.current.id) setOverId(id); else setOverId(null);
    }
  };
  const handleCardPointerUp = () => {
    clearTimeout(dragRef.current.timeout);
    if (dragRef.current.dragging && overId && overId !== dragRef.current.id) {
      reorderNotes(dragRef.current.id, overId);
      justDraggedRef.current = true;
    }
    dragRef.current.id = null;
    dragRef.current.dragging = false;
    setDraggingId(null);
    setOverId(null);
  };

  return (
    <>
    <div className="fg-tab-panel" style={{ marginTop: 20, paddingBottom: 30 }} onClick={() => { openMenu && setOpenMenu(null); fabOpen && setFabOpen(false); categoryMenuFor && setCategoryMenuFor(null); }}>
      {/* Bold/Italic/Underline/H1/H2 রিচ টেক্সট স্টাইল — নোট এডিটর ও নোট কার্ড প্রিভিউ, দুই জায়গাতেই কাজ করার জন্য একবারই বসানো */}
      <style>{`
        .fg-note-body h1{font-size:1.5em;font-weight:800;margin:0.5em 0 0.25em;line-height:1.25;}
        .fg-note-body h2{font-size:1.22em;font-weight:800;margin:0.5em 0 0.25em;line-height:1.3;}
        .fg-note-body b, .fg-note-body strong{font-weight:800;}
        .fg-note-body u{text-decoration:underline;}
        .fg-note-body:focus{outline:none;}
        /* Enter চাপলে ব্রাউজার নতুন <p>/<div> বসায়, যেগুলোর নিজস্ব ডিফল্ট মার্জিন থাকে — সেটাই দুই লাইনের মাঝে
           বাড়তি ফাঁকা জায়গা তৈরি করছিল; এখানে সেই মার্জিন শূন্য করে দেওয়া হলো যাতে লাইন স্পেসিং শুধু line-height অনুযায়ী হয় */
        .fg-note-body p, .fg-note-body div{margin:0;}
      `}</style>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div>
          <div style={{ fontSize:19, fontWeight:800, letterSpacing:-0.3, color:textMain }}>{t.notesTitle}</div>
          <div style={{ fontSize:11.5, color:textMuted2, marginTop:3 }}>{t.notesSubtitle}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <button
            onClick={(e)=>{e.stopPropagation();setShowSearch(v=>{const next=!v; if(next){requestAnimationFrame(()=>searchRef.current&&searchRef.current.focus());}else{setSearch("");} return next;});}}
            style={{ width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",background:showSearch?accent:cardBg,color:showSearch?"#fff":textMain,border:`1px solid ${showSearch?accent:cardBorder}`,borderRadius:"50%",cursor:"pointer",flexShrink:0 }}
            title={lang==="bn"?"সার্চ":"Search"}
          >
            {showSearch ? <X size={16}/> : <Search size={16}/>}
          </button>
          <button
            onClick={(e)=>{e.stopPropagation();setCalMonth(filterDate || new Date());setShowDatePicker(true);}}
            style={{ width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",background:filterDate?accent:cardBg,color:filterDate?"#fff":textMain,border:`1px solid ${filterDate?accent:cardBorder}`,borderRadius:"50%",cursor:"pointer",flexShrink:0 }}
            title={lang==="bn"?"তারিখ দিয়ে দেখুন":"View by date"}
          >
            <Calendar size={15}/>
          </button>
        </div>
      </div>

      {/* কোনো নির্দিষ্ট তারিখ সিলেক্ট করা থাকলে তার একটা ছোট ব্যানার — সহজে ক্লিয়ার করা যায় */}
      {filterDate && (
        <div onClick={e=>e.stopPropagation()} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,background:dark?"#2B281F":"#FFF4DF",border:`1px solid ${accent}`,borderRadius:12,padding:"9px 12px",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:7,fontSize:12.5,fontWeight:700,color:accent}}>
            <Calendar size={14}/>
            {lang==="bn" ? `${nf(filterDate.getDate())} ${MONTHS_BN[filterDate.getMonth()]}, ${nf(filterDate.getFullYear())}` : `${MONTHS_EN[filterDate.getMonth()]} ${filterDate.getDate()}, ${filterDate.getFullYear()}`}
          </div>
          <button onClick={()=>setFilterDate(null)} style={{border:"none",background:"transparent",color:accent,cursor:"pointer",padding:2,display:"flex"}}><X size={15}/></button>
        </div>
      )}

      {/* তারিখ পিক করার ছোট ক্যালেন্ডার — দিনে ট্যাপ করলে সেদিনের নোট দেখা যাবে */}
      {showDatePicker && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:60, padding:16}} onClick={()=>setShowDatePicker(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:380, borderRadius:22, padding:18, color:textMain}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
              <div style={{fontSize:14, fontWeight:800}}>{lang==="bn"?"তারিখ বাছাই করুন":"Pick a date"}</div>
              <button onClick={()=>setShowDatePicker(false)} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={18}/></button>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"6px 0 12px"}}>
              <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth()-1, 1))} style={{border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:10, width:30,height:30, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer", color:textMain}}><ChevronLeft size={15}/></button>
              <div style={{fontWeight:700, fontSize:14}}>{lang==="bn"?MONTHS_BN[calMonth.getMonth()]:MONTHS_EN[calMonth.getMonth()]} {nf(calMonth.getFullYear())}</div>
              <button onClick={()=>setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth()+1, 1))} style={{border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:10, width:30,height:30, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer", color:textMain}}><ChevronRight size={15}/></button>
            </div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:5}}>
              {(lang==="bn" ? ["র","সো","ম","বু","বৃ","শু","শ"] : ["S","M","T","W","T","F","S"]).map((d,i)=>(<div key={i} style={{textAlign:"center", fontSize:9.5, fontWeight:700, color:textMuted2}}>{d}</div>))}
            </div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3}}>
              {(() => {
                const y = calMonth.getFullYear(), m = calMonth.getMonth();
                const startOffset = new Date(y,m,1).getDay();
                const daysInMonth = new Date(y,m+1,0).getDate();
                const cells = [];
                for (let i=0;i<startOffset;i++) cells.push(null);
                for (let d=1; d<=daysInMonth; d++) cells.push(new Date(y,m,d));
                const todayKey = dateKey(new Date());
                const hasNoteKeys = new Set(notes.filter(n=>n.createdAt).map(n=>dateKey(new Date(n.createdAt))));
                return cells.map((d,i) => {
                  if (!d) return <div key={i}/>;
                  const dk = dateKey(d);
                  const isToday = dk === todayKey;
                  const isSelected = filterDate && dk === dateKey(filterDate);
                  const hasNotes = hasNoteKeys.has(dk);
                  return (
                    <button key={i} onClick={()=>{setFilterDate(d);setShowDatePicker(false);}}
                      style={{position:"relative", aspectRatio:"1", border: isSelected ? `1.5px solid ${accent}` : isToday ? `1px solid ${accent}` : "1px solid transparent", borderRadius:10, background: isSelected ? (dark?"#2B281F":"#FFF4DF") : (dark?"#121110":"#F8F5EE"), cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, color:textMain}}>
                      <span style={{fontSize:11.5, fontWeight:600}}>{nf(d.getDate())}</span>
                      <span style={{width:4,height:4,borderRadius:"50%", background: hasNotes ? accent : "transparent"}}/>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Search — সার্চ আইকনে ট্যাপ করলেই দেখা যায় */}
      {showSearch && (
        <div onClick={e=>e.stopPropagation()} style={{display:"flex",alignItems:"center",gap:8,background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:12,padding:"9px 12px",marginBottom:10}}>
          <Search size={15} color={textMuted2}/>
          <input
            ref={searchRef}
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder={t.notesSearch}
            style={{flex:1,border:"none",outline:"none",background:"transparent",color:textMain,fontFamily:"inherit",fontSize:13}}
          />
          {search && <button onClick={()=>setSearch("")} style={{border:"none",background:"transparent",color:textMuted2,cursor:"pointer",padding:0}}><X size={14}/></button>}
        </div>
      )}

      {/* Categories — কম্প্যাক্ট, ফোল্ডার গ্রিডের বদলে এখন এটাই একমাত্র ফিল্টার; দরকার হলে ২-৩ লাইনে wrap হবে, নিচে scrollbar আসবে না */}
      <div style={{ display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",marginBottom:14 }}>
        <button onClick={(e)=>{e.stopPropagation();setActiveFolder("All Notes");}} style={{border:`1px solid ${activeFolder==="All Notes"?accent:cardBorder}`,background:activeFolder==="All Notes"?(dark?"#2B281F":"#FFF4DF"):(dark?"#211F1B":"#F5F2EA"),color:activeFolder==="All Notes"?accent:textMain,cursor:"pointer",fontSize:12,fontWeight:700,padding:"5px 11px",borderRadius:999,flex:"0 0 auto"}}>{lang==="bn"?"সব":"All"}</button>
        <button onClick={(e)=>{e.stopPropagation();setActiveFolder("Pinned");}} style={{border:`1px solid ${activeFolder==="Pinned"?accent:cardBorder}`,background:activeFolder==="Pinned"?(dark?"#2B281F":"#FFF4DF"):(dark?"#211F1B":"#F5F2EA"),color:activeFolder==="Pinned"?accent:textMain,cursor:"pointer",fontSize:12,fontWeight:700,padding:"5px 11px",borderRadius:999,flex:"0 0 auto",display:"flex",alignItems:"center",gap:4}}><Pin size={11}/>{lang==="bn"?"পিন":"Pinned"}</button>
        {categories.map(cat => (
          <div key={cat} style={{position:"relative",flex:"0 0 auto"}}>
            <button
              onClick={(e)=>{e.stopPropagation();setActiveFolder(cat);}}
              onMouseDown={(e)=>{e.stopPropagation();startCatPress(cat);}}
              onMouseUp={cancelCatPress}
              onMouseLeave={cancelCatPress}
              onTouchStart={(e)=>{e.stopPropagation();startCatPress(cat);}}
              onTouchEnd={cancelCatPress}
              onTouchMove={cancelCatPress}
              style={{border:`1px solid ${activeFolder===cat?accent:cardBorder}`,background:activeFolder===cat?(dark?"#2B281F":"#FFF4DF"):(dark?"#211F1B":"#F5F2EA"),color:activeFolder===cat?accent:textMain,cursor:"pointer",fontSize:12,fontWeight:700,padding:"5px 11px",borderRadius:999}}>{cat}</button>
            {categoryMenuFor === cat && (
              <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:"calc(100% + 4px)",left:0,background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:12,padding:4,boxShadow:"0 10px 26px rgba(0,0,0,.2)",zIndex:30,display:"flex",flexDirection:"column",minWidth:128}}>
                <button onClick={()=>{renameCategory(cat);setCategoryMenuFor(null);}} style={{display:"flex",alignItems:"center",gap:7,border:"none",background:"transparent",textAlign:"left",padding:"8px 9px",fontSize:12,fontWeight:700,color:textMain,cursor:"pointer",borderRadius:7}}>
                  <Pencil size={13}/> {lang==="bn"?"নাম পরিবর্তন":"Rename"}
                </button>
                {cat !== "General" && (
                  <button onClick={()=>{deleteCategory(cat);setCategoryMenuFor(null);}} style={{display:"flex",alignItems:"center",gap:7,border:"none",background:"transparent",textAlign:"left",padding:"8px 9px",fontSize:12,fontWeight:700,color:"#C54B4B",cursor:"pointer",borderRadius:7}}>
                    <Trash2 size={13}/> {lang==="bn"?"ডিলিট":"Delete"}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        <button onClick={(e)=>{e.stopPropagation();addCategory();}} style={{flex:"0 0 auto",border:`1px dashed ${cardBorder}`,background:"transparent",color:accent,borderRadius:999,padding:"5px 11px",fontSize:12,fontWeight:800,cursor:"pointer"}}>+</button>
      </div>

      {filtered.length === 0 ? (
        <div style={{textAlign:"center",padding:"40px 20px",background:cardBg,border:`1px dashed ${cardBorder}`,borderRadius:18}}>
          <div style={{width:52,height:52,borderRadius:16,background:dark?"#26231D":"#F3EEE3",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
            <FileText size={23} color={dark?"#C9C0AC":"#6B6353"}/>
          </div>
          <div style={{fontSize:14.5,fontWeight:800,color:textMain}}>{t.notesEmpty}</div>
          <div style={{fontSize:12,color:textMuted2,marginTop:5}}>{lang==="bn"?"নিচের + বাটনে ট্যাপ করে একটা নোট বা চেকলিস্ট শুরু করুন।":"Tap the + button below to start a note or checklist."}</div>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10}}>
          {filtered.map(note => {
            const col = noteColorFor(note.category || "General", categories);
            // নোটের কভার (ছোট কার্ড অবস্থায়) — ইউজার নিজে রঙ বাছাই করে থাকলে সেটাই, নাহলে ডিফল্ট বেইজ/ডার্ক
            const coverBg = noteBgFor(note.color, dark);
            const coverText = noteTextFor(note.color, dark);
            const isDragging = draggingId === note.id;
            const isDropTarget = overId === note.id && draggingId && draggingId !== note.id;
            return (
            <div
              key={note.id}
              data-note-id={note.id}
              onClick={()=>{ if (justDraggedRef.current) { justDraggedRef.current = false; return; } openEdit(note); }}
              onPointerDown={(e)=>handleCardPointerDown(e, note)}
              onPointerMove={handleCardPointerMove}
              onPointerUp={handleCardPointerUp}
              onPointerCancel={handleCardPointerUp}
              className="fg-card"
              style={{position:"relative",background:coverBg,border:isDropTarget?`2px dashed ${accent}`:"none",borderRadius:14,padding:"13px 13px",cursor:"pointer",display:"flex",flexDirection:"column",boxShadow:isDragging?"0 6px 16px rgba(0,0,0,.22)":"0 1px 3px rgba(0,0,0,.10)",opacity:isDragging?0.55:1,transform:isDragging?"scale(1.03)":"scale(1)",transition:"transform .12s, box-shadow .12s",touchAction:draggingId?"none":"pan-y",zIndex:isDragging?2:1}}
            >
              <div style={{display:"flex",justifyContent:"space-between",gap:6,alignItems:"flex-start"}}>
                <div style={{minWidth:0,flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    {note.pinned && <Pin size={12} fill={col.text} color={col.text}/>}
                    <div style={{fontSize:13.5,fontWeight:800,color:coverText,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{note.title}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:2,flexShrink:0}}>
                  {/* কার্ডে ট্যাপ করলেই এডিট খোলে, তাই আলাদা এডিট বাটন রাখা হয়নি — শুধু Pin ও Delete, ছোট আইকন হিসেবে, ৩-ডট মেনু ছাড়াই */}
                  <button
                    onClick={(e)=>{e.stopPropagation();togglePin(note.id);}}
                    style={{border:"none",background:"transparent",color:col.text,cursor:"pointer",padding:5,borderRadius:8,display:"flex"}}
                    title={note.pinned ? (lang==="bn"?"আনপিন":"Unpin") : (lang==="bn"?"পিন":"Pin")}
                  >
                    {note.pinned ? <PinOff size={15}/> : <Pin size={15}/>}
                  </button>
                  <button
                    onClick={(e)=>{e.stopPropagation();remove(note.id);}}
                    style={{border:"none",background:"transparent",color:col.text,cursor:"pointer",padding:5,borderRadius:8,display:"flex"}}
                    title={lang==="bn"?"ডিলিট":"Delete"}
                  >
                    <Trash2 size={15}/>
                  </button>
                </div>
              </div>

              {looksLikeHtml(note.body) ? (
                <div className="fg-note-body" style={{fontSize:12,color:coverText,opacity:0.85,lineHeight:1.5,marginTop:6,display:"-webkit-box",WebkitLineClamp:5,WebkitBoxOrient:"vertical",overflow:"hidden"}} dangerouslySetInnerHTML={{__html: note.body || "—"}}/>
              ) : (
                <div style={{fontSize:12,color:coverText,opacity:0.85,lineHeight:1.5,marginTop:6,display:"-webkit-box",WebkitLineClamp:5,WebkitBoxOrient:"vertical",overflow:"hidden",whiteSpace:"pre-wrap"}}>{renderFormattedText(note.body) || "—"}</div>
              )}

              {Array.isArray(note.checklist) && note.checklist.length > 0 && (
                <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:4}}>
                  {note.checklist.slice(0,3).map(item => (
                    <div key={item.id} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:coverText,opacity:0.85}}>
                      <span style={{width:12,height:12,borderRadius:4,border:`1px solid ${col.text}`,background:item.done?col.text:"transparent",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:8,flexShrink:0}}>{item.done?"✓":""}</span>
                      <span style={{textDecoration:item.done?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.text}</span>
                    </div>
                  ))}
                  {note.checklist.length > 3 && <span style={{fontSize:10,color:col.text,fontWeight:700}}>+{note.checklist.length - 3} more</span>}
                </div>
              )}

              <div style={{marginTop:"auto",paddingTop:9,display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                <span style={{fontSize:9.5,fontWeight:700,color:col.text,opacity:0.85}}>{note.category || "General"}</span>
                <span style={{fontSize:9,color:col.text,opacity:0.65,fontWeight:600}} title={fullDateTimeLabel(note.updatedAt, lang)}>{timeAgoLabel(note.updatedAt || note.createdAt, lang)}</span>
              </div>
            </div>
          );})}
        </div>
      )}
      </div>

      {/* ফ্লোটিং + বাটন — ".fg-tab-panel"-এর বাইরে (sibling হিসেবে) রাখা হয়েছে যাতে পেজ-লোড অ্যানিমেশনের transform এটাকে
          উপর থেকে নিচে স্লাইড করিয়ে না আনে — সবসময় বটম-ন্যাভের ঠিক উপরে স্থির থাকবে; ট্যাপ করলে Note/Checklist অপশন দেখায় */}
      <div style={{position:"fixed", right:20, bottom: isDesktop ? 28 : 96, zIndex:41, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10}}>
        {fabOpen && (
          <div onClick={e=>e.stopPropagation()} style={{display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end"}}>
            <button onClick={()=>{vibrate(); openNew(true);}} style={{display:"flex",alignItems:"center",gap:8,border:`1px solid ${cardBorder}`,background:cardBg,color:textMain,borderRadius:999,padding:"9px 14px 9px 12px",fontSize:12.5,fontWeight:700,cursor:"pointer",boxShadow: dark ? "0 6px 18px rgba(0,0,0,0.4)" : "0 6px 18px rgba(0,0,0,.18)"}}>
              <ListChecks size={16} color={accent}/> {lang==="bn"?"চেকলিস্ট":"Checklist"}
            </button>
            <button onClick={()=>{vibrate(); openNew(false);}} style={{display:"flex",alignItems:"center",gap:8,border:`1px solid ${cardBorder}`,background:cardBg,color:textMain,borderRadius:999,padding:"9px 14px 9px 12px",fontSize:12.5,fontWeight:700,cursor:"pointer",boxShadow: dark ? "0 6px 18px rgba(0,0,0,0.4)" : "0 6px 18px rgba(0,0,0,.18)"}}>
              <FileText size={16} color={accent}/> {lang==="bn"?"নোট":"Note"}
            </button>
          </div>
        )}
        <button onClick={(e)=>{e.stopPropagation();vibrate();setFabOpen(v=>!v);}} title={t.notesNew} style={{
          width:46, height:46, borderRadius:"50%", border:"none", background:accent, color:"#fff",
          display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
          boxShadow: dark ? "0 8px 20px rgba(0,0,0,0.45)" : "0 8px 20px rgba(217,119,87,0.45)",
          transform: fabOpen ? "rotate(45deg)" : "none", transition:"transform .15s",
        }}>
          <Plus size={21} strokeWidth={2.5}/>
        </button>
      </div>

      {editing && (() => {
        const noteCol = noteColorFor(category, categories);
        const editorBg = bg; // পুরো স্ক্রিনের নিরপেক্ষ পেজ ব্যাকগ্রাউন্ড — থিম অনুযায়ী বদলায়
        const paperBg = noteBgFor(noteColor, dark); // লেখার জায়গাটা এখন আলাদা "কাগজ" কার্ড হিসেবে ভাসবে — ইউজারের বাছাই করা রঙ থাকলে সেটাই দেখাবে
        const paperBorder = dark ? "#3A342B" : "#E9DCC5";
        const paperText = noteTextFor(noteColor, dark);
        const iconColor = textMain; // হেডার ও বটম টুলবারের আইকন/টেক্সট — পেজ ব্যাকগ্রাউন্ডের সাথে ঠিকমতো কনট্রাস্ট থাকার জন্য
        const toolbarActiveBg = dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)";
        return (
        <div style={{position:"fixed",left:0,top:0,width:"100%",height:vh,background:editorBg,display:"flex",flexDirection:"column",zIndex:60}} onClick={()=>{setShowMoreMenu(false);setShowColorPicker(false);categoryMenuFor && setCategoryMenuFor(null);}}>

          {/* Top bar */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 14px",flexShrink:0}}>
            <button onClick={(e)=>{e.stopPropagation();save();}} style={{border:"none",background:"transparent",color:iconColor,cursor:"pointer",padding:8,display:"flex"}}>
              <ChevronLeft size={22}/>
            </button>
            <div style={{display:"flex",alignItems:"center",gap:2,position:"relative"}}>
              <button onClick={(e)=>{e.stopPropagation();setPinnedDraft(v=>!v);}} title={lang==="bn"?"পিন":"Pin"}
                style={{border:"none",background:pinnedDraft?toolbarActiveBg:"transparent",color:pinnedDraft?accent:iconColor,cursor:"pointer",padding:8,borderRadius:"50%",display:"flex"}}>
                <Pin size={18} fill={pinnedDraft?accent:"none"}/>
              </button>
              <button onClick={(e)=>{e.stopPropagation();setShowMoreMenu(v=>!v);setShowColorPicker(false);}} style={{border:"none",background:showMoreMenu?toolbarActiveBg:"transparent",color:iconColor,cursor:"pointer",padding:8,borderRadius:"50%",display:"flex"}}>
                <MoreVertical size={19}/>
              </button>
              {showMoreMenu && (
                <div onClick={e=>e.stopPropagation()} style={{position:"absolute",right:0,top:40,width:150,background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:12,padding:5,boxShadow:"0 10px 28px rgba(0,0,0,.2)",zIndex:20}}>
                  {editing.id && (
                    <button onClick={()=>remove(editing.id)} style={{width:"100%",textAlign:"left",border:"none",background:"transparent",color:"#C54B4B",padding:"9px 10px",borderRadius:8,cursor:"pointer",fontSize:11.5}}>{lang==="bn"?"ডিলিট":"Delete"}</button>
                  )}
                  <button onClick={closeEditor} style={{width:"100%",textAlign:"left",border:"none",background:"transparent",color:textMain,padding:"9px 10px",borderRadius:8,cursor:"pointer",fontSize:11.5}}>{lang==="bn"?"বাতিল (সেভ ছাড়া)":"Discard"}</button>
                </div>
              )}
            </div>
          </div>

          {/* Created / edited date */}
          {editing.id && (
            <div style={{fontSize:10.5,color:textMuted2,padding:"0 20px",marginBottom:8,flexShrink:0}}>
              {lang==="bn" ? "তৈরি" : "Created"}: {fullDateTimeLabel(editing.createdAt, lang)} · {lang==="bn" ? "সম্পাদিত" : "Edited"}: {fullDateTimeLabel(editing.updatedAt, lang)}
            </div>
          )}

          {/* Paper card — লেখার আসল জায়গা, পেজ ব্যাকগ্রাউন্ড থেকে স্পষ্ট আলাদা করে দেখানোর জন্য বর্ডার + shadow সহ কার্ড */}
          <div style={{flex:1,minHeight:0,margin:"2px 14px 14px",background:paperBg,border:`1px solid ${paperBorder}`,borderRadius:18,boxShadow: dark ? "0 8px 24px rgba(0,0,0,0.35)" : "0 6px 18px rgba(60,40,20,0.09)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Scrollable content: title + checklist + body */}
          <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"14px 18px 16px"}} onClick={e=>e.stopPropagation()}>
            <input
              autoFocus
              value={title}
              onChange={e=>setTitle(e.target.value)}
              onFocus={(e)=>{ setTimeout(()=>{ try { e.target.scrollIntoView({block:"center"}); } catch(err){} }, 250); }}
              placeholder={t.notesTitlePlaceholder}
              style={{width:"100%",boxSizing:"border-box",background:"transparent",border:"none",padding:"8px 0",fontSize:20,fontWeight:800,color:paperText,outline:"none",fontFamily:"inherit",marginBottom:2}}
            />

            {/* Checklist — টাইটেলের ঠিক পরেই আসে, বটম টুলবারের checklist আইকন দিয়ে দেখানো/লুকানো যায়; Google Keep-এর মতো
                প্রতিটা আইটেম নিজেই এডিটেবল — Enter চাপলে নতুন আইটেম, খালি আইটেমের শুরুতে Backspace চাপলে আগেরটার সাথে জোড়া লাগে */}
            {showChecklist && (
              <div style={{marginTop:2,marginBottom:6}}>
                {checklist.length > 0 && (
                  <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:9}}>
                    {checklist.map((item, index) => (
                      <div key={item.id} style={{display:"flex",alignItems:"center",gap:9}}>
                        <button
                          onClick={()=>setChecklist(prev=>prev.map((x,i)=>i===index?{...x,done:!x.done}:x))}
                          style={{width:19,height:19,borderRadius:5,border:`1.5px solid ${item.done?accent:paperText}`,background:item.done?accent:"transparent",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",padding:0,cursor:"pointer",fontSize:12,flex:"0 0 auto"}}
                        >
                          {item.done?"✓":""}
                        </button>
                        <input
                          ref={(el)=>{ if (el) checklistInputRefs.current[item.id] = el; else delete checklistInputRefs.current[item.id]; }}
                          value={item.text}
                          onChange={e=>updateChecklistText(item.id, e.target.value)}
                          onKeyDown={(e)=>{
                            const el = e.target;
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const caret = el.selectionStart ?? el.value.length;
                              splitChecklistItem(index, el.value.slice(0, caret), el.value.slice(caret));
                            } else if (e.key === "Backspace" && el.selectionStart === 0 && el.selectionEnd === 0 && index > 0) {
                              e.preventDefault();
                              mergeChecklistItemWithPrev(index);
                            }
                          }}
                          onFocus={(e)=>{ setTimeout(()=>{ try { e.target.scrollIntoView({block:"center"}); } catch(err){} }, 250); }}
                          placeholder={lang==="bn"?"লিস্টে যোগ করুন":"List item"}
                          style={{flex:1,minWidth:0,background:"transparent",border:"none",padding:"3px 0",fontSize:13,color:paperText,textDecoration:item.done?"line-through":"none",opacity:item.done?0.6:1,outline:"none",fontFamily:"inherit"}}
                        />
                        <button onClick={()=>setChecklist(prev=>prev.filter((_,i)=>i!==index))} style={{border:"none",background:"transparent",color:paperText,opacity:0.6,cursor:"pointer",padding:2}}><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={appendChecklistItem} style={{display:"flex",alignItems:"center",gap:9,border:"none",background:"transparent",padding:"3px 0",cursor:"pointer",width:"100%",textAlign:"left"}}>
                  <div style={{width:19,height:19,borderRadius:5,border:`1.5px solid ${paperText}`,opacity:0.4,flex:"0 0 auto",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Plus size={12} color={paperText} style={{opacity:0.7}}/>
                  </div>
                  <span style={{fontSize:13,color:paperText,opacity:0.55}}>{lang==="bn"?"লিস্টে যোগ করুন":"List item"}</span>
                </button>
              </div>
            )}

            {/* রিচ টেক্সট বডি — contentEditable, তাই Bold/Italic/Underline/H1/H2 সরাসরি এখানে দেখা যায় (Keep-এর মতো) */}
            <div style={{position:"relative"}}>
              {!stripHtmlToText(body) && (
                <div style={{position:"absolute",top:6,left:0,right:0,fontSize:fontSize,lineHeight:1.65,color:paperText,opacity:0.4,pointerEvents:"none"}}>{t.notesBodyPlaceholder}</div>
              )}
              <div
                ref={(el)=>{
                  bodyRef.current = el;
                  if (el && el.dataset.init !== "1") {
                    el.innerHTML = body || "";
                    el.dataset.init = "1";
                  }
                }}
                contentEditable
                suppressContentEditableWarning
                className="fg-note-body"
                onInput={()=>{ if (bodyRef.current) setBody(bodyRef.current.innerHTML); }}
                onKeyDown={handleBodyEnterKey}
                onSelect={syncActiveFontSize}
                onKeyUp={syncActiveFontSize}
                onMouseUp={syncActiveFontSize}
                onFocus={(e)=>{ try { document.execCommand("defaultParagraphSeparator", false, "div"); } catch(err){} syncActiveFontSize(); setTimeout(()=>{ try { e.target.scrollIntoView({block:"center"}); } catch(err){} }, 250); }}
                style={{width:"100%",boxSizing:"border-box",minHeight: showChecklist ? 60 : 180,background:"transparent",border:"none",padding:"6px 0",fontSize:fontSize,lineHeight:1.65,color:paperText,outline:"none",fontFamily:"inherit",marginBottom:8,transition:"font-size .15s ease",wordBreak:"break-word"}}
              />
            </div>

            {/* Category পিকার — বটম টুলবারের Tag আইকন দিয়ে টগল হয়, নাম-সহ চিপ যাতে বোঝা যায় কোনটা সিলেক্ট করা আছে; চেপে ধরলে Rename/Delete */}
            {showColorPicker && (
              <div onClick={e=>e.stopPropagation()} style={{display:"flex",flexWrap:"wrap",gap:7,paddingTop:6,paddingBottom:2}}>
                {categories.map(cat => {
                  const c = noteColorFor(cat, categories);
                  const selected = category === cat;
                  return (
                    <div key={cat} style={{position:"relative"}}>
                      <button
                        onClick={()=>setCategory(cat)}
                        onMouseDown={()=>startCatPress(cat)}
                        onMouseUp={cancelCatPress}
                        onMouseLeave={cancelCatPress}
                        onTouchStart={()=>startCatPress(cat)}
                        onTouchEnd={cancelCatPress}
                        onTouchMove={cancelCatPress}
                        style={{
                        display:"flex",alignItems:"center",gap:5,
                        background:c.bg, color:c.text,
                        border: selected ? `1.5px solid ${paperText}` : "1px solid transparent",
                        borderRadius:999,padding:"6px 12px",fontSize:11.5,fontWeight:800,cursor:"pointer"
                      }}>
                        {selected && <Check size={12}/>}
                        {cat}
                      </button>
                      {categoryMenuFor === cat && (
                        <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:"calc(100% + 4px)",left:0,background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:12,padding:4,boxShadow:"0 10px 26px rgba(0,0,0,.2)",zIndex:30,display:"flex",flexDirection:"column",minWidth:128}}>
                          <button onClick={()=>{renameCategory(cat);setCategoryMenuFor(null);}} style={{display:"flex",alignItems:"center",gap:7,border:"none",background:"transparent",textAlign:"left",padding:"8px 9px",fontSize:12,fontWeight:700,color:textMain,cursor:"pointer",borderRadius:7}}>
                            <Pencil size={13}/> {lang==="bn"?"নাম পরিবর্তন":"Rename"}
                          </button>
                          {cat !== "General" && (
                            <button onClick={()=>{deleteCategory(cat);setCategoryMenuFor(null);}} style={{display:"flex",alignItems:"center",gap:7,border:"none",background:"transparent",textAlign:"left",padding:"8px 9px",fontSize:12,fontWeight:700,color:"#C54B4B",cursor:"pointer",borderRadius:7}}>
                              <Trash2 size={13}/> {lang==="bn"?"ডিলিট":"Delete"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                <button onClick={addCategory} style={{flex:"0 0 auto",border:`1.5px dashed ${paperText}`,background:"transparent",color:paperText,borderRadius:999,padding:"6px 12px",fontSize:11.5,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <Plus size={12}/> {lang==="bn"?"নতুন":"New"}
                </button>
              </div>
            )}

            {/* নোট কার্ডের ব্যাকগ্রাউন্ড রঙ পিকার — বটম টুলবারের নতুন Palette আইকন দিয়ে টগল হয়; নিজের ইচ্ছামতো রঙ করে রাখলে পরে চোখের দেখায় দ্রুত খুঁজে পাওয়া যায় */}
            {showBgColorPicker && (
              <div onClick={e=>e.stopPropagation()} style={{display:"flex",flexWrap:"wrap",gap:10,paddingTop:6,paddingBottom:2}}>
                {NOTE_BG_PALETTE.map((c) => {
                  const selected = (noteColor || null) === c.key;
                  const swatchBg = (dark ? c.bgDark : c.bg) || (dark ? "#221E19" : NOTE_PAPER_BG);
                  return (
                    <button key={c.key || "default"} onClick={()=>setNoteColor(c.key)}
                      title={lang==="bn" ? c.labelBn : c.labelEn}
                      style={{
                        width:30, height:30, borderRadius:"50%", cursor:"pointer",
                        background:swatchBg,
                        border: c.key===null ? `1.5px dashed ${paperText}` : `1.5px solid ${selected ? paperText : "rgba(0,0,0,0.12)"}`,
                        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                      }}>
                      {selected && <Check size={13} color={paperText}/>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ফরম্যাটিং রো — বটম টুলবারের "Aa" আইকনে টগল হয়: H1, H2, Bold, Italic, Underline, Clear, Color।
              আগে এটা স্ক্রলযোগ্য কনটেন্টের ভেতরে (body-র ঠিক পরে) ছিল, তাই বড় নোটে অনেক লেখার নিচে হারিয়ে যেত —
              এখন paper card-এর নিজস্ব ফ্লোটিং ফুটার হিসেবে বসানো, তাই স্ক্রল যতই করা হোক, এটা সবসময় নিচে
              স্থির দেখা যাবে, খুঁজে বের করার দরকার হবে না */}
          {showFormatBar && (
            <div onMouseDown={e=>e.preventDefault()} onClick={e=>e.stopPropagation()} style={{display:"flex",alignItems:"center",gap:2,padding:"8px 14px",borderTop:`1px solid ${paperBorder}`,background:paperBg,flexShrink:0,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
              {[
                { icon: Heading1, title: lang==="bn"?"হেডিং ১":"Heading 1", action: ()=>applyBodyCommand(()=>document.execCommand("formatBlock", false, "H1")) },
                { icon: Heading2, title: lang==="bn"?"হেডিং ২":"Heading 2", action: ()=>applyBodyCommand(()=>document.execCommand("formatBlock", false, "H2")) },
                { icon: Bold, title: lang==="bn"?"বোল্ড":"Bold", action: ()=>applyBodyCommand(()=>document.execCommand("bold")) },
                { icon: Italic, title: lang==="bn"?"ইটালিক":"Italic", action: ()=>applyBodyCommand(()=>document.execCommand("italic")) },
                { icon: Underline, title: lang==="bn"?"আন্ডারলাইন":"Underline", action: ()=>applyBodyCommand(()=>document.execCommand("underline")) },
                { icon: RemoveFormatting, title: lang==="bn"?"ফরম্যাট মুছুন":"Clear formatting", action: ()=>applyBodyCommand(()=>{ document.execCommand("removeFormat"); document.execCommand("formatBlock", false, "P"); }) },
              ].map(({icon:Icon, title, action}, i) => (
                <button key={i} onMouseDown={e=>e.preventDefault()} onClick={action} title={title}
                  style={{border:"none",background:"transparent",color:paperText,cursor:"pointer",padding:9,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon size={17}/>
                </button>
              ))}
              {/* টেক্সট রঙ — সিলেক্ট করা লেখার রঙ বদলাতে, কিছু সাধারণ রঙ */}
              <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:4,paddingLeft:8,borderLeft:`1px solid ${paperBorder}`,flexShrink:0}}>
                {[{key:"default",hex:paperText},...NOTE_TEXT_COLORS].map(c => (
                  <button key={c.key} onMouseDown={e=>e.preventDefault()}
                    onClick={()=>applyBodyCommand(()=>{ document.execCommand("styleWithCSS", false, false); document.execCommand("foreColor", false, c.hex); })}
                    title={c.key==="default" ? (lang==="bn"?"ডিফল্ট":"Default") : c.key}
                    style={{width:19,height:19,borderRadius:"50%",padding:0,cursor:"pointer",background:c.hex,border: c.key==="default" ? `1.5px dashed ${paperText}` : "1.5px solid rgba(0,0,0,0.15)",flexShrink:0}}>
                  </button>
                ))}
              </div>
            </div>
          )}
          </div>

          {/* Bottom icon toolbar — পেজ ব্যাকগ্রাউন্ডের উপর, উপরের বর্ডার দিয়ে paper card থেকে আলাদা করা */}
          <div onClick={e=>e.stopPropagation()} style={{display:"flex",alignItems:"center",gap:2,padding:"10px 14px",borderTop:`1px solid ${cardBorder}`,flexShrink:0}}>
            <button onClick={()=>{setShowChecklist(v=>!v);setShowColorPicker(false);setShowBgColorPicker(false);}} title={lang==="bn"?"চেকলিস্ট":"Checklist"}
              style={{border:"none",background:showChecklist?toolbarActiveBg:"transparent",color:iconColor,cursor:"pointer",padding:9,borderRadius:"50%",display:"flex"}}>
              <ListChecks size={19}/>
            </button>
            <button onClick={()=>{setShowFormatBar(v=>!v);setShowBgColorPicker(false);}} title={lang==="bn"?"টেক্সট ফরম্যাটিং":"Text formatting"}
              style={{border:"none",background:showFormatBar?toolbarActiveBg:"transparent",color:showFormatBar?accent:iconColor,cursor:"pointer",padding:"9px 10px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,fontFamily:"inherit"}}>
              Aa
            </button>
            <button onClick={()=>{setShowColorPicker(v=>!v);setShowChecklist(false);setShowBgColorPicker(false);}} title={lang==="bn"?"ক্যাটাগরি":"Category"}
              style={{border:"none",background:showColorPicker?toolbarActiveBg:"transparent",color:iconColor,cursor:"pointer",padding:9,borderRadius:"50%",display:"flex"}}>
              <Tag size={19}/>
            </button>
            <button onClick={()=>{setShowBgColorPicker(v=>!v);setShowChecklist(false);setShowColorPicker(false);}} title={lang==="bn"?"নোটের রঙ":"Note color"}
              style={{border:"none",background:showBgColorPicker?toolbarActiveBg:"transparent",color:iconColor,cursor:"pointer",padding:9,borderRadius:"50%",display:"flex"}}>
              <Palette size={19}/>
            </button>
            <div style={{display:"flex",alignItems:"center",gap:1,marginLeft:2}}>
              <button onMouseDown={e=>e.preventDefault()} onClick={()=>applyFontSizeDelta(-FONT_STEP)} disabled={activeFontSize<=FONT_MIN}
                title={lang==="bn"?"ছোট ফন্ট":"Smaller text"}
                style={{border:"none",background:"transparent",color:iconColor,opacity:activeFontSize<=FONT_MIN?0.35:1,cursor:activeFontSize<=FONT_MIN?"default":"pointer",padding:"9px 7px",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,lineHeight:1}}>
                A
              </button>
              <button onMouseDown={e=>e.preventDefault()} onClick={()=>applyFontSizeDelta(FONT_STEP)} disabled={activeFontSize>=FONT_MAX}
                title={lang==="bn"?"বড় ফন্ট":"Larger text"}
                style={{border:"none",background:"transparent",color:iconColor,opacity:activeFontSize>=FONT_MAX?0.35:1,cursor:activeFontSize>=FONT_MAX?"default":"pointer",padding:"9px 7px",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,lineHeight:1}}>
                A
              </button>
            </div>
            <div style={{flex:1}}/>
            <span style={{fontSize:10.5,fontWeight:800,color:noteCol.text,background:noteCol.bg,padding:"4px 11px",borderRadius:20}}>{category}</span>
          </div>
        </div>
      );})()}
    </>
  );
}

function AddTaskModal({ t, lang, onClose, onSubmit, initialTask, defaultDueDate, categories, onAddCategory, cardBg, cardBorder, textMain, textMuted2, accent, dark, bg }) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [category, setCategory] = useState(initialTask?.category || (categories && categories[0] && categories[0].key) || "study");
  const [priority, setPriority] = useState(initialTask?.priority || "med");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || defaultDueDate || "");
  const [repeat, setRepeat] = useState(initialTask?.repeat || "none"); // "none" | "daily" | "weekly" | "monthly"
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  // ডিফল্টে শুধু Title + Date দেখানো হয় (দ্রুত টাস্ক যোগ করার জন্য) — Category/Priority/Repeat "More options"-এর নিচে লুকানো,
  // এডিট করার সময় বা কেউ আগে থেকে এগুলো সেট করে থাকলে খোলাই দেখানো হয়
  const [showMore, setShowMore] = useState(
    !!initialTask && (initialTask.priority !== "med" || !!initialTask.repeat || (categories && categories[0] && initialTask.category !== categories[0].key))
  );
  const sheetRef = useRef(null);
  const vh = useVisualViewportHeight(); // কিবোর্ড খোলা অবস্থায় দৃশ্যমান উচ্চতা — sheet-কে এর মধ্যেই ধরে রাখা হয়
  const isEditing = !!initialTask;

  const submit = () => {
    if (!title.trim()) return;
    onSubmit({
      id: initialTask?.id || `${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      title: title.trim(), category, priority, dueDate: dueDate || null,
      repeat: repeat === "none" ? null : repeat,
      done: initialTask?.done || false
    });
    onClose();
  };

  const confirmNewCategory = () => {
    const cat = onAddCategory(newCategoryName);
    if (cat) { setCategory(cat.key); setNewCategoryName(""); setAddingCategory(false); }
  };

  const prColor = { high: "#C0392B", med: accent, low: "#6E8B5E" };
  const prLabel = { high: t.taskPrHigh, med: t.taskPrMed, low: t.taskPrLow };

  return (
    <div style={{position:"fixed", left:0, top:0, width:"100%", height:vh, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div ref={sheetRef} onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:420, maxHeight:Math.max(320, vh - 24), overflowY:"auto", WebkitOverflowScrolling:"touch", borderRadius:"22px 22px 0 0", padding:"20px 20px 26px", color:textMain}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
          <div style={{fontSize:15, fontWeight:800}}>{isEditing ? (lang==="bn" ? "টাস্ক এডিট করুন" : "Edit Task") : t.taskAdd}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer"}}><X size={20}/></button>
        </div>

        <input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder={t.taskTitlePlaceholder}
          onFocus={(e)=>{ setTimeout(()=>{ try { e.target.scrollIntoView({block:"center"}); } catch(err){} }, 250); }}
          style={{width:"100%", boxSizing:"border-box", background:bg, border:`1px solid ${cardBorder}`, borderRadius:12, padding:"12px 14px", fontSize:14, color:textMain, outline:"none", fontFamily:"inherit", marginBottom:14}}/>

        <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:8}}>{t.taskDueDateOptional}</div>
        <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:16}}>
          <div style={{flex:1, display:"flex", alignItems:"center", gap:8, background:bg, border:`1px solid ${cardBorder}`, borderRadius:12, padding:"10px 14px"}}>
            <CalendarDays size={15} color={textMuted2} style={{flexShrink:0}}/>
            <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}
              style={{flex:1, minWidth:0, border:"none", background:"transparent", fontSize:13.5, color:textMain, outline:"none", fontFamily:"inherit"}}/>
          </div>
          {dueDate && (
            <button onClick={()=>setDueDate("")} style={{border:`1px solid ${cardBorder}`, background:"transparent", color:textMuted2, cursor:"pointer", borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
              <X size={14}/>
            </button>
          )}
        </div>

        <button onClick={()=>setShowMore(v=>!v)} style={{display:"flex", alignItems:"center", gap:6, border:"none", background:"transparent", color:textMuted2, cursor:"pointer", padding:"2px 0", fontSize:12, fontWeight:800, marginBottom: showMore ? 14 : 20}}>
          <ChevronDown size={14} style={{transform: showMore ? "rotate(180deg)" : "none", transition:"transform .15s ease"}}/>
          {showMore ? (lang==="bn" ? "কম দেখাও" : "Fewer options") : (lang==="bn" ? "আরও অপশন (ক্যাটাগরি, প্রায়োরিটি, রিপিট)" : "More options (category, priority, repeat)")}
        </button>

        {showMore && (
          <>
            <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:8}}>{t.taskCategory}</div>
            <div style={{display:"flex", gap:8, marginBottom:14, overflowX:"auto", paddingBottom:2}}>
              {(categories || []).map(c => {
                const Icon = taskCategoryIcon(c.icon);
                const label = lang === "bn" ? (c.labelBn || c.label) : c.label;
                const active = category === c.key;
                return (
                  <button key={c.key} onClick={()=>setCategory(c.key)} style={{
                    flexShrink:0, padding:"9px 14px", borderRadius:12, cursor:"pointer", whiteSpace:"nowrap",
                    border:`1.5px solid ${active ? c.color : cardBorder}`,
                    background: active ? `${c.color}1F` : "transparent",
                    color: active ? c.color : textMuted2, fontWeight:700, fontSize:12.5,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                  }}>
                    <Icon size={13}/>
                    {label}
                  </button>
                );
              })}
              <button onClick={()=>setAddingCategory(v=>!v)} title={t.taskAddCategory} style={{
                flexShrink:0, width:36, height:36, borderRadius:12, cursor:"pointer",
                border:`1.5px dashed ${cardBorder}`, background:"transparent", color:textMuted2,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <Plus size={15}/>
              </button>
            </div>

            {addingCategory && (
              <div style={{display:"flex", gap:8, marginBottom:14}}>
                <input autoFocus value={newCategoryName} onChange={e=>setNewCategoryName(e.target.value)}
                  placeholder={t.taskNewCategoryPlaceholder}
                  onKeyDown={e=>{ if (e.key === "Enter") { e.preventDefault(); confirmNewCategory(); } }}
                  style={{flex:1, minWidth:0, boxSizing:"border-box", background:bg, border:`1px solid ${cardBorder}`, borderRadius:12, padding:"10px 12px", fontSize:13, color:textMain, outline:"none", fontFamily:"inherit"}}/>
                <button onClick={confirmNewCategory} style={{border:"none", borderRadius:12, padding:"0 16px", background:accent, color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer"}}>
                  {t.add}
                </button>
              </div>
            )}

            <div style={{fontSize:11, fontWeight:700, color:textMuted2, marginBottom:8}}>{t.taskPriority}</div>
            <div style={{display:"flex", gap:8, marginBottom:20}}>
              {["high","med","low"].map(p => (
                <button key={p} onClick={()=>setPriority(p)} style={{
                  flex:1, padding:"8px 0", borderRadius:12, cursor:"pointer",
                  border:`1.5px solid ${priority===p ? prColor[p] : cardBorder}`,
                  background: priority===p ? `${prColor[p]}14` : "transparent",
                  color: priority===p ? prColor[p] : textMuted2, fontWeight:700, fontSize:12.5,
                }}>
                  {prLabel[p]}
                </button>
              ))}
            </div>

            <div style={{display:"flex", alignItems:"center", gap:6, marginBottom:8}}>
              <Repeat size={12} color={textMuted2}/>
              <div style={{fontSize:11, fontWeight:700, color:textMuted2}}>{t.taskRepeat}</div>
            </div>
            <div style={{display:"flex", gap:8, marginBottom:20, overflowX:"auto"}}>
              {[["none", t.taskRepeatNone], ["daily", t.taskRepeatDaily], ["weekly", t.taskRepeatWeekly], ["monthly", t.taskRepeatMonthly]].map(([r,label]) => (
                <button key={r} onClick={()=>setRepeat(r)} style={{
                  flex:1, padding:"8px 4px", borderRadius:12, cursor:"pointer", flexShrink:0, whiteSpace:"nowrap",
                  border:`1.5px solid ${repeat===r ? accent : cardBorder}`,
                  background: repeat===r ? "rgba(217,119,87,0.08)" : "transparent",
                  color: repeat===r ? accent : textMuted2, fontWeight:700, fontSize:12,
                }}>
                  {label}
                </button>
              ))}
            </div>
          </>
        )}

        <button onClick={submit} style={{width:"100%", padding:"13px 0", borderRadius:14, border:"none", background:accent, color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer"}}>
          {isEditing ? (lang==="bn" ? "সেভ করুন" : "Save Changes") : t.taskAddBtn}
        </button>
      </div>
    </div>
  );
}

function CalendarModal({ t, lang, nf, monthName, weekdayShort, calMonth, setCalMonth, entries, onClose, onSelectDay, examDateKeys, cardBg, cardBorder, textMain, textMuted2, accent, dark, today }) {
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const firstDay = new Date(y, m, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const cells = [];
  for (let i=0;i<startOffset;i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(y,m,d));

  const shortDays = lang==="bn" ? ["র","সো","ম","বু","বৃ","শু","শ"] : ["S","M","T","W","T","F","S"];

  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:420, borderRadius:22, padding:20, color:textMain}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6}}>
          <div style={{fontSize:15, fontWeight:800}}>{t.monthOverview}</div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", margin:"10px 0 14px"}}>
          <button onClick={()=>setCalMonth(new Date(y,m-1,1))} style={{border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:10, width:32,height:32, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer", color:textMain}}><ChevronLeft size={16}/></button>
          <div style={{fontWeight:700, fontSize:15}}>{monthName(m)} <Num>{nf(y)}</Num></div>
          <button onClick={()=>setCalMonth(new Date(y,m+1,1))} style={{border:`1px solid ${cardBorder}`, background:"transparent", borderRadius:10, width:32,height:32, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer", color:textMain}}><ChevronRight size={16}/></button>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:6}}>
          {shortDays.map((d,i)=>(<div key={i} style={{textAlign:"center", fontSize:10, fontWeight:700, color:textMuted2}}>{d}</div>))}
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
                style={{position:"relative", aspectRatio:"1", border: isToday ? `1.5px solid ${accent}` : "1px solid transparent", borderRadius:10, background: dark?"#121110":"#F8F5EE", cursor:(future&&!hasAny)?"default":"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, opacity: (future&&!hasAny)?0.4:1}}>
                {isExam && <span style={{position:"absolute", top:4, right:4, width:5, height:5, borderRadius:"50%", background:"#1A1814"}}/>}
                {isHoliday && <span style={{position:"absolute", top:4, left:4, width:5, height:5, borderRadius:"50%", background:"#C0392B"}}/>}
                <span style={{fontSize:12, fontWeight:600, color:textMain}}><Num>{nf(d.getDate())}</Num></span>
                <span style={{width:5,height:5,borderRadius:"50%", background: !hasAny ? "transparent" : (doneAll ? "#6E8B5E" : "#4C8FA6")}}/>
              </button>
            );
          })}
        </div>
        {/* Calendar legend */}
        <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:12, marginTop:14, flexWrap:"wrap"}}>
          <span style={{display:"flex", alignItems:"center", gap:5, fontSize:10, color:textMuted2, fontWeight:600}}>
            <span style={{width:6,height:6,borderRadius:"50%", background:"#6E8B5E"}}/>{t.calendarLegendCompleted}
          </span>
          <span style={{display:"flex", alignItems:"center", gap:5, fontSize:10, color:textMuted2, fontWeight:600}}>
            <span style={{width:6,height:6,borderRadius:"50%", background:"#1A1814"}}/>{t.calendarLegendExam}
          </span>
          <span style={{display:"flex", alignItems:"center", gap:5, fontSize:10, color:textMuted2, fontWeight:600}}>
            <span style={{width:6,height:6,borderRadius:"50%", background:"#4C8FA6"}}/>{t.calendarLegendPlanned}
          </span>
          <span style={{display:"flex", alignItems:"center", gap:5, fontSize:10, color:textMuted2, fontWeight:600}}>
            <span style={{width:6,height:6,borderRadius:"50%", background:"#C0392B"}}/>{t.calendarLegendHoliday}
          </span>
        </div>
      </div>
    </div>
  );
}

function DayDetailModal({ t, lang, nf, weekdayName, monthName, day, entries, allSubjects, onClose, cardBg, cardBorder, textMain, textMuted2, accent, dark }) {
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:cardBg, width:"100%", maxWidth:480, borderRadius:"22px 22px 0 0", padding:"20px 20px 28px", color:textMain, maxHeight:"75vh", overflowY:"auto"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4}}>
          <div>
            <div style={{fontSize:11, fontWeight:700, color:textMuted2}}>{weekdayName(day)}</div>
            <div style={{fontSize:19, fontWeight:800, letterSpacing:-0.3}}><Num>{nf(day.getDate())}</Num> {monthName(day.getMonth())}, <Num>{nf(day.getFullYear())}</Num></div>
          </div>
          <button onClick={onClose} style={{border:"none", background:"transparent", cursor:"pointer", color:textMuted2}}><X size={20}/></button>
        </div>
        {isHolidayKey(dateKey(day)) && (
          <div style={{marginTop:12, display:"flex", alignItems:"center", gap:7, border:`1px solid ${cardBorder}`, borderRadius:12, padding:"9px 12px"}}>
            <span style={{width:8,height:8,borderRadius:"50%", background:"#C0392B", flexShrink:0}}/>
            <span style={{fontSize:12.5, fontWeight:700, color:textMain}}>{holidayName(dateKey(day), lang)}</span>
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
