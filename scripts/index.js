import { finder } from "./finder.js";
import { getXAndYFromCellNumber, simulationOn} from "./number.js";



const rowNumberInputElement = document.getElementById('row-input');
const columnNumberInputElement = document.getElementById('col-input');



function generateGrid(){
  deleteStorage();
  document.querySelector('.js-path-found-message-container').innerHTML = ``;
  const rowNumber= rowNumberInputElement.value;
  const columnNumber = columnNumberInputElement.value;
  let html = ``;
  let total = rowNumber*columnNumber;
  let cnt = 0;

  let rowStyleDimensions = '';
  let columnStyleDimensions = '';

  const gridMazeElement = document.querySelector('.js-grid-maze');

  cnt = rowNumber;

  while(cnt > 0){
    rowStyleDimensions += '100px ';
    cnt--;
  }

  gridMazeElement.style.gridTemplateRows = rowStyleDimensions;

  cnt = columnNumber;

  while(cnt > 0){
    columnStyleDimensions += 'minmax(0, 100px) ';
    cnt--;
  }

  gridMazeElement.style.gridTemplateColumns = columnStyleDimensions;

  cnt=1;


  while(total > 0 ){
    const randomNumber = Math.random();

    let classString = '';

    if(randomNumber >= 0.7){

      classString = 'stone-block';
    }

    html+= `<div class="grid-maze-cell ${classString} js-grid-maze-cell-${cnt}">cell ${cnt}</div>`;
    total--;
    cnt++;
  }

  document.querySelector('.js-grid-maze').innerHTML= html;


  html = `
  <div class="select-start-and-destination-area-input-container
      js-select-start-and-destination-area-input-container
      ">
    <div class= "adventerur-div">
      <div>Select the adventurer's position :</div>
      <div>
        <label for="adventurer-x">X : </label>
        <input class = "input-box" id="adventurer-x" type="number">
        <label for="adventurer-y">Y : </label>
        <input class ="input-box" id="adventurer-y" type="number">
        <button class="select-adventurer-input-button
        js-select-adventurer-input-button
        ">Select</button>
      </div>
    </div>

    <div class ="destination-div">
      <div>Select the destination's position :</div>
      <div>
        <label for="destination-x">X : </label>
        <input class = "input-box" id="destination-x" type="number">
        <label for="destination-y">Y : </label>
        <input class ="input-box" id="destination-y" type="number">
        <button class="select-destination-input-button
        js-select-destination-input-button
        ">Select</button>
      </div>
    </div>

    <button class="start-simulation-button js-start-simulation-button">Start The Hunt!</button>
    </div>  
  `;

  document.querySelector('.js-position-div').innerHTML = html;



  document.querySelector('.js-select-adventurer-input-button').addEventListener('click',() =>{
    const adventerurX= Number(document.getElementById('adventurer-x').value);
    const adventerurY =Number(document.getElementById('adventurer-y').value);

    assignPositions(adventerurX,adventerurY,'adventerur');
  });

  document.querySelector('.js-select-destination-input-button').addEventListener('click',() =>{
    const destinationX=Number( document.getElementById('destination-x').value);
    const destinationY = Number(document.getElementById('destination-y').value);
    assignPositions(destinationX,destinationY,'destination');
  });

  document.querySelector('.js-start-simulation-button').addEventListener('click',()=>{
    document.querySelector('.js-position-div').innerHTML=``;
    const adventPosCell= JSON.parse(localStorage.getItem('adventPosCell')) || 0;
    const startXAndY=getXAndYFromCellNumber(adventPosCell);
    const destinPosCell= JSON.parse(localStorage.getItem('destinPosCell')) || 0;
    const endXAndY=getXAndYFromCellNumber(destinPosCell);

    async function runSimulation(){
      await finder(startXAndY.x,startXAndY.y,endXAndY.x,endXAndY.y);
    }

    runSimulation();
    

  });

}

document.querySelector('.js-generate-grid-maze-button').addEventListener('click', ()=>{
  // if(simulationOn === 0){
    generateGrid();
  // }
})



function assignPositions(positonX, positonY, type){

  let adventPosCell= JSON.parse(localStorage.getItem('adventPosCell')) || 0;
  let destinPosCell= JSON.parse(localStorage.getItem('destinPosCell')) || 0
  
  const columnNumber = Number(columnNumberInputElement.value);

  const cellNumber = (positonX-1)*columnNumber + positonY ;

  const cell = document.querySelector(`.js-grid-maze-cell-${cellNumber}`);

  if(cell.classList.contains('stone-block')){
    alert('You cannot assign in this cell!');
    return;
  }
  if(type === 'adventerur'){
    if(cell.classList.contains('destination-block')){
      alert("You cannot assign in destination's cell!");
      return;
    }
    if(adventPosCell > 0){
      document.querySelector(`.js-grid-maze-cell-${adventPosCell}`).classList.remove('adventerur-block');
    }
    cell.classList.add('adventerur-block');
    adventPosCell = cellNumber;
    localStorage.setItem('adventPosCell',JSON.stringify(cellNumber));
  }
  else if(type === 'destination'){
    if(cell.classList.contains('adventerur-block')){
      alert("You cannot assign in adventerur's cell!");
      return;
    }
    if(destinPosCell > 0){
       document.querySelector(`.js-grid-maze-cell-${destinPosCell}`).classList.remove('destination-block');
    }
    cell.classList.add('destination-block');
    destinPosCell = cellNumber;
    localStorage.setItem('destinPosCell',JSON.stringify(cellNumber));
  }

}


function deleteStorage(){
  localStorage.removeItem('adventPosCell');
  localStorage.removeItem('destinPosCell');
}


