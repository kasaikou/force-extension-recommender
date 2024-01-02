// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SyncExtensions } from './sync-extensions';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('"force-extension-recommender" is now active!');
	console.log(vscode.extensions.all.map(ext => ext.id));
	const syncer = new SyncExtensions({
		installed: vscode.extensions.all.map(ext => ext.id),
		keepInstalled: [
			"vscode.*",
			"ms-vscode.vscode-js-profile-table",
			"ms-vscode.js-debug",
			context.extension.id
		],
		recommendInstalled: [],
		recommendUninstalled: [],
	});

	syncer.sync();
}

// This method is called when your extension is deactivated
export function deactivate() { }
