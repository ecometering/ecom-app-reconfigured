import {
  validateRequiredField,
  validateOptionalField,
} from '../../utils/validation/validators';

export const validateKioskDetails = (kioskDetails) => {
  const validations = [
    () =>
      validateRequiredField(
        'Kiosk Type',
        kioskDetails.type,
        'Kiosk Type is required. Please enter the Kiosk Type.'
      ),
    () =>
      validateRequiredField(
        'Kiosk Condition',
        kioskDetails.condition,
        'Kiosk Condition is required. Please enter the Kiosk Condition.'
      ),
    () =>
      validateOptionalField(
        'Is Weather Resistant',
        kioskDetails.isWeatherResistant,
        'Is kiosk weather resistant? Please select an option.'
      ),
    () =>
      validateOptionalField(
        'Is Lockable',
        kioskDetails.isLockable,
        'Is kiosk lockable? Please select an option.'
      ),
    () =>
      validateOptionalField(
        'Is Free of Vegetation',
        kioskDetails.isVegitationFree,
        'Is kiosk free of vegetation, trees, etc.? Please select an option.'
      ),
    () =>
      validateOptionalField(
        'Is Stable',
        kioskDetails.isStable,
        'Is kiosk/housing stable? Please select an option.'
      ),
    () =>
      validateOptionalField(
        'Is Free of Flooding',
        kioskDetails.isFloodingFree,
        'Is kiosk free of flooding? Please select an option.'
      ),
    () =>
      validateOptionalField(
        'Is Explosion Relief Roof',
        kioskDetails.isExplosionReliefRoof,
        'Is kiosk roof an explosion relief roof? Please select an option.'
      ),
    () =>
      validateRequiredField(
        'Kiosk Height',
        kioskDetails.height,
        'Kiosk height is required. Please enter the kiosk height.'
      ),
    () =>
      validateRequiredField(
        'Kiosk Width',
        kioskDetails.width,
        'Kiosk width is required. Please enter the kiosk width.'
      ),
    () =>
      validateRequiredField(
        'Kiosk Length',
        kioskDetails.length,
        'Kiosk length is required. Please enter the kiosk length.'
      ),
    () =>
      validateOptionalField(
        'Is Accessible',
        kioskDetails.isAccessible,
        'Is kiosk easily accessible? Please select an option.'
      ),
    () =>
      validateOptionalField(
        'Has Steps',
        kioskDetails.isSteps,
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
