import React, { useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import compose from 'lodash/flowRight'

import tableStyles from 'styles/table.styl'

import flag from 'cozy-flags'

import ActionMenu, {
  ActionMenuHeader,
  ActionMenuItem
} from 'cozy-ui/transpiled/react/ActionMenu'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'
import { translate, useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import MuiButton from 'cozy-ui/transpiled/react/MuiCozyTheme/Buttons'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell
} from 'cozy-ui/transpiled/react/Table'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import Typography from 'cozy-ui/transpiled/react/Typography'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import NoDevicesMessage from 'components/NoDevicesMessage'
import DevicesModaleRevokeView from 'components/DevicesModaleRevokeView'
import DevicesModaleConfigureView from 'components/DevicesModaleConfigureView'
import Page from 'components/Page'
import PageTitle from 'components/PageTitle'

import mobileIcon from 'assets/icons/icon-device-phone.svg'
import browserIcon from 'assets/icons/icon-device-browser.svg'
import laptopIcon from 'assets/icons/icon-device-laptop.svg'

import { COZY_DESKTOP_SOFTWARE_ID } from 'lib/deviceConfigurationHelper'

const deviceKindToIcon = {
  mobile: mobileIcon,
  browser: browserIcon
}

const getDeviceIcon = device => {
  return deviceKindToIcon[device.client_kind] || laptopIcon
}

const isCozyDesktopApp = device =>
  device.software_id === COZY_DESKTOP_SOFTWARE_ID
const canConfigureDevice = device =>
  flag('settings.partial-desktop-sync.show-synced-folders-selection') &&
  isCozyDesktopApp(device)

const MoreButton = ({ onClick }) => {
  const { t } = useI18n()
  return (
    <IconButton
      theme="secondary"
      extension="narrow"
      size="small"
      label={t('Toolbar.more')}
      onClick={onClick}
    >
      <Icon icon={DotsIcon} />
    </IconButton>
  )
}
const MoreMenuItem = ({ onClick, icon, color, text }) => (
  <ActionMenuItem
    onClick={onClick}
    left={<Icon icon={icon} color={`var(--${color}Color)`} />}
  >
    <Typography
      variant="body1"
      color={color}
      style={{
        textTransform: 'capitalize'
      }}
    >
      {text}
    </Typography>
  </ActionMenuItem>
)
const MoreMenu = ({ device, onRevoke, onConfigure, isMobile }) => {
  const { f, t } = useI18n()

  const [menuIsVisible, setMenuVisible] = useState(false)

  const openMenu = useCallback(() => setMenuVisible(true), [setMenuVisible])
  const closeMenu = useCallback(() => setMenuVisible(false), [setMenuVisible])
  const toggleMenu = useCallback(() => {
    if (menuIsVisible) return closeMenu()
    openMenu()
  }, [closeMenu, openMenu, menuIsVisible])
  return (
    <>
      <MoreButton onClick={toggleMenu} />
      {isMobile && menuIsVisible ? (
        <ActionMenu onClose={closeMenu} autoclose>
          <ActionMenuHeader>
            <Media>
              <Img>
                <Icon icon={getDeviceIcon(device)} size={32} />
              </Img>
              <Bd className="u-ml-1">
                <Typography variant="h6">{device.client_name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {t('DevicesView.head_sync')} 
                  {device.synchronized_at
                    ? f(
                        device.synchronized_at,
                        t('DevicesView.sync_date_format')
                      )
                    : '-'}
                </Typography>
              </Bd>
            </Media>
          </ActionMenuHeader>
          {canConfigureDevice(device) ? (
            <MoreMenuItem
              onClick={onConfigure}
              icon={GearIcon}
              text={t('DevicesView.configure')}
            />
          ) : null}
          <MoreMenuItem
            onClick={onRevoke}
            icon={TrashIcon}
            color={'error'}
            text={t('DevicesView.revoke')}
          />
        </ActionMenu>
      ) : null}
    </>
  )
}

const DevicesView = props => {
  const {
    t,
    f,
    isFetching,
    devices,
    fetchDevices,
    openDeviceRevokeModale,
    deviceToRevoke,
    onDeviceModaleRevoke,
    onDeviceModaleRevokeClose,
    devicePerformRevoke,
    breakpoints: { isMobile }
  } = props

  const [deviceToConfigure, setDeviceToConfigure] = useState(null)
  const [devicesRequested, setDevicesRequested] = useState(false)

  useMemo(() => {
    if (isFetching && !devicesRequested) {
      setDevicesRequested(true)
    } else if (!devicesRequested && !isFetching) {
      fetchDevices()
    }
  }, [devicesRequested, isFetching, fetchDevices])

  return (
    <Page narrow={!isFetching && devices.length === 0}>
      <PageTitle>{t('DevicesView.title')}</PageTitle>
      {isFetching ? (
        <Spinner
          className={'u-pos-fixed-s'}
          middle
          size="xxlarge"
          loadingType="loading"
        />
      ) : devices.length === 0 ? (
        <NoDevicesMessage />
      ) : (
        <Table className={tableStyles['coz-table']}>
          {openDeviceRevokeModale && (
            <DevicesModaleRevokeView
              cancelAction={onDeviceModaleRevokeClose}
              revokeDevice={devicePerformRevoke}
              device={deviceToRevoke}
            />
          )}
          {deviceToConfigure != null ? (
            <DevicesModaleConfigureView
              cancelAction={() => {
                setDeviceToConfigure(null)
              }}
              onDeviceConfigured={() => setDeviceToConfigure(null)}
              device={deviceToConfigure}
            />
          ) : null}
          <TableHead>
            <TableRow>
              <TableHeader className={tableStyles['set-table-name']}>
                {t('DevicesView.head_name')}
              </TableHeader>
              <TableHeader
                className={classNames(
                  tableStyles['coz-table-header'],
                  tableStyles['set-table-date']
                )}
              >
                {t('DevicesView.head_sync')}
              </TableHeader>
              <TableHeader
                className={classNames(
                  tableStyles['coz-table-header'],
                  tableStyles['set-table-actions']
                )}
              >
                {t('DevicesView.head_actions')}
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody className={tableStyles['set-table-devices']}>
            {devices.map(device => (
              <TableRow key={device.id}>
                <TableCell
                  className={classNames(
                    tableStyles['set-table-name'],
                    tableStyles['coz-table-primary']
                  )}
                >
                  <Media>
                    <Img>
                      <Icon icon={getDeviceIcon(device)} size={32} />
                    </Img>
                    <Bd className="u-ml-1">{device.client_name}</Bd>
                    {isMobile ? (
                      <MoreMenu
                        device={device}
                        onRevoke={() => {
                          onDeviceModaleRevoke(device)
                        }}
                        onConfigure={() => {
                          setDeviceToConfigure(device)
                        }}
                        isMobile={true}
                      />
                    ) : null}
                  </Media>
                </TableCell>
                <TableCell className={tableStyles['set-table-date']}>
                  {device.synchronized_at
                    ? f(
                        device.synchronized_at,
                        t('DevicesView.sync_date_format')
                      )
                    : '-'}
                </TableCell>
                <TableCell className={tableStyles['set-table-actions']}>
                  <>
                    <MuiButton
                      color="primary"
                      onClick={() => {
                        onDeviceModaleRevoke(device)
                      }}
                    >
                      {t('DevicesView.revoke')}
                    </MuiButton>
                    {canConfigureDevice(device) ? (
                      <MuiButton
                        color="primary"
                        onClick={() => {
                          setDeviceToConfigure(device)
                        }}
                      >
                        {t('DevicesView.configure')}
                      </MuiButton>
                    ) : null}
                  </>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Page>
  )
}

export default compose(
  translate(),
  withBreakpoints()
)(DevicesView)
