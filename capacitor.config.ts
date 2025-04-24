import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.recipefinder',
  appName: 'Recipe Finder',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Share: {
      // Share plugin configuration
    }
  }
};

export default config;
