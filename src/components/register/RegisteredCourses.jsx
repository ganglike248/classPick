// CodeInput(과목 코드 입력 박스)과 한 섹션으로 묶여 보이도록, 카드/제목 없이
// 표만 그린다. 감싸는 카드와 제목은 RegisterPage에서 함께 잡아준다.
export default function RegisteredCourses({ registeredIds, courses, onDelete }) {
  return (
    <>
      <div className="table-wrap" style={{ marginTop: "14px" }}>
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
                <td colSpan={9} className="helper-text" style={{ textAlign: "center", padding: "10px 0" }}>
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
    </>
  );
}
