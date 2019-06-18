const logsDB = require('../db/logsDB.js');
const randomId = require('./randomGen.js');
// const { getUserId } = require('./crudUser.js');
const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'usersys',
  host: 'localhost',
  database: 'usersys',
  password: 'usersys',
  port: 5432,
});

recordLog = (userId, event) => {
  console.log('Inside LOGS!!!\n user: ', userId, event)
  return new Promise((res, rej) => {
    pool.query('INSERT INTO logs (userid, event, date_time) VALUES ($1, $2, to_timestamp($3))', 
    [userId, event, (Date.now() / 1000.0)], (error, result) => {
      try {
        if (error) {
          console.log(`recordLog error = ${error.message}`);
          throw error;
        }
        res("ok");
      } catch (err) {
        // send a message to Admin group
        rej("NOK");
      }
    });
  });
}


allLogs = () => {

}


// displayAllLogs = () => {
//   return logsDB;
// }

// logPerId = (id) => {
//   // getUserId('test')
// //   console.log("id received is " + id);
// // console.log(logsDB);
//   const result = logsDB.filter(log => id === log.user_id);
//   // console.log("result=>", result);
//   return result;
// }

module.exports = {
  recordLog,
  allLogs
};
