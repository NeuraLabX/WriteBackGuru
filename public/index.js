document.getElementById('saveSettings').addEventListener('click', function() {
    const selectedWorksheet = document.getElementById('worksheetSelect').value;
    const inputFields = document.querySelectorAll('.input-field');

    const settings = {
        selectedWorksheet,
        fields: Array.from(inputFields).map(input => ({
            id: input.id,
            value: input.value
        }))
    };

    tableau.extensions.settings.set('writebackSettings', JSON.stringify(settings));

    tableau.extensions.settings.saveAsync().then(() => {
        console.log('Settings saved');
    }).catch(err => {
        console.error('Error saving settings', err);
    });
});

tableau.extensions.initializeAsync().then(() => {
    const settings = JSON.parse(tableau.extensions.settings.get('writebackSettings') || '{}');

    if (settings.selectedWorksheet) {
        document.getElementById('worksheetSelect').value = settings.selectedWorksheet;
    }

    if (settings.fields) {
        settings.fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input) {
                input.value = field.value;
            }
        });
    }

    tableau.extensions.dashboardContent.dashboard.worksheets.forEach(worksheet => {
        const option = document.createElement('option');
        option.value = worksheet.name;
        option.text = worksheet.name;
        document.getElementById('worksheetSelect').appendChild(option);
    });

    document.getElementById('worksheetSelect').value = settings.selectedWorksheet;
});
