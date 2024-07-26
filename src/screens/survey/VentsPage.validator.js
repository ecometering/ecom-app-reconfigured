import {
  validateRequiredField,
  validateOptionalField,
} from '../../utils/validation/validators';

export const validateVentsDetails = (ventsDetails) => {
  const validations = [
    () =>
      validateRequiredField(
        'Kiosk Type',
        ventsDetails.type,
        'Kiosk Type is required. Please enter the Kiosk Type.'
      ),
    () =>
      validateRequiredField(
        'Kiosk Condition',
        ventsDetails.condition,
        'Kiosk Condition is required. Please enter the Kiosk Condition.'
      ),
    () =>
      validateOptionalField(
        'Is Weather Resistant',
        ventsDetails.isWeatherResistant,
        'Is kiosk weather resistant? Please select an option.'
      ),
    () =>
      validateOptionalField(
        'Is Lockable',
        ventsDetails.isLockable,
        'Is kiosk lockable? Please select an option.'
      ),
    () =>
      validateOptionalField(
        'Is Free of Vegetation',
        ventsDetails.isVegitationFree,
        'Is kiosk free of vegetation, trees, etc.? Please select an option.'
      ),
    () =>
      validateOptionalField(
        'Is Stable',
        ventsDetails.isStable,
        'Is kiosk/housing stable? Please select an option.'
      ),
    () =>
      validateOptionalField(
        'Is Free of Flooding',
        ventsDetails.isFloodingFree,
        'Is kiosk free of flooding? Please select an option.'
      ),
    () =>
      validateOptionalField(
        'Is Explosion Relief Roof',
        ventsDetails.isExplosionReliefRoof,
        'Is kiosk roof an explosion relief roof? Please select an option.'
      ),
    () =>
      validateRequiredField(
        'Kiosk Height',
        ventsDetails.height,
        'Kiosk height is required. Please enter the kiosk height.'
      ),
    () =>
      validateRequiredField(
        'Kiosk Width',
        ventsDetails.width,
        'Kiosk width is required. Please enter the kiosk width.'
      ),
    () =>
      validateRequiredField(
        'Kiosk Length',
        ventsDetails.length,
        'Kiosk length is required. Please enter the kiosk length.'
      ),
    () =>
      validateOptionalField(
        'Is Accessible',
        ventsDetails.isAccessible,
        'Is kiosk easily accessible? Please select an option.'
      ),
    () =>
      validateOptionalField(
        'Has Steps',
        ventsDetails.isSteps,
        'Are there steps leading up to the kiosk? Please select an option.'
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
