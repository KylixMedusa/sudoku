# Sudoku App

Welcome to the **Sudoku App**! This project is a fully-featured Sudoku game application where users can enjoy solving puzzles, track progress, and generate new Sudoku challenges. Whether you're a beginner or a seasoned Sudoku enthusiast, this app is designed with you in mind.

---

## Table of Contents

- [Sudoku App](#sudoku-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Usage](#usage)
  - [Technologies Used](#technologies-used)
  - [Contributing](#contributing)
  - [License](#license)

---

## Features

- **Multiple Difficulty Levels**: Choose from beginner, intermediate, and expert puzzles.
- **Puzzle Generation**: Generate new puzzles with a single click.
- **Hints & Error Checking**: Get hints or check your solution as you play.
- **Responsive UI**: Optimized layout for desktop and mobile devices.
- **Time and Score Tracking**: Track your solving time and challenge your friends.
- **Save & Resume**: Save your progress and continue later.
- **Undo/Redo Moves**: Easily correct your moves with undo and redo options.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 14 or higher recommended)
- [pnpm](https://pnpm.io/) (if not installed, you can install it via `npm install -g pnpm`)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/sudoku-app.git
   cd sudoku
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Run the Application**

   ```bash
   pnpm start
   ```

   The app should now be running on [http://localhost:5173](http://localhost:5173).

4. **Build for Production**

   To create an optimized build:

   ```bash
   pnpm run build
   ```

   The build artifacts will be stored in the `build/` directory.

---

## Usage

When you launch the application, follow these simple steps:

1. **Select Difficulty Level:** Choose your preferred difficulty (Beginner, Intermediate, Expert).
2. **Start Solving:** Click on a cell to input numbers. Use the hint button if you need assistance.
3. **Track Progress:** Your solving time and score are displayed in real-time.
4. **Save or Reset:** Use the save button to store your progress, or click reset to start a new game.
5. **Undo/Redo:** Easily correct your moves with the undo and redo buttons.

---

## Technologies Used

- **React** - For building the user interface.
- **Redux** - For state management.
- **Sass/SCSS** - For styling and theming.
- **Webpack** - For module bundling.
- **ESLint & Prettier** - For code linting and formatting.

---

## Contributing

We welcome contributions to improve the Sudoku App! Follow these steps if you want to contribute:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m 'Add some feature'
   ```

4. Push to the branch:

   ```bash
   git push origin feature/YourFeatureName
   ```

5. Open a pull request outlining your changes.

Please ensure your code adheres to our coding standards and includes tests where applicable.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Enjoy playing and happy solving!