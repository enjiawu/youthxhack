document.addEventListener('DOMContentLoaded', function () {
    const safetyLevelSelect = document.getElementById('safetyLevel');
    const saveButton = document.getElementById('save');

    // Load the current safety level from storage
    chrome.storage.sync.get(['safetyLevel'], function (data) {
        safetyLevelSelect.value = data.safetyLevel || 'medium'; // Default to medium if not set
    });

    // Save the selected safety level
    saveButton.addEventListener('click', function () {
        const selectedLevel = safetyLevelSelect.value;
        chrome.storage.sync.set({ safetyLevel: selectedLevel }, function () {
            alert('Settings saved');
        });
    });
});