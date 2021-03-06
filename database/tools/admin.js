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
  searchEmail = async (request, response) => {

    console.log("inside SEARCHEMAIL", request.body);
    const { email } = request.body;

    return new Promise((result, reject) => {
      pool.query('SELECT * FROM logs WHERE userid = $1', [email], (error, result) => {
        try {
              if (error) {
                  console.log("1) SEARCH by EMAIL > with ERROR");
                  throw error;
              }
              if (result.rowCount > 0) {
                  console.log("2) SEARCH by EMAIL ", result.rows);
                  response.send(result.rows);
              } else {
                  response.send({message: `3) SEARCH by EMAIL - NO user to ${email}!`});
              }
        } catch (err) {
              console.log("4) SEARCH by EMAIL error: ", err.message);
              reject.send({message: "Something BAD has happened! Try it again."});
        }
      });
    });
  }

  // Search LOG tables based on DATE
  // ============================================================
  searchDate = async (request, response) => {

    console.log("inside DATE EMAIL", request.body);
    const { start, end } = request.body;

    return new Promise((result, reject) => {
      // SELECT * FROM logs WHERE created_at between '2019-06-28 00:00' and '2019-06-28 23:59';
      //pool.query('SELECT * FROM logs WHERE created_at = $1', [date], (error, result) => {
      pool.query('SELECT * FROM logs WHERE created_at between $1 and $2', [start, end], (error, result) => {
        try {
              if (error) {
                  console.log("1) SEARCH by DATE > with ERROR");
                  throw error;
              }
              if (result.rowCount > 0) {
                  console.log("2) SEARCH by DATE ", result.rows);
                  response.send(result.rows);
              } else {
                  response.send({message: `3) SEARCH by DATE - NO user logs for dates between ${start} and ${end}!`});
              }
        } catch (err) {
              console.log("4) SEARCH by DATE error: ", err.message);
              reject.send({message: "Something BAD has happened! Try it again."});
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
        response.send({message: "User has already had the required permission"});
        return;
      }
  // verifies if MESSAGE attribute is inside the response object
  // if there is a message than return ERROR MESSAGE
  if ( 'message' in checkedUser){
    console.log("1) something wrong with update");
    response.send({message: "Something wrong with this user's email. Try it again."});
    return;
  } else {
      // 2. login > checks if admin password is valid to authorize the modification
      // ===============================================================
      const checkAdmin = await userQuery({email: adminEmail, password: adminPassword});
      if (('message' in checkAdmin) || (!checkAdmin.userAdmin)){
        const event = eventType.changePermission_fail;
        recordLog(adminEmail, event);
        response.send({message: "Admin's password with problem. Try it again."});
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
  const data = request.body;
  console.log("data:", data);
  let dataQuery = "";
  if (!data.userType) {
    const userParam = (data.user) ?
      ` WHERE name = '${data.user}' OR email = '${data.user}' OR name LIKE '%${data.user}%' OR email LIKE '%${data.user}%'` :
      "";
    dataQuery = `SELECT id, name, email, picture_name, user_active, user_admin FROM users ${userParam} ORDER BY id`;
  } else {
    let typeParam = "";
    if (data.userType === "admin")
      typeParam = "WHERE user_admin = 'true'";
    else
      typeParam = "WHERE user_admin = 'false'";
    const userParam = (data.user) ?
      ` AND (name = '${data.user}' OR email = '${data.user}' OR name LIKE '%${data.user}%' OR email LIKE '%${data.user}%')` :
      "";
    dataQuery = `SELECT id, name, email, picture_name, user_active, user_admin FROM users ${typeParam} ${userParam} ORDER BY id`;
  }

  pool.query(dataQuery, [], (error, result) => {
    try {
      if (error) {
        throw error;
      }
      if (result.rowCount > 0) {
        const event = eventType.listUser_success;
        recordLog(data.userAdmin, event);
        response.send(result.rows);
        return;
      } else {
        const event = eventType.listUser_fail;
        recordLog(data.userAdmin, event);
        response.send({message: `lisUsers - NO users to list`});
      }
    } catch (err) {
      console.log("listuser error: ", err.message);
      const event = eventType.listUser_fail;
      recordLog("system", event);
      response.send({message: "Something BAD has happened! Try it again."});
    }
  });
}

module.exports = {
   evenTypesGet,
   searchEmail,
   searchEvent,
   searchDate,
   changePermission,
   listUsers
 };
