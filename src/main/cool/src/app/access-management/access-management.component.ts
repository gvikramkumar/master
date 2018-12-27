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
  primaryBusinessUnits: SelectItem[];
  primaryBusinessEntities: SelectItem[];
  userIdValue: string;
  functionNameValue: string;
  adminValue: Boolean = false;
  businessUnitValue: string[];
  businessEntityValue: string[];
  keyPocValue: Boolean = false;
  Obj;
  cols: any[];
  newUser;
  showFormSection = false;
  constructor(private accessManagementService: AccessManagementService, private createOfferService: CreateOfferService) { }

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
    this.createOfferService.getPrimaryBusinessUnits().subscribe(data => {
      this.primaryBusinessUnitList = <any>data;
      const primaryBuArry = [];
      this.primaryBusinessUnitList.businessUnits.forEach(element => {
        primaryBuArry.push({ label: element, value: element });
      });
      this.primaryBusinessUnits = primaryBuArry;
    });
  }

  getPrimaryBusinessEntity(event) {
    this.createOfferService.getPrimaryBusinessEntity(event.toString())
      .subscribe(data => {
        const primaryBeArry = [];
        data.forEach(element => {
          primaryBeArry.push({ label: element.BE, value: element.BE });
        });
        this.primaryBusinessEntities = this.removeDuplicates(primaryBeArry, 'label');
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

    this.businessEntityValue.forEach(element => {
      const userMapping = new UserMapping(
        element,
        this.functionNameValue,
        this.adminValue,
        this.keyPocValue
      );
      userMappings.push(userMapping);
    });

    this.newUser = new NewUser(
      this.userIdValue,
      this.businessUnitValue,
      userMappings
    );

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
