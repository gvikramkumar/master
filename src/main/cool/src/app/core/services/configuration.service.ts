import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccessManagementService } from '@app/services/access-management.service';
import { EnvironmentService } from '@env/environment.service';
import { UserService } from '@app/core/services/user.service';
import * as _ from 'lodash';

@Injectable()
export class ConfigurationService {

  urlGetUserInfo = this.environmentService.REST_API_LDAP_USER_DETAILS_URL;
  urlGetCurrentUser = this.environmentService.REST_API_URL_GET_CURRENT_USER_URL;
  urlCheckAdminAccess = this.environmentService.REST_API_RETRIEVE_USER_INFO_URL;

  private _startupData: any = {};

  constructor(private httpClient: HttpClient,
              private userService: UserService,
              private environmentService: EnvironmentService,
              private accessMgmtService: AccessManagementService) {
  }

  init() {
    // if (this._startupData.token || window.location.hash.indexOf('access_token') !== -1) {
    //   this.login_to_dash();
    // } else {
    //   const url = this.environmentService.REST_API_GENERATE_AUTH_TOKEN_URL;
    //   window.location.replace(url);
    // }
    return new Promise((resolve, reject) => {

      if (this._startupData.token || window.location.hash.indexOf('access_token') !== -1) {

        this._startupData.token = window.location.hash.split('&')[0].split('=')[1];

        this.httpClient.get(this.urlGetCurrentUser).toPromise()
          .then((user) => {
            this.userService.setUserId(user);

            // check for admin access
            this.accessMgmtService.checkAdminAccess().toPromise().then((resUserInfo) => {

              this._startupData.userId = resUserInfo.userId;
              this._startupData.userName = resUserInfo.userName;
              this._startupData.isSuperAdmin = resUserInfo.superAdmin;
              this._startupData.isFunctionalAdmin = (resUserInfo.userMapping && resUserInfo.userMapping
                .some(mapping => mapping.functionalAdmin));

              this._startupData.functionalRole = _.uniqBy(resUserInfo.userMapping
                .reduce((accumulator, mapping) => {
                  accumulator = [...accumulator, mapping.functionalRole];
                  return accumulator;
                }, []));

              this._startupData.appRoleList = _.uniqBy(resUserInfo.userMapping
                .reduce((accumulator, mapping) => {
                  accumulator = [...accumulator, ...mapping.appRoleList];
                  return accumulator;
                }, []));

              this._startupData.readOnly = this.editAuthValidation(this._startupData.appRoleList);

              this._startupData.businessEntity = resUserInfo.userMapping[0]['businessEntity'];
              if (this._startupData.isSuperAdmin || this._startupData.isFunctionalAdmin) {
                this._startupData.hasAdminAccess = true;
              }
            }, (err) => {
              this._startupData.hasAdminAccess = false;
            });

            return this.httpClient.post(this.urlGetUserInfo, { userId: user }).toPromise().then((resUserInfo: any) => {
              this.userService.setName(resUserInfo[0].cn);
            })
          })
          .then((response) => resolve(true))
          .catch(this.handleError());
        // this.login_to_dash();
      } else {

        const url = this.environmentService.REST_API_GENERATE_AUTH_TOKEN_URL;
        window.location.replace(url);
      }
    });
  }
  private login_to_dash() {

    return new Promise((resolve, reject) => {
      this._startupData.token = window.location.hash.split('&')[0].split('=')[1];

      this.httpClient.get(this.urlGetCurrentUser).toPromise()
        .then((user) => {
          this.userService.setUserId(user);

          // check for admin access
          this.accessMgmtService.checkAdminAccess().toPromise().then((resUserInfo) => {

            this._startupData.userId = resUserInfo.userId;
            this._startupData.userName = resUserInfo.userName;
            this._startupData.isSuperAdmin = resUserInfo.superAdmin;
            this._startupData.isFunctionalAdmin = (resUserInfo.userMapping && resUserInfo.userMapping
              .some(mapping => mapping.functionalAdmin));

            this._startupData.functionalRole = _.uniqBy(resUserInfo.userMapping
              .reduce((accumulator, mapping) => {
                accumulator = [...accumulator, mapping.functionalRole];
                return accumulator;
              }, []));

            this._startupData.appRoleList = _.uniqBy(resUserInfo.userMapping
              .reduce((accumulator, mapping) => {
                accumulator = [...accumulator, ...mapping.appRoleList];
                return accumulator;
              }, []));

            this._startupData.readOnly = this.editAuthValidation(this._startupData.appRoleList);

            this._startupData.businessEntity = resUserInfo.userMapping[0]['businessEntity'];
            if (this._startupData.isSuperAdmin || this._startupData.isFunctionalAdmin) {
              this._startupData.hasAdminAccess = true;
            }
          }, (err) => {
            this._startupData.hasAdminAccess = false;
          });

          return this.httpClient.post(this.urlGetUserInfo, { userId: user }).toPromise().then((resUserInfo: any) => {
            this.userService.setName(resUserInfo[0].cn);
          });
        })
        .then((response) => resolve(true))
        .catch(this.handleError());
    });
  }
  private handleError(data?: any) {
    return (error: any) => {
      console.log(error);
    }
  }

  get startupData(): any {
    return this._startupData;
  }


  // Check if the login user is owner/co-owner to determine the Edit authorization

  editAuthValidation(currentUserRole: any): boolean {

    let readOnly = false;

    const adminRole = ['Owner', 'Co-Owner'];
    if (adminRole.some(user => currentUserRole.includes(user))) {
      readOnly = false;
    } else {
      readOnly = true;
    }

    return readOnly;
  }
}
