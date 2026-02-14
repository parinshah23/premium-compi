const { exec } = require('child_process');
const path = require('path');

const seeds = [
    'users.seed.ts',
    'competitions.seed.ts',
    'content.seed.ts'
];

async function runSeed(file) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, '../database/seeds', file);
        console.log(`Running seed: ${file}`);

        // Use npx ts-node to execute the typescript seed file
        // inheriting stdio to see output in real-time
        const child = exec(`npx ts-node "${filePath}"`, {
            cwd: path.join(__dirname, '..'), // Run from backend root
            env: { ...process.env, PATH: process.env.PATH }
        });

        child.stdout.on('data', (data) => console.log(data.toString()));
        child.stderr.on('data', (data) => console.error(data.toString()));

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`Completed: ${file}`);
                resolve();
            } else {
                reject(new Error(`Seed ${file} failed with code ${code}`));
            }
        });
    });
}

async function main() {
    try {
        for (const seed of seeds) {
            await runSeed(seed);
        }
        console.log('All seeds executed successfully');
    } catch (err) {
        console.error('Seeding process failed:', err);
        process.exit(1);
    }
}

main();
