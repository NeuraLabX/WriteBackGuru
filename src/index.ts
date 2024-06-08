import { initialize, showChooseSheetDialog, showErrorDialog } from './utils/tableau';
import { setupUI } from './utils/ui';

// Listen for the DOMContentLoaded event to initialize the extension
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { extensions: tableau } = await import('tableau'); // Dynamically import the tableau module
    await tableau.initializeAsync(); // Initialize Tableau extensions
    setupUI();
    showChooseSheetDialog();
  } catch (error: unknown) { // Explicitly type error as unknown
    if (error instanceof Error) { // Narrow down the error type
      showErrorDialog(error.message);
    } else {
      showErrorDialog('An unknown error occurred');
    }
  }
});
