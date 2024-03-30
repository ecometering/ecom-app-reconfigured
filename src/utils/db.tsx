import React, { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SQLite from 'expo-sqlite/next';
// Load the database from assets
const loadDatabase = async () => {
    const dbName = "options.sqlite";
    const dbAssets = require("../../assets/options.sqlite");
    const dbURI = Asset.fromModule(dbAssets).uri;
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

    const fileInfo = await FileSystem.getInfoAsync(dbFilePath);

    if (!fileInfo.exists) {
        await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, { intermediates: true });
        await FileSystem.downloadAsync(dbURI, dbFilePath);
    }
};

// A component that uses the SQLite database
async function  db() {await SQLite.openDatabaseAsync("options.sqlite");};




async function setup() {  await db.execAsync(`
PRAGMA journal_mode = WAL;
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
  );`);}


export { loadDatabase, db, setup };