

function createTable(data){
  table = document.getElementById("myTable2");
  let thead = table.createTHead();
  let row = thead.insertRow();

  let keys = Object.keys(data[0]);

  for (let x = 0; x< keys.length; x ++) {
    let key = keys[x];
    let th = document.createElement("th");
    th.onclick = function () {sortTable(x)};
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);

  }

  let tbody = document.createElement("tbody");
  table.appendChild(tbody);
  for (let element of data) {
    let row = tbody.insertRow();
    for (let key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

function sorter(a, b){
  var afix = a.children[colIndex].innerText.replace("$", "");
  var bfix = b.children[colIndex].innerText.replace("$", "");

  var aNum = parseInt(afix);
  var bNum = parseInt(bfix);

  if (aNum != NaN && bNum != NaN){
    return bNum - aNum;
  }
  else{
    return afix.localeCompare(bfix);
  }
}

let colIndex = -1;

function sortTable(n) {
  let table = document.getElementById("myTable2"); 
  let rows = Array.from(table.rows).shift();
  let rev = false;

  if (colIndex == n){
    rev = true;
  }
  colIndex = n;
  rows.sort((a, b)=>sorter(a, b));

  if (rev){
    rows.reverse();
  }


  table.childNodes[2].replaceChildren(...rows);

}

function parseData(){
    const ret = fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vR93T8C7GNbKAjsYVfDcstgsmT_FSx5w3tW96CeeAq2fcPZ8Pr49RXz1cVU2ckRzzwA2n6mks6a5mZY/pub?gid=0&single=true&output=csv', {cache: 'reload'})
    .then((reponse) => reponse.text()).then(
        function(data){
           let lines = data.split("\n");
           let headers = lines[0].split(/(?!\B\"[^"]*),(?![^"]*\"\B)/);

           let retVal = [];

            for (let x = 1; x < lines.length; x++) {
                const eles = lines[x].split(/(?!\B\"[^"]*),(?![^"]*\"\B)/);
                let obj = {};
                for (let index = 0; index < headers.length; index++) {
                    obj[headers[index]] = eles[index].replace(/(^"|"$)/gm, "");
                }

                retVal[x-1] = obj;
            }

            return retVal;
        });

    return ret;
}

parseData().then((data)=>createTable(data));