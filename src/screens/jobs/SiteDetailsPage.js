import { useNavigation,useRoute } from "@react-navigation/native";
import React,{ useContext,useEffect,useRef,useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import EcomDropDown from "../../components/DropDown";
import Header from "../../components/Header";
import OptionalButton from "../../components/OptionButton";
import { TextInputWithTitle } from "../../components/TextInput";
import { AppContext } from "../../context/AppContext";
import { PrimaryColors } from "../../theme/colors";
import { TextType } from "../../theme/typography";
import { openDatabase } from "../../utils/database";
import EcomHelper from "../../utils/ecomHelper";

const ukPostCodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
const phoneNumberRegex =
  /^(?:(0\d{4})\s?\d{3}\s?\d{3}|(07\d{3})\s?\d{3}\s?\d{3}|(01\d{1,2})\s?\d{3}\s?\d{3,4}|(02\d{1,2})\s?\d{3}\s?\d{4})$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function SiteDetailsPage() {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const jobNumber = appContext.jobNumber;
  const jobType = appContext.jobType;
  const route = useRoute();
 const params = route?.params;
 const data =  appContext?.setJobdata(route?.params?.jobData) 
  const SiteDetails = appContext?.SiteDetails;
  const email1Ref = useRef(null);
  const email2Ref = useRef(null);
  const number1Ref = useRef(null);
  const number2Ref = useRef(null);
  const siteDetails = route?.params?.jobData?.siteDetails ? JSON.parse(route?.params?.jobData?.siteDetails) : ''

  const [companyName, setCompanyName] = useState(
    siteDetails?.companyName ?? ""
  );
  const [buildingName, setBuildingName] = useState(
    siteDetails?.buildingName ?? ""
  );

  useEffect(() => {
    // Assume route.params.jobType exists
    const routeJobType = route.params.jobType;
    if (routeJobType) {
      appContext.setJobTypes(routeJobType);
    }
  }, []);
  
  const [mprn, setMprn] = useState(route?.params?.jobData?.MPRN ?? "");
  const [address1, setAddress1] = useState( siteDetails?.address1 ?? "");
  const [address2, setAddress2] = useState( siteDetails?.address2 ?? "");
  const [address3, setAddress3] = useState( siteDetails?.address3?? "");
  const [town, setTown] = useState( siteDetails?.town ?? "");
  const [county, setCounty] = useState( siteDetails?.county ?? "");
  const [postCode, setPostCode] = useState( siteDetails?.postCode ?? "");
  const [title, setTitle] = useState( siteDetails?.title ?? "");
  const [contact, setContact] = useState( siteDetails?.contact ?? "");
  const [email1, setEmail1] = useState( siteDetails?.email1 ?? "");
  const [email2, setEmail2] = useState( siteDetails?.email2 ?? "");
  const [number1, setNumber1] = useState(siteDetails?.number1 ?? "");
  const [number2, setNumber2] = useState( siteDetails?.number2 ?? "");
  const [instructions, setInstructions] = useState(
    siteDetails?.instructions ?? ""
  );
  const [confirmContact, setConfirmContact] = useState(
    siteDetails?.confirmContact
  );

  let update = false

  async function UpdateData() {
    const db = await openDatabase(); 
    const status = 'Completed'; // New name you want to set
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Jobs SET MPRN = ?, siteDetails = ? WHERE id = ?',
        [mprn,jsonString,appContext?.jobData?.id],
        () => {

          navigation.navigate('InProgressJobsPage', {
            update: update
          })

          console.log('Record updated successfully');
          // fetchRecords(); // Fetch records again to update the state
        },
        error => {
          console.error('Error updating record', error);
        }
      );
    });
  }
  const jsonString = JSON.stringify({
    companyName,
    buildingName,
    address1,
    address2,
    address3,
    town,
    county,
    postCode,
    title,
    contact,
    email1,
    email2,
    number1,
    number2,
    instructions,
    confirmContact,
  });

 const saveSiteDetailsToDatabase = async () => {
  const db = await openDatabase();



  // Assuming SiteDetails.id is the correct identifier for your record
  const jobId = 23;
  const jobType = 'Engineer';
  const jobStatus = 'InProgress'
  const progress = '';
  const startDate = 23;
  const endDate = 23;
  const photos = '';  // Ensure this is the correct way to access the job's ID
 
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO Jobs (jobId,jobType,MPRN,startDate,endDate,jobStatus,progress,siteDetails,photos) VALUES (?,?,?,?,?,?,?,?,?);`,
      [jobId,jobType,mprn,startDate,endDate,jobStatus,progress,jsonString, photos],
      (_, result) =>{
        navigation.goBack()
        console.log('Site details and progress updated in database', result)}  ,
      (_, error) => console.log('Error updating site details in database', error)
    );
  });



};
  const backPressed =async () => {
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

    if (appContext?.jobData?.id){
      await UpdateData()
    }

    else {
      saveSiteDetailsToDatabase();
      // navigation.goBack()
    }
  
    // appContext.setStartRemoval(true);
  
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
 
    saveSiteDetailsToDatabase();
      navigation.navigate("SitePhotoPage");
  
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <Header
        
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={""}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
        hasMenuButton={false}
        totalPages={params.totalPages}
        currentPage={params.currentPage}
        onPageChange={(pageNum) => console.log("navigated to pageL:", pageNum)}
      />
      <KeyboardAvoidingView
        style={{flex:1}}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView style={{flex:1}} >
          <TextInputWithTitle
            title={"MPRN *"}
            value={mprn}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^0-9]/g, "");
              const limitedText = filteredText.slice(0, 15);
              setMprn(limitedText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
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
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Building name/ number *"}
            value={buildingName}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s-]/g, "");
              setBuildingName(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />

          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Address 1 *"}
            value={address1}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, "");
              setAddress1(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Address 2"}
            value={address2}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, "");
              setAddress2(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Address 3"}
            value={address3}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, "");
              setAddress3(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Town/city *"}
            value={town}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z]/g, "");
              setTown(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"County *"}
            value={county}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z ]/g, "");
              setCounty(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
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
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />

          <View
            style={{
             
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 20,
            }}
          >
            <View style={{flex:0.5}}>
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
          
            
            <View style={{flex:0.5}}>
            <TextInputWithTitle
            style={{width:"100%"}}
              title={"Site Contact"}
              value={contact}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^a-zA-Z ]/g, "");
                setContact(filteredText);
              }}

              
            />
            </View>
              
             </View>

  <View style={{marginHorizontal:'5%'}}>
  <Text type={TextType.CAPTION_2}>{"Contact Numbers"}</Text>
  <View
            style={{
             
              flexDirection: "row",
             
            }}
          >
            <View style={{flex:0.5}}>
  <TextInputWithTitle
    style={{width:"100%"}}
    title={"Phone Number 1"}
    value={number1}
    keyboardType="numeric" // Set keyboardType to numeric
    onChangeText={(txt) => {
      const filteredText = txt.replace(/[^0-9]/g, ""); // Allow only numbers
      setNumber1(filteredText);
    }}
  />
</View>
<View style={{flex:0.5}}>
  <TextInputWithTitle
    style={{width:"100%"}}
    title={"Phone Number 2"}
    value={number2}
    keyboardType="numeric" // Set keyboardType to numeric
    onChangeText={(txt) => {
      const filteredText = txt.replace(/[^0-9]/g, ""); // Allow only numbers
      setNumber2(filteredText);
    }}
  />
</View>
              
             </View>
             <View
            style={{
             
              flexDirection: "row",
             
            }}
          >
            <View style={{flex:0.5}}>
            <TextInputWithTitle
            style={{width:"100%"}}
              title={"Email Number 1"}
              value={email1}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^a-zA-Z]/g, "");
                setEmail1(txt);
              }}
            />
            </View>
            <View style={{flex:0.5}}>
            <TextInputWithTitle
            style={{width:"100%"}}
            title={"Email Number 2"}
              value={email2}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^a-zA-Z]/g, "");
                setEmail2(txt);
              }}
            />
            </View>
              
             </View>
 
  </View>

  

          <View style={{marginHorizontal:'5%'}} />
          <TextInputWithTitle
            title={"Contact Instructions"}
            value={instructions}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s@.]/g, "");
              setInstructions(filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />
     
          <View style={{marginHorizontal:'5%', marginBottom:'10%'}}>
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
