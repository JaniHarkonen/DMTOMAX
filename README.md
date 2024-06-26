# DMTOMAX

## Todo
- switch to only exporting functions instead of arrow functions to maintain consistency
  -- arrow functions should be favored inside other functions, such as React-components
- file fixer functionalities should be extracted into a custom hook useFileFixer()
- extract FileTable's selection functionality and create a custom hook useSelection()
- extract the usage of mappings into a custom hook useMappings()
- fixing files should yield promises that will contain the result of the fixing
  -- file path
  -- output path
  -- whether the fixing was successful
  -- elapsed time
