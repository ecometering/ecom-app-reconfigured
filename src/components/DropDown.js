import React, {useState} from 'react';
import {Image, Modal, View, StyleSheet, ScrollView, Text} from 'react-native';
import {EcomPressable} from './ImageButton';
import {unitH, unitW} from '../utils/constant';
import {TextType, TextStyles} from '../theme/typography';
import {leftGreyArrowIcon} from '../utils/assets';
import {Dropdown} from 'react-native-element-dropdown';
import {PrimaryColors} from '../theme/colors';

const EcomDropDown = ({width, value, valueList, placeholder, onChange}) => {
  const containerStyle = {
    width: width,
    borderColor: PrimaryColors.Black,
    borderWidth: 1,
    paddingLeft: unitW * 20,
  };
  return (
    <View>
      <Text style={{ fontSize: 10 }}>{placeholder ? placeholder : ' '}</Text>
      <View style={{height: 5}} />
      <View style={containerStyle}>
        <Dropdown
          data={valueList}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={''}
          value={value}
          onChange={onChange}
          style={{fontSize: 15}}
        />
      </View>
    </View>
  );
};

export function DropDownItem({item, onPress}) {
  return (
    <EcomPressable onPress={onPress}>
      <Text style={styles.text}>{item.title}</Text>
    </EcomPressable>
  );
}

const DropDown = ({
  activeTint = PrimaryColors.Red,
  placeholderTint = PrimaryColors.Gray,
  dropdownTitle = '',
  dropdownTitleStyle,
  dropdownStyle,
  items,
  onSelectedItem,
  selectedItem,
  placeholder,
  containerStyle,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{...styles.container, ...containerStyle}}>
      {dropdownTitle != '' && (
        <Text style={{...dropdownTitleStyle}}>{dropdownTitle}</Text>
      )}
      <EcomPressable
        disabled={disabled}
        style={{...styles.pressable, ...dropdownStyle}}
        onPress={() => setModalVisible(true)}>
        {selectedItem ? (
          <Text style={[styles.text, {color: activeTint}]}>
            {selectedItem.title}
          </Text>
        ) : (
          <Text style={[styles.text, {color: placeholderTint}]}>
            {placeholder}
          </Text>
        )}
        <Image
          source={leftGreyArrowIcon}
          resizeMode="contain"
          style={{
            ...styles.rightIcon,
            tintColor: selectedItem ? activeTint : placeholderTint,
          }}
        />
      </EcomPressable>
      <Modal
        style={styles.flyout}
        isOpen={modalVisible}
        isLightDismissEnabled={false}
        isOverlayEnabled
        placement="full"
        onDismiss={() => setModalVisible(false)}>
        <View style={styles.flyoutInnerView}>
          <ScrollView
            style={styles.flyoutScrollView}
            contentContainerStyle={styles.flyoutContentStyle}>
            {items.map((item, index) => {
              return (
                <DropDownItem
                  key={index}
                  item={item}
                  onPress={() => {
                    setModalVisible(false);
                    onSelectedItem(item);
                  }}
                />
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
  },
  pressable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: unitW * 40,
    borderRadius: unitH * 5,
    height: unitH * 158,
    backgroundColor: PrimaryColors.White,
  },
  icon: {},
  flyout: {
    width: '100%',
    height: unitH * 1500,
  },
  flyoutInnerView: {
    height: unitH * 1500,
    justifyContent: 'center',
  },
  flyoutScrollView: {
    flexGrow: 0,
  },
  flyoutContentStyle: {
    backgroundColor: PrimaryColors.White,
    borderRadius: unitH * 5,
  },
  rightIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: unitW * 41,
    height: unitH * 45,
    transform: [{rotate: '-90deg'}],
  },
  text: {
    ...TextStyles[TextType.TEXTINPUT],
  },
  spacing: {
    backgroundColor: '#666',
    height: unitH * 3,
  },
});

export default EcomDropDown;
