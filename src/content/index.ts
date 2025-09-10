console.log("Content script loaded.");

document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection()?.toString().trim();
  if (selectedText) {
    console.log("Selected text:", selectedText);
    chrome.runtime.sendMessage({ type: "translate", text: selectedText });
  }
});
