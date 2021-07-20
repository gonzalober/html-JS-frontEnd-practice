const formatUsDollar = (number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
};

const formatTable = () => {
  let table = document.getElementById("table");

  //console.log(table.rows[0].cells[0].sort());
  let sumPositives = 0;
  let countPositives = 0;
  let sumNegatives = 0;
  let countNegatives = 0;

  for (let i = 1; i < table.rows.length; i++) {
    //console.log(table.rows[i].cells[2]);
    let numberProfLoss = +table.rows[i].cells[2].innerText; //when i want to modify the text ohnly better to use innerText because converts everythin to string; innerHMTL reads/converts the HTML tag
    let percentagePL = table.rows[i].cells[3].innerText;

    table.rows[i].cells[3].innerText += "%";
    table.rows[i].cells[2].innerText = formatUsDollar(
      table.rows[i].cells[2].innerText
    );
    table.rows[i].cells[1].innerText = formatUsDollar(
      table.rows[i].cells[1].innerText
    );

    if (numberProfLoss > 0) {
      countPositives++;
      sumPositives = numberProfLoss + sumPositives;
    } else if (numberProfLoss < 0) {
      countNegatives++;
      sumNegatives = numberProfLoss + sumNegatives;
    }
    if (percentagePL < 0) {
      table.rows[i].cells[3].classList.add("negative-percentage");
    } else if (percentagePL > 0) {
      table.rows[i].cells[3].classList.add("positive-percentage");
    }
  }
  let avgProfit = sumPositives / countPositives;
  let avgLoss = sumNegatives / countNegatives;

  let profitStringResult = `<div class="legend">
Avg profit for people in profit:
${formatUsDollar(avgProfit)}
`;
  let lossStringResult = `<div class="legend">
Avg loss for people with negative profit:
${formatUsDollar(avgLoss)}
`;
  //let node = document.getElementById("calculate");
  document.getElementById("calculate").addEventListener("click", () => {
    document.getElementById("averages-legend").innerHTML = //covert the part of the tree to a string
      profitStringResult + lossStringResult;
  });
  document.getElementById("clear-calculate").addEventListener("click", () => {
    document.getElementById("averages-legend").innerHTML = "";
  });
};

//step 1: convert the node content into an array. Create an object from each row and then store it in the array.
//{accountName: <value>, marketValue:<value>,profitLoss($):<value>,profitLoss(%):<value> }
//step 2: sort the array by acc name
//step 3: render the sorted table
//step 1:
const getTableAsArray = () => {
  let table = document.getElementById("table");
  let arrayResult = [];
  for (let i = 1; i < table.rows.length; i++) {
    //do with map(or reduce)
    let accountName = table.rows[i].cells[0].innerText;
    let marketValue = +table.rows[i].cells[1].innerText;
    let profitLossInteger = +table.rows[i].cells[2].innerText;
    let profitLossPercentage = +table.rows[i].cells[3].innerText;
    arrayResult.push({
      accountName,
      marketValue,
      profitLossInteger,
      profitLossPercentage,
    });
  }
  return arrayResult;
};
//console.log(getTableAsArray());
//receives an array and return a sorted array
const sortArray = (tableArray, key) => {
  return tableArray.sort((a, b) => {
    if (key === "accountName") {
      return a[key].localeCompare(b[key]);
    }
    return a[key] - b[key];
  });
};

const createRow = ({
  accountName,
  marketValue,
  profitLossInteger,
  profitLossPercentage,
}) => {
  return `<tr><td>${accountName}</td>
  <td>${marketValue}</td>
  <td>${profitLossInteger}</td>
  <td>${profitLossPercentage}</td></tr>
  `;
};
//step 3: render the sorted table
const renderSortedTable = (tableAsArraySorted) => {
  document.getElementById("table-body").innerHTML = "";
  for (let i = 0; i < tableAsArraySorted.length; i++) {
    //do with map(or reduce)

    document.getElementById("table-body").innerHTML += createRow(
      tableAsArraySorted[i]
    );
  }
};
const addSortCriteria = (modelTable, elementId, key) => {
  let ascending = true;
  document.getElementById(elementId).addEventListener("click", () => {
    let tableAsArraySorted = sortArray(modelTable, key);
    tableAsArraySorted = ascending
      ? tableAsArraySorted.reverse()
      : tableAsArraySorted;
    renderSortedTable(tableAsArraySorted);
    formatTable();
    ascending = !ascending;
  });
};

const modelTable = getTableAsArray();
let tableAsArraySorted = sortArray(modelTable, "profitLossPercentage");
renderSortedTable(tableAsArraySorted); //pagination
formatTable();
addSortCriteria(modelTable, "account-name", "accountName");
addSortCriteria(modelTable, "market-value", "marketValue");
addSortCriteria(modelTable, "profit-loss-int", "profitLossInteger");
addSortCriteria(modelTable, "profit-loss-perc", "profitLossPercentage");

// //sort table
// let tables = document.querySelectorAll("table.my-table"),
//   tableSort,
//   thead,
//   headers,
//   i,
//   j;
// //function to sort the given table
// const sortTableFunction = (tableSort) => {
//   return (ev) => {
//     if (ev.target.tagName.toLowerCase() === "a") {
//       sortRows(tableSort, siblingIndex(ev.target.parentNode));
//       ev.preventDefault();
//     }
//   };
// };
// for (let i = 0; i < tables.length; i++) {
//   tableSort = tables[i];

//   if ((thead = tableSort.querySelector("thead"))) {
//     headers = thead.querySelectorAll("th");

//     for (j = 0; j < headers.length; j++) {
//       headers[j].innerHTML = "<a href='#'>" + headers[j].innerText + "</a>";
//     }

//     thead.addEventListener("click", sortTableFunction(tableSort));
//   }
// }

// /**
//  * Get the index of a node relative to its siblings — the first (eldest) sibling
//  * has index 0, the next index 1, etc.
//  */
// function siblingIndex(node) {
//   let count = 0;
//   while ((node = node.previousElementSibling)) {
//     count++;
//   }
//   return count;
// }

// /**
//  * Sort the given table by the numbered column (0 is the first column, etc.)
//  */
// const sortRows = (tableSort, columnIndex) => {
//   let rows = tableSort.querySelectorAll("tbody tr"),
//     sel = "thead th:nth-child(" + (columnIndex + 1) + ")",
//     sel2 = "td:nth-child(" + (columnIndex + 1) + ")",
//     classList = tableSort.querySelector(sel).classList,
//     values = [],
//     cls = "",
//     allNum = true,
//     val,
//     node;

//   if (classList) {
//     if (classList.contains("number")) {
//       cls = "number";
//     }
//   }

//   for (let index = 0; index < rows.length; index++) {
//     node = rows[index].querySelector(sel2);
//     val = node.innerText; //column values
//     console.log(val);
//     val = Number(val.replace(/[^0-9.-]+/g, ""));
//     console.log(val);
//     console.log(typeof val);
//     if (isNaN(val)) {
//       console.log(val);
//       console.log("IT IS NOT NUMBER");
//       allNum = false;
//     } else {
//       console.log("IT IS NUMBER");
//       val = parseFloat(val);
//     }

//     values.push({ value: val, row: rows[index] });
//     //console.log(values);
//   }

//   if (cls === "" && allNum) {
//     cls = "number";
//   }

//   if (cls === "number") {
//     values.sort(sortNumberVal);
//     console.log(typeof sortNumberVal);
//     values = values.reverse();
//   } else {
//     console.log(values);
//     values.sort(sortTextVal);
//   }

//   for (let idx = 0; idx < values.length; idx++) {
//     table.querySelector("tbody").appendChild(values[idx].row);
//   }
// };

// /**
//  * Compare two 'value objects' numerically
//  */
// function sortNumberVal(a, b) {
//   //console.log(typeof a.value);
//   return sortNumber(a.value, b.value);
// }

// /**
//  * Numeric sort comparison
//  */
// function sortNumber(a, b) {
//   return a - b;
// }

// /**
//  * Compare two 'value objects' as simple text; case-insensitive
//  */
// const sortTextVal = (a, b) => {
//   let textA = a.value;
//   let textB = b.value;

//   if (textA < textB) {
//     return -1;
//   }

//   if (textA > textB) {
//     return 1;
//   }

//   return 0;
// };
