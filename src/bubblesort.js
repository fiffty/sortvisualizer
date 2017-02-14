export const initialSortState = {
      currentBars: new Array(8).fill().map((x,i) => new Bar('Bar ' + i, String(randomNum(10,100)), i)),
      nextStep: {targetIndex: 0, type: 'COMPARE'},
    }

export function getNextBubbleSortState(sortState) {
  const {currentBars, nextStep, swapped} = sortState
  const nextBars = deepClone(currentBars)
  const targetIndex = nextStep.targetIndex
  const barsToSort = nextBars.filter(bar => !bar.sorted)
  const barA = barsToSort.filter(bar => bar.orderIndex === targetIndex)[0]
  const barB = barsToSort.filter(bar => bar.orderIndex === targetIndex + 1)[0]

  switch (nextStep.type) {
    case 'COMPARE':
      barsToSort.forEach(bar => {bar.style = null})

      if (barB) {
        barA.style = {backgroundColor: '#ff8b3b'}
        barB.style = {backgroundColor: '#ffd1b1'}
        if (barA.value > barB.value) {
          return Object.assign({}, sortState, {
            currentBars: nextBars,
            nextStep: Object.assign({}, nextStep, {type: 'SWITCH'})
          })
        } else {
          return Object.assign({}, sortState, {
            currentBars: nextBars,
            nextStep: Object.assign({}, nextStep, {targetIndex: targetIndex + 1})
          })
        }
      } else {
        if (barsToSort.length <= 1 && !swapped) {
          barsToSort.forEach(bar => {bar.sorted = true})
          return Object.assign({}, sortState, {
            currentBars: nextBars,
            nextStep: Object.assign({}, nextStep, {targetIndex: 0, type: 'FINISH'}),
            sortCompleted: true
          })
        } else {
          barA.sorted = true
          return Object.assign({}, sortState, {
            currentBars: nextBars,
            nextStep: Object.assign({}, nextStep, {targetIndex: 0, type: 'COMPARE'}),
            swapped: false
          })
        }
      }
    case 'SWITCH':
      const barAOrderIndex = barA.orderIndex
      barA.orderIndex = barB.orderIndex
      barB.orderIndex = barAOrderIndex

      return Object.assign({}, sortState, {
        currentBars: nextBars,
        nextStep: Object.assign({}, nextStep, {type: 'COMPARE',targetIndex: targetIndex + 1}),
        swapped: true
      })
    default:
      break             
  }      
}

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function Bar(label, value, orderIndex) {
  this.label = label
  this.value = value
  this.orderIndex = orderIndex
}

function deepClone(obj) {
  const json = JSON.stringify(obj)
  return JSON.parse(json)
}