import React from 'react';
import { StyleSheet, TextInput as RNTextInput, View } from 'react-native';

// Theme
import { PrimaryColors } from '../theme/colors';
import { TextStyles, TextType } from '../theme/typography';

// Components
import Text from './Text';

const TextInput = (
  { placeholderTextColor, style, onChangeText, ...otherProps },
  ref
) => {
  return (
    <RNTextInput
      ref={ref}
      placeholderTextColor={placeholderTextColor || PrimaryColors.Gray}
      onChangeText={(text) => {
        if (onChangeText) {
          onChangeText(text);
        }
      }}
      style={[styles.textInput, style]}
      {...otherProps}
    />
  );
};

export const TextInputWithTitle = (
  {
    title,
    placeholderTextColor,
    style,
    containerStyle,
    onChangeText,
    ...otherProps
  },
  ref
) => {
  return (
    <View style={[containerStyle]}>
      <Text style={{ fontSize: 10 }}>{title}</Text>
      <View style={{ height: 5 }} />
      <TextInput
        ref={ref}
        placeholderTextColor={placeholderTextColor}
        onChangeText={onChangeText}
        style={{ width: '100%', borderRadius: 5, ...style }}
        {...otherProps}
      />
    </View>
  );
};

export const InputRowWithTitle = ({
  title1,
  title2,
  placeholderTextColor,
  style,
  onChangeText1,
  onChangeText2,
  ref1,
  ref2,
  placeholder1,
  keyboardType1,
  keyboardType2,
  placeholder2,
  ...otherProps
}) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ flex: 1 }}>
        <TextInputWithTitle
          title={title1}
          placeholderTextColor={placeholderTextColor}
          onChangeText={onChangeText1}
          style={style}
          ref={ref1}
          placeholder={placeholder1}
          keyboardType={keyboardType1}
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
};

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    backgroundColor: PrimaryColors.White,
    borderRadius: 5,
    ...TextStyles[TextType.TEXTINPUT],
    borderColor: PrimaryColors.Black,
    padding: 10,
  },
});

export default TextInput;
