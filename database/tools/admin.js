const Pool = require('pg').Pool;
const eventType = require('./eventType.js');
const { recordLog } = require('./crudLogs.js');
const checkEmail = require('./checkEmail.js');

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
  grantAdmin = async (request, response) => {

    // Steps / Sub-functions
    // ============================================================================
    // 1. checkEmail > checks if user to be granted exists
    // 2. login > checks if admin password is valid to authorize the modification
    // 3. grant > changes the user type to ADMIN

    console.log("inside GRANT", request.body)
    const { user, admin, password } = request.body;
    // const receivedUser = request.body;

    // 1. checkEmail > checks if user to be granted exists
    // ===============================================================
    const userJSON = await checkUserByEmail(user);
    console.log('after check USER email > ', userJSON)
    let userReady = false;
    // verifies if MESSAGE attribute is inside the response object
    // if there is a message than return ERROR MESSAGE
    if ( 'message' in userJSON){
      // const event = eventType.create_user_fail;
      // recordLog(userJSON.id, event);
      console.log("1) something wrong with update");
      // response.send({message: "Error - UPDATE"});
      response.send(userJSON);

    } else{
      // user is present in the DATABASE > continue next step

        // 2. login > checks if admin password is valid to authorize the modification
        // ===============================================================
          const adminData = { email : admin, password : password }
          // console.log('adminData ',adminData)
          const adminJSON = await userQuery(adminData);
          console.log('adminJSON ',adminJSON)
          if ( 'message' in adminJSON){
            // ADMIN WRONG PASSWORD - return error message
            console.log("2) something wrong with update");
            console.log(">>>>",adminJSON.message)
            response.send(adminJSON);
          }
          else{
          // ADMIN PASSWORD OK > continue next step
              //console.log('start QUERY', userJSON);

              // 3. grant > changes the user type to ADMIN
              pool.query(
                'UPDATE users SET user_admin = $1 WHERE id = $2 RETURNING id, email, name, user_active, user_admin',
                [true, userJSON.id],
                (error, result) => {
                try {
                  if (error) {
                    console.log(`updateUser error = ${error.message}`);
                    throw error;
                  }
                  // console.log("result.rows >>", result)
                  // const event = eventType.update_user_success;
                  const updatedUser = result.rows[0];
                  // recordLog(user.id, event);
                  response.send(updatedUser);
                  return;
                } catch (err) {
                  // const event = eventType.create_user_fail;
                  // recordLog(null, event);
                  // console.log("updateUser error: ", err.message);
                  response.send({message: "Something BAD has happened! Try it again."});
                  return;
                }
              });   // END OF POOL

            } // END OF ELSE > admin pass OK

          }  // END OF ELSE > user EXISTS in DB

  }


module.exports = {
   grantAdmin,
   evenTypesGet,
   searchEmail,
   searchEvent
 };
