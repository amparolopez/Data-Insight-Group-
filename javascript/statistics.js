
let other = document.title === "House Attendance"  || document.little === "House Party Loyalty" 
? "senate" : "house"
const endpoint= `https://api.propublica.org/congress/v1/113/${other}/members.json`


let init = {
  headers:{
    "X-API-Key": "iuf98CkeEAxHNF229pocVovY7PNS3ylkX2h6eubl"
  }
}

fetch(endpoint, init)
.then(api =>api.json())
.then(datas=>{
  myProgram(datas)
})
function myProgram(data){

let members = data.results[0].members

let statisctics ={
  democrats:[],
  republicans:[],
  independents:[],
  mostLoyal:[],
  leastLoyal:[],
  mostEngaged:[],
  leastEngaged:[]
}
statisctics.democrats = members.filter(member=>member.party === "D")
statisctics.republicans = members.filter(member=>member.party === "R")
statisctics.independents = members.filter(member=>member.party === "ID")


function calcularPromedio(array, propiedad){
  let calcularPromedio
  let suma = 0
  array.forEach(member => {
    suma += member[propiedad]
  });
  let cantidad = array.length
  calcularPromedio= suma / cantidad 
  return calcularPromedio;
}

function sumPercent (){
  let republicanpct = Number (calcularPromedio(statisctics.republicans,"votes_with_party_pct"))
  let democratspct = Number (calcularPromedio(statisctics.democrats,"votes_with_party_pct"))
  let independentpct = Number (calcularPromedio(statisctics.independents,"votes_with_party_pct"))
  
  independentpct = isNaN(independentpct) ? 0 : independentpct
  
  let totalpct
  if (independentpct===0) {
    totalpct= ((republicanpct + democratspct)/2).toFixed(2)
  }else {
    totalpct= ((republicanpct + democratspct + independentpct)/3).toFixed(2)
  }
  return totalpct
}
let totalsum = sumPercent()

function renderGlanceDemocrats (idtabla){
let cuerpoTabla = document.querySelector(`#${idtabla} tbody`)
cuerpoTabla.innerHTML +=`
  <tr><td>Democrats</td><td>${statisctics.democrats.length}</td><td> ${calcularPromedio(statisctics.democrats,"votes_with_party_pct").toFixed(2)} &percnt; </td></tr>`}
  renderGlanceDemocrats("atGlance")

  function renderGlanceRepublicans (idtabla){
    let cuerpoTabla = document.querySelector(`#${idtabla} tbody`)
    cuerpoTabla.innerHTML +=`
  <tr><td>Republicans</td><td>${statisctics.republicans.length}</td><td> ${calcularPromedio(statisctics.republicans,"votes_with_party_pct").toFixed(2)}  &percnt; </td></tr>`}
  renderGlanceRepublicans("atGlance")

  function renderGlanceIndependents (idtabla){
    let cuerpoTabla = document.querySelector(`#${idtabla} tbody`)
    cuerpoTabla.innerHTML +=`
    <tr><td>Independents</td><td>${statisctics.independents.length}</td><td> ${statisctics.independents.length !== 0 ? calcularPromedio(statisctics.independents,"votes_with_party_pct").toFixed(2) : "0" }&percnt; </td></tr>`;
  }
    renderGlanceIndependents("atGlance")
    
    let nroreps = statisctics.democrats.length + statisctics.republicans.length + statisctics.independents.length
    
    function renderGlanceTotal (idtabla){
    let cuerpoTabla = document.querySelector (`#${idtabla} tbody `)
    cuerpoTabla.innerHTML += `
    <tr><td>Total</td><td>${nroreps} </td><td> ${sumPercent()} &percnt; </td></tr>`}
    renderGlanceTotal ("atGlance")
  
    function printTable(array, idTable, boolean, property, property2) {
      let arrayAux = [];
    
      boolean
        ? (arrayAux = array.sort((a, b) => a[property2] - b[property2]))
        : (arrayAux = array.sort((a, b) => b[property2] - a[property2]));
    
      arrayAux = arrayAux.slice(0, array.length * 0.1);
    
      let table = document.querySelector(`#${idTable}  tbody`);
    
      if (table) {
        arrayAux.forEach((member) => {
          let fullname = `${member.first_name} ${member.middle_name || ""} ${
            member.last_name
          }`;
    
          table.innerHTML += `<tr>
                                  <td class="no-decoration"><a href="${member.url}" target="_blank">${fullname}</a></td>
                                  <td class="text-center">${member[property]}</td>
                                  <td class="text-center">${member[property2]} %</td>
                              </tr>`;
        });
      }
    }
  
  printTable(members, "mostengaged", true, "missed_votes", "missed_votes_pct");
  printTable(members, "leastengaged", false, "missed_votes", "missed_votes_pct");
  
  let politicians = showPercentage(members)
  printTable(politicians, "leastloyal", true, "total_votes", "votes_with_party_pct");
  printTable(politicians, "mostloyal", false, "total_votes", "votes_with_party_pct");


  function showPercentage(array) {
    let arrayAux = [];
    array.forEach((number) => {
      let numberaux = Math.round((number.total_votes * number.votes_with_party_pct) / 100);
  
      let member = {
        first_name: number.first_name,
        middle_name: number.middle_name || '',
        last_name: number.last_name,
        total_votes: numberaux,
        votes_with_party_pct: number.votes_with_party_pct,
      };
      arrayAux.push(member);
    });
    return arrayAux;
  }

}
