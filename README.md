<p align="center">
  <a href="https://thinkofatitle.dnachavez.dev" rel="noopener">
 <img width=200px height=200px src="public/favicon.svg" alt="ThinkOfATitle logo"></a>
</p>

<h1 align="center">ThinkOfATitle</h1>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/dnachavez/ThinkOfATitle.svg)](https://github.com/dnachavez/ThinkOfATitle/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/dnachavez/ThinkOfATitle.svg)](https://github.com/dnachavez/ThinkOfATitle/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> 
  ThinkOfATitle is an AI-powered tool that helps you generate creative and professional titles for academic papers, dissertations, theses, and research documents.
  <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting_started)
- [Technology Stack](#technology_stack)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Author](#author)

## 🧐 About <a name="about"></a>

ThinkOfATitle leverages Google's Gemini AI to generate compelling titles and brief overviews for academic research papers, theses, and dissertations. It's designed to help researchers, students, and academics quickly brainstorm title ideas for their work based on their research topic or field.

## ✨ Features <a name="features"></a>

- **AI-Generated Titles**: Get creative and professional title suggestions using Gemini 2.0 Flash
- **Brief Overviews**: Each title comes with a brief description of what the research could focus on

## 🏁 Getting Started <a name="getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key

### Installing

1. Clone the repository

```bash
git clone https://github.com/dnachavez/thinkofatitle.git
cd thinkofatitle
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔧 Technology Stack <a name="technology_stack"></a>

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Motion One](https://motion.dev/) - Animations
- [Aceternity UI](https://ui.aceternity.com/) - UI Components
- [Google Gemini API](https://ai.google.dev/docs/gemini_api) - AI title generation

## 🎈 Usage <a name="usage"></a>

1. Enter your research topic or field in the search bar
2. Get AI-generated title suggestions
3. Click on any suggestion to see the full title and its brief overview
4. Use the "Reset" button to start a new search
5. Use the "Regenerate" button to get new suggestions for the same topic

## 🚀 Deployment <a name="deployment"></a>

The project can be deployed on Vercel:

```bash
npm run build
# or
vercel deploy
```

## 🤝 Contributing <a name="contributing"></a>

Contributions are welcome! Please feel free to submit a Pull Request.

## ✍️ Author <a name="author"></a>

- [@dnachavez](https://github.com/dnachavez) - Initial work
