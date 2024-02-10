import React from 'react';
import {Pressable, StyleSheet, View, useWindowDimensions, Platform, StatusBar} from 'react-native';
import Text from './Text';
import {TextType} from '../theme/typography';
import {unitH, unitW} from '../utils/constant';


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
    <View style={[styles.content, { width, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0  }, containerStyle]}>
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
          {centerText ?? 'Jb No: ECOM00000'}
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
    width: "100%",
    height: unitH * 80,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center', // Ensure center text is actually centered
  },
  placeholder: {
    width: 20, // Placeholder to maintain spacing if button is not present
  },
});

export default Header;
