import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { toast } from "react-toastify";
import { ticketTracking } from "../../../../redux/action/busAction";
import { PaymentHelper } from "../PaymentHelper";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const StripeCheckoutBtn = ({
  allBookingInformation,
  passengerInformation,
  booking_id,
  paydetail,
  paidamount,
  pay_method,
  setReload,
  setLoading,
}) => {
  const fareSummery = useSelector((state) => state?.busLists?.fareSummery);
  const { webSettingData } = useSelector((state) => state.busLists);
  const [stripeData, setStripeData] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    // fetch("/api/payment/stripeConfig").then(async (r) => {
    //   const { publishableKey } = await r.json();
    //   // console.log("publishableKey :- ", publishableKey);
    //   setStripePromise(loadStripe(publishableKey));
    // });
  }, []);

  // useEffect(() => {
  //   fetch("/api/payment/stripe", {
  //     method: "POST",
  //     body: JSON.stringify({}),
  //   }).then(async (result) => {
  //     var { clientSecret } = await result.json();
  //     // console.log("clientSecret :- ", clientSecret);
  //     setClientSecret(clientSecret);
  //   });
  // }, []);

  const getStripeData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_MODULE_DOMAIN}/paymethods/stripe`
    );

    const result = await response.json();

    console.log("result :-", result);

    if (result?.status === "success") {
      setStripeData(result?.data);
    }
  };

  const [stripePromise, setStripePromise] = useState(loadStripe(""));
  const [clientSecret, setClientSecret] = useState("");

  const [open, setOpen] = useState(false);
  const onOpenModal = () => {
    setStripePromise(loadStripe(stripeData.private_key));
    setClientSecret(stripeData.secrate_key);
    setOpen(true);
  };
  const onCloseModal = () => setOpen(false);

  const paymentLatter = async () => {
    const bookingData = new FormData();

    bookingData.append("booking_id", booking_id);
    bookingData.append("paydetail", paydetail);
    bookingData.append("paidamount", paidamount);
    bookingData.append("pay_method", pay_method);

    const response = await fetch(
      `${process.env.REACT_APP_API_MODULE_DOMAIN}/tickets/laterpay`,
      {
        method: "POST",
        body: bookingData,
      }
    );
    const result = await response.json();
    if (result?.status === "success") {
      setReload((preState) => !preState);
      toast.success(result?.status);
    }
  };

  useEffect(() => {
    try {
      getStripeData();
    } catch (error) {
      console.error("stripe", error);
    }
  }, []);

  const handleTicketTracking = async (id) => {
    setLoading(false);
    const response = await fetch(
      `${process.env.REACT_APP_API_MODULE_DOMAIN}/tickets/bookingid/${id}`
    );
    const result = await response.json();

    if (result?.status === "success") {
      dispatch(ticketTracking(result?.data));
      history.push("/ticket-traking");
      toast.success("success");
    }
  };

  const handlePayment = () => {
    setLoading(true);
    PaymentHelper(allBookingInformation, dispatch)
      .then((res) => {
        handleTicketTracking(res?.data?.booking_id);
        if (res) {
          console.log("sakib", res);
        }
      })
      .catch((err) => console.error(err));
  };

  const onToken = (token) => {
    if (booking_id) {
      paymentLatter();
    } else {
      setLoading(true);
      PaymentHelper(allBookingInformation, dispatch)
        .then((res) => {
          handleTicketTracking(res?.data?.booking_id);
          if (res) {
            console.log("sakib", res);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  if (
    !fareSummery &&
    !webSettingData?.currency_code &&
    !stripeData?.private_key
  )
    return <div>Loading...</div>;

  return (
    <div>
      <button className="btn btn-success" onClick={onOpenModal}>
        Stripe
      </button>
      <Modal open={open} onClose={onCloseModal} center>
        {/* {clientSecret && stripePromise && (
        )} */}

        <Elements stripe={stripePromise}>
          <CheckoutForm
            amount={
              paidamount
                ? Number(paidamount) * 100
                : fareSummery?.grandTotal * 100
            }
            billingAddress
            shippingAddress
            description={`Your total is ${webSettingData?.currency_symbol}${
              paidamount ? Number(paidamount) : fareSummery?.grandTotal
            }`}
            currency={webSettingData?.currency_code}
            handlePayment={handlePayment}
          />
        </Elements>
      </Modal>

      {/* <StripeCheckout
        label="Stripe"
        name="Freaky Jolly Co."
        billingAddress
        shippingAddress
        description={`Your total is ${webSettingData?.currency_symbol}${
          paidamount ? Number(paidamount) : fareSummery?.grandTotal
        }`}
        amount={
          paidamount ? Number(paidamount) * 100 : fareSummery?.grandTotal * 100
        }
        currency={webSettingData?.currency_code}
        panelLabel="Pay Now"
        token={onToken}
        stripeKey={stripeData?.private_key}
      /> */}
    </div>
  );
};

export default StripeCheckoutBtn;
