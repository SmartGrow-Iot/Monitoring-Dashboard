# SmartGrow Frontend

SmartGrow is an intelligent plant monitoring and automation system. This frontend provides a modern, responsive dashboard for managing your plants, viewing sensor data, setting care thresholds, and receiving alerts.

## 🌱 Features

- **Dashboard:** Real-time overview of all plant modules and their health status.
- **Plant Profiles:** Create, view, and edit plant profiles with customizable care thresholds.
- **Historical Data:** Visualize sensor data trends (moisture, temperature, light, humidity) with export options (CSV, PDF).
- **Alerts:** Get notified about critical plant conditions and resolve issues.
- **Settings:** Personalize your account and system automation preferences.
- **Authentication:** Secure login and signup with Firebase.
- **Responsive Design:** Works great on desktop and mobile.
- **User Manual & Resources:** Access guides and training materials directly from the app.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Setup Instructions

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   ```

2. **Navigate to the frontend folder:**

   ```sh
   cd SmartGrow/frontend
   ```

3. **Install dependencies:**

   ```sh
   npm install
   ```

4. **Start the development server:**

   ```sh
   npm run dev
   ```

5. **Open your browser and visit:**
   ```
   http://localhost:5173
   ```

### API & Backend

- The frontend expects a backend API running at `/api/v1`. See your backend documentation for setup.
- Authentication uses Firebase (see `src/firebase.js` for configuration).

## 📁 Project Structure

- `src/pages/` — Main app pages (Dashboard, PlantProfiles, HistoricalData, etc.)
- `src/components/` — Reusable UI components
- `src/api/api.jsx` — Axios API instance
- `src/firebase.js` — Firebase config
- `public/resources/` — User manual and training materials

## 🛠️ Customization

- **UI:** Built with React, Tailwind CSS, and Lucide icons.
- **Thresholds:** Edit plant care thresholds in Plant Profiles.
- **Export:** Download historical data as CSV or PDF.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

© 2025 SmartGrow. All rights reserved.

---

**Enjoy growing smarter with SmartGrow!**
