About:
 This is the backend part of the system.  
 Frontend is located at https://github.com/tonykieling/user_project-frontend.

 User project will handle with actions related to the user, such as:

- Normal User  
 1. Register
 2. Login
 3. Logout
 4. Data user change
 
 * Steps 1 and 2 will deal with sending email (future)

- Admin User
 1. Register
 2. Login
 3. Logout
 4. Data user change
 5. Grant Admin permission
 6. Check logs created by the users actions

 * All this part of the project is about server side (only backend).

 ToDo:
 1. Check User deleted and apply the behaviour for the rest of the application (create, delete, update)
 2. Develop Sending email for specific actions (create user, update, changing password, etc)
 3. 

 How to use:
 1. npm i
 2. run `node server.js`
 