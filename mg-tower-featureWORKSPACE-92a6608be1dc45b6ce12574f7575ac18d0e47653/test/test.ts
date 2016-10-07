import {TestApp} from "../src/index";

describe('Magnus Micro', () => {
  var testApp: TestApp;
  beforeAll((done) => {
    testApp = new TestApp();
    testApp.start().then(()=>done()).catch(err => console.log(err +'\n' +err.stack));
  });

  it('should have One configFiles', () => {

    expect(testApp.name).toEqual("TestApp");
    expect(testApp.settings.configFiles.length).toEqual(1);
  });


  it('should have loaded config', () => {

    expect(testApp.config.get('express', true).port).toEqual(3000);

  });

  afterAll((done) => {
    // testApp.close().then(()=>done());
  })

});
