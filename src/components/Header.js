import React,{useState} from 'react';
import {Pressable, StyleSheet, View, useWindowDimensions, Platform, StatusBar} from 'react-native';
import Text from './Text';
import {TextType} from '../theme/typography';
import {unitH, unitW} from '../utils/constant';
import {CustomNavigationBar} from './navbar';


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
  hasMenuButton,
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const { width } = useWindowDimensions(); // Dynamically adjust to screen width
  const [isNavBarVisible, setNavBarVisible] = useState(false);
  return (
    <View style={[styles.content, { width, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0  }, containerStyle]}>
      {hasMenuButton && (
        <Pressable onPress={() => setNavBarVisible(!isNavBarVisible)} style={styles.menuBtn}>
          <Text>{'Menu'}</Text>
        </Pressable>
      )}
      {isNavBarVisible && (
        <CustomNavigationBar
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
      {hasLeftBtn ? (
        <Pressable onPress={leftBtnPressed} style={styles.btn}>
          <Text type={TextType.BUTTON_1}>
            {leftBtnText || 'Back'}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
      {hasCenterText && (
        <Text type={TextType.HEADER_1} style={styles.centerText}>
          {centerText || 'Jb No: ECOM00000'}
        </Text>
      )}
      {hasRightBtn ? (
        <Pressable onPress={rightBtnPressed} style={styles.btn}>
          <Text type={TextType.BUTTON_1}>
            {rightBtnText || 'Next'}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  centerText: {
    textAlign: 'center',
    flex: 1,
     // Ensure center text is actually centered
  },
  btn: {
    paddingHorizontal: 20, // Use padding for spacing inside buttons
  },
  menuBtn: {
    marginRight: 20,
  },
  placeholder: {
    width: 20, // Placeholder to maintain spacing if button is not present
  },
});

export default Header;
