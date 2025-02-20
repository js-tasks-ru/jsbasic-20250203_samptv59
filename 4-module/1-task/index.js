function makeFriendsList(friends) {
  
  const ul = document.createElement('ul');

  friends.forEach(item => {
    const li = document.createElement('li')
    li.textContent = `${item.firstName} ${item.lastName}`
    ul.appendChild(li) 
  })

  return ul

}
