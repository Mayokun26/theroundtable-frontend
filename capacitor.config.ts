import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.theroundtable.app',
  appName: 'The Round Table',
  webDir: 'out',
  server: {
    allowNavigation: ['api.theroundtableai.com']
  }
};

export default config;
