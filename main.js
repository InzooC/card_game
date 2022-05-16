const GAME_STATE = {
  FirstCardWaits: 'FirstCardWaits',
  SecondCardWaits: 'SecondCardWaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished'
}

//之後把邏輯改成 １－９（四個花色），加起來＝１０得分

const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

const utility = {
  getRandomNumberArray(count) {
    const numberArray = Array.from(Array(count).keys());
    for (let index = numberArray.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index - 1));
      [numberArray[index], numberArray[randomIndex]] = [numberArray[randomIndex], numberArray[index]]
    }
    return numberArray
  }
}

const view = {
  displayCards(randomIndex) {
    const rootElement = document.querySelector('#cards')
    let rawHTML = randomIndex.map((index) => this.getCardElement(index)).join('')
    rootElement.innerHTML = rawHTML
  },
  getCardElement(index) {
    return `<div data-index="${index}" class="card back"></div>`
  },
  getCardContent(index) {
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
  flipCards(...cards) {
    cards.map(card => {
      if (card.classList.contains('back')) {
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return
      }
      card.classList.add('back')
      card.innerHTML = null

    })
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
  pairedCards(...cards) {
    console.log(cards)
    cards.map(card => {
      card.classList.add('paired')
    })
  }
}

const model = {
  revealedCards: [],
  isCardMatched() {
    // if (this.revealedCards[0].dataset.index % 13 === this.revealedCard[1].dataset.index % 13) {
    //   return true
    // } else if (!this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13) {
    //   return false
    // }
    // return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13

    if (this.revealedCards[0].dataset.index % 13 === 12 && this.revealedCards[1].dataset.index % 13 === 12) {
      return true //兩張都是13
    } else if (((this.revealedCards[0].dataset.index % 13) + (this.revealedCards[1].dataset.index % 13)) === 11) {
      return true  //加起來=13
    } else {
      return false
    }
  }
}

const control = {
  currentState: GAME_STATE.FirstCardWaits,
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },
  dispatchCardAction(card) {
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardWaits:
        console.log('第一張牌 :' + card.dataset.index)
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardWaits
        break
      case GAME_STATE.SecondCardWaits:
        console.log('第二張牌:' + card.dataset.index)
        view.flipCards(card)
        model.revealedCards.push(card)
        if (model.isCardMatched()) {
          this.currentState = GAME_STATE.CardsMatched
          view.pairedCards(...model.revealedCards)
          model.revealedCards = []
          this.currentState = GAME_STATE.FirstCardWaits
          //給score加分

        } else if (!model.isCardMatched()) {
          this.currentState = GAME_STATE.CardsMatchFailed
          //卡片延遲１秒後闔上
          // setTimeout(() => {
          //   view.flipCards(...model.revealedCards)
          //   model.revealedCards = []
          //   this.currentState = GAME_STATE.FirstCardWaits
          // }, 1000)
          setTimeout(this.resetCards, 1000)
        }
        break
    }
  },
  resetCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    control.currentState = GAME_STATE.FirstCardWaits
  }
}

control.generateCards()

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', onCLickCard => {
    control.dispatchCardAction(card)
    console.log(control.currentState)
  })
})