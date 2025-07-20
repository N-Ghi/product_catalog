# Product Catalog API Project

## Assignment Overview

In this assignment, you will build a RESTful API for a Product Catalog System, simulating the backend of an e-commerce platform.
This is a real-world inspired project where you'll apply your knowledge of backend development to manage product listings, categories, inventory, and search functionalities.
Your API should support the full suite of CRUD operations, robust search and filtering, and maintain clean, organized code adhering to RESTful principles.

## Getting started

1. Fork this repository

2. Make sure you have **Node.js** installed on your local machine, if you don't follow this link and install it:

    ```url
    https://nodejs.org/en/download
    ```

3. Navigate to your project directory

    ```bash
    cd <your-directory>
    ```

4. Initialize **Node.js** at the root of your project

    ```bash
    npm init -y
    ```

5. Install all the requirements

    ```bash
    npm i express mongoose dotenv bcryptjs jsonwebtoken swagger-ui-express swagger-jsdoc
    ```

6. Add the appropriate environmental variables to your **.env** file. Follow the **.env.example** file to know what to add

7. You can now run the app in your terminal.

    ```bash
    node app.js
    ```

    **To avoid having to always restart your node server when you make changes, do the following:**

    ```bash
    # Install nodemon locally
    npm install --save-dev nodemon

    # Run the entry script
    npx nodemon app.js
    ```

## Assumptions and Limitations

### Assumptions

This implementation assumes the following:

1. All authenticated users have the same permissions and role.
2. Tokens are secure in of themselves removing the need of further security implementations.
3. An authenticated user will not need to manage their data, such as password changes.
4. There is no need for scaling this system.

### Limitations

1. Due to no RBAC(Role Based Access Control) implementation, some activities like **CRUD of Categories** is not restricted beyond **Authentication**
2. Although the registration and login processes are implemented, there is **no implementation of account management**.
3. The system is not real-world worthy and would be prone to attacks and abuse due to the lack of security measures beyond authentication.
4. The system is not setup for scaling. To scale up, a complete remodel would be needed to account for user roles and their permissions.

## API Documentation

A comprehensive interactive API can be found by navigating to **/api-docs/** after running the project.


## Walkthrough Video

- [Youtube Video](https://youtu.be/yuBkRhhaxHc)
- [Google Drive](https://drive.google.com/file/d/1rD6aBCpiQKWZDWWL6CSaNcZ7JQFujsa0/view?usp=sharing)
