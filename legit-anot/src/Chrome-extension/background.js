chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Check if the tab has finished loading
    console.log("it run");
    if (changeInfo.status === 'complete') {
        const url = tab.url;
        console.log("Checking URL:", url);

        // Fetch URL to check
        try {
            const response = await fetch(`http://localhost:5050/api/check-url?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (data.block) {
                // Show a warning notification
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: () => {
                        alert('Warning: This URL is flagged as unsafe.');
                    }
                });
                // Optionally, you can log or handle the information as needed
                console.log(`Warning: ${url} is flagged as unsafe.`);
            }
        } catch (error) {
            console.error('Error fetching URL data:', error);
        }
    }
});