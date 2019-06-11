import { Component, OnInit, ViewChild } from '@angular/core';
import { AccessManagementService } from '@app/services/access-management.service';
import { NgForm } from '@angular/forms';
import { NewUser } from '@app/models/newuser';
import { UserMapping } from '@app/models/usermapping';
import { forkJoin, Observable, of, from, Subject } from 'rxjs';
import { ConfigurationService } from '@app/core/services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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

  public rolesSubject = new Subject();
  public disabledDd = true;
  public isInvalidCEPMuser = false;
  public ddRoles = [];
  public isDdDisabled = false;
  public rolesCollection;
  public selectedUser: string;
  newar;
  finalind: any;
  showDpdwn = false;
  IndexCount: number;
  public getCEPM;
  globalInd: any;
  slectedRole: any;
  isSelected = false;
  CEPMselectedRole: string;
  public rolesData;
  public allusers = [];

  constructor(private accessManagementService: AccessManagementService,
    private configurationService: ConfigurationService) { }


  onSelectDd(updatedUserBusinessEntity, e) {
    this.slectedRole = e.value.value;
    this.isSelected = true;
    const isKeyPoC = updatedUserBusinessEntity.accessList.includes('KeyPOC');
    const isAdmin = updatedUserBusinessEntity.accessList.includes('Admin');
    const userMappings: UserMapping[] = [];

    if ((updatedUserBusinessEntity.beList && updatedUserBusinessEntity.beList.length > 0)) {
      updatedUserBusinessEntity.beList.forEach(element => {
        const userMapping = new UserMapping(
          element,
          this.slectedRole,
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
          updatedUserBusinessEntity.userMapping[0].functionalRole = this.slectedRole;
          this.accessManagementService.sendFromUserRegistration
          .next(updatedUserBusinessEntity);
        });
    } else {
      this.getUserAccessData(this.currentUserData);
    }
  }

  onGetCEPMs(user, indexNum: number) {
    this.isSelected = false;
    this.getCEPM = true;
    this.selectedUser = user.userId;
    this.IndexCount = indexNum;
    this.accessManagementService.onGetCEPMrolesUserRegistration(user.userId)
      .subscribe((rolesList: any) => {
        if (rolesList) {
          this.getCEPM = false;
        }
        let rolesKeys = []
        for (let item of rolesList) {
          rolesKeys.push(...Object.keys(item));
        }
        let trimmedRoles = [];
        for (let item of rolesKeys) {
          if (item.substring(0, 7) === "COOL - ") {
            trimmedRoles.push(item.substring(7));
          } else {
            trimmedRoles.push(item);
          }
        }
        let lables = [];
        for (let i = 0; i <= trimmedRoles.length - 1; i++) {

          if (trimmedRoles[i] === user.userMapping[0].functionalRole) {
            lables.unshift({ label: i, value: user.userMapping[0].functionalRole })
          } else {
            lables.push({ label: i, value: trimmedRoles[i] });
          }
        }

        if (lables[0].value === "error") {
          this.ddRoles = [];
        } else {
          this.ddRoles = lables;
        }
      });
  }

  onEdit() {
    let allIds = [];
    for (let item of this.allusers) {
      allIds.push(item.userId);
    }
    let allApis = [];
    for (let i = 0; i <= allIds.length - 1; i++) {
      allApis.push(this.accessManagementService.onGetCEPMrolesUserRegistration(allIds[i]));
    }
    forkJoin(allApis).subscribe((data) => {
      let ar = [];
      for (let i = 0; i <= data.length - 1; i++) {
        ar.push([]);
        for (let item of data[i]) {
          ar[i].push(...Object.keys(item));
        }
      }
      this.rolesData = ar;
    });
  }


  ngOnInit() {


    this.rolesData = [];
    this.ddRoles = [];
    this.rolesSubject.pipe(debounceTime(1000)).subscribe((value: string) => {
      this.accessManagementService.onGetCEPMrolesUserRegistration(value)
        .subscribe((users: any) => {
          let roles = [];
          for (let item of users) {
            roles.push(...Object.keys(item));
          }
          let rolesCollect = roles.map((value) => {
            if (value) {
              if (value.substring(0, 7) === "COOL - ") {
                return value.substring(7);
              } else {
                return value;
              }
            }
          });

          if (rolesCollect) {
            if (rolesCollect.length === 0 || rolesCollect[0] === "error") {
              this.rolesCollection = [];
              this.isInvalidCEPMuser = true;

            } else {
              this.rolesCollection = rolesCollect;
              if (this.rolesCollection) {
                this.disabledDd = false;
                this.isInvalidCEPMuser = false;
              }
            }
          }
        }, (err) => {
          console.log("Error", err)
        });
    });



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

 //CEPM pass role to API
 onGetRoles(e) {
  this.disabledDd = true;
  if (e.target.value.length === 0) {
    this.disabledDd = true;
  }
  this.rolesSubject.next(e.target.value);
}

  getUserAccessData(currentUserData) {
    this.accessManagementService.getFomattedUserAccessData(currentUserData)
      .subscribe(resUserAccess => {
        this.accessManagementData = resUserAccess
          .map(user => {
            this.allusers.push(user);
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
