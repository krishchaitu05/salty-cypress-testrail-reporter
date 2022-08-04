"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var moment = require("moment");
var testrail_1 = require("./testrail");
var shared_1 = require("./shared");
var testrail_interface_1 = require("./testrail.interface");
var chalk = require('chalk');
var CypressTestRailReporter = /** @class */ (function (_super) {
    __extends(CypressTestRailReporter, _super);
    // if the testrail_flag value is true =>
    // navigate into this function
    // else don't do anything
    function CypressTestRailReporter(runner, options) {
        var _this = _super.call(this, runner) || this;
        _this.results = [];
        var testrail_flag = options.testrail_flag;
        if (testrail_flag) {
            var reporterOptions = options.reporterOptions;
            _this.testRail = new testrail_1.TestRail(reporterOptions);
            _this.isRun = false;
            _this.validate(reporterOptions, 'domain');
            _this.validate(reporterOptions, 'username');
            _this.validate(reporterOptions, 'password');
            _this.validate(reporterOptions, 'projectId');
            _this.validate(reporterOptions, 'suiteId');
            _this.validate(reporterOptions, 'createTestRun');
            runner.on('start', function () {
                console.log("Running Test Case...");
                var executionDateTime = moment().format('L');
                var name = (reporterOptions.runName || 'Automated test run') + " - " + executionDateTime;
                var description = executionDateTime;
            });
            runner.on('pass', function (test) {
                var _a;
                var caseIds = shared_1.titleToCaseIds(test.title);
                if (caseIds.length > 0) {
                    var results = caseIds.map(function (caseId) {
                        return {
                            case_id: caseId,
                            status_id: testrail_interface_1.Status.Passed,
                            comment: "Execution time: " + test.duration + "ms",
                        };
                    });
                    (_a = _this.results).push.apply(_a, results);
                }
            });
            runner.on('fail', function (test) {
                var _a;
                var caseIds = shared_1.titleToCaseIds(test.title);
                if (caseIds.length > 0) {
                    var results = caseIds.map(function (caseId) {
                        return {
                            case_id: caseId,
                            status_id: testrail_interface_1.Status.Automation_fails,
                            comment: "" + test.err.message,
                        };
                    });
                    (_a = _this.results).push.apply(_a, results);
                }
            });
            runner.on('end', function () {
                if (_this.results.length == 0) {
                    console.log('\n', chalk.magenta.underline.bold('(TestRail Reporter)'));
                    console.warn('\n', 'No testcases were matched. Ensure that your tests are declared correctly and matches Cxxx', '\n');
                    return;
                }
                _this.testRail.publishResults(_this.results);
            });
            return _this;
        }
    }
    CypressTestRailReporter.prototype.validate = function (options, name) {
        if (options == null) {
            throw new Error('Missing reporterOptions in cypress.json');
        }
        if (options[name] == null) {
            throw new Error("Missing " + name + " value. Please update reporterOptions in cypress.json");
        }
    };
    return CypressTestRailReporter;
}(mocha_1.reporters.Spec));
exports.CypressTestRailReporter = CypressTestRailReporter;
//# sourceMappingURL=cypress-testrail-reporter.js.map
