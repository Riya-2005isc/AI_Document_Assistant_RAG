# 🤖 AI Document Assistant using RAG

An AI-powered document assistant that allows users to upload PDF documents and ask questions about their content. The application uses **Retrieval-Augmented Generation (RAG)** to provide document-based answers through an interactive web interface.

---

## 🚀 Live Demo

🔗 **[Try AI Document Assistant](https://ai-document-assistant-rag-nncv3k0f9-riya-bb06.vercel.app/)**

> Upload a PDF document and ask questions about its content using the AI Document Assistant.

---

## 📌 Project Overview

Reading and extracting information from long PDF documents can be time-consuming.

This project provides an interactive AI assistant where users can:

* Upload a PDF document
* Process the document content
* Ask questions in natural language
* Retrieve relevant information from the document
* Generate AI-powered responses based on the uploaded content

The project demonstrates the practical implementation of **Retrieval-Augmented Generation (RAG)** for document question answering.

---

## ✨ Key Features

* 📄 **PDF Document Upload**
* 🔍 **Document-Based Question Answering**
* 🤖 **AI-Powered Responses**
* 🧠 **Retrieval-Augmented Generation**
* 💬 **Interactive Chat Interface**
* ⚡ **Fast API-based Processing**
* 🌐 **Vercel Deployment**
* 📱 **Responsive Web Interface**
* 🔐 **Environment Variable Support for API Keys**

---

## 🏗️ System Architecture

```text
                 ┌───────────────────┐
                 │      User         │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │   Next.js UI      │
                 │   Chat Interface  │
                 └─────────┬─────────┘
                           │
                  Upload PDF / Question
                           │
                           ▼
                 ┌───────────────────┐
                 │   PDF Processing  │
                 │     API Route     │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Document Text     │
                 │ Extraction        │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Relevant Content  │
                 │ Retrieval         │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │    Groq LLM       │
                 │  GPT-OSS-20B      │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │   AI Response     │
                 └───────────────────┘
```

---

## 🔄 How It Works

### 1. Upload PDF

The user selects a PDF document through the web interface.

### 2. Extract Document Text

The application processes the uploaded PDF and extracts its readable text.

### 3. Retrieve Relevant Content

When the user asks a question, relevant portions of the document are identified based on the question.

### 4. Generate Answer

The retrieved document context is provided to the language model.

The model generates an answer using the available document context.

### 5. Display Response

The answer is displayed in the interactive chat interface.

---

## 🛠️ Technologies Used

### Frontend

* Next.js
* React
* TypeScript
* HTML
* CSS

### Backend

* Next.js API Routes
* Node.js
* PDF text extraction

### AI / LLM

* Groq API
* GPT-OSS-20B

### RAG

* Retrieval-Augmented Generation
* Document chunking
* Context-based retrieval

### Deployment

* Vercel
* GitHub

### Development

* Google Colab
* GitHub
* Vercel

---

## 📂 Project Structure

```text
AI_Document_Assistant_RAG/
│
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts
│   │   │
│   │   └── upload/
│   │       └── route.ts
│   │
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── AI_Document_Assistant_using_RAG.ipynb
│
├── requirements.txt
├── package.json
├── tsconfig.json
├── next-env.d.ts
└── README.md
```

---

## 📋 Requirements

### Software

* Node.js 18+
* npm
* Git
* GitHub account
* Vercel account

### API

The project requires a **Groq API key**.

---

## 🔑 Environment Variables

Create an environment variable named:

```text
GROQ_API_KEY
```

Do **not** put your API key directly inside the source code.

For local development, create:

```text
.env.local
```

and add:

```env
GROQ_API_KEY=your_groq_api_key
```

For Vercel deployment, add `GROQ_API_KEY` under:

**Vercel → Project Settings → Environment Variables**

---

## 💻 Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/Riya-2005isc/AI_Document_Assistant_RAG.git
```

### Step 2: Open the project

```bash
cd AI_Document_Assistant_RAG
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Configure environment variables

Create:

```text
.env.local
```

Add:

```env
GROQ_API_KEY=your_groq_api_key
```

### Step 5: Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🧪 How to Use

1. Open the application.
2. Click **Choose PDF**.
3. Select a PDF document.
4. Click **Process Document**.
5. Wait for the document to be processed.
6. Enter a question about the document.
7. Click the **↑** button or press Enter.
8. The AI generates a response based on the document.

---

## 💡 Example Questions

You can ask questions such as:

```text
What is the main objective of this document?
```

```text
Summarize the key points of this document.
```

```text
What are the major findings?
```

```text
What methodology was used?
```

```text
What are the conclusions?
```

---

## 🎯 Use Cases

This type of document assistant can be useful for:

* 📚 Academic research papers
* 📑 Business reports
* 📊 Financial reports
* 📖 Study materials
* 📝 Project documentation
* 📄 Company documents
* 🔎 Research and information retrieval

---

## 🔐 Security

The project uses environment variables for API credentials.

**Never commit your API key to GitHub.**

The `.env.local` file should remain private and should be included in `.gitignore`.

Example:

```text
.env
.env.local
.env.*.local
```

---

## 🚀 Deployment

The application is deployed using **Vercel**.

### Deployment Steps

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Select **Next.js** as the framework.
4. Set the project root directory to:

```text
./
```

5. Add the environment variable:

```text
GROQ_API_KEY
```

6. Deploy the project.

---

## 📊 Current Implementation

The current implementation focuses on demonstrating the complete document-question-answering workflow:

```text
PDF
 ↓
Text Extraction
 ↓
Document Processing
 ↓
Relevant Context Retrieval
 ↓
Groq LLM
 ↓
AI Answer
```

---

## 🔮 Future Improvements

The project can be extended with:

* 🧠 Vector database integration
* 🔎 Semantic search using embeddings
* 📚 Multiple document support
* 💾 Persistent document storage
* 💬 Chat history
* 📑 Source/page-level citations
* 🔐 User authentication
* ☁️ Cloud storage
* 📊 Document analytics
* 🖼️ OCR support for scanned PDFs
* ⚡ Streaming AI responses

---

## 📈 Future RAG Architecture

A more advanced version can use:

```text
PDF
 ↓
Text Extraction
 ↓
Text Chunking
 ↓
Embeddings
 ↓
Vector Database
 ↓
Similarity Search
 ↓
Relevant Chunks
 ↓
LLM
 ↓
Grounded Answer
```

---

## 🎓 Academic / Portfolio Purpose

This project demonstrates practical knowledge of:

* Generative AI
* Retrieval-Augmented Generation
* Natural Language Processing
* API integration
* Document processing
* Full-stack application development
* Next.js
* TypeScript
* Cloud deployment
* AI application development

---

## 👩‍💻 Author

### Riya Rathod

**MSc Data Science**

Interested in:

* Data Science
* Data Analytics
* Machine Learning
* Generative AI
* Natural Language Processing
* Business Intelligence

---

## 🔗 Project Links

🌐 **Live Demo:**
https://ai-document-assistant-rag-nncv3k0f9-riya-bb06.vercel.app/

---

## ⭐ If you find this project useful

Feel free to explore the repository and use the project as a reference for learning about AI-powered document applications.

```

### One small recommendation

For your GitHub portfolio, put **Live Demo immediately below the title**, exactly as above. Recruiters can then see the project and open the deployed application without searching through the README.
```
