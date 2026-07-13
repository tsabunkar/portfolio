# Solutions Architect Portfolio

A production-ready, Apple-inspired portfolio for a Solutions Architect — built with **React 18 + Vite**.

## ✨ Features

- 🌙 Dark / ☀️ Light theme toggle (CSS custom properties, zero re-renders)
- 🔤 Animated word-flip hero headline
- 📱 Fully responsive — 320 px mobile → 4 K desktop
- ⚡ Scroll-triggered reveal animations via `IntersectionObserver`
- 🗂 Sections: Hero, Case Studies, Proof, About, Digital Footprint, Support, Connect
- 🔐 **3-Factor Admin Authentication** — password + TOTP (authenticator app) + live face verification via camera
- 🎛 **Admin Control Center** — AWS cost explorer, GitHub contributions, YouTube analytics (auth-protected)
- 📄 **DVD-style story viewer** — retro CRT player with PDF page rendering for "50 Stories to Learn Tech"
- 🏗 Production folder structure following React best practices

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── assets/                # Static data (pre-generated stars) + images
├── components/
│   ├── layout/            # BaseLayout, NavBar, Footer, BackgroundMotion
│   ├── ui/                # ThemeToggle, SectionHeader, WordFlip, DogWidget
│   ├── SpeechPlayer/      # Floating TTS player (Web Speech API)
│   ├── DvdStoriesPlayer/  # Retro DVD player + PDF viewer
│   └── utils/             # ScrollManager (hash scroll, route change)
├── context/               # ThemeContext, AuthContext (JWT + 3FA)
├── data/                  # All copy / content (easy to edit)
├── hooks/                 # useReveal, useTheme, useSpeech, useDraggable
├── pages/
│   ├── Admin/
│   │   ├── AdminLogin.jsx         # 3FA login (password + TOTP + face)
│   │   ├── AdminDashboard.jsx     # AWS + GitHub + YouTube metrics
│   │   ├── AdminLayout.jsx        # Auth-gated layout with nav
│   │   ├── AdminSetupTotp.jsx     # TOTP setup wrapper
│   │   ├── SetupTotp.jsx          # TOTP QR code generation
│   │   ├── AwsCostDashboard.jsx
│   │   ├── GithubContributions.jsx
│   │   └── YouTubeMetrics.jsx
│   ├── Home.jsx
│   └── ArticleView.jsx
├── sections/
│   ├── Hero/              # Animated word-flip, star field, CTA
│   ├── CaseStudies/       # Boarding-pass style case cards
│   ├── Proof/             # Stats grid + testimonials
│   ├── About/             # Bio, toolbox, experience, certifications
│   ├── Footprint/         # Platforms, articles, playlists, toy projects
│   ├── Support/           # Buy Me a Coffee, PayPal, UPI
│   └── Connect/           # Social links + email CTA
├── styles/                # Global CSS, animations, utilities
├── theme/                 # Token definitions + applyTheme()
├── App.jsx
└── main.jsx
```

### Infrastructure (`infra/`)

```
infra/
├── main.tf               # S3, CloudFront, Route53, ACM
├── admin.tf              # Lambda, API Gateway, Secrets Manager
├── lambda/
│   ├── cmd/              # 6 Go Lambda entrypoints + local dev server
│   ├── internal/         # JWT, TOTP, Secrets Manager libraries
│   ├── Dockerfile        # Local dev container
│   └── Makefile          # Cross-compile for Lambda (linux/amd64)
└── articles/             # HTML article files (uploaded to S3)
```

## ✏️ Personalising

Edit `src/data/` files to update all copy, stats, links, and social handles.
Edit `src/theme/index.js` to change colour tokens.

## 🛠 Tech Stack

- React 18 (hooks, context, memo, lazy)
- Vite 5
- Pure CSS custom properties (no Tailwind, no CSS-in-JS)
- `react-router-dom` v7 — client-side routing with auth guards
- `recharts` — AWS cost & YouTube metrics charts
- `qrcode` — TOTP provisioning URI → QR code for authenticator apps
- `pdfjs-dist` — PDF rendering in DVD story viewer

## 🔐 Admin Authentication

The admin panel uses **3-factor authentication**:

1. **Knowledge** — Username + password credentials
2. **Possession** — TOTP code from an authenticator app (Google Authenticator, Authy, 1Password)
3. **Inherence** — Live face verification captured via browser camera and verified against stored biometrics

On login, the browser captures a photo (with a 3-2-1 countdown overlay), sends it to a face verification API, and only proceeds to JWT-based API login if the face matches.

### Environment Variables

Copy `.env.example` to `.env` for local development:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Admin API Gateway endpoint (`/login`, `/cost-explorer`, `/github-contributions`, `/youtube-metrics`, `/setup-totp`) |
| `VITE_FACE_VERIFY_URL` | ✅ | Face verification Lambda endpoint (`/verify`) |
| `GITHUB_TOKEN` | dev only | GitHub personal access token for contribution data |
| `YOUTUBE_API_KEY` | dev only | YouTube Data API key for channel metrics |

## 🚢 Deployment

```bash
# Full deploy: build frontend + compile Lambdas + terraform apply
npm run deploy

# Or step by step:
npm run build                           # Vite production build → dist/
cd infra/lambda && make all && cd ..    # Cross-compile Go Lambdas
terraform apply                         # S3 upload, CloudFront invalidation, API Gateway
```

### Key AWS Architecture Notes

| Service | Region | Purpose |
|---------|--------|---------|
| S3 (portfolio + articles) | ap-south-1 | Static site + article HTML storage |
| CloudFront | Global | CDN with OAC, ACM certificate |
| ACM | us-east-1 | TLS certificate (must be us-east-1 for CloudFront) |
| Route53 | Global | DNS with `www` → root 301 redirect (CloudFront Function) |
| Lambda + API Gateway | ap-south-1 | Admin backend (JWT, Cost Explorer, GitHub, YouTube, TOTP) |
| Secrets Manager | ap-south-1 | Credentials, JWT secret, TOTP secret, API keys |

### Local Backend Dev

```bash
# Start Go API server locally (port 8080)
npm run dev:backend

# Or manually:
docker compose build && docker compose up
```

The local server uses env vars instead of Secrets Manager. See `docker-compose.yml` for configurable variables.

### Article System

Articles are stored as HTML files in `infra/articles/`, uploaded to S3 and served via CloudFront. The `ArticleView` page fetches them at runtime. Add a new article by creating an HTML file and adding its metadata to `src/data/articles.js`.

