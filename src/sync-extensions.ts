import { setFlagsFromString } from 'v8';
import * as vscode from 'vscode';

import { z } from 'zod';

function wildcardToRegex(pattern: string) {
    return new RegExp(`^${pattern.replaceAll(".", '\\.').replaceAll("?", '.').replaceAll("*", '.*')}$`);
}

const zSyncExtensionsState = z.object({
    installed: z.array(z.string()).transform(arr => new Set(arr)),
    keepInstalled: z.array(z.string()).transform(arr => arr.map(expr => wildcardToRegex(expr))),
    recommendInstalled: z.array(z.string()),
    recommendUninstalled: z.array(z.string()),
});

export class SyncExtensions {
    private state: z.output<typeof zSyncExtensionsState>;
    constructor(initState: z.input<typeof zSyncExtensionsState>) {
        this.state = zSyncExtensionsState.parse(initState);
    }

    sync() {
        for (const ext of this.state.installed) {
            if (this.state.keepInstalled.some(rule => rule.test(ext))) {
                continue;
            } else if (this.state.recommendInstalled.some(recommend => ext === recommend)) {
                continue;
            }

            this.uninstall(ext);
        }

        for (const recommend of this.state.recommendInstalled) {
            if (this.state.installed.has(recommend) === false) {
                this.install(recommend);


            }
        }
    }

    private install(ext: string) {
        console.log(`Install extension: ${ext}`);
        vscode.commands.executeCommand("workbench.extensions.installExtension", ext);
        this.state.installed.add(ext);
    }

    private uninstall(ext: string) {
        console.log(`Uninstall extension: ${ext}`);
        vscode.commands.executeCommand("workbench.extensions.uninstallExtension", ext);
        this.state.installed.delete(ext);
    }
};
