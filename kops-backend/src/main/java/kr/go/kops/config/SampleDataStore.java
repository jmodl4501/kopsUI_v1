package kr.go.kops.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

/**
 * Non-identifying KOPS sample dataset (59 URI baselines) bundled with the
 * backend. It lets the UI and Playwright cases run before MariaDB is seeded,
 * and is replaced by MyBatis queries as the DB layer comes online.
 */
@Component
public class SampleDataStore {

  private final Map<String, Object> datasets;

  public SampleDataStore(ObjectMapper objectMapper) {
    Map<String, Object> loaded;
    try (InputStream stream = getClass().getResourceAsStream("/data/kops-datasets.json")) {
      loaded = stream == null
          ? Collections.emptyMap()
          : objectMapper.readValue(stream, new TypeReference<>() {});
    } catch (Exception exception) {
      loaded = Collections.emptyMap();
    }
    this.datasets = Collections.unmodifiableMap(loaded);
  }

  public Map<String, Object> find(String slug) {
    Object value = datasets.get(slug);
    if (value instanceof Map<?, ?> map) {
      @SuppressWarnings("unchecked")
      Map<String, Object> typed = (Map<String, Object>) map;
      return typed;
    }
    return Collections.emptyMap();
  }

  public boolean exists(String slug) {
    return datasets.containsKey(slug);
  }

  public int size() {
    return datasets.size();
  }

  public List<Object> firstList(String slug) {
    for (Object value : find(slug).values()) {
      if (value instanceof List<?> list) {
        @SuppressWarnings("unchecked")
        List<Object> typed = (List<Object>) list;
        return typed;
      }
    }
    return Collections.emptyList();
  }
}
