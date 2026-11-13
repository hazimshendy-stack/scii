import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = 'D:\\Hazim\\Projects\\sci_infinty\\website_01\\docs\\technical-report-assets\\screenshots';

const screenshots = [
  { id: '03-activities-desktop', url: 'http://localhost:5173/ar/projects-activities', width: 1440, height: 900 },
  { id: '04-activities-mobile', url: 'http://localhost:5173/ar/projects-activities', width: 390, height: 844 },
  { id: '05-activity-detail-desktop', url: 'http://localhost:5173/ar/projects-activities/arps-workshop-medical-physics-2026', width: 1440, height: 900 },
  { id: '06-scicast-podcast-desktop', url: 'http://localhost:5173/ar/sci-cast', width: 1440, height: 900 },
  { id: '07-scicast-episode-desktop', url: 'http://localhost:5173/ar/sci-cast/episode/1', width: 1440, height: 900 },
  { id: '08-research-desktop', url: 'http://localhost:5173/ar/research', width: 1440, height: 900 },
  { id: '09-about-desktop', url: 'http://localhost:5173/ar/about', width: 1440, height: 900 },
  { id: '10-team-desktop', url: 'http://localhost:5173/ar/team', width: 1440, height: 900 },
  { id: '11-partners-desktop', url: 'http://localhost:5173/ar/partners', width: 1440, height: 900 },
  { id: '12-magazine-desktop', url: 'http://localhost:5173/ar/fudul', width: 1440, height: 900 },
  { id: '13-contact-desktop', url: 'http://localhost:5173/ar/contact', width: 1440, height: 900 },
  { id: '14-joinus-desktop', url: 'http://localhost:5173/ar/join-us', width: 1440, height: 900 },
  { id: '15-homepage-english-desktop', url: 'http://localhost:5173/en', width: 1440, height: 900 }
];

function capture(s) {
  const outFile = path.join(outDir, `${s.id}.png`);
  const cmd = `"${edgePath}" --headless --disable-gpu --no-sandbox --window-size=${s.width},${s.height} --screenshot="${outFile}" --run-all-compositor-stages-before-draw "${s.url}"`;
  try {
    console.log(`Capturing ${s.id}...`);
    execSync(cmd, { timeout: 25000, stdio: 'ignore' });
    if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) {
      console.log(`SUCCESS: ${s.id} (${fs.statSync(outFile).size} bytes)`);
    } else {
      console.log(`FAILED: ${s.id}`);
    }
  } catch (err) {
    console.log(`ERROR ${s.id}: ${err.message}`);
  }
}

for (const s of screenshots) {
  capture(s);
}
console.log('ALL DONE');
