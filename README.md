# WTWR (What to Wear?): Back End

## Description

This project is a web application designed to manage a collection of clothing items and user profiles. It allows users to perform various operations, including creating, retrieving, updating, and deleting clothing items and user profiles. Users can also like and unlike clothing items, enabling them to express their preferences.

The subdomain for this project can be accessed at [https://www.wtwr2.twilightparadox.com](https://www.wtwr2.twilightparadox.com) or [https://wtwr2.twilightparadox.com](https://wtwr2.twilightparadox.com).

### Functionality

- #### User Management:

  - Create a new user profile.
  - Retrieve all user profiles or a specific user by ID.

- #### Clothing Item Management:

  - Create a new clothing item.
  - Retrieve all clothing items or a specific item by ID.
  - Update clothing items to add or remove likes.
  - Delete clothing items from the collection.
  - **Likes Feature:** Users can like and unlike clothing items, and the application ensures that a user can like an item only once.

## Technologies and Techniques Used

- **Node.js:** The backend of the application is built using Node.js, which allows for server-side JavaScript execution.

- **Express:** This web framework for Node.js simplifies the creation of robust APIs and server applications.

- **MongoDB:** A NoSQL database used to store user profiles and clothing items. It provides flexibility in data storage and allows for easy retrieval of complex data structures.

- **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js, which provides a schema-based solution to model application data.

- **Postman:** Used for testing API endpoints during development, allowing for the simulation of various request types and checking responses.

- **Nodemon:** A development tool that automatically restarts the server when file changes are detected, making the development process more efficient.

- **Middleware:** Custom middleware functions for handling requests, validation, and error management, ensuring that the application is robust and user-friendly.

## Running the Project

To get started with the project, clone the repository and run the following commands:

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Contributing

Contributions are welcome! If you have suggestions or improvements, please open an issue or submit a pull request.
