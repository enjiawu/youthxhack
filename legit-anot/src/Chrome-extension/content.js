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

document.addEventListener('click', function (event) {
  const target = event.target;
  if (target.tagName === 'A') {
    const url = target.href;

    chrome.runtime.sendMessage({ action: 'checkLink', url: url }, function (response) {
      if (!response.safe) {
        alert('This link may be dangerous: ' + response.message);
        event.preventDefault();  // Prevent the default action (e.g., navigating to the link)
      }
    });
  }
});
  