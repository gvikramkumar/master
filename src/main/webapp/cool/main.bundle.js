webpackJsonp(["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dashboard_dashboard_component__ = __webpack_require__("./src/app/dashboard/dashboard.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__create_offer_cool_create_offer_cool_component__ = __webpack_require__("./src/app/create-offer-cool/create-offer-cool.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mm_assesment_mm_assesment_component__ = __webpack_require__("./src/app/mm-assesment/mm-assesment.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__create_new_offer_create_new_offer_component__ = __webpack_require__("./src/app/create-new-offer/create-new-offer.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: __WEBPACK_IMPORTED_MODULE_2__dashboard_dashboard_component__["a" /* DashboardComponent */]
    },
    {
        path: 'coolOffer',
        component: __WEBPACK_IMPORTED_MODULE_3__create_offer_cool_create_offer_cool_component__["a" /* CreateOfferCoolComponent */]
    },
    {
        path: 'coolOffer/:id',
        component: __WEBPACK_IMPORTED_MODULE_3__create_offer_cool_create_offer_cool_component__["a" /* CreateOfferCoolComponent */]
    },
    {
        path: 'mmassesment/:id',
        component: __WEBPACK_IMPORTED_MODULE_4__mm_assesment_mm_assesment_component__["a" /* MmAssesmentComponent */]
    },
    {
        path: 'createNewOffer',
        component: __WEBPACK_IMPORTED_MODULE_5__create_new_offer_create_new_offer_component__["a" /* CreateNewOfferComponent */]
    }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"]],
            imports: [
                [__WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"].forRoot(routes, { useHash: true })]
            ],
            providers: [],
            declarations: []
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());

// @NgModule({
//   exports: [RouterModule],
//   imports: [
//     CommonModule,
//     [RouterModule.forRoot(routes,{ preloadingStrategy: PreloadAllModules })]
//   ],
//   declarations: []
// })
// export class AppRoutingModule { }


/***/ }),

/***/ "./src/app/app.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<app-header></app-header>\n<div class=\"content\" >\n  <div class=\"container padding-router\">\n    <router-outlet #route=\"outlet\" ></router-outlet>\n  </div>\n</div>\n<app-footer></app-footer>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = /** @class */ (function () {
    function AppComponent(router) {
        var _this = this;
        this.router = router;
        this.router.events.subscribe(function (NavigationEnd) {
            _this.pageName_temp = NavigationEnd;
            _this.pageName = _this.pageName_temp.url;
        });
    }
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-root',
            template: __webpack_require__("./src/app/app.component.html"),
            styles: [__webpack_require__("./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ng_click_outside__ = __webpack_require__("./node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ng_click_outside___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_ng_click_outside__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_routing_module__ = __webpack_require__("./src/app/app-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__header_header_component__ = __webpack_require__("./src/app/header/header.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__footer_footer_component__ = __webpack_require__("./src/app/footer/footer.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__shared_service_service__ = __webpack_require__("./src/app/shared-service.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_ngx_bootstrap_modal__ = __webpack_require__("./node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_ngx_bootstrap_datepicker__ = __webpack_require__("./node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_ngx_perfect_scrollbar__ = __webpack_require__("./node_modules/ngx-perfect-scrollbar/dist/ngx-perfect-scrollbar.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__dashboard_dashboard_component__ = __webpack_require__("./src/app/dashboard/dashboard.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__create_offer_cool_create_offer_cool_component__ = __webpack_require__("./src/app/create-offer-cool/create-offer-cool.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__mm_assesment_mm_assesment_component__ = __webpack_require__("./src/app/mm-assesment/mm-assesment.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__create_new_offer_create_new_offer_component__ = __webpack_require__("./src/app/create-new-offer/create-new-offer.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__right_panel_right_panel_component__ = __webpack_require__("./src/app/right-panel/right-panel.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__services_create_offer_service__ = __webpack_require__("./src/app/services/create-offer.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_primeng_primeng__ = __webpack_require__("./node_modules/primeng/primeng.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21_primeng_primeng__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_primeng_dialog__ = __webpack_require__("./node_modules/primeng/dialog.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_primeng_dialog___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22_primeng_dialog__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__angular_platform_browser_animations__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__services_search_collaborator_service__ = __webpack_require__("./src/app/services/search-collaborator.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25_primeng_table__ = __webpack_require__("./node_modules/primeng/table.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25_primeng_table___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_25_primeng_table__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__services_user_service__ = __webpack_require__("./src/app/services/user.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__services_configuration_service__ = __webpack_require__("./src/app/services/configuration.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




























var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_9__header_header_component__["a" /* HeaderComponent */],
                __WEBPACK_IMPORTED_MODULE_10__footer_footer_component__["a" /* FooterComponent */],
                __WEBPACK_IMPORTED_MODULE_15__dashboard_dashboard_component__["a" /* DashboardComponent */],
                __WEBPACK_IMPORTED_MODULE_16__create_offer_cool_create_offer_cool_component__["a" /* CreateOfferCoolComponent */],
                __WEBPACK_IMPORTED_MODULE_17__mm_assesment_mm_assesment_component__["a" /* MmAssesmentComponent */],
                __WEBPACK_IMPORTED_MODULE_18__create_new_offer_create_new_offer_component__["a" /* CreateNewOfferComponent */],
                __WEBPACK_IMPORTED_MODULE_19__right_panel_right_panel_component__["a" /* RightPanelComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["BrowserModule"],
                __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_router__["RouterModule"],
                __WEBPACK_IMPORTED_MODULE_7__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_7__angular_forms__["ReactiveFormsModule"],
                __WEBPACK_IMPORTED_MODULE_6__app_routing_module__["a" /* AppRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_5_ng_click_outside__["ClickOutsideModule"],
                __WEBPACK_IMPORTED_MODULE_14_ngx_perfect_scrollbar__["a" /* PerfectScrollbarModule */],
                __WEBPACK_IMPORTED_MODULE_12_ngx_bootstrap_modal__["a" /* ModalModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_13_ngx_bootstrap_datepicker__["b" /* BsDatepickerModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["a" /* NgbModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_21_primeng_primeng__["MultiSelectModule"],
                __WEBPACK_IMPORTED_MODULE_22_primeng_dialog__["DialogModule"],
                __WEBPACK_IMPORTED_MODULE_23__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_21_primeng_primeng__["DataTableModule"],
                __WEBPACK_IMPORTED_MODULE_21_primeng_primeng__["DropdownModule"],
                __WEBPACK_IMPORTED_MODULE_25_primeng_table__["TableModule"]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_11__shared_service_service__["a" /* SharedServiceService */],
                __WEBPACK_IMPORTED_MODULE_20__services_create_offer_service__["a" /* CreateOfferService */],
                __WEBPACK_IMPORTED_MODULE_24__services_search_collaborator_service__["a" /* SearchCollaboratorService */],
                __WEBPACK_IMPORTED_MODULE_26__services_user_service__["a" /* UserService */],
                __WEBPACK_IMPORTED_MODULE_27__services_configuration_service__["a" /* ConfigurationService */],
                {
                    provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["APP_INITIALIZER"],
                    multi: true,
                    useFactory: function (config) { return function () { return config.init(); }; },
                    deps: [__WEBPACK_IMPORTED_MODULE_27__services_configuration_service__["a" /* ConfigurationService */], __WEBPACK_IMPORTED_MODULE_26__services_user_service__["a" /* UserService */]]
                }
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/create-new-offer/create-new-offer.component.css":
/***/ (function(module, exports) {

module.exports = ".contentBox {\n  display: inline-block;\n  width: 100%;\n}\n\n.leftContent,\n.rightContent {\n  float: left;\n}\n\n.leftContent {\n  width: calc(100% - 400px);\n  padding-right: 15px;\n}\n\n.rightContent {\n  width: 400px;\n}\n\n/**Modal CSS Start**/\n\n.table-modal td, .table-modal th{\n  padding: 0 9px !important;\n  border: #dfdfdf 1px solid;\n}\n\n.addSpace th, .addSpace td {\n  padding-top: 9px !important;\n  padding-bottom: 9px !important;\n}\n\n/**Modal CSS End**/\n\n.partial-aligned {\n  color: rgb(249, 189, 79);\n}"

/***/ }),

/***/ "./src/app/create-new-offer/create-new-offer.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"panel-wrapper mt-15\">\n    <ul class=\"breadcrumb\">\n        <li><a routerLink=\"/dashboard\">Dashboard</a></li>\n        <li><a [routerLink]=\"['/coolOffer']\">Create New Offer</a></li>\n        <li><a [routerLink]=\"['/mmassesment']\" >Offer Dimension & MM Assessment</a></li>\n        <li><span>Offer Portfolio</span></li>\n      </ul>\n    <h5 class=\"mt-10 mainTitle\">  <span class=\"icon-chevron-left icon-small ico-blue mr-10 curPointer\" [routerLink]=\"['/mmassesment']\"></span> Create New Offer (Offer ID T-SNS-324232)</h5>\n\n    <div class=\"contentBox mt-10\">\n        <div class=\"leftContent\">\n          <div class=\"panel-wrapper\">\n            <div class=\"panel-heading mt-10\">\n              <h6 class=\"text-left\">\n                <span class=\"icon-small ico-blue curPointer mr-10\" [ngClass]=\"{'icon-chevron-up':panels.panel1,'icon-chevron-down':!panels.panel1}\"\n                  (click)=\"panels.panel1 = !panels.panel1\"></span>\n    \n                <span class=\"acc-title\">Offer Portfolio</span>\n    \n              </h6>\n            </div>\n            <div class=\"panel-body mt-10 offerData\" *ngIf=\"panels.panel1\">\n                <div class=\"row mt-5\">\n                  <div class=\"col-md-4 labelBlue\">\n                    <label>Offer Name</label>\n                    <p>{{offerData.offname}}</p>\n                  </div>\n                  <div class=\"col-md-8 labelBlue\">\n      \n                    <label>Offer Description</label>\n                    <p>{{offerData.desc}}</p>\n      \n                  </div>\n                </div>\n      \n                <div class=\"row mt-15 offerData\">\n                  <div class=\"col-md-4 labelBlue\">\n                    <label>Expected Launch Date</label>\n                    <p>{{offerData.launch_date}}</p>\n                  </div>\n                  <div class=\"col-md-4 labelBlue\">\n      \n                    <label>Business Unit</label>\n                    <p>{{offerData.busunit}}</p>\n      \n                  </div>\n                  <div class=\"col-md-4 labelBlue\">\n                    <label>Business Entity</label>\n                    <p>{{offerData.busentity}}</p>\n                  </div>\n                </div>\n              </div>\n          </div>\n\n\n\n          <div class=\"panel-wrapper mt-20\">\n              <div class=\"panel-heading mt-10\">\n                <h6 class=\"text-left\">\n                    <span class=\"icon-small ico-blue curPointer mr-10\" [ngClass]=\"{'icon-chevron-up':panels.panel2,'icon-chevron-down':!panels.panel2}\"></span>\n                  <span class=\"acc-title\">MM4- SAAS</span>\n                </h6>\n              </div>\n              \n            </div>\n\n\n\n          <!-- <div class=\"panel-wrapper searchBox mt-10 mb-10\" style=\"padding-bottom: 12px;\">\n            <h5 class=\"d-inline\" style=\"font-weight: 400\">SAAS\n                <span class=\"partial-aligned\" style=\"opacity:0.8;font-size:12px;margin-left:10px;\">\n                    <span class=\"icon-exclamation-triangle icon-small v-small\"></span>\n                    <span> PARTIALLY ALIGNED </span>\n                  </span>\n            </h5>\n            <span class=\"pull-right\"><button class=\"btn btn--primary btn--small\">Export</button></span>\n          </div> -->\n\n          <div class=\"panel-wrapper mt-20\">\n              <div class=\"panel-heading mt-10 noBorder\">\n                <h6 class=\"text-left\">\n                  \n      \n                  <span class=\"acc-title\">Strategy Review Status</span>\n                  <span class=\"pull-right fontSmall\" style=\"padding-top: 8px;\"><a href=\"javascript:void(0)\">+ Add New</a></span>\n      \n                </h6>\n              </div>\n              <div class=\"panel-body mt-5\" *ngIf=\"panels.panel1\">\n                  <table class=\"table table-cool table-modal addSpace\">\n                      <thead>\n                        <tr>\n                          <th class=\"noBorderBottom\" style=\"width:25%\">Function</th>\n                          <th class=\"noBorderBottom\" style=\"width:25%\">Approval Status</th>\n                          <th class=\"noBorderBottom\" style=\"width:25%\">Approved On</th>\n                          <th class=\"noBorderBottom\" style=\"width:25%\"></th>\n                        </tr>\n                        <tr>\n                          <th class=\"noBorderTop\" style=\"padding-top: 0 !important;padding-bottom: 0 !important\"></th>\n                          <th class=\"noBorderTop\" style=\"padding-top: 0 !important;padding-bottom: 0 !important\">\n                              <div class=\"form-group\">\n                                  <div class=\"form-group__text select\">\n                                    <select name=\"select1\">\n                                      <option value=\"0\" selected>Filter</option>\n                                      <option value=\"option1\">Approver</option>\n                                      <option value=\"option2\">Pending</option>\n                                      <option value=\"option3\">Conditionally Approved</option>\n                                    </select>\n                                  </div>\n                                </div>\n                          </th>\n                          <th class=\"noBorderTop\" style=\"padding-top: 0 !important;padding-bottom: 0 !important\"></th>\n                          <th class=\"noBorderTop\" style=\"padding-top: 0 !important;padding-bottom: 0 !important\"></th>\n                        </tr>\n                      </thead>\n                      <tbody>\n                          <tr *ngFor=\"let item of strategyReviewData; let i =index;\">\n                              <td>{{item.functionaName}}</td>\n                              <td>\n                               <span class=\"d-inline\" style=\"line-height: 26px;\">\n                                 <span class=\"icons\"  [ngClass]=\"{'iconCompleted': item.approvalStatus==='Auto Approved'|| item.approvalStatus==='Approved','iconError': item.approvalStatus==='Pending'|| item.approvalStatus==='Conditionally Approved'}\"></span>\n                                 {{item.approvalStatus}}\n                                </span>\n                              </td>                              \n                              <td>{{item.approvedOn}}</td>\n                              <td>{{item.owner}}</td>\n                            </tr>\n                      </tbody>\n                      </table>\n\n                      <div class=\"mt-20 mb-20\">\n                        <a href=\"javascript:void(0)\"><span class=\"icon-download icon-medium mr-10\"> </span>     Download B-View Deck </a>\n                      </div>\n                \n              </div>\n            </div>\n\n          </div>\n\n          <div class=\"rightContent\" style=\"margin-top: -5px;\">\n              \n                      \n                \n              <app-right-panel [portfolioFlag]=\"setFlag\"></app-right-panel>\n\n          </div>\n          \n          </div>\n</div>\n\n<!-- Roles description custom popup -->\n<div class=\"custom-modal delivery_desc_popup\" *ngIf=\"backdropCustom\" >\n    <h5 class=\"headerTittle arrowBack\">\n        Add Collaborators \n           <span class=\"TOESprite close-icon pull-right curPointer\" (click)=\"backdropCustom = false\" > </span>\n    </h5>\n    <div class=\"custom-modal-body\">\n            <div class=\"txtDesc searchSec\">\n                <div class=\"panel-wrapper\">\n                    <h6 class=\"innerTittle\">\n                        Search Collaborators\n                     </h6> \n                     <div class=\"panel-body\">\n                        <div class=\"row mt-10 width100\">\n                            <div class=\"d-inline col-md-6\">\n                                <input id=\"typeahead-basic\"\n                                type=\"text\" \n                                class=\"form-control autocomplete\"                                          \n                                 [(ngModel)]=\"model\"\n                                  [ngbTypeahead]=\"search\"\n                                  placeholder=\"Search by name, email or function \" \n                                  />\n                                  <span class=\"icon-search icon-small v-small curPointer\"></span>\n                            </div>\n                            <div class=\"d-inline col-md-4\">\n                                <div class=\"form-group\">\n                                    <div class=\"form-group__text select\">\n                                        <select name=\"select1\">\n                                            <option value=\"0\" selected>Select Function</option>\n                                            <option value=\"option1\">Pricing</option>\n                                            <option value=\"option2\">Finance</option>\n                                          </select>\n                                    </div>\n                                  </div>\n                                \n                            </div>\n                            <div class=\"col-md-2\">\n                                <button class=\"btn btn--small btn--primary btn-analytic\">Search</button>\n                            </div>\n                        </div>\n                        \n                        \n                        \n                     </div>\n                    </div>\n                <div class=\"panel-wrapper mt-10\">\n                    <h6 class=\"innerTittle\">\n                        Search Results\n                     </h6>  \n                      <table class=\"table table-cool table-modal mt-10\">\n                       <thead>\n                         <tr>\n                           <th style=\"width:6%\">\n                               <label class=\"checkbox\">\n                                   <input type=\"checkbox\">\n                                   <span class=\"checkbox__input\"></span>\n                               </label>\n                           </th>\n                           <th>Name</th>\n                           <th>Email Id</th>\n                           <th>Function</th>\n                           <th>Position</th>\n                         </tr>\n                       </thead>\n                       <tbody>\n                         <tr *ngFor=\"let x of resultTable\">\n                           <td>\n                               <label class=\"checkbox\">\n                                   <input type=\"checkbox\">\n                                   <span class=\"checkbox__input\"></span>\n                               </label>\n                           </td>\n                           <td>{{x.name}}</td>\n                           <td>{{x.id}}</td>\n                           <td>{{x.function}}</td>\n                           <td>\n                              <div class=\"form-group\">\n                                  <div class=\"form-group__text select\">\n                                    <select name=\"select1\">\n                                      <option value=\"0\" selected>Select Owner</option>\n                                      <option value=\"option1\">Owner</option>\n                                      <option value=\"option2\">Co-Owner</option>\n                                    </select>\n                                  </div>\n                                </div>\n                           </td>\n                         </tr>\n                       </tbody>\n                     </table> \n                </div>\n                <div class=\"modal-footer\">\n                  <div class=\"pull-right\">\n                      <button class=\"btn btn--small\" (click)=\"onCancelClick()\">Cancel</button>\n                      <button class=\"btn btn--small btn--primary\" (click)=\"onSaveClick()\">Save</button>\n                  </div>\n                </div>\n            </div>\n    </div>\n  \n  </div>  \n  \n  <div class=\"backdrop-custom\" *ngIf=\"backdropCustom\" ></div>\n  <!--// -->"

/***/ }),

/***/ "./src/app/create-new-offer/create-new-offer.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateNewOfferComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_debounceTime__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/debounceTime.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_distinctUntilChanged__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/distinctUntilChanged.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_create_offer_service__ = __webpack_require__("./src/app/services/create-offer.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var searchOptions = ['Option1', 'Option2', 'Option3', 'Option4'];
var CreateNewOfferComponent = /** @class */ (function () {
    function CreateNewOfferComponent(createOfferService) {
        this.createOfferService = createOfferService;
        this.search = function (text$) {
            return text$
                .debounceTime(200)
                .distinctUntilChanged()
                .map(function (term) { return term.length < 0 ? []
                : searchOptions.filter(function (v) { return v.toLowerCase().indexOf(term.toLowerCase()) > -1; }).slice(0, 10); });
        };
        this.backdropCustom = false;
        this.reqType = 'state';
        this.offerData = {
            "offname": this.createOfferService.coolOffer.offerName,
            "desc": this.createOfferService.coolOffer.offerDesc,
            "launch_date": new Date(this.createOfferService.coolOffer.expectedLaunchDate),
            "busunit": this.createOfferService.coolOffer.businessUnit,
            "busentity": this.createOfferService.coolOffer.businessEntity
        };
        this.tabindex = 0;
        this.tabView = false;
        this.panels = {
            "panel1": true,
            "panel2": true
        };
        this.userPanels = {
            "panel1": false,
            "panel2": true
        };
        this.dotBox = [
            {
                status: "Completed",
                statuscontent: "Initial MM Assesment"
            },
            {
                status: "Completed",
                statuscontent: "Initial offer Dimension"
            },
            {
                status: "In Progress",
                statuscontent: "Stakeholders Identified"
            },
            {
                status: "Completed",
                statuscontent: "Offer Portfolio"
            },
            {
                status: "In Progress",
                statuscontent: "Strategy Review Completion"
            },
            {
                status: "Pending",
                statuscontent: "Offer Construct Details"
            }
        ];
        this.resultTable = [
            {
                name: 'Mary Adams',
                id: 'madams@altus.com',
                function: 'Pricing'
            },
            {
                name: 'Gina Silva',
                id: 'gsilva@altus.com',
                function: 'Finance'
            },
            {
                name: 'Derek Brian',
                id: 'dbrian@altus.com',
                function: 'Pricing'
            },
        ];
        this.toggleFilter = false;
        this.strategyReviewData = [
            {
                "functionaName": "CSPP",
                "approvalStatus": "Auto Approved",
                "approvedOn": "",
                "owner": ""
            },
            {
                "functionaName": "CPS",
                "approvalStatus": "Pending",
                "approvedOn": "9-Aug-2018",
                "owner": "John Thomas (FM)"
            },
            {
                "functionaName": "Compensation Ops",
                "approvalStatus": "Approved",
                "approvedOn": "5-Aug-2018",
                "owner": "Sean Parker(OPS)"
            },
            {
                "functionaName": "Royelty Team",
                "approvalStatus": "Conditionally Approved",
                "approvedOn": "4-Aug-2018",
                "owner": "Conditionally Approved"
            }
        ];
    }
    CreateNewOfferComponent.prototype.ngOnInit = function () {
        this.setFlag = true;
    };
    CreateNewOfferComponent.prototype.show_deliveryDesc = function () {
        this.backdropCustom = true;
    };
    CreateNewOfferComponent.prototype.onSaveClick = function () {
        this.backdropCustom = false;
    };
    CreateNewOfferComponent.prototype.onCancelClick = function () {
        this.backdropCustom = false;
    };
    CreateNewOfferComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-create-new-offer',
            template: __webpack_require__("./src/app/create-new-offer/create-new-offer.component.html"),
            styles: [__webpack_require__("./src/app/create-new-offer/create-new-offer.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__services_create_offer_service__["a" /* CreateOfferService */]])
    ], CreateNewOfferComponent);
    return CreateNewOfferComponent;
}());



/***/ }),

/***/ "./src/app/create-offer-cool/add-edit-collaborator.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddEditCollaborator; });
var AddEditCollaborator = /** @class */ (function () {
    function AddEditCollaborator(name, businessEntity, functionName) {
        this.name = name;
        this.businessEntity = businessEntity;
        this.functionName = functionName;
    }
    return AddEditCollaborator;
}());



/***/ }),

/***/ "./src/app/create-offer-cool/create-offer-cool.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/create-offer-cool/create-offer-cool.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"section\">\n    <div class=\"row\">\n      <div class=\"col-md-2\"></div>\n      <div class=\"col-md-8\">\n        <div class=\"card card--raised base-margin-top\">\n          <div class=\"panel\">\n            <div class=\"card__header\">\n              <h4 class=\"card__title\">Create New Offer</h4>\n              <div class=\"card__subtitle\">Offer Info</div>\n            </div>\n            <form [formGroup]=\"offerCreateForm\" (ngSubmit)=\"createOffer()\">\n              <div class=\"row base-margin-top\">\n                <div class=\"col-md-6\">\n                  <div class=\"form-group half-margin-bottom\">\n                    <div class=\"form-group__text\">\n                      <label for=\"offerName\">Offer Name</label>\n                      <input\n                        id=\"offerName\"\n                        type=\"text\"\n                        class=\"form-control\"\n                        formControlName=\"offerName\"\n                        (focusout)=\"createOfferId(offerName)\"/>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"col-md-6\">\n                  <div class=\"form-group half-margin-bottom\">\n                    <div class=\"form-group__text\">\n                      <label for=\"offerDesc\">Offer Description</label>\n                      <input\n                        id=\"offerDesc\"\n                        type=\"text\"\n                        class=\"form-control\"\n                        formControlName=\"offerDesc\">\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <div class=\"row base-margin-top\">\n                <div class=\"col-md-6\">\n                  <div class=\"form-group half-margin-bottom\">\n                    <label for=\"selectedValue\">Primary Business Unit</label>\n                    <p-multiSelect\n                      id=\"selectedValue\"\n                      class=\"form-control\"\n                      formControlName=\"primaryBUList\"\n                      [options]=\"primaryBusinessUnits\"\n                      [panelStyle]=\"{minWidth:'25em'}\">\n                    </p-multiSelect>\n                  </div>\n                </div>\n                <div class=\"col-md-6\">\n                  <div class=\"form-group half-margin-bottom\">\n                    <label for=\"selectedBeValue\">Primary Business Entity</label>\n                    <p-multiSelect\n                      id=\"selectedBeValue\"\n                      class=\"form-control\"\n                      formControlName=\"primaryBEList\"\n                      [options]=\"primaryBusinessEntities\"\n                      [panelStyle]=\"{minWidth:'25em'}\">\n                    </p-multiSelect>\n                  </div>\n                </div>\n              </div>\n              <div class=\"row base-margin-top\">\n                <div class=\"col-md-6\">\n                  <div class=\"form-group half-margin-bottom\">\n                    <label for=\"selectedSValue\">Secondary Business Unit</label>\n                    <p-multiSelect\n                      id=\"selectedSValue\"\n                      class=\"form-control\"\n                      formControlName=\"secondaryBUList\"\n                      [options]=\"secondaryBusinessUnits\"\n                      (onChange)=\"getSecondaryBusinessEntity($event.value)\"\n                      [panelStyle]=\"{minWidth:'25em'}\">\n                    </p-multiSelect>\n                  </div>\n                </div>\n                <div class=\"col-md-6\">\n                  <div class=\"form-group half-margin-bottom\">\n                    <label for=\"selectedSeValue\">Secondary Business Entity</label>\n                    <p-multiSelect\n                      id=\"selectedSeValue\"\n                      class=\"form-control\"\n                      formControlName=\"secondaryBEList\"\n                      [options]=\"secondaryBusinessEntities\"\n                      [panelStyle]=\"{minWidth:'25em'}\">\n                    </p-multiSelect>\n                  </div>\n                </div>\n              </div>\n              <div class=\"row\">\n                <div class=\"col-md-6\">\n                  <div\n                    class=\"form-group label--floated input--icon half-margin-bottom\">\n                    <div class=\"form-group__text\">\n                      <input\n                        required\n                        class=\"form-control\"\n                        formControlName=\"strategyReviewDate\"\n                        #dp1=\"bsDatepicker\"\n                        bsDatepicker\n                        placement=\"bottom\"\n                        containerClass=\"custome-date\"\n                        [bsConfig]=\"dpConfig\"\n                        [(ngModel)]=\"expectedStrategyReviewDate\"\n                        >\n                      <label id=\"strategyReviewDate\" for=\"strategyReviewDate\">Strategy Review Date</label>\n                      <button type=\"button\" class=\"link\" tabindex=\"-1\">\n                        <span class=\"icon-month\"></span>\n                      </button>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"col-md-6\">\n                  <div\n                    class=\"form-group label&#45;&#45;floated input&#45;&#45;icon half-margin-bottom\">\n                    <div class=\"form-group__text\">\n                      <input\n                        required\n                        class=\"form-control\"\n                        formControlName=\"designReviewDate\"\n                        id=\"designReviewDate\"\n                        #dp2=\"bsDatepicker\"\n                        bsDatepicker\n                        placement=\"bottom\"\n                        containerClass=\"custome-date\"\n                        [bsConfig]=\"dpConfig\"\n                        [(ngModel)]=\"expectedDesignReviewDate\"\n                        >\n                      <label for=\"designReviewDate\">Design Review Date</label>\n                      <button type=\"button\" class=\"link\" tabindex=\"-1\">\n                        <span class=\"icon-month\"></span>\n                      </button>\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <div class=\"row\">\n                <div class=\"col-md-6\">\n                  <div\n                    class=\"form-group label--floated input--icon half-margin-bottom\">\n                    <div class=\"form-group__text\">\n                      <input\n                        required\n                        class=\"form-control\"\n                        formControlName=\"readinessReviewDate\"\n                        id=\"readinessReviewDate\"\n                        #dp3=\"bsDatepicker\"\n                        bsDatepicker\n                        placement=\"bottom\" containerClass=\"custome-date\"\n                        [bsConfig]=\"dpConfig\"\n                        [(ngModel)]=\"expectedReadinessReviewDate\"\n                        >\n                      <label for=\"readinessReviewDate\">Readiness Review Date</label>\n                      <button type=\"button\" class=\"link\" tabindex=\"-1\">\n                        <span class=\"icon-month\"></span>\n                      </button>\n                    </div>\n                  </div>\n                </div>\n                <div class=\"col-md-6\">\n                  <div\n                    class=\"form-group label--floated input--icon half-margin-bottom\">\n                    <div class=\"form-group__text\">\n                      <input\n                        required\n                        class=\"form-control\"\n                        formControlName=\"expectedLaunchDate\"\n                        id=\"launchDate\"\n                        #dp4=\"bsDatepicker\"\n                        bsDatepicker\n                        placement=\"bottom\"\n                        containerClass=\"custome-date\"\n                        [bsConfig]=\"dpConfig\"\n                        [(ngModel)]=\"expectedLaunchDate\"\n                        >\n                      <label for=\"launchDate\">Launch Date</label>\n                      <button type=\"button\" class=\"link\" tabindex=\"-1\">\n                        <span class=\"icon-month\"></span>\n                      </button>\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <div class=\"form-actions\">\n                <button class=\"btn base-margin-top\" type=\"submit\">Save</button>\n                <button class=\"btn btn--primary base-margin-top\">Proceed to Offer Builder</button>\n              </div>\n            </form>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-md-2\"></div>\n    </div>\n  </div>\n  <p-dialog header=\"Add or Edit Collaborators\" closable=\"true\" modal=\"true\" closable=\"false\" showHeader=\"false\" [responsive]=\"true\" [width]=\"900\" [minWidth]=\"200\" [minY]=\"70\" [(visible)]=\"display\">\n    <form [formGroup]=\"addEditCollaboratorsForm\" (ngSubmit)=\"onSearch()\">\n      <div class=\"row\">\n        <div class=\"col-md-3\">\n          <div class=\"form-group half-margin-bottom\">\n            <div class=\"form-group__text\">\n              <input\n                id=\"name\"\n                placeholder=\"Search by Name, Email\"\n                class=\"form-control\"\n                formControlName=\"name\">\n            </div>\n          </div>\n        </div>\n        <div class=\"col-md-3\">\n          <div class=\"form-group half-margin-bottom\">\n            <div class=\"form-group__text select\">\n              <select id=\"selectedSearchBe\" class=\"form-control\" formControlName=\"businessEntity\">\n                <option [ngValue]=\"null\">Business Entity</option>\n                <option *ngFor=\"let businessEntity of entityList\" value={{businessEntity}}>\n                  {{businessEntity}}</option>\n              </select>\n            </div>\n          </div>\n        </div>\n        <div class=\"col-md-3\">\n          <div class=\"form-group half-margin-bottom\">\n            <div class=\"form-group__text select\">\n              <select id=\"selectedFunction\" class=\"form-control\" formControlName=\"functionName\">\n                <option [ngValue]=\"null\">Function</option>\n                <option *ngFor=\"let businessEntity of entityList\" value={{businessEntity}}>\n                  {{businessEntity}}</option>\n              </select>\n            </div>\n          </div>\n        </div>\n        <button class=\"btn btn&#45;&#45;secondary\" type=\"submit\">Search</button>\n      </div>\n    </form>\n    <p-dataTable [value]=\"collaboratorsList\" [(selection)]=\"selectedCollabs\" dataKey=\"Function\" #dt>\n      <p-column selectionMode=\"multiple\"></p-column>\n      <p-column field=\"Function\" header=\"Function\"></p-column>\n      <p-column field=\"Roles\" header=\"Roles\">\n        <ng-template let-col let-roles=\"rowData\" let-ri=\"rowIndex\" pTemplate=\"body\">\n          <p-dropdown\n            [(ngModel)]=\"roles.Roles[col.field]\"\n            [options]=\"roles.Roles\"\n            [autoWidth]=\"false\"\n            [style]=\"{'width':'100%'}\"\n            required=\"true\"\n            appendTo=\"body\">\n          </p-dropdown>\n        </ng-template>\n      </p-column>\n      <p-column field=\"Name\" header=\"Name\"></p-column>\n      <p-column field=\"Email\" header=\"Email\"></p-column>\n      <p-column field=\"BusinessEntity\" header=\"BusinessEntity\"></p-column>\n    </p-dataTable>\n    <div class=\"modal__footer\">\n      <div class=\"card__footer form-actions\">\n        <button class=\"btn base-margin-top\" (click)=\"closeDailog()\">Cancel</button>\n        <button class=\"btn btn&#45;&#45;primary base-margin-top\" (click)=\"addCollaborator()\">Add</button>\n      </div>\n    </div>\n  </p-dialog>\n  <button type=\"text\" (click)=\"showDialog()\" pButton icon=\"pi pi-info-circle\">Add/Edit</button>\n</div>\n"

/***/ }),

/***/ "./src/app/create-offer-cool/create-offer-cool.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateOfferCoolComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ngx_bootstrap_datepicker__ = __webpack_require__("./node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_create_offer_service__ = __webpack_require__("./src/app/services/create-offer.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__create_offer__ = __webpack_require__("./src/app/create-offer-cool/create-offer.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__add_edit_collaborator__ = __webpack_require__("./src/app/create-offer-cool/add-edit-collaborator.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_search_collaborator_service__ = __webpack_require__("./src/app/services/search-collaborator.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_user_service__ = __webpack_require__("./src/app/services/user.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






347;



var CreateOfferCoolComponent = /** @class */ (function () {
    function CreateOfferCoolComponent(createOfferService, router, activatedRoute, searchCollaboratorService, userService) {
        var _this = this;
        this.createOfferService = createOfferService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.searchCollaboratorService = searchCollaboratorService;
        this.userService = userService;
        this.panels = {
            'panel1': true,
            'panel2': true
        };
        this.selectedQuestionAnswer = {};
        this.dpConfig = new __WEBPACK_IMPORTED_MODULE_2_ngx_bootstrap_datepicker__["a" /* BsDatepickerConfig */]();
        this.display = false;
        this.myCollaborators = [
            {
                'Function': 'OLE',
                'Roles': [
                    { label: 'Owner', value: 'owner' },
                    { label: 'Co-owner', value: 'coowner' },
                    { label: 'Reviewer', value: 'reviewer' }
                ],
                'Name': 'Scott Collins',
                'Email': 'scollins@altus.com',
                'BusinessEntity': 'Data Center'
            },
            {
                'Function': 'SOE',
                'Roles': [
                    { label: 'Owner2', value: 'owner2' },
                    { label: 'Co-owner2', value: 'coowner2' },
                    { label: 'Reviewer2', value: 'reviewer2' }
                ],
                'Name': 'John Smith',
                'Email': 'jsmith@altus.com',
                'BusinessEntity': 'Collaboration'
            },
            {
                'Function': 'CPS',
                'Roles': [
                    { label: 'Owner1', value: 'owner1' },
                    { label: 'Co-owner1', value: 'coowner1' },
                    { label: 'Reviewer1', value: 'reviewer1' }
                ],
                'Name': 'Ian Flemming',
                'Email': 'iflemming@altus.com',
                'BusinessEntity': 'Security'
            }
        ];
        this.dpConfig.containerClass = 'theme-green custome-date';
        this.createOfferService.getOfferBox().subscribe(function (data) {
            _this.offerBox = data;
        });
        this.createOfferService.getQuestionsBox().subscribe(function (data) {
            _this.questionBox = data;
        });
        this.createOfferService.getAllBusinessUnit().subscribe(function (data) {
            _this.businessUnitList = data;
        });
        this.createOfferService.getBusinessUnitAndEntity().subscribe(function (data) {
            _this.businessUnitAndEntityList = data;
            var primaryBuArry = [];
            var primaryBeArry = [];
            _this.businessUnitAndEntityList.primaryBU.forEach(function (element) {
                primaryBuArry.push({ label: element, value: element });
            });
            _this.businessUnitAndEntityList.primaryBE.forEach(function (element) {
                primaryBeArry.push({ label: element, value: element });
            });
            _this.primaryBusinessUnits = primaryBuArry;
            _this.primaryBusinessEntities = primaryBeArry;
        });
        this.createOfferService.getAllBusinessEntity().subscribe(function (data) {
            _this.businessEntityList = data;
        });
        this.createOfferService.getSecondaryBusinessUnit().subscribe(function (data) {
            _this.secondaryBusinessUnitList = data;
            var secondaryBuArry = [];
            _this.secondaryBusinessUnitList.forEach(function (element) {
                secondaryBuArry.push({ label: element.BUSINESS_UNIT, value: element.BUSINESS_UNIT });
            });
            _this.secondaryBusinessUnits = secondaryBuArry;
        });
        this.activatedRoute.params.subscribe(function (params) {
            _this.offerId = params['id'];
        });
    }
    CreateOfferCoolComponent.prototype.createOfferId = function (offerText) {
        var _this = this;
        if (this.createOfferService.coolOffer.offerId == null) {
            this.createOfferService.coolOffer.offerName = offerText;
            this.createOfferService.postDataForOfferId(this.createOfferService.coolOffer)
                .subscribe(function (data) {
                _this.disableOfferName = true;
                _this.createOfferService.coolOffer = data;
                _this.offerId = _this.createOfferService.coolOffer.offerId;
            });
        }
    };
    CreateOfferCoolComponent.prototype.getDate = function (millis) {
        if (millis !== undefined) {
            var date = new Date(millis);
            return date;
        }
        return null;
    };
    CreateOfferCoolComponent.prototype.removeDuplicates = function (myArr, prop) {
        return myArr.filter(function (obj, pos, arr) {
            return arr.map(function (mapObj) { return mapObj[prop]; }).indexOf(obj[prop]) === pos;
        });
    };
    CreateOfferCoolComponent.prototype.getSecondaryBusinessEntity = function (event) {
        var _this = this;
        this.createOfferService.getSecondaryBusinessEntity(event.toString())
            .subscribe(function (data) {
            _this.secondaryBusinessEntityList = data;
            var secondaryBeArry = [];
            _this.secondaryBusinessEntityList.forEach(function (element) {
                secondaryBeArry.push({ label: element.BE, value: element.BE });
            });
            _this.secondaryBusinessEntities = _this.removeDuplicates(secondaryBeArry, 'label');
        });
    };
    CreateOfferCoolComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createOfferService.getBusinessUnitAndEntity()
            .subscribe(function (data) {
            _this.entityList = data.primaryBE;
        });
        this.addEditCollaboratorsForm = new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormGroup"]({
            name: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"](null, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required),
            businessEntity: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"](null, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required),
            functionName: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"](null, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required)
        });
        this.offerCreateForm = new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormGroup"]({
            offerName: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"]('', __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required),
            offerDesc: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"]('', __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required),
            primaryBUList: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"](null, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required),
            primaryBEList: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"](null, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required),
            BUSINESS_UNIT: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"](null, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required),
            BE: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"](null, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required),
            secondaryBUList: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"](null, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required),
            secondaryBEList: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"](null, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required),
            strategyReviewDate: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"]('', __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required),
            designReviewDate: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"]('', __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required),
            readinessReviewDate: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"]('', __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required),
            expectedLaunchDate: new __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormControl"]('', __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required)
        });
        this.mmMapperUserChoice = 'DO';
    };
    CreateOfferCoolComponent.prototype.showDialog = function () {
        this.display = true;
    };
    CreateOfferCoolComponent.prototype.closeDailog = function () {
        this.display = false;
        this.addEditCollaboratorsForm.reset();
    };
    CreateOfferCoolComponent.prototype.onSearch = function () {
        var _this = this;
        var searchCollaborator = new __WEBPACK_IMPORTED_MODULE_6__add_edit_collaborator__["a" /* AddEditCollaborator */](this.addEditCollaboratorsForm.controls['name'].value, this.addEditCollaboratorsForm.controls['businessEntity'].value, this.addEditCollaboratorsForm.controls['functionName'].value);
        this.searchCollaboratorService.searchCollaborator(searchCollaborator)
            .subscribe(function (data) {
            _this.collaboratorsList = data;
        }, function (error) {
            console.log('error occured');
            _this.collaboratorsList = _this.myCollaborators;
        });
    };
    CreateOfferCoolComponent.prototype.addCollaborator = function () {
        console.log(this.selectedCollabs);
        this.searchCollaboratorService.addCollaborators(this.selectedCollabs).subscribe();
    };
    CreateOfferCoolComponent.prototype.selectUserMMChoice = function (mmMapperUserChoice) {
        this.mmMapperUserChoice = mmMapperUserChoice;
    };
    CreateOfferCoolComponent.prototype.mmSelected = function (selectedMM, mmArray) {
        this.mmId = selectedMM.mmId;
        selectedMM.selected = true;
        mmArray.forEach(function (mm) {
            if (mm.mmId !== selectedMM.mmId) {
                mm.selected = false;
            }
        });
    };
    CreateOfferCoolComponent.prototype.questionSelected = function (question, questionChoice) {
        if (undefined == questionChoice.selected) {
            questionChoice.selected = false;
        }
        questionChoice.selected = !questionChoice.selected;
        this.updateQuestionSelection(question, questionChoice, questionChoice.selected);
    };
    CreateOfferCoolComponent.prototype.updateQuestionSelection = function (question, questionChoice, selectedFlag) {
        var choiceArray = this.selectedQuestionAnswer[question.questionID];
        if (choiceArray === undefined || choiceArray == null) {
            choiceArray = Array();
        }
        if (selectedFlag) {
            choiceArray.push(questionChoice.choiceName);
        }
        else {
            var index = choiceArray.indexOf(questionChoice.choiceName);
            choiceArray.splice(index, 1);
        }
        this.selectedQuestionAnswer[question.questionID] = choiceArray;
    };
    CreateOfferCoolComponent.prototype.updateOffer = function (model, selectedValue) {
        if (model == 'offerDesc') {
            this.createOfferService.coolOffer.offerDesc = this.offerDesc;
        }
        else if (model === 'expectedLaunchDate') {
            this.createOfferService.coolOffer.expectedLaunchDate = this.expectedLaunchDate;
        }
        this.updateOfferWithChanges();
    };
    CreateOfferCoolComponent.prototype.updateOfferWithChanges = function () {
        var _this = this;
        this.createOfferService.postDataForOfferId(this.createOfferService.coolOffer).subscribe(function (data) {
            _this.createOfferService.coolOffer = data;
        });
    };
    CreateOfferCoolComponent.prototype.openMMAssignment = function () {
        var _this = this;
        if (this.mmMapperUserChoice === 'DO') {
            this.Obj = {
                'offerId': this.createOfferService.coolOffer.offerId,
                'mmChoice': this.mmMapperUserChoice,
                'mmId': this.mmId
            };
        }
        else if (this.mmMapperUserChoice === 'DONT') {
            this.Obj = {
                'offerId': this.createOfferService.coolOffer.offerId,
                'mmChoice': this.mmMapperUserChoice,
                'questionAnswer': this.selectedQuestionAnswer
            };
        }
        if (this.mmMapperUserChoice === 'DONT'
            && this.selectedQuestionAnswer === {}) {
            alert('Please select question choices');
            return;
        }
        else if (this.mmMapperUserChoice === 'DO'
            && (this.mmId === '' || this.mmId === undefined)) {
            alert('Please select MM');
            return;
        }
        this.createOfferService.postDataofMmMapper(this.Obj).subscribe(function (data) {
            var response = data;
            if (response.status != 'FAILED') {
                _this.router.navigate(['/mmassesment/' + _this.offerId]);
            }
            else {
                alert(response.exception);
            }
        });
    };
    CreateOfferCoolComponent.prototype.selectBUAndBE = function (model, value) {
        if (model === 'businessEntity') {
            this.createOfferService.coolOffer.businessEntity = value;
            this.createOfferService.coolOffer.expectedLaunchDate = this.expectedLaunchDate;
        }
        else if (model === 'businessUnit') {
            this.createOfferService.coolOffer.businessUnit = value;
            this.createOfferService.coolOffer.expectedLaunchDate = this.expectedLaunchDate;
        }
        this.updateOfferWithChanges();
    };
    CreateOfferCoolComponent.prototype.selectSBUAndSBE = function (model, value) {
        if (model === 'secondaryBusinessEntity') {
            this.createOfferService.coolOffer.secondaryBusinessEntity = value;
            this.createOfferService.coolOffer.expectedLaunchDate = this.expectedLaunchDate;
        }
        else if (model === 'secondaryBusinessUnit') {
            this.createOfferService.coolOffer.secondaryBusinessUnit = value;
            this.createOfferService.coolOffer.expectedLaunchDate = this.expectedLaunchDate;
        }
        this.updateOfferWithChanges();
    };
    CreateOfferCoolComponent.prototype.createOffer = function () {
        this.offerId = this.createOfferService.coolOffer.offerId;
        var loggedInUserId = this.userService.getUserId();
        var createoffer = new __WEBPACK_IMPORTED_MODULE_5__create_offer__["a" /* CreateOffer */](loggedInUserId, this.offerCreateForm.controls['offerName'].value, this.offerCreateForm.controls['offerDesc'].value, this.offerCreateForm.controls['primaryBUList'].value, this.offerCreateForm.controls['primaryBEList'].value, this.offerCreateForm.controls['BUSINESS_UNIT'].value, this.offerCreateForm.controls['BE'].value, this.offerCreateForm.controls['secondaryBUList'].value, this.offerCreateForm.controls['secondaryBEList'].value, this.offerCreateForm.controls['strategyReviewDate'].value, this.offerCreateForm.controls['designReviewDate'].value, this.offerCreateForm.controls['readinessReviewDate'].value, this.offerCreateForm.controls['expectedLaunchDate'].value);
        this.createOfferService.registerOffer(createoffer).subscribe();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["ViewChild"])('createOfferForm'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__angular_forms__["NgForm"])
    ], CreateOfferCoolComponent.prototype, "offerForm", void 0);
    CreateOfferCoolComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
            selector: 'app-create-offer-cool',
            template: __webpack_require__("./src/app/create-offer-cool/create-offer-cool.component.html"),
            styles: [__webpack_require__("./src/app/create-offer-cool/create-offer-cool.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__services_create_offer_service__["a" /* CreateOfferService */],
            __WEBPACK_IMPORTED_MODULE_0__angular_router__["Router"],
            __WEBPACK_IMPORTED_MODULE_0__angular_router__["ActivatedRoute"],
            __WEBPACK_IMPORTED_MODULE_7__services_search_collaborator_service__["a" /* SearchCollaboratorService */],
            __WEBPACK_IMPORTED_MODULE_8__services_user_service__["a" /* UserService */]])
    ], CreateOfferCoolComponent);
    return CreateOfferCoolComponent;
}());



/***/ }),

/***/ "./src/app/create-offer-cool/create-offer.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateOffer; });
var CreateOffer = /** @class */ (function () {
    function CreateOffer(userId, offerName, offerDesc, primaryBUList, primaryBEList, BUSINESS_UNIT, BE, secondaryBUList, secondaryBEList, strategyReviewDate, designReviewDate, readinessReviewDate, expectedLaunchDate) {
        this.userId = userId;
        this.offerName = offerName;
        this.offerDesc = offerDesc;
        this.primaryBUList = primaryBUList;
        this.primaryBEList = primaryBEList;
        this.BUSINESS_UNIT = BUSINESS_UNIT;
        this.BE = BE;
        this.secondaryBUList = secondaryBUList;
        this.secondaryBEList = secondaryBEList;
        this.strategyReviewDate = strategyReviewDate;
        this.designReviewDate = designReviewDate;
        this.readinessReviewDate = readinessReviewDate;
        this.expectedLaunchDate = expectedLaunchDate;
    }
    return CreateOffer;
}());



/***/ }),

/***/ "./src/app/dashboard/dashboard.component.css":
/***/ (function(module, exports) {

module.exports = ".myOfferHeader {\n  position: relative;\n  top: -25px;\n  left: 150px;\n}\n.cui .table td.hints {\n  overflow: visible;\n}\n.panel.panel--bordered.panel--raised-small {\n  margin: 15px auto;\n}\n.content .card:last-of-type {\n  margin-bottom: 25px;\n}\n.cui table td .ui-steps {\n  margin: 0 auto 0px auto;\n  padding: 0px 0;\n}\ntable .date {\n  width:10%;\n}\ntable .other {\n  width:15%;\n}\ntable .desc {\n  width:20%;\n}\ntable .steps {\n  width:20%;\n}\n.cui .inline-icon {\n  margin-left: 5px;\n  font-size: 1.2rem;\n  vertical-align: middle;\n}\nspan.icon-chevron-right.inline-icon {\n  padding: 10px 0 10px;\n}\n.cui .panel h1.display-4 {\n  display: inline;\n}\n.header-link {\n  display: inline-block;\n  margin: auto auto auto 15px;\n}\n.cui .pagination .form-group.label--inline .form-group__text {\n  width: 150px;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.cui .pagination {\n\n  font-size: 12px;\n}\n.cui .pagination .form-group.dropdown {\n  display: inline-block;\n}\n.cui .pagination span {\n  display: inline-block;\n  margin: auto 10px;\n}\n.cui .pagination .btn.btn--small {\n  width:40px;\n}\n.cui .panel.header-bar {\n  height:70px;\n}\n.header-bar__main span {\n  vertical-align: middle;\n}\n.header-bar__main span.vertical-divider {\n  opacity: .5;\n  display: inline-block;\n  border-left: solid 1px white;\n  height: 50px;\n  margin: 10px 20px;\n}\nspan.table--description {\n  font-size: 80%;\n  display: block;\n}\n.action--value {\n  font-size:1.5em;\n  display:block;\n  text-align: center;\n}\n.action--value-label {\n  font-size:50%;\n  display:block;\n  text-align: center;\n}\n.header-toolbar button span.button--label {\n  display: none;\n}\n.cui .panel .header-toolbar .btn {\n  padding: 0 10px;\n}\n.cui .avatar span.role {\n  font-size:75%;\n  display: block;\n  text-align: right;\n  margin-right: 24px;\n}\n.cui a:not(.btn):active, .cui a:not(.btn):hover, .cui a:not(.btn):focus, .cui .link:active, .cui .link:hover, .cui .link:focus {\n  text-decoration: none;\n}\ntd a span.icon-small {\n  margin-right: 10px;\n}\nspan.badge-wrapper.base-margin-left:hover:after {\n  content: \"\";\n  position: absolute;\n  right: -30px;\n  top: -8px;\n  font-family: \"cui-font\";\n}\n.cui .table--selectable > tbody > tr > td {\n  border-bottom: solid 1px #f2f2f2;\n}\n.row.card-table-header {\n  border-bottom: 1px solid #f2f2f2;\n  padding-bottom: 10px;\n}\n.cui [data-balloon][data-balloon-pos='right']:before{\n  margin-left: 2px;\n}\n.cui [data-balloon][data-balloon-pos='right']:after {\n  margin-left: 5px;\n}\n@media only screen and (max-width: 768px) {\n  body.cui {\n    overflow-y: scroll;\n    height: auto;\n  }\n  .cui .panel.header-bar .header-bar__main {\n    margin: 0;\n  }\n}\n@media only screen and (min-width: 768px) {\n  .cui .pagination {\n    text-align: right;\n  }\n  .header-bar__main span.vertical-divider {\n    margin: 10px 40px;\n  }\n  .header-toolbar button span.button--label {\n    display: inline-block;\n  }\n  .cui .panel .header-toolbar .btn {\n    padding: 0 35px;\n  }\n  .action--value-label {\n    font-size: 60%;\n    display: inline-block;\n    margin-top: 5px;\n  }\n  .action--value {\n    font-size: 1.5em;\n    display: inline-block;\n  }\n}\n"

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"content\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col-md-12\">\n        <div class=\"card card--raised base-margin-top\">\n          <div class=\"panel\">\n            <div class=\"row card-table-header\">\n              <div class=\"col-md-8\">\n                <h1 class=\"display-4\">My Actions & Notifications</h1>\n              </div>\n            </div>\n            <div class=\"responsive-table\">\n              <div class=\"ui-widget-header\" style=\"padding:4px 10px;border-bottom: 0 none\">\n                <i class=\"fa fa-search\" style=\"margin:4px 4px 0 0\"></i>\n                <input #gb type=\"text\" pInputText size=\"50\" placeholder=\"Global Filter\">\n              </div>\n              <p-dataTable [value]=\"myActionsList\" [rows]=\"10\" [paginator]=\"true\" [globalFilter]=\"gb\" #dt>\n                <p-column field=\"offerId\" header=\"Offer ID\" [filter]=\"true\" filterPlaceholder=\"Search\">\n                </p-column>\n                <p-column field=\"actions\" header=\"Actions & Notifications\" [filter]=\"true\" filterMatchMode=\"equals\">\n                  <ng-template let-col let-actionData=\"rowData\" pTemplate=\"body\">\n                    <span>{{actionData.actionList[0].actionDesc}} <br/></span>\n                  </ng-template>\n                </p-column>\n                <p-column field=\"offerName\" header=\"Offer Name\" [filter]=\"true\" filterMatchMode=\"equals\">\n                </p-column>\n                <p-column field=\"offerOwner\" header=\"Offer Owner\" [filter]=\"true\" filterMatchMode=\"in\">\n                </p-column>\n                <p-column field=\"status\" header=\"Status\">\n                    <ng-template let-col let-actionData=\"rowData\" pTemplate=\"body\">\n                        <div style=\"text-align:center\"><i class=\"fa fa-circle\" style=\"margin:4px 4px 0 0\"></i></div>\n                    </ng-template>\n                </p-column>\n                <p-column field=\"triggerDate\" header=\"Trigger Date\" [filter]=\"true\" filterMatchMode=\"equals\">\n                    <ng-template let-col let-actionData=\"rowData\" pTemplate=\"body\">\n                        <span>{{actionData.actionList[0].triggerDate}} <br/></span>\n                      </ng-template>\n                </p-column>\n              </p-dataTable>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- my offers -->\n\n      <div class=\"col-md-12\">\n        <div class=\"card card--raised base-margin-top\">\n          <div class=\"panel\">\n            <div class=\"row card-table-header\">\n              <div class=\"col-md-8\">\n                <h1 class=\"display-4\">My Offers</h1>\n                <label class=\"header-link myOfferHeader\"><a href=\"\">View All Offers</a></label>\n              </div>\n            </div>\n            <div class=\"responsive-table\">\n              <div class=\"ui-widget-header\" style=\"padding:4px 10px;border-bottom: 0 none\">\n                <i class=\"fa fa-search\" style=\"margin:4px 4px 0 0\"></i>\n                <input #gb type=\"text\" pInputText size=\"50\" placeholder=\"Global Filter\">\n              </div>\n              <p-dataTable [value]=\"myOffersList\" [rows]=\"10\" [paginator]=\"true\" [globalFilter]=\"gb\" #dt>\n                <p-column field=\"offerId\" header=\"Offer ID\" [filter]=\"true\" filterPlaceholder=\"Search\">\n                </p-column>\n                <p-column field=\"offerName\" header=\"Offer Name\" [filter]=\"true\" filterMatchMode=\"equals\">\n                </p-column>\n                <p-column field=\"offerOwner\" header=\"Offer Owner\" [filter]=\"true\" filterMatchMode=\"in\">\n                </p-column>\n                <p-column field=\"expectedLaunchDate\" header=\"Launch Date\" [filter]=\"true\" filterMatchMode=\"equals\">\n                </p-column>\n                <p-column field=\"status\" header=\"Life Cycle Status\" [filter]=\"true\" filterMatchMode=\"equals\">\n                  <ng-template pTemplate=\"body\">\n                    <div class=\"ui-steps ui-steps--tiny\">\n                      <div class=\"ui-step visited\">\n                        <div class=\"step__icon\"><span class=\"icon-check\"></span></div>\n                      </div>\n                      <div class=\"ui-step active\">\n                        <div class=\"step__icon\">2</div>\n                      </div>\n                      <div class=\"ui-step\">\n                        <div class=\"step__icon\">3</div>\n                      </div>\n                    </div>\n                  </ng-template>\n                </p-column>\n                <p-column field=\"triggerDate\" header=\"Actions\" [filter]=\"true\" filterMatchMode=\"equals\">\n                </p-column>\n              </p-dataTable>\n            </div>\n          </div>\n        </div>\n      </div>\n\n    </div>\n  </div>\n</div>\n\n"

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_dashboard_service__ = __webpack_require__("./src/app/services/dashboard.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_create_offer_service__ = __webpack_require__("./src/app/services/create-offer.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_user_service__ = __webpack_require__("./src/app/services/user.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(dashboardService, router, createOfferService, userService) {
        var _this = this;
        this.dashboardService = dashboardService;
        this.router = router;
        this.createOfferService = createOfferService;
        this.userService = userService;
        this.config = {};
        this.agentSearchInput = '';
        this.ddStatus = "";
        this.flagStatus = false;
        this.ddProgress = "";
        this.flagProgress = false;
        this.ddTaskname = "";
        this.flagTaskname = false;
        this.ddStatus2 = "";
        this.flagStatus2 = false;
        this.lineChartData = [
            { data: [0, 20, 10, 50, 40], label: 'Offer Owned' },
            { data: [0, 45, 30, 30, 75], label: 'Offer Co-Owned' }
        ];
        this.lineChartLabels = ['Ideate', 'Plan', 'Execute', 'Sustain', 'EOL'];
        this.lineChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                'position': 'top',
                'display': true,
                'labels': {
                    'boxWidth': 15
                }
            }
        };
        this.lineChartColors = [
            {
                // backgroundColor: 'rgba(174, 217, 236,0.8)',
                backgroundColor: 'rgba(100, 189, 228,0.8)',
                borderColor: 'rgba(100, 189, 228,0.8)',
                pointBackgroundColor: 'rgba(148,159,177,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)'
                //l ineTension : 0
            },
            {
                backgroundColor: 'rgba(100, 189, 228,0.5)',
                borderColor: 'rgba(100, 189, 228,0.5)',
                pointBackgroundColor: 'rgba(77,83,96,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(77,83,96,1)'
                // lineTension : 0
            }
        ];
        this.lineChartLegend = true;
        this.lineChartType = 'line';
        dashboardService.getRecentOffer().subscribe(function (data) {
            _this.recentOfferList = data;
        });
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dashboardService.getMyActionsList()
            .subscribe(function (data) {
            _this.myActionsList = data;
            console.log(_this.myActionsList);
        });
        this.dashboardService.getMyOffersList()
            .subscribe(function (data) {
            _this.myOffersList = data;
            console.log(_this.myOffersList);
        });
    };
    DashboardComponent.prototype.identify = function (data) {
        console.log(data);
    };
    DashboardComponent.prototype.chartClicked = function (event) {
    };
    DashboardComponent.prototype.chartHovered = function (event) {
    };
    DashboardComponent.prototype.scrollToBottom = function () {
        setTimeout(function () {
            window.scrollTo(0, document.body.scrollHeight);
        }, 200);
    };
    DashboardComponent.prototype.openMM = function (offerId) {
        this.createOfferService.coolOffer.offerId = offerId;
        this.createOfferService.currenTOffer.next(offerId);
        this.router.navigate(['/mmassesment/' + offerId]);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('scrollMe'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], DashboardComponent.prototype, "myScrollContainer", void 0);
    DashboardComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__("./src/app/dashboard/dashboard.component.html"),
            styles: [__webpack_require__("./src/app/dashboard/dashboard.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_1__services_dashboard_service__["a" /* DashboardService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__services_dashboard_service__["a" /* DashboardService */],
            __WEBPACK_IMPORTED_MODULE_2__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_3__services_create_offer_service__["a" /* CreateOfferService */], __WEBPACK_IMPORTED_MODULE_4__services_user_service__["a" /* UserService */]])
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ }),

/***/ "./src/app/footer/footer.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/footer/footer.component.html":
/***/ (function(module, exports) {

module.exports = "<footer class=\"footer footer--basic\">\n  <div class=\"footer__links\">\n    <ul class=\"list\">\n      <li><a href=\"http://www.cisco.com/cisco/web/siteassets/contacts/index.html\" target=\"_blank\">Contacts</a></li>\n      <li><a href=\"https://secure.opinionlab.com/ccc01/o.asp?id=jBjOhqOJ\" target=\"_blank\">Feedback</a></li>\n      <li><a href=\"https://www.cisco.com/c/en/us/about/help.html\" target=\"_blank\">Help</a></li>\n      <li><a href=\"http://www.cisco.com/c/en/us/about/sitemap.html\" target=\"_blank\">Site Map</a></li>\n      <li><a href=\"https://www.cisco.com/c/en/us/about/legal/terms-conditions.html\" target=\"_blank\">Terms & Conditions</a></li>\n      <li><a href=\"https://www.cisco.com/c/en/us/about/legal/privacy-full.html\" target=\"_blank\">Privacy Statement</a></li>\n      <li><a href=\"https://www.cisco.com/c/en/us/about/legal/privacy-full.html#cookies\" target=\"_blank\">Cookie Policy</a></li>\n      <li><a href=\"https://www.cisco.com/c/en/us/about/legal/trademarks.html\" target=\"_blank\">Trademarks</a></li>\n    </ul>\n  </div>\n</footer>\n"

/***/ }),

/***/ "./src/app/footer/footer.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FooterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FooterComponent = /** @class */ (function () {
    function FooterComponent() {
    }
    FooterComponent.prototype.ngOnInit = function () {
    };
    FooterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-footer',
            template: __webpack_require__("./src/app/footer/footer.component.html"),
            styles: [__webpack_require__("./src/app/footer/footer.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], FooterComponent);
    return FooterComponent;
}());



/***/ }),

/***/ "./src/app/header/header.component.css":
/***/ (function(module, exports) {

module.exports = ".userIdSpacing {\r\n    position: relative;\r\n    top:20px;\r\n    left: -60px;\r\n    }\r\n    .header-headings {\r\n        color: #ffffff;\r\n    }\r\n    .cui .table td.hints {\r\n                overflow: visible;\r\n            }\r\n    .panel.panel--bordered.panel--raised-small {\r\n                margin: 15px auto;\r\n            }\r\n    .content .card:last-of-type {\r\n            margin-bottom: 25px;\r\n            }\r\n    .cui table td .ui-steps {\r\n            margin: 0 auto 0px auto;\r\n            padding: 0px 0;\r\n            }\r\n    table .date {\r\n                width:10%;\r\n            }\r\n    table .other {\r\n                width:15%;\r\n            }\r\n    table .desc {\r\n                width:20%;\r\n            }\r\n    table .steps {\r\n                width:20%;\r\n            }\r\n    .cui .inline-icon {\r\n                margin-left: 5px;\r\n                font-size: 1.2rem;\r\n                vertical-align: middle;\r\n            }\r\n    span.icon-chevron-right.inline-icon {\r\n                padding: 10px 0 10px;\r\n            }\r\n    .cui .panel h1.display-4 {\r\n                display: inline;\r\n            }\r\n    .header-link {\r\n                display: inline-block;\r\n                margin: auto auto auto 15px;\r\n            }\r\n    .cui .pagination .form-group.label--inline .form-group__text {\r\n                width: 150px;\r\n                -webkit-box-orient: horizontal;\r\n                -webkit-box-direction: normal;\r\n                    -ms-flex-direction: row;\r\n                        flex-direction: row;\r\n                -webkit-box-align: center;\r\n                    -ms-flex-align: center;\r\n                        align-items: center;\r\n            }\r\n    .cui .pagination {\r\n    \r\n                font-size: 12px;\r\n            }\r\n    .cui .pagination .form-group.dropdown {\r\n                display: inline-block;\r\n            }\r\n    .cui .pagination span {\r\n                display: inline-block;\r\n                margin: auto 10px;\r\n            }\r\n    .cui .pagination .btn.btn--small {\r\n                width:40px;\r\n            }\r\n    .cui .panel.header-bar {\r\n                height:70px;\r\n            }\r\n    .header-bar__main span {\r\n                vertical-align: middle;\r\n            }\r\n    .header-bar__main span.vertical-divider {\r\n                opacity: .5;\r\n                display: inline-block;\r\n                border-left: solid 1px white;\r\n                height: 50px;\r\n                margin: 10px 20px;\r\n            }\r\n    span.table--description {\r\n                font-size: 80%;\r\n                display: block;\r\n            }\r\n    .action--value {\r\n                font-size:1.5em;\r\n                display:block;\r\n                text-align: center;\r\n            }\r\n    .action--value-label {\r\n                font-size:50%;\r\n                display:block;\r\n                text-align: center;\r\n            }\r\n    .header-toolbar button span.button--label {\r\n                display: none;\r\n            }\r\n    .cui .panel .header-toolbar .btn {\r\n                padding: 0 10px;\r\n            }\r\n    .cui .avatar span.role {\r\n                font-size:75%;\r\n                display: block;\r\n                text-align: right;\r\n                margin-right: 24px;\r\n            }\r\n    .cui a:not(.btn):active, .cui a:not(.btn):hover, .cui a:not(.btn):focus, .cui .link:active, .cui .link:hover, .cui .link:focus {\r\n                text-decoration: none;\r\n            }\r\n    td a span.icon-small {\r\n                margin-right: 10px;\r\n            }\r\n    span.badge-wrapper.base-margin-left:hover:after {\r\n                content: \"\";\r\n                position: absolute;\r\n                right: -30px;\r\n                top: -8px;\r\n                font-family: \"cui-font\";\r\n            }\r\n    .cui .table--selectable > tbody > tr > td {\r\n                border-bottom: solid 1px #f2f2f2;\r\n            }\r\n    .row.card-table-header {\r\n                border-bottom: 1px solid #f2f2f2;\r\n                padding-bottom: 10px;\r\n            }\r\n    .cui [data-balloon][data-balloon-pos='right']:before{\r\n                margin-left: 2px;\r\n            }\r\n    .cui [data-balloon][data-balloon-pos='right']:after {\r\n                margin-left: 5px;\r\n            }\r\n    @media only screen and (max-width: 768px) {\r\n            body.cui {\r\n                overflow-y: scroll;\r\n                height: auto;\r\n            }\r\n            .cui .panel.header-bar .header-bar__main {\r\n                margin: 0;\r\n            }\r\n            }\r\n    @media only screen and (min-width: 768px) {\r\n            .cui .pagination {\r\n                text-align: right;\r\n            }\r\n            .header-bar__main span.vertical-divider {\r\n                margin: 10px 40px;\r\n            }\r\n            .header-toolbar button span.button--label {\r\n                display: inline-block;\r\n            }\r\n            .cui .panel .header-toolbar .btn {\r\n                padding: 0 35px;\r\n            }\r\n            \r\n            .cui .panel .coolHeader {\r\n            background: #017CAD;\r\n            }\r\n            .action--value-label {\r\n                font-size: 60%;\r\n                display: inline-block;\r\n                margin-top: 5px;\r\n            }\r\n            .action--value {\r\n                font-size: 1.5em;\r\n                display: inline-block;\r\n            }\r\n            }"

/***/ }),

/***/ "./src/app/header/header.component.html":
/***/ (function(module, exports) {

module.exports = "<header class=\"header\">\n  <div class=\"header-bar container\">\n    <a href=\"javascript:;\" class=\"header-bar__logo\">\n      <span class=\"icon-cisco\"></span>\n    </a>\n    <div class=\"header-bar__main\">\n      <div class=\"header-heading\">\n        <h1 class=\"page-title\">Cisco Orchestrated Offer Lifecycle</h1>\n      </div>\n      <div class=\"header-menus\">\n        <ul class=\"nav nav-tabs\">\n          <li routerLinkActive=\"active\">\n            <a routerLink=\"/dashboard\"><div class=\"tab__heading\" title=\"Basic\">Dashboard</div></a>\n          </li>\n          <li routerLinkActive=\"active\">\n            <a routerLink=\"/cool\"><div class=\"tab__heading\" title=\"Wide\">Offers</div></a>\n          </li>\n          <li routerLinkActive=\"active\">\n            <a><div class=\"tab__heading\" title=\"Sidebar\">Analytics</div></a>\n          </li>\n        </ul>\n      </div>\n    </div>\n    <div class=\"header-toolbar\">\n        <a href=\"javascript:;\" class=\"avatar\">{{userFirstName}} {{userLastName}} <span class=\"icon-chevron-down icon-small\"></span><span class=\"role userIdSpacing\">BUPM</span></a>\n        <a href=\"javascript:;\" class=\"btn btn--icon\">\n            <span class=\"icon-search\"></span>\n        </a>\n        <a href=\"javascript:;\" class=\"btn btn--icon\">\n            <span class=\"icon-alert\"></span>\n        </a>\n        <a href=\"javascript:;\" class=\"btn btn--icon\">\n            <span class=\"icon-cog\"></span>\n        </a>\n    </div>\n  </div>\n</header>\n<div class=\"row\">\n    <div class=\"col-md-12\">\n        <div class=\"coolHeader panel panel--vibblue panel--loose header-bar base-margin-top\">\n            <div class=\"header-bar__main\">\n                    <div class=\"header-heading\">\n                        <h1 class=\"page-title\"><span class=\"action--value header-headings\">8</span> <span class=\"action--value-label header-headings\">Pending Actions</span></h1>\n                        <span class=\"vertical-divider\"></span>\n                        <h1 class=\"page-title\"><span class=\"action--value header-headings\">4</span> <span class=\"action--value-label header-headings\">Need Immediate Action</span></h1>\n                    </div>\n                </div>\n            <div class=\"header-toolbar\">\n                    <button (click)=\"createNewOffer()\" class=\"btn btn--white cta--action\"><span class=\"icon-add icon-small\"></span> <span class=\"button--label\">New Offer</span></button>\n            </div>\n        </div>\n    </div>\n</div>\n"

/***/ }),

/***/ "./src/app/header/header.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_create_offer_service__ = __webpack_require__("./src/app/services/create-offer.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__header_service__ = __webpack_require__("./src/app/header/header.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(headerService, router, createOfferService) {
        var _this = this;
        this.headerService = headerService;
        this.router = router;
        this.createOfferService = createOfferService;
        this.toggleLogout = false;
        // this.selectedIndex = 2;
        this.headerService.getUserInfo().subscribe(function (data) {
            _this.userFirstName = data.firstName;
            _this.userLastName = data.lastName;
        });
    }
    HeaderComponent.prototype.ngOnInit = function () {
    };
    HeaderComponent.prototype.getPage = function (p) {
        return this.router.url.search(p) > -1;
    };
    HeaderComponent.prototype.onClickedOutside = function () {
        this.toggleLogout = false;
    };
    HeaderComponent.prototype.createNewOffer = function () {
        this.createOfferService.coolOffer = this.createOfferService.coolOfferCopy;
        this.createOfferService.currenTOffer.next('');
        this.router.navigate(['/cool']);
    };
    HeaderComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-header',
            template: __webpack_require__("./src/app/header/header.component.html"),
            styles: [__webpack_require__("./src/app/header/header.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_3__header_service__["a" /* HeaderService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__header_service__["a" /* HeaderService */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"], __WEBPACK_IMPORTED_MODULE_2__services_create_offer_service__["a" /* CreateOfferService */]])
    ], HeaderComponent);
    return HeaderComponent;
}());



/***/ }),

/***/ "./src/app/header/header.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HeaderService = /** @class */ (function () {
    function HeaderService(httpClient) {
        this.httpClient = httpClient;
    }
    HeaderService.prototype.getUserInfo = function () {
        var url = __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].REST_API_URL + "userInfo";
        return this.httpClient.get(url);
    };
    HeaderService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], HeaderService);
    return HeaderService;
}());



/***/ }),

/***/ "./src/app/mm-assesment/mm-assesment.component.css":
/***/ (function(module, exports) {

module.exports = ".contentBox {\n  display: inline-block;\n  width: 100%;\n}\n\n.leftContent,\n.rightContent {\n  float: left;\n}\n\n.leftContent {\n  width: calc(100% - 400px);\n  padding-right: 15px;\n}\n\n.rightContent {\n  width: 400px;\n}\n\n/**Group Table CSS Start Here**/\n\n.grouptable {\n  border: none;\n}\n\n.grouptable td {\n  padding: 12px 10px 6px 10px;\n  border-bottom: 1px solid #eee;\n}\n\n.grouptable tr:last-child td {\n  border-bottom: 0\n}\n\n.xs-small {\n  font-size: 1rem;\n  padding-left: 3px;\n}\n\n.xs-small span.icon-small {\n  vertical-align: middle;\n  margin-right: 3px;\n}\n\n.xs-small span.icon-small::before {\n  font-size: 1.1rem;\n  line-height: 12px;\n}\n\n.grouptable {\n    border: 1px solid lightgray;;\n}\n\n.grouptable .borderColor {\n  border: #e9e9e9 1px solid\n}\n\n.grouptable .grouptableData {\n  padding: 0;\n}\n\n.groupHeader {\n  background: #e9e9e9;\n  padding: 9px 9px 7px;\n  margin: 0;\n  font-weight: bold;\n  font-size: 1.4rem;\n\n}\n\n.chips {\n  border: #ddd 1px solid;\n  padding: 5px 20px;\n  border-radius: 50px;\n  cursor: pointer;\n  margin: 0 12px 0 0; \n  display: inline-block;\n}\n\n/* .chips:hover {\n  background: #05b0ee;\n  color: white;\n} */\n\n.chips.selected {\n  background: #049fd9;\n  color: white;\n}\n\n.chips.not-aligned {\n    background: #d90404;\n    color: white;\n}\n\n.aligned-success, .aligned-error, .partial-aligned {\n  font-weight: 500;\n}\n\n.aligned-success {\n  color: rgb(0, 196, 0);\n}\n\n.aligned-error {\n  color: rgb(194, 7, 7);\n}\n\n.partial-aligned {\n  color: #e87127;\n}\n\n/**Group Table CSS End Here**/\n\n\n\n\n\n"

/***/ }),

/***/ "./src/app/mm-assesment/mm-assesment.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"panel-wrapper mt-15\">\n  <ul class=\"breadcrumb\">\n    <li>\n      <a routerLink=\"/dashboard\">Dashboard</a>\n    </li>\n    <!--<li>\n      <a (click)=\"backToOfferPage()\">Edit Offer</a>\n    </li> -->\n    <li>\n      <span>Offer Dimension & MM Assessment</span>\n    </li>\n  </ul>\n  <h5 class=\"mt-10 mainTitle\">\n    <span  (click)=\"backToOfferPage()\" class=\"icon-chevron-left icon-small ico-blue mr-10 curPointer\"></span>CISCO DATA PLATFORM - {{offerData.offerObj.offerName}}\n  </h5>\n  <div class=\"contentBox mt-10\">\n    <div class=\"leftContent\">\n      <div class=\"panel-wrapper\">\n        <div class=\"panel-heading mt-10\">\n          <h6 class=\"text-left\">\n            <span class=\"icon-small ico-blue curPointer mr-10\" [ngClass]=\"{'icon-chevron-up':panels.panel1,'icon-chevron-down':!panels.panel1}\"\n              (click)=\"panels.panel1 = !panels.panel1\"></span>\n\n            <span class=\"acc-title\">Offer Dimension & MM Assessment</span>\n\n          </h6>\n        </div>\n        <div class=\"panel-body mt-15 offerData\" *ngIf=\"panels.panel1\">\n          <div class=\"row mt-10\">\n            <div class=\"col-md-4 labelBlue\">\n              <label>Offer Name</label>\n              <p>{{offerData?.offerObj.offerName}}</p>\n            </div>\n            <div class=\"col-md-8 labelBlue\">\n\n              <label>Offer Description</label>\n              <p>{{offerData?.offerObj.offerDesc}}</p>\n\n            </div>\n          </div>\n\n          <div class=\"row mt-20 offerData\">\n            <div class=\"col-md-4 labelBlue\">\n              <label>Expected Launch Date</label>\n              <p>{{offerData?.offerObj.expectedLaunchDate |date:'MM/dd/yyyy'}}</p>\n            </div>\n            <div class=\"col-md-4 labelBlue\">\n\n              <label>Business Unit</label>\n              <p>{{offerData?.offerObj.businessUnit}}</p>\n\n            </div>\n            <div class=\"col-md-4 labelBlue\">\n              <label>Business Entity</label>\n              <p>{{offerData?.offerObj.businessEntity}}</p>\n            </div>\n          </div>\n        </div>\n      </div>\n\n\n      <!-- Dimension View -->\n      <div class=\"panel-wrapper\">\n        <div class=\"panel-heading mt-10\">\n          <h6 class=\"text-left\">\n            <span class=\"icon-small ico-blue curPointer mr-10\" [ngClass]=\"{'icon-chevron-up':panels.panel2,'icon-chevron-down':!panels.panel2}\"\n              (click)=\"panels.panel2 = !panels.panel2\"></span>\n            <span class=\"acc-title\">{{offerData?.offerObj.mmId}} - {{offerData?.offerObj.mmName}}</span>\n            <span style=\"opacity:0.8;font-size:14px;margin-left:10px;\" *ngIf=\"offerData?.offerObj.mmMapperStatus == 'Not Aligned'\">\n              <span class=\"icon-exclamation-triangle icon-small v-small\"></span>\n              <span [ngClass]=\n              \"{'aligned-error':offerData.offerObj.mmMapperStatus=='Not Aligned'}\"> {{offerData?.offerObj.mmMapperStatus}}</span>\n            </span>\n            <span style=\"opacity:0.8;font-size:14px;margin-left:10px;\" *ngIf=\"offerData?.offerObj.mmMapperStatus == 'Aligned'\">\n                <span class=\"icon-check icon-small v-small\"></span>\n                <span [ngClass]=\n                \"{'aligned-success':offerData.offerObj.mmMapperStatus=='Aligned'}\"> {{offerData?.offerObj.mmMapperStatus}}</span>\n            </span>\n\n\n            <span class=\"pull-right panel-right\" style=\"opacity:0.8;margin-left:10px;\">\n              <a *ngIf=\"tabView\" (click)=\"setFlagValue()\"> View Full Offer Characteristics </a>\n              <a *ngIf=\"!tabView\" (click)=\"setFlagValue()\">Tab View</a>\n            </span>\n            <span class=\"pull-right panel-right\" style=\"opacity:0.8;margin-left:10px;\">\n                <a *ngIf=\"tabView\" (click)=\"validateMM()\">Re-Validate <span style=\"color:#58585B\">|</span> </a>\n            </span>\n          </h6>\n        </div>\n        <div class=\"panel-body mt-5\" *ngIf=\"panels.panel2\">\n          <!-- Tabs start here -->\n          <div class=\"secondary-tabs tab\" *ngIf=\"tabView\">\n            <ul class=\"tabs\">\n              <li class=\"tab\" [ngClass]=\"{ 'active' : tabindex == i }\" (click)=\"tabindex = i\"  *ngFor=\"let tabData of offerData.offerObj.groups; let i = index\">\n                <a tabindex=\"i\">\n                  <div class=\"tab__heading\" title=\"tabData.name\">{{ tabData.groupName}}</div>\n                </a>\n              </li>\n            </ul>\n          </div>\n\n          <div class=\"tab-content\" *ngIf=\"tabView\">\n            <div id=\"tab-offer-content\" class=\"tab-pane active\" [ngClass]=\"{ 'active' : tabindex == i }\" *ngFor=\"let x of offerData.offerObj.groups; let i =  index\">\n              <table class=\"grouptable\" style=\"width:100%\">\n                <tr *ngFor=\"let y of x.subGroup\">\n                  <td style=\"width: 15%;\">\n                    <span class=\"bold\"> {{y.subGroupName}}</span>\n                    <div class=\"xs-small\" [ngClass]=\"{'aligned-success': y.subGroupStatus === 'Aligned', 'aligned-error': y.subGroupStatus === 'Not Aligned'} \">\n                      <span class=\"icon-exclamation-triangle icon-small v-small\" *ngIf=\"y.subGroupStatus === 'Not Aligned'\"></span>\n                      <span class=\"icon-check icon-small v-small\"  *ngIf=\"y.subGroupStatus === 'Aligned'\"></span>{{ y.subGroupStatus }}\n                    </div>\n                  </td>\n                  <td style=\"width:85%;\">\n\n                    <span class=\"chips mb-10\" *ngFor=\"let z of y.choices;\" \n                    [ngClass]=\"{ \n                      'selected':( y.selected != null && y.selected.indexOf(z) > -1),\n                      'not-aligned':( y.failed != null && y.failed.indexOf(z) > -1)\n                    }\"\n                        (click) = \"selectMMChoice(z,y.selected,y.failed)\">\n                        <span class=\"icon-exclamation-triangle icon-small v-small\" *ngIf=\"y.failed != null && y.failed.indexOf(z) > -1\"></span>\n                      <span style=\"text-align: center;\"\n                        data-balloon-pos=\"up\" data-balloon-length=\"xlarge\" \n                        *ngIf=\"!z.isAligned; else isTooltip\">\n                        <span class=\"icon-small v-small\"></span>\n                        <span> {{z}}\n                        </span>\n                      </span>\n                     </span>\n                  </td>\n                </tr>\n              </table>\n            </div>\n          </div>\n          <!--GroupTable Start Here-->\n\n          <div *ngIf=\"!tabView\" class=\"half-margin-top\">\n            <div *ngFor=\"let x of offerData.offerObj.groups\">\n              <h5 class=\"groupHeader\">{{x.groupName}}</h5>\n              <table class=\"grouptable\" style=\"width:100%\">\n                <tr *ngFor=\"let y of x.subGroup\">\n                  <td style=\"width: 15%;\">\n                    <span class=\"bold\"> {{y.subGroupName}}</span>\n                    <div class=\"xs-small\" [ngClass]=\"{'aligned-success': y.subGroupStatus === 'Aligned', 'aligned-error': y.subGroupStatus === 'Not Aligned'}\">\n                      <span class=\"icon-exclamation-triangle icon-small v-small\" *ngIf=\"y.subGroupStatus === 'Not Aligned'\"></span>\n                      <span class=\"icon-check icon-small v-small\" *ngIf=\"y.subGroupStatus === 'Aligned'\"></span>{{ y.subGroupStatus }}\n                    </div>\n                  </td>\n                  <td style=\"width:85%;\">\n                      <span class=\"chips mb-10\" \n                        [ngClass]=\"{ \n                            'selected':( y.selected != null && y.selected.indexOf(z) > -1),\n                            'not-aligned':( y.failed != null && y.failed.indexOf(z) > -1)\n                          }\"\n                        *ngFor=\"let z of y.choices; let i = index\">\n                        <span class=\"icon-exclamation-triangle icon-small v-small\" *ngIf=\"y.failed != null && y.failed.indexOf(z) > -1\"></span> \n                    {{ z }}\n                    </span>\n                  </td>\n                </tr>\n              </table>\n            </div>\n          </div>\n\n          <!--GroupTable End Here-->\n        </div>\n      </div>\n    </div>\n    <div class=\"rightContent\" style=\"margin-top: -5px;\">\n        \n      <app-right-panel></app-right-panel>      \n      \n    </div>\n    \n  </div>\n</div>\n\n\n"

/***/ }),

/***/ "./src/app/mm-assesment/mm-assesment.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MmAssesmentComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_service_service__ = __webpack_require__("./src/app/shared-service.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_create_offer_service__ = __webpack_require__("./src/app/services/create-offer.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MmAssesmentComponent = /** @class */ (function () {
    function MmAssesmentComponent(router, sharedService, createOfferService, activatedRoute) {
        var _this = this;
        this.router = router;
        this.sharedService = sharedService;
        this.createOfferService = createOfferService;
        this.activatedRoute = activatedRoute;
        this.proceedFlag = false;
        this.alignedFlag = false;
        this.tabindex = 0;
        this.tabView = true;
        this.panels = {
            "panel1": true,
            "panel2": true
        };
        this.activatedRoute.params.subscribe(function (params) {
            _this.currentOfferId = params['id'];
        });
    }
    MmAssesmentComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.currentOfferId) {
            this.createOfferService.getMMMapperById(this.currentOfferId).subscribe(function (data) {
                _this.offerData = data;
            });
        }
    };
    MmAssesmentComponent.prototype.backToOfferPage = function () {
        this.router.navigate(['/coolOffer/' + this.currentOfferId]);
    };
    MmAssesmentComponent.prototype.setFlagValue = function () {
        this.tabView = !this.tabView;
    };
    MmAssesmentComponent.prototype.selectMMChoice = function (choiceName, selectedChoiceArray, failedChoiceArray) {
        if (selectedChoiceArray == null) {
            selectedChoiceArray = Array();
        }
        if (selectedChoiceArray.indexOf(choiceName) > -1) {
            var index = selectedChoiceArray.indexOf(choiceName);
            selectedChoiceArray.splice(index, 1);
        }
        else {
            selectedChoiceArray.push(choiceName);
        }
        //Removing the failed selected choice from failedArray
        if (failedChoiceArray != null && failedChoiceArray.indexOf(choiceName) > -1) {
            var index = failedChoiceArray.indexOf(choiceName);
            failedChoiceArray.splice(index, 1);
        }
    };
    MmAssesmentComponent.prototype.validateMM = function () {
        var _this = this;
        var requestObj = {
            "offerId": this.currentOfferId,
            "mmChoice": 'REVALIDATE',
            "mmId": this.offerData.offerObj.mmId,
            "groups": this.offerData.offerObj.groups
        };
        console.log(requestObj);
        this.createOfferService.postDataofMmMapper(requestObj).subscribe(function (data) {
            _this.createOfferService.subscribeMMAssessment(data);
            var response = data;
            if (response.status != 'FAILED') {
                _this.offerData = data;
            }
            else {
                alert(response.exception);
            }
        });
    };
    MmAssesmentComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-mm-assesment',
            template: __webpack_require__("./src/app/mm-assesment/mm-assesment.component.html"),
            styles: [__webpack_require__("./src/app/mm-assesment/mm-assesment.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"],
            __WEBPACK_IMPORTED_MODULE_2__shared_service_service__["a" /* SharedServiceService */],
            __WEBPACK_IMPORTED_MODULE_3__services_create_offer_service__["a" /* CreateOfferService */],
            __WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"]])
    ], MmAssesmentComponent);
    return MmAssesmentComponent;
}());



/***/ }),

/***/ "./src/app/right-panel/right-panel.component.css":
/***/ (function(module, exports) {

module.exports = ".boxContent {\n    border: #ddd 1px solid;\n    padding: 9px;\n    display: inline-block;\n    width: 100%;\n  }\n  \n  .boxHeading {\n    font-size: 15px !important;\n  }\n  \n  .progressBar {\n    border: 1px solid #ddd;\n    position: relative;\n    margin: 0 auto;\n    width: 88%;\n    margin-top: 15px;\n    margin-bottom: 30px;\n  }\n  \n  .dot.active {\n    background: #6bc149;\n  }\n  \n  .dotFirst {\n    left: -3px;\n  }\n  \n  .dotSecond {\n    left: 33.3%;\n  }\n  \n  .dotThird {\n    left: 66.6%;\n  }\n  \n  .dotFourth {\n    left: 98%;\n  }\n  \n  .dot {\n    background: #ddd;\n    width: 10px;\n    height: 10px;\n    border-radius: 50px;\n    position: absolute;\n    top: -5px;\n  }\n  \n  .dot span {\n    position: absolute;\n    top: 20px;\n    left: -100%;\n  }\n  \n  .mailBox {\n    border-bottom: 1px dashed #b8b8b8;\n    padding:11px 0;\n  }\n  \n  .mailBox:last-child{\n    border: none;\n  }\n  \n  .mailBox span.circle {\n    float: left;\n    margin: 0 9px 0 16px;\n  }\n  \n  /**HoverBox CSS Start**/\n  \n  .hoverBox{\n    display: none;\n  }\n  \n  .dotFirst:hover .hoverBox{\n    background: #FFF;\n      position: absolute;\n      z-index: 99;\n      border-top: 1px solid #ddd;\n      -webkit-box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);\n      box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);\n      right: 18px;\n      display: block;\n      width:800px;\n      padding: 20px;\n      top: -15px;\n  }\n  \n  .hoverBox:after{\n    width: 14px;\n    height: 9px;\n    position: absolute;\n    content: \"\";\n    top: 15px;\n    right: -10px;\n    -webkit-transform: rotate(90deg);\n            transform: rotate(90deg);\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAJCAYAAAF1Si3/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUI1NUVFOEYzM0I3MTFFNkJDQUZFRDJGRjA5RjBCRDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUI1NUVFOTAzM0I3MTFFNkJDQUZFRDJGRjA5RjBCRDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxQjU1RUU4RDMzQjcxMUU2QkNBRkVEMkZGMDlGMEJENCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxQjU1RUU4RTMzQjcxMUU2QkNBRkVEMkZGMDlGMEJENCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqHwHyoAAAECSURBVHjaYvz//z8DCDCdPXs2AcQACCBGuAiIAIryAwQQA0jk1atX/6GAASCAwAJnzpypA3OADFGQMJC+DdcMAgABBFYGVWr+7du3/+fPn/8KEwMJMt+7d+8/OgCKbwQIILhOZIvgOmEMkHEgY0HGo0iCXAIzDuRuqAvBdm5Etw/kBpBbQN6NA/kfGSsqKoLoWIAAQ/UXFADDxo+NjW0diP3r168gY2PjTehqUDQCNagwMjIeU1ZWFuXn5weLffjwgQHohNdAdVZAA+6gaARq4AKy90lISJhLS0szYANPnz5lePHixUkg0wlowDeQJyfdvHnz/79///4TAiA1ILVAPdMA1VsaaBWnI5AAAAAASUVORK5CYII=) no-repeat;\n  }\n  \n  .hoverBox .ui-steps {\n    margin-bottom:0;\n  }\n  \n  .hoverBox .ui-step:before {\n    height: 7px;\n    top: 32px;\n  }\n  \n  .hoverBox .step__icon{\n    width: 22px;\n    height: 22px;\n    min-width: 22px;\n  }\n  \n  .coolSprite{\n    display: inline-block;\n    width: 22px;\n    height: 22px;\n  }\n  \n  .iconInprogress{\n    background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NThGNENBQzJBRjM1MTFFODlGQ0NCQzFFRkJGREZEMEQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NThGNENBQzNBRjM1MTFFODlGQ0NCQzFFRkJGREZEMEQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1OEY0Q0FDMEFGMzUxMUU4OUZDQ0JDMUVGQkZERkQwRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1OEY0Q0FDMUFGMzUxMUU4OUZDQ0JDMUVGQkZERkQwRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvzGFycAAAGoSURBVHjarJU/L0NRGMZvb6phIGFSIan4ExMSYhNpDBgkqhOJT2Cx0PANdNAPocFgEAb/EmmUAWkTJkSiKYlYajA0tfC88tzBde89R903+aW3J+c8fe7bc54TKHa0GC7VCGbABOgFzeADPIMHsA82wZvTYtNhrBYsg1sQBVtgBNQDcRHjWJRzVkCdXSRgcxwBe3S0yE+v6gRJ0AUmQcHJcSvIgHW6UokanDPNNRlq/HAsr38KtumgmkqAONtWthwvgCeFaJa41SooUuvbcRP/hAGKu9Wn9ZYec9pADvSY3FLHClHdEo0j0RThMbBj+FeiNS7C/eDSR+Er0Cc9ruChAVQUC3R6LBUC7yYFQ4bPFQQvICy/oph7puHWoNarCN8xZO4VC4Y1zQ6Ca2nFIZjysQsSBwd/OSBZDeeSFXnrgJRACqxpuFH1OEVKVghJnl6A9D9CaAnMgSEJoSAHy4y/E35PViE6D0ap9Svo28Eud0hCM+gl1bq9gl7qka8iCXXO1sR5s9SQCMfSnJPjmoLX1WS/TGclULjPwxyXA3UjWwpsuF2mXwIMANN6ZTuUIX1NAAAAAElFTkSuQmCC) no-repeat !important;\n    -webkit-box-shadow: inherit;\n            box-shadow: inherit;\n  }\n  \n  .completed{\n    color: #889B28\n  }\n  \n  .inprogress{\n    color: #e87127;\n  }\n  \n  .pending{\n    color:#ddd;\n  }\n  \n  .stepColor{\n    color: #58585b;\n  }\n  \n  /**HoverBox CSS End**/\n  \n  /**Autocomplete CSS Start**/\n  \n  .autocomplete{\n    width: 100%;\n    border: none;\n    background: none;\n    border-bottom: #ddd 1px solid;\n    padding: 0 5px 7px 0;\n    display: inline-block;\n    margin-top: 7px;\n    text-transform: uppercase;\n}\n  \n  .icon-search{\n  position: absolute;\n    right: 18px;\n    top: 7px;\n}\n  \n  /**Autocomplete CSS End**/\n  \n  /**Modal Table CSS Start**/\n  \n  .table-modal td, .table-modal th{\n    padding: 0 9px !important;\n    border: #dfdfdf 1px solid;\n}\n  \n  .table-modal .checkbox__input:before{\n    top: 8px;\n}\n  \n  .table-modal .checkbox__input:after{\n    padding: 4px;\n}\n  \n  .innerTittle{\n    font-size: 1.4rem !important;\n}\n  \n  /**Modal table CSS End**/\n  \n  /**Message Notification**/\n  \n  .notificationMessage{\n    position: absolute;z-index: 9;left: 0;top: 0;\n}\n  "

/***/ }),

/***/ "./src/app/right-panel/right-panel.component.html":
/***/ (function(module, exports) {

module.exports = "<span class=\"pull-right panel-right mb-10\" *ngIf=\"!portfolioFlag\">\n    <button class=\"btn btn--primary btn--small\">Export</button>\n    <button class=\"btn btn--primary-ghost btn--small\" [ngClass]=\"{'btn--gray-ghost': !aligned}\" (click)=\"onProceedBtnClicked()\">Proceed to Stakeholder Identification</button>\n    <!-- <button class=\"btn btn--primary-ghost btn--small\" *ngIf=\"proceedFlag\"  (click)=\"onOfferClick()\"  >Proceed to Offer Portfolio</button> -->\n  </span>\n  <span class=\"pull-right panel-right mb-10\" *ngIf=\"portfolioFlag\">        \n      <button class=\"btn btn--primary btn--small\">Export</button>\n      <button class=\"btn btn--primary-ghost btn--small\">Submit for Final Approval</button>\n  </span>\n<div class=\"boxContent  mb-10\">\n    <h6 class=\"boxHeading bold\">Offer Phase</h6>\n    <div class=\"progressBar\">\n       <div [ngClass]=\"{'dot':true,\n        'dotFirst':i == 0,\n        'dotSecond':i == 1,\n        'dotThird':i == 2,\n        'dotFourth':i == 3,\n        'dotFifth':i == 4,\n        'dotSixth':i == 5,\n        'active': offerData.offerObj.progress == phaseName}\" \n        *ngFor=\"let phaseName of phaseList; let i = index\">\n        <span>{{phaseName}}</span>\n        <div class=\"hoverBox animated fadeIn\">\n          <h5 class=\"text-center mt-5 mb-10\" style=\"font-weight: 400\">{{phaseName}}</h5>\n          <div class=\"ui-steps stepsBox\">\n            <div class=\"ui-step ui-step--alt\" *ngFor=\"let task of phaseTaskMap[phaseName]; let i = index\">\n              <div [ngClass]=\"{\n                    'completed'  : offerData.offerObj.offerPhaseTaskDetail[phaseName][task] == 'Completed',\n                    'inprogress'  : offerData.offerObj.offerPhaseTaskDetail[phaseName][task] == 'In Progress',\n                    'pending'  : offerData.offerObj.offerPhaseTaskDetail[phaseName][task] == 'Pending'\n                    }\">\n                {{offerData.offerObj.offerPhaseTaskDetail[phaseName][task]}}\n              </div>\n               <div class=\"step__icon mt-5\" [ngClass]=\"{\n                  'iconCompleted':offerData.offerObj.offerPhaseTaskDetail[phaseName][task] == 'Completed',\n                  'iconInprogress':offerData.offerObj.offerPhaseTaskDetail[phaseName][task] == 'In Progress',\n                  'iconPending':offerData.offerObj.offerPhaseTaskDetail[phaseName][task] == 'Pending'\n                }\"> </div> \n              <div class=\"step__label stepColor\"> {{ task }} </div> \n            </div> \n          </div>\n        </div>\n      </div>\n    </div> \n  </div>\n\n  <div class=\"boxContent mb-10\">\n      <h6 class=\"boxHeading bold\">Estimated Lead Time</h6>\n      <div class=\"row mt-10\">\n        <div class=\"col-md-4\">\n          <h3 class=\"largeDigit d-inline bold\">{{offerData?.offerObj.estimatedLeadTime}}</h3>\n          <span class=\"d-inline\">Weeks</span>\n        </div>\n        <div class=\"col-md-8\">\n          <span class=\"d-inline pt-15\">\n            <a href=\"javascript:void(0)\">Lead Time Calculation?</a>\n          </span>\n          <span class=\"pull-right\" data-balloon=\"Info\" data-balloon-pos=\"up\">\n            <span class=\"icon-info-outline icon-medium pt-5 pull-right curPointer iconInfo\"></span>\n          </span>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"boxContent mb-10 p-0\" style=\"position: relative;\">\n\n\n        <div class=\"row notificationMessage\" *ngIf=\"notiFication\" >\n            <div class=\"col-md-12\">\n                <div class=\"toast\">\n                    <div class=\"toast__icon text-success icon-check\"></div>\n                    <div class=\"toast__body\">\n                        <div class=\"toast__title\">Success</div>\n                        <div class=\"toast__message\">Stakeholder added Successfully.</div>\n                    </div>\n                </div>\n            </div>\n            </div>\n\n\n        <h6 class=\"boxHeading bold groupHeader\" style=\"padding: 9px 12px 10px 10px\">People Involved\n          <span class=\"pull-right\" data-balloon=\"Add\" data-balloon-pos=\"up\">\n            <!-- (click)=\"show_deliveryDesc()\" -->\n            <span class=\"icon-add-outline icon-small \" disabled=\"disabled\"></span>\n          </span>\n        </h6>\n        <div class=\"panel-wrapper  mt-10\">\n          <div class=\"panel-heading\">\n            <h6 class=\"text-left pl-10\">\n              <span class=\"icon-small ico-blue v-small curPointer mr-5 icon-chevron-down\" (click)=\"userPanels.panel1 = !userPanels.panel1\"\n                [ngClass]=\"{'icon-chevron-up':userPanels.panel1,'icon-chevron-down':!userPanels.panel1}\"></span>\n              <span class=\"acc-title acc-title-right\">Offer Owner - {{OfferOwners != null ? OfferOwners.length:0}}</span>\n            </h6>\n          </div>\n\n          <div *ngIf=\"userPanels.panel1\">\n            <div class=\"mailBox\" *ngFor=\"let owner of OfferOwners\">\n              <span class=\"o-status circle green\">{{owner.caption}}</span>\n              <div>\n                <span class=\"d-block mailerName\">{{owner.firstName}}  {{owner.lastName}}</span>\n                <span class=\"d-block mailerId font-small\">{{owner.email}}</span>\n              </div>\n            </div>\n\n          </div>\n\n        </div>\n\n        <div class=\"panel-wrapper  mt-10\">\n          <div class=\"panel-heading\">\n            <h6 class=\"text-left pl-10\">\n              <span class=\"icon-small ico-blue v-small curPointer mr-5 icon-chevron-down\" (click)=\"userPanels.panel2 = !userPanels.panel2\"\n                [ngClass]=\"{'icon-chevron-up':userPanels.panel2,'icon-chevron-down':!userPanels.panel2}\"></span>\n              <span class=\"acc-title acc-title-right\">Offer Approver -{{approvars != null ? approvars.length:0}}</span>\n            </h6>\n          </div>\n          <!--bindings={}-->\n\n          <div *ngIf=\"userPanels.panel2\">\n            <div class=\"mailBox\" *ngFor=\"let approver of approvars\">\n              <span class=\"o-status circle orange\">{{approver.caption}}</span>\n              <div>\n                <span class=\"d-block mailerName\">{{approver.firstName}} {{approver.lastName}}</span>\n                <span class=\"d-block mailerId font-small\">{{approver.email}}</span>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"icon-need-assistent\" data-balloon=\"Need Assistance?\" data-balloon-pos=\"up\"></div>\n\n      <!-- Collaborators custom popup -->\n<div class=\"custom-modal delivery_desc_popup\" *ngIf=\"backdropCustom\">\n    <h5 class=\"headerTittle arrowBack\">\n      Add Collaborators\n      <span class=\"pull-right curPointer icon-close icon-medium\" (click)=\"backdropCustom = false\"> </span>\n    </h5>\n    <div class=\"custom-modal-body\">\n      <div class=\"txtDesc searchSec\">\n        <div class=\"panel-wrapper\">\n          <h6 class=\"innerTittle\">\n            Search Collaborators\n          </h6>\n          <div class=\"panel-body\">\n            <div class=\"row mt-10 width100\">\n              <div class=\"d-inline col-md-6\">\n                <input id=\"typeahead-basic\" type=\"text\" class=\"form-control autocomplete\" [(ngModel)]=\"model\" [ngbTypeahead]=\"search\" placeholder=\"Search by name, email or function \"\n                />\n                <span class=\"icon-search icon-small v-small curPointer\"></span>\n              </div>\n              <div class=\"d-inline col-md-4\">\n                  \n                      <div class=\"form-group cus_dropdown\" [ngClass]=\"{'open': flagFunction}\" (click)=\"(flagFunction = !flagFunction)\">\n                        <div class=\"form-group__text\">\n                          <input placeholder=\"Select An Option\" readonly=\"\"  [value]=\"ddFunction\" style=\"cursor: pointer;\">\n                          <span class=\"icon-small v-small icon-chevron-down\"></span>\n                        </div>\n                        <div class=\"cus_dropdown_menu\">\n                          <a (click)=\"ddFunction = 'Select Function'\" class=\"selected\">Select Function</a>\n                          <a (click)=\"ddFunction = 'Pricing'\">Pricing </a>\n                          <a (click)=\"ddFunction = 'Finance'\">Finance </a>\n                        </div>\n                      </div>\n                      <!-- <label class=\"l-blue\">Business Entity</label> -->\n                    \n  \n              </div>\n              <div class=\"col-md-2\">\n                <button class=\"btn btn--small btn--primary btn-analytic\">Search</button>\n              </div>\n            </div>\n  \n  \n  \n          </div>\n        </div>\n        <div class=\"panel-wrapper mt-10\">\n          <h6 class=\"innerTittle\">\n            Search Results\n          </h6>\n          <table class=\"table table-cool table-modal mt-10 \">\n            <thead>\n              <tr>\n                <th style=\"width:6%\">\n                  <label class=\"checkbox\">\n                    <input type=\"checkbox\">\n                    <span class=\"checkbox__input\"></span>\n                  </label>\n                </th>\n                <th>Name</th>\n                <th>Email Id</th>\n                <th>Function</th>\n                <th>Position</th>\n              </tr>\n            </thead>\n            <tbody>\n              <tr *ngFor=\"let x of resultTable\">\n                <td>\n                  <label class=\"checkbox\">\n                    <input type=\"checkbox\">\n                    <span class=\"checkbox__input\"></span>\n                  </label>\n                </td>\n                <td>{{x.name}}</td>\n                <td>{{x.id}}</td>\n                <td>{{x.function}}</td>\n                <td class=\"visible-tooltip\">\n                    <div class=\"form-group cus_dropdown\" [ngClass]=\"{'open': x.flagFunction}\" (click)=\"(x.flagFunction = !x.flagFunction)\">\n                        <div class=\"form-group__text\">\n                          <input placeholder=\"Select An Option\" readonly=\"\"  [value]=\"x.selectedOwenr\" style=\"cursor: pointer;\">\n                          <span class=\"icon-small v-small icon-chevron-down\"></span>\n                        </div>\n                        <div class=\"cus_dropdown_menu\">\n                          <a (click)=\"x.selectedOwenr = 'Select Owner'\" class=\"selected\">Select Owner</a>\n                          <a (click)=\"x.selectedOwenr = 'Pricing'\">Pricing </a>\n                          <a (click)=\"x.selectedOwenr = 'Finance'\">Finance </a>\n                        </div>\n                      </div>\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <div class=\"modal-footer\">\n          <div class=\"pull-right\">\n            <button class=\"btn btn--small\" (click)=\"onCancelClick()\">Cancel</button>\n            <button class=\"btn btn--small btn--primary\" (click)=\"onSaveClick()\">Save</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  \n  </div>\n  \n  <div class=\"backdrop-custom\" *ngIf=\"backdropCustom\"></div>\n  <!--// -->"

/***/ }),

/***/ "./src/app/right-panel/right-panel.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RightPanelComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_debounceTime__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/debounceTime.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_distinctUntilChanged__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/distinctUntilChanged.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_create_offer_service__ = __webpack_require__("./src/app/services/create-offer.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var searchOptions = ['Option1', 'Option2', 'Option3', 'Option4'];
var RightPanelComponent = /** @class */ (function () {
    function RightPanelComponent(activatedRoute, router, createOfferService) {
        var _this = this;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.createOfferService = createOfferService;
        this.notiFication = false;
        this.portfolioFlag = false;
        this.backdropCustom = false;
        this.search = function (text$) {
            return text$
                .debounceTime(200)
                .distinctUntilChanged()
                .map(function (term) { return term.length < 0 ? []
                : searchOptions.filter(function (v) { return v.toLowerCase().indexOf(term.toLowerCase()) > -1; }).slice(0, 10); });
        };
        this.ddFunction = "Select Function";
        this.flagFunction = false;
        this.ddOwner1 = "Select Owner";
        this.flagOwner1 = false;
        this.ddOwner2 = "Select Owner";
        this.flagOwner2 = false;
        this.ddOwner3 = "Select Owner";
        this.flagOwner3 = false;
        this.dotBox = [
            {
                status: "Completed",
                statuscontent: "Initial MM Assesment"
            },
            {
                status: "Completed",
                statuscontent: "Initial offer Dimension"
            },
            {
                status: "In Progress",
                statuscontent: "Stakeholders Identified"
            },
            {
                status: "Completed",
                statuscontent: "Offer Portfolio"
            },
            {
                status: "In Progress",
                statuscontent: "Strategy Review Completion"
            },
            {
                status: "Pending",
                statuscontent: "Offer Construct Details"
            }
        ];
        this.userPanels = {
            "panel1": false,
            "panel2": true
        };
        this.activatedRoute.params.subscribe(function (params) {
            _this.currentOfferId = params['id'];
        });
        if (!this.currentOfferId) {
            this.currentOfferId = this.createOfferService.coolOffer.offerId;
        }
    }
    RightPanelComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.currentOfferId) {
            this.createOfferService.getMMMapperById(this.currentOfferId).subscribe(function (data) {
                _this.createOfferService.subscribeMMAssessment(data);
                _this.offerData = data;
                _this.OfferOwners = _this.offerData.offerObj.owners;
                _this.approvars = _this.offerData.offerObj.approvars;
                _this.phaseTaskMap = _this.offerData.phaseTaskList;
                _this.phaseList = Object.keys(_this.phaseTaskMap);
                Object.keys(_this.phaseTaskMap).forEach(function (phase) {
                    console.log(phase);
                });
                if (_this.OfferOwners) {
                    _this.OfferOwners.forEach(function (item) {
                        item.caption = "";
                        item.caption = item.firstName.charAt(0) + "" + item.lastName.charAt(0);
                    });
                }
                if (_this.approvars) {
                    _this.approvars.forEach(function (item) {
                        item.caption = "";
                        item.caption = item.firstName.charAt(0) + "" + item.lastName.charAt(0);
                    });
                }
            });
        }
    };
    RightPanelComponent.prototype.show_deliveryDesc = function () {
        this.backdropCustom = true;
    };
    RightPanelComponent.prototype.onSaveClick = function () {
        var _this = this;
        this.backdropCustom = false;
        this.notiFication = true;
        setTimeout(function () {
            _this.notiFication = false;
        }, 3000);
    };
    RightPanelComponent.prototype.onCancelClick = function () {
        this.backdropCustom = false;
    };
    RightPanelComponent.prototype.onOfferClick = function () {
        this.portfolioFlag = true;
        this.router.navigate(['/coolOffer']);
    };
    RightPanelComponent.prototype.onProceedBtnClicked = function () {
        var _this = this;
        this.createOfferService._coolOfferSubscriber.subscribe(function (data) {
            _this.offerData = data;
        });
        if (this.offerData.offerObj.mmMapperStatus == 'Not Aligned') {
            alert('Status is \'Not Aligned\'!. You cannot proceed with stakeholder identification.');
        }
        else {
            document.location.href = "http://owb1-stage.cloudapps.cisco.com/owb/owb/showHome#/manageOffer/editPlanReview/" + this.currentOfferId;
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], RightPanelComponent.prototype, "portfolioFlag", void 0);
    RightPanelComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-right-panel',
            template: __webpack_require__("./src/app/right-panel/right-panel.component.html"),
            styles: [__webpack_require__("./src/app/right-panel/right-panel.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_router__["ActivatedRoute"],
            __WEBPACK_IMPORTED_MODULE_3__angular_router__["Router"],
            __WEBPACK_IMPORTED_MODULE_4__services_create_offer_service__["a" /* CreateOfferService */]])
    ], RightPanelComponent);
    return RightPanelComponent;
}());



/***/ }),

/***/ "./src/app/services/configuration.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigurationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__user_service__ = __webpack_require__("./src/app/services/user.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ConfigurationService = /** @class */ (function () {
    function ConfigurationService(httpClient, userService) {
        this.httpClient = httpClient;
        this.userService = userService;
        this.url = __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].REST_API_URL + "userInfo";
    }
    ConfigurationService.prototype.init = function () {
        var _this = this;
        console.log('init invoked');
        var ret = this.httpClient.get(this.url).toPromise().then(function (data) {
            _this.assignUserId(data);
            return true;
        }).catch();
        console.log(this.userService.userId);
    };
    ConfigurationService.prototype.assignUserId = function (data) {
        this.userService.userId = data.userId;
    };
    ConfigurationService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__user_service__["a" /* UserService */]])
    ], ConfigurationService);
    return ConfigurationService;
}());



/***/ }),

/***/ "./src/app/services/create-offer.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateOfferService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__("./node_modules/rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__ = __webpack_require__("./node_modules/rxjs/_esm5/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__user_service__ = __webpack_require__("./src/app/services/user.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CreateOfferService = /** @class */ (function () {
    function CreateOfferService(httpClient, userService) {
        this.httpClient = httpClient;
        this.userService = userService;
        this.baseUrl = __WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].REST_API_URL;
        this.offerCreateUrl = __WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].REST_API_OFFER_CREATE_URL;
        this.basePrimaryUrl = __WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].REST_API_PRIMARY_URL;
        this.secondaryBusinessUnitUrl = __WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].REST_API_SECONDARY_BUSINESS_UNIT_URL;
        this.secondaryBusinessEntityUrl = __WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].REST_API_SECONDARY_BUSINESS_ENTITY_URL;
        this.currenTOffer = new __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__["a" /* BehaviorSubject */]('');
        this.routeFlag = new __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](false);
        this._mmAssesmentBehaviorSubject = new __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__["a" /* BehaviorSubject */](null);
        this._coolOfferSubscriber = this._mmAssesmentBehaviorSubject.asObservable();
        this.coolOffer = {
            'offerId': null,
            'offerName': null,
            'offerDesc': null,
            'expectedLaunchDate': null,
            'businessUnit': null,
            'businessEntity': null,
            'secondaryBusinessUnit': null,
            'secondaryBusinessEntity': null
        };
        this.coolOfferCopy = {
            'offerId': null,
            'offerName': null,
            'offerDesc': null,
            'expectedLaunchDate': null,
            'businessUnit': null,
            'businessEntity': null,
            'secondaryBusinessUnit': null,
            'secondaryBusinessEntity': null
        };
    }
    CreateOfferService.prototype.subscribeMMAssessment = function (mmAssessmentResponse) {
        this._mmAssesmentBehaviorSubject.next(mmAssessmentResponse);
    };
    CreateOfferService.prototype.getAllBusinessUnit = function () {
        var url = this.baseUrl + 'lov/businessUnit';
        return this.httpClient.get(url);
    };
    CreateOfferService.prototype.getAllBusinessEntity = function () {
        var url = this.baseUrl + 'lov/businessEntity';
        return this.httpClient.get(url);
    };
    CreateOfferService.prototype.getBusinessUnitAndEntity = function () {
        console.log(this.userService.userId);
        var url = this.basePrimaryUrl + this.userService.getUserId();
        return this.httpClient.get(url);
    };
    CreateOfferService.prototype.getSecondaryBusinessUnit = function () {
        var url = this.secondaryBusinessUnitUrl;
        return this.httpClient.get(url);
    };
    CreateOfferService.prototype.getSecondaryBusinessEntity = function (bus) {
        var url = this.secondaryBusinessEntityUrl + bus;
        return this.httpClient.get(url);
    };
    CreateOfferService.prototype.getQuestionsBox = function () {
        var url = this.baseUrl + 'question';
        return this.httpClient.get(url);
    };
    CreateOfferService.prototype.getOfferBox = function () {
        return this.httpClient.get(this.baseUrl + 'mm');
    };
    CreateOfferService.prototype.postDataForOfferId = function (data) {
        var url = this.baseUrl + 'offer';
        return this.httpClient.post(url, data);
    };
    CreateOfferService.prototype.postDataofMmMapper = function (obj) {
        var url = this.baseUrl + 'mmMapping';
        return this.httpClient.post(url, obj);
    };
    CreateOfferService.prototype.validateCoolOffer = function () {
        var _this = this;
        var selectedArray = [];
        var keys = Object.keys(this.coolOffer);
        keys.forEach(function (key) {
            if (_this.coolOffer[key] != null && _this.coolOffer[key] !== '') {
                _this.routeFlag.next(false);
            }
        });
    };
    CreateOfferService.prototype.getOfferById = function (offerId) {
        var url = this.baseUrl + 'offer/' + offerId;
        return this.httpClient.get(url);
    };
    CreateOfferService.prototype.getMMMapperById = function (offerId) {
        var url = this.baseUrl + 'mmMapping/' + offerId;
        return this.httpClient.get(url);
    };
    CreateOfferService.prototype.registerOffer = function (createoffer) {
        return this.httpClient.post(this.offerCreateUrl, createoffer)
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["a" /* Observable */].throw(error.json().error || 'Server error'); });
    };
    CreateOfferService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_5__user_service__["a" /* UserService */]])
    ], CreateOfferService);
    return CreateOfferService;
}());



/***/ }),

/***/ "./src/app/services/dashboard.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__user_service__ = __webpack_require__("./src/app/services/user.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DashboardService = /** @class */ (function () {
    function DashboardService(http, userService) {
        this.http = http;
        this.userService = userService;
        this.baseMyActionsUrl = __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].REST_API_MYACTIONS_URL;
        this.baseMyOfferssUrl = __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].REST_API_MYOFFERS_URL;
    }
    DashboardService.prototype.getRecentOffer = function () {
        var url = __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].REST_API_URL + 'offer';
        return this.http.get(url);
    };
    DashboardService.prototype.getMyActionsList = function () {
        console.log(this.userService.userId);
        var url = this.baseMyActionsUrl;
        return this.http.get(url);
    };
    DashboardService.prototype.getMyOffersList = function () {
        console.log(this.userService.userId);
        var url = this.baseMyOfferssUrl;
        return this.http.get(url);
    };
    DashboardService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__user_service__["a" /* UserService */]])
    ], DashboardService);
    return DashboardService;
}());



/***/ }),

/***/ "./src/app/services/search-collaborator.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchCollaboratorService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SearchCollaboratorService = /** @class */ (function () {
    function SearchCollaboratorService(httpClient) {
        this.httpClient = httpClient;
        this.baseUrl = __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].REST_API_URL;
        this.addEditCollaborator = {
            'name': null,
            'businessEntity': null,
            'functionName': null
        };
    }
    SearchCollaboratorService.prototype.searchCollaborator = function (addEditCollaborator) {
        var data = { 'name': addEditCollaborator.name,
            'businessEntity': addEditCollaborator.businessEntity,
            'functionName': addEditCollaborator.functionName };
        return this.httpClient.get(this.baseUrl, { params: data });
    };
    SearchCollaboratorService.prototype.addCollaborators = function (saveCollaborator) {
        return this.httpClient.post(this.baseUrl, saveCollaborator);
    };
    SearchCollaboratorService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], SearchCollaboratorService);
    return SearchCollaboratorService;
}());



/***/ }),

/***/ "./src/app/services/user.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var UserService = /** @class */ (function () {
    function UserService(httpClient) {
        this.httpClient = httpClient;
    }
    UserService.prototype.getUserId = function () {
        return this.userId;
    };
    UserService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], UserService);
    return UserService;
}());



/***/ }),

/***/ "./src/app/shared-service.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SharedServiceService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_do__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/do.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_throw__ = __webpack_require__("./node_modules/rxjs/_esm5/add/observable/throw.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_catch__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_toPromise__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/toPromise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_toPromise__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var SharedServiceService = /** @class */ (function () {
    function SharedServiceService() {
    }
    SharedServiceService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    ], SharedServiceService);
    return SharedServiceService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false,
    REST_API_URL: 'http://localhost:8080/cooloffer/',
    REST_API_PRIMARY_URL: 'http://localhost:8080/cooloffer/primaryBusiness/',
    REST_API_OFFER_CREATE_URL: 'http://localhost:8085/cool/offer/create/',
    REST_API_SECONDARY_BUSINESS_UNIT_URL: 'http://pdaf-api.cisco.com/pdafapp/mdm/1.0/hierarchy/getBUhierarchy?columns=business_unit&distinct=true',
    REST_API_SECONDARY_BUSINESS_ENTITY_URL: 'http://pdaf-api.cisco.com/pdafapp/mdm/1.0/hierarchy/getBUhierarchy?business_unit=',
    // REST_API_MYACTIONS_URL: 'http://localhost:8085/cool/action/getMyAction/',
    //REST_API_MYOFFERS_URL: 'http://localhost:8085/cool/offer/getMyOffers/',
    REST_API_MYACTIONS_URL: 'http://10.155.72.220:8085/cool/action/getMyAction/ekuruva',
    REST_API_MYOFFERS_URL: 'http://10.155.72.220:8080/cooloffer/offer/getMyOffers/ekuruva',
};


/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map