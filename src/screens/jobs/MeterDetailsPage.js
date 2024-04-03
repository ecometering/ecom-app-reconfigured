import { useContext, useRef, useState, useEffect } from "react";
import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Platform
} from "react-native";
import {



  NUMBER_OF_DIALS,
  PULSE_VALUE,
  METER_POINT_LOCATION_CHOICES,
  METER_PRESSURE_TIER_CHOICES,
  METER_POINT_STATUS_CHOICES,
  UNIT_OF_MEASURE_CHOICES,
  METER_TYPE_CHOICES,
  MECHANISM_TYPE_CHOICES


} from "../../utils/constant";
import { getDatabaseTables, } from "../../utils/database";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/Header";
import Text from "../../components/Text";
import OptionalButton from "../../components/OptionButton";
import EcomDropDown from "../../components/DropDown";
import TextInput, { TextInputWithTitle } from "../../components/TextInput";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";
import BarcodeScanner from "../../components/BarcodeScanner";
import { fetchManufacturersForMeterType, fetchModelsForManufacturer, openDatabase } from '../../utils/database';

const alphanumericRegex = /^[a-zA-Z0-9]*$/;
const { width, height } = Dimensions.get('window');
function MeterDetailsPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, nextScreen, jobId } = route.params;
  const appContext = useContext(AppContext);
  const camera = useRef(null);
  const jobType = appContext.jobType;
  const meterDetails = appContext.meterDetails;
  console.log("job type:", jobType)
  console.log("MeterDetailsPage");
  const isIos = Platform.OS === 'ios';
  const [location, setLocation] = useState(meterDetails?.location);
  const [model, setModel] = useState(meterDetails?.model);
  const [manufacturer, setManufacturer] = useState(meterDetails?.manufacturer);
  const [uom, setUom] = useState(
    meterDetails?.uom == null
      ? { _index: 1, label: "Standard Cubic Meters per hour", value: 2 }
      : meterDetails?.uom
  );
  const [type, setType] = useState(meterDetails?.type);
  const [status, setStatus] = useState(
    meterDetails?.status == null
      ? { _index: 2, data: "Live", label: "LI", value: 3 }
      : meterDetails?.status
  );
  const [measuringCapacity, setMeasuringCapacity] = useState(
    meterDetails?.measuringCapacity
  );
  const [year, setYear] = useState(meterDetails?.year);
  const [reading, setReading] = useState(meterDetails?.reading);
  const [dialNumber, setDialNumber] = useState(meterDetails?.dialNumber);
  const [serialNumber, setSerialNumber] = useState(meterDetails?.serialNumber);
  const [pulseValue, setPulseValue] = useState(
    meterDetails?.pulseValue === null
      ? { _index: 0, label: "1", value: 1 }
      : meterDetails?.pulseValue
  );

  const [mechanism, setMechanism] = useState(
    meterDetails?.mechanism == null
      ? { _index: 0, label: "Credit", value: 1 }
      : meterDetails?.mechanism
  );
  const [pressureTier, setPressureTier] = useState(meterDetails?.pressureTier);
  const [pressureTierList, setPressureTierList] = useState(
    METER_PRESSURE_TIER_CHOICES
  );
  const [pressure, setPressure] = useState(meterDetails?.pressure);
  const [havePulseValue, setHavePulseValue] = useState(
    meterDetails?.havePulseValue
  );
  const [haveSerialNumber, setHaveSerialNumber] = useState(
    meterDetails?.haveSerialNumber
  );

  const [isModal, setIsModal] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const diaphragmMeterTypes = ['1', '2', '4'];

  useEffect(() => {
    if (type && diaphragmMeterTypes.includes(type.value)) {
      setPressureTierList([
        { label: "LP", value: "LP" },
        { label: "MP", value: "MP" }
      ]);
      if (!['LP', 'MP'].includes(pressureTier?.value)) {
        setPressureTier(null);
      }
    } else {
      setPressureTierList(METER_PRESSURE_TIER_CHOICES);
    }
  }, [type, pressureTier]);

  useEffect(() => {
    console.log("+++++++type changed", type)
    if (type) {
      fetchManufacturersForMeterType(type.value)
        .then(data => {
          console.log(">>>  4  >>>fetchManufacturersForMeterType>>>", data);
          setManufacturers(data.map(manufacturer => ({ label: manufacturer.Manufacturer, value: manufacturer.Manufacturer })))
        })
        .catch(error => console.error("error", error));
    }
  }, [type]);

  useEffect(() => {
    if (manufacturer && type) {
      fetchModelsForManufacturer(type.value, manufacturer.label)
        .then(data => {
          const res = data.map((model, index) => ({ label: model["Model Code (A0083)"], value: index }))
          console.log("res", res)
          console.log(">>>  4  >>>fetchModelsForManufacturer", data);
          setModels(data.map((model, index) => ({ label: model.label, value: model.value })))
        })
        .catch(error => console.error(error));
    }
  }, [manufacturer]);


  const saveMeterDetailsToDatabase = async () => {
    const db = await openDatabase();

    const meterDetailsJson = JSON.stringify({
      location,
      model,
      manufacturer,
      uom,
      type,
      status,
      measuringCapacity,
      year,
      reading,
      dialNumber,
      serialNumber,
      pulseValue,
      mechanism,
      pressureTier,
      pressure,
      havePulseValue,
      haveSerialNumber,
    });
    const progress = 5;
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE Jobs SET meterDetails = ?, progress = ? WHERE id = ?`,
        [meterDetailsJson, progress, jobId], // Assuming appContext.jobId is the current job's ID
        (_, result) => {
          console.log('Meter details updated in database.');
        },
        (_, error) => {
          console.log('Error updating meter details in database:', error);
        }
      );
    });
  };

  const nextPressed = async () => {
    if (location == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Location'");
      return;
    }
    if (model == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Model'");
      return;
    }
    if (manufacturer == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Manufacturer'");
      return;
    }
    if (uom == null) {
      EcomHelper.showInfoMessage("Please Choose 'UOM'");
      return;
    }
    if (type == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Type'");
      return;
    }
    if (havePulseValue && pulseValue == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Pulse Value'");
      return;
    }
    if (mechanism == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Mechanism'");
      return;
    }
    if (pressureTier == null) {
      EcomHelper.showInfoMessage("Please Choose 'Metering Pressure Tier'");
      return;
    }
    if (pressure == null) {
      EcomHelper.showInfoMessage("Please Input 'Pressure'");
      return;
    }

    appContext.setMeterDetails({
      ...meterDetails,
      location: location,
      model: model,
      manufacturer: manufacturer,
      uom: uom,
      type: type,
      status: status,
      measuringCapacity: measuringCapacity,
      year: year,
      reading: reading,
      dialNumber: dialNumber,
      serialNumber: serialNumber,
      pulseValue: pulseValue,
      mechanism: mechanism,
      pressureTier: pressureTier,
      pressure: pressure,
      havePulseValue: havePulseValue,

    });

    let isDiaphragm = [1, 2, 4].includes(type.value);
    let isNotML = [1, 4].includes(pressureTier.value);
    if (isDiaphragm && isNotML) {
      EcomHelper.showInfoMessage("Diagphragm Meter can only be LP or MP");
      return;
    }
    console.log(" navigating to", nextScreen);
    try {
      await saveMeterDetailsToDatabase();
      console.log("Meter details saved, navigating to", nextScreen);
      navigation.navigate(nextScreen);
    } catch (error) {
      console.error("Failed to save meter details or navigate:", error);
    }

  };

  const backPressed = () => {
    appContext.setMeterDetails({
      ...meterDetails,
      location: location,
      model: model,
      manufacturer: manufacturer,
      uom: uom,
      type: type,
      status: status,
      measuringCapacity: measuringCapacity,
      year: year,
      reading: reading,
      dialNumber: dialNumber,
      serialNumber: serialNumber,
      pulseValue: pulseValue,
      mechanism: mechanism,
      pressureTier: pressureTier,
      pressure: pressure,
      havePulseValue: havePulseValue,
      haveSerialNumber: haveSerialNumber,
    });
    navigation.goBack();
  };

  const scanBarcode = () => {
    setIsModal(true);
  };

  const barcodeRecognized = (codes) => {
    EcomHelper.showInfoMessage(codes.data);
    console.log(codes);
    setIsModal(false);
    setSerialNumber(codes.data);
  };




  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={""}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={isIos ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView style={styles.content}>
          <View style={styles.spacer} />
          <View style={styles.body}>
            <EcomDropDown
              width={width * 0.5}
              value={location}
              valueList={METER_POINT_LOCATION_CHOICES}
              placeholder={"Meter location"}
              onChange={(item) => {
                console.log(item);
                setLocation(item);
              }}
            />
            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  width={width * 0.5}
                  value={type}
                  valueList={[
                    { label: 'D-DIAPHRAGM OF UNKOWN MATERIAL', value: "1" },
                    { label: 'L-LEATHER DIAPHRAGM', value: "2" },
                    { label: 'R-ROTARY', value: "3" },
                    { label: 'S-SYNTHETIC DIAPHRAGM', value: "4" },
                    { label: 'T-TURBINE', value: "5" },
                    { label: 'U-ULTRASONIC', value: "6" }
                  ]}
                  placeholder={"Meter type"}
                  onChange={(item) => {
                    console.log("==============item", item);
                    setType(item);
                    let isDiaphragm = [1, 2, 4].includes(item.value);
                    let isML = [3, 2].includes(pressureTier?.value);
                    if (isDiaphragm) {
                      setPressureTierList([
                        { label: "LP", data: "LP", value: 3 },
                        { label: "MP", data: "MP", value: 2 },
                      ]);
                    } else {
                      setPressureTierList(METER_PRESSURE_TIER_CHOICES);
                    }
                    if (!isDiaphragm && isML) {
                      setPressureTier(null);
                    }
                  }}
                />
              </View>

              <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  width={width * 1}
                  value={manufacturer}
                  valueList={manufacturers} // Dynamically populated from SQLite database
                  placeholder={"Meter Manufacturer"}
                  onChange={(item) => {
                    console.log(item);
                    setManufacturer(item);
                    // Reset models when manufacturer changes
                    setModels([]);
                  }}
                />
              </View>
            </View>
            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  width={width * 0.35}
                  value={uom}
                  valueList={UNIT_OF_MEASURE_CHOICES}
                  placeholder={"UOM"}
                  onChange={(item) => {
                    console.log(item);
                    setUom(item);
                  }}
                />
              </View>
              <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  width={width * 0.5}
                  value={model}
                  valueList={models} // Dynamically populated based on the selected manufacturer
                  placeholder={"Meter Model"}
                  onChange={(item) => {
                    console.log(item);
                    setModel(item);
                  }}
                />
              </View>
            </View>

            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ flex: 0.5 }}>
                <Text>{"Meter pulse"}</Text>
                <View style={{ height: 5 }} />
                <View style={{ alignItems: "flex-start" }}>
                  <OptionalButton
                    options={["Yes", "No"]}
                    actions={[
                      () => {
                        setHavePulseValue(true);
                      },
                      () => {
                        setHavePulseValue(false);
                        setPulseValue(null);
                      },
                    ]}
                    value={
                      havePulseValue === null
                        ? null
                        : havePulseValue
                          ? "Yes"
                          : "No"
                    }
                  />
                </View>
              </View>

              {havePulseValue === true ? (
                <View style={{ flex: 0.5 }}>
                  <EcomDropDown
                    width={width * 0.35}
                    value={pulseValue}
                    valueList={PULSE_VALUE}
                    placeholder={"Meter pulse value"}
                    onChange={(item) => {
                      console.log(item);
                      setPulseValue(item);
                    }}
                  />
                </View>
              ) : (
                <View style={{ flex: 1 }} />
              )}
            </View>


            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ flex: 0.5 }}>
                <TextInputWithTitle
                  title={"Measuring capacity"}
                  value={measuringCapacity}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9]/g, "");
                    setMeasuringCapacity(numericValue);
                  }}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
              <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  width={width * 0.35}
                  value={year}
                  valueList={EcomHelper.getYears(1901)}
                  placeholder={"Year of manufacturer"}
                  onChange={(item) => {
                    console.log(item);
                    setYear(item);
                  }}
                />
              </View>
            </View>


            <View style={styles.spacer} />
            <View style={styles.row}>
            <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  value={dialNumber}
                  valueList={NUMBER_OF_DIALS}
                  placeholder={"Number of dials"}
                  onChange={(item) => {
                    console.log(item);
                    setDialNumber(item);
                  }}
                />
              </View>
              <View style={{ flex: 0.5, marginTop: 8, marginLeft: 8 }}>
                <TextInputWithTitle
                  value={reading}
                  title={"Meter read"}
                  onChangeText={(txt) => {
                    //validation
                    const numericValue = txt.replace(/[^0-9]/g, "");
                    setReading(numericValue);
                  }}
                  keyboardType="numeric"
                  maxLength={dialNumber ? parseInt(dialNumber.value) : 0}
                  style={[styles.input, {width: '100%'}]}
                />
              </View>
           
            </View>


            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ flex: 0.5 }}>
                <Text>{"Meter serial number"}</Text>
                <View style={{ height: 5 }} />
                <View style={styles.row}>
                  <TextInput
                    value={serialNumber}
                    onChangeText={(txt) => {
                      const withSpacesAllowed = txt.toUpperCase();
                      const formattedText = withSpacesAllowed.replace(/[^A-Z0-9]+/g, '');
                      setSerialNumber(formattedText);
                    }}
                    style={{ ...styles.input, }}
                  />
                  <Button
                    title="📷"
                    style={styles.scanBtn}
                    onPress={scanBarcode}
                  />
                </View>
              </View>
              <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  width={'35%'}
                  value={status}
                  valueList={METER_POINT_STATUS_CHOICES}
                  placeholder={"Meter status"}
                  onChange={(item) => {
                    console.log(item);
                    setStatus(item);
                  }}
                />
              </View>
            </View>


            <View style={styles.spacer} />
            <View style={styles.row}>

              <View style={{ flex: 0.5 }}>

                <EcomDropDown

                  value={mechanism}
                  valueList={MECHANISM_TYPE_CHOICES}
                  placeholder={"Meter Mechanism"}
                  onChange={(item) => {
                    console.log(item);
                    setMechanism(item);
                  }}
                />
              </View>
              <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  width={'35%'}
                  value={pressureTier}
                  valueList={pressureTierList} //METER_PRESSURE_TIER_CHOICES
                  placeholder={"Metering pressure tier"}
                  onChange={(item) => {
                    console.log(item);
                    setPressureTier(item);
                  }}
                />
              </View>
            </View>

            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text>Meter Outlet Working Pressure</Text>
                <View style={{ height: 5 }} />
                <View
                  style={{
                    flexDirection: "row", alignItems: "center",
                  }}
                >
                  <TextInput
                    value={pressure}
                    onChangeText={(txt) => {
                      if (txt.length > 5) {
                        EcomHelper.showInfoMessage(
                          "Max length should be less than 5"
                        );
                        return;
                      }
                      setPressure(txt);
                    }}
                    keyboardType="numeric"
                    style={{
                      ...styles.input,
                      width: '45%',
                      alignSelf: "center",
                      marginRight: 8,
                    }}
                  />
                  <Text> mbar</Text>
                </View>
              </View>
            </View>
            <View style={styles.spacer} />
            <View style={styles.spacer} />
            <View style={styles.spacer} />


          </View>
          {isModal && (
            <BarcodeScanner
              setIsModal={setIsModal}
              cameraRef={camera}
              barcodeRecognized={barcodeRecognized}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  body: {
    marginHorizontal: width * 0.05,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Ensure vertical alignment is centered for row items
  },
  input: {
    width: '75%', // Adjust to use full width of its container for better visibility
    height: 40, // Ensure this is a number, not a string
    borderColor: 'gray', // Optional: for border
    borderWidth: 1, // Optional: for border
    padding: 10,
  },
  scanBtn: {
    // If you are using a custom button, ensure it is visible and accessible
  },
  spacer: {
    height: 20,
  },
  // Adjust the dropdown and input container widths in the row
  scanBtn: {
    height: 20,
  },
  optionContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: '35%',
  },
  questions: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  closeButtonContainer: {
    position: "absolute",
    top: 50,
    right: 30,
  },
  closeButtonIcon: {
    width: 20,
    height: 20,
    // Other styles for the close icon
  },
});

export default MeterDetailsPage;