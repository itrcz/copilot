import axios from "axios";
import { config } from "./config";

export const requestGPTunnel = async (prompt: string) => {
  const defaultSystemPrompt = "You writing code blocks, do not explain unless I ask you, just write code in the code block";
  const { endpoint, apiKey, model = "gpt-3.5-turbo",  systemPrompt } = config();

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
    return `\n${res[1]}`;
  }
  return `\n${content}`;
};

export const checkApiKeyFormat = (apiKey: string) => {
  return !(apiKey.length !== 32 || !apiKey.startsWith('shds-'));
};