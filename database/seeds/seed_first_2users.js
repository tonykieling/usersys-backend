const bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          name: 'Bob B.',
          email: "bob@email.com",
          password: bcrypt.hashSync("bob", 10),
          user_admin: true,
          user_active: true
        },
        {
          name: 'Sue S.',
          email: "sue@email.com",
          password: bcrypt.hashSync("sue", 10),
          user_admin: false,
          user_active: true
        },
        {
          name: 'Jon',
          email: "jon@email.com",
          password: bcrypt.hashSync("jon", 10),
          user_admin: false,
          user_active: true
        },
        {
          name: 'Bet',
          email: "bet@email.com",
          password: bcrypt.hashSync("bet", 10),
          user_admin: true,
          user_active: true
        }
      ]);
    });
};
