# Hand Gesture Recognition System

A beautiful, real-time hand gesture recognition application built with React, Vite, and MediaPipe.

## 🚀 Features

- **Real-time Tracking**: Low-latency hand tracking using MediaPipe's WASM-based inference.
- **Dual Hand Support**: Track up to two hands simultaneously.
- **Gesture Classification**: Heuristic-based gesture recognition (Open Palm, Pointing, Fist).
- **Modern UI**: Premium dark-mode interface with glassmorphism and smooth animations.
- **Responsive Design**: Works on desktops and laptops with a webcam.

## 🛠️ Tech Stack

- **React**: Frontend library for building the UI.
- **Vite**: Ultra-fast build tool and development server.
- **MediaPipe**: Cross-platform ML solution for hand and finger tracking.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Lucide React**: Beautiful icons for the interface.

## 🏁 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:5173`

## 📂 Project Structure

- `src/main.tsx`: Entry point.
- `src/App.tsx`: Main application layout.
- `src/components/HandGestureRecognition.tsx`: Core MediaPipe integration.
- `src/components/Header.tsx` & `src/components/Footer.tsx`: UI layout components.
- `index.html`: Contains MediaPipe library scripts.


