chrome.storage.local.get(['lastCheckedUrl'], function (result) {
    if (result.lastCheckedUrl) {
      fetch(`http://localhost:5050/api/checked?url=${result.lastCheckedUrl}`)
        .then(response => response.json())
        .then(data => {
          const popupContent = document.getElementById('popup-content');
          popupContent.innerHTML = `
            <div class="${data.checked ? 'safe' : 'warning'}">
              ${data.checked ? 'The link is safe.' : 'Warning: The link may be dangerous!'}
              <p>${data.message}</p>
            </div>
          `;
        });
    }
  });
  
document.getElementById('close-popup').addEventListener('click', function () {
  window.close();
});
  
document.getElementById('save').addEventListener('click', () => {
  // Get the selected safety level from the dropdown
  const safetyLevel = document.getElementById('safetyLevel').value;

  console.log('Safety level selected:', safetyLevel); // Debugging statement

  // Save the selected safety level in Chrome's storage
  chrome.storage.local.set({ protectionLevel: safetyLevel }, () => {
      console.log('Safety level saved:', safetyLevel); // Debugging statement
      alert('Safety level saved. It will be applied to the next URL check.');
  });
});

chrome.storage.local.get(['protectionLevel'], function(result) {
  console.log('Stored protection level:', result.protectionLevel);
});

