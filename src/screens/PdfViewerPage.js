import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../components/Header';

const PdfViewer = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const filePath = route?.params?.filePath;
  const title = route?.params?.title;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={false}
        centerText={title}
        leftBtnPressed={() => navigation.goBack()}
      />
      {filePath ? (
        <WebView
          style={{ flex: 1 }}
          originWhitelist={['*']}
          source={filePath}
        />
      ) : (
        <Text>File not found</Text>
      )}
    </SafeAreaView>
  );
};

export default PdfViewer;
