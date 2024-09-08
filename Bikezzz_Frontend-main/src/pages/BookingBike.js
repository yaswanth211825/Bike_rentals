import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { getAllCars } from "../redux/actions/bikeActions";
import { BookCar } from "../redux/actions/bookingActions";
import Spinner from "../components/Spinner";
import { Row, Col, Divider, DatePicker, Checkbox, Modal } from "antd";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
const { RangePicker } = DatePicker;
function BookingBike({ match }) {
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);

  const dispatch = useDispatch();

  const [car, setCar] = useState({});

  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalHours, setTotalHours] = useState();
  const [ridingGears, setRidingGears] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  useEffect(() => {
    if (cars.length === 0) {
      dispatch(getAllCars());
    } else {
      setCar(cars.find((o) => o._id === path));
    }
  }, [cars, path]);

  useEffect(() => {
    setTotalAmount(totalHours * car.rentPerHour);
    if (ridingGears) {
      setTotalAmount(totalAmount + 20 * totalHours);
    }
  }, [ridingGears, totalHours]);

  function selectTimeSlot(values) {
    setFrom(moment(values[0]).format("MMM DD yyyy HH:mm"));
    setTo(moment(values[1]).format("MMM DD yyyy HH:mm"));

    setTotalHours(values[1].diff(values[0], "hours"));
  }

  function onToken(token) {
    const reqObj = {
      token,
      user: JSON.parse(localStorage.getItem("user"))._id,
      car: car._id,
      totalHours,
      totalAmount,
      ridingGearsRequired: ridingGears,
      bookedTimeSlots: {
        from,
        to,
      },
    };
    dispatch(BookCar(reqObj));
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row
        justify="center"
        className="d-flex align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <Col lg={10} sm={24} xs={24}>
          <img
            src={car.image}
            alt=""
            className="carimg2"
            data-aos="flip-left"
            data-aos-duration="1500"
          />
        </Col>
        <Col lg={10} sm={24} xs={24} className="p-3 text-right">
          <Divider
            type="horizontal"
            dashed
            style={{ borderColor: "tomato", borderWidth: "0px" }}
          >
            Bike Info
          </Divider>
          <div style={{ textAlign: "right" }}>
            <p>{car.name}</p>
            <p> Cost : {car.rentPerHour}/-</p>
            <p>Fuel Type : {car.fuelType}</p>
          </div>
          <Divider
            type="horizontal"
            dashed
            style={{ borderColor: "tomato", borderWidth: "0px" }}
          >
          </Divider>
            <div>
              <StripeCheckout
                shippingAddress
                token={onToken}
                amount={totalAmount * 100}
                currency="INR"
                stripeKey="pk_test_51LChp4SE5wcmqxP8nYVqd0iLIUbj35nA1s9pmjTEROTdLHZZIujCcQX4uXSpdZSJJO62s4IHbfpNenR49GN1Zbem00p8aLkQ4N"
              >
                <button className="btn1 mt-2">Purchase Now</button>
              </StripeCheckout>
            </div>
        </Col>
      </Row>
      {car.name && (
        <Modal
          visible={showModal}
          closable={false}
          footer={false}
          title="Purchase"
        >
          <div className="p-2">
            {car.bookedTimeSlots.map((slot) => {
              return (
                <button className="btn1 mt-2">
                  {slot.from} - {slot.to}
                </button>
              );
            })}

            <div className="text-right mt-5">
              <button
                className="btn1"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
}

export default BookingBike;