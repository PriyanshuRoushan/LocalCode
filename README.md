# Welcome to LocalCode 

LocalCode is an innovative offline coding platform that brings the power of modern web technologies to your desktop. This project leverages React (with Vite for fast development), Electron to create a seamless cross-platform application, and SQLite for robust database management. It has been designed to provide an efficient, user-friendly coding experience, even without an internet connection.

## 🎯 Features

- **Responsive Frontend**: Developed with React & Vite for quick and efficient user interactions.
- **Cross-Platform Desktop Application**: Powered by Electron, LocalCode works seamlessly on Windows, Mac, and Linux.
- **Embedded Database**: Using SQLite for hassle-free database integration.
- **Secure Authentication**: Incorporates BcryptJS for password security.
- **Dynamic Routing**: Managed using React Router DOM to ensure smooth transitions.
- **State Management**: Leveraging Zustand for a lightweight and predictable state management.
- **Rich Code Editor Support**: Features CodeMirror with syntax highlighting for C++, Java, and Python.

## 🚀 Quick Start

Follow these steps to quickly set up the project on your machine:

```bash
npm create vite@latest LocalCode
cd LocalCode
npm install
npm install electron electron-builder better-sqlite3 bcryptjs react-router-dom zustand @codemirror/state @codemirror/view @codemirror/lang-cpp @codemirror/lang-java @codemirror/lang-python
```

## 🛠 Technologies Used

- **React**: For building the user interface
- **Vite**: As a blazingly fast frontend build tool
- **Electron**: To transform the web app into a desktop application
- **SQLite**: Lightweight yet powerful database engine
- **BcryptJS**: To handle password hashing
- **React Router DOM**: Used for routing
- **Zustand**: For efficient state management
- **CodeMirror**: Enabling a rich coding environment

## 📜 License

This project is licensed under the MIT License.

## 🌐 Contribute

Contributions are welcome! Feel free to open an issue or submit a pull request to improve this offline coding platform.

---

Built with ❤️ by the LocalCode team!