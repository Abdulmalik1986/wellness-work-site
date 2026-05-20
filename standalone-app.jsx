/* ===== الهولنس وورك — App ===== */
const { useState, useEffect, useRef } = React;

/* ---------- Brand mark (concentric rings) ---------- */
function BrandMark() {
  return (
    <svg viewBox="0 0 26 26" className="brand-mark">
      <circle cx="13" cy="13" r="12" />
      <circle cx="13" cy="13" r="8" />
      <circle cx="13" cy="13" r="4" />
      <circle cx="13" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ---------- Header ---------- */
function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <a href="#top" className="brand">
          <BrandMark />
          <span>الهولنس وورك</span>
        </a>
        <nav className="nav">
          <a href="#what">ما هي</a>
          <a href="#insights">المفاتيح</a>
          <a href="#process">العملية</a>
          <a href="#gallery">بصائر</a>
          <a href="#experience">تجربة</a>
          <a href="#trainer">المدرّب</a>
          <a href="#contact">تواصل</a>
        </nav>
      </div>
    </header>
  );
}

/* ---------- Reveal-on-scroll wrapper ---------- */
function Reveal({ children, delay = 0, as: As = "div", className = "", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setTimeout(() => el.classList.add("in"), delay);
    };
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 0.95 && rect.bottom > 0) {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <As ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </As>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <Reveal>
          <span className="hero-eyebrow">
            <span className="dot"></span>
            <span className="eyebrow">عملية التكامل · The Wholeness Work</span>
          </span>
          <h1 className="display">
            الهولنس
            <span className="accent">وورك</span>
          </h1>
          <p className="hero-lede">
            طريقةٌ تأمُّليّة لطيفة...<br />
            تَلتقي بمشاعرك حيث تَسكنُ في الجسد،
            وتَحلُّها من جُذورِها.
          </p>
          <div className="hero-meta">
            <span>سبعُ خطواتٍ بسيطة</span>
            <span>خمسةُ مفاتيحَ مميِّزة</span>
            <span>منهجٌ كاملٌ في ١٤ يوماً</span>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="breath" aria-hidden="true">
            <svg viewBox="-100 -100 200 200">
              <circle className="ring-glow" cx="0" cy="0" r="35" />
              <circle className="ring-1" cx="0" cy="0" r="14" />
              <circle className="ring-2" cx="0" cy="0" r="26" />
              <circle className="ring-3" cx="0" cy="0" r="40" />
              <circle className="ring-4" cx="0" cy="0" r="56" />
              <circle className="ring-5" cx="0" cy="0" r="74" />
              <circle className="ring-6" cx="0" cy="0" r="94" />
            </svg>
            <div className="breath-label">الوعي يحتوي كلّ شيء</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- What is ---------- */
function WhatIsIt() {
  return (
    <section className="block" id="what">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <div className="num quote">١ · ما هي</div>
          <h2>تقنيةٌ حسّيّة، تُترجِم حكمةَ الحُكماء إلى تجربةٍ مباشرة.</h2>
        </Reveal>

        <Reveal as="div" className="what" delay={150}>
          <div className="meta">
            <dl>
              <div>
                <dt>المؤسِّسة</dt>
                <dd>د. كونيري أندرياس</dd>
              </div>
              <div>
                <dt>الإلهام</dt>
                <dd>تعاليم رامانا مهارشي</dd>
              </div>
              <div>
                <dt>الإصدار الأول</dt>
                <dd>٢٠٠٧ — وكتاب ٢٠١٨</dd>
              </div>
              <div>
                <dt>الطابع</dt>
                <dd>لطيفٌ · حسّيّ · غير صراعيّ</dd>
              </div>
            </dl>
          </div>

          <div className="body">
            <p>
              مشاعرنا ليست أفكاراً نُحاول إقناع أنفسنا بتَركها. هي
              <strong> أماكنُ فعلية </strong>
              في الجسد. أحاسيسُ لها موقع، وحجم، ونوعيّة. وحين نَلتقي بها بهذه
              الطريقة، شيءٌ جميلٌ يحدث.
            </p>
            <p>
              «الهولنس وورك» — أو <em>عملية التكامل</em> — طريقةٌ طوّرتها
              البروفيسورة <strong>كونيري أندرياس</strong> منذ عام ٢٠٠٧،
              مُستلهَمةً سؤالَ الحكيم الهنديّ رامانا مهارشي: <em>«مَن أنا؟»</em>
              — لكنها نَقلتْه من الفلسفة إلى التجربة. بدل أن تَسأل
              «من أنا؟» نظريّاً، تَسأله <em>حسّيّاً</em>: أين أحسُّ بالأنا في
              جسدي الآن؟
            </p>
            <p>
              والمفاجأة: تَجدُ <strong>مكاناً</strong>. مكاناً ضيّقاً، محدوداً،
              له شكلٌ ونوعيّةُ إحساس. وحين تَدعو هذا المكانَ لِيَنحلَّ في
              الوعي الذي يَحتويه، يَنحلُّ فعلاً — دون قتال، دون تحليل.
            </p>
            <div className="pull">
              «الذاتُ الحقيقيّةُ لا يُمكن العثورُ عليها بالبحث،
              لأنها لم تُفقَد أصلاً.» <br />
              — رامانا مهارشي
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Five Keys ---------- */
function FiveKeys() {
  const cards = [
    {
      n: "١",
      title: "الأنا كمكانٍ في الجسد",
      body:
        "في معظم التعاليم، «الأنا المنفصلة» تُناقَش كمفهوم. هنا نَتعامل معها كمكانٍ فعليّ في ذاكرة الجسد — له موقعٌ وحجمٌ ونوعيّة. وحين تُعالَج كمكان، تَصير قابلةً للحلّ.",
      glyph: (
        <svg viewBox="-32 -32 64 64">
          <circle cx="0" cy="0" r="28" />
          <circle cx="0" cy="0" r="18" />
          <circle className="pulse" cx="0" cy="0" r="6" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      n: "٢",
      title: "الوعي كإحساسٍ مباشر",
      body:
        "في الكتب، «الوعي» مفهومٌ فكريّ. هنا، الوعيُ شيءٌ تَستشعرُه مباشرة — الفضاءُ الواسع الذي يَسمع الصوت ويَرى اللون ويَحتوي كلّ تجربة. لا فكرةً تُطاردُها، بل صديقاً تَستريحُ فيه.",
      glyph: (
        <svg viewBox="-32 -32 64 64">
          <circle cx="0" cy="0" r="28" />
          <circle cx="0" cy="0" r="20" opacity="0.6" />
          <circle cx="0" cy="0" r="12" opacity="0.4" />
          <circle className="pulse" cx="0" cy="0" r="4" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      n: "٣",
      title: "للمشاعر مواقعٌ حسّيّة",
      body:
        "نقول «أنا حزين»، لكنّ الحزن يَبقى ضبابيّاً. عملية التكامل تَسأل: أين هو في الجسد؟ ما حجمه؟ ما نوعيّتُه؟ فيَخرج الشعور من الضبابيّة إلى الوضوح، ومن الفهم إلى التواصل المباشر.",
      glyph: (
        <svg viewBox="-32 -32 64 64">
          <circle cx="0" cy="0" r="28" />
          <circle cx="-10" cy="-6" r="6" className="pulse" />
          <circle cx="12" cy="8" r="5" />
          <circle cx="-2" cy="14" r="3" />
        </svg>
      ),
    },
    {
      n: "٤",
      title: "من المعنى إلى الإحساس",
      body:
        "معظمُنا يَعيش في رأسه — في التفسيرات والقصص. والتفسيرات لا تُحرِّر. عملية التكامل تَنقلك من الرأس إلى الجسد، ومن المعنى إلى الإحساس. وعلى هذا المستوى الحسّيّ المباشر، التحوّلُ ممكن.",
      glyph: (
        <svg viewBox="-32 -32 64 64">
          <circle cx="0" cy="-14" r="8" opacity="0.4" />
          <line x1="0" y1="-6" x2="0" y2="6" />
          <circle className="pulse" cx="0" cy="14" r="10" fill="currentColor" stroke="none" opacity="0.85" />
        </svg>
      ),
      wide: true,
    },
    {
      n: "٥",
      title: "الإحساس الأصليُّ كوعيٍ كلّيّ",
      body:
        "أعمقُ المفاتيح. حين نَختبر الإحساسَ في أوسعِ حالاتِ وجودِنا — كوعيٍ بلا حدود — يأخذ الإحساسُ مسارَه الطبيعيّ ويَتمدَّد في الإمكانيّةِ الأوسع، بدلاً من أن نَطردَه فيتحوَّل إلى أنا أخرى في موقعٍ آخر.",
      glyph: (
        <svg viewBox="-32 -32 64 64">
          <circle cx="0" cy="0" r="28" />
          <circle cx="0" cy="0" r="20" />
          <circle cx="0" cy="0" r="12" />
          <circle className="pulse" cx="0" cy="0" r="5" fill="currentColor" stroke="none" />
        </svg>
      ),
      wide: true,
    },
  ];

  return (
    <section className="block" id="insights">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <div className="num quote">٢ · المفاتيح الخمسة</div>
          <h2>ما الذي يَجعلُ هذا المنهجَ مختلفاً عن سائرِ التقنيات.</h2>
        </Reveal>

        <Reveal as="div" className="insights five" delay={100}>
          {cards.map((c) => (
            <article className={`insight ${c.wide ? "wide" : ""}`} key={c.n}>
              <span className="num quote">{c.n}</span>
              <div className="glyph">{c.glyph}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Process — 7 steps ---------- */
function Process() {
  const steps = [
    {
      n: "١",
      title: "إيجاد البداية",
      body: "اختر شعوراً متوسّطاً، وحدِّد موقعَه في الجسد، وحجمه، وشكله، ونوعيّةَ إحساسِه — حسّيّاً لا معنويّاً.",
    },
    {
      n: "٢",
      title: "استشعار الوعي",
      body: "خُذ نَفَساً، واستشعِر الفضاءَ الواسع في الجسد وحوله — الذي يَسمع ويرى ويَحتوي كلّ شيء.",
    },
    {
      n: "٣",
      title: "إيجاد الأنا",
      body: "اسأل: «أين الأنا التي تَعي هذا الإحساس؟» وتَتبَّع الإجابةَ إلى موقعٍ في الجسد أو حوله.",
    },
    {
      n: "٤",
      title: "سلسلة الإيجو",
      body: "اسأل عن الأنا التي تَعي الأنا الأولى... وهكذا حتى تَصل إلى طبقةٍ لطيفة، خفيفة، مستعدّةٍ للذوبان.",
    },
    {
      n: "٥",
      title: "دعوة الأنا للاندماج",
      body: "ابدأ من الطبقة اللطيفة، وادعُها برِفقٍ للاسترخاء والذوبان في الوعي — دعوةً، لا أمراً.",
    },
    {
      n: "٦",
      title: "اتحاد الإحساس والوعي",
      body: "عُد إلى الإحساس الأصليّ، وادعُه للاتحاد مع الوعي بالطريقة التي تُناسبه. لا تَفرض اتجاهاً.",
    },
    {
      n: "٧",
      title: "التحقّق",
      body: "اِستحضر الموقفَ الأصليّ. كيف يَبدو الآن؟ علامةُ الاكتمال: سهولةٌ ووضوحٌ وقَبولٌ طبيعيّ.",
    },
  ];

  return (
    <section className="block" id="process">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <div className="num quote">٣ · العمليّة البسيطة</div>
          <h2>سبعُ خطواتٍ، يُمكن حفظُها بعد جلسةٍ واحدة.</h2>
        </Reveal>

        <Reveal as="div" className="process" delay={150}>
          <ol className="process-steps">
            {steps.map((s) => (
              <li key={s.n}>
                <span className="step-num">{s.n}</span>
                <div>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="process-visual" aria-hidden="true">
            <svg viewBox="-100 -100 200 200">
              <circle className="center-glow" cx="0" cy="0" r="30" />
              <circle cx="0" cy="0" r="92" />
              <circle cx="0" cy="0" r="74" />
              <circle cx="0" cy="0" r="56" />
              <circle cx="0" cy="0" r="38" />
              <circle cx="0" cy="0" r="22" />
              <circle className="filled" cx="0" cy="0" r="5" />

              <circle cx="0" cy="-92" r="2.5" fill="#1a1612" stroke="none" />
              <circle cx="74" cy="0" r="2.5" fill="#1a1612" stroke="none" />
              <circle cx="0" cy="56" r="2.5" fill="#a87a3e" stroke="none" />
              <circle cx="-38" cy="-12" r="2.5" fill="#a87a3e" stroke="none" />
              <circle cx="22" cy="-22" r="2.5" fill="#a87a3e" stroke="none" />

              <text className="label" x="0" y="-102" textAnchor="middle">الوعي</text>
              <text className="label" x="86" y="4" textAnchor="start">الأنا</text>
              <text className="label" x="0" y="70" textAnchor="middle">الإحساس</text>
              <text className="label" x="-48" y="-10" textAnchor="end">الموقع</text>
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Visual Gallery ---------- */
function Gallery({ onOpen }) {
  const items = [
    { src: window.__resources.zenWater,        cap: "ماءٌ يستلقي على ماء — جوهر الطريقة",  span: "span-4" },
    { src: window.__resources.pillars,         cap: "ثلاث ركائزَ تَجعل هذا المنهج مختلفاً",  span: "span-2" },
    { src: window.__resources.keyEgo,          cap: "الأنا ليست مفهوماً... بل موقعٌ فعليّ", span: "span-3" },
    { src: window.__resources.radicalInclusion,cap: "ذروة الاستنارة — التضمين الجذريّ",     span: "span-3" },
    { src: window.__resources.pathSpaciousness,cap: "المسار الثاني — التحوّل إلى السَّعة",   span: "span-3" },
    { src: window.__resources.pathLayer,       cap: "المسار الثالث — انكشاف طبقةٍ جديدة",   span: "span-3" },
    { src: window.__resources.searchTrap,      cap: "فخّ البحث المستمرّ في الخارج",          span: "span-3" },
    { src: window.__resources.greatSecret,     cap: "السرّ العظيم — «المفقود» لم يكن خارجاً قطّ", span: "span-3" },
    { src: window.__resources.indicators,      cap: "مؤشّرات التحوّل واكتمال العمليّة",      span: "span-6" },
  ];

  return (
    <section className="block" id="gallery">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <div className="num quote">٤ · بصائر بصريّة</div>
          <h2>صورٌ تَحمل ما تَعجزُ عنه الكلمات.</h2>
        </Reveal>

        <Reveal>
          <p className="gallery-intro">
            مجموعةٌ مُختارةٌ من بطاقات الدورة — كلّ بصيرةٍ في صورة، تَحمل
            مفهوماً جوهريّاً يَستحقُّ التأمُّل. اضغطْ على أيّ بطاقة لتَكبيرها.
          </p>
        </Reveal>

        <Reveal as="div" className="gallery" delay={150}>
          {items.map((it, i) => (
            <button
              key={i}
              className={`g-card ${it.span}`}
              onClick={() => onOpen(it.src, it.cap)}
              aria-label={it.cap}
              type="button"
            >
              <img src={it.src} alt={it.cap} loading="lazy" />
              <div className="caption">{it.cap}</div>
            </button>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Lightbox ---------- */
function Lightbox({ src, caption, onClose }) {
  useEffect(() => {
    if (!src) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [src, onClose]);
  if (!src) return null;
  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-label={caption}>
      <button className="close" onClick={onClose} aria-label="إغلاق">×</button>
      <img src={src} alt={caption} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

/* ---------- Experience (interactive breath) ---------- */
function Experience() {
  const phases = [
    {
      key: "intro",
      label: "اِجلسْ بهدوء. خُذ نَفَساً عميقاً ودَعْه يَنساب ببطء.",
      duration: 8,
    },
    {
      key: "feel",
      label: "اِستحضرْ موقفاً بسيطاً يُشغلك — ليس الأشدّ، بل المتوسِّط.",
      duration: 10,
    },
    {
      key: "locate",
      label: "أين تَحسُّ بأثره في الجسد؟ في الصدر؟ البطن؟ الحلق؟ لاحِظْ فقط.",
      duration: 12,
    },
    {
      key: "quality",
      label: "ما نوعيّةُ هذا الإحساس؟ ثقيل أم خفيف؟ كثيف أم هوائيّ؟",
      duration: 10,
    },
    {
      key: "awareness",
      label: "والآن، استشعِر الوعيَ الواسع الذي يَحتوي الإحساسَ وما حوله.",
      duration: 12,
    },
    {
      key: "invite",
      label: "ادعُ الإحساسَ بلطفٍ — لا بإجبار — للاسترخاءِ في هذا الفضاء.",
      duration: 12,
    },
    {
      key: "rest",
      label: "اسمحْ بما يَحدث. لستَ مَنْ يَفعل — أنت الفضاءُ الذي يَسمح.",
      duration: 10,
    },
    {
      key: "complete",
      label: "اِفتحْ عينيك بلطف. هذا ذوقٌ صغير — والطريقةُ أعمقُ بكثير.",
      duration: 0,
    },
  ];

  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const totalDuration = phases.reduce((s, p) => s + p.duration, 0);
  const timersRef = useRef([]);
  const tickRef = useRef(null);

  function clearAll() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  }

  function start() {
    clearAll();
    setRunning(true);
    setPhaseIdx(0);
    setElapsed(0);

    let acc = 0;
    phases.forEach((p, i) => {
      acc += p.duration;
      if (i < phases.length - 1) {
        const t = setTimeout(() => setPhaseIdx(i + 1), acc * 1000);
        timersRef.current.push(t);
      }
    });
    const finalT = setTimeout(() => {
      setRunning(false);
    }, totalDuration * 1000);
    timersRef.current.push(finalT);

    const startTs = Date.now();
    tickRef.current = setInterval(() => {
      setElapsed(Math.min(totalDuration, (Date.now() - startTs) / 1000));
    }, 250);
  }

  function reset() {
    clearAll();
    setRunning(false);
    setPhaseIdx(0);
    setElapsed(0);
  }

  useEffect(() => () => clearAll(), []);

  const currentPhase = phases[phaseIdx];
  const progress = Math.min(100, (elapsed / totalDuration) * 100);

  const [cycleShape, setCycleShape] = useState("idle");
  useEffect(() => {
    if (!running) {
      setCycleShape("idle");
      return;
    }
    if (currentPhase.key === "intro" || currentPhase.key === "complete") {
      setCycleShape("idle");
      return;
    }
    const startTs = Date.now();
    setCycleShape("inhale");
    const id = setInterval(() => {
      const t = (Date.now() - startTs) / 1000;
      setCycleShape(Math.floor(t / 4) % 2 === 0 ? "inhale" : "exhale");
    }, 250);
    return () => clearInterval(id);
  }, [phaseIdx, running]);

  const shape = running ? cycleShape : "idle";

  return (
    <section className="block" id="experience">
      <div className="wrap">
        <Reveal as="div" className="experience">
          <span className="eyebrow">٥ · تجربة قصيرة</span>
          <h2>ذُقها في دقيقة ونصف.</h2>
          <p className="intro">
            ليست جلسةً كاملة — فالجلسة الحقيقيّة تَستغرق نحو عشرين دقيقة
            مع مُيَسِّر. هذه فقط <em>ذوقٌ</em> لروح الطريقة: ست لحظاتٍ صغيرة
            تَأخذُك خلالَ بنيتها. أَغمِض عينيك إن شئتَ، ودَعِ النصَّ يَقودك.
          </p>

          <div className="exp-stage">
            <div className="exp-canvas">
              <svg viewBox="-100 -100 200 200">
                <circle className="bg-ring" cx="0" cy="0" r="95" />
                <circle className="bg-ring" cx="0" cy="0" r="75" />
                <circle className="bg-ring" cx="0" cy="0" r="55" />
                <circle className={`breath-shape ${shape}`} cx="0" cy="0" r="50" />
                <circle className={`breath-core ${shape}`} cx="0" cy="0" r="12" />
              </svg>
              <div className="phase-text" key={currentPhase.key}>
                {running || phaseIdx > 0 ? currentPhase.label : "اِجلسْ بهدوء"}
              </div>
            </div>

            <div className="exp-controls">
              <div className="exp-prompt">
                {!running && phaseIdx === 0 && (
                  <>تجربةٌ موجَّهةٌ قصيرة — تَذوقُ فيها روحَ الطريقة في دقيقة.</>
                )}
                {running && <>{currentPhase.label}</>}
                {!running && phaseIdx > 0 && (
                  <>كيف هو الهواءُ الآن؟ خُذ لحظةً قبل أن تَعود.</>
                )}
              </div>

              {!running && (
                <button className="exp-button" onClick={start}>
                  <span>{phaseIdx > 0 ? "كرِّر التجربة" : "ابدأ التجربة"}</span>
                  <span className="arrow"></span>
                </button>
              )}
              {running && (
                <button className="exp-button" onClick={reset}>
                  <span>إيقاف</span>
                </button>
              )}

              <div className="exp-meta">
                <span>نحو ٧٥ ثانية</span>
                <span>صوتٌ داخليّ فقط</span>
                <span>بلا حساب · بلا تسجيل</span>
              </div>

              <div className="exp-progress">
                <div className="exp-progress-bar" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Founder ---------- */
function Founder() {
  return (
    <section className="block" id="founder">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <div className="num quote">٦ · المؤسِّسة</div>
          <h2>د. كونيري أندرياس.</h2>
        </Reveal>

        <Reveal as="div" className="person" delay={150}>
          <div className="person-photo">
            <image-slot
              id="founder-photo"
              shape="rounded"
              radius="12"
              fit="contain"
              placeholder="ضع صورةَ د. كونيري"
            ></image-slot>
            <div className="caption">Connirae Andreas, Ph.D.</div>
          </div>

          <div className="person-bio">
            <div className="role">مؤسِّسةُ الطريقة</div>
            <h3>تَرجمتْ سؤالَ الحُكماء إلى تجربةٍ يَخوضُها كلُّ إنسان.</h3>
            <p className="lede">
              «ماذا لو طبَّقتُ سؤالَ <em>«مَن أنا؟»</em>... حسّيّاً؟»
            </p>
            <p>
              بروفيسورةٌ ومُعالِجةٌ نفسيّة، ومن روّاد البرمجة اللغويّة العصبيّة
              (NLP) لأكثر من أربعةِ عقود. منذ عام ٢٠٠٧ بدأت تطوير «الهولنس
              وورك» كامتدادٍ عمليّ لتعاليم الحكيم الهنديّ <strong>رامانا
              مهارشي</strong>، وأطلقت أوّلَ دورةٍ رسميّة عام ٢٠١٤.
            </p>
            <p>
              مؤلِّفةُ كتاب <em>«Coming to Wholeness: How to Awaken and Live
              with Ease»</em> (٢٠١٨)، الذي يَعرض الطريقةَ كاملةً ويُترجِم
              الحكمةَ القديمة إلى لغةٍ عمليّةٍ يَستطيعُ أيُّ شخصٍ أن
              يَستخدمَها.
            </p>

            <div className="links">
              <a href="https://thewholenesswork.org" target="_blank" rel="noopener">
                <span className="ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
                  </svg>
                </span>
                الموقع الرسميّ
              </a>
              <a href="https://www.thewholenesswork.org/the-book/" target="_blank" rel="noopener">
                <span className="ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4V4z" />
                    <path d="M4 4v12a4 4 0 004 4" />
                  </svg>
                </span>
                صفحة الكتاب
              </a>
              <a href="https://www.youtube.com/watch?v=RpUJhgBIxLo&t=27s" target="_blank" rel="noopener">
                <span className="ico">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.6 7.2a2.5 2.5 0 00-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43A2.5 2.5 0 0021.6 16.8 26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3z" />
                  </svg>
                </span>
                فيديو تعريفيّ
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Trainer ---------- */
function Trainer() {
  return (
    <section className="block" id="trainer">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <div className="num quote">٧ · المدرِّب</div>
          <h2>عبدالملك الحجري.</h2>
        </Reveal>

        <Reveal as="div" className="person reverse" delay={150}>
          <div className="person-photo">
            <image-slot
              id="trainer-photo"
              shape="rounded"
              radius="12"
              fit="contain"
              placeholder="ضع صورتك هنا"
            ></image-slot>
            <div className="caption">عبدالملك الحجري · مدرّبٌ معتمد</div>
          </div>

          <div className="person-bio">
            <div className="role">مدرّبٌ ومُيَسِّرُ دورات</div>
            <h3>أَنقُلُ هذه الطريقةَ إلى العربيّة، بحضورٍ ولُغةٍ مألوفة.</h3>
            <p className="lede">
              مدرّبٌ في تقنية الهولنس وورك، ومُقدِّم دوراتٍ تطبيقيّة فيها
              للناطقين بالعربيّة.
            </p>
            <p>
              أَعمل على تَيسير العمليّةِ كما طوَّرتْها د. كونيري أندرياس،
              بطريقةٍ تَحترم الأصلَ وتُقدِّمه بلُغةٍ ومُفرداتٍ تَلِيقُ
              بالسياقِ العربيّ. الدورةُ الكاملةُ تَمتدّ على
              <strong> ١٤ يوماً</strong>، تَجمع شرحاً نظريّاً وتطبيقاً عمليّاً
              وجلساتٍ صوتيّةً موجَّهة.
            </p>
            <p className="muted">
              للاستفسار، حجزِ جلسةٍ فرديّة، أو الانضمامِ للدورة القادمة —
              تواصل معي مباشرةً عبر واتساب أدناه.
            </p>

            <div className="links">
              <a href="#contact">
                <span className="ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
                تواصل معي
              </a>
              <a href="#process">
                <span className="ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                </span>
                طريقة العمل
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
function Contact() {
  const wa = "https://wa.me/96896767693";
  const msg = encodeURIComponent("السلام عليكم، أود الاستفسار عن دورة الهولنس وورك.");
  return (
    <section className="block" id="contact">
      <div className="wrap">
        <Reveal as="div" className="contact">
          <div className="contact-grid">
            <div>
              <span className="eyebrow">٨ · تواصل · حجز · دورات</span>
              <h2>ابدأ من حيثُ أنت.</h2>
              <p className="lede">
                إن أردتَ معرفةَ المزيد، أو حجزَ جلسةٍ فرديّة، أو الانضمامَ
                للدورة القادمة — اكتب لي مباشرةً.
              </p>

              <div className="contact-meta">
                <div>
                  <strong>عبدالملك الحجري</strong>
                  مدرّبُ تقنية الهولنس وورك ومُيَسِّرُ دوراتها
                </div>
                <div>
                  <strong>الاستجابة</strong>
                  خلال ٢٤ ساعةً عادةً · من السبت إلى الخميس
                </div>
                <div>
                  <strong>الجلسات</strong>
                  فرديّة عن بُعد · مجموعات · دوراتٌ مُقسَّمة على ١٤ يوماً
                </div>
              </div>
            </div>

            <div className="wa-card">
              <div className="ring">
                <svg viewBox="0 0 32 32">
                  <path d="M16.001.04C7.16.04.04 7.16.04 16.001c0 2.825.74 5.585 2.146 8.018L0 32l8.196-2.147A15.94 15.94 0 0016 31.96C24.84 31.96 31.96 24.84 31.96 16S24.84.04 16.001.04zm0 29.31c-2.524 0-4.997-.68-7.155-1.967l-.514-.305-5.327 1.396 1.42-5.196-.336-.534A13.31 13.31 0 012.65 16c0-7.353 5.998-13.35 13.35-13.35S29.35 8.647 29.35 16 23.353 29.35 16 29.35zm7.32-9.95c-.4-.2-2.366-1.166-2.733-1.3-.366-.133-.633-.2-.9.2-.266.4-1.033 1.3-1.266 1.566-.234.267-.467.3-.866.1-.4-.2-1.7-.626-3.234-1.992-1.194-1.066-2-2.382-2.234-2.782-.234-.4-.025-.616.175-.815.18-.18.4-.467.6-.7.2-.234.266-.4.4-.667.133-.266.066-.5-.034-.7-.1-.2-.9-2.166-1.233-2.966-.324-.778-.654-.672-.9-.685l-.766-.014c-.267 0-.7.1-1.067.5-.366.4-1.4 1.366-1.4 3.332s1.434 3.866 1.634 4.132c.2.267 2.82 4.302 6.832 6.032.954.412 1.7.659 2.282.842.958.305 1.83.262 2.52.16.769-.115 2.367-.967 2.7-1.9.334-.933.334-1.733.234-1.9-.1-.166-.366-.266-.766-.466z"/>
                </svg>
              </div>
              <div className="label">واتساب مباشر</div>
              <div className="number">+968 9676 7693</div>
              <div className="number-ar">٠٠٩٦٨ ٩٦ ٧٦ ٧٦ ٩٣</div>
              <a className="wa-button" href={`${wa}?text=${msg}`} target="_blank" rel="noopener">
                <svg viewBox="0 0 32 32">
                  <path d="M16.001.04C7.16.04.04 7.16.04 16.001c0 2.825.74 5.585 2.146 8.018L0 32l8.196-2.147A15.94 15.94 0 0016 31.96C24.84 31.96 31.96 24.84 31.96 16S24.84.04 16.001.04zM23.32 19.4c-.4-.2-2.366-1.166-2.733-1.3-.366-.133-.633-.2-.9.2-.266.4-1.033 1.3-1.266 1.566-.234.267-.467.3-.866.1-.4-.2-1.7-.626-3.234-1.992-1.194-1.066-2-2.382-2.234-2.782-.234-.4-.025-.616.175-.815.18-.18.4-.467.6-.7.2-.234.266-.4.4-.667.133-.266.066-.5-.034-.7-.1-.2-.9-2.166-1.233-2.966-.324-.778-.654-.672-.9-.685l-.766-.014c-.267 0-.7.1-1.067.5-.366.4-1.4 1.366-1.4 3.332s1.434 3.866 1.634 4.132c.2.267 2.82 4.302 6.832 6.032.954.412 1.7.659 2.282.842.958.305 1.83.262 2.52.16.769-.115 2.367-.967 2.7-1.9.334-.933.334-1.733.234-1.9z"/>
                </svg>
                ابدأ المحادثة الآن
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Closing ---------- */
function Closing() {
  return (
    <section className="closing zen">
      <div className="zen-stage">
        <img src={window.__resources.zenWater} alt="ماء يستلقي على ماء" className="zen-bg" />
        <div className="zen-content">
          <p className="closing-quote">
            «ما تَبحث عنه،<br />كان دائماً موجوداً بداخلك.»
          </p>
          <div className="closing-attr">— روحُ الهولنس وورك</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div>© ٢٠٢٦ — موقع تعريفيّ بالهولنس وورك · عبدالملك الحجري</div>
        <div className="links">
          <a href="#what">ما هي</a>
          <a href="#founder">المؤسِّسة</a>
          <a href="#trainer">المدرِّب</a>
          <a href="#contact">تواصل</a>
        </div>
      </div>
    </footer>
  );
}

/* ---------- App ---------- */
function App() {
  const [lb, setLb] = useState({ src: null, caption: "" });
  const open = (src, caption) => setLb({ src, caption });
  const close = () => setLb({ src: null, caption: "" });
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhatIsIt />
        <FiveKeys />
        <Process />
        <Gallery onOpen={open} />
        <Experience />
        <Founder />
        <Trainer />
        <Contact />
        <Closing />
      </main>
      <Footer />
      <Lightbox src={lb.src} caption={lb.caption} onClose={close} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
