# DMTOMAX

## Todo
- switch to only exporting functions instead of arrow functions to maintain consistency
  -- arrow functions should be favored inside other functions, such as React-components
- file fixer functionalities should be extracted into a custom hook useFileFixer()
- extract FileTable's selection functionality and create a custom hook useSelection()
- extract the usage of file entries into a custom hook useFileEntires()
  -- file entries in ConvertTab should be indexed inside a JSON, so that the result of 
  the fixes can be stored in the file entry JSON itself, rather than having two additional
  states for successful and failed fixes
- extract some of the "render"- arrow functions inside React-components into separate 
components
  -- such as renderOutputPathWarning
- set the appropriate dimensions for the DMTOMAX window
- remove unused imports
