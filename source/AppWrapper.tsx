import {PowerSyncContext} from '@powersync/react-native';
import React from 'react';
import {App} from './App';
import {setupPowerSync} from './PowerSync';

const powerSync = setupPowerSync();

export const AppWrapper = () => {
  return (
    <PowerSyncContext.Provider value={powerSync}>
      <App />
    </PowerSyncContext.Provider>
  );
};
