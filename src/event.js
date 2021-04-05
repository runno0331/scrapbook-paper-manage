chrome.runtime.onInstalled.addListener(function(){
    const parent = chrome.contextMenus.create({
        'id': 'parent',
        'title': 'scrapboxにページを保存',
        'documentUrlPatterns' : ["*://*.arxiv.org/abs/*"]
    });
    chrome.contextMenus.create({
        'id': 'arxiv',
        'parentId': 'parent',
        'title': 'arXiv',
        'documentUrlPatterns' : ["*://*.arxiv.org/abs/*"]
    });
});

chrome.contextMenus.onClicked.addListener(function(item, tab, a){
    if(item.menuItemId === 'arxiv'){
        chrome.tabs.sendMessage(tab.id, {from: 'background', site: 'arxiv'}, null)
    }
})
