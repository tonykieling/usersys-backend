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
          user_active: true,
          picture_name: "defaultPicture.jpg"
        },
        {
          name: 'Sue S.',
          email: "sue@email.com",
          password: bcrypt.hashSync("sue", 10),
          user_admin: false,
          user_active: true,
          picture_name: "defaultPicture.jpg"
        },
        {
          name: 'Jon',
          email: "jon@email.com",
          password: bcrypt.hashSync("jon", 10),
          user_admin: false,
          user_active: true,
          picture_name: "defaultPicture.jpg"
        },
        {
          name: 'Bet',
          email: "bet@email.com",
          password: bcrypt.hashSync("bet", 10),
          user_admin: true,
          user_active: true,
          picture_name: "defaultPicture.jpg"
        },
        {
          name: 'Nhonho',
          email: "nhonho@email.com",
          password: bcrypt.hashSync("nhonho", 10),
          user_admin: false,
          user_active: true,
          picture_name: "defaultPicture.jpg"
        },
        {
          name: 'Kiko',
          email: "kiko@email.com",
          password: bcrypt.hashSync("kiko", 10),
          user_admin: false,
          user_active: true,
          picture_name: "defaultPicture.jpg"
        },
        {
          name: '71 Witch',
          email: "witch71@email.com",
          password: bcrypt.hashSync("witch71", 10),
          user_admin: false,
          user_active: true,
          picture_name: "defaultPicture.jpg"
        },
        {
          name: 'Chaves',
          email: "chaves@email.com",
          password: bcrypt.hashSync("chaves", 10),
          user_admin: true,
          user_active: true,
          picture_name: "defaultPicture.jpg"
        },
        {
          name: 'Chapolin Colorado',
          email: "chapolin@email.com",
          password: bcrypt.hashSync("chapolin", 10),
          user_admin: true,
          user_active: true,
          picture_name: "defaultPicture.jpg"
        },
        {
          name: 'Chiquinha',
          email: "chiquinha@email.com",
          password: bcrypt.hashSync("chiquinha", 10),
          user_admin: false,
          user_active: true,
          picture_name: "defaultPicture.jpg"
        },
        {
          name: 'Sir Madruga',
          email: "madruga@email.com",
          password: bcrypt.hashSync("madruga", 10),
          user_admin: true,
          user_active: true,
          picture_name: "defaultPicture.jpg"
        }
      ]);
    });
};
