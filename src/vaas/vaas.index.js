const vscode = require('vscode');
const { Diagnostic, Range, DiagnosticSeverity } = require('vscode');
const fs = require('fs');
const utils = require('../vscode/vscode.utils');
const VaasWebView = require('./vaas.webview');
const { vaas, installVaas, updateVaas } = require('./vaas.utils');
const pkg = require('./vaas.package');

const name = 'Beosin-VaaS: ETH';
const webview = new VaasWebView(name);
let diagnosticCollection = vscode.languages.createDiagnosticCollection(name);

const createDiagnosticWithVaasResult = (data = undefined) => {
    // data || (data = {
    //     "file": "./cache/cat_result_tmp.sol",
    //     "title": "Integer Overflow",
    //     "description": "There may be an integer Overflow error.",
    //     "line": 49,
    //     "offset": 1,
    //     "code": "orderQuantity[msg.sender] += quantity;",
    //     "warningType": "Warning"
    // });
    // https://code.visualstudio.com/api/references/vscode-api#Diagnostic
    const line = data.line ? data.line - 1 : 0;
    const offset = data.offset ? data.offset - 1 : 0;
    const range = new Range(line, offset, line, (data.code ? data.code.length - 1 : 0) + offset);
    const desc = `[${name}]${data.title}: ${data.description}`;
    // "Info" "Error" "Warning"
    let level = data.warningType;
    level = !level ? 'Warning' : (level.includes('Info') ? 'Information' : level);
    const diagnostic = new Diagnostic(range, desc, DiagnosticSeverity[level]);
    diagnostic.code = name;
    // diagnostic.source = `[${name}]${data.title}`;
    return diagnostic;
};
vaas.onStart(() => {
    // diagnosticCollection.clear();
    const entries = [];
    diagnosticCollection.forEach((uri, diagnostics) => {
        const dgts = diagnostics.filter((dgt) => {
            return dgt.code !== name;
        });
        entries.push([uri, dgts]);
    });
    diagnosticCollection.set(entries);
});
vaas.onResult((data) => {
    const vaasDiagnostics = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            for (const res of data[key]) {
                if (!res.file) { continue; }
                vaasDiagnostics[res.file] || (vaasDiagnostics[res.file] = []);
                vaasDiagnostics[res.file].push(createDiagnosticWithVaasResult(res));
            }
        }
    }
    // (<Uri>, [<Diagnostic>])
    // [[uri1, [d1]], [uri2, [d2]]]
    const entries = [];
    for (const file in vaasDiagnostics) {
        if (vaasDiagnostics.hasOwnProperty(file)) {
            entries.push([vscode.Uri.file(file), vaasDiagnostics[file]]);
        }
    }
    diagnosticCollection.set(entries);
});

const activate = (context, dgtClt) => {
    diagnosticCollection = dgtClt;
    const vaasPath = pkg.vaasPackage.executeDir;
    utils.storage.setItem('vaasPath', vaasPath);
    // beosin-vaas-eth.start
    const start = vscode.commands.registerCommand('beosin-vaas-eth.start', (uri) => {
        if (fs.existsSync(vaasPath)) {
            webview.activate(context, uri);
        } else {
            installVaas(name).then(() => {
                webview.activate(context, uri);
            });
        }
    });
    context.subscriptions.push(start);
    // beosin-vaas-eth.update
    const update = vscode.commands.registerCommand('beosin-vaas-eth.update', () => {
        updateVaas();
    });
    context.subscriptions.push(update);
}

const deactivate = () => {
    webview.deactivate();
}

module.exports = {
    name,
    activate,
    deactivate
};