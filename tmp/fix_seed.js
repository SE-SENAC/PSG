import fs from 'fs';

let content = fs.readFileSync('backend/seed.ts', 'utf8');
content = content.replace(/id:\s*(\d+)/g, "id: '$1'");
fs.writeFileSync('backend/seed.ts', content);
