export const ROLES = [
  { name:"Founder",                    cat:"Leadership",           usd:18401.36, brl:95707.33 },
  { name:"AI Strategy Lead",           cat:"Data & AI",            usd:11001.70, brl:57220.97 },
  { name:"AI Tech Lead",               cat:"Data & AI",            usd:9534.81,  brl:49591.50 },
  { name:"AI Engineer Senior",         cat:"Data & AI",            usd:7319.88,  brl:38071.43 },
  { name:"AI Engineer JR",             cat:"Data & AI",            usd:4834.98,  brl:25147.22 },
  { name:"DevOps",                     cat:"Data & AI",            usd:7009.98,  brl:36459.61 },
  { name:"Cloud Engineer",             cat:"Data & AI",            usd:8001.70,  brl:41617.67 },
  { name:"Data Engineer PL",           cat:"Data & AI",            usd:4834.98,  brl:25147.22 },
  { name:"Data Engineer SR",           cat:"Data & AI",            usd:7734.98,  brl:40230.41 },
  { name:"Data BI Analyst PL",         cat:"Data & AI",            usd:4834.98,  brl:25147.22 },
  { name:"Data BI Analyst SR",         cat:"Data & AI",            usd:7734.98,  brl:40230.41 },
  { name:"Data Architect Senior",      cat:"Data & AI",            usd:7734.98,  brl:40230.41 },
  { name:"Data Architect Specialist",  cat:"Data & AI",            usd:10634.98, brl:55313.60 },
  { name:"Data Governance Specialist", cat:"Data & AI",            usd:7734.98,  brl:40230.41 },
  { name:"Project/PO",                 cat:"Management",           usd:6284.98,  brl:32688.81 },
  { name:"Project Manager",            cat:"Management",           usd:5510.10,  brl:28658.59 },
  { name:"Change Management Lead",     cat:"Management",           usd:6284.98,  brl:32688.81 },
  { name:"Software Architect",         cat:"Software Engineering", usd:8020.34,  brl:41714.60 },
  { name:"Software Engineer Senior",   cat:"Software Engineering", usd:5510.10,  brl:28658.59 },
  { name:"Software Engineer",          cat:"Software Engineering", usd:4452.99,  brl:23160.47 },
  { name:"Software Engineer Medium",   cat:"Software Engineering", usd:3331.62,  brl:17328.09 },
  { name:"Software Engineer Trainee",  cat:"Software Engineering", usd:2340.98,  brl:12175.68 },
  { name:"Salesforce Admin",           cat:"Software Engineering", usd:2804.98,  brl:14588.99 },
  { name:"Tester",                     cat:"Software Engineering", usd:2594.07,  brl:13492.03 },
  { name:"Designer",                   cat:"Design",               usd:4898.78,  brl:25479.06 },
  { name:"UI/UX Senior Designer",      cat:"Design",               usd:2578.35,  brl:13410.24 },
  { name:"UI/UX Medium Designer",      cat:"Design",               usd:2055.01,  brl:10688.32 },
  { name:"UI/UX Trainee Designer",     cat:"Design",               usd:1354.98,  brl:7047.39  },
];

// Cost prices (what we pay — column D from price list)
export const COST_USD = {
  "Founder":15000,"AI Strategy Lead":7000,"AI Tech Lead":7000,
  "AI Engineer Senior":4545.45,"AI Engineer JR":3000,"DevOps":4500,
  "Cloud Engineer":5000,"Data Engineer PL":3000,"Data Engineer SR":5000,
  "Data BI Analyst PL":3000,"Data BI Analyst SR":5000,"Data Architect Senior":5000,
  "Data Architect Specialist":7000,"Data Governance Specialist":5000,
  "Project/PO":4000,"Project Manager":3465.60,"Change Management Lead":4000,
  "Software Architect":5196.80,"Software Engineer Senior":3465.60,"Software Engineer":3090.91,
  "Software Engineer Medium":1963.20,"Software Engineer Trainee":1280,
  "Salesforce Admin":1600,"Tester":1454.55,"Designer":2727.27,
  "UI/UX Senior Designer":1443.70,"UI/UX Medium Designer":1082.78,"UI/UX Trainee Designer":600,
};

export const COST_BRL = {
  "Founder":78016.50,"AI Strategy Lead":36407.70,"AI Tech Lead":36407.70,
  "AI Engineer Senior":23641.34,"AI Engineer JR":15603.30,"DevOps":23404.95,
  "Cloud Engineer":26005.50,"Data Engineer PL":15603.30,"Data Engineer SR":26005.50,
  "Data BI Analyst PL":15603.30,"Data BI Analyst SR":26005.50,"Data Architect Senior":26005.50,
  "Data Architect Specialist":36407.70,"Data Governance Specialist":26005.50,
  "Project/PO":20804.40,"Project Manager":18024.93,"Change Management Lead":20804.40,
  "Software Architect":27029.08,"Software Engineer Senior":18024.93,"Software Engineer":16076.13,
  "Software Engineer Medium":10210.80,"Software Engineer Trainee":6657.41,
  "Salesforce Admin":8321.76,"Tester":7565.24,"Designer":14184.80,
  "UI/UX Senior Designer":7508.83,"UI/UX Medium Designer":5631.65,"UI/UX Trainee Designer":3120.66,
};

export const CATS = [...new Set(ROLES.map(r => r.cat))];
export const H = 160;
export const DR_RATE = 5.2011;

// Lucro Presumido rates (BRL)
export const LP = {
  iss:    0.02,
  pis:    0.0065,
  cofins: 0.03,
  csll:   0.01,
  irrf:   0.015,
};

let _c = 1;
export const uid = () => `i${_c++}`;

export const INIT_SQUADS = [{
  id: uid(), name: "Squad 1", project: "Project 1",
  profiles: [],
}];
