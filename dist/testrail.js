"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var axios = require('axios');
var chalk = require('chalk');
var moment = require("moment");
var TestRail = /** @class */ (function () {
    function TestRail(options) {
        this.options = options;
        this.base = "https://" + options.domain + "/index.php?/api/v2";
    }
    TestRail.prototype.publishResults = function (results) {
        var _this = this;
        var publishToAPI = function () {
            axios({
                method: 'post',
                url: _this.base + "/add_results_for_cases/" + _this.runId,
                headers: {'Content-Type': 'application/json'},
                auth: {
                    username: _this.options.username,
                    password: _this.options.password,
                },
                data: JSON.stringify({results: results}),
            }).then(function (response) {
                console.log('\n', chalk.magenta.underline.bold('(TestRail Reporter)'));
                console.log('\n', " - Results are published to " + chalk.magenta("https://" + _this.options.domain + "/index.php?/runs/view/" + _this.runId), '\n');
            }).catch(function (error) {
                return console.error(error);
            });
        };
        this.runId = this.options.runId;
        console.log("Publishing results to existing run: " + this.runId);
        publishToAPI();
    };
    return TestRail;
}());
exports.TestRail = TestRail;
//# sourceMappingURL=testrail.js.map