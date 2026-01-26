## S.E.A. D(R)IVE - Cloud Storage Solution
S.E.A. D(R)IVE is a comprehensive, cross-platform cloud storage solution inspired by the Google Drive experience. This project integrates a React Native mobile application, a React web client, a Node.js API gateway, and a C++ logic server.

 All development, commits, and updates for Exercise 5 are located in the ex-5 branch.

## Work Methodology & Process
In this exercise, we implemented professional industry standards for development:
Agile & Scrum: We managed the project using JIRA, dividing the work into Epics, User Stories, and Tasks.
Sprint Management: A Scrum Master was appointed, and status meetings were held at least twice a week to track progress.
Git Flow: We worked strictly with Feature Branches. No code was merged directly to main without a Pull Request (PR) and a mandatory code review by all team members .
JIRA-GitHub Integration: Tasks were linked to branches and monitored in real-time through statuses: In Progress, Code Review, and Done.

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
