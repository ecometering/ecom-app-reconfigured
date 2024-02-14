import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';


const databaseName = 'options.sqlite';

async function openDatabase() {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require('../../assets/options.sqlite')).uri,
    FileSystem.documentDirectory + 'SQLite/options.sqlite'
  );
  return SQLite.openDatabase('options.sqlite');
}



async function fetchTableNames(db) {
  console.log('Fetching table names...');
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      console.log('Executing SQL to fetch table names...');
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
        [],
        (_, { rows }) => {
          console.log(`Received ${rows.length} rows from sqlite_master.`);
          let tables = {};
          for (let i = 0; i < rows.length; i++) {
            const tableName = rows.item(i).name;
            console.log(`Found table: ${tableName}`);
            tables[tableName] = [];
          }
          resolve(tables);
        },
        (_, error) => {
          console.error('SQL execution error:', error);
          reject(error);
        }
      );
    });
  });
}

const createJobsInProgressTable = (db) => {
  console.log('Creating JobsInProgress table...');
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS jobsInProgress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jobTitle TEXT NOT NULL,
        description TEXT,
        startDate TEXT,
        endDate TEXT,
        status TEXT
      );`,
      [],
      () => console.log('Table jobsInProgress created successfully.'),
      (_, error) => console.error('Error creating jobsInProgress table:', error)
    );
  });
};

async function getDatabaseTables() {
  try {
    const db = await openDatabase(); // Open the database
    const tables = await fetchTableNames(db); // Fetch the table names
    console.log('Database tables:', tables);
    return tables;
  } catch (error) {
    console.error('Error fetching table names:', error);
  }
}

async function testDatabaseAndTables() {
  console.log('Testing database and table setup...');
  try {
      const db = await openDatabase(); // Open the preloaded database
      await createJobsInProgressTable(db); // Ensure the jobsInProgress table exists
      const tables = await fetchTableNames(db); // Fetch and log table names

      console.log('Database tables verified:', tables);
  } catch (error) {
      console.error('Error during database and table testing:', error);
  }
}


const fetchManufacturersForMeterType = async (meterType) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT DISTINCT manufacturer FROM '${meterType}';`,
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
        `SELECT model_code FROM '${meterType}' WHERE manufacturer = ?;`,
        [manufacturer],
        (_, { rows }) => resolve(rows._array),
        (_, err) => reject(err)
      );
    });
  });
};

export {  };


export { fetchManufacturersForMeterType, fetchModelsForManufacturer,getDatabaseTables, createJobsInProgressTable,openDatabase,testDatabaseAndTables };
// Example usage


