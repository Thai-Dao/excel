const XLSX = require("xlsx");

const workbook = XLSX.readFile("scores.xlsx");
const worksheet = workbook.Sheets["Sheet1"];
const range = XLSX.utils.decode_range(worksheet["!ref"]); //Grab number of rows and columns

// Loop over every row/student in our worksheet
for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
  const highSchool = worksheet[XLSX.utils.encode_cell({ r: rowNum, c: 1 })].v;

  // Give extra 30 points to Test 2 for students of Lead Paint HS
  if (highSchool === "Lead Paint HS") {
    worksheet[XLSX.utils.encode_cell({ r: rowNum, c: 3 })].v += 30;
  }
}

const newWb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(newWb, worksheet, "Sheet1");
XLSX.writeFile(newWb, "scoresWithCurve.xlsx");
