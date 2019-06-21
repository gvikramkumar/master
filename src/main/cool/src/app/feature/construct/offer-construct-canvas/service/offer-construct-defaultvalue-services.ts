import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class OfferConstructDefaultValue {

  public serviceTypeValue: string;

  constructor() { }

  billingSOADefaultValue(listOfferQuestions, chargeTypeValue, beListType) {
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

      if (element.question == 'Terms & Payments Required') {
        if (element.currentValue == 'No') {
          // set Subscription Offset(In Days) as disable if the value in 'no'
          this.disableSubscriptionOffset(listOfferQuestions)
        }
      }

      if (element.question == 'Service Type?') {
          element.currentValue = 'Support';
          element.previousValue = 'Support';
          element.rules.isDisabled = false;
      }

      if (element.question == 'SOA Pricing') {
          element.rules.isDisabled = false;
      }

      if (element.question === 'Service Type?') {
        // set pre define value according to service type
          this.serviceTypeValue = element.currentValue;
          this.setSubscriptionType(listOfferQuestions, this.serviceTypeValue);
        }

        if (element.question == "Support Pricing Minimum (monthly) ") {
            if(element.currentValue == "Yes") {
                this.setMonthlySupportPricingProduct(listOfferQuestions);
            }
            else {
                this.setMonthlySupportPricingProductN(listOfferQuestions);
            }
        }

        if (element.question == "Monthly Amount") {
            if(element.currentValue != "$0") {
                this.setTMSNOde(listOfferQuestions);
                this.setTMSNOdeTSMonthly(listOfferQuestions);
            }
            else{
                this.setTMSNOdeN(listOfferQuestions);
                this.setTMSNOdeTSN(listOfferQuestions);
            }
        }

        if (element.question == "SOA Pricing") {
            if(element.currentValue == "% of Product List") {
                this.setSoaPricingbasedDefaultsProduct(listOfferQuestions);
            }
            else {
                this.setSoaPricingbasedDefaultsProductN(listOfferQuestions);
            }
        }

        if (element.question == "SOA Pricing") {
            if (element.currentValue == "Flat") {
                this.setSoaPricingbasedDefaultsFlat(listOfferQuestions);
            }
            else {
                this.setSoaPricingbasedDefaultsFlatN(listOfferQuestions);
            }
        }

        if (element.question == 'Pricing Approval Required') {
          element.currentValue = 'No';
          element.previousValue = 'No';
        }

        if (element.question === 'Pricing Type') {
          if (chargeTypeValue == usageType) {
            element.currentValue = 'Fixed Amount';
            element.previousValue = 'Fixed Amount';
          } else {
            element.currentValue = 'Scaled Amount';
            element.previousValue = 'Scaled Amount';
          }
        }
    });
    return listOfferQuestions;
  }

  // disableSubscriptionOffset
  disableSubscriptionOffset(listOfferQuestions) {
    listOfferQuestions.forEach(element => {
      if (element.question == 'Subscription Offset(In Days)') {
        element.rules.isDisabled = true;
      }
    });
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
        question.currentValue = "No, Image signing (Digital Software Signatures) is not supported";
      }
    });
    return questionList;
  }

  ImageSigningForHardware(questionList) {
    questionList.forEach(question => {
      if (question.question == "Image Signing") {
        question.currentValue = "Yes, Image signing (Digital Software Signatures) is supported";
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

      // for Subscription Offset(In Days)
      if (question.question == 'Subscription Offset(In Days)') {
        if (chargeTypeValue == recurringType) {
          question.currentValue = '30';
          question.previousValue = '30';
        }
      }

      if (question.question == 'Terms & Payments Required') {
        if (question.currentValue == 'No') {
          // set Subscription Offset(In Days) as disable if the value in 'no'
          this.disableSubscriptionOffset(questionList)
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
        question.rules.isDisabled = false;
      }
    });

    return questionList;
  }
  setSoftwareLicenseDefault(questionList) {
    questionList.forEach(question => {
      if (question.question == "Software License" || question.question == "Entitlement Term") {
        question.rules.isDisabled = true;
      }
    });

    return questionList;
  }


  nonSoaSkuDefaults(questionList) {
    questionList.forEach(question => {
      if (question.question == "Service Type?" || question.question == "SOA Pricing" || question.question == "Monthly Amount"
      || question.question == "Percentage Amount" || question.question == "Support Pricing Minimum (monthly) " || question.question == "Monthly Support Pricing Minimum Value") {
        question.rules.isDisabled = true;
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
      }
    });

    questionList.forEach(question => {
      if (question.question == "Default True Up Term") {

             if(trueUpDefaultValues.includes(question.currentValue)){
                 question.rules.isvalid = true;
             }
             else{
                  question.rules.isvalid = false;

                  question.rules.validationMessage = question.egineAttribue + " should be a value from True Up Term ";
             }
      }
    });
  }

  setDefIniTerm(questionList) {
    let iniDefault;
    let iniDefaultValues;
    questionList.forEach(question => {
      if (question.question == "Initial Term") {
        iniDefault = question.currentValue;
        iniDefaultValues = iniDefault.split(',')
      }
    });

    questionList.forEach(question => {
      if (question.question == "Default Initial Term") {

             if(iniDefaultValues.includes(question.currentValue)){
                 question.rules.isvalid = true;
             }
             else{
                  question.rules.isvalid = false;

                  question.rules.validationMessage = question.egineAttribue + " should be a value from Initial Term ";
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
        }
      });

      questionList.forEach(question => {
        if (question.question == "Default Initial Term") {
               if(initialTermDefaultValues.includes(question.currentValue)){
                  question.rules.isvalid = true;
               }
               else{
                    question.rules.isvalid = false;
                    question.rules.validationMessage = question.egineAttribue + " should be a value from Initial Term";
               }
        }
      });
    }


    setDefaultAutoRenewalTerm(questionList) {
      let stdAutoRenewalTermDefault;
      questionList.forEach(question => {
        if (question.question == "STD AUTO RENEWAL TERM") {
          stdAutoRenewalTermDefault = question.currentValue;
        }
      });

      questionList.forEach(question => {
        if (question.question == "Default Auto Renewal Term") {
          question.currentValue = stdAutoRenewalTermDefault;
        }
      });
    }

  setSoftwareLicenseNSKU(questionList) {
      questionList.forEach(question => {
          if (question.question == "UPG Family"  || question.question == "UPG Group" || question.question == "UPG Type" ) {
              question.rules.isDisabled = false;
          }
      });
        return questionList;
  }
  setSoftwareLicenseNSKUDefault(questionList) {
      questionList.forEach(question => {
          if (question.question == "UPG Family"  || question.question == "UPG Group" || question.question == "UPG Type" ) {
              question.rules.isDisabled = true;
              question.rules.isMandatoryOptional = "Optional";
          }
      });
       return questionList;
  }

  getSpareTypeValues(questionList, createSpare){
      questionList.forEach(question => {
        if (question.question == "Spare Price" || question.question == "Spare Configurable") {
          if (createSpare == 'Yes') {
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


  setEnablementFileType(questionList) {
    questionList.forEach(question => {
      if (question.question == "Enablement File Type") {
        question.rules.isDisabled = false;
        question.rules.isMandatoryOptional = "Mandatory";
      }
    });
    return questionList;
  }

  setEnablementFileTypeN(questionList) {
    questionList.forEach(question => {
      if (question.question == "Enablement File Type") {
          question.rules.isDisabled = true;
          question.currentValue = '';
      }
    });
    return questionList;
  }


  setConditionalAccess(questionList) {
    questionList.forEach(question => {
      if (question.question == "Conditional Access") {
        question.rules.isDisabled = false;
      }
    });
    return questionList;
  }

  setConditionalAccessN(questionList) {
    questionList.forEach(question => {
      if (question.question == "Conditional Access") {
        question.rules.isDisabled = true;
        question.rules.isMandatoryOptional = "Optional";
      }
    });
    return questionList;
  }

  setSoaPricingbasedDefaultsFlat(questionList) {
    questionList.forEach(question => {
        if (question.question == "Monthly Amount") {
          question.rules.isDisabled = false;
          question.currentValue = '$0';

        }
    });
    questionList.forEach(question => {
    if (question.question == "Percentage Amount") {
      question.rules.isDisabled = false;
      question.currentValue = '';
    }
    });
    questionList.forEach(question => {
        if (question.question == "TMS Node TS") {
          question.rules.isDisabled = true;
          question.currentValue = "";
        }
    });
    questionList.forEach(question => {
        if (question.question == "TMS Node AS") {
          question.rules.isDisabled = true;
          question.currentValue = "";
        }
    });
    return questionList;
  }

  setSoaPricingbasedDefaultsFlatN(questionList) {
    questionList.forEach(question => {
        if (question.question == "Monthly Amount") {
          question.rules.isDisabled = true;
          question.currentValue = '';
        }
    });
  }

  setSoaPricingbasedDefaultsProduct(questionList) {
    questionList.forEach(question => {
        if (question.question == "Percentage Amount") {
          question.rules.isDisabled = false;
        }
        if (question.question == "Support Pricing Minimum (monthly) ") {
          question.rules.isDisabled = false;
          question.currentValue = 'No';
          this.setMonthlySupportPricingProductN(questionList);
        }
    });
  }



  setSoaPricingbasedDefaultsProductN(questionList) {
    questionList.forEach(question => {
        if (question.question == "Percentage Amount") {
          question.rules.isDisabled = true;
        }

        if (question.question == "Support Pricing Minimum (monthly) ") {
          question.rules.isDisabled = true;
          question.currentValue = '';
        }
    });
    return questionList;
  }

  setMonthlySupportPricingProduct(questionList) {
    questionList.forEach(question => {
        if (question.question == "Monthly Support Pricing Minimum Value") {
          question.rules.isDisabled = false;
        }
    });
  }

  setMonthlySupportPricingProductN(questionList) {
    questionList.forEach(question => {
        if (question.question == "Monthly Support Pricing Minimum Value") {
          question.rules.isDisabled = true;
        }
    });
    return questionList;
  }


  setTMSNOde(questionList) {
    let tmsAsDefault;
    questionList.forEach(question => {
        if (question.question == "Service Type?") {
          tmsAsDefault = question.currentValue;
        }
    });
    questionList.forEach(question => {
      if (question.question == "TMS Node AS") {
        if(tmsAsDefault == "Service"){
            question.rules.isDisabled = false;
        }
        else{
            question.rules.isDisabled = true;
            question.currentValue = "";
        }
      }
    });
  }

  setTMSNOdeN(questionList) {
    questionList.forEach(question => {
        if (question.question == "TMS Node AS") {
          question.rules.isDisabled = true;
          question.currentValue = "";

        }
    });
  }

  setTMSNOde1(questionList) {
    let tmsDefault;
    questionList.forEach(question => {
        if (question.question == "Service Type?") {
          tmsDefault = question.currentValue;
        }
    });
    questionList.forEach(question => {
      if (question.question == "TMS Node AS") {
        if(tmsDefault == "Service"){
            question.rules.isDisabled = false;
        }
        else{
            question.rules.isDisabled = true;
            question.currentValue = "";
        }
      }
    });
  }

  setTMSNOdeASDefault(questionList) {
    let tmsAsDefault;
    questionList.forEach(question => {
        if (question.question == "Percentage Amount") {
          tmsAsDefault = question.currentValue;
        }
    });
    questionList.forEach(question => {
      if (question.question == "TMS Node AS") {
        if(tmsAsDefault != "blank" && tmsAsDefault != ""){
            question.rules.isDisabled = false;
        }
        else{
            question.rules.isDisabled = true;
            question.currentValue = "";
        }
      }
    });
  }

  setTMSNOdeN1(questionList) {
      questionList.forEach(question => {
          if (question.question == "TMS Node AS") {
            question.rules.isDisabled = true;
            question.currentValue = "";
          }
      });
  }

  setTMSNOdeASDefaultN(questionList) {
      questionList.forEach(question => {
          if (question.question == "TMS Node AS") {
            question.rules.isDisabled = true;
            question.currentValue = "";
          }
      });
  }

  setTMSNOdeN2(questionList) {
      questionList.forEach(question => {
          if (question.question == "TMS Node AS") {
            question.rules.isDisabled = true;
            question.currentValue = "";
          }
      });
  }


  setTMSNOdeTS(questionList, beListType) {
    let tmsAsDefault;
    questionList.forEach(question => {
        if (question.question == "Service Type?") {
          tmsAsDefault = question.currentValue;
        }
    });
    questionList.forEach(question => {
      if (question.question == "TMS Node TS") {
        if(tmsAsDefault == "Support"){
          question.rules.isDisabled = false;
              if (beListType == "Collaboration") {

                question.currentValue = "UC/HVS/SWSS/SUB/TRAN Svc";
              }
              if (beListType == "Security") {
                question.currentValue = "Swatch/HVS/SWSS/SUB/TRAN Svc";
              }
             if (beListType != "Collaboration" && beListType != "Security") {
                question.currentValue = "X-Arch/HVS/SWSS/SUB/TRAN Svc";
              }
          }
        }
    });
  }

  setTMSNOdeTSMonthly(questionList) {
    let tmsAsDefault;
    questionList.forEach(question => {
        if (question.question == "Service Type?") {
          tmsAsDefault = question.currentValue;
        }
    });
    questionList.forEach(question => {
      if (question.question == "TMS Node TS") {
        if(tmsAsDefault == "Support"){
            question.rules.isDisabled = false;
        }
        else{
            question.rules.isDisabled = true;
            question.currentValue = "";
        }
      }
    });
  }

  setTMSNOdeTSN(questionList) {
    questionList.forEach(question => {
        if (question.question == "TMS Node TS") {
          question.rules.isDisabled = true;
          question.currentValue = "";
        }
    });
  }

  setTMSNOdeTS1(questionList, beListType) {
    let tmsDefault;
    questionList.forEach(question => {
        if (question.question == "Service Type?") {
          tmsDefault = question.currentValue;
        }
    });
    questionList.forEach(question => {
      if (question.question == "TMS Node TS") {
        if(tmsDefault == "Support"){
            question.rules.isDisabled = false;
            if (beListType == "Collaboration") {

              question.currentValue = "UC/HVS/SWSS/SUB/TRAN Svc";
            }

            if (beListType == "Security") {
              question.currentValue = "Swatch/HVS/SWSS/SUB/TRAN Svc";
            }
            if (beListType != "Collaboration" && beListType != "Security") {
              question.currentValue = "X-Arch/HVS/SWSS/SUB/TRAN Svc";
            }
        }
        else{
            question.rules.isDisabled = true;
            question.currentValue = "";
        }
      }
    });
  }

  setTMSNOdeTSDefault(questionList, beListType) {
    let tmsTsDefault;
    questionList.forEach(question => {
        if (question.question == "Percentage Amount") {
          tmsTsDefault = question.currentValue;
        }
    });
    questionList.forEach(question => {
      if (question.question == "TMS Node TS") {
        if(tmsTsDefault != "blank" && tmsTsDefault != ""){
            question.rules.isDisabled = false;
            if (beListType == "Collaboration") {

              question.currentValue = "UC/HVS/SWSS/SUB/TRAN Svc";
            }
            if (beListType == "Security") {
              question.currentValue = "Swatch/HVS/SWSS/SUB/TRAN Svc";
            }
            if (beListType != "Collaboration" && beListType != "Security") {
              question.currentValue = "X-Arch/HVS/SWSS/SUB/TRAN Svc";
            }
        }
        else{
            question.rules.isDisabled = true;
            question.currentValue = "";
        }
      }
    });
  }

  setTMSNOdeTSN1(questionList, beListType) {
      questionList.forEach(question => {
          if (question.question == "TMS Node TS") {
            question.rules.isDisabled = true;
            question.currentValue = "";
          }
      });
  }

  setTMSNOdeTSDefaultN(questionList, beListType) {
      questionList.forEach(question => {
          if (question.question == "TMS Node TS") {
            question.rules.isDisabled = true;
            question.currentValue = "";
          }
      });
  }

  setTMSNOdeTSDisable(questionList, beListType) {
      questionList.forEach(question => {
          if (question.question == "TMS Node TS") {
            question.rules.isDisabled = true;
            question.currentValue = "";
          }
      });
  }

  setTMSNOdeASDisable(questionList) {
       questionList.forEach(question => {
           if (question.question == "TMS Node AS") {
             question.rules.isDisabled = true;
             question.currentValue = "";
           }
       });
   }

  // setTMSNOdeTSN2(questionList, beListType) {
  //     questionList.forEach(question => {
  //         if (question.question == "TMS Node TS") {
  //           question.rules.isDisabled = false;
  //           if (beListType == "Collaboration") {
  //
  //             question.currentValue = "UC/HVS/SWSS/SUB/TRAN Svc";
  //           }
  //           if (beListType == "Security") {
  //             question.currentValue = "Swatch/HVS/SWSS/SUB/TRAN Svc";
  //           }
  //           if (beListType != "Collaboration" && beListType != "Security") {
  //             question.currentValue = "X-Arch/HVS/SWSS/SUB/TRAN Svc";
  //           }
  //         }
  //     });
  // }

  setMonthlySupMin(questionList) {
      questionList.forEach(question => {
          if (question.question == "Monthly Support Pricing Minimum Value") {
            question.rules.isDisabled = true;
            question.currentValue = "";
          }
      });
  }
settmsTsValue(questionList, beListType) {
  let monDefault;
  questionList.forEach(question => {
      if (question.question == "Monthly Amount") {
        monDefault = question.currentValue;
      }
  });
  questionList.forEach(question => {
    if (question.question == "TMS Node TS") {
      if(monDefault != "$0"){
          question.rules.isDisabled = false;
          if (beListType == "Collaboration") {

            question.currentValue = "UC/HVS/SWSS/SUB/TRAN Svc";
          }

          if (beListType == "Security") {
            question.currentValue = "Swatch/HVS/SWSS/SUB/TRAN Svc";
          }
          if (beListType != "Collaboration" && beListType != "Security") {
            question.currentValue = "X-Arch/HVS/SWSS/SUB/TRAN Svc";
          }
      }
      else{
          question.rules.isDisabled = true;
          question.currentValue = "";
      }
    }
  });
}

settmsAsValue(questionList, beListType) {
  let monAsDefault;
  questionList.forEach(question => {
      if (question.question == "Monthly Amount") {
        monAsDefault = question.currentValue;
      }
  });
  questionList.forEach(question => {
    if (question.question == "TMS Node AS") {
      if(monAsDefault != "$0"){
          question.rules.isDisabled = false;
      }
      else{
          question.rules.isDisabled = true;
          question.currentValue = "";
      }
    }
  });
}

setTmsASTmsTS(questionList) {
  let percentageDefault;
  questionList.forEach(question => {
      if (question.question == "Percentage Amount") {
        percentageDefault = question.currentValue;
      }
  });
  questionList.forEach(question => {
    if (question.question == "TMS Node AS") {
      if(percentageDefault == "blank" || percentageDefault == ""){
          question.rules.isDisabled = true;
      }

    }
  });
  questionList.forEach(question => {
    if (question.question == "TMS Node TS") {
      if(percentageDefault == "blank" || percentageDefault == ""){
          question.rules.isDisabled = true;
          question.currentValue = "";
      }

    }
  });
}

setBasePID(questionList) {
       questionList.forEach(question => {
           if (question.question == "Base PID") {
             question.rules.isDisabled = false;
           }
       });
   }
 setBasePIDN(questionList) {
        questionList.forEach(question => {
            if (question.question == "Base PID") {
              question.rules.isDisabled = true;
            }
        });
    }

  // setTASNOdeTSDefault(questionList, beListType) {
  //   let tasTsDefault;
  //   questionList.forEach(question => {
  //       if (question.question == "Percentage Amount") {
  //         tasTsDefault = question.currentValue;
  //       }
  //   });
  //   questionList.forEach(question => {
  //     if (question.question == "TMS Node TS") {
  //       if(tasTsDefault != "blank" && tasTsDefault != ""){

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

getCountryNameValues(questionList) {
     let countryValues = ["AFGHANISTAN","ALBANIA","ALGERIA","AMERICAN SAMOA","ANDORRA","ANGOLA","ANGUILLA","ANTARCTICA","ANTIGUA AND BARBUDA","ARGENTINA","ARMENIA","ARUBA","AUSTRALIA","AUSTRIA","AZERBAIJAN","BAHAMAS","BAHRAIN","BANGLADESH","BARBADOS","BELARUS","BELGIUM","BELIZE","BENIN","BERMUDA","BHUTAN","BOLIVIA","BOSNIA AND HERZEGOVINA","BOTSWANA","BOUVET ISLAND","BRAZIL","BRITISH INDIAN OCEAN TERRITORY","BRUNEI DARUSSALAM","BULGARIA","BURKINA FASO","BURUNDI","CAMBODIA","CAMEROON","CANADA","CAPE VERDE","CAYMAN ISLANDS","CENTRAL AFRICAN REPUBLIC","CHAD","CHILE","CHINA","CHRISTMAS ISLAND","COCOS (KEELING) ISLANDS","COLOMBIA","COMOROS","CONGO","CONGO, THE DEMOCRATIC REPUBLIC OF THE","COOK ISLANDS","COSTA RICA","COTE D'IVOIRE","CROATIA","CUBA","CYPRUS","CZECH REPUBLIC","DENMARK","DJIBOUTI","DOMINICA","DOMINICAN REPUBLIC","ECUADOR","EGYPT","EL SALVADOR","EQUATORIAL GUINEA","ERITREA","ESTONIA","ETHIOPIA","FALKLAND ISLANDS (MALVINAS)","FAROE ISLANDS","FIJI","FINLAND","FRANCE","FRENCH GUIANA","FRENCH POLYNESIA","FRENCH SOUTHERN TERRITORIES","GABON","GAMBIA","GEORGIA","GERMANY","GHANA","GIBRALTAR","GREECE","GREENLAND","GRENADA","GUADELOUPE","GUAM","GUATEMALA","GUERNSEY","GUINEA","GUINEA-BISSAU","GUYANA","HAITI","HEARD ISLAND AND MCDONALD ISLANDS","HOLY SEE (VATICAN CITY STATE)","HONDURAS","HONG KONG","HUNGARY","ICELAND","INDIA","INDONESIA","IRAN, ISLAMIC REPUBLIC OF","IRAQ","IRELAND","ISLE OF MAN","ISRAEL","ITALY","JAMAICA","JAPAN","JERSEY","JORDAN","KAZAKHSTAN","KENYA","KIRIBATI","KOREA, DEMOCRATIC PEOPLE&#39;S REPUBLIC OF","KOREA, REPUBLIC OF","KUWAIT","KYRGYZSTAN","LAO PEOPLE&#39;S DEMOCRATIC REPUBLIC","LATVIA","LEBANON","LESOTHO","LIBERIA","LIBYAN ARAB JAMAHIRIYA","LIECHTENSTEIN","LITHUANIA","LUXEMBOURG","MACAO","MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF","MADAGASCAR","MALAWI","MALAYSIA","MALDIVES","MALI","MALTA","MARSHALL ISLANDS","MARTINIQUE","MAURITANIA","MAURITIUS","MAYOTTE","MEXICO","MICRONESIA, FEDERATED STATES OF","MOLDOVA, REPUBLIC OF","MONACO","MONGOLIA","MONTSERRAT","MOROCCO","MOZAMBIQUE","MYANMAR","NAMIBIA","NAURU","NEPAL","NETHERLANDS","NETHERLANDS ANTILLES","NEW CALEDONIA","NEW ZEALAND","NICARAGUA","NIGER","NIGERIA","NIUE","NORFOLK ISLAND","NORTHERN MARIANA ISLANDS","NORWAY","OMAN","PAKISTAN","PALAU","PALESTINIAN TERRITORY, OCCUPIED","PANAMA","PAPUA NEW GUINEA","PARAGUAY","PERU","PHILIPPINES","PITCAIRN","POLAND","PORTUGAL","PUERTO RICO","QATAR","REUNION","ROMANIA","RUSSIAN FEDERATION","RWANDA","SAINT HELENA","SAINT KITTS AND NEVIS","SAINT LUCIA","SAINT PIERRE AND MIQUELON","SAINT VINCENT AND THE GRENADINES","SAMOA","SAN MARINO","SAO TOME AND PRINCIPE","SAUDI ARABIA","SENEGAL","SERBIA AND MONTENEGRO","SEYCHELLES","SIERRA LEONE","SINGAPORE","SLOVAKIA","SLOVENIA","SOLOMON ISLANDS","SOMALIA","SOUTH AFRICA","SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS","SOUTH SUDAN","SPAIN","SRI LANKA","SUDAN","SURINAME","SVALBARD AND JAN MAYEN","SWAZILAND","SWEDEN","SWITZERLAND","SYRIAN ARAB REPUBLIC","TAIWAN, REPUBLIC OF CHINA","TAJIKISTAN","TANZANIA, UNITED REPUBLIC OF","THAILAND","TIMOR-LESTE","TOGO","TOKELAU","TONGA","TRINIDAD AND TOBAGO","TUNISIA","TURKEY","TURKMENISTAN","TURKS AND CAICOS ISLANDS","TUVALU","UGANDA","UKRAINE","UNITED ARAB EMIRATES","UNITED KINGDOM","UNITED STATES","UNITED STATES MINOR OUTLYING ISLANDS","URUGUAY","UZBEKISTAN","VANUATU","VENEZUELA","VIET NAM","VIRGIN ISLANDS, BRITISH","VIRGIN ISLANDS, U.S.","WALLIS AND FUTUNA","WESTERN SAHARA","YEMEN","ZAMBIA","ZIMBABWE"];
     let countryName;
     questionList.forEach(question => {
       if (question.question == "Country Specific Association" || question.question == "ROHS") {
              countryName = question.currentValue.split(',')
              //countryName.forEach(element => {
              for(let i=0;i<countryName.length;i++){

              if(countryValues.includes(countryName[i])){
                 question.rules.isvalid = true;
              }
              else{
                   question.rules.isvalid = false;
                   question.rules.validationMessage = "Entry of a comma separated list of Country Names with no spaces";
                   break;

              }
            }
          //  })
       }
     });
   }

   setConditionalAccessDefault(questionList) {
     let conditionalAccessDefault;
     questionList.forEach(question => {
         if (question.question == "Enablement File Type") {
           conditionalAccessDefault = question.currentValue;
         }
     });
     questionList.forEach(question => {
       if (question.question == "Conditional Access"){
         if(conditionalAccessDefault == "EMM" || conditionalAccessDefault == "Hybrid"){
             question.rules.isDisabled = false;
         }
         else{
             question.rules.isDisabled = true;
             question.currentValue = "";
         }
       }
     });
   }

 setEnablementFileTypeDefault(questionList) {
   let enablementFileType;
   questionList.forEach(question => {
       if (question.question == "Enablement") {
         enablementFileType = question.currentValue;
       }
   });
   questionList.forEach(question => {
     if (question.question == "Enablement File Type"){
       if(enablementFileType == "Yes"){
           question.rules.isDisabled = false;
           question.rules.isMandatoryOptional = "Mandatory";
       }
       else{
           question.rules.isDisabled = true;
           question.currentValue = "";
       }
     }
   });
 }

 setItemTypeXassDefault(questionList) {
      questionList.forEach(question => {
          if (question.question == "Item Type") {
            question.rules.isDisabled = true;
            question.currentValue = "ATO MODEL";
          }
      });
  }

setItemTypeBillingDefault(questionList) {
     questionList.forEach(question => {
         if (question.question == "Item Type") {
           question.rules.isDisabled = true;
           question.currentValue = "PRODUCT LIST>$0";
         }
     });
 }

 getBasePIDValues(questionList) {
    let udiValue;
    questionList.forEach(question => {
        if (question.question == "UDI Value") {
          udiValue = question.currentValue;
        }
    });
    questionList.forEach(question => {
      if (question.question == "Base PID"){
        if(udiValue == "Full UDI Compliance" || udiValue == "Will implement Physical visibility only"
              || udiValue == "Will implement Electronic visibility only"){
            question.rules.isDisabled = false;
        }
        else{
            question.rules.isDisabled = true;
            question.currentValue = "";
        }
      }
    });
 }

}
