// Import the tableau module
import { extensions as tableau } from 'tableau';

export function saveConfig(key: string, value: any): void {
    tableau.settings.set(key, value);
    tableau.settings.saveAsync().then(() => {
        console.log('Settings saved');
    }).catch((err: any) => {
        console.error('Error saving settings', err);
    });
}

export function getConfig(key: string): any {
    return tableau.settings.get(key);
}
