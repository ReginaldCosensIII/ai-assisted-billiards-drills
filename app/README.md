# app/

This directory contains the desktop-first front-end application layer for the AI Assisted Billiards Drill platform.

## Architecture
- **Stack:** Electron, React, Vite
- **UI Components:** We rely on isolated components such as `VirtualTable.tsx` for projecting drag-and-drop physics across dynamic orientations. The table features advanced mathematical radial and tangential physics clamping ensuring realistically bounded interactions before persisting to the database.

## Running Locally
See the global repository documentation for complete bootstrapping. This workspace assumes the API is running at `localhost:3030`.
