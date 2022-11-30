const mongoose = require('mongoose');
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

app.listen(port, () => {
  console.log(`App runing on port ${port}...`);
});
