import { Component, OnInit, ViewChild } from '@angular/core';
import { AccessManagementService } from '../services/access-management.service';
import { ConfigurationService } from '../services/configuration.service';
import { NgForm } from '@angular/forms';
import { NewUser } from '../models/newuser';
import { UserMapping } from '../models/usermapping';
import { User } from './user';

@Component({
  selector: 'app-access-management',
  templateUrl: './access-management.component.html',
  styleUrls: ['./access-management.component.css']
})
export class AccessManagementComponent implements OnInit {
  @ViewChild('registerUserForm') offerCreateForm: NgForm;
  accessManagementData;
  primaryBusinessUnitList;
  businessUnits;
  businessEntities;
  userIdValue: string;
  functionNameValue: string;
  adminValue: Boolean = false;
  businessUnitValue: string[];
  businessEntityValue: string[];
  keyPocValue: Boolean = false;
  showFormSection = false;
  Obj;
  cols: any[];
  registerNewUserfun: any;
  newUser: NewUser[] = [];
  accessList: any[] = [];
  businessUnitsForCreateuser;

  userIdAvailable: boolean;

  constructor(private accessManagementService: AccessManagementService, private configurationService: ConfigurationService) { }

  ngOnInit() {

    this.userIdAvailable = false;
    this.showFormSection = false;
    this.cols = [
      { field: 'emailId', header: 'Cisco ID' },
      { field: 'userName', header: 'Name' },
      { field: 'userMapping', header: 'Function' },
      { field: 'userMapping', header: 'Business Entity' },
      { field: 'buList', header: 'Business Unit' },
      { field: 'functionalAdmin', header: 'Access' }

    ];

    this.accessManagementService.accessManagementAll()
      .subscribe(data => {
        this.processAdminData(data);
      });

    this.accessManagementService.getBusinessUnit().subscribe(data => {
      this.businessUnits = <any>data;
      const buArry = [];
      this.businessUnits.forEach(element => {
        buArry.push({ label: element.BUSINESS_UNIT, value: element.BUSINESS_UNIT });
      });
      buArry.push({ label: 'All', value: 'All' });
      this.businessUnits = buArry;
      this.businessUnitsForCreateuser = buArry;
    });

    this.getbusinessEntity();

    this.populateFunctionDropdown();

    this.accessList.push({ label: 'KeyPOC', value: 'KeyPOC' });
    this.accessList.push({ label: 'Admin', value: 'Admin' });
  }

  private populateFunctionDropdown() {

    // If super admin then all the function values should show up 
    // Else if the user if functional Admin dropdown should show values the user is funcional admin for
    // other wise don't show up any values

    if (this.configurationService.startupData.isSuperAdmin) {
      this.accessManagementService.getregisterUserFunction().subscribe(data => {
        this.registerNewUserfun = data;
      });
    } else if (this.configurationService.startupData.isFunctionalAdmin) {
      this.registerNewUserfun = this.configurationService.startupData.functionsUserCanAddTo;
    }
  }

  getbusinessEntity() {
    this.accessManagementService.getBusinessEntity()
      .subscribe(data => {
        this.businessEntities = <any>data;
        const beArry = [];
        this.businessEntities.forEach(element => {
          if (element.BE != null) {
            beArry.push({ label: element.BE, value: element.BE });
          }
        });
        beArry.push({ label: 'All', value: 'All' });
        this.businessEntities = this.removeDuplicates(beArry, 'label');
      });
  }

  getPrimaryBusinessUnitBasedOnPrimaryBE(event) {
    this.getPrimaryBusinessUnitPromise(event);
  }

  getPrimaryBusinessUnitPromise(event) {
    return new Promise((resolve) => {
      this.accessManagementService.getPrimaryBuBasedOnBe(event.toString())
        .subscribe(data => {
          const primaryBuArry = [];
          const dataArray = data as Array<any>;
          dataArray.forEach(element => {
            if (element.BUSINESS_UNIT !== null) {
              primaryBuArry.push({ label: element.BUSINESS_UNIT, value: element.BUSINESS_UNIT });
            }
          });
          primaryBuArry.push({ label: 'All', value: 'All' });
          this.businessUnitsForCreateuser = this.removeDuplicates(primaryBuArry, 'label');
          resolve();
        });
    });
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  getAllUpdate() {
    this.accessManagementService.accessManagementAll()
      .subscribe(data => {
        // this.accessManagementData = data;
        this.processAdminData(data);
      });
  }

  processAdminData(data) {
    let finalAdminData: any[] = [];
    data.forEach(element => {
      let temp = element;
      let beList: any[] = []
      let accessList: any[] = [];
      element.userMapping.forEach(userMaps => {
        beList.push(userMaps.businessEntity)
      });
      temp['beList'] = beList;
      temp['appRoleList'] = element.userMapping[0].appRoleList;
      temp['functionalRole'] = element.userMapping[0].functionalRole;
      temp['keyPOC'] = element.userMapping[0].keyPOC;
      temp['functionalAdmin'] = element.userMapping[0].functionalAdmin;
      if (element.userMapping[0].keyPOC) {
        accessList.push('KeyPOC');
      }
      if (element.userMapping[0].functionalAdmin) {
        accessList.push('Admin');
      }
      temp['accessList'] = accessList;
      finalAdminData.push(temp);
    });
    this.accessManagementData = finalAdminData;
  }

  createUser() {
    const userMappings: UserMapping[] = [];

    if (this.businessEntityValue !== undefined) {
      this.businessEntityValue.forEach(element => {
        const userMapping = new UserMapping(
          element,
          this.functionNameValue,
          this.adminValue,
          this.keyPocValue
        );
        userMappings.push(userMapping);
      });
    }

    const user = new NewUser(
      this.userIdValue,
      this.businessUnitValue,
      userMappings
    );

    this.newUser.push(user);


    this.accessManagementService.registerUser(this.newUser).subscribe(() => {
      this.getAllUpdate();
    },
      (err) => {
        console.log(err);
      });
    this.offerCreateForm.reset();
  }

  /**
   * Function to update BE of the user
   * @param updatedUserBe
   */
  updatedAceessManagementBe(updatedUserBe) {
    const userMappings: UserMapping[] = [];
    updatedUserBe.beList.forEach(element => {
      const userMapping = new UserMapping(
        element,
        updatedUserBe.functionalRole,
        updatedUserBe.functionalAdmin,
        updatedUserBe.keyPOC
      );
      userMappings.push(userMapping);
    });

    let updateAdmin = {
      "_id": updatedUserBe.userId,
      "businessUnits": updatedUserBe.buList,
      "userMappings": userMappings
    }

    this.accessManagementService.updateAccessManagement(updateAdmin)
      .subscribe(() => {
        console.log('updated successfully');
      });
  }

  /**
   * Function to Update BU of the user
   * @param updatedUser
   */
  updatedAceessManagement(updatedUser) {
    let updateAdmin = {
      "_id": updatedUser.userId,
      "businessUnits": updatedUser.buList,
      "userMappings": updatedUser.userMapping
    }
    this.accessManagementService.updateAccessManagement(updateAdmin)
      .subscribe(() => {
        console.log('updated successfully');
      });
  }

  /**
   * Function to update access level(KeyPOC/Admin) for the user.
   * @param user
   */
  updatedAccessForUser(user) {
    console.log(user);
    let isKeyPoC = user.accessList.includes('KeyPOC');
    let isAdmin = user.accessList.includes('Admin');

    console.log(isAdmin);
    console.log(isKeyPoC);
    const userMappings: UserMapping[] = [];
    user.beList.forEach(element => {
      const userMapping = new UserMapping(
        element,
        user.functionalRole,
        isAdmin,
        isKeyPoC
      );
      userMappings.push(userMapping);
    });

    let updateAdmin = {
      "_id": user.userId,
      "businessUnits": user.buList,
      "userMappings": userMappings
    }

    this.accessManagementService.updateAccessManagement(updateAdmin)
      .subscribe(() => {
        console.log('updated successfully');
      });
  }

  registerNewUser() {
    this.showFormSection = true;
  }

  closeForm() {
    this.showFormSection = false;
  }

  arrToOptions(arr) {
    const res = [];
    arr.forEach(a => {
      res.push({ 'label': a, 'value': a });
    });
    return res;
  }

  async checkUserIdAvailability(userId) {

    // Initiailize User
    const user = new User(userId.toString());

    // Retireve User Details
    this.accessManagementService.getUserDetails(user).subscribe(
      data => {

        if (Object.keys(data).length === 0 || data['errorMsg'] != null) {
          this.userIdAvailable = false;
        } else {
          this.userIdAvailable = true;
        }

      }, () => {
        this.userIdAvailable = false;
      }

    );

  }

}
