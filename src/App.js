import React, {Component} from 'react'
import BarChart from './components/BarChart'
import Sort from './components/Sort'

const bars = []
for (let i = 0; i < 6; i++) {
  bars.push(new Bar('Bar ' + i, randomNum(10,100), i))
}

const nextStep = {
  targetIndex: 0,
  type: 'COMPARE'      
}

class BubbleSort extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Sort 
        initialBars={bars}
        initialStep={nextStep}
        additionalStates={{swapped: false}}
        width={'600px'}
        height={'400px'}
        goToPrevStep={goToPrevStep}
        goToNextStep={goToNextStep}
        />
    )
  }
}

function goToPrevStep() {
    const {barsHistory, stepHistory} = this.state
    if (barsHistory.length > 1 && stepHistory.length > 1) {
      this.setState({
        barsHistory: barsHistory.slice(0,-1),
        stepHistory: stepHistory.slice(0,-1)
      })      
    }  
}

function goToNextStep() {
    const {barsHistory, stepHistory} = this.state
    const targetIndex = stepHistory[stepHistory.length - 1].targetIndex

    const newBars = deepClone(barsHistory[barsHistory.length - 1])
    const barsToSort = newBars.filter((bar) => !bar.sorted)

    let targetedBar, nextBar
    for (let i = 0; i < barsToSort.length; i++) {
        if (barsToSort[i].orderIndex === targetIndex) {
          targetedBar = barsToSort[i]
        } else if (barsToSort[i].orderIndex === targetIndex + 1) {
          nextBar = barsToSort[i]
        } 
    }

    switch (stepHistory[stepHistory.length - 1].type) {
      case 'COMPARE':
        for (let bar of barsToSort) {
          bar.style = null
        }

        if (nextBar) {
          targetedBar.style = {backgroundColor: '#3F5765'}
          nextBar.style = {backgroundColor: '#BDD4DE'}
          if (targetedBar.value > nextBar.value) {
            this.setState({
              barsHistory: barsHistory.concat([newBars]),
              stepHistory: stepHistory.concat([Object.assign({}, stepHistory[stepHistory.length - 1], {
                type: 'SWITCH'
              })])
            })
          } else {
            this.setState({
              barsHistory: barsHistory.concat([newBars]),
              stepHistory: stepHistory.concat(Object.assign({}, stepHistory[stepHistory.length - 1], {
                targetIndex: targetIndex + 1
              }))
            })
          }
        } else {
          targetedBar.sorted = true
          this.setState({
            barsHistory: barsHistory.concat([newBars]),
            stepHistory: stepHistory.concat(Object.assign({}, stepHistory[stepHistory.length - 1], {
              targetIndex: 0,
              type: 'COMPARE'
            }))
          })
        }


        break
      case 'SWITCH':
        const targetedBarOrderIndex = targetedBar.orderIndex
        targetedBar.orderIndex = nextBar.orderIndex
        nextBar.orderIndex = targetedBarOrderIndex

        this.setState({
          barsHistory: barsHistory.concat([newBars]),
          stepHistory: stepHistory.concat(Object.assign({}, stepHistory[stepHistory.length - 1], {
            type: 'COMPARE',
            targetIndex: targetIndex + 1
          }))
        })
        break
      default:
        break             
    }
}

// class BubbleSort extends Component {
//   constructor(props) {
//     super(props)

//     const bars = []
//     for (let i = 0; i < 4; i++) {
//       bars.push(new Bar('Bar ' + i, randomNum(10,100), i))
//     }
//     const nextStep = {
//       targetIndex: 0,
//       type: 'COMPARE'      
//     }
//     this.state = {
//       barsHistory: [bars],
//       stepHistory: [nextStep],
//       swapped: false
//     }

//     this.goToPrevStep = this.goToPrevStep.bind(this)
//     this.goToNextStep = this.goToNextStep.bind(this)
//   }

//   goToPrevStep() {
//     const {barsHistory, stepHistory} = this.state
//     if (barsHistory.length > 1 && stepHistory.length > 1) {
//       this.setState({
//         barsHistory: barsHistory.slice(0,-1),
//         stepHistory: stepHistory.slice(0,-1)
//       })      
//     }
//   }

//   goToNextStep() {
//     const {barsHistory, stepHistory} = this.state
//     const targetIndex = stepHistory[stepHistory.length - 1].targetIndex

//     const newBars = deepClone(barsHistory[barsHistory.length - 1])
//     const barsToSort = newBars.filter((bar) => !bar.sorted)

//     let targetedBar, nextBar
//     for (let i = 0; i < barsToSort.length; i++) {
//         if (barsToSort[i].orderIndex === targetIndex) {
//           targetedBar = barsToSort[i]
//         } else if (barsToSort[i].orderIndex === targetIndex + 1) {
//           nextBar = barsToSort[i]
//         } 
//     }

//     switch (stepHistory[stepHistory.length - 1].type) {
//       case 'COMPARE':
//         for (let bar of barsToSort) {
//           bar.style = null
//         }

//         if (nextBar) {
//           targetedBar.style = {backgroundColor: '#333'}
//           nextBar.style = {backgroundColor: '#555'}
//           if (targetedBar.value > nextBar.value) {
//             this.setState({
//               barsHistory: barsHistory.concat([newBars]),
//               stepHistory: stepHistory.concat([Object.assign({}, stepHistory[stepHistory.length - 1], {
//                 type: 'SWITCH'
//               })])
//             })
//           } else {
//             this.setState({
//               barsHistory: barsHistory.concat([newBars]),
//               stepHistory: stepHistory.concat(Object.assign({}, stepHistory[stepHistory.length - 1], {
//                 targetIndex: targetIndex + 1
//               }))
//             })
//           }
//         } else {
//           targetedBar.sorted = true
//           this.setState({
//             barsHistory: barsHistory.concat([newBars]),
//             stepHistory: stepHistory.concat(Object.assign({}, stepHistory[stepHistory.length - 1], {
//               targetIndex: 0,
//               type: 'COMPARE'
//             }))
//           })
//         }


//         break
//       case 'SWITCH':
//         const targetedBarOrderIndex = targetedBar.orderIndex
//         targetedBar.orderIndex = nextBar.orderIndex
//         nextBar.orderIndex = targetedBarOrderIndex

//         this.setState({
//           barsHistory: barsHistory.concat([newBars]),
//           stepHistory: stepHistory.concat(Object.assign({}, stepHistory[stepHistory.length - 1], {
//             type: 'COMPARE',
//             targetIndex: targetIndex + 1
//           }))
//         })
//         break
//       default:
//         break             
//     }
//   }

//   render() {
//     return (
//       <div>
//         <button onClick={this.goToPrevStep}>Prev Step</button>
//         <button onClick={this.goToNextStep}>Next Step</button>
//         <BarChart 
//           bars={this.state.barsHistory[this.state.barsHistory.length - 1]}
//           width="600px"
//           height="400px" />
//       </div>
//     );
//   }
// }

export default BubbleSort

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