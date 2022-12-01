const fs = require('fs');
const mongoose = require('mongoose');
const dotnev = require('dotenv').config({ path: './config.env' });
const Tour = require('../../models/tourModel');

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

main().catch((err) => console.log(err));

async function main() {
  mongoose
    .connect(db)
    .then((connection) => console.log('DB connection successuful'));
}

// Read JSON FILE

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// Import data into DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successufully loaded! 🙂');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// Delete all data from collection

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successuflly deleted! 💥');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
