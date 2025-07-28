import { useSelector } from "react-redux";

const Cart = () => {
  const items = useSelector(state => state.cart)
  const total = items.reduce((acc, val) => acc + val.price, 0)

  return (
    <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4">
      <h3 className="text-center text-xl font-semibold">
        {`Total Items: ${items.length} (Rs. ${total})`}
      </h3>
    </div>
  );
};

export default Cart;
