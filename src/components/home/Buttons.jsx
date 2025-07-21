import React, {useState} from 'react'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import axios from "axios";

function Buttons() {
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
          <div className="container">
            <div className="row no-gutters mb-5 mt-2 stick">
              <div className="col-lg-6 col-md-6 col-sm-12 col-12 mx-auto bg-white py-4 px-4">
                <div className="row">
                  <div className="col-lg-12 col-12 col-sm-12">
                    <div className="text-brown text-center font-12 pb-2 font-regular">
                      Pack your bags, as your cab is on your door steps.
                    </div>
                  </div>
                </div>
                <div className="row no-gutters sticky-top">
                  <div className="col-lg-6 col-md-6 col-6 col-sm-6 mx-auto book-now-button">
                    <div onClick={handleShow}>
                      <div className="text-brown font-bold font-18 text-center py-2">
                        Book Now
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-6 col-sm-6 mx-auto call-now-button"> 
                    <a href="tel:+91-9935474730">
                      <div className="text-white font-bold font-18 text-center py-2">
                        <i className="fas fa-phone-alt text-white" /> &nbsp;Call Now
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>               
          </div> 
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-orange">
              <Modal.Title className="text-white font-demi font-15">
                Get best Deal for Car hire in Varanasi
              </Modal.Title>
            </Modal.Header>
        <Modal.Body className="modal-body pb-0">
          <form className="form-horizontal mb-0">
            <div className="form-group">              
              <label className="control-label text-brown font-12 font-regular mb-1" for="name">
                Your Name
              </label>
              <input
                type="name"
                className="form-control"
                id="name"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{background: '#FFEBD6', border: 'none'}}
              />              
              <label className="control-label text-brown font-12 font-regular mb-1" for="mobNumber">
                Your Mobile Number
              </label>
              <input
                type="text"
                className="form-control font-regular text-brown font-15"
                id="mobNumber"
                placeholder="Your Mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{background: '#FFEBD6', border: 'none'}}
              />                                
              <label className="control-label text-brown font-12 font-regular mb-1" for="email">
                Your Email:(optional)
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{background: '#FFEBD6', border: 'none'}}
              />
              <div className="text-center">
                <button
                  type="submit"
                  className="call-now-button px-5 py-2 text-center btn text-white font-medium font-15 my-3"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>              
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="bg-dark-brown p-2">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="px-4 py-1 font-regular font-15"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>         
        </React.Fragment>
    )
}

export default Buttons
