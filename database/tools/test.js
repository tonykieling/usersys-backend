const fetch = require('node-fetch');

var url = 'http://0.0.0.0:3333/user/new';
var data = {email: 'tao@email.com', password: 'tao', name: "TAO"};

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