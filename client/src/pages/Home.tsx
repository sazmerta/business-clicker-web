/* Arcade Ledger: neo-brutalist editorial game UI; cream paper, charcoal ink, burnt orange ownership, green growth. */
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Banknote, ChartNoAxesCombined, ChevronRight, CircleHelp, RotateCcw, Sparkles, Store, TrendingUp, WalletCards, Zap } from "lucide-react";

type Asset = { name: string; detail: string; basePrice: number; income: number; icon: string; owned: number };
type GameState = { money: number; clickPower: number; clickUpgradeLevel: number; autoIncome: number; assets: Asset[]; events: string[]; lifetime: number };

const initialAssets: Asset[] = [
  { name: "عامل مساعد", detail: "ينقر بدلًا عنك", basePrice: 10, income: 1, icon: "01", owned: 0 },
  { name: "مشروع صغير", detail: "أول فرع يفتح الدفتر", basePrice: 100, income: 5, icon: "02", owned: 0 },
  { name: "مشروع متوسط", detail: "فريق مبيعات مصغّر", basePrice: 1000, income: 10, icon: "03", owned: 0 },
  { name: "مشروع كبير", detail: "حساب مؤسسي جديد", basePrice: 10000, income: 20, icon: "04", owned: 0 },
  { name: "مزرعة", detail: "تورّد السلع للشبكة", basePrice: 100000, income: 25, icon: "05", owned: 0 },
  { name: "مصنع صغير", detail: "يصنع الربح على مدار الساعة", basePrice: 1000000, income: 40, icon: "06", owned: 0 },
  { name: "مصنع الدهانات", detail: "علامة على كل جدار", basePrice: 10000000, income: 80, icon: "07", owned: 0 },
  { name: "المصنع", detail: "خط إنتاج لا ينام", basePrice: 100000000, income: 110, icon: "08", owned: 0 },
  { name: "شركة المراقبة", detail: "تراقب الفرص قبل الجميع", basePrice: 1000000000, income: 160, icon: "09", owned: 0 },
  { name: "شبكة المتاجر", detail: "الإمبراطورية تبدأ هنا", basePrice: 10000000000, income: 250, icon: "10", owned: 0 },
];

const initialState: GameState = { money: 0, clickPower: 1, clickUpgradeLevel: 0, autoIncome: 0, assets: initialAssets, events: ["افتح الدفتر — أول نقرة لك تنتظر."], lifetime: 0 };
const clickUpgrades = [{ name: "قلم أسرع", detail: "+1 لكل نقرة", price: 10, add: 1 }, { name: "آلة حاسبة", detail: "+2 لكل نقرة", price: 100, add: 2 }, { name: "قسم المبيعات", detail: "+5 لكل نقرة", price: 1000, add: 5 }];
const money = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });
const priceFor = (asset: Asset) => asset.basePrice * Math.pow(2, asset.owned);
const loadGame = (): GameState => { try { const saved = localStorage.getItem("business-clicker-save"); return saved ? JSON.parse(saved) : initialState; } catch { return initialState; } };

export default function Home() {
  const [game, setGame] = useState<GameState>(loadGame);
  const [pulse, setPulse] = useState(false);
  const [floating, setFloating] = useState<number[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const affordable = useMemo(() => game.assets.filter((a) => game.money >= priceFor(a)).length, [game.money, game.assets]);

  useEffect(() => { localStorage.setItem("business-clicker-save", JSON.stringify(game)); }, [game]);
  useEffect(() => { const timer = window.setInterval(() => setGame((g) => g.autoIncome ? { ...g, money: g.money + g.autoIncome, lifetime: g.lifetime + g.autoIncome } : g), 1000); return () => window.clearInterval(timer); }, []);

  const click = () => { setGame((g) => ({ ...g, money: g.money + g.clickPower, lifetime: g.lifetime + g.clickPower, events: [`نقرة صافية +${money(g.clickPower)}$`, ...g.events].slice(0, 6) })); setPulse(true); setFloating((f) => [...f, Date.now()]); window.setTimeout(() => setPulse(false), 150); };
  const buyClickUpgrade = (u: typeof clickUpgrades[number], i: number) => { if (game.money < u.price || game.clickUpgradeLevel !== i) return; setGame((g) => ({ ...g, money: g.money - u.price, clickPower: g.clickPower + u.add, clickUpgradeLevel: i + 1, events: [`ترقية النقرة: ${u.name}`, ...g.events].slice(0, 6) })); };
  const buyAsset = (index: number) => { const asset = game.assets[index]; const price = priceFor(asset); if (game.money < price) return; setGame((g) => { const assets = g.assets.map((a, i) => i === index ? { ...a, owned: a.owned + 1 } : a); return { ...g, money: g.money - price, autoIncome: g.autoIncome + asset.income, assets, events: [`تم شراء ${asset.name} — دخل +${asset.income}$/ث`, ...g.events].slice(0, 6) }; }); };
  const reset = () => { if (window.confirm("هل تريد بدء دفتر جديد؟ سيتم حذف التقدم المحلي.")) setGame(initialState); };

  return <main className="ledger-shell" dir="rtl">
    <header className="topbar"><div className="brand"><img src="/manus-storage/business-clicker-mark_87ac56c0.png" alt="" className="brand-mark" /><div><div className="brand-word">BUSINESS</div><div className="brand-sub">CLICKER / دفتر النمو</div></div></div><div className="top-actions"><span className="save-state"><span className="status-dot" /> محفوظ محليًا</span><button className="icon-button" aria-label="مساعدة" onClick={() => setShowHelp(!showHelp)}><CircleHelp size={19} /></button><button className="icon-button" aria-label="إعادة التعيين" onClick={reset}><RotateCcw size={17} /></button></div></header>
    {showHelp && <div className="help-note"><b>كيف تلعب؟</b> انقر على ختم الصفقة لجمع المال، ثم اشترِ أصولًا تمنحك دخلًا تلقائيًا كل ثانية. الأسعار تتضاعف مع كل شراء.</div>}
    <section className="dashboard-grid">
      <aside className="ledger-panel paper-panel"><div className="panel-kicker"><span className="ledger-tab">سجل العمليات</span> / 001</div><h2>دفتر<br /><em>النشاط</em></h2><div className="ledger-rule" />{game.events.map((event, i) => <div className="event-row" key={`${event}-${i}`}><span className="event-index">{String(i + 1).padStart(2, "0")}</span><span>{event}</span></div>)}<div className="ledger-bottom"><TrendingUp size={17} /><span>الدخل الجاري</span><strong>{money(game.autoIncome)}$<small> / ثانية</small></strong></div></aside>
      <section className="play-area"><div className="eyebrow"><span>لعبة إدارة الأعمال</span><span className="live-pill"><span className="status-dot green" /> اقتصاد مباشر</span></div><div className="hero-copy"><h1>حوّل النقرة<br /><span>إلى شركة.</span></h1><p>ابدأ من الصفر. ابنِ الأصل التالي. دع الأرقام تتكلم.</p></div><div className="click-stage"><div className="stage-caption"><span><span className="mini-stamp">DEAL</span> الرصيد الحالي</span><span className="hash">#CLICK-TO-GROW</span></div><div className="money-display">{money(game.money)}<span>$</span></div><button className={`deal-button ${pulse ? "pressed" : ""}`} onClick={click}><span className="deal-seal">DEAL<br /><i>×</i><br />CLOSED</span><img src="/manus-storage/business-clicker-mark_87ac56c0.png" alt="" /><span>اضغط<br /><b>لتحصيل الصفقة</b></span><small>+{money(game.clickPower)}$ / نقرة</small></button>{floating.map((id) => <span className="float-cash" key={id}>+{money(game.clickPower)}$</span>)}</div><div className="growth-strip"><span>مؤشر الحركة</span><i /><b>{game.autoIncome > 0 ? `+${money(game.autoIncome)}$ كل ثانية` : "أول أصل ينتظر"}</b></div><div className="quick-stats"><div><Banknote size={18} /><span>إجمالي الأرباح</span><b>{money(game.lifetime)}$</b></div><div><Zap size={18} /><span>قوة النقرة</span><b>+{money(game.clickPower)}$</b></div><div><Store size={18} /><span>الأصول المملوكة</span><b>{game.assets.reduce((a, x) => a + x.owned, 0)}</b></div></div></section>
      <aside className="shop-panel"><div className="shop-header"><div><div className="panel-kicker orange">قسم المشتريات</div><h2>كبّر<br /><em>اللعبة</em></h2></div><div className="available-count">{affordable}<small> متاح</small></div></div><div className="shop-scroll"><div className="upgrade-block"><div className="section-label"><span>ترقيات النقر</span><span>مرة واحدة</span></div>{clickUpgrades.map((u, i) => <button className={`upgrade-row ${game.clickUpgradeLevel > i ? "owned-row" : ""} ${game.clickUpgradeLevel !== i ? "locked" : ""}`} key={u.name} onClick={() => buyClickUpgrade(u, i)}><span className="row-icon"><Sparkles size={15} /></span><span className="row-copy"><b>{u.name}</b><small>{game.clickUpgradeLevel > i ? "تم الاستحواذ" : u.detail}</small></span><strong>{game.clickUpgradeLevel > i ? "✓" : `${money(u.price)}$`}</strong><ChevronRight size={15} /></button>)}</div><div className="upgrade-block assets"><div className="section-label"><span><span className="ledger-tab">أصول</span> الدخل التلقائي</span><span>يتضاعف السعر</span></div>{game.assets.map((asset, i) => <button className={`asset-row ${game.money >= priceFor(asset) ? "ready" : ""}`} key={asset.name} onClick={() => buyAsset(i)}><span className="asset-no">{asset.icon}</span><span className="row-copy"><b>{asset.name}</b><small>+{asset.income}$/ث · {asset.owned} مملوك</small></span><strong>{money(priceFor(asset))}$</strong><ArrowUpRight size={15} /></button>)}</div></div></aside>
    </section><footer className="footer-bar"><span><WalletCards size={15} /> Business Clicker / نسخة ويب</span><span>ابنِ المستقبل نقرةً بعد نقرة.</span><span>الإصدار 1.0</span></footer>
  </main>;
}
