const Pool = require('pg').Pool;
const eventType = require('./eventType.js');
const { recordLog } = require('./crudLogs.js');

const pool = new Pool({
  user: 'usersys',
  host: 'localhost',
  database: 'usersys',
  password: 'usersys',
  port: 5432,
});

changePermission = async (request, response) => {
  console.log("inside changePermission, req.body:", request.body);
  
  // Steps / Sub-functions
  // ============================================================================
  // 1. checkEmail > checks if user to be granted exists
  // 2. login > checks if admin password is valid to authorize the modification
  // 3. action > changes the user type to ADMIN or NORMAL
  
  const { user, adminEmail, adminPassword, action } = request.body;
  // if (user === admin) response.send({message: "Admins cannot seize permisson from theirselves"});
  // response.send({message: "returning from seizeADMIN"});
  // return;

  // 1. checkEmail > checks if user to be granted exists
  // ===============================================================
  const checkedUser = await checkUserByEmail(user);
  console.log('after check USER email > ', checkedUser)

  // verifies if MESSAGE attribute is inside the response object
  // if there is a message than return ERROR MESSAGE
  if ( 'message' in checkedUser){
    console.log("1) something wrong with update");
    response.send({message: "Something wrong with Seize Admin's permission. Try it again."});

  } else{
      // 2. login > checks if admin password is valid to authorize the modification
      // ===============================================================
        const checkAdmin = await userQuery({email: adminEmail, password: adminPassword});
        if ( 'message' in checkAdmin){
          // ADMIN WRONG PASSWORD - return error message  // login has already recorded in the userQuery method
          console.log(">>>>", checkAdmin.message);
          response.send(checkAdmin);
        }
        else{
          const adminPermission = (action.toLowerCase() === "seize") ? false : true;
          // 3. grant/seize > changes the user type to ADMIN
          pool.query(
            'UPDATE users SET user_admin = $1 WHERE id = $2 RETURNING id, email, name, user_active, user_admin',
            [adminPermission, checkedUser.id], (error, result) => {
            try {
              if (error) {
                console.log(`updateUser error = ${error.message}`);
                throw error;
              }
              if (adminPassword) {
                const event1 = eventType.grant_admin;
                const event2 = eventType.granted_user;
                recordLog(adminEmail, event1);
                recordLog(user, event2);
              } else {
                const event1 = eventType.seize_admin;
                const event2 = eventType.seized_user;
                recordLog(adminEmail, event1);
                recordLog(user, event2);
              }
              const updatedUser = result.rows[0];
              response.send(updatedUser);
              return;
            } catch (err) {
              const event = eventType.changePermission_fail;
              recordLog("system", event);
              response.send({message: "Something BAD has happened! Try it again."});
              return;
            }
          });   // END OF POOL
        } // END OF ELSE > admin pass OK
      }  // END OF ELSE > user EXISTS in DB
}


module.exports = {
  changePermission
};
