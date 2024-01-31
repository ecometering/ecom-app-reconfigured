import React, {useContext} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {width, height, unitH, unitW} from '../utils/constant';
import {PrimaryColors, Transparents} from '../theme/colors';
import {EcomPressable as Button} from '../components/ImageButton';
import Header from '../components/Header';
import Text, {CenteredText} from '../components/Text';
import {useNavigation} from '@react-navigation/native';
import {TextType} from '../theme/typography';
import {AppContext} from '../context/AppContext';

function PlannedJobPage() {
  const navigation = useNavigation();

  const navigateToPage = ({name, params}) => {
    console.log(name);
    console.log('params', params);
    navigation.navigate(name, params);
  };

  const appContext = useContext(AppContext);

  const plannedJobs = [
    {
      id: 1,
      MPRN: '9944458883',
      JobType: 'Install',
      PostCode: 'EN9 2RJ',
      Date: '16/09/2023',
      MeterSize: 'U40',
      Time: 'AM',
    },
    {
      id: 2,
      MPRN: '99444777',
      JobType: 'Removal',
      PostCode: 'EN9 2RG',
      Date: '16/09/2023',
      MeterSize: 'u25',
      Time: '10.00',
    },
    {
      id: 3,
      MPRN: '9944458883',
      JobType: 'Maintenance',
      PostCode: 'EN9 2RJ',
      Date: '16/09/2023',
      MeterSize: 'U40',
      Time: 'AM',
    },
    {
      id: 4,
      MPRN: '99444777',
      JobType: 'Exchange',
      PostCode: 'EN9 2RG',
      Date: '16/09/2023',
      MeterSize: 'u25',
      Time: '10.00',
    },
    {
      id: 5,
      MPRN: '9944234777',
      JobType: 'Warrant',
      PostCode: 'EN9 2RG',
      Date: '16/09/2023',
      MeterSize: 'u25',
      Time: '10.00',
    },
    {
      id: 6,
      MPRN: '9944234777',
      JobType: 'CallOut',
      PostCode: 'EN9 2RG',
      Date: '16/09/2023',
      MeterSize: 'u25',
      Time: '10.00',
    },
  ];

  const renderItem = ({item, index}) => {
    const handleItemClick = () => {
      // Handle item click here
      console.log('Item clicked:', item.JobType, index);
      const chosenJob = plannedJobs[index];
      appContext.setJobTypes(chosenJob.JobType);
      const jobType = chosenJob.JobType;
      // set site details, meterDetails, removedMeterDetails, maintenanceDetails etc
      switch (jobType) {
        case 'Install':
          navigation.navigate('SiteDetailsPage');
          break;
        case ('Removal', 'Exchange'):
          navigation.navigate('RemovedSiteDetailsPage');
          break;
        case 'CallOut':
          navigation.navigate('CallOutPage');
          break;
        case 'Warrant':
          navigation.navigate('WarrantPage');
          break;
        case 'Maintenance':
          navigation.navigate('MaintenanceSiteDetailsPage');
          break;
        default:
          break;
      }
      // if (
      //   chosenJob.JobType === 'Removal' ||
      //   chosenJob.JobType === 'Maintenance' ||
      //   chosenJob.JobType === 'Install'
      // ) {
      //   navigateToPage({name: 'SiteDetailsPage'});
      // } else if (chosenJob.JobType === 'Exchange') {
      //   navigateToPage({name: 'AssetTypeSelectionPage'});
      // }
      //navigateToPage({name: 'JobDetail', params: chosenJob});
      // go to specific job following the type
    };
    const rowColor =
      index % 2 === 0 ? Transparents.SandColor2 : Transparents.Clear;

    return (
      <Button key={index.toString} onPress={handleItemClick}>
        <View style={{...styles.row, backgroundColor: rowColor}}>
          <CenteredText
            containerStyle={{...styles.headerCell, width: width * 0.2}}
            type={TextType.BODY_TABLE}
            style={styles.blackTxt}>
            {item.MPRN}
          </CenteredText>
          <CenteredText
            containerStyle={{...styles.headerCell, width: width * 0.15}}
            type={TextType.BODY_TABLE}
            style={styles.blackTxt}>
            {item.JobType}
          </CenteredText>
          <CenteredText
            containerStyle={{...styles.headerCell, width: width * 0.15}}
            type={TextType.BODY_TABLE}
            style={styles.blackTxt}>
            {item.PostCode}
          </CenteredText>
          <CenteredText
            containerStyle={{...styles.headerCell, width: width * 0.2}}
            type={TextType.BODY_TABLE}
            style={styles.blackTxt}>
            {item.Date}
          </CenteredText>
          <CenteredText
            containerStyle={{...styles.headerCell, width: width * 0.15}}
            type={TextType.BODY_TABLE}
            style={styles.blackTxt}>
            {item.MeterSize}
          </CenteredText>
          <CenteredText
            containerStyle={{...styles.headerCell, width: width * 0.1}}
            type={TextType.BODY_TABLE}
            style={styles.blackTxt}>
            {item.Time}
          </CenteredText>
        </View>
        {index === plannedJobs.length - 1 ? (
          <View style={styles.divider} />
        ) : null}
      </Button>
    );
  };

  const backPressed = () => {
    navigation.goBack();
  };

  return (
    // <ImageBackground
    //   imageStyle={{width: width, height: height}}
    //   source={loginBgImage}
    //   resizeMode='cover'>
    <SafeAreaView style={styles.body}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={false}
        centerText={''}
        leftBtnPressed={backPressed}
        rightBtnPressed={null}
      />
      <View style={styles.spacer} />
      <View style={styles.flex}>
        <View style={{...styles.row, backgroundColor: Transparents.BlueColor2}}>
          <CenteredText
            containerStyle={{...styles.headerCell, width: width * 0.2}}
            type={TextType.HEADER_TABLE}
            style={styles.blackTxt}>
            {'MPRN'}
          </CenteredText>
          <CenteredText
            containerStyle={{...styles.headerCell, width: width * 0.15}}
            type={TextType.HEADER_TABLE}
            style={styles.blackTxt}>
            {'Job Type'}
          </CenteredText>
          <CenteredText
            containerStyle={{...styles.headerCell, width: width * 0.15}}
            type={TextType.HEADER_TABLE}
            style={styles.blackTxt}>
            {'Postcode'}
          </CenteredText>
          <CenteredText
            containerStyle={{...styles.headerCell, width: width * 0.2}}
            type={TextType.HEADER_TABLE}
            style={styles.blackTxt}>
            {'Date'}
          </CenteredText>
          <CenteredText
            containerStyle={{...styles.headerCell, width: width * 0.15}}
            type={TextType.HEADER_TABLE}
            style={styles.blackTxt}>
            {'Meter Size'}
          </CenteredText>
          <CenteredText
            containerStyle={{...styles.headerCell, width: width * 0.1}}
            type={TextType.HEADER_TABLE}
            style={styles.blackTxt}>
            {'Time'}
          </CenteredText>
        </View>
        <FlatList
          data={plannedJobs}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          // horizontal={false}
        />
      </View>
      <View style={styles.spacer} />
    </SafeAreaView>
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: width,
    height: height,
  },
  flex: {flex: 1},
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 50 * unitW,
  },
  spacer: {
    height: unitH * 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
  },
  button: {
    width: '70%',
    height: unitH * 50,
    backgroundColor: PrimaryColors.Blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1,
    borderColor: 'black',
    //
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 2,
    shadowOffset: {
      width: 2.5,
      height: 2.5,
    },
  },
  buttonTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  blackTxt: {color: 'black'},
  row: {
    flexDirection: 'row',
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

export default PlannedJobPage;
