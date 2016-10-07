import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';

import { describe, expect, inject, injectAsync, it,beforeEach, beforeEachProviders} from '@angular/core/testing';

export function main() {
  describe('universal truths', () => {
    it('should do math', () => {
      expect(1 + 1).toEqual(2);

      expect(5).toBeGreaterThan(4);
    });

    xit('should skip this', () => {
      expect(4).toEqual(40);
    });
  });
}
