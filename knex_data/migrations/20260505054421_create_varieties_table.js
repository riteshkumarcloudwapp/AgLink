/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("varieties", (table)=>{
    table.uuid("id").primary();
    
    table
    .uuid("sub_category_id")
    .notNullable()
    .references("id")
    .inTable("sub_categorys")
    .onDelete("CASCADE");

    table.string("name").nullable();
    table.string("image").nullable();
    table.enum("status",["active", "inactive"]).notNullable().defaultTo("active");
    table.timestamps(true, true);

  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("varieties");
}
