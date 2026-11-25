# KOPS Backend — eGovFrame 5.0 + MyBatis

`kopsUI_v1` 의 Maven/eGovFrame 구성을 승계하여 만든 KOPS API 서버입니다.
React 프론트엔드(`/home/user/kops-react`)가 호출하는 `/kops/main/**` URI를 제공합니다.

## 환경

| 항목 | 버전 |
|---|---|
| JDK | 21 (타깃 17) |
| Build | Maven 3.9.9 |
| Framework | eGovFrame Boot Starter Parent **5.0.2** (Spring Boot **3.5.6**), eGovFrame RTE FDL Common 5.0.2 |
| Persistence | MyBatis Spring Boot Starter 3.0.5 |
| DB Driver | MariaDB Connector/J 3.5.11 |
| DB | MariaDB (다음 단계에서 스키마 생성) |

## 실행

```bash
cd /home/user/kops-backend
mvn test                       # 컨트롤러 통합 테스트 3건
mvn -DskipTests package
java -jar target/kops-backend-1.0.0.jar   # http://localhost:8080
```

프론트엔드와 연동하려면:

```bash
cd /home/user/kops-react
KOPS_API_UPSTREAM=http://127.0.0.1:8080 npm run dev
```

## API

| Method | Path | 내용 |
|---|---|---|
| GET/POST | `/kops/main/{op|api}/{opa..opf}/{slug}.ndo|.do` | 84개 테스트케이스의 관측 URI 응답(샘플 데이터셋 또는 DB) |
| GET | `/api/health` | 헬스체크 · 데이터셋 개수 |
| GET/POST/PUT/DELETE | `/api/notices` | 공지사항 MyBatis CRUD (DB 연결 필요) |

`initialization-fail-timeout: -1` 설정으로 MariaDB가 아직 없어도 서버가 기동됩니다.
DB가 준비되면 `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` 환경변수로 연결합니다.

## 구조

```
src/main/java/kr/go/kops/
├── KopsBackendApplication.java     # @MapperScan
├── config/SampleDataStore.java     # 23개 비식별 URI 데이터셋 로더
├── config/WebConfig.java           # CORS
├── notice/                         # Notice 도메인 · MyBatis 매퍼 · CRUD API
└── web/
    ├── KopsDataController.java     # .ndo/.do 범용 엔드포인트
    └── HealthController.java
src/main/resources/
├── application.yml
├── data/kops-datasets.json
└── mapper/NoticeMapper.xml
```
