import {DebugElement} from "@angular/core";

import {TimerWrapper} from "@angular/core/src/facade/async";
import {Component} from "@angular/core";
import {Type} from "@angular/core";
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';

import { describe, expect, inject, injectAsync, it,beforeEach, beforeEachProviders} from '@angular/core/testing';

import { } from "@angular/platform-browser"
import {magnetInjectables} from '../src/services';


export function findDebugByType(debug: DebugElement, type: any): any {
    return debug.query((debugEl: DebugElement) => {
        return debugEl.componentInstance instanceof type;
    });
}




export function setup(builder, component: Type, template?: string): Promise<ComponentFixture<any>> {
    let prep = template === null ?
        builder.createAsync(component) :
        builder.overrideTemplate(component, template).createAsync(component);
    return prep.then((fixture: ComponentFixture<any>) => {
        fixture.detectChanges();
        return fixture;
    }).catch(console.error.bind(console));
}

export function componentSanityCheck(name: string, selector: string, template: string, directives: Array<any>) {
  @Component({
    selector: 'test-app',
    directives: [directives],
    template: template
})
class TestComponent {
}

describe(name, () => {
    let builder: TestComponentBuilder;

    function setup(): Promise<any> {
        return builder.createAsync(TestComponent)
            .then((fixture: ComponentFixture<any>) => {
            fixture.detectChanges();
            return fixture;
        })
            .catch(console.error.bind(console));
    }

    beforeEachProviders(() => [
        magnetInjectables
    ]);
    // beforeEach(inject([TestComponentBuilder], (tcb) => {
    //   builder = tcb;
    // }));

    describe(selector, () => {
        it('should instantiate component without fail', injectAsync([TestComponentBuilder], (tcb) => {
            builder = tcb;
            return setup().then(() => TimerWrapper.setTimeout(() => { }, 10));
        }));
        it('should destroy component without fail', injectAsync([], () => {

            return setup().then((api: ComponentFixture<any>) => {
                api.destroy();
                TimerWrapper.setTimeout(() => { }, 10);
            });
        }));
    });

});

}
