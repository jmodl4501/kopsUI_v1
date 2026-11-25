# KOPS UI v1

전자정부 표준프레임워크(eGovFrame) 5 기반의 **지출보고서 관리시스템(KOPS) UI 포털 예제**입니다.

Spring Boot와 MyBatis로 REST API를 제공하고, 별도의 Node.js/Vite/Webpack 서버 없이 정적 HTML·CSS·Vanilla JavaScript를 Spring Boot에서 직접 서비스합니다. 화면 목록, 검색, 입력 폼, FAQ, 통계 및 TOAST UI Grid를 포함하며 MariaDB에 저장된 공지사항을 REST API로 조회·등록·수정·삭제할 수 있습니다.

> 이 프로젝트는 KOPS 형태의 화면 구조를 구현한 개발·검증용 예제입니다. 실제 운영 환경에서는 인증·인가, 개인정보 보호, CSRF 방어, 감사 로그 및 기관 보안 정책을 추가로 적용해야 합니다.

---

## 1. 주요 기능

### 포털 UI

- 공공기관형 상단 유틸리티 메뉴와 GNB/메가 메뉴
- 반응형 데스크톱·모바일 레이아웃
- 화면 확대·축소, 본문 바로가기, ARIA 속성 등 기본 접근성 지원
- 해시 기반 SPA 라우팅
- 통합 메뉴 검색
- 입력 폼, 필수값 검증, 임시 저장, 확인 대화상자
- 조회 조건 검색 및 초기화
- TOAST UI Grid 목록, 페이징, 상세보기, CSV 다운로드
- 공지사항, FAQ, 교육 신청, 시스템 안내, 마이페이지 화면

### KOPS 화면 구성

- 지출보고서 정보공개
- 지출보고서 작성·정정
- 기관정보 관리
- 알림·지원
- 시스템 안내
- 마이페이지
- 7종 지출보고서 서식별 공개·조회·작성·정정 화면
- 홈 포함 78개 화면 라우트

### 백엔드

- eGovFrame Boot Starter Parent 5.0.2
- Spring Boot 3.5.6
- MyBatis XML Mapper
- MariaDB 연동
- 공지사항 CRUD REST API
- 검색 및 서버 페이징
- Jakarta Validation 기반 요청 검증

---

## 2. 기술 스택

| 구분 | 기술 |
|---|---|
| Runtime | Java 21 권장, Java 17 컴파일 타깃 |
| Framework | eGovFrame 5.0.2, Spring Boot 3.5.6 |
| Persistence | MyBatis 3, MariaDB Connector/J 3.5.11 |
| Database | MariaDB 10.6 이상 권장 |
| Build | Maven 3.8 이상 |
| Frontend | HTML5, CSS, Vanilla JavaScript |
| Data Grid | TOAST UI Grid 4.21.23 |
| UI Design | OpenPencil `.op` 구조 파일 |
| JavaScript Lint | oxlint |

프런트엔드 실행을 위해 Node.js나 별도의 개발 서버는 필요하지 않습니다. Tailwind 결과물과 외부 UI 라이브러리는 저장소에 정적 파일로 포함되어 있습니다.

---

## 3. 프로젝트 구조

```text
.
├── .mvn/
│   ├── jvm.config                 # Maven 최대 힙 512MB
│   └── maven.config              # Maven 로컬 저장소 설정
├── design/
│   ├── kops-full.op              # 전체 KOPS UI 구조
│   ├── kops-full-structure.js    # OpenPencil 생성 스크립트
│   └── op-structure.js           # 초기 포털 구조 스크립트
├── sql/
│   └── schema.sql                # notice 테이블 및 초기 데이터
├── src/main/java/kr/go/egovportal/
│   ├── EgovPortalApplication.java
│   ├── common/                   # 페이지 응답 모델
│   └── notice/                   # Controller/Service/Mapper/Model
├── src/main/resources/
│   ├── application.yml           # 애플리케이션 설정
│   ├── mapper/NoticeMapper.xml   # MyBatis SQL
│   └── static/
│       ├── index.html            # SPA 진입점
│       ├── css/                  # 포털 스타일 및 사전 생성 Tailwind CSS
│       ├── data/                 # 비식별 KOPS 테스트 데이터
│       ├── js/
│       │   ├── kops-config.js    # 화면/메뉴/라우트 정의
│       │   └── kops-app.js       # 렌더링 및 상호작용
│       └── vendor/tui-grid/      # TOAST UI Grid 로컬 배포 파일
├── pom.xml
└── run.sh                        # 환경변수 로드 및 애플리케이션 실행
```

`target/`은 Maven 빌드 결과이므로 Git에 포함되지 않습니다.

---

## 4. 설치 요구사항

다음 프로그램이 필요합니다.

- Git
- JDK 17 이상 (JDK 21 권장)
- Maven 3.8 이상
- MariaDB Server 및 Client

버전 확인:

```bash
java -version
mvn -version
mariadb --version
git --version
```

---

## 5. Ubuntu/Debian 설치 가이드

### 5.1 시스템 패키지 설치

```bash
sudo apt update
sudo apt install -y git openjdk-21-jdk maven mariadb-server mariadb-client curl
```

배포판에서 JDK 21을 제공하지 않으면 JDK 17을 사용해도 됩니다.

```bash
sudo apt install -y openjdk-17-jdk
```

Java 기본 버전 선택이 필요한 경우:

```bash
sudo update-alternatives --config java
sudo update-alternatives --config javac
```

### 5.2 저장소 복제

```bash
git clone https://github.com/jmodl4501/kopsUI_v1.git
cd kopsUI_v1
```

### 5.3 MariaDB 시작

```bash
sudo systemctl enable --now mariadb
sudo systemctl status mariadb --no-pager
```

선택적으로 기본 보안 설정을 수행합니다.

```bash
sudo mariadb-secure-installation
```

---

## 6. 저사양 MariaDB 설정

2GB RAM 수준의 개발 서버에서는 MariaDB 메모리를 줄이기 위해 다음 설정을 사용할 수 있습니다.

```bash
sudo tee /etc/mysql/mariadb.conf.d/99-low-memory.cnf >/dev/null <<'EOF'
[mysqld]
innodb_buffer_pool_size=96M
innodb_buffer_pool_instances=1
innodb_log_buffer_size=8M
key_buffer_size=8M
tmp_table_size=16M
max_heap_table_size=16M
max_connections=30
thread_cache_size=4
table_open_cache=200
performance_schema=OFF
skip_name_resolve=ON
default_time_zone='+09:00'
character_set_server=utf8mb4
collation_server=utf8mb4_unicode_ci
EOF
```

설정 적용:

```bash
sudo systemctl restart mariadb
sudo systemctl status mariadb --no-pager
```

현재 메모리 사용량 확인:

```bash
ps -C mariadbd -o pid,rss,cmd
```

> 운영 DB에는 트래픽, 동시 접속 수 및 데이터 크기에 맞는 별도 튜닝이 필요합니다.

---

## 7. 데이터베이스 초기화

### 7.1 데이터베이스와 사용자 생성

아래의 `CHANGE_ME_STRONG_PASSWORD`를 충분히 강한 비밀번호로 변경합니다.

```bash
sudo mariadb <<'SQL'
CREATE DATABASE IF NOT EXISTS egov_portal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'egov'@'localhost'
  IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';
CREATE USER IF NOT EXISTS 'egov'@'127.0.0.1'
  IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';

GRANT ALL PRIVILEGES ON egov_portal.* TO 'egov'@'localhost';
GRANT ALL PRIVILEGES ON egov_portal.* TO 'egov'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL
```

애플리케이션 기본 접속 주소가 `127.0.0.1`이므로 TCP 접속용 사용자도 생성해야 합니다.

### 7.2 스키마와 초기 데이터 적용

```bash
mariadb \
  --host=127.0.0.1 \
  --user=egov \
  --password \
  --default-character-set=utf8mb4 \
  egov_portal < sql/schema.sql
```

정상 생성 확인:

```bash
mariadb --host=127.0.0.1 --user=egov --password egov_portal \
  -e "SELECT id, title, writer, created_at FROM notice ORDER BY id DESC;"
```

`sql/schema.sql`은 다음 작업을 수행합니다.

- `notice` 테이블 생성
- 제목 및 등록일 인덱스 생성
- UTF-8(`utf8mb4`) 설정
- 테이블이 비어 있을 때만 예제 공지사항 3건 등록

---

## 8. 애플리케이션 환경변수

`run.sh`는 `/etc/egovframe/portal.env` 파일이 있으면 자동으로 읽습니다.

```bash
sudo mkdir -p /etc/egovframe
sudo tee /etc/egovframe/portal.env >/dev/null <<'EOF'
DB_URL="jdbc:mariadb://127.0.0.1:3306/egov_portal?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Seoul"
DB_USERNAME="egov"
DB_PASSWORD="CHANGE_ME_STRONG_PASSWORD"
SERVER_PORT="8080"
JAVA_OPTS="-Xms128m -Xmx512m -XX:MaxMetaspaceSize=128m -XX:+UseSerialGC"
EOF
```

환경 파일 권한을 제한합니다.

```bash
sudo chown root:$(id -gn) /etc/egovframe/portal.env
sudo chmod 640 /etc/egovframe/portal.env
```

환경 파일을 사용하지 않고 현재 셸에서 직접 설정할 수도 있습니다.

```bash
export DB_URL='jdbc:mariadb://127.0.0.1:3306/egov_portal?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Seoul'
export DB_USERNAME='egov'
export DB_PASSWORD='CHANGE_ME_STRONG_PASSWORD'
export SERVER_PORT='8080'
export JAVA_OPTS='-Xms128m -Xmx512m -XX:MaxMetaspaceSize=128m -XX:+UseSerialGC'
```

### 환경변수 목록

| 변수 | 기본값 | 설명 |
|---|---|---|
| `DB_URL` | `jdbc:mariadb://127.0.0.1:3306/egov_portal...` | MariaDB JDBC URL |
| `DB_USERNAME` | `egov` | DB 사용자 |
| `DB_PASSWORD` | 빈 문자열 | DB 비밀번호, 운영 시 반드시 지정 |
| `SERVER_PORT` | `8080` | HTTP 포트 |
| `JAVA_OPTS` | 최대 힙 512MB | JVM 메모리 및 GC 옵션 |

비밀번호나 API 키를 Git에 커밋하지 마십시오.

---

## 9. 빌드 및 실행

### 9.1 테스트

```bash
mvn test
```

### 9.2 패키징

```bash
mvn -DskipTests package
```

생성 파일:

```text
target/egov-portal-1.0.0.jar
```

Maven의 최대 힙은 `.mvn/jvm.config`에서 512MB로 제한되어 있습니다.

### 9.3 애플리케이션 실행

```bash
chmod +x run.sh
./run.sh
```

직접 실행하려면:

```bash
java -Xms128m -Xmx512m -XX:MaxMetaspaceSize=128m -XX:+UseSerialGC \
  -jar target/egov-portal-1.0.0.jar
```

정상 기동 로그 예시:

```text
Tomcat started on port 8080 (http)
Started EgovPortalApplication
```

브라우저에서 다음 주소를 엽니다.

```text
http://localhost:8080
```

상태 확인:

```bash
curl -I http://127.0.0.1:8080/
curl 'http://127.0.0.1:8080/api/notices?page=1&size=3'
```

종료하려면 실행 중인 터미널에서 `Ctrl+C`를 누릅니다.

---

## 10. 빠른 설치 요약

Ubuntu/Debian에서 필요한 명령만 요약하면 다음과 같습니다.

```bash
sudo apt update
sudo apt install -y git openjdk-21-jdk maven mariadb-server mariadb-client

git clone https://github.com/jmodl4501/kopsUI_v1.git
cd kopsUI_v1

sudo systemctl enable --now mariadb

sudo mariadb <<'SQL'
CREATE DATABASE IF NOT EXISTS egov_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'egov'@'localhost' IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';
CREATE USER IF NOT EXISTS 'egov'@'127.0.0.1' IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON egov_portal.* TO 'egov'@'localhost';
GRANT ALL PRIVILEGES ON egov_portal.* TO 'egov'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL

mariadb -h 127.0.0.1 -u egov -p --default-character-set=utf8mb4 egov_portal < sql/schema.sql

export DB_USERNAME=egov
export DB_PASSWORD='CHANGE_ME_STRONG_PASSWORD'
mvn -DskipTests package
./run.sh
```

---

## 11. REST API

기본 경로는 `/api/notices`입니다.

| Method | Endpoint | 설명 | 정상 상태 |
|---|---|---|---|
| `GET` | `/api/notices` | 목록, 검색, 페이징 | `200` |
| `GET` | `/api/notices/{id}` | 상세 조회 | `200` |
| `POST` | `/api/notices` | 등록 | `201` |
| `PUT` | `/api/notices/{id}` | 수정 | `200` |
| `DELETE` | `/api/notices/{id}` | 삭제 | `204` |

### 목록 조회

```bash
curl 'http://localhost:8080/api/notices?page=1&size=10&keyword=안내'
```

응답 예시:

```json
{
  "contents": [
    {
      "id": 1,
      "title": "공지사항 안내",
      "content": "eGovFrame 5.0 기반 공공포털이 개설되었습니다.",
      "writer": "관리자",
      "viewCount": 0,
      "createdAt": "2026-11-24T21:42:52",
      "updatedAt": "2026-11-24T21:42:52"
    }
  ],
  "pagination": {
    "page": 1,
    "size": 10,
    "totalCount": 1,
    "totalPages": 1
  }
}
```

### 상세 조회

```bash
curl 'http://localhost:8080/api/notices/1'
```

### 등록

```bash
curl -i -X POST 'http://localhost:8080/api/notices' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "신규 공지",
    "content": "공지 내용입니다.",
    "writer": "관리자"
  }'
```

### 수정

```bash
curl -i -X PUT 'http://localhost:8080/api/notices/1' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "수정된 공지",
    "content": "수정된 내용입니다.",
    "writer": "관리자"
  }'
```

### 삭제

```bash
curl -i -X DELETE 'http://localhost:8080/api/notices/1'
```

### 요청 검증 규칙

- `title`: 필수, 최대 200자
- `content`: 필수
- `writer`: 필수, 최대 50자
- 빈 필수값을 보내면 `400 Bad Request`가 반환됩니다.

---

## 12. 프런트엔드 구조

### `kops-config.js`

메뉴, 화면명, 라우트, 화면 유형 및 데이터셋 연결 정보를 정의합니다. 새 화면을 추가할 때 화면 설정을 이 파일에 등록합니다.

### `kops-app.js`

다음 기능을 담당합니다.

- 해시 라우터
- GNB/메가 메뉴와 LNB 생성
- 화면 유형별 렌더링
- 검색 및 필터링
- TOAST UI Grid 생성
- 상세 대화상자
- FAQ 아코디언
- CSV 다운로드
- 폼 임시저장 및 제출 확인

### `kops-datasets.json`

UI 테스트를 위한 비식별 예제 데이터입니다. 실제 운영 데이터는 REST API와 권한 검사를 거쳐 제공해야 합니다.

### 정적 파일 제공

모든 프런트엔드 파일은 아래 경로에 있으며 Spring Boot가 직접 제공합니다.

```text
src/main/resources/static/
```

프런트엔드 개발 서버는 사용하지 않습니다.

---

## 13. JavaScript 검사

프로젝트 작업 규칙상 JavaScript를 변경한 후 oxlint를 실행합니다.

oxlint가 설치되어 있다면:

```bash
oxlint --deny-warnings \
  src/main/resources/static/js \
  design/kops-full-structure.js
```

oxlint 설치 예시(Node.js가 설치된 개발 환경):

```bash
npm install -g oxlint
```

검사 결과는 오류와 경고가 모두 0이어야 합니다.

> Node.js는 JavaScript 정적 검사나 Tailwind 재생성이 필요할 때만 사용합니다. 애플리케이션 실행에는 필요하지 않습니다.

---

## 14. OpenPencil UI 구조 재생성

완성된 구조 파일은 다음 위치에 있습니다.

```text
design/kops-full.op
```

OpenPencil CLI와 데스크톱 바이너리가 준비된 환경에서는 다음과 같이 재생성할 수 있습니다.

```bash
export OPENPENCIL_DESKTOP_BIN=/path/to/openpencil-desktop

op start \
  --headless \
  --file "$PWD/design/kops-full.op" \
  --port 3100

op design @"$PWD/design/kops-full-structure.js" \
  --script \
  --port 3100 \
  --file "$PWD/design/kops-full.op"

op save "$PWD/design/kops-full.op" --port 3100
op stop --port 3100
```

OpenPencil은 선택 사항이며 일반 빌드·실행에는 필요하지 않습니다.

---

## 15. 운영 서비스 등록(systemd)

아래 예시는 프로젝트가 `/opt/kopsUI_v1`에 배치되고 실행 사용자가 `kops`인 경우입니다. 환경에 맞게 경로와 사용자를 수정하십시오.

```bash
sudo useradd --system --home /opt/kopsUI_v1 --shell /usr/sbin/nologin kops
sudo chown -R kops:kops /opt/kopsUI_v1
```

서비스 파일 생성:

```bash
sudo tee /etc/systemd/system/kops-portal.service >/dev/null <<'EOF'
[Unit]
Description=KOPS UI Portal
After=network.target mariadb.service
Requires=mariadb.service

[Service]
Type=simple
User=kops
Group=kops
WorkingDirectory=/opt/kopsUI_v1
EnvironmentFile=/etc/egovframe/portal.env
ExecStart=/usr/bin/java -Xms128m -Xmx512m -XX:MaxMetaspaceSize=128m -XX:+UseSerialGC -jar /opt/kopsUI_v1/target/egov-portal-1.0.0.jar
Restart=on-failure
RestartSec=5
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
EOF
```

서비스 적용:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now kops-portal
sudo systemctl status kops-portal --no-pager
```

로그 확인:

```bash
sudo journalctl -u kops-portal -f
```

재배포:

```bash
cd /opt/kopsUI_v1
git pull
mvn -DskipTests package
sudo systemctl restart kops-portal
```

---

## 16. 운영 환경 권장 사항

현재 프로젝트는 UI 및 API 예제에 초점을 둡니다. 실제 서비스 전에는 최소한 다음 항목을 구현하거나 점검해야 합니다.

- Spring Security 기반 로그인 및 역할별 접근 제어
- 비밀번호 해시 처리와 안전한 세션/쿠키 설정
- CSRF 방어 및 CORS 허용 목록 제한
- 입력값 검증과 출력 인코딩
- 개인정보 마스킹과 다운로드 권한 검사
- 변경 이력 및 관리자 감사 로그
- TLS(HTTPS) 적용
- Nginx/Apache 리버스 프록시 구성
- DB 계정 최소 권한 적용
- 환경변수 또는 Secret Manager를 통한 비밀값 관리
- 정기 백업 및 복구 테스트
- 보안 헤더와 CSP 설정
- 로그 내 개인정보 및 인증정보 제거

---

## 17. 문제 해결

### 17.1 `Access denied ... (using password: NO)`

`DB_PASSWORD`가 현재 프로세스에 전달되지 않은 상태입니다.

- `/etc/egovframe/portal.env`가 존재하는지 확인합니다.
- `KEY="value"` 형식으로 작성했는지 확인합니다.
- `run.sh`로 실행하거나 환경변수를 `export`했는지 확인합니다.

```bash
sudo ls -l /etc/egovframe/portal.env
```

### 17.2 `Host '127.0.0.1' is not allowed to connect`

MariaDB에 `'egov'@'127.0.0.1'` 사용자가 없는 경우입니다.

```sql
CREATE USER IF NOT EXISTS 'egov'@'127.0.0.1' IDENTIFIED BY '비밀번호';
GRANT ALL PRIVILEGES ON egov_portal.* TO 'egov'@'127.0.0.1';
FLUSH PRIVILEGES;
```

### 17.3 한글 데이터가 깨지는 경우

UTF-8 옵션으로 스키마를 다시 적용하고 DB/테이블 문자셋을 확인합니다.

```bash
mariadb --default-character-set=utf8mb4 -h 127.0.0.1 -u egov -p egov_portal < sql/schema.sql
```

```sql
SHOW CREATE DATABASE egov_portal;
SHOW CREATE TABLE egov_portal.notice;
```

### 17.4 8080 포트가 이미 사용 중인 경우

사용 프로세스 확인:

```bash
sudo ss -ltnp | grep ':8080'
```

다른 포트로 실행:

```bash
SERVER_PORT=8081 ./run.sh
```

### 17.5 MariaDB 연결 실패

```bash
sudo systemctl status mariadb --no-pager
mariadb-admin -h 127.0.0.1 -u egov -p ping
```

JDBC URL, 사용자, 비밀번호 및 방화벽을 확인합니다.

### 17.6 빌드 중 메모리 부족

프로젝트의 `.mvn/jvm.config`에는 최대 힙 512MB 설정이 포함되어 있습니다. 동시에 실행 중인 불필요한 빌드 프로세스를 종료하고 다시 실행합니다.

```bash
mvn -DskipTests package
```

### 17.7 정적 화면은 열리지만 목록이 보이지 않는 경우

브라우저 개발자 도구의 Console과 Network 탭에서 다음 파일이 `200`인지 확인합니다.

```text
/js/kops-config.js
/js/kops-app.js
/data/kops-datasets.json
/vendor/tui-grid/tui-grid.min.js
/api/notices
```

---

## 18. 개발 검증 체크리스트

코드 변경 후 다음 순서로 확인하는 것을 권장합니다.

```bash
# 1. JavaScript 정적 검사
oxlint --deny-warnings src/main/resources/static/js design/kops-full-structure.js

# 2. 백엔드 테스트
mvn test

# 3. 패키징
mvn -DskipTests package

# 4. 실행
./run.sh

# 5. HTTP 확인
curl -f http://127.0.0.1:8080/ >/dev/null
curl -f 'http://127.0.0.1:8080/api/notices?page=1&size=3'
```

---

## 19. Git 작업 예시

```bash
git checkout -b feature/my-change
git add .
git commit -m "Add KOPS feature"
git push -u origin feature/my-change
```

`target/`, 로컬 환경 파일, 비밀번호, API 키 및 개인 테스트 자료는 커밋하지 마십시오.

---

## 20. 참고

- Repository: <https://github.com/jmodl4501/kopsUI_v1>
- 기본 서비스 URL: <http://localhost:8080>
- 기본 API URL: <http://localhost:8080/api/notices>
