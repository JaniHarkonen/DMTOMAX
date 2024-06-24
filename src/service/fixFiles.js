/*
while( (line = reader.readLine()) != null ) {
  String trimmed = line.trim();
  int spaceIndex = trimmed.indexOf(' ');
  
  if( spaceIndex != -1 ) {
      String jointString = trimmed.substring(0, spaceIndex);
      
      if( jointString.equals("JOINT") ) {
          String candidate = trimmed.substring(spaceIndex + 1);
          String mapping = Mappings.getMappingOf(candidate); 
          
          if( mapping != null ) {
              String beginning = 
                  line.substring(0, spaceIndex + (line.length() - trimmed.length()));
              writer.write(beginning + " " + mapping + "\n");
              continue;
          }
      }
  }
  
  writer.write(line + "\n");
}
*/

export default function fixFiles(files) {
  console.log("fixing");
  console.log(files);
}
