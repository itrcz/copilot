import * as vscode from 'vscode';
import { config } from './config';

export const quickPickModel = async () => {
  const modelQuery = await vscode.window.showQuickPick(['GPT-3.5 Turbo 16K', 'GPT-4 128K $(sparkle)'], {
    title: 'Выбор модели'
  });
  if (modelQuery === undefined) {
    return false;
  }
  if (modelQuery.startsWith('GPT-4')) {
    config().setModel('gpt-4-turbo');
  } else {
    config().setModel('gpt-3.5-turbo');
  }
  return true;
};