import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

async function openDatabase() {
  console.log('Opening database...');
  const dbFileName = 'options.sqlite';
  const dbFileUri = Asset.fromModule(require('../../assets/options.sqlite')).uri;
  const dbFileDirectory = `${FileSystem.documentDirectory}SQLite/`;
  const dbFilePath = dbFileDirectory + dbFileName;

  console.log(`Database directory: ${dbFileDirectory}`);

  // Ensure the SQLite directory exists
  await FileSystem.makeDirectoryAsync(dbFileDirectory, { intermediates: true });

  // Check if the database file already exists in the file system
  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
      // If the database file doesn't exist, copy it from the bundled assets
      console.log('Database file not found, copying from assets...');
      await FileSystem.downloadAsync(dbFileUri, dbFilePath);
      console.log('Database file copied successfully.');
  } else {
      console.log('Database file already exists, no need to copy.');
  }

  // Open the database
  console.log('Actually opening the database with SQLite...');
  const db = SQLite.openDatabase(dbFilePath);
  console.log('Database opened successfully.');
  return db;
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



export { getDatabaseTables, createJobsInProgressTable,openDatabase,testDatabaseAndTables };
// Example usage
