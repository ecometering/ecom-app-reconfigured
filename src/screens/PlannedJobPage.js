import React, { useContext, useState, useEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import { PrimaryColors, Transparents } from '../theme/colors';
import { EcomPressable as Button } from '../components/ImageButton';
import Header from '../components/Header';
import Text, { CenteredText } from '../components/Text';
import { useNavigation } from '@react-navigation/native';
import { TextType } from '../theme/typography';
import { AppContext } from '../context/AppContext';
import { useScreenDimensions } from '../utils/constant'; // Assume this is where useScreenDimensions is defined

function PlannedJobPage() {
  const navigation = useNavigation();
  const [plannedJobs, setPlannedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { width, height } = useScreenDimensions();

  useEffect(() => {
    const fetchPlannedJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://test.ecomdata.com/api/plannedJobs'); // Replace with your actual endpoint
        const data = await response.json();
        setPlannedJobs(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlannedJobs();
  }, []);

  const navigateToPage = ({ name, params }) => {
    console.log(name);
    console.log('params', params);
    navigation.navigate(name, params);
  };

  const appContext = useContext(AppContext);

  const renderItem = ({ item, index }) => {
    const handleItemClick = () => {
      console.log('Item clicked:', item.JobType, index);
      const chosenJob = plannedJobs[index];
      appContext.setJobTypes(chosenJob.JobType);
      const jobType = chosenJob.JobType;
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
    };
    const rowColor = index % 2 === 0 ? Transparents.SandColor2 : Transparents.Clear;

    return (
      <Button key={index.toString()} onPress={handleItemClick}>
        <View style={{ ...styles.row, backgroundColor: rowColor }}>
          {/* Updated to use dynamic dimensions */}
          <CenteredText containerStyle={{ ...styles.headerCell, width: width * 0.2 }} type={TextType.BODY_TABLE} style={styles.blackTxt}>
            {item.MPRN}
          </CenteredText>
          <CenteredText containerStyle={{ ...styles.headerCell, width: width * 0.15 }} type={TextType.BODY_TABLE} style={styles.blackTxt}>
            {item.JobType}
          </CenteredText>
          <CenteredText containerStyle={{ ...styles.headerCell, width: width * 0.15 }} type={TextType.BODY_TABLE} style={styles.blackTxt}>
            {item.PostCode}
          </CenteredText>
          <CenteredText containerStyle={{ ...styles.headerCell, width: width * 0.2 }} type={TextType.BODY_TABLE} style={styles.blackTxt}>
            {item.Date}
          </CenteredText>
          <CenteredText containerStyle={{ ...styles.headerCell, width: width * 0.15 }} type={TextType.BODY_TABLE} style={styles.blackTxt}>
            {item.MeterSize}
          </CenteredText>
          <CenteredText containerStyle={{ ...styles.headerCell, width: width * 0.1 }} type={TextType.BODY_TABLE} style={styles.blackTxt}>
            {item.Time}
          </CenteredText>
        </View>
        {index === plannedJobs.length - 1 ? <View style={styles.divider} /> : null}
      </Button>
    );
  };

  const backPressed = () => {
    navigation.goBack();
  };

  if (isLoading) return <View style={styles.center}><Text>Loading...</Text></View>;
  if (error) return <View style={styles.center}><Text>Error loading data</Text></View>;

  return (
    <SafeAreaView style={styles.body}>
      <Header hasLeftBtn={true} hasCenterText={true} hasRightBtn={false} centerText={''} leftBtnPressed={backPressed} rightBtnPressed={null} />
      <View style={styles.spacer} />
      <View style={styles.flex}>
        <FlatList
          data={plannedJobs}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
      <View style={styles.spacer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Updated styles to remove explicit height/width definitions for dynamic resizing
  flex: { flex: 1 },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  spacer: {
    height: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
  },
  blackTxt: { color: 'black' },
  row: {
    flexDirection: 'row',
  },
  headerCell: {
    textAlign: 'center',
    borderWidth: 1,
    borderColor: PrimaryColors.Black,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlannedJobPage;
