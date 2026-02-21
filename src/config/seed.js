const Product = require('../models/Product');

const seedProducts = [
  { name: "Quantum Laptop", price: 2500, category: "Electronics", sku: "LP-99", stock: 10, description: "Next-gen computing" },
  { name: "Ergonomic Chair", price: 350, category: "Office", sku: "CH-01", stock: 25, description: "All-day comfort" },
  { name: "Noise-Cancelling Headphones", price: 299, category: "Audio", sku: "HD-55", stock: 40, description: "Pure silence" },
  { name: "4K Monitor", price: 450, category: "Electronics", sku: "MN-4K", stock: 15, description: "Crystal clear" },
  { name: "Mechanical Keyboard", price: 150, category: "Peripherals", sku: "KB-RGB", stock: 30, description: "Clicky blue switches" },
  { name: "Wireless Mouse", price: 80, category: "Peripherals", sku: "MS-WL", stock: 50, description: "High precision" },
  { name: "USB-C Hub", price: 60, category: "Accessories", sku: "HB-7IN1", stock: 100, description: "Multi-port adapter" },
  { name: "Smart Watch", price: 200, category: "Wearables", sku: "SW-V2", stock: 20, description: "Fitness tracker" },
  { name: "Desk Lamp", price: 45, category: "Office", sku: "DL-LED", stock: 60, description: "Eye-care lighting" },
  { name: "External SSD 1TB", price: 120, category: "Storage", sku: "SD-1TB", stock: 35, description: "Fast data transfer" }
];

const runSeeder = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(seedProducts);
      console.log("🌱 Database seeded with 10 products.");
    }
  } catch (error) {
    console.error("Seeding error:", error);
  }
};

module.exports = runSeeder;