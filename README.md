# Intelligent feeding system for small-sized pets. 
**Authors:**

Frunza Valeria - Development of the frontend

Cucoș Maria - Development of the hardware and backend system


## Project Goal

This project aims to design and implement an intelligent automatic pet feeding system for small-sized pets such as cats and dogs. The system addresses the practical problem of ensuring pets are fed consistently and appropriately, even when their owners are away or have irregular schedules.

The solution combines three tightly integrated components: a physical hardware device equipped with load cells, a distance sensor, a motor-driven dispensing mechanism, and a camera; a backend server that manages data persistence, scheduling, MQTT-based communication with the device, and a machine learning recognition pipeline; and a cross-platform mobile application through which the owner configures the system, monitors feeding activity, and manages their pets' profiles.

<img src="image.png" width="400" alt="System overview"/>

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

---

## Hardware

The physical device is built around a Raspberry Pi 3 Model B+ and housed in a custom 3D-printed enclosure (350mm × 270mm × 150mm) designed in SolidWorks. The housing has three levels: a base level containing the food tray, tray load cell, and electronics; a middle level with the motor, auger screw, dispensing ramp, camera, and distance sensor; and a top level serving as the food storage compartment with a removable lid.

### Components

| Component | Purpose |
|---|---|
| Raspberry Pi 3 Model B+ | Central controller |
| Servo motor (MG995) | Food dispensing via auger screw |
| 200g load cell + HX711 | Tray weight - measures dispensed and consumed food |
| 750g load cell + HX711 | Container weight - monitors remaining food level |
| VL53L0X distance sensor | Detects pet presence near the feeder |
| Raspberry Pi Camera Module | Captures images for pet recognition |

### Wiring

| Component | GPIO Pins |
|---|---|
| Tray load cell (200g) | DT: GPIO 5, SCK: GPIO 6 |
| Container load cell (750g) | DT: GPIO 27, SCK: GPIO 17 |
| VL53L0X (I2C) | SDA: GPIO 2, SCL: GPIO 3 |
| Motor (MG995) | GPIO 22 |

### 3D Model housing

<table>
  <tr>
    <td><img src="/3d_model/drawing1.png" width="400" alt="System overview"/></td>
    <td><img src="/3d_model/drawing2.png" width="400" alt="System overview"/></td>
  </tr>
  <tr>
    <td><img src="/3d_model/drawing3.png" width="300" alt="System overview"/></td>
    <td><img src="/3d_model/model1.png" width="400" alt="System overview"/></td>
  </tr>
  <tr>
    <td><img src="/3d_model/model2.png" width="400" alt="System overview"/></td>
    <td><img src="/3d_model/model3.png" width="400" alt="System overview"/></td>
  </tr>
</table>

---

## Embedded Software

The embedded software is written in Python and lives in the `embedded/` directory.

### Project Structure

```
embedded/
├── feeding/
│   └── feeding_controller.py  # Dispensing logic and consumption tracking
├── sensors/
│   ├── load_cell.py       # HX711 driver for both load cells
│   ├── distance_sensor.py # VL53L0X driver
│   ├── motor.py           # Servo motor control
│   └── camera.py          # Camera capture
├── tests/           # Component test scripts
├── config.py        # Device ID, broker URL, credentials, pin numbers, hardware thresholds
├── main.py          # Entry point - starts both threads
├── mqtt_client.py   # MQTT connection and message handling
└── requirements.txt # Python dependencies
```

### Installation and Usage

**Prerequisites:** Raspberry Pi OS, Python 3, I2C enabled via `raspi-config`, and the `pigpio` daemon running (`sudo pigpiod`).

```bash
# Navigate to the embedded directory
cd embedded

# Install dependencies
pip install -r requirements.txt --break-system-packages

# Create a .env file with your credentials
cp .env.example .env

# Run the main program
python3 main.py
```

Create a `.env` file in the `embedded/` directory:

```
MQTT_BROKER_URL="mqtt_url"
MQTT_PORT=8883
MQTT_USERNAME="mqtt_username"
MQTT_PASSWORD="mqtt_password"
DEVICE_ID=feeder_01
```

---

## Backend

The backend is built with **NestJS** and **TypeScript**, backed by a **MySQL** database managed through **Prisma ORM** and containerized with **Docker**. It communicates with the embedded device exclusively through the **HiveMQ** cloud MQTT broker.

### Technology Stack

| Technology | Purpose |
|---|---|
| NestJS + TypeScript | Server framework |
| MySQL + Prisma ORM | Database and schema management |
| Docker | MySQL container |
| HiveMQ Cloud | MQTT broker for device communication |
| JWT + bcrypt | Authentication and password hashing |
| Cloudinary | Pet profile image storage |
| TensorFlow + MobileNetV2 | Pet recognition model training and inference |
| @nestjs/schedule | Cron-based feeding schedule execution |

### Installation and Usage

**Prerequisites:** Node.js, Docker.

```bash
# Start the MySQL container
docker-compose up -d

# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate dev

# Start the server
npm run start:dev
```

Once the server is running, the interactive API docs (Swagger UI) are available at:

```
http://<your-backend-host>:3000/api
```

Create a `.env` file in the `backend/` directory:

```
DATABASE_URL=mysql://root:password@localhost:3306/petfeeder
JWT_SECRET=your-jwt-secret
MQTT_BROKER_URL=your-hivemq-cluster-url
MQTT_PORT=8883
MQTT_USERNAME=your-username
MQTT_PASSWORD=your-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Project Structure

```
backend/src/
├── auth/           # JWT authentication, login, register
├── devices/        # Device registration and management
├── feeding/        # Schedules, manual feeding, feeding history
├── mqtt/           # HiveMQ connection, topic subscriptions
├── notifications/  # Push notification service
├── pets/           # Pet profile management
├── recognition/    # Pet recognition service
└── main.ts         # Application entry point
```