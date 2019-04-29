const randomID = require('../tools/randomGen.js');

// const user = { 
//   id: {
//     id: "",
//     name: "",
//     email: "",
//     password: "",
//     user_admin: false
//   }
// };

const num1 = randomID();
const num2 = randomID();
const num3 = randomID();

const user = [
  {
    id: num1,
    name: "Bob",
    email: "bob@email",
    password: "bobpasswd",
    user_admin: false
  },

  {
    id: num2,
    name: "Tony",
    email: "tony@email",
    password: "TonyP@$$",
    user_admin: true
  },

  {
    id: num3,
    name: "Sue",
    email: "sue@email",
    password: "passSUE",
    user_admin: false
  }
];

module.exports = user;

// 1- User
// id: number
// name: number
// email: string
// password: string
// user_admin: boolean
