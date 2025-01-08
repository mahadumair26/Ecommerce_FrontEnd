import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); // State for tracking loading

  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowCardItems = () => {
    return (
      <div>
        <h6 className="d-flex justify-content-between align-items-center gap-3">
          <span style={{ flex: 2, textAlign: "left" }}>Name</span>
          <span style={{ flex: 1, textAlign: "center" }}>Quantity</span>
          <span style={{ flex: 1, textAlign: "right" }}>Price</span>
        </h6>
        <ul className="list-group list-group-flush">
          {cartProducts.map((item, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center gap-3"
            >
              <span style={{ flex: 2, textAlign: "left" }}>{item?.name}</span>
              <span style={{ flex: 1, textAlign: "center" }}>{item?.qty}</span>
              <span style={{ flex: 1, textAlign: "right" }}>{item?.price * item?.qty}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const calculateTotalAmount = () => {
    return cartProducts.reduce((total, item) => {
      return total + item?.qty * item?.price;
    }, 0);
  };

  const ShowCheckout = () => {
    let user = JSON.parse(localStorage.getItem("user"));

    const [paymentMethod, setPaymentMethod] = useState("");

    const [formData, setFormData] = useState({
      address: user?.location?.address || "",
      city: user?.location?.city || "",
      country: user?.location?.country || "",
    });

    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handlePaymentChange = (event) => {
      setPaymentMethod(event.target.value);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true); // Set loading to true when submission starts

      try {
        const isLocationDetailsChanged = () => {
          return (
            user?.location?.city !== formData.city ||
            user?.location?.country !== formData.country ||
            user?.location?.address !== formData.address
          );
        };

        if (isLocationDetailsChanged()) {
          const updateLocation = {
            id: user?.location?.id,
            city: formData.city,
            country: formData.country,
            address: formData.address,
          };

          const locationResponse = await axios.patch(
            `http://localhost:9091/location/update/${user?.id}`,
            updateLocation,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (locationResponse.data) {
            user.location = locationResponse.data;
          }

          localStorage.setItem("user", JSON.stringify(user));
          console.log("User location updated!...");
        }

        const paymentDetails = {
          amount: calculateTotalAmount(),
          paymentMethod: paymentMethod,
        };

        const paymentResponse = await axios.post(
          "http://localhost:9091/payment/add",
          paymentDetails,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (paymentResponse.data) {
          const cartItems = cartProducts.map((item) => ({
            productId: item?.id,
            quantity: item?.qty,
            price: item?.qty * item?.price,
          }));

          const orderDetails = {
            totalAmount: calculateTotalAmount(),
            paymentId: paymentResponse.data.id,
            userId: user.id,
            items: cartItems,
          };

          const orderResponse = await axios.post(
            "http://localhost:9091/order/add",
            orderDetails,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (orderResponse.data) {
            localStorage.removeItem("cart");
            dispatch({ type: "CLEARCART" });
            navigate("/order-confirmed", { state: orderResponse.data });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when submission finishes
      }
    };

    return (
      <>
        <div className="container py-5">
          {loading && ( // Display loading spinner when loading
            <div className="d-flex justify-content-center mb-3">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          <div className="row my-4">
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <ShowCardItems />
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <h6>Shipping</h6>
                      <span>0.00</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>${Math.round(calculateTotalAmount())}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">Billing address</h4>
                </div>
                <div className="card-body">
                  <form className="needs-validation" noValidate>
                    <div className="row g-3">
                      <div className="col-sm-6 my-1">
                        <label htmlFor="firstName" className="form-label">
                          First name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          disabled
                          value={user.firstName}
                        />
                      </div>

                      <div className="col-sm-6 my-1">
                        <label htmlFor="lastName" className="form-label">
                          Last name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          value={user.lastName}
                          disabled
                        />
                      </div>

                      <div className="col-12 my-1">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          value={user.email}
                          disabled
                        />
                      </div>

                      <div className="col-12 my-1">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          placeholder="1234 Main St"
                          required
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-5 my-1">
                        <label htmlFor="country" className="form-label">
                          Country
                        </label>
                        <br />
                        <input
                          type="text"
                          className="form-control"
                          name="country"
                          placeholder="Pakistan"
                          required
                          value={formData.country}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          Please select a valid country.
                        </div>
                      </div>

                      <div className="col-md-4 my-1">
                        <label htmlFor="state" className="form-label">
                          City
                        </label>
                        <br />
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          placeholder="Karachi"
                          required
                          value={formData.city}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          Please provide a valid city.
                        </div>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <h4 className="mb-3">Payment</h4>

                    <div className="row gy-3">
                      <div className="row gy-3">
                        <div className="col-12">
                          <label>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="Card"
                              checked={paymentMethod === "Card"}
                              onChange={handlePaymentChange}
                            />
                            <span> Payment by Card</span>
                          </label>
                        </div>

                        <div className="col-12">
                          <label>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="Cash"
                              checked={paymentMethod === "Cash"}
                              onChange={handlePaymentChange}
                            />
                            <span> Payment by Cash</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {paymentMethod === "Card" && (
                      <div className="row gy-3">
                        <hr></hr>
                        <h4>Card Details</h4>
                        <div className="col-md-6">
                          <label htmlFor="cc-name" className="form-label">
                            Name on card
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="cc-name"
                            placeholder=""
                            required
                          />
                          <small className="text-muted">
                            Full name as displayed on card
                          </small>
                          <div className="invalid-feedback">
                            Name on card is required

                        </div>
                      </div>

                      <div className="col-md-6">
                        <label for="cc-number" className="form-label">
                          Credit card number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-number"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Credit card number is required
                        </div>
                      </div>

                      <div className="col-md-3">
                        <label for="cc-expiration" className="form-label">
                          Expiration
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-expiration"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Expiration date required
                        </div>
                      </div>

                      <div className="col-md-3">
                        <label for="cc-cvv" className="form-label">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-cvv"
                          placeholder=""
                          required
                        />
                        <div className="invalid-feedback">
                          Security code required
                        </div>
                      </div>
                    </div>)}

                    <hr className="my-4" />

                    <button
                      className="w-100 btn btn-primary "
                      type="button" onClick={handleSubmit}
                    >
                      Confirm Order
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      {/* <Navbar /> */}
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {cartProducts.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
