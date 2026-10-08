import type { ReactNode } from 'react'

import { Navigate } from 'react-router-dom'

import { useQuery } from '@tanstack/react-query'

import {
  getCurrentAdmin,
} from '../../services/api'


interface Props {
  children: ReactNode
}


function AdminProtectedRoute({
  children,
}: Props) {
  const {
    data: admin,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin'],
    queryFn: getCurrentAdmin,
    retry: false,
  })


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm text-coffee">
          جاري التحقق من تسجيل الدخول...
        </p>
      </div>
    )
  }


  if (
    isError ||
    !admin
  ) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    )
  }


  return children
}


export default AdminProtectedRoute