export default function CartCourses({ cartCourseIds, registeredIds, courses, onApply }) {
  const registeredSet = new Set(registeredIds);
  const visibleIds = cartCourseIds.filter((id) => !registeredSet.has(id));

  return (
    <section className="card">
      <div className="section-title">수강꾸러미 신청과목</div>
      <p className="section-desc">
        수강꾸러미에 담긴 과목 중 현재 수강신청이 완료되지 않은 과목만 보입니다.
      </p>
      <div className="table-wrap" style={{ marginTop: "8px" }}>
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
              <th>신청</th>
            </tr>
          </thead>
          <tbody>
            {visibleIds.length === 0 ? (
              <tr>
                <td colSpan={9} className="helper-text">
                  표시할 수강꾸러미 과목이 없습니다.
                </td>
              </tr>
            ) : (
              visibleIds.map((id) => {
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
                        onClick={() => onApply(id)}
                      >
                        신청
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
