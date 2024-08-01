import {
  validateRequiredField,
  validateBooleanField,
} from '../../utils/validation/validators';

export const validateStandardDetails = (
  standards,
  meterDetails,
  jobType
) => {
  const validations = [
    () =>
      validateBooleanField(
        'Network service/ECV conform to standards',
        standards?.conformStandard,
        'Please answer if the network service/ECV conform to standards'
      ),
    () =>
      validateRequiredField(
        'Inlet Pressure',
        standards?.pressure,
        'Please set inlet pressure'
      ),
    () =>
      validateRequiredField(
        'Signature',
        standards?.signature,
        'Please enter signature'
      ),
    () =>
      validateBooleanField(
        'RIDDOR reportable',
        standards?.riddorReportable,
        'Please answer if RIDDOR reportable'
      ),
      ...(jobType !== 'Survey'?
        [
          () =>
            validateBooleanField(
              'additional Materials',
              standards?.additionalMaterials,
              'Please answer if any additional materials used'
            ),
          ...(jobType === 'Install' || jobType === 'Exchange'?[
          () =>
            validateBooleanField(
              'Chatterbox installed',
              standards?.chatterbox,
              'Please answer if any chatterbox installed'
            ),]:[])
        ]:[
        ]
      ),
    ...(meterDetails?.isMeter &&
    (jobType === 'Install' || jobType === 'Exchange')
      ? [
          () =>
            validateBooleanField(
              'Tightness test passed',
              standards?.testPassed,
              'Please answer if tightness test passed'
            ),
          () =>
            validateBooleanField(
              'Outlet kit is used',
              standards?.useOutlet,
              'Please answer if Outlet kit is used'
            ),
        ]
      : []),
  ];

  for (const validate of validations) {
    const error = validate();
    if (error) {
      return { isValid: false, message: error };
    }
  }

  return { isValid: true, message: '' };
};
