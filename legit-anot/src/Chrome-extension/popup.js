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
  