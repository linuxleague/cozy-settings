import { useState } from 'react'
import { useClient } from 'cozy-client'

const useMutation = () => {
  const client = useClient()

  const [status, setStatus] = useState('idle')
  const [error, setError] = useState()

  const mutate = async data => {
    setError()
    setStatus('loading')
    try {
      await client.save(data)
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
    isIdle: status === 'idle',
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success'
  }
}

export { useMutation }
