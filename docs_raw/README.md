# Brace Navlink 
## Synopsis 

[![Build status](https://ci.appveyor.com/api/projects/status/pwl5j7ou42q8q9hb/branch/master?svg=true)](https://ci.appveyor.com/project/restarian/brace-navlink/branch/master) [![Build Status](https://travis-ci.org/restarian/brace_navlink.svg?branch=master)](https://travis-ci.org/restarian/brace_navlink) [![Downloads](https://img.shields.io/npm/dm/brace_navlink.svg?svg=true)](https://npmjs.org/package/brace_navlink)

| A part of the [Brace suite](https://github.com/restarian/restarian/blob/master/brace/README.md)| Developed with Windows 10 and Ubuntu 16 
| ---- | ----
| ![Brace](https://raw.githubusercontent.com/restarian/restarian/master/brace/doc/image/brace_logo_small.png) | [![Ubuntu on Windows](https://raw.githubusercontent.com/restarian/restarian/master/doc/image/ubuntu_windows_logo.png)](https://github.com/Microsoft/BashOnWindows) | 

----
### Document pages

----

**Author: Robert Steckroth, Bustout**

**License: MIT**

**Bonuses:**
* A beautiful showpiece of fully asynchronous non-blocking run-time program/script.
* Idempotent API design runs safely from anywhere on the system.
* Operates as a system program from the command line or an import library.
* Uses AMD (asynchronous module definition) syntax.
* Runs in Linux and/or Windows environments.
* Well commented, unit tested and professional code

This program provides an idempotent script/shell command that injects navigation list syntax into markdown pages. The pages are collected from a directory in the git project and link urls are created which reference them.

### The Brace Navlink document pages were processed with Brace navlink too.
This is the command used to create the document pages you are reading now: ```bash > node bin/navlink.js -vr -t "Brace Navlink" -b docs docs_raw```

### Below is a simple example of a markdown page before and after processing with Brace navlink. 
---- 

#### Before using the navlink program a markdown page would look like this:
```javascript

# My module
## The main page

Some text about the project here
```

#### After processing with Brace navlink the navigation links would be added like below:
```javascript

# My module
## The main page

----
### Document pages
* **Synopsis**
* [Command usage](https://github.com/yourcompany/my_module/blob/master/docs/usage.md)
* Development
  * [The todo sheet ](https://github.com/yourcompany/my_module/blob/master/docs/development/todo.md)
* Specification
  * [License information](https://github.com/yourcompany/my_module/blob/master/docs/specification/license.md)
  * [Project Specs](https://github.com/yourcompany/my_module/blob/master/docs/specification/specification.md)

----

Some text about the project here
```


