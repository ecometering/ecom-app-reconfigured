import React, { useContext, useState,useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { unitH, useScreenDimensions } from "../../utils/constant";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import TextInput, { TextInputWithTitle,InputRowWithTitle } from "../../components/TextInput";
import {TextType } from "../../theme/typography";
import { PrimaryColors } from "../../theme/colors";
import OptionalButton from "../../components/OptionButton";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";
import EcomDropDown from "../../components/DropDown";

const ukPostCodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
const phoneNumberRegex =
  /^(?:(0\d{4})\s?\d{3}\s?\d{3}|(07\d{3})\s?\d{3}\s?\d{3}|(01\d{1,2})\s?\d{3}\s?\d{3,4}|(02\d{1,2})\s?\d{3}\s?\d{4})$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function SiteDetailsPage() {
  const { width, height } = useScreenDimensions(); // Use the custom hook for responsive dimensions
  const navigation = useNavigation();
  const appContext = useContext(AppContext);

  const jobType = appContext.jobType;
  const SiteDetails = appContext.SiteDetails;
  const email1Ref = useRef(null);
  const email2Ref = useRef(null);
  const number1Ref = useRef(null);
  const number2Ref = useRef(null);
  console.log("SiteDetailsPage");
  const [companyName, setCompanyName] = useState(
    SiteDetails?.companyName ?? ""
  );
  const [buildingName, setBuildingName] = useState(
    SiteDetails?.buildingName ?? ""
  );

  const [mprn, setMprn] = useState(SiteDetails?.mprn ?? "");
  const [address1, setAddress1] = useState(SiteDetails?.address1 ?? "");
  const [address2, setAddress2] = useState(SiteDetails?.address2 ?? "");
  const [address3, setAddress3] = useState(SiteDetails?.address3 ?? "");
  const [town, setTown] = useState(SiteDetails?.town ?? "");
  const [county, setCounty] = useState(SiteDetails?.county ?? "");
  const [postCode, setPostCode] = useState(SiteDetails?.postCode ?? "");
  const [title, setTitle] = useState(SiteDetails?.title ?? "");
  const [contact, setContact] = useState(SiteDetails?.contact ?? "");
  const [email1, setEmail1] = useState(SiteDetails?.email1 ?? "");
  const [email2, setEmail2] = useState(SiteDetails?.email2 ?? "");
  const [number1, setNumber1] = useState(SiteDetails?.number1 ?? "");
  const [number2, setNumber2] = useState(SiteDetails?.number2 ?? "");
  const [instructions, setInstructions] = useState(
    SiteDetails?.instructions ?? ""
  );
  const [confirmContact, setConfirmContact] = useState(
    SiteDetails?.confirmContact
  );

  const backPressed = () => {
    appContext.setSiteDetails({
      ...SiteDetails,
      mprn: mprn,
      companyName: companyName,
      buildingName: buildingName,
      address1: address1,
      address2: address2,
      address3: address3,
      town: town,
      county: county,
      postCode: postCode,
      title: title,
      contact: contact,
      email1: email1,
      email2: email2,
      number1: number1,
      number2: number2,
      instructions: instructions,
      confirmContact: confirmContact,
    });
    // appContext.setStartRemoval(true);
    navigation.goBack();
  };

  const nextPressed = () => {
    if (buildingName === "") {
      EcomHelper.showInfoMessage("Please input Building Name");
      return;
    }
    if (address1 === "") {
      EcomHelper.showInfoMessage("Please input Address1");
      return;
    }
    if (town === "") {
      EcomHelper.showInfoMessage("Please input Town/City");
      return;
    }
    if (county === "") {
      EcomHelper.showInfoMessage("Please input County");
      return;
    }
    if (postCode === "") {
      EcomHelper.showInfoMessage("Please input Post Code");
      return;
    }
    if (!ukPostCodeRegex.test(postCode)) {
      EcomHelper.showInfoMessage("Not a valid uk post code");
      return;
    }
    if (number1 && !phoneNumberRegex.test(number1)) {
      EcomHelper.showInfoMessage("Not a valid phone number: phone number1");
      return;
    }
  
    // Validate phone number2 if it is not empty
    if (number2 && !phoneNumberRegex.test(number2)) {
      EcomHelper.showInfoMessage("Not a valid phone number: phone number2");
      return;
    }
  
    // Validate email1 if it is not empty
    if (email1 && !emailRegex.test(email1)) {
      EcomHelper.showInfoMessage("Not a valid email: email1");
      return;
    }
  
    // Validate email2 if it is not empty
    if (email2 && !emailRegex.test(email2)) {
      EcomHelper.showInfoMessage("Not a valid email: email2");
      return;
    }
    if (confirmContact == null) {
      EcomHelper.showInfoMessage("Please make sure if all contact is correct");
      return;
    }
    if (!mprn) {
      EcomHelper.showInfoMessage("Please input MPRN");
      return;
    }
    if (mprn?.length < 5) {
      EcomHelper.showInfoMessage("MPRN should be 5 ~ 15 digits");
      return;
    }

    appContext.setSiteDetails({
      ...SiteDetails,
      mprn: mprn,
      companyName: companyName,
      buildingName: buildingName,
      address1: address1,
      address2: address2,
      address3: address3,
      town: town,
      county: county,
      postCode: postCode,
      title: title,
      contact: contact,
      number1: number1,
      number2: number2,
      email1: email1,
      email2: email2,
      instructions: instructions,
      confirmContact: confirmContact,
    });
 
    
      navigation.navigate("SitePhotoPage");
  
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={""}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView style={styles.flex}>
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"MPRN *"}
            value={mprn}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^0-9]/g, "");
              const limitedText = filteredText.slice(0, 15);
              setMprn(limitedText);
            }}
            containerStyle={[styles.inputContainer,{width: width * 0.8}]}
            keyboardType="numeric"
          />

          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Company name"}
            value={companyName}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, "");
              setCompanyName(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: width * 0.8}]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Building name/ number *"}
            value={buildingName}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, "");
              setBuildingName(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: width * 0.8}]}
          />

          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Address 1 *"}
            value={address1}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, "");
              setAddress1(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: width * 0.8}]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Address 2"}
            value={address2}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, "");
              setAddress2(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: width * 0.8}]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Address 3"}
            value={address3}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, "");
              setAddress3(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: width * 0.8}]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Town/city *"}
            value={town}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z]/g, "");
              setTown(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: width * 0.8}]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"County *"}
            value={county}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z ]/g, "");
              setCounty(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: width * 0.8}]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Post Code *"}
            value={postCode}
            onChangeText={(txt) => {
              if (txt.length <= 9 ) {
                const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, "");
                setPostCode(filteredText.toUpperCase());
              }
            }}
            containerStyle={[styles.inputContainer,{width: width * 0.8}]}
          />

          <View
            style={{
              alignItems: "flex-end",
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 40,
            }}
          >
            <View style={{ width: "45%" }}>
              <View style={styles.spacer2} />
              <EcomDropDown
                value={title}
                valueList={[
                  { _index: 1, label: "Mr", value: "Mr" },
                  { _index: 2, label: "Mrs", value: "Mrs" },
                  { _index: 3, label: "Ms", value: "Ms" },
                  { _index: 4, label: "Dr", value: "Dr" },
                ]}
                placeholder={" Title"}
                onChange={(e) => {
                  console.log(e);
                  setTitle(e);
                }}
              />
            </View>

            <View style={styles.spacer} />
            <TextInputWithTitle
              title={"Site Contact"}
              value={contact}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^a-zA-Z]/g, "");
                setContact(filteredText);
              }}
              containerStyle={{ width: "45%" }}
            />
          </View>

          <View style={styles.spacer} />
          <View style={styles.contactContainer}>
  <Text type={TextType.CAPTION_2}>{"Contact Numbers"}</Text>
  <View style={styles.spacer2} />
  <View style={styles.contactContent}>
    <InputRowWithTitle
      title1="Phone Number 1"
      placeholder1="Enter phone number"
      value1={number1}
      onChangeText1={(text) => setNumber1(text)}
      ref1={number1Ref}
      title2="Phone Number 2"
      placeholder2="Enter phone number"
      value2={number2}
      onChangeText2={(text) => setNumber2(text)}
      ref2={number2Ref}
    />
  </View>
  <View style={styles.contactContent}>
    <InputRowWithTitle
      title1="Email Address 1"
      placeholder1="Enter email address"
      value1={email1}
      onChangeText1={(text) => setEmail1(text)}
      ref1={email1Ref}
      title2="Email Address 2"
      placeholder2="Enter email address"
      value2={email2}
      onChangeText2={(text) => setEmail2(text)}
      ref2={email2Ref}
    />
  </View>
</View>

  

          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Contact Instructions"}
            value={instructions}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s@.]/g, "");
              setInstructions(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: width * 0.8}]}
          />
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <View style={styles.optionContainer}>
            <Text type={TextType.CAPTION_2}>
              {"Is all contact details correct? *"}
            </Text>
            <OptionalButton
              options={["Yes", "No"]}
              actions={[
                () => {
                  setConfirmContact(true);
                },
                () => {
                  setConfirmContact(false);
                },
              ]}
              value={
                confirmContact ? "Yes" : confirmContact === false ? "No" : null
              }
            />
          </View>
          <View style={styles.spacer} />
          <View style={styles.spacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PrimaryColors.White,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
  },
  inputContainer: {
    alignSelf: "center",
  },
  input: {
    width: "45%",
    alignSelf: "center",
  },
  contactContainer: {
    width: "80%",
    alignSelf: "center",
    alignItems: "flex-start",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%', // Full width for button container
    paddingHorizontal: 20, // Horizontal padding for screen edge spacing
  },
  actionButton: {
    backgroundColor: PrimaryColors.Blue,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100, // Minimum width for action buttons
  },
  buttonText: {
    color: PrimaryColors.White,
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  confirmText: {
    fontSize: 14,
    color: PrimaryColors.Black,
    paddingHorizontal: 10, // Padding around confirmation text
  },
  // Define additional styles as needed
})

export default SiteDetailsPage;
