export default function RegisteredCourses({ registeredIds, courses, onDelete }) {
  return (
    <section className="card">
      <div className="section-title">수강신청 과목</div>
      <div className="table-wrap">
        <table className="data-table">
          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "32%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "6%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>재수강<br />여부</th>
              <th>강좌번호</th>
              <th>교과목명</th>
              <th>학점</th>
              <th>이수구분</th>
              <th>강의시간(강의실)</th>
              <th>주/야</th>
              <th>캠퍼스</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {registeredIds.length === 0 ? (
              <tr>
                <td colSpan={9} className="helper-text">
                  아직 신청한 과목이 없습니다.
                </td>
              </tr>
            ) : (
              registeredIds.map((id) => {
                const course = courses[id];
                if (!course) return null;
                const credit =
                  course.credit && course.credit > 0 ? course.credit : 3;
                return (
                  <tr key={id}>
                    <td></td>
                    <td>{course.id}</td>
                    <td className="text-left">{course.name}</td>
                    <td>{credit}</td>
                    <td>-</td>
                    <td className="text-left">-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>
                      <button
                        className="btn action-btn"
                        style={{ fontWeight: 600 }}
                        onClick={() => onDelete(id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
