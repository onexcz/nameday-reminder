declare namespace google.accounts.oauth2 {
  interface TokenClient {
    requestAccessToken(): void;
  }

  function initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (response: { error?: string }) => void;
  }): TokenClient;
}

declare namespace gapi.client {
  function init(config: {
    apiKey: string;
    discoveryDocs: string[];
  }): Promise<void>;

  namespace calendar.events {
    function insert(params: {
      calendarId: string;
      resource: any;
    }): Promise<any>;
  }

  namespace tasks {
    namespace tasklists {
      function list(): Promise<{
        result: {
          items?: Array<{ id: string }>;
        };
      }>;
    }
    namespace tasks {
      function insert(params: {
        tasklist: string;
        resource: any;
      }): Promise<any>;
    }
  }
}

declare const gapi: {
  load(api: string, callback: () => void): void;
  client: typeof gapi.client;
}; 