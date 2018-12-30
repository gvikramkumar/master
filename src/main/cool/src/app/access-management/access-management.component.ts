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
        this.accessManagementData = data;
      });

    this.accessManagementService.getBusinessUnit().subscribe(data => {
      this.businessUnits = <any>data;
      const buArry = [];
      this.businessUnits.forEach(element => {
        buArry.push({ label: element.BUSINESS_UNIT, value: element.BUSINESS_UNIT });
      });
      this.businessUnits = buArry;
    });

    this.getbusinessEntity();
  }

  getbusinessEntity() {
    this.accessManagementService.getBusinessEntity()
      .subscribe(data => {
        this.businessEntities = <any>data;
        const beArry = [];
        this.businessEntities.forEach(element => {
          beArry.push({ label: element.BE, value: element.BE });
        });
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
        this.accessManagementData = data;
      });
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

    console.log(this.newUser);

    this.accessManagementService.registerUser(this.newUser).subscribe((data) => {
      this.getAllUpdate();
    },
      (err) => {
        console.log(err);
      });
    this.offerCreateForm.reset();
  }

  updatedAceessManagement(event) {
    this.accessManagementService.updateAccessManagement(event)
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
