import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

import data from '../../assets/pdf-guides/guides';

const HelpGuidesPage = () => {
  const navigation = useNavigation();

  const handleRowPress = (filePath, title) => {
    navigation.navigate('PdfViewerPage', { filePath, title });
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (item.subData) return;
          handleRowPress(item.filePath, item.title);
        }}
      >
        <View
          style={{
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: 'lightgray',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text>{item.title}</Text>
          {!!item.subData ? null : <Text>{'>'}</Text>}
        </View>
      </TouchableOpacity>

      {item.subData && (
        <FlatList
          data={item.subData}
          renderItem={({ item: subItem }) => (
            <TouchableOpacity
              onPress={() => {
                if (subItem.subData) return;
                handleRowPress(subItem.filePath, subItem.title);
              }}
            >
              <View
                style={{
                  padding: 20,
                  paddingLeft: 40,
                  borderBottomWidth: 1,
                  borderBottomWidth: 1,
                  borderBottomColor: !!subItem.subData
                    ? 'transparent'
                    : 'lightgray',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text>{subItem.title}</Text>
                <Text>{'>'}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(subItem) => subItem.title}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={false}
        centerText={'Help Guides'}
        leftBtnPressed={() => navigation.goBack()}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
      />
    </SafeAreaView>
  );
};

export default HelpGuidesPage;
