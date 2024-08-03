import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  Modal,
  SafeAreaView,
} from 'react-native';
import Text from './Text';
import { TextType } from '../theme/typography';
import { CustomNavigationBar } from './navbar';
import { useFormStateContext } from '../context/AppContext';
import { useProgressNavigation } from '../context/ProgressiveFlowRouteProvider';
import { ScrollView } from 'react-native-gesture-handler';

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
  const [isNavBarVisible, setNavBarVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const { state } = useFormStateContext();
  const { jumpToStep } = useProgressNavigation();

  return (
    <View
      style={[
        styles.content,
        {
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        },
        containerStyle,
      ]}
    >
      {hasMenuButton && (
        <Pressable
          onPress={() => setNavBarVisible(!isNavBarVisible)}
          style={styles.menuBtn}
        >
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
          <Text type={TextType.BUTTON_1}>{leftBtnText || 'Back'}</Text>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
      {hasCenterText && (
        <Pressable
          onPress={() => setMenuVisible(!isMenuVisible)}
          style={{ ...styles.btn, flex: 1 }}
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
      <Modal
        animationType="slide"
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <ScrollView>
            {state?.navigation?.map((nav, index) => {
              return (
                <Pressable
                  key={`nav-${index}-${nav.screen}`}
                  onPress={() => {
                    setMenuVisible(false);
                    jumpToStep(index);
                  }}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'black',
                    backgroundColor:
                      state?.lastNavigationIndex === index
                        ? 'green'
                        : '#f4f4f4',
                  }}
                >
                  <Text
                    style={{
                      padding: 10,
                    }}
                  >
                    {nav.screen}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  centerText: {
    textAlign: 'center',
  },
  btn: {
    paddingHorizontal: 20,
  },
  menuBtn: {
    marginRight: 20,
  },
  placeholder: {
    width: 20,
  },
});

export default Header;
