import * as vscode from 'vscode';
import { config } from './config';

export const quickPickModel = async () => {
  const modelQuery = await vscode.window.showQuickPick(['GPT-3.5 Turbo', 'GPT-4o $(sparkle)', 'Sonnet 3.5'], {
    title: 'Выбор модели'
  });
  if (modelQuery === undefined) {
    return false;
  }
  if (modelQuery.startsWith('Sonnet')) {
    config().setModel('claude-3.5-sonnet');
  } if (modelQuery.startsWith('GPT-4')) {
    config().setModel('gpt-4o');
  } else {
    config().setModel('gpt-3.5-turbo');
  }
  return true;
};