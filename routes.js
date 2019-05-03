

// it gets all users from the db
app.get('/users', (req, res) => {
  res.send(readAllUsers());
});


// another way to get data, using res.json
app.get('/users.json', (req, res) => {
  res.json(user) //it's not working due there is no access to userDB, only crudUSer
});


// it creates the user account
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.post('/users/new', (req, res) => {
console.log('inside user-create')  
  const { name, email, password} = req.body;
  if (!name || !email || !password) {
    res.status(400).send("There is something wrong with the arguments!");
    return;
  }
  const result = createUser({ name: `${name}`, email: `${email}`, password: `${password}` });
  res.send(result);
});


// it gets the user by their name
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.get('/users/name/:name', (req, res) => {
  const name = req.params.name
  const result = searchByName(name);
  if (!result) {
    res.status(400).send(`User ${name} does NOT exist`);
    return;
  }
  res.send(result);
});


// it gets the user by their email
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.get('/users/email/:email', (req, res) => {
  const email = req.params.email
  const result = searchByEmail(email);

  if (!result) {
    res.status(400).send(`User ${email} does NOT exist`);
    return;
  }

  res.send(result);
});


// it updates the user info, only name or email for now
// in this route the app HAVE to receive name as params
// and the data to change in the body
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.put('/users/:name', (req, res) => {
  const userId = req.params.name;
  const { name, email } = req.body;
  const result = updateUser({ userId, user: { name, email } });

  result.status ?
    res.send(result.message) :
    res.status(400).send(result.message);

  // res.json(result); // it can return an whole object
});


// it deletes the user
// in this route the app HAVE to receive name as params
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.delete('/users/:name', (req, res) => {
  const userId = req.params.name;

  const result = deleteUser(userId);

  result.status ?
    res.send(result.message) :
    res.status(400).send(result.message);
});


// check all logs
app.get('/logs', (req, res) => {
  console.log('checking all logs');
  // res.json(logs);
  res.json(displayAllLogs());
})


// get all logs
app.get('/showLogs', (req, res) => {
  res.json()
})


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// get the user's logs
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.get('/logs/name/:name', (req, res) => {
// console.log("name is " + req.params.name)  
  const userId = (getUserId(req.params.name));
  // console.log(logPerId(userId));
  res.send(logPerId(userId));
})

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// login's route
app.post('/login', (req, res) => {
  console.log("login: ", req.body)
  if (login(req.body)) {
    req.session.userId = req.body.email;
    res.send("login is OK");
    return;
  }
  
  res.status(400).send("Wrong use/password!");
})


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// logout's route
app.post('/logout', (req, res) => {
  console.log('logout: ', req.body);
  req.session[req.body.email] = null;
  res.send(logout(req.body.email))
});
