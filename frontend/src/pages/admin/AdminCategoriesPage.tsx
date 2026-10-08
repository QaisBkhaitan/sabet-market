import {
  useEffect,
  useMemo,
  useState,
  type SubmitEvent,
} from 'react'

import {
  ArrowRight,
  Eye,
  EyeOff,
  ImagePlus,
  Pencil,
  Plus,
  Tags,
  X,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type {
  Category,
} from '../../types/category'

import {
  adminCreateCategory,
  adminGetCategories,
  adminSetCategoryVisibility,
  adminUpdateCategory,
  getImageUrl,
} from '../../services/api'


function AdminCategoriesPage() {
  const queryClient =
    useQueryClient()


  const [
    showForm,
    setShowForm,
  ] = useState(false)


  const [
    editingCategory,
    setEditingCategory,
  ] = useState<Category | null>(
    null
  )


  const [
    name,
    setName,
  ] = useState('')


  const [
    categoryImage,
    setCategoryImage,
  ] = useState<File | null>(
    null
  )


  const imagePreview =
    useMemo(() => {
      if (!categoryImage) {
        return null
      }

      return URL.createObjectURL(
        categoryImage
      )
    }, [categoryImage])


  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(
          imagePreview
        )
      }
    }
  }, [imagePreview])


  const currentImage =
    imagePreview ??
    (
      editingCategory
        ? getImageUrl(
            editingCategory.image
          )
        : null
    )


  const {
    data: categories = [],
    isLoading,
  } = useQuery({
    queryKey: [
      'admin-categories',
    ],

    queryFn:
      adminGetCategories,
  })


  function refreshCategories() {
    queryClient.invalidateQueries({
      queryKey: [
        'admin-categories',
      ],
    })

    queryClient.invalidateQueries({
      queryKey: [
        'categories',
      ],
    })

    queryClient.invalidateQueries({
      queryKey: [
        'products',
      ],
    })

    queryClient.invalidateQueries({
      queryKey: [
        'category-products',
      ],
    })
  }


  function resetForm() {
    setName('')
    setCategoryImage(null)
    setEditingCategory(null)
  }


  function closeForm() {
    setShowForm(false)
    resetForm()
  }


  function openCreateForm() {
    resetForm()

    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  function startEditing(
    category: Category
  ) {
    setEditingCategory(
      category
    )

    setName(
      category.name_ar
    )

    setCategoryImage(null)

    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  const createMutation =
    useMutation({
      mutationFn:
        adminCreateCategory,

      onSuccess: () => {
        refreshCategories()
        closeForm()
      },
    })


  const updateMutation =
    useMutation({
      mutationFn:
        adminUpdateCategory,

      onSuccess: () => {
        refreshCategories()
        closeForm()
      },
    })


  const visibilityMutation =
    useMutation({
      mutationFn: ({
        categoryId,
        isActive,
      }: {
        categoryId: number
        isActive: boolean
      }) =>
        adminSetCategoryVisibility(
          categoryId,
          isActive
        ),

      onSuccess: () => {
        refreshCategories()
      },
    })


  function handleSubmit(
    event: SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault()


    if (!name.trim()) {
      return
    }


    if (editingCategory) {
      updateMutation.mutate({
        id:
          editingCategory.id,

        name_ar:
          name.trim(),

        image:
          categoryImage,
      })

      return
    }


    createMutation.mutate({
      name_ar:
        name.trim(),

      image:
        categoryImage,
    })
  }


  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending


  const saveError =
    updateMutation.error
      instanceof Error
      ? updateMutation.error.message
      : createMutation.error
        instanceof Error
        ? createMutation.error.message
        : null


  return (
    <div className="min-h-screen bg-cream">

      <header className="border-b border-sand bg-card">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

          <div>

            <h1 className="font-bold text-ink">
              إدارة المجموعات
            </h1>

            <p className="text-xs text-coffee">
              السَبت ماركت
            </p>

          </div>


          <Link
            to="/admin"
            className="flex items-center gap-2 rounded-xl border border-sand px-3 py-2 text-sm text-coffee-dark transition hover:bg-cream"
          >

            <ArrowRight size={17} />

            لوحة الإدارة

          </Link>

        </div>

      </header>


      <main className="mx-auto max-w-7xl px-4 py-6">

        <div className="flex items-center justify-between gap-4">

          <div>

            <h2 className="text-2xl font-bold text-ink">
              المجموعات
            </h2>

            <p className="mt-1 text-sm text-coffee">
              تنظيم أقسام ومنتجات المتجر
            </p>

          </div>


          <button
            type="button"
            onClick={openCreateForm}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-coffee-dark px-4 py-3 text-sm font-bold text-white transition hover:bg-ink"
          >

            <Plus size={18} />

            إضافة مجموعة

          </button>

        </div>


        {showForm && (

          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-3xl border border-sand bg-card p-5"
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-bold text-ink">

                  {editingCategory
                    ? 'تعديل المجموعة'
                    : 'مجموعة جديدة'}

                </h3>

                <p className="mt-1 text-xs text-coffee">

                  {editingCategory
                    ? 'عدّل بيانات المجموعة ثم احفظ'
                    : 'أدخل بيانات المجموعة الجديدة'}

                </p>

              </div>


              <button
                type="button"
                onClick={closeForm}
                className="flex h-9 w-9 items-center justify-center rounded-full text-coffee hover:bg-cream"
              >
                <X size={19} />
              </button>

            </div>


            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium text-ink">
                اسم المجموعة *
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="مثال: حلويات"
                className="h-12 w-full rounded-xl border border-sand bg-cream px-4 text-sm outline-none focus:border-coffee"
              />

            </div>


            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium text-ink">
                صورة المجموعة
              </label>


              {currentImage ? (

                <div className="overflow-hidden rounded-2xl border border-sand bg-cream">

                  <div className="flex max-h-80 items-center justify-center p-3">

                    <img
                      src={currentImage}
                      alt="صورة المجموعة"
                      className="max-h-72 w-full rounded-xl object-contain"
                    />

                  </div>


                  <div className="border-t border-sand p-3">

                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-card px-4 py-3 text-sm font-bold text-coffee-dark">

                      <ImagePlus size={18} />

                      تغيير الصورة


                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file =
                            event.target
                              .files?.[0]

                          if (file) {
                            setCategoryImage(
                              file
                            )
                          }
                        }}
                      />

                    </label>

                  </div>

                </div>

              ) : (

                <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand bg-cream p-5 text-center">

                  <ImagePlus
                    size={28}
                    className="text-coffee-dark"
                  />

                  <p className="mt-3 text-sm font-bold text-coffee-dark">
                    إضافة صورة المجموعة
                  </p>

                  <p className="mt-1 text-xs text-coffee">
                    من الهاتف أو الكمبيوتر
                  </p>


                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file =
                        event.target
                          .files?.[0]

                      if (file) {
                        setCategoryImage(
                          file
                        )
                      }
                    }}
                  />

                </label>

              )}

            </div>


            {(
              createMutation.isError ||
              updateMutation.isError
            ) && (

              <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">

                {saveError ??
                  'حدث خطأ أثناء حفظ المجموعة'}

              </div>

            )}


            <div className="mt-6 flex gap-3">

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-coffee-dark px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
              >

                {isSaving
                  ? 'جاري الحفظ...'
                  : editingCategory
                    ? 'حفظ التعديلات'
                    : 'حفظ المجموعة'}

              </button>


              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-sand px-6 py-3 text-sm font-bold text-coffee-dark"
              >
                إلغاء
              </button>

            </div>

          </form>

        )}


        {/* Categories */}
        <section className="mt-7">

          {isLoading ? (

            <div className="py-10 text-center text-sm text-coffee">
              جاري تحميل المجموعات...
            </div>

          ) : categories.length === 0 ? (

            <div className="rounded-3xl border border-sand bg-card p-10 text-center">

              <Tags
                size={30}
                className="mx-auto text-coffee"
              />

              <p className="mt-3 text-sm text-coffee">
                لا توجد مجموعات
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">

              {categories.map(
                (category) => {

                  const imageUrl =
                    getImageUrl(
                      category.image
                    )


                  const pending =
                    visibilityMutation.isPending &&
                    visibilityMutation.variables
                      ?.categoryId
                    === category.id


                  return (
                    <div
                      key={category.id}
                      className={`overflow-hidden rounded-2xl border border-sand bg-card ${
                        category.is_active
                          ? ''
                          : 'opacity-60'
                      }`}
                    >

                      <div className="aspect-[4/3] bg-cream">

                        {imageUrl ? (

                          <img
                            src={imageUrl}
                            alt={category.name_ar}
                            className="h-full w-full object-cover"
                          />

                        ) : (

                          <div className="flex h-full items-center justify-center text-coffee">
                            <Tags size={30} />
                          </div>

                        )}

                      </div>


                      <div className="p-4">

                        <div className="flex items-center justify-between gap-2">

                          <h3 className="font-bold text-ink">
                            {category.name_ar}
                          </h3>


                          {!category.is_active && (

                            <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600">
                              مخفية
                            </span>

                          )}

                        </div>


                        <div className="mt-4 grid gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              startEditing(
                                category
                              )
                            }
                            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-sand bg-cream text-xs font-bold text-coffee-dark"
                          >

                            <Pencil size={15} />

                            تعديل

                          </button>


                          <button
                            type="button"
                            disabled={pending}
                            onClick={() =>
                              visibilityMutation.mutate({
                                categoryId:
                                  category.id,

                                isActive:
                                  !category.is_active,
                              })
                            }
                            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-sand bg-cream text-xs font-bold text-coffee-dark disabled:opacity-50"
                          >

                            {category.is_active ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}


                            {pending
                              ? 'جاري التحديث...'
                              : category.is_active
                                ? 'إخفاء'
                                : 'إظهار'}

                          </button>

                        </div>

                      </div>

                    </div>
                  )
                }
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  )
}


export default AdminCategoriesPage