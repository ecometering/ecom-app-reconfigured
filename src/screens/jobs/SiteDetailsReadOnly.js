import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import { PrimaryColors } from '../../theme/colors';

const SiteDetailsReadOnly = ({ siteDetails, visible, onChangeVisibility }) => {
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>MPRN</Text>
        <Text style={styles.value}>{siteDetails.mprn}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Company name</Text>
        <Text style={styles.value}>{siteDetails.companyName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Building name/number</Text>
        <Text style={styles.value}>{siteDetails.buildingName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Address 1</Text>
        <Text style={styles.value}>{siteDetails.address1}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Address 2</Text>
        <Text style={styles.value}>{siteDetails.address2}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Address 3</Text>
        <Text style={styles.value}>{siteDetails.address3}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Town/city</Text>
        <Text style={styles.value}>{siteDetails.town}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>County</Text>
        <Text style={styles.value}>{siteDetails.county}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Postcode</Text>
        <Text style={styles.value}>{siteDetails.postCode}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Site contact</Text>
        <Text style={styles.value}>
          {siteDetails.title} {siteDetails.contact}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Contact Numbers</Text>
        <View>
          <Text style={styles.value}>{siteDetails.number1}</Text>
          <Text style={styles.value}>{siteDetails.number2}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Contact Emails</Text>
        <View>
          <Text style={styles.value}>{siteDetails.email1}</Text>
          <Text style={styles.value}>{siteDetails.email2}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Contact Instructions</Text>
        <View>
          <Text style={styles.value}>{siteDetails.instructions}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onChangeVisibility(false)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },
  title: {
    fontSize: 16,
    color: 'grey',
  },
  value: {
    fontSize: 16,
  },
  button: {
    backgroundColor: `${PrimaryColors.Green}`,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default SiteDetailsReadOnly;
