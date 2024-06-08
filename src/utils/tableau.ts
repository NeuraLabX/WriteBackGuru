// Import the tableau module
import { extensions as tableau } from 'tableau';

export const initialize = async () => {
    await tableau.initializeAsync();
};

export const showChooseSheetDialog = () => {
    console.log("Choose Sheet Dialog Shown");
};

export const showErrorDialog = (message: string) => {
    console.error("Error: ", message);
};
