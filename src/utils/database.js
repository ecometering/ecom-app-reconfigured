import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';


const databaseName = 'options.sqlite';

async function testFileSystemAccess() {
  console.log("[testFileSystemAccess] Testing access to FileSystem...");
  try {
    const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory);
    console.log("[testFileSystemAccess] Access test result:", fileInfo);
  } catch (error) {
    console.error("[testFileSystemAccess] FileSystem access test failed:", error);
  }
}


async function openDatabase() {
  console.log("[openDatabase] Starting database open process");
  try {
    const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite');
    console.log("[openDatabase] Checked SQLite directory existence:", fileInfo.exists);
    
    if (!fileInfo.exists) {
      console.log("[openDatabase] SQLite directory does not exist, creating...");
      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
      console.log("[openDatabase] SQLite directory created successfully");
    }
    
    const dbPath = FileSystem.documentDirectory + 'SQLite/' + databaseName;
    const dbFileInfo = await FileSystem.getInfoAsync(dbPath);
    console.log("[openDatabase] Checking if database file exists:", dbFileInfo.exists);

    if (!dbFileInfo.exists) {
      console.log("[openDatabase] Database file does not exist, downloading...");
      await FileSystem.downloadAsync(
        Asset.fromModule(require('../../assets/options.sqlite')).uri,
        dbPath
      );
      console.log("[openDatabase] Database file downloaded successfully");
    } else {
      console.log("[openDatabase] Database file already exists, no need to download");
    }
    
    const db = SQLite.openDatabase(databaseName);
    console.log("[openDatabase] Database opened successfully");
    return db;
  } catch (error) {
    console.error("[openDatabase] Error in function:", error);
    throw new Error("Failed to open database");
  }
}

async function fetchTableNames(db) {
  console.log('[fetchTableNames] Fetching table names...');
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      console.log('[fetchTableNames] Executing SQL to fetch table names...');
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
        [],
        (_, { rows }) => {
          console.log(`[fetchTableNames] Received ${rows.length} rows from sqlite_master.`);
          let tables = {};
          for (let i = 0; i < rows.length; i++) {
            const tableName = rows.item(i).name;
            console.log(`[fetchTableNames] Found table: ${tableName}`);
            tables[tableName] = [];
          }
          resolve(tables);
        },
        (_, error) => {
          console.error('[fetchTableNames] SQL execution error:', error);
          reject(error);
        }
      );
    });
  });
}


async function createJobsTable(db) {
  console.log('[createJobsTable] Creating Jobs table...');
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jobType TEXT NOT NULL,
        jobNumber TEXT,
        startDate DATE,
        endDate DATE,
        jobStatus TEXT,
        progress INT,
        siteDetails TEXT,
        photos TEXT
      );`,
      [],
      () => console.log('[createJobsTable] Jobs table created or already exists.'),
      (_, error) => console.error('[createJobsTable] Error creating Jobs table:', error)
    );
  });
}

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
    console.log("--------------------------------------fetchManufacturersForMeterType--------------start")
    const tableNameMap = {
      1: 'diaphrgam',
      2: 'Tin Case Diaphrgam',
      3: 'rotary',
      4: 'correctors',
      5: 'turbine',
      6: 'ultrasonic',
    };
  
    const tableName = tableNameMap[meterType]; // Use meterType to get the correct table name
    console.log(">>>  1  >>>meterType / tableName:", meterType, "/ ",tableName);
    if (!tableName) {
      throw new Error(`Invalid meter type: ${meterType}`);
    }
    const db = await openDatabase();
    console.log(">>>  2  >>>db status", db)
    
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            `SELECT DISTINCT Manufacturer FROM "${tableName}";`,
            [],
            (_, { rows }) => {console.log(">>>  3  >>>", rows); db.closeSync(); resolve(rows._array); },
            (_, err) => reject(err)
          );
        }); 
    });
  }
  const fetchModelsForManufacturer = async (meterType, manufacturer) => {
    console.log("-------------------second dropdown-------------")
    const tableNameMap = {
      1: 'diaphrgam', // Example mapping, adjust according to your actual data
      2: 'Tin Case Diaphrgam', // Use the actual numeric values as keys
      3: 'rotary',
      4: 'correctors', // Assuming there's a numeric value associated with 'corrector'
      5: 'turbine',
      6: 'ultrasonic',
    };
  
    console.log(`>>>  5  >>>Fetching models for meterType: ${meterType}, manufacturer: ${manufacturer}`);
  
    // Retrieve the table name based on the meter type
    const tableName = tableNameMap[meterType];
    if (!tableName) {
      console.error("Invalid meter type provided:", meterType);
      return Promise.reject(new Error("Invalid meter type"));
    }
  
    console.log(`Using table: ${tableName} for meterType: ${meterType}`);
  
    const db = await openDatabase(); // Ensure openDatabase() is defined and returns a database connection
    //const db = SQLite.openDatabase('options.sqlite')
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        const query = `SELECT "Model Code (A0083)" FROM "${tableName}" WHERE manufacturer = ?;`;
        console.log(`Executing query: ${query} with manufacturer: ${manufacturer} and tableName ${tableName}`);
        
        tx.executeSql(
          query,
          [manufacturer],
          (_, { rows }) => {
            console.log(`Query successful, rows returned: ${rows.length}`);
            resolve(rows._array);
          },
          (_, err) => {
            console.error("Query error:", err);
            reject(err);
          }
        );
      });
    });
  };
  
  

// Example usage


const addColumnForJSONStorage = (db) => {
  console.log('Adding jsonData column to JobsInProgress table...');
  db.transaction(tx => {
    tx.executeSql(
      `ALTER TABLE jobsInProgress ADD COLUMN jsonData TEXT;`,
      [],
      () => console.log('Column jsonData added successfully.'),
      (_, error) => console.error('Error adding jsonData column:', error)
    );
  });
};

const saveJSONStringToColumn = async (id, jsonString) => {
  const db = await openDatabase();
  db.transaction(tx => {
    tx.executeSql(
      `UPDATE jobsInProgress SET jsonData = ? WHERE id = ?;`,
      [jsonString, id],
      () => console.log('JSON string saved successfully.'),
      (_, error) => console.error('Error saving JSON string:', error)
    );
  });
};


const loadDataAndSetContext = async (id) => {
  const db = await openDatabase();
  db.transaction(tx => {
    tx.executeSql(
      `SELECT jsonData FROM jobsInProgress WHERE id = ?;`,
      [id],
      (_, { rows }) => {
        if (rows.length > 0) {
          const contextData = JSON.parse(rows.item(0).jsonData);
          console.log('Loaded context data:', contextData);
          // Here, set the app's context with contextData
        } else {
          console.log('No data found.');
        }
      },
      (_, error) => console.error('Error loading data:', error)
    );
  });
};




const addOrUpdateJobData = async (jobId, jobData) => {
  console.log("[addOrUpdateJobData] Adding or updating job data", { jobId, jobData });
  const db = await openDatabase(); 

  return new Promise((resolve, reject) => {
    db?.transaction(tx => {
      console.log("[addOrUpdateJobData] Transaction started");
      tx.executeSql(
        `SELECT * FROM Jobs WHERE id = ?;`,
        [jobId],
        (_, result) => {
          console.log("[addOrUpdateJobData] Job selection query completed");
          if (result.rows.length > 0) {
            console.log(`[addOrUpdateJobData] Job with id ${jobId} exists, updating...`);
            const updatedPhotos = JSON.stringify({ ...JSON.parse(result.rows._array[0].photos), ...jobData.photos });
            tx?.executeSql(
              `UPDATE Jobs SET photos = ? WHERE id = ?;`,
              [updatedPhotos, jobId],
              () => {
                console.log(`[addOrUpdateJobData] Job data updated for jobId: ${jobId}`);
                resolve();
              },
              (_, error) => {
                console.error(`[addOrUpdateJobData] Failed to update job data for jobId: ${jobId}`, error);
                reject(error);
              }
            );
          } else {
            console.log(`[addOrUpdateJobData] Job with id ${jobId} does not exist, adding new entry...`);
            const { jobType, photos } = jobData;
            const photosJson = JSON.stringify(photos);
            tx.executeSql(
              `INSERT INTO Jobs (id, jobType, photos) VALUES (?, ?, ?);`,
              [jobId, jobType, photosJson],
              () => {
                console.log(`[addOrUpdateJobData] New job data added for jobId: ${jobId}`);
                resolve();
              },
              (_, error) => {
                console.error(`[addOrUpdateJobData] Failed to add new job data for jobId: ${jobId}`, error);
                reject(error);
              }
            );
          }
        },
        (_, error) => {
          console.error(`[addOrUpdateJobData] Failed to retrieve job data for jobId: ${jobId}`, error);
          reject(error);
        }
      );
    },
    (_, error) => {
      console.error("[addOrUpdateJobData] Transaction error on job data update/addition", error);
      reject(error);
    },
    () => {
      console.log("[addOrUpdateJobData] Transaction successful for job data update/addition");
    });
  });
};


  const loadJobData = async (jobId) => {
    const db = openDatabase();
  
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM Jobs WHERE id = ?;`,
            [jobId],
            (_, { rows }) => {
              if (rows.length > 0) {
                let jobData = rows._array[0];
                // Parse photos JSON string back into an object
                jobData.photos = jobData.photos ? JSON.parse(jobData.photos) : {};
                console.log(`Job data loaded for jobId: ${jobId}`, jobData);
                resolve(jobData);
              } else {
                console.log(`No job data found for jobId: ${jobId}`);
                resolve(null);
              }
            },
            (_, error) => {
              console.error(`Failed to load job data for jobId: ${jobId}`, error);
              reject(error);
            }
          );
        },
        (error) => console.error("Transaction error on loading job data", error),
        () => console.log("Transaction successful for loading job data")
      );
    });
  };

  export { fetchManufacturersForMeterType, fetchModelsForManufacturer,getDatabaseTables,openDatabase
    ,testDatabaseAndTables,addColumnForJSONStorage,saveJSONStringToColumn,loadDataAndSetContext,testFileSystemAccess,
    addOrUpdateJobData,loadJobData,createJobsTable};
  