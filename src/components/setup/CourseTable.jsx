export default function CourseTable({ rows, section, onMove, onRemove }) {
  const sectionLabel = {
    cart: "수강꾸러미",
    reg: "이미신청",
    code: "코드입력",
  }[section];

  const moveOptions = [
    { value: "cart", label: "수강꾸러미" },
    { value: "reg", label: "이미 신청" },
    { value: "code", label: "코드 입력용" },
  ].filter((o) => o.value !== section);

  return (
    <div className="table-wrap">
      <table className="data-table preset-table">
        <colgroup>
          <col style={{ width: "18%" }} />
          <col style={{ width: "47%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>강좌번호</th>
            <th>교과목명</th>
            <th>학점</th>
            <th style={{ width: "150px" }}>이동</th>
            <th style={{ width: "70px" }}>삭제</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td className="text-left">{row.name}</td>
              <td>{row.credit}</td>
              <td>
                <select
                  className="input-text"
                  style={{ width: "130px" }}
                  value=""
                  onChange={(e) => {
                    if (e.target.value) onMove(row, e.target.value);
                  }}
                >
                  <option value="">{sectionLabel}</option>
                  {moveOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    const label = `${row.id} ${row.name}`;
                    if (confirm(`${label} 과목을 초기 목록에서 삭제하시겠습니까?`)) {
                      onRemove(row.id, section);
                    }
                  }}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
