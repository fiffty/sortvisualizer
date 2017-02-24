import React, {Component} from 'react'
import SortVisualizer from './SortVisualizer'
const Rx = require('rxjs/Rx')
const Observable = Rx.Observable
import fetchJsonp from 'fetch-jsonp'
import {getNextBubbleSortState} from './../bubblesort'
import {getNextSelectSortState} from './../selectsort'

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
      algorithm: 'BUBBLE',
      algoSelectorActive: false,
      sortState: {
        currentBars: new Array(8).fill().map((x,i) => new Bar('Bar ' + i, String(randomNum(10,100)), i)),
        nextStep: {targetIndex: 0, type: 'COMPARE'},
      },
      playing: false,
      width: '600px',
      height: '300px'   
    }

    this.toggleAlgoSelector = this.toggleAlgoSelector.bind(this)
    this.selectAlgo = this.selectAlgo.bind(this)
  }

  getNextState(latestState) {
    if (this.state.algorithm === 'BUBBLE') {
      return getNextBubbleSortState(latestState)
    } else if (this.state.algorithm === 'SELECT') {
      return getNextSelectSortState(latestState)
    }
  }

  componentDidMount() {
    this.actions$ = Observable.fromEvent(document, 'action').map(e => e.detail)

    const handleAutoPlay = (action) => {
      if (!this.state.playing && action.request === 'TOGGLE_PLAY') {
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
    }

    const handleFetchWeatherData = (action) => {
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
      } else {
        return Observable.of(action)
      }    
    }

    const handleFetchRandomData = (action) => {
      if (action.request === 'FETCH_RANDOM') {
        return Observable.of({
          currentBars: new Array(8).fill().map((x,i) => new Bar('Bar ' + i, String(randomNum(10,100)), i)),
          nextStep: {targetIndex: 0, type: 'COMPARE'},
        })
      } else {
        return Observable.of(action)
      }
    }

    this.sortHistory$ = this.actions$
    .mergeMap(handleAutoPlay)
    .mergeMap(handleFetchWeatherData)
    .mergeMap(handleFetchRandomData)
    .scan((acc, curr) => {
      const latestState = acc[acc.length - 1]
      let nextState = []

      if (curr.request === 'RESET') {
        return [curr.nextState]
      } else if (curr.currentBars) {
        nextState = [curr]
      } else if (curr.request === 'GO_TO_NEXT_STEP') {
        if (!latestState.sortCompleted) nextState = [this.getNextState(latestState)]
      } else if (curr.request === 'GO_TO_PREV_STEP') {
        return acc.length <= 1 ? acc : acc.slice(0, acc.length -1)
      } else if (curr.request === 'ADD_RANDOM') {
        const newBar = new Bar('Bar ' + latestState.currentBars.length, randomNum(10,100), latestState.currentBars.length)
        nextState = [{
          currentBars: latestState.currentBars.map(bar => Object.assign({},bar,{sorted:false})).concat(newBar),
          nextStep: {targetIndex: 0, type: 'COMPARE'}  
        }]       
      } else if (curr.request === 'DROP_BAR' && curr.payload.changed) {
        const {targetOrderIndex, orderIndex} = curr.payload
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

          nextState = [{
            currentBars,
            nextStep: {targetIndex: 0, type: 'COMPARE'}
          }]
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

          nextState = [{
            currentBars,
            nextStep: {targetIndex: 0, type: 'COMPARE'}
          }]
        }
      }

      return acc.concat(nextState)
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

  toggleAlgoSelector() {
    this.setState({
      algoSelectorActive: !this.state.algoSelectorActive
    })
  }

  selectAlgo(algorithm) {
    this.setState({
      algorithm,
      algoSelectorActive: false,
      playing: false
    })
    const action = {
        origin: 'USER',
        request: 'RESET',
        nextState: {
          currentBars: new Array(8).fill().map((x,i) => new Bar('Bar ' + i, String(randomNum(10,100)), i)),
          nextStep: {targetIndex: 0, type: 'COMPARE'},
        }
    }
    document.dispatchEvent(new CustomEvent('action', {detail: action})) 
  }

  render() {
    return (
      <div>
        <div className="title">
          <h1><span className="sort-type" onClick={this.toggleAlgoSelector}>{this.state.algorithm}</span> SORT VISUALIZER</h1>
          {this.state.algoSelectorActive? 
          <div className="sort-type__select">
            <div className="sort-type__option" onClick={() => {this.selectAlgo('BUBBLE')}}>bubble sort</div>
            <div className="sort-type__option" onClick={() => {this.selectAlgo('SELECT')}}>select sort</div>
          </div>
          : null}        
        </div>
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