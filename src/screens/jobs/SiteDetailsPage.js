import React, { useContext, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TextType } from '../../theme/typography';
import EcomDropDown from '../../components/DropDown';
import Header from '../../components/Header';
import OptionalButton from '../../components/OptionButton';
import { TextInputWithTitle } from '../../components/TextInput';
import { AppContext } from '../../context/AppContext';
import { PrimaryColors } from '../../theme/colors';
import EcomHelper from '../../utils/ecomHelper';
import moment from 'moment';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';
const ukPostCodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
const phoneNumberRegex =
  /^(?:(0\d{4})\s?\d{3}\s?\d{3}|(07\d{3})\s?\d{3}\s?\d{3}|(01\d{1,2})\s?\d{3}\s?\d{3,4}|(02\d{1,2})\s?\d{3}\s?\d{4})$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function SiteDetailsPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params;
  const appContext = useContext(AppContext);
  const { goToNextStep } = useProgressNavigation();
  const {
    jobType,
    siteDetails,
    setSiteDetails,
    setJobStarted,
    jobID,
    setJobID,
  } = appContext;

  const db = useSQLiteContext();

  useEffect(() => {
    if (params?.jobData) {
      appContext.setJobdata(params.jobData);
      // jobData is not used anywhere as the info is outside the jobData state
      // TODO: this can be handled better by re-designing the data structure
      appContext.setSiteDetails(
        params.jobData.siteDetails && JSON.parse(params.jobData.siteDetails)
      );
      appContext.setSiteQuestions(
        params.jobData.siteQuestions && JSON.parse(params.jobData.siteQuestions)
      );
      appContext.setPhotos(
        params.jobData.photos && JSON.parse(params.jobData.photos)
      );
      appContext.setCorrectorDetails(
        params.jobData.correctorDetails &&
          JSON.parse(params.jobData.correctorDetails)
      );
      appContext.setMeterDetails(
        params.jobData.meterDetails && JSON.parse(params.jobData.meterDetails)
      );
      appContext.setSiteQuestions(
        params.jobData.siteQuestions && JSON.parse(params.jobData.siteQuestions)
      );
      appContext.setStandardDetails(
        params.jobData.standards && JSON.parse(params.jobData.standards)
      );
      appContext.setJobType(params.jobData.jobType);
      appContext.setJobID(params.jobData.id);
      appContext.setJobStarted(true);
      appContext.setStreamValue(
        params.jobData.streamValue && JSON.parse(params.jobData.streamValue)
      );
      appContext.setStreamNumber(
        params.jobData.streamValue &&
          JSON.parse(params.jobData.streamValue).length
      );
    }

    if (params?.jobType) {
      appContext.setJobTypes(params.jobType);
    }
  }, [params]);

  const handleInputChange = (name, value) => {
    setSiteDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const saveSiteDetailsToDatabase = async () => {
    const siteDetailsJSON = JSON.stringify(siteDetails);

    const getCurrentDateTime = () => {
      return moment().format('YYYY-MM-DD HH:mm');
    };

    const mprn = siteDetails.mprn;
    const postcode = siteDetails.postCode;
    const jobStatus = 'In Progress';
    const startDate = params?.jobData?.startDate ?? getCurrentDateTime();

    try {
      await db
        .runAsync(
          'INSERT INTO Jobs (jobType, MPRN, postcode, startDate, jobStatus, siteDetails) VALUES (?, ?, ?, ?, ?, ?)',
          [jobType, mprn, postcode, startDate, jobStatus, siteDetailsJSON]
        )
        .then((result) => {
          console.log('Site details saved to database:', result);
          setJobID(params?.jobData?.id ?? result.lastInsertRowId);
          console.log('jobID', jobID);
        });
    } catch (error) {
      console.error('Error saving site details to database:', error);
    }
  };
  const backPressed = () => {
    appContext.setSiteDetails(siteDetails);
    if (siteDetails !== null) {
      setJobStarted(true);
    }
    navigation.goBack();
  };

  const nextPressed = async () => {
    if (siteDetails.buildingName === '') {
      EcomHelper.showInfoMessage('Please input Building Name');
      return;
    }
    if (siteDetails.address1 === '') {
      EcomHelper.showInfoMessage('Please input Address1');
      return;
    }
    if (siteDetails.town === '') {
      EcomHelper.showInfoMessage('Please input Town/City');
      return;
    }
    if (siteDetails.county === '') {
      EcomHelper.showInfoMessage('Please input County');
      return;
    }
    if (siteDetails.postCode === '') {
      EcomHelper.showInfoMessage('Please input Post Code');
      return;
    }
    if (!ukPostCodeRegex.test(siteDetails.postCode)) {
      EcomHelper.showInfoMessage('Not a valid uk post code');
      return;
    }
    if (siteDetails.number1 && !phoneNumberRegex.test(siteDetails.number1)) {
      EcomHelper.showInfoMessage('Not a valid phone number: phone number1');
      return;
    }

    // Validate phone number2 if it is not empty
    if (siteDetails.number2 && !phoneNumberRegex.test(siteDetails.number2)) {
      EcomHelper.showInfoMessage('Not a valid phone number: phone number2');
      return;
    }

    // Validate email1 if it is not empty
    if (siteDetails.email1 && !emailRegex.test(siteDetails.email1)) {
      EcomHelper.showInfoMessage('Not a valid email: email1');
      return;
    }

    // Validate email2 if it is not empty
    if (siteDetails.email2 && !emailRegex.test(siteDetails.email2)) {
      EcomHelper.showInfoMessage('Not a valid email: email2');
      return;
    }
    if (!siteDetails.confirmContact) {
      EcomHelper.showInfoMessage('Please make sure if all contact is correct');
      return;
    }
    if (!siteDetails.mprn) {
      EcomHelper.showInfoMessage('Please input MPRN');
      return;
    }
    if (siteDetails.mprn?.length < 5) {
      EcomHelper.showInfoMessage('MPRN should be 5 ~ 15 digits');
      return;
    }
    if (siteDetails.confirmWarrant == null && jobType === 'Warrant') {
      EcomHelper.showInfoMessage('Please confirm if the warrant went ahead');
      return;
    }

    appContext.setSiteDetails(siteDetails);

    await saveSiteDetailsToDatabase();
    goToNextStep();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={'Site Details'}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <ScrollView style={{ flex: 1, padding: 10 }}>
          <View style={{ gap: 20 }}>
            <TextInputWithTitle
              title={'MPRN *'}
              value={siteDetails.mprn}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^0-9]/g, '');
                const limitedText = filteredText.slice(0, 15);
                handleInputChange('mprn', limitedText);
              }}
              style={styles.inputContainer}
              keyboardType="numeric"
            />

            <TextInputWithTitle
              title={'Company name'}
              value={siteDetails.companyName}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^a-zA-Z0-9\s\-()&_'/]/g, '');
                handleInputChange('companyName', filteredText);
              }}
              style={styles.inputContainer}
            />

            <TextInputWithTitle
              title={'Building name/ number *'}
              value={siteDetails.buildingName}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^a-zA-Z0-9\s\-\(\)]/g, '');
                handleInputChange('buildingName', filteredText);
              }}
              style={styles.inputContainer}
            />

            <TextInputWithTitle
              title={'Address 1 *'}
              value={siteDetails.address1}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, '');
                handleInputChange('address1', filteredText);
              }}
              style={styles.inputContainer}
            />

            <TextInputWithTitle
              title={'Address 2'}
              value={siteDetails.address2}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, '');
                handleInputChange('address2', filteredText);
              }}
              style={styles.inputContainer}
            />

            <TextInputWithTitle
              title={'Address 3'}
              value={siteDetails.address3}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, '');
                handleInputChange('address3', filteredText);
              }}
              style={styles.inputContainer}
            />

            <TextInputWithTitle
              title={'Town/city *'}
              value={siteDetails.town}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^a-zA-Z]/g, '');
                handleInputChange('town', filteredText);
              }}
              style={styles.inputContainer}
            />

            <TextInputWithTitle
              title={'County *'}
              value={siteDetails.county}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^a-zA-Z ]/g, '');
                handleInputChange('county', filteredText);
              }}
              style={styles.inputContainer}
            />

            <TextInputWithTitle
              title={'Post Code *'}
              value={siteDetails.postCode}
              onChangeText={(txt) => {
                if (txt.length <= 9) {
                  const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, '');
                  handleInputChange('postCode', filteredText.toUpperCase());
                }
              }}
              style={styles.inputContainer}
            />

            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1 }}>
                <EcomDropDown
                  value={siteDetails.title}
                  valueList={[
                    { _index: 1, label: 'Mr', value: 'Mr' },
                    { _index: 2, label: 'Mrs', value: 'Mrs' },
                    { _index: 3, label: 'Ms', value: 'Ms' },
                    { _index: 4, label: 'Dr', value: 'Dr' },
                  ]}
                  placeholder={' Title'}
                  onChange={(e) => {
                    handleInputChange('title', e);
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <TextInputWithTitle
                  style={styles.inputContainer}
                  title={'Site Contact'}
                  value={siteDetails.contact}
                  onChangeText={(txt) => {
                    const filteredText = txt.replace(/[^a-zA-Z ]/g, '');
                    handleInputChange('contact', filteredText);
                  }}
                />
              </View>
            </View>

            <View style={{ gap: 20 }}>
              <Text type={TextType.CAPTION_2}>{'Contact Numbers'}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 5,
                }}
              >
                <View style={{ flex: 0.5 }}>
                  <TextInputWithTitle
                    style={styles.inputContainer}
                    title={'Phone Number 1'}
                    value={siteDetails.number1}
                    keyboardType="numeric" // Set keyboardType to numeric
                    onChangeText={(txt) => {
                      const filteredText = txt.replace(/[^0-9]/g, ''); // Allow only numbers
                      handleInputChange('number1', filteredText);
                    }}
                  />
                </View>
                <View style={{ flex: 0.5 }}>
                  <TextInputWithTitle
                    style={styles.inputContainer}
                    title={'Phone Number 2'}
                    value={siteDetails.number2}
                    keyboardType="numeric" // Set keyboardType to numeric
                    onChangeText={(txt) => {
                      const filteredText = txt.replace(/[^0-9]/g, ''); // Allow only numbers
                      handleInputChange('number2', filteredText);
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 5,
                }}
              >
                <View style={{ flex: 0.5 }}>
                  <TextInputWithTitle
                    style={styles.inputContainer}
                    title={'Email Number 1'}
                    value={siteDetails.email1}
                    autoCapitalize="none"
                    onChangeText={(txt) => {
                      handleInputChange('email1', txt.toLowerCase());
                    }}
                  />
                </View>
                <View style={{ flex: 0.5 }}>
                  <TextInputWithTitle
                    style={styles.inputContainer}
                    title={'Email Number 2'}
                    autoCapitalize="none"
                    value={siteDetails.email2}
                    onChangeText={(txt) => {
                      handleInputChange('email2', txt.toLowerCase());
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={{ marginHorizontal: '5%' }} />
            <TextInputWithTitle
              title={'Contact Instructions'}
              value={siteDetails.instructions}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^a-zA-Z0-9\s@.]/g, '');
                handleInputChange('instructions', filteredText);
              }}
              style={styles.inputContainer}
            />

            <View style={{ marginBottom: 30, gap: 20 }}>
              <View style={{ gap: 10 }}>
                <Text type={TextType.CAPTION_2}>
                  {'Is all contact details correct? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => handleInputChange('confirmContact', true),
                    () => handleInputChange('confirmContact', false),
                  ]}
                  value={
                    siteDetails.confirmContact === null
                      ? null
                      : siteDetails.confirmContact
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
              {jobType === 'Warrant' && (
                <View style={{ gap: 10 }}>
                  <Text type={TextType.CAPTION_2}>
                    {'Did the warrant go ahead? *'}
                  </Text>
                  <OptionalButton
                    options={['Yes', 'No']}
                    actions={[
                      () => handleInputChange('confirmWarrant', true),
                      () => handleInputChange('confirmWarrant', false),
                    ]}
                    value={
                      siteDetails.confirmWarrant === null
                        ? null
                        : siteDetails.confirmWarrant
                        ? 'Yes'
                        : 'No'
                    }
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PrimaryColors.White,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
  },
  inputContainer: {
    borderRadius: 5,
  },
  input: {
    width: '45%',
    alignSelf: 'center',
  },
  contactContainer: {
    width: '80%',
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%', // Full width for button container
    paddingHorizontal: 20, // Horizontal padding for screen edge spacing
  },
  actionButton: {
    backgroundColor: PrimaryColors.Blue,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100, // Minimum width for action buttons
  },
  buttonText: {
    color: PrimaryColors.White,
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  confirmText: {
    fontSize: 14,
    color: PrimaryColors.Black,
    paddingHorizontal: 10, // Padding around confirmation text
  },
  // Define additional styles as needed
});

export default SiteDetailsPage;
