import { useState, useCallback } from 'react';
import { translateWithChatGPT } from './services/translator';
import './App.css';

// 临时的词典查询占位符
async function lookupDictionary(word: string): Promise<string> {
  console.log("Dictionary lookup for:", word);
  return `词典占位解释：${word}`;
}

function App() {
  const [query, setQuery] = useState('');
  const [translation, setTranslation] = useState('—');
  const [definition, setDefinition] = useState('—');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setTranslation('翻译中...');
    setDefinition('查询中...');

    try {
      const [transResult, defResult] = await Promise.all([
        translateWithChatGPT(query),
        lookupDictionary(query)
      ]);
      setTranslation(transResult);
      setDefinition(defResult);
    } catch (error) {
      console.error("翻译或查询失败", error);
      setTranslation('翻译失败');
      setDefinition('查询失败');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // TODO: 实现 mdict-js 加载逻辑
    console.log("加载词典文件:", file.name);
    alert("词典加载成功！(占位符)");
  }, []);

  return (
    <div className="app-container">
      <h2>🔍 AI Translator + MDX</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入词语或句子..."
        disabled={isLoading}
      />
      <button onClick={handleTranslate} disabled={isLoading}>
        {isLoading ? '处理中...' : '翻译'}
      </button>

      <div className="result-area">
        <h3>翻译结果</h3>
        <p>{translation}</p>

        <h3>词典解释</h3>
        <p>{definition}</p>
      </div>

      <hr />
      <label htmlFor="mdxUpload">📘 导入 MDX 词典：</label>
      <input type="file" id="mdxUpload" accept=".mdx" onChange={handleFileUpload} />
    </div>
  );
}

export default App;
