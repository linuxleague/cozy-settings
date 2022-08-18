import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'

import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'
import { initFlags } from 'lib/flags'
import { RealTimeQueries } from 'cozy-client'

import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { Layout, Main } from 'cozy-ui/transpiled/react/Layout'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'

import Sidebar from 'components/Sidebar'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Profile from 'containers/Profile'
import Devices from 'containers/Devices'
import Sessions from 'containers/Sessions'
import Storage from 'containers/Storage'
import Passphrase from 'containers/Passphrase'
import PermissionsTab from 'components/Permissions/PermissionsTab'
import IntentRedirect from 'services/IntentRedirect'
import PermissionsApplication from 'containers/PermissionsApplication'
import Permission from 'containers/Permission'

initFlags()

export class App extends Component {
  render() {
    return (
      <Layout>
        {App.renderExtra()}
        <FlagSwitcher />
        <Alerter />
        <Sidebar />
        <RealTimeQueries doctype="io.cozy.oauth.clients" />

        <Main>
          <Switch>
            <Route path="/redirect" component={IntentRedirect} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/profile/password" component={Passphrase} />
            <Route exact path="/connectedDevices" component={Devices} />
            <Route path="/connectedDevices/:deviceId" component={Devices} />
            <Route path="/sessions" component={Sessions} />
            <Route path="/storage" component={Storage} />
            <Route exact path="/permissions/:page" component={PermissionsTab} />
            <Route
              exact
              path="/permissions/slug/:app"
              component={PermissionsApplication}
            />
            <Route
              path="/permissions/slug/:app/:permission"
              component={Permission}
            />
            <Route path="/exports/:exportId" component={Profile} />
            <Redirect exact from="/" to="/profile" />
            <Redirect exact from="/permissions" to="/permissions/slug" />
            <Redirect from="*" to="/profile" />
          </Switch>
        </Main>
        <Sprite />
      </Layout>
    )
  }
}

// This is to facilitate the extension of App in apps overrides
App.renderExtra = () => null

const mapStateToProps = state => ({
  alert: state.ui.alert
})

/*
withRouter is necessary here to deal with redux
https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
*/
export default hot(module)(
  translate()(withRouter(connect(mapStateToProps)(App)))
)
