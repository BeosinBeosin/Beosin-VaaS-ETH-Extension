const WebView = require('../vscode/vscode.webview');
const { Executor, Handler } = require('../vscode/vscode.message')
const { vaas, installVaas } = require('./vaas.utils');
const pkg = require('./vaas.package');

class VaasExecutor extends Executor {
    constructor() {
        super();
        this.vaasStart = vaas.start;
        this.vaasEnd = vaas.end;
        this.vaasSettingRead = vaas.settingRead;
        this.vaasSettingUpdate = vaas.settingUpdate;
        this.installCompiler = ({}) => {
            return installVaas();
        };
        this.installedCompilers = ({}) => {
            return new Promise((resolve, reject) => {
                const installed = [];
                const uninstalled = [];
                pkg.solcPackages.forEach(item => {
                    item.isPending ? uninstalled.push(item.version) : installed.push(item.version);
                });
                resolve({ installed, uninstalled });
            });
        }
    }
}

class VaasWebView extends WebView {
    constructor(name) {
        super(name, new Handler([new VaasExecutor()]));
    }
}

module.exports = VaasWebView;