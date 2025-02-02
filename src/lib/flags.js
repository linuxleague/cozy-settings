import flag from 'cozy-flags'

export const initFlags = () => {
  let activateFlags = flag('switcher') === true

  if (process.env.NODE_ENV !== 'production' && flag('switcher') == null) {
    activateFlags = true
  }

  const searchParams = new URL(window.location).searchParams
  if (!activateFlags && searchParams.get('flags') != null) {
    activateFlags = true
  }

  if (activateFlags) {
    flagsList()
  }
}

const flagsList = () => {
  flag('switcher', true)
  flag('settings.partial-desktop-sync.show-synced-folders-selection')
  flag('settings.permissions-dashboard')
  flag('settings.flagship-mode')
  flag('settings.subscription')
}
