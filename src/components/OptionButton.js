import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { EcomPressable as Button } from './ImageButton';
import Text from './Text';
import { PrimaryColors } from '../theme/colors';

const OptionalButton = ({ options, actions, style, value }) => {
  const [selectedOption, setSelectedOption] = useState(value);

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  const handleOptionPress = (option, action) => {
    setSelectedOption(option);
    action();
  };

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <Button
          key={index}
          onPress={() => handleOptionPress(option, actions[index])}
          style={[
            selectedOption === option ? styles.selectedButton : styles.button,
            style,
          ]}
        >
          <Text>{option}</Text>
        </Button>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 5,
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
  },
  selectedButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: PrimaryColors.Green,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 2,
  },
});

export default OptionalButton;
