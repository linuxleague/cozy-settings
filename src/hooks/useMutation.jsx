import { useState } from 'react'
import { useClient } from 'cozy-client'

const useMutation = ({ onSuccess } = {}) => {
  const client = useClient()

  const [status, setStatus] = useState('idle')
  const [error, setError] = useState()
  const [data, setData] = useState()

  const mutate = async doc => {
    setError()
    setStatus('loading')
    try {
      const resp = await client.save(doc)
      setData(resp.data)
      onSuccess && onSuccess(resp.data)
      setStatus('success')
    } catch (e) {
      setStatus('error')
      setError('ProfileView.infos.server_error')
    }
  }

  return {
    mutate,
    status,
    error,
    data,
    isIdle: status === 'idle',
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success'
  }
}

export { useMutation }
