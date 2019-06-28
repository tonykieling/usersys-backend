
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('name', 60);
      table.string('password', 60);
      table.string('email', 60);
      table.boolean('user_active').notNullable();
      table.boolean('user_admin').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      // table.timestamps();    //do not need it now
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users')
  ])  
};
