function createTable(data){
  table = document.getElementById("myTable2");
  let thead = table.createTHead();
  let row = thead.insertRow();

  let keys = Object.keys(data[0]);

  for (let x = 0; x< keys.length; x ++) {
    let key = keys[x];
    if (!key.startsWith("**")){
      let th = document.createElement("th");
      th.onclick = function () {sortTable(x)};
      th.addEventListener("click", createRipple);
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }

  let tbody = document.createElement("tbody");
  table.appendChild(tbody);
  for (let element of data) {
    let row = tbody.insertRow();
    for (let key in element) {
      if (!key.startsWith("**")){
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    }
  }
}

function sorter(a, b){
  var afix = a.children[colIndex].innerText.replace("$", "");
  var bfix = b.children[colIndex].innerText.replace("$", "");

  var aNum = parseInt(afix);
  var bNum = parseInt(bfix);

  if (!isNaN(aNum) && !isNaN(bNum)){
    return aNum - bNum;
  }
  else{
    return afix.localeCompare(bfix);
  }
}

let colIndex = -1;
let rev = false;
let imageHolder = null;

function sortTable(n) {
  let table = document.getElementById("myTable2"); 
  let rows = Array.from(table.rows);
  
  let headerRow = rows.shift();

  if (colIndex == n){
    rev = !rev;
  }
  else {
    rev = false;
  }

  colIndex = n;
  rows.sort((a, b)=>sorter(a, b));

  let sortImage = document.getElementById("sortImage");
    
  if (sortImage != null){
    imageHolder.removeChild(sortImage);
  }

  let img = document.createElement("img");
  img.id = "sortImage";

  if (rev){
    rows.reverse();
    
    img.src = "largetop.png";
    
  }
  else{
    img.src = "smalltop.png";
  }

  imageHolder = headerRow.children[n];
  
  imageHolder.appendChild(img);

  table.childNodes[2].replaceChildren(...rows);

}

function createRipple(event) {
  const button = event.currentTarget;

  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
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

function budgetChange(input){
  if(!input){//null, undef, etc. mostly catches null
    errorText.style.color = 'rgba(255,0,0,0)';
    return;
  }
  else if(input.match(/^\d*\.?\d{0,2}$/gm == null)){//assure good
    errorText.style.color = 'rgba(255,0,0,1)';
    return;
  }
  else {//input is probably good at this point
    errorText.style.color = 'rgba(255,0,0,0)';
    let budget = parseFloat(input);
    for(let org of parsedData){
      org["Advising Score"] = parseInt(org["Daily Cost"].replace("$", "")) < budget ? parseInt(org["**Benefit\r"]) : parseFloat(org["**Benefit\r"]) / (1 + Math.abs(budget - parseInt(org["Daily Cost"].replace("$", ""))) / budget);
    }
  }

  updateScores();
}

function updateScores(){
  table = document.getElementById("myTable2");

  for(x = 1; x < table.rows.length; x++){
    let row = table.rows[x];
    let orgName = row.children[0].innerText;
    row.children[2].innerText = parsedData.find((ele)=> ele["Organization"] == orgName)["Advising Score"];
  }


  sortTable(1);//not sure on design here.
}

let parsedData = [];
let errorText = document.getElementById("budgetErrorText");

parseData().then((data)=>{parsedData = data; createTable(data)}).then(()=>sortTable(0));