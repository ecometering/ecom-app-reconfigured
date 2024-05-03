import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

const databaseName = "options.sqlite";
const dbFilePath = `${FileSystem.documentDirectory}SQLite/${databaseName}`;
console.log("Database file path:", dbFilePath);


async function deleteDatabase() {
	try {
	  await FileSystem.deleteAsync(dbFilePath);
	  console.log('Database file deleted successfully.');
	} catch (error) {
	  console.error('Error deleting database file:', error);
	}
  }

async function testFileSystemAccess() {
	try {
		const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory);
	} catch (error) {}
}

async function openDatabase() {
	try {
		const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite");

		if (!fileInfo.exists) {
			await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite");
		}

		const dbPath = FileSystem.documentDirectory + "SQLite/" + databaseName;
		const dbFileInfo = await FileSystem.getInfoAsync(dbPath);

		if (!dbFileInfo.exists) {
			await FileSystem.downloadAsync(Asset.fromModule(require(`../../assets/${databaseName}`)).uri, dbPath);
		} else {
		}

		const db = await SQLite.openDatabase(databaseName);
    //db.closeAsync()
		return db;
	} catch (error) {
		throw new Error("Failed to open database");
	}
}

async function fetchTableNames(db) {
	return new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
				[],
				(_, { rows }) => {
					let tables = {};
					for (let i = 0; i < rows.length; i++) {
						const tableName = rows.item(i).name;

						tables[tableName] = [];
					}
					console.log("Fetched table names:", tables);
					resolve(tables);
				},
				(_, error) => {
					console.error("Failed to fetch table names", error);
					reject(error);
				}
			);
		});
	});
}

async function createJobsTable(db) {
	console.log("[createJobsTable] Creating Jobs table...");
	db.transaction((tx) => {
		tx.executeSql(
			`CREATE TABLE IF NOT EXISTS Jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
		jobId TEXT,
        jobType TEXT NOT NULL,
        MPRN TEXT,
		postcode TEXT,
        startDate DATE,
        endDate DATE,
        jobStatus TEXT,
        progress INT,
        siteDetails TEXT,
		siteQuestions TEXT,
		maintenanceQuestions TEXT,
        meterDetails TEXT,
		correctorDetails TEXT,
		dataloggerDetails TEXT,
		streams TEXT, 
		regulator TEXT,
		additionalMaterials TEXT,
		chatterboxDetails TEXT, 
		standards TEXT, 
		rebook TEXT,
		photos TEXT
      );`,
			[],
			() => console.log("[createJobsTable] Jobs table created or already exists."),
			(_, error) => console.error("[createJobsTable] Error creating Jobs table:", error)
		);
	});
}

async function getDatabaseTables() {
	try {
		const db = await openDatabase(); // Open the database
		const tables = await fetchTableNames(db); // Fetch the table names
		return tables
	} catch (error) {
		console.error("Error fetching table names:", error);
	}
}
async function getDatabaseJob(setJob) {
	try {
		const db = await openDatabase(); // Open the database
	
		db.transaction(tx => {
			tx.executeSql(
			  'SELECT * FROM Jobs',
			  [],
			  (_, { rows: { _array } }) => {
				console.log({ _array })
				setJob(_array)
			  },
			  error => {
				console.error('Error executing SQL query', error);
			  }
			);
		  });
	
	} catch (error) {
		console.error("Error fetching table names:", error);
	}
}

async function testDatabaseAndTables() {
	console.log("Testing database and table setup...");
	try {
		const db = await openDatabase(); // Open the preloaded database
		const tables = await fetchTableNames(db); // Fetch and log table names

		console.log("Database tables verified:", tables);
    return tables;
	} catch (error) {
		console.error("Error during database and table testing:", error);
	}
}

const fetchManufacturersForMeterType = async (meterType) => {
	const tableNameMap = {
		1: "diaphrgam",
		2: "Tin Case Diaphrgam",
		3: "rotary",
		4: "correctors",
		5: "turbine",
		6: "ultrasonic"
	};

	const tableName = tableNameMap[meterType]; // Use meterType to get the correct table name
	if (!tableName) {
		throw new Error(`Invalid meter type: ${meterType}`);
	}
	const db = await openDatabase();
	return new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
				`SELECT DISTINCT Manufacturer FROM "${tableName}";`,
				[],
				(_, { rows }) => {
					console.log(">>>  3  >>>", rows);
					db.closeAsync().then(()=>{
						resolve(rows._array);
					})
				},
				(_, err) => reject(err)
			);
		});
	});
};
const fetchModelsForManufacturer = async (meterType, manufacturer) => {
    console.log(`[fetchModelsForManufacturer] Start fetching models. MeterType: ${meterType}, Manufacturer: ${manufacturer}`);

    // Mapping of meterType to tableName
    const tableNameMap = {
        1: "diaphrgam",
        2: "Tin Case Diaphrgam",
        3: "rotary",
        4: "correctors",
        5: "turbine",
        6: "ultrasonic",
    };

    // Retrieve the table name based on the meter type
    const tableName = tableNameMap[meterType];
    if (!tableName) {
        console.error(`[fetchModelsForManufacturer] Invalid meter type provided: ${meterType}`);
        throw new Error("Invalid meter type");
    }
    console.log(`[fetchModelsForManufacturer] Using table: ${tableName} for queries.`);

    try {
        const db = await openDatabase();
        console.log(`[fetchModelsForManufacturer] Database opened successfully.`);

        // Execute the query within a promise to use async/await
        const models = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                const query = `SELECT "Model Code (A0083)" FROM "${tableName}" WHERE Manufacturer = ?;`;
                console.log(`[fetchModelsForManufacturer] Executing query: ${query} with Manufacturer: ${manufacturer}`);

                tx.executeSql(
                    query,
                    [manufacturer],
                    (_, result) => {
                        const modelsArray = result.rows._array.map(row => ({ label: row["Model Code (A0083)"], value: row["Model Code (A0083)"] }));
                        console.log(`[fetchModelsForManufacturer] Models fetched successfully. Count: ${modelsArray.length}`);
                        resolve(modelsArray);
                    },
                    (_, error) => {
                        console.error(`[fetchModelsForManufacturer] Error fetching models for Manufacturer: ${manufacturer}`, error);
                        reject(error);
                    }
                );
            }, null, () => {
                // Ensure database is closed after transaction
                db.close(() => console.log("[fetchModelsForManufacturer] Database closed after fetching models."), error => console.log("[fetchModelsForManufacturer] Error closing database:", error));
            });
        });

        return models;
    } catch (error) {
        console.error(`[fetchModelsForManufacturer] Failed to fetch models for MeterType: ${meterType} and Manufacturer: ${manufacturer}:`, error);
        throw error; // Re-throw the error to be handled by the caller
    }
};










  const printTableSchema = async (tableName) => {
	const db = SQLite.openDatabase(databaseName);
  
	db.transaction(tx => {
	  tx.executeSql(
		`PRAGMA table_info(${tableName});`, // This PRAGMA command returns table structure
		[],
		(_, { rows }) => {
		  console.log(`Schema of ${tableName}:`, JSON.stringify(rows._array, null, 2));
		},
		(_, error) => {
		  console.error(`Failed to log schema of table ${tableName}:`, error);
		  return true; // To stop the transaction
		}
	  );
	});
  };

const JobsDatabaseTest = async () => {
	db.transaction(tx => {
	tx.executeSql(
		`Select * from Jobs`,null,
		(txObj,resultSet) => SetJobs (resultSet.rows._array),
		(txObj,error) => console.log(error)
	);
	});
}
const printRowById = (id) => {
	db.transaction((tx) => {
	  tx.executeSql(
		"SELECT * FROM Jobs WHERE id = ?",
		[id],
		(_, { rows }) => {
		  if (rows.length > 0) {
			console.log("Row data:", rows.item(0));
		  } else {
			console.log("No row found with the specified ID.");
		  }
		},
		(_, error) => console.error("Failed to fetch row:", error)
	  );
	});
  };

  
  export const fetchPhotosJSON = async (jobId) => {
	const db = await openDatabase();
	return new Promise((resolve, reject) => {
	  db.transaction(tx => {
		tx.executeSql(
		  'SELECT photos FROM Jobs WHERE id = ?',
		  [jobId],
		  (_, { rows }) => {
			const existingPhotosJSON = rows.length > 0 ? rows._array[0].photos : JSON.stringify([]);
			resolve(existingPhotosJSON);
		  },
		  (_, error) => reject(error)
		);
	  });
	});
  };

  export const appendPhotoDetail = (existingPhotosJSON, newPhotoDetail) => {
	const photos = JSON.parse(existingPhotosJSON);
	photos.push(newPhotoDetail);
	return JSON.stringify(photos);
  };
export {
  createJobsTable,
  fetchManufacturersForMeterType,
  fetchModelsForManufacturer,
  getDatabaseTables,
 
  openDatabase,
  testDatabaseAndTables,
  testFileSystemAccess,
  printTableSchema,
  deleteDatabase,
  JobsDatabaseTest,
  getDatabaseJob,
  printRowById
};