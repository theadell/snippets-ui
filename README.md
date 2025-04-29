# Snippet Sharing Service

A simple and functional web application for sharing text and code snippets.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Backend API server running on http://localhost:8080

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to http://localhost:5173

## Usage

1. Create a new snippet by clicking the "Create New Snippet" button
2. Fill in the snippet details:
   - Title (optional)
   - Content (required)
   - Content Type (optional)
   - Password (optional, minimum 8 characters)
   - Expiration Time (optional, format: 24h, 7d, 30d)
3. View your snippets on the home page
4. Edit or delete snippets you own using the provided buttons
5. Share snippet URLs with others (password-protected snippets will require the password)

## Development

The application is built with:
- React
- TypeScript
- Vite
- Material-UI
- OpenAPI TypeScript Codegen

The API client is automatically generated from the OpenAPI specification.
