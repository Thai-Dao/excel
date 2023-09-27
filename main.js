const { processExcelFile, compareData } = require("./processExcel");
const { extractVMlist } = require("./exportVMList");
const { compareAndOutputArrays } = require("./compare_list");

const fs = require("fs");

const argv = require("minimist")(process.argv.slice(2));

function mergeObjects(file1Path, file2Path) {
  // Read the contents of the JSON files and parse them into arrays
  const arr1 = JSON.parse(fs.readFileSync(file1Path, "utf-8"));
  const arr2 = JSON.parse(fs.readFileSync(file2Path, "utf-8"));

  // Merge the arrays
  const mergedArray = arr1.concat(arr2);

  // Write the merged array to a new JSON file
  const outputPath = "./VMlist_export/merged_list.json";
  fs.writeFileSync(outputPath, JSON.stringify(mergedArray, null, 2));

  console.log(`Merged data and wrote to ${outputPath}`);
}

const allowedArgs = ["process-Excel", "compare-yaml", "export-data", "merge-data", "compare-data"];
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

if (argv._.includes("export-data")) {
  const fileName = argv["f"];
  const sheetName = argv["s"];
  const jobName = argv["j"];
  const colName = argv["c"];
  if (!fileName || !sheetName || !jobName || !colName) {
    console.error("fileName, sheetName and jobName are required");
    return;
  }
  extractVMlist(fileName, sheetName, jobName, colName);
}

if (argv._.includes("merge-data")) {
  const obj1 = argv["oa"];
  const obj2 = argv["ob"];
  if (!obj1 || !obj2) {
    console.error("stuff happens");
    return;
  }
  mergeObjects(obj1, obj2);
}

if (argv._.includes("compare-data")) {
  const filename1 = argv["f1"];
  const filename2 = argv["f2"];
  if (!filename1 || !filename2) {
    console.error("filename1 and filename2 are required");
    return;
  }
  compareAndOutputArrays(filename1, filename2);
}