const { processExcelFile, compareData } = require("./processExcel");
const argv = require("minimist")(process.argv.slice(2));

const allowedArgs = ["process-Excel", "compare-yaml"];
if (!argv._.some((e) => allowedArgs.includes(e))) {
  console.error("argument is required: " + allowedArgs.toString());
  return;
}

if (argv._.includes("process-Excel")) {
  const fileName = argv["f"];
  const folderName = argv["d"];
  if (!fileName || !folderName) {
    console.error("file-name and folder-name are required");
    return;
  }
  processExcelFile(fileName, folderName);
}

if (argv._.includes("compare-yaml")) {
  const folderName1 = argv["d1"];
  const folderName2 = argv["d2"];
  if (!folderName1 || !folderName2) {
    console.error("folderName1 and folderName2 are required");
    return;
  }
  compareData(folderName1, folderName2);
}
