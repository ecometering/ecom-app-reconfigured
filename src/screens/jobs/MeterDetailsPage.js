import { useSQLiteContext } from 'expo-sqlite/next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useContext, useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';

// Components
import Text from '../../components/Text';
import Header from '../../components/Header';
import EcomDropDown from '../../components/DropDown';
import OptionalButton from '../../components/OptionButton';
import BarcodeScanner from '../../components/BarcodeScanner';
import TextInput, { TextInputWithTitle } from '../../components/TextInput';

// Context and Utils
import {
  meterType,
  tablename,
  tableNames,
  PULSE_VALUE,
  NUMBER_OF_DIALS,
  METER_TYPE_CHOICES,
  MECHANISM_TYPE_CHOICES,
  UNIT_OF_MEASURE_CHOICES,
  METER_POINT_STATUS_CHOICES,
  METER_PRESSURE_TIER_CHOICES,
  METER_POINT_LOCATION_CHOICES,
} from '../../utils/constant';
import EcomHelper from '../../utils/ecomHelper';
import { AppContext } from '../../context/AppContext';
import { makeFontSmallerAsTextGrows } from '../../utils/styles';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';

const alphanumericRegex = /^[a-zA-Z0-9]*$/;
const { width, height } = Dimensions.get('window');

function MeterDetailsPage() {
  const route = useRoute();
  const camera = useRef(null);
  const db = useSQLiteContext();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const isIos = Platform.OS === 'ios';
  const { title, nextScreen } = route.params;
  const diaphragmMeterTypes = ['1', '2', '4'];
  const { jobType, meterDetails, setMeterDetails, jobID } =
    useContext(AppContext);

  // Local states
  const [pressureTierList, setPressureTierList] = useState(
    METER_PRESSURE_TIER_CHOICES
  );
  const [meterManufacturers, setMeterManufacturers] = useState([]);
  const [meterModelCodes, setMeterModelCodes] = useState([]);
  const [meterTypes, setMeterTypes] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [localMeterDetails, setLocalMeterDetails] = useState(
    meterDetails ?? {}
  );

  // TODO: this is a hack to prevent memory leaks for now until we find a better way implement this
  const isMounted = useRef(true); // Track if component is mounted

  useEffect(() => {
    // This effect only runs once on mount
    return () => {
      isMounted.current = false; // Set to false when component will unmount
    };
  }, []);

  useEffect(() => {
    if (!localMeterDetails.uom) {
      handleInputChange('uom', {
        _index: 1,
        label: 'Standard Cubic Meters per hour',
        value: 2,
      });
    }
    if (!localMeterDetails.pulseValue) {
      handleInputChange('pulseValue', { _index: 0, label: '1', value: 1 });
    }
    if (!localMeterDetails.status) {
      handleInputChange('status', {
        _index: 2,
        data: 'LI',
        label: 'Live',
        value: 3,
      });
    }
    if (!localMeterDetails.mechanism) {
      handleInputChange('mechanism', { _index: 0, label: 'Credit', value: 1 });
    }
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      getMeterTypes();
    }
  }, [
    getMeterTypes,
    localMeterDetails?.meterType,
    localMeterDetails?.manufacturer,
  ]);

  useEffect(() => {
    if (isMounted.current) {
      if (
        localMeterDetails?.meterType &&
        localMeterDetails.meterType.value !== undefined
      ) {
        console.log(
          'Fetching meter manufacturers for meter type:',
          localMeterDetails?.meterType
        );
        getMeterManufacturers();
      } else {
        setMeterManufacturers([]);
        setMeterModelCodes([]);
      }
    }
  }, [getMeterManufacturers, localMeterDetails?.meterType?.value]);

  useEffect(() => {
    if (isMounted.current) {
      if (
        localMeterDetails?.manufacturer &&
        localMeterDetails.manufacturer.value !== undefined
      ) {
        console.log(
          'Fetching meter model codes for manufacturer:',
          localMeterDetails?.manufacturer
        );
        getMeterModelCodes();
      } else {
        setMeterModelCodes([]);
      }
    }
  }, [getMeterModelCodes, localMeterDetails?.manufacturer]);

  const handleMeterTypeChange = (item) => {
    handleInputChange('meterType', item);
    handleInputChange('manufacturer', null);
    handleInputChange('model', null);
    handleInputChange('pressureTier', null);
  };

  const saveToDatabase = async () => {
    const meterDetailsJson = JSON.stringify(localMeterDetails);
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

  const handleInputChange = (name, value) => {
    setLocalMeterDetails((prevDetails) => {
      return {
        ...prevDetails,
        [name]: value,
      };
    });
  };

  const handleMultipleInputChanges = (updates) => {
    setMeterDetails((prevDetails) => ({
      ...prevDetails,
      ...updates,
    }));
  };

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
    const tableName = localMeterDetails?.meterType
      ? tableNames[localMeterDetails.meterType.value]
      : null;
    if (tableName) {
      try {
        const query = `SELECT DISTINCT ModelCode FROM ${tableName} WHERE Manufacturer = ?`;
        const params = [localMeterDetails.manufacturer?.value || '']; // Use localMeterDetails.manufacturer?.value

        const result = await db.getAllAsync(query, params);

        setMeterModelCodes(
          result
            .map((model) => ({
              label: model.ModelCode,
              value: model.ModelCode,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        );
      } catch (err) {
        console.error('SQL Error: ', err);
      }
    } else {
      console.log(
        'localMeterDetails.meterType is false, not fetching model codes'
      );
    }
  }, [localMeterDetails?.meterType, localMeterDetails?.manufacturer]);

  const getMeterManufacturers = useCallback(async () => {
    const meterType = localMeterDetails?.meterType?.value;
    const tableName = meterType && tableNames[meterType];
    if (tableName) {
      try {
        const query = `SELECT DISTINCT Manufacturer FROM ${tableName}`;

        const result = await db.getAllAsync(query);
        if (isMounted.current) {
          // Check if component is still mounted

          setMeterManufacturers(
            result
              .map((manu) => ({
                label: manu.Manufacturer,
                value: manu.Manufacturer,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))
          );
          console.log('Manufacturers set:', meterManufacturers);
        }
      } catch (err) {
        console.error('SQL Error: ', err);
      }
    } else {
      console.log(
        'localMeterDetails.meterType is falsy, setting manufacturers to empty array'
      );
      setMeterManufacturers([]);
    }
  }, [localMeterDetails?.meterType]);

  const nextPressed = async () => {
    if (localMeterDetails.location == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Location'");
      return;
    }
    if (localMeterDetails.model == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Model'");
      return;
    }
    if (localMeterDetails.manufacturer == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Manufacturer'");
      return;
    }
    if (localMeterDetails.uom == null) {
      EcomHelper.showInfoMessage("Please Choose 'UOM'");
      return;
    }
    if (localMeterDetails.meterType == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Type'");
      return;
    }
    if (
      localMeterDetails.havePulseValue &&
      localMeterDetails.pulseValue == null
    ) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Pulse Value'");
      return;
    }
    if (localMeterDetails.mechanism == null) {
      EcomHelper.showInfoMessage("Please Choose 'Meter Mechanism'");
      return;
    }
    if (localMeterDetails.pressureTier == null) {
      EcomHelper.showInfoMessage("Please Choose 'Metering Pressure Tier'");
      return;
    }
    if (localMeterDetails.pressure == null) {
      EcomHelper.showInfoMessage("Please Input 'Pressure'");
      return;
    }

    let isDiaphragm =
      localMeterDetails.meterType &&
      [1, 2, 4].includes(localMeterDetails.meterType.value);
    let isNotML =
      localMeterDetails.pressureTier &&
      [1, 4].includes(localMeterDetails.pressureTier.value);
    if (isDiaphragm && isNotML) {
      EcomHelper.showInfoMessage('Diagphragm Meter can only be LP or MP');
      return;
    }

    try {
      await saveToDatabase();
      setMeterDetails(localMeterDetails);

      goToNextStep();
    } catch (error) {}
  };

  const backPressed = async () => {
    await saveToDatabase();
    setMeterDetails(localMeterDetails);
    goToPreviousStep();
  };

  const scanBarcode = () => {
    setIsModal(true);
  };

  const barcodeRecognized = (codes) => {
    EcomHelper.showInfoMessage(codes.data);
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
              value={localMeterDetails?.location}
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
                  value={localMeterDetails?.meterType}
                  valueList={meterTypes}
                  placeholder="Select a Meter Type"
                  onChange={handleMeterTypeChange}
                />
              </View>

              <View style={{ flex: 0.5 }}>
                {localMeterDetails.meterType &&
                localMeterDetails.meterType.value === '7' ? (
                  <View style={{ flex: 1 }}>
                    <TextInput
                      value={localMeterDetails.manufacturer}
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
                    value={localMeterDetails.manufacturer}
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
                    localMeterDetails.uom || {
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
                {localMeterDetails.meterType &&
                localMeterDetails.meterType.value === '7' ? (
                  <TextInput
                    value={localMeterDetails.model}
                    onChangeText={(txt) => handleInputChange('model', txt)}
                    placeholder="Enter Model Code"
                    style={styles.input}
                  />
                ) : (
                  <EcomDropDown
                    width={width * 0.5}
                    value={localMeterDetails.model}
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
                      localMeterDetails.havePulseValue === null
                        ? null
                        : localMeterDetails.havePulseValue
                        ? 'Yes'
                        : 'No'
                    }
                  />
                </View>
              </View>

              {localMeterDetails.havePulseValue === true ? (
                <View style={{ flex: 0.5 }}>
                  <EcomDropDown
                    width={width * 0.35}
                    value={
                      localMeterDetails.pulseValue || {
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
                  value={localMeterDetails.measuringCapacity}
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
                  value={localMeterDetails.year}
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
                  value={localMeterDetails.dialNumber}
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
                  value={localMeterDetails.reading}
                  title={'Meter read'}
                  onChangeText={(txt) => {
                    //validation
                    const numericValue = txt.replace(/[^0-9]/g, '');
                    handleInputChange('reading', numericValue);
                  }}
                  keyboardType="numeric"
                  maxLength={
                    localMeterDetails.dialNumber
                      ? parseInt(localMeterDetails.dialNumber.value)
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
                    value={localMeterDetails.serialNumber}
                    onChangeText={(txt) => {
                      const withSpacesAllowed = txt.toUpperCase();
                      const formattedText = withSpacesAllowed.replace(
                        /[^A-Z0-9]+/g,
                        ''
                      );
                      handleInputChange('serialNumber', formattedText);
                    }}
                    style={{
                      ...styles.input,
                      fontSize: makeFontSmallerAsTextGrows(
                        localMeterDetails.serialNumber
                      ),
                    }}
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
                    localMeterDetails.status || {
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
                    localMeterDetails.mechanism || {
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
                  value={localMeterDetails.pressureTier}
                  valueList={
                    localMeterDetails?.meterType &&
                    diaphragmMeterTypes.includes(
                      localMeterDetails.meterType.value
                    )
                      ? pressureTierList.filter(({ label }) =>
                          ['LP', 'MP'].includes(label)
                        )
                      : pressureTierList
                  } //METER_PRESSURE_TIER_CHOICES
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
                    value={localMeterDetails.pressure}
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
