import { useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
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
import { useFormStateContext } from '../../context/AppContext';
import { validateMeterDetails } from './MeterDetailsPage.validator';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

// Constants
import { meterDetailsOptions } from '../../../assets/json/meterDetails';

function MeterDetailsPage() {
  const route = useRoute();
  const camera = useRef(null);
  const { state, setState } = useFormStateContext();
  const { jobType, meterDetails } = state;

  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const isIos = Platform.OS === 'ios';
  const { title } = route.params;
  const diaphragmMeterTypes = ['1', '2', '4'];

  const [isModal, setIsModal] = useState(false);

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
      if (['Install', 'Survey', 'Maintenance'].includes(jobType)) {
        handleInputChange('status', {
          _index: 2,
          data: 'LI',
          label: 'Live',
          value: 3,
        });
      } else if (['Exchange', 'Warrant', 'Removal'].includes(jobType)) {
        handleInputChange('status', {
          _index: 12,
          data: 'RE',
          label: 'Removed',
          value: 13,
        });
      }
    }
    if (!meterDetails.mechanism) {
      handleInputChange('mechanism', { _index: 0, label: 'Credit', value: 1 });
    }
  }, []);

  const handleInputChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      meterDetails: {
        ...prevState.meterDetails,
        [name]: value,
      },
    }));
  };

  const handleMeterTypeChange = (item) => {
    handleInputChange('meterType', item);
    handleInputChange('manufacturer', null);
    handleInputChange('model', null);
    handleInputChange('pressureTier', null);
  };

  const nextPressed = async () => {
    const { isValid, message } = validateMeterDetails(meterDetails);

    if (!isValid) {
      EcomHelper.showInfoMessage(message);
      return;
    }

    let isDiaphragm =
      meterDetails.meterType &&
      [1, 2, 4].includes(meterDetails.meterType.value);
    let isNotML =
      meterDetails.pressureTier &&
      [1, 4].includes(meterDetails.pressureTier.value);
    if (isDiaphragm && isNotML) {
      EcomHelper.showInfoMessage('Diaphragm Meter can only be LP or MP');
      return;
    }

    try {
      goToNextStep();
    } catch (error) {}
  };

  const backPressed = async () => {
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
          <View style={styles.body}>
            <EcomDropDown
              value={meterDetails?.location}
              valueList={METER_POINT_LOCATION_CHOICES}
              placeholder={'Meter location'}
              onChange={(item) => {
                handleInputChange('location', item);
              }}
            />

            <View style={styles.row}>
              <View style={styles.flex}>
                <EcomDropDown
                  value={meterDetails?.meterType}
                  valueList={METER_TYPE_CHOICES}
                  placeholder="Select a Meter Type"
                  onChange={handleMeterTypeChange}
                />
              </View>

              <View style={styles.flex}>
                {meterDetails.meterType &&
                meterDetails.meterType.value === '7' ? (
                  <View style={styles.flex}>
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
                    value={meterDetails.manufacturer}
                    valueList={
                      meterDetailsOptions?.[meterDetails.meterType?.label]
                        ? meterDetailsOptions[meterDetails.meterType?.label]
                            .map(({ Manufacturer }) => ({
                              label: Manufacturer,
                              value: Manufacturer,
                            }))
                            .filter(
                              (v, i, a) =>
                                a.findIndex((t) => t.label === v.label) === i
                            )
                        : []
                    }
                    placeholder="Select a Manufacturer"
                    onChange={(item) => {
                      handleInputChange('manufacturer', item);
                    }}
                  />
                )}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex}>
                <EcomDropDown
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
                    handleInputChange('uom', item);
                  }}
                />
              </View>
              <View style={styles.flex}>
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
                    value={meterDetails.model}
                    valueList={
                      meterDetailsOptions?.[meterDetails.meterType?.label] &&
                      meterDetails.manufacturer
                        ? meterDetailsOptions[meterDetails.meterType?.label]
                            .filter(
                              ({ Manufacturer }) =>
                                Manufacturer ===
                                meterDetails.manufacturer?.value
                            )
                            .map(({ ModelCode }) => ({
                              label: ModelCode,
                              value: ModelCode,
                            }))
                            .filter(
                              (v, i, a) =>
                                a.findIndex((t) => t.label === v.label) === i
                            )
                        : []
                    }
                    placeholder="Select Model Code"
                    onChange={(item) => handleInputChange('model', item)}
                  />
                )}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex}>
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
                <View style={styles.flex}>
                  <EcomDropDown
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
                      handleInputChange('pulseValue', item);
                    }}
                  />
                </View>
              ) : (
                <View style={styles.flex} />
              )}
            </View>

            <View style={styles.row}>
              <View style={styles.flex}>
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
              <View style={styles.flex}>
                <EcomDropDown
                  value={meterDetails.year}
                  valueList={EcomHelper.getYears(1901)}
                  placeholder={'Year of manufacturer'}
                  onChange={(item) => {
                    handleInputChange('year', item);
                  }}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex}>
                <EcomDropDown
                  value={meterDetails.dialNumber}
                  valueList={NUMBER_OF_DIALS}
                  placeholder={'Number of dials'}
                  onChange={(item) => {
                    handleInputChange('dialNumber', item);
                  }}
                />
              </View>
              <View style={{ flex: 1, marginTop: 8, marginLeft: 8 }}>
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

            <View style={styles.row}>
              <View style={styles.flex}>
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
                    style={{
                      ...styles.input,
                    }}
                  />
                  <Button
                    title="📷"
                    style={styles.scanBtn}
                    onPress={scanBarcode}
                  />
                </View>
              </View>
              <View style={styles.flex}>
                <EcomDropDown
                  value={meterDetails.status}
                  valueList={METER_POINT_STATUS_CHOICES}
                  placeholder={'Meter status'}
                  onChange={(item) => {
                    handleInputChange('status', item);
                  }}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex}>
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
                    handleInputChange('mechanism', item);
                  }}
                />
              </View>
              <View style={styles.flex}>
                <EcomDropDown
                  value={meterDetails.pressureTier}
                  valueList={
                    meterDetails?.meterType &&
                    diaphragmMeterTypes.includes(meterDetails.meterType.value)
                      ? METER_PRESSURE_TIER_CHOICES.filter(({ label }) =>
                          ['LP', 'MP'].includes(label)
                        )
                      : METER_PRESSURE_TIER_CHOICES
                  }
                  placeholder={'Inlet pressure tier'}
                  onChange={(item) => {
                    handleInputChange('pressureTier', item);
                  }}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex}>
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
                      const numericValue = txt.replace(/[^0-9]/g, '');
                      handleInputChange('pressure', numericValue);
                    }}
                    keyboardType="numeric"
                    style={{
                      ...styles.input,
                      alignSelf: 'center',
                      marginRight: 8,
                    }}
                  />
                  <Text> mbar</Text>
                </View>
              </View>
            </View>
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
    padding: 10,
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  flex: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  scanBtn: {
    height: 20,
  },
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
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
  },
});

export default MeterDetailsPage;
