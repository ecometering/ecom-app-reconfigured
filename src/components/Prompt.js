import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, TextInput as RNTextInput, View} from 'react-native';
import Text from 'components/cells/Text';
import TextInput from 'components/cells/TextInput';
import {TextType} from 'theme/typography';
import Button, {ButtonType} from 'src/components/cells/Button';
import {PrimaryColors} from 'theme/colors';

export default function Prompt({title, message, onSuccess, onCancel}) {
  const ref = useRef(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <>
      <View style={styles.background} />
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text type={TextType.HEADER_1} style={styles.modalTitle}>
            {title}
          </Text>
          {Boolean(message) && (
            <Text type={TextType.BODY_3} style={styles.modalMessage}>
              {message}
            </Text>
          )}
          <TextInput ref={ref} value={value} onChangeText={setValue} />
          <View style={styles.buttonRow}>
            <Button
              type={ButtonType.PRIMARY}
              title="Submit"
              onPress={() => onSuccess(value)}
              disabled={value.length === 0}
            />
            <View style={styles.buttonSeparator} />
            <Button
              type={ButtonType.SECONDARY}
              title="Cancel"
              onPress={onCancel}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: PrimaryColors.Gray,
    position: 'absolute',
    opacity: 0.75,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: PrimaryColors.Blue,
    width: '80%',
    padding: 32,
  },
  modalTitle: {
    marginBottom: 32,
  },
  modalMessage: {
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 32,
  },
  buttonSeparator: {
    width: 64,
  },
});
