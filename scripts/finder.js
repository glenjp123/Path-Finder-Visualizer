import { getCellNUmber, getRowNumber, getColumnNumber } from "./number.js";


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function dfs(x, y, n, m, visitedCell, direction,directionInfo) {
  if (x <= 0 || x > n || y <= 0 || y > m) return;

  const cellNumber = getCellNUmber(x, y);
  const cell = document.querySelector(`.js-grid-maze-cell-${cellNumber}`);


  if(cell.classList.contains('stone-block')){
    return;
  }

  if (visitedCell[cellNumber]) return;

  visitedCell[cellNumber] = true;

  directionInfo[cellNumber] = direction;

  if (!cell.classList.contains('destination-block') && !cell.classList.contains('adventerur-block')){
    cell.classList.add('visited-mark');
  }


  await sleep(300);

  await dfs(x, y + 1, n, m, visitedCell,'came from left',directionInfo);
  await dfs(x, y - 1, n, m, visitedCell,'came from right',directionInfo);
  await dfs(x - 1, y, n, m, visitedCell,'came from down',directionInfo);
  await dfs(x + 1, y, n, m, visitedCell,'came from up',directionInfo);

}

async function markingPath(x, y,endX,endY, directionInfo) {

  const cellNumber = getCellNUmber(x, y);
  const cell = document.querySelector(`.js-grid-maze-cell-${cellNumber}`);

  if(directionInfo[cellNumber] === '0') return;

  if(!(x === endX && y === endY)){
    cell.classList.add('path-maker');
    cell.innerText = directionInfo[cellNumber];
  }

  await sleep(300);


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

async function foundMessage (found,startX,startY,endX,endY) {
  const foundMessageElement = document.querySelector('.js-path-found-message-container');

  if(found){
    foundMessageElement.innerHTML = `
      <div class="found-message-style js-found-message-style">There is a path founded from (${startX},${startY}) to (${endX},${endY}).</div> 
    `;
    document.querySelector('.js-found-message-style').classList.add('found-message');
  }
  else{
    foundMessageElement.innerHTML = `
      <div class="found-message-style
      js-found-message-style">There is no path to reach from (${startX},${startY}) to (${endX},${endY}).</div> 
    `;
    document.querySelector('.js-found-message-style').classList.add('not-found-message');
  }
}


export async function finder(startX,startY,endX,endY){
  const n = getRowNumber();
  const m = getColumnNumber();
  const visitedCell = [];
  const directionInfo = [];
  for(let i = 0; i<=(n*m); ++i){
    visitedCell.push(false);
    directionInfo.push('$');
  }
  await dfs(startX,startY,n,m,visitedCell,'0',directionInfo);

  for(let i = 1; i <= (n*m); ++i){
    const element = document.querySelector(`.js-grid-maze-cell-${i}`);
    element.classList.remove('visited-mark');
  }

  await markingPath(endX,endY,endX,endY,directionInfo);

  await foundMessage(directionInfo[getCellNUmber(endX,endY)] !== '$',startX,startY,endX,endY);


}


