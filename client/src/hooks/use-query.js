import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

function useQuery () {
  const { search } = useLocation()
  // const { search } = window.location

  return useMemo(() => new URLSearchParams(search), [search])
}

export default useQuery
