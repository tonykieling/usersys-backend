const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'usersys',
  host: 'localhost',
  database: 'usersys',
  password: 'usersys',
  port: 5432,
});

// login method
module.exports = login = (request, response) => {
  console.log("inside login method");
  try {
    const receivedUser = request.body;
    pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', 
      [receivedUser.email, receivedUser.password], (error, result) => {
    // pool.query('SELECT * FROM users', (error, result) => {
      if (error) {
        console.log(`error = ${error}`);
        throw error;
      }

      // console.log(`result = ${JSON.stringify(result)}`);
      if (result.rowCount > 0) {
        response.status(200).send(`Hi ${receivedUser.email}`);
        return;
      } else {
        console.log("result::: ", result.rowCount);
        response.status(400).send("user/password wrong!");
        return;
      }
      })
  } catch (err) {
    console.log(err.message);
    response.send("login was bad, try again, please");
  }
}

// login = (user) => {
//   const userId = (checkPassword(user));
//   if (userId === "NoUser") {
//     recordLog(null, eventType.login_fail);
//     return false;
//   }

//   if (userId.status) {
//     recordLog(userId.id, eventType.login);
//     return true;
//   }

//   recordLog(userId.id, eventType.login_fail);
//   return false;
// }