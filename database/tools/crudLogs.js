const logsDB = require('../db/logsDB.js');
const randomId = require('./randomGen.js');
// const { readByName, getUserId } = require('./crudUser.js');

recordLog = (userId, event) => {
  console.log('Inside LOGS!!!\n user: ', userId, event)
  logsDB.push({
    id: randomId(),
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
  return;
}

displayAllLogs = () => {
  return logsDB;
}

logPerId = (id) => {
//   console.log("id received is " + id);
// console.log(logsDB);
  const result = logsDB.filter(log => id === log.user_id);
  // console.log("result=>", result);
  return result;
}

module.exports = {
  recordLog,
  displayAllLogs,
  logPerId
};
