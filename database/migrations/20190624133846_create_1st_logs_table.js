
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('logs', table => {
      table.increments('id').primary();
      table.string('event', 70);
      table.string('userid', 60);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('logs')
  ])
};
