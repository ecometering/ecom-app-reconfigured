import { Text, TouchableOpacity, View } from 'react-native';
import JobStatusLabel from './JobStatusLabel';

const JobCard = ({ loading, item, handleOnCardClick, buttonConfig }) => {
  if (!item) {
    console.error('Item is undefined in JobCard');
    return null;
  }

  const parseSafely = (jsonString, fallback = {}) => {
    if (!jsonString) return fallback;
    try {
      return typeof jsonString === 'string'
        ? JSON.parse(jsonString)
        : jsonString;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return fallback;
    }
  };

  const parsedSiteDetails = parseSafely(item?.siteDetails || item);
  const parsedNavigation = parseSafely(item?.navigation, []);

  const mprn = item?.MPRN ?? parsedSiteDetails.mprn ?? 'N/A';
  const lastScreen = parsedNavigation[item?.lastNavigationIndex]?.screen;
  const startDate = item?.startDate && new Date(item?.startDate).toDateString();

  const endDate = item?.endDate && new Date(item?.endDate).toDateString();

  return (
    <TouchableOpacity
      onPress={() => handleOnCardClick(item?.id)}
      style={{ ...styles.cardContainer, opacity: loading ? 0.5 : 1 }}
      disabled={loading}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.textBold}>
          {item?.jobType || item?.job_type || 'Unknown'} Job (
          {item?.id || 'No ID'})
        </Text>
        <JobStatusLabel status={item?.jobStatus} />
      </View>

      <Text style={styles.mrpnText}>
        <Text style={styles.textBold}>MPRN:</Text> {mprn?.mprn || mprn}
      </Text>
      {lastScreen && (
        <Text style={styles.lastScreen}>
          <Text style={styles.textBold}>Last Screen: </Text> {lastScreen}
        </Text>
      )}

      <View style={styles.dateContainer}>
        {startDate && (
          <Text>
            <Text style={styles.textBold}>Start:</Text> {startDate}
          </Text>
        )}
        {endDate && (
          <Text>
            <Text style={styles.textBold}>End:</Text> {endDate}
          </Text>
        )}
        {item?.planned_date && (
          <Text>
            <Text style={styles.textBold}>Planned:</Text> {item?.planned_date}
          </Text>
        )}
      </View>
      {buttonConfig && (
        <View style={styles.buttonsContainer}>
          {buttonConfig.map((button, index) => (
            <TouchableOpacity
              key={button.text || index}
              style={{
                ...styles.button,
                backgroundColor: button.backgroundColor || 'gray',
              }}
              onPress={button.onPress}
            >
              <Text style={{ color: button.textColor || 'white' }}>
                {button.text || 'Button'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};
const styles = {
  cardContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    gap: 5,
    // Add elevation for Android
    elevation: 2,
    // Add shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: 'lightgrey',
  },
  textBold: { fontWeight: 'bold' },
  mrpnText: { marginTop: 10 },
  dateContainer: {
    gap: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 5,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
};

export default JobCard;
