import React, { useState } from "react";
import booknow from "../../images/bookNow.png";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import axios from "axios";
import "./booknow.css";

function BookNow() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (name !== "" && phone !== "") {
      e.preventDefault();
      (async () => {
        try {
          var params = {
            name,
            phone,
            email,
          };
          var url = "/message";
          const res = await axios.post(url, params, {
            headers: { "Content-type": "application/json" },
          });
          const resData = await res.data;
          if (resData.status === "success") {
            setShow(false);
            swal({
              text: "You will be contacted with best deal shortly",
              icon: "success",
            });
          } else if (resData.status === "fail") {
            swal({
              text: "Check your network connection",
              icon: "error",
            });
          }
        } catch (err) {
          console.log(err);
        }
      })();
    } else {
      swal({ text: "Please fill in the required details", icon: "info" });
    }
  };
  return (
    <React.Fragment>
      <a href="tel:+91-9935474730">
        <div className="call-button py-2">
          <i className="fas fa-phone text-white"></i>
        </div>
      </a>
      <div onClick={handleShow}>
        <img src={booknow} alt="Book now" className="img-fluid book-now" />
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="modal-form-header">
          <Modal.Title className="modal-form-heading">
            Fill Form and get best Deal for Car hire in Varanasi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-horizontal">
            <div className="form-group">
              <div className="row no-gutters">
                <div className="col-sm-12">
                  <div className="row no-gutters mb-2 ">
                    <div className="col-sm-4">
                      <label className="control-label" for="name">
                        Your Name
                      </label>
                    </div>
                    <div className="col-sm-8">
                      <input
                        type="name"
                        className="form-control"
                        id="name"
                        placeholder="Enter Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <div className="invalid-feedback">Name is required</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row no-gutters mb-2">
                <div className="col-sm-4">
                  <label className="control-label" for="pwd">
                    Your Mobile Number
                  </label>
                </div>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="mobNumber"
                    placeholder="Your Mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row no-gutters mb-2">
                <div className="col-sm-4">
                  <label className="control-label" for="email">
                    Your Email:(optional)
                  </label>
                </div>
                <div className="col-sm-8">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="row no-gutters mb-2">
                <div className="col-sm-4"></div>
                <div className="col-sm-8">
                  <button
                    type="submit"
                    className="btn btn-success px-4 py-1 mb-3"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="modal-form-footer p-2">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="px-4 py-1 modal-close-button"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default BookNow;
