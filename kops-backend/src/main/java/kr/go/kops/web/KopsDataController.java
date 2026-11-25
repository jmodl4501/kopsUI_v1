package kr.go.kops.web;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import kr.go.kops.config.SampleDataStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Serves every URI observed in the 84 menu test cases:
 *   /kops/main/{op|api}/{opa|opb|opc|opd|ope|opf}/{slug}.ndo|.do
 */
@RestController
@RequestMapping("/kops/main")
public class KopsDataController {

  private final SampleDataStore store;

  public KopsDataController(SampleDataStore store) {
    this.store = store;
  }

  @GetMapping({"/{group}/{sub}/{slug:.+}", "/{slug:.+}"})
  public ResponseEntity<Map<String, Object>> get(
      @PathVariable(required = false) String group,
      @PathVariable(required = false) String sub,
      @PathVariable String slug) {
    return response(group, sub, slug);
  }

  @PostMapping({"/{group}/{sub}/{slug:.+}", "/{slug:.+}"})
  public ResponseEntity<Map<String, Object>> post(
      @PathVariable(required = false) String group,
      @PathVariable(required = false) String sub,
      @PathVariable String slug) {
    return response(group, sub, slug);
  }

  private ResponseEntity<Map<String, Object>> response(String group, String sub, String slug) {
    List<Object> list = store.firstList(slug);
    Map<String, Object> result = new LinkedHashMap<>();
    result.put("rtnCode", "200");
    result.put("rtnText", "정상 처리되었습니다.");
    result.put("totCnt", String.valueOf(list.size()));
    result.put("list", list);

    Map<String, Object> body = new LinkedHashMap<>(store.find(slug));
    body.put("result", result);
    body.put("_source", store.exists(slug) ? "sample-dataset" : "empty-dataset");
    body.put("_uri", (group == null ? "" : group + "/")
        + (sub == null ? "" : sub + "/") + slug);
    return ResponseEntity.ok(body);
  }
}
