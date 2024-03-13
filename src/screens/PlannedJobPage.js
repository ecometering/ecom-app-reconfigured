import React, { useContext, useState, useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View, Text as RNText } from 'react-native';
import { PrimaryColors, Transparents } from '../theme/colors';
import { EcomPressable as Button } from '../components/ImageButton';
import Header from '../components/Header';
import Text, { CenteredText } from '../components/Text';
import { useNavigation } from '@react-navigation/native';
import { TextType } from '../theme/typography';
import { AppContext } from '../context/AppContext';
import { useScreenDimensions } from '../utils/constant';
import axios from 'axios';
function PlannedJobPage() {
  const navigation = useNavigation();
  const [plannedJobs, setPlannedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { width } = useScreenDimensions();

  useEffect(() => {
    const fetchPlannedJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://test.ecomdata.co.uk/api/jobs');
        const { data } = response;
        if (data && data.length > 0) {
          await saveJobsToDatabase(data);
          setPlannedJobs(data);
        } else {
          setError('No planned jobs found');
        }
      } catch (error) {
        setError('Error loading data: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPlannedJobs();
  }, [])

  const renderItem = ({ item, index }) => {
    const handleItemClick = () => {
      // Updated to navigate directly to SiteDetailsPage and pass jobType as parameter
      navigation.navigate('SiteDetailsPage', { jobType: item.JobType });
    };
    const rowColor = index % 2 === 0 ? Transparents.SandColor2 : Transparents.Clear;

    return (
      <Button key={item.id.toString()} onPress={handleItemClick}>
        <View style={{ ...styles.row, backgroundColor: rowColor }}>
          {/* Job Item Render Logic */}
        </View>
      </Button>
    );
  };

  // Dynamic empty component to show loading, error, no data message, and data in order
  const renderEmptyComponent = () => {
    if (isLoading) {
      return <View style={styles.center}><RNText>Loading...</RNText></View>;
    }
    if (error) {
      return <View style={styles.center}><RNText>{error}</RNText></View>;
    }
    return <View style={styles.center}><RNText>No planned jobs</RNText></View>;
  };

  return (
    <SafeAreaView style={styles.body}>
      <Header hasMenuButton={false} hasLeftBtn={true} hasCenterText={true} hasRightBtn={false} centerText={'Planned Jobs'} leftBtnPressed={() => navigation.goBack()} />
      <FlatList
        data={plannedJobs}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyComponent}
        ListHeaderComponent={<View style={styles.spacer} />}
        ListFooterComponent={<View style={styles.spacer} />}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
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