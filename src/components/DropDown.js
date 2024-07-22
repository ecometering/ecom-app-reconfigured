import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

// Theme
import { PrimaryColors } from '../theme/colors';

const EcomDropDown = ({ value, valueList, placeholder, onChange }) => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text>{placeholder || ' '}</Text>
      <View style={styles.container}>
        <Dropdown
          data={valueList}
          search
          labelField="label"
          valueField="value"
          placeholder=""
          value={value}
          onChange={onChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: PrimaryColors.Black,
    borderWidth: 1,
  },
});

export default EcomDropDown;
