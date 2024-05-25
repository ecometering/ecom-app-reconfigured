import React, { useContext, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Text, { CenteredText } from '../../components/Text';
import Header from '../../components/Header';
import { width, unitH } from '../../utils/constant';
import { TextType } from '../../theme/typography';
import EcomDropDown from '../../components/DropDown';
import { PrimaryColors, Transparents } from '../../theme/colors';
import { EcomPressable as Button } from '../../components/ImageButton';
import { AppContext } from '../../context/AppContext';
import EcomHelper from '../../utils/ecomHelper';
import { openDatabase } from '../../utils/database';

function AdditionalMaterialPage() {
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const appContext = useContext(AppContext);
  const regulatorDetails = appContext.regulatorDetails;
  const [category, setCategory] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [materials, setMaterials] = useState([]);

  const jobType = appContext.jobType;
  const title = jobType === 'Install' ? 'New Meter Details' : jobType;

  const saveAdditionalMaterialsToDatabase = async () => {
    console.log('creating job');
    const db = await openDatabase();
    console.log('Db status:', db);

    const additionalMaterials = JSON.stringify(materials);

    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE Jobs SET additionalMaterials=?, progress=? WHERE id=?`,
        [additionalMaterials, progress, jobId],
        (_, result) => {
          console.log(
            'Site details and progress updated in database. Generated ID:',
            result.insertId
          );
          // Pass the result.insertId as JobId parameter to the next navigation call
          goToNextStep();
        },
        (_, error) =>
          console.log('Error updating site details in database:', error)
      );
    });
  };
  const nextPressed = () => {
    if (materials.length === 0) {
      EcomHelper.showInfoMessage('Please add materials');
      return;
    }
    saveAdditionalMaterialsToDatabase();
  };
  const backPressed = () => {
    appContext.setRegulatorDetails({
      ...regulatorDetails,
      materials: materials,
    });
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
    let id = materials.length;
    let values = [
      ...materials,
      {
        id: id,
        category: category,
        item: item,
        quantity: quantity,
      },
    ];
    setMaterials(values);
  };

  const deletePressed = (index) => {
    const updatedMaterials = [...materials];
    updatedMaterials.splice(index, 1);
    setMaterials(updatedMaterials);
  };

  const renderItem = (one, index) => {
    const handleItemClick = () => {};
    console.log('========', one, index);
    const element = one.item;
    const rowColor =
      index % 2 === 0 ? Transparents.SandColor2 : Transparents.Clear;

    return (
      <Button key={(index ? index : 0).toString} onPress={handleItemClick}>
        <View
          style={{
            ...styles.row,
            backgroundColor: rowColor,
            height: unitH * 40,
            alignItems: 'center',
          }}
        >
          <CenteredText
            containerStyle={{ ...styles.headerCell, width: width * 0.25 }}
            type={TextType.BODY_TABLE}
            style={styles.blackTxt}
          >
            {element?.category.label}
          </CenteredText>
          <CenteredText
            containerStyle={{ ...styles.headerCell, width: width * 0.35 }}
            type={TextType.BODY_TABLE}
            style={styles.blackTxt}
          >
            {element?.item.label}
          </CenteredText>
          <CenteredText
            containerStyle={{ ...styles.headerCell, width: width * 0.15 }}
            type={TextType.BODY_TABLE}
            style={styles.blackTxt}
          >
            {element?.quantity.label}
          </CenteredText>
          <CenteredText
            containerStyle={{ ...styles.headerCell, width: width * 0.15 }}
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
        <View style={styles.divider} />
      </Button>
    );
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
        <View style={styles.body}>
          <View style={styles.border}>
            <Text type={TextType.HEADER_1} style={{ alignSelf: 'center' }}>
              Add material
            </Text>
            <View style={{ width: width * 0.3 }}>
              <View style={styles.spacer2} />
              <EcomDropDown
                width={width * 0.3}
                value={category}
                valueList={[
                  { _index: 1, label: 'Category 1', value: '1' },
                  { _index: 2, label: 'Category 2', value: '2' },
                ]}
                placeholder={'Category'}
                onChange={(e) => {
                  console.log(e);
                  setCategory(e);
                }}
              />
            </View>
            <View style={styles.spacer} />
            <View style={styles.row}>
              <View style={{ width: width * 0.3 }}>
                <View style={styles.spacer2} />
                <EcomDropDown
                  width={width * 0.3}
                  value={item}
                  valueList={[
                    { _index: 1, label: '1', value: '1' },
                    { _index: 2, label: '2', value: '2' },
                  ]}
                  placeholder={'Item Code'}
                  onChange={(e) => {
                    console.log(e);
                    setItem(e);
                  }}
                />
              </View>
              {/* <Text style={{marginBottom: unitH * 10}}>or</Text> */}
              <View style={{ width: width * 0.3 }}>
                {/* <Text>Item Type</Text> */}
                {/* <View style={styles.spacer2} />
                <EcomDropDown
                  width={width * 0.3}
                  value={item}
                  valueList={[
                    {_index: 1, label: 'Type 1', value: '1'},
                    {_index: 2, label: 'Type 2', value: '2'},
                  ]}
                  placeholder={'Item Type'}
                  onChange={e => {
                    console.log(e);
                    setItem(e);
                  }}
                /> */}
              </View>
            </View>
            <View style={styles.spacer} />
            <View style={{ width: width * 0.3 }}>
              {/* <Text>Category</Text> */}
              <View style={styles.spacer2} />
              <EcomDropDown
                width={width * 0.3}
                value={quantity}
                valueList={[
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
                ]}
                placeholder={'Quantity'}
                onChange={(e) => {
                  console.log(e);
                  //{"_index": 1, "label": "Item 2", "value": "2"}
                  setQuantity(e);
                }}
              />
            </View>
            <View style={styles.spacer} />
            <View style={styles.buttonContainer}>
              <Button onPress={addPressed} style={styles.button}>
                <Text>{'Add'}</Text>
              </Button>
            </View>
          </View>
        </View>
        <View style={styles.spacer} />
        <View style={styles.spacer} />
        <View style={styles.body}>
          {materials.length > 0 ? (
            <View style={styles.flex}>
              <View
                style={{
                  ...styles.row,
                  backgroundColor: Transparents.BlueColor2,
                }}
              >
                <CenteredText
                  containerStyle={{ ...styles.headerCell, width: width * 0.25 }}
                  type={TextType.BODY_TABLE}
                  style={styles.blackTxt}
                >
                  {'Category'}
                </CenteredText>
                <CenteredText
                  containerStyle={{ ...styles.headerCell, width: width * 0.35 }}
                  type={TextType.BODY_TABLE}
                  style={styles.blackTxt}
                >
                  {'Item'}
                </CenteredText>
                <CenteredText
                  containerStyle={{ ...styles.headerCell, width: width * 0.15 }}
                  type={TextType.BODY_TABLE}
                  style={styles.blackTxt}
                >
                  {'Quantity'}
                </CenteredText>
                <CenteredText
                  containerStyle={{ ...styles.headerCell, width: width * 0.15 }}
                  type={TextType.BODY_TABLE}
                  style={styles.blackTxt}
                >
                  {'delete'}
                </CenteredText>
              </View>
              <FlatList
                data={materials}
                renderItem={renderItem}
                keyExtractor={(e) => e.id.toString()}
                // horizontal={false}
              />
            </View>
          ) : (
            <View style={{ alignSelf: 'center' }}>
              <Text>There is no materials to show.</Text>
            </View>
          )}
          <View style={styles.spacer} />
        </View>
        <View style={styles.spacer} />
        <View style={styles.spacer} />
        <View style={styles.spacer} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  body: {
    marginHorizontal: width * 0.05,
  },
  border: {
    borderWidth: 1,
    borderColor: PrimaryColors.Black,
    padding: unitH * 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  buttonContainer: {
    // width: width * 0.5,
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    width: width * 0.2,
    height: unitH * 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: PrimaryColors.Black,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
  },
  headerCell: {
    textAlign: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: PrimaryColors.Black,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderColor: PrimaryColors.Black,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    height: unitH * 20,
  },
  spacer2: {
    height: 10,
  },
});

export default AdditionalMaterialPage;
