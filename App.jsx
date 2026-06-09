import { useState, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════ */
const T = {
  bg0:     "#07090E",   // deepest bg
  bg1:     "#0C0F16",   // surface
  bg2:     "#111520",   // elevated / card
  bg3:     "#171B28",   // input bg
  border:  "#1E2233",
  borderB: "#2A2E42",
  text0:   "#F0EDE6",   // primary text
  text1:   "#9499AA",   // muted
  text2:   "#464C61",   // faint
  gold:    "#C9AA71",
  goldDim: "#9A7D4A",
  green:   "#6DB898",
  purple:  "#8A8EDA",
  red:     "#E07A72",
  blue:    "#6E8FD9",
};

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════ */
const MOCK_LEADS = [
  { id:"l1", name:"Aisha Patel",    phone:"+1 647-555-0182", email:"aisha@gmail.com",    source:"instagram", city:"Barrhaven", budget:850000, timeline:"1-3 mo", type:"buyer",    stage:"hot",       score:"hot",  last:"2026-06-06", notes:"Pre-approved. 4-bed detached. Loves Barrhaven South.", mortgage:true  },
  { id:"l2", name:"Marcus Chen",    phone:"+1 613-555-0247", email:"mchen@outlook.com",  source:"facebook",  city:"Kanata",    budget:1200000,timeline:"3-6 mo", type:"investor", stage:"contacted", score:"warm", last:"2026-06-04", notes:"Looking for multiplex or pre-con. Has 2 properties.", mortgage:false },
  { id:"l3", name:"Sofia Nkrumah",  phone:"+1 613-555-0391", email:"sofia@gmail.com",    source:"tiktok",    city:"Stittsville",budget:620000, timeline:"6-12 mo",type:"buyer",    stage:"new",       score:"warm", last:"2026-06-05", notes:"First-time buyer. Interested in HST rebate.", mortgage:false },
  { id:"l4", name:"James Okafor",   phone:"+1 647-555-0514", email:"jokafor@hotmail.com",source:"whatsapp",  city:"Orleans",   budget:500000, timeline:"12+ mo", type:"buyer",    stage:"new",       score:"cold", last:"2026-05-28", notes:"Early stage, just browsing.", mortgage:false },
  { id:"l5", name:"Priya Mehta",    phone:"+1 613-555-0628", email:"priya@icloud.com",   source:"instagram", city:"Nepean",    budget:950000, timeline:"1-3 mo", type:"investor", stage:"qualified", score:"hot",  last:"2026-06-07", notes:"Fast mover, looking for triplex or townhome portfolio.", mortgage:true  },
  { id:"l6", name:"David Tremblay", phone:"+1 613-555-0751", email:"dtrem@gmail.com",    source:"facebook",  city:"Gloucester",budget:750000, timeline:"3-6 mo", type:"buyer",    stage:"contacted", score:"warm", last:"2026-06-03", notes:"Upsizing from condo. Wife wants school zone.", mortgage:true  },
  { id:"l7", name:"Fatima Al-Hassan",phone:"+1 647-555-0884",email:"fatima@gmail.com",   source:"instagram", city:"Kanata",    budget:1500000,timeline:"1-3 mo", type:"investor", stage:"qualified", score:"hot",  last:"2026-06-06", notes:"Luxury / multi-unit. Cash-heavy buyer.", mortgage:true  },
  { id:"l8", name:"Tyler Morrison", phone:"+1 613-555-0917", email:"tyler@yahoo.com",    source:"tiktok",    city:"Barrhaven", budget:450000, timeline:"12+ mo", type:"buyer",    stage:"new",       score:"cold", last:"2026-05-20", notes:"Young buyer, just started looking.", mortgage:false },
];

const STAGES = [
  { id:"new",       label:"New Lead",  color:T.blue   },
  { id:"contacted", label:"Contacted", color:T.gold   },
  { id:"qualified", label:"Qualified", color:T.purple },
  { id:"hot",       label:"Hot",       color:T.red    },
  { id:"closed",    label:"Closed",    color:T.green  },
];

const SOURCES = {
  instagram:{ icon:"📸", label:"Instagram", color:"#E1306C" },
  tiktok:   { icon:"🎵", label:"TikTok",    color:"#69C9D0" },
  facebook: { icon:"👥", label:"Facebook",  color:"#4267B2" },
  whatsapp: { icon:"💬", label:"WhatsApp",  color:"#25D366" },
  manual:   { icon:"✏️", label:"Manual",    color:T.text1  },
};

const SCORE_STYLE = {
  hot:  { bg:"#2D1515", border:"#E07A7244", text:T.red    },
  warm: { bg:"#2D2515", border:"#C9AA7144", text:T.gold   },
  cold: { bg:"#15192D", border:"#6E8FD944", text:T.blue   },
};

const MOCK_CONTENT = [
  { id:"c1", city:"Kanata", type:"Pre-Construction", price:"$750K", tone:"investor", date:"2026-06-06",
    caption:"🏗️ Kanata North pre-con at $750K is projected to appreciate 18–22% before keys.\n\n→ HST Rebate: $24,000 back\n→ Deposit: 5% at signing\n→ Occupancy: 2028-Q3\n\nDM me 'KANATA' for the full breakdown. 📈",
    hook:"POV: Your Kanata pre-con went up $140K before you even got the keys 🔑",
    hashtags:"#KanataRealEstate #OttawaInvestor #PreConstruction #HSTRebate #OntarioRealEstate",
    tiktok:"[HOOK] 'POV: You bought pre-con in Kanata in 2024 and your property is worth $150K more'\n[BODY] Here's the breakdown on this Kanata North project...\n[CTA] DM me 'DEAL' for the full breakdown." },
  { id:"c2", city:"Barrhaven", type:"Detached", price:"$680K", tone:"ftb", date:"2026-06-05",
    caption:"First-time buyers — the government will give you money to buy your first home 🏠\n\n✅ FHSA: up to $40,000 tax-free\n✅ RRSP HBP: up to $35,000\n✅ HST Rebate: $24,000\n\nBarrhaven 4-bed detached at $680K — closer than you think.\n\nDM me 'READY' and let's make a plan 💛",
    hook:"Nobody told me Ontario gives first-time buyers $64K in free government money 🤯",
    hashtags:"#BarrhavenHomes #FirstTimeHomeBuyer #OttawaRealEstate #FHSA #OntarioHomes",
    tiktok:"[HOOK] 'Nobody told me about the $64K in government programs for first-time buyers'\n[BODY] There are three programs you need to know about in Ontario right now...\n[CTA] Follow me for daily Ottawa real estate truth." },
];

const MOCK_POSTS = [
  { id:"p1", platform:"tiktok",    type:"video",    topic:"First-Time Buyer",  hook:"Nobody told me Ontario gives you $64K...",       views:142000, likes:8900, shares:2400, saves:4100, dms:127, leads:34 },
  { id:"p2", platform:"instagram", type:"reel",     topic:"Comparison",        hook:"My client made $180K in equity. Here's what...",  views:203000, likes:14200,shares:4800, saves:7300, dms:218, leads:51 },
  { id:"p3", platform:"tiktok",    type:"video",    topic:"Market Update",     hook:"Hot take: Ottawa is Canada's most underrated...", views:89400,  likes:5200, shares:1690, saves:3100, dms:86,  leads:24 },
  { id:"p4", platform:"instagram", type:"reel",     topic:"Pre-Construction",  hook:"POV: Your pre-con went up $140K before keys",     views:84200,  likes:3210, shares:892,  saves:1840, dms:63,  leads:18 },
  { id:"p5", platform:"instagram", type:"carousel", topic:"Market Update",     hook:"Ottawa market stats that dropped jaws...",         views:31400,  likes:1240, shares:340,  saves:920,  dms:28,  leads:9  },
  { id:"p6", platform:"facebook",  type:"video",    topic:"HST Rebate",        hook:"The HST rebate is worth $24K and most miss it",   views:28900,  likes:1840, shares:920,  saves:0,    dms:38,  leads:22 },
];

const WEEKLY = [
  { week:"May 5",  views:184000, leads:28, dms:142 },
  { week:"May 12", views:221000, leads:34, dms:168 },
  { week:"May 19", views:198000, leads:29, dms:151 },
  { week:"May 26", views:267000, leads:41, dms:196 },
  { week:"Jun 2",  views:312000, leads:52, dms:231 },
  { week:"Jun 9",  views:347000, leads:61, dms:257 },
];

/* ═══════════════════════════════════════════════════════════════
   UTILITY
═══════════════════════════════════════════════════════════════ */
const fmtK = n => n >= 1000000 ? (n/1000000).toFixed(1)+"M" : n >= 1000 ? (n/1000).toFixed(0)+"K" : String(n);
const fmtBudget = n => "$" + (n/1000).toFixed(0) + "K";
const daysSince = d => Math.floor((Date.now() - new Date(d)) / 86400000);

/* ═══════════════════════════════════════════════════════════════
   REUSABLE ATOMS
═══════════════════════════════════════════════════════════════ */
const css = Object.assign;

function Card({ children, style={}, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={css({ background:T.bg2, border:`1px solid ${hov&&onClick?T.borderB:T.border}`, borderRadius:12,
        transition:"all .18s", cursor:onClick?"pointer":"default",
        transform:hov&&onClick?"translateY(-1px)":"none" }, style)}>
      {children}
    </div>
  );
}

function Badge({ text, score }) {
  const s = SCORE_STYLE[score] || { bg:T.bg3, border:T.border, text:T.text1 };
  return (
    <span style={{ background:s.bg, border:`1px solid ${s.border}`, color:s.text,
      borderRadius:20, fontSize:10, fontWeight:700, padding:"2px 9px", letterSpacing:"0.06em" }}>
      {text || score?.toUpperCase()}
    </span>
  );
}

function Pill({ label, color, bg }) {
  return (
    <span style={{ background:bg||(color+"22"), color, border:`1px solid ${color}33`,
      borderRadius:20, fontSize:10, fontWeight:600, padding:"2px 9px", letterSpacing:"0.04em" }}>
      {label}
    </span>
  );
}

function Input({ placeholder, value, onChange, style={} }) {
  const [foc, setFoc] = useState(false);
  return (
    <input value={value} onChange={onChange} placeholder={placeholder}
      onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
      style={css({ background:T.bg3, border:`1px solid ${foc?T.gold+"55":T.border}`,
        borderRadius:8, padding:"8px 12px", color:T.text0, fontSize:13,
        outline:"none", fontFamily:"inherit", width:"100%",
        transition:"border-color .15s" }, style)} />
  );
}

function Select({ value, onChange, children, style={} }) {
  return (
    <select value={value} onChange={onChange}
      style={css({ background:T.bg3, border:`1px solid ${T.border}`, borderRadius:8,
        padding:"7px 10px", color:T.text1, fontSize:12, outline:"none",
        fontFamily:"inherit", cursor:"pointer" }, style)}>
      {children}
    </select>
  );
}

function Btn({ children, onClick, variant="ghost", style={} }) {
  const [hov, setHov] = useState(false);
  const base = variant === "gold"
    ? { background:hov?"#D4B87A":"#C9AA71", color:"#07090E", border:"none" }
    : { background:hov?T.bg3:"transparent", color:hov?T.text0:T.text1, border:`1px solid ${hov?T.borderB:T.border}` };
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={css({ borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:600,
        cursor:"pointer", fontFamily:"inherit", transition:"all .15s",
        letterSpacing:"0.03em" }, base, style)}>
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MINI BAR CHART
═══════════════════════════════════════════════════════════════ */
function BarChart({ data, xKey, yKey, color=T.blue, height=100 }) {
  const max = Math.max(...data.map(d=>d[yKey]));
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height, paddingTop:8 }}>
      {data.map((d,i)=>{
        const h = max>0 ? (d[yKey]/max)*(height-20) : 0;
        return (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:9, color:T.text2 }}>{fmtK(d[yKey])}</span>
            <div style={{ width:"100%", height:h, background:color, borderRadius:"3px 3px 0 0", minHeight:2, opacity:.8 }} />
            <span style={{ fontSize:9, color:T.text2 }}>{d[xKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODULE 1 — LEADS
═══════════════════════════════════════════════════════════════ */
function LeadsModule() {
  const [view, setView] = useState("kanban");
  const [search, setSearch] = useState("");
  const [scoreF, setScoreF] = useState("all");
  const [sourceF, setSourceF] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [scoring, setScoring] = useState(null);
  const [addForm, setAddForm] = useState({ name:"", phone:"", email:"", city:"", budget:"", source:"manual", type:"buyer", stage:"new", notes:"" });

  const filtered = useMemo(()=>leads.filter(l=>{
    const ms = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.city.toLowerCase().includes(search.toLowerCase());
    const msc = scoreF==="all" || l.score===scoreF;
    const mso = sourceF==="all" || l.source===sourceF;
    return ms && msc && mso;
  }),[leads, search, scoreF, sourceF]);

  const kpis = useMemo(()=>({
    total: leads.length,
    hot: leads.filter(l=>l.score==="hot").length,
    warm: leads.filter(l=>l.score==="warm").length,
    cold: leads.filter(l=>l.score==="cold").length,
    preapproved: leads.filter(l=>l.mortgage).length,
  }),[leads]);

  const runScore = id => {
    setScoring(id);
    setTimeout(()=>{
      setLeads(prev=>prev.map(l=>{
        if(l.id!==id) return l;
        const tot = l.score==="cold" ? 22 : l.score==="warm" ? 28 : 35;
        const s = tot>=30?"hot":tot>=20?"warm":"cold";
        return {...l, score:s, score_reason:`Re-scored: urgency ${l.mortgage?9:5}/10`};
      }));
      setScoring(null);
      if(selected?.id===id) setSelected(leads.find(l=>l.id===id));
    }, 1600);
  };

  const addLead = () => {
    const nl = { ...addForm, id:"l"+Date.now(), budget:Number(addForm.budget)||0, score:"warm", last:new Date().toISOString().split("T")[0], mortgage:false };
    setLeads(p=>[nl,...p]);
    setAddForm({ name:"", phone:"", email:"", city:"", budget:"", source:"manual", type:"buyer", stage:"new", notes:"" });
    setShowAdd(false);
  };

  const selectedLead = selected ? leads.find(l=>l.id===selected.id)||selected : null;

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      {/* ── TOP BAR ── */}
      <div style={{ padding:"16px 20px 0", flexShrink:0 }}>
        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:16 }}>
          {[
            ["Total Leads", kpis.total,       T.blue],
            ["🔥 Hot",      kpis.hot,          T.red],
            ["🟡 Warm",     kpis.warm,         T.gold],
            ["❄️ Cold",     kpis.cold,         T.blue],
            ["✅ Pre-Approved", kpis.preapproved, T.green],
          ].map(([label,val,color])=>(
            <Card key={label} style={{ padding:"14px 16px" }}>
              <div style={{ fontSize:10, color:T.text2, letterSpacing:"0.08em", marginBottom:5 }}>{label.toUpperCase()}</div>
              <div style={{ fontSize:28, fontWeight:800, color, lineHeight:1, fontFamily:"'DM Mono',monospace" }}>{val}</div>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:14 }}>
          <div style={{ position:"relative", flex:1, minWidth:160 }}>
            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:T.text2, fontSize:14, pointerEvents:"none" }}>⌕</span>
            <Input placeholder="Search leads..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:32, height:34, fontSize:12 }} />
          </div>
          {["all","hot","warm","cold"].map(s=>(
            <button key={s} onClick={()=>setScoreF(s)}
              style={{ padding:"5px 14px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer", letterSpacing:"0.05em", fontFamily:"inherit", transition:"all .13s",
                background:scoreF===s?(s==="all"?T.bg3:SCORE_STYLE[s]?.bg||T.bg3):"transparent",
                border:`1px solid ${scoreF===s?(s==="all"?T.borderB:SCORE_STYLE[s]?.border||T.border):T.border}`,
                color:scoreF===s?(s==="all"?T.text0:SCORE_STYLE[s]?.text||T.text0):T.text2 }}>
              {s==="all"?"All Scores":s.toUpperCase()}
            </button>
          ))}
          <Select value={sourceF} onChange={e=>setSourceF(e.target.value)}>
            <option value="all">All Sources</option>
            {Object.entries(SOURCES).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
          </Select>
          <div style={{ display:"flex", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8, overflow:"hidden" }}>
            {["kanban","table"].map(v=>(
              <button key={v} onClick={()=>setView(v)}
                style={{ padding:"6px 14px", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", border:"none", transition:"all .13s",
                  background:view===v?T.bg3:"transparent", color:view===v?T.gold:T.text2, letterSpacing:"0.04em" }}>
                {v==="kanban"?"⬚ Kanban":"☰ Table"}
              </button>
            ))}
          </div>
          <Btn variant="gold" onClick={()=>setShowAdd(true)} style={{ padding:"7px 16px", fontSize:12 }}>+ Add Lead</Btn>
        </div>
      </div>

      {/* ── KANBAN ── */}
      {view==="kanban" && (
        <div style={{ flex:1, overflow:"auto", padding:"0 20px 20px" }}>
          <div style={{ display:"flex", gap:12, minWidth:"max-content" }}>
            {STAGES.map(stage=>{
              const stageleads = filtered.filter(l=>l.stage===stage.id);
              return (
                <div key={stage.id} style={{ width:240, flexShrink:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:stage.color }} />
                    <span style={{ fontSize:11, fontWeight:700, color:T.text1, letterSpacing:"0.07em" }}>{stage.label.toUpperCase()}</span>
                    <span style={{ marginLeft:"auto", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:20, fontSize:10, color:T.text2, padding:"1px 8px" }}>{stageleads.length}</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {stageleads.map(lead=>(
                      <KanbanCard key={lead.id} lead={lead} onOpen={setSelected} onScore={runScore} scoring={scoring} />
                    ))}
                    {stageleads.length===0 && (
                      <div style={{ border:`1px dashed ${T.border}`, borderRadius:10, padding:"18px 12px", textAlign:"center", color:T.text2, fontSize:11 }}>No leads</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TABLE ── */}
      {view==="table" && (
        <div style={{ flex:1, overflow:"auto", padding:"0 20px 20px" }}>
          <Card style={{ overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                  {["Name","City","Budget","Source","Score","Stage","Last Contact",""].map(h=>(
                    <th key={h} style={{ padding:"9px 14px", fontSize:10, color:T.text2, textAlign:"left", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(l=>{
                  const sc = SCORE_STYLE[l.score]||{};
                  const src = SOURCES[l.source]||SOURCES.manual;
                  const st = STAGES.find(s=>s.id===l.stage)||STAGES[0];
                  const days = daysSince(l.last);
                  return (
                    <tr key={l.id} style={{ borderBottom:`1px solid ${T.bg1}`, cursor:"pointer", transition:"background .1s" }}
                      onMouseEnter={e=>e.currentTarget.style.background=T.bg3}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                      onClick={()=>setSelected(l)}>
                      <td style={{ padding:"11px 14px" }}>
                        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                          <div style={{ width:30, height:30, borderRadius:"50%", background:sc.bg||T.bg3, border:`1px solid ${sc.border||T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:sc.text||T.text1, flexShrink:0 }}>
                            {l.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                          </div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:500, color:T.text0 }}>{l.name}</div>
                            <div style={{ fontSize:10, color:T.text2 }}>{l.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:T.text1 }}>{l.city}</td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:T.gold, fontFamily:"'DM Mono',monospace" }}>{fmtBudget(l.budget)}</td>
                      <td style={{ padding:"11px 14px", fontSize:12 }}><span style={{ fontSize:14 }}>{src.icon}</span> <span style={{ color:T.text2, fontSize:11 }}>{src.label}</span></td>
                      <td style={{ padding:"11px 14px" }}><Badge score={l.score} /></td>
                      <td style={{ padding:"11px 14px" }}><Pill label={st.label} color={st.color} /></td>
                      <td style={{ padding:"11px 14px", fontSize:11, color:days>7?T.red:T.text2, fontFamily:"'DM Mono',monospace" }}>{days===0?"Today":`${days}d ago`}</td>
                      <td style={{ padding:"11px 14px" }}>
                        <Btn onClick={e=>{e.stopPropagation();runScore(l.id);}} style={{ padding:"4px 10px", fontSize:10 }}>
                          {scoring===l.id?"…":"⚡ Score"}
                        </Btn>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length===0 && <div style={{ padding:40, textAlign:"center", color:T.text2, fontSize:13 }}>No leads match your filters.</div>}
          </Card>
        </div>
      )}

      {/* ── LEAD DETAIL PANEL ── */}
      {selectedLead && <LeadPanel lead={selectedLead} leads={leads} onClose={()=>setSelected(null)} onScore={runScore} scoring={scoring} />}

      {/* ── ADD LEAD MODAL ── */}
      {showAdd && (
        <Modal title="Add New Lead" onClose={()=>setShowAdd(false)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[["Full Name *","name","text"],["Phone *","phone","text"],["Email","email","email"],["City","city","text"],["Budget ($)","budget","number"]].map(([label,key,type])=>(
              <div key={key}>
                <label style={{ display:"block", fontSize:10, color:T.text2, marginBottom:5, letterSpacing:"0.07em" }}>{label.toUpperCase()}</label>
                <Input type={type} placeholder={label} value={addForm[key]} onChange={e=>setAddForm(p=>({...p,[key]:e.target.value}))} />
              </div>
            ))}
            <div>
              <label style={{ display:"block", fontSize:10, color:T.text2, marginBottom:5, letterSpacing:"0.07em" }}>SOURCE</label>
              <Select value={addForm.source} onChange={e=>setAddForm(p=>({...p,source:e.target.value}))} style={{ width:"100%" }}>
                {Object.entries(SOURCES).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
              </Select>
            </div>
            <div>
              <label style={{ display:"block", fontSize:10, color:T.text2, marginBottom:5, letterSpacing:"0.07em" }}>TYPE</label>
              <Select value={addForm.type} onChange={e=>setAddForm(p=>({...p,type:e.target.value}))} style={{ width:"100%" }}>
                <option value="buyer">🏠 Buyer</option>
                <option value="investor">🏦 Investor</option>
              </Select>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ display:"block", fontSize:10, color:T.text2, marginBottom:5, letterSpacing:"0.07em" }}>NOTES</label>
              <textarea value={addForm.notes} onChange={e=>setAddForm(p=>({...p,notes:e.target.value}))} placeholder="Lead context, preferences..."
                style={{ background:T.bg3, border:`1px solid ${T.border}`, borderRadius:8, padding:"9px 12px", color:T.text0, fontSize:13, outline:"none", fontFamily:"inherit", width:"100%", height:70, resize:"vertical" }} />
            </div>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
            <Btn onClick={()=>setShowAdd(false)}>Cancel</Btn>
            <Btn variant="gold" onClick={addLead} style={{ opacity:!addForm.name||!addForm.phone?.length?.toString()?0.5:1 }}>Save Lead</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function KanbanCard({ lead, onOpen, onScore, scoring }) {
  const sc = SCORE_STYLE[lead.score]||{};
  const src = SOURCES[lead.source]||SOURCES.manual;
  const days = daysSince(lead.last);
  return (
    <div onClick={()=>onOpen(lead)} style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:10, padding:14, cursor:"pointer", borderLeft:`3px solid ${sc.border?.replace("44","")||T.border}`, transition:"all .17s" }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderB; e.currentTarget.style.transform="translateY(-1px)";}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform="none";}}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:sc.bg||T.bg3, border:`1px solid ${sc.border||T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:sc.text||T.text1, flexShrink:0 }}>
            {lead.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:T.text0 }}>{lead.name}</div>
            <div style={{ fontSize:10, color:T.text2 }}>{lead.city}</div>
          </div>
        </div>
        <Badge score={lead.score} />
      </div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
        <Pill label={fmtBudget(lead.budget)} color={T.gold} />
        <span style={{ fontSize:12 }}>{src.icon}</span>
        {lead.mortgage && <Pill label="✓ Pre-Approved" color={T.green} />}
        {lead.type==="investor" && <Pill label="🏦 Investor" color={T.purple} />}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:8, borderTop:`1px solid ${T.border}` }}>
        <span style={{ fontSize:10, color:days>7?T.red:T.text2 }}>{days===0?"Today":`${days}d ago`}</span>
        <button onClick={e=>{e.stopPropagation();onScore(lead.id);}}
          style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:6, padding:"3px 8px", fontSize:10, color:T.text2, cursor:"pointer", fontFamily:"inherit" }}>
          {scoring===lead.id?"⟳":"⚡ Re-score"}
        </button>
      </div>
    </div>
  );
}

function LeadPanel({ lead, leads, onClose, onScore, scoring }) {
  const [tab, setTab] = useState("profile");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const sc = SCORE_STYLE[lead.score]||{};
  const src = SOURCES[lead.source]||SOURCES.manual;
  const st = STAGES.find(s=>s.id===lead.stage)||STAGES[0];

  const addNote = () => { if(note.trim()){ setNotes(p=>[{text:note,date:"Now"},...p]); setNote(""); } };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.65)", zIndex:200, display:"flex", alignItems:"flex-start", justifyContent:"flex-end" }} onClick={onClose}>
      <div style={{ width:"min(500px,100vw)", height:"100vh", background:T.bg1, borderLeft:`1px solid ${T.border}`, overflowY:"auto", animation:"slideIn .25s ease" }} onClick={e=>e.stopPropagation()}>
        <style>{`@keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>

        {/* Header */}
        <div style={{ padding:"18px 20px", borderBottom:`1px solid ${T.border}`, background:T.bg0, position:"sticky", top:0, zIndex:10, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ display:"flex", gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:sc.bg||T.bg3, border:`1px solid ${sc.border||T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:sc.text||T.text1 }}>
              {lead.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:600, color:T.text0 }}>{lead.name}</div>
              <div style={{ fontSize:12, color:T.text2, marginTop:2 }}>{src.icon} {src.label} · {lead.city}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <Badge score={lead.score} />
            <button onClick={onClose} style={{ background:T.bg2, border:"none", color:T.text1, cursor:"pointer", borderRadius:8, width:28, height:28, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
          </div>
        </div>

        {/* Stage bar */}
        <div style={{ padding:"10px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", gap:6, overflowX:"auto" }}>
          {STAGES.map(s=>(
            <Pill key={s.id} label={s.label} color={s.id===lead.stage?s.color:T.text2} bg={s.id===lead.stage?s.color+"22":T.bg3} />
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:`1px solid ${T.border}` }}>
          {["profile","ai score","notes","follow-up"].map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{ flex:1, padding:"9px 0", background:"none", border:"none", borderBottom:`2px solid ${tab===t?T.gold:"transparent"}`,
                color:tab===t?T.gold:T.text2, fontSize:11, cursor:"pointer", fontWeight:600, fontFamily:"inherit", letterSpacing:"0.06em", textTransform:"uppercase" }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ padding:"18px 20px" }}>
          {tab==="profile" && (
            <div>
              {[["📱 Phone",lead.phone],["📧 Email",lead.email],["💰 Budget",fmtBudget(lead.budget)],["📅 Timeline",lead.timeline],["🏠 Type",lead.type==="investor"?"Investor":"End User"],["✅ Pre-Approved",lead.mortgage?"Yes":"No"],["📅 Last Contact",lead.last]].map(([l,v])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", borderBottom:`1px solid ${T.bg3}`, paddingBottom:9, marginBottom:9 }}>
                  <span style={{ fontSize:12, color:T.text2 }}>{l}</span>
                  <span style={{ fontSize:12, color:T.text0, fontWeight:500 }}>{v}</span>
                </div>
              ))}
              {lead.notes && <div style={{ background:T.bg3, borderRadius:8, padding:"10px 12px", fontSize:12, color:T.text1, lineHeight:1.6, marginTop:8 }}>📝 {lead.notes}</div>}
            </div>
          )}

          {tab==="ai score" && (
            <div>
              <div style={{ background:"linear-gradient(135deg,#0F1118,#0C0F16)", border:`1px solid ${sc.border||T.border}`, borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
                <div style={{ fontSize:10, color:T.text2, letterSpacing:"0.1em", marginBottom:6 }}>AI VERDICT</div>
                <div style={{ fontSize:26, fontWeight:800, color:sc.text||T.text1, marginBottom:6 }}>{lead.score?.toUpperCase()} LEAD</div>
                <div style={{ fontSize:12, color:T.text1, lineHeight:1.7 }}>{lead.score_reason||"Score this lead to see AI reasoning."}</div>
              </div>
              {[["Urgency",lead.score==="hot"?9:lead.score==="warm"?6:3],["Responsiveness",lead.score==="hot"?8:lead.score==="warm"?5:3],["Budget Strength",lead.budget>900000?9:lead.budget>600000?6:4],["Buying Intent",lead.score==="hot"?9:lead.score==="warm"?6:2]].map(([l,v])=>(
                <div key={l} style={{ background:T.bg3, borderRadius:8, padding:"10px 12px", marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:12, color:T.text0, fontWeight:500 }}>{l}</span>
                    <span style={{ fontSize:13, color:sc.text||T.text1, fontFamily:"'DM Mono',monospace" }}>{v}/10</span>
                  </div>
                  <div style={{ height:3, background:T.border, borderRadius:2 }}>
                    <div style={{ width:`${v*10}%`, height:"100%", background:sc.border?.replace("44","")||T.border, borderRadius:2, transition:"width .5s" }} />
                  </div>
                </div>
              ))}
              <Btn variant="gold" onClick={()=>onScore(lead.id)} style={{ width:"100%", marginTop:12, height:38, textAlign:"center", justifyContent:"center", display:"flex", alignItems:"center" }}>
                {scoring===lead.id?"⟳ Scoring...":"⚡ Run AI Score"}
              </Btn>
            </div>
          )}

          {tab==="notes" && (
            <div>
              {notes.map((n,i)=>(
                <div key={i} style={{ background:T.bg3, borderRadius:8, padding:"10px 12px", marginBottom:8, fontSize:12, color:T.text1, lineHeight:1.6 }}>
                  <div style={{ fontSize:10, color:T.text2, marginBottom:4 }}>{n.date}</div>
                  {n.text}
                </div>
              ))}
              {lead.notes && <div style={{ background:T.bg3, borderRadius:8, padding:"10px 12px", marginBottom:8, fontSize:12, color:T.text1, lineHeight:1.6, border:`1px solid ${T.border}` }}>📝 {lead.notes}</div>}
              <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a note..."
                style={{ background:T.bg3, border:`1px solid ${T.border}`, borderRadius:8, padding:"9px 12px", color:T.text0, fontSize:13, outline:"none", fontFamily:"inherit", width:"100%", height:70, resize:"vertical", marginBottom:8 }} />
              <Btn variant="gold" onClick={addNote}>Save Note</Btn>
            </div>
          )}

          {tab==="follow-up" && (
            <div>
              {[{icon:"💬",label:"Send WhatsApp",desc:"Draft AI message",c:T.green},{icon:"📧",label:"Send Email",desc:"Generate personalized email",c:T.blue},{icon:"📞",label:"Log Call",desc:"Record call outcome",c:T.gold},{icon:"📅",label:"Book Showing",desc:"Schedule property tour",c:T.purple}].map(a=>(
                <div key={a.label} style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
                  <span style={{ fontSize:18 }}>{a.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500, color:T.text0 }}>{a.label}</div>
                    <div style={{ fontSize:11, color:T.text2 }}>{a.desc}</div>
                  </div>
                  <span style={{ color:T.text2, fontSize:12 }}>→</span>
                </div>
              ))}
              <div style={{ marginTop:12, padding:"12px 14px", background:T.bg3, borderRadius:8, border:`1px solid ${T.border}` }}>
                <div style={{ fontSize:10, color:T.gold, letterSpacing:"0.1em", marginBottom:6 }}>⚡ AI SUGGESTION</div>
                <div style={{ fontSize:12, color:T.text1, lineHeight:1.6 }}>
                  {lead.score==="hot"?"Call within 24 hours. Prepare a CMA for their target area.":lead.score==="warm"?"Send value-add content: market stats + a matching listing.":"Add to 30-day drip. One touchpoint every 10 days max."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODULE 2 — CONTENT
═══════════════════════════════════════════════════════════════ */
const TONES = [
  { id:"investor", icon:"📈", label:"Investor",         desc:"ROI, data, urgency" },
  { id:"ftb",      icon:"🏠", label:"First-Time Buyer", desc:"Warm, educational" },
  { id:"luxury",   icon:"✦",  label:"Luxury",           desc:"Aspirational, refined" },
  { id:"viral",    icon:"⚡",  label:"Viral / Edgy",     desc:"Bold, pattern interrupt" },
];

const OUTPUT_TYPES = [
  { id:"caption",  label:"Instagram Caption", icon:"📸", color:"#E1306C" },
  { id:"hook",     label:"Reel Hook",          icon:"🎬", color:T.gold },
  { id:"tiktok",   label:"TikTok Script",      icon:"🎵", color:"#69C9D0" },
  { id:"hashtags", label:"Hashtags",            icon:"#️⃣", color:T.green },
];

function generateMockContent(form) {
  const inv = form.tone==="investor";
  const ftb = form.tone==="ftb";
  const city = form.city||"Ottawa";
  const price = form.price||"$750,000";
  const type = form.property_type||"Detached";
  return {
    caption: inv
      ? `📊 ${city} investors — the numbers on this ${type} will stop your scroll.\n\n💰 Asking: ${price}\n✅ HST Rebate: up to $24,000\n→ ${city} appreciation avg: 11.4% YoY\n→ Rental demand up 34% since 2022\n\nDM me 'DEAL' for the full investment breakdown. 📈`
      : `You deserve a home that feels like yours from day one 🏡\n\n${city} ${type} | ${price}\n\n→ FHSA: up to $40,000 tax-free\n→ RRSP HBP: up to $35,000\n→ HST Rebate: up to $24,000\n\nDrop a ❤️ if this is your dream home. DM me 'FIRST HOME' to get started 💛`,
    hook: inv
      ? `POV: You bought pre-con in ${city} in 2024 and your property is now worth $150K more before you even got the keys 🔑`
      : `Nobody told me Ontario literally gives first-time buyers $64K in government money 🤯 Here's what every buyer needs to know:`,
    tiktok: `[HOOK - 0:00-0:03]\n"${inv?`This ${city} ${type} deal just made my investor client $${Math.floor(Math.random()*100+60)}K on paper`:`First-time buyers in Ontario — the government is literally giving you money`}"\n\n[BODY - 0:03-0:25]\n"${inv?`Here's the breakdown. Location: ${city}. Price: ${price}. Commission structure is strong...`:`There are three programs you need to know about right now. Number one — the FHSA...`}"\n\n[CTA - 0:25-0:30]\n"Follow me for more ${city} real estate truth. DM me '${inv?"DEAL":"HOME"}' for the full breakdown."`,
    hashtags: inv
      ? `#${city.replace(" ","")}RealEstate #OntarioInvestor #PreConstruction #HSTRebate #OttawaRealtor #InvestmentProperty #RealEstateCanada`
      : `#${city.replace(" ","")}Homes #OttawaRealEstate #FirstTimeHomeBuyer #OntarioRealEstate #FHSA #OttawaHomes #HomeOwnership`,
  };
}

function ContentModule() {
  const [tab, setTab] = useState("generate");
  const [form, setForm] = useState({ city:"Barrhaven", property_type:"Detached", price:"", builder:"", features:"", incentives:"", tone:"ftb", types:["caption","hook","hashtags"] });
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState(null);
  const [history, setHistory] = useState(MOCK_CONTENT);
  const [copied, setCopied] = useState(null);
  const [selectedHist, setSelectedHist] = useState(null);
  const [regenning, setRegenning] = useState(null);

  const setF = (k,v) => setForm(p=>({...p,[k]:v}));
  const toggleType = id => setForm(p=>({...p, types: p.types.includes(id)?p.types.filter(t=>t!==id):[...p.types,id]}));

  const generate = () => {
    setGenerating(true); setDraft(null);
    setTimeout(()=>{
      const c = generateMockContent(form);
      const filtered = Object.fromEntries(Object.entries(c).filter(([k])=>form.types.includes(k)));
      const d = { id:"d"+Date.now(), date:new Date().toISOString().split("T")[0], city:form.city, type:form.property_type, price:form.price, tone:form.tone, content:filtered };
      setDraft(d);
      setHistory(p=>[{ id:d.id, city:d.city, type:d.type, price:d.price, tone:d.tone, date:d.date, content:filtered },...p]);
      setGenerating(false);
    }, 2000);
  };

  const regen = key => {
    setRegenning(key);
    setTimeout(()=>{
      const fresh = generateMockContent(form);
      setDraft(p=>({...p, content:{...p.content, [key]:fresh[key]}}));
      setRegenning(null);
    }, 1200);
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).catch(()=>{});
    setCopied(key);
    setTimeout(()=>setCopied(null), 2000);
  };

  const CITIES = ["Ottawa","Barrhaven","Kanata","Stittsville","Nepean","Orleans","Gloucester"];
  const TYPES = ["Detached","Semi-Detached","Townhome","Condo","Pre-Construction","Multiplex"];

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      {/* Sub tabs */}
      <div style={{ display:"flex", gap:6, padding:"14px 20px 0", borderBottom:`1px solid ${T.border}`, flexShrink:0, background:T.bg0 }}>
        {[["generate","✦ Generate"],["history","📚 History"],["hooks","⚡ Hooks"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{ padding:"8px 16px", borderRadius:"8px 8px 0 0", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", border:"none", letterSpacing:"0.04em",
              background:tab===id?T.bg2:"transparent", color:tab===id?T.gold:T.text2, borderBottom:`2px solid ${tab===id?T.gold:"transparent"}` }}>
            {label}
          </button>
        ))}
      </div>

      {tab==="generate" && (
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          {/* Form sidebar */}
          <div style={{ width:300, borderRight:`1px solid ${T.border}`, overflowY:"auto", padding:18, background:T.bg0, flexShrink:0 }}>
            <div style={{ fontSize:10, color:T.text2, letterSpacing:"0.1em", marginBottom:12 }}>PROPERTY DETAILS</div>
            {[["City *","city","select-city"],["Property Type *","property_type","select-type"],["Price","price","text"],["Builder","builder","text"],["Features","features","textarea"],["Incentives","incentives","textarea"]].map(([label,key,t])=>(
              <div key={key} style={{ marginBottom:10 }}>
                <label style={{ display:"block", fontSize:10, color:T.text2, marginBottom:4, letterSpacing:"0.07em" }}>{label.toUpperCase()}</label>
                {t==="select-city"&&<Select value={form[key]} onChange={e=>setF(key,e.target.value)} style={{ width:"100%" }}>{CITIES.map(c=><option key={c}>{c}</option>)}</Select>}
                {t==="select-type"&&<Select value={form[key]} onChange={e=>setF(key,e.target.value)} style={{ width:"100%" }}>{TYPES.map(c=><option key={c}>{c}</option>)}</Select>}
                {t==="text"&&<Input placeholder={label} value={form[key]} onChange={e=>setF(key,e.target.value)} />}
                {t==="textarea"&&<textarea value={form[key]} onChange={e=>setF(key,e.target.value)} placeholder={label}
                  style={{ background:T.bg3, border:`1px solid ${T.border}`, borderRadius:8, padding:"8px 10px", color:T.text0, fontSize:12, outline:"none", fontFamily:"inherit", width:"100%", height:52, resize:"vertical" }} />}
              </div>
            ))}

            <div style={{ fontSize:10, color:T.text2, letterSpacing:"0.1em", marginBottom:10, marginTop:14 }}>TONE</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
              {TONES.map(t=>(
                <div key={t.id} onClick={()=>setF("tone",t.id)}
                  style={{ border:`2px solid ${form.tone===t.id?T.gold+"55":T.border}`, borderRadius:10, padding:"10px 12px", cursor:"pointer", background:form.tone===t.id?T.gold+"0A":T.bg2, transition:"all .13s" }}>
                  <div style={{ fontSize:14, marginBottom:3 }}>{t.icon}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:form.tone===t.id?T.gold:T.text1 }}>{t.label}</div>
                  <div style={{ fontSize:10, color:T.text2, marginTop:2 }}>{t.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize:10, color:T.text2, letterSpacing:"0.1em", marginBottom:10 }}>OUTPUT FORMATS</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
              {OUTPUT_TYPES.map(ot=>(
                <button key={ot.id} onClick={()=>toggleType(ot.id)}
                  style={{ padding:"5px 12px", borderRadius:8, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all .13s", border:`1px solid ${form.types.includes(ot.id)?ot.color+"44":T.border}`, background:form.types.includes(ot.id)?ot.color+"18":"transparent", color:form.types.includes(ot.id)?ot.color:T.text2 }}>
                  {ot.icon} {ot.label}
                </button>
              ))}
            </div>

            <Btn variant="gold" onClick={generate} style={{ width:"100%", height:42, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:6, opacity:generating||!form.types.length?0.6:1 }}>
              {generating?<><span style={{ display:"inline-block", animation:"spin 1s linear infinite" }}>✦</span> Generating...</>:"✦ Generate Content"}
            </Btn>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>

          {/* Output area */}
          <div style={{ flex:1, overflowY:"auto", padding:20 }}>
            {!draft && !generating && (
              <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", opacity:.35 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>✦</div>
                <div style={{ fontSize:20, fontWeight:800, color:T.text2, letterSpacing:"0.1em" }}>READY TO CREATE</div>
                <div style={{ fontSize:13, color:T.text2, marginTop:8 }}>Fill the form and hit Generate</div>
              </div>
            )}
            {generating && (
              <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:36, animation:"spin 1.2s linear infinite", display:"block", marginBottom:16 }}>✦</div>
                <div style={{ fontSize:16, fontWeight:800, color:T.gold, letterSpacing:"0.12em" }}>WRITING YOUR CONTENT…</div>
                <div style={{ fontSize:12, color:T.text2, marginTop:6 }}>GPT-4o crafting Ontario market copy</div>
              </div>
            )}
            {draft && !generating && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:18, fontWeight:800, color:T.text0 }}>{draft.type} · {draft.city} {draft.price&&`· ${draft.price}`}</div>
                    <div style={{ fontSize:11, color:T.text2, marginTop:3 }}>{TONES.find(t=>t.id===draft.tone)?.icon} {TONES.find(t=>t.id===draft.tone)?.label} tone · {Object.keys(draft.content).length} formats</div>
                  </div>
                  <Btn onClick={generate}>↺ Regenerate All</Btn>
                </div>
                {Object.entries(draft.content).map(([key,value])=>{
                  const ot = OUTPUT_TYPES.find(o=>o.id===key)||OUTPUT_TYPES[0];
                  return (
                    <div key={key} style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:12, padding:18, marginBottom:14, transition:"border-color .15s" }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderB}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                        <span style={{ fontSize:12, fontWeight:700, color:ot.color, letterSpacing:"0.05em" }}>{ot.icon} {ot.label.toUpperCase()}</span>
                        <div style={{ display:"flex", gap:6 }}>
                          <Btn onClick={()=>regen(key)} style={{ padding:"4px 10px", fontSize:11 }}>
                            {regenning===key?"⟳":null}{regenning===key?"":"↺ Vary"}
                          </Btn>
                          <button onClick={()=>copy(value, key)}
                            style={{ background:copied===key?"#1A2E1A":"#1A1D26", border:`1px solid ${copied===key?T.green+"44":T.border}`, borderRadius:7, color:copied===key?T.green:T.text2, padding:"4px 10px", fontSize:11, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
                            {copied===key?"✓ Copied!":"⎘ Copy"}
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize:13, color:T.text1, lineHeight:1.85, whiteSpace:"pre-line", fontFamily:key==="hashtags"?"'DM Mono',monospace":"inherit" }}>
                        {regenning===key?<span style={{ color:T.gold, opacity:.6 }}>Rewriting…</span>:value}
                      </div>
                    </div>
                  );
                })}
                <div style={{ padding:"10px 14px", background:T.bg3, borderRadius:8, border:`1px solid ${T.border}`, fontSize:12, color:T.text2, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ color:T.green }}>✓</span> Saved to Content History · {draft.date}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab==="history" && (
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          <div style={{ width:320, borderRight:`1px solid ${T.border}`, overflowY:"auto", padding:16 }}>
            <div style={{ fontSize:10, color:T.text2, letterSpacing:"0.1em", marginBottom:12 }}>HISTORY · {history.length} pieces</div>
            {history.map(item=>(
              <div key={item.id} onClick={()=>setSelectedHist(item)}
                style={{ padding:"12px 10px", borderRadius:8, cursor:"pointer", marginBottom:4, background:selectedHist?.id===item.id?T.bg3:"transparent", transition:"background .1s" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg3}
                onMouseLeave={e=>e.currentTarget.style.background=selectedHist?.id===item.id?T.bg3:"transparent"}>
                <div style={{ fontSize:13, fontWeight:600, color:T.text0, marginBottom:3 }}>{item.type} · {item.city}</div>
                <div style={{ fontSize:11, color:T.text2 }}>{TONES.find(t=>t.id===item.tone)?.icon} {TONES.find(t=>t.id===item.tone)?.label} · {item.price||"Price TBD"}</div>
                <div style={{ fontSize:10, color:T.text2, marginTop:2 }}>{Object.keys(item.content).length} formats · {item.date}</div>
              </div>
            ))}
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:20 }}>
            {selectedHist ? (
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:T.text0, marginBottom:4 }}>{selectedHist.type} · {selectedHist.city}</div>
                <div style={{ fontSize:11, color:T.text2, marginBottom:20 }}>{selectedHist.date} · {TONES.find(t=>t.id===selectedHist.tone)?.label} tone</div>
                {Object.entries(selectedHist.content).map(([key,value])=>{
                  const ot = OUTPUT_TYPES.find(o=>o.id===key)||OUTPUT_TYPES[0];
                  const ck = key+selectedHist.id;
                  return (
                    <div key={key} style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:12, padding:16, marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                        <span style={{ fontSize:12, fontWeight:700, color:ot.color }}>{ot.icon} {ot.label.toUpperCase()}</span>
                        <button onClick={()=>copy(value,ck)} style={{ background:copied===ck?"#1A2E1A":"#1A1D26", border:`1px solid ${copied===ck?T.green+"44":T.border}`, borderRadius:7, color:copied===ck?T.green:T.text2, padding:"4px 10px", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>
                          {copied===ck?"✓ Copied!":"⎘ Copy"}
                        </button>
                      </div>
                      <div style={{ fontSize:12, color:T.text1, lineHeight:1.8, whiteSpace:"pre-line" }}>{value}</div>
                    </div>
                  );
                })}
              </div>
            ) : <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:T.text2, opacity:.4, fontSize:13 }}>Select a piece from history</div>}
          </div>
        </div>
      )}

      {tab==="hooks" && (
        <div style={{ flex:1, overflowY:"auto", padding:20 }}>
          <div style={{ fontSize:18, fontWeight:800, color:T.text0, marginBottom:4 }}>Viral Hook Library</div>
          <div style={{ fontSize:12, color:T.text2, marginBottom:20 }}>Proven formulas for Ontario real estate · click to copy</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))", gap:12 }}>
            {[
              {cat:"POV",       text:"POV: You just found out Ottawa buyers are getting $24K back from the government 🇨🇦",tone:"ftb"},
              {cat:"Controversy",text:"Unpopular opinion: Renting in Ontario in 2026 is financial suicide 🔥",tone:"investor"},
              {cat:"Curiosity", text:"The one thing your realtor isn't telling you about pre-construction in Ottawa 👀",tone:"ftb"},
              {cat:"Social Proof",text:"My client made $180K in equity in 18 months. Here's exactly what they bought 👇",tone:"investor"},
              {cat:"Authority",  text:"I've sold 200+ homes in Ottawa. The #1 mistake buyers make is still this one thing:",tone:"viral"},
              {cat:"Relatability",text:"Nobody talks about what actually happens AFTER your offer gets accepted in Ontario 😅",tone:"ftb"},
              {cat:"Data Drop",  text:"Ottawa real estate stat that just dropped jaws at my last investor seminar 📊",tone:"investor"},
              {cat:"FOMO",       text:"This Barrhaven neighbourhood won't look like this in 24 months. Screenshot this 📸",tone:"investor"},
            ].map((h,i)=>{
              const k = "hook"+i;
              return (
                <div key={i} style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:12, padding:16, transition:"all .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.borderB;e.currentTarget.style.transform="translateY(-1px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="none";}}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:T.purple, background:T.purple+"18", borderRadius:20, padding:"2px 9px", letterSpacing:"0.06em" }}>{h.cat.toUpperCase()}</span>
                    <button onClick={()=>copy(h.text,k)} style={{ background:copied===k?"#1A2E1A":"transparent", border:`1px solid ${copied===k?T.green+"44":T.border}`, borderRadius:6, color:copied===k?T.green:T.text2, padding:"3px 8px", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>
                      {copied===k?"✓":"⎘ Copy"}
                    </button>
                  </div>
                  <div style={{ fontSize:14, color:T.text0, lineHeight:1.6 }}>{h.text}</div>
                  <div style={{ marginTop:8, fontSize:10, color:T.text2 }}>Best for: <span style={{ color:T.text1 }}>{h.tone==="ftb"?"First-Time Buyers":h.tone==="investor"?"Investors":"Viral/Growth"}</span></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODULE 3 — ANALYTICS
═══════════════════════════════════════════════════════════════ */
function AnalyticsModule() {
  const [tab, setTab] = useState("overview");
  const [period, setPeriod] = useState("30d");
  const [sortBy, setSortBy] = useState("leads");
  const [platformF, setPlatformF] = useState("all");
  const [showAddPost, setShowAddPost] = useState(false);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPost, setNewPost] = useState({ platform:"instagram", type:"reel", title:"", views:0, likes:0, shares:0, saves:0, dms:0, leads:0 });
  const [genInsights, setGenInsights] = useState(false);
  const [insights, setInsights] = useState([
    { type:"winner",  icon:"🏆", title:"Comparison content drives 3.2× more DMs",          metric:"+218% DMs",  body:"Posts framing 'renting vs buying' or client result stories average 156 DMs — 218% above your account average. Your highest-performing post was a comparison Reel." },
    { type:"trend",   icon:"📈", title:"TikTok converts 38% better than Instagram for leads", metric:"2.8/1K views",body:"Your TikTok posts generate 2.8 leads per 1,000 views vs 2.1 on Instagram. First-time buyer content on TikTok specifically averages 34 leads per post." },
    { type:"winner",  icon:"💰", title:"Townhomes under $700K generate most DM inquiries",   metric:"+31% saves",  body:"Price-anchored content performs 31% better. Posts with a specific price point under $700K see higher save rates and faster DM response time." },
    { type:"alert",   icon:"⚠️", title:"Luxury content underperforms by 54% vs average",     metric:"−54% leads",  body:"Luxury posts average 8 leads and 31 DMs — well below your 21-lead average. Reframe luxury content as investor-grade assets rather than aspirational lifestyle." },
    { type:"opportunity",icon:"💡",title:"Ottawa hot takes drive organic reach spikes",      metric:"+41% reach",  body:"Your 'underrated market' TikTok reached 89K views — 41% above your average. Controversial market opinions consistently outperform listing-only content." },
  ]);

  const INSIGHT_COLORS = {
    winner:      { bg:"#1A2D1A", border:`${T.green}44`, badge:"#1A2E1A", text:T.green },
    trend:       { bg:"#1A1D2D", border:`${T.purple}44`, badge:"#1A1D2E", text:T.purple },
    alert:       { bg:"#2D1A1A", border:`${T.red}44`, badge:"#2E1A1A", text:T.red },
    opportunity: { bg:"#2D251A", border:`${T.gold}44`, badge:"#2E251A", text:T.gold },
  };

  const filteredPosts = useMemo(()=>{
    let p = posts;
    if(platformF!=="all") p = p.filter(x=>x.platform===platformF);
    return [...p].sort((a,b)=>b[sortBy]-a[sortBy]);
  },[posts,sortBy,platformF]);

  const totals = useMemo(()=>({
    views: posts.reduce((s,p)=>s+p.views,0),
    leads: posts.reduce((s,p)=>s+p.leads,0),
    dms:   posts.reduce((s,p)=>s+p.dms,0),
    saves: posts.reduce((s,p)=>s+p.saves,0),
  }),[posts]);

  const PICONS = { instagram:"📸", tiktok:"🎵", facebook:"👥" };
  const PCOLORS = { instagram:"#E1306C", tiktok:"#69C9D0", facebook:"#4267B2" };

  const runInsights = () => {
    setGenInsights(true);
    setTimeout(()=>{
      setInsights(prev=>[...prev,{ type:"opportunity", icon:"💡", title:"Reel hooks with client stories 2.4× more views", metric:"2.4× views", body:"Posts starting with a specific dollar amount a client earned generate 2.4× more views than generic property posts. Your best post this month used this formula." }]);
      setGenInsights(false);
    }, 2200);
  };

  const addPost = () => {
    setPosts(p=>[{ ...newPost, id:"p"+Date.now(), topic:"General", hook:newPost.title },...p]);
    setNewPost({ platform:"instagram", type:"reel", title:"", views:0, likes:0, shares:0, saves:0, dms:0, leads:0 });
    setShowAddPost(false);
  };

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      {/* Top controls */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px 0", flexShrink:0 }}>
        <div style={{ display:"flex", gap:6 }}>
          {["overview","content","insights"].map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{ padding:"7px 16px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", border:`1px solid ${tab===t?T.gold+"33":T.border}`, background:tab===t?T.gold+"18":"transparent", color:tab===t?T.gold:T.text2, transition:"all .13s", letterSpacing:"0.04em" }}>
              {t==="overview"?"▦ Overview":t==="content"?"🏆 Top Content":"✦ AI Insights"}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {["7d","30d","90d"].map(p=>(
            <button key={p} onClick={()=>setPeriod(p)}
              style={{ padding:"5px 12px", borderRadius:8, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", border:`1px solid ${period===p?T.gold+"44":T.border}`, background:period===p?T.gold+"18":"transparent", color:period===p?T.gold:T.text2 }}>
              {p}
            </button>
          ))}
          <Btn variant="gold" onClick={()=>setShowAddPost(true)} style={{ padding:"6px 14px", fontSize:12 }}>+ Log Post</Btn>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"14px 20px 20px" }}>

        {tab==="overview" && (
          <div>
            {/* KPIs */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 }}>
              {[["Total Views",fmtK(totals.views),T.blue],["Leads Generated",totals.leads,T.green],["DMs Received",fmtK(totals.dms),T.gold],["Total Saves",fmtK(totals.saves),T.purple]].map(([l,v,c])=>(
                <Card key={l} style={{ padding:"16px 18px" }}>
                  <div style={{ fontSize:10, color:T.text2, letterSpacing:"0.08em", marginBottom:6 }}>{l.toUpperCase()}</div>
                  <div style={{ fontSize:30, fontWeight:800, color:c, lineHeight:1, fontFamily:"'DM Mono',monospace" }}>{v}</div>
                  <div style={{ fontSize:11, color:T.green, marginTop:4 }}>↑ ~24% vs last period</div>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:14, marginBottom:14 }}>
              <Card style={{ padding:"18px 20px" }}>
                <div style={{ fontSize:12, fontWeight:600, color:T.text0, marginBottom:3 }}>Weekly Views</div>
                <div style={{ fontSize:10, color:T.text2, marginBottom:14 }}>6-week trend</div>
                <BarChart data={WEEKLY} xKey="week" yKey="views" color={T.blue} height={120} />
              </Card>
              <Card style={{ padding:"18px 20px" }}>
                <div style={{ fontSize:12, fontWeight:600, color:T.text0, marginBottom:3 }}>Platform Mix</div>
                <div style={{ fontSize:10, color:T.text2, marginBottom:14 }}>by posts published</div>
                {[["Instagram",6,"#E1306C"],["TikTok",4,"#69C9D0"],["Facebook",2,"#4267B2"]].map(([p,n,c])=>(
                  <div key={p} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:12, color:T.text1 }}>{p}</span>
                      <span style={{ fontSize:11, color:T.text2, fontFamily:"'DM Mono',monospace" }}>{n} posts</span>
                    </div>
                    <div style={{ height:4, background:T.border, borderRadius:2 }}>
                      <div style={{ width:`${(n/12)*100}%`, height:"100%", background:c, borderRadius:2 }} />
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Leads by week */}
            <Card style={{ padding:"18px 20px" }}>
              <div style={{ fontSize:12, fontWeight:600, color:T.text0, marginBottom:3 }}>Weekly Leads</div>
              <div style={{ fontSize:10, color:T.text2, marginBottom:14 }}>leads generated per week</div>
              <BarChart data={WEEKLY} xKey="week" yKey="leads" color={T.green} height={100} />
            </Card>
          </div>
        )}

        {tab==="content" && (
          <div>
            {/* Filters */}
            <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
              <div style={{ fontSize:11, color:T.text2 }}>SORT:</div>
              {["leads","dms","views","saves"].map(m=>(
                <button key={m} onClick={()=>setSortBy(m)}
                  style={{ padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit", letterSpacing:"0.04em",
                    background:sortBy===m?T.gold+"18":"transparent", border:`1px solid ${sortBy===m?T.gold+"44":T.border}`, color:sortBy===m?T.gold:T.text2 }}>
                  {m.toUpperCase()}
                </button>
              ))}
              <Select value={platformF} onChange={e=>setPlatformF(e.target.value)} style={{ marginLeft:"auto" }}>
                <option value="all">All Platforms</option>
                <option value="instagram">📸 Instagram</option>
                <option value="tiktok">🎵 TikTok</option>
                <option value="facebook">👥 Facebook</option>
              </Select>
            </div>

            <Card style={{ overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                    {["#","Post Hook","Platform","Views","Leads","DMs","Saves"].map((h,i)=>(
                      <th key={h} style={{ padding:"9px 14px", fontSize:10, color:T.text2, textAlign:i>2?"right":"left", letterSpacing:"0.08em", fontWeight:700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((p,i)=>(
                    <tr key={p.id} style={{ borderBottom:`1px solid ${T.bg1}` }}>
                      <td style={{ padding:"11px 14px", fontFamily:"'DM Mono',monospace", fontSize:14, color:i<3?T.gold:T.text2 }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</td>
                      <td style={{ padding:"11px 14px" }}>
                        <div style={{ fontSize:12, color:T.text0, fontWeight:500 }}>{(p.hook||p.topic||"Untitled").slice(0,52)}{(p.hook||"").length>52?"…":""}</div>
                        <div style={{ fontSize:10, color:T.text2, marginTop:2 }}>{p.type} · {p.topic}</div>
                      </td>
                      <td style={{ padding:"11px 14px", color:PCOLORS[p.platform]||T.text2, fontSize:13 }}>{PICONS[p.platform]} <span style={{ fontSize:11 }}>{p.platform}</span></td>
                      {[fmtK(p.views),p.leads,p.dms,fmtK(p.saves)].map((v,j)=>(
                        <td key={j} style={{ padding:"11px 14px", textAlign:"right", fontFamily:"'DM Mono',monospace", fontSize:12, color:[T.blue,T.green,T.gold,T.purple][j] }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {tab==="insights" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:T.text0, marginBottom:2 }}>AI Insights Engine</div>
                <div style={{ fontSize:12, color:T.text2 }}>GPT-4o analysis of your {period} content performance</div>
              </div>
              <Btn variant="gold" onClick={runInsights} style={{ display:"flex", alignItems:"center", gap:6 }}>
                {genInsights?<><span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</span> Analyzing…</>:"✦ Generate Insights"}
              </Btn>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {insights.map((ins,i)=>{
                const cfg = INSIGHT_COLORS[ins.type]||INSIGHT_COLORS.opportunity;
                return (
                  <div key={i} style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:14, padding:18, transition:"transform .18s, box-shadow .18s", cursor:"default" }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 30px rgba(0,0,0,.3)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ fontSize:18 }}>{ins.icon}</span>
                        <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.07em", background:cfg.badge, color:cfg.text, borderRadius:20, padding:"2px 8px", textTransform:"uppercase" }}>{ins.type}</span>
                      </div>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:cfg.text, background:cfg.badge, borderRadius:6, padding:"3px 8px" }}>{ins.metric}</span>
                    </div>
                    <div style={{ fontSize:14, fontWeight:600, color:T.text0, marginBottom:8, lineHeight:1.4 }}>{ins.title}</div>
                    <div style={{ fontSize:12, color:T.text1, lineHeight:1.7 }}>{ins.body}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showAddPost && (
        <Modal title="Log Social Post" onClose={()=>setShowAddPost(false)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ display:"block", fontSize:10, color:T.text2, marginBottom:4, letterSpacing:"0.07em" }}>POST HOOK / TITLE</label>
              <Input placeholder="Opening hook or title" value={newPost.title} onChange={e=>setNewPost(p=>({...p,title:e.target.value}))} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:10, color:T.text2, marginBottom:4 }}>PLATFORM</label>
              <Select value={newPost.platform} onChange={e=>setNewPost(p=>({...p,platform:e.target.value}))} style={{ width:"100%" }}>
                <option value="instagram">📸 Instagram</option>
                <option value="tiktok">🎵 TikTok</option>
                <option value="facebook">👥 Facebook</option>
              </Select>
            </div>
            <div>
              <label style={{ display:"block", fontSize:10, color:T.text2, marginBottom:4 }}>TYPE</label>
              <Select value={newPost.type} onChange={e=>setNewPost(p=>({...p,type:e.target.value}))} style={{ width:"100%" }}>
                <option value="reel">Reel</option>
                <option value="video">Video</option>
                <option value="carousel">Carousel</option>
                <option value="post">Post</option>
              </Select>
            </div>
            {["views","likes","shares","saves","dms","leads"].map(k=>(
              <div key={k}>
                <label style={{ display:"block", fontSize:10, color:T.text2, marginBottom:4, letterSpacing:"0.07em" }}>{k.toUpperCase()}</label>
                <Input type="number" placeholder="0" value={newPost[k]||""} onChange={e=>setNewPost(p=>({...p,[k]:Number(e.target.value)}))} />
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
            <Btn onClick={()=>setShowAddPost(false)}>Cancel</Btn>
            <Btn variant="gold" onClick={addPost}>Log Post</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODAL WRAPPER
═══════════════════════════════════════════════════════════════ */
function Modal({ title, children, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.72)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>
      <div style={{ width:"min(560px,94vw)", background:T.bg1, border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden", animation:"fadeIn .2s ease" }} onClick={e=>e.stopPropagation()}>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
        <div style={{ padding:"16px 22px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", background:T.bg0 }}>
          <div style={{ fontSize:15, fontWeight:700, color:T.text0 }}>{title}</div>
          <button onClick={onClose} style={{ background:T.bg2, border:"none", color:T.text1, cursor:"pointer", borderRadius:8, width:28, height:28, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>
        <div style={{ padding:"20px 22px", maxHeight:"70vh", overflowY:"auto" }}>{children}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT APP — LAYOUT + SIDEBAR + TAB SWITCHER
═══════════════════════════════════════════════════════════════ */
const NAV = [
  { id:"leads",     icon:"▦", label:"Lead CRM",        sub:"Kanban · AI Scoring",  color:T.green  },
  { id:"content",   icon:"✦", label:"Content Machine", sub:"Generate · History",   color:T.purple },
  { id:"analytics", icon:"▲", label:"Analytics",       sub:"Charts · Insights",    color:T.red    },
];

export default function App() {
  const [module, setModule] = useState("leads");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const active = NAV.find(n=>n.id===module);
  const leadCount = MOCK_LEADS.filter(l=>l.score==="hot").length;

  return (
    <div style={{ height:"100vh", display:"flex", overflow:"hidden", background:T.bg0, fontFamily:"'DM Sans','Helvetica Neue',sans-serif", color:T.text0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:${T.bg0}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
        input,select,textarea,button{font-family:inherit}
        button{outline:none}
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:sidebarCollapsed?62:220, flexShrink:0, borderRight:`1px solid ${T.border}`, background:T.bg0, display:"flex", flexDirection:"column", transition:"width .22s ease", overflow:"hidden" }}>
        {/* Logo */}
        <div style={{ height:56, display:"flex", alignItems:"center", gap:10, padding:sidebarCollapsed?"0 16px":"0 16px", borderBottom:`1px solid ${T.border}`, flexShrink:0, overflow:"hidden" }}>
          <div style={{ width:30, height:30, background:"linear-gradient(135deg,#C9AA71,#E07A72)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0, fontWeight:900 }}>⬡</div>
          {!sidebarCollapsed && (
            <div style={{ overflow:"hidden" }}>
              <div style={{ fontSize:13, fontWeight:800, letterSpacing:"0.04em", color:T.text0, whiteSpace:"nowrap" }}>Ontario Deals AI</div>
              <div style={{ fontSize:9, color:T.text2, letterSpacing:"0.12em", whiteSpace:"nowrap" }}>DASHBOARD v1.0</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex:1, padding:"10px 8px" }}>
          {NAV.map(n=>{
            const isActive = module===n.id;
            return (
              <div key={n.id} onClick={()=>setModule(n.id)}
                style={{ display:"flex", alignItems:"center", gap:10, padding:`10px ${sidebarCollapsed?"0":"10px"}`, paddingLeft:sidebarCollapsed?14:10, borderRadius:10, cursor:"pointer", marginBottom:3,
                  background:isActive?n.color+"14":"transparent", borderLeft:`2px solid ${isActive?n.color:"transparent"}`,
                  color:isActive?n.color:T.text2, transition:"all .15s", overflow:"hidden" }}
                onMouseEnter={e=>{ if(!isActive){ e.currentTarget.style.background=T.bg2; e.currentTarget.style.color=T.text1; } }}
                onMouseLeave={e=>{ if(!isActive){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.text2; } }}>
                <span style={{ fontSize:17, flexShrink:0 }}>{n.icon}</span>
                {!sidebarCollapsed && (
                  <div style={{ overflow:"hidden" }}>
                    <div style={{ fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>{n.label}</div>
                    <div style={{ fontSize:10, color:isActive?n.color+"99":T.text2, whiteSpace:"nowrap", marginTop:1 }}>{n.sub}</div>
                  </div>
                )}
                {!sidebarCollapsed && n.id==="leads" && leadCount>0 && (
                  <span style={{ marginLeft:"auto", background:T.red, color:"#fff", borderRadius:20, fontSize:9, fontWeight:800, padding:"2px 7px", flexShrink:0 }}>{leadCount}</span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Collapse toggle + user */}
        <div style={{ padding:"10px 8px", borderTop:`1px solid ${T.border}`, flexShrink:0 }}>
          {!sidebarCollapsed && (
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", marginBottom:6 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#C9AA71,#9A7D4A)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#07090E", flexShrink:0 }}>G</div>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:T.text0 }}>Gurashish</div>
                <div style={{ fontSize:10, color:T.text2 }}>Agent · Ottawa</div>
              </div>
            </div>
          )}
          <button onClick={()=>setSidebarCollapsed(p=>!p)}
            style={{ width:"100%", padding:"7px 0", background:"none", border:`1px solid ${T.border}`, borderRadius:8, color:T.text2, cursor:"pointer", fontSize:13, transition:"all .13s" }}
            onMouseEnter={e=>{e.currentTarget.style.background=T.bg2;e.currentTarget.style.color=T.text1;}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=T.text2;}}>
            {sidebarCollapsed?"→":"←"}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Top bar */}
        <header style={{ height:56, borderBottom:`1px solid ${T.border}`, background:T.bg0, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 22px", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:16, color:active?.color }}>{active?.icon}</span>
            <span style={{ fontSize:16, fontWeight:700, color:T.text0 }}>{active?.label}</span>
            <span style={{ fontSize:11, color:T.text2, paddingLeft:10, borderLeft:`1px solid ${T.border}`, marginLeft:4 }}>{active?.sub}</span>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:T.green, boxShadow:`0 0 6px ${T.green}` }} />
            <span style={{ fontSize:11, color:T.green }}>Live</span>
            <div style={{ width:1, height:16, background:T.border, margin:"0 4px" }} />
            <span style={{ fontSize:11, color:T.text2 }}>Ontario Deals AI v1.0</span>
          </div>
        </header>

        {/* Module content */}
        <div style={{ flex:1, overflow:"hidden" }}>
          {module==="leads"     && <LeadsModule />}
          {module==="content"   && <ContentModule />}
          {module==="analytics" && <AnalyticsModule />}
        </div>
      </div>
    </div>
  );
}
