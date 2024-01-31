import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  Pressable as PressableRN,
  StyleSheet,
  View,
} from 'react-native';
import {TextType} from '../theme/typography';
import Text from './Text';
import {PrimaryColors, SecondaryColors} from '../theme/colors';
import {unitH, unitW} from '../utils/constant';
import {blueGradientButton, redGradientButton} from '../utils/assets';

export const EcomPressable = ({onPress, ...rest}) => {
  return (
    <PressableRN
      onPress={event => {
        if (onPress) {
          onPress(event);
        }
      }}
      {...rest}
    />
  );
};

const ImageButton = ({
  isSelected,
  imageStyle,
  textContainerStyle,
  textStyle,
  textType = TextType.HEADER_6,
  onPress,
  image,
  text = '',
  containerStyle,
}) => {
  const [pressed, setPressed] = useState(false);

  return (
    <EcomPressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}>
      <ImageBackground
        source={pressed || isSelected ? blueGradientButton : redGradientButton}
        style={{...styles.container, ...containerStyle}}>
        {image && (
          <Image
            resizeMethod="auto"
            style={{...styles.imageStyle, ...imageStyle}}
            source={image}
          />
        )}
        {text !== '' && (
          <View
            style={[
              {...textContainerStyle},
              pressed || isSelected
                ? styles.imageCircleBlue
                : styles.imageCircleRed,
            ]}>
            <Text type={textType} style={{...styles.text, ...textStyle}}>
              {text}
            </Text>
          </View>
        )}
      </ImageBackground>
    </EcomPressable>
  );
};

export function Separator({separatorStyle}) {
  return <View style={{...styles.separator, ...separatorStyle}} />;
}

const styles = StyleSheet.create({
  container: {
    width: 550 * unitH,
    height: 550 * unitH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: unitW * 475,
    height: unitW * 475,
  },
  imageStyle: {
    width: unitH * 169,
    height: unitH * 169,
    alignSelf: 'center',
    borderRadius: unitW * 84.5,
    borderWidth: unitW * 15,
    borderColor: '#d7d2cb50',
  },
  text: {
    textAlign: 'center',
    color: PrimaryColors.White,
  },
  separator: {},
  imageCircleRed: {
    backgroundColor: SecondaryColors.DarkRed,
    borderColor: SecondaryColors.LightRed,
  },
  imageCircleBlue: {
    backgroundColor: SecondaryColors.DarkBlue,
    borderColor: SecondaryColors.LightBlue,
  },
});

export default ImageButton;
