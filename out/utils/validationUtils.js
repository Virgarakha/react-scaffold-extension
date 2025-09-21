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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWorkspace = validateWorkspace;
exports.checkDependencies = checkDependencies;
exports.getUserInput = getUserInput;
exports.getThemeChoice = getThemeChoice;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function validateWorkspace() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('Buka folder project React/Vite dulu.');
        return null;
    }
    return workspaceFolders[0].uri.fsPath;
}
function checkDependencies(workspacePath) {
    var _a;
    const packageJsonPath = path.join(workspacePath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const missingDeps = [];
            if (!packageJson.dependencies['axios'])
                missingDeps.push('axios');
            if (!packageJson.dependencies['react-router-dom'])
                missingDeps.push('react-router-dom');
            if (!packageJson.dependencies['lucide-react'])
                missingDeps.push('lucide-react');
            // Check for Tailwind
            const hasTailwind = packageJson.dependencies['tailwindcss'] ||
                ((_a = packageJson.devDependencies) === null || _a === void 0 ? void 0 : _a['tailwindcss']);
            if (!hasTailwind)
                missingDeps.push('tailwindcss');
            if (missingDeps.length > 0) {
                vscode.window.showWarningMessage(`Pastikan dependencies berikut terinstal: ${missingDeps.join(', ')}`);
            }
        }
        catch (error) {
            vscode.window.showWarningMessage('Tidak dapat membaca package.json');
        }
    }
}
function getUserInput(prompt_1) {
    return __awaiter(this, arguments, void 0, function* (prompt, defaultValue = '') {
        const input = yield vscode.window.showInputBox({
            prompt,
            value: defaultValue,
        });
        if (!input) {
            vscode.window.showErrorMessage('Input wajib diisi!');
            return null;
        }
        return input;
    });
}
function getThemeChoice() {
    return __awaiter(this, void 0, void 0, function* () {
        const themeChoice = yield vscode.window.showQuickPick([
            {
                label: '🌙 Dark Theme',
                description: 'Tema gelap dengan background hitam',
                detail: 'Modern dark theme dengan accent biru',
                value: 'dark'
            },
            {
                label: '☀️ Light Theme',
                description: 'Tema terang dengan background putih',
                detail: 'Clean light theme dengan accent biru',
                value: 'light'
            }
        ], {
            placeHolder: 'Pilih tema untuk styling komponen',
            ignoreFocusOut: true
        });
        return (themeChoice === null || themeChoice === void 0 ? void 0 : themeChoice.value) || null;
    });
}
//# sourceMappingURL=validationUtils.js.map