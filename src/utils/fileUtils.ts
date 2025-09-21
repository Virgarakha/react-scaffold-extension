import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function createDirectory(dirPath: string): boolean {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    vscode.window.showErrorMessage(`Gagal membuat folder: ${errorMessage}`);
    return false;
  }
}

export function writeFileToPath(filePath: string, content: string): boolean {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    createDirectory(dir);
    
    fs.writeFileSync(filePath, content.trim());
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    vscode.window.showErrorMessage(`Gagal menulis file: ${errorMessage}`);
    return false;
  }
}

export function updateAppFile(appPath: string, crudName: string): void {
  if (!fs.existsSync(appPath)) {
    vscode.window.showWarningMessage('App.jsx tidak ditemukan. Tambahkan rute CRUD secara manual.');
    return;
  }

  try {
    let appContent = fs.readFileSync(appPath, 'utf8');
    const lower = crudName.toLowerCase();
    
    const importStatements = `
import ${crudName} from './pages/${crudName}/${crudName}'
import ${crudName}Create from './pages/${crudName}/${crudName}Create'
import ${crudName}Update from './pages/${crudName}/${crudName}Update'
import ${crudName}Detail from './pages/${crudName}/${crudName}Detail'
`;
    
    const newRoutes = `
            <Route path='/${lower}' element={<${crudName} />} />
            <Route path='/${lower}/create' element={<${crudName}Create />} />
            <Route path='/${lower}/:id' element={<${crudName}Detail />} />
            <Route path='/${lower}/:id/edit' element={<${crudName}Update />} />
`;

    // Add imports if not present
    if (!appContent.includes(`import ${crudName} from`)) {
      appContent = appContent.replace(
        /import PrivateRoute from '.\/components\/PrivateRoute'/,
        `$&\n${importStatements}`
      );
    }

    // Add routes inside PrivateRoute
    appContent = appContent.replace(
      /(<Route path='\/' element={<Home \/>} \/>\s*)/,
      `$1${newRoutes}`
    );

    fs.writeFileSync(appPath, appContent);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    vscode.window.showErrorMessage(`Gagal update App.jsx: ${errorMessage}`);
  }
}