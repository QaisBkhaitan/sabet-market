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
  Package,
  PackageCheck,
  PackageX,
  Pencil,
  Plus,
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
  Product,
} from '../../types/product'

import {
  adminCreateProduct,
  adminGetProducts,
  adminSetProductAvailability,
  adminSetProductVisibility,
  adminUpdateProduct,
  getCategories,
  getImageUrl,
} from '../../services/api'

import {
  formatPrice,
} from '../../utils/formatPrice'


function AdminProductsPage() {
  const queryClient =
    useQueryClient()


  const [
    editingProduct,
    setEditingProduct,
  ] = useState<Product | null>(
    null
  )


  const [
    showForm,
    setShowForm,
  ] = useState(false)


  const [
    name,
    setName,
  ] = useState('')


  const [
    description,
    setDescription,
  ] = useState('')


  const [
    price,
    setPrice,
  ] = useState('')


  const [
    categoryId,
    setCategoryId,
  ] = useState('')


  const [
    isAvailable,
    setIsAvailable,
  ] = useState(true)


  const [
    isFeatured,
    setIsFeatured,
  ] = useState(false)


  const [
    productImage,
    setProductImage,
  ] = useState<File | null>(
    null
  )


  /*
    Preview للصورة الجديدة.
  */
  const imagePreview =
    useMemo(() => {
      if (!productImage) {
        return null
      }

      return URL.createObjectURL(
        productImage
      )
    }, [productImage])


  /*
    تنظيف Object URL.
  */
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(
          imagePreview
        )
      }
    }
  }, [imagePreview])


  /*
    أثناء التعديل:
    إذا اخترنا صورة جديدة نعرضها،
    وإلا نعرض الصورة الحالية.
  */
  const currentImage =
    imagePreview ??
    (
      editingProduct
        ? getImageUrl(
            editingProduct.image
          )
        : null
    )


  /*
    تحميل المنتجات.
  */
  const {
    data: products = [],
    isLoading: productsLoading,
  } = useQuery({
    queryKey: [
      'admin-products',
    ],
    queryFn: adminGetProducts,
  })


  /*
    تحميل المجموعات.
  */
  const {
    data: categories = [],
  } = useQuery({
    queryKey: [
      'categories',
    ],
    queryFn: getCategories,
  })


  /*
    تحديث كل Queries المتعلقة بالمنتجات.
  */
  function refreshProductQueries() {
    queryClient.invalidateQueries({
      queryKey: [
        'admin-products',
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

    queryClient.invalidateQueries({
      queryKey: [
        'product',
      ],
    })
  }


  /*
    تنظيف الفورم.
  */
  function resetForm() {
    setName('')
    setDescription('')
    setPrice('')
    setCategoryId('')

    setIsAvailable(true)
    setIsFeatured(false)

    setProductImage(null)

    setEditingProduct(null)
  }


  function closeForm() {
    setShowForm(false)
    resetForm()
  }


  /*
    إضافة منتج جديد.
  */
  function openCreateForm() {
    resetForm()

    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  /*
    تعديل منتج موجود.
  */
  function startEditing(
    product: Product
  ) {
    setEditingProduct(
      product
    )

    setName(
      product.name_ar
    )

    setDescription(
      product.description_ar ?? ''
    )

    setPrice(
      String(product.price)
    )

    setCategoryId(
      String(product.category_id)
    )

    setIsAvailable(
      product.is_available
    )

    setIsFeatured(
      product.is_featured
    )

    setProductImage(null)

    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  /*
    إضافة المنتج.
  */
  const createMutation =
    useMutation({
      mutationFn:
        adminCreateProduct,

      onSuccess: () => {
        refreshProductQueries()
        closeForm()
      },
    })


  /*
    تعديل المنتج.
  */
  const updateMutation =
    useMutation({
      mutationFn:
        adminUpdateProduct,

      onSuccess: () => {
        refreshProductQueries()
        closeForm()
      },
    })


  /*
    متوفر / انتهت الكمية.
  */
  const availabilityMutation =
    useMutation({
      mutationFn: ({
        productId,
        isAvailable,
      }: {
        productId: number
        isAvailable: boolean
      }) =>
        adminSetProductAvailability(
          productId,
          isAvailable
        ),

      onSuccess: () => {
        refreshProductQueries()
      },
    })


  /*
    إظهار / إخفاء المنتج.
  */
  const visibilityMutation =
    useMutation({
      mutationFn: ({
        productId,
        isActive,
      }: {
        productId: number
        isActive: boolean
      }) =>
        adminSetProductVisibility(
          productId,
          isActive
        ),

      onSuccess: () => {
        refreshProductQueries()
      },
    })


  /*
    حفظ إضافة أو تعديل.
  */
  function handleSubmit(
    event: SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault()


    if (
      !name.trim() ||
      !price ||
      !categoryId
    ) {
      return
    }


    const formData = {
      name_ar:
        name.trim(),

      description_ar:
        description.trim()
          ? description.trim()
          : null,

      price:
        Number(price),

      category_id:
        Number(categoryId),

      is_available:
        isAvailable,

      is_featured:
        isFeatured,

      image:
        productImage,
    }


    if (editingProduct) {
      updateMutation.mutate({
        id:
          editingProduct.id,

        ...formData,
      })

      return
    }


    createMutation.mutate(
      formData
    )
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


  const quickActionError =
    availabilityMutation.error
      instanceof Error
      ? availabilityMutation.error.message
      : visibilityMutation.error
        instanceof Error
        ? visibilityMutation.error.message
        : null


  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <header className="border-b border-sand bg-card">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

          <div>

            <h1 className="font-bold text-ink">
              إدارة المنتجات
            </h1>

            <p className="text-xs text-coffee">
              السَبت ماركت
            </p>

          </div>


          <Link
            to="/admin"
            className="flex items-center gap-2 rounded-xl border border-sand px-3 py-2 text-sm text-coffee-dark transition hover:bg-cream"
          >

            <ArrowRight
              size={17}
            />

            لوحة الإدارة

          </Link>

        </div>

      </header>


      <main className="mx-auto max-w-7xl px-4 py-6">

        {/* Page Header */}
        <div className="flex items-center justify-between gap-4">

          <div>

            <h2 className="text-2xl font-bold text-ink">
              المنتجات
            </h2>

            <p className="mt-1 text-sm text-coffee">
              إضافة وتعديل وإدارة منتجات المتجر
            </p>

          </div>


          <button
            type="button"
            onClick={openCreateForm}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-coffee-dark px-4 py-3 text-sm font-bold text-white transition hover:bg-ink"
          >

            <Plus
              size={18}
            />

            إضافة منتج

          </button>

        </div>


        {/* Quick Action Error */}
        {quickActionError && (

          <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {quickActionError}
          </div>

        )}


        {/* Add / Edit Form */}
        {showForm && (

          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-3xl border border-sand bg-card p-5"
          >

            {/* Form Header */}
            <div className="flex items-center justify-between gap-3">

              <div>

                <h3 className="text-lg font-bold text-ink">

                  {editingProduct
                    ? 'تعديل المنتج'
                    : 'منتج جديد'}

                </h3>


                <p className="mt-1 text-xs text-coffee">

                  {editingProduct
                    ? 'عدّل البيانات المطلوبة ثم احفظ التغييرات'
                    : 'أدخل تفاصيل المنتج ثم اضغط حفظ'}

                </p>

              </div>


              <button
                type="button"
                onClick={closeForm}
                className="flex h-9 w-9 items-center justify-center rounded-full text-coffee transition hover:bg-cream"
                aria-label="إغلاق"
              >

                <X
                  size={19}
                />

              </button>

            </div>


            <div className="mt-5 grid gap-4 md:grid-cols-2">

              {/* Name */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-ink">
                  اسم المنتج *
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="مثال: أرز بسمتي 5 كغم"
                  className="h-12 w-full rounded-xl border border-sand bg-cream px-4 text-sm outline-none transition focus:border-coffee focus:bg-card"
                />

              </div>


              {/* Description */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-ink">
                  وصف المنتج
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="وصف مختصر للمنتج"
                  className="w-full resize-none rounded-xl border border-sand bg-cream p-4 text-sm outline-none transition focus:border-coffee focus:bg-card"
                />

              </div>


              {/* Image */}
              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-ink">
                  صورة المنتج
                </label>


                {currentImage ? (

                  <div className="overflow-hidden rounded-2xl border border-sand bg-cream">

                    <div className="relative flex max-h-80 items-center justify-center p-3">

                      <img
                        src={currentImage}
                        alt="صورة المنتج"
                        className="max-h-72 w-full rounded-xl object-contain"
                      />


                      {productImage && (

                        <button
                          type="button"
                          onClick={() =>
                            setProductImage(
                              null
                            )
                          }
                          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-card text-coffee-dark shadow"
                          aria-label="إلغاء الصورة الجديدة"
                        >

                          <X
                            size={18}
                          />

                        </button>

                      )}

                    </div>


                    <div className="border-t border-sand p-3">

                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-card px-4 py-3 text-sm font-bold text-coffee-dark transition hover:bg-sand">

                        <ImagePlus
                          size={18}
                        />

                        تغيير الصورة


                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(
                            event
                          ) => {
                            const file =
                              event
                                .target
                                .files?.[0]

                            if (file) {
                              setProductImage(
                                file
                              )
                            }
                          }}
                        />

                      </label>

                    </div>

                  </div>

                ) : (

                  <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sand bg-cream p-5 text-center transition hover:border-coffee">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card text-coffee-dark">

                      <ImagePlus
                        size={25}
                      />

                    </div>


                    <p className="mt-3 text-sm font-bold text-coffee-dark">
                      إضافة صورة المنتج
                    </p>


                    <p className="mt-1 text-xs text-coffee">
                      اختر صورة من الهاتف أو الكمبيوتر
                    </p>


                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(
                        event
                      ) => {
                        const file =
                          event
                            .target
                            .files?.[0]

                        if (file) {
                          setProductImage(
                            file
                          )
                        }
                      }}
                    />

                  </label>

                )}

              </div>


              {/* Price */}
              <div>

                <label className="mb-2 block text-sm font-medium text-ink">
                  السعر *
                </label>

                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={price}
                  onChange={(event) =>
                    setPrice(
                      event.target.value
                    )
                  }
                  placeholder="مثال: 12.5"
                  className="h-12 w-full rounded-xl border border-sand bg-cream px-4 text-sm outline-none transition focus:border-coffee focus:bg-card"
                />

              </div>


              {/* Category */}
              <div>

                <label className="mb-2 block text-sm font-medium text-ink">
                  المجموعة *
                </label>

                <select
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(
                      event.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-sand bg-cream px-4 text-sm outline-none transition focus:border-coffee focus:bg-card"
                >

                  <option value="">
                    اختر المجموعة
                  </option>


                  {categories.map(
                    (category) => (

                      <option
                        key={category.id}
                        value={category.id}
                      >

                        {category.name_ar}

                      </option>

                    )
                  )}

                </select>

              </div>

            </div>


            {/* Status */}
            <div className="mt-5 flex flex-wrap gap-5">

              <label className="flex cursor-pointer items-center gap-2 text-sm text-coffee-dark">

                <input
                  type="checkbox"
                  checked={
                    isAvailable
                  }
                  onChange={(event) =>
                    setIsAvailable(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-[#5e4a3a]"
                />

                المنتج متوفر

              </label>


              <label className="flex cursor-pointer items-center gap-2 text-sm text-coffee-dark">

                <input
                  type="checkbox"
                  checked={
                    isFeatured
                  }
                  onChange={(event) =>
                    setIsFeatured(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-[#5e4a3a]"
                />

                منتج مميز

              </label>

            </div>


            {/* Save Error */}
            {(
              createMutation.isError ||
              updateMutation.isError
            ) && (

              <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">

                {saveError ??
                  'حدث خطأ أثناء حفظ المنتج'}

              </div>

            )}


            {/* Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-coffee-dark px-6 py-3 text-sm font-bold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
              >

                {isSaving
                  ? 'جاري الحفظ...'
                  : editingProduct
                    ? 'حفظ التعديلات'
                    : 'حفظ المنتج'}

              </button>


              <button
                type="button"
                onClick={closeForm}
                disabled={isSaving}
                className="rounded-xl border border-sand px-6 py-3 text-sm font-bold text-coffee-dark transition hover:bg-cream disabled:opacity-60"
              >
                إلغاء
              </button>

            </div>

          </form>

        )}


        {/* Products */}
        <section className="mt-7">

          {productsLoading ? (

            <div className="py-10 text-center text-sm text-coffee">
              جاري تحميل المنتجات...
            </div>

          ) : products.length === 0 ? (

            <div className="rounded-3xl border border-sand bg-card p-10 text-center">

              <Package
                size={30}
                className="mx-auto text-coffee"
              />

              <p className="mt-3 text-sm text-coffee">
                لا توجد منتجات حتى الآن
              </p>

            </div>

          ) : (

            <div className="grid gap-3">

              {products.map(
                (product) => {

                  const imageUrl =
                    getImageUrl(
                      product.image
                    )


                  const availabilityPending =
                    availabilityMutation.isPending &&
                    availabilityMutation.variables
                      ?.productId === product.id


                  const visibilityPending =
                    visibilityMutation.isPending &&
                    visibilityMutation.variables
                      ?.productId === product.id


                  return (
                    <div
                      key={product.id}
                      className={`rounded-2xl border border-sand bg-card p-4 transition ${
                        product.is_active
                          ? ''
                          : 'opacity-60'
                      }`}
                    >

                      <div className="flex items-center gap-4">

                        {/* Image */}
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream">

                          {imageUrl ? (

                            <img
                              src={imageUrl}
                              alt={
                                product.name_ar
                              }
                              className="h-full w-full object-cover"
                            />

                          ) : (

                            <div className="flex h-full w-full items-center justify-center text-coffee">

                              <Package
                                size={24}
                              />

                            </div>

                          )}

                        </div>


                        {/* Info */}
                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-bold text-ink">
                              {product.name_ar}
                            </h3>


                            {!product.is_active && (

                              <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-bold text-gray-600">
                                مخفي
                              </span>

                            )}

                          </div>


                          <div className="mt-2 flex flex-wrap items-center gap-3">

                            <span className="text-sm font-bold text-coffee-dark">

                              {formatPrice(
                                product.price
                              )}

                            </span>


                            <span
                              className={`text-xs ${
                                product.is_available
                                  ? 'text-green-700'
                                  : 'text-red-600'
                              }`}
                            >

                              {product.is_available
                                ? 'متوفر'
                                : 'انتهت الكمية'}

                            </span>


                            {product.is_featured && (

                              <span className="rounded-full bg-sand px-2 py-1 text-[11px] text-coffee-dark">
                                مميز
                              </span>

                            )}

                          </div>

                        </div>

                      </div>


                      {/* Actions */}
                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() =>
                            startEditing(
                              product
                            )
                          }
                          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-sand bg-cream px-3 text-xs font-bold text-coffee-dark transition hover:bg-sand"
                        >

                          <Pencil
                            size={16}
                          />

                          تعديل

                        </button>


                        {/* Availability */}
                        <button
                          type="button"
                          disabled={
                            availabilityPending
                          }
                          onClick={() =>
                            availabilityMutation.mutate({
                              productId:
                                product.id,

                              isAvailable:
                                !product.is_available,
                            })
                          }
                          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-sand bg-cream px-3 text-xs font-bold text-coffee-dark transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {product.is_available ? (
                            <PackageX
                              size={16}
                            />
                          ) : (
                            <PackageCheck
                              size={16}
                            />
                          )}


                          {availabilityPending
                            ? 'جاري التحديث...'
                            : product.is_available
                              ? 'انتهت الكمية'
                              : 'جعله متوفر'}

                        </button>


                        {/* Visibility */}
                        <button
                          type="button"
                          disabled={
                            visibilityPending
                          }
                          onClick={() =>
                            visibilityMutation.mutate({
                              productId:
                                product.id,

                              isActive:
                                !product.is_active,
                            })
                          }
                          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-sand bg-cream px-3 text-xs font-bold text-coffee-dark transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {product.is_active ? (
                            <EyeOff
                              size={16}
                            />
                          ) : (
                            <Eye
                              size={16}
                            />
                          )}


                          {visibilityPending
                            ? 'جاري التحديث...'
                            : product.is_active
                              ? 'إخفاء من المتجر'
                              : 'إظهار في المتجر'}

                        </button>

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


export default AdminProductsPage