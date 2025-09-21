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
exports.createCrudCommand = createCrudCommand;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const utils_1 = require("../utils");
const fileUtils_1 = require("../utils/fileUtils");
const templates_1 = require("../templates");
function createCrudCommand() {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate workspace
        const workspacePath = (0, utils_1.validateWorkspace)();
        if (!workspacePath)
            return;
        // Check dependencies
        (0, utils_1.checkDependencies)(workspacePath);
        // Get target folder from user
        const folderInput = yield (0, utils_1.getUserInput)('Masukkan folder tujuan (contoh: src atau frontend/src)', 'src/pages');
        if (!folderInput)
            return;
        // Get CRUD name from user
        const crudName = yield (0, utils_1.getUserInput)('Masukkan nama CRUD (contoh: Barang)');
        if (!crudName)
            return;
        // Get theme choice
        const theme = yield (0, utils_1.getThemeChoice)();
        if (!theme)
            return;
        const targetPath = path.join(workspacePath, folderInput, crudName);
        const lowerName = crudName.toLowerCase();
        // Generate CRUD templates with theme
        const templates = (0, templates_1.getCrudTemplates)({
            name: crudName,
            lowerName,
            theme
        });
        // Write all CRUD files
        let allSuccessful = true;
        for (const [fileName, content] of Object.entries(templates)) {
            const filePath = path.join(targetPath, fileName);
            if (!(0, fileUtils_1.writeFileToPath)(filePath, content)) {
                allSuccessful = false;
            }
        }
        if (allSuccessful) {
            // Update App.jsx to add CRUD routes
            const appPath = path.join(workspacePath, folderInput.replace(/pages.*/, ''), 'App.jsx');
            (0, fileUtils_1.updateAppFile)(appPath, crudName);
            const themeEmoji = theme === 'dark' ? '🌙' : '☀️';
            vscode.window.showInformationMessage(`${themeEmoji} CRUD ${crudName} dengan tema ${theme} berhasil dibuat di folder: ${folderInput} 🚀`);
        }
    });
}
//# sourceMappingURL=crudCommand.js.map