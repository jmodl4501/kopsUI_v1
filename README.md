# eGovFrame 5.0 Portal

- eGovFrame 5.0.2 parent (Spring Boot 3.5.6)
- Java 21 runtime, Java 17 compile target
- MyBatis + MariaDB 11.8
- Static UI: `src/main/resources/static` (no frontend build server)
- API: `/api/notices` (`contents`, `pagination`)

## Run

```sh
sudo systemctl start mariadb
mvn -DskipTests package
./run.sh
```

DB credentials are loaded from `/etc/egovframe/portal.env`.
Maven build heap: `-Xmx512m` (`.mvn/jvm.config`).
Application heap: `-Xmx512m` (`run.sh`).

## UI (Step 3)

- Full KOPS design: `design/kops-full.op` (526 nodes, generated from `design/kops-full-structure.js`)
- Static SPA: `static/index.html`, `static/css/tailwind.css`, `static/css/portal.css`
- Screen registry/router: `static/js/kops-config.js`, `static/js/kops-app.js` (75 routes across `opa`–`opf`)
- Sanitized test-case data: `static/data/kops-datasets.json`
- Grid: TOAST UI Grid 4.21 + date/time picker + pagination in `static/vendor/tui-grid/`
- Lint: `oxlint --deny-warnings src/main/resources/static/js design/kops-full-structure.js`
