import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

const databaseName = "options.sqlite";
const dbFilePath = `${FileSystem.documentDirectory}SQLite/${databaseName}`;


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
        startDate DATE,
        endDate DATE,
        jobStatus TEXT,
        progress INT,
        siteDetails TEXT,
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
					db.closeSync();
					resolve(rows._array);
				},
				(_, err) => reject(err)
			);
		});
	});
};
const fetchModelsForManufacturer = async (meterType, manufacturer) => {
	console.log("-------------------second dropdown-------------");
	const tableNameMap = {
		1: "diaphrgam", // Example mapping, adjust according to your actual data
		2: "Tin Case Diaphrgam", // Use the actual numeric values as keys
		3: "rotary",
		4: "correctors", // Assuming there's a numeric value associated with 'corrector'
		5: "turbine",
		6: "ultrasonic"
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

	return new Promise((resolve, reject) => {
		db.transaction((tx) => {
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



const loadDataAndSetContext = async (id) => {
	const db = await openDatabase();
	db.transaction((tx) => {
		tx.executeSql(
			`SELECT jsonData FROM jobsInProgress WHERE id = ?;`,
			[id],
			(_, { rows }) => {
				if (rows.length > 0) {
					const contextData = JSON.parse(rows.item(0).jsonData);
					console.log("Loaded context data:", contextData);
					// Here, set the app's context with contextData
				} else {
					console.log("No data found.");
				}
			},
			(_, error) => console.error("Error loading data:", error)
		);
	});
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


export {
  createJobsTable,
  fetchManufacturersForMeterType,
  fetchModelsForManufacturer,
  getDatabaseTables,
  loadDataAndSetContext,
  openDatabase,
  testDatabaseAndTables,
  testFileSystemAccess,
  printTableSchema,
  deleteDatabase,
  JobsDatabaseTest,
  getDatabaseJob
};

