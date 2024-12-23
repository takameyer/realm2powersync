import {column, Schema, Table} from '@powersync/react-native';

export const ItemSchema = new Table({
  isComplete: column.integer,
  summary: column.text,
  owner_id: column.text,
});

export const AppSchema = new Schema({
  Item: ItemSchema,
});

export type Database = (typeof AppSchema)['types'];
export type Item = Database['Item'];
