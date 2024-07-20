import {
  View,
  FlatList,
  Platform,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';

// Components
import Header from '../../components/Header';
import EcomDropDown from '../../components/DropDown';
import Text, { CenteredText } from '../../components/Text';
import { EcomPressable as Button } from '../../components/ImageButton';

// Context & Utils
import EcomHelper from '../../utils/ecomHelper';
import { TextType } from '../../theme/typography';
import { useFormStateContext } from '../../context/AppContext';
import { PrimaryColors, Transparents } from '../../theme/colors';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

const quantityList = [
  { _index: 1, label: '1', value: '1' },
  { _index: 2, label: '2', value: '2' },
  { _index: 3, label: '3', value: '3' },
  { _index: 4, label: '4', value: '4' },
  { _index: 5, label: '5', value: '5' },
  { _index: 6, label: '6', value: '6' },
  { _index: 7, label: '7', value: '7' },
  { _index: 8, label: '8', value: '8' },
  { _index: 9, label: '9', value: '9' },
  { _index: 10, label: '10', value: '10' },
  { _index: 11, label: '11', value: '11' },
  { _index: 12, label: '12', value: '12' },
  { _index: 13, label: '13', value: '13' },
  { _index: 14, label: '14', value: '14' },
  { _index: 15, label: '15', value: '15' },
  { _index: 16, label: '16', value: '16' },
  { _index: 17, label: '17', value: '17' },
  { _index: 18, label: '18', value: '18' },
  { _index: 19, label: '19', value: '19' },
  { _index: 20, label: '20', value: '20' },
  { _index: 21, label: '21', value: '21' },
  { _index: 22, label: '22', value: '22' },
  { _index: 23, label: '23', value: '23' },
  { _index: 24, label: '24', value: '24' },
  { _index: 25, label: '25', value: '25' },
  { _index: 26, label: '26', value: '26' },
  { _index: 27, label: '27', value: '27' },
  { _index: 28, label: '28', value: '28' },
  { _index: 29, label: '29', value: '29' },
  { _index: 30, label: '30', value: '30' },
];

function AdditionalMaterialPage() {
  const db = useSQLiteContext();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const { state, setState } = useFormStateContext();
  const { regulatorDetails, jobID } = state;

  const [category, setCategory] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleInputChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      regulatorDetails: {
        ...prevState.regulatorDetails,
        materials: value,
      },
    }));
  };

  const saveToDatabase = async () => {
    const additionalMaterialsJSON = JSON.stringify(regulatorDetails?.materials);
    try {
      await db
        .runAsync('UPDATE Jobs SET additionalMaterials = ? WHERE id = ?', [
          additionalMaterialsJSON,
          jobID,
        ])
        .then((result) => {
          console.log('meterDetails saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving meterDetails to database:', error);
    }
  };

  const nextPressed = async () => {
    if (regulatorDetails?.materials?.length === 0) {
      EcomHelper.showInfoMessage('Please add materials');
      return;
    }
    await saveToDatabase();
    goToNextStep();
  };

  const backPressed = async () => {
    await saveToDatabase();
    goToPreviousStep();
  };

  const addPressed = () => {
    if (category == null || category === '') {
      EcomHelper.showInfoMessage('Please choose category');
      return;
    }
    if (item == null || item === '') {
      EcomHelper.showInfoMessage('Please choose item code or type');
      return;
    }
    if (quantity == null || quantity === 0) {
      EcomHelper.showInfoMessage('Please choose quantity');
      return;
    }
    let id = regulatorDetails?.materials?.length || 0;
    let values = [
      ...(regulatorDetails?.materials || []),
      {
        id: id,
        category: category,
        item: item,
        quantity: quantity,
      },
    ];
    handleInputChange(values);
  };

  const deletePressed = (index) => {
    const updatedMaterials = [...regulatorDetails?.materials];
    updatedMaterials.splice(index, 1);
    handleInputChange(updatedMaterials);
  };

  const renderItem = ({ index, item }) => {
    const handleItemClick = () => {};
    const rowColor =
      index % 2 === 1 ? Transparents.SandColor2 : Transparents.Clear;

    return (
      <Button onPress={handleItemClick}>
        <View style={{ ...styles.row, backgroundColor: rowColor }}>
          <CenteredText
            containerStyle={styles.cell}
            type={TextType.BODY_TABLE}
            style={styles.blackTxt}
          >
            {item?.category.label}
          </CenteredText>
          <CenteredText
            containerStyle={styles.cell}
            type={TextType.BODY_TABLE}
            style={styles.blackTxt}
          >
            {item?.item.label}
          </CenteredText>
          <CenteredText
            containerStyle={styles.cell}
            type={TextType.BODY_TABLE}
            style={styles.blackTxt}
          >
            {item?.quantity.label}
          </CenteredText>
          <CenteredText
            containerStyle={styles.cell}
            type={TextType.BODY_TABLE}
            style={styles.blackTxt}
          >
            <Button
              onPress={() => {
                deletePressed(index);
              }}
            >
              <Text>{'❌'}</Text>
            </Button>
          </CenteredText>
        </View>
      </Button>
    );
  };

  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={'Additional Materials'}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <Text type={TextType.HEADER_1}>Add material</Text>
        <EcomDropDown
          value={category}
          valueList={[
            { _index: 1, label: 'Category 1', value: '1' },
            { _index: 2, label: 'Category 2', value: '2' },
          ]}
          placeholder={'Category'}
          onChange={(e) => setCategory(e)}
        />

        <EcomDropDown
          value={item}
          valueList={[
            { _index: 1, label: '1', value: '1' },
            { _index: 2, label: '2', value: '2' },
          ]}
          placeholder={'Item Code'}
          onChange={(e) => setItem(e)}
        />
        <EcomDropDown
          value={quantity}
          valueList={quantityList}
          placeholder={'Quantity'}
          onChange={(e) => {
            setQuantity(e);
          }}
        />
        <View style={styles.buttonContainer}>
          <Button onPress={addPressed} style={styles.button}>
            <Text style={styles.buttonText}>Add</Text>
          </Button>
        </View>
        {regulatorDetails?.materials?.length > 0 ? (
          <View style={{ flex: 1 }}>
            <View
              style={[styles.row, { backgroundColor: Transparents.BlueColor2 }]}
            >
              <CenteredText
                containerStyle={styles.headerCell}
                type={TextType.BODY_TABLE}
                style={styles.blackTxt}
              >
                {'Category'}
              </CenteredText>
              <CenteredText
                containerStyle={styles.headerCell}
                type={TextType.BODY_TABLE}
                style={styles.blackTxt}
              >
                {'Item'}
              </CenteredText>
              <CenteredText
                containerStyle={styles.headerCell}
                type={TextType.BODY_TABLE}
                style={styles.blackTxt}
              >
                {'Quantity'}
              </CenteredText>
              <CenteredText
                containerStyle={styles.headerCell}
                type={TextType.BODY_TABLE}
                style={styles.blackTxt}
              >
                {'Delete'}
              </CenteredText>
            </View>
            <FlatList
              data={regulatorDetails?.materials}
              renderItem={(props) => renderItem(props, deletePressed)}
              keyExtractor={(e) => e.id.toString()}
            />
          </View>
        ) : (
          <Text
            style={{
              textAlign: 'center',
            }}
          >
            There are no materials to show.
          </Text>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 10,
    padding: 10,
  },
  body: {
    padding: 10,
    gap: 20,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    maxHeight: 50,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: PrimaryColors.Blue,
  },
  buttonText: {
    textAlign: 'center',
    color: PrimaryColors.White,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: PrimaryColors.Black,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    borderWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: PrimaryColors.Black,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackTxt: {
    color: PrimaryColors.Black,
  },
});

export default AdditionalMaterialPage;
