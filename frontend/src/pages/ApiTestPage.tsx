import { useEffect, useState } from 'react'

function ApiTestPage() {
  const [status, setStatus] =
    useState('جاري الاتصال...')

  useEffect(() => {
    fetch('http://localhost:8000/api/health')
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status)
      })
      .catch(() => {
        setStatus('فشل الاتصال')
      })
  }, [])

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">
        Backend Status
      </h1>

      <p className="mt-4">
        {status}
      </p>
    </div>
  )
}

export default ApiTestPage