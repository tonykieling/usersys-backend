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
          email: "bob@email.com",
          password: bcrypt.hashSync("sue", 10),
          user_admin: true,
          user_active: false
        }
      ]);
    });
};
