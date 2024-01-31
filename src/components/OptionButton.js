import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {EcomPressable as Button} from './ImageButton';
import Text from './Text';
import {PrimaryColors} from '../theme/colors';

const OptionalButton = ({options, actions, style, value}) => {
  const [selectedOption, setSelectedOption] = useState(value);

  const handleOptionPress = (option, action) => {
    setSelectedOption(option);
    action();
  };

  return (
    <View style={{...styles.container}}>
      {options.map((option, index) => (
        <Button
          key={index}
          onPress={() => handleOptionPress(option, actions[index])}
          style={[
            selectedOption === option ? styles.selectedButton : styles.button,
            style,
          ]}>
          <Text>{option}</Text>
        </Button>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  button: {
    padding: 5,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    borderColor: 'black',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width: 2, height: 2},
    shadowRadius: 2,
  },
  selectedButton: {
    padding: 5,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: PrimaryColors.Blue,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width: 2, height: 2},
    shadowRadius: 2,
  },
});

export default OptionalButton;
