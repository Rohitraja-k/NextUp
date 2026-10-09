import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-left">
        <span className="footer-dot"></span>
        <span className="footer-line"></span>
      </div>

      <p className="footer-quote">
        <span>“</span>
        Small steps today. A better tomorrow.
        <span>”</span>
      </p>

      <div className="footer-right">
        <span>Next Up</span>
        <span className="footer-line footer-line-right"></span>
      </div>

    </footer>
  );
}

export default Footer;