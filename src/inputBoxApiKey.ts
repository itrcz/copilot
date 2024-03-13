import * as vscode from 'vscode';
import { config } from './config';
import { checkApiKeyFormat } from './gptunnel';

export const inputBoxApiKey = async () => {
  const apiKeyQuery = await vscode.window.showInputBox({
    placeHolder: "shds-**********************",
    title: "Введите API ключ",
    prompt: "Можно получить на https://gptunnel.ru",
  });
  if (apiKeyQuery === undefined) {
    return false;
  }
  if (!checkApiKeyFormat(apiKeyQuery)) {
    vscode.window.showErrorMessage('API ключ не соответвует формату сайта https://gptunnel.ru');
    return false;
  }
  config().setApiKey(apiKeyQuery);
  return true;
};