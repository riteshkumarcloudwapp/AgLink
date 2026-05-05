/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("users", (table)=>{
    table.uuid("id").primary();
    table.string("first_name").nullable();
    table.string("last_name").nullable();
    table.string("email").nullable();
    table.string("country_code").nullable();
    table.string("phone_number").nullable();
    table.string("password").nullable();
    table.text("profile_image").nullable();
    table.string("address").nullable();
    table.decimal('latitude', 10, 8).nullable();
    table.decimal('longitude', 11, 8).nullable();
    table.enum("role", ["admin", "customer", "seller"]).defaultTo("customer");
    table.decimal("rating", 2, 1).defaultTo(0);
    table.string("otp").defaultTo(null);
    table.string("expiry_time").defaultTo(null);
    table.string("last_sent_at").defaultTo(null);
    table.boolean("is_verified").defaultTo(false);
    table.enum("status", ["block", "unblock"]).defaultTo("unblock");
    table.timestamps(true, true); 
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
   return knex.schema.dropTable("users");
}
