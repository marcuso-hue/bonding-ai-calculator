import { createRoot } from "react-dom/client";
import { useState, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── SELLING prices (what we charge the client) ─────────────────────────────
const SELL = {
  Founder: 18401.36,
  "AI Strategy Lead": 11001.7,
  "AI Tech Lead": 9534.81,
  "AI Engineer Senior": 7319.88,
  "AI Engineer JR": 4834.98,
  DevOps: 7009.98,
  "Cloud Engineer": 8001.7,
  "Data Engineer PL": 4834.98,
  "Data Engineer SR": 7734.98,
  "Data BI Analyst PL": 4834.98,
  "Data BI Analyst SR": 7734.98,
  "Data Architect Senior": 7734.98,
  "Data Architect Specialist": 10634.98,
  "Data Governance Specialist": 7734.98,
  "Project/PO": 6284.98,
  "Project Manager": 5510.1,
  "Change Management Lead": 6284.98,
  "Software Architect": 8020.34,
  "Software Engineer Senior": 5510.1,
  "Software Engineer": 4452.99,
  "Software Engineer Medium": 3331.62,
  "Software Engineer Trainee": 2340.98,
  "Salesforce Admin": 2804.98,
  Tester: 2594.07,
  Designer: 4898.78,
  "UI/UX Senior Designer": 2578.35,
  "UI/UX Medium Designer": 2055.01,
  "UI/UX Trainee Designer": 1354.98,
};
const SELL_BRL = {
  Founder: 95707.33,
  "AI Strategy Lead": 57220.97,
  "AI Tech Lead": 49591.5,
  "AI Engineer Senior": 38071.43,
  "AI Engineer JR": 25147.22,
  DevOps: 36459.61,
  "Cloud Engineer": 41617.67,
  "Data Engineer PL": 25147.22,
  "Data Engineer SR": 40230.41,
  "Data BI Analyst PL": 25147.22,
  "Data BI Analyst SR": 40230.41,
  "Data Architect Senior": 40230.41,
  "Data Architect Specialist": 55313.6,
  "Data Governance Specialist": 40230.41,
  "Project/PO": 32688.81,
  "Project Manager": 28658.59,
  "Change Management Lead": 32688.81,
  "Software Architect": 41714.6,
  "Software Engineer Senior": 28658.59,
  "Software Engineer": 23160.47,
  "Software Engineer Medium": 17328.09,
  "Software Engineer Trainee": 12175.68,
  "Salesforce Admin": 14588.99,
  Tester: 13492.03,
  Designer: 25479.06,
  "UI/UX Senior Designer": 13410.24,
  "UI/UX Medium Designer": 10688.32,
  "UI/UX Trainee Designer": 7047.39,
};

// ─── COST prices (column D from price list — what we actually pay) ───────────
const COST_USD = {
  Founder: 15000,
  "AI Strategy Lead": 7000,
  "AI Tech Lead": 7000,
  "AI Engineer Senior": 4545.45,
  "AI Engineer JR": 3000,
  DevOps: 4500,
  "Cloud Engineer": 5000,
  "Data Engineer PL": 3000,
  "Data Engineer SR": 5000,
  "Data BI Analyst PL": 3000,
  "Data BI Analyst SR": 5000,
  "Data Architect Senior": 5000,
  "Data Architect Specialist": 7000,
  "Data Governance Specialist": 5000,
  "Project/PO": 4000,
  "Project Manager": 3465.6,
  "Change Management Lead": 4000,
  "Software Architect": 5196.8,
  "Software Engineer Senior": 3465.6,
  "Software Engineer": 3090.91,
  "Software Engineer Medium": 1963.2,
  "Software Engineer Trainee": 1280,
  "Salesforce Admin": 1600,
  Tester: 1454.55,
  Designer: 2727.27,
  "UI/UX Senior Designer": 1443.7,
  "UI/UX Medium Designer": 1082.78,
  "UI/UX Trainee Designer": 600,
};
const COST_BRL = {
  Founder: 78016.5,
  "AI Strategy Lead": 36407.7,
  "AI Tech Lead": 36407.7,
  "AI Engineer Senior": 23641.34,
  "AI Engineer JR": 15603.3,
  DevOps: 23404.95,
  "Cloud Engineer": 26005.5,
  "Data Engineer PL": 15603.3,
  "Data Engineer SR": 26005.5,
  "Data BI Analyst PL": 15603.3,
  "Data BI Analyst SR": 26005.5,
  "Data Architect Senior": 26005.5,
  "Data Architect Specialist": 36407.7,
  "Data Governance Specialist": 26005.5,
  "Project/PO": 20804.4,
  "Project Manager": 18024.93,
  "Change Management Lead": 20804.4,
  "Software Architect": 27029.08,
  "Software Engineer Senior": 18024.93,
  "Software Engineer": 16076.13,
  "Software Engineer Medium": 10210.8,
  "Software Engineer Trainee": 6657.41,
  "Salesforce Admin": 8321.76,
  Tester: 7565.24,
  Designer: 14184.8,
  "UI/UX Senior Designer": 7508.83,
  "UI/UX Medium Designer": 5631.65,
  "UI/UX Trainee Designer": 3120.66,
};

const ROLES_LIST = [
  { name: "Founder", cat: "Leadership" },
  { name: "AI Strategy Lead", cat: "Data & AI" },
  { name: "AI Tech Lead", cat: "Data & AI" },
  { name: "AI Engineer Senior", cat: "Data & AI" },
  { name: "AI Engineer JR", cat: "Data & AI" },
  { name: "DevOps", cat: "Data & AI" },
  { name: "Cloud Engineer", cat: "Data & AI" },
  { name: "Data Engineer PL", cat: "Data & AI" },
  { name: "Data Engineer SR", cat: "Data & AI" },
  { name: "Data BI Analyst PL", cat: "Data & AI" },
  { name: "Data BI Analyst SR", cat: "Data & AI" },
  { name: "Data Architect Senior", cat: "Data & AI" },
  { name: "Data Architect Specialist", cat: "Data & AI" },
  { name: "Data Governance Specialist", cat: "Data & AI" },
  { name: "Project/PO", cat: "Management" },
  { name: "Project Manager", cat: "Management" },
  { name: "Change Management Lead", cat: "Management" },
  { name: "Software Architect", cat: "Software Engineering" },
  { name: "Software Engineer Senior", cat: "Software Engineering" },
  { name: "Software Engineer", cat: "Software Engineering" },
  { name: "Software Engineer Medium", cat: "Software Engineering" },
  { name: "Software Engineer Trainee", cat: "Software Engineering" },
  { name: "Salesforce Admin", cat: "Software Engineering" },
  { name: "Tester", cat: "Software Engineering" },
  { name: "Designer", cat: "Design" },
  { name: "UI/UX Senior Designer", cat: "Design" },
  { name: "UI/UX Medium Designer", cat: "Design" },
  { name: "UI/UX Trainee Designer", cat: "Design" },
];
const CATS = [...new Set(ROLES_LIST.map((r) => r.cat))];
const H = 160,
  DR_RATE = 5.2011;
let _c = 1;
const uid = () => `i${_c++}`;

// ─── Lucro Presumido rates (BRL only) ────────────────────────────────────────
// Applied on Gross Revenue for service companies
const LP = {
  iss: 0.02, // ISS — 2%
  pis: 0.0065, // PIS — 0,65%
  cofins: 0.03, // COFINS — 3,00%
  csll: 0.01, // CSLL — 1,00%
  irrf: 0.015, // IRrf — 1,50%
};

const CSS = `
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --b0:#050505;--b1:#0b0b0b;--b2:#111;--b3:#181818;
  --g1:#2a2a2a;--g2:#3b3b3b;--g3:#555;--g4:#888;
  --g5:#b0b0b0;--g6:#d0d0d0;--g7:#e8e8e8;--w:#fafafa;
  --green:#4ade80;--red:#f87171;
  --ff:'Satoshi','system-ui',sans-serif;--fm:'Roboto Mono',monospace;
}
body{background:var(--b0)}
.app{min-height:100vh;background:var(--b0);font-family:var(--ff);color:var(--g7)}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:var(--b1)}
::-webkit-scrollbar-thumb{background:var(--g1);border-radius:2px}
/* header */
.hd{background:var(--b0);border-bottom:1px solid var(--g1);padding:0 24px;height:54px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.logo{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:700;letter-spacing:-.01em;color:var(--w)}
.logo-mark{width:24px;height:24px;background:var(--b2);border:1px solid var(--g1);border-radius:5px;display:flex;align-items:center;justify-content:center}
.logo-ai{color:var(--g3);font-weight:300}
.logo-sep{color:var(--g1);margin:0 4px}
.logo-sub{font-size:12px;font-weight:400;color:var(--g3)}
.hr-right{display:flex;align-items:center;gap:8px}
.rate-lbl{font-size:11px;color:var(--g3)}
.rate-in{background:var(--b2);border:1px solid var(--g1);color:var(--g5);font-family:var(--fm);font-size:12px;padding:5px 9px;border-radius:6px;width:86px;outline:none}
.rate-in:focus{border-color:var(--g4)}
.cur-grp{display:flex;border:1px solid var(--g1);border-radius:6px;overflow:hidden}
.cur-btn{background:none;border:none;color:var(--g3);font-family:var(--ff);font-size:12px;font-weight:600;padding:5px 13px;cursor:pointer;transition:all .13s}
.cur-btn+.cur-btn{border-left:1px solid var(--g1)}
.cur-btn.on{background:var(--g7);color:var(--b0)}
.cur-btn:hover:not(.on){background:var(--b3);color:var(--g7)}
.btn-exp{display:inline-flex;align-items:center;gap:5px;background:none;border:1px solid var(--g1);color:var(--g4);font-family:var(--ff);font-size:12px;font-weight:500;padding:6px 14px;border-radius:6px;cursor:pointer;transition:all .13s}
.btn-exp:hover{border-color:var(--g2);color:var(--g6)}
/* tabs */
.tabs{display:flex;border-bottom:1px solid var(--g1);padding:0 24px;background:var(--b0)}
.tab{padding:13px 16px;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--g2);cursor:pointer;border:none;background:none;border-bottom:2px solid transparent;transition:all .13s}
.tab.on{color:var(--g7);border-bottom-color:var(--g7)}
.tab:hover:not(.on){color:var(--g4)}
/* layout */
.ct{padding:22px 24px;max-width:1360px;margin:0 auto}
.card{background:var(--b1);border:1px solid var(--g1);border-radius:9px}
.card-hd{padding:12px 16px;border-bottom:1px solid var(--g1);display:flex;align-items:center;justify-content:space-between}
.ctitle{font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--g3)}
.mrow{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}
.mc{background:var(--b1);border:1px solid var(--g1);border-radius:9px;padding:16px 16px 14px;position:relative;overflow:hidden}
.mc::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:var(--g2)}
.mlbl{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--g3);margin-bottom:8px}
.mval{font-family:var(--fm);font-size:22px;font-weight:300;color:var(--w);line-height:1}
.msub{font-size:10px;color:var(--g2);margin-top:5px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.mb18{margin-bottom:18px}
/* form */
.frow{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:9px}
.fg{display:flex;flex-direction:column;gap:4px}
.flbl{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--g2)}
.fin{background:var(--b3);border:1px solid var(--g1);color:var(--g7);font-family:var(--ff);font-size:13px;padding:7px 10px;border-radius:7px;outline:none;transition:border-color .13s}
.fin:focus{border-color:var(--g4)}
.fin::placeholder{color:var(--g1)}
.sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.stitle{font-size:10px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--g3)}
/* buttons */
.btn{display:inline-flex;align-items:center;gap:5px;font-family:var(--ff);font-size:12px;font-weight:600;padding:7px 14px;border-radius:7px;border:none;cursor:pointer;transition:all .13s}
.btn-w{background:var(--g7);color:var(--b0)}.btn-w:hover{background:var(--w)}
.bgh{background:none;border:none;color:var(--g2);cursor:pointer;padding:4px;border-radius:4px;display:flex;align-items:center;transition:all .13s}
.bgh:hover{color:var(--g5);background:var(--b3)}
.badd{width:100%;margin-top:7px;background:none;border:1px dashed var(--g1);color:var(--g2);display:flex;align-items:center;justify-content:center;gap:5px;padding:8px;font-family:var(--ff);font-size:11px;font-weight:500;border-radius:7px;cursor:pointer;transition:all .13s}
.badd:hover{border-color:var(--g3);color:var(--g5)}
/* squad */
.sq-card{background:var(--b1);border:1px solid var(--g1);border-radius:9px;margin-bottom:9px;overflow:hidden;transition:border-color .18s}
.sq-card:hover{border-color:var(--g2)}
.sq-hd{padding:11px 15px;display:flex;align-items:center;gap:9px;cursor:pointer;user-select:none}
.sq-idx{width:20px;height:20px;background:var(--b2);border:1px solid var(--g1);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--g3);flex-shrink:0}
.sq-ni{background:none;border:none;color:var(--g7);font-family:var(--ff);font-size:14px;font-weight:600;outline:none;flex:1}
.sq-ni::placeholder{color:var(--g1)}
.sq-tot{font-family:var(--fm);font-size:12px;font-weight:300;color:var(--g5)}
.sq-body{padding:0 15px 15px}
.sq-meta{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:12px}
.pg-hd{display:grid;grid-template-columns:2.2fr 64px 80px 84px 28px;gap:7px;padding:0 0 6px;font-size:9px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--g1);border-bottom:1px solid var(--g1);margin-bottom:5px}
.pg-row{display:grid;grid-template-columns:2.2fr 64px 80px 84px 28px;gap:7px;margin-bottom:4px;align-items:start}
.rsel{background:var(--b3);border:1px solid var(--g1);color:var(--g7);font-family:var(--ff);font-size:12px;padding:6px 8px;border-radius:7px;outline:none;width:100%;cursor:pointer}
.rsel:focus{border-color:var(--g4)}
.nin{background:var(--b3);border:1px solid var(--g1);color:var(--g7);font-family:var(--fm);font-size:12px;padding:6px 8px;border-radius:7px;outline:none;width:100%;text-align:center}
.nin:focus{border-color:var(--g4)}
.rcost{font-size:9px;color:var(--g2);font-family:var(--fm);margin-top:2px;padding-left:1px}
/* data table */
.dt{width:100%;border-collapse:collapse}
.dt th{padding:7px 10px;text-align:right;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--g2);border-bottom:1px solid var(--g1);white-space:nowrap}
.dt th:first-child{text-align:left}
.dt td{padding:7px 10px;text-align:right;color:var(--g3);border-bottom:1px solid #0d0d0d;font-size:11px;font-family:var(--fm);font-weight:300;white-space:nowrap}
.dt td:first-child{text-align:left;color:var(--g5);font-family:var(--ff);font-size:12px;font-weight:400}
.dt tr:hover td{background:#0e0e0e}
.dt .tr{color:var(--w);font-weight:500;border-top:1px solid var(--g1);border-bottom:none;background:#0d0d0d}
.dt .tr td:first-child{color:var(--g7)}
.z{color:var(--g1)!important}.av{color:var(--g7)!important}
.ss-card{background:var(--b1);border:1px solid var(--g1);border-radius:9px;margin-bottom:14px;overflow:hidden}
.ss-hd{padding:12px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--g1);background:var(--b2)}
.ss-name{font-size:13px;font-weight:700;color:var(--w)}
.ss-proj{font-size:10px;color:var(--g3);margin-top:2px}
.ss-tot{font-family:var(--fm);font-size:16px;font-weight:300;color:var(--g6)}
.ss-hrs{font-size:10px;color:var(--g3);margin-top:2px;text-align:right}
.tt{background:var(--b2);border:1px solid var(--g1);border-radius:7px;padding:8px 12px}
.ttl{font-size:9px;color:var(--g3);margin-bottom:2px;text-transform:uppercase;letter-spacing:.07em}
.ttv{font-family:var(--fm);font-size:13px;font-weight:300;color:var(--g7)}
.empty{text-align:center;padding:36px 24px;border:1px dashed var(--g1);border-radius:9px;color:var(--g2)}
.mb14{margin-bottom:14px}
/* DRE */
.dre-col{padding:9px 18px;font-size:9px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--g3);border-bottom:1px solid var(--g1)}
.dre-sec td{background:var(--b2)!important;padding:9px 18px 7px!important;font-size:9px!important;font-weight:700!important;letter-spacing:.1em!important;text-transform:uppercase!important;color:var(--g3)!important;border-bottom:1px solid var(--g1)!important;border-top:1px solid var(--g1)!important}
.dre-hl td{background:var(--b2)!important}
.dre-bold td:first-child{font-weight:600!important;color:var(--g7)!important}
.dre-t{width:100%;border-collapse:collapse}
.dre-t td{padding:8px 18px;border-bottom:1px solid #0d0d0d;font-size:12px;vertical-align:middle}
.dre-t td:nth-child(2){text-align:right;font-family:var(--fm);font-weight:300;font-size:12px;width:34%}
.dre-t td:nth-child(3){text-align:right;font-family:var(--fm);font-size:11px;color:var(--g3);width:20%}
.dre-t td:first-child{width:46%}
.dre-t tr:not(.dre-sec):hover td{background:#0e0e0e}
/* pct input row */
.pct-row{display:flex;align-items:center;justify-content:flex-end;gap:8px}
.dre-pct-in{background:var(--b3);border:1px solid var(--g1);color:var(--g7);font-family:var(--fm);font-size:12px;padding:4px 8px;border-radius:6px;outline:none;width:72px;text-align:right}
.dre-pct-in:focus{border-color:var(--g4)}
.dre-pct-lbl{font-size:11px;color:var(--g3);font-family:var(--fm);min-width:24px}
.dre-val-calc{font-family:var(--fm);font-size:12px;font-weight:300}
.auto-tag{font-size:9px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;background:var(--b3);border:1px solid var(--g1);color:var(--g3);padding:2px 6px;border-radius:4px;margin-left:6px;vertical-align:middle}
/* print */
@media print{
  @page{size:A4;margin:12mm}
  .app{background:#fff;color:#000}
  .no-print{display:none!important}
  .po{display:block!important}
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}
.po{display:none}
.pdf{font-family:'Satoshi','Roboto',sans-serif;background:#fff;color:#111}
.pdf-hd{background:#050505;color:#fff;padding:20px 24px;display:flex;justify-content:space-between;align-items:center}
.pdf-logo{font-size:16px;font-weight:700}.pdf-logo-ai{color:#666;font-weight:300}
.pdf-tag{font-size:10px;color:#555;margin-top:1px}
.pdf-dt{font-size:10px;color:#555;font-family:'Roboto Mono',monospace}
.pdf-sec{padding:12px 24px;border-bottom:1px solid #e8e8e8}
.pdf-st{font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#aaa;margin-bottom:8px}
.pdf-ig{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.pdf-il{font-size:8px;text-transform:uppercase;letter-spacing:.08em;color:#aaa;margin-bottom:1px}
.pdf-iv{font-size:11px;font-weight:500}
.pdf-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.pdf-kpi{background:#f5f5f5;border:1px solid #e8e8e8;border-radius:5px;padding:10px 12px}
.pdf-kl{font-size:8px;text-transform:uppercase;letter-spacing:.08em;color:#999;margin-bottom:3px}
.pdf-kv{font-size:16px;font-weight:300;font-family:'Roboto Mono',monospace}
.pdf-t{width:100%;border-collapse:collapse;font-size:9px}
.pdf-t th{background:#f0f0f0;padding:5px 8px;text-align:right;font-size:8px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#555;border:1px solid #e5e5e5}
.pdf-t th:first-child{text-align:left}
.pdf-t td{padding:5px 8px;text-align:right;border:1px solid #ececec;color:#444;font-family:'Roboto Mono',monospace;font-weight:300}
.pdf-t td:first-child{text-align:left;font-family:'Satoshi',sans-serif;font-size:10px;font-weight:500;color:#111}
.pdf-t .ptt td{background:#eeeeee;font-weight:600}
.pdf-t .pz{color:#ccc}
.pdf-sblk{margin-bottom:12px}
.pdf-sname{font-size:11px;font-weight:600;background:#f0f0f0;padding:6px 10px;border:1px solid #e5e5e5;border-bottom:none;border-radius:4px 4px 0 0}
.pdf-foot{padding:10px 24px;font-size:8px;color:#aaa;display:flex;justify-content:space-between;border-top:1px solid #e8e8e8}
`;

export default function App() {
  const [tab, setTab] = useState("est");
  const [cur, setCur] = useState("USD");
  const [rate, setRate] = useState(DR_RATE);
  const [squads, setSquads] = useState([
    { id: uid(), name: "Squad 1", project: "Project 1", profiles: [] },
  ]);
  const [open, setOpen] = useState({});
  const [prop, setProp] = useState({
    owner: "Danilo Nato",
    date: new Date().toLocaleDateString("en-US"),
    version: "v1",
    customer: "",
    country: "",
    industry: "",
    scope: "",
    type: "Services",
  });
  // DRE editable fields
  const [dreDiscount, setDreDiscount] = useState(0);
  const [commPct, setCommPct] = useState(0.1); // 10% commission
  const [gaPct, setGaPct] = useState(0.05); // 5% G&A

  // ─── Prices ──
  const sellPrice = useCallback(
    (name) => (cur === "USD" ? SELL[name] || 0 : SELL_BRL[name] || 0),
    [cur],
  );
  const costPrice = useCallback(
    (name) => (cur === "USD" ? COST_USD[name] || 0 : COST_BRL[name] || 0),
    [cur],
  );

  // ─── Squad calculations (sell price = what client pays) ──
  const calc = useMemo(
    () =>
      squads.map((sq) => {
        const monthly = Array.from({ length: 12 }, (_, i) =>
          sq.profiles.reduce((s, p) => {
            const e = p.startMonth + p.duration - 1;
            return (
              s + (i + 1 >= p.startMonth && i + 1 <= e ? sellPrice(p.role) : 0)
            );
          }, 0),
        );
        const total = monthly.reduce((a, b) => a + b, 0);
        const pCalc = sq.profiles.map((p) => ({
          ...p,
          sellMc: sellPrice(p.role),
          costMc: costPrice(p.role),
          hr: sellPrice(p.role) / H,
          th: p.duration * H,
          tc: p.duration * sellPrice(p.role),
        }));
        return {
          ...sq,
          monthly,
          total,
          pCalc,
          th: sq.profiles.reduce((s, p) => s + p.duration * H, 0),
        };
      }),
    [squads, sellPrice, costPrice],
  );

  const gm = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        calc.reduce((s, sq) => s + sq.monthly[i], 0),
      ),
    [calc],
  );
  const gt = gm.reduce((a, b) => a + b, 0); // Total investment (selling price)
  const am = gm.filter((v) => v > 0).length;
  const avg = am > 0 ? gt / am : 0;
  const th = calc.reduce((s, sq) => s + sq.th, 0);

  // ─── Total COST (direct labor cost) ──
  const totalCostLabor = useMemo(
    () =>
      squads.reduce(
        (total, sq) =>
          total +
          sq.profiles.reduce((s, p) => s + p.duration * costPrice(p.role), 0),
        0,
      ),
    [squads, costPrice],
  );

  // ─── DRE calculations ──
  const D = useMemo(() => {
    const grossRev = gt; // = Total Investment (selling price)
    const discounts = dreDiscount;
    const netRev = grossRev - discounts;
    const labor = totalCostLabor; // cost price
    const grossProfit = netRev - labor;
    const grossMargin = netRev ? grossProfit / netRev : 0;

    const commission = netRev * commPct;
    const ga = netRev * gaPct;
    const totalOPEX = commission + ga;
    const ebit = grossProfit - totalOPEX;
    const netMargin = netRev ? ebit / netRev : 0;

    // Taxes
    let taxes = 0,
      taxDetail = {};
    if (cur === "USD") {
      taxes = ebit > 0 ? ebit * 0.21 : 0;
      taxDetail = { usd: taxes };
    } else {
      // Lucro Presumido — calculated on Gross Revenue
      const iss = grossRev * LP.iss;
      const pis = grossRev * LP.pis;
      const cofins = grossRev * LP.cofins;
      const csll = grossRev * LP.csll;
      const irrf = grossRev * LP.irrf;
      taxes = iss + pis + cofins + csll + irrf;
      taxDetail = { iss, pis, cofins, csll, irrf };
    }

    const net = ebit - taxes;
    const netAfterMargin = netRev ? net / netRev : 0;

    return {
      grossRev,
      discounts,
      netRev,
      labor,
      grossProfit,
      grossMargin,
      commission,
      ga,
      totalOPEX,
      ebit,
      netMargin,
      taxes,
      taxDetail,
      net,
      netAfterMargin,
    };
  }, [gt, dreDiscount, totalCostLabor, commPct, gaPct, cur]);

  const fmt = useCallback(
    (v, d = 0) => {
      const n = v || 0;
      if (cur === "USD")
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: d,
          minimumFractionDigits: d,
        }).format(n);
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: d,
        minimumFractionDigits: d,
      }).format(n);
    },
    [cur],
  );

  const fmtPct = (v) => `${(v * 100).toFixed(1)}%`;
  const sc = (v) =>
    v > 0 ? "var(--green)" : v < 0 ? "var(--red)" : "var(--g3)";

  // handlers
  const addSq = () => {
    const n = squads.length + 1;
    const s = {
      id: uid(),
      name: `Squad ${n}`,
      project: `Project ${n}`,
      profiles: [],
    };
    setSquads((p) => [...p, s]);
    setOpen((p) => ({ ...p, [s.id]: true }));
  };
  const rmSq = (id) => setSquads((p) => p.filter((s) => s.id !== id));
  const upSq = (id, f, v) =>
    setSquads((p) => p.map((s) => (s.id === id ? { ...s, [f]: v } : s)));
  const addP = (sid) =>
    setSquads((p) =>
      p.map((s) =>
        s.id !== sid
          ? s
          : {
              ...s,
              profiles: [
                ...s.profiles,
                {
                  id: uid(),
                  role: "AI Engineer JR",
                  startMonth: 1,
                  duration: 1,
                },
              ],
            },
      ),
    );
  const rmP = (sid, pid) =>
    setSquads((p) =>
      p.map((s) =>
        s.id !== sid
          ? s
          : { ...s, profiles: s.profiles.filter((p) => p.id !== pid) },
      ),
    );
  const upP = (sid, pid, f, v) =>
    setSquads((p) =>
      p.map((s) =>
        s.id !== sid
          ? s
          : {
              ...s,
              profiles: s.profiles.map((p) =>
                p.id === pid ? { ...p, [f]: v } : p,
              ),
            },
      ),
    );

  const cd = gm.map((v, i) => ({ m: `M${i + 1}`, v }));

  // ─── DRE row renderers (closures) ──
  const sec = (lbl) => (
    <tr className="dre-sec" key={`sec-${lbl}`}>
      <td colSpan={3}>{lbl}</td>
    </tr>
  );

  const row = (key, label, value, opts = {}) => {
    const {
      indent = false,
      bold = false,
      hl = false,
      signed = false,
      pctVal = null,
      auto = false,
      editDiscount = false,
      editPct = false,
      pctState = null,
      setPct = null,
      calcValue = null,
    } = opts;
    const vc = signed ? sc(value) : bold ? "var(--g7)" : "var(--g5)";
    return (
      <tr
        key={key}
        className={`${hl ? "dre-hl" : ""} ${bold ? "dre-bold" : ""}`}
      >
        <td
          style={{
            paddingLeft: indent ? 32 : 18,
            color: bold ? "var(--g7)" : "var(--g5)",
          }}
        >
          {label}
          {auto && <span className="auto-tag">auto</span>}
        </td>
        <td>
          {editDiscount ? (
            <input
              className="dre-pct-in"
              style={{ width: 140 }}
              type="number"
              step="any"
              min="0"
              value={dreDiscount}
              onChange={(e) => setDreDiscount(parseFloat(e.target.value) || 0)}
              onFocus={(e) => (e.target.style.borderColor = "var(--g4)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--g1)")}
            />
          ) : editPct ? (
            <div className="pct-row">
              <input
                className="dre-pct-in"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={(pctState * 100).toFixed(1)}
                onChange={(e) =>
                  setPct((parseFloat(e.target.value) || 0) / 100)
                }
                onFocus={(e) => (e.target.style.borderColor = "var(--g4)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--g1)")}
              />
              <span className="dre-pct-lbl">%</span>
              <span
                className="dre-val-calc"
                style={{
                  color: "var(--g5)",
                  minWidth: 120,
                  textAlign: "right",
                }}
              >
                {fmt(calcValue)}
              </span>
            </div>
          ) : (
            <span
              style={{
                fontFamily: "var(--fm)",
                fontSize: bold ? 13 : 12,
                fontWeight: bold ? 500 : 300,
                color: vc,
              }}
            >
              {fmt(value)}
            </span>
          )}
        </td>
        <td
          style={{
            color:
              pctVal !== null
                ? pctVal >= 0
                  ? "var(--green)"
                  : "var(--red)"
                : "var(--g3)",
          }}
        >
          {pctVal !== null ? fmtPct(pctVal) : ""}
        </td>
      </tr>
    );
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* HEADER */}
        <div className="hd no-print">
          <div className="logo">
            <div className="logo-mark">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 2C5.8 2 4 3.8 4 6C4 7.6 5 8.9 6.4 9.4L8 10L9.6 9.4C11 8.9 12 7.6 12 6C12 3.8 10.2 2 8 2Z"
                  fill="#444"
                />
                <path
                  d="M6.4 9.4C4.8 10.2 3.2 11.6 3.2 13.6H8L9.6 12.8L8 10Z"
                  fill="#666"
                />
              </svg>
            </div>
            bonding<span className="logo-ai">AI</span>
            <span className="logo-sep">·</span>
            <span className="logo-sub">Service Calculator</span>
          </div>
          <div className="hr-right">
            {cur === "BRL" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="rate-lbl">USD/BRL</span>
                <input
                  className="rate-in"
                  type="number"
                  step="0.01"
                  value={rate}
                  onChange={(e) =>
                    setRate(parseFloat(e.target.value) || DR_RATE)
                  }
                />
              </div>
            )}
            <div className="cur-grp">
              <button
                className={`cur-btn ${cur === "USD" ? "on" : ""}`}
                onClick={() => setCur("USD")}
              >
                USD
              </button>
              <button
                className={`cur-btn ${cur === "BRL" ? "on" : ""}`}
                onClick={() => setCur("BRL")}
              >
                BRL
              </button>
            </div>
            <button className="btn-exp" onClick={() => window.print()}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs no-print">
          {[
            ["est", "Estimator"],
            ["sum", "Executive Summary"],
            ["dre", "DRE"],
          ].map(([k, l]) => (
            <button
              key={k}
              className={`tab ${tab === k ? "on" : ""}`}
              onClick={() => setTab(k)}
            >
              {l}
            </button>
          ))}
        </div>

        {/* ── ESTIMATOR ── */}
        {tab === "est" && (
          <div className="ct no-print">
            <div className="g2 mb18">
              <div className="card">
                <div className="card-hd">
                  <span className="ctitle">Proposal Info</span>
                </div>
                <div style={{ padding: 14 }}>
                  <div className="frow">
                    <div className="fg">
                      <label className="flbl">Owner</label>
                      <input
                        className="fin"
                        value={prop.owner}
                        onChange={(e) =>
                          setProp((p) => ({ ...p, owner: e.target.value }))
                        }
                      />
                    </div>
                    <div className="fg">
                      <label className="flbl">Version</label>
                      <input
                        className="fin"
                        value={prop.version}
                        onChange={(e) =>
                          setProp((p) => ({ ...p, version: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="frow">
                    <div className="fg">
                      <label className="flbl">Customer</label>
                      <input
                        className="fin"
                        placeholder="Name"
                        value={prop.customer}
                        onChange={(e) =>
                          setProp((p) => ({ ...p, customer: e.target.value }))
                        }
                      />
                    </div>
                    <div className="fg">
                      <label className="flbl">Country</label>
                      <input
                        className="fin"
                        placeholder="e.g. USA"
                        value={prop.country}
                        onChange={(e) =>
                          setProp((p) => ({ ...p, country: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="frow">
                    <div className="fg">
                      <label className="flbl">Industry</label>
                      <input
                        className="fin"
                        placeholder="e.g. FinTech"
                        value={prop.industry}
                        onChange={(e) =>
                          setProp((p) => ({ ...p, industry: e.target.value }))
                        }
                      />
                    </div>
                    <div className="fg">
                      <label className="flbl">Program Type</label>
                      <input
                        className="fin"
                        value={prop.type}
                        onChange={(e) =>
                          setProp((p) => ({ ...p, type: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="fg">
                    <label className="flbl">Scope</label>
                    <input
                      className="fin"
                      placeholder="Brief description…"
                      value={prop.scope}
                      onChange={(e) =>
                        setProp((p) => ({ ...p, scope: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                <div
                  className="mrow"
                  style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 10 }}
                >
                  <div className="mc">
                    <div className="mlbl">Total Investment</div>
                    <div className="mval">{fmt(gt)}</div>
                    <div className="msub">{cur}</div>
                  </div>
                  <div className="mc">
                    <div className="mlbl">Monthly Avg</div>
                    <div className="mval">{fmt(avg)}</div>
                    <div className="msub">{am} active mo.</div>
                  </div>
                  <div className="mc">
                    <div className="mlbl">Total Hours</div>
                    <div className="mval" style={{ fontSize: 18 }}>
                      {th.toLocaleString()}
                    </div>
                    <div className="msub">hrs allocated</div>
                  </div>
                  <div className="mc">
                    <div className="mlbl">Profiles</div>
                    <div className="mval" style={{ fontSize: 18 }}>
                      {squads.reduce((s, sq) => s + sq.profiles.length, 0)}
                    </div>
                    <div className="msub">
                      across {squads.length} squad
                      {squads.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                {gt > 0 && (
                  <div className="card" style={{ padding: "12px 10px 6px" }}>
                    <div
                      className="ctitle"
                      style={{ paddingLeft: 4, marginBottom: 8 }}
                    >
                      Monthly Timeline · {cur}
                    </div>
                    <ResponsiveContainer width="100%" height={88}>
                      <BarChart
                        data={cd}
                        margin={{ top: 0, right: 4, left: 0, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="m"
                          tick={{
                            fill: "var(--g2)",
                            fontSize: 9,
                            fontFamily: "Roboto Mono",
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          content={({ active, payload, label }) =>
                            active && payload?.length ? (
                              <div className="tt">
                                <div className="ttl">{label}</div>
                                <div className="ttv">
                                  {fmt(payload[0].value)}
                                </div>
                              </div>
                            ) : null
                          }
                        />
                        <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                          {cd.map((d, i) => (
                            <Cell
                              key={i}
                              fill={d.v > 0 ? "var(--g5)" : "var(--g1)"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            <div className="sh">
              <span className="stitle">Squad Builder</span>
              <button className="btn btn-w" onClick={addSq}>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Squad
              </button>
            </div>

            {squads.map((sq, idx) => {
              const sc2 = calc.find((s) => s.id === sq.id);
              const isOpen = !!open[sq.id];
              return (
                <div className="sq-card" key={sq.id}>
                  <div
                    className="sq-hd"
                    onClick={() =>
                      setOpen((p) => ({ ...p, [sq.id]: !p[sq.id] }))
                    }
                  >
                    <span className="sq-idx">{idx + 1}</span>
                    <input
                      className="sq-ni"
                      value={sq.name}
                      onChange={(e) => {
                        e.stopPropagation();
                        upSq(sq.id, "name", e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Squad name"
                    />
                    {sc2?.total > 0 && (
                      <span className="sq-tot">{fmt(sc2.total)}</span>
                    )}
                    <button
                      className="bgh"
                      style={{ marginLeft: 5 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        rmSq(sq.id);
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--g2)"
                      strokeWidth="2"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "none",
                        transition: ".18s",
                        flexShrink: 0,
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  {isOpen && (
                    <div className="sq-body">
                      <div className="sq-meta">
                        <div className="fg">
                          <label className="flbl">Project Name</label>
                          <input
                            className="fin"
                            style={{ fontSize: 12, padding: "6px 9px" }}
                            value={sq.project}
                            onChange={(e) =>
                              upSq(sq.id, "project", e.target.value)
                            }
                            placeholder="Project name"
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            paddingBottom: 1,
                          }}
                        >
                          <span style={{ fontSize: 10, color: "var(--g2)" }}>
                            {sq.profiles.length} profile
                            {sq.profiles.length !== 1 ? "s" : ""} ·{" "}
                            {sc2?.th.toLocaleString() || 0} hrs
                          </span>
                        </div>
                      </div>
                      {sq.profiles.length > 0 && (
                        <>
                          <div className="pg-hd">
                            <span>Role</span>
                            <span style={{ textAlign: "center" }}>Start</span>
                            <span style={{ textAlign: "center" }}>Months</span>
                            <span style={{ textAlign: "right" }}>
                              Sell / Cost
                            </span>
                            <span />
                          </div>
                          {sq.profiles.map((p) => {
                            const sp = sellPrice(p.role);
                            const cp = costPrice(p.role);
                            return (
                              <div className="pg-row" key={p.id}>
                                <div>
                                  <select
                                    className="rsel"
                                    value={p.role}
                                    onChange={(e) =>
                                      upP(sq.id, p.id, "role", e.target.value)
                                    }
                                  >
                                    {CATS.map((cat) => (
                                      <optgroup key={cat} label={cat}>
                                        {ROLES_LIST.filter(
                                          (r) => r.cat === cat,
                                        ).map((r) => (
                                          <option key={r.name} value={r.name}>
                                            {r.name}
                                          </option>
                                        ))}
                                      </optgroup>
                                    ))}
                                  </select>
                                  <div className="rcost">
                                    {fmt(sp)}/mo sell · {fmt(cp)}/mo cost
                                  </div>
                                </div>
                                <input
                                  className="nin"
                                  type="number"
                                  min="1"
                                  max="12"
                                  value={p.startMonth}
                                  onChange={(e) =>
                                    upP(
                                      sq.id,
                                      p.id,
                                      "startMonth",
                                      Math.min(
                                        12,
                                        Math.max(
                                          1,
                                          parseInt(e.target.value) || 1,
                                        ),
                                      ),
                                    )
                                  }
                                />
                                <div>
                                  <input
                                    className="nin"
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={p.duration}
                                    onChange={(e) =>
                                      upP(
                                        sq.id,
                                        p.id,
                                        "duration",
                                        Math.min(
                                          12,
                                          Math.max(
                                            1,
                                            parseInt(e.target.value) || 1,
                                          ),
                                        ),
                                      )
                                    }
                                  />
                                  <div
                                    style={{
                                      fontSize: 9,
                                      color: "var(--g2)",
                                      textAlign: "center",
                                      marginTop: 2,
                                    }}
                                  >
                                    {p.duration * H}h
                                  </div>
                                </div>
                                <div
                                  style={{
                                    textAlign: "right",
                                    fontFamily: "var(--fm)",
                                    fontSize: 11,
                                    color: "var(--g5)",
                                    fontWeight: 300,
                                    paddingTop: 6,
                                  }}
                                >
                                  {fmt(sp)}
                                </div>
                                <button
                                  className="bgh"
                                  style={{ marginTop: 4 }}
                                  onClick={() => rmP(sq.id, p.id)}
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                </button>
                              </div>
                            );
                          })}
                        </>
                      )}
                      <button className="badd" onClick={() => addP(sq.id)}>
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Profile
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {squads.length === 0 && (
              <div className="empty">
                <div style={{ fontSize: 24 }}>◻</div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--g3)",
                    margin: "8px 0 4px",
                  }}
                >
                  No squads yet
                </div>
                <div style={{ fontSize: 11 }}>
                  Click "Add Squad" to get started
                </div>
              </div>
            )}

            {gt > 0 && (
              <div className="card" style={{ marginTop: 20 }}>
                <div className="card-hd">
                  <span className="ctitle">Monthly Cost Breakdown · {cur}</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="dt" style={{ minWidth: 920 }}>
                    <thead>
                      <tr>
                        <th>Squad</th>
                        {Array.from({ length: 12 }, (_, i) => (
                          <th key={i}>M{i + 1}</th>
                        ))}
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calc.map((sq) => (
                        <tr key={sq.id}>
                          <td>{sq.name}</td>
                          {sq.monthly.map((v, i) => (
                            <td key={i} className={v > 0 ? "av" : "z"}>
                              {v > 0 ? fmt(v) : "—"}
                            </td>
                          ))}
                          <td className="av" style={{ fontWeight: 500 }}>
                            {fmt(sq.total)}
                          </td>
                        </tr>
                      ))}
                      <tr className="tr">
                        <td>TOTAL</td>
                        {gm.map((v, i) => (
                          <td key={i} className={v > 0 ? "" : "z"}>
                            {v > 0 ? fmt(v) : "—"}
                          </td>
                        ))}
                        <td>{fmt(gt)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── EXECUTIVE SUMMARY ── */}
        {tab === "sum" && (
          <div className="ct no-print">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 18,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "var(--w)",
                    letterSpacing: "-.01em",
                  }}
                >
                  Executive Summary
                </div>
                <div style={{ fontSize: 12, color: "var(--g3)", marginTop: 2 }}>
                  {prop.customer || "—"}
                  {prop.scope ? " · " + prop.scope : ""}
                </div>
              </div>
              <button className="btn btn-w" onClick={() => window.print()}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export PDF
              </button>
            </div>
            <div className="mrow mb18">
              <div className="mc">
                <div className="mlbl">Total Investment</div>
                <div className="mval">{fmt(gt) || "—"}</div>
                <div className="msub">{cur}</div>
              </div>
              <div className="mc">
                <div className="mlbl">Monthly Average</div>
                <div className="mval">{fmt(avg) || "—"}</div>
                <div className="msub">per active month</div>
              </div>
              <div className="mc">
                <div className="mlbl">Active Months</div>
                <div className="mval" style={{ fontSize: 18 }}>
                  {am || "—"}
                </div>
                <div className="msub">of 12</div>
              </div>
              <div className="mc">
                <div className="mlbl">Total Hours</div>
                <div className="mval" style={{ fontSize: 18 }}>
                  {th > 0 ? th.toLocaleString() : "—"}
                </div>
                <div className="msub">hrs allocated</div>
              </div>
            </div>
            {gt > 0 ? (
              <>
                <div className="card mb18" style={{ padding: "14px 14px 8px" }}>
                  <div className="ctitle" style={{ marginBottom: 12 }}>
                    Monthly Investment Timeline · {cur}
                  </div>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart
                      data={cd}
                      margin={{ top: 2, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="var(--g1)"
                        strokeDasharray="0"
                      />
                      <XAxis
                        dataKey="m"
                        tick={{
                          fill: "var(--g2)",
                          fontSize: 10,
                          fontFamily: "Roboto Mono",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{
                          fill: "var(--g2)",
                          fontSize: 9,
                          fontFamily: "Roboto Mono",
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) =>
                          v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                        }
                        width={40}
                      />
                      <Tooltip
                        content={({ active, payload, label }) =>
                          active && payload?.length ? (
                            <div className="tt">
                              <div className="ttl">{label}</div>
                              <div className="ttv">{fmt(payload[0].value)}</div>
                            </div>
                          ) : null
                        }
                      />
                      <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                        {cd.map((d, i) => (
                          <Cell
                            key={i}
                            fill={d.v > 0 ? "var(--g6)" : "var(--g1)"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="stitle mb14">Squad Breakdown</div>
                {calc
                  .filter((sq) => sq.profiles.length > 0)
                  .map((sq) => (
                    <div className="ss-card" key={sq.id}>
                      <div className="ss-hd">
                        <div>
                          <div className="ss-name">{sq.name}</div>
                          <div className="ss-proj">{sq.project}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="ss-tot">{fmt(sq.total)}</div>
                          <div className="ss-hrs">
                            {sq.th.toLocaleString()} hrs total
                          </div>
                        </div>
                      </div>
                      <div style={{ overflowX: "auto" }}>
                        <table className="dt">
                          <thead>
                            <tr>
                              <th>Profile / Role</th>
                              <th>Start</th>
                              <th>Duration</th>
                              <th>Total Hrs</th>
                              <th>Sell/hr</th>
                              <th>Sell/mo</th>
                              <th>Total (sell)</th>
                              {Array.from({ length: 12 }, (_, i) => (
                                <th key={i}>M{i + 1}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sq.pCalc.map((p) => (
                              <tr key={p.id}>
                                <td
                                  style={{
                                    color: "var(--g7)",
                                    fontWeight: 500,
                                  }}
                                >
                                  {p.role}
                                </td>
                                <td>M{p.startMonth}</td>
                                <td>{p.duration}mo</td>
                                <td className="av">{p.th.toLocaleString()}</td>
                                <td>{fmt(p.hr, 2)}/hr</td>
                                <td>{fmt(p.sellMc)}</td>
                                <td className="av" style={{ fontWeight: 500 }}>
                                  {fmt(p.tc)}
                                </td>
                                {Array.from({ length: 12 }, (_, mi) => {
                                  const e = p.startMonth + p.duration - 1;
                                  const a =
                                    mi + 1 >= p.startMonth && mi + 1 <= e;
                                  return (
                                    <td key={mi} className={a ? "av" : "z"}>
                                      {a ? fmt(p.sellMc) : "—"}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                            <tr className="tr">
                              <td>SQUAD TOTAL</td>
                              <td>—</td>
                              <td>—</td>
                              <td>{sq.th.toLocaleString()}</td>
                              <td>—</td>
                              <td>—</td>
                              <td>{fmt(sq.total)}</td>
                              {sq.monthly.map((v, i) => (
                                <td key={i} className={v > 0 ? "" : "z"}>
                                  {v > 0 ? fmt(v) : "—"}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                <div className="card" style={{ marginTop: 4 }}>
                  <div className="card-hd">
                    <span className="ctitle">
                      Consolidated · All Squads · {cur}
                    </span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className="dt" style={{ minWidth: 920 }}>
                      <thead>
                        <tr>
                          <th>Squad / Project</th>
                          {Array.from({ length: 12 }, (_, i) => (
                            <th key={i}>M{i + 1}</th>
                          ))}
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calc.map((sq) => (
                          <tr key={sq.id}>
                            <td>
                              {sq.name} — {sq.project}
                            </td>
                            {sq.monthly.map((v, i) => (
                              <td key={i} className={v > 0 ? "av" : "z"}>
                                {v > 0 ? fmt(v) : "—"}
                              </td>
                            ))}
                            <td className="av" style={{ fontWeight: 500 }}>
                              {fmt(sq.total)}
                            </td>
                          </tr>
                        ))}
                        <tr className="tr">
                          <td>TOTAL</td>
                          {gm.map((v, i) => (
                            <td key={i} className={v > 0 ? "" : "z"}>
                              {v > 0 ? fmt(v) : "—"}
                            </td>
                          ))}
                          <td>{fmt(gt)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty">
                <div style={{ fontSize: 24 }}>◻</div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--g3)",
                    margin: "8px 0 4px",
                  }}
                >
                  No squads configured yet
                </div>
                <div style={{ fontSize: 11 }}>
                  Go to Estimator and add squads with profiles to see the
                  summary
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── DRE ── */}
        {tab === "dre" && (
          <div className="ct no-print">
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--w)",
                  letterSpacing: "-.01em",
                }}
              >
                Financial Results — DRE
              </div>
              <div style={{ fontSize: 12, color: "var(--g3)", marginTop: 2 }}>
                Gross Revenue and Direct Labor pulled from Estimator
                automatically.
                {cur === "BRL"
                  ? " Taxes: Lucro Presumido."
                  : " Taxes: 21% on EBIT (US estimate)."}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "660px 1fr",
                gap: 20,
                alignItems: "start",
              }}
            >
              {/* DRE TABLE */}
              <div className="card" style={{ overflow: "hidden" }}>
                <table className="dre-t">
                  <thead>
                    <tr>
                      <td className="dre-col" style={{ width: "46%" }}>
                        Line Item
                      </td>
                      <td
                        className="dre-col"
                        style={{ textAlign: "right", width: "34%" }}
                      >
                        Value · {cur}
                      </td>
                      <td
                        className="dre-col"
                        style={{ textAlign: "right", width: "20%" }}
                      >
                        % Net Rev.
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {sec("Revenue")}
                    {row("gr", "Gross Revenue", D.grossRev, {
                      bold: true,
                      hl: true,
                      auto: true,
                    })}
                    {row("di", "Discounts", dreDiscount, {
                      indent: true,
                      editDiscount: true,
                    })}
                    {row("nr", "Net Revenue", D.netRev, {
                      bold: true,
                      hl: true,
                      signed: true,
                      pctVal: 1,
                    })}

                    {sec("COGS")}
                    {row("lb", "Direct Labor (cost price)", D.labor, {
                      indent: true,
                      auto: true,
                    })}
                    {row("gp", "Gross Profit", D.grossProfit, {
                      bold: true,
                      hl: true,
                      signed: true,
                      pctVal: D.grossMargin,
                    })}

                    {sec("Operating Expenses")}
                    {row("cm", "Sales Commission", D.commission, {
                      indent: true,
                      editPct: true,
                      pctState: commPct,
                      setPct: setCommPct,
                      calcValue: D.commission,
                      pctVal: commPct,
                    })}
                    {row("ga", "General & Administrative", D.ga, {
                      indent: true,
                      editPct: true,
                      pctState: gaPct,
                      setPct: setGaPct,
                      calcValue: D.ga,
                      pctVal: gaPct,
                    })}
                    {row("to", "Total OPEX", D.totalOPEX, {
                      bold: true,
                      hl: true,
                      pctVal: D.netRev ? D.totalOPEX / D.netRev : 0,
                    })}

                    {row("eb", "EBIT — Operating Income", D.ebit, {
                      bold: true,
                      hl: true,
                      signed: true,
                      pctVal: D.netMargin,
                    })}

                    {sec(
                      cur === "BRL"
                        ? "Taxes — Lucro Presumido (on Gross Revenue)"
                        : "Taxes",
                    )}
                    {cur === "USD" ? (
                      row("tx", "Income Tax (21% on EBIT)", D.taxes, {
                        indent: true,
                        pctVal: D.netRev ? D.taxes / D.netRev : 0,
                      })
                    ) : (
                      <>
                        {row(
                          "t1",
                          `ISS — ${fmtPct(LP.iss)} s/ receita bruta`,
                          D.taxDetail.iss,
                          { indent: true },
                        )}
                        {row(
                          "t2",
                          `PIS — ${fmtPct(LP.pis)} s/ receita bruta`,
                          D.taxDetail.pis,
                          { indent: true },
                        )}
                        {row(
                          "t3",
                          `COFINS — ${fmtPct(LP.cofins)} s/ receita bruta`,
                          D.taxDetail.cofins,
                          { indent: true },
                        )}
                        {row(
                          "t4",
                          `CSLL — ${fmtPct(LP.csll)} s/ receita bruta`,
                          D.taxDetail.csll,
                          { indent: true },
                        )}
                        {row(
                          "t5",
                          `IRrf — ${fmtPct(LP.irrf)} s/ receita bruta`,
                          D.taxDetail.irrf,
                          { indent: true },
                        )}
                        {row("tt", "Total Taxes", D.taxes, {
                          bold: true,
                          hl: true,
                          pctVal: D.netRev ? D.taxes / D.netRev : 0,
                        })}
                      </>
                    )}

                    {sec("Net Result")}
                    {row("ni", "Net Income", D.net, {
                      bold: true,
                      hl: true,
                      signed: true,
                      pctVal: D.netAfterMargin,
                    })}
                    {row("mn", "Margin (value)", D.net, {
                      indent: true,
                      signed: true,
                    })}
                    {row("mp", "Margin (%)", null, { indent: true })}
                  </tbody>
                </table>
                {/* Margin % standalone row */}
              </div>

              {/* KPIs */}
              <div>
                <div
                  className="mrow"
                  style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}
                >
                  {[
                    ["Gross Revenue", D.grossRev, false, null],
                    ["Net Revenue", D.netRev, true, null],
                    [
                      "Gross Profit",
                      D.grossProfit,
                      true,
                      `Margin: ${fmtPct(D.grossMargin)}`,
                    ],
                    [
                      "EBIT",
                      D.ebit,
                      true,
                      `EBIT margin: ${fmtPct(D.netMargin)}`,
                    ],
                    [
                      "Total Taxes",
                      D.taxes,
                      false,
                      cur === "BRL" ? "Lucro Presumido" : "21% on EBIT",
                    ],
                    [
                      "Net Income",
                      D.net,
                      true,
                      `Net margin: ${fmtPct(D.netAfterMargin)}`,
                    ],
                  ].map(([lbl, val, signed, sub]) => (
                    <div className="mc" key={lbl}>
                      <div className="mlbl">{lbl}</div>
                      <div
                        className="mval"
                        style={{
                          fontSize: 18,
                          color: signed
                            ? val >= 0
                              ? "var(--green)"
                              : "var(--red)"
                            : "var(--w)",
                        }}
                      >
                        {fmt(val)}
                      </div>
                      {sub && <div className="msub">{sub}</div>}
                    </div>
                  ))}
                </div>
                {/* Margin summary card */}
                <div
                  className="card"
                  style={{ marginTop: 10, overflow: "hidden" }}
                >
                  <div className="card-hd">
                    <span className="ctitle">Margin Summary</span>
                  </div>
                  <div style={{ padding: "0" }}>
                    {[
                      ["Gross Profit Margin", D.grossMargin, D.grossProfit],
                      ["EBIT Margin", D.netMargin, D.ebit],
                      ["Net Income Margin", D.netAfterMargin, D.net],
                    ].map(([lbl, pct, val]) => (
                      <div
                        key={lbl}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 16px",
                          borderBottom: "1px solid #0d0d0d",
                        }}
                      >
                        <span style={{ fontSize: 12, color: "var(--g5)" }}>
                          {lbl}
                        </span>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontFamily: "var(--fm)",
                              fontSize: 16,
                              fontWeight: 300,
                              color: val >= 0 ? "var(--green)" : "var(--red)",
                            }}
                          >
                            {fmtPct(pct)}
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--fm)",
                              fontSize: 11,
                              color: "var(--g3)",
                              marginTop: 2,
                            }}
                          >
                            {fmt(val)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRINT */}
        <div className="po pdf">
          <div className="pdf-hd">
            <div>
              <div className="pdf-logo">
                bonding<span className="pdf-logo-ai">AI</span>
              </div>
              <div className="pdf-tag">
                The AIOS for Enterprises · Service Proposal
              </div>
            </div>
            <div className="pdf-dt">
              {prop.date} · {prop.version}
            </div>
          </div>
          <div className="pdf-sec">
            <div className="pdf-st">Proposal Details</div>
            <div className="pdf-ig">
              <div>
                <div className="pdf-il">Owner</div>
                <div className="pdf-iv">{prop.owner}</div>
              </div>
              <div>
                <div className="pdf-il">Customer</div>
                <div className="pdf-iv">{prop.customer || "—"}</div>
              </div>
              <div>
                <div className="pdf-il">Country · Industry</div>
                <div className="pdf-iv">
                  {[prop.country, prop.industry].filter(Boolean).join(" · ") ||
                    "—"}
                </div>
              </div>
              <div>
                <div className="pdf-il">Program Type</div>
                <div className="pdf-iv">{prop.type}</div>
              </div>
              <div>
                <div className="pdf-il">Currency</div>
                <div className="pdf-iv">
                  {cur}
                  {cur === "BRL" ? ` (rate: ${rate})` : ""}
                </div>
              </div>
              <div>
                <div className="pdf-il">Active Months</div>
                <div className="pdf-iv">{am} months</div>
              </div>
            </div>
            {prop.scope && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 10,
                  color: "#555",
                  background: "#f9f9f9",
                  padding: "7px 10px",
                  borderRadius: 4,
                  borderLeft: "2px solid #bbb",
                }}
              >
                <b>Scope:</b> {prop.scope}
              </div>
            )}
          </div>
          <div className="pdf-sec">
            <div className="pdf-st">Commercial Summary</div>
            <div className="pdf-kpis">
              <div className="pdf-kpi">
                <div className="pdf-kl">Total Investment</div>
                <div className="pdf-kv">{fmt(gt)}</div>
              </div>
              <div className="pdf-kpi">
                <div className="pdf-kl">Monthly Average</div>
                <div className="pdf-kv">{fmt(avg)}</div>
              </div>
              <div className="pdf-kpi">
                <div className="pdf-kl">Net Income</div>
                <div className="pdf-kv">{fmt(D.net)}</div>
              </div>
              <div className="pdf-kpi">
                <div className="pdf-kl">Net Margin</div>
                <div className="pdf-kv">{fmtPct(D.netAfterMargin)}</div>
              </div>
            </div>
          </div>
          <div className="pdf-sec">
            <div className="pdf-st">Financial Results (DRE) · {cur}</div>
            <table className="pdf-t" style={{ maxWidth: 480 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Item</th>
                  <th>Value</th>
                  <th>% Net Rev.</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Gross Revenue", D.grossRev, null],
                  ["Discounts", D.discounts, null],
                  ["Net Revenue", D.netRev, 1],
                  [
                    "Direct Labor (cost)",
                    D.labor,
                    D.netRev ? D.labor / D.netRev : 0,
                  ],
                  ["Gross Profit", D.grossProfit, D.grossMargin],
                  ["Sales Commission", D.commission, commPct],
                  ["G&A", D.ga, gaPct],
                  [
                    "Total OPEX",
                    D.totalOPEX,
                    D.netRev ? D.totalOPEX / D.netRev : 0,
                  ],
                  ["EBIT", D.ebit, D.netMargin],
                  ["Total Taxes", D.taxes, D.netRev ? D.taxes / D.netRev : 0],
                  ["Net Income", D.net, D.netAfterMargin],
                ].map(([l, v, p]) => (
                  <tr key={l}>
                    <td>{l}</td>
                    <td>{fmt(v)}</td>
                    <td>{p !== null && p !== undefined ? fmtPct(p) : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pdf-sec">
            <div className="pdf-st">Squad Breakdown</div>
            {calc
              .filter((sq) => sq.profiles.length > 0)
              .map((sq) => (
                <div className="pdf-sblk" key={sq.id}>
                  <div className="pdf-sname">
                    {sq.name} — {sq.project} | {fmt(sq.total)} |{" "}
                    {sq.th.toLocaleString()} hrs
                  </div>
                  <table className="pdf-t">
                    <thead>
                      <tr>
                        <th>Profile</th>
                        <th>Start</th>
                        <th>Dur.</th>
                        <th>Hrs</th>
                        <th>Sell/hr</th>
                        <th>Sell/mo</th>
                        <th>Total</th>
                        {Array.from({ length: 12 }, (_, i) => (
                          <th key={i}>M{i + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sq.pCalc.map((p) => (
                        <tr key={p.id}>
                          <td>{p.role}</td>
                          <td>M{p.startMonth}</td>
                          <td>{p.duration}mo</td>
                          <td>{p.th.toLocaleString()}</td>
                          <td>{fmt(p.hr, 2)}</td>
                          <td>{fmt(p.sellMc)}</td>
                          <td style={{ fontWeight: 600 }}>{fmt(p.tc)}</td>
                          {Array.from({ length: 12 }, (_, mi) => {
                            const e = p.startMonth + p.duration - 1;
                            const a = mi + 1 >= p.startMonth && mi + 1 <= e;
                            return (
                              <td key={mi} className={a ? "" : "pz"}>
                                {a ? fmt(p.sellMc) : "—"}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      <tr className="ptt">
                        <td>TOTAL</td>
                        <td />
                        <td />
                        <td>{sq.th.toLocaleString()}</td>
                        <td>—</td>
                        <td>—</td>
                        <td>{fmt(sq.total)}</td>
                        {sq.monthly.map((v, i) => (
                          <td key={i} className={v > 0 ? "" : "pz"}>
                            {v > 0 ? fmt(v) : "—"}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
          </div>
          <div className="pdf-foot">
            <span>bondingAI AIOS · Service Proposal · Confidential</span>
            <span>{prop.date}</span>
          </div>
        </div>
      </div>
    </>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
