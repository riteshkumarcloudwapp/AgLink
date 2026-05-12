/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("order_items", (table)=>{
    table.uuid("id").primary();
    
    table
    .uuid("order_id")
    .notNullable()
    .references("id")
    .inTable("orders")
    .onDelete("CASCADE")

    table
    .uuid("product_id")
    .notNullable()
    .references("id")
    .inTable("products")
    .onDelete("CASCADE")

    table.integer("qty").notNullable();

    table.decimal("price",10,2).notNullable();

    table.decimal("sub_total",10,2).notNullable();

    table.timestamps(true, true);
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("order_items");
}



/*
A customer places:

1 order

Inside that order:

2 kg Potato
1 Tomato
3 Onion

So:

orders = overall order information
order_items = products inside that order  

*/