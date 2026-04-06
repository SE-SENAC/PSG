const fs = require('fs');
const crypto = require('crypto');

function getStableGuid(id) {
    // Basic stable GUID from string hash
    const hash = crypto.createHash('md5').update(String(id)).digest('hex');
    // Format as UUID v4-ish mask: 8-4-4-4-12
    return [
        hash.substring(0, 8),
        hash.substring(8, 12),
        hash.substring(12, 16),
        hash.substring(16, 20),
        hash.substring(20, 32)
    ].join('-');
}

let content = fs.readFileSync('backend/seed.ts', 'utf8');

// Replace id: '123' with id: 'stable-guid'
content = content.replace(/id:\s*'(\d+)'/g, (match, p1) => {
    return `id: '${getStableGuid(p1)}'`;
});

content = content.replace(/findOne\('(\d+)'\)/g, (match, p1) => {
    return `findOne('${getStableGuid(p1)}')`;
});

content = content.replace(/category:\s*'(\d+)'/g, (match, p1) => {
    return `category: '${getStableGuid(p1)}'`;
});

// For objects like { id: '1' } in courses
content = content.replace(/id:\s*'(\d+)'/g, (match, p1) => {
    return `id: '${getStableGuid(p1)}'`;
});

content = content.replace(/categoryId:\s*'(\d+)'/g, (match, p1) => {
    return `categoryId: '${getStableGuid(p1)}'`;
});

fs.writeFileSync('backend/seed.ts', content);
console.log("Seed file updated with valid GUIDs.");
