const electronInstaller = require('electron-winstaller');
const path = require('path');

async function buildInstaller() {
  console.log('Building installer...');
  try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: path.join(__dirname, 'build16', 'SecureDocs Viewer-win32-x64'),
      outputDirectory: path.join(__dirname, 'installer'),
      authors: 'SecureDocs Admin',
      description: 'SecureDocs Viewer Application',
      exe: 'SecureDocs Viewer.exe',
      setupExe: 'SecureDocsViewer_Setup.exe',
      noMsi: true,
      setupIcon: undefined // can add icon later if needed
    });
    console.log('Successfully created installer at /installer/SecureDocsViewer_Setup.exe');
  } catch (e) {
    console.log(`Failed to create installer: ${e.message}`);
  }
}

buildInstaller();
