import React, {useCallback, useState} from 'react';
import {BSON} from 'realm';
import {useRealm, useQuery} from '@realm/react';
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

export function ItemListView() {
  const realm = useRealm();
  const items = useQuery(Item).sorted('_id');
  const user = {id: 'mockUserId'};

  const [showNewItemOverlay, setShowNewItemOverlay] = useState(false);

  const [showAllItems, setShowAllItems] = useState(true);

  // createItem() takes in a summary and then creates an Item object with that summary
  const createItem = useCallback(
    ({summary}: {summary: string}) => {
      // if the realm exists, create an Item
      realm.write(() => {
        return new Item(realm, {
          summary,
          owner_id: user?.id,
        });
      });
    },
    [realm, user],
  );

  // deleteItem() deletes an Item with a particular _id
  const deleteItem = useCallback(
    (id: BSON.ObjectId) => {
      // if the realm exists, get the Item with a particular _id and delete it
      const item = realm.objectForPrimaryKey(Item, id); // search for a realm object with a primary key that is an objectId
      if (item) {
        if (item.owner_id !== user?.id) {
          Alert.alert("You can't delete someone else's task!");
        } else {
          realm.write(() => {
            realm.delete(item);
          });
        }
      }
    },
    [realm, user],
  );
  // toggleItemIsComplete() updates an Item with a particular _id to be 'completed'
  const toggleItemIsComplete = useCallback(
    (id: BSON.ObjectId) => {
      // if the realm exists, get the Item with a particular _id and update it's 'isCompleted' field
      const item = realm.objectForPrimaryKey(Item, id); // search for a realm object with a primary key that is an objectId
      if (item) {
        if (item.owner_id !== user?.id) {
          Alert.alert("You can't modify someone else's task!");
        } else {
          realm.write(() => {
            item.isComplete = !item.isComplete;
          });
        }
      }
    },
    [realm, user],
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
          keyExtractor={item => item._id.toString()}
          data={items}
          renderItem={({item}) => (
            <ListItem key={`${item._id}`} bottomDivider topDivider>
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
                  onPress={() => toggleItemIsComplete(item._id)}
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
                  onPress={() => deleteItem(item._id)}
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
    borderColor: colors.purple,
  },
  statusIcon: {
    textAlign: 'center',
    fontSize: 17,
    color: colors.purple,
  },
});
