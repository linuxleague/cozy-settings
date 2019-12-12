import { connect } from 'react-redux'
import get from 'lodash/get'
import compose from 'lodash/flowRight'
import Alerter from 'cozy-ui/react/Alerter'
import { translate } from 'cozy-ui/react/I18n'
import { AUTH_MODE } from 'actions/twoFactor'
import {
  updatePassphrase,
  updatePassphrase2FAFirst,
  updatePassphrase2FASecond,
  updateHint
} from 'actions/passphrase'
import { fetchInfos } from 'actions'
import PassphraseView from 'components/PassphraseView'
import { withRouter } from 'react-router-dom'

const mapStateToProps = state => ({
  fields: state.fields,
  isTwoFactorEnabled:
    get(state, 'fields.auth_mode.value') === AUTH_MODE.TWO_FA_MAIL,
  instance: state.instance,
  passphrase: state.passphrase
})

export const getRedirectUrlsFromURLParams = urlParamsStr => {
  const urlParams = new URLSearchParams(urlParamsStr)

  return {
    successRedirectUrl: urlParams.get('redirect_success'),
    cancelRedirectUrl: urlParams.get('redirect_cancel')
  }
}

const showSuccessThenReload = (t, location) => {
  const { successRedirectUrl } = getRedirectUrlsFromURLParams(location.search)

  const translatationKey = successRedirectUrl
    ? 'PassphraseView.redirect'
    : 'PassphraseView.reload'

  Alerter.info(t(translatationKey))

  setTimeout(() => {
    if (successRedirectUrl) {
      window.location = successRedirectUrl
    } else {
      // the token changes after a password change, so we need to reload
      // the page to get the new one
      window.location.reload()
    }
  }, 4000) // 4s, a bit longer than the alert message
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onPassphraseSimpleSubmit: (currentPassphrase, newPassphrase, hint) => {
    return (
      dispatch(updateHint(hint))
        .then(() =>
          dispatch(updatePassphrase(currentPassphrase, newPassphrase))
        )
        .then(() => showSuccessThenReload(ownProps.t, ownProps.location))
        // eslint-disable-next-line no-console
        .catch(e => console.error(e))
    )
  },
  onPassphrase2FAStep1: current => {
    return dispatch(updatePassphrase2FAFirst(current)).catch(e =>
      // eslint-disable-next-line no-console
      console.error(e)
    )
  },
  onPassphrase2FAStep2: (
    current,
    newVal,
    twoFactorCode,
    twoFactorToken,
    hint
  ) => {
    return (
      dispatch(updateHint(hint))
        .then(() =>
          dispatch(
            updatePassphrase2FASecond(
              current,
              newVal,
              twoFactorCode,
              twoFactorToken
            )
          )
        )
        .then(() => showSuccessThenReload(ownProps.t))
        // eslint-disable-next-line no-console
        .catch(e => console.error(e))
    )
  },
  fetchInfos: () => dispatch(fetchInfos())
})

const Password = compose(
  withRouter,
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PassphraseView)

export default Password
