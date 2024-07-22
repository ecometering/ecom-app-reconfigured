import {
  View,
  FlatList,
  Platform,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';

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

const quantityList = new Array(30).fill(0).map((_, i) => ({
  _index: i + 1,
  label: i + 1,
  value: i + 1,
}));

function AdditionalMaterialPage() {
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const { state, setState } = useFormStateContext();
  const { regulatorDetails } = state;

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

  const nextPressed = async () => {
    if (regulatorDetails?.materials?.length === 0) {
      EcomHelper.showInfoMessage('Please add materials');
      return;
    }

    goToNextStep();
  };

  const backPressed = async () => {
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
