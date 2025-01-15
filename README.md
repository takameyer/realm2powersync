# React Native PowerSync Demo

This project demonstrates how to use PowerSync with React Native and MongoDB Atlas for offline-first data synchronization. It implements a todo list application that can work offline and sync changes when back online.

## Prerequisites

- Node.js and npm
- React Native development environment set up for iOS/Android
- MongoDB Atlas account
- PowerSync account
- For iOS: CocoaPods installed
- For Android: SDK version 24 or higher

## Setup Steps

### 1. MongoDB Atlas Setup

1. Create or log into your [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Deploy a new cluster (M0 free tier is sufficient)
3. Create a database named `PowerSync` with a collection named `Item`
4. Create a database user with `readWrite` and `dbAdmin` permissions
5. Add PowerSync service IPs to your network access allowlist (found in PowerSync's security and ip filtering page)
6. Save your MongoDB connection string for later use

### 2. PowerSync Setup

1. Create or log into your [PowerSync](https://powersync.com) account
2. Create a new instance named "TodoList"
3. Select MongoDB as the database type
4. Configure the connection using your MongoDB connection string
5. Set up sync rules for data synchronization

### 3. Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/takameyer/realm2powersync
   cd realm2powersync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following variables:
   ```
   POWERSYNC_ENDPOINT=<your-powersync-endpoint>
   AUTH_TOKEN=<your-powersync-dev-token>
   BACKEND_ENDPOINT=http://localhost:8000
   ```

4. For iOS, install pods:
   ```bash
   npx pod-install
   ```

### 4. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### 5. Running the Application

1. For Android, run:
   ```bash
   npm run android
   ```
   Note: For Android emulator, you'll need to forward the backend port:
   ```bash
   adb reverse tcp:8000 tcp:8000
   ```

2. For iOS, run:
   ```bash
   npm run ios
   ```

## Features

- Create, update, and delete todo items
- Offline support
- Real-time synchronization across devices
- Toggle between showing all tasks or user-specific tasks
- Disable/enable sync functionality for testing

## Development Branches

This repository contains several branches that correspond to different phases of the migration guide:

- `00-Start-Here` - Initial React Native application using Realm/Device Sync
- `01-Prepare-for-Migration` - Project setup and MongoDB Atlas configuration
- `02-Migrate-Local-Client` - Converting from Realm to local PowerSync client
- `03-Sync-Data-From-Atlas` - Implementing PowerSync data synchronization
- `04-Write-To-Backend` - Adding backend server for MongoDB operations
- `05-Finishing-Touches` - Final improvements and cleanup

The `main` branch contains the completed project with all features implemented.

## Project Structure

- `/src` - React Native application code
- `/backend` - Node.js server for handling MongoDB operations
- `/src/PowerSync.ts` - PowerSync configuration and setup
- `/src/ItemSchema.ts` - Data schema definitions

## Technologies Used

- React Native
- PowerSync
- MongoDB Atlas
- Express.js
- Node.js

## License

MIT License

## Support

For issues or questions, please [open an issue](https://github.com/takameyer/realm2powersync/issues) on GitHub.

