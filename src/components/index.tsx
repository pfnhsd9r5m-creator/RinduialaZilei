import { useState, useEffect, useRef, useMemo } from "react";

const MO=['Ian','Feb','Mar','Apr','Mai','Iun','Iul','Aug','Sep','Oct','Nov','Dec'];
const MOFULL=['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
const ZI=['Duminică','Luni','Marți','Miercuri','Joi','Vineri','Sâmbătă'];
function jd(){const j=new Date(new Date().getTime()-13*864e5);return{day:j.getDate(),month:MOFULL[j.getMonth()],mon:j.getMonth()+1,year:j.getFullYear(),dow:ZI[j.getDay()],dowNum:j.getDay()};}
const JD=jd();

const GOLD="linear-gradient(135deg,#8B6914,#C9A227,#FFD700,#FFF0A0,#FFD700,#C9A227,#8B6914)";
const CSS=`
@keyframes gs{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes hg{0%,100%{opacity:.6}50%{opacity:1;filter:drop-shadow(0 0 8px rgba(255,215,0,.7))}}
@keyframes ff{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes wp{0%,100%{opacity:.3}50%{opacity:.7}}
@keyframes pr{0%{transform:translateY(100vh);opacity:0}15%{opacity:1}85%{opacity:.5}100%{transform:translateY(-50px);opacity:0}}
@keyframes st{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
@keyframes rot{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes sb{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
`;

const LC_MAP={
  0:{bg:"linear-gradient(160deg,#FFFAEB,#FFF4C8,#FFF8E0)",ac:"#B8860B"},
  1:{bg:"linear-gradient(160deg,#FFF8F0,#FFE8D0,#FFF5E8)",ac:"#C06010"},
  2:{bg:"linear-gradient(160deg,#F0F4FF,#E0EAFF,#F0F8FF)",ac:"#2050B0"},
  3:{bg:"linear-gradient(160deg,#FFF0F0,#FFE0E0,#FFF4F4)",ac:"#A01820"},
  4:{bg:"linear-gradient(160deg,#FFFFF0,#FFFCE0,#FFFFF5)",ac:"#808000"},
  5:{bg:"linear-gradient(160deg,#F5FFF0,#E8FFE0,#F5FFEE)",ac:"#1A7030"},
  6:{bg:"linear-gradient(160deg,#F8F0FF,#EEE0FF,#F8F5FF)",ac:"#6030A0"},
};
const LC=LC_MAP[JD.dowNum]||LC_MAP[0];

function getFast(){
  const d=JD.dowNum;
  if(d===3)return{icon:"🌿",label:"Post — Miercuri",color:"#8B0000",desc:"Fără carne, pește, lactate, vin."};
  if(d===5)return{icon:"🌿",label:"Post — Vineri",color:"#8B0000",desc:"Post în amintirea Răstignirii."};
  if(d===0)return{icon:"✦",label:"Duminică — Dezlegare deplină",color:"#1B5E20",desc:"Zi de sărbătoare. Dezlegare la toate."};
  return{icon:"✝",label:"Zi obișnuită",color:"#1A4A8B",desc:"Fără post special."};
}
const FAST=getFast();

function getFastLevel(day,month,dow){
  const inNat=(month===11&&day>=15)||month===12||(month===1&&day<=5);
  const inDorm=month===8&&day<=14;
  const inAp=month===6&&day>=10&&day<=29;
  const major=inNat||inDorm||inAp;
  const wf=dow===3||dow===5;
  if(dow===0&&!major)return"sun";
  if(major&&wf)return"strict";
  if(major)return"fp";
  if(wf)return"wf";
  return"ok";
}
const FLC={
  sun:{bg:"rgba(255,215,0,0.14)",br:"rgba(212,175,55,0.4)",icon:"🌟",txt:"Duminică",c:"#8B6900"},
  ok:{bg:"rgba(255,252,235,0.7)",br:"rgba(212,175,55,0.2)",icon:"🥩",txt:"Dezlegare",c:"rgba(80,50,0,0.6)"},
  wf:{bg:"rgba(200,30,30,0.08)",br:"rgba(180,30,30,0.25)",icon:"🌿",txt:"Post",c:"#8B0000"},
  fp:{bg:"rgba(200,100,30,0.08)",br:"rgba(180,80,20,0.2)",icon:"🐟",txt:"Post-pește",c:"#C05010"},
  strict:{bg:"rgba(139,0,0,0.12)",br:"rgba(139,0,0,0.3)",icon:"💧",txt:"Post aspru",c:"#6B0000"},
};

async function ask(p,s){
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,system:s||"JSON valid, fără backtick-uri.",messages:[{role:"user",content:p}]})});
  const d=await r.json();
  const t=d.content?.find(b=>b.type==="text")?.text||"";
  return JSON.parse(t.replace(/```[\w]*|```/g,"").trim());
}

// ─── SVG Components ───────────────────────────────────────────────────────────
function Cross({size=24,color="#D4AF37",glow=false,sh=false}){
  const id="cg"+Math.round(size);
  const f=sh?"url(#"+id+")":color;
  return(
    <svg width={size} height={Math.round(size*1.3)} viewBox="0 0 100 130" fill="none" style={glow?{filter:"drop-shadow(0 0 5px "+color+") drop-shadow(0 0 10px "+color+"88)"}:{}}>
      {sh&&<defs><linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8B6914"/><stop offset="50%" stopColor="#FFD700"/><stop offset="100%" stopColor="#8B6914"/></linearGradient></defs>}
      <rect x="44" y="4" width="12" height="114" rx="3" fill={f}/>
      <rect x="30" y="10" width="40" height="10" rx="2.5" fill={f}/>
      <rect x="7" y="36" width="86" height="12" rx="3" fill={f}/>
      <path d="M22 106 L50 94 L78 106" stroke={f} strokeWidth="10" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function GT({children,size="1rem",style={}}){
  return <span style={{background:GOLD,backgroundSize:"200% 200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gs 4s ease-in-out infinite",fontSize:size,fontFamily:"'Cinzel',serif",fontWeight:700,...style}}>{children}</span>;
}
function GB({children,onClick,style={}}){
  return <button onClick={onClick} style={{background:GOLD,backgroundSize:"300% 300%",animation:"gs 4s ease-in-out infinite",border:"none",borderRadius:22,padding:"9px 24px",cursor:"pointer",color:"#3A2000",fontFamily:"'Cinzel',serif",fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.1em",boxShadow:"0 4px 14px rgba(180,130,0,0.35)",...style}}>{children}</button>;
}
function BB({children,onClick}){
  return <button onClick={onClick} style={{background:"rgba(255,248,220,0.85)",border:"1px solid "+LC.ac+"55",borderRadius:18,padding:"5px 16px",color:LC.ac,cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.72rem"}}>{children}</button>;
}
function Dv(){
  return <div style={{display:"flex",alignItems:"center",gap:"0.4rem",margin:"0.6rem 0"}}>
    <div style={{flex:1,height:1,background:"linear-gradient(to right,transparent,"+LC.ac+"55"}}/>
    <Cross size={9} color={LC.ac}/>
    <div style={{flex:1,height:1,background:"linear-gradient(to left,transparent,"+LC.ac+"55"}}/>
  </div>;
}
function Sp({text="Se încarcă..."}){
  const [d,setD]=useState("");
  useEffect(()=>{const t=setInterval(()=>setD(x=>x.length>=3?"":x+"."),500);return()=>clearInterval(t);},[]);
  return <div style={{textAlign:"center",padding:"3rem 1rem"}}>
    <div style={{display:"inline-block",animation:"hg 2.5s ease-in-out infinite",marginBottom:"0.8rem"}}><Cross size={34} color="#D4AF37" glow sh/></div>
    <p style={{color:LC.ac,fontStyle:"italic",fontFamily:"'EB Garamond',serif",fontSize:"0.9rem",opacity:0.65}}>{text}{d}</p>
  </div>;
}
function Fd({children,delay=0}){
  const [v,setV]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setV(true),delay);return()=>clearTimeout(t);},[delay]);
  return <div style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(10px)",transition:"all 0.5s cubic-bezier(.22,1,.36,1)"}}>{children}</div>;
}
function GC(extra){
  return{background:"rgba(255,252,240,0.93)",backdropFilter:"blur(10px)",border:"2px solid transparent",backgroundImage:"linear-gradient(rgba(255,252,240,0.93),rgba(255,252,240,0.93)),"+GOLD,backgroundOrigin:"border-box",backgroundClip:"padding-box,border-box",backgroundSize:"auto,300% 300%",animation:"sb 4s ease-in-out infinite",borderRadius:14,boxShadow:"0 2px 8px rgba(180,130,0,0.18),0 8px 20px rgba(180,130,0,0.09),inset 0 1px 0 rgba(255,255,255,0.9)",...extra};
}

function Particles(){
  const pts=useMemo(()=>Array.from({length:22},(_,i)=>({id:i,x:Math.random()*100,s:Math.random()*3+1,dur:Math.random()*8+7,del:Math.random()*12})),[]);
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden",zIndex:0}}>
    {pts.map(p=><div key={p.id} style={{position:"absolute",bottom:0,left:p.x+"%",width:p.s,height:p.s,borderRadius:"50%",background:"radial-gradient(circle,#FFD700,#D4AF37)",animation:"pr "+p.dur+"s "+p.del+"s ease-in-out infinite",boxShadow:"0 0 "+(p.s*3)+"px rgba(255,215,0,0.3)"}}/>)}
  </div>;
}

function Trinity({size=180}){
  return(
    <svg width={size} height={size} viewBox="0 0 220 220" fill="none">
      <defs><radialGradient id="tg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFD700" stopOpacity="0.18"/><stop offset="100%" stopColor="#D4AF37" stopOpacity="0"/></radialGradient></defs>
      <ellipse cx="110" cy="115" rx="102" ry="102" fill="url(#tg)"/>
      {Array.from({length:16},(_,i)=><line key={i} x1="110" y1="115" x2={110+112*Math.cos((i*22.5-90)*Math.PI/180)} y2={115+112*Math.sin((i*22.5-90)*Math.PI/180)} stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.06"/>)}
      <g style={{animation:"ff 4.2s ease-in-out infinite",transformOrigin:"110px 52px"}}>
        <circle cx="110" cy="42" r="21" stroke="#D4AF37" strokeWidth="1.8" fill="rgba(255,215,0,0.09)" style={{animation:"hg 3s infinite"}}/>
        <line x1="110" y1="25" x2="110" y2="59" stroke="#D4AF37" strokeWidth="1.2" strokeOpacity="0.6"/>
        <line x1="94" y1="42" x2="126" y2="42" stroke="#D4AF37" strokeWidth="1.2" strokeOpacity="0.6"/>
        <line x1="100" y1="36" x2="120" y2="36" stroke="#D4AF37" strokeWidth="0.7" strokeOpacity="0.3"/>
        <circle cx="110" cy="42" r="10" fill="rgba(255,235,200,0.45)"/>
        <path d="M99 60 Q110 54 121 60 L126 98 Q110 106 94 98 Z" fill="rgba(40,80,180,0.27)" stroke="rgba(70,110,210,0.45)" strokeWidth="1"/>
        <path d="M99 68 Q79 50 67 64 Q75 76 96 74" fill="rgba(255,215,0,0.17)" stroke="#D4AF37" strokeWidth="0.9" style={{animation:"wp 3.5s infinite"}}/>
        <path d="M121 68 Q141 50 153 64 Q145 76 124 74" fill="rgba(255,215,0,0.17)" stroke="#D4AF37" strokeWidth="0.9" style={{animation:"wp 3.5s infinite .5s"}}/>
        <line x1="110" y1="76" x2="110" y2="98" stroke="#D4AF37" strokeWidth="1.4" strokeOpacity="0.6"/>
        <circle cx="110" cy="74" r="3" fill="#D4AF37" opacity="0.8"/>
      </g>
      <g style={{animation:"ff 4.8s ease-in-out infinite .9s",transformOrigin:"65px 150px"}}>
        <circle cx="65" cy="147" r="18" stroke="#D4AF37" strokeWidth="1.8" fill="rgba(255,215,0,0.08)" style={{animation:"hg 3.5s infinite .5s"}}/>
        <line x1="65" y1="133" x2="65" y2="161" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.6"/>
        <line x1="51" y1="147" x2="79" y2="147" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.6"/>
        <circle cx="65" cy="147" r="9" fill="rgba(255,235,200,0.4)"/>
        <path d="M55 163 Q65 157 75 163 L79 194 Q65 201 51 194 Z" fill="rgba(100,30,150,0.23)" stroke="rgba(130,50,180,0.4)" strokeWidth="1"/>
        <path d="M55 170 Q37 158 28 170 Q35 180 52 179" fill="rgba(255,215,0,0.16)" stroke="#D4AF37" strokeWidth="0.9" style={{animation:"wp 4s infinite .8s"}}/>
        <path d="M75 170 Q93 158 102 170 Q95 180 78 179" fill="rgba(255,215,0,0.16)" stroke="#D4AF37" strokeWidth="0.9" style={{animation:"wp 4s infinite 1.3s"}}/>
        <line x1="65" y1="181" x2="65" y2="196" stroke="#D4AF37" strokeWidth="1.3" strokeOpacity="0.6"/>
        <circle cx="65" cy="179" r="2.8" fill="#D4AF37" opacity="0.7"/>
      </g>
      <g style={{animation:"ff 4.4s ease-in-out infinite 1.6s",transformOrigin:"155px 150px"}}>
        <circle cx="155" cy="147" r="18" stroke="#D4AF37" strokeWidth="1.8" fill="rgba(255,215,0,0.08)" style={{animation:"hg 3.2s infinite 1s"}}/>
        <line x1="155" y1="133" x2="155" y2="161" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.6"/>
        <line x1="141" y1="147" x2="169" y2="147" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.6"/>
        <circle cx="155" cy="147" r="9" fill="rgba(255,235,200,0.4)"/>
        <path d="M145 163 Q155 157 165 163 L169 194 Q155 201 141 194 Z" fill="rgba(30,110,60,0.23)" stroke="rgba(50,140,80,0.4)" strokeWidth="1"/>
        <path d="M145 170 Q127 158 118 170 Q125 180 142 179" fill="rgba(255,215,0,0.16)" stroke="#D4AF37" strokeWidth="0.9" style={{animation:"wp 3.8s infinite 1.5s"}}/>
        <path d="M165 170 Q183 158 192 170 Q185 180 168 179" fill="rgba(255,215,0,0.16)" stroke="#D4AF37" strokeWidth="0.9" style={{animation:"wp 3.8s infinite 2s"}}/>
        <line x1="155" y1="181" x2="155" y2="196" stroke="#D4AF37" strokeWidth="1.3" strokeOpacity="0.6"/>
        <circle cx="155" cy="179" r="2.8" fill="#D4AF37" opacity="0.7"/>
      </g>
      <g style={{animation:"ff 3s ease-in-out infinite 0.5s",transformOrigin:"110px 170px"}}>
        <rect x="96" y="158" width="28" height="5" rx="2" fill="#D4AF37" opacity="0.65"/>
        <path d="M104 163 Q110 174 116 163" stroke="#D4AF37" strokeWidth="1.8" fill="rgba(212,175,55,0.25)"/>
        <line x1="110" y1="174" x2="110" y2="184" stroke="#D4AF37" strokeWidth="1.8" strokeOpacity="0.8"/>
        <rect x="106" y="184" width="8" height="3" rx="1.5" fill="#D4AF37" opacity="0.7"/>
      </g>
      {[[110,13],[30,80],[190,80]].map(([x,y],i)=>(
        <text key={i} x={x} y={y} fontSize="7" fill="#FFD700" textAnchor="middle" opacity="0.5" style={{animation:"st "+(2+i*0.5)+"s ease-in-out infinite "+(i*0.7)+"s"}}>✦</text>
      ))}
    </svg>
  );
}

function Theotokos({size=65}){
  return(
    <svg width={size} height={Math.round(size*1.15)} viewBox="0 0 150 175" fill="none">
      <ellipse cx="75" cy="70" rx="62" ry="58" stroke="rgba(64,128,255,0.2)" strokeWidth="0.8" fill="rgba(64,128,255,0.05)"/>
      <circle cx="75" cy="50" r="26" stroke="#D4AF37" strokeWidth="1.8" fill="rgba(255,215,0,0.08)" style={{animation:"hg 3.5s infinite"}}/>
      <line x1="75" y1="28" x2="75" y2="72" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="53" y1="50" x2="97" y2="50" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="60" y1="43" x2="90" y2="43" stroke="#D4AF37" strokeWidth="0.7" strokeOpacity="0.3"/>
      <ellipse cx="75" cy="47" rx="15" ry="17" fill="rgba(255,225,185,0.5)"/>
      <path d="M37 55 Q54 36 75 33 Q96 36 113 55 L118 135 Q75 150 32 135 Z" fill="rgba(20,60,160,0.27)" stroke="rgba(40,80,200,0.45)" strokeWidth="1"/>
      <path d="M37 55 Q54 36 75 33 Q96 36 113 55" stroke="#D4AF37" strokeWidth="1.8" fill="none" strokeOpacity="0.75"/>
      <path d="M60 70 Q75 64 90 70 L93 135 Q75 142 57 135 Z" fill="rgba(155,28,28,0.18)"/>
      <text x="75" y="36" textAnchor="middle" fontSize="10" fill="#FFD700" style={{animation:"st 2.5s infinite"}}>✦</text>
      <text x="44" y="70" textAnchor="middle" fontSize="8" fill="#FFD700" style={{animation:"st 2.8s infinite .6s"}}>✦</text>
      <text x="106" y="70" textAnchor="middle" fontSize="8" fill="#FFD700" style={{animation:"st 3s infinite 1.1s"}}>✦</text>
      <text x="44" y="67" fontSize="8" fontFamily="serif" fill="#D4AF37" opacity="0.7" fontWeight="bold">ΜΡ</text>
      <text x="97" y="67" fontSize="8" fontFamily="serif" fill="#D4AF37" opacity="0.7" fontWeight="bold">ΘΥ</text>
      <text x="75" y="165" textAnchor="middle" fontSize="7.5" fontFamily="'Cinzel',serif" fill="rgba(20,50,150,0.55)" letterSpacing="2">MAICA DOMNULUI</text>
    </svg>
  );
}

function CalMonth(){
  const [yr,setYr]=useState(JD.year);
  const [mo,setMo]=useState(JD.mon);
  const [sel,setSel]=useState(null);
  const dim=(y,m)=>{if(m===2)return y%4===0?29:28;return[31,28,31,30,31,30,31,31,30,31,30,31][m-1];};
  const fdo=(y,m)=>new Date(y,m-1,1).getDay();
  const days=dim(yr,mo),start=fdo(yr,mo);
  const cells=[...Array(start).fill(null),...Array.from({length:days},(_,i)=>i+1)];
  const getDow=d=>((start+d-1)%7);
  const isToday=d=>d===JD.day&&mo===JD.mon&&yr===JD.year;
  const si=sel?FLC[getFastLevel(sel,mo,getDow(sel))]:null;
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.7rem"}}>
        <button onClick={()=>mo===1?(setMo(12),setYr(y=>y-1)):setMo(m=>m-1)} style={{background:"none",border:"1px solid "+LC.ac+"44",borderRadius:8,padding:"4px 11px",cursor:"pointer",color:LC.ac,fontFamily:"'Cinzel',serif",fontSize:"0.75rem"}}>‹</button>
        <GT size="0.82rem" style={{letterSpacing:"0.1em"}}>{MOFULL[mo-1].toUpperCase()} {yr}</GT>
        <button onClick={()=>mo===12?(setMo(1),setYr(y=>y+1)):setMo(m=>m+1)} style={{background:"none",border:"1px solid "+LC.ac+"44",borderRadius:8,padding:"4px 11px",cursor:"pointer",color:LC.ac,fontFamily:"'Cinzel',serif",fontSize:"0.75rem"}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"2px",marginBottom:"3px"}}>
        {["D","L","M","M","J","V","S"].map((z,i)=>(
          <div key={i} style={{textAlign:"center",fontSize:"0.58rem",fontFamily:"'Cinzel',serif",fontWeight:600,color:i===0?"#B8860B":i===3||i===5?"#8B0000":"rgba(80,50,0,0.45)",padding:"2px 0"}}>{z}</div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"3px"}}>
        {cells.map((d,i)=>{
          if(!d)return <div key={i}/>;
          const dw=getDow(d),lv=getFastLevel(d,mo,dw),fl=FLC[lv];
          const tod=isToday(d),isSel=sel===d;
          return(
            <button key={i} onClick={()=>setSel(isSel?null:d)} style={{background:isSel?GOLD:fl.bg,backgroundSize:isSel?"300% 300%":"auto",animation:isSel?"gs 3s ease-in-out infinite":"none",border:"1.5px solid "+(isSel?"transparent":tod?LC.ac:fl.br),borderRadius:7,padding:"4px 2px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"1px",outline:tod?"2px solid "+LC.ac:isSel?"2px solid #D4AF37":"none",outlineOffset:"1px"}}>
              <span style={{fontSize:"0.68rem",fontFamily:"'Cinzel',serif",fontWeight:tod?700:400,color:isSel?"#3A2000":fl.c}}>{d}</span>
              <span style={{fontSize:"0.55rem",lineHeight:1}}>{fl.icon}</span>
            </button>
          );
        })}
      </div>
      {sel&&si&&(
        <div style={{marginTop:"0.6rem",padding:"0.55rem 0.8rem",borderRadius:9,background:si.bg,border:"1px solid "+si.br,display:"flex",alignItems:"center",gap:"0.5rem"}}>
          <span style={{fontSize:"1.1rem"}}>{si.icon}</span>
          <div style={{fontSize:"0.7rem",fontFamily:"'Cinzel',serif",fontWeight:700,color:si.c}}>{sel} {MOFULL[mo-1]} — {si.txt}</div>
        </div>
      )}
      <div style={{marginTop:"0.55rem",display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>
        {Object.entries(FLC).map(([k,v])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:"2px",padding:"2px 6px",borderRadius:7,background:v.bg,border:"1px solid "+v.br}}>
            <span style={{fontSize:"0.6rem"}}>{v.icon}</span>
            <span style={{fontSize:"0.54rem",color:v.c,fontFamily:"'EB Garamond',serif"}}>{v.txt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SCREENS ───────────────────────────────────────────────────────────────────
function S1(){
  const [data,setData]=useState(null);
  const [load,setLoad]=useState(false);
  const [err,setErr]=useState(null);
  const [cop,setCop]=useState(false);
  const go=async()=>{
    setLoad(true);setErr(null);setData(null);
    try{
      const d=await ask("Rânduiala ortodoxă "+JD.day+" "+JD.month+" "+JD.year+" stil vechi, "+JD.dow+".","Expert calendar ortodox. JSON:{\"evanghelia\":{\"referinta\":\"\",\"titlu\":\"\",\"rezumat\":\"\"},\"apostolul\":{\"referinta\":\"\",\"titlu\":\"\",\"rezumat\":\"\"},\"sinaxar\":{\"sfinti\":[],\"descriere\":\"\"},\"fapte\":[]}");
      setData(d);
    }catch{setErr("Eroare. Încearcă din nou.");}
    setLoad(false);
  };
  useEffect(()=>{go();},[]);
  const share=txt=>{
    const m="✝ "+JD.day+" "+JD.month+" "+JD.year+" (Stil Vechi)\n\n"+txt+"\n\n— Rânduiala Zilei";
    if(navigator.share)navigator.share({text:m});
    else{navigator.clipboard?.writeText(m);setCop(true);setTimeout(()=>setCop(false),2000);}
  };
  if(load)return <Sp/>;
  if(err)return <div style={{textAlign:"center",padding:"3rem"}}><p style={{color:LC.ac,fontStyle:"italic",marginBottom:"1rem"}}>{err}</p><GB onClick={go}>Reîncearcă</GB></div>;
  if(!data)return null;
  return(
    <div style={{padding:"0 0 2rem"}}>
      <Fd delay={0}><div style={{margin:"0.75rem 1rem 0",padding:"0.55rem 0.9rem",borderRadius:10,background:FAST.color+"15",border:"1px solid "+FAST.color+"33",display:"flex",alignItems:"center",gap:"0.55rem"}}>
        <span style={{fontSize:"1rem"}}>{FAST.icon}</span>
        <div><div style={{fontSize:"0.7rem",fontFamily:"'Cinzel',serif",fontWeight:700,color:FAST.color}}>{FAST.label}</div><div style={{fontSize:"0.7rem",color:"rgba(40,20,0,0.55)",fontFamily:"'EB Garamond',serif"}}>{FAST.desc}</div></div>
      </div></Fd>
      <Fd delay={60}><div style={{margin:"0.7rem 1rem 0",...GC(),padding:0,overflow:"hidden"}}>
        <div style={{textAlign:"center",padding:"1.1rem 1rem 0.3rem",background:"linear-gradient(160deg,rgba(255,252,230,0.95),rgba(255,244,190,0.85))"}}>
          <Trinity size={178}/><div style={{marginTop:"-0.4rem",marginBottom:"0.4rem"}}><GT size="0.65rem" style={{letterSpacing:"0.2em"}}>✦ SFÂNTA TREIME ✦</GT></div>
        </div>
        <div style={{padding:"0 1.1rem 1rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.45rem",marginBottom:"0.4rem"}}><Cross size={12} color="#8B0000"/><span style={{fontSize:"0.52rem",letterSpacing:"0.2em",color:"#8B0000",fontFamily:"'Cinzel',serif",fontWeight:600}}>EVANGHELIA ZILEI</span><span style={{marginLeft:"auto",fontSize:"0.68rem",color:"rgba(80,40,0,0.4)",fontStyle:"italic",fontFamily:"'EB Garamond',serif"}}>{data.evanghelia?.referinta}</span></div>
          <div style={{fontSize:"0.96rem",fontFamily:"'Cinzel',serif",color:"#5A0A0A",fontWeight:700,marginBottom:"0.45rem"}}>{data.evanghelia?.titlu}</div>
          <Dv/><p style={{fontSize:"0.91rem",lineHeight:1.85,color:"rgba(40,20,0,0.82)",fontFamily:"'EB Garamond',serif",margin:"0 0 0.6rem"}}>{data.evanghelia?.rezumat}</p>
          <button onClick={()=>share(data.evanghelia?.titlu+"\n\n"+data.evanghelia?.rezumat)} style={{background:"rgba(139,0,0,0.08)",border:"1px solid rgba(139,0,0,0.2)",borderRadius:18,padding:"4px 13px",fontSize:"0.68rem",color:"#8B0000",cursor:"pointer",fontFamily:"'Cinzel',serif"}}>{cop?"✓ Copiat!":"↑ Distribuie"}</button>
        </div>
      </div></Fd>
      <Fd delay={170}><div style={{margin:"0.65rem 1rem 0",...GC(),padding:0,overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",padding:"0.8rem 1rem",gap:"0.8rem",background:"linear-gradient(160deg,rgba(240,245,255,0.92),rgba(220,235,255,0.82))"}}>
          <div style={{flexShrink:0}}><Theotokos size={65}/></div>
          <div style={{flex:1}}>
            <div style={{fontSize:"0.52rem",letterSpacing:"0.18em",color:"#2050B0",fontFamily:"'Cinzel',serif",fontWeight:700,marginBottom:"2px"}}>APOSTOLUL ZILEI</div>
            <div style={{fontSize:"0.68rem",color:"rgba(10,40,120,0.4)",fontStyle:"italic",fontFamily:"'EB Garamond',serif",marginBottom:"3px"}}>{data.apostolul?.referinta}</div>
            <div style={{fontSize:"0.88rem",fontFamily:"'Cinzel',serif",color:"#0A2878",fontWeight:600,marginBottom:"0.25rem"}}>{data.apostolul?.titlu}</div>
            <p style={{fontSize:"0.83rem",lineHeight:1.7,color:"rgba(10,40,100,0.7)",fontFamily:"'EB Garamond',serif",margin:0}}>{data.apostolul?.rezumat}</p>
          </div>
        </div>
      </div></Fd>
      <Fd delay={280}><div style={{margin:"0.65rem 1rem 0",...GC(),padding:"0.95rem 1.1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.55rem"}}><Cross size={11} color="#D4AF37" sh/><GT size="0.52rem" style={{letterSpacing:"0.18em"}}>SINAXARUL ZILEI</GT></div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem",marginBottom:"0.55rem"}}>
          {data.sinaxar?.sfinti?.map((s,i)=><span key={i} style={{fontSize:"0.68rem",padding:"3px 10px",borderRadius:18,border:"2px solid transparent",backgroundImage:"linear-gradient(rgba(255,252,240,1),rgba(255,252,240,1)),"+GOLD,backgroundOrigin:"border-box",backgroundClip:"padding-box,border-box",backgroundSize:"auto,300% 300%",animation:"sb 4s ease-in-out infinite",color:"#5A3600",fontFamily:"'EB Garamond',serif"}}>{s}</span>)}
        </div>
        <Dv/><p style={{fontSize:"0.88rem",lineHeight:1.8,color:"rgba(40,20,0,0.77)",fontFamily:"'EB Garamond',serif",margin:0}}>{data.sinaxar?.descriere}</p>
      </div></Fd>
      <Fd delay={390}><div style={{margin:"0.65rem 1rem 0",...GC(),padding:"0.95rem 1.1rem",background:"rgba(240,255,244,0.9)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.55rem"}}><span style={{color:"#1B5E20",fontSize:"0.8rem"}}>⧖</span><span style={{fontSize:"0.52rem",letterSpacing:"0.18em",color:"#1B5E20",fontFamily:"'Cinzel',serif",fontWeight:600}}>FAPTE ISTORICE</span></div>
        {data.fapte?.map((f,i)=><div key={i} style={{display:"flex",gap:"0.45rem",marginBottom:"0.4rem",alignItems:"flex-start"}}><span style={{color:"#2E7D32",fontSize:"0.66rem",marginTop:"0.2rem",flexShrink:0}}>◈</span><span style={{fontSize:"0.86rem",lineHeight:1.7,color:"rgba(10,40,10,0.74)",fontFamily:"'EB Garamond',serif"}}>{f}</span></div>)}
      </div></Fd>
      <div style={{textAlign:"center",marginTop:"1rem"}}><GB onClick={go}>✝ Reîmprospătare</GB></div>
    </div>
  );
}

function S2(){
  const [view,setView]=useState("menu");
  const [sel,setSel]=useState(null);
  const [text,setText]=useState(null);
  const [load,setLoad]=useState(false);
  const [lang,setLang]=useState("ro");
  const CATS=[
    {id:"dimineata",title:"Rugăciuni de dimineață",icon:"🌅",color:"#B8860B"},
    {id:"seara",title:"Rugăciuni de seară",icon:"🌙",color:"#2050B0"},
    {id:"masa",title:"Rugăciuni la masă",icon:"🍞",color:"#2E7D32"},
    {id:"spovedanie",title:"Ghid pentru Spovedanie",icon:"🙏",color:"#6B0000"},
    {id:"inainte",title:"Rugăciuni înainte de Împărtășanie",icon:"✝",color:"#8B0000"},
    {id:"dupa",title:"Rugăciuni după Împărtășanie",icon:"☩",color:"#1A5E20"},
    {id:"canon",title:"Canonul de Pocăință",icon:"🕊",color:"#4A3000"},
    {id:"calatorie",title:"Rugăciune pentru călătorie",icon:"✈",color:"#6B3FA0"},
    {id:"sanatate",title:"Rugăciune pentru sănătate",icon:"❤",color:"#C41E3A"},
  ];
  const ACAT=[
    {id:"maica",title:"Acatistul Maicii Domnului",sub:"Imnul Acatist",icon:"🌹"},
    {id:"isus",title:"Acatistul Domnului Iisus",sub:"Iisus Hristos",icon:"✝"},
    {id:"nicolae",title:"Acatistul Sf. Nicolae",sub:"Arhiepiscop al Mirelor Lichiei",icon:"⭐"},
    {id:"treime",title:"Acatistul Sfintei Treimi",sub:"Preasfânta Treime",icon:"☩"},
    {id:"paraclis",title:"Paraclisul Maicii Domnului",sub:"Canon de rugăciune",icon:"🕯"},
  ];
  const LN={"ro":"română literară ortodoxă","ru":"rusă bisericească","fr":"franceză ortodoxă"};
  const open=async item=>{
    setSel(item);setView("read");setText(null);setLoad(true);
    try{
      const ln=LN[lang];
      let pr="";
      if(item.id==="spovedanie")pr="Ghid complet ortodox pentru Spovedanie în "+ln+". Cuprins: 1)Ce este Spovedania 2)Pregătire 3)Examinarea conștiinței 4)Rugăciunea înainte 5)Cum te mărturisești. JSON:{\"titlu\":\"Ghid Spovedanie\",\"sectiuni\":[{\"titlu\":\"\",\"text\":\"\"}]}";
      else if(item.id==="inainte")pr="Rugăciunile ortodoxe complete de pregătire înainte de Sfânta Împărtășanie în "+ln+" (cu regulile de post — 3 zile). JSON:{\"titlu\":\"Rugăciuni înainte de Împărtășanie\",\"sectiuni\":[{\"titlu\":\"\",\"text\":\"\"}]}";
      else if(item.id==="dupa")pr="Rugăciunile ortodoxe de mulțumire după Sfânta Împărtășanie în "+ln+". JSON:{\"titlu\":\"Rugăciuni după Împărtășanie\",\"sectiuni\":[{\"titlu\":\"\",\"text\":\"\"}]}";
      else if(item.id==="canon")pr="Canonul de Pocăință al Sfântului Andrei de Creta (versiune accesibilă) în "+ln+". JSON:{\"titlu\":\"Canonul de Pocăință\",\"sectiuni\":[{\"titlu\":\"\",\"text\":\"\"}]}";
      else pr="Textul complet al \""+item.title+"\" în "+ln+". JSON:{\"titlu\":\""+item.title+"\",\"sectiuni\":[{\"titlu\":\"\",\"text\":\"\"}]}";
      const d=await ask(pr,"Teolog ortodox. JSON exact fără altceva: {\"titlu\":\"\",\"sectiuni\":[{\"titlu\":\"\",\"text\":\"\"}]}");
      setText(d);
    }catch{setText({titlu:item.title,sectiuni:[{titlu:"",text:"Eroare. Încearcă din nou."}]});}
    setLoad(false);
  };
  if(view==="read")return(
    <div style={{padding:"0 0 3rem"}}>
      <div style={{padding:"1rem 1rem 0",display:"flex",alignItems:"center",gap:"0.7rem"}}>
        <BB onClick={()=>{setView("menu");setText(null);}}>← Înapoi</BB>
        <div style={{display:"flex",gap:"0.4rem",marginLeft:"auto"}}>
          {["ro","ru","fr"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"4px 9px",borderRadius:10,fontSize:"0.67rem",cursor:"pointer",background:lang===l?GOLD:"rgba(255,248,220,0.7)",backgroundSize:"300% 300%",animation:lang===l?"gs 4s ease-in-out infinite":"none",border:"1px solid "+(lang===l?"transparent":LC.ac+"33"),color:lang===l?"#3A2000":LC.ac,fontFamily:"'Cinzel',serif"}}>{l==="ro"?"RO 🇷🇴":l==="ru"?"RU 🇷🇺":"FR 🇫🇷"}</button>)}
        </div>
      </div>
      {load?<Sp text={"Se încarcă "+sel?.title+"..."}/>:text&&<Fd><div style={{padding:"1.2rem 1.4rem"}}>
        <GT size="1.05rem">{text.titlu}</GT>
        {text.sectiuni?.map((s,i)=><div key={i} style={{marginTop:"1rem"}}>
          {s.titlu&&<div style={{fontSize:"0.78rem",fontFamily:"'Cinzel',serif",color:LC.ac,fontWeight:600,marginBottom:"0.35rem"}}>{s.titlu}</div>}
          <p style={{fontSize:"0.92rem",lineHeight:1.88,color:"rgba(40,20,0,0.82)",fontFamily:"'EB Garamond',serif",margin:0}}>{s.text}</p>
          {i<text.sectiuni.length-1&&<Dv/>}
        </div>)}
      </div></Fd>}
    </div>
  );
  return(
    <div style={{padding:"0.5rem 1rem 3rem"}}>
      <div style={{display:"flex",justifyContent:"center",gap:"0.45rem",marginBottom:"0.9rem",paddingTop:"0.5rem"}}>
        {["ro","ru","fr"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 15px",borderRadius:18,fontSize:"0.73rem",cursor:"pointer",background:lang===l?GOLD:"rgba(255,248,220,0.7)",backgroundSize:"300% 300%",animation:lang===l?"gs 4s ease-in-out infinite":"none",border:"1px solid "+(lang===l?"transparent":LC.ac+"44"),color:lang===l?"#3A2000":LC.ac,fontFamily:"'Cinzel',serif",fontWeight:600}}>{l==="ro"?"RO 🇷🇴":l==="ru"?"RU 🇷🇺":"FR 🇫🇷"}</button>)}
      </div>
      <div style={{marginBottom:"0.5rem"}}><GT size="0.57rem" style={{letterSpacing:"0.18em"}}>✦ RUGĂCIUNI & SPOVEDANIE ✦</GT></div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.45rem",marginBottom:"1.1rem"}}>
        {CATS.map((r,i)=><Fd key={r.id} delay={i*40}>
          <button onClick={()=>open(r)} style={{width:"100%",...GC(),padding:"0.8rem 0.9rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.8rem",textAlign:"left",transition:"transform 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            <div style={{width:38,height:38,borderRadius:9,flexShrink:0,background:"linear-gradient(135deg,"+r.color+","+r.color+"88)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",boxShadow:"0 3px 9px "+r.color+"44"}}>{r.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:"0.85rem",fontFamily:"'Cinzel',serif",fontWeight:600,color:r.color}}>{r.title}</div></div>
            <span style={{color:r.color+"77",fontSize:"1.1rem"}}>›</span>
          </button>
        </Fd>)}
      </div>
      <div style={{marginBottom:"0.5rem"}}><GT size="0.57rem" style={{letterSpacing:"0.18em"}}>✦ ACATISTE & PARACLIS ✦</GT></div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.45rem"}}>
        {ACAT.map((a,i)=><Fd key={a.id} delay={i*40}>
          <button onClick={()=>open(a)} style={{width:"100%",...GC(),padding:"0.8rem 0.9rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.8rem",textAlign:"left",transition:"transform 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            <div style={{width:38,height:38,borderRadius:9,flexShrink:0,background:GOLD,backgroundSize:"300% 300%",animation:"gs 4s ease-in-out infinite",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",boxShadow:"0 3px 9px rgba(180,130,0,0.35)"}}>{a.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:"0.85rem",fontFamily:"'Cinzel',serif",fontWeight:600,color:"#4A2E00",marginBottom:"2px"}}>{a.title}</div><div style={{fontSize:"0.68rem",color:"rgba(80,50,0,0.42)",fontFamily:"'EB Garamond',serif"}}>{a.sub}</div></div>
            <span style={{color:"rgba(180,130,0,0.6)",fontSize:"1.1rem"}}>›</span>
          </button>
        </Fd>)}
      </div>
    </div>
  );
}

function S3(){
  const [sub,setSub]=useState("main");
  const [met,setMet]=useState(0);
  const [pom,setPom]=useState({vii:[],morti:[]});
  const [nn,setNn]=useState("");
  const [nt,setNt]=useState("vii");
  const [nq,setNq]=useState("");
  const [nr,setNr]=useState(null);
  const [nl,setNl]=useState(false);
  const addN=()=>{if(!nn.trim())return;setPom(p=>({...p,[nt]:[...p[nt],nn.trim()]}));setNn("");};
  const srch=async()=>{if(!nq.trim())return;setNl(true);try{const d=await ask("Când se prăznuiește \""+nq+"\" în calendarul ortodox pe stil vechi?","JSON:{\"nume\":\""+nq+"\",\"zile\":[{\"data\":\"\",\"sfant\":\"\",\"descriere\":\"\"}],\"urare\":\"\"}");setNr(d);}catch{setNr({zile:[{sfant:"Eroare",descriere:"Încearcă din nou."}],urare:""});}setNl(false);};
  if(sub==="met"||sub==="isus")return(
    <div style={{padding:"1rem"}}>
      <div style={{marginBottom:"1rem"}}><BB onClick={()=>setSub("main")}>← Înapoi</BB></div>
      <div style={{textAlign:"center",padding:"0.5rem 1rem 2rem"}}>
        <GT size="1.05rem">{sub==="isus"?"Rugăciunea lui Iisus":"Numărător Metanii"}</GT>
        {sub==="isus"&&<div style={{fontSize:"0.82rem",color:"rgba(80,50,0,0.55)",fontFamily:"'EB Garamond',serif",fontStyle:"italic",marginTop:"0.4rem",marginBottom:"1.2rem",lineHeight:1.7}}>„Doamne Iisuse Hristoase,<br/>Fiul lui Dumnezeu,<br/>miluiește-mă pe mine, păcătosul."</div>}
        {sub==="met"&&<div style={{fontSize:"0.72rem",color:"rgba(80,50,0,0.5)",fontFamily:"'EB Garamond',serif",marginTop:"4px",marginBottom:"2rem"}}>Apasă crucea pentru fiecare metanie</div>}
        <div style={{margin:"0 auto 1.5rem",width:145,height:145,borderRadius:"50%",background:GOLD,backgroundSize:"300% 300%",animation:"gs 4s ease-in-out infinite",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 8px 32px rgba(180,130,0,0.45)",flexDirection:"column",gap:"0.3rem"}} onClick={()=>setMet(m=>m+1)}>
          <Cross size={40} color="#FFF8E0" glow/>
          <div style={{fontSize:"2.2rem",fontFamily:"'Cinzel',serif",fontWeight:900,color:"#3A2000",lineHeight:1}}>{met}</div>
        </div>
        <div style={{display:"flex",gap:"0.8rem",justifyContent:"center",marginBottom:"1rem"}}><GB onClick={()=>setMet(0)}>↺ Reset</GB></div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem",justifyContent:"center"}}>
          {[33,100,300,500,1000].map(n=><button key={n} onClick={()=>setMet(n)} style={{padding:"5px 13px",borderRadius:15,fontSize:"0.73rem",cursor:"pointer",background:"rgba(255,248,220,0.85)",border:"1px solid "+LC.ac+"44",color:LC.ac,fontFamily:"'Cinzel',serif"}}>→ {n}</button>)}
        </div>
      </div>
    </div>
  );
  if(sub==="pom")return(
    <div style={{padding:"1rem 1rem 3rem"}}>
      <div style={{marginBottom:"1rem"}}><BB onClick={()=>setSub("main")}>← Înapoi</BB></div>
      <GT size="1.05rem">Pomelnic Digital</GT>
      <div style={{fontSize:"0.72rem",color:"rgba(80,50,0,0.5)",fontFamily:"'EB Garamond',serif",marginTop:"4px",marginBottom:"1.2rem"}}>Lista numelor pentru rugăciune</div>
      <div style={{...GC(),padding:"1rem",marginBottom:"1rem"}}>
        <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.6rem"}}>
          {["vii","morti"].map(t=><button key={t} onClick={()=>setNt(t)} style={{flex:1,padding:"6px",borderRadius:9,fontSize:"0.73rem",cursor:"pointer",background:nt===t?GOLD:"rgba(255,248,220,0.7)",backgroundSize:"300% 300%",animation:nt===t?"gs 4s ease-in-out infinite":"none",border:"1px solid "+(nt===t?"transparent":LC.ac+"33"),color:nt===t?"#3A2000":LC.ac,fontFamily:"'Cinzel',serif",fontWeight:600}}>{t==="vii"?"✦ Vii":"✝ Adormiți"}</button>)}
        </div>
        <div style={{display:"flex",gap:"0.5rem"}}>
          <input value={nn} onChange={e=>setNn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addN()} placeholder="Adaugă un nume..." style={{flex:1,padding:"7px 11px",borderRadius:9,border:"1px solid "+LC.ac+"44",background:"rgba(255,252,240,0.9)",fontFamily:"'EB Garamond',serif",fontSize:"0.9rem",color:"rgba(40,20,0,0.85)"}}/>
          <GB onClick={addN} style={{padding:"7px 14px",fontSize:"0.8rem"}}>+</GB>
        </div>
      </div>
      {["vii","morti"].map(type=>(
        <div key={type} style={{marginBottom:"1rem"}}>
          <div style={{fontSize:"0.57rem",letterSpacing:"0.18em",color:LC.ac,fontFamily:"'Cinzel',serif",marginBottom:"0.45rem"}}>{type==="vii"?"✦ PENTRU CEI VII":"✝ PENTRU CEI ADORMIȚI"}</div>
          {pom[type].length===0?<div style={{fontSize:"0.8rem",color:"rgba(80,50,0,0.35)",fontStyle:"italic",fontFamily:"'EB Garamond',serif"}}>Niciun nume adăugat</div>:
            <div style={{display:"flex",flexWrap:"wrap",gap:"0.38rem"}}>
              {pom[type].map((n,i)=><span key={i} style={{fontSize:"0.78rem",padding:"3px 11px",borderRadius:18,background:"rgba(255,248,220,0.9)",border:"1px solid "+LC.ac+"33",color:"rgba(60,30,0,0.85)",fontFamily:"'EB Garamond',serif",display:"flex",alignItems:"center",gap:"0.38rem"}}>
                {n}<span onClick={()=>setPom(p=>({...p,[type]:p[type].filter((_,j)=>j!==i)}))} style={{cursor:"pointer",color:"rgba(180,0,0,0.5)",fontSize:"0.68rem"}}>✕</span>
              </span>)}
            </div>}
        </div>
      ))}
    </div>
  );
  if(sub==="onom")return(
    <div style={{padding:"1rem 1rem 3rem"}}>
      <div style={{marginBottom:"1rem"}}><BB onClick={()=>setSub("main")}>← Înapoi</BB></div>
      <GT size="1.05rem">Onomastică Ortodoxă</GT>
      <div style={{fontSize:"0.72rem",color:"rgba(80,50,0,0.5)",fontFamily:"'EB Garamond',serif",marginTop:"4px",marginBottom:"1.2rem"}}>Află când îți este ziua numelui</div>
      <div style={{...GC(),padding:"1rem",marginBottom:"1rem"}}>
        <div style={{display:"flex",gap:"0.5rem"}}>
          <input value={nq} onChange={e=>setNq(e.target.value)} onKeyDown={e=>e.key==="Enter"&&srch()} placeholder="Ex: Maria, Ion, Elena..." style={{flex:1,padding:"7px 11px",borderRadius:9,border:"1px solid "+LC.ac+"44",background:"rgba(255,252,240,0.9)",fontFamily:"'EB Garamond',serif",fontSize:"0.9rem",color:"rgba(40,20,0,0.85)"}}/>
          <GB onClick={srch} style={{padding:"7px 14px",fontSize:"0.8rem"}}>🔍</GB>
        </div>
      </div>
      {nl&&<Sp text="Se caută..."/>}
      {nr&&!nl&&<Fd><div style={{...GC(),padding:"1.1rem"}}>
        <GT size="1rem">{nr.nume}</GT>
        {nr.zile?.map((z,i)=><div key={i} style={{marginTop:"0.7rem"}}><div style={{fontFamily:"'Cinzel',serif",fontSize:"0.83rem",fontWeight:600,color:LC.ac,marginBottom:"2px"}}>{z.data}</div><div style={{fontSize:"0.8rem",fontFamily:"'Cinzel',serif",color:"rgba(60,30,0,0.85)",marginBottom:"2px"}}>{z.sfant}</div><p style={{fontSize:"0.83rem",lineHeight:1.68,color:"rgba(40,20,0,0.7)",fontFamily:"'EB Garamond',serif",margin:0}}>{z.descriere}</p></div>)}
        {nr.urare&&<><Dv/><div style={{fontSize:"0.87rem",fontStyle:"italic",color:LC.ac,fontFamily:"'EB Garamond',serif",textAlign:"center",padding:"0.4rem 0"}}>„{nr.urare}"</div></>}
      </div></Fd>}
    </div>
  );
  const LPOST=[{name:"Postul Mare",p:"~8 săptămâni înainte de Paști",c:"#8B0000"},{name:"Postul Apostolilor",p:"Dum. Tuturor Sfinților — 29 Iunie",c:"#C06010"},{name:"Postul Adormirii",p:"1 — 14 August",c:"#2050B0"},{name:"Postul Nașterii",p:"15 Noiembrie — 24 Decembrie",c:"#1A7030"}];
  const TOOLS=[{id:"met",t:"Metanii",s:"Numărător",i:"📿",c:"#8B0000"},{id:"isus",t:"Rug. lui Iisus",s:"Numărător",i:"☩",c:"#B8860B"},{id:"pom",t:"Pomelnic",s:"Lista numelor",i:"📋",c:"#2050B0"},{id:"onom",t:"Onomastică",s:"Ziua numelui",i:"🎂",c:"#C06010"}];
  return(
    <div style={{padding:"0.5rem 1rem 3rem"}}>
      <div style={{marginBottom:"0.5rem",paddingTop:"0.5rem"}}><GT size="0.57rem" style={{letterSpacing:"0.18em"}}>✦ CALENDARUL POSTULUI</GT></div>
      <Fd delay={0}><div style={{...GC(),padding:"1rem",marginBottom:"0.85rem"}}><CalMonth/></div></Fd>
      <Fd delay={60}><div style={{...GC(),padding:"1rem",marginBottom:"0.8rem",background:FAST.color+"12",borderColor:FAST.color+"33"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.65rem"}}><span style={{fontSize:"1.7rem"}}>{FAST.icon}</span><div><div style={{fontFamily:"'Cinzel',serif",fontWeight:700,fontSize:"0.92rem",color:FAST.color}}>{FAST.label}</div><p style={{fontSize:"0.83rem",lineHeight:1.6,color:"rgba(40,20,0,0.68)",fontFamily:"'EB Garamond',serif",margin:"3px 0 0"}}>{FAST.desc}</p></div></div>
      </div></Fd>
      <div style={{fontSize:"0.57rem",letterSpacing:"0.18em",color:LC.ac,fontFamily:"'Cinzel',serif",marginBottom:"0.45rem",marginTop:"0.5rem"}}>✦ POSTURI MARI ALE ANULUI</div>
      {LPOST.map((p,i)=><Fd key={p.name} delay={i*50}><div style={{...GC(),padding:"0.7rem 0.95rem",marginBottom:"0.45rem",borderLeft:"3px solid "+p.c}}><div style={{fontFamily:"'Cinzel',serif",fontSize:"0.83rem",fontWeight:600,color:p.c}}>{p.name}</div><div style={{fontSize:"0.72rem",color:"rgba(80,50,0,0.48)",fontFamily:"'EB Garamond',serif"}}>{p.p}</div></div></Fd>)}
      <div style={{fontSize:"0.57rem",letterSpacing:"0.18em",color:LC.ac,fontFamily:"'Cinzel',serif",marginBottom:"0.45rem",marginTop:"0.85rem"}}>✦ UNELTE SPIRITUALE</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.55rem"}}>
        {TOOLS.map(t=><Fd key={t.id} delay={0}>
          <button onClick={()=>setSub(t.id)} style={{...GC(),padding:"0.95rem 0.75rem",cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.35rem",transition:"transform 0.2s",width:"100%"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            <span style={{fontSize:"1.5rem"}}>{t.i}</span>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.78rem",fontWeight:600,color:t.c}}>{t.t}</div>
            <div style={{fontSize:"0.63rem",color:"rgba(80,50,0,0.42)",fontFamily:"'EB Garamond',serif"}}>{t.s}</div>
          </button>
        </Fd>)}
      </div>
    </div>
  );
}

function S4(){
  const [sub,setSub]=useState("menu");
  const [book,setBook]=useState(null);
  const [ch,setCh]=useState(null);
  const [ps,setPs]=useState(null);
  const [text,setText]=useState(null);
  const [load,setLoad]=useState(false);
  const [cur,setCur]=useState(0);
  const [play,setPlay]=useState(false);
  const [prog,setProg]=useState(22);
  const BOOKS=[{id:"proverbe",title:"Proverbe",author:"Solomon",ch:31,c1:"#D4AF37",c2:"#8B6914"},{id:"ecclesiast",title:"Ecclesiastul",author:"Solomon",ch:12,c1:"#2E8B57",c2:"#1A5C35"},{id:"cantarea",title:"Cântarea Cântărilor",author:"Solomon",ch:8,c1:"#C41E3A",c2:"#7B0F1F"},{id:"intelepciunea",title:"Înțelepciunea",author:"Solomon",ch:19,c1:"#6B3FA0",c2:"#3D1A6B"},{id:"sirah",title:"Ecclesiasticul",author:"Iisus Sirah",ch:51,c1:"#1A5EA0",c2:"#0D2E5A"},{id:"iov",title:"Cartea lui Iov",author:"Profetul Iov",ch:42,c1:"#8B4513",c2:"#4A1E05"},{id:"rut",title:"Cartea Rut",author:"Samuel",ch:4,c1:"#2E7D32",c2:"#1A4A1E"}];
  const TRACKS=[{id:1,title:"Heruvicul",sub:"Glasul 1 · Cor Catedrală",dur:"5:23"},{id:2,title:"Axion Estin",sub:"Glasul 8 · Cor Bizant",dur:"3:45"},{id:3,title:"Doamne Miluiește",sub:"Glasul 6 · Cor Patriarhie",dur:"4:12"},{id:4,title:"Tatăl Nostru",sub:"Glasul 5 · Bis. Sf. Ap.",dur:"2:05"},{id:5,title:"Tropar",sub:"Glasul 4 · Cor Catedrală",dur:"2:30"},{id:6,title:"Aliluia",sub:"Glasul 2 · Cor Bizant",dur:"1:45"},{id:7,title:"Imnul Acatistului BVM",sub:"Glasul 8 · Cor Patriarhie",dur:"8:14"}];
  const ref=useRef(null);
  useEffect(()=>{if(play){ref.current=setInterval(()=>setProg(p=>p>=100?0:p+0.25),300);}else clearInterval(ref.current);return()=>clearInterval(ref.current);},[play,cur]);
  const loadT=async(title,pr)=>{setText(null);setLoad(true);try{const d=await ask(pr,"JSON:{\"titlu\":\""+title+"\",\"verseturi\":[\"...\"]}");setText(d);}catch{setText({titlu:title,verseturi:["Eroare."]});}setLoad(false);};
  const t=TRACKS[cur];
  const VRS=({text})=>(<div style={{display:"flex",flexDirection:"column",gap:"0.52rem",marginTop:"0.75rem"}}>
    {text?.verseturi?.map((v,i)=><div key={i} style={{display:"flex",gap:"0.7rem",alignItems:"flex-start"}}><span style={{fontSize:"0.58rem",color:"rgba(180,130,0,0.5)",fontFamily:"'Cinzel',serif",marginTop:"0.3rem",flexShrink:0,minWidth:"1.3rem",textAlign:"right"}}>{i+1}</span><p style={{fontSize:"0.92rem",lineHeight:1.87,color:"rgba(40,20,0,0.84)",fontFamily:"'EB Garamond',serif",margin:0}}>{v}</p></div>)}
  </div>);
  if(sub==="ps-r"&&ps)return(<div style={{padding:"0 0 3rem"}}><div style={{padding:"1rem 1rem 0"}}><BB onClick={()=>{setSub("psalmi");setPs(null);setText(null);}}>← Psaltire</BB></div>{load?<Sp text={"Psalmul "+ps+"..."}/>:text&&<Fd><div style={{padding:"1.1rem 1.3rem"}}><GT size="1.1rem">{text.titlu}</GT><Dv/><VRS text={text}/></div></Fd>}</div>);
  if(sub==="b-r"&&ch&&book)return(<div style={{padding:"0 0 3rem"}}><div style={{padding:"1rem 1rem 0"}}><BB onClick={()=>{setCh(null);setText(null);setSub("b-ch");}}>← {book.title}</BB></div>{load?<Sp text="Se încarcă..."/>:text&&<Fd><div style={{padding:"1.1rem 1.3rem"}}><div style={{fontSize:"0.97rem",fontFamily:"'Cinzel',serif",fontWeight:700,color:book.c1,marginBottom:"0.6rem"}}>{text.titlu}</div><Dv/><VRS text={text}/></div></Fd>}</div>);
  if(sub==="b-ch"&&book)return(<div style={{padding:"0 1rem 3rem"}}><div style={{padding:"0.75rem 0"}}><BB onClick={()=>{setBook(null);setSub("carti");}}>← Cărți Sfinte</BB></div><div style={{textAlign:"center",padding:"0.5rem 0 1.1rem"}}><div style={{fontFamily:"'Cinzel',serif",fontSize:"0.93rem",fontWeight:700,color:book.c1}}>{book.title}</div><div style={{fontSize:"0.68rem",color:"rgba(80,50,0,0.4)",fontFamily:"'EB Garamond',serif",fontStyle:"italic"}}>{book.author} · {book.ch} capitole</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.38rem"}}>{Array.from({length:book.ch},(_,i)=>i+1).map(c=><button key={c} onClick={()=>{setCh(c);setSub("b-r");loadT(book.title+" – Cap. "+c,"Textul complet al capitolului "+c+" din \""+book.title+"\" în română literară. JSON:{\"titlu\":\"\",\"verseturi\":[\"...\"]}");}} style={{background:book.c1+"16",border:"1.5px solid "+book.c1+"33",borderRadius:9,padding:"0.52rem 0",color:book.c1,cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.77rem",fontWeight:600,transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.background=book.c1+"2E"} onMouseLeave={e=>e.currentTarget.style.background=book.c1+"16"}>{c}</button>)}</div></div>);
  if(sub==="psalmi")return(<div style={{padding:"0.5rem 1rem 3rem"}}><div style={{padding:"0.5rem 0"}}><BB onClick={()=>setSub("menu")}>← Bibliotecă</BB></div><div style={{textAlign:"center",padding:"0.6rem 0 1.1rem"}}><GT size="1.05rem">Psaltirea lui David</GT><div style={{fontSize:"0.68rem",color:"rgba(80,50,0,0.4)",fontFamily:"'EB Garamond',serif",fontStyle:"italic",marginTop:"3px"}}>150 de psalmi · atingeți pentru a citi</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"0.38rem"}}>{Array.from({length:150},(_,i)=>i+1).map(n=><button key={n} onClick={()=>{setPs(n);setSub("ps-r");loadT("Psalmul "+n,"Textul complet al Psalmului "+n+" în română literară ortodoxă. JSON:{\"titlu\":\"Psalmul "+n+"\",\"verseturi\":[\"...\"]}");}} style={{background:"rgba(255,252,235,0.88)",border:"1.5px solid transparent",backgroundImage:"linear-gradient(rgba(255,252,235,0.88),rgba(255,252,235,0.88)),"+GOLD,backgroundOrigin:"border-box",backgroundClip:"padding-box,border-box",backgroundSize:"auto,300% 300%",animation:"sb 5s ease-in-out infinite",borderRadius:9,padding:"0.52rem 0",color:"rgba(80,50,0,0.78)",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.76rem",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 12px rgba(180,130,0,0.28)";e.currentTarget.style.transform="translateY(-1px)";}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="translateY(0)";}}>{n}</button>)}</div></div>);
  if(sub==="carti")return(<div style={{padding:"0.5rem 1rem 3rem"}}><div style={{padding:"0.5rem 0"}}><BB onClick={()=>setSub("menu")}>← Bibliotecă</BB></div><div style={{textAlign:"center",padding:"0.6rem 0 1.1rem"}}><GT size="1.05rem">Cărți Sfinte</GT></div><div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>{BOOKS.map((b,i)=><Fd key={b.id} delay={i*48}><button onClick={()=>{setBook(b);setSub("b-ch");}} style={{width:"100%",...GC(),borderLeft:"3px solid "+b.c1,padding:"0.9rem 0.95rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.9rem",textAlign:"left",transition:"transform 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}><div style={{width:40,height:40,borderRadius:9,flexShrink:0,background:"linear-gradient(135deg,"+b.c1+","+b.c2+")",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 9px "+b.c1+"44"}}><Cross size={18} color="rgba(255,255,255,0.95)"/></div><div style={{flex:1}}><div style={{fontFamily:"'Cinzel',serif",fontSize:"0.86rem",fontWeight:700,color:b.c1,marginBottom:"1px"}}>{b.title}</div><div style={{fontSize:"0.68rem",color:"rgba(80,50,0,0.38)",fontFamily:"'EB Garamond',serif"}}>{b.author} · {b.ch} cap.</div></div><span style={{color:b.c1+"77",fontSize:"1.1rem"}}>›</span></button></Fd>)}</div></div>);
  if(sub==="muzica")return(
    <div style={{padding:"0 0 3rem"}}>
      <div style={{padding:"1rem 1rem 0"}}><BB onClick={()=>setSub("menu")}>← Bibliotecă</BB></div>
      <Fd><div style={{margin:"0.75rem 1rem",...GC(),padding:0,overflow:"hidden"}}>
        <div style={{height:165,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",background:"linear-gradient(145deg,#FFFAEB,#FFF4C8)"}}>
          <div style={{position:"absolute",width:150,height:150,animation:play?"rot 25s linear infinite":"none",transformOrigin:"75px 75px"}}>
            {Array.from({length:16},(_,i)=><div key={i} style={{position:"absolute",width:1,height:75,background:"linear-gradient(to top,rgba(255,215,0,"+(play?0.18:0.04)+"),transparent)",transformOrigin:"0.5px 75px",top:0,left:"50%",transform:"rotate("+(i*22.5)+"deg)"}}/>)}
          </div>
          <div style={{position:"relative",zIndex:1,textAlign:"center"}}>
            <div style={{width:76,height:76,borderRadius:"50%",margin:"0 auto 0.4rem",background:"rgba(255,255,255,0.75)",border:"2px solid transparent",backgroundImage:"linear-gradient(rgba(255,255,255,0.75),rgba(255,255,255,0.75)),"+GOLD,backgroundOrigin:"border-box",backgroundClip:"padding-box,border-box",backgroundSize:"auto,300% 300%",animation:"sb 3s ease-in-out infinite",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:play?"0 0 28px rgba(255,215,0,0.5)":"0 4px 14px rgba(180,130,0,0.2)",transition:"box-shadow 0.5s"}}>
              <Cross size={33} color="#B8860B" glow={play} sh/>
            </div>
            <GT size="0.6rem" style={{letterSpacing:"0.17em"}}>MUZICĂ LITURGICĂ</GT>
          </div>
        </div>
        <div style={{padding:"1rem 1.2rem"}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.96rem",fontWeight:700,color:"#3A2000",marginBottom:"2px"}}>{t.title}</div>
          <div style={{fontSize:"0.73rem",color:"rgba(80,50,0,0.43)",fontFamily:"'EB Garamond',serif",marginBottom:"0.85rem"}}>{t.sub}</div>
          <div style={{height:3,background:"rgba(180,130,0,0.1)",borderRadius:2,overflow:"hidden",marginBottom:"0.28rem"}}><div style={{height:"100%",width:prog+"%",background:GOLD,backgroundSize:"300% 100%",borderRadius:2,transition:"width 0.3s linear",boxShadow:"0 0 7px rgba(255,215,0,0.4)"}}/></div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.85rem",fontSize:"0.6rem",color:"rgba(80,50,0,0.32)",fontFamily:"'Cinzel',serif"}}><span>0:00</span><span>{t.dur}</span></div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"2rem"}}>
            <button onClick={()=>setCur(c=>(c-1+TRACKS.length)%TRACKS.length)} style={{background:"none",border:"none",color:"rgba(80,50,0,0.48)",cursor:"pointer",fontSize:"1.05rem"}}>⏮</button>
            <button onClick={()=>setPlay(p=>!p)} style={{width:54,height:54,borderRadius:"50%",cursor:"pointer",border:"none",background:GOLD,backgroundSize:"300% 300%",animation:"gs 4s ease-in-out infinite",fontSize:"1.2rem",color:"#2A1400",boxShadow:"0 4px 18px rgba(180,130,0,0.44)",display:"flex",alignItems:"center",justifyContent:"center"}}>{play?"⏸":"▶"}</button>
            <button onClick={()=>setCur(c=>(c+1)%TRACKS.length)} style={{background:"none",border:"none",color:"rgba(80,50,0,0.48)",cursor:"pointer",fontSize:"1.05rem"}}>⏭</button>
          </div>
        </div>
      </div></Fd>
      <div style={{padding:"0 1rem",display:"flex",flexDirection:"column",gap:"0.28rem"}}>
        {TRACKS.map((tr,i)=><button key={tr.id} onClick={()=>{setCur(i);setPlay(true);setProg(0);}} style={{background:i===cur?"rgba(255,248,220,0.95)":"rgba(255,252,240,0.7)",border:"1.5px solid "+(i===cur?"transparent":"rgba(212,175,55,0.2)"),backgroundImage:i===cur?"linear-gradient(rgba(255,248,220,0.95),rgba(255,248,220,0.95)),"+GOLD:"none",backgroundOrigin:"border-box",backgroundClip:"padding-box,border-box",backgroundSize:"auto,300% 300%",animation:i===cur?"sb 3s ease-in-out infinite":"none",borderRadius:9,padding:"0.62rem 0.82rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.78rem",textAlign:"left",transition:"all 0.2s",boxShadow:i===cur?"0 2px 7px rgba(180,130,0,0.18)":"none"}}>
          <div style={{width:34,height:34,borderRadius:7,flexShrink:0,background:i===cur?GOLD:"rgba(212,175,55,0.12)",backgroundSize:"300% 300%",animation:i===cur?"gs 3s ease-in-out infinite":"none",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:i===cur?"0 2px 7px rgba(180,130,0,0.32)":"none"}}>
            {i===cur&&play?<span style={{color:"#2A1400",fontSize:"0.82rem"}}>♪</span>:<Cross size={13} color={i===cur?"#2A1400":"#B8860B"}/>}
          </div>
          <div style={{flex:1}}><div style={{fontSize:"0.84rem",color:i===cur?"#3A2000":"rgba(80,50,0,0.73)",fontFamily:i===cur?"'Cinzel',serif":"inherit",fontWeight:i===cur?700:400,marginBottom:"1px"}}>{tr.title}</div><div style={{fontSize:"0.65rem",color:"rgba(80,50,0,0.3)",fontFamily:"'EB Garamond',serif"}}>{tr.sub}</div></div>
          <span style={{fontSize:"0.65rem",color:"rgba(80,50,0,0.28)",fontFamily:"'Cinzel',serif"}}>{tr.dur}</span>
        </button>)}
      </div>
    </div>
  );
  const S=[{id:"psalmi",title:"Psaltirea lui David",sub:"150 de psalmi",icon:"📜",c:"#D4AF37"},{id:"carti",title:"Cărți Sfinte",sub:"Solomon · Iov · David",icon:"📚",c:"#8B4513"},{id:"muzica",title:"Muzică Liturgică",sub:"Cântări bizantine",icon:"♪",c:"#2050B0"}];
  return(<div style={{padding:"0.5rem 1rem 3rem"}}><div style={{textAlign:"center",padding:"0.75rem 0 1.1rem"}}><GT size="1.1rem">Bibliotecă Sfântă</GT></div><div style={{display:"flex",flexDirection:"column",gap:"0.65rem"}}>{S.map((s,i)=><Fd key={s.id} delay={i*55}><button onClick={()=>setSub(s.id)} style={{width:"100%",...GC(),borderLeft:"3px solid "+s.c,padding:"0.95rem 1rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.95rem",textAlign:"left",transition:"transform 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}><div style={{width:46,height:46,borderRadius:11,flexShrink:0,background:"linear-gradient(135deg,"+s.c+","+s.c+"88)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.35rem",boxShadow:"0 4px 13px "+s.c+"44"}}>{s.icon}</div><div style={{flex:1}}><div style={{fontFamily:"'Cinzel',serif",fontSize:"0.9rem",fontWeight:700,color:s.c,marginBottom:"2px"}}>{s.title}</div><div style={{fontSize:"0.7rem",color:"rgba(80,50,0,0.4)",fontFamily:"'EB Garamond',serif"}}>{s.sub}</div></div><span style={{color:s.c+"88",fontSize:"1.2rem"}}>›</span></button></Fd>)}</div></div>);
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
const TABS=[{id:"t1",label:"Zilnic"},{id:"t2",label:"Rugăciuni"},{id:"t3",label:"Calendar"},{id:"t4",label:"Bibliotecă"}];
const ICONS={"t1":null,"t2":"🕯","t3":"📅","t4":"📚"};

export default function App(){
  const [tab,setTab]=useState("t1");
  const [vis,setVis]=useState(false);
  useEffect(()=>{
    const l=document.createElement("link");l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap";
    document.head.appendChild(l);setTimeout(()=>setVis(true),80);
  },[]);
  const S={"t1":<S1/>,"t2":<S2/>,"t3":<S3/>,"t4":<S4/>};
  return(
    <div style={{minHeight:"100vh",background:LC.bg,color:"rgba(40,20,0,0.9)",display:"flex",flexDirection:"column",fontFamily:"'EB Garamond',Georgia,serif"}}>
      <style>{`*{box-sizing:border-box}body{margin:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(180,130,0,0.3);border-radius:4px}button{outline:none;-webkit-tap-highlight-color:transparent}input{outline:none}${CSS}`}</style>
      <Particles/>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}><div style={{position:"absolute",top:"8%",left:"25%",width:190,height:190,background:"radial-gradient(circle,rgba(255,215,0,0.1),transparent 70%)",borderRadius:"50%"}}/></div>
      <header style={{position:"sticky",top:0,zIndex:100,background:"rgba(255,250,228,0.92)",backdropFilter:"blur(20px)",borderBottom:"2px solid transparent",backgroundImage:"linear-gradient(rgba(255,250,228,0.92),rgba(255,250,228,0.92)),"+GOLD,backgroundOrigin:"border-box",backgroundClip:"padding-box,border-box",backgroundSize:"auto,300% 300%",animation:"sb 5s ease-in-out infinite",boxShadow:"0 2px 18px rgba(180,130,0,0.12)",padding:"0.8rem 1.1rem 0.75rem",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(-8px)",transition:"opacity 0.7s,transform 0.7s"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
            <Cross size={22} color="#B8860B" glow sh/>
            <div><GT size="0.98rem" style={{letterSpacing:"0.04em",lineHeight:1.1,display:"block"}}>Rânduiala Zilei</GT><div style={{fontSize:"0.5rem",letterSpacing:"0.14em",color:"rgba(100,65,0,0.5)",fontFamily:"'Cinzel',serif",marginTop:"1px"}}>CALENDAR ORTODOX · STIL VECHI</div></div>
          </div>
          <div style={{padding:"0.28rem 0.78rem",borderRadius:9,textAlign:"right",background:"rgba(255,245,210,0.8)",border:"1.5px solid transparent",backgroundImage:"linear-gradient(rgba(255,245,210,0.8),rgba(255,245,210,0.8)),"+GOLD,backgroundOrigin:"border-box",backgroundClip:"padding-box,border-box",backgroundSize:"auto,300% 300%",animation:"sb 4s ease-in-out infinite",boxShadow:"0 2px 8px rgba(180,130,0,0.16)"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.86rem",color:"#3A2000",lineHeight:1,fontWeight:700}}>{JD.day} {JD.month}</div>
            <div style={{fontSize:"0.54rem",color:"rgba(100,65,0,0.48)",fontFamily:"'Cinzel',serif",marginTop:"1px"}}>{JD.dow}</div>
          </div>
        </div>
      </header>
      <main style={{flex:1,overflowY:"auto",position:"relative",zIndex:1,paddingBottom:"66px"}}>{S[tab]}</main>
      <nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(255,250,228,0.95)",backdropFilter:"blur(20px)",borderTop:"2px solid transparent",backgroundImage:"linear-gradient(rgba(255,250,228,0.95),rgba(255,250,228,0.95)),"+GOLD,backgroundOrigin:"border-box",backgroundClip:"padding-box,border-box",backgroundSize:"auto,300% 300%",animation:"sb 5s ease-in-out infinite .5s",boxShadow:"0 -2px 18px rgba(180,130,0,0.1)",display:"flex"}}>
        {TABS.map(t=>{const a=tab===t.id;return(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"0.55rem 0 0.45rem",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",color:a?"#8B5E00":"rgba(80,50,0,0.33)",transition:"all 0.25s",borderTop:"2px solid "+(a?"#B8860B":"transparent")}}>
            <span style={{transition:"all 0.25s",transform:a?"scale(1.18)":"scale(1)",filter:a?"drop-shadow(0 0 4px rgba(180,130,0,0.5))":"none"}}>
              {t.id==="t1"?<Cross size={a?17:14} color={a?"#B8860B":"rgba(80,50,0,0.3)"} glow={a}/>:ICONS[t.id]}
            </span>
            <span style={{fontSize:"0.5rem",letterSpacing:"0.08em",fontFamily:"'Cinzel',serif",fontWeight:a?700:400,background:a?GOLD:"none",backgroundSize:"300% 300%",WebkitBackgroundClip:a?"text":"none",WebkitTextFillColor:a?"transparent":"inherit",animation:a?"gs 4s ease-in-out infinite":"none"}}>{t.label}</span>
          </button>
        );})}
      </nav>
    </div>
  );
}

