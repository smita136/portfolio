import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f7fffe;
    --surface: #ffffff;
    --surface2: #e8faf8;
    --border: rgba(13,148,136,0.12);
    --accent: #0d9488;
    --accent2: #0e7490;
    --accent3: #f43f5e;
    --text: #0c1a18;
    --muted: #5f8a87;
    --mono: 'Space Mono', monospace;
    --sans: 'Syne', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: var(--sans); overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

  .noise {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E");
    opacity: 0.5;
  }
  .grid-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: linear-gradient(rgba(13,148,136,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,0.05) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 18px 40px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(247,255,254,0.90); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo { font-family: var(--mono); font-size: 18px; color: var(--accent); }
  .nav-logo span { color: var(--muted); }
  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-links a { font-family: var(--mono); font-size: 13px; color: var(--muted); text-decoration: none; transition: color 0.2s; letter-spacing: 0.5px; }
  .nav-links a:hover { color: var(--accent); }
  .nav-cta { font-family: var(--mono); font-size: 13px; color: var(--bg); background: var(--accent); border: none; padding: 10px 22px; cursor: pointer; font-weight: 700; letter-spacing: 0.5px; transition: opacity 0.2s; }
  .nav-cta:hover { opacity: 0.85; }
  .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
  .hamburger span { display: block; width: 24px; height: 2px; background: var(--accent); }

  .hero { min-height: 100vh; display: flex; align-items: center; padding: 120px 40px 80px; position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }
  .hero-content { max-width: 700px; }
  .hero-tag { font-family: var(--mono); font-size: 13px; color: var(--accent); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
  .hero-tag::before { content: ''; display: block; width: 40px; height: 1px; background: var(--accent); }
  .hero-name { font-size: clamp(52px, 8vw, 96px); font-weight: 800; line-height: 0.95; letter-spacing: -3px; margin-bottom: 8px; }
  .hero-name .line2 { color: var(--accent); display: block; }
  .hero-title { font-family: var(--mono); font-size: clamp(14px, 2vw, 17px); color: var(--muted); margin: 28px 0; line-height: 1.9; }
  .hero-title .hl { color: var(--accent2); }
  .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
  .btn-primary { font-family: var(--mono); font-size: 13px; font-weight: 700; color: var(--bg); background: var(--accent); border: none; padding: 14px 32px; cursor: pointer; letter-spacing: 1px; text-transform: uppercase; transition: transform 0.2s, box-shadow 0.2s; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(13,148,136,0.25); }
  .btn-outline { font-family: var(--mono); font-size: 13px; font-weight: 700; color: var(--accent); background: transparent; border: 1px solid var(--accent); padding: 14px 32px; cursor: pointer; letter-spacing: 1px; text-transform: uppercase; transition: background 0.2s; }
  .btn-outline:hover { background: rgba(13,148,136,0.07); }
  .hero-orb { position: absolute; right: -100px; top: 50%; transform: translateY(-50%); width: 600px; height: 600px; background: radial-gradient(circle at 40% 40%, rgba(13,148,136,0.10), rgba(14,116,144,0.06), transparent 70%); border-radius: 50%; pointer-events: none; animation: pulse 6s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{transform:translateY(-50%) scale(1);opacity:1}50%{transform:translateY(-50%) scale(1.08);opacity:0.7} }
  .hero-stats { display: flex; gap: 48px; margin-top: 60px; flex-wrap: wrap; }
  .stat-num { font-size: 36px; font-weight: 800; color: var(--accent); line-height: 1; }
  .stat-label { font-family: var(--mono); font-size: 12px; color: var(--muted); margin-top: 6px; letter-spacing: 1px; }

  .section { padding: 100px 40px; max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
  .section-label { font-family: var(--mono); font-size: 12px; color: var(--accent); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
  .section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--accent), rgba(13,148,136,0.1)); max-width: 200px; }
  .section-title { font-size: clamp(32px, 5vw, 52px); font-weight: 800; letter-spacing: -2px; margin-bottom: 60px; line-height: 1; }

  .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
  .skill-card { background: var(--surface); border: 1px solid var(--border); padding: 20px 16px; cursor: default; transition: border-color 0.2s, transform 0.2s; position: relative; overflow: hidden; }
  .skill-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(13,148,136,0.06), transparent); opacity: 0; transition: opacity 0.3s; }
  .skill-card:hover { border-color: var(--accent); transform: translateY(-3px); }
  .skill-card:hover::before { opacity: 1; }
  .skill-icon { font-size: 28px; margin-bottom: 10px; }
  .skill-name { font-family: var(--mono); font-size: 13px; font-weight: 700; }
  .skill-level { margin-top: 10px; height: 2px; background: var(--border); border-radius: 2px; }
  .skill-level-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 1.2s ease; }

  .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
  .project-card { background: var(--surface); border: 1px solid var(--border); overflow: hidden; transition: border-color 0.3s, transform 0.3s; cursor: pointer; }
  .project-card:hover { border-color: var(--accent); transform: translateY(-6px); }
  .project-img { width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; font-size: 64px; position: relative; overflow: hidden; }
  .project-body { padding: 28px; }
  .project-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
  .tag { font-family: var(--mono); font-size: 11px; color: var(--accent2); background: rgba(0,170,255,0.08); border: 1px solid rgba(0,170,255,0.2); padding: 4px 10px; letter-spacing: 0.5px; }
  .project-title { font-size: 22px; font-weight: 700; margin-bottom: 10px; letter-spacing: -0.5px; }
  .project-desc { font-family: var(--mono); font-size: 13px; color: var(--muted); line-height: 1.8; }
  .project-links { display: flex; gap: 16px; margin-top: 20px; }
  .project-link { font-family: var(--mono); font-size: 12px; color: var(--accent); text-decoration: none; letter-spacing: 0.5px; transition: opacity 0.2s; }
  .project-link:hover { opacity: 0.7; }

  .timeline { position: relative; }
  .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: linear-gradient(180deg, var(--accent), rgba(13,148,136,0.1)); }
  .timeline-item { padding-left: 36px; padding-bottom: 56px; position: relative; }
  .timeline-dot { position: absolute; left: -6px; top: 6px; width: 13px; height: 13px; background: var(--accent); border: 3px solid var(--bg); border-radius: 50%; }  .timeline-date { font-family: var(--mono); font-size: 12px; color: var(--accent); letter-spacing: 1px; margin-bottom: 8px; }
  .timeline-role { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 4px; }
  .timeline-company { font-family: var(--mono); font-size: 14px; color: var(--accent2); margin-bottom: 16px; }
  .timeline-desc { font-family: var(--mono); font-size: 13px; color: var(--muted); line-height: 1.9; }

  .contact-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  .contact-info h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
  .contact-info p { font-family: var(--mono); font-size: 13px; color: var(--muted); line-height: 1.9; margin-bottom: 36px; }
  .contact-item { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
  .contact-item-icon { width: 44px; height: 44px; background: var(--surface2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .contact-item-text { font-family: var(--mono); font-size: 13px; }
  .contact-item-label { color: var(--muted); font-size: 11px; letter-spacing: 1px; margin-bottom: 2px; }
  .contact-form { display: flex; flex-direction: column; gap: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-label { font-family: var(--mono); font-size: 12px; color: var(--muted); letter-spacing: 1px; }
  .form-input { background: var(--surface); border: 1px solid var(--border); color: var(--text); font-family: var(--mono); font-size: 14px; padding: 14px 16px; outline: none; transition: border-color 0.2s; }
  .form-input:focus { border-color: var(--accent); }
  .form-input::placeholder { color: var(--muted); }
  textarea.form-input { resize: vertical; min-height: 120px; }

  .footer { border-top: 1px solid var(--border); padding: 40px; display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1; flex-wrap: wrap; gap: 20px; }
  .footer-text { font-family: var(--mono); font-size: 13px; color: var(--muted); }
  .footer-socials { display: flex; gap: 16px; }
  .social-btn { width: 40px; height: 40px; background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; text-decoration: none; transition: border-color 0.2s, background 0.2s; color: var(--text); }
  .social-btn:hover { border-color: var(--accent); background: rgba(13,148,136,0.06); }

  .mobile-menu { display: none; position: fixed; inset: 0; z-index: 99; background: rgba(247,255,254,0.98); backdrop-filter: blur(20px); flex-direction: column; align-items: center; justify-content: center; gap: 36px; }
  .mobile-menu.open { display: flex; }
  .mobile-menu a { font-family: var(--mono); font-size: 20px; color: var(--text); text-decoration: none; letter-spacing: 2px; transition: color 0.2s; }
  .mobile-menu a:hover { color: var(--accent); } top: 20px; right: 24px; background: none; border: none; color: var(--accent); font-size: 28px; cursor: pointer; font-family: var(--mono); }

  .cursor-glow { position: fixed; pointer-events: none; z-index: 9999; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(13,148,136,0.07), transparent 70%); transform: translate(-50%, -50%); transition: left 0.15s ease, top 0.15s ease; }

  @media (max-width: 900px) {
    .nav-links, .nav-cta { display: none; }
    .hamburger { display: flex; }
    .hero { padding: 100px 24px 60px; }
    .hero-orb { display: none; }
    .section { padding: 70px 24px; }
    .contact-wrap { grid-template-columns: 1fr; gap: 48px; }
    .projects-grid { grid-template-columns: 1fr; }
    .footer { padding: 30px 24px; }
    .nav { padding: 16px 24px; }
  }
  @media (max-width: 480px) {
    .hero-name { letter-spacing: -2px; }
    .skills-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

const skills = [
  { icon: "🔥", name: "CodeIgniter 4", level: 95 },
  { icon: "🐘", name: "PHP", level: 90 },
  { icon: "🐘", name: "PostgreSQL", level: 85 },
  { icon: "🐬", name: "MySQL", level: 75 },
  { icon: "🔶", name: "Firebase", level: 82 },
  { icon: "🐍", name: "Python", level: 80 },
  { icon: "☕", name: "Java", level: 75 },
  { icon: "💻", name: "C", level: 80 },
  { icon: "🔧", name: "Git", level: 95 },
];

const projects = [
  { emoji: "📊", bg: "linear-gradient(135deg,#f0fdfa,#e0f7f4)", tags: ["React.js","CodeIgniter4","PostgreSQL"], title: "Advanced Review Practice – SLP", desc: "A web-based system where administrator manage student records, course materials, and test data, while students access learning resources, participate in assessments, and monitor their performance." },
  { emoji: "📊", bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)", tags: ["React.js","CodeIgniter4","PostgreSQL"], title: "Logemann's Evaluation and Treatment of Swallowing Disorders", desc: "A web-based application designed to facilitate student data management, book content delivery, and assessment handling by administrators, while enabling students to access resources and evaluate their performance." },
  { emoji: "📊", bg: "linear-gradient(135deg,#f0fdfd,#ccfbf1)", tags: ["React.js","CodeIgniter4","PostgreSQL"], title: "Introduction to Communicative Disorders", desc: "A web-based system for administrators to manage student records and book contents, providing students with access to learning resources." },
  { emoji: "📊", bg: "linear-gradient(135deg,#e0f7f4,#f0fdfa)", tags: ["React.js","CodeIgniter4","PostgreSQL"], title: "Clin-Ed", desc: "A web-based system in which the administrator manages student records, course data, surveys, and grades, while students access course materials, participate in surveys, and receive notifications, improving communication and academic management." },
  { emoji: "💬", bg: "linear-gradient(135deg,#ecfeff,#cffafe)", tags: ["Java","Firebase"], title: "Society Connect : A Smart Apartment Management App", desc: "A mobile application designed to efficiently manage and streamline the day-to-day activities of a residential society.", github: "#", live: "#" },
];

const experience = [
  { date: "August 2024 — Present", role: "Junior Software Engineer", company: "Online Productivity Solutions Pvt. Ltd.", desc: "Developed and maintained backend logic for 5+ client web applications using PHP (CodeIgniter 4) and PostgreSQL. Integrated third-party APIs (email, phpoffice) to improve app functionality. Implemented authentication and role-based access control systems for secure data handling." },
  { date: "January 2024 – June 2024", role: "Software Engineering Intern", company: "Online Productivity Solutions Pvt. Ltd.", desc: "Developed RESTful APIs using CodeIgniter 4 framework and PostgreSQL to support web applications. Optimized queries for better performance and collaborated with frontend developers to integrate APIs seamlessly with user interfaces." },
];

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursor, setCursor] = useState({ x: -999, y: -999 });
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const move = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setSkillsVisible(true); }, { threshold: 0.2 });
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  const handleSend = () => {
    if (!formData.name || !formData.email) return;
    setSent(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <style>{style}</style>
      <div className="noise" />
      <div className="grid-bg" />
      <div className="cursor-glow" style={{ left: cursor.x, top: cursor.y }} />

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        {["About","Skills","Projects","Experience","Contact"].map(s => (
          <a key={s} href={`#${s.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{s}</a>
        ))}
      </div>

      <nav className="nav">
        <div className="nav-logo">smita<span>.</span>tech</div>
        <ul className="nav-links">
          {["About","Skills","Projects","Experience","Contact"].map(s => (
            <li key={s}><a href={`#${s.toLowerCase()}`}>{s}</a></li>
          ))}
        </ul>
        <button className="nav-cta" onClick={() => scrollTo("contact")}>Hire Me</button>
        <button className="hamburger" onClick={() => setMenuOpen(true)}>
          <span /><span /><span />
        </button>
      </nav>

      <section id="about" className="hero">
        <div className="hero-content">
          <div className="hero-tag">Open to work</div>
          <h1 className="hero-name">Smita<span className="line2">Dike</span></h1>
          <p className="hero-title">
            Jr. Software Engineer {/* &amp; <span className="hl">UI Architect</span> */}<br />
            Building scalable systems &amp; delightful interfaces<br />
            that ship to millions of users.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => scrollTo("projects")}>View Projects →</button>
            <button className="btn-outline" onClick={() => scrollTo("contact")}>Get In Touch</button>
          </div>
          <div className="hero-stats">
            {[["1.5+","Years Exp"],["5+","Projects"]/* ,["12+","Clients"],["3","Open Source"] */].map(([num,label]) => (
              <div key={label}>
                <div className="stat-num">{num}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-orb" />
      </section>

      <section id="skills" className="section" ref={skillsRef}>
        <div className="section-label">02 / Skills</div>
        <h2 className="section-title">Tech Stack</h2>
        <div className="skills-grid">
          {skills.map(s => (
            <div className="skill-card" key={s.name}>
              <div className="skill-icon">{s.icon}</div>
              <div className="skill-name">{s.name}</div>
              <div className="skill-level">
                <div className="skill-level-fill" style={{ width: skillsVisible ? `${s.level}%` : "0%" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="section">
        <div className="section-label">03 / Work</div>
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          {projects.map(p => (
            <div className="project-card" key={p.title}>
              <div className="project-img" style={{ background: p.bg, fontSize: 64 }}>{p.emoji}</div>
              <div className="project-body">
                <div className="project-tags">{p.tags.map(t => <span className="tag" key={t}>{t}</span>)}</div>
                <div className="project-title">{p.title}</div>
                <div className="project-desc">{p.desc}</div>
                {/* <div className="project-links">
                  <a className="project-link" href={p.github}>↗ GitHub</a>
                  <a className="project-link" href={p.live}>↗ Live Demo</a>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="experience" className="section">
        <div className="section-label">04 / Experience</div>
        <h2 className="section-title">Timeline</h2>
        <div className="timeline">
          {experience.map(e => (
            <div className="timeline-item" key={e.role}>
              <div className="timeline-dot" />
              <div className="timeline-date">{e.date}</div>
              <div className="timeline-role">{e.role}</div>
              <div className="timeline-company">{e.company}</div>
              <div className="timeline-desc">{e.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="section">
        <div className="section-label">05 / Contact</div>
        <h2 className="section-title">Let's Talk</h2>
        <div className="contact-wrap">
          <div className="contact-info">
            <h3>Open to Opportunities</h3>
            <p>Currently available for full-time positions, and interesting collaborations. Let's build something great together.</p>
            {[
              { icon: "📧", label: "EMAIL", val: "smitadike26@gmail.com" },
              { icon: "📍", label: "LOCATION", val: "Goa, India" },
              { icon: "📞", label: "PHONE", val: "7261995390" },
            ].map(c => (
              <div className="contact-item" key={c.label}>
                <div className="contact-item-icon">{c.icon}</div>
                <div className="contact-item-text">
                  <div className="contact-item-label">{c.label}</div>
                  {c.val}
                </div>
              </div>
            ))}
          </div>
          {/* <div className="contact-form">
            <div className="form-group">
              <label className="form-label">NAME</label>
              <input className="form-input" placeholder="Your name" value={formData.name} onChange={e => setFormData({...formData,name:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">EMAIL</label>
              <input className="form-input" type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData,email:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">MESSAGE</label>
              <textarea className="form-input" placeholder="Tell me about your project..." value={formData.message} onChange={e => setFormData({...formData,message:e.target.value})} />
            </div>
            <button className="btn-primary" onClick={handleSend} style={{ width: "fit-content" }}>
              {sent ? "✓ Message Sent!" : "Send Message →"}
            </button>
          </div> */}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-text">© 2026 Smita Dike — Built with React</div>
        <div className="footer-socials">
          {[
            ["🐙", "GitHub", "https://github.com/yourusername"],
            [<LinkedInIcon />, "LinkedIn", "https://linkedin.com/in/yourusername"],
          ].map(([icon, label, url]) => (
            <a key={label} href={url} className="social-btn" title={label} target="_blank" rel="noreferrer">
              {icon}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}
