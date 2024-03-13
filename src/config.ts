import * as vscode from 'vscode';

const CFG_APIKEY = 'copilotGpt.settings.apiKey';
const CFG_MODEL = 'copilotGpt.settings.model';
const CFG_WALLET = 'copilotGpt.settings.useWalletBalance';
const CFG_SYS_PROMPT = 'copilotGpt.settings.systemPrompt';

export const config = () => {
  let all = vscode.workspace.getConfiguration();
  let apiKey = all.get<string>(CFG_APIKEY) || '';
  let model = all.get<string>(CFG_MODEL) || '';
  let useWalletBalance = all.get<string>(CFG_WALLET) || '';
  let systemPrompt = all.get<string>(CFG_SYS_PROMPT) || '';

  return {
    endpoint: 'https://gptunnel.ru/v1/',
    apiKey,
    model,
    useWalletBalance,
    systemPrompt,
    setApiKey: (value: string) => {
      all.update(CFG_APIKEY, value, true);
    },
    setModel: (value: string) => {
      all.update(CFG_MODEL, value, true);
    },
    setUseWalletBalance: (value: boolean) => {
      all.update(CFG_WALLET, value, true);
    }
  };
};