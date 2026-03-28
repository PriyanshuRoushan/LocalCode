import { useParams } from "react-router-dom";
import { useState } from "react";

function ProblemPage() {
  const { id } = useParams();
  const [code, setCode] = useState("// Write your solution");

  return (
    <div style={{ padding: "40px",color: "black" }}>
      <h1>Problem: {id}</h1>

      <textarea
        rows="20"
        cols="80"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
    </div>
  );
}

export default ProblemPage;