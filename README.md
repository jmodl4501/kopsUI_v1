# KOPS 지출보고서 관리시스템 — 구축 결과

`jmodl4501/kopsUI_v1` 의 `menu_tests/`(84 메뉴 · 931 STEP)와 `docs/`를 기준으로
프런트엔드 → 백엔드 → DB → 테스트까지 구축했습니다.

## 구성

| 단계 | 경로 | 핵심 기술 | 상태 |
|---|---|---|---|
| 1. 프런트엔드 | [`kops-react/`](kops-react/README.md) | Next.js 15.5 + React 19.2, 템플릿 `ai-website-cloner-template` 기반 | 84개 메뉴 라우트, 빌드 성공 |
| 2. 백엔드 | [`kops-backend/`](kops-backend/README.md) | eGovFrame 5.0.2 + Spring Boot 3.5.6 + MyBatis 3.0.5 | Maven 테스트 6/6 PASS |
| 3. DB | [`kops-db/`](kops-db/README.md) | MariaDB 11.8 | 12 테이블, 84메뉴/456 URI/7 서식 시드 |
| 4. 테스트 | [`kops-tests/`](kops-tests/README.md) | Python Playwright **sync** + Google Chrome 158 | **84/84 PASS (931 STEP, FAIL 0)** |

## 실행 중인 서비스

- 프런트엔드: <http://localhost:3000> (LIVE PREVIEW)
- 백엔드 API: <http://localhost:8080> (`/api/health`, `/kops/main/**`, `/api/forms/...`)
- MariaDB: `127.0.0.1:3306` / DB `kops` / `kops:kops1234`

## 전체 재실행

```bash
# DB
sudo service mariadb start
sudo mariadb < /home/user/kops-db/sql/schema.sql
sudo mariadb < /home/user/kops-db/sql/seed.sql

# 백엔드
cd /home/user/kops-backend && mvn -DskipTests package
DB_URL='jdbc:mariadb://127.0.0.1:3306/kops?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Seoul' \
DB_USERNAME=kops DB_PASSWORD=kops1234 java -jar target/kops-backend-1.0.0.jar

# 프런트엔드
cd /home/user/kops-react && npm run build
KOPS_API_UPSTREAM=http://127.0.0.1:8080 npm start

# 테스트
cd /home/user/kops-tests && python3 local_menu_runner.py --all --wait-ms 4000
```

## 검증 리포트

[`kops-tests/out/local_menu_report_all.md`](kops-tests/out/local_menu_report_all.md) —
84개 케이스 · 931 STEP · PASS 818 / INFO 84 / WARN 29 / FAIL 0

> 첨부된 `지출보고서_관리시스템_OpenAPI_개발가이드(26.9.).pdf`의 서식정보 필드
> (견본품 제공 ~ 성능확인)를 camelCase → snake_case로 변환해 DB 스키마에 반영했습니다.
