import React, {Component} from 'react'
import BarChart from './BarChart'
import SortVisualizer from './SortVisualizer'
const Rx = require('rxjs/Rx')
const Observable = Rx.Observable

class StreamProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortState: this.props.initialSortState,
      playing: false,
      width: '600px',
      height: '400px'   
    }
  }

  componentDidMount() {
    const algorithm = this.props.algorithm

    this.actions$ = Observable.fromEvent(document, 'action').map(e => e.detail)

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
        return latestState.sortCompleted ? acc : acc.concat(algorithm(latestState))
      } else if (curr.request === 'GO_TO_PREV_STEP') {
        return (acc.length <= 1) ? acc : acc.slice(0, acc.length -1)
      } else if (curr.request === 'ADD_RANDOM') {
        const newBar = new Bar('Bar ' + latestState.currentBars.length, randomNum(10,100), latestState.currentBars.length)
        const nextState = {
          currentBars: latestState.currentBars.map(bar => Object.assign({},bar,{sorted:false})).concat(newBar),
          nextStep: {targetIndex: 0, type: 'COMPARE'}  
        }
        return acc.concat([nextState])
      } else if (curr.request === 'DROP_BAR') {
        const {changed, targetOrderIndex, orderIndex, index} = curr.payload
        if (changed) {
          if (targetOrderIndex < orderIndex) {
            const currentBars = latestState.currentBars
            .map(bar => {
              if (bar.orderIndex === orderIndex) {
                return Object.assign({}, bar, {orderIndex: targetOrderIndex, style: {}, sorted: false})
              } else if (bar.orderIndex >= targetOrderIndex && bar.orderIndex < orderIndex) {
                return Object.assign({}, bar, {orderIndex: bar.orderIndex + 1, style: {}, sorted: false})
              } else {
                return Object.assign({}, bar, {style: {}, sorted: false})
              }
            })

            const nextState = {
              currentBars,
              nextStep: {targetIndex: 0, type: 'COMPARE'}
            }
            return acc.concat([nextState])
          } else {
            const currentBars = latestState.currentBars
            .map(bar => {
              if (bar.orderIndex === orderIndex) {
                return Object.assign({}, bar, {orderIndex: targetOrderIndex, style: {}, sorted: false})
              } else if (bar.orderIndex <= targetOrderIndex && bar.orderIndex > orderIndex) {
                return Object.assign({}, bar, {orderIndex: bar.orderIndex - 1, style: {}, sorted: false})
              } else {
                return Object.assign({}, bar, {style: {}, sorted: false})
              }
            })

            const nextState = {
              currentBars,
              nextStep: {targetIndex: 0, type: 'COMPARE'}
            }
            return acc.concat([nextState])            
          }
        } else {
          return acc
        }
      } else {
        return acc
      }
    }, [this.state.sortState])

    this.sortHistory$.subscribe(x => {
      this.setState({
        sortState: x[x.length - 1]
      })
    })
  }

  render() {
    return (
        <SortVisualizer 
          playing={this.state.playing}
          sortCompleted={this.state.sortState.sortCompleted}
          sortState={this.state.sortState}
          additionalStates={{swapped: false}}
          width={this.state.width}
          height={this.state.height}
          />
    )
  }
}

export default StreamProvider

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function Bar(label, value, orderIndex) {
  this.label = label
  this.value = value
  this.orderIndex = orderIndex
}