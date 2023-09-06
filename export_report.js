const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const jsyaml = require("js-yaml");

const workbook = XLSX.readFile("DC3 Zones and Subnets.xlsx");
const arrSheets = workbook.SheetNames;
const workbookName = 'DC3'

const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/; // Regular expression to match IPv4 addresses

// Create a folder for the reports
const reportsFolder = `report_${workbookName}`;
if (!fs.existsSync(reportsFolder)) {
  fs.mkdirSync(reportsFolder);
}

arrSheets.forEach(sheetName => {
  // Replace hyphens with underscores in the sheet name
  const sanitizedSheetName = sheetName.replace(/-/g, '_');

  const worksheet = workbook.Sheets[sheetName];
  const arrZones = XLSX.utils.sheet_to_json(worksheet);

  const keysAndValues = arrZones.map(entry => {
    // Extract and return the key and value (limited to the first 18 characters, and spaces removed)
    const key = Object.keys(entry)[0].slice(0, 18).replace(/\s+/g, '');
    const value = Object.values(entry)[0].slice(0, 18).replace(/\s+/g, '');
    return { key, value };
  });

  // Separate the keys and values
  const keys = keysAndValues.map(entry => entry.key);
  const values = keysAndValues.map(entry => entry.value);

  // Remove empty strings from both keys and values
  const filteredKeys = keys.filter(key => key.trim() !== '');
  const filteredValues = values.filter(value => value.trim() !== '');

  // Remove duplicate keys using a Set
  const uniqueKeys = [...new Set(filteredKeys)];

  const yamlData = jsyaml.dump({
    [sanitizedSheetName]: uniqueKeys, // Use the current sheet name as the YAML key
    ips: filteredValues,
  });

  // Write the YAML data to a new file in the reports folder
  const reportFileName = `report_${sanitizedSheetName}.yaml`;
  const reportFilePath = path.join(reportsFolder, reportFileName);
  fs.writeFileSync(reportFilePath, yamlData);
});

console.log("YAML reports with non-empty values (limited to 18 characters), spaces removed, and duplicate keys removed have been created in the 'reports' folder.");
