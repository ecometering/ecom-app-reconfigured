import { Text, TouchableOpacity, View } from 'react-native';
import JobStatusLabel from './JobStatusLabel';

const JobCard = ({ loading, item, handleOnCardClick, buttonConfig }) => {
  const parsedSiteDetails = JSON.parse(item.siteDetails);
  return (
    <TouchableOpacity
      onPress={() => handleOnCardClick(item.id)}
      style={{ ...styles.cardContainer, opacity: loading ? 0.5 : 1 }}
      disabled={loading}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.textBold}>
          {item.jobType} Job ({item.id})
        </Text>
        <JobStatusLabel status={item.jobStatus} />
      </View>

      <Text style={styles.mrpnText}>
        <Text style={styles.textBold}>MPRN:</Text>
        {item.MPRN ?? parsedSiteDetails.mprn}
      </Text>

      <View style={styles.dateContainer}>
        <Text>
          <Text style={styles.textBold}>Start:</Text>
          {new Date(item.startDate).toDateString('en-GB')}
        </Text>
        <Text>
          <Text style={styles.textBold}>End:</Text>
          {item.endDate ? new Date(item.startDate).toDateString('en-GB') : '-'}
        </Text>
      </View>
      {buttonConfig && (
        <View style={styles.buttonsContainer}>
          {buttonConfig.map((button) => (
            <TouchableOpacity
              key={button.text}
              style={{
                ...styles.button,
                backgroundColor: button.backgroundColor,
              }}
              onPress={button.onPress}
            >
              <Text style={{ color: button.textColor }}>{button.text}</Text>
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
