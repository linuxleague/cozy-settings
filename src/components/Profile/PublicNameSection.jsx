import React, { useMemo, useState } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { useQuery } from 'cozy-client'

import Input from 'components/Input'
import { buildSettingsInstanceQuery } from 'lib/queries'
import { useMutation } from 'hooks/useMutation'

const PublicNameSection = () => {
  const { t } = useI18n()

  const { mutate, isLoading, isSuccess, error: serverError } = useMutation()
  const [formError, setFormError] = useState()

  const instanceQuery = buildSettingsInstanceQuery()
  const { data: instance } = useQuery(
    instanceQuery.definition,
    instanceQuery.options
  )

  const handleBlur = (_, value) => {
    if (value !== '') {
      mutate({
        _rev: instance.meta.rev,
        ...instance,
        attributes: {
          ...instance.attributes,
          public_name: value
        }
      })
    }
  }

  const errors = useMemo(() => {
    if (serverError) {
      return [serverError]
    }
    if (formError) {
      return [formError]
    }
    return undefined
  }, [serverError, formError])

  const handleChange = (_, value) => {
    setFormError(value === '' ? 'ProfileView.infos.empty' : undefined)
  }

  return (
    <Input
      name="public_name"
      type="text"
      title={t('ProfileView.public_name.title')}
      label={t(`ProfileView.public_name.label`)}
      value={instance?.public_name}
      onBlur={handleBlur}
      onChange={handleChange}
      submitting={isLoading}
      saved={isSuccess}
      errors={errors}
    />
  )
}

export { PublicNameSection }
