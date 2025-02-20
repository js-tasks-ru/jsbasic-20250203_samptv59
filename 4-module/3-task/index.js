function highlight(table) {
  let rows = table.querySelectorAll('tr');
  let headerCells = rows[0].querySelectorAll('td, th'); 

  let genderIndex = Array.from(headerCells).findIndex(cell => cell.textContent === 'Gender');
  if (genderIndex === -1) return; 

  let ageIndex = Array.from(headerCells).findIndex(cell => cell.textContent === 'Age');
  if (ageIndex === -1) return; 

  rows.forEach(row => {
    let cells = row.querySelectorAll('td');
    
    if (cells.length > genderIndex) { 
      let genderCell = cells[genderIndex]; 

      if (genderCell.textContent.trim() === 'm') {
        row.classList.add('male');
      } else if (genderCell.textContent.trim() === 'f') {
        row.classList.add('female');
      }
    }

    if (cells.length > ageIndex) {
      let ageCell = cells[ageIndex]; 
      let ageValue = parseInt(ageCell.textContent, 10); 

      if (!isNaN(ageValue) && ageValue < 18) { 
        row.style.textDecoration = 'line-through';
      }
    }

    let availableItem = row.querySelector('[data-available="true"]');
    let unavailableItem = row.querySelector('[data-available="false"]');

    if (availableItem) {
      row.classList.add('available');
    }
    if (unavailableItem) {
      row.classList.add('unavailable');
    }
    
    if (!availableItem && !unavailableItem) {
      row.setAttribute('hidden', 'true')
    } 
  });
}