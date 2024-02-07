import React from 'react';
import {Pressable, StyleSheet, View, useWindowDimensions} from 'react-native';
import Text from './Text';
import {TextType} from '../theme/typography';

export const Header = ({
  hasLeftBtn,
  leftBtnText,
  leftBtnPressed,
  hasCenterText,
  centerText,
  hasRightBtn,
  rightBtnText,
  rightBtnPressed,
  containerStyle,
}) => {
  const { width } = useWindowDimensions(); // Dynamically adjust to screen width

  return (
    <View style={[styles.content, { width }, containerStyle]}>
      {hasLeftBtn === true ? (
        <Pressable onPress={leftBtnPressed} style={styles.btn}>
          <Text type={TextType.BUTTON_1}>
            {leftBtnText ? leftBtnText : 'Back'}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
      {hasCenterText === true ? (
        <Text type={TextType.HEADER_1} style={styles.centerText}>
          {centerText ?? 'Job Number: ECOM00000'}
        </Text>
      ) : null}
      {hasRightBtn === true ? (
        <Pressable onPress={rightBtnPressed} style={styles.btn}>
          <Text type={TextType.BUTTON_1}>
            {rightBtnText ? rightBtnText : 'Next'}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '10%', // Adjust height based on design requirements
  },
  btn: {
    paddingHorizontal: 20, // Use padding for spacing inside buttons
  },
  centerText: {
    textAlign: 'center', // Ensure center text is actually centered
  },
  placeholder: {
    width: 20, // Placeholder to maintain spacing if button is not present
  },
});

export default Header;
