import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class OfferConstructDefaultValue {

  public serviceTypeValue: string;

  constructor() { }

  billingSOADefaultValue(listOfferQuestions, chargeTypeValue) {
    let usageType = 'Usage';
    let recurringType = 'Recurring';
    listOfferQuestions.forEach(element => {
      if (element.rules.defaultSel != '') {
        element.currentValue = element.rules.defaultSel;
        element.previousValue = element.rules.defaultSel;
      }

      if (element.question == 'Base Price') {
        if (chargeTypeValue == usageType) {
          element.currentValue = 0;
          element.previousValue = 0;
        }
      }
      if (element.question == 'Discount Restricted Product') {
        if (chargeTypeValue == usageType) {
          element.currentValue = 'Yes';
          element.previousValue = 'Yes';
          element.rules.isDisabled = true;
        } else {
          element.rules.isDisabled = false;
        }
      }
      if (element.question === "Proration Flag For Purchase") {
        if (chargeTypeValue == recurringType) {
          element.currentValue = 'Yes';
          element.previousValue = 'Yes';
        }
        if (chargeTypeValue == usageType) {
          element.currentValue = 'No';
          element.previousValue = 'No';
        }
      }
      if (element.question === "Proration Flag For Cancel") {
        if (chargeTypeValue == recurringType) {
          element.currentValue = 'Yes';
          element.previousValue = 'Yes';
        }
        if (chargeTypeValue == usageType) {
          element.currentValue = 'No';
          element.previousValue = 'No';
        }
      }
      if (element.question == "Usage Type") {
        if (chargeTypeValue == usageType) {
          element.currentValue = 'Support';
          element.previousValue = 'Support';
        }
      }
      if (element.question == 'RATING MODEL') {
        if (chargeTypeValue == usageType) {
          element.currentValue = 'EVENT';
          element.previousValue = 'EVENT';
        }
      }
      if (element.question == 'Subscription Offset(In Days)') {
        if (chargeTypeValue == recurringType) {
          element.currentValue = '30';
          element.previousValue = '30';
        }
      }
      if (element.question === 'Service Type?') {
        // set pre define value according to service type
          this.serviceTypeValue = element.currentValue;
          this.setSubscriptionType(listOfferQuestions, this.serviceTypeValue);
        }

    });
    return listOfferQuestions;
  }

  setSubscriptionType(listOfferQuestions, serviceTypeValue) {
    listOfferQuestions.forEach(element => {
      if (element.question === 'Subscription Type') {
        if (serviceTypeValue === 'Support') {
            element.currentValue = 'Support';
            element.previousValue = 'Support';
        }
        if (serviceTypeValue === 'Service') {
            element.currentValue = 'Service';
            element.previousValue = 'Service';
        }
      }
    });
  }

  setBasePriceInBillingSOADForFlat(questionList) {
    let monthlyAmountValue;
    questionList.forEach(question => {
      if (question.question == "Monthly Amount") {
        monthlyAmountValue = question.currentValue;
      }
    });

    questionList.forEach(question => {
      if (question.question == "Base Price") {
        question.currentValue = monthlyAmountValue;
      }
    });
  }
  
  setLongDescription(questionList) {
    let longDescriptionDefault;
    questionList.forEach(question => {
      if (question.question == "Description") {
        longDescriptionDefault = question.currentValue;
      }
    });

    questionList.forEach(question => {
      if (question.question == "Long Description") {
        question.currentValue = longDescriptionDefault;
      }
    });
  }

  setBasePriceInBillingSOAForProduct(questionList) {
    questionList.forEach(question => {
      if (question.question == "Base Price") {
        question.currentValue = 1;
      }
    });

  }

  setSmartAccountSOAForProduct(questionList) {
    questionList.forEach(question => {
      if (question.question == "Smart Account") {
        question.currentValue = "Mandatory";
      }
    });

  }

  setSmartAccountForSmartLicensingEnabledNo(questionList) {
    questionList.forEach(question => {
      if (question.question == "Smart Account") {
        question.currentValue = "";
      }
    });

  }



  setTermsPaymentsRequired(questionList) {
    questionList.forEach(question => {
      if (question.question == "Initial Term" || question.question == "NON STD INITIAL TERM" ||
        question.question == "STD AUTO RENEWAL TERM" || question.question == "NON STD AUTO RENEWAL TERM" || question.question == "Default Initial Term" || 
        question.question == "Default Auto Renewal Term") {
        question.rules.isMandatoryOptional = "Mandatory";
      }
      if (question.question == "Req Start Date Window") {
        question.rules.isMandatoryOptional = "Mandatory";
        question.currentValue = 90;
      }
      if (question.question == "Grace Window For Renewal") {
        question.rules.isMandatoryOptional = "Mandatory";
        question.currentValue = 60;
      }
    });

  }

  setTermsPaymentsRequiredN(questionList) {
    questionList.forEach(question => {
      if (question.question == "Initial Term" || question.question == "NON STD INITIAL TERM" ||
        question.question == "STD AUTO RENEWAL TERM" || question.question == "NON STD AUTO RENEWAL TERM" ||
        question.question == "Req Start Date Window" || question.question == "Grace Window For Renewal") {
        question.currentValue = "";
        question.rules.isMandatoryOptional = "Optional";
      }
    });

  }


  setPricingApprovalRequired(questionList) {
    questionList.forEach(question => {
      if (question.question == "Assign to Request ID") {
        question.rules.isMandatoryOptional = "Mandatory";
      }
    });

  }

  setPricingApprovalRequiredN(questionList) {
    questionList.forEach(question => {
      if (question.question == "Assign to Request ID") {
        question.rules.isMandatoryOptional = "Optional";
      }
    });

  }

  setRefurbishedItemRequired(questionList) {
    questionList.forEach(question => {
      if (question.question == "Refurbished-Original Item") {
        question.rules.isMandatoryOptional = "Mandatory";
      }
    });

  }

  setRefurbishedItemRequiredN(questionList) {
    questionList.forEach(question => {
      if (question.question == "Refurbished-Original Item") {
        question.rules.isMandatoryOptional = "Optional";
      }
    });

  }


  LicenseDefault(questionList) {
    questionList.forEach(question => {
      if (question.question == "License Type") {
        question.rules.isMandatoryOptional = "Mandatory";
      }
    });

  }

  LicenseDefaultOptional(questionList) {
    questionList.forEach(question => {
      if (question.question == "License Type") {
        question.rules.isMandatoryOptional = "Optional";
      }
    });

  }


  getLicenseDeliveryTypeDefaultValues(questionList, licenseDelivery) {
    if (licenseDelivery = "Smart Licenses") {
      questionList.forEach(question => {
        if (question.question == "Smart Licensing Enabled") {
          question.currentValue = "Yes";
        }
      });
    }
    return questionList;
  }

  getLicenseDeliveryTypeDefaultValuesN(questionList, licenseDelivery) {
    if (licenseDelivery = "Smart Licenses") {
      questionList.forEach(question => {
        if (question.question == "Smart Licensing Enabled") {
          question.currentValue = "";
        }
      });
    }
    return questionList;
  }

  setSubscriptionOffset(questionList) {
    questionList.forEach(question => {
      if (question.question == "Subscription Offset(In Days)") {
        question.rules.isDisabled = false;
      }
    });
    return questionList;
  }

  setSubscriptionOffsetN(questionList) {
    questionList.forEach(question => {
      if (question.question == "Subscription Offset(In Days)") {
        question.rules.isDisabled = true;
        question.rules.isMandatoryOptional = "Optional";
      }
    });
    return questionList;
  }

  ImageSigningForXaas(questionList) {
    questionList.forEach(question => {
      if (question.question == "Image Signing") {
        question.currentValue = "No Image signing (Digital Software Signatures) is not supported";
      }
    });
    return questionList;
  }

  ImageSigningForHardware(questionList) {
    questionList.forEach(question => {
      if (question.question == "Image Signing") {
        question.currentValue = "Yes Image signing (Digital Software Signatures) is supported";
      }
    });
    return questionList;
  }
  ImageSigningForHardwareDefault(questionList) {
    questionList.forEach(question => {
      if (question.question == "Image Signing") {
        question.currentValue = "";
      }
    });
    return questionList;
  }


  setTermsNPayments(questionList) {
    questionList.forEach(question => {
      if (question.question == "Terms & Payments Required") {
        question.currentValue = "No";
      }
    });
    return questionList;
  }


  setTermsNPaymentsN(questionList) {
    questionList.forEach(question => {
      if (question.question == "Terms & Payments Required") {
        question.currentValue = "";
      }
    });
    return questionList;
  }
  
  setCreateDefault(questionList) {
    questionList.forEach(question => {
      if (question.question == "Create/Update") {
        question.currentValue = "Create";
        question.rules.isDisabled = true;
      }
    });
    return questionList;
  }


  setEnablePartySWKey(questionList) {
    questionList.forEach(question => {
      if (question.question == "Enable 3rd Party SW Key") {
        question.rules.isMandatoryOptional = "Mandatory";
        question.currentValue = 'No';
      }
    });
  }

  setEnablePartySWKeyN(questionList) {
    questionList.forEach(question => {
      if (question.question == "Enable 3rd Party SW Key") {
        question.rules.isMandatoryOptional = "Optional";
        question.currentValue = '';
      }
    });
  }


  getChargeTypeValidationValues(questionList, chargeTypeValue) {
    let usageType = 'Usage';
    let recurringType = 'Recurring';
    let trueUp = 'True Up';
    questionList.forEach(question => {
      if (question.question == "Pricing Type") {
        if (chargeTypeValue == usageType) {
          question.currentValue = 'Fixed Amount';
        }
        else {
          question.currentValue = 'Scaled Amount';
        }

      }

      if (question.question == "Pricing Term") {
        if (chargeTypeValue == recurringType) {
          question.rules.isDisabled = false;
        }
        else {
          question.rules.isDisabled = true;
          question.rules.isMandatoryOptional = "Optional";
        }
      }

      if (question.question == "True Up Term") {
        if (chargeTypeValue == trueUp) {
          question.rules.isDisabled = false;
        }
        else {
          question.rules.isDisabled = true;
          question.rules.isMandatoryOptional = "Optional";
        }

      }

      if (question.question == "Non Standard True Up Term") {
        if (chargeTypeValue == trueUp) {
          question.rules.isDisabled = false;
        }
        else {
          question.rules.isDisabled = true;
          question.rules.isMandatoryOptional = "Optional";
        }

      }
      
      if (question.question == "Usage Type") {
        if (chargeTypeValue == usageType) {
          question.rules.isDisabled = false;
        }
        else {
          question.rules.isDisabled = true;
          question.rules.isMandatoryOptional = "Optional";
        }

      }

      if (question.question == "Usage Reporting Type") {
        if (chargeTypeValue == usageType) {
          question.rules.isDisabled = false;
        }
        else {
          question.rules.isDisabled = true;
          question.rules.isMandatoryOptional = "Optional";
        }

      }

      if (question.question == "Print Usage Details on Invoice") {
        if (chargeTypeValue == usageType) {
          question.rules.isDisabled = false;
        }
        else {
          question.rules.isDisabled = true;
          question.rules.isMandatoryOptional = "Optional";
        }

      }
    });
    return questionList;
  }
  
  
  getProductQuantityDeliveryPreferenceValues(questionList, pakEligibility){
      questionList.forEach(question => {
        if (question.question == "Product Quantity Delivery Preference") {
          if (pakEligibility == 'Yes') {
            question.rules.isMandatoryOptional = 'Mandatory';
          }
          else {
             question.rules.isMandatoryOptional = "Optional";
          }

        }
      
  });
  return questionList;
  }

  setSoftwareLicense(questionList) {
    questionList.forEach(question => {
      if (question.question == "Software License" || question.question == "Entitlement Term") {
        question.rules.isDisabled = true;
      }
    });

    return questionList;
  }
  setSoftwareLicenseDefault(questionList) {
    questionList.forEach(question => {
      if (question.question == "Software License" || question.question == "Entitlement Term") {
        question.rules.isDisabled = false;
      }
    });
    return questionList;
  }

  setPricingFormula(questionList) {
    questionList.forEach(question => {
      if (question.question == "Pricing Formula") {
        question.currentValue = "Blank";
      }
    });

  }

  setPricingFormulaNo(questionList) {
    questionList.forEach(question => {
      if (question.question == "Pricing Formula") {
        question.currentValue = "";
      }
    });

  }
  
  setAdjustable(questionList) {
    questionList.forEach(question => {
      if (question.question == "$Adjustable") {
        question.currentValue = "No";
      }
    });
    return questionList;
  }
  
  setTaxCategory(questionList) {
    questionList.forEach(question => {
      if (question.question == "Tax Category") {
        question.currentValue = "eDelivery";
      }
    });
    return questionList;
  }
  
  setDefaultTrueupTerm(questionList) {
    let trueUpDefault;
    let trueUpDefaultValues;
    questionList.forEach(question => {
      if (question.question == "True Up Term") {
        trueUpDefault = question.currentValue;
        trueUpDefaultValues = trueUpDefault.split(',')
        console.log("trueUpDefaultValues1", trueUpDefaultValues);
      }
    });

    questionList.forEach(question => {
      if (question.question == "Default True Up Term") {
               console.log("question.currentValue",question.currentValue)
             
             if(trueUpDefaultValues.includes(question.currentValue)){
                 question.rules.isvalid = true;
                 question.rules.validationMessage = "";
                 console.log("question.currentValue == trueUpValue", question.rules.isvalid )
             }
             else{
                  question.rules.isvalid = false;
                  question.rules.validationMessage = question.egineAttribue + " should be a value from True Up Term ";
                  console.log("question.currentValue != trueUpValue", question.rules.isvalid )
             }
      }
    });
  }

  setDefaultInitialTerm(questionList) {
    let initialTermDefault;
    let initialTermDefaultValues;
    questionList.forEach(question => {
      if (question.question == "Initial Term") {
        initialTermDefault = question.currentValue;
        initialTermDefaultValues = initialTermDefault.split(',')
        console.log("trueUpDefaultValues1", initialTermDefaultValues);
      }
    });

    questionList.forEach(question => {
      if (question.question == "Default Initial Term") {
               console.log("question.currentValue",question.currentValue)
             
             if(initialTermDefaultValues.includes(question.currentValue)){
                 question.rules.isvalid = true;
                 question.rules.validationMessage = "";
                 console.log("question.currentValue == trueUpValue", question.rules.isvalid )
             }
             else{
                  question.rules.isvalid = false;
                  question.rules.validationMessage = question.egineAttribue + " should be a value from True Up Term ";
                  console.log("question.currentValue != trueUpValue", question.rules.isvalid )
             }
      }
    });
  }
  
  setDefaultAutoRenewalTerm(questionList) {
    let stdAutoRenewalTermDefault;
    let stdAutoRenewalTermDefaultValues;
    questionList.forEach(question => {
      if (question.question == "STD AUTO RENEWAL TERM") {
        stdAutoRenewalTermDefault = question.currentValue;
        stdAutoRenewalTermDefaultValues = stdAutoRenewalTermDefault.split(',')
        console.log("trueUpDefaultValues1", stdAutoRenewalTermDefaultValues);
      }
    });

    questionList.forEach(question => {
      if (question.question == "Default Auto Renewal Term") {
               console.log("question.currentValue",question.currentValue)
             
             if(stdAutoRenewalTermDefaultValues.includes(question.currentValue)){
                 question.rules.isvalid = true;
                 question.rules.validationMessage = "";
             }
             else{
                  question.rules.isvalid = false;
                  question.rules.validationMessage = question.egineAttribue + " should be a value from True Up Term ";
                  console.log("question.currentValue != trueUpValue", question.rules.isvalid )
             }
      }
    });
  }


  // setSoftwareLicenseNSKU(questionList) {
  //     questionList.forEach(question => {
  //         if (question.question == "UPG Family"  || question.question == "UPG Group" || question.question == "UPG Type" ) {
  //             question.rules.isDisabled = false;
  //         }
  //     });
  //       return questionList;
  // }
  // setSoftwareLicenseNSKUDefault(questionList) {
  //     questionList.forEach(question => {
  //         if (question.question == "UPG Family"  || question.question == "UPG Group" || question.question == "UPG Type" ) {
  //             question.rules.isDisabled = true;
  //         }
  //     });
  //      return questionList;
  // }



}
