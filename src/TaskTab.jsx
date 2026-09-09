// TaskTab.jsx
// মূল App__1_.jsx-এর "Task" ট্যাব — স্বয়ংসম্পূর্ণ প্রেজেন্টেশনাল কম্পোনেন্ট।
// টাস্কের আসল ডেটা ও কিছু হ্যান্ডলার এখনো প্যারেন্ট (App.jsx)-এ থাকা state থেকে prop হিসেবে আসে
// (যাতে Settings/Notifications ইত্যাদির সাথে ডেটা সিঙ্ক করা এক জায়গাতেই থাকে) — কিন্তু
// UI/রেন্ডারিং সম্পূর্ণ এই ফাইলে। আচরণ মূল ফাইলের সাথে হুবহু অপরিবর্তিত।

import React from "react";
import {
  Plus, Check, Pencil, Trash2, FileText, Repeat, ChevronLeft, ChevronRight,
  CalendarRange, Sparkles, Sun, Calendar, MoreVertical, ListChecks, CalendarClock,
  AudioLines, Heart,
} from "lucide-react";
import {
  dateKey, findTaskCategory, taskCategoryIcon, weekStartOffset, weekdayShortLabels,
  vibrate, Num, monthNameFor, weekdayNameFor, weekdayShortFor, lsFor, inkColorFor,
} from "./helpers";

export default function TaskTab({
  t, lang, dark, accent, nf, isDesktop,
  cardBg, cardBorder, textMain, textMuted2,
  today, todayKey,
  tasks, taskCategories,
  taskFilter, setTaskFilter,
  taskViewMode, setTaskViewMode,
  taskCalMonth, setTaskCalMonth,
  taskCalSelectedDay, setTaskCalSelectedDay,
  taskMenuOpenId, setTaskMenuOpenId,
  taskDeleteConfirmId, setTaskDeleteConfirmId,
  closeTaskMenu, deleteTask, toggleTask,
  toggleTaskFavorite, playTaskAudio,
  setEditingTask, setTaskDetailId,
  setTaskAddDefaultDate, setShowAddTask,
}) {
  // lang/dark থেকেই বের করা যায় এমন ছোট হেল্পারগুলো এখানেই কম্পিউট করা হচ্ছে,
  // যাতে প্যারেন্ট থেকে আলাদা prop হিসেবে পাঠাতে না হয়
  const ls = lsFor(lang);
  const monthName = monthNameFor(lang);
  const weekdayName = weekdayNameFor(lang);
  const weekdayShort = weekdayShortFor(lang);
  const inkColor = inkColorFor(dark);

  return (() => {

          const prColor = { high: "#C0392B", med: accent, low: "#6E8B5E" };
          const prLabel = { high: t.taskPrHigh, med: t.taskPrMed, low: t.taskPrLow };
          const doneCount = tasks.filter(x => x.done).length;
          const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

          // ---- Due-date helpers: bucket a task into "overdue" (past due date), "today" (due exactly today),
          // "nodate" (no due date set), or "upcoming" (future date) ----
          const tomorrowKey = dateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate()+1));
          const bucketOf = (x) => {
            if (!x.dueDate) return "nodate";
            if (x.dueDate < todayKey) return "overdue";
            if (x.dueDate === todayKey) return "today";
            return "upcoming";
          };
          const dueLabel = (dk) => {
            if (!dk) return null;
            if (dk <= todayKey) return null;
            const d = new Date(dk + "T00:00:00");
            return { text: `${nf(d.getDate())}`, color: textMuted2 };
          };

          const overdueCount = tasks.filter(x => !x.done && bucketOf(x) === "overdue").length;
          const doneAllCount = tasks.filter(x => x.done).length;

          const filterChips = [
            ["all", t.taskAll, ListChecks, tasks.length],
            ["done", t.taskFilterDone, Check, doneAllCount],
            ["overdue", t.taskFilterOverdue, CalendarClock, overdueCount],
          ];

          let filteredTasks;
          if (taskFilter === "done") filteredTasks = tasks.filter(x => x.done);
          else if (taskFilter === "overdue") filteredTasks = tasks.filter(x => !x.done && bucketOf(x) === "overdue");
          else filteredTasks = tasks.filter(x => (!x.done && bucketOf(x) !== "overdue") || (x.done && x.doneAt === todayKey));

          // ---- টাস্ক রো: "Today" স্ক্রিনশটের রেফারেন্স স্টাইল — সময় কলাম, রাউন্ডেড আইকন-বক্স চেকবক্স,
          // টাইটেল, আর ডানে ক্যাটাগরি ট্যাগ (রঙিন ডট + নাম) অথবা ডিউ/রিপিট ব্যাজ ----
          const renderTask = (x) => {
            const pr = x.priority || "med";
            const due = dueLabel(x.dueDate);
            const cat = x.category ? findTaskCategory(taskCategories, x.category) : null;
            const CatIcon = cat ? taskCategoryIcon(cat.icon) : null;
            return (
              <div key={x.id} className="fg-card fg-task-row" onClick={()=>setTaskDetailId(x.id)} style={{
                background: dark ? "#1C1A20" : "#FFFFFF",
                border: `1px solid ${cardBorder}`,
                borderRadius:14, padding:"11px 12px", marginBottom:8, display:"flex", alignItems:"center", gap:10, position:"relative", cursor:"pointer",
                transition:"background .15s ease",
              }}>
                <div style={{width:32, flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                  {(() => {
                    const m = /^(\d{1,2}):(\d{2})$/.exec((x.reminderTime||"").trim());
                    if (!m) return <span style={{fontSize:15, fontWeight:600, color:textMuted2, opacity:0.5}}>—</span>;
                    let hh = parseInt(m[1], 10);
                    const mm = m[2];
                    const ap = hh >= 12 ? "PM" : "AM";
                    hh = hh % 12; if (hh === 0) hh = 12;
                    return (
                      <>
                        <div style={{display:"flex", alignItems:"flex-end", lineHeight:1}}>
                          <span style={{fontSize:17, fontWeight:700, color:textMain}}><Num>{nf(hh)}</Num></span>
                          <span style={{fontSize:10.5, fontWeight:600, color:textMuted2, marginLeft:1}}><Num>{nf(mm)}</Num></span>
                        </div>
                        <span style={{fontSize:9.5, fontWeight:600, color:textMuted2, letterSpacing:0.3, marginTop:1}}>{ap}</span>
                      </>
                    );
                  })()}
                </div>
                <button onClick={(e)=>{e.stopPropagation(); vibrate(); toggleTask(x.id);}} style={{
                  width:26, height:26, borderRadius: x.done ? "50%" : 8, flexShrink:0, cursor:"pointer", padding:0,
                  border: x.done ? "none" : `1.5px solid ${due ? accent : cardBorder}`,
                  background: x.done ? "#C0392B" : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  {x.done ? <Check size={14} color="#fff" strokeWidth={3}/>
                    : x.audioDuration ? <AudioLines size={13} color={textMuted2}/>
                    : x.repeat ? <Repeat size={13} color={textMuted2}/>
                    : (CatIcon ? <CatIcon size={13} color={textMuted2}/> : <Check size={13} color={textMuted2} style={{opacity:0.35}}/>)}
                </button>
                {x.ringProgress != null && !x.done && (() => {
                  const r = 8, c = 2*Math.PI*r;
                  return (
                    <svg width={20} height={20} viewBox="0 0 20 20" style={{flexShrink:0, transform:"rotate(-90deg)"}}>
                      <circle cx="10" cy="10" r={r} fill="none" stroke={dark?"#2A2830":"#F0DCDC"} strokeWidth={2.5}/>
                      <circle cx="10" cy="10" r={r} fill="none" stroke="#E0607A" strokeWidth={2.5} strokeLinecap="round"
                        strokeDasharray={c} strokeDashoffset={c * (1 - x.ringProgress)}/>
                    </svg>
                  );
                })()}
                <div style={{flex:1, minWidth:0}}>
                  <div style={{
                    fontSize:13.5, fontWeight:500, color: x.done ? textMuted2 : textMain, opacity: x.done ? 0.7 : 0.9,
                    textDecoration: x.done ? "line-through" : "none",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                  }}>
                    {x.title}
                    {x.note && (
                      <FileText size={12} color={textMuted2} style={{display:"inline", verticalAlign:"middle", marginLeft:5, opacity:0.75}}/>
                    )}
                  </div>
                </div>
                <div style={{display:"flex", alignItems:"center", gap:6, flexShrink:0}}>
                  {x.favorite && (
                    <Heart size={14} color="#D9445E" fill="#D9445E" style={{flexShrink:0}}/>
                  )}
                  {x.audioDuration ? (
                    <button onClick={(e)=>{e.stopPropagation(); playTaskAudio && playTaskAudio(x);}} style={{display:"flex", alignItems:"center", gap:4, border:"none", background:"transparent", padding:0, cursor:"pointer", fontSize:11.5, fontWeight:500, color:textMuted2, whiteSpace:"nowrap"}}>
                      {x.audioDuration}
                    </button>
                  ) : cat ? (
                    <span style={{display:"flex", alignItems:"center", gap:4, fontSize:11.5, color:textMuted2, fontWeight:500, whiteSpace:"nowrap"}}>
                      <span style={{width:6, height:6, borderRadius:"50%", background:cat.color, display:"inline-block", flexShrink:0}}/>
                      {lang==="bn" ? cat.labelBn : cat.label}
                    </span>
                  ) : x.repeatProgress ? (
                    <span style={{fontSize:11.5, fontWeight:500, color:textMuted2, whiteSpace:"nowrap"}}>
                      <Num>{nf(x.repeatProgress.done)}</Num>/<Num>{nf(x.repeatProgress.total)}</Num>
                    </span>
                  ) : x.repeat && !x.done ? (
                    <span title={t.taskRepeatBadge} style={{fontSize:10, fontWeight:600, color:accent, background:`${accent}14`, borderRadius:8, padding:"2px 6px", whiteSpace:"nowrap"}}>
                      {x.dueDate && (() => {
                        const diffDays = Math.round((new Date(x.dueDate+"T00:00:00") - new Date(todayKey+"T00:00:00")) / 86400000);
                        return diffDays === 0 ? (lang==="bn" ? "আজ" : "Today") : diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
                      })()}
                    </span>
                  ) : due ? (
                    <span style={{fontSize:11.5, fontWeight:600, color:textMuted2}}>{due.text}</span>
                  ) : null}
                  <div style={{position:"relative"}} onClick={(e)=>e.stopPropagation()}>
                    <button onClick={(e)=>{ e.stopPropagation(); setTaskMenuOpenId(v => v===x.id ? null : x.id); setTaskDeleteConfirmId(null); }} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", padding:10, margin:-6, display:"flex", alignItems:"center", justifyContent:"center", touchAction:"manipulation"}}>
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
                              {toggleTaskFavorite && (
                                <button onClick={()=>{closeTaskMenu(); vibrate(); toggleTaskFavorite(x.id);}} style={{display:"flex", alignItems:"center", gap:8, width:"100%", border:"none", background:"transparent", color:x.favorite ? "#D9445E" : textMuted2, padding:"9px 12px", fontSize:13.5, fontWeight:500, cursor:"pointer", textAlign:"left"}}>
                                  <Heart size={13} fill={x.favorite ? "#D9445E" : "none"}/> {x.favorite ? (lang==="bn"?"ফেভারিট থেকে সরান":"Remove favorite") : (lang==="bn"?"ফেভারিট করুন":"Add to favorites")}
                                </button>
                              )}
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
              </div>
            );
          };


          const emptyMsg = taskFilter === "today" ? t.taskEmptyToday : taskFilter === "upcoming" ? t.taskEmptyUpcoming : taskFilter === "done" ? t.taskEmptyDone : taskFilter === "overdue" ? t.taskEmptyOverdue : t.taskEmpty;
          const emptySub = taskFilter === "today" ? t.taskEmptyTodaySub : taskFilter === "upcoming" ? t.taskEmptyUpcomingSub : taskFilter === "done" ? t.taskEmptyDoneSub : taskFilter === "overdue" ? t.taskEmptyOverdueSub : t.taskEmptySub;

          // ---- Calendar view: Stats ট্যাবের InlineMonthCalendar-এর মতোই একই ভিজ্যুয়াল স্টাইল (গ্রিড + legend), শুধু ডট রঙ টাস্ক অনুযায়ী (completed/pending/overdue) ----
          const renderTaskCalendarView = () => {
            const y = taskCalMonth.getFullYear(), m = taskCalMonth.getMonth();
            const firstDay = new Date(y, m, 1);
            const startOffset = weekStartOffset(firstDay.getDay());
            const daysInMonth = new Date(y, m+1, 0).getDate();
            const cells = [];
            for (let i=0;i<startOffset;i++) cells.push(null);
            for (let d=1; d<=daysInMonth; d++) cells.push(new Date(y,m,d));
            const shortDays = weekdayShortLabels(lang);

            const tasksByDay = {};
            tasks.forEach(x => { if (x.dueDate) (tasksByDay[x.dueDate] = tasksByDay[x.dueDate] || []).push(x); });
            const noDateTasks = tasks.filter(x => !x.dueDate);
            const selectedKey = taskCalSelectedDay || todayKey;
            const dayTasks = tasksByDay[selectedKey] || [];
            const selectedDateObj = new Date(selectedKey + "T00:00:00");

            // এই মাসের সামারি — মোট / সম্পন্ন / মেয়াদ-শেষ টাস্ক ভেরিয়েবল (আর ব্যবহার হচ্ছে না, তাই রিমুভড)

            return (
              <div>
                <button onClick={()=>{vibrate(); setTaskViewMode("list");}} style={{display:"flex", alignItems:"center", gap:5, border:"none", background:"transparent", color:textMuted2, cursor:"pointer", padding:"0 0 12px", fontSize:13, fontWeight:600}}>
                  <ChevronLeft size={15}/> {t.taskViewList}
                </button>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
                  <button onClick={()=>{vibrate(); setTaskCalMonth(new Date(y,m-1,1));}} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", display:"flex", padding:4}}><ChevronLeft size={18}/></button>
                  <span style={{fontSize:14.5, fontWeight:600, color:textMain}}>{monthName(m)} <Num>{nf(y)}</Num></span>
                  <button onClick={()=>{vibrate(); setTaskCalMonth(new Date(y,m+1,1));}} style={{border:"none", background:"transparent", color:textMuted2, cursor:"pointer", display:"flex", padding:4}}><ChevronRight size={18}/></button>
                </div>

                <div style={{background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"14px 12px", marginBottom:10}}>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:8}}>
                    {shortDays.map((d,i)=>(<div key={i} style={{textAlign:"center", fontSize:11.5, fontWeight:500, color:textMuted2}}>{d}</div>))}
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", rowGap:6}}>
                    {cells.map((d,i) => {
                      if (!d) return <div key={i}/>;
                      const dk = dateKey(d);
                      const list = tasksByDay[dk] || [];
                      const hasAny = list.length > 0;
                      const dayDone = list.filter(x=>x.done).length;
                      const dayTotal = list.length;
                      const dayPct = dayTotal ? dayDone / dayTotal : 0;
                      const doneAll = hasAny && dayDone === dayTotal;
                      const hasOverdue = list.some(x => !x.done && dk < todayKey);
                      const isToday = dk === todayKey;
                      const isSelected = dk === selectedKey;
                      const ringR = 12.5, ringC = 2 * Math.PI * ringR;
                      const ringColor = hasOverdue ? "#C0392B" : (doneAll ? "#6E8B5E" : accent);
                      return (
                        <button key={i} onClick={()=>{vibrate(); setTaskCalSelectedDay(dk);}} style={{
                          display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"4px 0", border:"none", background:"transparent", cursor:"pointer",
                        }}>
                          <div style={{position:"relative", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center"}}>
                            {hasAny && !isSelected && (
                              <svg width={28} height={28} viewBox="0 0 28 28" style={{position:"absolute", inset:0, transform:"rotate(-90deg)"}}>
                                <circle cx="14" cy="14" r={ringR} fill="none" stroke={dark?"#242424":"#E7E5ED"} strokeWidth={2}/>
                                <circle cx="14" cy="14" r={ringR} fill="none" stroke={ringColor} strokeWidth={2} strokeLinecap="round"
                                  strokeDasharray={ringC} strokeDashoffset={ringC * (1 - dayPct)}/>
                              </svg>
                            )}
                            <div style={{position:"relative", width:22, height:22, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12.5, fontWeight:500,
                              background: isSelected ? accent : "transparent",
                              border: isToday && !isSelected ? `1px solid ${accent}` : "none",
                              color: isSelected ? "#fff" : (hasOverdue ? "#C0392B" : textMain)}}>
                              <Num>{nf(d.getDate())}</Num>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calendar legend — Stats-এর ক্যালেন্ডার legend-এর মতোই একই স্টাইল */}
                <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:16, marginBottom:12, flexWrap:"wrap"}}>
                  <span style={{display:"flex", alignItems:"center", gap:4, fontSize:11.5, color:textMuted2, fontWeight:500}}>
                    <span style={{width:7,height:7,borderRadius:"50%", background:"#6E8B5E"}}/>{t.calendarLegendCompleted}
                  </span>
                  <span style={{display:"flex", alignItems:"center", gap:4, fontSize:11.5, color:textMuted2, fontWeight:500}}>
                    <span style={{width:7,height:7,borderRadius:"50%", background:inkColor}}/>{t.calendarLegendPlanned}
                  </span>
                  <span style={{display:"flex", alignItems:"center", gap:4, fontSize:11.5, color:textMuted2, fontWeight:500}}>
                    <span style={{width:7,height:7,borderRadius:"50%", background:"#C0392B"}}/>{t.taskOverdue}
                  </span>
                </div>

                <div style={{fontSize:20.5, fontWeight:600, letterSpacing:-0.3, color:textMain, marginBottom:9}}>
                  {selectedKey === todayKey ? (lang==="bn" ? "আজ" : "Today") : <>{weekdayName(selectedDateObj)}, <Num>{nf(selectedDateObj.getDate())}</Num> {monthName(selectedDateObj.getMonth())}</>}
                </div>
                {dayTasks.length === 0 ? (
                  <div style={{display:"flex", alignItems:"center", gap:8, padding:"8px 0 14px", color:textMuted2, fontSize:13, marginBottom: noDateTasks.length ? 8 : 0}}>
                    <Check size={16} color={textMuted2} strokeWidth={2}/>
                    <span style={{fontWeight:500}}>{t.taskCalEmptyDay}</span>
                  </div>
                ) : (
                  <div style={{display:"flex", flexDirection:"column", gap:0, marginBottom: noDateTasks.length ? 12 : 0}}>{dayTasks.map(renderTask)}</div>
                )}

                {noDateTasks.length > 0 && (
                  <div>
                    <div style={{fontSize:11.5, fontWeight:600, letterSpacing:ls(1), color:textMuted2, opacity:0.85, marginBottom:7}}>{t.taskCalNoDateTasks}</div>
                    <div style={{display:"flex", flexDirection:"column", gap:0}}>{noDateTasks.map(renderTask)}</div>
                  </div>
                )}
              </div>
            );
          };

          return (
            <>
            <div key="task" className="fg-tab-panel" style={{marginTop:16}}>
              <div style={{marginBottom:14}}>
                <div className="fg-title" style={{fontSize:21}}>{t.taskTitle}</div>
                <div style={{fontSize:12.5, color:"var(--muted)", marginTop:3, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", lineHeight:1.3}}>{t.taskSubtitle}</div>
              </div>

              {taskViewMode === "list" ? (
                <>
                  <div style={{position:"relative", marginBottom:12, borderBottom:"1px solid var(--track)", display:"flex", alignItems:"center", gap:10}}>
                    <div className="fg-chip-row" style={{display:"flex", gap:18, overflowX:"auto", flex:1, minWidth:0, WebkitMaskImage:"linear-gradient(to right, black 0, black calc(100% - 20px), transparent 100%)", maskImage:"linear-gradient(to right, black 0, black calc(100% - 20px), transparent 100%)"}}>
                      {filterChips.map(([key,label,Icon,count]) => (
                        <button key={key} onClick={()=>{vibrate(); setTaskFilter(key);}} style={{
                          display:"flex", alignItems:"center", gap:5, padding:"0 0 8px", cursor:"pointer", flexShrink:0,
                          border:"none", background:"transparent",
                          color: taskFilter===key ? "var(--text)" : "var(--muted)", fontWeight:600, fontSize:13.5, whiteSpace:"nowrap",
                          borderBottom: taskFilter===key ? `2px solid ${accent}` : "2px solid transparent", marginBottom:-1,
                        }}>
                          {label} ({nf(count)})
                        </button>
                      ))}
                      <div style={{width:1, flexShrink:0}}/>
                    </div>
                    <button onClick={()=>{vibrate(); setTaskViewMode("calendar");}} title={t.taskViewCalendar} style={{
                      display:"flex", alignItems:"center", justifyContent:"center", border:"none", background:"transparent", cursor:"pointer",
                      padding:"0 2px 9px", color:textMuted2, flexShrink:0,
                    }}>
                      <CalendarRange size={18}/>
                    </button>
                  </div>

                  {filteredTasks.length === 0 && (
                    <div style={{display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:10, padding:"34px 24px 26px"}}>
                      <div style={{position:"relative", width:78, height:78, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                        <div style={{position:"absolute", inset:0, borderRadius:"50%", background: dark ? "rgba(110,139,94,0.14)" : "rgba(110,139,94,0.11)"}}/>
                        <div style={{width:52, height:52, borderRadius:"50%", background: dark ? "rgba(110,139,94,0.22)" : "rgba(110,139,94,0.14)", border:`1px solid rgba(110,139,94,0.32)`, display:"flex", alignItems:"center", justifyContent:"center"}}>
                          <Sparkles size={22} color="#6E8B5E" strokeWidth={2}/>
                        </div>
                      </div>
                      <div>
                        <div style={{fontWeight:600, color:textMain, fontSize:15.5}}>{emptyMsg}</div>
                        <div style={{color:textMuted2, fontSize:13, lineHeight:1.5, marginTop:5, maxWidth:230}}>{emptySub}</div>
                      </div>
                    </div>
                  )}

                  {filteredTasks.length > 0 && taskFilter === "all" ? (() => {
                    const todayBucket = filteredTasks.filter(x => !x.done && bucketOf(x) === "today");
                    const upcomingBucket = filteredTasks.filter(x => !x.done && bucketOf(x) === "upcoming");
                    const nodateBucket = filteredTasks.filter(x => !x.done && bucketOf(x) === "nodate");
                    const doneTodayBucket = filteredTasks.filter(x => x.done);
                    return (
                      <>
                        {todayBucket.length > 0 && (
                          <div style={{marginBottom: (upcomingBucket.length || nodateBucket.length || doneTodayBucket.length) ? 16 : 0}}>
                            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
                              <div style={{display:"flex", alignItems:"center", gap:7}}>
                                <Sun size={15} color="#C08A2E" strokeWidth={2.3}/>
                                <span style={{fontSize:15.5, fontWeight:600, color:textMain}}>{t.taskSectionToday}</span>
                              </div>
                              <div style={{display:"flex", alignItems:"center", gap:5, fontSize:12, color:textMuted2, fontWeight:500}}>
                                <Calendar size={12}/> <Num>{nf(today.getDate())}</Num> {monthName(today.getMonth())}, {weekdayShort(today)}
                              </div>
                            </div>
                            <div style={{display:"flex", flexDirection:"column", gap:0}}>{todayBucket.map(renderTask)}</div>
                          </div>
                        )}
                        {upcomingBucket.length > 0 && (
                          <div style={{marginBottom: (nodateBucket.length || doneTodayBucket.length) ? 16 : 0}}>
                            <div style={{fontSize:11.5, fontWeight:500, letterSpacing:ls(1), color:textMuted2, opacity:0.85, marginBottom:7}}>{t.taskSectionUpcoming}</div>
                            <div style={{display:"flex", flexDirection:"column", gap:0}}>{upcomingBucket.map(renderTask)}</div>
                          </div>
                        )}
                        {nodateBucket.length > 0 && (
                          <div style={{marginBottom: doneTodayBucket.length ? 16 : 0}}>
                            <div style={{fontSize:11.5, fontWeight:500, letterSpacing:ls(1), color:textMuted2, opacity:0.85, marginBottom:7}}>{t.taskSectionNoDate}</div>
                            <div style={{display:"flex", flexDirection:"column", gap:0}}>{nodateBucket.map(renderTask)}</div>
                          </div>
                        )}
                        {doneTodayBucket.length > 0 && (
                          <div>
                            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
                              <div style={{display:"flex", alignItems:"center", gap:7}}>
                                <span style={{width:20, height:20, borderRadius:"50%", background:"#6E8B5E", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                                  <Check size={12} color="#fff" strokeWidth={3}/>
                                </span>
                                <span style={{fontSize:15.5, fontWeight:600, color:textMain}}>{t.taskSectionCompletedToday}</span>
                              </div>
                              <button onClick={()=>{vibrate(); setTaskFilter("done");}} style={{display:"flex", alignItems:"center", gap:3, border:"none", background:"transparent", color:"#6E8B5E", fontSize:12.5, fontWeight:600, cursor:"pointer", padding:0}}>
                                {lang==="bn" ? "সব দেখো" : "See all"} <ChevronRight size={13}/>
                              </button>
                            </div>
                            <div style={{display:"flex", flexDirection:"column", gap:0}}>{doneTodayBucket.map(renderTask)}</div>
                          </div>
                        )}
                      </>
                    );

                  })() : (
                    <div style={{display:"flex", flexDirection:"column", gap:8}}>
                      {filteredTasks.map(renderTask)}
                    </div>
                  )}
                </>
              ) : renderTaskCalendarView()}
            </div>

            {/* ফ্লোটিং + বাটন — ".fg-tab-panel"-এর বাইরে (sibling হিসেবে) রাখা হয়েছে যাতে পেজ-লোড অ্যানিমেশনের transform এটাকে
                উপর থেকে নিচে স্লাইড করিয়ে না আনে — সবসময় বটম-ন্যাভের ঠিক উপরে স্থির থাকবে;
                Calendar view-এ থাকলে ও কোনো দিন সিলেক্ট করা থাকলে সেই দিনটাই নতুন টাস্কের due date হিসেবে prefill হয়ে যাবে */}
            <button onClick={()=>{vibrate(); setTaskAddDefaultDate(taskViewMode === "calendar" ? (taskCalSelectedDay || todayKey) : todayKey); setShowAddTask(true);}} title={t.taskAdd} style={{
              position:"fixed", right:20, bottom: isDesktop ? 28 : 96, zIndex:41,
              width:40, height:40, borderRadius:12, border:"none", background:accent, color:"#fff",
              display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
              boxShadow: dark ? "0 2px 6px rgba(0,0,0,0.2)" : "0 2px 6px rgba(217,119,87,0.2)",
            }}>
              <Plus size={17} strokeWidth={2.4}/>
            </button>
          </>
          );
  })();
}
