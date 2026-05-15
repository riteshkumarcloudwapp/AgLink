/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("products", (table)=>{
    table.uuid("id").primary();

    table
    .uuid("seller_id")
    .notNullable()
    .references("id")
    .inTable("users")
    .onDelete("CASCADE");

     table
      .uuid("shop_id")
      .references("id")
      .inTable("shops")
      .onDelete("CASCADE");

    table           
    .uuid("category_id")
    .notNullable()
    .references("id")
    .inTable("categorys")
    .onDelete("CASCADE");

    table
    .uuid("sub_category_id")
    .notNullable()
    .references("id")
    .inTable("sub_categorys")
    .onDelete("CASCADE");

    table
    .uuid("varieties_id")
    .notNullable()
    .references("id")
    .inTable("varieties")
    .onDelete("CASCADE");

    table.decimal("price", 10, 2).nullable();
    table.integer("stock_qty").defaultTo(0);
    table.string("unit").notNullable(); // kg, piece, liter
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
