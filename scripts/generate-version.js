import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get version from environment variable or generate timestamp-based version
const version = process.env.CF_PAGES_COMMIT_SHA ||
                process.env.VITE_APP_VERSION ||
                `dev-${Date.now()}`;

const versionData = {
  version,
  timestamp: new Date().toISOString()
};

// Write to public/version.json
const publicDir = join(__dirname, '..', 'public');
const versionFilePath = join(publicDir, 'version.json');

writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));

console.log(`✓ Generated version.json with version: ${version}`);
