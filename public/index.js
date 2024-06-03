document.getElementById('saveSettings').addEventListener('click', function() {
    const setting1 = document.getElementById('setting1').value;
    const setting2 = document.getElementById('setting2').value;
    const worksheet = document.getElementById('worksheetSelect').value;

    tableau.extensions.settings.set('setting1', setting1);
    tableau.extensions.settings.set('setting2', setting2);
    tableau.extensions.settings.set('worksheet', worksheet);

    tableau.extensions.settings.saveAsync().then(() => {
        console.log('Settings saved');
    }).catch(err => {
        console.error('Error saving settings', err);
    });
});

// Initialize the extension and fetch existing settings
tableau.extensions.initializeAsync().then(() => {
    const setting1 = tableau.extensions.settings.get('setting1') || '';
    const setting2 = tableau.extensions.settings.get('setting2') || '';
    const worksheet = tableau.extensions.settings.get('worksheet') || '';

    document.getElementById('setting1').value = setting1;
    document.getElementById('setting2').value = setting2;

    // Populate worksheet selection
    const dashboard = tableau.extensions.dashboardContent.dashboard;
    dashboard.worksheets.forEach(worksheet => {
        const option = document.createElement('option');
        option.value = worksheet.name;
        option.text = worksheet.name;
        if (worksheet.name === worksheet) {
            option.selected = true;
        }
        document.getElementById('worksheetSelect').appendChild(option);
    });
});
