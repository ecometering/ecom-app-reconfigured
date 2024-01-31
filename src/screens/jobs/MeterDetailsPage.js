import React, { useContext, useRef, useState,useEffect } from "react";
import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  height,
  isIos,
  unitH,
  unitW,
  width,
  NUMBER_OF_DEALS,
  PULSE_VALUE,
  METER_POINT_LOCATION_CHOICES,
  METER_PRESSURE_TIER_CHOICES,
  METER_POINT_STATUS_CHOICES,
  UNIT_OF_MEASURE_CHOICES,
  METER_TYPE_CHOICES,
  MECHANISM_TYPE_CHOICES,
  
} from "../../utils/constant";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import Text from "../../components/Text";
import OptionalButton from "../../components/OptionButton";
import EcomDropDown from "../../components/DropDown";
import TextInput, { TextInputWithTitle } from "../../components/TextInput";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";
import BarcodeScanner from "../../components/BarcodeScanner";
import { fetchManufacturersForMeterType, fetchModelsForManufacturer } from '../../utils/database';

const alphanumericRegex = /^[a-zA-Z0-9]*$/;

function MeterDetailsPage() {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const camera = useRef(null);
  const jobType = appContext.jobType;
  const meterDetails = appContext.meterDetails;
  console.log("MeterDetailsPage");

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
  useEffect(() => {
    if (type) {
      fetchManufacturersForMeterType(type.label)
        .then(data => setManufacturers(data))
        .catch(error => console.error(error));
    }
  }, [type]);

  useEffect(() => {
    if (manufacturer && type) {
      fetchModelsForManufacturer(type.label, manufacturer.label)
        .then(data => setModels(data))
        .catch(error => console.error(error));
    }
  }, [manufacturer, type]);
  const nextPressed = () => {
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
      haveSerialNumber: haveSerialNumber,
    });

    let isDiaphragm = [1, 2, 4].includes(type.value);
    let isNotML = [1, 4].includes(pressureTier.value);
    if (isDiaphragm && isNotML) {
      EcomHelper.showInfoMessage("Diagphragm Meter can only be LP or MP");
      return;
    }

    // navigate
    navigation.navigate("MeterIndexPhotoPage");
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

  const pageTitle = jobType === "Install" ? "New Meter Details" : jobType;

  const MeterTypeData = {
    1: TIN_CASE_DIAPHGRAM_MODEL_CODE_LIST,
    2: DIAPHRAGM_MODEL_CODE_LIST,
    4: DIAPHRAGM_MODEL_CODE_LIST,
    3: ROTARY_MODEL_CODE_LIST,
    5: TURBINE_MODEL_LIST,
    6: ULTRASONIC_MODE_LIST,
    7: MATERIAL_MODEL_CODE_LIST
  }

  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={pageTitle}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={isIos ? "padding" : null}
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
              <EcomDropDown
                width={width * 0.35}
                value={type}
                valueList={[
                  {label: 'D-DIAPHRAGM OF UNKOWN MATERIAL', value: 1},
                  {label: 'L-LEATHER DIAPHRAGM', value: 2},
                  {label: 'R-ROTARY', value: 3},
                  {label: 'S-SYNTHETIC DIAPHRAGM', value: 4},
                  {label: 'T-TURBINE', value: 5},
                  {label: 'U-ULTRASONIC', value: 6},
                  {label: 'Unknown', value: 7},
                ]}
                placeholder={"Meter type"}
                onChange={(item) => {
                  console.log(item);
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
              <EcomDropDown
                width={width * 0.35}
                value={manufacturer}
                valueList={METER_DETAILS_METER_MANUFACTURER_LIST}
                placeholder={"Meter Manufacturer"}
                onChange={(item) => {
                  console.log(item);
                  setManufacturer(item);
                }}
              />
            </View>
            <View style={styles.spacer} />
            <View style={styles.row}>
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
              <EcomDropDown
                width={width * 0.35}
                value={model}
                valueList={MeterTypeData[type?.value??1]}
                placeholder={"Meter model"}
                onChange={(item) => {
                  console.log(item);
                  setModel(item);
                }}
              />
            </View>
            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ width: width * 0.35 }}>
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
              ) : (
                <View style={{ flex: 1 }} />
              )}
            </View>
            <View style={styles.spacer} />
            <View style={styles.row}>
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
            <View style={styles.spacer} />
            <View style={styles.row}>
              <TextInputWithTitle
                value={reading}
                title={"Meter Reading"}
                onChangeText={(txt) => {
                  //validation
                  const numericValue = txt.replace(/[^0-9]/g, "");
                  setReading(numericValue);
                }}
                keyboardType="numeric"
                style={styles.input}
              />
              <EcomDropDown
                width={width * 0.35}
                value={dialNumber}
                valueList={NUMBER_OF_DEALS}
                placeholder={"Number of dials"}
                onChange={(item) => {
                  console.log(item);
                  setDialNumber(item);
                }}
              />
            </View>
            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ width: width * 0.35 }}>
                <Text>{"Meter serial number"}</Text>
                <View style={{ height: 5 }} />
                <View style={styles.row}>
                  <TextInput
                    value={serialNumber}
                    onChangeText={(txt) => {
                      if (alphanumericRegex.test(txt)) setSerialNumber(txt);
                    }}
                    style={{ ...styles.input, width: unitW * 300 }}
                  />
                  <Button
                    title="📷"
                    style={styles.scanBtn}
                    onPress={scanBarcode}
                  />
                </View>
              </View>

              <EcomDropDown
                width={width * 0.35}
                value={status}
                valueList={METER_POINT_STATUS_CHOICES}
                placeholder={"Meter status"}
                onChange={(item) => {
                  console.log(item);
                  setStatus(item);
                }}
              />
            </View>
            <View style={styles.spacer} />
            <View style={styles.row}>
              <EcomDropDown
                width={width * 0.35}
                value={mechanism}
                valueList={MECHANISM_TYPE_CHOICES}
                placeholder={"Meter Mechanism"}
                onChange={(item) => {
                  console.log(item);
                  setMechanism(item);
                }}
              />
              <EcomDropDown
                width={width * 0.35}
                value={pressureTier}
                valueList={pressureTierList} //METER_PRESSURE_TIER_CHOICES
                placeholder={"Metering pressure tier"}
                onChange={(item) => {
                  console.log(item);
                  setPressureTier(item);
                }}
              />
            </View>
            <View style={styles.spacer} />
            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ width: width * 0.35 }}>
                <Text>Meter Outlet Working Pressure</Text>
                <View style={{ height: 5 }} />
                <View
                  style={{
                    ...styles.row,
                    alignItems: "center",
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
                      width: unitW * 300,
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
    marginHorizontal: width * 0.1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    width: width * 0.35,
    alignSelf: "center",
    height: unitH * 40,
  },
  scanBtn: {
    height: 20,
  },
  optionContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: width * 0.35,
  },
  questions: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  spacer: {
    height: unitH * 20,
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
