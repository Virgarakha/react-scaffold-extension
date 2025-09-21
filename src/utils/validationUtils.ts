import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { PackageJson, ThemeOption } from '../types';

export function validateWorkspace(): string | null {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('Buka folder project React/Vite dulu.');
    return null;
  }
  return workspaceFolders[0].uri.fsPath;
}

export function checkDependencies(workspacePath: string): void {
  const packageJsonPath = path.join(workspacePath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const missingDeps = [];
      
      if (!packageJson.dependencies['axios']) missingDeps.push('axios');
      if (!packageJson.dependencies['react-router-dom']) missingDeps.push('react-router-dom');
      if (!packageJson.dependencies['lucide-react']) missingDeps.push('lucide-react');
      
      // Check for Tailwind
      const hasTailwind = packageJson.dependencies['tailwindcss'] || 
                         packageJson.devDependencies?.['tailwindcss'];
      if (!hasTailwind) missingDeps.push('tailwindcss');
      
      if (missingDeps.length > 0) {
        vscode.window.showWarningMessage(
          `Pastikan dependencies berikut terinstal: ${missingDeps.join(', ')}`
        );
      }
    } catch (error) {
      vscode.window.showWarningMessage('Tidak dapat membaca package.json');
    }
  }
}

export async function getUserInput(prompt: string, defaultValue: string = ''): Promise<string | null> {
  const input = await vscode.window.showInputBox({
    prompt,
    value: defaultValue,
  });

  if (!input) {
    vscode.window.showErrorMessage('Input wajib diisi!');
    return null;
  }

  return input;
}

export async function getThemeChoice(): Promise<ThemeOption | null> {
  const themeChoice = await vscode.window.showQuickPick([
    {
      label: '🌙 Dark Theme',
      description: 'Tema gelap dengan background hitam',
      detail: 'Modern dark theme dengan accent biru',
      value: 'dark' as ThemeOption
    },
    {
      label: '☀️ Light Theme', 
      description: 'Tema terang dengan background putih',
      detail: 'Clean light theme dengan accent biru',
      value: 'light' as ThemeOption
    }
  ], {
    placeHolder: 'Pilih tema untuk styling komponen',
    ignoreFocusOut: true
  });

  return themeChoice?.value || null;
}