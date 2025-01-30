import {AppSchema} from './ItemSchema';
import {
  AbstractPowerSyncDatabase,
  PowerSyncDatabase,
} from '@powersync/react-native';

import {AUTH_TOKEN, POWERSYNC_ENDPOINT} from '@env';

const powerSync = new PowerSyncDatabase({
  schema: AppSchema,
  database: {
    dbFilename: 'powersync.db',
  },
});

powerSync.init();

class Connector {
  async fetchCredentials() {
    return {
      endpoint: POWERSYNC_ENDPOINT,
      token: AUTH_TOKEN,
    };
  }
  async uploadData(database: AbstractPowerSyncDatabase) {
    console.log('Uploading data');
  }
}

export const setupPowerSync = (): PowerSyncDatabase => {
  const connector = new Connector();
  powerSync.connect(connector);
  return powerSync;
};

export const resetPowerSync = async () => {
  await powerSync.disconnectAndClear();
  setupPowerSync();
};
