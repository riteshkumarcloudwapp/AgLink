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

        table
            .uuid("delivery_boy_id")
            .nullable()
            .references("id")
            .inTable("delivery_boys")
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
            "rejected",
            "assigned",
            "picked_up"
        ]).defaultTo("pending");

        table.string("preparation_time").nullable();

        table.timestamp("pickup_start_time").nullable();

        table.timestamp("pickup_end_time").nullable();

        table.string("delivery_otp").nullable();

        table.string("delivery_otp_expiry").nullable();

        table.string("otp_verified").defaultTo('0');

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


//we will have 
//order_place_time => it will be current timestamps only
//preparation_time => it will be time in which order will be packed
//pickup_start_time => it will be time in which order will be pickUp  by delivery boy
//pickup_end_time => it will be time pickUp end time