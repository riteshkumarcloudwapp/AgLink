/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("products", (table)=>{
    table.uuid("id").primary();

    table
    .uuid("varieties_id")
    .notNullable()
    .references("id")
    .inTable("varieties")
    .onDelete("CASCADE");

    table.decimal("price", 10, 2).nullable();
    table.string("unit").notNullable(); // kg, piece, liter
    table.integer("stock_qty").defaultTo(0);
    table.enum("status",["active", "inactive"]).notNullable().defaultTo("active");
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("products");
}
