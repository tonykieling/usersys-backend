const userDB = require('../db/userDB.js');

const createUser = () => {
  console.log('inside createUSer');
  return ('OK123');
}

const readAllUsers = () => {
  console.log('inside ALLLLL');
  return (userDB);
}

const readByName = (name) => {
console.log('name is \"', name.trim(), '\"');
  const db = userDB;
  console.log('db: ', db)
  // let result = db.forEach(user => {
  console.log('name: ', db.name);
    // return user.name === name
  // })
  return;
}
  
module.exports = {
  readAllUsers,
  readByName,
  createUser,
}