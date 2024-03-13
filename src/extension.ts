import * as vscode from 'vscode';
import { config } from './config';
import { inputBoxApiKey } from './inputBoxApiKey';
import { quickPickModel } from './quickPickModel';
import { checkApiKeyFormat, requestGPTunnel } from './gptunnel';
import { quickPickWallet } from './quickPickWallet';

export function activate(context: vscode.ExtensionContext) {

  const promptDisposable = vscode.commands.registerCommand('copilot-gptunnel.prompt', async function () {
    const { apiKey, model } = config();

    if (!checkApiKeyFormat(apiKey)) {
      if (!await inputBoxApiKey()) {
        return;
      }
    }

    if (!model) {
      if (!await quickPickModel()) {
        return;
      }
    }

    let editor = vscode.window.activeTextEditor;
    let selectedText = '';
    if (editor) {
      const selection = editor.selection;
      let selectionRange: vscode.Range;
      if (selection && !selection.isEmpty) {
        selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
        selectedText = editor.document.getText(selectionRange);
      }
      const searchQuery = await vscode.window.showInputBox({
        placeHolder: "исправить ошибку / оптимизировать / написать",
        title: "Что нужно сделать?",
        prompt: "Copilot от gptunnel.ru",
      });

      if (searchQuery === undefined) {
        return;
      }

      if (!searchQuery && !selectedText) {
        vscode.window.showErrorMessage('Запрос не может быть пустым');
        return;
      }

      const decorationType = vscode.window.createTextEditorDecorationType({
        after: {
          contentText: '🤖 Думает...',
          margin: '0 0 0 1em'
        }
      });
      editor.setDecorations(decorationType, [new vscode.Range(selection.start, selection.start)]);

      const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
      status.text = "$(copilot) gptunnel.ru $(sync~spin)";
      status.show();

      let insertText = `use ${(editor.document.languageId || 'codeblock')}\n`;

      try {
        let prompt = '';
        if (searchQuery) {
          prompt += `${searchQuery}\n`;
        }
        if (selectedText) {
          prompt += selectedText;
        }

        insertText = await requestGPTunnel(
          prompt,
        );
      } catch (err: any) {
        vscode.window.showErrorMessage(err.toString());
      } finally {
        decorationType.dispose();
        status.dispose();
      }

      if (insertText) {
        editor.edit(editBuilder => {
          if (selectionRange) {
            editBuilder.replace(selectionRange, insertText);
          } else {
            editBuilder.insert(selection.start, insertText);
          }
        });
      }
    }
  });

  const setUpApiKeyDisposable = vscode.commands.registerCommand('copilot-gptunnel.setUpApiKey', async function () {
    await inputBoxApiKey();
  });
  
  const setUpModalDisposable = vscode.commands.registerCommand('copilot-gptunnel.setUpModel', async function () {
    await quickPickModel();
  });

  const setUpWalletDisposable = vscode.commands.registerCommand('copilot-gptunnel.setUpWallet', async function () {
    await quickPickWallet();
  });

  context.subscriptions.push(promptDisposable);
  context.subscriptions.push(setUpApiKeyDisposable);
  context.subscriptions.push(setUpModalDisposable);
  context.subscriptions.push(setUpWalletDisposable);
}

export function deactivate() { }
