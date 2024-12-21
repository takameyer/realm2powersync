import {column, Schema, Table} from '@powersync/react-native';

export type Item = {
  isComplete: boolean;
  summary: string;
  owner_id: string;
};

export const ItemSchema = new Table({
  isComplete: column.integer,
  summary: column.text,
  owner_id: column.text,
});

export const AppSchema = new Schema({
  ItemSchema,
});
