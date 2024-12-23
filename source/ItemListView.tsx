import React, {useCallback, useMemo, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {Button, Overlay, ListItem} from '@rneui/base';

import {CreateToDoPrompt} from './CreateToDoPrompt';

import {Item} from './ItemSchema';
import {colors} from './Colors';
import {usePowerSync, useQuery} from '@powersync/react-native';
import {ObjectId} from 'bson';

export function ItemListView() {
  const db = usePowerSync();
  const {data: items} = useQuery<Item>('SELECT * FROM Item');

  const user = useMemo(
    () => ({
      id: 'mockUserId',
    }),
    [],
  );

  const [showNewItemOverlay, setShowNewItemOverlay] = useState(false);

  const [showAllItems, setShowAllItems] = useState(true);

  // createItem() takes in a summary and then creates an Item object with that summary
  const createItem = useCallback(
    async ({summary}: {summary: string}) => {
      try {
        // start a write transaction to insert the new Item
        db.writeTransaction(async tx => {
          await tx.execute(
            'INSERT INTO Item (id, summary, owner_id, isComplete) VALUES (?, ?, ?, ?)',

            [new ObjectId().toHexString(), summary, user?.id, false],
          );
        });
      } catch (ex: any) {
        Alert.alert('Error', ex?.message);
      }
    },
    [db],
  );

  // deleteItem() deletes an Item with a particular _id
  const deleteItem = useCallback(
    async (id: String) => {
      // start a write transaction to delete the Item
      try {
        db.writeTransaction(async tx => {
          await tx.execute('DELETE FROM Item WHERE id = ?', [id]);
        });
      } catch (ex: any) {
        Alert.alert('Error', ex?.message);
      }
    },
    [db],
  );

  // toggleItemIsComplete() updates an Item with a particular _id to be 'completed'
  const toggleItemIsComplete = useCallback(
    async (id: String) => {
      // start a write transaction to delete the Item
      try {
        db.writeTransaction(async tx => {
          await tx.execute(
            'UPDATE Item SET isComplete = NOT isComplete WHERE id = ?',
            [id],
          );
        });
      } catch (ex: any) {
        Alert.alert('Error', ex?.message);
      }
    },
    [db],
  );

  return (
    <SafeAreaProvider>
      <View style={styles.viewWrapper}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleText}>Show All Tasks</Text>
          <Switch
            trackColor={{true: '#00ED64'}}
            onValueChange={() => {
              setShowAllItems(!showAllItems);
            }}
            value={showAllItems}
          />
        </View>
        <Overlay
          isVisible={showNewItemOverlay}
          overlayStyle={styles.overlay}
          onBackdropPress={() => setShowNewItemOverlay(false)}>
          <CreateToDoPrompt
            onSubmit={({summary}) => {
              setShowNewItemOverlay(false);
              createItem({summary});
            }}
          />
        </Overlay>
        <FlatList
          keyExtractor={item => item.id}
          data={items}
          renderItem={({item}) => (
            <ListItem key={`${item.id}`} bottomDivider topDivider>
              <ListItem.Title style={styles.itemTitle}>
                {item.summary}
              </ListItem.Title>
              <ListItem.Subtitle style={styles.itemSubtitle}>
                <Text>{item.owner_id === user?.id ? '(mine)' : ''}</Text>
              </ListItem.Subtitle>
              <ListItem.Content>
                <Pressable
                  accessibilityLabel={`Mark task as ${
                    item.isComplete ? 'not done' : 'done'
                  }`}
                  onPress={() => toggleItemIsComplete(item.id)}
                  style={[
                    styles.status,
                    item.isComplete && styles.statusCompleted,
                  ]}>
                  <Text style={styles.statusIcon}>
                    {item.isComplete ? '✓' : '○'}
                  </Text>
                </Pressable>
              </ListItem.Content>
              <ListItem.Content>
                <Pressable
                  accessibilityLabel={'Remove Item'}
                  onPress={() => deleteItem(item.id)}
                  style={styles.delete}>
                  <Text style={[styles.statusIcon, {color: 'blue'}]}>
                    DELETE
                  </Text>
                </Pressable>
              </ListItem.Content>
            </ListItem>
          )}
        />
        <Button
          title="Add To-Do"
          buttonStyle={styles.addToDoButton}
          onPress={() => setShowNewItemOverlay(true)}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  addToDoButton: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    margin: 5,
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    margin: 5,
  },
  showCompletedButton: {
    borderRadius: 4,
    margin: 5,
  },
  showCompletedIcon: {
    marginRight: 5,
  },
  itemTitle: {
    flex: 1,
  },
  itemSubtitle: {
    color: '#979797',
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  toggleText: {
    flex: 1,
    fontSize: 16,
  },
  overlay: {
    backgroundColor: 'white',
  },
  status: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    backgroundColor: '#ffffff',
    alignSelf: 'flex-end',
  },
  delete: {
    alignSelf: 'flex-end',
    width: 65,
    marginHorizontal: 12,
  },
  statusCompleted: {
    borderColor: colors.primary,
  },
  statusIcon: {
    textAlign: 'center',
    fontSize: 17,
    color: colors.primary,
  },
});
