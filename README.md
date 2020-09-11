
# Cosmos DB Graph Support for VS Code (deprecated)

Note: This extension has been deprecated. Visualize graph data in the Azure Portal or with [these solutions](https://docs.microsoft.com/azure/cosmos-db/graph-visualization) instead.

---

Use [Gremlin](https://docs.microsoft.com/azure/cosmos-db/gremlin-support) to query Cosmos DB graphs.

![Query Graphs](resources/Graph.gif)

- <a name="graphSettings"></a>Configure the user setting `cosmosDB.graph.viewSettings` to customize which properties to display and which colors to use based on vertex label.
```javascript
    "cosmosDB.graph.viewSettings": [
        {
            "vertexSettings": [
                {
                    // Default settings for all vertices
                    "displayProperty": [
                        // Display name property if exists, otherwise firstName if it exists, otherwise ID
                        "name",
                        "firstName"
                    ],
                    // Auto-choose color by label
                    "color": "auto",
                    // Show label after display property
                    "showLabel": true
                },
                {
                    // These setting apply to vertices with the label 'person'
                    "appliesToLabel": "person",
                    "color": "blue"
                }
            ]
        }
    ]
```

# Contributing
There are several ways you can contribute to our [repo](https://github.com/Microsoft/vscode-cosmosdbgraph):

- **Ideas, feature requests and bugs**: We are open to all ideas and we want to get rid of bugs! Use the [Issues](https://github.com/Microsoft/vscode-cosmosdbgraph/issues) section to report a new issue, provide your ideas or contribute to existing threads.

- **Documentation**: Found a typo or strangely worded sentences? Submit a PR!
- **Code**: Contribute bug fixes, features or design changes:
  - Clone the repository locally and open in VS Code.
  - Open the terminal (press `CTRL+`\`) and run `npm install`.
  - To build, press `F1` and type in `Tasks: Run Build Task`.
  - Debug: press `F5` to start debugging the extension.

## Legal
Before we can accept your pull request you will need to sign a **Contribution License Agreement**. All you need to do is to submit a pull request, then the PR will get appropriately labelled (e.g. `cla-required`, `cla-norequired`, `cla-signed`, `cla-already-signed`). If you already signed the agreement we will continue with reviewing the PR, otherwise system will tell you how you can sign the CLA. Once you sign the CLA all future PR's will be labeled as `cla-signed`.

## Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Telemetry
VS Code collects usage data and sends it to Microsoft to help improve our products and services. Read our [privacy statement](https://go.microsoft.com/fwlink/?LinkID=528096&clcid=0x409) to learn more. If you don’t wish to send usage data to Microsoft, you can set the `telemetry.enableTelemetry` setting to `false`. Learn more in our [FAQ](https://code.visualstudio.com/docs/supporting/faq#_how-to-disable-telemetry-reporting).

# License
[MIT](LICENSE.md)
