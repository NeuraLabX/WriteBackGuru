declare module 'tableau' {
  const extensions: {
    initializeAsync(): Promise<void>;
    settings: {
      set(key: string, value: any): void;
      get(key: string): any;
      saveAsync(): Promise<void>;
    };
    dashboardContent: any;
  };
  export { extensions };
}
