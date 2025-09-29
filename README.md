# AI Code Reviewer

An AI-powered **code review assistant** built with **Vite**, **React**, **Typescript** and **Gemini AI**.
This tool helps developers automatically analyze, review, and improve their code with intelligent AI feedback.

---

## 🚀 Features

* **AI-Powered Reviews** – Context-aware feedback using Gemini AI.
* **File Uploads** – Upload and analyze multiple files at once.
* **Formatted Output** – Markdown-based rendering with `react-markdown`.

---

## 🛠️ Tech Stack

* **Frontend**: Vite, React, Tailwind CSS
* **AI Integration**: Gemini API
* **Other Libraries**:

  * `react-markdown` – Renders AI responses in clean Markdown
  * `axios / fetch` – API calls
  * `react-icons` – Icons & UI enhancements

---

## 📦 Run Locally

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* Gemini API Key 

---

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/code-reviewer.git
   cd code-reviewer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root and add:

   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```
ai-code-reviewer/
│── components/      # UI components
│── services/         # geminiService.ts
│── utils/             # API + utility functions
│── index.tsx          # Root component
│── App.tsx          # Entry point
│── .env.local           # Environment variables (ignored in git)
│── package.json         # Dependencies & scripts
│── vite.config.js       # Vite configuration
```

---

## 🤝 Contributing

Feel free to fork this repo and submit a pull request for improvements or new features.

---
