import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {LogoutButton} from './LogoutButton';
import {ItemListView} from './ItemListView';
import {OfflineModeButton} from './OfflineModeButton';

const Stack = createStackNavigator();

const headerRight = () => {
  return <OfflineModeButton />;
};

const headerLeft = () => {
  return <LogoutButton />;
};

export const App = () => {
  return (
    <>
      {/* All screens nested in RealmProvider have access
            to the configured realm's hooks. */}
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Your To-Do List"
              component={ItemListView}
              options={{
                headerTitleAlign: 'center',
                //headerLeft,
                //headerRight,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Log in with the same account on another device or simulator to see
            your list sync in real time.
          </Text>
        </View>
      </SafeAreaProvider>
    </>
  );
};

const styles = StyleSheet.create({
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 4,
  },
  hyperlink: {
    color: 'blue',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});
