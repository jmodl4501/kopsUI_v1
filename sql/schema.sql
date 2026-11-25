USE egov_portal;
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS notice (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    writer VARCHAR(50) NOT NULL,
    view_count INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_notice_created_at (created_at),
    KEY idx_notice_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO notice (title, content, writer)
SELECT title, content, writer
FROM (
    SELECT '공지사항 안내' AS title, 'eGovFrame 5.0 기반 공공포털이 개설되었습니다.' AS content, '관리자' AS writer
    UNION ALL SELECT '시스템 점검 안내', '매주 일요일 02:00~04:00 정기 점검을 실시합니다.', '관리자'
    UNION ALL SELECT '개인정보 처리방침 개정', '개인정보 처리방침이 2026년 12월 1일부로 개정됩니다.', '관리자'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM notice);
