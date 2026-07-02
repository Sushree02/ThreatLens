# 🛡️ ThreatLens

ThreatLens is a cybersecurity-focused URL, IP, and File Risk Analyzer that helps users identify potentially malicious websites, IP addresses, and files using threat intelligence services such as VirusTotal.

## 🌐 Live Demo

Frontend:
https://threat-lens-taupe.vercel.app

Backend API:
https://threatlens-backend-6teq.onrender.com

---

## 📌 Features

### URL Analysis
- Analyze website URLs for security threats
- SSL certificate validation
- Domain age verification
- VirusTotal reputation checks
- Risk score calculation
- Confidence score generation

### IP Address Analysis
- Analyze suspicious IP addresses
- Threat intelligence lookup
- Risk classification
- Security recommendations

### File Analysis
- Upload and scan files
- Drag-and-drop file support
- VirusTotal file reputation checks
- Malware detection indicators
- Security report generation

### PDF Report Generation
- Professional security assessment reports
- Risk summary
- Threat findings
- Recommendations
- Downloadable PDF reports

---

## 🚀 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- jsPDF

### Backend
- Node.js
- Express.js
- Multer
- Axios

### APIs
- VirusTotal API

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 🏗️ Project Structure

```bash
ThreatLens/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Sushree02/ThreatLens.git
cd ThreatLens
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
VIRUSTOTAL_API_KEY=your_api_key
PORT=5000
```

Run Backend

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run Frontend

```bash
npm run dev
```

---

## 📊 Risk Classification

| Risk Score | Classification |
|------------|---------------|
| 0-20 | Safe |
| 21-40 | Low Risk |
| 41-60 | Medium Risk |
| 61-80 | High Risk |
| 81-100 | Critical |

---

## 📄 Generated Reports

ThreatLens automatically generates downloadable PDF security reports containing:

- Scan information
- Risk score
- Threat indicators
- Security findings
- Recommendations
- Final verdict

---

## 🎯 Educational Purpose

This project was developed as an educational cybersecurity project to demonstrate:

- Threat intelligence integration
- URL reputation analysis
- File security analysis
- Risk assessment methodologies
- Security reporting

---

## 📸 Screenshots

Add screenshots here:

### Home Page
![Home Page](screenshots/home.png)

### Analysis Result
![Analysis Result](screenshots/result.png)

### PDF Report
![PDF Report](screenshots/report.png)

---

## 👩‍💻 Author

**Sushree Soumya Priyadarshini**

B.Tech CSE Student  
Cybersecurity & Software Development Enthusiast

GitHub:
https://github.com/Sushree02

---

## ⭐ Future Improvements

- AbuseIPDB Integration
- IPQualityScore Integration
- WHOIS Lookup
- Email Reputation Analysis
- Advanced Malware Scanning
- Threat History Tracking
- User Authentication
- Dashboard Analytics

---

## 📜 License

This project is intended for educational and academic purposes.
