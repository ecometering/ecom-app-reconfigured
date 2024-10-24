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
        {item?.job_details?.date_carried_out && (
          <Text>
            <Text style={styles.textBold}>Planned:</Text>
            {new Date(item?.job_details?.date_carried_out).toDateString()}
          </Text>
        )}
      </View>
      <View>
        {item?.mprn?.postcode && (
          <Text>
            <Text style={styles.textBold}>Postcode:</Text>{' '}
            {item?.mprn?.postcode}
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

const hede = {
  item: {
    assigned_ami: null,
    assigned_engineer: 1,
    assigned_surveyor: null,
    id: 258,
    job_details: {
      AMRDetails: null,
      CorrectorDetails: null,
      MeterDetails: [Object],
      additionalMaterials: null,
      chatterboxDetails: null,
      created_at: '2024-09-05T23:23:48.541515+01:00',
      created_by: 33,
      date_carried_out: '2024-09-05T23:23:48.538375+01:00',
      ecvDetails: [Object],
      engineer: 33,
      id: 294,
      job_id: 87,
      job_notes_old: '',
      job_status: 'Complete',
      job_type: 'Survey',
      kioskDetails: [Object],
      last_updated: '2024-09-05T23:23:48.541503+01:00',
      maintenanceQuestions: null,
      market_sector: '',
      movDetails: [Object],
      mprn: '1127502705',
      notes_old: '',
      planned_date: null,
      reason_code: '',
      rebook: null,
      regulatorDetails: null,
      siteQuestions: [Object],
      standards: [Object],
      streams: null,
      trans_ref: null,
      transaction_status: '',
    },
    job_type: 'MEX & AMR',
    meter_size: 'ROTARY',
    mprn: {
      access_codes: '',
      address_1: 'Charles Bowman Industrial Estate',
      address_2: '',
      address_3: '',
      building: 'Strathmore House',
      county: 'Angus',
      created_at: '2024-08-16T08:31:23.464513+01:00',
      email: '',
      email_2: '',
      first_name: 'Gary',
      gas_supplier: 40,
      gas_supplier_ref: 810,
      grid_reference: null,
      last_updated: '2024-09-05T23:23:48.488746+01:00',
      micro_business: 'Yes',
      mprn: '1127502705',
      notes_old: '',
      postcode: 'DD4 9UB',
      pressure: 'LP',
      site_name: 'Start Group',
      supplier_ref: 'CG1846672',
      surname: '',
      telephone: '07860715310',
      telephone_2: '',
      three_words: null,
      title: 'Mr',
      town: 'Dundee',
    },
    other_job: 294,
    pressure_tier: 'LP',
    status: 'surveyed',
    survey: 294,
    survey_required: false,
  },
};
