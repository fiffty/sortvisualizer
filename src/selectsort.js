export const initialSortState = {
  currentBars: new Array(8).fill().map((x,i) => new Bar('Bar ' + i, String(randomNum(10,100)), i)), nextStep: {targetIndex: 0, type: 'COMPARE'}
}

export function getNextSelectSortState(sortState) {
  const {currentBars, nextStep} = sortState
  const nextBars = deepClone(currentBars)
  const barsToSort = nextBars.filter(bar => !bar.sorted)
  const numOfSorted = nextBars.length - barsToSort.length
  if (!nextStep.aIndex) nextStep.aIndex = 0
  if (!nextStep.bIndex) nextStep.bIndex = 1
  const {aIndex, bIndex} = nextStep

  let aBar, bBar, aBarIsLastBar, bBarIsLastBar
  for (let i = 0; i < barsToSort.length; i++) {
      if (barsToSort[i].orderIndex === aIndex) {
        aBar = barsToSort[i]
        if (aBar.orderIndex === nextBars.length - 1) {
          aBarIsLastBar = true
        }
      } else if (barsToSort[i].orderIndex === bIndex) {
        bBar = barsToSort[i]
        if (bBar.orderIndex === nextBars.length - 1) {
          bBarIsLastBar = true
        }              
      }
  }

  switch (nextStep.type) {
    case 'SWITCH':
      for (let bar of barsToSort) {
        bar.style = null
      }
      aBar.sorted = true
      if (aBar.orderIndex !== numOfSorted - 1) {
        for (let i = 0; i < barsToSort.length; i++) {
          if (barsToSort[i].orderIndex === numOfSorted) {
            barsToSort[i].orderIndex = aBar.orderIndex
          }
        }
        aBar.orderIndex = numOfSorted
      }

      if (numOfSorted === nextBars.length - 1) {
        return Object.assign({}, sortState, {
          currentBars: nextBars,
          nextStep: {
            type: 'FINISH'
          },
          sortCompleted: true
        })
      } else {
        return Object.assign({}, sortState, {
          currentBars: nextBars,
          nextStep: Object.assign({}, nextStep, {
            type: 'SELECT_AS_MIN',
            aIndex: numOfSorted + 1
          })
        })  
      }
    case 'COMPARE':
      for (let bar of barsToSort) {
        bar.style = null
      }
      aBar.style = {backgroundColor: '#3F5765'}
      bBar.style = {backgroundColor: '#BDD4DE'}

      if (aBar.value > bBar.value) {
        return Object.assign({}, sortState, {
          currentBars: nextBars,
          nextStep: Object.assign({}, nextStep, {
            type: 'SELECT_AS_MIN',
            aIndex: nextStep.bIndex
          })
        })              
      } else if (bBarIsLastBar) {
        return Object.assign({}, sortState, {
          currentBars: nextBars,
          nextStep: Object.assign({}, nextStep, {
            type: 'SWITCH',
            aIndex: nextStep.aIndex
          })
        })
      } else {
        return Object.assign({}, sortState, {
          currentBars: nextBars,
          nextStep: Object.assign({}, nextStep, {
            type: 'COMPARE',
            bIndex: nextStep.bIndex + 1
          })
        }) 
      }
    case 'SELECT_AS_MIN':
      for (let bar of barsToSort) {
        bar.style = null
      }
      aBar.style = {backgroundColor: '#3F5765'}

      if (aBarIsLastBar) {
        return Object.assign({}, sortState, {
          currentBars: nextBars,
          nextStep: Object.assign({}, nextStep, {
            type: 'SWITCH',
            aIndex: nextStep.aIndex
          })    
        })        
      } else {
        return Object.assign({}, sortState, {
          currentBars: nextBars,
          nextStep: Object.assign({}, nextStep, {
            type: 'COMPARE',
            bIndex: nextStep.aIndex + 1
          })
        })
      }
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