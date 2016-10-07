"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var async_1 = require("@angular/core/src/facade/async");
var core_1 = require("@angular/core");
var testing_1 = require('@angular/compiler/testing');
var testing_2 = require('@angular/core/testing');
var services_1 = require('../src/services');
function findDebugByType(debug, type) {
    return debug.query(function (debugEl) {
        return debugEl.componentInstance instanceof type;
    });
}
exports.findDebugByType = findDebugByType;
function setup(builder, component, template) {
    var prep = template === null ?
        builder.createAsync(component) :
        builder.overrideTemplate(component, template).createAsync(component);
    return prep.then(function (fixture) {
        fixture.detectChanges();
        return fixture;
    }).catch(console.error.bind(console));
}
exports.setup = setup;
function componentSanityCheck(name, selector, template, directives) {
    var TestComponent = (function () {
        function TestComponent() {
        }
        TestComponent = __decorate([
            core_1.Component({
                selector: 'test-app',
                directives: [directives],
                template: template
            }), 
            __metadata('design:paramtypes', [])
        ], TestComponent);
        return TestComponent;
    }());
    testing_2.describe(name, function () {
        var builder;
        function setup() {
            return builder.createAsync(TestComponent)
                .then(function (fixture) {
                fixture.detectChanges();
                return fixture;
            })
                .catch(console.error.bind(console));
        }
        testing_2.beforeEachProviders(function () { return [
            services_1.magnetInjectables
        ]; });
        testing_2.describe(selector, function () {
            testing_2.it('should instantiate component without fail', testing_2.injectAsync([testing_1.TestComponentBuilder], function (tcb) {
                builder = tcb;
                return setup().then(function () { return async_1.TimerWrapper.setTimeout(function () { }, 10); });
            }));
            testing_2.it('should destroy component without fail', testing_2.injectAsync([], function () {
                return setup().then(function (api) {
                    api.destroy();
                    async_1.TimerWrapper.setTimeout(function () { }, 10);
                });
            }));
        });
    });
}
exports.componentSanityCheck = componentSanityCheck;
