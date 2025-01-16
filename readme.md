# Portfolio Back-End

This is the back-end for a portfolio application. It is built using Node.js, Express, TypeScript, and MongoDB. The application supports user authentication, job examples, media collections, and contact forms.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Localization](#localization)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/portfolio-back.git
   cd portfolio-back
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Compile the TypeScript code:

   ```sh
   npm run build
   ```

## Environment Variables

Create a .env file in the root directory and add the following environment variables:

```sh
PORT=3000
DEBUG=portfolio-back:*
DATABASE_URI=Your MongoDB URI
JWT_SECRET=your secret password
```

## Scripts

- npm start: Start the application in production mode.
- npm run dev: Start the application in development mode with nodemon.
- npm run build: Compile the TypeScript code.
- npm run prod: Build and start the application in production mode.
- npm run initDB: Initialize the database with sample data.
- npm run thumb-req: Start the thumbnail request service.
- npm run thumb-res: Start the thumbnail response service.
- npm run dev-thumb-req: Start the thumbnail request service in development mode with nodemon.
- npm run dev-thumb-res: Start the thumbnail response service in development mode with nodemon.

## Folder Structure

```sh
.env
.env example
.gitignore
.vscode/
    launch.json
env.d.ts
nodemon-requesters-responders.json
nodemon-server.json
package.json
public/
    stylesheets/
        style.css
readme.md
src/
    app.ts
    auth/
        AuthController.ts
    bin/
        package.json
        www.ts
    controllers/
        AudiosCollectionController.ts
        BaseController.ts
        ContactFormController.ts
        ...
    initDB/
        ...
    lib/
    locales/
    middlewares/
    models/
    register.ts
    routes/
    services/
    types/
    utils/
    views/
tsconfig.json
uploads/
    audio/
    image/
    video/
```

# API Endpoints

## Authentication

- POST /api/session: Login a user.

## Users

- POST /api/users: Create a new user.
- GET /api/users: Get a list of users.
- PUT /api/users/:id: Update a user.
- DELETE /api/users/:id: Delete a user.

## Job Examples

- POST /api/job-examples: Create a new job example.
- GET /api/job-examples: Get a list of job examples.
- GET /api/job-examples/:id: Get a specific job example.
- PUT /api/job-examples/:id: Update a job example.
- DELETE /api/job-examples/:id: Delete a job example.

## Media Collections

- PUT /api/pictures-collection/:id: Update a pictures collection.
- PUT /api/videos-collection/:id: Update a videos collection.
- PUT /api/audios-collection/:id: Update an audios collection.

## Contact Forms

- POST /api/contact: Create a new contact form message.
- GET /api/contact: Get a list of contact form messages.
- GET /api/contact/:id: Get a specific contact form message.
- PUT /api/contact/:id: Update a contact form message.
- DELETE /api/contact/:id: Delete a contact form message.

## Versions

- PUT /api/version/:id: Update (localize) a version.

## Error Handling

The application uses a custom error handling mechanism. Errors are returned in the following format:

```json
{
  "state": "error",
  "message": "Error message",
  "code": 500
}
```

# Localization

The application supports multiple languages. The supported languages are defined in the src\locales\ directory. The default language is English.

To add a new language, create a new JSON file in the src\locales\ directory and add the translations.

# License

This project is licensed under the MIT License.
