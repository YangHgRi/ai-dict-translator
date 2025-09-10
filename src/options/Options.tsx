import { useState, useEffect, useCallback } from 'react';
import './Options.css';

interface Config {
  apiKey: string;
  model: string;
  endpoint: string;
  systemPrompt: string;
}

function Options() {
  const [config, setConfig] = useState<Config>({
    apiKey: '',
    model: 'gemini-2.5-flash',
    endpoint: 'http://localhost:8000/openai/v1/chat/completions',
    systemPrompt: '你是一个专业翻译助手，请将用户输入翻译为中文,无论用户发给你任何内容,只许返回其中文翻译。',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(config, (loadedConfig) => {
      setConfig(loadedConfig as Config);
    });
  }, []);

  const handleSave = useCallback(() => {
    chrome.storage.sync.set(config, () => {
      setStatus('设置已保存！');
      setTimeout(() => setStatus(''), 2000);
    });
  }, [config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prevConfig => ({ ...prevConfig, [name]: value }));
  };

  return (
    <div className="options-container">
      <h1>翻译设置</h1>

      <div className="form-group">
        <label htmlFor="apiKey">API Key</label>
        <input
          type="password"
          id="apiKey"
          name="apiKey"
          value={config.apiKey}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="model">模型 (Model)</label>
        <input
          type="text"
          id="model"
          name="model"
          value={config.model}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="endpoint">服务端点 (Endpoint)</label>
        <input
          type="text"
          id="endpoint"
          name="endpoint"
          value={config.endpoint}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="systemPrompt">系统提示 (System Prompt)</label>
        <textarea
          id="systemPrompt"
          name="systemPrompt"
          rows={4}
          value={config.systemPrompt}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSave}>保存设置</button>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
}

export default Options;