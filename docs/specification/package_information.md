# Brace Document
### Package Specifications

----

### Brace Document help pages
* [Contributor code of conduct](https://github.com/restarian/brace_document/blob/master/docs/contributor_code_of_conduct.md)
* [Guidelines for contributing](https://github.com/restarian/brace_document/blob/master/docs/guidelines_for_contributing.md)
* [Synopsis](https://github.com/restarian/brace_document/blob/master/docs/synopsis.md)
* Specification
  * [License information](https://github.com/restarian/brace_document/blob/master/docs/specification/license_information.md)
  * **Package information**
  * [Unit test output](https://github.com/restarian/brace_document/blob/master/docs/specification/unit_test_output.md)
* The plugin system
  * [Allocating plugins on the system](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/allocating_plugins_on_the_system.md)
  * [The callback and associated data](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/the_callback_and_associated_data.md)
  * [The module outline and structure](https://github.com/restarian/brace_document/blob/master/docs/the_plugin_system/the_module_outline_and_structure.md)
* Using brace document
  * [Command line usage](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/command_line_usage.md)
  * [Using the module directly](https://github.com/restarian/brace_document/blob/master/docs/using_brace_document/using_the_module_directly.md)
----

**Version**: 1.1.2

**Description**: A platform for plugin utilization regarding document generation which has many plugins

**Author**: [Robert Steckroth](mailto:RobertSteckroth@gmail.com)

**Dependencies**: [amdefine](https://npmjs.org/package/amdefine) [bracket_print](https://npmjs.org/package/bracket_print) [commander](https://npmjs.org/package/commander)

**Development dependencies**: [brace_maybe](https://npmjs.org/package/brace_maybe) [bracket_utils](https://npmjs.org/package/bracket_utils) [chai](https://npmjs.org/package/chai) [mocha](https://npmjs.org/package/mocha) [requirejs](https://npmjs.org/package/requirejs)

**Optional Dependencies**: [brace_document_navlink](https://npmjs.org/package/brace_document_navlink) [brace_document_specification](https://npmjs.org/package/brace_document_specification) [brace_document_link](https://npmjs.org/package/brace_document_link)

**Package scripts**:

| Name | Action |
| ---- | ------ |
 | test | ```mocha``` |
 | brace_document | ```node ./bin/document.js``` |
 | make_docs | ```npm run brace_document --silent -- --navlink --link --link-dest ../Readme.md --link-path synopsis.md -r -i docs_raw -b docs --force-title --title "Brace Document help pages" --sort depth``` |
 | make_docs_extra | ```npm run make_docs --silent -- --specification --mocha``` |

**Keywords**: *markdown*, *documentation*, *platform*, *generation*

**Technologies used in development**:
  * [VIM](https://www.vim.org) As the primary IDE
  * [Windows 10](https://www.microsoft.com/en-us/software-download/windows10) As the development operating environment
  * [Ubuntu on Windows](https://www.microsoft.com/en-us/store/p/ubuntu/9nblggh4msv6) For unit testing
  * [Git](https://git-scm.com) For repository management
  * [Github](https://github.com) For repository storage
  * [NPM](https://npmjs.org) For module storage
  * [Blender](https://blender.org) For logo design and art rendering