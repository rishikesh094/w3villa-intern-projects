import Cart from './component/Cart'
import Product from './component/Product'
import products from "./products.json"
function App() {
  return (
    <div>

      <Cart />
      <div className='flex justify-center items-center flex-wrap'>
        {products.map((product) => {
          return <Product key={product.id} {...product} />
        })}
      </div>

    </div>
  )
}

export default App
