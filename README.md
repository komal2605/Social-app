# Vite React Shadcn TS

## Overview

Vite React Shadcn TS is a modern web application starter project leveraging Vite, React, TypeScript, and Shadcn for building scalable and maintainable front-end applications. This project integrates essential tools and libraries to streamline development and enhance user experience.

## Features

### Core Features

- **User Authentication**: Seamless login and signup functionality to ensure secure access.
- **Post Creation**: Users can create new posts with content, image, and user mentions.
- **Home Feed**: View posts from other users on the home screen.
- **Profile Management**: Update user profiles via a dedicated profile screen(profile picture update only).
- **Logout Functionality**: Simple and secure logout process.

### Technical Highlights

- Utilizes `@supabase/supabase-js` for backend integration and database operations.
- Implements `@tanstack/react-query` for efficient data fetching and state management.
- Supports responsive and interactive UI components with Radix UI and TailwindCSS.
- Includes robust form handling with `react-hook-form` and schema validation using `zod`.
- Built-in support for internationalization with `javascript-time-ago`.

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/vite_react_shadcn_ts.git
   ```
2. Navigate to the project directory:
   ```bash
   cd vite_react_shadcn_ts
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

### Build

To create a production build:

```bash
npm run build
# or
yarn build
```

## Scripts

- `dev`: Starts the development server.
- `build`: Builds the application for production.
- `build:dev`: Builds the application in development mode.
- `lint`: Lints the codebase using ESLint.

## Dependencies

This project leverages a rich ecosystem of libraries and tools, including:

- **Frontend Frameworks**: React, TypeScript
- **UI Components**: Radix UI, TailwindCSS
- **Form Handling**: React Hook Form, Zod
- **Animations**: Framer Motion
- **Backend Integration**: Supabase

For a complete list of dependencies, refer to the `package.json` file.

## Contributing

Contributions are welcome! Please follow the guidelines outlined in the `CONTRIBUTING.md` file (if available).

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Feel free to reach out for any questions or feedback regarding this project!
