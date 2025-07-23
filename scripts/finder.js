import { getCellNUmber, getRowNumber, getColumnNumber } from "./number.js";


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function dfs(x, y, n, m, visitedCell, direction,directionInfo,endX,endY) {
  if (x <= 0 || x > n || y <= 0 || y > m) return;


  const cellNumber = getCellNUmber(x, y);
  const cell = document.querySelector(`.js-grid-maze-cell-${cellNumber}`);


  if(cell.classList.contains('stone-block')){
    return;
  }

  if (visitedCell[getCellNUmber(endX,endY)]) return;
 
  if (visitedCell[cellNumber]) return;

  visitedCell[cellNumber] = true;

  directionInfo[cellNumber] = direction;

  if(cell.classList.contains    ('destination-block')){
    await sleep(1000);
    return;
  }


  if (!cell.classList.contains('destination-block') && !cell.classList.contains('adventerur-block')){
    cell.classList.add('cell-animate-visited-mark');
  }


  await sleep(50);

  await dfs(x, y + 1, n, m, visitedCell,'came from left',directionInfo,endX,endY);
  await dfs(x, y - 1, n, m, visitedCell,'came from right',directionInfo,endX,endY);
  await dfs(x - 1, y, n, m, visitedCell,'came from down',directionInfo,endX,endY);
  await dfs(x + 1, y, n, m, visitedCell,'came from up',directionInfo,endX,endY);

}

async function markingPath(x, y,endX,endY, directionInfo) {

  const cellNumber = getCellNUmber(x, y);
  const cell = document.querySelector(`.js-grid-maze-cell-${cellNumber}`);

  if(directionInfo[cellNumber] === '0') return;

  await sleep(50);

  if(!(x === endX && y === endY)){
    cell.classList.add('cell-animate-path-maker');
  }

  if(directionInfo[cellNumber] === 'came from left'){
    await markingPath(x,y-1,endX,endY,directionInfo);
  }
  else if(directionInfo[cellNumber] === 'came from right'){
    await markingPath(x,y+1,endX,endY,directionInfo);
  }
  else if(directionInfo[cellNumber] === 'came from down'){
    await markingPath(x+1,y,endX,endY,directionInfo);
  }
  else if(directionInfo[cellNumber] === 'came from up'){
    await markingPath(x-1,y,endX,endY,directionInfo);
  }

}

async function foundMessage (found,startX,startY,endX,endY,n,m) {

  await sleep(1000);
  const foundMessageElement = document.querySelector('.js-path-found-message-container');

  if(found){
    foundMessageElement.innerHTML = `
      <div class="found-message-style js-found-message-style">There is a path founded to reach destination.</div> 
    `;
    document.querySelector('.js-found-message-style').classList.add('found-message');
  }
  else{
    foundMessageElement.innerHTML = `
      <div class="found-message-style
      js-found-message-style">There is no path to reach destination.</div> 
    `;
    document.querySelector('.js-found-message-style').classList.add('not-found-message');
  }
}


export function clearPath(){
   for(let i = 1; i <= 1500; ++i){
    const element = document.querySelector(`.js-grid-maze-cell-${i}`);
    element.classList.remove('cell-animate-visited-mark');
    element.classList.remove('cell-animate-path-maker');
  }
}


export async function finder(startX,startY,endX,endY){
  clearPath();
  document.querySelector('.js-path-found-message-container').innerHTML =``;
  window.scrollTo(0, document.body.scrollHeight);
  const n = getRowNumber();
  const m = getColumnNumber();
  const visitedCell = [];
  const directionInfo = [];
  for(let i = 0; i<=(n*m); ++i){
    visitedCell.push(false);
    directionInfo.push('$');
  }
  await dfs(startX,startY,n,m,visitedCell,'0',directionInfo,endX,endY);

  await sleep(200);

  await markingPath(endX,endY,endX,endY,directionInfo);

  await foundMessage(directionInfo[getCellNUmber(endX,endY)] !== '$',startX,startY,endX,endY,n,m);

}


