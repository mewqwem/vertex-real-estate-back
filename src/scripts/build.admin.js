import { adminJs } from '../src/admin/admin.js';

async function runBuild() {
  try {
    console.log('Starting custom AdminJS asset bundling...');

    await adminJs.initialize();

    console.log('AdminJS assets bundled successfully!');
    process.exit(0);
  } catch (error) {
    console.error('AdminJS bundling failed:', error);
    process.exit(1);
  }
}

runBuild();
