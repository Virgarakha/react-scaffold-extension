import * as vscode from 'vscode';
import * as path from 'path';
import { validateWorkspace, checkDependencies, getUserInput, getThemeChoice } from '../utils';
import { writeFileToPath } from '../utils/fileUtils';
import {
  getAuthContextTemplate,
  getLoginPageTemplate,
  getHomePageTemplate,
  getPrivateRouteTemplate,
  getGoogleCallbackTemplate,
  getAppTemplate
} from '../templates';

export async function createReactAuthCommand(): Promise<void> {
  // Validate workspace
  const workspacePath = validateWorkspace();
  if (!workspacePath) return;

  // Check dependencies
  checkDependencies(workspacePath);

  // Get target folder from user
  const folderInput = await getUserInput(
    'Masukkan folder tujuan (contoh: src atau frontend/src)',
    'src'
  );
  if (!folderInput) return;

  // Get theme choice
  const theme = await getThemeChoice();
  if (!theme) return;

  const targetPath = path.join(workspacePath, folderInput);
  const templateOptions = { theme };

  // Create auth files with theme
  const authFiles = [
    {
      path: path.join(targetPath, 'context/AuthContext.jsx'),
      content: getAuthContextTemplate(templateOptions)
    },
    {
      path: path.join(targetPath, 'pages/Login.jsx'),
      content: getLoginPageTemplate(templateOptions)
    },
    {
      path: path.join(targetPath, 'pages/Home.jsx'),
      content: getHomePageTemplate(templateOptions)
    },
    {
      path: path.join(targetPath, 'pages/GoogleCallback.jsx'),
      content: getGoogleCallbackTemplate(templateOptions)
    },
    {
      path: path.join(targetPath, 'components/PrivateRoute.jsx'),
      content: getPrivateRouteTemplate(templateOptions)
    },
    {
      path: path.join(targetPath, 'App.jsx'),
      content: getAppTemplate(templateOptions)
    }
  ];

  // Write all files
  let allSuccessful = true;
  for (const file of authFiles) {
    if (!writeFileToPath(file.path, file.content)) {
      allSuccessful = false;
    }
  }

  if (allSuccessful) {
    const themeEmoji = theme === 'dark' ? '🌙' : '☀️';
    vscode.window.showInformationMessage(
      `${themeEmoji} Auth scaffolding dengan Google Login dan tema ${theme} berhasil dibuat di folder: ${folderInput} 🚀`
    );
  }
}