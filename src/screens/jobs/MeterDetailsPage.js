import { useContext, useRef, useState, useEffect, useCallback } from 'react';
import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import {
  NUMBER_OF_DIALS,
  PULSE_VALUE,
  METER_POINT_LOCATION_CHOICES,
  METER_PRESSURE_TIER_CHOICES,
  METER_POINT_STATUS_CHOICES,
  UNIT_OF_MEASURE_CHOICES,
  METER_TYPE_CHOICES,
  MECHANISM_TYPE_CHOICES,
  meterType,
  tableNames,
  tablename,
} from '../../utils/constant';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import Text from '../../components/Text';
import OptionalButton from '../../components/OptionButton';
import EcomDropDown from '../../components/DropDown';
import TextInput, { TextInputWithTitle } from '../../components/TextInput';
import { AppContext } from '../../context/AppContext';
import EcomHelper from '../../utils/ecomHelper';
import BarcodeScanner from '../../components/BarcodeScanner';
import { useSQLiteContext } from 'expo-sqlite/next';

const alphanumericRegex = /^[a-zA-Z0-9]*$/;
const { width, height } = Dimensions.get('window');

function MeterDetailsPage() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const route = useRoute();
  const { title, nextScreen } = route.params;
  const camera = useRef(null);

  const saveToDatabase = async () => {
    const meterDetailsJson = JSON.stringify(meterDetails);
    try {
      await db
        .runAsync('UPDATE Jobs SET meterDetails = ? WHERE id = ?', [
          meterDetailsJson,
          jobID,
        ])
        .then((result) => {
          console.log('meterDetails saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving meterDetails to database:', error);
    }
  };

  const { jobType, meterDetails, setMeterDetails, jobID } =
    useContext(AppContext);
  console.log('job type:', jobType);
  console.log('MeterDetailsPage');
  const isIos = Platform.OS === 'ios';

  const handleInputChange = (name, value) => {
    setMeterDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    console.log('value updated:', name);
    console.log('value updated:', value);
    console.log('Meter Details:', meterDetails);
  };

  const handleMultipleInputChanges = (updates) => {
    setMeterDetails((prevDetails) => ({
      ...prevDetails,
      ...updates,
    }));
  };

  const [pressureTierList, setPressureTierList] = useState(
    METER_PRESSURE_TIER_CHOICES
  );
  const [meterManufacturers, setMeterManufacturers] = useState([]);
  const [meterModelCodes, setMeterModelCodes] = useState([]);
  const [meterTypes, setMeterTypes] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const diaphragmMeterTypes = ['1', '2', '4'];

  // useEffect(() => {
  //   if (meterDetails?.meterType && diaphragmMeterTypes.includes(meterDetails.meterType.value)) {
  //     setPressureTierList([
  //       { label: "LP", value: "LP" },
  //       { label: "MP", value: "MP" }
  //     ]);
  //     if (!['LP', 'MP'].includes(meterDetails.pressureTier?.value)) {
  //       handleInputChange('pressureTier', null);
  //     }
  //   } else {
  //     setPressureTierList(METER_PRESSURE_TIER_CHOICES);
  //   }
  // }, [meterDetails?.meterType]);
  useEffect(() => {
    if (!meterDetails.uom) {
      handleInputChange('uom', {
        _index: 1,
        label: 'Standard Cubic Meters per hour',
        value: 2,
      });
    }
    if (!meterDetails.pulseValue) {
      handleInputChange('pulseValue', { _index: 0, label: '1', value: 1 });
    }
    if (!meterDetails.status) {
      handleInputChange('status', {
        _index: 2,
        data: 'LI',
        label: 'Live',
        value: 3,
      });
    }
    if (!meterDetails.mechanism) {
      handleInputChange('mechanism', { _index: 0, label: 'Credit', value: 1 });
    }
  }, []);
  const getMeterTypes = useCallback(async () => {
    try {
      const result = METER_TYPE_CHOICES;
      setMeterTypes(
        result
          .map((type) => ({
            label: type.label,
            value: type.value,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
      console.log('meter Types:', result);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getMeterModelCodes = useCallback(async () => {
    console.log('getMeterModelCodes called');
    const tableName = meterDetails?.meterType
      ? tableNames[meterDetails.meterType.value]
      : null;
    if (tableName) {
      try {
        const query = `SELECT DISTINCT ModelCode FROM ${tableName} WHERE Manufacturer = ?`;
        const params = [meterDetails.manufacturer?.value || '']; // Use meterDetails.manufacturer?.value
        console.log('Executing query:', query, 'with params:', params);
        const result = await db.getAllAsync(query, params);
        console.log('Query result:', result);
        setMeterModelCodes(
          result
            .map((model) => ({
              label: model.ModelCode,
              value: model.ModelCode,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        );
        console.log('Model codes set:', meterModelCodes);
      } catch (err) {
        console.error('SQL Error: ', err);
      }
    } else {
      console.log('meterDetails.meterType is false, not fetching model codes');
    }
  }, [meterDetails?.meterType, meterDetails?.manufacturer]);

  const getMeterManufacturers = useCallback(async () => {
    console.log('getMeterManufacturers called');
    const meterType = meterDetails?.meterType?.value; // Access meterType safely
    const tableName = meterType && tableNames[meterType]; // Check if meterType exists before accessing tableNames
    if (tableName) {
      try {
        const query = `SELECT DISTINCT Manufacturer FROM ${tableName}`;
        console.log('Executing query:', query);
        const result = await db.getAllAsync(query);
        console.log('Query result:', result);
        setMeterManufacturers(
          result
            .map((manu) => ({
              label: manu.Manufacturer,
              value: manu.Manufacturer,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        );
        console.log('Manufacturers set:', meterManufacturers);
      } catch (err) {
        console.error('SQL Error: ', err);
      }
    } else {
      console.log(
        'meterDetails.meterType is falsy, setting manufacturers to empty array'
      );
      setMeterManufacturers([]);
    }
  }, [meterDetails?.meterType]);

  useEffect(() => {
    getMeterTypes();
    console.log('Meter Details:', meterDetails);
  }, [getMeterTypes, meterDetails]);

  useEffect(() => {
    if (meterDetails?.meterType && meterDetails.meterType.value !== undefined) {
      console.log(
        'Fetching meter manufacturers for meter type:',
        meterDetails?.meterType
      );
      getMeterManufacturers();
    } else {
      setMeterManufacturers([]);
      setMeterModelCodes([]);
    }
  }, [getMeterManufacturers, meterDetails?.meterType]);

  useEffect(() => {
    if (
      meterDetails?.manufacturer &&
      meterDetails.manufacturer.value !== undefined
    ) {
      console.log(
        'Fetching meter model codes for manufacturer:',
        meterDetails?.manufacturer
      );
      getMeterModelCodes();
    } else {
      setMeterModelCodes([]);
    }
  }, [getMeterModelCodes, meterDetails?.manufacturer]);

  const handleMeterTypeChange = (item) => {
    handleInputChange('meterType', item);
    handleInputChange('manufacturer', null);
    handleInputChange('model', null);
    handleInputChange('pressureTier', null);
  };

  const nextPressed = async () => {
    if (meterDetails.location == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Location'");
      return;
    }
    if (meterDetails.model == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Model'");
      return;
    }
    if (meterDetails.manufacturer == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Manufacturer'");
      return;
    }
    if (meterDetails.uom == null) {
      EcomHelper.showInfoMessage("Please Choose 'UOM'");
      return;
    }
    if (meterDetails.meterType == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Type'");
      return;
    }
    if (meterDetails.havePulseValue && meterDetails.pulseValue == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Pulse Value'");
      return;
    }
    if (meterDetails.mechanism == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Mechanism'");
      return;
    }
    if (meterDetails.pressureTier == null) {
      EcomHelper.showInfoMessage("Please Choose 'Metering Pressure Tier'");
      return;
    }
    if (meterDetails.pressure == null) {
      EcomHelper.showInfoMessage("Please Input 'Pressure'");
      return;
    }

    let isDiaphragm =
      meterDetails.meterType &&
      [1, 2, 4].includes(meterDetails.meterType.value);
    let isNotML =
      meterDetails.pressureTier &&
      [1, 4].includes(meterDetails.pressureTier.value);
    if (isDiaphragm && isNotML) {
      EcomHelper.showInfoMessage('Diagphragm Meter can only be LP or MP');
      return;
    }
    console.log('Navigating to', nextScreen);
    try {
      await saveToDatabase();
      console.log('Meter details saved, navigating to', nextScreen);
      navigation.navigate(nextScreen);
    } catch (error) {
      console.error('Failed to save meter details or navigate:', error);
    }
  };

  const backPressed = () => {
    saveToDatabase();
    navigation.goBack();
  };

  const scanBarcode = () => {
    setIsModal(true);
  };

  const barcodeRecognized = (codes) => {
    EcomHelper.showInfoMessage(codes.data);
    console.log(codes);
    setIsModal(false);
    handleInputChange('serialNumber', codes.data);
  };
  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={title}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={isIos ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={styles.content}>
          <View style={styles.spacer} />
          <View style={styles.body}>
            <EcomDropDown
              width={width * 0.5}
              value={meterDetails?.location}
              valueList={METER_POINT_LOCATION_CHOICES}
              placeholder={'Meter location'}
              onChange={(item) => {
                console.log(item);
                handleInputChange('location', item);
              }}
            />
            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  width={width * 0.5}
                  value={meterDetails?.meterType}
                  valueList={meterTypes}
                  placeholder="Select a Meter Type"
                  onChange={handleMeterTypeChange}
                />
              </View>

              <View style={{ flex: 0.5 }}>
                {meterDetails.meterType &&
                meterDetails.meterType.value === '7' ? (
                  <View style={{ flex: 1 }}>
                    <TextInput
                      value={meterDetails.manufacturer}
                      onChangeText={(txt) =>
                        handleInputChange('manufacturer', txt)
                      }
                      placeholder="Enter Manufacturer"
                      style={styles.input}
                    />
                  </View>
                ) : (
                  <EcomDropDown
                    width={width * 1}
                    value={meterDetails.manufacturer}
                    valueList={meterManufacturers}
                    placeholder="Select a Manufacturer"
                    onChange={(item) => handleInputChange('manufacturer', item)}
                  />
                )}
              </View>
            </View>
            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  width={width * 0.35}
                  value={
                    meterDetails.uom || {
                      _index: 1,
                      label: 'Standard Cubic Meters per hour',
                      value: 2,
                    }
                  }
                  valueList={UNIT_OF_MEASURE_CHOICES}
                  placeholder={'UOM'}
                  onChange={(item) => {
                    console.log(item);
                    handleInputChange('uom', item);
                  }}
                />
              </View>
              <View style={{ flex: 0.5 }}>
                {meterDetails.meterType &&
                meterDetails.meterType.value === '7' ? (
                  <TextInput
                    value={meterDetails.model}
                    onChangeText={(txt) => handleInputChange('model', txt)}
                    placeholder="Enter Model Code"
                    style={styles.input}
                  />
                ) : (
                  <EcomDropDown
                    width={width * 0.5}
                    value={meterDetails.model}
                    valueList={meterModelCodes}
                    placeholder="Select Model Code"
                    onChange={(item) => handleInputChange('model', item)}
                  />
                )}
              </View>
            </View>

            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ flex: 0.5 }}>
                <Text>{'Meter pulse'}</Text>
                <View style={{ height: 5 }} />
                <View style={{ alignItems: 'flex-start' }}>
                  <OptionalButton
                    options={['Yes', 'No']}
                    actions={[
                      () => {
                        handleInputChange('havePulseValue', true);
                      },
                      () => {
                        handleInputChange('havePulseValue', false);
                        handleInputChange('pulseValue', null);
                      },
                    ]}
                    value={
                      meterDetails.havePulseValue === null
                        ? null
                        : meterDetails.havePulseValue
                        ? 'Yes'
                        : 'No'
                    }
                  />
                </View>
              </View>

              {meterDetails.havePulseValue === true ? (
                <View style={{ flex: 0.5 }}>
                  <EcomDropDown
                    width={width * 0.35}
                    value={
                      meterDetails.pulseValue || {
                        _index: 0,
                        label: '1',
                        value: 1,
                      }
                    }
                    valueList={PULSE_VALUE}
                    placeholder={'Meter pulse value'}
                    onChange={(item) => {
                      console.log(item);
                      handleInputChange('pulseValue', item);
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
                  title={'Measuring capacity'}
                  value={meterDetails.measuringCapacity}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9]/g, '');
                    handleInputChange('measuringCapacity', numericValue);
                  }}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
              <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  width={width * 0.35}
                  value={meterDetails.year}
                  valueList={EcomHelper.getYears(1901)}
                  placeholder={'Year of manufacturer'}
                  onChange={(item) => {
                    console.log(item);
                    handleInputChange('year', item);
                  }}
                />
              </View>
            </View>

            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  value={meterDetails.dialNumber}
                  valueList={NUMBER_OF_DIALS}
                  placeholder={'Number of dials'}
                  onChange={(item) => {
                    console.log(item);
                    handleInputChange('dialNumber', item);
                  }}
                />
              </View>
              <View style={{ flex: 0.5, marginTop: 8, marginLeft: 8 }}>
                <TextInputWithTitle
                  value={meterDetails.reading}
                  title={'Meter read'}
                  onChangeText={(txt) => {
                    //validation
                    const numericValue = txt.replace(/[^0-9]/g, '');
                    handleInputChange('reading', numericValue);
                  }}
                  keyboardType="numeric"
                  maxLength={
                    meterDetails.dialNumber
                      ? parseInt(meterDetails.dialNumber.value)
                      : 0
                  }
                  style={[styles.input, { width: '100%' }]}
                />
              </View>
            </View>

            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ flex: 0.5 }}>
                <Text>{'Meter serial number'}</Text>
                <View style={{ height: 5 }} />
                <View style={styles.row}>
                  <TextInput
                    value={meterDetails.serialNumber}
                    onChangeText={(txt) => {
                      const withSpacesAllowed = txt.toUpperCase();
                      const formattedText = withSpacesAllowed.replace(
                        /[^A-Z0-9]+/g,
                        ''
                      );
                      handleInputChange('serialNumber', formattedText);
                    }}
                    style={{ ...styles.input }}
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
                  value={
                    meterDetails.status || {
                      _index: 2,
                      data: 'LI',
                      label: 'Live',
                      value: 3,
                    }
                  }
                  valueList={METER_POINT_STATUS_CHOICES}
                  placeholder={'Meter status'}
                  onChange={(item) => {
                    console.log(item);
                    handleInputChange('status', item);
                  }}
                />
              </View>
            </View>

            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  value={
                    meterDetails.mechanism || {
                      _index: 0,
                      label: 'Credit',
                      value: 1,
                    }
                  }
                  valueList={MECHANISM_TYPE_CHOICES}
                  placeholder={'Meter Mechanism'}
                  onChange={(item) => {
                    console.log(item);
                    handleInputChange('mechanism', item);
                  }}
                />
              </View>
              <View style={{ flex: 0.5 }}>
                <EcomDropDown
                  width={'35%'}
                  value={meterDetails.pressureTier}
                  valueList={pressureTierList} //METER_PRESSURE_TIER_CHOICES
                  placeholder={'Metering pressure tier'}
                  onChange={(item) => {
                    console.log(item);
                    handleInputChange('pressureTier', item);
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
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <TextInput
                    value={meterDetails.pressure}
                    onChangeText={(txt) => {
                      if (txt.length > 5) {
                        EcomHelper.showInfoMessage(
                          'Max length should be less than 5'
                        );
                        return;
                      }
                      handleInputChange('pressure', txt);
                    }}
                    keyboardType="numeric"
                    style={{
                      ...styles.input,
                      width: '45%',
                      alignSelf: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensure vertical alignment is centered for row items
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
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '35%',
  },
  questions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  closeButtonContainer: {
    position: 'absolute',
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
