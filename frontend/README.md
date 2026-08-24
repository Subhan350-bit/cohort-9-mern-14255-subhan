# Notes App - Frontend

Responsive React.js client for the 10Pearls Shine Cohort 9 MERN Notes Application.

## Overview
This application provides secure user authentication, a note management dashboard, and a rich text editor powered by React-Quill and sanitized using DOMPurify.

## Prerequisites
- **Node.js**: v18 or higher
- **Backend API Service**: Running at `http://localhost:5000/api` (or configured via `.env` file with `VITE_API_BASE_URL`)

## Technology Stack
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS & PostCSS
- **Rich Text Editor**: React-Quill-New
- **Security**: DOMPurify for HTML sanitization
- **HTTP Client**: Axios with interceptors
- **Testing**: Vitest and React Testing Library

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install