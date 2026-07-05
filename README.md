# Bomb Defusal Timer

Bomb Defusal Timer is a polished mobile game built with React Native and Expo. Players race against the clock to defuse a bomb by entering the correct 4-digit code before time runs out. The app includes difficulty levels, score tracking, persistent statistics, sound effects, haptics, and a modern game-style user interface.

## Project Overview

This project was designed as a beginner-friendly yet production-ready mobile game experience. It combines gameplay logic, state persistence, animations, and a polished user interface in a clean Expo-based architecture.

## Features

- Immersive bomb defusal gameplay
- Multiple difficulty levels: Easy, Medium, and Hard
- Countdown timer and progress indicator
- Score tracking and high score persistence
- Game statistics for wins, losses, and best remaining time
- Sound effects and haptic feedback
- Customizable settings for audio, vibration, difficulty, and theme
- Modern mobile UI with animated bomb visuals
- Expo-compatible architecture for Android and iOS

## Technologies Used

- React Native
- Expo
- Expo Router
- TypeScript
- AsyncStorage for local persistence
- Expo AV for audio
- Expo Haptics for vibration
- Expo Linear Gradient for visuals
- Expo Vector Icons for UI icons

## Installation Steps

1. Clone the repository

   ```bash
   git clone <your-repository-url>
   cd BombDefusalTimer
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the Expo development server

   ```bash
   npx expo start
   ```

## How to Run

You can run the app in several ways:

- On an Android emulator
- On a physical Android device
- Through Expo Go
- Through a development build

### Run on Android

```bash
npx expo start --android
```

### Run on iOS

```bash
npx expo start --ios
```

### Run in web browser

```bash
npx expo start --web
```

## Folder Structure

```text
src/
  app/              # Screens and routes
  components/       # Reusable UI components
  hooks/            # Custom React hooks
  screens/          # Main screen components
  utils/            # Game logic, storage, and helpers
assets/            # Images, icons, and app assets
```

## Screenshots

Add screenshots of the home screen, gameplay screen, settings screen, and statistics screen here.

Example:

```text
![Home Screen](assets/images/screenshot-home.png)
![Gameplay Screen](assets/images/screenshot-game.png)
![Settings Screen](assets/images/screenshot-settings.png)
```

## Future Improvements

- Add more game modes
- Introduce leaderboards
- Add local achievements and unlockables
- Improve animations and visual polish
- Add unit and integration tests
- Support cloud save and cross-device sync

## License

This project is licensed under the MIT License.
