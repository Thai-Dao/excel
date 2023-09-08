const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const jsyaml = require("js-yaml");

function processExcelFile(fileName, folderName) {
  const workbook = XLSX.readFile(fileName);
  const arrSheets = workbook.SheetNames;
  const workbookName = folderName;

  // Regular expression to match IPv4 addresses
  const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;

  // Create a folder for the reports
  const reportsFolder = `report_${workbookName}`;
  if (!fs.existsSync(reportsFolder)) {
    fs.mkdirSync(reportsFolder);
  }

  arrSheets.forEach((sheetName) => {
    // Replace hyphens with underscores in the sheet name
    const sanitizedSheetName = sheetName.replace(/-/g, "_");

    const worksheet = workbook.Sheets[sheetName];
    const arrZones = XLSX.utils.sheet_to_json(worksheet);

    const keysAndValues = arrZones.map((entry) => {
      // Extract and return the key and value (limited to the first 18 characters, and spaces removed)
      const key = Object.keys(entry)[0].slice(0, 18).replace(/\s+/g, "");
      const value = Object.values(entry)[0].slice(0, 18).replace(/\s+/g, "");
      return { key, value };
    });

    // Separate the keys and values
    const keys = keysAndValues.map((entry) => entry.key);
    const values = keysAndValues.map((entry) => entry.value);

    // Remove empty strings from both keys and values
    const filteredKeys = keys.filter((key) => key.trim() !== "");
    const filteredValues = values.filter((value) => value.trim() !== "");

    // Remove duplicate keys using a Set
    const uniqueKeys = [...new Set(filteredKeys)];

    // Concatenate two arrays (lists) together
    filteredIPs = uniqueKeys.concat(filteredValues);

    const yamlData = jsyaml.dump({
      [sanitizedSheetName]: filteredIPs, // Use the current sheet name as the YAML key
    });

    // Write the YAML data to a new file in the reports folder
    const reportFileName = `report_${sanitizedSheetName}.yaml`;
    const reportFilePath = path.join(reportsFolder, reportFileName);
    fs.writeFileSync(reportFilePath, yamlData);
  });

  console.log(
    "YAML reports with non-empty values (limited to 18 characters), spaces removed, and duplicate keys removed have been created in the 'reports' folder."
  );
}

function compareData(folderName1, folderName2) {
  // Regular expression to match IPv4 addresses
  const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;

  // Create a folder for the reports
  const reportsFolder = `outPuts_reports`;
  if (!fs.existsSync(reportsFolder)) {
    fs.mkdirSync(reportsFolder);
  }

  // Function to read YAML files from a folder and return an object with file names and data
  function readYAMLFiles(folderPath) {
    const files = fs.readdirSync(folderPath);
    const yamlFiles = {};

    for (const file of files) {
      if (file.endsWith(".yaml")) {
        const filePath = path.join(folderPath, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const jsonData = jsyaml.load(fileContent);
        yamlFiles[file] = jsonData;
      }
    }

    return yamlFiles;
  }

  // Read YAML files from both folders
  const yamlFiles1 = readYAMLFiles(folderName1);
  const yamlFiles2 = readYAMLFiles(folderName2);

  // Function to merge two YAML data structures
  function mergeYAMLData(data1, data2) {
    for (const key in data2) {
      if (Array.isArray(data1[key]) && Array.isArray(data2[key])) {
        // Merge arrays while eliminating duplicates
        data1[key] = [...new Set([...data1[key], ...data2[key]])];
      } else {
        // If not an array, simply assign the value from data2
        data1[key] = data2[key];
      }
    }
    return data1;
  }

  // Compare and merge data from matching file names
  for (const fileName1 in yamlFiles1) {
    if (fileName1 in yamlFiles2) {
      const data1 = yamlFiles1[fileName1];
      const data2 = yamlFiles2[fileName1];

      // Merge data1 and data2
      const mergedData = mergeYAMLData(data1, data2);

      // Write the merged data to a new file
      const newFilePath = path.join(reportsFolder, fileName1); // Change "outputFolder" to your desired output folder
      const newYamlData = jsyaml.dump(mergedData);
      fs.writeFileSync(newFilePath, newYamlData);

      console.log(`Merged data for ${fileName1} and saved to ${newFilePath}`);
    }
  }
}

module.exports = { processExcelFile, compareData };
