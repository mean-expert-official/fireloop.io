2017-03-02, Version 3.0.0
=========================

 * Bump version to use loopback-swagger@4.0.0 (Raymond Feng)

 * Replicate new issue_template from loopback (Siddhi Pai)

 * Replicate issue_template from loopback repo (Siddhi Pai)

 * Update README.md (Rand McKinney)


2017-02-02, Version 2.3.0
=========================

 * Update default version to 3.x (Joe Sepi)

 * Upgrade eslint-config, fix new violations (Miroslav Bajtoš)


2017-01-23, Version 2.2.1
=========================

 * Print IBM promotion even with --skip-next-steps (Miroslav Bajtoš)


2017-01-16, Version 2.2.0
=========================

 * Add IBM branding to loopback-cli (Miroslav Bajtoš)

 * Upgrade eslint-config to 7.x (Miroslav Bajtoš)

 * Extract strings to translate. (Candy)

 * Update dependencies to the latest version (Miroslav Bajtoš)


2016-12-16, Version 2.1.0
=========================

 * Remove trailing whitespaces from help texts (Miroslav Bajtoš)

 * Add support for SLC_COMMAND="loopback-cli" (Miroslav Bajtoš)

 * Always require lib/globalize in tests (Miroslav Bajtoš)

 * Update paid support URL (Siddhi Pai)

 * Update translation files (Candy)


2016-12-07, Version 2.0.0
=========================

 * Update to latest eslint and loopback config (Miroslav Bajtoš)

 * Update .travis.yml (Miroslav Bajtoš)

 * Drop support for Node v0.10 and v0.12 (Miroslav Bajtoš)

 * Start the development of the next major version (Miroslav Bajtoš)


2016-12-06, Version 1.25.0
==========================

 * Remove 'slc arc' from post install log (Joe Sepi)

 * Update translation files (Candy)


2016-11-11, Version 1.24.5
==========================

 * Add translation files (Candy)

 * Reword message for custom connector (jannyHou)

 * Add missing space (jannyHou)

 * Disable slc loopback:property for KeyValueModel (Simon Ho)

 * Do not prompt for properties for KeyValueModel (Simon Ho)

 * Globalize helpText (jannyHou)


2016-10-12, Version 1.24.4
==========================

 * Update pt translation file (Candy)


2016-10-05, Version 1.24.3
==========================



2016-10-05, Version 1.24.2
==========================

 * Update translation files - round#2 (Candy)

 * Add translation strings (Candy)

 * property: Avoid casting invalid date into `null` (David Cheung)


2016-09-05, Version 1.24.1
==========================

 * Fix generator not add remote-method to json file (Candy)

 * Update strong-globalize require to 1 line (Candy)


2016-08-17, Version 1.24.0
==========================

 * Call g.f with literal before passing to chalk (Tetsuo Seto)

 * Add filter (jannyHou)

 * Always allow properties with no default value (Miroslav Bajtoš)

 * Missed globalizing some warnings (Candy)

 * Add globalization (Candy)

 * app: describe stability of 2.x/3.x versions (Miroslav Bajtoš)


2016-07-26, Version 1.23.2
==========================



2016-07-22, Version 1.23.1
==========================

 * Allow non required null defaults (Alex Pitigoi)

 * Add eslint infrastructure (juehou)


2016-07-19, Version 1.23.0
==========================

 * Replace-callback-with-promise (jannyHou)

 * Update URLs in CONTRIBUTING.md (#211) (Ryan Graham)

 * validate model property default value type (Alex Pitigoi)

 * test: remove workarounds no longer needed (Miroslav Bajtoš)

 * Update generator-loopback to yeoman 0.23 (Candy)


2016-06-21, Version 1.22.0
==========================

 * Support custom connector (jannyHou)

 * Add prompt for lbVersion (jannyHou)

 * Fix "undefined" model name (Mickael Burguet)


2016-06-03, Version 1.21.1
==========================

 * Fix generator prompt validate error (Candy)

 * remote-method: make prompts more descriptive (Miroslav Bajtoš)


2016-06-01, Version 1.21.0
==========================

 * Allow defining remote method without isStatic flag (Candy)

 * Revert "fix failing relation name test" (jannyHou)

 * Revert "fix/update-to-promise-support" (jannyHou)

 * fix failing relation name test (Eddie Monge)


2016-05-25, Version 1.20.7
==========================

 * fix/update-to-promise-support (jannyHou)

 * remove glob devDep (Eddie Monge)

 * update copyright notices and license (Ryan Graham)

 * Add warning when no datasource available (Candy)


2016-04-19, Version 1.20.6
==========================

 * Fix accept and return to end with empty input (juehou)


2016-04-05, Version 1.20.5
==========================

 * Fix how default base model is set (Raymond Feng)

 * typo 'funtion' (Manu Phatak)

 * Check empty name in validateName and add testcase (juehou)

 * Pare down next steps text when running apic. (Rick Curtis)


2016-03-23, Version 1.20.4
==========================

 * Exclude .pkgcache (Raymond Feng)


2016-03-19, Version 1.20.3
==========================

 * Fix swagger code gen when no data sources are defined (Raymond Feng)


2016-03-19, Version 1.20.2
==========================

 * Fix code generation from swagger (Raymond Feng)


2016-03-18, Version 1.20.1
==========================

 * Use the correct regex to test yml/yaml extension (Raymond Feng)


2016-03-17, Version 1.20.0
==========================

 * Change helpers.getBaseModelForDataSourceName to be async (Raymond Feng)

 * Check the required name (Raymond Feng)

 * Fix the test case (Raymond Feng)

 * Fixing copy-paste error of field name (Sean Moore)

 * Linting updates (Sean Moore)

 * Add tests for default values of properties (Sean Moore)

 * More style changes for project linting (Sean Moore)

 * Style changes to meet project exepectations (Sean Moore)

 * Updating overwritten master changes (Sean Moore)

 * Add prompt for default values on model properties (Sean Moore)


2016-03-15, Version 1.19.0
==========================

 * Add the option to install connector modules on demand (Raymond Feng)


2016-03-14, Version 1.18.0
==========================

 * Fix data source ordier and default for models (Raymond Feng)


2016-03-10, Version 1.17.2
==========================

 * Allow default value for datasource settings (Raymond Feng)


2016-03-10, Version 1.17.1
==========================

 * Update workspace dep (Raymond Feng)


2016-03-10, Version 1.17.0
==========================

 * Add support for object/array data source settings (Raymond Feng)


2016-03-10, Version 1.16.3
==========================

 * Allow connectors without config settings (Raymond Feng)


2016-03-08, Version 1.16.2
==========================

 * Only use 'db' as the default datasource for a model if 'db' exists (Raymond Feng)


2016-03-07, Version 1.16.1
==========================

 * Remove prompt for datasources when none exist (Ritchie Martori)

 * Implement `yo loopback --no-explorer` (Miroslav Bajtoš)

 * datasource: ask for connector-specific settings (Miroslav Bajtoš)


2016-02-29, Version 1.16.0
==========================

 * Use http and verb (juehou)

 * Add `yo loopback --skip-next-steps` options (Miroslav Bajtoš)

 * Add project template prompt, support apic (Miroslav Bajtoš)

 * Only show editable model names in remote-method generator (juehou)


2016-02-16, Version 1.15.2
==========================

 * Fix the message for apic (Raymond Feng)


2016-02-10, Version 1.15.1
==========================

 * Helpers to display correct usage message for apic (David Cheung)


2016-02-10, Version 1.15.0
==========================

 * Make `slc arc` conditional based on the cmd name (Raymond Feng)

 * Change path for function invoke (Jue Hou)

 * Import `generator#invoke()` directly (Miroslav Bajtoš)

 * Prevent constructor to be property name (Jue Hou)


2016-01-15, Version 1.14.0
==========================

 * Prevent readonly models in some generator Remove uneditable models from choice, applied to acl, property, relation generators (Jue Hou)

 * Fix ci timeout error. (Candy)

 * Add cli tool for printing swagger api definition (Candy)

 * Use shared function (Jue Hou)

 * Remove slc:loopback-example (Candy)

 * Remote-method generator (Jue Hou)

 * fix assumptions about dependency locations (Ryan Graham)

 * Relation name should be different from property name (Jue Hou)


2015-11-05, Version 1.13.0
==========================

 * Fix spawn-sync warning (Simon Ho)

 * Refer to licenses with a link (Sam Roberts)

 * reword message for facetName prompt (Jonathan Prince)

 * set common as default so original tests pass (Jonathan Prince)

 * add prompt for facet name (Jonathan Prince)


2015-10-14, Version 1.12.1
==========================

 * Skip non-object model types (Raymond Feng)

 * Use strongloop conventions for licensing (Sam Roberts)

 * test/middleware: fix failure caused by typo (Miroslav Bajtoš)


2015-09-15, Version 1.12.0
==========================

 * Add YML support (Christopher A. Moore)

 * Upgrade Travis to container-based infrastructure (Miroslav Bajtoš)


2015-08-17, Version 1.11.0
==========================

 * Upgrade deps to yeoman-generator 0.20.x (Raymond Feng)


2015-08-04, Version 1.10.2
==========================

 * Update the hostname for oracle demo DB (Raymond Feng)

 * Backport Location fixes from loopback-example-app (Miroslav Bajtoš)


2015-06-22, Version 1.10.1
==========================

 * Update Next Steps instructions (Nick Duffy)


2015-06-16, Version 1.10.0
==========================

 * Add a generator for middleware (Raymond Feng)


2015-05-05, Version 1.9.1
=========================

 * model: Prevent warning about EventEmitter leak (Miroslav Bajtoš)


2015-03-11, Version 1.9.0
=========================

 * Create .yo-rc.json when scaffolding new apps (Simon Ho)


2015-03-11, Version 1.8.0
=========================

 * Add boot script generator (Simon Ho)


2015-02-24, Version 1.7.3
=========================

 * Use async features in example generator (Simon Ho)

 * Upgrade strong-cached-install to ^2.0 for io.js (Miroslav Bajtoš)


2015-02-18, Version 1.7.2
=========================

 * Refactor `injectWorkspaceCopyRecursive` (Simon Ho)

 * Fix tests failing on latest yeoman-generator (Miroslav Bajtoš)


2015-01-22, Version 1.7.1
=========================

 * test: fix jshint warning (Ryan Graham)

 * example: support both flavours of status route (Miroslav Bajtoš)

 * Fix bad CLA URL in CONTRIBUTING.md (Ryan Graham)


2014-12-18, Version 1.7.0
=========================

 * Allow subpath for basePath (Raymond Feng)

 * Fix swagger v2.0 version str (Raymond Feng)


2014-12-11, Version 1.6.2
=========================

 * Fix bad path expansion in loopback:example (Ryan Graham)


2014-12-04, Version 1.6.1
=========================

 * Update dependencies (Miroslav Bajtoš)


2014-12-02, Version 1.6.0
=========================

 * example: use the new middleware registration (Miroslav Bajtoš)

 * Drop `must`, use `chai` instead (Miroslav Bajtoš)

 * Fix path encoding when it contains brackets (Peter Nagy)


2014-11-05, Version 1.5.1
=========================

 * Bump version (Raymond Feng)

 * Capture the dir property (Raymond Feng)


2014-11-05, Version 1.5.0
=========================

 * model: prompt for base model (Miroslav Bajtoš)


2014-11-03, Version 1.4.0
=========================

 * Rework the prompt for the destination dir (Miroslav Bajtoš)

 * Allow through model for hasMany relations (Raymond Feng)

 * Skip accessType prompt if acl scope is method (Raymond Feng)

 * example: compat fix (Miroslav Bajtoš)

 * fixed doc link (Rand McKinney)

 * model: support null data source (Miroslav Bajtoš)


2014-10-02, Version 1.3.2
=========================

 * Bump version (Raymond Feng)

 * Normalize the appname (Raymond Feng)

 * Add contribution guidelines (Ryan Graham)


2014-09-26, Version 1.3.1
=========================

 * Allow custom roles to be specified (Raymond Feng)

 * app: fix instructions (Miroslav Bajtoš)

 * Fix the default connector name (Raymond Feng)

 * Create ACLs in series (Ritchie Martori)

 * Bump version (Raymond Feng)

 * Fix the default access type (Raymond Feng)

 * Update project description (Raymond Feng)

 * Add a section to cover swagger 1.2 (Raymond Feng)

 * Update README (Raymond Feng)


2014-09-05, Version 1.3.0
=========================

 * Bump version (Raymond Feng)

 * Fix the base model (Raymond Feng)

 * Add README as a tutorial (Raymond Feng)

 * Add loopback:swagger generator (Raymond Feng)

 * example: add geo to sample locations (Miroslav Bajtoš)

 * example: fix sample-data/import script (Miroslav Bajtoš)

 * Improve loopback:relation for custom model name (Clark Wang)


2014-08-20, Version 1.2.2
=========================

 * Bump version (Raymond Feng)

 * Fix the require path (Raymond Feng)


2014-08-06, Version 1.2.1
=========================

 * Bump version (Raymond Feng)

 * Enhance the help to print out list of generators (Raymond Feng)


2014-08-04, Version 1.2.0
=========================

 * Update strong-cli references to strongloop (Krishna Raman)

 * Fix the require to reference server instead of app for 2.x (Raymond Feng)

 * Bump version (Raymond Feng)

 * Make sure the help text will reflect the command (slc or yo) (Raymond Feng)

 * Make generator-loopback friendly to slc (Raymond Feng)


2014-07-25, Version 1.1.2
=========================

 * Bump version (Raymond Feng)

 * Fix loopback:acl for all models (Raymond Feng)


2014-07-25, Version 1.1.1
=========================

 * Downgrade to yeoman-generator 0.16 (Miroslav Bajtoš)


2014-07-24, Version 1.1.0
=========================

 * example: add LICENSE, README and create-load.js (Miroslav Bajtoš)

 * example: fix a bug introduced by yeoman upgrade (Miroslav Bajtoš)

 * example: use `npm pretest` from workspace (Miroslav Bajtoš)

 * relation: provide default for 'asPropertyName' (Miroslav Bajtoš)

 * Upgrade yeoman-generator dependency to 0.17 (Miroslav Bajtoš)

 * example: use the new generator `loopback:relation` (Miroslav Bajtoš)

 * relation: prompt for `foreignKey` (Miroslav Bajtoš)


2014-07-22, Version 1.0.0
=========================

 * example: fix sample query in index.html (Miroslav Bajtoš)

 * example: update intro text and URL in index.html (Miroslav Bajtoš)

 * package: update dependencies (Miroslav Bajtoš)

 * Use this.dir to control print out of 'cd <dir>' (Raymond Feng)

 * Make validation messages more meaningful (Raymond Feng)

 * Add test cases (Raymond Feng)

 * model: set `base` depending on connector used (Miroslav Bajtoš)

 * example: update for recent boot changes (Miroslav Bajtoš)

 * relation: fix jshint warnings (Miroslav Bajtoš)

 * Remove sourcemap to avoid 404 (Raymond Feng)

 * Add validations to app/model/property/connector/ds names (Raymond Feng)

 * Add instructions to cd <app-dir> (Raymond Feng)

 * Update package description (Raymond Feng)

 * Add relation generator (Ritchie Martori)


2014-07-17, Version 1.0.0-beta2
===============================

 * Remove the 'files' attr which prevents other files to be installed (Raymond Feng)


2014-07-17, Version 1.0.0-beta1
===============================

 * property: fix array type (Miroslav Bajtoš)

 * example: slow down Google Maps API request (Miroslav Bajtoš)

 * package: use loopback-workspace from npm (Miroslav Bajtoš)

 * acl: remove "property" from the list of scopes (Miroslav Bajtoš)

 * model: ask for the plural form (Miroslav Bajtoš)

 * property: support typed array (Miroslav Bajtoš)

 * model: show connector names in list of datasources (Miroslav Bajtoš)

 * datasource: prompt for the datasource name (Miroslav Bajtoš)

 * model: prompt for the model name (Miroslav Bajtoš)

 * app: add dummy client/README.md (Miroslav Bajtoš)

 * Update to the new workspace layout (Miroslav Bajtoš)

 * package: fixate loopback-workspace version (Miroslav Bajtoš)

 * test: fix expected location of models' idInjection (Miroslav Bajtoš)

 * example: fix typo in relation definition (Miroslav Bajtoš)

 * example: add jshint and fix style violations (Miroslav Bajtoš)

 * example: remove models/car.js template (Miroslav Bajtoš)

 * example: make db connectors an optional dependency (Miroslav Bajtoš)

 * test: fix typo in example.test.js (Miroslav Bajtoš)

 * test: improve logs when a files was not created (Miroslav Bajtoš)

 * package: update "must" to "^0.12.0" (Miroslav Bajtoš)

 * test: increase test timeout (Miroslav Bajtoš)

 * app,example: ask where to create the project (Miroslav Bajtoš)

 * test/end-to-end: use strong-cached-install (Miroslav Bajtoš)

 * app: fail in an non-empty directory (Miroslav Bajtoš)

 * example: scaffold rest-api tests (Miroslav Bajtoš)

 * example: fix indentation and jshint warnings (Miroslav Bajtoš)

 * example: implement nearby query (Miroslav Bajtoš)

 * example: add sample data generator (Miroslav Bajtoš)

 * example: fix database mappings (Miroslav Bajtoš)

 * example: Update demo datasource config (Miroslav Bajtoš)

 * example: Initial implementation (Miroslav Bajtoš)

 * test: fix tests depending on race condition (Miroslav Bajtoš)

 * model: support undefined answers.propertyName (Miroslav Bajtoš)

 * test: remove `id` from acl entries (Miroslav Bajtoš)

 * Extract method actions.initWorkspace (Miroslav Bajtoš)

 * model: fix model config in models.json (Miroslav Bajtoš)

 * actions: validate the workspace dir in loadProject (Miroslav Bajtoš)

 * test/app: check *.js files are created (Miroslav Bajtoš)

 * app: Provide custom copyRecursive implementation (Miroslav Bajtoš)

 * clean up TODO comments (Miroslav Bajtoš)

 * Rework the implementation to workspace 3.0 (Miroslav Bajtoš)

 * jshintrc: use the strongloop coding style (Miroslav Bajtoš)

 * jshintrc: set latedef to nofunc (Miroslav Bajtoš)

 * fixup! app option --skip-install (Miroslav Bajtoš)

 * model: implement the Model generator (Miroslav Bajtoš)

 * app: implement the main generator (Miroslav Bajtoš)


2014-06-27, Version 0.9.0
=========================

 * First release!
