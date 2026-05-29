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

/* ---------- Background music toggle ---------- */
function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const audioRef = useRef(null);
  // Tracks a deferred-start pending the first user gesture. Browsers block
  // programmatic play() without prior interaction; if the saved preference
  // is "on", we wait for any click/keydown and resume from there.
  const pendingStartRef = useRef(false);

  // Reveal the toggle only after the user has engaged — either scrolled past
  // the hero, or 12s of dwell time. Avoids cluttering the first impression.
  useEffect(() => {
    if (localStorage.getItem("bgMusic") === "on") {
      setVisible(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 12000);
    const onScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
        clearTimeout(timer);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const a = new Audio("audio/ambient.mp3");
    a.loop = true;
    a.preload = "auto";
    a.volume = 0.5;
    audioRef.current = a;

    const saved = localStorage.getItem("bgMusic");
    if (saved === "on") {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Autoplay blocked — arm a one-shot resume on first interaction.
          pendingStartRef.current = true;
          const trigger = () => {
            if (!pendingStartRef.current) return;
            pendingStartRef.current = false;
            a.play().then(() => setPlaying(true)).catch(() => {});
            document.removeEventListener("click", trigger, true);
            document.removeEventListener("keydown", trigger, true);
          };
          document.addEventListener("click", trigger, true);
          document.addEventListener("keydown", trigger, true);
        });
    }

    return () => {
      a.pause();
      audioRef.current = null;
      pendingStartRef.current = false;
    };
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    pendingStartRef.current = false;
    if (playing) {
      a.pause();
      setPlaying(false);
      localStorage.setItem("bgMusic", "off");
    } else {
      a.play()
        .then(() => {
          setPlaying(true);
          localStorage.setItem("bgMusic", "on");
        })
        .catch((err) => {
          console.warn("Music play blocked:", err);
        });
    }
  }

  return (
    <button
      type="button"
      className={"music-toggle" + (playing ? " is-playing" : "") + (visible ? " is-visible" : "")}
      onClick={toggle}
      aria-label={playing ? "إيقاف موسيقى الخلفية" : "تشغيل موسيقى الخلفية"}
      title={playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span className="mt-bars" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </span>
      <span className="mt-label">{playing ? "موسيقى" : "موسيقى"}</span>
    </button>
  );
}

/* ---------- Header ---------- */
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { href: "#what", label: "ما هي" },
    { href: "#insights", label: "المفاتيح" },
    { href: "#process", label: "العملية" },
    { href: "#gallery", label: "بصائر" },
    { href: "#experience", label: "تجربة" },
    { href: "#trainer", label: "المدرّب" },
    { href: "#program", label: "المسار" },
    { href: "#faq", label: "أسئلة" },
    { href: "#share", label: "شارِك" },
    { href: "#contact", label: "تواصل" },
  ];

  // Close menu on Escape or when a link is clicked.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="wrap">
        <a href="#top" className="brand">
          <BrandMark />
          <span>الهولنس وورك</span>
        </a>
        <nav className="nav">
          {links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <button
          type="button"
          className={"nav-toggle" + (menuOpen ? " is-open" : "")}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <MusicToggle />
      </div>

      {/* Mobile drawer */}
      <div
        className={"nav-drawer" + (menuOpen ? " is-open" : "")}
        onClick={(e) => {
          if (e.target.tagName === "A") setMenuOpen(false);
        }}
        aria-hidden={!menuOpen}
      >
        <nav>
          {links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
      </div>
      {menuOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
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
            <span className="eyebrow">The Wholeness Work</span>
          </span>
          <h1 className="display">
            الهولنس
            <span className="accent">وورك</span>
          </h1>
          <p className="hero-sub">عمليّةُ التكامل</p>
          <p className="hero-lede">
            تَلتَقي بِمشاعِركَ حَيثُ تَسكُنُ في الجَسَد،
            فتَنحَلُّ مِن جُذورِها — دونَ مُقاوَمة، ودونَ شَرح.
          </p>
          <div className="hero-cta">
            <a href="#experience" className="btn btn-primary">
              ابدأ التجربة الذاتيّة
            </a>
            <a href="#what" className="btn btn-ghost">
              تَعرَّف على الطريقة
            </a>
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

        <Reveal as="p" className="bridge" delay={250}>
          هذا التَّحوُّل يَستند إلى <em>خمسةِ مفاتيحَ</em> تَجعل المنهجَ
          مختلفاً جوهريّاً عن سائر التقنيات.
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

        <Reveal as="p" className="bridge" delay={200}>
          والآن — كيف تُتَرجَم هذه المفاتيح إلى <em>عمليّةٍ عمليّة</em>؟
          سبعُ خطواتٍ بسيطة، يُمكن حفظُها بعد جلسةٍ واحدة.
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
const GALLERY_ITEMS = [
  { src: "images/ركائز.png",         cap: "ثلاث ركائزَ تَجعل هذا المنهج مختلفاً",  span: "span-3" },
  { src: "images/مفتاح-الأنا.png",   cap: "الأنا ليست مفهوماً... بل موقعٌ فعليّ", span: "span-3" },
  { src: "images/تضمين-جذري.png",    cap: "ذروة الاستنارة — التضمين الجذريّ",     span: "span-3" },
  { src: "images/مسار-سعة.png",      cap: "المسار الثاني — التحوّل إلى السَّعة",   span: "span-3" },
  { src: "images/مسار-طبقة.png",     cap: "المسار الثالث — انكشاف طبقةٍ جديدة",   span: "span-3" },
  { src: "images/فخ-البحث.png",      cap: "فخّ البحث المستمرّ في الخارج",          span: "span-3" },
  { src: "images/سر-عظيم.png",       cap: "السرّ العظيم — «المفقود» لم يكن خارجاً قطّ", span: "span-3" },
  { src: "images/مؤشرات.png",        cap: "مؤشّرات التحوّل واكتمال العمليّة",      span: "span-6" },
];

function Gallery({ onOpen }) {
  const items = GALLERY_ITEMS;

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
              onClick={() => onOpen(i)}
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
function Lightbox({ index, items, onClose, onNav }) {
  const isOpen = index !== null && index >= 0;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onNav(+1);   // RTL: ← moves to "next"
      else if (e.key === "ArrowRight") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose, onNav]);
  if (!isOpen) return null;
  const it = items[index];
  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-label={it.cap}>
      <button className="lb-close" onClick={onClose} aria-label="إغلاق">×</button>
      <button
        className="lb-nav lb-prev"
        onClick={(e) => { e.stopPropagation(); onNav(-1); }}
        aria-label="السابق"
      >‹</button>
      <button
        className="lb-nav lb-next"
        onClick={(e) => { e.stopPropagation(); onNav(+1); }}
        aria-label="التالي"
      >›</button>
      <figure className="lb-figure" onClick={(e) => e.stopPropagation()}>
        <img src={it.src} alt={it.cap} />
        <figcaption className="lb-caption">{it.cap}</figcaption>
      </figure>
      <div className="lb-counter" aria-hidden="true">
        {index + 1} / {items.length}
      </div>
    </div>
  );
}

/* ---------- Experience (embedded interactive taster) ---------- */
const EXPERIENCE_TELEGRAM_URL =
  (typeof window !== "undefined" && window.HOLNESS_TELEGRAM_URL) ||
  "https://t.me/+holnesswork";

function Experience() {
  const iframeRef = useRef(null);
  // Listen for height messages from taster.html and resize the iframe to fit.
  useEffect(() => {
    function onMessage(e) {
      if (!e.data || e.data.type !== "holness:height") return;
      const f = iframeRef.current;
      if (!f) return;
      const h = Math.max(560, Math.min(2000, Number(e.data.height) || 0));
      f.style.height = h + "px";
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section className="block" id="experience">
      <div className="wrap">
        <Reveal as="div" className="experience">
          <span className="eyebrow">٥ · تجربة</span>
          <h2>تَجِربةٌ، واكتشِف الاختلافاتِ بنفسك.</h2>
          <p className="intro">
            مسارٌ تَأمُّليٌّ قصير، تَخوضه الآن دون تسجيلٍ ولا حِفظِ بيانات.
            خُذ ٥–١٠ دقائق هادئة، وانتبه إلى ما يَتغيَّر بين
            <em> «قَبل» </em> و<em> «بَعد»</em>. الفَرقُ هو الإجابة.
          </p>

          <div className="taster-frame">
            <iframe
              ref={iframeRef}
              src="taster.html"
              title="مسار التأمّل التعريفيّ — الهولنس وورك"
              loading="lazy"
              allow="autoplay"
              scrolling="no"
            ></iframe>
          </div>

          <div className="tg-card">
            <div className="tg-card-head">
              <div className="tg-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 0C7.16 0 0 7.16 0 16s7.16 16 16 16 16-7.16 16-16S24.84 0 16 0zm7.42 10.96l-2.48 11.7c-.19.83-.68 1.04-1.38.65l-3.8-2.8-1.83 1.76c-.2.2-.37.37-.76.37l.27-3.86 7.04-6.37c.31-.27-.07-.42-.47-.16l-8.7 5.48-3.75-1.17c-.81-.25-.83-.81.17-1.2l14.66-5.65c.68-.25 1.27.16 1.03 1.25z" />
                </svg>
              </div>
              <div>
                <div className="tg-card-eyebrow">دورةٌ تعريفيّةٌ مَجّانيّة على تلجرام</div>
                <h3 className="tg-card-title">٣ أيّام · ٣ محطّاتٍ تَتدرَّج معك</h3>
              </div>
            </div>

            <p className="tg-card-lede">
              ما الذي ستَتعرَّف عليه في الأيّام الثلاثة:
            </p>

            <ul className="tg-card-list">
              <li>
                <span>اليوم الأوّل</span>
                اللقاءُ الأوّل مع التقنية والمفاهيم الجوهريّة.
              </li>
              <li>
                <span>اليوم الثاني</span>
                التجربةُ العمليّةُ الكاملة عبرَ مسار التأمّل.
              </li>
              <li>
                <span>اليوم الثالث</span>
                الفهمُ الأعمَق وخريطةُ الطريق.
              </li>
            </ul>

            <a
              className="tg-card-btn"
              href={EXPERIENCE_TELEGRAM_URL}
              target="_blank"
              rel="noopener"
            >
              انضمَّ إلى قناة تلجرام
              <span className="tg-card-arrow" aria-hidden="true">←</span>
            </a>

            <p className="tg-card-fine">
              مجّانيّة تماماً · بلا التزام · يُمكنك المغادرة في أيّ وقت
            </p>
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
              src="images/founder.webp"
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
              src="images/trainer.webp"
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

/* ---------- FAQ ---------- */
function Faq() {
  const items = [
    {
      q: "هل هذا بَديلٌ للعلاج النفسيّ؟",
      a: "لا. الهولنس وورك طريقةٌ تأمُّليّةٌ ذاتيّة، ليست علاجاً طِبِّياً ولا بَديلاً عنه. إن كنتَ تَمرّ بضائقةٍ نفسيّةٍ شديدة، فالأَولى مراجعةُ مختصٍّ مؤهَّل. لكنّها تَتكامل بشكلٍ جميل مع العلاج، ويَستَخدِمها كثيرٌ من المُعالِجين كأداةٍ مُساعِدة.",
    },
    {
      q: "كم تَستغرق الجلسة الواحدة؟",
      a: "الجلسةُ الكاملةُ مع مُيَسِّر تَستغرق عادةً ٢٠ إلى ٤٠ دقيقة. السبعُ الخطوات نَفسُها يُمكن المرورُ بها في ١٠ دقائق بعد التَّمكُّن منها، أو في جلسةٍ أعمَقَ ساعةً كاملة حسب الحالة.",
    },
    {
      q: "ما الفَرقُ بين الهولنس وورك والـ NLP أو IFS؟",
      a: "الـ NLP يَعمل على البِنية اللغويّة للتجربة الذهنيّة. الـ IFS (Internal Family Systems) يَعمل مع «الأجزاء» الداخليّة كشخصيّات. الهولنس وورك يَنطلق من بَعدٍ أعمَق: «الأنا» نفسُها كمكانٍ حسّيّ في الجسد، تُحَلُّ بالعَودة إلى الوعي الذي يَحتويها. د. كونيري أندرياس — مؤسِّسةُ المنهج — من روّاد الـ NLP، فالطريقةُ تَستفيد من خبرتها فيه لكنها تَتجاوزُه إلى مستوى أعمَق.",
    },
    {
      q: "هل تَتعارض مع الدِّين أو القِيَم الإسلاميّة؟",
      a: "لا تَدّعي الطريقةُ أيَّ مَرجعيّةٍ دينيّةٍ أو روحانيّةٍ خاصّة. هي مَنهجٌ حسّيٌّ يَتعامل مع كيفيّةِ سُكنى المشاعر في الجسد. النّاسُ من خلفيّاتٍ دينيّةٍ مختلفة — مُسلمون، مسيحيّون، بوذيّون، لا دينيّون — يَستفيدون منها. القرارُ في كيفيّةِ تفسير التَّجربة يَبقى لكَ تماماً.",
    },
    {
      q: "هل يَعمل عَن بُعد؟",
      a: "نعم تماماً. الجلساتُ الفرديّة تُعقَد عبر زوم/جوجل ميت، والدوراتُ الجماعيّة كذلك. الطريقةُ لا تَحتاج تَلامُساً جسديّاً ولا حضوراً ماديّاً — فهي عَملٌ داخليّ بحت.",
    },
    {
      q: "ماذا لو لم أَشعر بشيءٍ في الجلسة؟",
      a: "هذا طبيعيٌّ ويَحدُث. أحياناً يَحتاج المراقبُ مساحةً أوسع، أو وَقتاً أطول، أو جلسةً أُخرى. غيابُ النتيجة الفوريّة لا يَعني فَشل الطريقة — بل أنّ الإيقاع الداخليّ يَحتاج وَقتَه. في الدورة الكاملة، نَتعامل مع هذه الحالات بأدواتٍ خاصّة.",
    },
  ];

  const [open, setOpen] = useState(0);

  return (
    <section className="block" id="faq">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <div className="num quote">٩ · أسئلةٌ متكرّرة</div>
          <h2>قبل أن تَبدأ، إجاباتُ ما يَخطر للأكثريّة.</h2>
        </Reveal>

        <Reveal as="div" className="faq" delay={120}>
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div className={"faq-item" + (isOpen ? " is-open" : "")} key={i}>
                <button
                  className="faq-q"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                >
                  <span className="faq-q-text">{it.q}</span>
                  <span className="faq-q-mark" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className="faq-a"
                  id={`faq-a-${i}`}
                  role="region"
                  hidden={!isOpen}
                >
                  {it.a}
                </div>
              </div>
            );
          })}
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
              <span className="eyebrow">١٠ · تواصل · حجز · دورات</span>
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
        <img src="images/زن-ماء.png" alt="ماء يستلقي على ماء" className="zen-bg" />
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
          <a href="#program">المسار</a>
          <a href="#trainer">المدرِّب</a>
          <a href="#share">شارِك</a>
          <a href="#contact">تواصل</a>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Share helpers ---------- */
const WHATSAPP_DIGITS = String(
  (typeof window !== "undefined" && window.HOLNESS_WHATSAPP) || "+96896767693"
).replace(/[^0-9]/g, "");

function siteUrl() {
  const cfg = typeof window !== "undefined" && window.HOLNESS_SITE_URL;
  if (cfg) return cfg;
  if (typeof location !== "undefined") return location.href.split("#")[0];
  return "";
}
const waShare = (text) => "https://wa.me/?text=" + encodeURIComponent(text);
const tgShare = (url, text) =>
  "https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(text);
const xShare = (url, text) =>
  "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url);

async function nativeShare({ text, url }) {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title: document.title, text, url });
      return true;
    } catch (e) {
      if (e && e.name === "AbortError") return true; // user closed sheet — done
    }
  }
  return false;
}

/* Inline share icons */
function ShareIcon({ name }) {
  if (name === "whatsapp")
    return (
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16.001.04C7.16.04.04 7.16.04 16.001c0 2.825.74 5.585 2.146 8.018L0 32l8.196-2.147A15.94 15.94 0 0016 31.96C24.84 31.96 31.96 24.84 31.96 16S24.84.04 16.001.04zM23.32 19.4c-.4-.2-2.366-1.166-2.733-1.3-.366-.133-.633-.2-.9.2-.266.4-1.033 1.3-1.266 1.566-.234.267-.467.3-.866.1-.4-.2-1.7-.626-3.234-1.992-1.194-1.066-2-2.382-2.234-2.782-.234-.4-.025-.616.175-.815.18-.18.4-.467.6-.7.2-.234.266-.4.4-.667.133-.266.066-.5-.034-.7-.1-.2-.9-2.166-1.233-2.966-.324-.778-.654-.672-.9-.685l-.766-.014c-.267 0-.7.1-1.067.5-.366.4-1.4 1.366-1.4 3.332s1.434 3.866 1.634 4.132c.2.267 2.82 4.302 6.832 6.032.954.412 1.7.659 2.282.842.958.305 1.83.262 2.52.16.769-.115 2.367-.967 2.7-1.9.334-.933.334-1.733.234-1.9z" />
      </svg>
    );
  if (name === "telegram")
    return (
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16 0C7.16 0 0 7.16 0 16s7.16 16 16 16 16-7.16 16-16S24.84 0 16 0zm7.42 10.96l-2.48 11.7c-.19.83-.68 1.04-1.38.65l-3.8-2.8-1.83 1.76c-.2.2-.37.37-.76.37l.27-3.86 7.04-6.37c.31-.27-.07-.42-.47-.16l-8.7 5.48-3.75-1.17c-.81-.25-.83-.81.17-1.2l14.66-5.65c.68-.25 1.27.16 1.03 1.25z" />
      </svg>
    );
  if (name === "x")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.967 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
      </svg>
    );
  // link / copy
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M9 12h6M10.5 7.5l1.2-1.2a4 4 0 015.7 5.7l-1.2 1.2M13.5 16.5l-1.2 1.2a4 4 0 01-5.7-5.7l1.2-1.2" />
    </svg>
  );
}

/* Row of buttons to share the whole site */
function SiteShare() {
  const [copied, setCopied] = useState(false);
  const url = siteUrl();
  const text = "اكتشفْ «الهولنس وورك» — عمليّةُ التكامل: تقنيةٌ تأمُّليّةٌ لطيفةٌ تَلتقي بمشاعرك حيث تَسكنُ في الجسد.";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      window.prompt("انسخ الرابط:", url);
    }
  };

  return (
    <div className="site-share">
      <a className="ss-btn ss-wa" href={waShare(text + "\n" + url)} target="_blank" rel="noopener" aria-label="مشاركة عبر واتساب">
        <ShareIcon name="whatsapp" /> <span>واتساب</span>
      </a>
      <a className="ss-btn ss-tg" href={tgShare(url, text)} target="_blank" rel="noopener" aria-label="مشاركة عبر تلجرام">
        <ShareIcon name="telegram" /> <span>تلجرام</span>
      </a>
      <a className="ss-btn ss-x" href={xShare(url, text)} target="_blank" rel="noopener" aria-label="مشاركة عبر إكس">
        <ShareIcon name="x" /> <span>إكس</span>
      </a>
      <button type="button" className={"ss-btn ss-copy" + (copied ? " is-copied" : "")} onClick={copy} aria-label="نسخ الرابط">
        <ShareIcon name="link" /> <span>{copied ? "تمّ النسخ ✓" : "نسخ الرابط"}</span>
      </button>
    </div>
  );
}

/* ---------- Program / Learning path ---------- */
function ProgramPath() {
  const tg = (typeof window !== "undefined" && window.HOLNESS_TELEGRAM_URL) || "https://t.me/+T0NgNLn-neEwZTNk";
  const waMsg = encodeURIComponent(
    "السلام عليكم، أودّ الاستفسار عن مستويات دورة الهولنس وورك — السعر والموعد القادم."
  );
  const wa = `https://wa.me/${WHATSAPP_DIGITS}?text=${waMsg}`;

  const tiers = [
    {
      tone: "tg free",
      tag: "مجّانيّة",
      platform: "تلجرام",
      title: "المدخل — دورةٌ تعريفيّة",
      body:
        "ثلاثةُ أيّامٍ تَتدرَّج معك: لقاءٌ أوّلٌ بالمفاهيم، تجربةٌ عمليّةٌ كاملة، ثمّ خريطةُ الطريق. مدخلُك اللطيف للتقنية دون تسجيلٍ ولا التزام.",
      meta: ["٣ أيّام", "على تلجرام", "مجّانيّة تماماً"],
      cta: { label: "انضمَّ على تلجرام", href: tg, kind: "tg", icon: "telegram" },
    },
    {
      tone: "tg",
      tag: "المستوى الأوّل والثاني",
      platform: "تلجرام",
      title: "الأساسُ الكامل للتقنية",
      body:
        "تَتعمَّق في المفاتيح الخمسة، وتُتقِن الخطواتِ السبعَ عبرَ تطبيقٍ موجَّهٍ وجلساتٍ صوتيّة — حتى تَصير العمليّةُ مهارةً بين يديك تَستخدمها متى شئت.",
      meta: ["على تلجرام", "نظريّ + تطبيق موجَّه", "جلسات صوتيّة"],
      cta: { label: "اسأل عن الموعد والسعر", href: wa, kind: "wa", icon: "whatsapp" },
    },
    {
      tone: "online",
      tag: "المستويات المتقدّمة",
      platform: "أونلاين · مباشر",
      title: "التعمُّقُ والإتقان",
      body:
        "العملُ المتقدّمُ في جلساتٍ حيّةٍ مباشرةٍ عبرَ الإنترنت — تطبيقٌ أعمق، التعاملُ مع الحالات الخاصّة، ومرافقةٌ شخصيّةٌ حتى الرسوخ.",
      meta: ["أونلاين مباشر", "جلسات حيّة", "مرافقة شخصيّة"],
      cta: { label: "تواصلْ للتفاصيل", href: wa, kind: "wa", icon: "whatsapp" },
    },
  ];

  return (
    <section className="block" id="program">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <div className="num quote">٨ · المسار</div>
          <h2>رحلتُك في الهولنس وورك — مستوًى تلو مستوى.</h2>
        </Reveal>

        <Reveal>
          <p className="program-intro">
            تَبدأ مجّاناً على تلجرام، وتَتدرَّج إلى الأساس الكامل، ثمّ إلى العمل
            المتقدّم المباشر — كلُّ مستوًى يَبني على الذي قبله، بإيقاعٍ يَحترم رحلتَك.
          </p>
        </Reveal>

        <Reveal as="div" className="program-track" delay={120}>
          {tiers.map((t, i) => (
            <article className={`tier ${t.tone}`} key={i}>
              <div className="tier-rail" aria-hidden="true">
                <span className="tier-dot"></span>
              </div>
              <div className="tier-body">
                <div className="tier-top">
                  <span className="tier-tag">{t.tag}</span>
                  <span className={"tier-platform " + (t.tone.includes("online") ? "is-online" : "is-tg")}>
                    {t.platform}
                  </span>
                </div>
                <h3>{t.title}</h3>
                <p>{t.body}</p>
                <div className="tier-meta">
                  {t.meta.map((m, j) => (
                    <span key={j}>{m}</span>
                  ))}
                </div>
              </div>
              <div className="tier-cta">
                <a
                  className={"tier-btn " + (t.cta.kind === "tg" ? "is-tg" : t.cta.kind === "wa" ? "is-wa" : "is-plain")}
                  href={t.cta.href}
                  target="_blank"
                  rel="noopener"
                >
                  <ShareIcon name={t.cta.icon} />
                  {t.cta.label}
                </a>
              </div>
            </article>
          ))}
        </Reveal>

        <Reveal as="p" className="program-note" delay={200}>
          السعرُ والمواعيدُ تُحدَّد مع كلّ دفعةٍ جديدة — تواصلْ عبرَ واتساب لمعرفة
          أقربِ موعدٍ والتفاصيلِ كاملة.
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Share band (quote cards + site share) ---------- */
function ShareBand() {
  const url = siteUrl();
  const quotes = [
    { text: "ما تَبحث عنه، كان دائماً موجوداً بداخلك.", attr: "روحُ الهولنس وورك" },
    { text: "الذاتُ الحقيقيّةُ لا يُمكن العثورُ عليها بالبحث، لأنها لم تُفقَد أصلاً.", attr: "رامانا مهارشي" },
    { text: "لا تَطرد الإحساس — ادعُه ليَنحلَّ في الوعي الذي يَحتويه.", attr: "عمليّةُ التكامل" },
  ];

  const [copiedIdx, setCopiedIdx] = useState(-1);

  const shareQuote = async (q, i) => {
    const text = `«${q.text}»\n— ${q.attr}`;
    if (await nativeShare({ text, url })) return;
    window.open(waShare(text + "\n" + url), "_blank", "noopener");
  };
  const copyQuote = async (q, i) => {
    const text = `«${q.text}»\n— ${q.attr}\n${url}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(i);
      setTimeout(() => setCopiedIdx(-1), 1800);
    } catch (e) {
      window.prompt("انسخ الاقتباس:", text);
    }
  };

  return (
    <section className="block share-section" id="share">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <div className="num quote">شارِك</div>
          <h2>ساعِدْ غيرَك أن يَجد الطمأنينة.</h2>
        </Reveal>

        <Reveal>
          <p className="program-intro">
            ربّما يَحمل أحدُ مَن تُحبّ ثِقلاً يَبحث عن مَخرج. مشاركةُ كلمةٍ، أو
            رابطِ هذه الصفحة، قد تَكون بدايةَ طريقِه. خُذ ما يَلمسك وانشُره.
          </p>
        </Reveal>

        <Reveal as="div" className="share-quotes" delay={120}>
          {quotes.map((q, i) => (
            <figure className="qcard" key={i}>
              <BrandMark />
              <blockquote>«{q.text}»</blockquote>
              <figcaption>— {q.attr}</figcaption>
              <div className="qcard-actions">
                <button type="button" className="qbtn qbtn-primary" onClick={() => shareQuote(q, i)}>
                  شارِك
                </button>
                <button
                  type="button"
                  className={"qbtn qbtn-ghost" + (copiedIdx === i ? " is-copied" : "")}
                  onClick={() => copyQuote(q, i)}
                >
                  {copiedIdx === i ? "تمّ النسخ ✓" : "نسخ"}
                </button>
              </div>
            </figure>
          ))}
        </Reveal>

        <Reveal as="div" className="share-foot" delay={200}>
          <div className="share-foot-label">أو شارِك الصفحةَ كاملة</div>
          <SiteShare />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- App ---------- */
function App() {
  const [lbIndex, setLbIndex] = useState(null);
  const open = (i) => setLbIndex(i);
  const close = () => setLbIndex(null);
  const nav = (delta) => {
    setLbIndex((cur) => {
      if (cur === null) return cur;
      const n = GALLERY_ITEMS.length;
      return ((cur + delta) % n + n) % n;
    });
  };
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
        <ProgramPath />
        <Faq />
        <Contact />
        <ShareBand />
        <Closing />
      </main>
      <Footer />
      <Lightbox
        index={lbIndex}
        items={GALLERY_ITEMS}
        onClose={close}
        onNav={nav}
      />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
