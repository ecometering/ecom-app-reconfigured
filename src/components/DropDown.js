// /path/to/EcomDropDown.js

import React, { useState } from 'react';
import { Image, Modal, View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useScreenDimensions } from '../utils/constant';
import { TextType, TextStyles } from '../theme/typography';
import { leftGreyArrowIcon } from '../utils/assets';
import {Dropdown} from 'react-native-element-dropdown';
import { PrimaryColors } from '../theme/colors';
import { useWindowDimensions } from 'react-native';

const dynamicDropdownStyles = (width, height) => StyleSheet.create({
  container: {
    borderColor: PrimaryColors.Black,
    borderWidth: 1,
    paddingLeft: width * 0.05,
    // 80% of window width
  },
  text: {
    fontSize: height * 0.02, // Adjust font size dynamically based on window height
  },
  dropdown: {
    fontSize: width * 0.04, // Adjust dropdown font size dynamically
  },
  modalContent: {
    backgroundColor: PrimaryColors.White,
    borderRadius: 10,
    maxHeight: height * 0.5, // Half of window height
    width: width * 0.8, // 80% of window width
  },
  item: {
    padding: 10,
    fontSize: width * 0.04, // Dynamic font size for items
  },
  icon: {
    width: width * 0.06, // Dynamic width
    height: height * 0.03, // Dynamic height
    transform: [{ rotate: '-90deg' }],
  },
});

const EcomDropDown = ({ value, valueList, placeholder, onChange }) => {
  const { width, height } = useWindowDimensions();
  const styles = dynamicDropdownStyles(width, height);

  return (
    <View>
      <Text style={styles.text}>{placeholder || ' '}</Text>
      <View style={{ height: 5 }} />
      <View style={styles.container}>
        <Dropdown
          data={valueList}
          search
         
          labelField="label"
          valueField="value"
          placeholder=''
          value={value}
          onChange={onChange}
          style={styles.dropdown}
        />
      </View>
    </View>
  );
};

const DropDownItem = ({ item, onPress }) => {
  const { width, height } = useWindowDimensions();
  const styles = dynamicDropdownStyles(width, height);
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.item}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const DropDown = ({ items, onSelectedItem, selectedItem, placeholder }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { width, height } = useWindowDimensions();
  const styles = dynamicDropdownStyles(width, height);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.text}>
          {selectedItem ? selectedItem.title : placeholder}
        </Text>
        <Image source={leftGreyArrowIcon} resizeMode="contain" style={styles.icon} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <ScrollView>
            {items.map((item, index) => (
              <DropDownItem
                key={index}
                item={item}
                onPress={() => {
                  setModalVisible(false);
                  onSelectedItem(item);
                }}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

// Note: Additional style adjustments may be required to fine-tune the design to your application's requirements.

export default EcomDropDown;
