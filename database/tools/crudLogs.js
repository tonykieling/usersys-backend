// const logsDB = require('../db/logsDB.js');
// const randomId = require('./randomGen.js');
// const { getUserId } = require('./crudUser.js');
const { Pool } = require('pg');
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



allLogsAndDate = (request, response) => {
  // postman example1: http://0.0.0.0:3333/allLogs/1?date_start=2019-01-01&date_end=2019-06-18
  // postman example: http://0.0.0.0:3333/allLogs/1
  console.log("parameters", request.params)
  const userAdmin = request.params.userAdmin;
  pool.query('SELECT * FROM logs ORDER BY date_time ASC', [], (error, result) => {
    try {
      if (error) {
        console.log("error on getting alllogs method");
        throw error;
      }
      if (result.rowCount > 0) {
        const message = result.rows;
        const event = eventType.read_all_logins_success;
        recordLog(userAdmin, event);
        response.send(message);
        return;
      } else {
        const event = eventType.read_all_logins_fail;
        recordLog(userAdmin, event);
        response.send({message: "`allLogs - NO logs`"});
        return;
      }
    } catch (err) {
      console.log("allLogs error: ", err.message);
      const event = eventType.read_all_logins_fail;
      recordLog(userAdmin, event);
      response.send({message: "Something bad, try it again."});
    }
  });
}

// it gets all logs
// TODO: read logs basead in parameters such as, per date/time, for a specific user, etc
// it receives admin's id, which is gonna record who is performing the query
// it returns an object that holds all logs info
allLogs = (request, response) => {
  // postman example1: http://0.0.0.0:3333/allLogs/1?date_start=2019-01-01&date_end=2019-06-18
  // postman example: http://0.0.0.0:3333/allLogs/1
  const userAdmin = request.params.userAdmin;
  const { date_start, date_end } = request.query;
  handleQuery = (error, result) => {
    try {
      if (error) {
        console.log("error on getting alllogs method");
        throw error;
      }
      if (result.rowCount > 0) {
        const message = result.rows;
        const event = eventType.read_all_logins_success;
        recordLog(userAdmin, event);
        response.send(message);
        return;
      } else {
        const event = eventType.read_all_logins_fail;
        recordLog(userAdmin, event);
        response.send({message: "`allLogs - NO logs`"});
        return;
      }
    } catch (err) {
      console.log("allLogs error: ", err.message);
      const event = eventType.read_all_logins_fail;
      recordLog(userAdmin, event);
      response.send({message: "Something bad, try it again."});
    }
  }
  
  if (date_start) {
    pool.query('SELECT * FROM logs WHERE date_time >= $1 AND date_time <= $2 ORDER BY date_time ASC', [date_start, date_end], (error, result) => {
      handleQuery(error, result);
    });
  } else {
    pool.query('SELECT * FROM logs ORDER BY date_time ASC', [], (error, result) => {
      handleQuery(error, result);
    });
  }
}


//
//
//
logPerUser = (request, response) => {
  const userAdmin = request.params.userAdmin;
  const user = request.query.user;
  console.log("userAdmin", userAdmin)
  console.log("user", user)
  // response.send("OK");
  // return;
  pool.query('SELECT * FROM logs WHERE userid = $1 ORDER BY date_time ASC', [user], (error, result) => {
    try {
      if (error) {
        console.log("error on getting logPerUser method");
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
        response.send({message: "`logPerUser - NO logs`"});
        return;
      }
    } catch (err) {
      console.log("logPerUser error: ", err.message);
      const event = eventType.read_all_logins_fail;
      recordLog(user, event);
      response.send({message: "Something bad, try it again."});
    }
  });
}


module.exports = {
  recordLog,
  allLogs,
  allLogsAndDate,
  logPerUser
};
