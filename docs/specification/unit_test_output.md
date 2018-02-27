

---
### Document pages
* [Contributer code of conduct](https://github.com/restarian/brace_document/blob/master/docs/contributer_code_of_conduct.md)
* [Guidelines for contributing](https://github.com/restarian/brace_document/blob/master/docs/guidelines_for_contributing.md)
* [Synopsis](https://github.com/restarian/brace_document/blob/master/docs/synopsis.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license_information.md)
  * [Package specification](https://github.com/restarian/brace_document/blob/master/docs/specification/package_specification.md)
  * **Unit test output**
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/allocating_plugins_on_the_system.md)
  * [Creating additional plugins](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/creating_additional_plugins.md)
* Using brace document
  * [Command line usage](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/using_the_module_directly.md)

---
## The output of the unit tests

---


  * Using stop further progression methodology for dependencies in: acquireData.js

    * Checking for dependencies..

      * ✓ requirejs in the system as a program

      * ✓ git is available in the system as a program

    * using the testing example directory -> test/example

      * ✓ is able to create a git repository in the example directory if their is not one already

      * creates the proper document data object using the directory: /home/nickali/Restarian/brace_document/test/example/directories

        * ✓ with directories contained in the structrure


  * Using stop further progression methodology for dependencies in: addStructureDirectory.js

    * Checking for dependencies..

      * ✓ r_js in the system as a program

    * addStructureDirectory is working appropriately

      * ✓ with an empty subdirectory parameter

      * ✓ with an existing single directory which has subdirectories

      * ✓ with an existing double directory

      * ✓ with a non-existant double subdirectory

      * ✓ with a non-existant double subdirectory in win32 format

      * ✓ with a non-existant double subdirectory inside a existing directory in win32 format

      * ✓ with a directory which is absolute

      * ✓ with a directory which is absolute


  * Using stop further progression methodology for dependencies in: cli.js

    * Checking for dependencies..

      * ✓ brace_document_navlink is in the system as a program

    * the CLI returns the proper codes and string output when using

      * ✓ the help option

      * ✓ the plugins option

      * ✓ only the dryRun option

      * ✓ a non-available option set

      * ✓ the npm run make_docs command

      * ✓ the npm run make_docs command

      * ✓ the npm run make_docs command


  * using stop further progression methodology for dependencies in: findPath.js

    * checking for dependencies..

      * ✓ r_js in the system as a program

      * ✓ git is available in the system as a program

    * using the blank testing example directory -> test/example

      * ✓ is able to create a git repository in the example directory if there is not one already

      * with no flags set to the document_parser

        * ✓ complains if the project root directory is not inside a git repository

        * ✓ finds the correct path data for the project

      * with the backup directory option used and verbose flag set

        * ✓ finds the correct path data for the project

        * ✓ complains if the backup directory is outside the repository

        * ✓ does not complain if the initial document directory is outside the repository but a backup directory is inside the project root


  * Using stop further progression methodology for dependencies in: findStructure_directories.js

    * Checking for dependencies..

      * ✓ r_js in the system as a program

      * ✓ git is available in the system as a program

    * using the testing example directory -> test/example

      * ✓ is able to create a git repository in the example directory if there is not one already

      * creates the proper document structure using the directory: example/directories

        * ✓ with the sort flag set to alphanumeric

        * ✓ with the sort flag set to alphanumeric and the reverse-sort flag set

        * ✓ with the recursive flag set and the sort flag set to alphanumeric

        * ✓ with the recursive flag set and the sort flag set to alphanumeric and the reverse-sort flag set

        * ✓ with the recursive flag set, the sort flag set to depth

        * ✓ with the recursive flag set, the sort flag set to depth and the reverse-sort flag set

        * ✓ using the nested directory with the recursive flag set, the sort flag set to alphanumeric and the reverse-sort flag set

        * ✓ using the nested directory with the recursive flag set, the sort flag set to depth and the reverse-sort flag set


  * Using stop further progression methodology for dependencies in: findStructure_no_directories.js

    * Checking for dependencies..

      * ✓ r_js in the system as a program

      * ✓ git is available in the system as a program

    * using the testing example directory -> test/example

      * ✓ is able to create a git repository in the example directory if there is not one already

      * creates the proper document structure using the directory: example/no_directories

        * ✓ with no flags set

        * ✓ with the sort flag set to alphanumeric

        * ✓ with the reverse flag set and the sort flag set to alphanumeric


  * Using stop further progression methodology for dependencies in: getPlugin.js

    * Checking for dependencies..

      * ✓ r_js in the system as a program

      * ✓ brace_document_navlink is in the system as a program

    * finds all of the commonjs modules which are plugins to this module with the

      * ✓ getPlugin with only callbacks as parameters

      * ✓ passing in a path to getPlugin

      * ✓ passing in a path to getPlugin that ends with node_modules

      * ✓ passing in a path to getPlugin and setting a pluginRegex


  * Using stop further progression methodology for dependencies in: moduleImport.js

    * Checking for dependencies..

      * ✓ requirejs in the system as a program

      * ✓ git is available in the system as a program

    * using the testing example directory -> test/example

      * ✓ the module will load when not passed any option data to it

      * ✓ the module will load when not passed any option data to it

      * ✓ the module will load when not passed any option data to it

      * ✓ the module will load when bad option data is passed to it


  * Using stop further progression methodology for dependencies in: runPlugin.js

    * Checking for dependencies..

      * ✓ r_js in the system as a program

    * the runPlugin API member in document_parse.js

      * ✓ runs with all empty data passed in


  * Using stop further progression methodology for dependencies in: sorting.js

    * Checking for dependencies..

      * ✓ r_js in the system as a program

    * sorting is handled appropriately

      * using the sortList API member the

        * ✓ sort alphanumeric option

        * ✓ sort alphanumeric option with reverseSort

        * ✓ sort depth option with reverseSort

        * ✓ sort depth option

      * using the sortStructure API member the

        * ✓ sort alphanumeric option

        * ✓ sort alphanumeric option with reverseSort

        * ✓ sort depth option

        * ✓ sort depth option with reverseSort



  * 69 passing

