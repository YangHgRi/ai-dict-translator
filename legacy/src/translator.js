async function translateWithChatGPT(text) {
  const { endpoint, apiKey, model, systemPrompt } = CHATGPT_CONFIG;

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

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    return reply || "翻译失败";
  } catch (err) {
    console.error("ChatGPT 请求失败", err);
    return "翻译请求出错";
  }
}
