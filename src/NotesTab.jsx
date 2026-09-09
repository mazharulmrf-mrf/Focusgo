// NotesTab.jsx
// মূল App__1_.jsx-এর "Notes" ট্যাব (আগের নাম: NotesView) — নিজে থেকে সম্পূর্ণ স্বয়ংসম্পূর্ণ,
// শুধু props হিসেবে থিম/ডেটা নেয়, নিজের ভেতরের সব state (এডিটিং, ড্র্যাগ, সার্চ ফিল্টার ইত্যাদি) নিজেই সামলায়।
// আচরণ মূল ফাইলের সাথে হুবহু অপরিবর্তিত রাখা হয়েছে — শুধু ফাইল আলাদা করা হয়েছে।

import React, { useState, useEffect, useRef } from "react";
import {
  Plus, Trash2, Pencil, X, Check, Search, Pin, PinOff, Tag, Palette,
  Bold, Italic, Underline, RemoveFormatting, ChevronLeft, ChevronDown,
  FileText, ListChecks, Menu, RotateCcw,
} from "lucide-react";
import {
  toBn, vibrate, Num, RuledPaperIcon,
  NOTE_BG_PALETTE, NOTE_TEXT_COLORS, NOTE_PAPER_BG, NOTE_PAPER_TEXT, NOTE_PAPER_MUTED,
  noteColorFor, noteAccentTextFor, noteBgFor, noteTextFor,
  looksLikeHtml, stripHtmlToText, textToHtml, fullDateTimeLabel, compressImageToDataUrl,
} from "./helpers";

export default function NotesTab({ t, lang, notes, setNotes, search, setSearch, cardBg, cardBorder, textMain, textMuted2, accent, dark, isDesktop }) {
  const isBn = lang === "bn";
  const nf = (n) => (isBn ? toBn(n) : n);
  const TRASH_RETENTION_DAYS = 30;

  // ---- Keep-এর মতো টান-দিয়ে-সরানো (drag-to-reorder) — long-press শুরু, তারপর pointermove দিয়ে অবস্থান বদল ----
  const [draggingId, setDraggingId] = useState(null); // যে নোটটা এখন টানা হচ্ছে, না হলে null
  const dragInfoRef = useRef({ timer: null, startX: 0, startY: 0, longPressed: false }); // সব কার্ডের জন্য একটাই শেয়ারড রেফ (একবারে একটাই ড্র্যাগ চলে)

  const [editing, setEditing] = useState(null); // {} নতুন নোটের জন্য, নাহলে আসল নোট অবজেক্ট
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const bodyRef = useRef(null); // এখন contentEditable div — Bold/Italic/সাইজ/রঙ প্রয়োগের জন্য
  const [bodyEmpty, setBodyEmpty] = useState(true);
  // মোডাল খোলার সময় (নতুন নোট বা এডিট) contentEditable-এর ভেতরে আসল HTML/টেক্সট বসিয়ে দেওয়া হয়
  useEffect(() => {
    if (!editing) return;
    const el = bodyRef.current;
    if (!el) return;
    el.innerHTML = looksLikeHtml(body) ? body : textToHtml(body);
    setBodyEmpty(!el.textContent.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);
  const handleBodyInput = () => {
    const el = bodyRef.current;
    if (!el) return;
    setBodyEmpty(!el.textContent.trim());
  };
  // সিলেক্ট করা টেক্সটে Bold/Italic/Underline/সাইজ/রঙ প্রয়োগ — টুলবার বাটনে mousedown-এ preventDefault করা থাকে বলে সিলেকশন হারায় না
  const applyFormat = (cmd, value = null) => {
    const el = bodyRef.current;
    if (!el) return;
    el.focus();
    try { document.execCommand(cmd, false, value); } catch (e) {}
    setBodyEmpty(!el.textContent.trim());
  };
  const [category, setCategory] = useState("General");
  const [color, setColor] = useState(null);
  const [paperStyle, setPaperStyle] = useState("plain"); // "plain" | "lined" — নোট বডিতে খাতার মতো লাইন দেখাবে কিনা, প্রতিটা নোটে আলাদাভাবে সেভ থাকে
  const [checklistOpen, setChecklistOpen] = useState(false); // false হলে একদম প্লেইন নোট — checklist আর "Add item" কিছুই দেখাবে না, ফুটারের list আইকনে ট্যাপ করলে চালু হয়
  const [pinned, setPinned] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(null); // null | "category" | "color" — কম্প্যাক্ট রো-তে ট্যাপ করলে ফ্লোটিং পিকার খোলে
  const [checklist, setChecklist] = useState([]);
  const [checklistDraft, setChecklistDraft] = useState("");
  const [activeFolder, setActiveFolder] = useState("All Notes");
  const [trashConfirm, setTrashConfirm] = useState(null); // { type:"one"|"all", id?, fromEditor? }
  const [showDrawer, setShowDrawer] = useState(false); // হ্যামবার্গার আইকনে ট্যাপ করলে বাম দিক থেকে ক্যাটাগরি ড্রয়ার খোলে (Google Keep-এর মতো)
  const [editCategoriesMode, setEditCategoriesMode] = useState(false); // ড্রয়ারের "Edit" — চাপলে প্রতিটা ক্যাটাগরির পাশে rename/delete আইকন দেখা যায়

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

  // অ্যাপ খোলার সময় একবার — ৩০ দিনের বেশি ট্র্যাশে পড়ে থাকা নোট চুপচাপ পার্মানেন্টলি মুছে ফেলা হয়
  useEffect(() => {
    const cutoff = Date.now() - TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    setNotes(prev => {
      const stillValid = prev.filter(n => !(n.deletedAt && n.deletedAt < cutoff));
      return stillValid.length === prev.length ? prev : stillValid;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNew = () => {
    setEditing({});
    setTitle(""); setBody(""); setBodyEmpty(true);
    setCategory(activeFolder !== "All Notes" && activeFolder !== "Pinned" && activeFolder !== "Trash" ? activeFolder : "General");
    setColor(null); setPinned(false); setChecklist([]); setChecklistDraft(""); setPickerOpen(null); setPaperStyle("plain"); setChecklistOpen(false);
  };
  const openEdit = (note) => {
    setEditing(note);
    setTitle(note.title || "");
    setBody(note.body || "");
    setCategory(note.category || "General");
    setColor(note.color || null);
    setPinned(!!note.pinned);
    setChecklist(Array.isArray(note.checklist) ? note.checklist : []);
    setChecklistDraft("");
    setPickerOpen(null);
    setPaperStyle(note.paperStyle || "plain");
    setChecklistOpen(Array.isArray(note.checklist) && note.checklist.length > 0); // আগে থেকে আইটেম থাকলে খোলা অবস্থায় দেখাবে, না থাকলে বন্ধ
  };
  const closeEditor = () => setEditing(null);

  const save = () => {
    const el = bodyRef.current;
    const liveHtml = el ? el.innerHTML : (looksLikeHtml(body) ? body : textToHtml(body));
    const liveText = el ? el.textContent : body;
    const finalBody = (liveText || "").trim() ? liveHtml : "";
    const cleanChecklist = checklist
      .map(x => ({ id: x.id || `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, text: (x.text || "").trim(), done: !!x.done }))
      .filter(x => x.text);
    if (!title.trim() && !finalBody && cleanChecklist.length === 0) { closeEditor(); return; }
    const now = new Date().toISOString();
    if (editing && editing.id) {
      setNotes(prev => prev.map(n => n.id === editing.id
        ? { ...n, title: title.trim() || (isBn ? "শিরোনামহীন" : "Untitled"), body: finalBody, category, color, pinned, checklist: cleanChecklist, paperStyle, updatedAt: now }
        : n));
    } else {
      setNotes(prev => [{
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title: title.trim() || (isBn ? "শিরোনামহীন" : "Untitled"),
        body: finalBody, category, color, pinned, checklist: cleanChecklist, paperStyle,
        deletedAt: null, createdAt: now, updatedAt: now,
      }, ...prev]);
    }
    closeEditor();
  };

  const softDelete = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, deletedAt: Date.now() } : n));
    if (editing && editing.id === id) closeEditor();
  };
  const restoreNote = (id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, deletedAt: null } : n));
  const togglePinNote = (id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  const confirmTrashAction = () => {
    if (!trashConfirm) return;
    if (trashConfirm.type === "one") setNotes(prev => prev.filter(n => n.id !== trashConfirm.id));
    else setNotes(prev => prev.filter(n => !n.deletedAt));
    setTrashConfirm(null);
  };

  const addCategory = () => {
    const name = window.prompt(isBn ? "ক্যাটাগরির নাম" : "Category name");
    const clean = (name || "").trim();
    if (!clean) return;
    if (!categories.some(c => c.toLowerCase() === clean.toLowerCase())) setCategories(prev => [...prev, clean]);
    setCategory(clean);
  };

  const renameCategory = (name) => {
    const next = window.prompt(isBn ? "নতুন নাম" : "New name", name);
    const clean = (next || "").trim();
    if (!clean || clean === name) return;
    if (categories.some(c => c.toLowerCase() === clean.toLowerCase())) {
      window.alert(isBn ? "এই নামে আগে থেকেই একটা ক্যাটাগরি আছে।" : "A category with this name already exists.");
      return;
    }
    setCategories(prev => prev.map(c => c === name ? clean : c));
    setNotes(prev => prev.map(n => (n.category || "General") === name ? { ...n, category: clean } : n));
    if (activeFolder === name) setActiveFolder(clean);
  };

  const deleteCategory = (name) => {
    if (name === "General") return;
    if (!window.confirm(isBn ? `"${name}" ক্যাটাগরিটি ডিলিট করবেন? নোটগুলো General-এ চলে যাবে।` : `Delete category "${name}"? Notes will move to General.`)) return;
    setCategories(prev => prev.filter(c => c !== name));
    setNotes(prev => prev.map(n => n.category === name ? { ...n, category: "General" } : n));
    if (activeFolder === name) setActiveFolder("All Notes");
  };

  const toggleCheck = (id) => setChecklist(c => c.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const removeCheck = (id) => setChecklist(c => c.filter(x => x.id !== id));
  const addCheckItem = () => {
    const text = checklistDraft.trim();
    if (!text) return;
    setChecklist(c => [...c, { id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, text, done: false }]);
    setChecklistDraft("");
  };

  const trashCount = notes.filter(n => n.deletedAt).length;
  const filtered = notes
    .filter(n => {
      if (activeFolder === "Trash") return !!n.deletedAt;
      if (n.deletedAt) return false;
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
    .sort((a, b) => {
      if (activeFolder === "Trash") return (b.deletedAt || 0) - (a.deletedAt || 0);
      const pinDiff = Number(!!b.pinned) - Number(!!a.pinned);
      if (pinDiff !== 0) return pinDiff;
      if (a.order != null && b.order != null) return a.order - b.order; // ইউজার নিজে টেনে সাজালে সেটাই মানা হয়
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });

  const pinnedList = activeFolder === "Trash" ? [] : filtered.filter(n => n.pinned);
  const othersList = activeFolder === "Trash" ? filtered : filtered.filter(n => !n.pinned);

  // ড্র্যাগ চলাকালীন আঙুলের নিচের কার্ড বের করে (elementFromPoint) সেই গ্রুপের (পিন/অন্যান্য) মধ্যেই অর্ডার বদলানো হয়
  useEffect(() => {
    if (!draggingId) return;
    const handleMove = (e) => {
      const point = e.touches && e.touches[0] ? e.touches[0] : e;
      const el = document.elementFromPoint(point.clientX, point.clientY);
      const cardEl = el && el.closest && el.closest("[data-note-id]");
      if (!cardEl) return;
      const overId = cardEl.getAttribute("data-note-id");
      if (overId === draggingId) return;
      setNotes(prev => {
        const draggedNote = prev.find(n => n.id === draggingId);
        const overNote = prev.find(n => n.id === overId);
        if (!draggedNote || !overNote) return prev;
        if (draggedNote.deletedAt || overNote.deletedAt) return prev;
        if (!!draggedNote.pinned !== !!overNote.pinned) return prev; // পিন করা আর সাধারণ নোট আলাদা গ্রুপ — একটার মধ্যে অন্যটা ঢুকবে না
        const group = prev
          .filter(n => !n.deletedAt && !!n.pinned === !!draggedNote.pinned)
          .sort((a, b) => (a.order != null && b.order != null) ? a.order - b.order : new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
        const ids = group.map(n => n.id);
        const fromIdx = ids.indexOf(draggingId);
        const toIdx = ids.indexOf(overId);
        if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return prev;
        const newIds = [...ids];
        const [moved] = newIds.splice(fromIdx, 1);
        newIds.splice(toIdx, 0, moved);
        const base = -Date.now();
        const orderMap = {};
        newIds.forEach((id, i) => { orderMap[id] = base + i; });
        return prev.map(n => (orderMap[n.id] != null ? { ...n, order: orderMap[n.id] } : n));
      });
    };
    const handleEnd = () => setDraggingId(null);
    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleEnd);
    document.addEventListener("pointercancel", handleEnd);
    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleEnd);
      document.removeEventListener("pointercancel", handleEnd);
    };
  }, [draggingId, setNotes]);

  const sw = (colorKey) => ({ bg: noteBgFor(colorKey, dark), text: noteTextFor(colorKey, dark) });
  const editorSw = sw(color);
  const noteDateLabel = (ts) => { // ছোট করে "06-09-26" ফরম্যাটে দেখানোর জন্য, বাংলা হলে বাংলা সংখ্যায়
    if (!ts) return "";
    const d = new Date(ts);
    return `${nf(pad2(d.getDate()))}-${nf(pad2(d.getMonth() + 1))}-${nf(pad2(d.getFullYear() % 100))}`;
  };
  // ফরম্যাটিং টুলবারের ছোট আইকন বাটন — mousedown-এ preventDefault করে যাতে ক্লিক করার সময় টেক্সট সিলেকশন হারিয়ে না যায়
  const ToolbarBtn = ({ onClick, title: btnTitle, children }) => (
    <button type="button" onMouseDown={e => e.preventDefault()} onClick={onClick} title={btnTitle}
      style={{ border: "none", background: "transparent", cursor: "pointer", color: editorSw.text, display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 8, flexShrink: 0 }}>
      {children}
    </button>
  );

  const renderCard = (note) => {
    const csw = sw(note.color);
    const doneCount = (note.checklist || []).filter(c => c.done).length;
    const draggable = activeFolder !== "Trash" && !note.deletedAt;
    const isDraggingThis = draggingId === note.id;
    const handleCardPointerDown = (e) => {
      if (!draggable) return;
      dragInfoRef.current.startX = e.clientX;
      dragInfoRef.current.startY = e.clientY;
      dragInfoRef.current.longPressed = false;
      if (dragInfoRef.current.timer) clearTimeout(dragInfoRef.current.timer);
      dragInfoRef.current.timer = setTimeout(() => {
        dragInfoRef.current.longPressed = true;
        setDraggingId(note.id);
        vibrate();
      }, 350);
    };
    const handleCardPointerMove = (e) => {
      // long-press টাইমার শেষ হওয়ার আগেই যদি আঙুল সরে যায় (স্ক্রল করছে ধরে নিয়ে) ড্র্যাগ ক্যানসেল
      if (dragInfoRef.current.timer && !dragInfoRef.current.longPressed) {
        const dx = Math.abs(e.clientX - dragInfoRef.current.startX);
        const dy = Math.abs(e.clientY - dragInfoRef.current.startY);
        if (dx > 8 || dy > 8) { clearTimeout(dragInfoRef.current.timer); dragInfoRef.current.timer = null; }
      }
    };
    const handleCardPointerUp = () => {
      if (dragInfoRef.current.timer) { clearTimeout(dragInfoRef.current.timer); dragInfoRef.current.timer = null; }
    };
    const handleCardClick = () => {
      if (dragInfoRef.current.longPressed) { dragInfoRef.current.longPressed = false; return; } // ড্র্যাগ শেষে ক্লিক ওপেন হবে না
      if (!note.deletedAt) openEdit(note);
    };
    return (
      <div key={note.id} data-note-id={note.id}
        onClick={handleCardClick}
        onPointerDown={handleCardPointerDown} onPointerMove={handleCardPointerMove}
        onPointerUp={handleCardPointerUp} onPointerCancel={handleCardPointerUp}
        style={{ position: "relative", background: csw.bg, color: csw.text, borderRadius: 12, padding: "11px 12px 9px", cursor: note.deletedAt ? "default" : "pointer", marginBottom: 9, breakInside: "avoid", border: `1px solid ${cardBorder}`, display: "flex", flexDirection: "column", opacity: isDraggingThis ? 0.5 : 1, boxShadow: isDraggingThis ? "0 10px 22px -8px rgba(0,0,0,0.35)" : "none", transform: isDraggingThis ? "scale(1.03)" : "none", touchAction: draggable ? "pan-y" : undefined }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, marginBottom: 3 }}>
          <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.25 }}>{note.title || (isBn ? "শিরোনামহীন" : "Untitled")}</div>
          {note.pinned && !note.deletedAt && <Pin size={11} fill={csw.text} color={csw.text} style={{ flexShrink: 0, marginTop: 2 }} />}
        </div>
        {note.body && (
          <div style={{ fontSize: 12, opacity: 0.78, lineHeight: 1.4, marginBottom: (note.checklist || []).length ? 5 : 2, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{stripHtmlToText(note.body)}</div>
        )}
        {(note.checklist || []).length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 2 }}>
            {note.checklist.slice(0, 4).map(item => (
              <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11.5 }}>
                <span style={{ width: 11, height: 11, borderRadius: 3, border: `1.3px solid ${csw.text}`, marginTop: 1.5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: item.done ? csw.text : "transparent" }}>
                  {item.done && <Check size={7} color={dark ? "#0A0A0A" : "#FFF"} strokeWidth={3.5} />}
                </span>
                <span style={{ textDecoration: item.done ? "line-through" : "none", opacity: item.done ? 0.6 : 0.9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.text}</span>
              </div>
            ))}
            {(doneCount > 0 || note.checklist.length > 4) && (
              <span style={{ fontSize: 10, opacity: 0.65, marginTop: 1 }}>{nf(doneCount)}/{nf(note.checklist.length)} {isBn ? "সম্পন্ন" : "done"}</span>
            )}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 5, borderTop: `1px solid ${csw.text}22` }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, opacity: 0.75 }}>
            <Tag size={10} />{note.category || "General"}
          </span>
          <div style={{ display: "flex", gap: 9 }}>
            {!note.deletedAt ? (
              <>
                <button onClick={(e) => { e.stopPropagation(); togglePinNote(note.id); }} style={{ border: "none", background: "transparent", cursor: "pointer", color: csw.text, opacity: note.pinned ? 1 : 0.55, display: "flex" }}><Pin size={11} fill={note.pinned ? csw.text : "none"} /></button>
                <button onClick={(e) => { e.stopPropagation(); softDelete(note.id); }} style={{ border: "none", background: "transparent", cursor: "pointer", color: csw.text, opacity: 0.55, display: "flex" }}><Trash2 size={11} /></button>
              </>
            ) : (
              <>
                <button onClick={(e) => { e.stopPropagation(); restoreNote(note.id); }} title={isBn ? "ফিরিয়ে আনুন" : "Restore"} style={{ border: "none", background: "transparent", cursor: "pointer", color: csw.text, display: "flex" }}><RotateCcw size={11} /></button>
                <button onClick={(e) => { e.stopPropagation(); setTrashConfirm({ type: "one", id: note.id }); }} title={isBn ? "চিরতরে ডিলিট" : "Delete forever"} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#C0392B", display: "flex" }}><X size={12} /></button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fg-tab-panel" style={{ marginTop: 12, paddingBottom: 30 }}>
        <style>{`.fg-hide-scrollbar::-webkit-scrollbar{display:none;} .fg-hide-scrollbar{scrollbar-width:none;}`}</style>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setShowDrawer(true)} aria-label={isBn ? "ক্যাটাগরি" : "Categories"}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: textMain, display: "flex", padding: 2 }}>
              <Menu size={21} />
            </button>
            <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: -0.7, color: textMain, fontFamily: "'Inter Tight','Inter','Helvetica Neue',sans-serif" }}>
              {activeFolder === "All Notes" ? t.notesTitle : activeFolder === "Pinned" ? (isBn ? "পিন" : "Pinned") : activeFolder === "Trash" ? (isBn ? "ট্র্যাশ" : "Trash") : activeFolder}
            </div>
          </div>
          <span style={{ fontSize: 11, color: textMuted2 }}>{nf(notes.filter(n => !n.deletedAt).length)} {isBn ? "নোট" : "notes"}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, background: dark ? "#211E19" : "#F0EEE8", borderRadius: 14, padding: "9px 14px" }}>
            <Search size={15} color={textMuted2} style={{ flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.notesSearch}
              style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", color: textMain, fontFamily: "inherit", fontSize: 13.5 }} />
            {search && <button onClick={() => setSearch("")} style={{ border: "none", background: "transparent", color: textMuted2, cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}><X size={14} /></button>}
          </div>
        </div>

        {activeFolder === "Trash" && filtered.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 11.5, color: textMuted2, fontWeight: 600 }}>{isBn ? `নোট এখানে ${TRASH_RETENTION_DAYS} দিন থাকার পর নিজে থেকেই চিরতরে মুছে যাবে।` : `Notes here are permanently deleted automatically after ${TRASH_RETENTION_DAYS} days.`}</div>
            <button onClick={() => setTrashConfirm({ type: "all" })} style={{ flexShrink: 0, border: "none", background: "transparent", color: "#C54B4B", cursor: "pointer", fontSize: 12.5, fontWeight: 800, padding: "4px 6px" }}>{isBn ? "ট্র্যাশ খালি করুন" : "Empty Trash"}</button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", background: cardBg, border: `1px dashed ${cardBorder}`, borderRadius: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: dark ? "#242229" : "#F0EEF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              {activeFolder === "Trash" ? <Trash2 size={23} color={dark ? "#B0ABC2" : "#6E6B7A"} /> : <FileText size={23} color={dark ? "#B0ABC2" : "#6E6B7A"} />}
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: textMain }}>
              {activeFolder === "Trash" ? (isBn ? "ট্র্যাশ খালি" : "Trash is empty") : (search ? (isBn ? "কিছু পাওয়া যায়নি" : "No notes match") : t.notesEmpty)}
            </div>
            <div style={{ fontSize: 12.5, color: textMuted2, marginTop: 5 }}>
              {activeFolder === "Trash" ? (isBn ? "ডিলিট করা নোট এখানে দেখা যাবে।" : "Deleted notes will show up here.") : t.notesEmptySub}
            </div>
          </div>
        ) : (
          <>
            {pinnedList.length > 0 && (
              <>
                <div style={{ fontSize: 10, fontWeight: 700, color: textMuted2, letterSpacing: 0.6, marginBottom: 7 }}>{isBn ? "পিন করা" : "PINNED"}</div>
                <div style={{ columnCount: 2, columnGap: 9, marginBottom: 14 }}>{pinnedList.map(renderCard)}</div>
              </>
            )}
            {othersList.length > 0 && (
              <>
                {pinnedList.length > 0 && activeFolder !== "Trash" && <div style={{ fontSize: 10, fontWeight: 700, color: textMuted2, letterSpacing: 0.6, marginBottom: 7 }}>{isBn ? "অন্যান্য" : "OTHERS"}</div>}
                <div style={{ columnCount: 2, columnGap: 9 }}>{othersList.map(renderCard)}</div>
              </>
            )}
          </>
        )}
      </div>

      {showDrawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 55, display: "flex" }} onClick={() => { setShowDrawer(false); setEditCategoriesMode(false); }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "min(300px, 82vw)", height: "100%", background: cardBg, overflowY: "auto", padding: "18px 0 24px", boxShadow: "2px 0 16px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: textMain }}>{isBn ? "নোটস" : "Notes"}</span>
              <button onClick={() => { setShowDrawer(false); setEditCategoriesMode(false); }} style={{ border: "none", background: "transparent", cursor: "pointer", color: textMuted2, display: "flex" }}><X size={19} /></button>
            </div>

            <div style={{ padding: "0 10px", marginBottom: 8 }}>
              {[
                { key: "All Notes", label: isBn ? "সব নোট" : "All Notes", icon: Lightbulb },
                { key: "Pinned", label: isBn ? "পিন" : "Pinned", icon: Pin },
                { key: "Trash", label: (isBn ? "ট্র্যাশ" : "Trash") + (trashCount > 0 ? ` (${nf(trashCount)})` : ""), icon: Trash2 },
              ].map(f => {
                const Icon = f.icon;
                const active = activeFolder === f.key;
                return (
                  <button key={f.key} onClick={() => { setActiveFolder(f.key); setShowDrawer(false); setEditCategoriesMode(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, border: "none", cursor: "pointer", borderRadius: 24, padding: "11px 14px", textAlign: "left", background: active ? `${accent}22` : "transparent", color: textMain, fontSize: 14.5, marginBottom: 2 }}>
                    <Icon size={17} color={active ? accent : textMuted2} />{f.label}
                  </button>
                );
              })}
            </div>

            <div style={{ height: 1, background: cardBorder, margin: "8px 18px 12px" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 18px", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: textMuted2, fontWeight: 700 }}>{isBn ? "ক্যাটাগরি" : "Categories"}</span>
              <button onClick={() => setEditCategoriesMode(v => !v)} style={{ border: "none", background: "transparent", cursor: "pointer", color: editCategoriesMode ? accent : textMuted2, fontSize: 12.5, fontWeight: 700 }}>
                {editCategoriesMode ? (isBn ? "সম্পন্ন" : "Done") : (isBn ? "এডিট" : "Edit")}
              </button>
            </div>

            <div style={{ padding: "0 10px" }}>
              {categories.map(cat => {
                const active = activeFolder === cat;
                return (
                  <div key={cat} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <button onClick={() => { if (editCategoriesMode) return; setActiveFolder(cat); setShowDrawer(false); }}
                      style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 14, border: "none", cursor: editCategoriesMode ? "default" : "pointer", borderRadius: 24, padding: "11px 14px", textAlign: "left", background: active ? `${accent}22` : "transparent", color: textMain, fontSize: 14.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <Tag size={16} color={active ? accent : textMuted2} style={{ flexShrink: 0 }} />{cat}
                    </button>
                    {editCategoriesMode && (
                      <>
                        <button onClick={() => renameCategory(cat)} style={{ border: "none", background: "transparent", cursor: "pointer", color: textMuted2, display: "flex", padding: 8, flexShrink: 0 }}><Pencil size={14} /></button>
                        {cat !== "General" && <button onClick={() => deleteCategory(cat)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#C0392B", display: "flex", padding: 8, flexShrink: 0 }}><Trash2 size={14} /></button>}
                      </>
                    )}
                  </div>
                );
              })}
              <button onClick={addCategory} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, border: "none", cursor: "pointer", borderRadius: 24, padding: "11px 14px", textAlign: "left", background: "transparent", color: textMuted2, fontSize: 14.5 }}>
                <Plus size={16} />{isBn ? "নতুন ক্যাটাগরি" : "New category"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={openNew} title={t.notesNew} style={{ position: "fixed", right: 20, bottom: isDesktop ? 28 : 96, zIndex: 41, width: 52, height: 52, borderRadius: "50%", background: accent, color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: dark ? "0 10px 24px -8px rgba(0,0,0,0.5)" : "0 10px 24px -8px rgba(217,119,87,0.45)" }}>
        <Plus size={23} />
      </button>

      {editing && (
        <div style={{ position: "fixed", inset: 0, background: editorSw.bg, zIndex: 50, display: "flex", flexDirection: "column" }}>
          {/* এখন ফুল-পেজ এডিটর (Keep-এর মতো) — ব্যাকড্রপ নেই, হেডারের back arrow-ই একমাত্র close/save trigger (অটো-সেভ) */}
          <div style={{ width: "100%", height: "100%", color: editorSw.text, display: "flex", flexDirection: "column" }}>

            {/* ---- ফিক্সড হেডার: ব্যাক অ্যারো + টাইটেল ইনপুট + ফরম্যাটিং টুলবার ---- */}
            <div style={{ flexShrink: 0, padding: "12px 14px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <button onClick={save} title={isBn ? "বন্ধ করুন (অটো-সেভ)" : "Close (auto-saves)"} style={{ border: "none", background: "transparent", borderRadius: 7, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: editorSw.text }}><ChevronLeft size={20} /></button>
                <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, opacity: 0.6 }}>{(editing.id ? t.notesEdit : t.notesNew).toUpperCase()}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => setPaperStyle(p => p === "lined" ? "plain" : "lined")} title={isBn ? (paperStyle === "lined" ? "প্লেইন পাতা" : "খাতার লাইন") : (paperStyle === "lined" ? "Plain page" : "Ruled lines")} style={{ border: "none", background: paperStyle === "lined" ? `${editorSw.text}22` : "transparent", borderRadius: 7, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: editorSw.text }}><RuledPaperIcon size={12} /></button>
                  <button onClick={() => setPinned(p => !p)} title={isBn ? "পিন" : "Pin"} style={{ border: "none", background: pinned ? `${editorSw.text}22` : "transparent", borderRadius: 7, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: editorSw.text }}><Pin size={12} fill={pinned ? editorSw.text : "none"} /></button>
                </div>
              </div>

              <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t.notesTitlePlaceholder}
                style={{ width: "100%", border: "none", background: "transparent", outline: "none", fontSize: 16.5, fontWeight: 700, color: editorSw.text, marginBottom: 4, fontFamily: "inherit" }} />

              {/* ---- ফরম্যাটিং টুলবার: Bold, Italic, Underline, লেখার সাইজ (ছোট/মাঝারি/বড়), রঙ, ফরম্যাট মুছে ফেলা ---- */}
              <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 6, borderBottom: `1px solid ${editorSw.text}1A` }} className="fg-hide-scrollbar">
                <ToolbarBtn onClick={() => applyFormat("bold")} btnTitle={isBn ? "বোল্ড" : "Bold"}><Bold size={13} /></ToolbarBtn>
                <ToolbarBtn onClick={() => applyFormat("italic")} btnTitle={isBn ? "ইটালিক" : "Italic"}><Italic size={13} /></ToolbarBtn>
                <ToolbarBtn onClick={() => applyFormat("underline")} btnTitle={isBn ? "আন্ডারলাইন" : "Underline"}><Underline size={13} /></ToolbarBtn>
                <span style={{ width: 1, height: 15, background: `${editorSw.text}26`, margin: "0 3px", flexShrink: 0 }} />
                <ToolbarBtn onClick={() => applyFormat("fontSize", "2")} btnTitle={isBn ? "ছোট লেখা" : "Small text"}><span style={{ fontSize: 9, fontWeight: 800 }}>A</span></ToolbarBtn>
                <ToolbarBtn onClick={() => applyFormat("fontSize", "3")} btnTitle={isBn ? "সাধারণ লেখা" : "Normal text"}><span style={{ fontSize: 12, fontWeight: 800 }}>A</span></ToolbarBtn>
                <ToolbarBtn onClick={() => applyFormat("fontSize", "5")} btnTitle={isBn ? "বড় লেখা" : "Large text"}><span style={{ fontSize: 15, fontWeight: 800 }}>A</span></ToolbarBtn>
                <span style={{ width: 1, height: 15, background: `${editorSw.text}26`, margin: "0 3px", flexShrink: 0 }} />
                {NOTE_TEXT_COLORS.map(c => (
                  <button key={c.key} type="button" onMouseDown={e => e.preventDefault()} onClick={() => applyFormat("foreColor", c.hex)} title={c.key}
                    style={{ width: 15, height: 15, borderRadius: "50%", border: "none", background: c.hex, cursor: "pointer", flexShrink: 0, padding: 0, margin: "0 2.5px" }} />
                ))}
                <span style={{ width: 1, height: 15, background: `${editorSw.text}26`, margin: "0 3px", flexShrink: 0 }} />
                <ToolbarBtn onClick={() => applyFormat("removeFormat")} btnTitle={isBn ? "ফরম্যাট মুছুন" : "Clear formatting"}><RemoveFormatting size={13} /></ToolbarBtn>
              </div>
            </div>

            {/* ---- স্ক্রলযোগ্য অংশ: টেক্সট লেখার জন্য এখন সবচেয়ে বেশি জায়গা এখানেই ---- */}
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 14px 0" }}>
              <div style={{ position: "relative", marginBottom: 8 }}>
                {bodyEmpty && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, fontSize: 14, color: editorSw.text, opacity: 0.45, pointerEvents: "none" }}>{t.notesBodyPlaceholder}</div>
                )}
                <div ref={bodyRef} contentEditable suppressContentEditableWarning onInput={handleBodyInput}
                  style={{
                    width: "100%", minHeight: 24, outline: "none", fontSize: 14, color: editorSw.text, opacity: 0.95, wordBreak: "break-word", fontFamily: "inherit",
                    lineHeight: paperStyle === "lined" ? "22px" : 1.55,
                    backgroundImage: paperStyle === "lined" ? `repeating-linear-gradient(to bottom, transparent, transparent 21px, ${editorSw.text}2E 21px, ${editorSw.text}2E 22px)` : "none",
                    backgroundPositionY: paperStyle === "lined" ? "1px" : undefined,
                  }} />
              </div>

              {checklistOpen && (
                <>
                  {checklist.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 6 }}>
                      {checklist.map(item => (
                        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => toggleCheck(item.id)} style={{ width: 15, height: 15, borderRadius: 5, border: `1.5px solid ${editorSw.text}`, flexShrink: 0, background: item.done ? editorSw.text : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {item.done && <Check size={9} color={dark ? "#0A0A0A" : "#FFF"} strokeWidth={3.5} />}
                          </button>
                          <input value={item.text} onChange={e => setChecklist(c => c.map(x => x.id === item.id ? { ...x, text: e.target.value } : x))}
                            style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 13, color: editorSw.text, textDecoration: item.done ? "line-through" : "none", opacity: item.done ? 0.6 : 1, fontFamily: "inherit" }} />
                          <button onClick={() => removeCheck(item.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: editorSw.text, opacity: 0.5, display: "flex" }}><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Plus size={13} color={editorSw.text} style={{ opacity: 0.6 }} />
                    <input value={checklistDraft} onChange={e => setChecklistDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCheckItem(); } }} placeholder={isBn ? "তালিকায় যোগ করুন" : "Add item"} autoFocus
                      style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 12.5, color: editorSw.text, opacity: 0.85, fontFamily: "inherit" }} />
                    {checklistDraft.trim() && <button onClick={addCheckItem} style={{ border: "none", background: "transparent", cursor: "pointer", color: editorSw.text, fontSize: 11.5, fontWeight: 700 }}>{isBn ? "যোগ" : "Add"}</button>}
                  </div>
                </>
              )}
            </div>

            {/* ---- ফিক্সড ফুটার: ক্যাটাগরি + রঙ একই কম্প্যাক্ট লাইনে — শুধু বর্তমান সিলেকশন দেখায়, ট্যাপ করলে ফ্লোটিং পিকার খোলে ---- */}
            <div style={{ flexShrink: 0, padding: "8px 14px 12px", borderTop: `1px solid ${editorSw.text}1A`, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setChecklistOpen(o => !o)} title={isBn ? "চেকলিস্ট" : "Checklist"}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderRadius: 7, width: 24, height: 24, cursor: "pointer", background: checklistOpen ? `${editorSw.text}22` : "transparent", color: editorSw.text, flexShrink: 0 }}>
                  <ListChecks size={14} />
                </button>
                <button onClick={() => setPickerOpen(p => p === "category" ? null : "category")}
                  style={{ display: "flex", alignItems: "center", gap: 5, border: "none", borderRadius: 999, padding: "5px 10px", fontSize: 11.5, fontWeight: 700, cursor: "pointer", background: `${editorSw.text}14`, color: editorSw.text }}>
                  <Tag size={11} />{category}<ChevronDown size={11} style={{ opacity: 0.7 }} />
                </button>
                <span style={{ fontSize: 10.5, color: editorSw.text, opacity: 0.5 }}>{noteDateLabel(editing.createdAt || Date.now())}</span>
                <button onClick={() => setPickerOpen(p => p === "color" ? null : "color")}
                  style={{ display: "flex", alignItems: "center", gap: 5, border: "none", background: "transparent", cursor: "pointer", padding: 2 }}>
                  <Palette size={11} color={editorSw.text} style={{ opacity: 0.7 }} />
                  <span style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${editorSw.text}55`, background: (dark ? (NOTE_BG_PALETTE.find(c => c.key === (color || null))?.bgDark || NOTE_BG_PALETTE.find(c => c.key === (color || null))?.bg) : NOTE_BG_PALETTE.find(c => c.key === (color || null))?.bg) || (dark ? "#221E19" : NOTE_PAPER_BG), display: "inline-block" }} />
                  <ChevronDown size={11} style={{ opacity: 0.7, color: editorSw.text }} />
                </button>
              </div>

              {pickerOpen && (
                <>
                  {/* বাইরে ট্যাপ করলে পিকার বন্ধ হয়ে যাবে */}
                  <div onClick={() => setPickerOpen(null)} style={{ position: "fixed", inset: 0, zIndex: 55 }} />
                  <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 14, right: 14, background: editorSw.bg, border: `1px solid ${editorSw.text}22`, borderRadius: 14, padding: 12, boxShadow: "0 12px 28px -10px rgba(0,0,0,0.4)", zIndex: 56 }}>
                    {pickerOpen === "category" ? (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {categories.map(cat => (
                          <button key={cat} onClick={() => { setCategory(cat); setPickerOpen(null); }}
                            style={{ border: "none", borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", background: category === cat ? editorSw.text : "rgba(0,0,0,0.06)", color: category === cat ? editorSw.bg : editorSw.text, whiteSpace: "nowrap" }}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {NOTE_BG_PALETTE.map(c => {
                          const cbg = (dark ? (c.bgDark || c.bg) : c.bg) || (dark ? "#221E19" : NOTE_PAPER_BG);
                          const isSel = (color || null) === c.key;
                          return (
                            <button key={c.key || "default"} onClick={() => { setColor(c.key); setPickerOpen(null); }} title={isBn ? c.labelBn : c.labelEn}
                              style={{ width: 24, height: 24, borderRadius: "50%", border: isSel ? `2px solid ${editorSw.text}` : `1px solid ${cardBorder}`, background: cbg, cursor: "pointer", padding: 0 }} />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {trashConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 16 }} onClick={() => setTrashConfirm(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: cardBg, width: "100%", maxWidth: 340, borderRadius: 14, padding: 18, color: textMain }}>
            <div style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 8 }}>
              {trashConfirm.type === "all" ? (isBn ? "ট্র্যাশ খালি করবেন?" : "Empty trash?") : trashConfirm.fromEditor ? (isBn ? "নোটটি ডিলিট করবেন?" : "Delete this note?") : (isBn ? "চিরতরে ডিলিট করবেন?" : "Delete forever?")}
            </div>
            <div style={{ fontSize: 12.5, color: textMuted2, marginBottom: 16 }}>
              {trashConfirm.type === "all"
                ? (isBn ? "ট্র্যাশের সব নোট চিরতরে মুছে যাবে। এটা আর ফেরানো যাবে না।" : "All notes in trash will be permanently deleted. This can't be undone.")
                : trashConfirm.fromEditor
                  ? (isBn ? "নোটটি ট্র্যাশে চলে যাবে।" : "This note will be moved to trash.")
                  : (isBn ? "নোটটি চিরতরে মুছে যাবে। এটা আর ফেরানো যাবে না।" : "This note will be permanently deleted. This can't be undone.")}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setTrashConfirm(null)} style={{ border: "none", background: "transparent", color: textMuted2, cursor: "pointer", fontSize: 13, fontWeight: 700, padding: "8px 10px" }}>{isBn ? "বাতিল" : "Cancel"}</button>
              <button onClick={() => { if (trashConfirm.fromEditor) { softDelete(trashConfirm.id); setTrashConfirm(null); } else confirmTrashAction(); }}
                style={{ border: "none", background: "#C0392B", color: "#fff", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {isBn ? "ডিলিট" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
