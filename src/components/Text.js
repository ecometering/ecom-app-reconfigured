import React from 'react';
import {Image, Pressible, Text as RNText, View} from 'react-native';
import {TextType, TextStyles} from '../theme/typography';
import {unitH} from '../utils/constant';

export default function Text({children, type, style, ...otherProps}) {
  return (
    <RNText style={[TextStyles[type], style]} {...otherProps}>
      {children}
    </RNText>
  );
}

export function CenteredText({
  children,
  onPressed,
  type,
  style,
  containerStyle,
  image,
  ...otherProps
}) {
  return (
    <View style={containerStyle}>
      <Text style={[TextStyles[type], style]} {...otherProps}>
        {children}
      </Text>
      {image && (
        <Image source={image} style={{height: unitH * 20, width: unitH * 20}} />
      )}
    </View>
  );
}
