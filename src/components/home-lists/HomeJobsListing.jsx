import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import JobCard from '../JobCard';
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';
import { omit } from 'lodash';

const fieldsToParse = [
  'siteDetails',
  'siteQuestions',
  'photos',
  'streams',
  'meterDetails',
  'kioskDetails',
  'ecvDetails',
  'movDetails',
  'regulatorDetails',
  'standards',
  'meterDetailsTwo',
  'additionalMaterials',
  'dataLoggerDetails',
  'dataLoggerDetailsTwo',
  'maintenanceDetails',
  'correctorDetails',
  'correctorDetailsTwo',
  'chatterBoxDetails',
  'navigation',
];

const safeParse = (jsonString, fallbackValue) => {
  try {
    return !!jsonString ? JSON.parse(jsonString) : fallbackValue;
  } catch (error) {
    console.error('Error parsing JSON string:', error, jsonString);
    return fallbackValue;
  }
};

export default function HomeJobsListing({
  title,
  data,
  loading,
  onPress,
  length,
}) {
  const { setState } = useFormStateContext();
  const { startFlow } = useProgressNavigation();

  const handleRowClick = async (jobId) => {
    try {
      const jobData = data.find(({ id }) => id === jobId);
      if (jobData) {
        const parsedJobData = { ...jobData };

        fieldsToParse.forEach((field) => {
          parsedJobData[field] = safeParse(
            jobData?.[field],
            Array.isArray(parsedJobData?.[field]) ? [] : {}
          );
        });

        setState((prevState) => ({
          ...prevState,
          ...omit(parsedJobData, ['navigation', 'lastNavigationIndex']),
          jobID: jobId,
        }));
        startFlow({
          newFlowType: parsedJobData.jobType,
          lastNavigationIndex: parsedJobData?.lastNavigationIndex,
          stateNavigation: parsedJobData?.navigation,
        });
      }
    } catch (error) {
      console.error('Error loading job:', error);
    }
  };

  return (
    <View style={loading ? { opacity: 0.5 } : {}}>
      <TouchableOpacity style={styles.header} onPress={onPress}>
        <Text style={styles.headerText}>
          {title} ({length || 0}) →
        </Text>
      </TouchableOpacity>
      <View style={styles.jobList}>
        {data?.map((item) => (
          <JobCard
            key={item.id}
            loading={loading}
            item={item}
            handleOnCardClick={handleRowClick}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  headerText: {
    fontSize: 20,
  },
  jobList: {
    marginTop: 20,
    gap: 10,
  },
});
