import {
  useState,
  type SubmitEvent,
} from 'react'

import {
  LockKeyhole,
  User,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  adminLogin,
} from '../../services/api'


function AdminLoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [username, setUsername] =
    useState('')

  const [password, setPassword] =
    useState('')


  const loginMutation = useMutation({
    mutationFn: () =>
      adminLogin(
        username,
        password
      ),

    onSuccess: (admin) => {
      queryClient.setQueryData(
        ['admin'],
        admin
      )

      navigate('/admin', {
        replace: true,
      })
    },
  })


  function handleSubmit(
    event: SubmitEvent<HTMLFormElement>
    ) {
    event.preventDefault()

    if (
        !username.trim() ||
        !password
    ) {
        return
    }

    loginMutation.mutate()
    }


  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">

      <div className="w-full max-w-md rounded-3xl border border-sand bg-card p-6 shadow-sm">

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand text-coffee-dark">
            <LockKeyhole size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-ink">
            إدارة السَبت ماركت
          </h1>

          <p className="mt-2 text-sm text-coffee">
            تسجيل دخول الإدارة
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-4"
        >

          {/* Username */}
          <div>

            <label className="mb-2 block text-sm font-medium text-ink">
              اسم المستخدم
            </label>

            <div className="relative">

              <User
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe"
              />

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(
                    event.target.value
                  )
                }
                autoComplete="username"
                className="h-12 w-full rounded-xl border border-sand bg-cream pr-11 pl-4 text-sm text-ink outline-none transition focus:border-coffee focus:bg-card"
              />

            </div>

          </div>


          {/* Password */}
          <div>

            <label className="mb-2 block text-sm font-medium text-ink">
              كلمة المرور
            </label>

            <div className="relative">

              <LockKeyhole
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe"
              />

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-sand bg-cream pr-11 pl-4 text-sm text-ink outline-none transition focus:border-coffee focus:bg-card"
              />

            </div>

          </div>


          {loginMutation.isError && (

            <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-700">
              اسم المستخدم أو كلمة المرور غير صحيحة
            </div>

          )}


          <button
            type="submit"
            disabled={
              loginMutation.isPending
            }
            className="h-12 w-full rounded-xl bg-coffee-dark text-sm font-bold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loginMutation.isPending
              ? 'جاري تسجيل الدخول...'
              : 'دخول'}

          </button>

        </form>

      </div>

    </div>
  )
}


export default AdminLoginPage