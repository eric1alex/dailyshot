// cron-runner.js
const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

console.log('🕒 Cron runner started. The script will now run in the background.');
console.log('Waiting for the scheduled time to run the update script...');
console.log('(You can close this window to stop the scheduler.)');

// This schedule runs every 5 minutes for testing.
// Use '0 0 */3 * *' for every 3 days.
cron.schedule('*/1 * * * *', () => {
    console.log(`\n⏰ It's time! Running the update script... (${new Date().toLocaleString()})`);

    const scriptPath = path.resolve(__dirname, 'update-local.js');

    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error executing script: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Script stderr: ${stderr}`);
            return;
        }
        console.log(`✅ Script output:\n${stdout}`);
    });
});

// --- NEW: Keep the process alive ---
// This empty interval does nothing but prevents the script from exiting.
setInterval(() => {}, 1 << 30); // Runs every ~12 days, effectively forever