import * as vscode from 'vscode';
import { config } from './config';

export const quickPickWallet = async () => {
  const query = await vscode.window.showQuickPick(['Личный счет', 'Счет организации'], {
    title: 'Выбор счета для оплаты'
  });
  if (query === undefined) {
    return false;
  }
  config().setUseWalletBalance(query.startsWith('Личный'));
  return true;
};