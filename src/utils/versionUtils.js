import { CHALLENGE_VERSIONS } from "../data/challengeData";

/** 해당 버전을 조회할 때 보여줄 참고사항 (없으면 null) */
export function getVersionNote(versionId) {
  return CHALLENGE_VERSIONS.find((v) => v.id === versionId)?.note ?? null;
}

/** 최신 버전부터 최대 count개의 버전 ID 목록 */
export function getRecentVersionIds(count = 4) {
  return [...CHALLENGE_VERSIONS].reverse().slice(0, count).map((v) => v.id);
}
