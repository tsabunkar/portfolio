/**
 * components/DvdStoriesPlayer/DvdStoriesPlayer.jsx
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSpeech } from "@/hooks/useSpeech";
import TvPdfReader from "./TvPdfReader";
import styles from "./DvdStoriesPlayer.module.css";

// Styled SVG Icons
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M6 19h4V5H6zm8-14v14h4V5z" />
  </svg>
);
const StopIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M6 6h12v12H6z" />
  </svg>
);
const PrevIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
  </svg>
);
const NextIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M6 6v12l8.5-6zm8.5 0h2v12h-2z" />
  </svg>
);
const EjectIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 5L5 12h14zm-7 9h14v2H5z" />
  </svg>
);

// Story 1 Slides Data
const STORY_1_SLIDES = [
  {
    title: "Anusha's Saree Sale Disaster",
    type: "intro",
    html: "Anusha launched a massive festive sale for her saree brand, deploying a newly upgraded microservices architecture suggested by AI. However, because her developers relied on 'vibe coding' and dangerous assumptions, the system suffered an immediate disaster during the festival rush. Let's see how the 8 fallacies of distributed computing destroyed her launch.",
    content: (
      <div className={styles.storyIntro}>
        <div className={styles.brandBadge}>labhyaa.in</div>
        <p>
          Anusha launched a massive festive sale for her saree brand deploying a
          newly upgraded microservices architecture suggested by AI.
        </p>
        <p>
          However, because her developers relied on{" "}
          <strong>&quot;vibe coding&quot;</strong> and dangerous assumptions,
          the system suffered an immediate disaster during the festival rush. 📉
        </p>
        <div className={styles.introGraphic}>
          <div className={styles.trafficSpike}>Spike Traffic: 100x ⚡</div>
          <div className={styles.serverStatus}>
            Server Status: 503 Service Unavailable ❌
          </div>
        </div>
        <p className={styles.hintText}>
          Use NEXT / PREV on the player or screen to navigate the 8 fallacies.
        </p>
      </div>
    ),
  },
  {
    title: "Fallacy 1: The Network is Reliable",
    type: "fallacy",
    number: 1,
    reality: "Reality: Networks Fail",
    remedies: ["Implement Redundancy", "Handle Packet Loss", "Use Retries"],
    html: "Fallacy 1. The Network is Reliable. Reality: Networks Fail. In distributed computing, network links will drop, packets will be lost, and connections will time out. You must implement redundancy, handle packet loss gracefully, and use retries with exponential backoff.",
    content: (
      <div className={styles.fallacySlide}>
        <div className={styles.fallacyDiagram}>
          <div className={styles.node}>Client</div>
          <div className={styles.networkLink}>
            <span className={styles.packet}>📦</span>
            <span className={styles.break}>⚡</span>
            <span className={styles.packet} style={{ animationDelay: "0.4s" }}>
              📦
            </span>
          </div>
          <div className={`${styles.node} ${styles.failed}`}>Server</div>
        </div>
        <p className={styles.narrative}>
          Network links drop, routers fail, and sockets time out. Assuming a
          solid connection is a recipe for disaster.
        </p>
      </div>
    ),
  },
  {
    title: "Fallacy 2: Latency is Zero",
    type: "fallacy",
    number: 2,
    reality: "Reality: Latency Exists",
    remedies: [
      "Design for Asynchronous",
      "Use Caching",
      "Optimize Data Transfer",
    ],
    html: "Fallacy 2. Latency is Zero. Reality: Latency Exists. Anusha's backend team assumed latency is zero during checkout, making fifty separate network round-trips just to verify a single cart. As traffic spiked, the network overhead caused request timeouts and system chokes. Design for asynchronous processing and use caching.",
    content: (
      <div className={styles.fallacySlide}>
        <div className={styles.fallacyDiagram}>
          <div className={styles.node}>Cart Service</div>
          <div className={styles.latencyArrow}>
            <span className={styles.snail}>🐌</span>
            <span className={styles.arrowLine}>──50x Round-trips──&gt;</span>
          </div>
          <div className={styles.node}>DB / Gateway</div>
        </div>
        <p className={styles.narrative}>
          During checkout, the backend made fifty separate round-trips to verify
          one cart. Under heavy load, accumulated latency brought the checkout
          flow to a complete standstill.
        </p>
      </div>
    ),
  },
  {
    title: "Fallacy 3: Bandwidth is Infinite",
    type: "fallacy",
    number: 3,
    reality: "Reality: Bandwidth is Limited",
    remedies: ["Compress Data", "Prioritize Traffic", "Optimize Payload Size"],
    html: "Fallacy 3. Bandwidth is Infinite. Reality: Bandwidth is Limited. The frontend team assumed bandwidth is infinite, placing a massive, uncompressed video on the homepage. This instantly choked the servers as thousands of shoppers visited simultaneously. Always compress data and optimize payloads.",
    content: (
      <div className={styles.fallacySlide}>
        <div className={styles.fallacyDiagram}>
          <div className={styles.bandwidthPipe}>
            <div className={styles.pipeInput}>Huge Media Video 🎥</div>
            <div className={styles.pipeChoke}>Bottleneck 🛑</div>
            <div className={styles.pipeOutput}>Slow Load ⏳</div>
          </div>
        </div>
        <p className={styles.narrative}>
          A massive, uncompressed promotional video placed directly on the
          homepage instantly saturated the bandwidth limit, locking out users
          trying to browse sarees.
        </p>
      </div>
    ),
  },
  {
    title: "Fallacy 4: The Network is Secure",
    type: "fallacy",
    number: 4,
    reality: "Reality: The Network is Insecure",
    remedies: [
      "Use Encryption (TLS)",
      "Implement Authentication",
      "Apply Zero-Trust",
    ],
    html: "Fallacy 4. The Network is Secure. Reality: The Network is Insecure. In a panic, a database developer bypassed a firewall to run a quick fix, falsely believing the internal network is secure. This mistake accidentally exposed the production database containing customer details to the open web.",
    content: (
      <div className={styles.fallacySlide}>
        <div className={styles.fallacyDiagram}>
          <div className={styles.node}>DB Server</div>
          <div className={styles.hackedShield}>
            <span className={styles.lockOpen}>🔓</span>
            <span className={styles.shieldText}>Firewall Bypassed!</span>
          </div>
          <div className={`${styles.node} ${styles.attacker}`}>Public Web</div>
        </div>
        <p className={styles.narrative}>
          Bypassing firewalls or security groups for &apos;quick fixes&apos;
          under the assumption that internal networks are inherently secure is a
          critical vulnerability.
        </p>
      </div>
    ),
  },
  {
    title: "Fallacy 5: Topology Doesn't Change",
    type: "fallacy",
    number: 5,
    reality: "Reality: Topology is Dynamic",
    remedies: [
      "Use Service Discovery",
      "Dynamic Configuration",
      "Adapt to Changes",
    ],
    html: "Fallacy 5. Topology Doesn't Change. Reality: Topology is Dynamic. DevOps dynamically shifted server IP addresses to balance load. However, because the code assumed static topology, the cart service lost track of the payment gateway, dropping orders into the void.",
    content: (
      <div className={styles.fallacySlide}>
        <div className={styles.topologyGrid}>
          <div className={`${styles.node} ${styles.movingNode}`}>
            Cart (IP: 10.0.1.1)
          </div>
          <div className={styles.disconnectedLink}>🚫</div>
          <div className={`${styles.node} ${styles.shifted}`}>
            Gateway (IP changed!)
          </div>
        </div>
        <p className={styles.narrative}>
          DevOps scaled and moved instances, changing server IPs dynamically.
          Hardcoded configs or cached DNS broke the cart&apos;s connection to
          the payment gateway, dropping sales.
        </p>
      </div>
    ),
  },
  {
    title: "Fallacy 6: There is One Administrator",
    type: "fallacy",
    number: 6,
    reality: "Reality: Multiple Administrators",
    remedies: [
      "Define Responsibility",
      "Use Logging & Monitoring",
      "Handle Distributed Teams",
    ],
    html: "Fallacy 6. There is One Administrator. Reality: Multiple Administrators. Assuming only one administrator, every single alert flooded a single engineer. He was instantly overwhelmed by logs and left completely helpless during the crash.",
    content: (
      <div className={styles.fallacySlide}>
        <div className={styles.fallacyDiagram}>
          <div className={styles.alertsInbox}>
            <span>🚨 Alert 1</span>
            <span>🚨 Alert 2</span>
            <span>🚨 Alert 3</span>
          </div>
          <div className={styles.arrow}>➡️</div>
          <div className={`${styles.node} ${styles.engineer}`}>
            Single Overwhelmed Engineer 🤯
          </div>
        </div>
        <p className={styles.narrative}>
          When a distributed system crashes, alerts must be routed based on
          ownership. Flooding one engineer with alerts from 15 microservices
          causes immediate cognitive fatigue.
        </p>
      </div>
    ),
  },
  {
    title: "Fallacy 7: Transport Cost is Zero",
    type: "fallacy",
    number: 7,
    reality: "Reality: Transport Has Cost",
    remedies: [
      "Optimize Data Transfer",
      "Consider Cloud Egress Fees",
      "Evaluate Network Costs",
    ],
    html: "Fallacy 7. Transport Cost is Zero. Reality: Transport Has Cost. Moving data across servers, network boundaries, and cloud regions is never free. High traffic translates directly to massive data egress costs if serialization and routing are not optimized.",
    content: (
      <div className={styles.fallacySlide}>
        <div className={styles.fallacyDiagram}>
          <div className={styles.node}>Availability Zone A</div>
          <div className={styles.moneyFlow}>
            <span className={styles.coin}>💵</span>
            <span className={styles.arrowLine}>Egress Data</span>
          </div>
          <div className={styles.node}>Availability Zone B</div>
        </div>
        <p className={styles.narrative}>
          Cross-AZ data replication, heavy payload XML formats, and constant
          server-to-server traffic accumulate significant network costs on cloud
          providers.
        </p>
      </div>
    ),
  },
  {
    title: "Fallacy 8: The Network is Homogeneous",
    type: "fallacy",
    number: 8,
    reality: "Reality: The Network is Heterogeneous",
    remedies: [
      "Use Standard Protocols (REST, JSON)",
      "Interoperability",
      "Test on Diverse Systems",
    ],
    html: "Fallacy 8. The Network is Homogeneous. Reality: The Network is Heterogeneous. The team built a bloated design that only worked on high-end developer setups. It completely froze up on customers' older mobile browsers. Use standard, lightweight protocols and test on diverse systems.",
    content: (
      <div className={styles.fallacySlide}>
        <div className={styles.deviceRow}>
          <div className={styles.deviceCard}>💻 Dev Setup: 60 FPS ✅</div>
          <div className={`${styles.deviceCard} ${styles.failed}`}>
            📱 Old Mobile: Frozen ❌
          </div>
        </div>
        <p className={styles.narrative}>
          Different OS versions, browsers, and hardware run your app. A bloated
          frontend that works smoothly on a designer&apos;s MacBook will crash
          on older mobile devices.
        </p>
      </div>
    ),
  },
  {
    title: "Saree Sale Saved!",
    type: "outro",
    html: "Anusha immediately hired a Solutions Architect to rescue the brand. The architect's first move was introducing the entire team to the 8 Fallacies of Distributed Computing. When the festive launch went live again, the architecture held perfectly under massive traffic. Orders flowed smoothly, and the relaunch became Labhyaa's biggest success ever! Follow Tejas Sabunkar for more such insights!",
    content: (
      <div className={styles.storyOutro}>
        <div className={styles.successBadge}>Relaunch Success! 🚀</div>
        <p>
          Anusha hired a <strong>Solutions Architect</strong> to rescue the
          brand. 🛠️
        </p>
        <p>
          The architect introduced the team to the{" "}
          <strong>8 Fallacies of Distributed Computing</strong> to rebuild the
          system correctly.
        </p>
        <div className={styles.successMetrics}>
          <div className={styles.metric}>Traffic: 150k+ active users ✅</div>
          <div className={styles.metric}>Checkout: 1.2s avg response ✅</div>
          <div className={styles.metric}>Orders Dropped: 0 ✅</div>
        </div>
        <p>
          The launch went live again and became Labhyaa&apos;s{" "}
          <strong>biggest success ever!</strong> 🎉
        </p>
        <div className={styles.followBadge}>
          Follow Tejas Sabunkar for more insights!
        </div>
      </div>
    ),
  },
];

// PDF files in public/50stories/
const PDF_FILES = {
  1: "/50stories/" + encodeURIComponent("story-1.pdf"),
  2: "/50stories/" + encodeURIComponent("story-2.pdf"),
};

const STORY_TITLES = {
  1: "STORY 1/50: 8 Fallacies of Distributed Computing",
  2: "STORY 2/50: The Circles of Your Career",
};

export default function DvdStoriesPlayer() {
  const [loadedDisc, setLoadedDisc] = useState(null); // null, 1, 2
  const [playerState, setPlayerState] = useState("NO_DISC"); // NO_DISC, OPEN, LOADING, READING, PLAYING, PAUSED
  const [activePage, setActivePage] = useState(0);
  const [trayOpen, setTrayOpen] = useState(false);
  const [isInserting, setIsInserting] = useState(null); // null, 1, 2
  const [isEjecting, setIsEjecting] = useState(false);
  const [pdfPageCount, setPdfPageCount] = useState(1);

  // Bouncing DVD screensaver state
  const [screensaverPos, setScreensaverPos] = useState({ x: 40, y: 45 });
  const [screensaverVel, setScreensaverVel] = useState({ x: 0.8, y: 0.6 });
  const [screensaverColor, setScreensaverColor] = useState("#00FFDD");
  const screensaverRef = useRef(null);
  const screensaverLogoRef = useRef(null);

  // Generate 50 DVDs list
  const storiesCount = 50;
  const dvds = Array.from({ length: storiesCount }, (_, i) => i + 1);

  // Handle TTS
  // Get active text based on loaded disc and page
  const getCurrentSpeechHtml = () => {
    if (loadedDisc === 1) {
      return STORY_1_SLIDES[activePage]?.html || "";
    } else if (loadedDisc === 2) {
      if (activePage === 0)
        return "The Circles of Your Career. A Venn Diagram Handbook for Engineers and Architects. Where you stand and where you are headed.";
      if (activePage === 1)
        return "Chapter 1. The Two Career Ladders. Every technical career forks into two different shapes of growth. The Engineer ladder goes deep on vertical depth, asking How to build it. The Architect ladder goes wide on horizontal breadth, asking Why we are building it.";
      if (activePage === 2)
        return "Chapter 2. The Honest Trade-Off. Comparing the engineer path and the architect path. Software engineer track offers deep technical mastery and builder satisfaction, but less business strategy exposure. The architect track offers broader influence and leadership visibility but involves more meetings.";
      if (activePage === 3)
        return "Chapter 3. The AI Risk Test. Software engineer circle overlaps heavily with AI automation on routine tasks like vibe coding, CRUD APIs, and unit testing. The Solutions Architect circle overlaps lightly, leaving human judgment and stakeholder persuasion intact.";
      if (activePage === 4)
        return "Chapter 4. The Future-Proof Zone. The triple overlap of AI Systems, Software Engineering, and Solution Architecture creates the most defensible career position through 2032.";
      if (activePage === 5)
        return "Chapter 5. Your 1-Page Action Checklist. Position yourself in the overlap. Keep one foot in hands-on technical work. Build the AI layer deliberately, and quantify your impact with real metrics.";
    }
    return "";
  };

  const speechHtml = getCurrentSpeechHtml();
  const { isPlaying, isPaused, progress, play, pause, stop } =
    useSpeech(speechHtml);
  const activePdfSrc = loadedDisc ? PDF_FILES[loadedDisc] : null;
  const maxActivePage = activePdfSrc
    ? Math.max(pdfPageCount - 1, 0)
    : loadedDisc === 1
      ? STORY_1_SLIDES.length - 1
      : loadedDisc === 2
        ? 5
        : 0;

  const handlePdfPageCount = useCallback((count) => {
    setPdfPageCount(count);
  }, []);

  // Auto-synchronize playerState with useSpeech
  useEffect(() => {
    if (playerState === "PLAYING" && !isPlaying && !isPaused) {
      if (activePage < maxActivePage) {
        setActivePage((prev) => prev + 1);
      } else {
        setPlayerState("PAUSED");
      }
    }
  }, [isPlaying, isPaused, playerState, activePage, maxActivePage]);

  // Handle changes when slide page changes while playing
  useEffect(() => {
    if (playerState === "PLAYING") {
      stop();
      // small delay to let speech synthesis cancel
      const t = setTimeout(() => {
        play();
      }, 100);
      return () => clearTimeout(t);
    }
  }, [activePage, playerState, play, stop]);

  // Screensaver Bouncing DVD Logo Loop
  useEffect(() => {
    if (playerState !== "NO_DISC") return;

    let animId;
    const update = () => {
      setScreensaverPos((prev) => {
        const logo = screensaverLogoRef.current;
        const container = screensaverRef.current;
        if (!logo || !container) return prev;

        const cw = container.clientWidth;
        const ch = container.clientHeight;
        const lw = logo.clientWidth || 80;
        const lh = logo.clientHeight || 40;

        let nextX = prev.x + screensaverVel.x;
        let nextY = prev.y + screensaverVel.y;
        let bounce = false;
        let nextVx = screensaverVel.x;
        let nextVy = screensaverVel.y;

        if (nextX <= 0) {
          nextX = 0;
          nextVx = -screensaverVel.x;
          bounce = true;
        } else if (nextX + lw >= cw) {
          nextX = cw - lw;
          nextVx = -screensaverVel.x;
          bounce = true;
        }

        if (nextY <= 0) {
          nextY = 0;
          nextVy = -screensaverVel.y;
          bounce = true;
        } else if (nextY + lh >= ch) {
          nextY = ch - lh;
          nextVy = -screensaverVel.y;
          bounce = true;
        }

        if (bounce) {
          setScreensaverVel({ x: nextVx, y: nextVy });
          const colors = [
            "#00FFDD",
            "#FF00E5",
            "#FFDD00",
            "#00FF66",
            "#FF5D00",
            "#BF5AF2",
          ];
          setScreensaverColor(
            colors[Math.floor(Math.random() * colors.length)],
          );
        }

        return { x: nextX, y: nextY };
      });

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [playerState, screensaverVel]);

  // Trigger disc insert animations
  const insertDisc = (discNum) => {
    if (playerState === "LOADING" || playerState === "READING") return;

    // Helper to run loading cycle
    const runLoadSequence = (num) => {
      setLoadedDisc(num);
      setPlayerState("LOADING");
      setActivePage(0);
      setPdfPageCount(1);

      // Close tray
      setTimeout(() => {
        setTrayOpen(false);
        setPlayerState("READING");

        // Reading disc spinner
        setTimeout(() => {
          setPlayerState("PLAYING");
          setIsInserting(null);
        }, 1200);
      }, 800);
    };

    // Eject first if another is loaded
    if (loadedDisc !== null) {
      ejectDisc(() => {
        setIsInserting(discNum);
        setTrayOpen(true);
        setTimeout(() => {
          runLoadSequence(discNum);
        }, 800);
      });
    } else {
      setIsInserting(discNum);
      setTrayOpen(true);
      setTimeout(() => {
        runLoadSequence(discNum);
      }, 800);
    }
  };

  // Trigger disc eject animations
  const ejectDisc = (callback) => {
    stop();
    setPlayerState("OPEN");
    setIsEjecting(true);
    setTrayOpen(true);

    setTimeout(() => {
      setLoadedDisc(null);
      setPlayerState("NO_DISC");
      setIsEjecting(false);
      if (typeof callback === "function") callback();
    }, 1000);
  };

  // Controller Actions
  const handlePlayPause = () => {
    if (playerState === "NO_DISC" || playerState === "READING") return;
    if (playerState === "PLAYING") {
      pause();
      setPlayerState("PAUSED");
    } else {
      play();
      setPlayerState("PLAYING");
    }
  };

  const handleStop = () => {
    if (playerState === "NO_DISC") return;
    stop();
    setPlayerState("PAUSED");
    setActivePage(0);
  };

  const handlePrev = () => {
    if (activePage > 0) {
      setActivePage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (activePage < maxActivePage) {
      setActivePage((prev) => prev + 1);
    }
  };

  const showPdfInTv =
    playerState !== "NO_DISC" &&
    playerState !== "LOADING" &&
    playerState !== "READING" &&
    activePdfSrc;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.backLink}>
          ← Back to Portfolio
        </Link>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>50 Stories to Learn Tech</h1>
          <span className={styles.yearTag}>2026 SERIES</span>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Left Side: TV monitor and DVD Player Console */}
        <div className={styles.playerZone}>
          {/* TV Monitor */}
          <div
            className={`${styles.tvFrame} ${playerState !== "NO_DISC" ? styles.tvOn : ""}`}
          >
            <div className={styles.screenInner} ref={screensaverRef}>
              {/* Scanlines Overlay */}
              <div className={styles.scanlines} />

              {/* Screensaver mode (No Disc) */}
              {playerState === "NO_DISC" && (
                <div
                  className={styles.screensaver}
                  style={{
                    left: `${screensaverPos.x}px`,
                    top: `${screensaverPos.y}px`,
                    color: screensaverColor,
                    textShadow: `0 0 10px ${screensaverColor}`,
                  }}
                  ref={screensaverLogoRef}
                >
                  <div className={styles.dvdLogoText}>DVD</div>
                  <div className={styles.dvdLogoSub}>VIDEO</div>
                </div>
              )}

              {/* Loading indicator */}
              {(playerState === "LOADING" || playerState === "READING") && (
                <div className={styles.tvLoading}>
                  <div className={styles.spinner} />
                  <div className={styles.loadingText}>
                    {playerState === "LOADING"
                      ? "LOADING DISC..."
                      : "READING TRACKS..."}
                  </div>
                </div>
              )}

              {/* PDF reader inside the TV */}
              {showPdfInTv && (
                <div className={`${styles.tvContent} ${styles.tvContentPdf}`}>
                  <div className={styles.tvHeader}>
                    <span className={styles.storyTitle}>
                      {STORY_TITLES[loadedDisc]}
                    </span>
                    <span className={styles.pageNumber}>
                      Page {activePage + 1}/{pdfPageCount}
                    </span>
                  </div>
                  <TvPdfReader
                    src={activePdfSrc}
                    page={activePage + 1}
                    onPageCount={handlePdfPageCount}
                  />
                </div>
              )}
            </div>
          </div>

          {/* DVD Player Console */}
          <div className={styles.dvdPlayerConsole}>
            {/* Front Panel */}
            <div className={styles.consoleFront}>
              {/* DVD Video Brand Logo */}
              <div className={styles.brandLogo}>
                <span className={styles.brandTitle}>NEON-TEC</span>
                <span className={styles.dvdLabel}>DVD VIDEO PLAYER</span>
              </div>

              {/* Disc Tray Slot */}
              <div className={styles.traySlotWrapper}>
                <div
                  className={`${styles.discTray} ${trayOpen ? styles.trayOut : ""}`}
                >
                  {loadedDisc !== null && (
                    <div
                      className={`${styles.insertedDisc} ${playerState === "PLAYING" ? styles.discSpin : ""}`}
                      style={{
                        background:
                          loadedDisc === 1
                            ? "conic-gradient(#ff00e5, #00ffdd, #ff00e5)"
                            : "conic-gradient(#ff9f0a, #30d158, #ff9f0a)",
                      }}
                    >
                      <div className={styles.discInnerRing}>
                        <span className={styles.discText}>
                          STORY {loadedDisc}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.trayLip} />
              </div>

              {/* LED digital status display */}
              <div className={styles.ledDisplay}>
                {playerState === "NO_DISC" && (
                  <span className={styles.ledBlink}>NO DISC</span>
                )}
                {playerState === "OPEN" && <span>OPEN</span>}
                {playerState === "LOADING" && (
                  <span className={styles.ledBlink}>LOAD</span>
                )}
                {playerState === "READING" && <span>READING</span>}
                {playerState === "PAUSED" && <span>PAUSE</span>}
                {playerState === "PLAYING" && (
                  <div className={styles.ledTicker}>
                    <span>
                      PLAY D-{loadedDisc} CH-{activePage + 1}
                    </span>
                    <span className={styles.ledProgress}>{progress}%</span>
                  </div>
                )}
              </div>

              {/* Physical controls buttons */}
              <div className={styles.consoleButtons}>
                <button
                  className={`${styles.cBtn} ${trayOpen ? styles.cBtnActive : ""}`}
                  onClick={() =>
                    loadedDisc !== null ? ejectDisc() : setTrayOpen(!trayOpen)
                  }
                  title="Eject / Load"
                >
                  <EjectIcon />
                </button>
                <div className={styles.btnDivider} />
                <button
                  className={styles.cBtn}
                  onClick={handlePrev}
                  disabled={playerState === "NO_DISC" || activePage === 0}
                  title="Prev Chapter"
                >
                  <PrevIcon />
                </button>
                <button
                  className={`${styles.cBtn} ${playerState === "PLAYING" ? styles.cBtnActive : ""}`}
                  onClick={handlePlayPause}
                  disabled={playerState === "NO_DISC"}
                  title={playerState === "PLAYING" ? "Pause" : "Play"}
                >
                  {playerState === "PLAYING" ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button
                  className={styles.cBtn}
                  onClick={handleStop}
                  disabled={playerState === "NO_DISC"}
                  title="Stop"
                >
                  <StopIcon />
                </button>
                <button
                  className={styles.cBtn}
                  onClick={handleNext}
                  disabled={
                    playerState === "NO_DISC" || activePage >= maxActivePage
                  }
                  title="Next Chapter"
                >
                  <NextIcon />
                </button>
              </div>
            </div>

            {/* Interactive Tray fly-in/fly-out disc */}
            {isInserting && (
              <div
                className={`${styles.animatingDisc} ${styles.animInsert}`}
                style={{
                  background:
                    isInserting === 1
                      ? "conic-gradient(#ff00e5, #00ffdd, #ff00e5)"
                      : "conic-gradient(#ff9f0a, #30d158, #ff9f0a)",
                }}
              />
            )}
            {isEjecting && loadedDisc !== null && (
              <div
                className={`${styles.animatingDisc} ${styles.animEject}`}
                style={{
                  background:
                    loadedDisc === 1
                      ? "conic-gradient(#ff00e5, #00ffdd, #ff00e5)"
                      : "conic-gradient(#ff9f0a, #30d158, #ff9f0a)",
                }}
              />
            )}
          </div>
        </div>

        {/* Right Side: Shelf/Rack of 50 DVDs */}
        <div className={styles.shelfZone}>
          <div className={styles.shelfTitle}>
            <h3>DVD RACK</h3>
            <span>Select a story disc to load</span>
          </div>

          <div className={styles.rackGrid}>
            {dvds.map((dNum) => {
              const isActive = dNum === 1 || dNum === 2;
              const isLoaded = loadedDisc === dNum;

              let title = `Story {dNum}/50: Locked`;
              let sub = "Coming in 2026";
              let color = "#2c2c2e";

              if (dNum === 1) {
                title = "Story 1/50: 8 Fallacies";
                sub = "Distributed Computing";
                color = "#ff00e5";
              } else if (dNum === 2) {
                title = "Story 2/50: Circles of Career";
                sub = "Engineer vs Architect";
                color = "#ff9f0a";
              }

              return (
                <div
                  key={dNum}
                  className={[
                    styles.dvdCase,
                    isActive ? styles.caseActive : styles.caseLocked,
                    isLoaded ? styles.caseLoaded : "",
                  ].join(" ")}
                  onClick={() => isActive && insertDisc(dNum)}
                  style={{ "--accent": color }}
                >
                  {/* Case spine */}
                  <div className={styles.spine}>
                    <div className={styles.dvdId}>STORY {dNum}</div>
                    <div className={styles.spineText}>{title}</div>
                    <div className={styles.spineLogo}>DVD</div>
                  </div>

                  {/* Case cover (visible on hover) */}
                  <div className={styles.cover}>
                    <div className={styles.coverHeader}>
                      <span className={styles.dvdLogoMini}>DVD VIDEO</span>
                      <span className={styles.dvdNumLabel}>Story {dNum}</span>
                    </div>

                    <div className={styles.coverMain}>
                      <h4>{title.split(": ")[1] || "LOCKED"}</h4>
                      <p>{sub}</p>
                    </div>

                    <div className={styles.coverFooter}>
                      {isActive ? (
                        <span className={styles.loadPill}>LOAD DISC</span>
                      ) : (
                        <span className={styles.lockedPill}>🔒 LOCKED</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
