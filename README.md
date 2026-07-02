# 🛡️ ThreatLens — URL & IP Risk Analyzer

ThreatLens is a full-stack cybersecurity web application that analyzes URLs and IP addresses using multiple threat intelligence sources and generates an easy-to-understand risk report — complete with a risk gauge, security recommendations, a visual analysis flowchart, and a downloadable PDF report.

Built as a beginner-friendly B.Tech cybersecurity project using **React + Vite + Tailwind CSS** on the frontend and **Node.js + Express.js** on the backend.

---

## ✨ Features

- Analyze a **URL**, an **IP address**, or an **uploaded File** (drag-and-drop)
- HTTPS / SSL certificate checks
- Domain age lookup
- Threat intelligence from **VirusTotal** (URL, IP, and file scanning), **AbuseIPDB**, and **IPQualityScore**
- Realistic detection-count-based risk scoring engine (0–100) with risk level (Safe / Moderate Risk / High Risk)
- Dynamic confidence score based on how many providers returned data (60% / 80% / 95%)
- Visual risk meter (gauge), detection ratio, structured findings (Threat Intelligence Summary, Threat Findings, Risk Indicators)
- Dedicated, color-coded Final Verdict card (Safe To Visit / Proceed With Caution / Potentially Malicious / High-Risk Website)
- Auto-generated security analysis flowchart (shown on the website only)
- One-click **professional PDF report** — compact 1–2 page cyber threat intelligence report with a Scan ID, stat cards, and a highlighted verdict box (no flowchart in the PDF)
- Dark mode / light mode toggle
- Fully responsive (desktop + mobile)
- Works even if some API keys are missing — gracefully skips unavailable providers
- No login, no signup, no database — 100% stateless

---

## 🗂️ Project Structure

```
ThreatLens/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── services/          # VirusTotal, AbuseIPDB, IPQualityScore, SSL/domain, risk orchestration
│   ├── routes/             # Express routes
│   ├── middleware/        # Validation, error handling, logging
│   ├── utils/              # Validators, risk engine, recommendations, logger
│   ├── config/             # Environment config
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, ThemeToggle, AnalysisForm, FileDropzone, RiskGauge, ResultCard, VerdictCard, Flowchart, RecommendationPanel, PdfDownloadButton, Footer
│   │   ├── pages/          # Home, Results
│   │   ├── hooks/          # useTheme
│   │   ├── services/       # api.js (backend calls)
│   │   ├── utils/          # Client-side validators
│   │   ├── context/        # ThemeContext
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone / extract the project

```bash
cd ThreatLens
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and add your API keys (see [How to Obtain API Keys](#-how-to-obtain-api-keys) below). The app will still run even if some keys are left blank — it will simply skip that provider and show a warning.

```env
VIRUSTOTAL_API_KEY=your_key_here
ABUSEIPDB_API_KEY=your_key_here
IPQUALITYSCORE_API_KEY=your_key_here
PORT=5000
```

Run the backend:

```bash
npm start
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup

Open a **new terminal window**:

```bash
cd frontend
npm install
cp .env.example .env   # optional — only needed if backend runs on a different URL/port
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `VIRUSTOTAL_API_KEY` | API key for VirusTotal threat intelligence |
| `ABUSEIPDB_API_KEY` | API key for AbuseIPDB IP abuse reports |
| `IPQUALITYSCORE_API_KEY` | API key for IPQualityScore fraud/risk scoring |
| `PORT` | Port the backend server runs on (default `5000`) |

### Frontend (`frontend/.env`) — optional

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL (default `http://localhost:5000/api`) |

> ⚠️ **Never commit your real `.env` file.** Only `.env.example` files (with empty values) should be pushed to GitHub. API keys are only ever used on the backend — the frontend never sees or stores them.

---

## 🔐 How to Obtain API Keys

1. **VirusTotal** — Create a free account at [virustotal.com](https://www.virustotal.com/), go to your profile → API Key.
2. **AbuseIPDB** — Create a free account at [abuseipdb.com](https://www.abuseipdb.com/), go to Account → API.
3. **IPQualityScore** — Create a free account at [ipqualityscore.com](https://www.ipqualityscore.com/), go to Settings → API Key.

All three offer free tiers suitable for testing and small projects. If you skip any of them, ThreatLens will continue to work using whichever providers *are* configured.

---

## 🖥️ Running the Full App

| Terminal | Command | URL |
|---|---|---|
| 1 (backend) | `cd backend && npm start` | http://localhost:5000 |
| 2 (frontend) | `cd frontend && npm run dev` | http://localhost:5173 |

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check + which providers are configured |
| POST | `/api/analyze-url` | Body: `{ "url": "https://example.com" }` |
| POST | `/api/analyze-ip` | Body: `{ "ip": "8.8.8.8" }` |
| POST | `/api/analyze-file` | `multipart/form-data` with a `file` field. Allowed types: `.pdf .doc .docx .zip .exe .apk .png .jpg .jpeg` (max 32MB) |

---

## 📸 Screenshots

> Add screenshots of the Home page, Results page, and generated PDF report here once you run the app locally.

- `Home page (light mode)` — _screenshot placeholder_
- `Home page (dark mode)` — _screenshot placeholder_
- `Results page with risk gauge and flowchart` — _screenshot placeholder_
- `Downloaded PDF report` — _screenshot placeholder_

---

## 🚀 Future Improvements

- Add caching to avoid repeated API calls for the same target
- Add a browser extension version
- Add historical scan comparison (still without a database — e.g. local export/import)
- Support batch scanning of multiple URLs/IPs
- Add more threat intel providers (e.g. Google Safe Browsing, Shodan)
- Add unit and integration tests

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, jsPDF, html2canvas, Axios
- **Backend:** Node.js, Express.js, Axios, dotenv, CORS
- **APIs:** VirusTotal, AbuseIPDB, IPQualityScore

---

*Generated by ThreatLens — built for educational cybersecurity project use.*
