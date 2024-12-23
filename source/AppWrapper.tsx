import React from 'react';
import {App} from './App';
import {AppSchema} from './ItemSchema';
import {PowerSyncContext, PowerSyncDatabase} from '@powersync/react-native';

const powerSync = new PowerSyncDatabase({
  schema: AppSchema,
  database: {
    dbFilename: 'powersync.db',
  },
});

powerSync.init();

export const AppWrapper = () => {
  return (
    <PowerSyncContext.Provider value={powerSync}>
      <App />
    </PowerSyncContext.Provider>
  );
};
