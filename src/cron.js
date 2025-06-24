import { CronJob } from 'cron';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const job = new CronJob('*/10 * * * *', () => {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) {
        console.log(`[${new Date().toLocaleString()}] ✅ GET request sent successfully`);
      } else {
        console.log(`[${new Date().toLocaleString()}] ❌ GET request failed: ${res.statusCode}`);
      }
    })
    .on('error', (e) => {
      console.error(`[${new Date().toLocaleString()}] 🚨 Error while sending request:`, e.message);
    });
});

// Start the cron job
job.start();

export default job;
