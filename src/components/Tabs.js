import { View, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';

// Components
import Text from './Text';
import { EcomPressable as Button } from './ImageButton';

// Utils
import { PrimaryColors } from '../theme/colors';

const Tabs = ({ options, actions, style, value }) => {
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
    backgroundColor: `${PrimaryColors.Sand}50`,
    borderBottomWidth: 1,
  },
  button: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
  },
  selectedButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderColor: 'black',
    borderBottomColor: PrimaryColors.Green,
  },
});

export default Tabs;
