export default function StudentInfo({ student, totalCredits }) {
  const remain = student.maxCredits - totalCredits;

  return (
    <section className="card">
      <div className="table-wrap">
        <table className="data-table info-table">
          <tbody>
            <tr>
              <th>년도학기</th>
              <td>{student.yearSemester}</td>
              <th>학번</th>
              <td>{student.studentId}</td>
              <th>성명</th>
              <td>{student.name}</td>
            </tr>
            <tr>
              <th>진급학과</th>
              <td>{student.major}</td>
              <th>학년</th>
              <td>{student.grade}</td>
              <th>인정학기</th>
              <td>{student.term}</td>
            </tr>
            <tr>
              <th>주야구분</th>
              <td>주간</td>
              <th>신청가능학점</th>
              <td colSpan={3} style={{ color: "#e13a3e" }}>
                {student.maxCredits}학점
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
