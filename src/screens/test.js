// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Dimensions } from 'react-native';
// import EcomDropDown from '../components/DropDown';
// import { useSQLiteContext } from 'expo-sqlite/next';
// import { meterType, tablename, tableNames } from '../utils/constant'; 







// const Test = () => {
//     const db = useSQLiteContext();
//     const { width } = Dimensions.get('window');
//     const [selectedMeterType, setSelectedMeterType] = useState('');
//     const [selectedMeterManufacturer, setSelectedMeterManufacturer] = useState('');
//     const [selectedMeterModelCode, setSelectedMeterModelCode] = useState('');
//     const [selectedCorrectorManufacturer, setSelectedCorrectorManufacturer] = useState('');
//     const [selectedCorrectorModelCode, setSelectedCorrectorModelCode] = useState('');
//     const [meterDetails, setMeterDetails] = useState(null);
//     const [correctorManufacturers, setCorrectorManufacturers] = useState([]);
//     const [correctorModelCodes, setCorrectorModelCodes] = useState([]);
//     const [meterManufacturers, setMeterManufacturers] = useState([]);
//     const [meterModelCodes, setMeterModelCodes] = useState([]);
//     const [meterTypes,SetMeterTypes] = useState([]);
//     console.log ('Meter Types:',meterType);
//     console.log ('Table names:',tableNames);
//     useEffect(() => {
//         getCorrectorManufacturers();
//         getMeterTypes();
//     }, []);

//     useEffect(() => {
//         if (selectedCorrectorManufacturer) {
//             getCorrectorModelCodes();
//         }
//     }, [selectedCorrectorManufacturer]);

//     useEffect(() => {
//         if (selectedMeterType) {
//             getMeterManufacturers();
//         }
//     }, [selectedMeterType]);
//     useEffect (() => { 
//         getMeterModelCodes(); 
//     }  , [selectedMeterManufacturer]);
//     useEffect(() => {
//         if (selectedMeterManufacturer && selectedMeterModelCode) {
//             getMeterDetails();
//         }
//     }, [selectedMeterManufacturer, selectedMeterModelCode]);

//     async function getMeterTypes() {
//         try {
//             const result = meterType
//             SetMeterTypes(result.map(type => ({
//             label: type.displayName,
//             value: type.value
//             })).sort((a, b) => a.label.localeCompare(b.label)));
//             console.log('meter Types:',result); 
//         } 
//         catch (err) {
//             console.error( err);    
//         }
//     }
//     async function getCorrectorManufacturers() {
//         try {
//             const query = `SELECT DISTINCT Manufacturer FROM ${tablename[9]}`;
//             const result = await db.getAllAsync(query);
//             setCorrectorManufacturers(result.map(manu => ({
//                 label: manu.Manufacturer,
//                 value: manu.Manufacturer
//             })).sort((a, b) => a.label.localeCompare(b.label)));
//         } catch (err) {
//             console.error('SQL Error: ', err);
//         }
//     }

//     async function getMeterManufacturers() {
//         if (selectedMeterType && tableNames[selectedMeterType]) {
//             try {
//                 const query = `SELECT DISTINCT Manufacturer FROM ${tableNames[selectedMeterType]}`;
//                 const result = await db.getAllAsync(query);
//                 setMeterManufacturers(result.map(manu => ({
//                     label: manu.Manufacturer,
//                     value: manu.Manufacturer
//                 })).sort((a, b) => a.label.localeCompare(b.label)));
//             } catch (err) {
//                 console.error('SQL Error: ', err);
//             }
//         }
//     }

//     async function getMeterModelCodes() {
//         if (selectedMeterType && tableNames[selectedMeterType]) {
//             try {
//                 const query = `SELECT DISTINCT "ModelCode" FROM ${tableNames[selectedMeterType]} WHERE Manufacturer = '${selectedMeterManufacturer}'`;
//                 const result = await db.getAllAsync(query);
//                 console.log ('Meter Model Codes:',result);
//                 setMeterModelCodes(result.map(model => ({
//                     label: model["ModelCode"],
//                     value: model["ModelCode"]
//                 })).sort((a, b) => a.label.localeCompare(b.label)));
//             } catch (err) {
//                 console.error('SQL Error: ', err);
//             }
//         }
//     }

//     async function getCorrectorModelCodes() {
//         try {
//             const query = `SELECT DISTINCT "ModelCode" FROM ${tablename[9]} WHERE Manufacturer = '${selectedCorrectorManufacturer}'`;
//             const result = await db.getAllAsync(query);
//             setCorrectorModelCodes(result.map(model => ({
//                 label: model["ModelCode"],
//                 value: model["ModelCode"]
//             })).sort((a, b) => a.label.localeCompare(b.label)));
//         } catch (err) {
//             console.error('SQL Error: ', err);
//         }
//     }

//     async function getMeterDetails() {
//         if (selectedMeterType && tableNames[selectedMeterType]) {
//             try {
//                 const tableName = tableNames[selectedMeterType];
//                 const query = `SELECT * FROM ${tableName} WHERE Manufacturer = ? AND ModelCode = ?`;
//                 const params = [selectedMeterManufacturer, selectedMeterModelCode];
//                 const result = await db.getAllAsync(query, params);
//                 if (result.length > 0) {
//                     setMeterDetails(result[0]);
//                 } else {
//                     setMeterDetails(null);
//                 }
//             } catch (err) {
//                 console.error('SQL Error: ', err);
//             }
//         }
//     }

//     const handleMeterTypeChange = (item) => {
//         const value = item.value;
//         setSelectedMeterType(value);
//         setSelectedMeterManufacturer('');
//         setSelectedMeterModelCode('');
//         setMeterDetails(null);
//         if (value !== '7') {
//             getMeterManufacturers();
//         } else {
//             setMeterManufacturers([]);
//             setMeterModelCodes([]);
//         }
//     };

//     const renderMeterTypeSpecificInput = () => {
//         if (selectedMeterType !== '7') {
//             return (
//                 <>
//                     <EcomDropDown
//                         value={selectedMeterManufacturer}
//                         valueList={meterManufacturers}
//                         placeholder="Select a Manufacturer"
//                         onChange={(item) => setSelectedMeterManufacturer(item.value)}
//                     />
//                     <EcomDropDown
//                         value={selectedMeterModelCode}
//                         valueList={meterModelCodes}
//                         placeholder="Select Model Code"
//                         onChange={(item) => setSelectedMeterModelCode(item.value)}
//                         style={{ width: width * 0.9 }}
//                     />
//                 </>
//             );
//         } else {
//             return (
//                 <>
//                     <TextInput
//                         value={selectedMeterManufacturer}
//                         placeholder="Enter Manufacturer"
//                         onChangeText={setSelectedMeterManufacturer}
//                         style={{ width: width * 0.9, height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
//                     />
//                     <TextInput
//                         value={selectedMeterModelCode}
//                         placeholder="Enter Model Code"
//                         onChangeText={setSelectedMeterModelCode}
//                         style={{ width: width * 0.9, height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
//                     />
//                 </>
//             );
//         }
//     };

//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Text>Corrector</Text>
//             <EcomDropDown
//                 value={selectedCorrectorManufacturer}
//                 valueList={correctorManufacturers}
//                 placeholder="Select a Manufacturer"
//                 onChange={(item) => setSelectedCorrectorManufacturer(item.value)}
//                 style={{ width: width * 0.9 }}
//             />
//             <EcomDropDown
//                 value={selectedCorrectorModelCode}
//                 valueList={correctorModelCodes}
//                 placeholder="Select Model Code"
//                 onChange={(item) => setSelectedCorrectorModelCode(item.value)}
//                 style={{ width: width * 0.9 }}
//             />

//             <Text>Meters</Text>
//             <EcomDropDown
//                 value={selectedMeterType}
//                 valueList={meterTypes}
//                 onChange = {item => setSelectedMeterType(item.value)}
//                 placeholder="Select a Meter Type"
        
//             />
//             {selectedMeterType !== null && renderMeterTypeSpecificInput()}

//             {meterDetails && (
//                 <View>
//                     <Text>Meter Details:</Text>
//                     <Text>Manufacturer: {meterDetails.Manufacturer}</Text>
//                     <Text>Model Code: {meterDetails.ModelCode}</Text>
//                     <Text>Measuring Capacity: {meterDetails.MeasuringCapacity}</Text>
//                     <Text>Multiplication Factor: {meterDetails.MultiplicationFactor}</Text>
//                     <Text>Number of Dials: {meterDetails.NumberOfDials}</Text>
//                     <Text>Pulse Value: {meterDetails.PulseValue}</Text>
//                     <Text>Unit of Measure: {meterDetails.UnitsOfMeasure}</Text>
//                     <Text>Meter Mechanism: {meterDetails.MeterMechanism}</Text>
//                     <Text>Payment Method: {meterDetails.PaymentMethod}</Text>
//                 </View>
//             )}
//         </View>
//     );
// };

// export default Test;


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import jwtDecode from 'jwt-decode'; // Correct import

const Test = () => {
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const token = "eyJ0eXAiO..."; // Your JWT token goes here

    try {
      const decoded = jwtDecode(token);
      setDecodedToken(decoded);
      console.log('Decoded Token:', decoded); // Log decoded token to console
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>JWT Decode Example</Text>
      <Text style={styles.text}>Token Info: {decodedToken ? JSON.stringify(decodedToken) : 'Token not available or invalid'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default Test;

