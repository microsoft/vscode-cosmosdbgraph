/*--------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as vscode from 'vscode';
import { AzureUserInput, callWithTelemetryAndErrorHandling, createApiProvider, createAzExtOutputChannel, IActionContext, registerUIExtensionVariables } from 'vscode-azureextensionui';
import { AzureExtensionApi, AzureExtensionApiProvider } from 'vscode-azureextensionui/api';
import { openGraphExplorer } from './commands/api/openGraphExplorer';
import { ext } from './extensionVariables';
import { GraphViewsManager } from './graph/GraphViewsManager';

export async function activateInternal(context: vscode.ExtensionContext, perfStats: { loadStartTime: number, loadEndTime: number }, ignoreBundle?: boolean): Promise<AzureExtensionApiProvider> {
    ext.context = context;
    ext.ignoreBundle = ignoreBundle;
    ext.ui = new AzureUserInput(context.globalState);

    ext.outputChannel = createAzExtOutputChannel("Azure Cosmos DB Graph", ext.prefix);
    context.subscriptions.push(ext.outputChannel);
    registerUIExtensionVariables(ext);

    await callWithTelemetryAndErrorHandling('cosmosDBGraph.activate', (activateContext: IActionContext) => {
        activateContext.telemetry.properties.isActivationEvent = 'true';
        activateContext.telemetry.measurements.mainFileLoad = (perfStats.loadEndTime - perfStats.loadStartTime) / 1000;

        ext.graphViewsManager = new GraphViewsManager();
    });

    return createApiProvider([<AzureExtensionApi>{
        openGraphExplorer,
        apiVersion: '1.0.0'
    }]);
}

export function deactivateInternal(): void {
    return;
}
