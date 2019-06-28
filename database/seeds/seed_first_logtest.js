const event = require('../tools/eventType.js');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('logs').del()
    .then(function () {
      // Inserts seed entries
      return knex('logs').insert([
        {
          event: event.create_user_success,
          userid: 1
        },
        {
          event: event.create_user_success,
          userid: 2
        },

        {
          event: event.create_user_success,
          userid: 3
        },
        {
          event: event.create_user_success,
          userid: 4
        },
        {
          event: event.create_user_success,
          userid: 5
        },
        {
          event: event.create_user_success,
          userid: 6
        },
        {
          event: event.create_user_success,
          userid: 7
        },
        {
          event: event.create_user_success,
          userid: 8
        },
        {
          event: event.create_user_success,
          userid: 9
        },
        {
          event: event.create_user_success,
          userid: 10
        },
        {
          event: event.create_user_success,
          userid: 11
        }
      ]);
    });
};

// knex.schema.createTable('logs', table => {
//   table.increments('id').primary();
//   table.string('event', 70);
//   table.string('userid', 60);
//   table.timestamp('created_at').defaultTo(knex.fn.now());