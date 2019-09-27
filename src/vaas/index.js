const vscode = require('vscode');
const { Diagnostic, Range, DiagnosticSeverity } = require('vscode');
const path = require('path');
const utils = require('../vscode/vscode.utils');
const VaasWebView = require('./webview');
const vaas = require('./vaas');

const name = 'Beosin-VaaS: ETH';
const webview = new VaasWebView(name);

// 诊断框
let diagnosticCollection = vscode.languages.createDiagnosticCollection(name);;
// 生成诊断对象
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
    }
    // vaas开始回调
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
// vaas结果回调
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

// vscode.languages.onDidChangeDiagnostics((uris) => {
// });

const activate = (context, dgtClt) => {
    diagnosticCollection = dgtClt;
    // utils.Api.showTxt2Output({ txt: `------ this is new ------` });
    // utils.Api.showTxt2Output({ txt: path.join(__dirname, '..', '..', 'Beosin-VaaS', 'start') });
    utils.storage.setItem('vaasPath', path.join(__dirname, '..', '..', 'Beosin-VaaS', 'start'));
    // webview命令
    webview.activate(context, 'beosin-vaas-eth.start');
}

const deactivate = () => {
    webview.deactivate();
}

module.exports = {
    name,
    activate,
    deactivate
}