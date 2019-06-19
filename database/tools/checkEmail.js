const Pool = require('pg').Pool;
const eventType = require('./eventType.js');

const pool = new Pool({
  user: 'usersys',
  host: 'localhost',
  database: 'usersys',
  password: 'usersys',
  port: 5432,
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
