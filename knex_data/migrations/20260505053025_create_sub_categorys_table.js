/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("sub_categorys", (table)=>{
    table.uuid("id").primary();

    table
    .uuid("category_id")
    .notNullable()
    .references("id")
    .inTable("categorys")
    .onDelete("CASCADE");
    
    table.string("name").nullable();
    table.string("image").nullable();
    table.enum("status",["active", "inactive"]).notNullable().defaultTo("active");
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("sub_categorys");
}
