import * as vscode from 'vscode';

const CFG_APIKEY = 'copilotGpt.settings.apiKey';
const CFG_MODEL = 'copilotGpt.settings.model';


export const config = () => {
  let all = vscode.workspace.getConfiguration();
  let apiKey = all.get<string>(CFG_APIKEY) || '';
  let model = all.get<string>(CFG_MODEL) || '';
  return {
    endpoint: 'https://gptunnel.ru/v1/',
    apiKey,
    model,
    setApiKey: (value: string) => {
      all.update(CFG_APIKEY, value, true);

    },
    setModel: (value: string) => {
      all.update(CFG_MODEL, value, true);
    }
  };
};