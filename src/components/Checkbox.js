import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PrimaryColors } from '../theme/colors';

const CustomCheckbox = ({ label, checked, onChange }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onChange(!checked)}
    >
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && (
          <View style={[styles.innerCheckbox, checked && styles.checked]} />
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checked: {
    backgroundColor: PrimaryColors.Green,
  },
  innerCheckbox: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
  },
});

export default CustomCheckbox;
