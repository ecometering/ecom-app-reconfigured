import React, { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SQLite from 'expo-sqlite/next';
import { useSQLiteContext } from 'expo-sqlite/next';
import { tablename } from "./constant"; 
// Load the database from assets
const db = useSQLiteContext();
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
async function  database() {await SQLite.openDatabaseAsync("options.sqlite");};







export { loadDatabase, db, database };