import * as vscode from 'vscode';
import { createReactAuthCommand, createCrudCommand } from './commands';

export function activate(context: vscode.ExtensionContext) {
  // Register Auth Scaffold Command
  const disposableAuth = vscode.commands.registerCommand(
    'extension.createReactAuth',
    createReactAuthCommand
  );

  // Register CRUD Scaffold Command
  const disposableCrud = vscode.commands.registerCommand(
    'extension.createCrud',
    createCrudCommand
  );

  context.subscriptions.push(disposableAuth, disposableCrud);
}

export function deactivate() {}