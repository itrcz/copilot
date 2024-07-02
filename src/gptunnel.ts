import axios from "axios";
import { config } from "./config";

type Options = {
  prompt: string
  codeFragment?: boolean,
  instruction?: boolean
};
export const requestGPTunnel = async (otp: Options) => {
  const { prompt, codeFragment, instruction } = otp;
  let defaultSystemPrompt = "";
  if (instruction) {
    defaultSystemPrompt = "I give you instruction.\n";
  }
  if (codeFragment) {
    defaultSystemPrompt = "I give you code fragment. You will return modified code fragment in code block.\n";
  } else {
    defaultSystemPrompt = "You need return code in code block.\n";
  }
  defaultSystemPrompt = 'Do not explain unless I ask.';

  const { endpoint, apiKey, model = "gpt-3.5-turbo", useWalletBalance, systemPrompt } = config();

  const result = await axios({
    method: 'POST',
    url: `${endpoint}chat/completions`,
    headers: {
      Authorization: apiKey,
    },
    data: {
      model,
      useWalletBalance,
      messages: [
        {
          role: "system",
          content: systemPrompt || defaultSystemPrompt,
        },
        {
          role: "user",
          content: prompt
        },
      ],
    },
  });
  const content = String(result.data.choices[0].message.content);
  const codeBlockRegex = /```(?:\w+)?\s*([\s\S]*?)\s*```/g;
  const res = codeBlockRegex.exec(content);
  if (res?.[1]) {
    return `${res[1].trim()}`;
  }
  return `${content.trim()}`;
};

export const checkApiKeyFormat = (apiKey: string) => {
  return !(apiKey.length !== 32 || !apiKey.startsWith('shds-'));
};