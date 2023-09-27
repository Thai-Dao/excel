const fs = require("fs");
const path = require("path"); // Import the path module

function compareAndOutputArrays(file1Path, file2Path) {
    // Read and parse the contents of the JSON files as arrays
    const array1 = JSON.parse(fs.readFileSync(file1Path, "utf-8"));
    const array2 = JSON.parse(fs.readFileSync(file2Path, "utf-8"));

    // Initialize arrays to store elements for different scenarios
    const currentList = [];
    const newList = [];
    const decomList = [];

    // Compare elements in array2 with array1
    for (const item2 of array2) {
        const foundInArray1 = array1.some(item1 => item1.name === item2.name);
        if (foundInArray1) {
            currentList.push(item2);
        } else {
            newList.push(item2);
        }
    }

    // Compare elements in array1 with array2 to identify decom_list
    for (const item1 of array1) {
        const foundInArray2 = array2.some(item2 => item2.name === item1.name);
        if (!foundInArray2) {
            decomList.push(item1);
        }
    }

    // Define the output folder path
    const outputFolder = "./VMlist_export";

    // Write the arrays to the respective output files in the "VMlist_export" folder
    fs.writeFileSync(path.join(outputFolder, "Migration_list.json"), JSON.stringify(currentList, null, 2));
    fs.writeFileSync(path.join(outputFolder, "New_list.json"), JSON.stringify(newList, null, 2));
    fs.writeFileSync(path.join(outputFolder, "Decom_list.json"), JSON.stringify(decomList, null, 2));
}

module.exports = { compareAndOutputArrays };



