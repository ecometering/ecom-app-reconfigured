import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Text from './Text';
import TextInput from './TextInput';
import {unitH, unitW} from '../utils/constant';

const NumberInput = ({initial, handleChangeValue}) => {
  const [value, setValue] = useState(initial);
  const handleIncrement = () => {
    if (value === '' || value === 'NaN') {
      setValue(0);
      handleChangeValue(0);
      return;
    }
    const newValue = value + 1;
    setValue(newValue);
    handleChangeValue(newValue);
  };

  const handleDecrement = () => {
    if (value === '' || value === 'NaN') {
      setValue(0);
      handleChangeValue(0);
      return;
    }
    let newValue = value - 1;
    if (newValue < 1) {
      newValue = 0;
    }
    setValue(newValue);
    handleChangeValue(newValue);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={StyleSheet.input}
        keyboardType="numeric"
        value={value.toString()}
        defaultValue={initial.toString()}
        onChangeText={text => setValue(parseInt(text, 10))}
      />
      <View style={styles.arrowContainer}>
        <TouchableOpacity onPress={handleIncrement}>
          <Text>🔺</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDecrement}>
          <Text>🔻</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
    textAlign: 'center',
    height: unitH * 30,
  },
  arrowContainer: {alignSelf: 'center'},
});

export default NumberInput;
