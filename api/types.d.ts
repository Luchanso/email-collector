declare global {
    namespace NodeJS {
      interface ProcessEnv {
        GOOGLE_API_KEY?: string;
        SPREADSHEET_ID?: string;
      }
    }
  }