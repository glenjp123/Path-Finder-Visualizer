const rowNumberInputElement = document.getElementById('row-input');
const columnNumberInputElement = document.getElementById('col-input');


export function getCellNUmber(row,column){
  const columnNumber = Number(columnNumberInputElement.value);

  const cellNumber =(row-1)*columnNumber + column;
  return cellNumber;
}


export function getRowNumber(){
  return Number(rowNumberInputElement.value);
}

export function getColumnNumber(){
  return Number(columnNumberInputElement.value);
}

export function getXAndYFromCellNumber(cellNumber){
  let row = 0;
  let cnt=0;
  const columnNumber = getColumnNumber();
  const limit = cellNumber
  while(cnt+columnNumber < limit){
    cnt+=columnNumber;
    cellNumber-=columnNumber;
    row++;
  }
  return {
    x: row +1,
    y: cellNumber
  } 
}