import styles from '../styles/app'

import React from 'react'
import { translate } from '../plugins/preact-polyglot'
import classNames from 'classnames'

import Sidebar from './Sidebar'
import Notifier from './Notifier'

const App = ({ t, children }) => (
  <div class={classNames(styles['set-wrapper'], styles['coz-sticky'])}>

    <Sidebar />

    <main class={styles['set-content']}>
      { children }
    </main>
    <Notifier />
  </div>
)

export default translate()(App)
