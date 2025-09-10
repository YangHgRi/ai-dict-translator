chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "translate") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: showFloatingPopup,
      args: [msg.text]
    });
  }
});

function showFloatingPopup(text) {
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "20px";
  popup.style.background = "#fff";
  popup.style.border = "1px solid #ccc";
  popup.style.padding = "10px";
  popup.style.zIndex = 9999;
  popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  popup.innerHTML = `
    <strong>选中词：</strong> ${text}<br/>
    <em>翻译功能尚未注入</em>
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 5000);
}


chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "processSelectedText",
    title: "AI翻译",
    contexts: ["selection"]
  });
});


function registerMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "translate-selection",
      title: "AI翻译选中文本",
      contexts: ["selection"]
    });
  });
}

chrome.runtime.onInstalled.addListener(registerMenu);
chrome.runtime.onStartup.addListener(registerMenu);

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "translate-selection" || !info.selectionText) return;

  const translated = await translateWithChatGPT(info.selectionText);

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (original, result) => {
      alert(`原文：${original}\n翻译：${result}`);
    },
    args: [info.selectionText, translated]
  });
});
