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
import { openDatabase,printRowById } from "../../utils/database";
import EcomHelper from "../../utils/ecomHelper";
import moment from "moment"; 
const ukPostCodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
const phoneNumberRegex =
  /^(?:(0\d{4})\s?\d{3}\s?\d{3}|(07\d{3})\s?\d{3}\s?\d{3}|(01\d{1,2})\s?\d{3}\s?\d{3,4}|(02\d{1,2})\s?\d{3}\s?\d{4})$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function SiteDetailsPage() {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const {jobType,siteDetails,setSiteDetails} = appContext
  const route = useRoute();
 const params = route.params;
  appContext?.setJobdata(route?.params?.jobData) 
  

  useEffect(() => {
    // Assume route.params.jobType exists
    const routeJobType = route.params.jobType;
    if (routeJobType) {
      appContext.setJobTypes(routeJobType);
      console.log("SiteDetailsPage");
  console.log("jobType", jobType);
    }
  }, []);
const [jobDetails , setJobDetails] = useState({
  jobType:"", 
  status: "", 
  progress: "",
  totalPages: "",
  jobID : "", 

});
  

  const handleInputChange = (name, value) => {
    setSiteDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const handlejobDetails = (name, value) => {
    setJobDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };
 const saveSiteDetailsToDatabase = async () => {
  console.log("creating job")
  const db = await openDatabase();
  console.log('Db status:', db)
  const siteDetailsJSON = JSON.stringify(siteDetails);

  // Assuming SiteDetails.id is the correct identifier for your record

  const getCurrentDateTime = () => {
    return moment().format('YYYY-MM-DD HH:mm');
  };
  const mprn = siteDetails.mprn;
  const postcode = siteDetails.postCode; 
  const jobStatus = 'In Progress'
  handlejobDetails('status',jobStatus);
  handlejobDetails('progress','1');
  handlejobDetails('totalPages','5');
  const progress = '1';
  const startDate = getCurrentDateTime();
  // Ensure this is the correct way to access the job's ID
 

  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO Jobs (jobType,MPRN,postcode,startDate,jobStatus,progress,siteDetails) VALUES (?,?,?,?,?,?,?);`,
      [jobType,mprn,startDate,postcode,jobStatus,progress,siteDetailsJSON ],
      (_, result) => {
        console.log('Site details and progress updated in database. Generated ID:', result.insertId);
        // Pass the result.insertId as JobId parameter to the next navigation call
        handlejobDetails('JobID',result.insertId);

      },
      (_, error) => console.log('Error updating site details in database:', error)
    );
  });
};
  const backPressed = () => {
    appContext.setSiteDetails(siteDetails);
    

    navigation.goBack();
  };

  const nextPressed = () => {
    if (siteDetails.buildingName === "") {
      EcomHelper.showInfoMessage("Please input Building Name");
      return;
    }
    if (siteDetails.address1 === "") {
      EcomHelper.showInfoMessage("Please input Address1");
      return;
    }
    if (siteDetails.town === "") {
      EcomHelper.showInfoMessage("Please input Town/City");
      return;
    }
    if (siteDetails.county === "") {
      EcomHelper.showInfoMessage("Please input County");
      return;
    }
    if (siteDetails.postCode === "") {
      EcomHelper.showInfoMessage("Please input Post Code");
      return;
    }
    if (!ukPostCodeRegex.test(siteDetails.postCode)) {
      EcomHelper.showInfoMessage("Not a valid uk post code");
      return;
    }
    if (siteDetails.number1 && !phoneNumberRegex.test(siteDetails.number1)) {
      EcomHelper.showInfoMessage("Not a valid phone number: phone number1");
      return;
    }
  
    // Validate phone number2 if it is not empty
    if (siteDetails.number2 && !phoneNumberRegex.test(siteDetails.number2)) {
      EcomHelper.showInfoMessage("Not a valid phone number: phone number2");
      return;
    }
  
    // Validate email1 if it is not empty
    if (siteDetails.email1 && !emailRegex.test(siteDetails.email1)) {
      EcomHelper.showInfoMessage("Not a valid email: email1");
      return;
    }
  
    // Validate email2 if it is not empty
    if (siteDetails.email2 && !emailRegex.test(siteDetails.email2)) {
      EcomHelper.showInfoMessage("Not a valid email: email2");
      return;
    }
    if (siteDetails.confirmContact == null) {
      EcomHelper.showInfoMessage("Please make sure if all contact is correct");
      return;
    }
    if (!siteDetails.mprn) {
      EcomHelper.showInfoMessage("Please input MPRN");
      return;
    }
    if (siteDetails.mprn?.length < 5) {
      EcomHelper.showInfoMessage("MPRN should be 5 ~ 15 digits");
      return;
    }

    appContext.setSiteDetails(siteDetails);
 
    saveSiteDetailsToDatabase();
    console.log("jobDetails",jobDetails);
    console.log("siteDetails",siteDetails);
    navigation.navigate("SitePhotoPage")
  
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
        onPageChange={(pageNum) => console.log("navigated to page:", pageNum)}
      />
      <KeyboardAvoidingView
        style={{flex:1}}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView style={{flex:1}} >
          <TextInputWithTitle
            title={"MPRN *"}
            value={siteDetails.mprn}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^0-9]/g, "");
              const limitedText = filteredText.slice(0, 15);
              handleInputChange('mprn', limitedText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
            keyboardType="numeric"
          />

          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Company name"}
            value={siteDetails.companyName}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s\-\(\)]/g, "");
              handleInputChange('companyName', filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Building name/ number *"}
            value={siteDetails.buildingName}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s\-\(\)]/g, "");
              handleInputChange('buildingName', filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />

          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Address 1 *"}
            value={siteDetails.address1}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, "");
              handleInputChange('address1', filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Address 2"}
            value={siteDetails.address2}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, "");
              handleInputChange('address2', filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Address 3"}
            value={siteDetails.address3}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, "");
              handleInputChange('address3', filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Town/city *"}
            value={siteDetails.town}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z]/g, "");
              handleInputChange('town', filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"County *"}
            value={siteDetails.county}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z ]/g, "");
              handleInputChange('county', filteredText);
            }}
            containerStyle={[styles.inputContainer,{width: "90%" }]}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Post Code *"}
            value={siteDetails.postCode}
            onChangeText={(txt) => {
              if (txt.length <= 9 ) {
                const filteredText = txt.replace(/[^a-zA-Z0-9\s]/g, "");
                handleInputChange('postCode', filteredText.toUpperCase() );
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
                value={siteDetails.title}
                 valueList={[
                  { _index: 1, label: "Mr", value: "Mr" },
                  { _index: 2, label: "Mrs", value: "Mrs" },
                  { _index: 3, label: "Ms", value: "Ms" },
                  { _index: 4, label: "Dr", value: "Dr" },
                ]}
                placeholder={" Title"}
                onChange={(e) => {
                  handleInputChange('title', e);
                }}
              />
            </View>
          
            
            <View style={{flex:0.5}}>
            <TextInputWithTitle
            style={{width:"100%"}}
              title={"Site Contact"}
              value={siteDetails.contact}
              onChangeText={(txt) => {
                const filteredText = txt.replace(/[^a-zA-Z ]/g, "");
                handleInputChange('contact', filteredText);
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
    value={siteDetails.number1}
    keyboardType="numeric" // Set keyboardType to numeric
    onChangeText={(txt) => {
      const filteredText = txt.replace(/[^0-9]/g, ""); // Allow only numbers
      handleInputChange('number1', filteredText);
    }}
  />
</View>
<View style={{flex:0.5}}>
  <TextInputWithTitle
    style={{width:"100%"}}
    title={"Phone Number 2"}
    value={siteDetails.number2}
    keyboardType="numeric" // Set keyboardType to numeric
    onChangeText={(txt) => {
      const filteredText = txt.replace(/[^0-9]/g, ""); // Allow only numbers
      handleInputChange('number2', filteredText);
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
              value={siteDetails.email1}
              autoCapitalize="none"
              onChangeText={(txt) => {
                handleInputChange('email1', txt.toLowerCase());
              }}
            />
            </View>
            <View style={{flex:0.5}}>
            <TextInputWithTitle
            style={{width:"100%"}}
            title={"Email Number 2"}
            autoCapitalize="none"
              value={siteDetails.email2}
              onChangeText={(txt) => {
                handleInputChange('email2', txt.toLowerCase());
              }}
            />
            </View>
              
             </View>
 
  </View>

  

          <View style={{marginHorizontal:'5%'}} />
          <TextInputWithTitle
            title={"Contact Instructions"}
            value={siteDetails.instructions}
            onChangeText={(txt) => {
              const filteredText = txt.replace(/[^a-zA-Z0-9\s@.]/g, "");
              handleInputChange('instructions', filteredText);
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
    () => handleInputChange('confirmContact', true),
    () => handleInputChange('confirmContact', false),
  ]}
  value={siteDetails.confirmContact === null ? null : siteDetails.confirmContact ? "Yes" : "No"}/>
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