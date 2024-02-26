import { useState,useEffect } from 'react';
import {Dimensions, Platform} from 'react-native';


export const useScreenDimensions = () => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    // Dimensions.addEventListener('change', onChange);
    // return () => Dimensions.removeEventListener('change', onChange);
  }, []);

  return {
    width: screenData?.width || Dimensions.get('window').width,
    height: screenData?.height || Dimensions.get('window').height
    
  };
};

export const height = Dimensions.get('window').height;
export const width = Dimensions.get('window').width;




export const NUMBER_OF_DIALS = [
  {label: '4', value: 4},
  {label: '5', value: 5},
  {label: '6', value: 6},
  {label: '7', value: 7},
  {label: '8', value: 8},
  {label: '9', value: 9},
  {label: '10', value: 10},
  {label: '11', value: 11},
  {label: '12', value: 12},
  {label: '13', value: 13},
];

export const PULSE_VALUE = [
  {label: '0.01', value: 0.01},
  {label: '0.1', value: 0.1},
  {label: '1', value: 1},
  {label: '10', value: 10},
  {label: '100', value: 100},
  {label: '1000', value: 1000},
];

export const PAYMENT_TYPE_CHOICES = [
  {label: 'Credit', value: 1},
  {label: 'Pre-payment', value: 2},
];

export const MECHANISM_TYPE_CHOICES = [
  {label: 'Credit', value: 1},
  {label: 'Coin meter', value: 2},
  {label: 'Electronic token', value: 3},
  {label: 'Mechanical token', value: 4},
  {label: 'NS-NON COMPLIANT SMETS', value: 5},
  {label: 'Prepayment', value: 6},
  {label: 'S1-SMETS 1 COMPLIANT SMART METER', value: 7},
  {label: 'S1-SMETS 2 COMPLIANT SMART METER', value: 8},
  {label: 'Thift', value: 9},
  {label: 'Unknown', value: 10},
];

export const METER_TYPE_CHOICES = [
  {label: 'D-DIAPHRAGM OF UNKOWN MATERIAL', value: 1},
  {label: 'L-LEATHER DIAPHRAGM', value: 2},
  {label: 'R-ROTARY', value: 3},
  {label: 'S-SYNTHETIC DIAPHRAGM', value: 4},
  {label: 'T-TURBINE', value: 5},
  {label: 'U-ULTRASONIC', value: 6},
  {label: 'Unknown', value: 7},
];

export const METER_PRESSURE_TIER_CHOICES = [
  {label: 'LP', data: 'LP', value: 3},
  {label: 'MP', data: 'MP', value: 2},
  {label: 'HP', data: 'HP', value: 4},
  {label: 'IP', data: 'IP', value: 1},
];

export const UNIT_OF_MEASURE_CHOICES = [
  {label: 'Standard Cubic Feet per hour', value: 1},
  {label: 'Standard Cubic Meters per hour', value: 2},
];

export const METER_POINT_STATUS_CHOICES = [
  {data: 'CA', label: 'Capped', value: 1},
  {data: 'DE', label: 'Dead', value: 2},
  {data: 'LI', label: 'Live', value: 3},
  {data: 'OT', label: 'Other', value: 4},
  {data: 'PL', label: 'Planned', value: 5},
  {data: 'SP', label: 'Spin Capped', value: 6},
  {data: 'AC', label: 'AC-ACTIVE', value: 7},
  {data: 'CD', label: 'CD-CLOSED', value: 8},
  {data: 'CL', label: 'CL-CLAMPED', value: 9},
  {data: 'IN', label: 'IN-INACTIVE', value: 10},
  {data: 'OP', label: 'OP-OPEN', value: 11},
  {data: 'PD', label: 'PD-PHONE LINE DOWN', value: 12},
  {data: 'RE', label: 'RE-REMOVED', value: 13},
  {data: 'UN', label: 'UN-UNKNOWN', value: 14},
  {data: 'I', label: 'I-INSTALLED IHD ASSET', value: 15},
  {data: 'E', label: 'E-EXISTING IHD ASSET', value: 16},
  {data: 'D', label: 'D-IHD ASSET DECLINED BY CONSUMER', value: 17},
];

export const METER_POINT_LOCATION_CHOICES = [
  {value: 0, label: 'Unknown'},
  {value: 1, label: 'Cellar'},
  {value: 2, label: 'Under stairs'},
  {value: 3, label: 'Hall'},
  {value: 4, label: 'Kitchen'},
  {value: 5, label: 'Bathroom'},
  {value: 6, label: 'Garage'},
  {value: 7, label: 'Canteen'},
  {value: 8, label: 'Cloakroom'},
  {value: 9, label: 'Cupboard'},
  {value: 10, label: 'Domestic Science'},
  {value: 11, label: 'Front Door'},
  {value: 12, label: 'Hall Cupboard'},
  {value: 13, label: 'Kitchen Cupboard'},
  {value: 14, label: 'Kitchen under sink'},
  {value: 15, label: 'Landing'},
  {value: 16, label: 'Office'},
  {value: 17, label: 'Office Cupboard'},
  {value: 18, label: 'Outside WC'},
  {value: 19, label: 'Pantry'},
  {value: 20, label: 'Porch'},
  {value: 21, label: 'Public Bar'},
  {value: 22, label: 'Rear of Shop'},
  {value: 23, label: 'Saloon Bar'},
  {value: 24, label: 'Shed'},
  {value: 25, label: 'Shop Front'},
  {value: 26, label: 'Shop Window'},
  {value: 27, label: 'Staff Room'},
  {value: 28, label: 'Store Room'},
  {value: 29, label: 'Toilet'},
  {value: 30, label: 'Under Counter'},
  {value: 31, label: 'Waiting Room'},
  {value: 32, label: 'Meter box Outside'},
  {value: 98, label: 'Other'},
  {value: 99, label: 'Outside'},
];

export const GasSupplier = [
  {label: '(The) Nuclear Decommissioning Authority (MXE)', value: 1},
  {label: 'AXPO UK Ltd (EUK)', value: 2},
  {label: 'Addito Supply Ltd (OBR)', value: 3},
  {label: 'Affect Energy Ltd (AFG)', value: 4},
];

export const MAM = [
  {label: '(The) Nuclear Decommissioning Authority (MXE)', value: 1},
  {label: 'AES Smart Metering Ltd (ASM)', value: 2},
  {label: 'AOT Energy Switzerland AG (AOT)', value: 3},
  {label: 'ATEL Aare Tessin Fur Elektritat (ATA)', value: 4},
  {label: 'AXPO UK Ltd (EUK)', value: 5},
];

export const ReasonCode = [
  {label: 'CA', value: 1},
  {label: 'Change of Supplier', value: 2},
  {label: 'Emergency', value: 3},
  {label: 'New Connection', value: 4},
];

export const MPRN_STATUS = [
  {label: 'Agent aborts', value: 1},
  {label: 'Completed', value: 2},
  {label: 'Partially Completed', value: 3},
  {label: 'Pending', value: 4},
  {label: 'Requestor Cancels', value: 5},
];

/**
 * This UI Design is based on 1366 x 1024 Screen(iPad Pro 12.9).
 */
// export const unitW = Dimensions.get("window").width / 1366;
// export const unitH = Dimensions.get("window").height / 1024;
export const unitW = 1;
export const unitH = 1;

/**
 * IsAndroid
 */
export const isIos = Platform.OS === 'ios';

/**
 * Default Settings
 */
const Constants = {
  BASE_URL: 'https://www.ecometering.co.uk/app/',
  TEMP_URL: 'https://test.ecomdata.co.uk/',
  STORAGEDIRECTORY: 'ECOM',
};

export default Constants;
