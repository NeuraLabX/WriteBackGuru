// src/utils/config.ts

export function saveConfig(key: string, value: any): void {
    tableau.extensions.settings.set(key, value);
    tableau.extensions.settings.saveAsync().then(() => {
        console.log('Settings saved');
    }).catch(err => {
        console.error('Error saving settings', err);
    });
}

export function getConfig(key: string): any {
    return tableau.extensions.settings.get(key);
}
