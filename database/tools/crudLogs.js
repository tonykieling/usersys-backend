// const logsDB = require('../db/logsDB.js');
// const randomId = require('./randomGen.js');
// const { getUserId } = require('./crudUser.js');
const Pool = require('pg').Pool;
const eventType = require('./eventType.js');


const pool = new Pool({
  user: 'usersys',
  host: 'localhost',
  database: 'usersys',
  password: 'usersys',
  port: 5432,
});

// record logs basead on the info received
// 
// it doesnt return anything, only records
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


// it gets all logs
// TODO: read logs basead in parameters such as, date/time, specific user
// it receives admin's id
// it returns an object that holds all logs info
allLogs = (request, response) => {
  const user = request.params.id;
  pool.query('SELECT * FROM logs ORDER BY date_time ASC', [], (error, result) => {
    try {
      if (error) {
        console.log("error on getting alllogs method");
        throw error;
      }
      if (result.rowCount > 0) {
        const message = result.rows;
        const event = eventType.read_all_logins_success;
        recordLog(user, event);
        response.send(message);
        return;
      } else {
        const event = eventType.read_all_logins_fail;
        recordLog(user, event);
        response.send({message: "`allLogs - NO logs`"});
        return;
      }
    } catch (err) {
      console.log("allLogs error: ", err.message);
      const event = eventType.read_all_logins_fail;
      recordLog(user, event);
      response.send({message: "Something bad, try it again."});
    }
  });
}



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
