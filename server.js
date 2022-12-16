const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shuting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const dotnev = require('dotenv').config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;
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

const server = app.listen(port, () => {
  console.log(`App runing on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shuting down...');
  server.close(() => {
    process.exit(1);
  });
});
