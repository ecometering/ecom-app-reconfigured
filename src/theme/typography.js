import {StyleSheet, TextStyle} from 'react-native';
import {PrimaryColors} from './colors';
import {unitH, unitW} from '../utils/constant';

export const TextType = {
  HEADER_1: 'HEADER_1',
  HEADER_TABLE: 'HEADER_TABLE',
  CAPTION_1: 'CAPTION_1',
  CAPTION_2: 'CAPTION_2',
  CAPTION_3: 'CAPTION_3',
  BODY_1: 'BODY_1',
  BODY_TABLE: 'BODY_TABLE',
  BUTTON_1: 'BUTTON_1',
  BUTTON_2: 'BUTTON_2',
  TEXTINPUT: 'TEXTINPUT',
};

const headerBase = {
  color: PrimaryColors.Black,
  fontWeight: '500',
  textAlign: 'center',
};

const bodyBase = {
  color: PrimaryColors.Black,
  fontWeight: '600',
  textAlign: 'center',
};

const buttonBase = {
  color: PrimaryColors.Black,
  fontWeight: '600',
  textAlign: 'center',
};

export const TextStyles = StyleSheet.create({
  [TextType.HEADER_1]: {
    ...headerBase,
    fontSize: 20 * unitH,
    fontWeight: '800',
    lineHeight: 2.5 * 20 * unitH,
    letterSpacing: -0.24,
  },
  [TextType.HEADER_TABLE]: {
    ...headerBase,
    fontSize: 14 * unitH,
    fontWeight: '800',
    lineHeight: 1.5 * 14 * unitH,
    letterSpacing: -0.24,
  },
  [TextType.CAPTION_1]: {
    ...headerBase,
    fontSize: 19 * unitH,
    fontWeight: '600',
    lineHeight: 2.5 * 19 * unitH,
    letterSpacing: -0.24,
  },
  [TextType.CAPTION_2]: {
    ...headerBase,
    fontSize: 18 * unitH,
    fontWeight: '600',
    lineHeight: 2.5 * 18 * unitH,
    letterSpacing: -0.24,
  },
  [TextType.CAPTION_3]: {
    ...headerBase,
    fontSize: 30 * unitH,
    fontWeight: '600',
    lineHeight: 2.5 * 30 * unitH,
    letterSpacing: -0.24,
  },
  [TextType.BODY_1]: {
    ...bodyBase,
    fontSize: 18 * unitH,
    lineHeight: 1.17 * 18 * unitH,
    letterSpacing: -0.29,
  },
  [TextType.BODY_TABLE]: {
    ...bodyBase,
    fontSize: 14 * unitH,
    lineHeight: 1.17 * 14 * unitH,
    letterSpacing: -0.29,
  },
  [TextType.BUTTON_1]: {
    ...buttonBase,
    fontSize: 20 * unitH,
    letterSpacing: -0.75,
  },
  [TextType.BUTTON_2]: {
    ...buttonBase,
    fontSize: 20 * unitH,
    fontWeight: 'bold',
    lineHeight: 1.67 * 20 * unitH,
    letterSpacing: -0.45,
  },
  [TextType.TEXTINPUT]: {
    ...bodyBase,
    textAlign: 'left',
    fontSize: 20 * unitH,
    lineHeight: 1.17 * 20 * unitH,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 0,
    paddingLeft: 20 * unitW,
  },
});
