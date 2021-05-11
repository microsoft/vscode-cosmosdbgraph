/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fse from 'fs-extra';
import * as path from "path";
import * as vscode from 'vscode';
import { parseError } from 'vscode-azureextensionui';
import { getResourcesPath } from '../constants';
import { ext } from '../extensionVariables';
import { IGraphConfiguration } from '../vscode-cosmosdbgraph.api';
import { GraphViewServer } from './GraphViewServer';

interface IServerProvider {
    findServerById(id: number): GraphViewServer;
}

export class GraphViewsManager implements IServerProvider { //Graphviews Panel
    private _lastServerId = 0;

    // One server (and one webview panel) per graph, as represented by unique configurations
    private readonly _servers = new Map<number, GraphViewServer>(); // map of id -> server
    private readonly _panels = new Map<number, vscode.WebviewPanel>(); // map of id -> webview panel
    private readonly _panelViewType: string = "CosmosDB.GraphExplorer";

    public async showGraphViewer(config: IGraphConfiguration): Promise<void> {
        let id: number;
        try {
            id = await this.getOrCreateServer(config);
        } catch (err) {
            void vscode.window.showErrorMessage(parseError(err).message);
        }
        const existingPanel: vscode.WebviewPanel = this._panels.get(id);
        if (existingPanel) {
            existingPanel.reveal();
            return;
        }
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        const options: vscode.WebviewOptions & vscode.WebviewPanelOptions = {
            enableScripts: true,
            enableCommandUris: true,
            enableFindWidget: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.file(ext.context.extensionPath)]
        };
        const panel = vscode.window.createWebviewPanel(this._panelViewType, config.tabTitle, { viewColumn: column, preserveFocus: true }, options);
        const contentProvider = new WebviewContentProvider(this);
        panel.webview.html = await contentProvider.provideHtmlContent(panel.webview, id);
        this._panels.set(id, panel);
        panel.onDidDispose(
            // dispose the server
            () => {
                const server = this._servers.get(id);
                server.dispose();
                this._servers.delete(id);
                this._panels.delete(id);
            }
        );
        panel.reveal();
    }

    public findServerById(id: number): GraphViewServer {
        return this._servers.get(id);
    }

    private async getOrCreateServer(config: IGraphConfiguration): Promise<number> {
        let existingServer: GraphViewServer = null;
        let existingId: number;
        this._servers.forEach((svr, key) => {
            if (areConfigsEqual(svr.configuration, config)) {
                existingServer = svr;
                existingId = key;
            }
        });
        if (existingServer) {
            return existingId;
        }

        const server = new GraphViewServer(config);
        await server.start();

        this._lastServerId += 1;
        const id = this._lastServerId;
        this._servers.set(id, server);
        return id;
    }

}

class WebviewContentProvider {
    public onDidChange?: vscode.Event<vscode.Uri>;

    public constructor(private _serverProvider: IServerProvider) { }

    public async provideHtmlContent(webview: vscode.Webview, serverId: number): Promise<string> {
        console.assert(serverId > 0);
        const server = this._serverProvider.findServerById(serverId);
        if (server) {
            return await this._graphClientHtmlAsString(webview, server.port);
        }

        throw new Error("This resource is no longer available.");
    }

    private async _graphClientHtmlAsString(webview: vscode.Webview, port: number): Promise<string> {
        const graphClientAbsolutePath = path.join(getResourcesPath(), 'graphClient', 'graphClient.html');
        let htmlContents: string = await fse.readFile(graphClientAbsolutePath, 'utf8');
        const portPlaceholder: RegExp = /\$CLIENTPORT/g;
        htmlContents = htmlContents.replace(portPlaceholder, String(port));
        const uriPlaceholder: RegExp = /\$BASEURI/g;
        const baseUri = webview.asWebviewUri(vscode.Uri.file(ext.context.extensionPath));
        htmlContents = htmlContents.replace(uriPlaceholder, baseUri.toString());

        return htmlContents;
    }

}

function areConfigsEqual(config1: IGraphConfiguration, config2: IGraphConfiguration): boolean {
    // Don't compare gremlin endpoints, documentEndpoint is enough to guarantee uniqueness
    return config1.documentEndpoint === config2.documentEndpoint &&
        config1.databaseName === config2.databaseName &&
        config1.graphName === config2.graphName;
}
