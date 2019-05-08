// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// ng serve/build -e=dev or no -e specified will bring this up, so we'll name our shared dev server: devenv
// to separate the two

export const environment = {
  production: true,
  apiUrl: 'http://localhost:3002',
  logState: false,
  disableAnimations: false,
  showVerboseErrorMessages: false
};
