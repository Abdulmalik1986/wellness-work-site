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
  const audioRef = useRef(null);
  // Tracks a deferred-start pending the first user gesture. Browsers block
  // programmatic play() without prior interaction; if the saved preference
  // is "on", we wait for any click/keydown and resume from there.
  const pendingStartRef = useRef(false);

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
      className={"music-toggle" + (playing ? " is-playing" : "")}
      onClick={toggle}
      aria-label={playing ? "إيقاف موسيقى الخلفية" : "تشغيل موسيقى الخلفية"}
      title={playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
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
        <MusicToggle />
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
    { src: "images/زن-ماء.png",        cap: "ماءٌ يستلقي على ماء — جوهر الطريقة",  span: "span-4" },
    { src: "images/ركائز.png",         cap: "ثلاث ركائزَ تَجعل هذا المنهج مختلفاً",  span: "span-2" },
    { src: "images/مفتاح-الأنا.png",   cap: "الأنا ليست مفهوماً... بل موقعٌ فعليّ", span: "span-3" },
    { src: "images/تضمين-جذري.png",    cap: "ذروة الاستنارة — التضمين الجذريّ",     span: "span-3" },
    { src: "images/مسار-سعة.png",      cap: "المسار الثاني — التحوّل إلى السَّعة",   span: "span-3" },
    { src: "images/مسار-طبقة.png",     cap: "المسار الثالث — انكشاف طبقةٍ جديدة",   span: "span-3" },
    { src: "images/فخ-البحث.png",      cap: "فخّ البحث المستمرّ في الخارج",          span: "span-3" },
    { src: "images/سر-عظيم.png",       cap: "السرّ العظيم — «المفقود» لم يكن خارجاً قطّ", span: "span-3" },
    { src: "images/مؤشرات.png",        cap: "مؤشّرات التحوّل واكتمال العمليّة",      span: "span-6" },
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

/* ---------- Experience (guided inner journey) ---------- */
const EXPERIENCE_TELEGRAM_URL =
  (typeof window !== "undefined" && window.HOLNESS_TELEGRAM_URL) ||
  "https://t.me/+holnesswork";

const SENSATION_QUESTIONS = [
  {
    id: "state",
    section: "حالته الجوهرية",
    text: "كيف يَحضر إليك هذا الإحساس الآن؟ كأنّه…",
    hint: "أنصت إليه قبل أن تختار — أيُّ الحالات تُشبهه أكثر؟",
    type: "choice",
    options: ["صلب", "سائل", "غازي", "ضبابي", "ضوئيّ", "فارغ"],
  },
  {
    id: "thermal",
    section: "طبيعته الحرارية",
    text: "كيف هي حرارته؟",
    hint: "اقترب من الإحساس بانتباهٍ هادئ، ثم اختَر الموضع الأقرب.",
    type: "spectrum",
    options: ["حارق", "دافئ", "فاتر", "محايد", "بارد قليلاً", "بارد", "متجمّد"],
    labels: ["حارق", "متجمّد"],
  },
  {
    id: "weight",
    section: "ثِقَله",
    text: "ما إحساس ثِقَله؟",
    hint: "شدُّ الإحساس نحو الأسفل، بصرف النظر عن امتلائه.",
    type: "spectrum",
    options: [
      "بلا وزن",
      "خفيفٌ جداً",
      "خفيف",
      "متوسط",
      "ثقيل",
      "ثقيلٌ جداً",
      "ضاغطٌ بشدّة",
    ],
    labels: ["بلا وزن", "ثقيلٌ جداً"],
  },
  {
    id: "motion",
    section: "حركته",
    text: "هل هو ثابتٌ أم فيه حركة؟",
    hint:
      "حتى الإحساس الذي يَبدو ساكناً قد يَحمل نبضةً خفيّة — لاحظها قبل أن تختار.",
    type: "choice",
    options: ["ثابتٌ تماماً", "فيه حركةٌ خفيّة", "متحرّكٌ بوضوح", "يَنبض ويَهتزّ"],
  },
  {
    id: "locus",
    section: "موقعه",
    text: "أين يَقع في فضاء جسدك أو وعيك؟",
    hint: "قد لا يكون له موضعٌ تشريحيّ — يكفي أن تُشير إلى ما تَجده في إحساسك.",
    type: "choice",
    options: ["داخل الجسد", "خارج الجسد", "في الداخل والخارج معاً"],
  },
];

const ORD_OBS = ["الأول", "الثاني", "الثالث"];

function arDigits(n) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
}

function Experience() {
  const [stage, setStage] = useState({ kind: "welcome" });
  const [primary, setPrimary] = useState({ name: "", location: "" });
  const [sensation, setSensation] = useState({});
  const [observers, setObservers] = useState([]);

  // Form drafts kept separately so users can edit live without committing.
  const [pName, setPName] = useState("");
  const [pLoc, setPLoc] = useState("");
  const [oName, setOName] = useState("");
  const [oLoc, setOLoc] = useState("");
  const [oType, setOType] = useState("");

  // Visual highlight of the just-clicked sensation choice during the
  // 420ms hold before auto-advancing to the next question.
  const [lastSensChoice, setLastSensChoice] = useState({ qid: "", val: "" });
  const advanceTimerRef = useRef(null);
  useEffect(() => () => clearTimeout(advanceTimerRef.current), []);

  const totalSteps = 7;
  const stepIndex = (() => {
    switch (stage.kind) {
      case "welcome":
        return 1;
      case "primary":
        return 2;
      case "sensation":
        return 3;
      case "portrait":
        return 4;
      case "observer":
        return 5;
      case "invite":
        return 6;
      case "another":
      case "complete":
      default:
        return 7;
    }
  })();

  // ── transitions ──────────────────────────────────────────────────────
  function gotoPrimary() {
    setPName(primary.name);
    setPLoc(primary.location);
    setStage({ kind: "primary" });
  }
  function submitPrimary() {
    setPrimary({ name: pName.trim(), location: pLoc.trim() });
    setSensation({});
    setStage({ kind: "sensation", idx: 0 });
  }
  function chooseSens(idx, qid, val) {
    setSensation((prev) => ({ ...prev, [qid]: val }));
    setLastSensChoice({ qid, val });
    clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = setTimeout(() => {
      setLastSensChoice({ qid: "", val: "" });
      if (idx + 1 < SENSATION_QUESTIONS.length) {
        setStage({ kind: "sensation", idx: idx + 1 });
      } else {
        setStage({ kind: "portrait" });
      }
    }, 420);
  }
  function gotoObserver(idx) {
    const existing = observers[idx] || { name: "", location: "", type: "" };
    setOName(existing.name);
    setOLoc(existing.location);
    setOType(existing.type);
    setStage({ kind: "observer", idx });
  }
  function submitObserver(idx) {
    const next = observers.slice();
    next[idx] = {
      name: oName.trim(),
      location: oLoc.trim(),
      type: oType,
      merged: false,
    };
    setObservers(next);
    setStage({ kind: "invite", idx });
  }
  function onMerge(idx, merged) {
    const next = observers.slice();
    next[idx] = { ...next[idx], merged };
    setObservers(next);
    if (idx + 1 < 3) {
      setStage({ kind: "another", idx });
    } else {
      setStage({ kind: "complete" });
    }
  }
  function restart() {
    setPrimary({ name: "", location: "" });
    setSensation({});
    setObservers([]);
    setPName("");
    setPLoc("");
    setOName("");
    setOLoc("");
    setOType("");
    setStage({ kind: "welcome" });
  }

  // ── screen builders ──────────────────────────────────────────────────
  let card;
  if (stage.kind === "welcome") {
    card = (
      <div className="exp-screen exp-welcome">
        <div className="exp-orb" aria-hidden="true"></div>
        <p className="exp-prompt">ابدأ حين تكون مستعدّاً.</p>
        <p className="exp-hint">
          خُذ نَفساً عميقاً. سأَسألك أسئلةً قصيرة — أَنصِت إلى ما يَحضر، لا
          إلى ما تَعرفه.
        </p>
        <div className="exp-meta-line" aria-hidden="true">
          <span>٥–١٠ دقائق</span>
          <i></i>
          <span>مكانٌ هادئ</span>
          <i></i>
          <span>حضورٌ صادق</span>
        </div>
        <div className="exp-actions">
          <button className="exp-btn exp-btn-primary" onClick={gotoPrimary}>
            ابدأ المسار
          </button>
        </div>
        <p className="exp-fine">
          هذه ليست نصيحةً طبيّة أو نفسيّة. إن كنتَ تَمرّ بضائقةٍ شديدة، تواصَل
          مع مختصٍّ مؤهَّل.
        </p>
      </div>
    );
  } else if (stage.kind === "primary") {
    const canNext = pName.trim() && pLoc.trim();
    card = (
      <div className="exp-screen">
        <div className="exp-eyebrow">المرحلة الأولى</div>
        <p className="exp-prompt">ما الشعور الذي يَحضر إليك الآن؟</p>
        <p className="exp-hint">
          لا تَحكم عليه ولا تُفسِّره — فقط سَمِّه باسمه الأقرب.
        </p>
        <div className="exp-field">
          <input
            type="text"
            value={pName}
            onChange={(e) => setPName(e.target.value)}
            placeholder="مثال: قلقٌ في صدري، ثِقَلٌ غامض، حنين…"
            autoFocus
          />
        </div>

        <p className="exp-prompt exp-prompt-sm">
          وأين تَجدهُ في جسدك أو وعيك؟
        </p>
        <p className="exp-hint">
          قد يكون له موضعٌ واضح، أو إحساسٌ منتشر. صِفه كما يَبدو لك.
        </p>
        <div className="exp-field">
          <input
            type="text"
            value={pLoc}
            onChange={(e) => setPLoc(e.target.value)}
            placeholder="مثال: في وسط الصدر، خلف الجبهة، حول الكتفين…"
          />
        </div>

        <div className="exp-actions">
          <button
            className="exp-btn exp-btn-ghost"
            onClick={() => setStage({ kind: "welcome" })}
          >
            رجوع
          </button>
          <button
            className="exp-btn exp-btn-primary"
            disabled={!canNext}
            onClick={submitPrimary}
          >
            متابعة
          </button>
        </div>
      </div>
    );
  } else if (stage.kind === "sensation") {
    const idx = stage.idx;
    const q = SENSATION_QUESTIONS[idx];
    const total = SENSATION_QUESTIONS.length;
    const back = () =>
      idx === 0
        ? gotoPrimary()
        : setStage({ kind: "sensation", idx: idx - 1 });

    const isSelected = (val) =>
      sensation[q.id] === val ||
      (lastSensChoice.qid === q.id && lastSensChoice.val === val);

    card = (
      <div className="exp-screen">
        <div className="exp-eyebrow">
          {q.section} &nbsp;·&nbsp; {arDigits(idx + 1)} من {arDigits(total)}
        </div>
        <p className="exp-prompt">{q.text}</p>
        <p className="exp-hint">{q.hint}</p>

        {q.type === "choice" && (
          <div className="exp-choices">
            {q.options.map((o) => (
              <button
                key={o}
                className={
                  "exp-choice" + (isSelected(o) ? " is-selected" : "")
                }
                onClick={() => chooseSens(idx, q.id, o)}
              >
                {o}
              </button>
            ))}
          </div>
        )}

        {q.type === "spectrum" && (
          <>
            <div className="exp-spectrum">
              {q.options.map((o) => (
                <button
                  key={o}
                  className={
                    "exp-spec-dot" + (isSelected(o) ? " is-selected" : "")
                  }
                  data-label={o}
                  aria-label={o}
                  onClick={() => chooseSens(idx, q.id, o)}
                ></button>
              ))}
            </div>
            <div className="exp-spec-labels">
              <span>{q.labels[0]}</span>
              <span>{q.labels[1]}</span>
            </div>
          </>
        )}

        <div className="exp-progress-dots">
          {SENSATION_QUESTIONS.map((_, i) => (
            <span
              key={i}
              className={
                i < idx ? "is-done" : i === idx ? "is-active" : ""
              }
            ></span>
          ))}
        </div>

        <div className="exp-actions">
          <button className="exp-btn exp-btn-ghost" onClick={back}>
            رجوع
          </button>
        </div>
      </div>
    );
  } else if (stage.kind === "portrait") {
    const s = sensation;
    const traits = [
      `حالته ${s.state}`,
      `حرارته ${s.thermal}`,
      `وزنه ${s.weight}`,
      s.motion,
      `موقعه ${s.locus}`,
    ]
      .filter(Boolean)
      .join(" · ");

    card = (
      <div className="exp-screen">
        <div className="exp-eyebrow">بورتريه حسّيّ</div>
        <p className="exp-lede">هذا ما رَسمتَه عن نوعيّة إحساسك الآن:</p>
        <div className="exp-portrait">
          <span className="exp-portrait-what">{primary.name}</span>
          <span className="exp-portrait-where"> — في {primary.location}</span>
          <span className="exp-portrait-traits">{traits}</span>
        </div>
        <div className="exp-ornament" aria-hidden="true">۞</div>
        <p className="exp-narration">{`— انتهى استكشاف الشعور الأساسي —

خذ لحظةً هادئة.

الآن نَتحوّل إلى شيءٍ دقيق:
هناك جزءٌ منكَ يُلاحظ هذا الشعور ويُراقبه من بعيد —
ليس الشعور نفسه، بل ذلك الذي يَعرف بوجوده.

راقب في مساحة وعيك الداخليّ.`}</p>
        <div className="exp-actions">
          <button
            className="exp-btn exp-btn-primary"
            onClick={() => gotoObserver(0)}
          >
            تابع إلى المراقب
          </button>
        </div>
      </div>
    );
  } else if (stage.kind === "observer") {
    const idx = stage.idx;
    const canNext = oName.trim() && oLoc.trim() && oType;
    card = (
      <div className="exp-screen">
        <div className="exp-eyebrow">
          المرحلة الثانية &nbsp;·&nbsp; المراقب {ORD_OBS[idx]}
        </div>
        <p className="exp-prompt">هل تَجد جزءاً منكَ يُراقب «{primary.name}»؟</p>
        <p className="exp-hint">
          قد يكون إحساساً جسديّاً، أو فكرةً ذهنيّة، أو شعوراً عاطفيّاً
          يُلاحظ من بعيد.
        </p>
        <div className="exp-field">
          <input
            type="text"
            value={oName}
            onChange={(e) => setOName(e.target.value)}
            placeholder="صف هذا المراقب باختصار…"
            autoFocus
          />
        </div>

        <p className="exp-prompt exp-prompt-sm">أين تَجده؟</p>
        <p className="exp-hint">
          في مساحة الوعي الداخلي — قد يكون أعلى الرأس، خلف العين، فوق
          الكتف…
        </p>
        <div className="exp-field">
          <input
            type="text"
            value={oLoc}
            onChange={(e) => setOLoc(e.target.value)}
            placeholder="مثال: فوق الرأس، خلف الصدر، إلى اليسار…"
          />
        </div>

        <p className="exp-prompt exp-prompt-sm">ما طبيعته الأقرب؟</p>
        <div className="exp-choices">
          {["جسديّ", "ذهنيّ", "عاطفيّ"].map((t) => (
            <button
              key={t}
              className={"exp-choice" + (oType === t ? " is-selected" : "")}
              onClick={() => setOType(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="exp-actions">
          <button
            className="exp-btn exp-btn-ghost"
            onClick={() => setStage({ kind: "portrait" })}
          >
            رجوع
          </button>
          <button
            className="exp-btn exp-btn-primary"
            disabled={!canNext}
            onClick={() => submitObserver(idx)}
          >
            متابعة
          </button>
        </div>
      </div>
    );
  } else if (stage.kind === "invite") {
    const idx = stage.idx;
    const obs = observers[idx] || {};
    card = (
      <div className="exp-screen exp-invite">
        <div className="exp-orb exp-orb-sm" aria-hidden="true"></div>
        <div className="exp-eyebrow">لحظةُ الدعوة</div>
        <p className="exp-narration">{`انتبه إلى المراقب في «${obs.location}».

استَدِر إليه بلطفٍ في وعيك،
وادْعُه — دون إجبار — إلى الاندماج معك،
لا لتُغيِّره، بل ليَكون جزءاً منكَ من جديد.

تَذكَّر أنك لستَ المتحكِّم في الاندماج —
دَع الحكمة الداخلية تَفعل عملها على إيقاعها.`}</p>
        <div className="exp-ornament" aria-hidden="true">۞</div>
        <p className="exp-prompt">هل قَبِل المراقبُ دعوةَ الاندماج؟</p>
        <div className="exp-actions exp-actions-stack">
          <button
            className="exp-btn exp-btn-accent"
            onClick={() => onMerge(idx, true)}
          >
            نعم — اكتمل الاندماج
          </button>
          <button
            className="exp-btn exp-btn-ghost"
            onClick={() => onMerge(idx, false)}
          >
            لم يَكتمل بعد
          </button>
        </div>
      </div>
    );
  } else if (stage.kind === "another") {
    const idx = stage.idx;
    card = (
      <div className="exp-screen">
        <div className="exp-eyebrow">سؤالٌ هادئ</div>
        <p className="exp-prompt">هل تَجد مراقباً آخر لهذا الشعور؟</p>
        <p className="exp-hint">
          خذ لحظةً، وانظر في مساحة وعيك — أحياناً يَظهر مراقبٌ آخر بعد أن
          يَكتمل الأول. وأحياناً تَكفي خطوةٌ واحدة.
        </p>
        <div className="exp-actions exp-actions-stack">
          <button
            className="exp-btn exp-btn-primary"
            onClick={() => gotoObserver(idx + 1)}
          >
            نعم — أرى مراقباً آخر
          </button>
          <button
            className="exp-btn exp-btn-ghost"
            onClick={() => setStage({ kind: "complete" })}
          >
            يَكفي — أنهِ التأمّل
          </button>
        </div>
      </div>
    );
  } else if (stage.kind === "complete") {
    const mergedCount = observers.filter((o) => o.merged).length;
    const total = observers.length;
    let reflection;
    if (total > 0 && mergedCount === total) {
      reflection = `كلُّ المراقبين الذين رأيتَهم قَبِلوا الدعوة (${arDigits(
        mergedCount
      )} من ${arDigits(total)}).
ربما تَلمَح اتّساعاً ناعماً، أو هدوءاً لم يَكن قبل قليل.`;
    } else if (mergedCount === 0) {
      reflection = `لم يَكتمل اندماجٌ كاملٌ هذه المرّة — وهذا تمامٌ بحدّ ذاته.
كثيراً ما يَحتاج المراقب إلى مساحةٍ أوسع، أو إلى جلسةٍ مع مُيسِّر،
ليَأذن لنفسه بالاندماج.`;
    } else {
      reflection = `اندَمج معكَ ${arDigits(mergedCount)} من أصل ${arDigits(
        total
      )} مراقبين.
لاحظ ما تَغيَّر — في الإحساس، في النَّفَس، في المساحة الداخليّة.`;
    }

    card = (
      <div className="exp-screen exp-complete">
        <div className="exp-seal" aria-hidden="true"></div>
        <div className="exp-eyebrow">نهايةُ المسار</div>
        <h3 className="exp-title">شكراً لحضورِكَ.</h3>
        <p className="exp-narration">{`${reflection}

خذ لحظةً قبل أن تَعود —
لاحظ نَفَسَكَ، ثم افتح عينيكَ على المكان الذي أنتَ فيه.`}</p>
        <div className="exp-ornament" aria-hidden="true">۞</div>
        <p className="exp-lede">
          هذه كانت لمحةً مبسّطةً من تقنية الهولنس وورك. المسارُ الكامل
          أعمَق وأرحَب — وفيه أدواتٌ لاكتشاف السلطة، والاحتياجات، والهوية،
          والتحرّر.
        </p>
        <div className="exp-actions exp-actions-stack">
          <a
            className="exp-btn exp-btn-accent"
            href={EXPERIENCE_TELEGRAM_URL}
            target="_blank"
            rel="noopener"
          >
            انضمّ إلى الدورة التعريفية على تلجرام «٣ أيام»
          </a>
          <button className="exp-btn exp-btn-ghost" onClick={restart}>
            جرّب مسارَ تأمّلٍ آخر
          </button>
        </div>
        <p className="exp-fine">
          هذه التجربة محليّة بالكامل — لم يُحفَظ شيءٌ ممّا كتبتَه.
          <br />
          ما رأيتَه هنا كان بينَك وبين نفسك فقط.
        </p>
      </div>
    );
  }

  return (
    <section className="block" id="experience">
      <div className="wrap">
        <Reveal as="div" className="experience">
          <span className="eyebrow">٥ · تجربة قصيرة</span>
          <h2>مسارٌ هادئٌ نحو الداخل.</h2>
          <p className="intro">
            ليست جلسةً كاملة — فالجلسةُ الحقيقيّة تَستغرق نحو عشرين دقيقة مع
            مُيَسِّر. هذه <em>ذوقٌ</em> موجَّه: شعورٌ واحد، خمس نوعيّاتٍ حسّيّة،
            ثم زيارةٌ هادئة لـ«المراقب» الذي يَعِيه. لا تسجيل، لا حفظ —
            بَينَكَ وبين نفسك.
          </p>

          <div className="exp-shell">
            <header className="exp-shell-head">
              <div className="exp-shell-brand">
                <BrandMark />
                <span>الهولنس وورك</span>
              </div>
              <div className="exp-shell-step">
                {arDigits(stepIndex)} / {arDigits(totalSteps)}
              </div>
            </header>
            <div
              className="exp-card"
              key={
                stage.kind +
                (stage.idx !== undefined ? ":" + stage.idx : "")
              }
            >
              {card}
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
