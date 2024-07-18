import {
  validateLength,
  validateBooleanField,
  validateRequiredField,
} from '../../utils/validation/validators';

export const validateMeterDetails = (meterDetails) => {
  console.log('meterDetails', meterDetails);
  const validations = [
    () =>
      validateRequiredField(
        'Meter Location',
        meterDetails?.location,
        "Please Choose 'Meter Location'"
      ),
    () =>
      validateRequiredField(
        'Meter Model',
        meterDetails?.model,
        "Please Choose 'Meter Model'"
      ),
    () =>
      validateRequiredField(
        'Meter Manufacturer',
        meterDetails?.manufacturer,
        "Please Choose 'Meter Manufacturer'"
      ),
    () =>
      validateRequiredField('UOM', meterDetails?.uom, "Please Choose 'UOM'"),
    () =>
      validateRequiredField(
        'Meter Type',
        meterDetails?.meterType,
        "Please Choose 'Meter Type'"
      ),
    () =>
      validateBooleanField(
        'Meter Pulse Value',
        meterDetails?.havePulseValue,
        "Please Choose 'Meter Pulse Value'"
      ),
    () =>
      validateRequiredField(
        'Meter Mechanism',
        meterDetails?.mechanism,
        "Please Choose 'Meter Mechanism'"
      ),
    () =>
      validateRequiredField(
        'Metering Pressure Tier',
        meterDetails?.pressureTier,
        "Please Choose 'Metering Pressure Tier'"
      ),
    () =>
      validateRequiredField(
        'Pressure',
        meterDetails?.pressure,
        "Please Input 'Pressure'"
      ),
    () =>
      validateLength(
        'Serial Number',
        meterDetails?.serialNumber,
        1,
        100,
        'Invalid Serial Number'
      ),
    () =>
      validateRequiredField(
        'Serial Number',
        meterDetails?.serialNumber,
        "Please Input 'Serial Number'"
      ),
    () =>
      validateRequiredField(
        'Reading',
        meterDetails?.reading,
        "Please Input 'Reading'"
      ),
  ];

  for (const validate of validations) {
    const error = validate();
    if (error) {
      return { isValid: false, message: error };
    }
  }

  return { isValid: true, message: '' };
};
