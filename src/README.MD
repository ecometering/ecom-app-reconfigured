# Ecometer App Guide

## Navigation context for the Jobs

there is a navigation-router folder located in `src/utils/nagivation-routes` where each flow has been predetermined, if app needs a new job type and new flow please add a new file in this folder

- name the initial flow and its an array of route sequences. eg:

  ```
  export const ExchangeNavigation = [
  {
    screen: 'SiteDetailsPage',
    params: {
      totalPages: 9,
      currentPage: 1,
    },
  },
  ...
  ];
  ```

- each route element has 3 properties, `screen` name of the screen, `params` initial page params and `diversions` function where there are multiple navigation option available for the current navigation element

- **_ IMPORTANT _** in case of diversion the initial route array ends with it. return new flow after the diversion to continue. Imageine navigation as building blocks and diversion determines which set comes after. You can stack diversions. eg:

```
 export const ExchangeNavigation = [
 {
   screen: 'SiteDetailsPage',
   params: {
     totalPages: 9,
     currentPage: 1,
   },
   {
    screen: 'DiversionPage',
    params: {},
    diverison: () => {
      if (condition) {
        return [{screen: 'Option1'}, ...]
      } else {
        return [{screen: 'Option2'}, ...]
      }
    }
   }
 },
 ];
```

## Utils

### Form Validations

there are individual common validation methods to be used for the validation functions of the component/screen at `utils/validation/validators`

- create a file with the same name as the screen or the component where you want to build the validator and add `.validator` eg: `MyScreen.validator.js`

- pass `siteDetails` and `jobType` as prop

- create an array of validations
  Eg:

```
[
    () => validatePostCode(siteDetails.postCode),
    () => validatePhoneNumber('phone number1', siteDetails.number1),
    () => validateEmail('email1', siteDetails.email1)
]
```

method returns

```
return { isValid: true, message: '' };
```

you can then use it to display error message
