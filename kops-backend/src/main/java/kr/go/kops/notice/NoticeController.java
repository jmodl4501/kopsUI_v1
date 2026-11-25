package kr.go.kops.notice;

import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

  private final NoticeService service;

  public NoticeController(NoticeService service) {
    this.service = service;
  }

  @GetMapping
  public Map<String, Object> list(
      @RequestParam(required = false) String keyword,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size) {
    return service.list(keyword, page, size);
  }

  @GetMapping("/{id}")
  public Notice detail(@PathVariable Long id) {
    Notice notice = service.detail(id);
    if (notice == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "notice not found");
    }
    return notice;
  }

  @PostMapping
  public Notice create(@Valid @RequestBody Notice notice) {
    return service.create(notice);
  }

  @PutMapping("/{id}")
  public Notice update(@PathVariable Long id, @Valid @RequestBody Notice notice) {
    return service.update(id, notice);
  }

  @DeleteMapping("/{id}")
  public Map<String, Boolean> delete(@PathVariable Long id) {
    return Map.of("deleted", service.delete(id));
  }
}
