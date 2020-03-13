/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext } from "vscode";
import { IAzExtOutputChannel, IAzureUserInput, ITelemetryReporter } from "vscode-azureextensionui";
import { GraphViewsManager } from "./graph/GraphViewsManager";

/**
 * Namespace for common variables used throughout the extension. They must be initialized in the activate() method of extension.ts
 */
export namespace ext {
    export let ui: IAzureUserInput;
    export let context: ExtensionContext;
    export let outputChannel: IAzExtOutputChannel;
    export let reporter: ITelemetryReporter;
    // tslint:disable-next-line: strict-boolean-expressions
    export let ignoreBundle: boolean = !/^(false|0)?$/i.test(process.env.AZCODE_COSMOSDB_GRAPH_IGNORE_BUNDLE || '');
    export let graphViewsManager: GraphViewsManager;
    export const prefix: string = 'cosmosDB'; // Intentionally using same prefix as Cosmos DB to maintain backwards compatability of settings
}
