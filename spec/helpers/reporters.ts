import {DisplayProcessor, SpecReporter} from "jasmine-spec-reporter";
import SuiteInfo = jasmine.SuiteInfo;

class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(info: SuiteInfo, log: string): string {
    return `TypeScript ${log}`;
  }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
  customProcessors: [CustomProcessor],
  spec: {
    displaySuccessful: true,
    displayPending: false,
    displayFailed: true,
  }
}));
