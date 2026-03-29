
import { Navigate, useNavigate } from "react-router-dom";
import "../css/PaymentTypePage.css";
import NavBar from "../components/NavBar";

export default function PaymentType() {
    const navigate = useNavigate();
    return(
        <div className="wrapper">
            < NavBar/>

            <div className="paymenttype-page">
                <section className="paymenttype-header">
                    <div className="paymenttype-hero">
                        <h1 className="paymenttype-hero-title">Payment Type</h1>
                    </div>
                </section>

                {/* BUTTON VALUES > CASH AT THE COUNTER = 0, ONLINE PAYMENT = 1 */}
                <section className="paymenttype-choice">
                    <div className="paymenttype-buttonlayout">
                        <button id="cash" value={0} onClick={()=>{}}>
                            <img src="src\assets\cashcounter.png"></img>
                            <p className="btn-text">Cash at the Counter</p>
                        </button>
                        <button id="online" value={1} onClick={()=> navigate("/qrpage")}> 
                            <img src="src\assets\onlinepayment.png"></img>
                            <p className="btn-text">Online Payment</p>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}