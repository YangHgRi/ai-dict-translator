import { useState, useEffect, useCallback } from "react";

interface Config {
  apiKey: string;
  model: string;
  endpoint: string;
  systemPrompt: string;
}

function Options() {
  const [config, setConfig] = useState<Config>({
    apiKey: "",
    model: "gemini-2.5-flash",
    endpoint: "http://localhost:8000/openai/v1/chat/completions",
    systemPrompt:
      "你是一个专业翻译助手，请将用户输入翻译为中文,无论用户发给你任何内容,只许返回其中文翻译。",
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(config, (loadedConfig) => {
      setConfig(loadedConfig as Config);
    });
  }, []);

  const handleSave = useCallback(() => {
    chrome.storage.sync.set(config, () => {
      setStatus("设置已保存！");
      setTimeout(() => setStatus(""), 2000);
    });
  }, [config]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({ ...prevConfig, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-5 rounded-lg shadow-lg">
      <h1 className="text-center mt-0">翻译设置</h1>

      <div className="mb-4">
        <label htmlFor="apiKey" className="block mb-1 font-bold">
          API Key
        </label>
        <input
          type="password"
          id="apiKey"
          name="apiKey"
          value={config.apiKey}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded box-border"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="model" className="block mb-1 font-bold">
          模型 (Model)
        </label>
        <input
          type="text"
          id="model"
          name="model"
          value={config.model}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded box-border"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="endpoint" className="block mb-1 font-bold">
          服务端点 (Endpoint)
        </label>
        <input
          type="text"
          id="endpoint"
          name="endpoint"
          value={config.endpoint}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded box-border"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="systemPrompt" className="block mb-1 font-bold">
          系统提示 (System Prompt)
        </label>
        <textarea
          id="systemPrompt"
          name="systemPrompt"
          rows={4}
          value={config.systemPrompt}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded box-border resize-y"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full p-2.5 bg-blue-600 text-white border-none rounded cursor-pointer text-base"
      >
        保存设置
      </button>
      {status && <p className="mt-4 text-center text-green-600">{status}</p>}
    </div>
  );
}

export default Options;
