import { Component, OnInit, ViewChild } from '@angular/core';
import { AccessManagementService } from '../services/access-management.service';
import { CreateOfferService } from '../services/create-offer.service';
import { SelectItem } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { NewUser } from '../models/newuser';
import { UserMapping } from '../models/usermapping';

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
  registerNewUserfun:any;
  newUser:NewUser [] = [];
  constructor(private accessManagementService: AccessManagementService) { }

  ngOnInit() {
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
        // this.accessManagementData = data;
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
    });

    this.getbusinessEntity();
    this.accessManagementService.getregisterUserFunction().subscribe(data=>{
            this.registerNewUserfun=data;
    });
  }

  getbusinessEntity() {
    this.accessManagementService.getBusinessEntity()
      .subscribe(data => {
        this.businessEntities = <any>data;
        const beArry = [];
        this.businessEntities.forEach(element => {
          if (element.BE != null){
            beArry.push({ label: element.BE, value: element.BE });
          }
        });
        beArry.push({ label: 'All', value: 'All' });
        this.businessEntities = this.removeDuplicates(beArry, 'label');
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
      element.userMapping.forEach(userMaps => {
        beList.push(userMaps.businessEntity)
      });
      temp['beList'] = beList;
      temp['appRoleList'] = element.userMapping[0].appRoleList;
      temp['functionalRole'] = element.userMapping[0].functionalRole;
      temp['keyPOC'] = element.userMapping[0].keyPOC;
      temp['functionalAdmin'] = element.userMapping[0].functionalAdmin;
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


    this.accessManagementService.registerUser(this.newUser).subscribe((data) => {
      this.getAllUpdate();
    },
      (err) => {
        console.log(err);
      });
    this.offerCreateForm.reset();
  }

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
      .subscribe(data => {
        console.log('updated successfully');
      });
  }

  updatedAceessManagement(updatedUser) {
    let updateAdmin = {
      "_id": updatedUser.userId,
      "businessUnits": updatedUser.buList,
      "userMappings": updatedUser.userMapping
    }
    this.accessManagementService.updateAccessManagement(updateAdmin)
      .subscribe(data => {
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

}
