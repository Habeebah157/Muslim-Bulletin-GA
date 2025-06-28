const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const res = await client.query('SELECT version()');
  console.log(res.rows[0]);
  await client.end();
}

testConnection().catch(console.error);
