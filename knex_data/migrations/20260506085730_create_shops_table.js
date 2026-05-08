/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("shops", (table)=>{
    table.uuid("id").primary();

    table
    .uuid("seller_id")
    .notNullable()
    .references("id")
    .inTable("users")
    .onDelete("CASCADE")

    table.string("shop_name").nullable();
    table.string("shop_keeper_name").nullable();
    table.string("image").nullable();
    table.string("email").nullable();
    table.string("phone").nullable();
    table.string("address").nullable();
    table.decimal('latitude', 10, 8).nullable();
    table.decimal('longitude', 11, 8).nullable();
    table.enum('status', ["Approved", "Pending", "Rejected"]).defaultTo("Pending");
    table.string("rejected_reason").nullable();
    table.timestamps(true, true);
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("shops");
}
