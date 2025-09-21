import * as vscode from 'vscode';
import * as path from 'path';
import { validateWorkspace, checkDependencies, getUserInput, getThemeChoice } from '../utils';
import { writeFileToPath, updateAppFile } from '../utils/fileUtils';
import { getCrudTemplates } from '../templates';

export async function createCrudCommand(): Promise<void> {
  // Validate workspace
  const workspacePath = validateWorkspace();
  if (!workspacePath) return;

  // Check dependencies
  checkDependencies(workspacePath);

  // Get target folder from user
  const folderInput = await getUserInput(
    'Masukkan folder tujuan (contoh: src atau frontend/src)',
    'src/pages'
  );
  if (!folderInput) return;

  // Get CRUD name from user
  const crudName = await getUserInput('Masukkan nama CRUD (contoh: Barang)');
  if (!crudName) return;

  // Get theme choice
  const theme = await getThemeChoice();
  if (!theme) return;

  const targetPath = path.join(workspacePath, folderInput, crudName);
  const lowerName = crudName.toLowerCase();

  // Generate CRUD templates with theme
  const templates = getCrudTemplates({ 
    name: crudName, 
    lowerName, 
    theme 
  });

  // Write all CRUD files
  let allSuccessful = true;
  for (const [fileName, content] of Object.entries(templates)) {
    const filePath = path.join(targetPath, fileName);
    if (!writeFileToPath(filePath, content)) {
      allSuccessful = false;
    }
  }

  if (allSuccessful) {
    // Update App.jsx to add CRUD routes
    const appPath = path.join(
      workspacePath, 
      folderInput.replace(/pages.*/, ''), 
      'App.jsx'
    );
    updateAppFile(appPath, crudName);

    const themeEmoji = theme === 'dark' ? '🌙' : '☀️';
    vscode.window.showInformationMessage(
      `${themeEmoji} CRUD ${crudName} dengan tema ${theme} berhasil dibuat di folder: ${folderInput} 🚀`
    );
  }
}