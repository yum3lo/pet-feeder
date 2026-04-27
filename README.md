# Intelligent feeding system for small-sized pets. 
**Authors:**

Frunza Valeria - Development of the frontend

Cucoș Maria - Development of the hardware and backend system


## Project Goal

This project aims to design and implement an intelligent automatic pet feeding system for small-sized pets such as cats and dogs. The system addresses the practical problem of ensuring pets are fed consistently and appropriately, even when their owners are away or have irregular schedules.

The solution combines three tightly integrated components: a physical hardware device equipped with load cells, a distance sensor, a motor-driven dispensing mechanism, and a camera; a backend server that manages data persistence, scheduling, MQTT-based communication with the device, and a machine learning recognition pipeline; and a cross-platform mobile application through which the owner configures the system, monitors feeding activity, and manages their pets' profiles.

![alt text](image.png)

Key capabilities of the system include scheduled and on-demand feeding triggered from the mobile app, real-time food weight monitoring, per-pet feeding attribution through a trained image recognition model, push notifications for upcoming meals and low food levels, and full offline support in the mobile application so that configuration changes are never lost due to intermittent connectivity.

## Frontend

### Technology Stack

| Technology | Purpose |
|---|---|
| React Native 0.81 + Expo 54 | Cross-platform mobile framework |
| TypeScript 5.9 | Static typing across the entire codebase |
| React Navigation (native stack) | Screen routing and navigation |
| TanStack Query v5 | Server state management and caching |
| Axios | HTTP client with request/response interceptors |
| AsyncStorage | Persistent local storage for auth tokens and offline queue |
| Expo SecureStore | Secure storage for authentication tokens |
| Expo Image Picker + Image Manipulator | Pet photo selection and compression |
| Expo Notifications | Local push notifications for feeding reminders |
| Expo Network | Network connectivity polling |
| React Native Calendars | Date filter in feeding history |
| Jest + jest-expo + Testing Library | Unit testing |

### Installation and Usage

**Prerequisites:** Node.js, npm, and the Expo Go app on your device (or a simulator).

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
# or target a specific platform
npm run ios
npm run android
```

Create a `.env` file in the `frontend/` directory with the following variable:

```
EXPO_PUBLIC_API_URL=http://<your-backend-host>:3000
```

**Running tests:**

```bash
npm test
# or in watch mode
npm run test:watch
```

### Project Structure

```
frontend/
├── App.tsx                  # Root component, context providers, navigation container
├── index.ts                 # Entry point
├── assets/                  # Static images and fonts
├── components/              # Reusable UI components (actions, cards, modals, lists, etc.)
├── constants/               # Shared constants (screen dimensions, navbar height)
├── contexts/                # React contexts (Toast, Pets, NetworkStatus, OfflineQueue)
├── data/                    # Static JSON datasets (cat/dog breeds, dietary restrictions)
├── hooks/                   # Custom hooks grouped by domain (auth, pets, network, notifications)
├── navigation/              # AppNavigator, navigationRef, route type definitions
├── screens/                 # Screen components grouped by feature
│   ├── auth/                # Register and Login screens
│   ├── device/              # Add Device screen
│   ├── history/             # Feeding History screen
│   ├── home/                # Home screen
│   ├── model/               # Cat Recognition and Train Model screens
│   ├── pet/                 # Add Pet, Add Pet Photo, Pet Settings screens
│   └── schedule/            # Set Feeding and Schedule screens
├── services/                # API service functions and React Query hooks
├── style/                   # Global theme, colours, typography, and spacing
├── types/                   # Shared TypeScript type definitions
└── utils/                   # Utility functions (payload builders, string helpers)
```

