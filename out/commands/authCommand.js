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
exports.createReactAuthCommand = createReactAuthCommand;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const utils_1 = require("../utils");
const fileUtils_1 = require("../utils/fileUtils");
const templates_1 = require("../templates");
function createReactAuthCommand() {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate workspace
        const workspacePath = (0, utils_1.validateWorkspace)();
        if (!workspacePath)
            return;
        // Check dependencies
        (0, utils_1.checkDependencies)(workspacePath);
        // Get target folder from user
        const folderInput = yield (0, utils_1.getUserInput)('Masukkan folder tujuan (contoh: src atau frontend/src)', 'src');
        if (!folderInput)
            return;
        // Get theme choice
        const theme = yield (0, utils_1.getThemeChoice)();
        if (!theme)
            return;
        const targetPath = path.join(workspacePath, folderInput);
        const templateOptions = { theme };
        // Create auth files with theme
        const authFiles = [
            {
                path: path.join(targetPath, 'context/AuthContext.jsx'),
                content: (0, templates_1.getAuthContextTemplate)(templateOptions)
            },
            {
                path: path.join(targetPath, 'pages/Login.jsx'),
                content: (0, templates_1.getLoginPageTemplate)(templateOptions)
            },
            {
                path: path.join(targetPath, 'pages/Home.jsx'),
                content: (0, templates_1.getHomePageTemplate)(templateOptions)
            },
            {
                path: path.join(targetPath, 'pages/GoogleCallback.jsx'),
                content: (0, templates_1.getGoogleCallbackTemplate)(templateOptions)
            },
            {
                path: path.join(targetPath, 'components/PrivateRoute.jsx'),
                content: (0, templates_1.getPrivateRouteTemplate)(templateOptions)
            },
            {
                path: path.join(targetPath, 'App.jsx'),
                content: (0, templates_1.getAppTemplate)(templateOptions)
            }
        ];
        // Write all files
        let allSuccessful = true;
        for (const file of authFiles) {
            if (!(0, fileUtils_1.writeFileToPath)(file.path, file.content)) {
                allSuccessful = false;
            }
        }
        if (allSuccessful) {
            const themeEmoji = theme === 'dark' ? '🌙' : '☀️';
            vscode.window.showInformationMessage(`${themeEmoji} Auth scaffolding dengan Google Login dan tema ${theme} berhasil dibuat di folder: ${folderInput} 🚀`);
        }
    });
}
//# sourceMappingURL=authCommand.js.map