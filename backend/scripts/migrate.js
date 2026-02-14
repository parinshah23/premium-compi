const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function migrate() {
    try {
        await client.connect();
        console.log('Connected to database');

        const migrationsDir = path.join(__dirname, '../database/migrations');
        const files = fs.readdirSync(migrationsDir)
            .filter(f => f.endsWith('.sql'))
            .sort(); // Ensure order

        for (const file of files) {
            console.log(`Running migration: ${file}`);
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf8');
            await client.query(sql);
            console.log(`Completed: ${file}`);
        }

        console.log('All migrations executed successfully');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

migrate();
