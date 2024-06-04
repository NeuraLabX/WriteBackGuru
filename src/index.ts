import { initialize, showChooseSheetDialog, showErrorDialog } from './utils/tableau';
import { setupUI } from './utils/ui';

document.addEventListener('DOMContentLoaded', () => {
  require(['tableau'], (tableau) => {
    tableau.extensions.initializeAsync().then(() => {
      setupUI();
      showChooseSheetDialog();
    }).catch(error => {
      showErrorDialog(error.message);
    });
  });
});
