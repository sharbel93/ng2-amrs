"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Moh731PatientListResourceService = (function () {
    function Moh731PatientListResourceService(http, appSettingsService, cacheService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this.cacheService = cacheService;
    }
    Moh731PatientListResourceService.prototype.getPatientListUrl = function (reportName) {
        return this.appSettingsService.getEtlRestbaseurl().trim() + (reportName + "/patient-list");
    };
    Moh731PatientListResourceService.prototype.getUrlRequestParams = function (params) {
        var urlParams = new http_1.URLSearchParams();
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('endDate', params.endDate);
        urlParams.set('startDate', params.startDate);
        urlParams.set('reportName', (params.isLegacy ? params.reportName : 'MOH-731-report-2017'));
        urlParams.set('indicator', params.indicator);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('limit', params.limit);
        return urlParams;
    };
    Moh731PatientListResourceService.prototype.getMoh731PatientListReport = function (params) {
        var urlParams = this.getUrlRequestParams(params);
        var url = this.getPatientListUrl('MOH-731-report');
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json();
        });
        return request;
    };
    Moh731PatientListResourceService = __decorate([
        core_1.Injectable()
    ], Moh731PatientListResourceService);
    return Moh731PatientListResourceService;
}());
exports.Moh731PatientListResourceService = Moh731PatientListResourceService;
