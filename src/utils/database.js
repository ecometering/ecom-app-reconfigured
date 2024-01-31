import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as SQLite from 'expo-sqlite';

const databaseName = 'options.sqlite';

async function openDatabase() {
  const databaseUri = FileSystem.documentDirectory + databaseName;
  const asset = Asset.fromModule(require('../../assets/options.sqlite'));

  // Check if the database file exists and if not, download it to the correct location
  if (!(await FileSystem.getInfoAsync(databaseUri)).exists) {
    await FileSystem.downloadAsync(asset.uri, databaseUri);
  }

  return SQLite.openDatabase(databaseName);
}

const fetchManufacturersForMeterType = async (meterType) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT DISTINCT manufacturer FROM ${meterType};`,
        [],
        (_, { rows }) => resolve(rows._array),
        (_, err) => reject(err)
      );
    });
  });
};

const fetchModelsForManufacturer = async (meterType, manufacturer) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT model_code FROM ${meterType} WHERE manufacturer = ?;`,
        [manufacturer],
        (_, { rows }) => resolve(rows._array),
        (_, err) => reject(err)
      );
    });
  });
};

export { fetchManufacturersForMeterType, fetchModelsForManufacturer };
