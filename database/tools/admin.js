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


// Search LOG tables based on EVENT
// ============================================================
searchEvent = async (request, response) => {

  console.log("inside SEARCH EVENT", request.body);
  const { etype } = request.body;

  return new Promise((result, reject) => {
    pool.query('SELECT * FROM logs WHERE event = $1', [etype], (error, result) => {
      try {
        if (error) {
          //recordLog(null, event);
          console.log("1) SEARCH by EVENT > with ERROR");
          throw error;
        }
        if (result.rowCount > 0) {
          console.log("2) SEARCH by EVENT ", result.rows);
          // const { id, name, email, user_admin, user_active } = result.rows[0];
          // const user = { id, name, email, user_admin, user_active };
          // const event = eventType.check_user_email_success;
          // recordLog(user.id, event);
          response.send(result.rows);
        } else {
          // const event = eventType.check_user_email_fail;
          // recordLog(email, event);
          response.send({message: `3) SEARCH by EVENT - NO user to ${etype}!`});
        }
      } catch (err) {
        console.log("4) SEARCH by EVENT error: ", err.message);
        // const event = eventType.check_user_email_fail;
        // recordLog(null, event);
        reject.send({message: "Something BAD has happened! Try it again."});
      }
    });
  });
}

  // Search LOG tables based on EMAIL
  // ============================================================
  searchEmail = async (req, res) => {

    console.log("inside SEARCHEMAIL", request.body);
    const { email } = request.body;

    return new Promise((res, rej) => {
      pool.query('SELECT * FROM logs WHERE email = $1', [email], (error, result) => {
        try {
          if (error) {
            //recordLog(null, event);
            console.log("1) SEARCH by EMAIL > with ERROR");
            throw error;
          }
          if (result.rowCount > 0) {
            console.log("2) SEARCH by EMAIL ", result.rows);
            // const { id, name, email, user_admin, user_active } = result.rows[0];
            // const user = { id, name, email, user_admin, user_active };
            // const event = eventType.check_user_email_success;
            // recordLog(user.id, event);
            res(result.rows);
          } else {
            // const event = eventType.check_user_email_fail;
            // recordLog(email, event);
            res({message: `3) SEARCH by EMAIL - NO user to ${email}!`});
          }
        } catch (err) {
          console.log("4) SEARCH by EMAIL error: ", err.message);
          // const event = eventType.check_user_email_fail;
          // recordLog(null, event);
          rej({message: "Something BAD has happened! Try it again."});
        }
      });
    });
  }

  // Get EVENT TYPES and return to frontend
  // ============================================================
  evenTypesGet = async (request, response) => {

    // console.log('TYPES > ', eventType);
    response.send(eventType);
  }

  // Admin asks to GRANT admin privileges to USER
  // ============================================================



changePermission = async (request, response) => {
  console.log("### inside changePermission");
  
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
  // console.log('after check USER email > checkedUser:', checkedUser, "action: ", action)
  if (((action.toLowerCase() === "grant") && checkedUser.user_admin) ||
      ((action.toLowerCase() === "seize") && (!checkedUser.user_admin))) {
        response.send({message: "User has already have the required permission"});
        return;
      }
  // verifies if MESSAGE attribute is inside the response object
  // if there is a message than return ERROR MESSAGE
  if ( 'message' in checkedUser){
    console.log("1) something wrong with update");
    response.send({message: "Something wrong with Seize Admin's permission. Try it again."});
    return;
  } else {
      // 2. login > checks if admin password is valid to authorize the modification
      // ===============================================================
      const checkAdmin = await userQuery({email: adminEmail, password: adminPassword});
      if (('message' in checkAdmin) || (!checkAdmin.userAdmin)){
        const event = eventType.changePermission_fail;
        recordLog(adminEmail, event);
        response.send({message: "Admin permission with problem. Try it again."});
        return;
      }
      else {
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
        });
      }
    } 
}

listUsers = (request, response) => {
  console.log("### inside listUsers");
  console.log("body", request.body);
  response.send({message: "this is listUsers method"});
}

module.exports = {
   evenTypesGet,
   searchEmail,
   searchEvent,
   changePermission,
   listUsers
 };