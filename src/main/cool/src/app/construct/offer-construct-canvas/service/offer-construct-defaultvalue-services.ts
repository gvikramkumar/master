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

        // if (element.question == 'TMS Node TS') {
        //   if (beListType == "Collaboration") {
        //     element.currentValue = "UC/HVS/SWSS/SUB/TRAN Svc";
        //     element.previousValue = "UC/HVS/SWSS/SUB/TRAN Svc";
        //   }
        //   if (beListType == "Security") {
        //     element.currentValue = "Swatch/HVS/SWSS/SUB/TRAN Svc";
        //     element.previousValue = "Swatch/HVS/SWSS/SUB/TRAN Svc";
        //   }
        //   else {
        //     element.currentValue = "X-Arch/HVS/SWSS/SUB/TRAN Svc";
        //     element.previousValue = "X-Arch/HVS/SWSS/SUB/TRAN Svc";
        //   }
        // }

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
        question.question == "STD AUTO RENEWAL TERM" || question.question == "NON STD AUTO RENEWAL TERM") {
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
        if (question.question == 'Service Type?') {
            question.rules.isDisabled = true;
        }
        if (question.question == 'SOA Pricing') {
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

  setTMSNOdeTSN2(questionList, beListType) {
      questionList.forEach(question => {
          if (question.question == "TMS Node TS") {
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
      });
  }

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



}
