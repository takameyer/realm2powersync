import React, {useState} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from './Colors';
import {toggleConnection} from './PowerSync';

export function OfflineModeButton() {
  const [pauseSync, togglePauseSync] = useState(false);

  return (
    <Pressable
      onPress={() => {
        toggleConnection();
        togglePauseSync(!pauseSync);
      }}>
      <Text style={styles.buttonText}>
        {pauseSync ? 'Enable Sync' : 'Disable Sync'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    padding: 12,
    color: colors.primary,
  },
});
