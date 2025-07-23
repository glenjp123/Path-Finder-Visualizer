import { finder } from "./finder.js";
import { getXAndYFromCellNumber, simulationOn, getCellNUmber} from "./number.js";


let adventerur = false;
let destination = false;
let simulation = false;



const rowNumberInputElement = document.getElementById('row-input');
const columnNumberInputElement = document.getElementById('col-input');
const row = Number(rowNumberInputElement.value);
const col = Number(columnNumberInputElement.value);



generateGrid();

function generateGrid(){
  
  let adventPosCell= JSON.parse(localStorage.getItem('adventPosCell')) || 1;
  let destinPosCell= JSON.parse(localStorage.getItem('destinPosCell')) || row * col;
  const startXAndY=getXAndYFromCellNumber(adventPosCell);
  const endXAndY=getXAndYFromCellNumber(destinPosCell);
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
    rowStyleDimensions += 'minmax(0, 15px) ';
    cnt--;
  }

  gridMazeElement.style.gridTemplateRows = rowStyleDimensions;

  cnt = columnNumber;

  while(cnt > 0){
    columnStyleDimensions += 'minmax(0, 15px) ';
    cnt--;
  }

  gridMazeElement.style.gridTemplateColumns = columnStyleDimensions;

  cnt=1;


  while(total > 0 ){
    const randomNumber = Math.random();

    let classString = '';

    if(randomNumber >= 0.7 && cnt!== adventPosCell && cnt!== destinPosCell){

      classString = 'stone-block';
    }

    html+= `<div class="grid-maze-cell ${classString} js-grid-maze-cell-${cnt}"></div>`;
    total--;
    cnt++;
  }

  document.querySelector('.js-grid-maze').innerHTML= html;

  for(let i = 1; i <= row; ++i){
      for(let j = 1; j <=col ; ++j){
        document.querySelector(`.js-grid-maze-cell-${getCellNUmber(i,j)}`).addEventListener('click',() =>{
          console.log({
            i:i,
            j:j
          });
          if(adventerur){
            assignPositions(i,j,'adventerur');
            adventerur = false;
          }
          else if(destination){
            assignPositions(i,j,'destination');
            destination = false;
          }
        });
      }
  }

  assignPositions(startXAndY.x,startXAndY.y,'adventerur');
  assignPositions(endXAndY.x,endXAndY.y,'destination');

}


document.querySelector('.js-start-simulation-button').addEventListener('click',()=>{
    if(simulation) return;
    document.querySelector('.js-position-div').innerHTML=``;
    const adventPosCell= JSON.parse(localStorage.getItem('adventPosCell')) || 0;
    const startXAndY=getXAndYFromCellNumber(adventPosCell);
    const destinPosCell= JSON.parse(localStorage.getItem('destinPosCell')) || 0;
    const endXAndY=getXAndYFromCellNumber(destinPosCell);

    async function runSimulation(){
      simulation = true;
      await finder(startXAndY.x,startXAndY.y,endXAndY.x,endXAndY.y);
      console.log('completed');
      simulation = false;
    }

    if(adventerur || destination){
      alert(`please select ${(adventerur)? 'adventerur' : 'destination'}'s positon`);
      return;
    }
    runSimulation();
  });

document.querySelector('.js-adject-adventurer-position-button').addEventListener('click',() =>{
  if(simulation) return;
  adventerur = true;
});

document.querySelector('.js-adject-destination-position-button').addEventListener('click',() =>{
  if(simulation) return;
  destination = true;
});

document.querySelector('.js-generate-grid-maze-button').addEventListener('click', ()=>{
    if(simulation) return;
    generateGrid();
});


document.querySelector('.js-clear-maze-button').addEventListener('click',() => {
  if(simulation) return;
  for(let i = 1; i <= 1500; ++i){
    const element = document.querySelector(`.js-grid-maze-cell-${i}`);
    element.classList.remove('stone-block');
  }
});



function assignPositions(positonX, positonY, type){

  let adventPosCell= JSON.parse(localStorage.getItem('adventPosCell')) || 0;
  let destinPosCell= JSON.parse(localStorage.getItem('destinPosCell')) || 0;
  
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

