**@About:**  
 This is the backend part of the system.  
 Frontend is located at https://github.com/tonykieling/usersys-frontend.

 Usersys Control is project will handle with actions related to the user, such as:

#### Normal User  
 1. Register
 2. Login
 3. Logout
 4. Data user change
 
#### Admin User
 1. Register
 2. Login
 3. Logout
 4. Data user change
 5. Grant/Seize Admin permission
 6. Check logs created by the users actions
  
  
 **@How to install:**  
*p.s. These actions are regarding to the server side.  
After running the steps below, please go to https://github.com/tonykieling/usersys-frontend and install the frontend part.*
 1. `# npm i`  
 2. Database (postgres) needs a role, a database and a password equal to 'usersys'. The commands to have those things:  
`# psql`  
`# CREATE ROLE usersys WITH LOGIN PASSWORD 'usersys';`  
`# ALTER ROLE usersys CREATEDB; // it allows the role usersys creates a db`  
`# <logout>`  
`# psql -d postgres -U usersys`  
`# CREATE DATABASE usersys;`  
 3. Create the tables and populate them by using knex:  
`# knex migrate:latest   // creates the tables`  
`# knex seed:run   // starts populating the tables`  
The actions above is gonna create the database structure and gives some users and starts populating logs table, as well.  
For example, the user bob@email.com, password 'bob' is admin and kiko@email.com/'kiko' is a normal one.  

 *p.s. back-end structure files is supossed to be placed in a directory called `usersys-backend`, which should be inside `usersys`.  
i.e. **'any_user_place/usersys/usersys-backend'** *

 4. `# node server.js`  
 
**@Dependencies**
1. express  
2. bcrypt  
3. body-parser  
4. cors  
5. dotenv  
6. knex  
7. multer  
8. node-fetch  
9. pg