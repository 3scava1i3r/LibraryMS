# LibraryMS

A brutalist Library Management System built with React/Vite frontend and Node.js backend, styled using the RawBlock Design System.

## Overview

LibraryMS is a modern library management application with an unapologetically raw, anti-design aesthetic. Built for experimental portfolios and avant-garde art sites, it embraces thick borders, system-level aesthetics, and the raw power of black-on-white.

## Features

- **Browse Books**: View available books in the library collection
- **User Authentication**: Login/Register system for members
- **My Books**: Track borrowed books and borrowing history
- **Admin Dashboard**: 
  - Manage books (add, update, delete)
  - Manage members
  - View transactions

## Tech Stack

### Frontend
- React 18.2.0
- Vite 5.0.0
- React Router DOM 6.21.0
- Motion (for animations)
- Axios (API calls)

### Backend
- Node.js
- Express
- SQLite (database)

## Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/3scava1i3r/Truffle-teams-work.git
cd Truffle-teams-work
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Initialize the database:
```bash
cd ../server
node seed.js
```

## Usage

### Development

Run the backend server:
```bash
cd server
node index.js
```

Run the frontend development server:
```bash
cd client
npm run dev
```

### Production

Build the client:
```bash
cd client
npm run build
```

## Project Structure

```
Truffle-teams-work/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── api.js
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context
│   │   ├── hooks/
│   │   └── pages/          # Application pages
│   └── index.html
├── server/                 # Backend API
│   ├── routes/             # API routes
│   ├── db.js               # Database configuration
│   └── index.js            # Server entry point
├── DESIGN.md               # RawBlock Design System documentation
└── README.md
```

## Design System

This project uses the RawBlock Design System - a brutalist design language featuring:
- Thick borders (3-5px) as primary visual organizers
- Black (#000000) and White (#FFFFFF) as primary colors
- Sharp edges (0px border radius) - no exceptions
- Archivo Black for headlines, Work Sans for body text
- Full color inversions for hover/active states

See [DESIGN.md](./DESIGN.md) for complete design system documentation.

## License

MIT