function getMinMax(str) {
  let arr = str.split(' ')
  let numbers = []
  
  for (let item of arr) {
    let num = parseFloat(item)
    if (!isNaN(num)) {
      numbers.push(num)
    }
  }
    
  let min = Math.min(...numbers)
  let max = Math.max(...numbers)
  
  return { min, max };
}
