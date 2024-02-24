import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("options.sqlite");

export const initDB = () => {
  const query = `CREATE TABLE IF NOT EXISTS Jobs (
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
  );`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(query, [], () => {
        resolve();
      },
      (_, err) => reject(err));
    });
  });
};

export const insertJob = ( jobType, MPRN, startDate, endDate, jobStatus, progress, siteDetails, photos) => {
  const query = `INSERT INTO Jobs ( jobType, MPRN, startDate, endDate, jobStatus, progress, siteDetails, photos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(query, [ jobType, MPRN, startDate,endDate,  jobStatus, progress, siteDetails, photos], (_, result) => {
        resolve(result);
      },
      (_, err) => reject(err));
    });
  });
};

export const getJobs = () => {
  const query = `SELECT * FROM Jobs;`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(query, [], (_, { rows }) => {
        resolve(rows._array);
      },
      (_, err) => reject(err));
    });
  });
};


export const deleteJobsTable = async () => {
    const db = SQLite.openDatabase("options,sqlite"); // Ensure this matches your database name
    
    db.transaction(
      tx => {
        tx.executeSql(
          `DROP TABLE IF EXISTS Jobs;`,
          [],
          () => { console.log("Jobs table deleted successfully."); },
          (_, error) => { console.error("Failed to delete Jobs table:", error); return true; }
        );
      }
    );
  };


  export const checkTableExists = async () => {
    const db = SQLite.openDatabase("options.sqlite"); // Ensure this matches your database name
  
    db.transaction(
      tx => {
        tx.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='Jobs';",
          [],
          (_, { rows }) => {
            if (rows.length > 0) {
              console.log("Jobs table exists.");
            } else {
              console.log("Jobs table does not exist.");
            }
          },
          (_, error) => {
            console.error("Failed to check if Jobs table exists:", error);
            return true; // To stop the transaction
          }
        );
      }
    );
  };