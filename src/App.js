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
    this.state = {
      bars,
      barsHistory: [bars],
      nextStep: {
        targetIndex: 0,
        type: 'COMPARE'
      }
    }

    this.goToPrevStep = this.goToPrevStep.bind(this)
    this.goToNextStep = this.goToNextStep.bind(this)
  }

  goToPrevStep() {
    console.log(this.state)
    const {barsHistory} = this.state
    if (barsHistory.length > 1) {
      this.setState({
        barsHistory: barsHistory.slice(0,-1)
      })      
    }
  }

  goToNextStep() {
    const {bars, barsHistory, nextStep} = this.state
    const targetIndex = nextStep.targetIndex
    console.log(nextStep)

    const newBars = deepClone(bars)
    let targetedBar, nextBar
    for (let i = 0; i < newBars.length; i++) {
        if (newBars[i].orderIndex === targetIndex) {
          targetedBar = newBars[i]
        } else if (newBars[i].orderIndex === targetIndex + 1) {
          nextBar = newBars[i]
        } 
    }

    switch (nextStep.type) {
      case 'COMPARE':
        for (let bar of newBars) {
          bar.style = null
        }
        targetedBar.style = {backgroundColor: '#333'}
        nextBar.style = {backgroundColor: '#555'}

        if (targetedBar.value > nextBar.value) {
          this.setState({
            bars: newBars,
            barsHistory: barsHistory.concat([newBars]),
            nextStep: Object.assign({}, nextStep, {
              type: 'SWITCH'
            })
          })
        } else {
          this.setState({
            bars: newBars,
            barsHistory: barsHistory.concat([newBars]),
            nextStep: Object.assign({}, nextStep, {
              targetIndex: targetIndex + 1
            })
          })
        }
        break
      case 'SWITCH':
        const targetedBarOrderIndex = targetedBar.orderIndex
        targetedBar.orderIndex = nextBar.orderIndex
        nextBar.orderIndex = targetedBarOrderIndex

        this.setState({
          bars: newBars,
          barsHistory: barsHistory.concat([newBars]),
          nextStep: Object.assign({}, nextStep, {
            type: 'COMPARE',
            targetIndex: targetIndex + 1
          })
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