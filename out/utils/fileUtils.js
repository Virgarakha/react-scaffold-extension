"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirectory = createDirectory;
exports.writeFileToPath = writeFileToPath;
exports.updateAppFile = updateAppFile;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
function createDirectory(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        return true;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Gagal membuat folder: ${errorMessage}`);
        return false;
    }
}
function writeFileToPath(filePath, content) {
    try {
        // Ensure directory exists
        const dir = path.dirname(filePath);
        createDirectory(dir);
        fs.writeFileSync(filePath, content.trim());
        return true;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Gagal menulis file: ${errorMessage}`);
        return false;
    }
}
function updateAppFile(appPath, crudName) {
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
            appContent = appContent.replace(/import PrivateRoute from '.\/components\/PrivateRoute'/, `$&\n${importStatements}`);
        }
        // Add routes inside PrivateRoute
        appContent = appContent.replace(/(<Route path='\/' element={<Home \/>} \/>\s*)/, `$1${newRoutes}`);
        fs.writeFileSync(appPath, appContent);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Gagal update App.jsx: ${errorMessage}`);
    }
}
//# sourceMappingURL=fileUtils.js.map