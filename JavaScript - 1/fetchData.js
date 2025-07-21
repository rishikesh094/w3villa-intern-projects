 async function fetchData(){
    try {
        const res = await fetch("https://dummyjson.com/products")
        const data = await res.json();
        console.log(data)
    } catch (error) {
        console.error(error)
    }
}

fetchData();