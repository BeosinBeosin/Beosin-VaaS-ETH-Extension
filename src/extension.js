const vscode = require('vscode');
const vaas = require('./vaas/vaas.index');
const pkg = require('./vaas/vaas.package');

function activate(context) {
    // pkg.activate(context);
    // return;
    // 语言诊断
    const diagnosticCollection = vscode.languages.createDiagnosticCollection(vaas.name);
    context.subscriptions.push(diagnosticCollection);
    // 注册命令
    vaas.activate(context, diagnosticCollection);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    vaas.deactivate();
}

module.exports = {
    activate,
    deactivate
}