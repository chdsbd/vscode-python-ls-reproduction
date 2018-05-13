import React from 'react'
import { connect } from 'react-redux'
import addMonths from 'date-fns/add_months'
import subMonths from 'date-fns/sub_months'
import format from 'date-fns/format'
import isPast from 'date-fns/is_past'
import endOfDay from 'date-fns/end_of_day'

import Month from './DateRangePicker/Month'

import { classNames } from '../classnames'
import { atLeast1 } from '../input'
import { ButtonPrimary } from './Buttons'

import {
  addingScheduledRecipe,
} from '../store/actions'

function mapDispatchToProps (dispatch) {
  return {
    create: (recipeID, on, count) => dispatch(addingScheduledRecipe(recipeID, on, count)),
  }
}

@connect(
  null,
  mapDispatchToProps,
)
export default class DatePickerForm extends React.Component {
  state = {
    count: 1,
    date: new Date(),
    month: new Date(),
  }

  handleDateChange = val => {
    if (isPast(endOfDay(val))) return
    this.setState({ date: val })
  }

  handleCountChange = e => {
    const count = atLeast1(e.target.value)
    this.setState({ count })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.create(this.props.recipeID, this.state.date, this.state.count)
    .then(() => this.props.close())
  }

  nextMonth = () => {
    this.setState(({ month }) => ({ month: addMonths(month, 1) }))
  }

  prevMonth = () => {
    this.setState(({ month }) => ({ month: subMonths(month, 1) }))
  }

  render () {
    if (!this.props.show) {
      return null
    }

    return (
        <div className={
            classNames(
              'box-shadow-normal',
              'p-absolute',
              'r-0',
              't-100',
              'cursor-default',
              'z-index-100',
              'bg-whitesmoke',
              'p-2',
              'fs-4',
            )
          }>
          <Month
            showLeft
            showRight
            date={this.state.month}
            startDay={this.state.date}
            endDay={this.state.date}
            handleClick={this.handleDateChange}
            prevMonth={this.prevMonth}
            nextMonth={this.nextMonth}
          />

        <form className="d-grid grid-gap-1" onSubmit={this.handleSubmit}>
          <div className="d-flex">
            <input
              className="my-input is-small w-2rem mr-2 fs-3 text-center"
              onChange={this.handleCountChange}
              value={this.state.count}/>
            <span className="align-self-center">
              on { format(this.state.date, 'MMM D, YYYY') }
            </span>
          </div>
          <ButtonPrimary className="is-small" type="submit" loading={this.props.scheduling}>
            Schedule
          </ButtonPrimary>
        </form>
      </div>
    )
  }
}