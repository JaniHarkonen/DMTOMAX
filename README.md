# DMtoMax

DMTomax is a small utility program that helps you convert motion capture files to be compatible with 3ds Max.

## How it works?

### Conversion
Simply import the files that you wish to convert in the **Convert**-tab, and select and output directory. If you
leave the output directory blank, the converted files will be stored in the same directory as the source files.
Once the files and the output directory have been selected, either convert all the imported files by clicking 
**Convert all**, or convert only selected files by clicking **Convert selected**. If you want to remove some or all
the files from the **Sources**-list (not the file system, of course), use the  **Remove selected**- and **Remove all**-
buttons respectively.

### Output
When the files are converted, they will appear in the output directory, or the directory of the source files. The 
fixed files will have the prefix `_fixed` in their filename. For example, if you convert the file
`C:\Users\SomeUser\Desktop\character.bvh` and leave the output directory blank, the output file will be 
``C:\Users\SomeUser\Desktop\character_fixed.bvh`. All the files that were successfully converted will be highlighted
in the **Sources**-list in green while all the files that couldn't be converted, for one reason or another, will be
highlighted in red. Finally, the **Status**-section displays the current state of the conversion.

### Mappings
The program logic is simple: the imported files will be iterated through, and all the joints listed on the
**Define mappings**-tab will be replaced with corresponding identifiers. The mappings can be configured on the 
**Define mappings**-tab where the **Joint**-column contains the name of the joint identifier in the source file, and 
**Replacement**-column contains the identifier that the joint should be replaced with in the output file. For example,
if the **joint** *spine_JNT* is mapped to the **replacement** *Chest*, all instance of the *spine_JNT*-joint will be 
replaced with *Chest*. When mappings are edited, the changes have to be saved via the **Save**-button. You can also
restore the default configuration by clicking **Reset**, however the reset has to be saved as well.
