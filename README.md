# 📧 Email Reply Generator + Chrome Extension

An AI-powered solution to generate smart replies for emails.  
Includes a **React web app** and a **Chrome extension** that integrates directly into Gmail.  

---

## 🚀 Features
### Web App
- Paste or type original email content.
- Select reply tone (Formal, Casual, Friendly, Professional).
- Generate AI-powered reply instantly.
- Copy replies with one click.
- Responsive Material UI design.
- Loading spinner & error handling.

### Chrome Extension
- Injects an **AI Reply** button into Gmail’s compose window.
- Detects email content automatically.
- Sends content to backend API (`http://localhost:8080/api/email/generate`).
- Inserts generated reply directly into Gmail compose box.

---

## 🛠️ Tech Stack
- **Frontend (Web App)**: React, Material UI (MUI), Axios  
- **Chrome Extension**: Vanilla JS, DOM APIs, MutationObserver  
- **Backend (example)**: Spring Boot / Node.js REST API  
  - Endpoint: `POST http://localhost:8080/api/email/generate`  
  - Request:
    ```json
    {
      "emailContent": "Original email text",
      "tone": "Professional"
    }
    ```
  - Response: `Generated reply text`

---

## ⚡ Chrome Extension Setup
1. Clone the repo.
2. Open Chrome → go to `chrome://extensions/`.
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select the `chrome-extension/` folder.
5. Open Gmail → Click **Compose** → You’ll see an **AI Reply** button.

---

## ▶️ Running the Web App
```bash
# Navigate into the web app folder
cd Email-Reply-Generator

# Install dependencies
npm install

# Start dev server
npm run dev

