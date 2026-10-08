import {
  useState,
  type SubmitEvent,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  useQuery,
} from '@tanstack/react-query'

import {
  Check,
  CheckCircle2,
  LocateFixed,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
  Truck,
  User,
  WalletCards,
} from 'lucide-react'

import {
  useCart,
} from '../context/CartContext'

import {
  createOrder,
  getStoreConfig,
} from '../services/api'

import {
  formatPrice,
} from '../utils/formatPrice'


function CheckoutPage() {
  const navigate =
    useNavigate()


  const {
    items,
    cartTotal,
    clearCart,
  } = useCart()


  const {
    data: storeConfig,
    isLoading: configLoading,
    isError: configError,
  } = useQuery({
    queryKey: [
      'store-config',
    ],

    queryFn:
      getStoreConfig,
  })


  const deliveryFee =
    Number(
      storeConfig?.delivery_fee ??
      0
    )


  const grandTotal =
    cartTotal +
    deliveryFee


  const [
    name,
    setName,
  ] = useState('')


  const [
    phone,
    setPhone,
  ] = useState('')


  const [
    whatsapp,
    setWhatsapp,
  ] = useState('')


  const [
    sameAsPhone,
    setSameAsPhone,
  ] = useState(true)


  const [
    city,
    setCity,
  ] = useState('')


  const [
    address,
    setAddress,
  ] = useState('')


  const [
    notes,
    setNotes,
  ] = useState('')


  const [
    latitude,
    setLatitude,
  ] = useState<number | null>(
    null
  )


  const [
    longitude,
    setLongitude,
  ] = useState<number | null>(
    null
  )


  const [
    locationMessage,
    setLocationMessage,
  ] = useState('')


  const [
    error,
    setError,
  ] = useState('')


  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)


  function handleSameAsPhone(
    checked: boolean
  ) {
    setSameAsPhone(
      checked
    )

    if (checked) {
      setWhatsapp(
        phone
      )
    }
  }


  function handlePhoneChange(
    value: string
  ) {
    setPhone(
      value
    )

    if (sameAsPhone) {
      setWhatsapp(
        value
      )
    }
  }


  function getCurrentLocation() {
    if (
      !navigator.geolocation
    ) {
      setLocationMessage(
        'المتصفح لا يدعم مشاركة الموقع'
      )

      return
    }


    setLocationMessage(
      'جاري تحديد الموقع...'
    )


    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(
          position.coords.latitude
        )

        setLongitude(
          position.coords.longitude
        )

        setLocationMessage(
          'تم حفظ موقعك بنجاح'
        )
      },

      () => {
        setLocationMessage(
          'لم نتمكن من الوصول إلى موقعك'
        )
      }
    )
  }


  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault()


    if (isSubmitting) {
      return
    }


    setError('')


    if (
      !name.trim() ||
      !phone.trim() ||
      !city.trim() ||
      !address.trim()
    ) {
      setError(
        'يرجى تعبئة جميع الحقول المطلوبة'
      )

      return
    }


    if (
      items.length === 0
    ) {
      setError(
        'السلة فارغة'
      )

      return
    }


    if (
      configLoading ||
      configError ||
      !storeConfig
    ) {
      setError(
        'تعذر تحميل رسوم التوصيل. حاول تحديث الصفحة ثم أعد المحاولة.'
      )

      return
    }


    setIsSubmitting(
      true
    )


    try {
      const createdOrder =
        await createOrder({
          customer_name:
            name.trim(),

          phone:
            phone.trim(),

          whatsapp:
            sameAsPhone
              ? phone.trim()
              : whatsapp.trim(),

          city:
            city.trim(),

          address:
            address.trim(),

          latitude,

          longitude,

          notes:
            notes.trim()
              ? notes.trim()
              : null,

          items:
            items.map(
              (item) => ({
                product_id:
                  item.product.id,

                quantity:
                  item.quantity,
              })
            ),
        })


      sessionStorage.setItem(
        'last-order',
        JSON.stringify(
          createdOrder
        )
      )


      clearCart()


      navigate(
        '/order-success'
      )

    } catch (requestError) {

      if (
        requestError
        instanceof Error
      ) {
        setError(
          requestError.message
        )

      } else {
        setError(
          'حدث خطأ أثناء إرسال الطلب'
        )
      }

    } finally {
      setIsSubmitting(
        false
      )
    }
  }


  if (
    items.length === 0
  ) {
    return (
      <div className="min-h-screen bg-cream px-4 py-10">

        <div className="mx-auto max-w-xl rounded-[28px] border border-sand bg-card p-8 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-soft text-primary">

            <ShoppingBag
              size={28}
            />

          </div>


          <h1 className="mt-5 text-xl font-bold text-ink">
            لا يوجد طلب لإتمامه
          </h1>

          <p className="mt-2 text-sm text-muted">
            أضف بعض المنتجات إلى السلة أولاً
          </p>

        </div>

      </div>
    )
  }


  const inputClass =
    'h-12 w-full rounded-xl border border-sand bg-cream px-4 text-sm text-ink outline-none transition placeholder:text-muted-light focus:border-primary focus:bg-card focus:ring-2 focus:ring-soft'


  const inputWithIconClass =
    'h-12 w-full rounded-xl border border-sand bg-cream pr-11 pl-4 text-sm text-ink outline-none transition placeholder:text-muted-light focus:border-primary focus:bg-card focus:ring-2 focus:ring-soft'


  return (
    <div className="min-h-screen bg-cream">

      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">

        {/* Page Header */}
        <div className="mb-7">

          <p className="text-xs font-medium text-muted-light">
            الخطوة الأخيرة
          </p>

          <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
            إتمام الطلب
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            أدخل معلومات التواصل وعنوان التوصيل، وبعدها بنجهز طلبك ونتواصل معك.
          </p>

        </div>


        <form
          onSubmit={
            handleSubmit
          }
          className="grid items-start gap-5 lg:grid-cols-[1fr_370px]"
        >

          {/* Form */}
          <div className="space-y-4">

            {/* Contact */}
            <section className="rounded-[24px] border border-sand bg-card p-5 sm:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft text-primary">

                  <User
                    size={19}
                  />

                </div>


                <div>

                  <h2 className="font-bold text-ink">
                    معلومات التواصل
                  </h2>

                  <p className="mt-0.5 text-xs text-muted">
                    حتى نقدر نتواصل معك بخصوص الطلب
                  </p>

                </div>

              </div>


              <div className="space-y-4">

                {/* Name */}
                <div>

                  <label className="mb-2 block text-sm font-bold text-ink">
                    الاسم الكامل
                    <span className="mr-1 text-primary">
                      *
                    </span>
                  </label>


                  <div className="relative">

                    <User
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-light"
                    />

                    <input
                      type="text"
                      value={
                        name
                      }
                      onChange={(event) =>
                        setName(
                          event.target.value
                        )
                      }
                      placeholder="مثال: أحمد محمد"
                      autoComplete="name"
                      className={
                        inputWithIconClass
                      }
                    />

                  </div>

                </div>


                {/* Phone */}
                <div>

                  <label className="mb-2 block text-sm font-bold text-ink">
                    رقم الهاتف

                    <span className="mr-1 text-primary">
                      *
                    </span>
                  </label>


                  <div className="relative">

                    <Phone
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-light"
                    />


                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        handlePhoneChange(
                          event.target.value
                        )
                      }
                      placeholder="رقم الهاتف"
                      autoComplete="tel"
                      dir="ltr"
                      required
                      className={`${inputWithIconClass} text-right`}
                    />

                  </div>

                </div>


                {/* Same WhatsApp */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-sand bg-cream px-4 py-3.5">

                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(event) =>
                      handleSameAsPhone(
                        event.target.checked
                      )
                    }
                    className="sr-only"
                  />


                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
                      sameAsPhone
                        ? 'border-primary bg-primary'
                        : 'border-[#B9AFA5] bg-card'
                    }`}
                  >

                    {sameAsPhone && (

                      <Check
                        size={16}
                        strokeWidth={3}
                        className="text-white"
                      />

                    )}

                  </span>


                  <div className="min-w-0">

                    <p className="text-sm font-bold text-ink">
                      رقم الواتساب هو نفس رقم الهاتف
                    </p>

                    <p className="mt-0.5 text-[11px] leading-5 text-muted">
                      رقم الواتساب ضروري للتواصل وتأكيد الطلب
                    </p>

                  </div>

                </label>


                {/* WhatsApp */}
                {!sameAsPhone && (

                  <div>

                    <label className="mb-2 block text-sm font-bold text-ink">
                      رقم الواتساب

                      <span className="mr-1 text-primary">
                        *
                      </span>
                    </label>


                    <div className="relative">

                      <MessageCircle
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-light"
                      />


                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(event) =>
                          setWhatsapp(
                            event.target.value
                          )
                        }
                        placeholder="رقم الواتساب"
                        autoComplete="tel"
                        dir="ltr"
                        required={!sameAsPhone}
                        className={`${inputWithIconClass} text-right`}
                      />

                    </div>

                  </div>

                )}

              </div>

            </section>


            {/* Address */}
            <section className="rounded-[24px] border border-sand bg-card p-5 sm:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft text-primary">

                  <MapPin
                    size={19}
                  />

                </div>


                <div>

                  <h2 className="font-bold text-ink">
                    عنوان التوصيل
                  </h2>

                  <p className="mt-0.5 text-xs text-muted">
                    اكتب العنوان بشكل واضح لتسهيل التوصيل
                  </p>

                </div>

              </div>


              <div className="space-y-4">

                {/* City */}
                <div>

                  <label className="mb-2 block text-sm font-bold text-ink">
                    المدينة
                    <span className="mr-1 text-primary">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={
                      city
                    }
                    onChange={(event) =>
                      setCity(
                        event.target.value
                      )
                    }
                    placeholder="مثال: أم الفحم"
                    autoComplete="address-level2"
                    className={
                      inputClass
                    }
                  />

                </div>


                {/* Address */}
                <div>

                  <label className="mb-2 block text-sm font-bold text-ink">
                    العنوان بالتفصيل
                    <span className="mr-1 text-primary">
                      *
                    </span>
                  </label>


                  <div className="relative">

                    <MapPin
                      size={18}
                      className="absolute right-4 top-4 text-muted-light"
                    />

                    <textarea
                      value={
                        address
                      }
                      onChange={(event) =>
                        setAddress(
                          event.target.value
                        )
                      }
                      placeholder="الحي، الشارع، أقرب نقطة معروفة..."
                      rows={3}
                      autoComplete="street-address"
                      className="w-full resize-none rounded-xl border border-sand bg-cream py-3 pr-11 pl-4 text-sm text-ink outline-none transition placeholder:text-muted-light focus:border-primary focus:bg-card focus:ring-2 focus:ring-soft"
                    />

                  </div>

                </div>


                {/* Location */}
                <div>

                  <button
                    type="button"
                    onClick={
                      getCurrentLocation
                    }
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-primary bg-card text-sm font-bold text-primary transition hover:bg-soft"
                  >

                    <LocateFixed
                      size={18}
                    />

                    مشاركة موقعي الحالي

                  </button>


                  {locationMessage && (

                    <p className="mt-2 text-xs leading-5 text-muted">
                      {locationMessage}
                    </p>

                  )}


                  {latitude !== null &&
                    longitude !== null && (

                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#EEF1EA] p-3 text-xs font-bold text-[#5F6958]">

                        <CheckCircle2
                          size={16}
                        />

                        تم حفظ الموقع مع الطلب

                      </div>

                    )}

                </div>


                {/* Notes */}
                <div>

                  <label className="mb-2 block text-sm font-bold text-ink">
                    ملاحظات إضافية
                    <span className="mr-2 text-xs font-normal text-muted-light">
                      اختياري
                    </span>
                  </label>

                  <textarea
                    value={
                      notes
                    }
                    onChange={(event) =>
                      setNotes(
                        event.target.value
                      )
                    }
                    placeholder="أي معلومات إضافية تساعدنا في التوصيل..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-sand bg-cream p-4 text-sm text-ink outline-none transition placeholder:text-muted-light focus:border-primary focus:bg-card focus:ring-2 focus:ring-soft"
                  />

                </div>

              </div>

            </section>

          </div>


          {/* Summary */}
          <aside>

            <div className="rounded-[24px] border border-sand bg-card p-5 lg:sticky lg:top-40">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft text-primary">

                  <ShoppingBag
                    size={19}
                  />

                </div>

                <h2 className="text-lg font-bold text-ink">
                  ملخص الطلب
                </h2>

              </div>


              {/* Products */}
              <div className="mt-5 max-h-64 space-y-3 overflow-y-auto pl-1">

                {items.map(
                  (item) => (

                    <div
                      key={
                        item.product.id
                      }
                      className="flex items-start justify-between gap-3 border-b border-sand pb-3"
                    >

                      <div className="min-w-0">

                        <p className="line-clamp-2 text-sm font-bold leading-5 text-ink">
                          {
                            item.product.name_ar
                          }
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          الكمية:{' '}
                          {item.quantity}
                        </p>

                      </div>


                      <span className="shrink-0 text-sm font-bold text-primary">

                        {formatPrice(
                          Number(
                            item.product.price
                          ) *
                            item.quantity
                        )}

                      </span>

                    </div>

                  )
                )}

              </div>


              {/* Price Summary */}
              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between text-sm">

                  <span className="text-muted">
                    قيمة المنتجات
                  </span>

                  <span className="font-bold text-ink">
                    {formatPrice(
                      cartTotal
                    )}
                  </span>

                </div>


                <div className="flex items-center justify-between text-sm">

                  <div className="flex items-center gap-2 text-muted">

                    <Truck
                      size={16}
                      className="text-primary"
                    />

                    رسوم التوصيل

                  </div>

                  <span className="font-bold text-ink">

                    {configLoading
                      ? '...'
                      : configError
                        ? 'غير متاح'
                        : formatPrice(
                            deliveryFee
                          )}

                  </span>

                </div>

              </div>


              {/* Total */}
              <div className="mt-5 border-t border-sand pt-5">

                <div className="flex items-end justify-between gap-3">

                  <div>

                    <p className="font-bold text-ink">
                      المبلغ عند الاستلام
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted">

                      <WalletCards
                        size={14}
                      />

                      الدفع نقداً عند الاستلام

                    </div>

                  </div>


                  <span className="shrink-0 text-2xl font-bold text-primary">

                    {configLoading
                      ? '...'
                      : configError
                        ? '—'
                        : formatPrice(
                            grandTotal
                          )}

                  </span>

                </div>

              </div>


              {/* Error */}
              {error && (

                <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-700">
                  {error}
                </div>

              )}


              {configError && !error && (

                <div className="mt-5 rounded-xl bg-soft p-3 text-xs leading-5 text-muted">
                  تعذر تحميل رسوم التوصيل. حاول تحديث الصفحة.
                </div>

              )}


              {/* Submit */}
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  configLoading ||
                  configError
                }
                className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md disabled:cursor-not-allowed disabled:bg-soft disabled:text-muted-light disabled:shadow-none"
              >

                {isSubmitting
                  ? 'جاري إرسال الطلب...'
                  : configLoading
                    ? 'جاري حساب الطلب...'
                    : 'تأكيد الطلب'}

              </button>


              <p className="mt-3 text-center text-[11px] leading-5 text-muted-light">
                سيتم التواصل معك لتأكيد تفاصيل التوصيل
              </p>

            </div>

          </aside>

        </form>

      </div>

    </div>
  )
}


export default CheckoutPage