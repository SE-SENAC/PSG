import fs from 'fs';

let content = fs.readFileSync('backend/seed.ts', 'utf8');

// 1. Fix broken id: '', by assigning sequential numbers back (per section)
// We split by class to avoid ID collisions if needed, but sequential is usually fine for seeds.
let counter = 1;
content = content.replace(/id: ''/g, () => `id: '${counter++}'`);

// 2. Fix findOne calls with numbers to strings
content = content.replace(/findOne\((\d+)\)/g, "findOne('$1')");

// 3. Fix references like category: { id: 1 } -> { id: '1' } if any
content = content.replace(/id:\s*(\d+)/g, "id: '$1'");

fs.writeFileSync('backend/seed.ts', content);
