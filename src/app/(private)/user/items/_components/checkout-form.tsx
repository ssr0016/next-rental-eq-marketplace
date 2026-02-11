import { Dialog } from '@/components/ui/dialog';
import { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
interface CheckoutFormProps {
  openCheckoutForm: boolean
  setOpenCheckoutForm: (open: boolean) => void
  onPaymentSuccess: (a: string) => void
}
function CheckoutForm({ openCheckoutForm, setOpenCheckoutForm, onPaymentSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter()
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    setLoading(true);
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result: any = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "",
      },
      redirect: "if_required",
    });

    setLoading(false);

    if (result.error) {
      // console.log(result.error.message);
      toast.error(result.error.message)
    } else {
      toast.success("Payment successful")
      onPaymentSuccess(result.paymentIntent.id)
      // router.push("/user/rents")
    }
  };


  return (
    <Dialog open={openCheckoutForm} onOpenChange={setOpenCheckoutForm}>
      <DialogContent className="w-[95vw] max-w-[425px] sm:max-w-[525px] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-base sm:text-lg md:text-xl font-bold">
            Checkout and Payment
          </DialogTitle>
        </DialogHeader>

        <div>
          <form onSubmit={handleSubmit}>
            <PaymentElement />
            <AddressElement
              options={{ mode: "shipping", allowedCountries: ["US"] }}
            />
            <div className="flex justify-end gap-5 mt-5">
              <Button variant={"outline"} disabled={loading}>Cancel</Button>
              <Button type="submit" variant="default" disabled={loading}>
                Pay
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CheckoutForm 