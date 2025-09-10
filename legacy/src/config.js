const CHATGPT_CONFIG = {
  endpoint: "http://localhost:8000/openai/v1/chat/completions", // ← 替换为你的 ChatGPT 端点
  apiKey: "sk-YangHgRi", // ← 替换为你的 API Key
  model: "gemini-2.5-flash",
  systemPrompt: "你是一个专业翻译助手，请将用户输入翻译为中文,无论用户发给你任何内容,只许返回其中文翻译。"
};
