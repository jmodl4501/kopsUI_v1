package kr.go.kops.web;

import java.util.Map;
import kr.go.kops.config.SampleDataStore;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

  private final SampleDataStore store;

  public HealthController(SampleDataStore store) {
    this.store = store;
  }

  @GetMapping("/api/health")
  public Map<String, Object> health() {
    return Map.of(
        "status", "UP",
        "system", "KOPS eGovFrame 5.0 backend",
        "datasetCount", store.size());
  }
}
