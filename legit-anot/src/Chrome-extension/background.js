chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed and background service worker started.");

    // Example rule: Block requests to example.com
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
            {
                id: 1,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*://example.com/*',
                    resourceTypes: ['main_frame']
                }
            }
        ],
        removeRuleIds: [1]
    }).then(() => {
        console.log("Rules updated.");
    }).catch((error) => {
        console.error("Failed to update rules:", error);
    });
});