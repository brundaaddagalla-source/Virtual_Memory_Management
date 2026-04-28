function Footer() {
  return (
    <footer className="footer">

      {/* LEFT */}
      <div className="footer-left">
        <div className="logo">$</div>
        <span className="brand">MemoryPath</span>
      </div>

      {/* CENTER */}
      <div className="footer-center">
        <a
          href="https://github.com/brundaaddagalla-source/Virtual_Memory_Management"
          target="_blank"
          className="github-btn"
        >
          GitHub
        </a>

        <span>© 2026 MemoryPath</span>

        <span className="dot">•</span>

        <span>Built with 🩵</span>

        <span className="dot">•</span>

        <span>
          BUILT BY <span className="name">Brunda Addagalla</span>
        </span>
      </div>

      {/* RIGHT */}
      <div className="footer-right">
        <span>OS Memory Visualizer</span>
      </div>

    </footer>
  );
}

export default Footer;