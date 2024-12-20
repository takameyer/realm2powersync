import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { RealmProvider } from '@realm/react';

import { App } from './App';

import { Item } from './ItemSchema';

const LoadingIndicator = () => {
  return (
    <View style={styles.activityContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export const AppWrapper = () => {
  return (
    <RealmProvider schema={[Item]} fallback={LoadingIndicator}>
      <App />
    </RealmProvider>
  );
};

const styles = StyleSheet.create({
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
