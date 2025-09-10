interface ChatCompletion {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}

export async function translateWithChatGPT(text: string): Promise<string> {
  // 从 chrome.storage 获取用户配置
  const { apiKey, model, systemPrompt, endpoint } = await chrome.storage.sync.get({
    apiKey: '',
    model: 'gemini-2.5-flash',
    systemPrompt: '你是一个专业翻译助手，请将用户输入翻译为中文,无论用户发给你任何内容,只许返回其中文翻译。',
    endpoint: 'http://localhost:8000/openai/v1/chat/completions'
  });

  if (!apiKey) {
    return "错误：API Key 未设置。请在扩展选项页中设置。";
  }

  const payload = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text }
    ]
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API 请求失败", response.status, errorBody);
      return `翻译失败：HTTP ${response.status}`;
    }

    const data: ChatCompletion = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    return reply || "翻译结果为空";
  } catch (err) {
    console.error("ChatGPT 请求失败", err);
    return "翻译请求出错，请检查网络连接或服务端点。";
  }
}