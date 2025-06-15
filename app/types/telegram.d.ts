declare global {
  interface TelegramWebApp {
    expand(): void;
    close(): void;
    MainButton: {
      text: string;
      onClick: (callback: () => void) => void;
      show(): void;
      hide(): void;
    };
  }

  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

export {}; 