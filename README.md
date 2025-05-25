🍽 SmartMeal AI

A Generative AI-powered platform that helps kitchen teams  to reduce food waste by track servings, predict future demand, manage events and help reduce food waste by meal plans from leftover ingredients.

This project is structured into two main folders (frontend and backend) and uses Docker for easy deployment.

📁 File Structure

smart-meal-ai/
├── backend/                 # Node.js/TypeScript API server
│   ├── src/                 # Source files (.ts)
│   ├── dist/                # Compiled JavaScript (after npm run build)
│   ├── package.json         # Backend dependencies & scripts
│   └── tsconfig.node.json   # TypeScript config for backend build
├── frontend/                # React/Vue/Svelte (or framework) client
│   ├── public/              # Static assets (index.html, favicon)
│   ├── src/                 # App source files (.js/.ts/.jsx/.tsx)
│   ├── dist/ or build/      # Compiled static site (after npm run build)
│   └── package.json         # Frontend dependencies & scripts
├── Dockerfile               # Multi-stage Docker build
├── docker-compose.yml       # Compose for local Docker orchestration
├── .gitignore               # Files and folders to ignore in Git
├── README.md                # This file
├── package.json             # (Optional) Root-level scripts chaining frontend/backend builds
└── tsconfig.json            # Root-level TypeScript config (if needed)


🛠 Tech Stack

Frontend: React  + Vite (or CRA, etc.)
Backend: Node.js + TypeScript + Express (or Koa/Fastify)
Deployment: Docker & Docker Compose
Styling: Tailwind CSS (or PostCSS)


🚀 Getting Started

Follow these steps to run the project on your local machine.

1. Prerequisites
    Node.js v16+ (LTS)
    npm v8+ (bundled with Node)
    Docker & Docker Compose (if you plan to use containers)

2. Clone the Repository
    git clone https://github.com/yourusername/smart-meal-ai.git
    cd smart-meal-ai

3. Install Dependencies

    Frontend
        cd frontend
        npm install

    Backend
        cd ../backend
        npm install
    If you added a root-level package.json to chain installs, from the repo root you can also run:
    npm install

4. Environment Variables

    Create a .env file in both frontend/ and backend/ (if required) and add your configuration:
    # Example (backend/.env)
    PORT=4000
    DATABASE_URL=postgres://user:pass@localhost:5432/smartmeal
    API_KEY=your_api_key_here

5. Build the Projects

    Frontend Build
        cd frontend
        npm run build
        # Generates a dist/ (or build/) folder

    Backend Build (TypeScript)
        cd ../backend
        npm run build
        # Generates a dist/ folder with compiled JS
        
    Alternatively, to run both builds from root (if you set up a script):
    npm run build

6. Run Locally (without Docker)

    Start Backend
        cd backend
        node server.cjs

    in the new terminal run:
    Serve Frontend

        cd frontend
        npm run dev
    

7. Running with Docker

        Make sure Docker and Docker Compose are installed and running.
        # From project root
          docker-compose up --build

        # From project root
        docker-compose up --build

        This command will:

        Build the frontend and copy its static files into a light-weight Nginx or Node container.

        Build the backend, install dependencies, and run the API server in a separate container.

        Expose ports (as defined in docker-compose.yml) so you can access the app at http://localhost:3000 (frontend) and http://localhost:4000 (backend).

🎉 Congratulations!

You now have SmartMeal AI up and running locally (and in Docker). Feel free to explore, contribute, and customize the app for your own food-waste-reducing needs.


