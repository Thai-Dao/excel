const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

function extractVMlist(fileName, sheetName, jobName, colName, networkName) {
    const workbook = XLSX.readFile(fileName);
    const sheet = workbook.Sheets[sheetName];
    const vmName = colName
    const networkList = networkName
    // Extract the list of names and their corresponding "Wave" values
    const data = XLSX.utils.sheet_to_json(sheet);

    // Create a folder for the reports
    const reportsFolder = `VMlist_export`;
    if (!fs.existsSync(reportsFolder)) {
        fs.mkdirSync(reportsFolder);
    }

    // Filter the data to only include rows where "Wave" is "W7-Prod" (if "Wave" is present)
    const filteredData = data.filter(row => !row["Wave"] || row["Wave"] === "W7-Prod");

    // Filter the data to only include rows where "Batch" is "Prd-B4" (if "Batch" is present)
    const filteredData2 = filteredData.filter(row => !row["Batch"] || row["Batch"] === "Prd-B4");

    // Create an object where names are keys and "network_name" values are values
    const nameToNetworkMap = filteredData2.map(row => row[vmName]);

    // Define the export file path
    const exportFilePath = path.join(__dirname, reportsFolder, `${jobName}.json`);

    // Write the nameToNetworkMap data to a JSON file
    fs.writeFileSync(exportFilePath, JSON.stringify(nameToNetworkMap, null, 2));

    console.log("Exported nameToNetworkMap data to", exportFilePath);
}

module.exports = { extractVMlist };