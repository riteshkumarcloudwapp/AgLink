/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

import { randomUUID } from "crypto";

export async function seed(knex) {

  // Deletes ALL existing entries
  await knex("delivery_boys").del();

  // Inserts seed entries
  await knex("delivery_boys").insert([
    {
      id: randomUUID(),
      name: "Rahul Sharma",
      country_code: "+91",
      phone: "9876543210",
      profile_image: "uploads/delivery-boys/rahul.png",
      address: "Ahmedabad, Gujarat",
      latitude: 23.022505,
      longitude: 72.5713621,
      vehicle_name: "Honda Shine",
      vehicle_number: "GJ01AB1234",
      status: "available",
      created_at: new Date(),
      updated_at: new Date()
    },

    {
      id: randomUUID(),
      name: "Amit Patel",
      country_code: "+91",
      phone: "9999999999",
      profile_image: "uploads/delivery-boys/amit.png",
      address: "Naranpura, Ahmedabad",
      latitude: 23.0451,
      longitude: 72.5298,
      vehicle_name: "TVS Jupiter",
      vehicle_number: "GJ01CD5678",
      status: "available",
      created_at: new Date(),
      updated_at: new Date()
    },

    {
      id: randomUUID(),
      name: "Vikram Singh",
      country_code: "+91",
      phone: "8888888888",
      profile_image: "uploads/delivery-boys/vikram.png",
      address: "Satellite, Ahmedabad",
      latitude: 23.0272,
      longitude: 72.5067,
      vehicle_name: "Bajaj Pulsar",
      vehicle_number: "GJ01EF9012",
      status: "unavailable",
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}