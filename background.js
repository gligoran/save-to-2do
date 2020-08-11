const contextMenuId = 'save-to-2do';

chrome.contextMenus.create({
  id: contextMenuId,
  title: 'Save to 2Do',
  contexts: ['page', 'selection', 'link']
});

function saveTo2do(task) {
  const url = task.name
    ? `twodo://x-callback-url/add?forList=inbox&edit=1&useQuickEntry=1&task=${encodeURIComponent(task.name)}&action=url:${encodeURIComponent(task.url)}`
    : `twodo://x-callback-url/add?forList=inbox&edit=1&useQuickEntry=1&task=${encodeURIComponent(task.url)}`;

  chrome.tabs.create({
    url,
    active: false
  });
}

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript(
    tab.tabId,
    { file: 'tabinfo.js' },
    function (result) {
      if (result && result.length) {
        saveTo2do(result[0]);
      } else {
        saveTo2do({
          name: window.getSelection().toString() || document.title,
          url: window.location.toString()
        });
      }
    }
  );
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === contextMenuId) {
    const task = {
      name: info.selectionText || tab.title,
      url: info.linkUrl || info.pageUrl
    };
    saveTo2do(task);
  }
});
