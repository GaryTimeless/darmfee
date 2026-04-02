import { useState, useEffect, useRef } from "react";

// ============================================================
// INHALT – hier kann Christine alles selbst anpassen ✨
// ============================================================
const CONTENT = {
  name: "Darmfee 2nd",
  tagline: "Dein Bauchgefühl hat recht",
  subtagline: "Ganzheitliche Ernährungsberatung mit Herz und Wissenschaft",
  heroButton: "Gleich Termin anfragen",
  
  about: {
    heading: "Hallo, ich bin Christine!",
    paragraphs: [
      "Als Ernährungsberaterin mit Leidenschaft für Darmgesundheit begleite ich dich dabei, dein inneres Gleichgewicht zu finden – mit fundiertem Wissen und ganz viel Empathie.",
      "Mein Fokus liegt auf dem Aufbau einer gesunden Darmflora, denn ein gesunder Darm ist die Wurzel von Energie, Wohlbefinden und Lebensfreude.",
      "Ich glaube daran, dass Gesundheit nicht kompliziert sein muss – sie darf sich gut anfühlen."
    ],
    quote: "\"Dein Darm ist dein zweites Gehirn. Lass uns gemeinsam zuhören.\"",
    imagePlaceholder: "Foto von Christine"
  },

  services: {
    heading: "Was ich für dich tue",
    items: [
      {
        icon: "🌿",
        title: "Erstgespräch",
        description: "30 Minuten, kostenlos und unverbindlich. Wir schauen gemeinsam, wo du stehst und wohin du willst.",
        badge: "Kostenlos"
      },
      {
        icon: "✨",
        title: "Darmflora Aufbau",
        description: "Individuelles 8-Wochen-Programm für eine starke und ausgewogene Darmflora – mit Ernährungsplan, Rezepten und wöchentlichem Check-in.",
        badge: "Beliebt"
      },
      {
        icon: "💚",
        title: "Einzelberatung",
        description: "Flexible 60-Minuten-Sitzungen für spezifische Fragen rund um Ernährung, Beschwerden oder Rezeptideen.",
        badge: null
      }
    ]
  },

  contact: {
    heading: "Lass uns reden",
    subheading: "Schreib mir einfach – ich freue mich auf deine Nachricht!",
    formspreeId: "DEINE_FORMSPREE_ID", // ← hier eintragen nach Registrierung auf formspree.io
    instagram: "@darmfee",
    instagramUrl: "https://www.instagram.com/darmfee",
    email: "hallo@darmfee.at"
  },

  footer: {
    impressum: "#impressum",
    datenschutz: "#datenschutz",
    copy: "© 2025 Darmfee · Christine Lohmüller"
  }
};

// ============================================================
// FARBEN & STIL – CSS-Variablen
// ============================================================
const COLORS = {
  primary: "#e8a4b8",      // Rose
  primaryLight: "#f5d5df", // Helles Rose
  secondary: "#a8c5a0",    // Salbeigrün
  secondaryLight: "#d4e8cf",
  accent: "#c4a8d4",       // Lavendel
  cream: "#fdf8f5",
  text: "#3d2c2c",
  textLight: "#7a5c5c",
  white: "#ffffff"
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Nunito', sans-serif; background: ${COLORS.cream}; color: ${COLORS.text}; overflow-x: hidden; }

  .fade-in { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-14px) rotate(3deg); }
  }
  @keyframes floatSlow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .blob1 { border-radius: 62% 38% 70% 30% / 45% 55% 45% 55%; }
  .blob2 { border-radius: 38% 62% 30% 70% / 55% 45% 55% 45%; }
  .blob3 { border-radius: 50% 50% 70% 30% / 30% 70% 50% 50%; }

  nav a:hover { color: ${COLORS.primary}; }
  
  .service-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(200, 120, 150, 0.15); }
  .service-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }

  input, textarea { outline: none; }
  input:focus, textarea:focus { border-color: ${COLORS.primary} !important; box-shadow: 0 0 0 3px ${COLORS.primaryLight}; }

  .btn-primary {
    background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent});
    color: white;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(200, 120, 150, 0.4); }
  .btn-primary:active { transform: translateY(0); }

  ::selection { background: ${COLORS.primaryLight}; color: ${COLORS.text}; }

  @media (max-width: 768px) {
    .hero-grid { flex-direction: column !important; }
    .about-grid { flex-direction: column !important; }
    .service-grid { flex-direction: column !important; align-items: center !important; }
    .nav-links { display: none !important; }
  }
`;

// ============================================================
// HELPER: Intersection Observer for fade-in
// ============================================================
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ============================================================
// NAV
// ============================================================
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "14px 32px",
      background: scrolled ? "rgba(253,248,245,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${COLORS.primaryLight}` : "none",
      transition: "all 0.35s ease",
      display: "flex", alignItems: "center", justifyContent: "space-between"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22 }}>🧚‍♀️</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: COLORS.primary }}>
          {CONTENT.name}
        </span>
      </div>
      <div className="nav-links" style={{ display: "flex", gap: 28, fontSize: 15, fontWeight: 500, color: COLORS.textLight, transition: "color 0.2s" }}>
        {[["Über mich", "#about"], ["Angebote", "#services"], ["Kontakt", "#contact"]].map(([label, href]) => (
          <a key={href} href={href} style={{ textDecoration: "none", color: COLORS.textLight, transition: "color 0.2s" }}>{label}</a>
        ))}
      </div>
      <a href="#contact" className="btn-primary" style={{ padding: "9px 22px", borderRadius: 50, fontSize: 14, fontWeight: 600, textDecoration: "none", color: "white" }}>
        Kontakt
      </a>
    </nav>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero() {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "100px 32px 60px",
      background: `linear-gradient(145deg, ${COLORS.cream} 0%, #fdeef4 50%, #f0eaf8 100%)`,
      position: "relative", overflow: "hidden"
    }}>
      {/* Decorative blobs */}
      <div className="blob1" style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, background: COLORS.primaryLight, opacity: 0.5, animation: "floatSlow 8s ease-in-out infinite" }} />
      <div className="blob2" style={{ position: "absolute", bottom: -60, left: -60, width: 280, height: 280, background: COLORS.secondaryLight, opacity: 0.5, animation: "floatSlow 11s ease-in-out infinite reverse" }} />
      <div className="blob3" style={{ position: "absolute", top: "40%", right: "25%", width: 180, height: 180, background: "#ece0f8", opacity: 0.4, animation: "floatSlow 9s ease-in-out infinite 2s" }} />

      {/* Floating emojis */}
      {[["🌿", "12%", "15%", "float 6s ease-in-out infinite"], ["💚", "80%", "20%", "float 7s ease-in-out infinite 1s"], ["✨", "20%", "70%", "float 5s ease-in-out infinite 2s"], ["🌸", "75%", "65%", "float 8s ease-in-out infinite 0.5s"]].map(([emoji, left, top, anim], i) => (
        <div key={i} style={{ position: "absolute", left, top, fontSize: 24, animation: anim, opacity: 0.7 }}>{emoji}</div>
      ))}

      <div className="hero-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 60, position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: COLORS.primaryLight,
            padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600, color: COLORS.primary, marginBottom: 24
          }}>
            <span>🧚‍♀️</span> Ernährungsberatung mit Herz
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(40px, 6vw, 68px)",
            fontWeight: 700, lineHeight: 1.15,
            color: COLORS.text, marginBottom: 20
          }}>
            {CONTENT.tagline}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: COLORS.textLight, marginBottom: 36, maxWidth: 480 }}>
            {CONTENT.subtagline}
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#contact" className="btn-primary" style={{ padding: "14px 32px", borderRadius: 50, fontSize: 16, fontWeight: 700, textDecoration: "none", color: "white" }}>
              {CONTENT.heroButton} ✨
            </a>
            <a href="#about" style={{ padding: "14px 32px", borderRadius: 50, fontSize: 16, fontWeight: 600, textDecoration: "none", color: COLORS.primary, border: `2px solid ${COLORS.primaryLight}`, transition: "all 0.2s" }}>
              Mehr erfahren
            </a>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
            {[["🌿", "Ganzheitlich"], ["💚", "Individuell"], ["✨", "Wissenschaftlich"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 13, color: COLORS.textLight, fontWeight: 500 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>{text}
              </div>
            ))}
          </div>
        </div>

        {/* Hero image placeholder */}
        <div style={{ flex: "0 0 380px", display: "flex", justifyContent: "center" }}>
          <div className="blob1" style={{
            width: 340, height: 380,
            background: `linear-gradient(145deg, ${COLORS.primaryLight}, ${COLORS.secondaryLight})`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            animation: "pulse 6s ease-in-out infinite",
            position: "relative"
          }}>
            <span style={{ fontSize: 80 }}>🧚‍♀️</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: COLORS.primary, marginTop: 8 }}>Darmfee</span>
            <span style={{ fontSize: 13, color: COLORS.textLight, marginTop: 4 }}>Christine Lohmüller</span>
            <div style={{
              position: "absolute", bottom: -12, right: -12,
              background: "white", borderRadius: 16, padding: "8px 14px",
              boxShadow: "0 4px 20px rgba(200,120,150,0.2)",
              fontSize: 13, fontWeight: 600, color: COLORS.primary
            }}>
              💚 Darmgesundheit
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ABOUT
// ============================================================
function About() {
  const ref = useFadeIn();
  return (
    <section id="about" style={{ padding: "100px 32px", background: COLORS.white }}>
      <div ref={ref} className="fade-in about-grid" style={{ maxWidth: 1000, margin: "0 auto", display: "flex", gap: 60, alignItems: "center" }}>
        {/* Photo placeholder */}
        <div style={{ flex: "0 0 300px", display: "flex", justifyContent: "center" }}>
          <div className="blob2" style={{
            width: 280, height: 320,
            background: `linear-gradient(145deg, ${COLORS.secondaryLight}, ${COLORS.primaryLight})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 60, position: "relative"
          }}>
            <span>👩‍⚕️</span>
            {/* Hier kommt Christines Foto rein */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, color: COLORS.textLight, flexDirection: "column", gap: 4,
              background: `linear-gradient(145deg, ${COLORS.secondaryLight}cc, ${COLORS.primaryLight}cc)`
            }}>
              <span style={{ fontSize: 48 }}>📸</span>
              <span>Foto folgt</span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ width: 48, height: 4, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`, borderRadius: 2, marginBottom: 16 }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700, color: COLORS.text, marginBottom: 24 }}>
            {CONTENT.about.heading}
          </h2>
          {CONTENT.about.paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.textLight, marginBottom: 14 }}>{p}</p>
          ))}
          <blockquote style={{
            marginTop: 28, padding: "16px 20px",
            borderLeft: `4px solid ${COLORS.primary}`,
            background: COLORS.primaryLight + "55",
            borderRadius: "0 12px 12px 0",
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic", fontSize: 17, color: COLORS.primary
          }}>
            {CONTENT.about.quote}
          </blockquote>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SERVICES
// ============================================================
function Services() {
  const ref = useFadeIn();
  const badges = { "Kostenlos": COLORS.secondary, "Beliebt": COLORS.primary, null: "transparent" };

  return (
    <section id="services" style={{ padding: "100px 32px", background: `linear-gradient(180deg, ${COLORS.cream}, #fdeef4)` }}>
      <div ref={ref} className="fade-in" style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ width: 48, height: 4, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`, borderRadius: 2, margin: "0 auto 16px" }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700, color: COLORS.text }}>
            {CONTENT.services.heading}
          </h2>
        </div>

        <div className="service-grid" style={{ display: "flex", gap: 24, justifyContent: "center" }}>
          {CONTENT.services.items.map((item, i) => (
            <div key={i} className="service-card" style={{
              flex: "1 1 280px", maxWidth: 300,
              background: COLORS.white, borderRadius: 24,
              padding: 32, position: "relative",
              boxShadow: "0 4px 30px rgba(200, 120, 150, 0.08)",
              border: `1px solid ${COLORS.primaryLight}`
            }}>
              {item.badge && (
                <div style={{
                  position: "absolute", top: -12, right: 20,
                  background: badges[item.badge],
                  color: "white", fontSize: 12, fontWeight: 700,
                  padding: "4px 14px", borderRadius: 50
                }}>{item.badge}</div>
              )}
              <div style={{ fontSize: 40, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: COLORS.textLight }}>
                {item.description}
              </p>
              <a href="#contact" className="btn-primary" style={{
                display: "inline-block", marginTop: 24, padding: "10px 22px",
                borderRadius: 50, fontSize: 14, fontWeight: 600, textDecoration: "none", color: "white"
              }}>
                Anfragen →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CONTACT
// ============================================================
function Contact() {
  const ref = useFadeIn();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${CONTENT.contact.formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form)
      });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 12,
    border: `1.5px solid ${COLORS.primaryLight}`, fontSize: 15,
    fontFamily: "'Nunito', sans-serif", background: COLORS.cream,
    color: COLORS.text, transition: "border-color 0.2s, box-shadow 0.2s"
  };

  return (
    <section id="contact" style={{ padding: "100px 32px", background: COLORS.white }}>
      <div ref={ref} className="fade-in" style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ width: 48, height: 4, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`, borderRadius: 2, margin: "0 auto 16px" }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
            {CONTENT.contact.heading}
          </h2>
          <p style={{ fontSize: 16, color: COLORS.textLight }}>{CONTENT.contact.subheading}</p>
        </div>

        {/* Social / Email pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
          <a href={`mailto:${CONTENT.contact.email}`} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
            borderRadius: 50, border: `1.5px solid ${COLORS.primaryLight}`,
            textDecoration: "none", color: COLORS.primary, fontWeight: 600, fontSize: 14
          }}>
            ✉️ {CONTENT.contact.email}
          </a>
          <a href={CONTENT.contact.instagramUrl} target="_blank" rel="noreferrer" style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
            borderRadius: 50, background: `linear-gradient(135deg, #f9a8d4, #c4a8d4)`,
            textDecoration: "none", color: "white", fontWeight: 600, fontSize: 14
          }}>
            📸 {CONTENT.contact.instagram}
          </a>
        </div>

        {/* Form */}
        <div style={{ background: COLORS.cream, borderRadius: 24, padding: "40px", border: `1px solid ${COLORS.primaryLight}` }}>
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🌸</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: COLORS.primary, marginBottom: 10 }}>Danke für deine Nachricht!</h3>
              <p style={{ color: COLORS.textLight }}>Christine meldet sich bald bei dir. 💚</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.textLight, display: "block", marginBottom: 6 }}>Dein Name</label>
                  <input style={inputStyle} placeholder="Dein Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.textLight, display: "block", marginBottom: 6 }}>E-Mail</label>
                  <input style={inputStyle} type="email" placeholder="deine@email.at" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.textLight, display: "block", marginBottom: 6 }}>Deine Nachricht</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 130, resize: "vertical" }}
                  placeholder="Was beschäftigt dich? Ich freue mich auf deine Nachricht! 🌿"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={status === "sending"} style={{
                width: "100%", padding: "15px", borderRadius: 50, fontSize: 16, fontWeight: 700
              }}>
                {status === "sending" ? "Wird gesendet... ✨" : "Nachricht senden 🌸"}
              </button>
              {status === "error" && <p style={{ color: "#e07070", textAlign: "center", marginTop: 12, fontSize: 14 }}>Etwas ist schiefgelaufen – bitte direkt per E-Mail schreiben!</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer style={{
      background: COLORS.text, color: "rgba(255,255,255,0.6)",
      padding: "28px 32px", textAlign: "center", fontSize: 13
    }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 12 }}>
        <a href={CONTENT.footer.impressum} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Impressum</a>
        <a href={CONTENT.footer.datenschutz} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Datenschutz</a>
      </div>
      <div style={{ color: "rgba(255,255,255,0.35)" }}>{CONTENT.footer.copy}</div>
    </footer>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div>
      <Nav />
      <Hero />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}
