import React, { useContext, useState } from 'react';
import {
  View,
  Switch,
  Platform,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Button as RNButton,
  KeyboardAvoidingView,
} from 'react-native';

// Components
import Header from '../../components/Header';
import Text, { CenteredText } from '../../components/Text';
import { TextInputWithTitle } from '../../components/TextInput';
import { EcomPressable as Button } from '../../components/ImageButton';

// Theme and Utils
import EcomHelper from '../../utils/ecomHelper';
import { TextType } from '../../theme/typography';
import { PrimaryColors, Transparents } from '../../theme/colors';

// Context
import { AppContext, useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

const localStateInitialData = {
  type: '',
  location: '',
  make: '',
  model: '',
  serialNumber: '',
  descript: '',
  isEscapeGas: false,
  isMeterIssue: false,
  isPipeworkIssue: false,
  isChimneyFlute: false,
  isVentilation: false,
  isOther: false,
  isDisconnectDanger: false,
  isTurnOffDanger: false,
  isNotRemove: false,
  remedial: '',
};

function SnClientInfoPage() {
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const appContext = useContext(AppContext);
  const { state, setState } = useFormStateContext();
  const { standardDetails } = state;
  const jobType = appContext.jobType;
  const title = jobType === 'Install' ? 'New Meter Details' : jobType;

  const [localState, setLocalState] = useState(localStateInitialData);

  const handleInputChange = (key, value) => {
    setLocalState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const backPressed = () => {
    saveToDB();
    goToPreviousStep();
  };

  const saveToDB = async () => {
    await db.runAsync('UPDATE Jobs SET standards = ? WHERE id = ?', [
      JSON.stringify(standardDetails),
      appContext.jobID,
    ]);
  };

  const nextPressed = async () => {
    if (standardDetails?.tableData?.length === 0) {
      EcomHelper.showInfoMessage('Atleast one entry required');
      return;
    }

    saveToDB();
    goToNextStep();
  };
  const deleteEntry = (index) => {
    setTableData((currentData) => currentData.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={title}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <ScrollView style={styles.flex}>
          <View
            style={{
              flex: 1,
              gap: 10,
              paddingHorizontal: 10,
            }}
          >
            <Text type={TextType.CAPTION_2}>
              Add appliance / job installation
            </Text>

            <View style={styles.row}>
              <TextInputWithTitle
                title={'Type'}
                vallue={localState.type}
                placeholder={''}
                onChangeText={(txt) => {
                  handleInputChange('type', txt);
                }}
                containerStyle={{ flex: 1 }}
              />
              <TextInputWithTitle
                title={'Location'}
                placeholder={''}
                value={localState.location}
                onChangeText={(txt) => {
                  handleInputChange('location', txt);
                }}
                containerStyle={{ flex: 1 }}
              />
            </View>

            <View style={styles.row}>
              <TextInputWithTitle
                title={'Make'}
                placeholder={''}
                value={localState.make}
                onChangeText={(txt) => {
                  handleInputChange('make', txt);
                }}
                containerStyle={{ flex: 1 }}
              />
              <TextInputWithTitle
                title={'Model'}
                placeholder={''}
                value={localState.model}
                onChangeText={(txt) => {
                  handleInputChange('model', txt);
                }}
                containerStyle={{ flex: 1 }}
              />
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, gap: 10 }}>
                <TextInputWithTitle
                  title={'Serial Number'}
                  placeholder={''}
                  value={localState.serialNumber}
                  onChangeText={(txt) => {
                    // Capitalize the text and allow only letters and numbers
                    const formattedText = txt
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/gi, '');
                    handleInputChange('serialNumber', formattedText);
                  }}
                  containerStyle={{ flex: 1 }}
                />
                <TextInputWithTitle
                  title={
                    'Remedial action required to rectify the unsafe situation'
                  }
                  placeholder={''}
                  onChangeText={(txt) => {
                    handleInputChange('remedial', txt);
                  }}
                  value={localState.remedial}
                  multiline={true}
                  containerStyle={{ flex: 1 }}
                />
              </View>
              <TextInputWithTitle
                title={'Description of fault'}
                value={localState.descript}
                placeholder={''}
                onChangeText={(txt) => {
                  handleInputChange('descript', txt);
                }}
                multiline={true}
                containerStyle={{ flex: 1 }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
              }}
            >
              {[
                { title: 'Escape of Gas', field: 'isEscapeGas' },
                { title: 'Meter issue', field: 'isMeterIssue' },
                { title: 'Pipework issue', field: 'isPipeworkIssue' },
                { title: 'Chimney/Flute', field: 'isChimneyFlute' },
                { title: 'Ventilation', field: 'isVentilation' },
                { title: 'Other', field: 'isOther' },
              ].map((item) => {
                return (
                  <View
                    style={{ flex: 1, borderBottomWidth: 1 }}
                    key={item.title}
                  >
                    <View
                      style={{
                        backgroundColor: Transparents.BlueColor2,
                      }}
                    >
                      <CenteredText
                        containerStyle={{ ...styles.headerCell }}
                        type={TextType.HEADER_TABLE}
                        style={{
                          ...styles.blackTxt,
                        }}
                      >
                        {item.title}
                      </CenteredText>
                    </View>
                    <Button
                      onPress={() => {
                        handleInputChange(item.field, !localState[item.field]);
                      }}
                      style={{
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        paddingVertical: 10,
                      }}
                    >
                      <Text style={{ textAlign: 'center' }}>
                        {localState?.[item.field] ? '✅' : '❌'}
                      </Text>
                    </Button>
                  </View>
                );
              })}
            </View>

            <View
              style={{
                gap: 10,
              }}
            >
              {[
                {
                  title:
                    'Immediately dangerous has been disconnected and labelled do not use',
                  field: 'isDisconnectDanger',
                },
                {
                  title:
                    'At risk, Has been turned off and labelled danger do not use',
                  field: 'isTurnOffDanger',
                },
                {
                  title:
                    'At Risk, However turning off does not remove the risk',
                  field: 'isNotRemove',
                },
              ].map((item) => {
                return (
                  <View
                    key={item.title}
                    style={{
                      gap: 10,
                    }}
                  >
                    <Text>{item.title}</Text>

                    <View style={styles.optionContainer}>
                      <Switch
                        value={localState[item.field]}
                        onValueChange={(val) => {
                          setLocalState((prev) => ({
                            ...prev,
                            isDisconnectDanger:
                              item.field === 'isDisconnectDanger' ? val : false,
                            isTurnOffDanger:
                              item.field === 'isTurnOffDanger' ? val : false,
                            isNotRemove:
                              item.field === 'isNotRemove' ? val : false,
                          }));
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={{ width: 200, paddingLeft: 20, marginTop: 30 }}>
              <RNButton
                title="Add"
                onPress={() => {
                  setState((prev) => ({
                    ...prev,
                    standardDetails: {
                      ...prev.standardDetails,
                      tableData: [
                        ...(prev.standardDetails?.tableData || []),
                        localState,
                      ],
                    },
                  }));
                  setLocalState(localStateInitialData);
                }}
              />
            </View>

            {standardDetails?.tableData?.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    borderWidth: StyleSheet.hairlineWidth,
                    margin: 20,
                    padding: 20,
                  }}
                >
                  {[
                    { title: 'Type', value: item.type },
                    { title: 'Location', value: item.location },
                    { title: 'Make', value: item.make },
                    { title: 'Model', value: item.model },
                    { title: 'Serial Number', value: item.serialNumber },
                    { title: 'Description', value: item.descript },
                    { title: 'Remedial Required Action', value: item.remedial },
                    { title: 'Escape of gas', value: item.isEscapeGas },
                    { title: 'Meter issue', value: item.isMeterIssue },
                    { title: 'Pipework', value: item.isPipeworkIssue },
                    {
                      title: 'Chimney/ Flute issue',
                      value: item.isChimneyFlute,
                    },
                    { title: 'Ventilation', value: item.isVentilation },
                    { title: 'Other', value: item.isOther },
                    {
                      title: 'Disconnected & labelled Danger',
                      value: item.isDisconnectDanger,
                    },
                    {
                      title: 'Turn Off & labelled Danger',
                      value: item.isTurnOffDanger,
                    },
                    { title: 'At Risk', value: item.isNotRemove },
                  ]?.map((item) => {
                    return (
                      <View
                        key={item.title}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text>{item.title} - </Text>
                        <Text>
                          {typeof item.value === 'boolean'
                            ? item.value
                              ? 'Yes'
                              : 'No'
                            : item.value}
                        </Text>
                      </View>
                    );
                  })}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <RNButton
                      title="Delete"
                      onPress={() => deleteEntry(index)}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
  },
  inputContainer: {},
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  optionContainer: {
    width: 100,
    justifyContent: 'space-between',
  },
  blackTxt: {
    color: 'black',
    textAlign: 'left',
  },
  headerCell: {
    textAlign: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: PrimaryColors.Black,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderColor: PrimaryColors.Black,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SnClientInfoPage;
