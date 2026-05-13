/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("orders", (table) => {
        table.uuid("id").primary();

        table
            .uuid("customer_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")

        table
            .uuid("shop_id")
            .notNullable()
            .references("id")
            .inTable("shops")
            .onDelete("CASCADE")

        table.decimal("total_amount", 10, 2).notNullable();
        table.string("delivery_address").notNullable();
        table.decimal("latitude", 10, 8).nullable();
        table.decimal("longitude", 11, 8).nullable();

        table.enum("payment_method", [
            "cod",
            "online"
        ]).defaultTo("online");

        table.enum("payment_status", [
            "pending",
            "paid",
            "failed"
        ]).defaultTo("pending");

        table.enum("order_status", [
            "pending",
            "approved",
            "packed",
            "out_for_delivery",
            "delivered",
            "cancelled",
            "rejected"
        ]).defaultTo("pending");

        table.date("pickup_date").nullable();
        table.string("pickup_start_time").nullable();

        table.timestamps(true, true);

    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("orders")
}
