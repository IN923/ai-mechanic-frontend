# AI Car Mechanic Frontend

A React + Vite frontend for an AI-powered car diagnosis assistant. The app lets users chat with the AI mechanic, attach files such as images or documents, and submit a diagnosis request to a backend API.

## Features

- Chat-based AI mechanic interface
- File upload support for images, audio, video, and PDF files
- Diagnosis flow that posts to the backend using the selected conversation ID
- Vite + React frontend setup with Axios API client

## Tech Stack

- React 18
- Vite 5
- Axios for API requests
- ESLint for code quality checks

## Prerequisites

Before running this project, make sure you have:

- Node.js 18 or newer
- npm 9 or newer

## Installation

1. Open a terminal in the project folder.
2. Install dependencies:

   npm install

## Environment Variables

Create a .env file in the project root and set your backend base URL:

VITE_API_BASE_URL=http://localhost:8000

If your backend runs on a different host or port, update the value accordingly.

This app uses the base URL for requests such as:

- /upload/
- /diagnose/:conversationId/

## Run the App

Start the development server:

npm run dev

Then open the local URL shown in the terminal, usually:

http://localhost:5173

## Production Build

To create a production build:

npm run build

To preview the production build locally:

npm run preview

## Linting

Run the linter:

npm run lint

## Project Structure

- src/App.jsx — main car mechanic UI and diagnosis logic
- src/api/axiosClient.js — Axios client configured with VITE_API_BASE_URL
- public/ — static assets
- vite.config.js — Vite configuration

## Troubleshooting

- If requests fail, verify that the backend is running and VITE_API_BASE_URL matches your API URL.
- If the app cannot connect to the API, check the browser dev tools Network tab for the exact request URL.
- Make sure your backend supports the upload and diagnosis endpoints expected by the frontend.

## Notes

This frontend expects a compatible backend API service to provide the AI diagnosis functionality and file upload handling.
