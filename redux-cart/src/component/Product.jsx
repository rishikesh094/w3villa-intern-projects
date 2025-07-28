import { useDispatch } from "react-redux";
import { addItem } from "../redux/slices/cartSlice"

const Product = (props) => {
  const dispatch = useDispatch();

  return (
    <div className="bg-white rounded-lg shadow-md w-72 m-2 overflow-hidden">
      <img
        className="w-full h-48 object-cover"
        src={props.image}
        alt={props.productName}
      />
      <div className="p-4">
        <h5 className="text-lg font-semibold mb-2">{props.productName}</h5>
        <p className="text-gray-700 mb-4">Rs. {props.price}/-</p>
        <button
          onClick={() => dispatch(addItem({ name: props.productName, price: props.price }))}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default Product;
