/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("delivery_boys", (table)=>{
    table.uuid("id").primary();
    table.string("name").nullable();
    table.string("country_code").nullable();
    table.string("phone").nullable();
    table.string("profile_image").nullable();
    table.string("address").nullable();
    table.decimal("latitude",10,8).nullable();
    table.decimal("longitude",11,8).nullable();
    table.string("vehicle_name").nullable();
    table.string("vehicle_number").nullable();
    table.enum("status", ["available", "unavailable"]).defaultTo("available");
    table.timestamps(true, true);
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("delivery_boys")
}

