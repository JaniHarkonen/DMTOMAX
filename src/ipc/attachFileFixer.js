/**
 * Fixes a single file by mapping each joint present in the file to a 
 * corresponding one provided by the `mappings`-JSON. To preserve memory,
 * the target file (found in `filePath`) is read line-by-line. When a line 
 * is read, it is either written to the destination file (to be found in
 * `outputPath`) as is, or modified according to the mappings. We read and
 * write the files using read and write streams provided to us by the `fs`-
 * module.
 * 
 * @param {NodeRequire} fs Reference to the `f`s-module.
 * @param {NodeRequire} readline Reference to the `readline`-module.
 * @param {string} filePath Path to the file that is to be fixed.
 * @param {string} outputPath Path where the fixed file should go to.
 * @param {any} mappings JSON-object that contains the mappings for each
 * joint to their counterparts.
 */
function fixFile(fs, readline, filePath, outputPath, mappings, r) {
  const time = performance.now();
  const KEYWORD = "JOINT";
  const END = "MOTION";
  const writer = fs.createWriteStream(outputPath, { flags: "w" });
  const reader = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity
  });

  let endEncountered = false;
  
    // Read and write line-by-line to preserve memory
  reader.on("line", (line) => {

      // Quick exit if the rest of the file is an exact copy of the target file
    if( endEncountered || line === END ) {
      endEncountered = true;
      writer.write(line + "\n");
      return;
    }

    const trimmed = line.trim();
    const spaceIndex = trimmed.indexOf(" ");

    if( spaceIndex != -1 ) {
      const jointString = trimmed.substring(0, spaceIndex);
      
      if( jointString === KEYWORD ) {
        const candidate = trimmed.substring(spaceIndex + 1);
        const mapping = mappings[candidate];

        if( mapping ) {
          const beginning = line.substring(0, spaceIndex + (line.length - trimmed.length));
          writer.write(beginning + " " + mapping + "\n");

          return;
        }
      }
    }

    writer.write(line + "\n");
  });

  reader.on("close", () => {
    writer.close();
    r({ filePath, outputPath, wasSucessful: true, timeElapsed: performance.now() - time });
  });
}

function attachFileFixer(ipcMain, electron) {
  const { fs, pathModule, readline } = electron;

  ipcMain.handle("fix-files", async (event, filePaths, outputPath, mappings) => {
    const promises = [];
    outputPath = (outputPath && pathModule.normalize(outputPath)) || null;

    for( let filePath of filePaths ) {
      const parse = pathModule.parse(filePath);

      if( !outputPath )
      outputPath = parse.dir;

      outputPath += parse.name + "_fixed" + parse.ext;
      promises.push(new Promise((resolve, reject) => {
        fixFile(fs, readline, filePath, outputPath, mappings, resolve);
      }));
    }

    return promises;
  });
}

exports.attachFileFixer = attachFileFixer;