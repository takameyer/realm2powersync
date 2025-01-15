import {AppSchema} from './ItemSchema';
import {
  AbstractPowerSyncDatabase,
  PowerSyncDatabase,
} from '@powersync/react-native';

import {AUTH_TOKEN, POWERSYNC_ENDPOINT, BACKEND_ENDPOINT} from '@env';

let viewAll = false;
let connection = true;

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
    const batch = await database.getCrudBatch();

    if (batch === null) {
      return;
    }

    console.log('Uploading data', batch.crud);

    const result = await fetch(`${BACKEND_ENDPOINT}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batch.crud),
    });

    if (!result.ok) {
      throw new Error('Failed to upload data');
    }

    batch.complete();
  }
}

export const setupPowerSync = (): PowerSyncDatabase => {
  const connector = new Connector();
  powerSync.connect(connector, {params: {view_all: viewAll}});
  return powerSync;
};

export const resetPowerSync = async () => {
  await powerSync.disconnectAndClear();
  setupPowerSync();
};

export const toggleViewAll = () => {
  viewAll = !viewAll;
  resetPowerSync();
};

export const toggleConnection = () => {
  if (connection) {
    powerSync.disconnect();
  } else {
    setupPowerSync();
  }
  connection = !connection;
};
