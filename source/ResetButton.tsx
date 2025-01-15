import React, {useCallback} from 'react';
import {Pressable, Alert, View, Text, StyleSheet} from 'react-native';
import {colors} from './Colors';
import {resetPowerSync} from './PowerSync';

export function ResetButton() {
  const signOut = useCallback(() => {
    resetPowerSync();
  }, []);

  return (
    <Pressable
      onPress={() => {
        Alert.alert('Reset Database?', '', [
          {
            text: 'Yes, Reset Database',
            style: 'destructive',
            onPress: () => signOut(),
          },
          {text: 'Cancel', style: 'cancel'},
        ]);
      }}>
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Reset</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 12,
  },
  buttonText: {
    fontSize: 16,
    color: colors.primary,
  },
});
