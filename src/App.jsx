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
import {
  ROLES,
  CATS,
  COST_USD,
  COST_BRL,
  H,
  DR_RATE,
  LP,
  uid,
  INIT_SQUADS,
} from "./data/constants";

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
    (name) => {
      const roleItem = ROLES.find((r) => r.name === name);
      if (!roleItem) return 0;
      return cur === "USD" ? roleItem.usd || 0 : roleItem.brl || 0;
    },
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
                onChange={(e) => setRate(parseFloat(e.target.value) || DR_RATE)}
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
                    across {squads.length} squad{squads.length !== 1 ? "s" : ""}
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
                              <div className="ttv">{fmt(payload[0].value)}</div>
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
                  onClick={() => setOpen((p) => ({ ...p, [sq.id]: !p[sq.id] }))}
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
                                      {ROLES.filter((r) => r.cat === cat).map(
                                        (r) => (
                                          <option key={r.name} value={r.name}>
                                            {r.name}
                                          </option>
                                        ),
                                      )}
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
              <div className="table-scroll">
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
                    <div className="table-scroll">
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
                                style={{ color: "var(--g7)", fontWeight: 500 }}
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
                                const a = mi + 1 >= p.startMonth && mi + 1 <= e;
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
                <div className="table-scroll">
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
                Go to Estimator and add squads with profiles to see the summary
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

          <div className="dre-grid">
            {/* DRE TABLE */}
            <div className="card dre-scroll">
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
                  ["EBIT", D.ebit, true, `EBIT margin: ${fmtPct(D.netMargin)}`],
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
  );
}
