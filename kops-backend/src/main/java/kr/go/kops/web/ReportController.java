package kr.go.kops.web;

import java.util.Map;
import kr.go.kops.db.ReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ReportController {

  private final ReportService service;

  public ReportController(ReportService service) {
    this.service = service;
  }

  @GetMapping("/forms")
  public Map<String, Object> allForms() {
    return service.forms("S10");
  }

  @GetMapping("/forms/{formTyCd}")
  public Map<String, Object> forms(@PathVariable String formTyCd) {
    return service.forms(formTyCd);
  }

  @GetMapping("/menus")
  public Map<String, Object> menus() {
    return service.menus();
  }

  @GetMapping("/uri-baselines")
  public Map<String, Object> uriBaselines() {
    return service.uriBaselines();
  }

  @GetMapping("/common-codes/{group}")
  public Map<String, Object> commonCodes(@PathVariable String group) {
    return service.commonCodes(group);
  }
}
