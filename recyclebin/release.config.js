// Option 1: Keep as semantic-release config (release.config.js)
module.exports = {
  branches: ['main', 'master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/github'
  ]
};

// Option 2: Keep as custom release script (scripts/release.js)
#!/usr/bin/env node
'use strict';

const { exec } = require('child_process');
const { existsSync, writeFileSync, readFileSync } = require('fs');
const inquirer = require('inquirer');
const path = require('path');

const metadataPath = path.join(__dirname, '..', 'build-metadata.json');

function run(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return reject(stderr);
      resolve(stdout.trim());
    });
  });
}

async function main() {
  console.clear();

  // 1. Check git status
  const status = await run('git status --porcelain');
  if (status) {
    console.error('❌ You have uncommitted changes. Please commit first.');
    process.exit(1);
  }

  // 2. Ask user
  const { confirm } = await inquirer.prompt([
    { type: 'confirm', name: 'confirm', message: 'Continue with release?' }
  ]);
  if (!confirm) process.exit(0);

  // 3. Build
  console.log('⚙️  Building project...');
  await run('npm run build');
  console.log('✅ Build complete.');

  // 4. Save metadata
  const commit = await run('git rev-parse HEAD');
  const metadata = { commit, releasedAt: new Date().toISOString() };
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`📦 Release metadata saved to ${metadataPath}`);

  // 5. Deploy (example: Vercel CLI)
  console.log('🚀 Deploying...');
  await run('npx vercel --prod');
  console.log('✅ Deployment successful!');
}

main().catch(err => {
  console.error('❌ Release failed:', err);
  process.exit(1);
});