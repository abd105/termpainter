import { execSync } from 'node:child_process';
import { readdirSync, renameSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

// Build ESM
run('tsc -p tsconfig.build.json');

// Build CJS
run('tsc -p tsconfig.cjs.json');

// Rename .js -> .cjs in dist/cjs and fix internal imports
function renameToCjs(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      renameToCjs(fullPath);
    } else if (entry.isFile() && extname(entry.name) === '.js') {
      const newPath = join(dir, entry.name.replace(/\.js$/, '.cjs'));
      // Fix internal requires: require('./foo.js') -> require('./foo.cjs')
      let content = readFileSync(fullPath, 'utf8');
      content = content.replace(/require\(['"](\.[^'"]+)\.js['"]\)/g, "require('$1.cjs')");
      writeFileSync(newPath, content);
      // Remove old .js file
      import('node:fs').then(fs => fs.unlinkSync(fullPath));
    }
  }
}

renameToCjs('./dist/cjs');

// Copy .d.ts from dist/types to dist/cjs as .d.cts
function copyDts(srcDir, destDir) {
  mkdirSync(destDir, { recursive: true });
  const entries = readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name);
    const destPath = join(destDir, entry.name.replace(/\.d\.ts$/, '.d.cts'));
    if (entry.isDirectory()) {
      copyDts(srcPath, join(destDir, entry.name));
    } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
      let content = readFileSync(srcPath, 'utf8');
      writeFileSync(destPath, content);
    }
  }
}

copyDts('./dist/types', './dist/cjs');

console.log('\nBuild complete!');
