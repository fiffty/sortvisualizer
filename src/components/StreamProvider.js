import React, {Component} from 'react'
import SortVisualizer from './SortVisualizer'
const Rx = require('rxjs/Rx')
const Observable = Rx.Observable
import fetchJsonp from 'fetch-jsonp'

// fetchJsonp('http://api.openweathermap.org/data/2.5/forecast/daily?q=Toronto&units=metric&cnt=7&appid=8b21002249e5a28a335414b79219a70c')
//   .then(res => {
//     res.json().then(data => {
//       const weeklyWeather = data.list
//       weeklyWeather.forEach(day => {
//         console.log(new Date(day.dt * 1000))
//       })
//     })
//   })

class StreamProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortState: this.props.initialSortState,
      playing: false,
      width: '600px',
      height: '300px'   
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
    .mergeMap(action => {
      if (action.request === 'FETCH_WEATHER') {
        return Observable.fromPromise(fetchJsonp('http://api.openweathermap.org/data/2.5/forecast/daily?q=Toronto&units=metric&cnt=7&appid=8b21002249e5a28a335414b79219a70c'))
        .mergeMap(res => {
          return Observable.fromPromise(res.json())
        })
        .map(data => {
          const currentBars = data.list
          .map((day,i) => {
            const label = (new Date(day.dt * 1000)).toDateString()
            const value = day.temp.day + ' °C'
            return new Bar(label, value, i)
          })

          return {
            currentBars,
            nextStep: {targetIndex: 0, type: 'COMPARE'}
          }
        })
      } else if (action.request === 'FETCH_RANDOM') {
        return Observable.of({
          currentBars: new Array(8).fill().map((x,i) => new Bar('Bar ' + i, String(randomNum(10,100)), i)),
          nextStep: {targetIndex: 0, type: 'COMPARE'},
        })
      } else {
        return Observable.of(action)
      }
    })
    .scan((acc, curr) => {
      const latestState = acc[acc.length - 1]
      if (curr.currentBars) {
        return acc.concat(curr)
      }

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
        const {changed, targetOrderIndex, orderIndex} = curr.payload
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

  fetchWeather() {
    document.dispatchEvent(new CustomEvent('action', {detail: {request: 'FETCH_WEATHER'}}))
  }

  render() {
    return (
      <div>
        <h1><span className="sort-type">BUBBLE</span> SORT VISUALIZER</h1>
        <p className="data-options">
          USE
          <span onClick={() => {document.dispatchEvent(new CustomEvent('action', {detail: {request: 'FETCH_RANDOM'}}))}} className="random-btn"> RANDOM DATA</span>
          <span onClick={() => {document.dispatchEvent(new CustomEvent('action', {detail: {request: 'FETCH_WEATHER'}}))}} className="fetch-btn"> TORONTO WEATHER DATA</span>
        </p>
        
        <SortVisualizer 
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

export default StreamProvider

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function Bar(label, value, orderIndex) {
  this.label = label
  this.value = value
  this.orderIndex = orderIndex
}