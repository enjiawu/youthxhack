chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "showWarning") {
      let warningDiv = document.createElement('div');
      warningDiv.style.position = 'fixed';
      warningDiv.style.top = '0';
      warningDiv.style.left = '0';
      warningDiv.style.width = '100%';
      warningDiv.style.backgroundColor = '#ffdddd';
      warningDiv.style.color = '#a00';
      warningDiv.style.textAlign = 'center';
      warningDiv.style.padding = '10px';
      warningDiv.style.zIndex = '1000';
      warningDiv.innerHTML = `<strong>Warning:</strong> This site might be unsafe. <a href="${request.url}" target="_blank">Proceed anyway</a> or <a href="javascript:window.history.back();">Go back</a>`;
      
      document.body.prepend(warningDiv);
    }
  });
 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { 
    if (request.type === "blockSite") { 
        const userConfirmed = confirm( 
            `This site is considered unsafe (Score: ${request.score}). Do you want to continue?` 
        ); 
  
        if (!userConfirmed) { 
            window.location.href = "about:blank"; // Redirect to blank page 
        }
  
        // Optionally, redirect to your dashboard for more details 
        const viewMore = confirm("Would you like to see more details?"); 
        if (viewMore) { 
            window.location.href = `http://localhost:3000/${request.url}`; 
        } 
    } 
}); 
  
  