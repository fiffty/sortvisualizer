import React, {Component} from 'react'
import BarChart from './components/BarChart'
import Sort from './components/Sort'

const bars = []
for (let i = 0; i < 10; i++) {
  bars.push(new Bar('Bar ' + i, randomNum(10,100), i))
}

class BubbleSort extends Component {
  render() {
    function goToNextStep() {
        const {barsHistory, stepHistory} = this.state
        const currentStep = stepHistory[stepHistory.length - 1]
        const targetIndex = currentStep.targetIndex

        const newBars = deepClone(barsHistory[barsHistory.length - 1])
        const barsToSort = newBars.filter((bar) => !bar.sorted)

        let aBar, bBar
        for (let i = 0; i < barsToSort.length; i++) {
            if (barsToSort[i].orderIndex === targetIndex) {
              aBar = barsToSort[i]
            } else if (barsToSort[i].orderIndex === targetIndex + 1) {
              bBar = barsToSort[i]
            } 
        }

        switch (currentStep.type) {
          case 'COMPARE':
            for (let bar of barsToSort) {
              bar.style = null
            }

            if (bBar) {
              aBar.style = {backgroundColor: '#3F5765'}
              bBar.style = {backgroundColor: '#BDD4DE'}
              if (aBar.value > bBar.value) {
                this.setState({
                  barsHistory: barsHistory.concat([newBars]),
                  stepHistory: stepHistory.concat([Object.assign({}, currentStep, {
                    type: 'SWITCH'
                  })])
                })
              } else {
                this.setState({
                  barsHistory: barsHistory.concat([newBars]),
                  stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                    targetIndex: targetIndex + 1
                  }))
                })
              }
            } else {
              aBar.sorted = true
              this.setState({
                barsHistory: barsHistory.concat([newBars]),
                stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                  targetIndex: 0,
                  type: 'COMPARE'
                }))
              })
            }


            break
          case 'SWITCH':
            const aBarOrderIndex = aBar.orderIndex
            aBar.orderIndex = bBar.orderIndex
            bBar.orderIndex = aBarOrderIndex

            this.setState({
              barsHistory: barsHistory.concat([newBars]),
              stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                type: 'COMPARE',
                targetIndex: targetIndex + 1
              }))
            })
            break
          default:
            break             
        }
    }

    const nextStep = {
      targetIndex: 0,
      type: 'COMPARE'      
    }

    return (
      <Sort 
        initialBars={bars}
        initialStep={nextStep}
        additionalStates={{swapped: false}}
        width={'600px'}
        height={'400px'}
        goToNextStep={goToNextStep}
        />
    )
  }
}



class SelectSort extends Component {
  render() {
    function goToNextStep() {
        const {barsHistory, stepHistory} = this.state
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
            console.log(aBar)
            console.log(numOfSorted)
            if (aBar.orderIndex !== numOfSorted - 1) {
              for (let i = 0; i < barsToSort.length; i++) {
                if (barsToSort[i].orderIndex === numOfSorted) {
                  barsToSort[i].orderIndex = aBar.orderIndex
                }
              }
              // barsToSort[numOfSorted].orderIndex = aBar.orderIndex
              aBar.orderIndex = numOfSorted
            }

            this.setState({
              barsHistory: barsHistory.concat([newBars]),
              stepHistory: stepHistory.concat(Object.assign({}, currentStep, {
                type: 'SELECT_AS_MIN',
                aIndex: numOfSorted + 1
              }))
            })              
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
        initialBars={bars}
        initialStep={nextStep}
        additionalStates={{swapped: false}}
        width={'600px'}
        height={'400px'}
        goToNextStep={goToNextStep}
        />
    )
  }
}

// export default BubbleSort
export default SelectSort

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