import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class OfferConstructDefaultValue {

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
            if (element.question == 'Discount Restricted Product') {
                if (chargeTypeValue == usageType) {
                    element.currentValue = 'Yes';
                    element.previousValue = 'Yes';
                }
            }
            if (element.question == 'Subscription Offset') {
                if (chargeTypeValue == recurringType) {
                    element.currentValue = '30';
                    element.previousValue = '30';
                }
            }
        });
        return listOfferQuestions;
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
                console.log("question.rules.isMandatoryOptional", question.rules.isMandatoryOptional)
            }
            if (question.question == "Req Start Date Window") {
                question.rules.isMandatoryOptional = "Mandatory";
                question.currentValue = 60;
                console.log("question.rules.isMandatoryOptional", question.rules.isMandatoryOptional)
                console.log("question.currentValue", question.currentValue)
            }
            if (question.question == "Grace Window For Renewal") {
                question.rules.isMandatoryOptional = "Mandatory";
                question.currentValue = 90;
                console.log("question.rules.isMandatoryOptional", question.rules.isMandatoryOptional)
                console.log("question.currentValue", question.currentValue)
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

}

