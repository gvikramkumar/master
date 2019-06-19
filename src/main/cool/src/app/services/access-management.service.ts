import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, from,Subject,BehaviorSubject } from 'rxjs';
import { NewUser } from '../models/newuser';
import { map, filter, mergeMap, merge, mergeAll, concat, concatAll,switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { EnvironmentService } from '@env/environment.service';
import { UserService } from '@app/core/services/user.service';

@Injectable()
export class AccessManagementService {

    public modalSubject = new Subject();
    public sendBoolGuard = new Subject();
    public sendRouteUrl = new Subject();
    public sendSelectedRole = new Subject();
    public getRoleObj = new  BehaviorSubject({});
    public getRoleObjFromUserRegistration = new  BehaviorSubject(null);
    public sendReadOnlyRoles = new BehaviorSubject([]);
    public sendErrMsg = new BehaviorSubject("");
    public behaviourSub = new BehaviorSubject([]);
    public sendfunctionalRolRaw = new BehaviorSubject("");
    public sendFromUserRegistration = new BehaviorSubject([]);
    public roles: any;

    public urlGetCEPMRoles:string = this.environmentService.REST_API_GET_CEPMROLES_URL;
    urlBusinessUnit: string = this.environmentService.PDAF_API + '?columns=business_unit&distinct=true';
    urlBusinessEntity: string = this.environmentService.PDAF_API + '?columns=BE&distinct=true';
    urlGetPrimaryBUBasedOnBE: string = this.environmentService.PDAF_API + '?&distinct=true&be=';

    constructor(
        private httpClient: HttpClient, private environmentService: EnvironmentService, private userService: UserService) { }

        onGetUserCEPM() {
            return this.checkAdminAccess()
             .pipe(switchMap((data)=> {
                 return this.getCEPMRoles(data.userId);
             }));
         }

         onGetCEPMrolesUserRegistration(userId:string) {
            return this.getCEPMRoles(userId);
         }

         getCEPMRoles(userId:string) {
            const PAYLOAD = {
                methodType:"USER_RESOURCE_ACTION_ENVATTR_LEVEL",
                methodName:"getDecisionsWithRolesForSCUser",
                userName:userId,
                resourceFQN:"SCAppGrp:Cisco Orchestrated Offer Lifecycle",
                context:"Global Context:Global Context",
                action:"any",
                roleBundles:{
                roleBundle:["Default"]
                },
                level:"-1",
                returnWithResType:"false",
                excludeResGrp:"true"
            }
            return this.httpClient.post(this.environmentService.REST_API_GET_CEPM_ROLES_URL, PAYLOAD);
          }


    accessManagementAll(): any {
        return this.httpClient.get(this.environmentService.REST_API_ACCESS_MANAGEMENT_GET_ALL_URL);
    }
    /**
     * Gets user access data
     * Filters user access data based on current user permission
     */
    getFomattedUserAccessData(currentUserData): any {
        return this.httpClient.get(this.environmentService.REST_API_ACCESS_MANAGEMENT_GET_ALL_URL)
            .pipe(
                map(userData => this.formatAndFilterUserAccessData(currentUserData, userData))
            );
    }
    /**
     * Formats user access data
     */
    private formatAndFilterUserAccessData = (currentUserData, userData) => {
        const arrUserData = userData as Array<any>;
        return arrUserData
            .map(this.formatUser())
            .filter(user => this.canCurrentUserTakeAction(currentUserData, user));
    }

    private formatUser(): (value: any, index: number, array: any[]) => any {
        return user => {
            const accessList: any[] = [];
            if (user.userMapping && user.userMapping[0].keyPOC) {
                accessList.push('KeyPOC');
            }
            if (user.userMapping && user.userMapping[0].functionalAdmin) {
                accessList.push('Admin');
            }
            const formattedUser = {
                ...user,
                beList: user.userMapping ? user.userMapping.reduce((beAccumulator, userMapping) => {
                    beAccumulator.push(userMapping.businessEntity);
                    return beAccumulator;
                }, []) : [],
                appRoleList: user.userMapping ? user.userMapping[0].appRoleList : null,
                functionalRole: user.userMapping ? user.userMapping[0].functionalRole : null,
                functionalAdmin: user.userMapping ? user.userMapping[0].functionalAdmin : null,
                accessList: accessList
            };
            return formattedUser;
        };
    }

    /**
     * Can take action on user if current user is super admin or
     * if user is functional admin then they can take action only on users belonging to their function
     * @param userData
     */
    canCurrentUserTakeAction(currentUserData: any, userData: any) {
        return currentUserData.isSuperAdmin ||
            (currentUserData.isFunctionalAdmin && currentUserData.functionalRole.includes(userData['functionalRole']));
    }
    getUserDetails(user: string) {
        return this.httpClient.post<[]>(this.environmentService.REST_API_LDAP_USER_DETAILS_URL, {userId: user}, { withCredentials: true });
    }

    registerUser(newUser: NewUser[]): Observable<any> {
        return this.httpClient.post(this.environmentService.REST_API_CREATE_NEW_USER_URL,
            newUser, { withCredentials: true });
    }

    updateAccessManagement(accessManagement: any) {
        return this.httpClient.post(this.environmentService.REST_API_UPDATE_USER_INFO_URL,
            accessManagement, { withCredentials: true });
    }

    getregisterUserFunction() {
        const url = this.environmentService.REST_API_GET_FUNCTIONAL_ROLE_URL;
        return this.httpClient.get(url);
    }

    checkAdminAccess(): Observable<any> {
        return this.httpClient.get(this.environmentService.REST_API_RETRIEVE_USER_INFO_URL + '/' + this.userService.getUserId(),
            { withCredentials: true });
    }

    getCurrentUserInfo(userId: String): Observable<any> {
        return this.httpClient.get(this.environmentService.REST_API_RETRIEVE_USER_INFO_URL + '/' + userId,
            { withCredentials: true });
    }

    // If super admin then all the function values should show up
    // Else if the user if functional Admin dropdown should show values the user is funcional admin for
    // other wise don't show up any values
    getFunction(currentUserData) {
        const url = this.environmentService.REST_API_GET_FUNCTIONAL_ROLE_URL;
        return this.httpClient.get(url).pipe(
            map(resFunctions => {
                if (currentUserData.isSuperAdmin) {
                    return resFunctions;
                } else if (currentUserData.isFunctionalAdmin) {
                    return _.uniq(currentUserData.functionalRole);
                }
            })
        );
        // let registerNewUserfun;
        // if (currentUserData.isSuperAdmin) {
        //     this.getregisterUserFunction().subscribe(data => {
        //         registerNewUserfun = data;
        //     });
        // } else if (currentUserData.isFunctionalAdmin) {
        //     registerNewUserfun = currentUserData.functionsUserCanAddTo;
        // }
    }
    /**
     * API call to get primary business entity
     */
    getBusinessEntity(): Observable<any> {
        const url = this.urlBusinessEntity;
        return this.httpClient.get(url);
    }
    /**
     * formats the Business Entity response in the format of lable and value to be used in dropdowns
     */
    getFormattedBusinessEntity() {
        const url = this.urlBusinessEntity;
        return this.httpClient.get(url).pipe(
            map(this.formatBusinessEntity())
        );
    }

    private formatBusinessEntity(): (value: Object, index: number) => { label: any; value: any; }[] {
        return resBusinessUnit => {
            const arrBusinessEntity = resBusinessUnit as Array<any>;
            let listBusinessEntity = arrBusinessEntity
                .filter(elementBE => elementBE.BE)
                .map(elementBE => ({ label: elementBE.BE, value: elementBE.BE }))
                .sort(this.sortAlphabetically());
            listBusinessEntity = [{ label: 'All', value: 'All' }, ...listBusinessEntity];
            return listBusinessEntity;
        };
    }

    /**
    * Function to get distinct business units from pdaf service
    */
    getBusinessUnit() {
        const url = this.urlBusinessUnit;
        return this.httpClient.get(url);
    }
    getFormattedBusinessUnit() {
        const url = this.urlBusinessUnit;
        return this.httpClient.get(url).pipe(
            map(this.formatBusinessUnit())
        );
    }

    /**
     * API call to get primary business unit based on business entity
     * @param businessEntity
     */
    getBusinessUnitBasedOnBE(businessEntity): Observable<any> {
        return forkJoin(businessEntity.pipe(
            map(selectedBusinessEntity => <Observable<any>>this.httpClient.get(`${this.urlGetPrimaryBUBasedOnBE}${selectedBusinessEntity}`))
        ));
    }

    /**
     * filters primary BU based on BE
     * formats the Business Unit response in the format of lable and value to be used in dropdowns
     * @param businessEntity
     */
    getFormattedBusinessUnitBasedOnBE(businessEntity): Observable<any> {
        return forkJoin(businessEntity
            .map(selectedBusinessEntity => <Observable<any>>this.httpClient.get(`${this.urlGetPrimaryBUBasedOnBE}${selectedBusinessEntity}`)
            ))
            .pipe(
                map(this.formatBusinessUnit()),
                map(this.getUniqueDropdownValues())
            );
    }

    retrieveUserInfo(userId: String): Observable<any> {
        return this.httpClient.get(this.environmentService.REST_API_RETRIEVE_USER_INFO_URL + '/' + userId,
            { withCredentials: true });
    }

    private getUniqueDropdownValues(): (value: { label: any; value: any; }[], index: number) => any {
        return resBusinessUnit => _.uniqBy(resBusinessUnit, function (e) {
            return e.label;
        });
    }

    private formatBusinessUnit(): (value: Object, index: number) => { label: any; value: any; }[] {
        return resBusinessUnit => {
            let arrBusinessUnit = resBusinessUnit as Array<any>;
            arrBusinessUnit = _.flatten(arrBusinessUnit);
            let listBusinessUnit = arrBusinessUnit
                .filter(elementBU => elementBU.BUSINESS_UNIT)
                .map(elementBU => ({ label: elementBU.BUSINESS_UNIT, value: elementBU.BUSINESS_UNIT }))
                .sort(this.sortAlphabetically());
            listBusinessUnit = [{ label: 'All', value: 'All' }, ...listBusinessUnit];
            return listBusinessUnit;
        };
    }

    private sortAlphabetically(): (a: { label: any; value: any; }, b: { label: any; value: any; }) => number {
        return (a, b) => a.label < b.label ? -1 : 1;
    }
}
