# ThinkLab - SiteGuard Solution

BuildAI Workspace is a comprehensive, full-stack construction management platform designed for the **ThinkLab Group**. It leverages Google's Gemini AI to assist Site Engineers in generating architecture plans, analyzing safety hazards from images, managing resources, and generating daily reports.

**Sub-brand:** SiteGuard Solution (Safety & Monitoring Module)

## Key Features

1.  **AI Architecture Generator**: 
    *   Generates detailed project lifecycles, cost estimates, and material lists based on land size and budget using **Gemini 2.5 Flash**.
2.  **SiteGuard Safety Monitor**:
    *   Analyzes uploaded site photos to detect hazards (PPE violations, debris) and assigns a safety risk score.
3.  **Resource Management**:
    *   Tracks inventory (Cement, Sand, etc.).
    *   **AI Resource Planner**: Suggests inventory lists based on the project stage.
4.  **Daily Reports**:
    *   Generates professional text summaries of daily progress, risks, and recommendations using AI.
5.  **Workspace Portfolio**:
    *   Centralized dashboard to manage multiple construction sites.
6.  **Full Authentication**:
    *   Secure account creation and login system.

## Tech Stack

*   **Frontend**: React (TypeScript), Tailwind CSS, Lucide Icons, Recharts.
*   **AI Integration**: Google GenAI SDK (Gemini 2.5 Flash).
*   **Backend (Provided Code)**: Node.js, Express, MongoDB, Mongoose.
*   **Demo Persistence**: LocalStorage (for client-side demo without running local backend).

## Installation & Setup

### 1. Frontend (Client)
This application is set up to run immediately in a browser environment.

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set your API Key:
    *   Ensure `process.env.API_KEY` is available or passed to the build.
4.  Run the development server:
    ```bash
    npm start
    ```

### 2. Backend (Server)
To switch from the client-side simulated auth to the real Node/Mongo backend:

1.  Navigate to the `server/` directory (create it if using the provided code snippets).
2.  Install backend dependencies:
    ```bash
    npm install express mongoose cors dotenv bcryptjs jsonwebtoken
    ```
3.  Configure `.env` in `server/`:
    ```
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret
    ```
4.  Run the server:
    ```bash
    node server.js
    ```
5.  Update `context/AppContext.tsx` to make `fetch()` calls to `http://localhost:5000/api/...` instead of using `localStorage`.

## Usage Guide

1.  **Sign Up**: Create an account on the initial screen.
2.  **Create Workspace**: Click "New Workspace" to define a construction project (e.g., "Lekki Gardens").
3.  **Generate Plan**: Go to "Architecture AI", enter parameters (e.g., Duplex, 50M budget), and save the AI-generated plan.
4.  **Monitor Safety**: Go to "Safety Monitor", upload a site photo. The AI will detect hazards. Save the report.
5.  **Generate Report**: Go to "Reports", select the project, and generate a daily summary PDF/Text.

---
© 2025 ThinkLab Group. All rights reserved.
