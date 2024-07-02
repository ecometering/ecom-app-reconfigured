import React, { useContext, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Button as RNButton,
  Switch,
} from 'react-native';
import { unitH, width } from '../../utils/constant';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { TextInputWithTitle } from '../../components/TextInput';
import Text, { CenteredText } from '../../components/Text';
import { TextType } from '../../theme/typography';
import { PrimaryColors, Transparents } from '../../theme/colors';
import { AppContext } from '../../context/AppContext';
import EcomHelper from '../../utils/ecomHelper';
import { EcomPressable as Button } from '../../components/ImageButton';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';

function SnClientInfoPage() {
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const appContext = useContext(AppContext);
  const jobType = appContext.jobType;
  const title = jobType === 'Install' ? 'New Meter Details' : jobType;

  const standardDetails = appContext.standardDetails;

  const [type, setType] = useState(standardDetails?.type);
  const [location, setLocation] = useState(standardDetails?.location);
  const [make, setMake] = useState(standardDetails?.make);
  const [model, setModel] = useState(standardDetails?.model);
  const [serialNumber, setSerialNumber] = useState(
    standardDetails?.serialNumber
  );
  const [descript, setDescript] = useState(standardDetails?.descript);
  const [isEscapeGas, setIsEscapeGas] = useState(standardDetails?.isEscapeGas);
  const [isMeterIssue, setIsMeterIssue] = useState(
    standardDetails?.isMeterIssue
  );
  const [isPipeworkIssue, setIsPipeworkIssue] = useState(
    standardDetails?.isPipeworkIssue
  );
  const [isChimneyFlute, setIsChimneyFlute] = useState(
    standardDetails?.isChimneyFlute
  );

  const [isVentilation, setIsVentilation] = useState(
    standardDetails?.isVentilation
  );
  const [isOther, setIsOther] = useState(standardDetails?.isOther);
  const [isDisconnectDanger, setIsDisconnectDanger] = useState(
    standardDetails?.isDisconnectDanger
  );
  const [isTurnOffDanger, setIsTurnOffDanger] = useState(
    standardDetails?.isTurnOffDanger
  );
  const [isNotRemove, setIsNotRemove] = useState(standardDetails?.isNotRemove);
  const [remedial, setRemedial] = useState(standardDetails?.remedial);

  const [tableData, setTableData] = useState(
    appContext?.standards?.tableData ?? []
  );

  const backPressed = () => {
    appContext.setStandardDetails({
      ...standardDetails,
      type: type,
      location: location,
      make: make,
      model: model,
      serialNumber: serialNumber,
      descript: descript,
      isEscapeGas: isEscapeGas,
      isMeterIssue: isMeterIssue,
      isPipeworkIssue: isPipeworkIssue,
      isChimneyFlute: isChimneyFlute,
      isVentilation: isVentilation,
      isOther: isOther,
      isDisconnectDanger: isDisconnectDanger,
      isTurnOffDanger: isTurnOffDanger,
      isNotRemove: isNotRemove,
      remedial: remedial,
      tableData,
    });
    goToPreviousStep();
  };

  const nextPressed = async () => {
    if (tableData.length === 0) {
      EcomHelper.showInfoMessage('Atleast one entry required');
      return;
    }

    const standards = {
      ...standardDetails,
      tableData,
    };

    appContext.setStandardDetails(standards);
    await db.runAsync('UPDATE Jobs SET standards = ? WHERE id = ?', [
      JSON.stringify(standards),
      appContext.jobID,
    ]);

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
          <View style={styles.spacer} />
          <Text type={TextType.CAPTION_2}>
            Add appliance / job installation
          </Text>
          <View style={styles.spacer} />
          <View style={styles.row}>
            <TextInputWithTitle
              title={'Type'}
              value={type}
              placeholder={''}
              onChangeText={(txt) => {
                setType(txt);
              }}
              containerStyle={styles.inputContainer}
            />
            <TextInputWithTitle
              title={'Location'}
              placeholder={''}
              value={location}
              onChangeText={(txt) => {
                setLocation(txt);
              }}
              containerStyle={styles.inputContainer}
            />
          </View>

          <View style={styles.spacer} />
          <View style={styles.row}>
            <TextInputWithTitle
              title={'Make'}
              placeholder={''}
              value={make}
              onChangeText={(txt) => {
                setMake(txt);
              }}
              containerStyle={styles.inputContainer}
            />
            <TextInputWithTitle
              title={'Model'}
              placeholder={''}
              value={model}
              onChangeText={(txt) => {
                setModel(txt);
              }}
              containerStyle={styles.inputContainer}
            />
          </View>

          <View style={styles.spacer} />
          <View style={styles.row}>
            <View>
              <TextInputWithTitle
                title={'Serial Number'}
                placeholder={''}
                value={serialNumber}
                onChangeText={(txt) => {
                  // Capitalize the text and allow only letters and numbers
                  const formattedText = txt
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/gi, '');
                  setSerialNumber(formattedText);
                }}
                containerStyle={styles.inputContainer}
              />
              <View style={styles.spacer} />

              <View>
                <TextInputWithTitle
                  title={
                    'Remedial action required to rectify the unsafe situation'
                  }
                  placeholder={''}
                  onChangeText={(txt) => {
                    setRemedial(txt);
                  }}
                  value={remedial}
                  style={{ height: unitH * 60 }}
                  multiline={true}
                  containerStyle={styles.inputContainer}
                />
              </View>
            </View>
            <TextInputWithTitle
              title={'Description of fault'}
              value={descript}
              placeholder={''}
              onChangeText={(txt) => {
                setDescript(txt);
              }}
              style={{ height: unitH * 150 }}
              multiline={true}
              containerStyle={styles.inputContainer}
            />
          </View>

          <View style={styles.spacer} />
          <View
            style={{ ...styles.row, backgroundColor: Transparents.BlueColor2 }}
          >
            <CenteredText
              containerStyle={{ ...styles.headerCell, width: width * 0.18 }}
              type={TextType.HEADER_TABLE}
              style={styles.blackTxt}
            >
              {'Escape of Gas'}
            </CenteredText>
            <CenteredText
              containerStyle={{ ...styles.headerCell, width: width * 0.12 }}
              type={TextType.HEADER_TABLE}
              style={styles.blackTxt}
            >
              {'Meter issue'}
            </CenteredText>
            <CenteredText
              containerStyle={{ ...styles.headerCell, width: width * 0.18 }}
              type={TextType.HEADER_TABLE}
              style={styles.blackTxt}
            >
              {'Pipework issue'}
            </CenteredText>
            <CenteredText
              containerStyle={{ ...styles.headerCell, width: width * 0.18 }}
              type={TextType.HEADER_TABLE}
              style={styles.blackTxt}
            >
              {'Chimney/Flute'}
            </CenteredText>
            <CenteredText
              containerStyle={{ ...styles.headerCell, width: width * 0.14 }}
              type={TextType.HEADER_TABLE}
              style={styles.blackTxt}
            >
              {'Ventilation'}
            </CenteredText>
            <CenteredText
              containerStyle={{ ...styles.headerCell, width: width * 0.1 }}
              type={TextType.HEADER_TABLE}
              style={styles.blackTxt}
            >
              {'Other'}
            </CenteredText>
          </View>
          <View
            style={{
              ...styles.row,
              backgroundColor: Transparents.Clear,
              borderBottomWidth: 1,
            }}
          >
            <View style={{ ...styles.headerCell, width: width * 0.18 }}>
              <Button
                onPress={() => {
                  setIsEscapeGas(!isEscapeGas);
                }}
              >
                <Text>{isEscapeGas ? '✅' : '❌'}</Text>
              </Button>
            </View>
            <View style={{ ...styles.headerCell, width: width * 0.12 }}>
              <Button
                onPress={() => {
                  setIsMeterIssue(!isMeterIssue);
                }}
              >
                <Text>{isMeterIssue ? '✅' : '❌'}</Text>
              </Button>
            </View>
            <View style={{ ...styles.headerCell, width: width * 0.18 }}>
              <Button
                onPress={() => {
                  setIsPipeworkIssue(!isPipeworkIssue);
                }}
              >
                <Text>{isPipeworkIssue ? '✅' : '❌'}</Text>
              </Button>
            </View>
            <View style={{ ...styles.headerCell, width: width * 0.18 }}>
              <Button
                onPress={() => {
                  setIsChimneyFlute(!isChimneyFlute);
                }}
              >
                <Text>{isChimneyFlute ? '✅' : '❌'}</Text>
              </Button>
            </View>
            <View style={{ ...styles.headerCell, width: width * 0.14 }}>
              <Button
                onPress={() => {
                  setIsVentilation(!isVentilation);
                }}
              >
                <Text>{isVentilation ? '✅' : '❌'}</Text>
              </Button>
            </View>
            <View style={{ ...styles.headerCell, width: width * 0.1 }}>
              <Button
                onPress={() => {
                  setIsOther(!isOther);
                }}
              >
                <Text>{isOther ? '✅' : '❌'}</Text>
              </Button>
            </View>
          </View>

          <View style={styles.spacer} />

          <View style={[{ paddingHorizontal: 30 }]}>
            <View>
              <Text>{`Immediately dangerous 
has been disconnected and 
labelled do not use`}</Text>
              <View style={styles.spacer2} />
              <View style={styles.optionContainer}>
                <Switch
                  value={isDisconnectDanger}
                  onValueChange={(val) => {
                    setIsDisconnectDanger(val);
                    setIsTurnOffDanger(false);
                    setIsNotRemove(false);
                  }}
                />
              </View>

              <View style={styles.spacer} />

              <Text>{`At risk, Has been 
 turned off and 
labelled danger do not use`}</Text>
              <View style={styles.spacer2} />
              <View style={styles.optionContainer}>
                <Switch
                  value={isTurnOffDanger}
                  onValueChange={(val) => {
                    setIsDisconnectDanger(false);
                    setIsTurnOffDanger(val);
                    setIsNotRemove(false);
                  }}
                />
              </View>
            </View>
            <View style={styles.spacer} />

            <View>
              <Text>{`At Risk, 
However turning off 
does not remove the risk`}</Text>
              <View style={styles.spacer2} />
              <View style={styles.optionContainer}>
                <Switch
                  value={isNotRemove}
                  onValueChange={(val) => {
                    setIsDisconnectDanger(false);
                    setIsTurnOffDanger(false);
                    setIsNotRemove(val);
                  }}
                />
              </View>
            </View>
          </View>

          <View style={{ width: 200, paddingLeft: 20, marginTop: 30 }}>
            <RNButton
              title="Add"
              onPress={() => {
                setTableData((prev) => [
                  ...prev,
                  {
                    type,
                    location,
                    model,
                    make,
                    serialNumber,
                    descript,
                    remedial,
                    isEscapeGas: isEscapeGas ? 'Yes' : 'No', // Format boolean values for display
                    isMeterIssue: isMeterIssue ? 'Yes' : 'No',
                    isPipeworkIssue: isPipeworkIssue ? 'Yes' : 'No',
                    isChimneyFlute: isChimneyFlute ? 'Yes' : 'No',
                    isVentilation: isVentilation ? 'Yes' : 'No',
                    isOther: isOther ? 'Yes' : 'No',
                    isDisconnectDanger: isDisconnectDanger ? 'Yes' : 'No', // Adjust the text based on your application's context
                    isTurnOffDanger: isTurnOffDanger ? 'Yes' : 'No',
                    isNotRemove: isNotRemove ? 'Yes' : 'No',
                  },
                ]);
                setType('');
                setLocation('');
                setMake('');
                setModel('');
                setSerialNumber('');
                setDescript('');
                setRemedial('');
                setIsEscapeGas(false);
                setIsMeterIssue(false);
                setIsPipeworkIssue(false);
                setIsChimneyFlute(false);
                setIsVentilation(false);
                setIsOther(false);
                setIsDisconnectDanger(false);
                setIsTurnOffDanger(false);
                setIsNotRemove(false);
              }}
            />
          </View>

          {tableData.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  borderWidth: StyleSheet.hairlineWidth,
                  margin: 20,
                  padding: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Type - </Text>
                  <Text>{item.type}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Location - </Text>
                  <Text>{item.location}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Make - </Text>
                  <Text>{item.make}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Model - </Text>
                  <Text>{item.model}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Serial Number - </Text>
                  <Text>{item.serialNumber}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Description - </Text>
                  <Text>{item.descript}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Remdeial Required Action - </Text>
                  <Text>{item.remedial}</Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Escape of gas - </Text>
                  <Text>{item.isEscapeGas}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Meter issue - </Text>
                  <Text>{item.isMeterIssue}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Pipework - </Text>
                  <Text>{item.isPipeworkIssue}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Chimney/ Flute issue - </Text>
                  <Text>{item.isChimneyFlute}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Ventilation - </Text>
                  <Text>{item.isVentilation}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>Other - </Text>
                  <Text>{item.isOther}</Text>
                </View>
                {item.isDisconnectDanger === 'Yes' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text>Disconnected & labelled Danger - </Text>
                    <Text>{item.isDisconnectDanger}</Text>
                  </View>
                )}
                {item.isTurnOffDanger === 'Yes' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text>Turn Off & labelled Danger - </Text>
                    <Text>{item.isTurnOffDanger}</Text>
                  </View>
                )}
                {item.isNotRemove === 'Yes' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text>At Risk - </Text>
                    <Text>{item.isNotRemove}</Text>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <RNButton title="Delete" onPress={() => deleteEntry(index)} />
                </View>
              </View>
            );
          })}

          <View style={styles.spacer} />
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
  inputContainer: {
    width: width * 0.35,
  },
  row: {
    width: width * 0.9,
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  optionContainer: {
    width: 100,
    justifyContent: 'space-between',
  },
  spacer: {
    height: unitH * 20,
  },
  spacer2: {
    height: 10,
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
    minHeight: 40,
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
