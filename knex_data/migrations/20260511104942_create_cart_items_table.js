/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("cart_items", (table) => {

        table.uuid("id").primary();

        table.uuid("customer_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table.uuid("shop_id")
            .notNullable()
            .references("id")
            .inTable("shops")
            .onDelete("CASCADE");

        table
            .uuid("product_id")
            .notNullable()
            .references("id")
            .inTable("products")
            .onDelete("CASCADE");

        table.integer("qty").notNullable();

        table.timestamps(true, true);

    });
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists("cart_items");
}
