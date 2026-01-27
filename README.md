## S.E.A. D(R)IVE - Cloud Storage Solution
S.E.A. D(R)IVE is a comprehensive, cross-platform cloud storage solution inspired by the Google Drive experience. This project integrates a React Native mobile application, a React web client, a Node.js API gateway, and a C++ logic server.

 All development, commits, and updates for Exercise 5 are located in the 
 
 ##ex---5---copy branch

## System Architecture & Execution
Backend: A Node.js server managing the API and a MongoDB database (via Mongoose) for persistent storage.

Logic: A high-performance C++ server.

Frontend: A React Native (Expo) mobile app and a React web interface.

## Running the System:
Ensure Docker Desktop is running.
Run the automated startup script:

"npm run start:full"

This script handles IP configuration, builds the Docker containers, and launches all services.

## Documentation (Wiki)

For detailed guides and visual walkthroughs, please visit our Wiki directory:

Installation & Running: Detailed setup, Docker commands, and troubleshooting.

User Authentication: Details on secure registration, login, and input validation.

File & Folder Management: Full guide on CRUD operations (Create, Rename, Move, Star, Delete), real-time search, and the permission system (Viewer/Editor/Admin).
