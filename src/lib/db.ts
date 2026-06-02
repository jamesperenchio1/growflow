import Dexie, { type Table } from 'dexie';
import type {
  Plant, Photo, LogEntry, Task, GrowingSpace, SpacePlant,
  YieldRecord, YieldReference, NutrientLog, IoTDevice, AppSettings
} from '@/types';

export class GrowFlowDB extends Dexie {
  plants!: Table<Plant>;
  photos!: Table<Photo>;
  logEntries!: Table<LogEntry>;
  tasks!: Table<Task>;
  growingSpaces!: Table<GrowingSpace>;
  spacePlants!: Table<SpacePlant>;
  yieldRecords!: Table<YieldRecord>;
  yieldReferences!: Table<YieldReference>;
  nutrientLogs!: Table<NutrientLog>;
  iotDevices!: Table<IoTDevice>;
  settings!: Table<AppSettings>;

  constructor() {
    super('GrowFlowDB');
    this.version(1).stores({
      plants: '++id, name, category, growingMethod, spaceId, createdAt',
      photos: '++id, plantId, createdAt, type',
      logEntries: '++id, plantId, createdAt, type',
      tasks: '++id, plantId, spaceId, dueDate, type, completed',
      growingSpaces: '++id, name, type, createdAt',
      spacePlants: '++id, spaceId, plantId',
      yieldRecords: '++id, plantId, harvestedAt',
      yieldReferences: '++id, plantName, category',
      nutrientLogs: '++id, spaceId, createdAt',
      iotDevices: '++id, name, type, connected, spaceId',
      settings: 'key',
    });
  }
}

export const db = new GrowFlowDB();
