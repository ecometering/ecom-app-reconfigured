import React from 'react';
import {
  Text,
  View,
  Platform,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';

// Components
import Header from '../../components/Header';
import OptionalButton from '../../components/OptionButton';
import { TextInputWithTitle } from '../../components/TextInput';

// Context and Utils
import EcomHelper from '../../utils/ecomHelper';
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

function MaintenanceQuestionsPage() {
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const { state, setState } = useFormStateContext();
  const { maintenanceDetails, jobType } = state;

  const title = jobType === 'Install' ? 'New Meter Details' : jobType;

  const handleInputChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      maintenanceDetails: {
        ...prevState.maintenanceDetails,
        [key]: value,
      },
    }));
  };

  const nextPressed = async () => {
    if (maintenanceDetails?.isRisky == null) {
      EcomHelper.showInfoMessage(
        'Please answer if job covered by the gneric risk assessment'
      );
      return;
    }
    if (maintenanceDetails?.isCarryOut == null) {
      EcomHelper.showInfoMessage('Please answer if job can be carried out');
      return;
    }
    if (maintenanceDetails?.isFitted == null) {
      EcomHelper.showInfoMessage('Please answer if By-pass fitted');
      return;
    }
    if (maintenanceDetails?.condition == null) {
      EcomHelper.showInfoMessage(
        'Please choose maintenanceDetails?.condition of meter housing'
      );
      return;
    }
    if (maintenanceDetails?.oilLevel == null) {
      EcomHelper.showInfoMessage('Please choose Metal oil level');
      return;
    }
    if (maintenanceDetails?.isClearPipes == null) {
      EcomHelper.showInfoMessage('Please answer if vent pipes clear');
      return;
    }
    if (maintenanceDetails?.notes == null) {
      EcomHelper.showInfoMessage(
        'Please enter engineer maintenanceDetails?.notes'
      );
      return;
    }
    if (maintenanceDetails?.isConfirm == null) {
      EcomHelper.showInfoMessage(
        'Please answer if Customer Installation Pipework and appliances confirm to current standards'
      );
      return;
    }

    goToNextStep();
  };

  const backPressed = async () => {
    goToPreviousStep();
  };

  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={title}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <ScrollView style={styles.content}>
          <View style={styles.body}>
            <View style={styles.optionContainer}>
              <Text style={styles.title}>
                {'Is the job covered by the generic risk assessment'}
              </Text>
              <View style={styles.option}>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      handleInputChange('isRisky', true);
                    },
                    () => {
                      handleInputChange('isRisky', false);
                    },
                  ]}
                  value={
                    maintenanceDetails?.isRisky == null
                      ? null
                      : maintenanceDetails?.isRisky
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
            </View>

            <View style={styles.optionContainer}>
              <Text style={styles.title}>{'Can the Job be carried out'}</Text>
              <View style={styles.option}>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      handleInputChange('isCarryOut', true);
                    },
                    () => {
                      handleInputChange('isCarryOut', false);
                    },
                  ]}
                  value={
                    maintenanceDetails?.isCarryOut == null
                      ? null
                      : maintenanceDetails?.isCarryOut
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
            </View>

            <View style={styles.optionContainer}>
              <Text style={styles.title}>{'Is a By-pass fitted'}</Text>
              <View style={styles.option}>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      handleInputChange('isFitted', true);
                    },
                    () => {
                      handleInputChange('isFitted', false);
                    },
                  ]}
                  value={
                    maintenanceDetails?.isFitted == null
                      ? null
                      : maintenanceDetails?.isFitted
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
            </View>

            <View style={styles.optionContainer}>
              <Text style={styles.title}>Condition of meter housing</Text>
              <View style={styles.option}>
                <OptionalButton
                  options={['Poor', 'ok', 'good']}
                  actions={[
                    () => {
                      handleInputChange('condition', 'Poor');
                    },
                    () => {
                      handleInputChange('condition', 'ok');
                    },
                    () => {
                      handleInputChange('condition', 'good');
                    },
                  ]}
                  value={maintenanceDetails?.condition}
                />
              </View>
            </View>

            <View style={styles.optionContainer}>
              <Text style={{ ...styles.title }}>{'Meter oil level'}</Text>
              <View style={styles.option}>
                <OptionalButton
                  options={['Low', 'ok', 'overfilled', 'N/A']}
                  actions={[
                    () => {
                      handleInputChange('oilLevel', 'Low');
                    },
                    () => {
                      handleInputChange('oilLevel', 'ok');
                    },
                    () => {
                      handleInputChange('oilLevel', 'overfilled');
                    },
                    () => {
                      handleInputChange('oilLevel', 'N/A');
                    },
                  ]}
                  value={maintenanceDetails?.oilLevel}
                />
              </View>
            </View>

            <View style={styles.optionContainer}>
              <Text style={{ ...styles.title }}>{'vent pipes clear'}</Text>
              <View style={styles.option}>
                <OptionalButton
                  options={['Yes', 'No', 'N/A']}
                  actions={[
                    () => {
                      handleInputChange('isClearPipes', 'Yes');
                    },
                    () => {
                      handleInputChange('isClearPipes', 'No');
                    },
                    () => {
                      handleInputChange('isClearPipes', 'N/A');
                    },
                  ]}
                  value={maintenanceDetails?.isClearPipes}
                />
              </View>
            </View>

            <View style={styles.noteContainer}>
              <TextInputWithTitle
                title={'engineers notes'}
                onChangeText={(e) => {
                  handleInputChange('notes', e);
                }}
                style={styles.input}
                multiline={true}
                numberOfLines={5}
                value={maintenanceDetails?.notes}
              />
            </View>

            <View style={styles.optionContainer}>
              <Text style={{ ...styles.title }}>
                {
                  'Does the Customer Installation Pipework and appliances confirm to current standards'
                }
              </Text>
              <View style={styles.option}>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      handleInputChange('isConfirm', true);
                    },
                    () => {
                      handleInputChange('isConfirm', false);
                    },
                  ]}
                  value={
                    maintenanceDetails?.isConfirm == null
                      ? null
                      : maintenanceDetails?.isConfirm
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  body: {
    padding: 10,
    gap: 20,
  },
  optionContainer: {
    flex: 1,
    gap: 5,
  },
  title: {},
  option: {
    flex: 1,
  },
  noteContainer: {},
  input: {
    height: 200,
  },
});

export default MaintenanceQuestionsPage;
