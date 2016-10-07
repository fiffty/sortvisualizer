import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BarChart from './components/BarChart'


const _bars = []

for (let i = 0; i < 4; i++) {
  _bars.push(new Bar('Bar ' + i, randomNum(10,100), i))
}


class BubbleSort extends Component {
  constructor(props) {
    super(props)

    const bars = []
    for (let i = 0; i < 4; i++) {
      bars.push(new Bar('Bar ' + i, randomNum(10,100), i))
    }
    const nextStep = {
      targetIndex: 0,
      type: 'COMPARE'      
    }
    this.state = {
      barsHistory: [bars],
      stepsHistory: [nextStep],
      swapped: false
    }

    this.goToPrevStep = this.goToPrevStep.bind(this)
    this.goToNextStep = this.goToNextStep.bind(this)
  }

  goToPrevStep() {
    const {barsHistory, stepsHistory} = this.state
    if (barsHistory.length > 1 && stepsHistory.length > 1) {
      this.setState({
        barsHistory: barsHistory.slice(0,-1),
        stepsHistory: stepsHistory.slice(0,-1)
      })      
    }
  }

  goToNextStep() {
    const {barsHistory, stepsHistory} = this.state
    const targetIndex = stepsHistory[stepsHistory.length - 1].targetIndex

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

    switch (stepsHistory[stepsHistory.length - 1].type) {
      case 'COMPARE':
        for (let bar of barsToSort) {
          bar.style = null
        }

        if (nextBar) {
          targetedBar.style = {backgroundColor: '#333'}
          nextBar.style = {backgroundColor: '#555'}
          if (targetedBar.value > nextBar.value) {
            this.setState({
              barsHistory: barsHistory.concat([newBars]),
              stepsHistory: stepsHistory.concat([Object.assign({}, stepsHistory[stepsHistory.length - 1], {
                type: 'SWITCH'
              })])
            })
          } else {
            this.setState({
              barsHistory: barsHistory.concat([newBars]),
              stepsHistory: stepsHistory.concat(Object.assign({}, stepsHistory[stepsHistory.length - 1], {
                targetIndex: targetIndex + 1
              }))
            })
          }
        } else {
          targetedBar.sorted = true
          this.setState({
            barsHistory: barsHistory.concat([newBars]),
            stepsHistory: stepsHistory.concat(Object.assign({}, stepsHistory[stepsHistory.length - 1], {
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

        // if () {

        // }

        this.setState({
          barsHistory: barsHistory.concat([newBars]),
          stepsHistory: stepsHistory.concat(Object.assign({}, stepsHistory[stepsHistory.length - 1], {
            type: 'COMPARE',
            targetIndex: targetIndex + 1
          }))
        })
        break
      default:
        break             
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.goToPrevStep}>Prev Step</button>
        <button onClick={this.goToNextStep}>Next Step</button>
        <BarChart 
          bars={this.state.barsHistory[this.state.barsHistory.length - 1]}
          width="600px"
          height="400px"
          order={this.state.order}/>
      </div>
    );
  }
}

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