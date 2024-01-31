import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {unitH, width} from '../utils/constant';
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
  return (
    <View style={{...styles.content, ...containerStyle}}>
      {hasLeftBtn === true ? (
        <Pressable onPress={leftBtnPressed} style={styles.leftBtn}>
          <Text type={TextType.BUTTON_1}>
            {leftBtnText ? leftBtnText : 'Back'}
          </Text>
        </Pressable>
      ) : (
        <View />
      )}
      {hasCenterText === true ? (
        <Text type={TextType.HEADER_1}>
          {centerText ?? 'Job Number: ECOM00000'}
        </Text>
      ) : null}
      {hasRightBtn === true ? (
        <Pressable onPress={rightBtnPressed} style={styles.rightBtn}>
          <Text type={TextType.BUTTON_1}>
            {rightBtnText ? rightBtnText : 'Next'}
          </Text>
        </Pressable>
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    width: width,
    height: unitH * 80,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftBtn: {
    left: 20,
  },
  rightBtn: {
    right: 20,
  },
});

export default Header;
