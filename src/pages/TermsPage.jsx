import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <div style={{ padding: "40px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", lineHeight: "1.8" }}>
        <h1>이용약관</h1>

        <h2>제1조 (목적)</h2>
        <p>
          본 사이트는 <strong>수강신청 연습</strong>을 위한 교육용
          웹사이트입니다.
        </p>

        <h2>제2조 (면책사항)</h2>
        <ul>
          <li>본 사이트는 특정 대학교의 공식 시스템이 아닙니다.</li>
          <li>
            본 사이트 이용으로 발생하는 모든 책임은 사용자에게 있습니다.
          </li>
          <li>
            실제 수강신청과 무관하며, 연습 목적으로만 사용해야 합니다.
          </li>
        </ul>

        <h2>제3조 (지적재산권)</h2>
        <p>
          본 사이트의 UI/UX는 일반적인 수강신청 시스템을 참고하여
          제작되었으며, 특정 기관의 저작물을 복제하지 않았습니다.
        </p>

        <p style={{ marginTop: "40px", color: "#999" }}>
          최종 수정일: 2026년 2월 6일
        </p>

        <p>
          <Link to="/" style={{ color: "#4285f4" }}>
            ← 메인으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
