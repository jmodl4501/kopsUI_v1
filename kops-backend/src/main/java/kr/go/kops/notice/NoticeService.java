package kr.go.kops.notice;

import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NoticeService {

  private final NoticeMapper mapper;

  public NoticeService(NoticeMapper mapper) {
    this.mapper = mapper;
  }

  public Map<String, Object> list(String keyword, int page, int size) {
    int safePage = Math.max(1, page);
    int safeSize = Math.min(100, Math.max(1, size));
    int total = mapper.selectNoticeCount(keyword == null ? "" : keyword);
    List<Notice> items = mapper.selectNotices(
        keyword == null ? "" : keyword, safeSize, (safePage - 1) * safeSize);
    return Map.of("total", total, "page", safePage, "size", safeSize, "items", items);
  }

  public Notice detail(Long id) {
    return mapper.selectNotice(id);
  }

  @Transactional
  public Notice create(Notice notice) {
    mapper.insertNotice(notice);
    return notice;
  }

  @Transactional
  public Notice update(Long id, Notice notice) {
    notice.setId(id);
    mapper.updateNotice(notice);
    return mapper.selectNotice(id);
  }

  @Transactional
  public boolean delete(Long id) {
    return mapper.deleteNotice(id) > 0;
  }
}
