// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "magic-right" is now active!');

    /**
     * @param {string} folderPath
     * @param {string} name
     */
    function createComponent(
        folderPath,
        name,
        extension = 'jsx',
        css_extension = 'scss'
    ) {
        const componentName =
            name.charAt(0).toLocaleUpperCase() + name.slice(1);
        const src = path.resolve(__dirname, 'template/component.txt');
        const dest = folderPath + '/' + componentName + '/';
        const template = fs.readFileSync(src, { encoding: 'utf-8' });

        if (fs.existsSync(dest)) {
            console.log(
                `${componentName} already exists, please choose another name.`
            );
            vscode.window.showInformationMessage(`${componentName} 已存在`);
            return;
        }

        fs.mkdirSync(dest);
        fs.writeFileSync(path.resolve(`${dest}/index.${css_extension}`), '');
        fs.writeFileSync(
            path.resolve(`${dest}/index.${extension}`),
            template
                .replace(/ComponentName/g, componentName)
                .replace(/\[cssExtension\]/, css_extension)
        );
        vscode.window.showInformationMessage(
            `创建 ${componentName} successfully !!!`
        );
    }

    let cfc = vscode.commands.registerCommand(
        'magic-right.createFunctionalComponent',
        function (param) {
            const folderPath = param.fsPath;
            const options = {
                prompt: 'Please input the component name: ',
                placeHolder: 'Component Name',
            };

            const jsExtension = vscode.workspace
                .getConfiguration('magicRight')
                .get('jsExtension');
            const cssExtension = vscode.workspace
                .getConfiguration('magicRight')
                .get('cssExtension');
            vscode.window.showInputBox(options).then((value) => {
                if (!value) return;
                createComponent(folderPath, value, jsExtension, cssExtension);
            });
        }
    );

    context.subscriptions.push(cfc);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
