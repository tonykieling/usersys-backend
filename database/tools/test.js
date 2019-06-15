const fetch = require('node-fetch');
console.log(process.argv[2]);
let url = "", data ="";

if (process.argv[2] === "1") {
  url = 'http://0.0.0.0:3333/user/new';
  data = {email: 'tao@email.com', password: 'tao', name: "TAO"};
} else if (process.argv[2] === "2") {
  url = 'http://0.0.0.0:3333/';
  data = {email: 'tao@email.com', password: 'tao', name: "TAO"};
} else if (process.argv[2] === "3") {
  url = 'http://0.0.0.0:3333/';
  data = {email: 'bob@email.com', password: 'tao', name: "TAO"};
}

fetch(url, {
  method: 'POST', // or 'PUT'
  body: JSON.stringify(data), // data can be `string` or {object}!
  headers:{
    'Content-Type': 'application/json'
  }
  })
  .then(res => res.json())
  // .then(response => console.log('### Success:', JSON.stringify(response)))
  .then(console.log)
  .catch(error => console.error('### Error:', error));