import { Component, OnInit, ViewChild } from '@angular/core';
import { AccessManagementService } from '@app/services/access-management.service';
import { NgForm } from '@angular/forms';
import { NewUser } from '@app/models/newuser';
import { UserMapping } from '@app/models/usermapping';
import { forkJoin, Observable, of, from } from 'rxjs';
import { ConfigurationService } from '@app/core/services';
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
  accessList: any[] = [
    { label: 'KeyPOC', value: 'KeyPOC' },
    { label: 'Admin', value: 'Admin' }
  ];
  businessUnitsForCreateuser;

  userIdAvailable: boolean;
  currentUserData;
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

    const startUpData = this.configurationService.startupData;
    this.currentUserData = {
      isSuperAdmin: startUpData.isSuperAdmin,
      isFunctionalAdmin: startUpData.isFunctionalAdmin,
      functionalRole: startUpData.functionalRole
    };

    const getFunctions = this.accessManagementService.getFunction(this.currentUserData);
    const getBusinessUnit = this.accessManagementService.getFormattedBusinessUnit();
    const getBusinessEntity = this.accessManagementService.getFormattedBusinessEntity();
    forkJoin([getBusinessUnit, getBusinessEntity, getFunctions])
      .subscribe(resBUBE => {
        const [businessUnits, businessEntities, functions] = resBUBE;
        this.businessUnits = businessUnits;
        this.businessUnitsForCreateuser = businessUnits;
        this.registerNewUserfun = functions;
        this.businessEntities = businessEntities;
        this.getUserAccessData(this.currentUserData);
      });
  }

  getUserAccessData(currentUserData) {
    this.accessManagementService.getFomattedUserAccessData(currentUserData)
      .subscribe(resUserAccess => {
        this.accessManagementData = resUserAccess
          .map(user => {
            user.businessEntities = this.businessEntities;
            user.businessUnits = user.buList ? [{ label: 'ALL', value: 'ALL' }, ...user.buList.map(elementBU => ({ label: elementBU, value: elementBU }))] : [{ label: 'ALL', value: 'ALL' }];
            return user;
          });
      });
  }

  getPrimaryBusinessUnitBasedOnPrimaryBEForUser(selectedBusinessEntities, user) {
    user.buList = [];
    this.accessManagementService.getFormattedBusinessUnitBasedOnBE(selectedBusinessEntities)
      .subscribe(resBusinessUnits => {
        user.businessUnits = resBusinessUnits;
      });

  }
  getPrimaryBusinessUnitBasedOnPrimaryBEForUserOnBUClick(selectedBusinessEntities, user) {
    this.accessManagementService.getFormattedBusinessUnitBasedOnBE(selectedBusinessEntities)
      .subscribe(resBusinessUnits => {
        user.businessUnits = resBusinessUnits;
      });
  }
  getPrimaryBusinessUnitBasedOnPrimaryBE(selectedBusinessEntities) {
    this.businessUnitValue = [];
    this.accessManagementService.getFormattedBusinessUnitBasedOnBE(selectedBusinessEntities).subscribe((resBusinessUnit) => {
      this.businessUnitsForCreateuser = resBusinessUnit;
    });
  }

  createUser() {
    let userMappings: UserMapping[] = [];

    if (this.businessEntityValue) {
      userMappings = this.businessEntityValue.reduce((accumulator, businessEntity) => {
        const userMapping = new UserMapping(
          businessEntity,
          this.functionNameValue,
          this.adminValue,
          this.keyPocValue,
          null
        );
        accumulator.push(userMapping);
        return accumulator;
      }, []);
    }

    const user = new NewUser(
      this.userIdValue,
      this.businessUnitValue,
      userMappings
    );

    this.newUser.push(user);


    this.accessManagementService.registerUser(this.newUser).subscribe(() => {
      this.getUserAccessData(this.currentUserData);
    },
      (err) => {
        console.log(err);
      });
    this.offerCreateForm.reset();
  }

  /**
   * Function to update BE of the user
   * @param updatedUserBusinessEntity
   */
  updatedAccessManagementBE(updatedUserBusinessEntity) {
    const isKeyPoC = updatedUserBusinessEntity.accessList.includes('KeyPOC');
    const isAdmin = updatedUserBusinessEntity.accessList.includes('Admin');
    const userMappings: UserMapping[] = [];
    if ((updatedUserBusinessEntity.beList && updatedUserBusinessEntity.beList.length > 0)) {
      updatedUserBusinessEntity.beList.forEach(element => {
        const userMapping = new UserMapping(
          element,
          updatedUserBusinessEntity.functionalRole,
          isAdmin,
          isKeyPoC,
          null
        );
        userMappings.push(userMapping);
      });
      const updateAdmin = {
        '_id': updatedUserBusinessEntity.userId,
        'businessUnits': updatedUserBusinessEntity.buList ? updatedUserBusinessEntity.buList : [],
        'userMappings': userMappings
      };

      this.accessManagementService.updateAccessManagement(updateAdmin)
        .subscribe(() => {
          // console.log('updated successfully');
        });
    } else {
      this.getUserAccessData(this.currentUserData);
    }


  }

  registerNewUser() {
    this.showFormSection = true;
  }

  closeForm() {
    this.showFormSection = false;
  }

  async checkUserIdAvailability(userId) {

    if (userId) {
      // Retireve User Details
      this.accessManagementService.getUserDetails(userId.toString()).subscribe(
        data => {
          this.userIdAvailable = data && data.length > 0 && !data['errorMsg'];
        }, () => {
          this.userIdAvailable = false;
        }

      );
    }


  }

}
