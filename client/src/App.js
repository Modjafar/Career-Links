import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then(res => res.text())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      <h1>Backend Response:</h1>
      <p>{data}</p>
    </div>
  );
}

export default App;
