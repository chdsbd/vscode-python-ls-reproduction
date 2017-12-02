import React from 'react'
import PropTypes from 'prop-types'

import './Notification.scss'

const notification = ({
  message,
  level = 'info',
  show = true,
  closeable = true,
  close
}) => {
  if (show) {
    return (
      <div className={'note d-flex justify-space-between align-center ' + level }>
        <p className="mb-0 fs-5">
          { message }
        </p>
        { closeable && close &&
            <a className="close" onClick={close}>✕</a>
        }
      </div>
    )
  }
  return null
}

notification.PropTypes = {
  message: PropTypes.string.isRequired,
  show: PropTypes.bool,
  closeable: PropTypes.bool,
  close: PropTypes.func,
  level: PropTypes.oneOf(['success', 'info', 'warning', 'danger'])
}

export default notification
