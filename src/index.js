import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import BubbleSort from './App';
import './index.css';

const Rx = require('rxjs/Rx')
const Observable = Rx.Observable

class Provider extends Component {
  constructor() {
    super()


    // this.actionEvents$ = Observable.fromEvent(document, 'action').map(e => e.detail)


    // this.test$ = this.actionEvents$
    //   .map(action => {
    //     if (action.request === 'GO_TO_NEXT_STEP') {

    //     }
    //   })
      // .scan((prev, curr) => prev.concat([curr]),[])
    
    // this.test$.subscribe(value => console.log(value))

    // this.bars$ = Observable.create(observer => {
    //   let bars = new Array(4).fill()
    //     .map((x,i) => new Bar('Bar ' + i, randomNum(10,100), i))
      
    //   observer.next(bars)

    //   setTimeout(() => {
    //     bars = new Array(4).fill()
    //       .map((x,i) => new Bar('Bar ' + i, randomNum(10,100), i))
      
    //     observer.next(bars)
    //   }, 2000)
    // })
  }

  render() {
    return (
      <div>
        <BubbleSort />
      </div>
    )
  }
}

Provider.childContextTypes = {
  dispatch: PropTypes.func
}


ReactDOM.render(
  <Provider />,
  document.getElementById('root')
);

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