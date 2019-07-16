**@About:**  
 This is the backend part of the system.  
 Frontend is located at https://github.com/tonykieling/usersys-frontend.

 Usersys Control is project will handle with actions related to the user, such as:

#### Normal User  
 1. Register
 2. Login / Logout
 3. Change user's Data, password and picture  
 
#### Admin User
 1. Register
 2. Login / Logout
 3. Change Admin's Data, password and picture
 4. List users
 5. Grant / Seize Admin permission to other users
 6. Change users' Data and password
 7. Check logs created by the users actions
  
  
 **@How to install:**  
*p.s. After running the steps below, please go to https://github.com/tonykieling/usersys-frontend and install the frontend part.*  

 1. Within a directory called 'usersys', run  
 `# git clone git@github.com:tonykieling/usersys-backend.git`
 2. `# npm i`  
 3. Database (postgres) needs a role, a database and a password equal to 'usersys'. The commands to have those things:  
`$ psql`  
`# CREATE ROLE usersys WITH LOGIN PASSWORD 'usersys';`  
`# ALTER ROLE usersys CREATEDB;`  
`# <logout>`  
`$ psql -d postgres -U usersys`  
`# CREATE DATABASE usersys;`  
 4. Create the tables and populate them by using knex:  
`# knex migrate:latest   // creates the tables`  
`# knex seed:run   // starts populating the tables`  
The actions above is gonna create the database structure and gives some users and starts populating logs table, as well.  
For example, the user bob@email.com, password 'bob' is admin and kiko@email.com/'kiko' is a normal one.  

 5. `# node server.js`  

 *p.s. back-end structure files is supossed to be placed in a directory called 'usersys-backend', which should be inside 'usersys'.*  
*i.e. **'any_user_place/usersys/usersys-backend'***

 
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