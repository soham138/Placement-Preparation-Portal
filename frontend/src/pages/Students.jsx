import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get("/students")
      .then((response) => {
        setStudents(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Students Page</h1>

      {students.map((student) => (
        <div key={student.id}>
          <p>Name: {student.name}</p>
          <p>Email: {student.email}</p>
          <p>Branch: {student.branch}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Students;