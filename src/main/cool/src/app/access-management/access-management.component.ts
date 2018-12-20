import { Component, OnInit, ViewChild } from '@angular/core';
import { AccessManagementService } from '../services/access-management.service';
import { CreateOfferService } from '../services/create-offer.service';
import { SelectItem } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { AccessManagement } from '../models/accessmanagement';
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
  secondaryBusinessUnitList;
  secondaryBusinessEntityList;
  secondaryBusinessUnits: SelectItem[];
  secondaryBusinessEntities: SelectItem[];
  userIdValue: string;
  functionNameValue: string;
  adminValue: Boolean = false;
  businessUnitValue: string[];
  businessEntityValue: string[];
  keyPocValue: Boolean = false;
  Obj;
  cols: any[];
  newUser;
  constructor(private accessManagementService: AccessManagementService, private createOfferService: CreateOfferService) { }

  ngOnInit() {
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
        console.log(this.accessManagementData);
      });

      this.createOfferService.getSecondaryBusinessUnit().subscribe(data => {
        this.secondaryBusinessUnitList = <any>data;
        const secondaryBuArry = [];
        this.secondaryBusinessUnitList.forEach(element => {
          secondaryBuArry.push({ label: element.BUSINESS_UNIT, value: element.BUSINESS_UNIT });
        });
        this.secondaryBusinessUnits = secondaryBuArry;
      });
  }

  getSecondaryBusinessEntity(event) {
    this.createOfferService.getSecondaryBusinessEntity(event.toString())
      .subscribe(data => {
        this.secondaryBusinessEntityList = <any>data;
        const secondaryBeArry = [];
        this.secondaryBusinessEntityList.forEach(element => {
          secondaryBeArry.push({ label: element.BE, value: element.BE });
        });
        this.secondaryBusinessEntities = this.removeDuplicates(secondaryBeArry, 'label');
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
        console.log(this.accessManagementData);
      });
  }

  createUser() {
    const userMappings: UserMapping[] = [];
    const userMapping = new UserMapping(
      this.businessEntityValue,
      this.functionNameValue,
      this.adminValue,
      this.keyPocValue
    );
    userMappings.push(userMapping);
    console.log(userMappings);
    this.newUser = new NewUser(
      this.userIdValue,
      this.businessUnitValue,
      userMappings
    );
    console.log(this.newUser);
    this.accessManagementService.registerUser(this.newUser).subscribe((data) => {
      this.getAllUpdate();
    },
      (err) => {
        console.log(err);
      });
  }

  updatedAceessManagement(event) {
    console.log(event);
    this.accessManagementService.updateAccessManagement(event)
      .subscribe(data => {
        console.log('updated successfully');
      });
  }

  registerNewUser() {
    document.getElementById('formSection').style.visibility = 'visible';
  }

  closeForm() {
    document.getElementById('formSection').style.visibility = 'hidden';
  }

  arrToOptions(arr) {
    const res = [];
    arr.forEach(a => {
      res.push({ 'label': a, 'value': a });
    });
    return res;
  }

}
