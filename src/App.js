import React, {Component} from 'react'
import BarChart from './components/BarChart'
import Sort from './components/Sort'
const Rx = require('rxjs/Rx')
const Observable = Rx.Observable

class BubbleSort extends Component {
  constructor() {
    super();

    const initialSortState = {
      currentBars: new Array(6).fill().map((x,i) => new Bar('Bar ' + i, randomNum(10,100), i)),
      nextStep: {targetIndex: 0, type: 'COMPARE'},
    }

    this.state = {
      sortState: initialSortState,
      playing: false,
      width: '600px',
      height: '400px'   
    }
  }

  componentDidMount() {
    this.actions$ = Observable.fromEvent(document, 'action').throttle(e => Rx.Observable.interval(400)).map(e => e.detail)

    this.sortHistory$ = this.actions$
    .mergeMap(action => {
      if (!this.state.playing) {
        if (action.request === 'TOGGLE_PLAY') {
          return Observable.interval(500)
            .startWith(1)
            .takeUntil(this.actions$)
            .takeWhile(x => !this.state.sortState.sortCompleted)
            .map(x => {return {request: 'GO_TO_NEXT_STEP'}})
            .do(x => {if (!this.state.playing) {this.setState({playing: true})}})
            .finally(() => {this.setState({playing: false})})
        } else {
          return Observable.of(action)
        }
      } else {
        return Observable.of(action)
      }
    })
    .scan((acc, curr) => {
      const latestState = acc[acc.length - 1]
      if (curr.request === 'GO_TO_NEXT_STEP') {
        return latestState.sortCompleted ? acc : acc.concat(getNextBubbleSortState(latestState))
      } else if (curr.request === 'GO_TO_PREV_STEP') {
        return (acc.length <= 1) ? acc : acc.slice(0, acc.length -1)
      } else if (curr.request === 'ADD_RANDOM') {
        const newBar = new Bar('Bar ' + latestState.currentBars.length, randomNum(10,100), latestState.currentBars.length)
        const nextState = {
          currentBars: latestState.currentBars.map(bar => Object.assign({},bar,{sorted:false})).concat(newBar),
          nextStep: {targetIndex: 0, type: 'COMPARE'}  
        }
        return acc.concat([nextState])
      } else {
        return acc
      }
    }, [this.state.sortState])

    this.sortHistory$.subscribe(x => {
      // console.log(x)
      this.setState({
        sortState: x[x.length - 1]
      })
    })

    const barsContainerElem = document.getElementById('bars-container')
    const barElems = document.getElementsByClassName('bar')
    const boundaries = {
      left: barsContainerElem.getBoundingClientRect().left,
      right: barsContainerElem.getBoundingClientRect().left + barsContainerElem.getBoundingClientRect().width
    }

    const barMouseDowns = Observable.fromEvent(barElems, 'mousedown')
    .do((e) => {
      e.target.style.zIndex = 999
      e.target.style.cursor = 'ew-resize'
    })

    const barsContainerMouseMoves = Observable.fromEvent(barsContainerElem, 'mousemove')

    const barsContainerMouseUps = Observable.fromEvent(barsContainerElem, 'mouseup')
    .do((e) => {
      e.target.style.transition = '0.3s all ease'
      e.target.style.transform = 'translate3d(0px,0px,0px)'
      e.target.style.zIndex = 1
      e.target.style.cursor = 'pointer'
      setTimeout(() => {
          e.target.style.transition = '0.4s left ease'
      }, 300)
    })
    
    
    const barsMouseDrags = barMouseDowns
    .concatMap(contactPoint => {
        const bar = contactPoint.target

        return barsContainerMouseMoves
        .filter(e => e.target === bar)
        .takeUntil(barsContainerMouseUps)
        .takeWhile(e => e.target.getBoundingClientRect().left > boundaries.left && e.target.getBoundingClientRect().left + e.target.getBoundingClientRect().width < boundaries.right)
        .map(movePoint =>  { return {e: movePoint, pageX: movePoint.pageX - contactPoint.pageX}})
    })
    .forEach(obj => {
        obj.e.target.style.transform = `translate3d(${obj.pageX}px,0px,0px)`
    })
  }

  render() {
    return (
      <div>
      <Sort 
        playing={this.state.playing}
        sortCompleted={this.state.sortState.sortCompleted}
        sortState={this.state.sortState}
        additionalStates={{swapped: false}}
        width={this.state.width}
        height={this.state.height}
        />
      </div>
    )
  }
}

function getNextBubbleSortState(sortState) {
  const {currentBars, nextStep, swapped} = sortState
  const nextBars = deepClone(currentBars)
  const targetIndex = nextStep.targetIndex
  const barsToSort = nextBars.filter(bar => !bar.sorted)
  const barA = barsToSort.filter(bar => bar.orderIndex === targetIndex)[0]
  const barB = barsToSort.filter(bar => bar.orderIndex === targetIndex + 1)[0]

  switch (nextStep.type) {
    case 'COMPARE':
      barsToSort.forEach(bar => {bar.style = null})
      console.log(barA, barB)

      if (barB) {
        barA.style = {backgroundColor: '#3F5765'}
        barB.style = {backgroundColor: '#BDD4DE'}
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


class SelectSort extends Component {
  render() {
    function goToNextStep() {
        const {barsHistory, stepHistory, sortCompleted} = this.state
        if (sortCompleted) return
        const currentStep = stepHistory[stepHistory.length - 1]
        const aIndex = currentStep.aIndex
        const bIndex = currentStep.bIndex

        const newBars = deepClone(barsHistory[barsHistory.length - 1])
        const barsToSort = newBars
        const numOfSorted = barsToSort.filter((bar) => bar.sorted).length

        let aBar, bBar, aBarIsLastBar, bBarIsLastBar
        for (let i = 0; i < barsToSort.length; i++) {
            if (barsToSort[i].orderIndex === aIndex) {
              aBar = barsToSort[i]
              if (aBar.orderIndex === barsToSort.length - 1) {
                aBarIsLastBar = true
              }
            } else if (barsToSort[i].orderIndex === bIndex) {
              bBar = barsToSort[i]
              if (bBar.orderIndex === barsToSort.length - 1) {
                bBarIsLastBar = true
              }              
            }
        }

        switch (currentStep.type) {
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

            if (numOfSorted === barsToSort.length - 1) {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'FINISH',
                })),
                sortCompleted: true
              })
            } else {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'SELECT_AS_MIN',
                  aIndex: numOfSorted + 1
                }))
              })  
            }
            break
          case 'COMPARE':
            for (let bar of barsToSort) {
              bar.style = null
            }
            aBar.style = {backgroundColor: '#3F5765'}
            bBar.style = {backgroundColor: '#BDD4DE'}

            if (aBar.value > bBar.value) {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'SELECT_AS_MIN',
                  aIndex: currentStep.bIndex
                }))
              })               
            } else if (bBarIsLastBar) {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'SWITCH',
                  aIndex: currentStep.aIndex
                }))
              })
            } else {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'COMPARE',
                  bIndex: currentStep.bIndex + 1
                }))
              }) 
            }
            break
          case 'SELECT_AS_MIN':
            for (let bar of barsToSort) {
              bar.style = null
            }
            aBar.style = {backgroundColor: '#3F5765'}

            if (aBarIsLastBar) {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'SWITCH',
                  aIndex: currentStep.aIndex
                }))     
              })         
            } else {
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  type: 'COMPARE',
                  bIndex: currentStep.aIndex + 1
                }))
              }) 
            }
            break
          default:
            break
        }
    }

    const nextStep = {
      aIndex: 0,
      type: 'SELECT_AS_MIN'      
    }

    return (
      <Sort 
        initialStep={nextStep}
        width={'600px'}
        height={'400px'}
        goToNextStep={goToNextStep}
        />
    )
  }
}

export default BubbleSort
// export default SelectSort

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