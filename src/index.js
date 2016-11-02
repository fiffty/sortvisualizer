import React from 'react'
import ReactDOM from 'react-dom'
import StreamProvider from './components/StreamProvider'
import {initialSortState, getNextBubbleSortState} from './bubblesort'
import './index.css'

ReactDOM.render(
  <StreamProvider initialSortState={initialSortState} algorithm={getNextBubbleSortState}  />,
  document.getElementById('root')
)
