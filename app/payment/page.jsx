import { Suspense } from 'react'
import PayBooking from './PaymentComponent'

const Payment = () => {
  return (
    <Suspense>
      <PayBooking/>
    </Suspense>
  )
}

export default Payment