importScripts('linkSafetyUtil.js'); // Import the algorithm 

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const url = tab.url;

        // Fetch URL to check
        try {
            const response = await fetch(`http://localhost:5050/api/check-url?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (data.block) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: () => {
                        alert('Warning: This URL is flagged as unsafe.');
                    }
                });
                console.log(`Warning: ${url} is flagged as unsafe.`);
            }
        } catch (error) {
            console.error('Error fetching URL data:', error);
        }
    }
});

// Event listener for web requests 
chrome.webRequest.onBeforeRequest.addListener(
    async function(details) {
        const url = details.url;

        // Use your LinkAuthentication algorithm to evaluate the URL 
        const score = await getSafetyScore(url); // Ensure this function is async if needed

        // Get user-selected protection level from storage
        chrome.storage.local.get(['protectionLevel'], function(result) {
            let threshold = 50; // Default value

            // Determine threshold based on user preference
            switch (result.protectionLevel) {
                case 'low':
                    threshold = 25;
                    break;
                case 'medium':
                    threshold = 50;
                    break;
                case 'high':
                    threshold = 70;
                    break;
                default:
                    threshold = 50; // Default medium
            }

            if (score < threshold) {
                chrome.tabs.sendMessage(details.tabId, {
                    type: "blockSite",
                    score: score,
                    url: url
                });
                return { cancel: true };
            } else {
                return { cancel: false };
            }
        });
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

chrome.action.onClicked.addListener(async (tab) => {
    if (tab && tab.url) {
        const urlToCheck = tab.url;

        // Use the getSafetyScore function to get the score
        const score = await getSafetyScore(urlToCheck);
        console.log(`Safety Score: ${score}`);

        chrome.storage.local.get(['protectionLevel'], function(result) {
            let threshold = 50; // Default value

            switch (result.protectionLevel) {
                case 'low':
                    threshold = 25;
                    break;
                case 'medium':
                    threshold = 50;
                    break;
                case 'high':
                    threshold = 70;
                    break;
                default:
                    threshold = 50; // Default medium
            }

            if (score < threshold) {
                alert(`The site ${urlToCheck} is considered dangerous (Score: ${score}).`);
                chrome.tabs.update(tab.id, { url: 'about:blank' });
            } else {
                alert(`The site ${urlToCheck} is safe to visit (Score: ${score}).`);
            }
        });
    } else {
        console.error("No active tab or tab URL found.");
    }
});
