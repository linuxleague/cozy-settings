import React, { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Stack from 'cozy-ui/transpiled/react/Stack'

import Page from 'components/Page'
import DeleteAccount from 'components/DeleteAccount'
import Input from 'components/Input'
import LanguageSection from 'components/LanguageSection'
import DefaultRedirectionSection from 'components/DefaultRedirectionSection/DefaultRedirectionSection'
import TwoFA from 'components/2FA'
import Import from 'components/Import'
import ExportSection from 'components/export/ExportSection'
import TrackingSection from 'components/TrackingSection'
import PageTitle from 'components/PageTitle'
import PasswordSection from 'components/PasswordSection'
import EmailSection from 'components/Email/EmailSection'

const ProfileView = ({
  fields,
  isFetching,
  onFieldChange,
  instance,
  exportData,
  fetchExportData,
  requestExport,
  importData,
  precheckImport,
  submitImport,
  fetchInfos
}) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { exportId } = useParams()

  useEffect(() => {
    fetchInfos()
    // eslint-disable-next-line
  }, [])

  return (
    <Page narrow>
      {isFetching && (
        <Spinner
          className="u-pos-fixed-s"
          middle
          size="xxlarge"
          loadingType="loading"
        />
      )}
      {!isFetching && instance && (
        <>
          <PageTitle className={!isMobile ? 'u-mb-1' : ''}>
            {t('ProfileView.title')}
          </PageTitle>
          <Stack spacing="l">
            <EmailSection />
            <Input
              name="public_name"
              type="text"
              title={t('ProfileView.public_name.title')}
              label={t(`ProfileView.public_name.label`)}
              {...fields.public_name}
              onBlur={onFieldChange}
            />
            <PasswordSection />
            <TwoFA fields={fields} onChange={onFieldChange} />
            <LanguageSection fields={fields} onChange={onFieldChange} />
            <DefaultRedirectionSection
              fields={fields}
              onChange={onFieldChange}
            />
            <TrackingSection
              instance={instance}
              fields={fields}
              onChange={onFieldChange}
            />
            <div>
              <ExportSection
                email={fields.email && fields.email.value}
                exportData={exportData}
                exportId={exportId}
                requestExport={requestExport}
                fetchExportData={() => fetchExportData(exportId)}
                parent="/profile"
              />
              <Import
                importData={importData}
                precheckImport={precheckImport}
                submitImport={submitImport}
              />
            </div>
          </Stack>
          <DeleteAccount />
        </>
      )}
      <Outlet />
    </Page>
  )
}

export default ProfileView
