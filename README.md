# CSC-131-Zeus-Volunteers

Zeus Volunteers will be a volunteering website that allows coomuinities to volunteer for events in there local area. The site will allow organizers the create volunteer events of different types like cultural, medical, environmental, neighborhood cleanups, and more.

# Core Features

* Account Creation
* Volunteer Event Browsing and Creation
* Notification System through Email and inbuilt Calander
* Floating Navigation Bar
* Admin Approval and Deny features for moderation

# Tech Stack

We will be using the MERN tech stack

* MongoDB
* Express JS Frontend Server
* React.js
* Node.js

# APIs

* Google Maps
* PostMark

# File Structure

This is the initial file sturcture for now.
```plaintext
Zeus-Volunteers/
│
├── .github/              # GitHub Actions (CI/CD) workflows
│
├── backend/              # (E)xpress + (N)ode.js server
│   ├── src/
│   │   ├── controllers/  # API route logic
│   │   ├── models/       # (M)ongoDB database schemas
│   │   ├── routes/       # API route definitions
│   │   └── server.js     # Main server entry point
│   ├── .dockerfile       # Dockerfile for the backend
│   ├── .env              # Environment variables (NEVER commit this)
│   └── package.json      # Backend dependencies
│
├── database/             # (M)ongoDB seeding scripts
│   └── seeds/
│       └── seed.js       # Script to populate database with test data
│
├── frontend/             # (R)eact.js client application
│   ├── public/           # Static assets (index.html, favicon)
│   ├── src/
│   │   ├── assets/       # Images, fonts, and global CSS
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page-level components
│   │   ├── App.js        # Main React app component
│   │   └── index.js      # React entry point
│   ├── .dockerfile       # Dockerfile for the frontend
│   └── package.json      # Frontend dependencies
│
├── .docker-compose.yml   # (Optional) Runs all services
├── .gitignore            # Tells Git what files to ignore
└── README.md             # You are here!
```

# Collaborators

  Pierce ([@Techmaster999](https://github.com/Techmaster999))
  
  Valentino ([@TinoMans](https://github.com/TinoMans))
  
  Natalie ([@barberenanatalie12-debug](https://github.com/barberenanatalie12-debug))
  
  Reese ([@starrysheep8](https://github.com/starrysheep8))
  
  Sadam ([@Adamrashid781](https://github.com/Adamrashid781))
