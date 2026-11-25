package kr.go.kops.db;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

/** DB access with an offline fallback so the API still starts without MariaDB. */
@Service
public class ReportService {

  private final ReportMapper mapper;

  public ReportService(ReportMapper mapper) {
    this.mapper = mapper;
  }

  public Map<String, Object> forms(String formTyCd) {
    return safeQuery(() -> mapper.selectForms(formTyCd), "forms");
  }

  public Map<String, Object> menus() {
    return safeQuery(mapper::selectMenus, "menus");
  }

  public Map<String, Object> uriBaselines() {
    return safeQuery(mapper::selectUriBaselines, "uri_baselines");
  }

  public Map<String, Object> commonCodes(String group) {
    return safeQuery(() -> mapper.selectCommonCodes(group), "common_codes");
  }

  private Map<String, Object> safeQuery(java.util.function.Supplier<List<Map<String, Object>>> query,
                                        String name) {
    try {
      List<Map<String, Object>> rows = query.get();
      Map<String, Object> result = new LinkedHashMap<>();
      result.put("source", "mariadb");
      result.put("count", rows.size());
      result.put(name, rows);
      return result;
    } catch (Exception exception) {
      Map<String, Object> result = new LinkedHashMap<>();
      result.put("source", "offline");
      result.put("count", 0);
      result.put(name, Collections.emptyList());
      result.put("error", exception.getClass().getSimpleName());
      return result;
    }
  }
}
