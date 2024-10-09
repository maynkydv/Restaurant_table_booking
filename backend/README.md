

# Restaurant Table Booking Website

## Overview

This is a Node.js application using Express library. The app also uses Sequelize for ORM (Object-Relational Mapping) to interact with the database and supports CORS for communication with a frontend application running on `localhost:3000`. The application includes routing for users and admins, and stores some of its configuration in a `.env` file.

## Features

- Express framework for handling HTTP requests and responses.
- Sequelize ORM for database interaction.
- CORS support for cross-origin resource sharing.
- Routes for user and admin-related operations.
- JWT-based authentication.
- Static file serving for images.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- npm 
- PostgreSQL 

## Getting Started

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/maynkydv/Restaurant_table_booking
    cd Restaurant_table_booking
    ```

    if branch working_code doesnot merged to master  

    ```bash
    git switch working_code 
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:

    ```plaintext
    # Database 
    DB_NAME=<your_database_name>
    DB_USER=<your_database_user>
    DB_PASSWORD=<your_database_password>

    # JWT TOKEN 
    SECRET_KEY=<your_jwt_secret_key>

    ADMIN_KEY=<your_admin_key>
    ```

    - **DB_NAME**: Name of the database.
    - **DB_USER**: Database username.
    - **DB_PASSWORD**: Database password.
    - **SECRET_KEY**: Secret key used for signing JWT tokens.
    - **ADMIN_KEY**: Admin-specific secret key.

### Running the Application

1. Ensure that your database is running and accessible.
2. Start the application:

    ```bash
    npm start
    ```

3. Open your browser and go to `http://localhost:5000` to verify that the server is running.

## Project Structure

```
Restaurant_table_booking/
├── models/
│   └── index.js {all models are imported in this file only}
├── routes/
│   ├── adminRoutes.js
│   └── userRoutes.js
├── public/
│   └── images/
│       └── restaurant/ (Served as static files)
├── .env
├── app.js
└── package.json
```

### `controllers/`

Contains Express routers for user-related and admin-related routes:

- **adminController**: Handles routes functionality for admin-related actions.
- **bookingController**: Handles routes functionality for booking-related actions.
- **restaurantController**: Handles routes functionality for restaurant-related actions.
- **userController**: Handles routes functionality for user-related actions.


### `middlewares/`

Contains Express routers for user-related and admin-related routes:

- **authenticate**: Handles authentication for all user/admin, by JWT token verification.
- **adminAuth**: Handles admin authentication.

### `models/`

Contains Sequelize models for interacting with database tables.
- **Booking**: Defines the schema of Booking table used to store all the bookings.
- **Restaurant_Owner**: Defines the schema of Restaurant_Owner table used to store all the relation of restaurant and its owners.
- **Restaurant**: Defines the schema of Restaurant table used to store all the Restaurants.
- **User_**: Defines the schema of User table used to store all the Users.


### `utils/`

Contains Express routers for user-related and admin-related routes:

- **token**: Handles verification, generation functionality for authentication.


### `routes/`

Contains Express routers for user-related and admin-related routes:

- **userRoutes**: Handles `/user` routes for user-related actions.
- **adminRoutes**: Handles `/admin` routes for admin-related actions.


## Routes

### Base Route

- **GET /** - Verifies that the server is running by returning a 'working' message.

### User Routes (`/user`)

All user-related routes are prefixed with `/user`.

```javascript
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);
```

### Admin Routes (`/admin`)

All admin-related routes are prefixed with `/admin`.

```javascript
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);
```

## Static Files

The application serves static image files from the `public/images/restaurant` directory:

```javascript
app.use('/image', express.static('./public/images/restaurant'));
```

Access images at `http://localhost:5000/image/restaurant_name`.

## Database

This application uses Sequelize for ORM. Ensure your database credentials are correctly configured in the `.env` file. The application will automatically synchronize the database schema.

## Environment Variables

### Database Configuration

- **DB_NAME**: The name of your database.
- **DB_USER**: The username for database access.
- **DB_PASSWORD**: The password for database access.

### JWT Authentication

- **SECRET_KEY**: Secret key used to sign JWT tokens for user sessions.

### Admin Authentication

- **ADMIN_KEY**: Secret key specific to admin users for additional security.

