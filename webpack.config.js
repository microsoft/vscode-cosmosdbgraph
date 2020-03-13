/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

// See https://github.com/Microsoft/vscode-azuretools/wiki/webpack for guidance

'use strict';

const process = require('process');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StringReplacePlugin = require("string-replace-webpack-plugin");
const dev = require("vscode-azureextensiondev");

let DEBUG_WEBPACK = !!process.env.DEBUG_WEBPACK;

let config = dev.getDefaultWebpackConfig({
    projectRoot: __dirname,
    verbosity: DEBUG_WEBPACK ? 'debug' : 'normal',

    externalNodeModules: [
        // Modules that we can't easily webpack for some reason.
        // These and their dependencies will be copied into node_modules rather than placed in the bundle
        // Keep this list small, because all the subdependencies will also be excluded
        'gremlin',
        'socket.io',
        'd3'
    ],
    entries: {
        // Note: Each entry is a completely separate Node.js application that cannot interact with any
        // of the others, and that individually includes all dependencies necessary (i.e. common
        // dependencies will have a copy in each entry file, no sharing).
    },

    externals:
    {
        // Fix "Module not found" errors in ./node_modules/websocket/lib/{BufferUtil,Validation}.js
        //   and 'ws' module.
        // These files are not in node_modules and so will fail normally at runtime and instead use fallbacks.
        // Make them as external so webpack doesn't try to process them, and they'll simply fail at runtime as before.
    }, // end of externals

    loaderRules: [
    ], // end of loaderRules


    plugins: [
        // Copy files to dist folder where the runtime can find them
        new CopyWebpackPlugin([
            // graphClient.js -> dist, which is used by graphClient.html
            { from: './out/src/graph/client/graphClient.js', to: 'graphClient.js' }
        ]),

        // An instance of the StringReplacePlugin plugin must be present for it to work (its use is configured in modules).
        new StringReplacePlugin()
    ]
});

if (DEBUG_WEBPACK) {
    console.log('Config:', config);
}

module.exports = config;
