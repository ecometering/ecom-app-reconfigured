import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Platform,
  Pressable,
  StatusBar,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

// Components
import Text from './Text';
import { CustomNavigationBar } from './navbar';

// Theme
import { TextType } from '../theme/typography';
import { PrimaryColors } from '../theme/colors';

// Context
import { useFormStateContext } from '../context/AppContext';
import { useProgressNavigation } from '../context/ProgressiveFlowRouteProvider';

const HEADER_HEIGHT = 60;

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
  hasMenu = true,
}) => {
  const [isNavBarVisible, setNavBarVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const { state } = useFormStateContext();
  const { jumpToStep } = useProgressNavigation();

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      setStatusBarHeight(StatusBar.currentHeight || 0);
    }
  }, []);

  const isNavigationArray = Array.isArray(state?.navigation);

  return (
    <>
      <View style={[styles.headerSpacerMobile, { height: statusBarHeight }]} />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, containerStyle]}>
          {hasMenuButton && (
            <Pressable
              onPress={() => setNavBarVisible(!isNavBarVisible)}
              style={styles.menuBtn}
            >
              <Text>{'Menu'}</Text>
            </Pressable>
          )}
          {hasLeftBtn ? (
            <Pressable onPress={leftBtnPressed} style={styles.btn}>
              <Text type={TextType.BUTTON_1}>{leftBtnText || 'Back'}</Text>
            </Pressable>
          ) : (
            <View style={styles.placeholder} />
          )}
          {hasCenterText && (
            <Pressable
              onPress={() => hasMenu && setMenuVisible(!isMenuVisible)}
              style={styles.centerBtn}
            >
              <Text type={TextType.HEADER_1} style={styles.centerText}>
                {centerText || 'Jb No: ECOM00000'}
              </Text>
            </Pressable>
          )}
          {hasRightBtn ? (
            <Pressable onPress={rightBtnPressed} style={styles.btn}>
              <Text type={TextType.BUTTON_1}>{rightBtnText || 'Next'}</Text>
            </Pressable>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </SafeAreaView>
      {isNavBarVisible && (
        <CustomNavigationBar
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
      <Modal
        animationType="slide"
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.navigationHeader}>
            <TouchableOpacity onPress={() => setMenuVisible(false)}>
              <Text style={styles.navigationCloseButton}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {isNavigationArray &&
              state?.navigation?.map((nav, index) => (
                <Pressable
                  key={`nav-${index}-${nav?.screen}`}
                  onPress={() => {
                    setMenuVisible(false);
                    jumpToStep(index);
                  }}
                  style={[
                    styles.navItem,
                    {
                      backgroundColor:
                        state?.lastNavigationIndex === index
                          ? PrimaryColors.Green
                          : '#f4f4f4',
                    },
                  ]}
                >
                  <Text style={styles.navItemText}>{nav?.screen}</Text>
                </Pressable>
              ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerSpacerMobile: {
    backgroundColor: '#ffffff',
  },
  safeArea: {
    backgroundColor: '#ffffff',
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    width: '100%',
    height: HEADER_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  navigationCloseButton: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  centerText: {
    textAlign: 'center',
  },
  btn: {
    paddingHorizontal: 10,
  },
  centerBtn: {
    flex: 1,
    alignItems: 'center',
  },
  menuBtn: {
    marginRight: 10,
  },
  placeholder: {
    width: 50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navItemText: {
    padding: 15,
  },
});

export default Header;
