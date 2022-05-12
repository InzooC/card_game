const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]


const view = {
  displayCards(number) {
    const rootElement = document.querySelector('#cards')
    const randomCardArray = this.getRandomNumberArray(number)
    let rawHTML = randomCardArray.map((index) => this.getCardElement(index)).join('')
    rootElement.innerHTML = rawHTML
  },
  getCardElement(index) {
    let number = this.transformNumber((index % 13) + 1)
    let symbol = Symbols[Math.floor(index / 13)]
    return `
    <div class="card">
      <p>${number}</p>
      <img src="${symbol}" alt="">
      <p>${number}</p>
    </div>
    `
  },
  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  getRandomNumberArray(count) {
    //創一個０－５１的鎮列
    //使用for迴圈，
    //隨機跟中間人任何一個數字
    //從最後面開始，跟隨機抽中的數字對調。
    const numberArray = Array.from(Array(count).keys());
    console.log(numberArray)
    for (let index = numberArray.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index - 1));
      [numberArray[index], numberArray[randomIndex]] = [numberArray[randomIndex], numberArray[index]]
    }
    console.log(numberArray)
    return numberArray
  }
}

const model = {

}

const control = {

}

view.displayCards(52)