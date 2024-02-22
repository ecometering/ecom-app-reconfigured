import React, {forwardRef} from 'react';
import {StyleSheet, TextInput as RNTextInput, View} from 'react-native';
import {PrimaryColors} from '../theme/colors';
import {unitH, useScreenDimensions } from '../utils/constant';
import {TextStyles, TextType} from '../theme/typography';
import Text from './Text';
// Import useState and useEffect for managing state and side effects
import { useState, useEffect } from 'react';

// Custom hook for dynamic screen dimensions

const TextInput = forwardRef(
  ({ placeholderTextColor, style, onChangeText, ...otherProps }, ref) => {
    return (
      <RNTextInput
        ref={ref}
        placeholderTextColor={placeholderTextColor || PrimaryColors.Gray}
        onChangeText={text => {
          if (onChangeText) {
            onChangeText(text);
          }
        }}
        style={[styles.textInput, style]}
        {...otherProps}
      />
    );
  },
);

export const TextInputWithTitle = forwardRef(
  ({ title, placeholderTextColor, style, containerStyle, onChangeText, ...otherProps }, ref) => {
    const { width } = useScreenDimensions(); // Dynamic screen dimensions
    const dynamicStyle = { width: "100%"  }; // Example of dynamic width based on screen size

    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={{ fontSize: 10 }}>{title}</Text>
        <View style={{ height: 5 }} />
        <TextInput
          ref={ref}
          placeholderTextColor={placeholderTextColor}
          onChangeText={onChangeText}
          style={[dynamicStyle, style]} // Apply dynamic style here
          {...otherProps}
        />
      </View>
    );
  },
);

// Adjusted InputRowWithTitle to accept refs for each input
export const InputRowWithTitle = forwardRef(
  ({ title1, title2, placeholderTextColor, style, onChangeText1, onChangeText2, ref1, ref2,placeholder1,keyboardType1,keyboardType2,placeholder2, ...otherProps }, ref) => {
    const { width } = useScreenDimensions(); // Use the custom hook for dynamic dimensions
    const dynamicGap = width * 0.02;

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, marginRight: dynamicGap }}>
          <TextInputWithTitle
            title={title1}
            placeholderTextColor={placeholderTextColor}
            onChangeText={onChangeText1}
            style={style}
            ref={ref1}
            placeholder={placeholder1}
            keyboardType={keyboardType1}// Pass ref to the first TextInputWithTitle
            {...otherProps}
          />
        </View>
        <View style={{ flex: 1 }}>
          <TextInputWithTitle
            title={title2}
            placeholderTextColor={placeholderTextColor}
            onChangeText={onChangeText2}
            style={style}
            ref={ref2}
            keyboardType={keyboardType2}
            placeholder={placeholder2}
            {...otherProps}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  textInput: {
    backgroundColor: PrimaryColors.White,
    borderRadius: 5,
    ...TextStyles[TextType.TEXTINPUT],
    borderColor: PrimaryColors.Black,
    padding: 10, // Added padding for better text input visibility
    // Height and width removed to allow dynamic styling
  },
});

export default TextInput;
