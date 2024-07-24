const createJobsTable = async (db) => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Jobs (
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
      );
    `);
    console.log('Jobs table created or already exists.');
  } catch (error) {
    console.error('Error creating Jobs table:', error);
    throw error;
  }
};

const getDatabaseTables = async (db) => {
  try {
    const tables = await db.getAllAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `);
    const tableNames = tables.reduce((acc, table) => {
      acc[table.name] = [];
      return acc;
    }, {});
    console.log('Fetched table names:', tableNames);
    return tableNames;
  } catch (error) {
    console.error('Error fetching table names:', error);
    throw error;
  }
};

export { createJobsTable, getDatabaseTables };
