const Pool = require('pg').Pool;
const eventType = require('./eventType.js');

// const pool = new Pool({
//   user: 'usersys',
//   host: 'localhost',
//   database: 'usersys',
//   password: 'usersys',
//   port: 5432,
// });
const pool = new Pool({
  user      : 'ibqkjiuxxuqhms',
  host      : 'ec2-54-243-193-59.compute-1.amazonaws.com',
  database  : 'dchkh0dugp1v3a',
  password  : '4a19911831f37df6faf2a6138451c4266df1af9f41cedb7a450ec5ed1f2a4d3f',
  port      : 5432
});

checkUserByEmail = email => {
  console.log("######inside checkuserbyemail", email)
  return new Promise((res, rej) => {
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
      try {
        if (error) {
          recordLog(null, event);
          throw error;
        }
        if (result.rowCount > 0) {
          console.log("checkUserByEmail result===> ", result.rows[0].id);
          const { id, name, email, user_admin, user_active } = result.rows[0];
          const user = { id, name, email, user_admin, user_active };
          const event = eventType.check_user_email_success;
          recordLog(user.id, event);
          res(user);
        } else {
          const event = eventType.check_user_email_fail;
          recordLog(email, event);
          res({message: `checkUserByEmail - NO user to ${email}!`});
        }
      } catch (err) {
        console.log("checkUserByEmail error: ", err.message);
        const event = eventType.check_user_email_fail;
        recordLog(null, event);
        rej({message: "Something BAD has happened! Try it again."});
      }
    });
  });
}


module.exports = checkUserByEmail;
