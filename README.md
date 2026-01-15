# GitTracker Agent 🚀

**The "Analyst-in-a-Box" for Open Source Maintainers.**

GitTracker is an intelligent, automated system that monitors your GitHub repositories, analyzes traffic trends, and generates professional growth summaries, social media posts, and daily reports using AI.

---

## ⚡ Features

### 🧠 **Neural Analysis Engine**
*   **Automated Metrics**: Tracks Stars, Traffic Views, and Clones every 24h (or on demand).
*   **Trend Detection**: Compares current metrics vs. previous snapshots to identify spikes or drops.
*   **AI Recaps**: Uses **Groq (Llama 3.1)** to generate actionable insights, not just raw numbers.

### 🌐 **Social & Reporting**
*   **Smart Social Posts**: Generates ready-to-post content for **LinkedIn** and **X (Twitter)** tailored to your repo's recent activity.
*   **Email Telemetry**: Optional daily digests sent directly to your inbox via SMTP.

### 🖥️ **Hacker UI Dashboard**
*   **Command Center**: A "High-Tech/Cyberpunk" terminal-style dashboard to view all your repositories at a glance.
*   **Multi-Repo Support**: Track unlimited open-source projects from a single unified interface.
*   **Real-Time Sync**: "Sync All Nodes" feature to instantly refresh data across your entire portfolio.

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js 15, Tailwind CSS, Glassmorphism Design
*   **Backend**: Python 3.12, Flask, LangGraph (AI Agent Workflow)
*   **AI**: Groq API (Llama-3.1-8b-instant)
*   **Integration**: GitHub REST API v3

---

## 🚀 Quick Start Guide

### 1. Prerequisites
*   Python 3.12+
*   Node.js 18+
*   A Groq API Key (Free)
*   A GitHub Personal Access Token (Recommended for full traffic stats)

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=gsk_...
GITHUB_TOKEN=ghp_...
# Optional: Email Reporting
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 3. Launch the System
**Terminal 1: The Brain (Backend)**
```powershell
cd backend
python api.py
# Server running at http://127.0.0.1:5000
```

**Terminal 2: The Interface (Frontend)**
```powershell
cd frontend
npm install
npm run dev
# Dashboard running at http://localhost:3000
```

---

## 📖 Usage Manual

1.  **Initialize Node**: 
    *   Navigate to `http://localhost:3000/onboarding`.
    *   Enter your GitHub repository URL (e.g., `https://github.com/owner/repo`).
    *   The system creates a persistent link to tracking.

2.  **Monitor Dashboard**:
    *   View real-time Stars, Views, and Clones.
    *   Click **"SYNC ALL NODES"** to trigger a fresh data pull.

3.  **Generate Intelligence**:
    *   Click **"Recap"** on any repository card.
    *   Select **LinkedIn** or **X** to generate a viral-ready post based on the latest growth data.

---

## 📂 File Structure

*   **`agent.py`**: The core LangGraph agent definition.
*   **`backend/`**: Flask API wrapper exposing the agent to the web.
*   **`frontend/`**: Next.js 15 application.
*   **`metrics_history.json`**: (Auto-generated) Stores historical snapshots for trend analysis.
*   **`connected_repos.json`**: (Auto-generated) Registry of tracked repositories.

---

*Built with ❤️ for Builders who Ship.*
