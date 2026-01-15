# How to Run GitTracker 🚀

## 1. Prerequisites
- **Python 3.12+**
- **Node.js 18+**

## 2. Setup Environment
Create a `.env` file in the root directory (already created for you) with:
```env
GROQ_API_KEY=your_key_here
GITHUB_TOKEN=your_token_here (optional, but recommended for traffic analytics)
# SMTP settings if you want email reports
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 3. Run Backend (Python)
Navigate to the `backend` folder and run:
```powershell
python api.py
```
The backend will start at `http://127.0.0.1:5000`.

## 4. Run Frontend (Next.js)
Navigate to the `frontend` folder and run:
```powershell
npm install
npm run dev
```
The frontend will start at `http://localhost:3000`.

## 5. Usage
1. Open `http://localhost:3000` in your browser.
2. Go to **Connect Node** (or `/onboarding`) to add your repository URL.
3. Once added, go to the **Dashboard** to see the nodes.
4. Click **Sync All Nodes** to fetch the latest metrics.
5. Click **Recap** on any repository to generate an AI summary and social media post.
