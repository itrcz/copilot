import axios from "axios";
import { config } from "./config";

type Options = {
  system: string
  prompt: string
};

export const requestGPTunnel = async (opt: Options) => {
  const { endpoint, apiKey, model = "gpt-3.5-turbo" } = config();

  const result = await axios({
    method: 'POST',
    url: `${endpoint}chat/completions`,
    headers: {
      Authorization: apiKey,
    },
    data: {
      model,
      messages: [
        {
          role: "system",
          content: opt.system,
        },
        {
          role: "user",
          content: opt.prompt
        },
      ],
    },
  });
  const content = String(result.data.choices[0].message.content);
  const codeBlockRegex = /```(?:\w+)?\s*([\s\S]*?)\s*```/g;
  const res = codeBlockRegex.exec(content);
  if (res?.[1]) {
    return `\n${res[1]}`;
  }
  return `\n${content}`;
};

export const checkApiKeyFormat = (apiKey: string) => {
  return !(apiKey.length !== 32 || !apiKey.startsWith('shds-'));
};