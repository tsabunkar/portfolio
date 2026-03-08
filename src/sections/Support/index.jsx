/**
 * sections/Support/index.jsx
 */

import SectionHeader from "@/components/ui/SectionHeader";
import { useReveal } from "@/hooks/useReveal";
import styles from "./Support.module.css";

export default function SupportSection() {
  const coffeeRef = useReveal();
  const paypalRef = useReveal();
  const upiRef = useReveal();

  return (
    <section id="support" className={`section ${styles.section}`}>
      <div className="inner">
        <SectionHeader
          eyebrow="Support me"
          title="Power the next system."
          sub="If any of my blogs, projects, tutorials helped you - a coffee here helps power the next system."
          eyebrowColor="#f59e0b"
        />

        <div className={styles.methods}>
          <article ref={coffeeRef} className={`reveal card d1 ${styles.card}`}>
            <img
              src="/assets/coffee.png"
              alt="Buy Me a Coffee"
              className={styles.iconImage}
            />
            <h3 className={styles.title}>Buy Me a Coffee</h3>
            <p className={styles.sub}>
              A quick way to support upcoming blogs and tutorials.
            </p>
            <a
              href="https://buymeacoffee.com/tsabunkar"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              Support via Coffee
            </a>
          </article>

          <article ref={paypalRef} className={`reveal card d2 ${styles.card}`}>
            <img
              src="/coffee/paypal.svg"
              alt="PayPal"
              className={styles.iconImage}
            />
            <h3 className={styles.title}>Buy Me a Cookie</h3>
            <p className={styles.sub}>
              Prefer PayPal? You can support directly through this payment
              method.
            </p>
            <a
              href="https://paypal.me/tsabunkar"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              Support via PayPal
            </a>
          </article>

          <article ref={upiRef} className={`reveal card d3 ${styles.card}`}>
            <img
              src="/assets/upi_qr.png"
              alt="UPI QR code for support payments"
              className={styles.qrImage}
            />
            <h3 className={styles.title}>QR Scanner (India)</h3>
            <p className={styles.sub}>
              Scan the QR code or use UPI ID:
              <span className={styles.upiId}>tsabunkar@ybl</span>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
