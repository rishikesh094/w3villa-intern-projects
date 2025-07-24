import React from "react";
import User from "./User";
import FetchData from "./FetchData";

function App({ children }) {
  // without jsx
  const element = React.createElement("h1", null, "Hello World");
  const sum = () => {
    alert(1 + 2);
  };
  return (
    <>
      {element}
      <button onClick={sum}>Click me</button>
      {children}
      <User isLoggedIn={true} />
      <FetchData />
    </>
  );
}

export default App;
