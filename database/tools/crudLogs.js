const logsDB = require('../db/logsDB.js');
const randomId = require('./randomGen.js');

recordLog = (userId, event) => {
  console.log('Inside LOGS!!!\n user: ', userId, event)
  logsDB.push({
    id: randomId,
    user_id: userId,
    dt_time: Date.now(),
    event
  });

  // spread operator doen't work for const
  // logsDB = [...logsDB, {
  //   id: randomId,
  //   user_id: userId,
  //   dt_time: Date.now(),
  //   event
  // }]
  console.log(`there is ${logsDB.length} LOG recorded`);
}

module.exports = recordLog;
