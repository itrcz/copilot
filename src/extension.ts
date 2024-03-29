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

      let insertText = '';
      let prompt = '';

      try {
        
        if (selectedText) {
          prompt += `Code fragment:\n\`\`\`${editor.document.languageId ||''}\n${selectedText}\`\`\``;
        }

        if (searchQuery) {
          if (prompt) {
            prompt += `\n`;
          }
          prompt += `Instruction: ${searchQuery}`;
          if (!selectedText && editor.document.languageId) {
            prompt += `, use ${editor.document.languageId}.`;
          }
        }

        insertText = await requestGPTunnel(
          {
            prompt,
            codeFragment: !!selectedText,
            instruction: !!searchQuery,
          }
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
        vscode.commands.executeCommand('editor.action.formatDocument');
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
