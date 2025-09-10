document.getElementById("translateBtn").addEventListener("click", async () => {
  const inputText = document.getElementById("queryInput").value.trim();
  if (!inputText) return;

  const translation = await translateWithChatGPT(inputText);
  document.getElementById("translationOutput").textContent = translation;

  const definition = await lookupDictionary(inputText);
  document.getElementById("dictOutput").textContent = definition;
});

let mdxDict = null;

document.getElementById("mdxUpload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  // TODO: 使用 mdict-js 加载词典
  mdxDict = { lookup: (word) => `词典占位解释：${word}` };
  alert("词典加载成功！");
});

async function lookupDictionary(word) {
  if (!mdxDict) return "词典未加载";
  const result = mdxDict.lookup(word);
  return result || "未找到词条";
}
