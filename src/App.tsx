import { useState, useCallback } from "react";
import { translateWithChatGPT } from "./services/translator";

function App() {
  const [query, setQuery] = useState("");
  const [translation, setTranslation] = useState("—");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setTranslation("翻译中...");

    try {
      const [transResult] = await Promise.all([translateWithChatGPT(query)]);
      setTranslation(transResult);
    } catch (error) {
      console.error("翻译或查询失败", error);
      setTranslation("翻译失败");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <div className="flex flex-col gap-2 font-sans p-2.5 w-[300px] m-0">
      <h2 className="m-0 mb-2 text-lg text-center">🔍 AI Translator</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入词语或句子..."
        disabled={isLoading}
        className="w-full p-1.5 box-border"
      />
      <button
        onClick={handleTranslate}
        disabled={isLoading}
        className="w-full p-2 bg-blue-600 text-white border-none cursor-pointer rounded disabled:bg-gray-300"
      >
        {isLoading ? "处理中..." : "翻译"}
      </button>

      <div className="mt-2.5">
        <h3 className="mb-1 text-sm text-gray-800">翻译结果</h3>
        <p className="text-xs bg-gray-100 p-2 rounded m-0 min-h-[1em]">
          {translation}
        </p>
      </div>
    </div>
  );
}

export default App;
