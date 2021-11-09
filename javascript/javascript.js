if (document.title === "DATA INSIGHT GROUP"){
let botonRead = document.querySelector("#readMore")
botonRead.addEventListener("click", ()=>{
  if (botonRead.innerText === "Read More"){ 
    botonRead.innerText = "Read Less"
} else{
  botonRead.innerText = "Read Less"
}
})
}

let other = document.title === "Senate" ? "senate" : "house"
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

  
  
  //FILL TABLE 
  let members = data.results[0].members;
  let tabla = document.querySelector(`#table tbody`);
  
  function mostrarTabla(array) {
    tabla.innerHTML = "";
    array.forEach((member) => {
      let name = ` ${member.last_name} ${member.first_name} ${
        member.middle_name ? member.middle_name : ""
    }`;
    tabla.innerHTML += `
    <tr>
    <td> <a href ="${member.url}">  ${name} </a> </td>
    <td> ${member.party}</td>
    <td> ${member.state}</td>
    <td> ${member.seniority}</td>
    <td> ${member.votes_with_party_pct}</td>
    </tr>
    `;
  });
}
mostrarTabla(members);

// filtrar por select

function noRepeatState(array) {
  let showState = [];
  array.forEach((member) => {
    if (!showState.includes(member.state)) {
      showState.push(member.state);
    }
  });
  return showState;
}
//esta es una función para que no repita lo paises-

let select = document.querySelector("#select");

let states = noRepeatState(members).sort();

function showStates() {
  states.forEach((state) => {
    select.innerHTML += `<option value="${state}"> ${state} </option>`;
  });
}
showStates(members);
//aca se tiene que imprimir la barra select

select.addEventListener("change", filterState);

// filter states

function filterState() {
  let stateSelected;
  if (select.value != "Select") {
    stateSelected = members.filter((member) => member.state == select.value);
  } else {
    stateSelected = members;
  }
  
  //filter by party (checkbox)
  stateSelected = stateSelected.filter((members) =>
  tipos.includes(members.party)
  );
  mostrarTabla(stateSelected);
}

//checkbox
let tipos = ["D", "R", "ID"];
let check = document.querySelectorAll("input[type='checkbox']");
let checkArray = Array.from(check);
checkArray.forEach((cliqueado) => {
  cliqueado.addEventListener("change", (evento) => {
    let seleccionado = evento.target.value;
    let estaChequeado = evento.target.checked;
    if (tipos.includes(seleccionado) && !estaChequeado) {
      tipos = tipos.filter((elemento) => elemento != seleccionado);
    } else {
      tipos.push(seleccionado);
    }
    filterState();
  });
});

}