# CogniLex Frontend

Welcome to the frontend repository of **CogniLex AI**, an advanced RAG-powered legal assistance and lawyer management platform. Built with a modern React and Next.js stack, this frontend provides a premium, responsive, and intuitive interface for regular users, legal professionals, and system administrators.

## 🌟 Features & Functionalities

The platform is divided into tailored experiences based on user roles, encompassing the following core functionalities:

### 👤 User Functionalities
- **User Dashboard (`/userDashboard`):** A personalized workspace for managing legal activities, saved cases, and recent chats.
- **Lawyer Search & Discovery (`/lawyer`):** Browse, filter, and view detailed profiles of available legal professionals.
- **Appointment Scheduling (`/my-appointments`):** seamlessly book and manage upcoming legal consultations.
- **AI Legal Assistant Chat:** Interactive chat interface utilizing a RAG (Retrieval-Augmented Generation) system for preliminary legal queries.
- **Secure Payments (`/checkout`, `/payment`):** Integrated checkout flow for consultation fees.
- **Chat Sharing (`/share`):** Mobile-optimized functionality to share AI chat history externally.

### ⚖️ Lawyer Functionalities
- **Lawyer Dashboard (`/lawyerDashboard`):** Comprehensive case, client, and appointment management system.
- **Lawyer Onboarding (`/lawyerRegistation`):** Dedicated registration flow to verify and list new lawyers on the platform.
- **Mobile-Responsive Workspace:** Optimized, touch-friendly views for managing cases on-the-go without losing desktop-fidelity design.

### 🛡️ Admin Functionalities
- **Admin Dashboard (`/adminDashboard`):** Centralized platform to oversee platform health, users, and lawyer verifications.
- **RAG Document Management:** Three-layer infrastructure to securely upload, view, delete, and re-index legal documents (acts and cases) into the AI backend.
- **Analytics & Reporting:** Interactive charts to monitor system usage, API latency, and document index status.

### ⚙️ Core Platform Capabilities
- **Authentication:** Secure login and registration using JWT authentication.
- **Document Export:** Automated PDF generation for reports and invoices.
- **Guest Access:** Limited guest chat functionality with a dynamic, auto-expanding widget.

---

## 📚 Libraries & Tech Stack

This project leverages a robust and modern frontend technology stack to ensure high performance, security, and a beautiful user experience.

### Core Frameworks
- **[Next.js](https://nextjs.org/)** (v16.0.7) - React framework for SSR and routing.
- **[React](https://react.dev/)** (v19.2.0) - UI library.

### Styling & UI Components
- **Tailwind CSS** (v4) - Utility-first CSS framework.
- **Radix UI** - Unstyled, accessible UI primitives (Avatar, Dialog, Popover, Select, etc.).
- **Framer Motion** - Production-ready animations and micro-interactions.
- **Lucide React** - Clean and consistent iconography.

### State Management & Data Fetching
- **Zustand** - Lightweight and scalable state management.
- **Axios** - Promise-based HTTP client for API interactions.

### Integrations & Services
- **Appwrite** - Backend-as-a-Service integration for secure data and auth flows.
- **Payhere sandbox SDK** - Secure payment gateway.
- **TomTom Maps (`@tomtom-international/web-sdk-maps`)** - Interactive maps and location rendering.

### Utility Libraries
- **Recharts** - Composable charting library for admin analytics.
- **jsPDF & jsPDF-AutoTable** - Client-side PDF generation.
- **React Markdown** - Rendering formatted markdown from the AI chatbot.
- **React Day Picker & date-fns** - Date selection and formatting.
- **Sonner & SweetAlert2** - Toast notifications and beautiful alerts.

### Testing
- **Jest & React Testing Library** - Comprehensive unit and integration testing suite.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and your preferred package manager installed.

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd cognilex-frontend
   ```

2. Install the project dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up your environment variables. Create a `.env.local` file in the root directory and configure the necessary keys (Appwrite, API URLs, etc.).

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## 📂 Project Structure

- `app/`: Next.js App Router containing pages, layouts, and API routes.
  - `adminDashboard/`, `lawyerDashboard/`, `userDashboard/`: Role-specific portals.
  - `api/`: Next.js route handlers acting as a proxy to the backend.
  - `components/`: Reusable UI components (buttons, modals, charts).
- `public/`: Static assets (images, icons).
- `styles/`: Global CSS and Tailwind configurations.
