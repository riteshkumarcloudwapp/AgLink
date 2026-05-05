/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("categorys", (table)=>{
    table.uuid("id").primary();
    table.string("name").nullable()
    table.string("icon").nullable();
    table.enum("status",["active", "inactive"]).notNullable().defaultTo("active");
    table.timestamps(true, true); 
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("categorys");
}
