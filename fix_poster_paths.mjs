// Fix forumPosters.json paths from /بوسترات المنتدى/ to /forum_posters/
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, 'src/data/forumPosters.json');

const data = JSON.parse(readFileSync(filePath, 'utf8'));

const updated = data.map(poster => {
  const filename = poster.filename;
  // URL encode the filename for the path
  const encodedFilename = encodeURIComponent(filename);
  return {
    ...poster,
    path: `/forum_posters/${encodedFilename}`,
    rawPath: `/forum_posters/${filename}`
  };
});

writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
console.log(`Updated ${updated.length} poster paths to /forum_posters/`);
updated.forEach(p => console.log(' -', p.path));
