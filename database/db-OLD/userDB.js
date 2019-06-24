const randomID = require('../tools/randomGen.js');
const bcrypt = require('bcrypt');

const num1 = randomID();
const num2 = randomID();
const num3 = randomID();

const user = {
  [num1]: {
    id: num1,
    name: "Bob",
    email: "bob@email",
    // password: "bobpasswd",
    password: bcrypt.hashSync("bob", 10),
    deleted: false,
    user_admin: false
  },

  [num2]: {
    id: num2,
    name: "Tony",
    email: "tony@email",
    // password: "TonyP@$$",
    password: bcrypt.hashSync("tony", 10),
    deleted: false,
    user_admin: true
  },

  [num3]: {
    id: num3,
    name: "Sue",
    email: "sue@email",
    // password: "passSUE",
    password: bcrypt.hashSync("sue", 10),
    deleted: false,
    user_admin: false
  }
};

module.exports = user;
