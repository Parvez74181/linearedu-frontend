declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Bunny CDN
      BUNNYCDN_API_KEY: string; // Our password
      BUNNYCDN_STORAGE_ZONE: string; // Storage zone name
      BUNNY_STORAGE_API_HOST: string; // Storage zone host, e.g., storage.bunnycdn.com
      BUNNY_PULL_ZONE_URL: string; // CDN, e.g., corneatest.b-cdn.net
      JWT_SECRET: string;
      DATABASE_URL: string;
      DATA_FETCH_LIMIT: number;
      API_V1: string; // Base URL for API version 1
      NEXT_PUBLIC_API_V1: string; // Base URL for API version 1
    }
  }
}

export {};
