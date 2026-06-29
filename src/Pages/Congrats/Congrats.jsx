import "./Congrats.scss";
import tick from "../../assets/tick.png";
import { Link } from "react-router-dom";

function Congrats() {
  return (
    <div className="congrats-container">
      <div className="congrats-content">
        <img src={tick} alt="tick" className="tick" />
        <h1 className="congrats-title">Congrats!</h1>
        <p className="congrats-para">Your order is placed successfully!</p>
        <Link to="/ProductPage" className="congrats-btn">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default Congrats;
