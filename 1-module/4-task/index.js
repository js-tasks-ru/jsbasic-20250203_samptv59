function checkSpam(str) {
  if (!str) return false; 

  str = str.toLowerCase(); 

  return str.includes('1xbet') || str.includes('xxx');
}
