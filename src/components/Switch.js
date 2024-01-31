import React from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import {unitH, unitW} from '../utils/constant';

const SwitchWithTitle = ({title, value, onValueChange}) => {
  const handleValueChange = stat => {
    // Call the onChange function passed as a prop
    onValueChange(stat);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Switch
        trackColor={{false: 'gray', true: 'green'}}
        thumbColor={value ? 'white' : 'white'}
        ios_backgroundColor="gray"
        value={value}
        onValueChange={handleValueChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: unitW * 30,
    paddingVertical: unitH * 10,
  },
  title: {
    marginRight: 'auto',
  },
});

export default SwitchWithTitle;
