package kr.go.egovportal.notice;

import java.util.List;
import kr.go.egovportal.common.PageResponse;
import kr.go.egovportal.common.Pagination;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NoticeService {
    private final NoticeMapper mapper;

    public NoticeService(NoticeMapper mapper) {
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public PageResponse<Notice> list(int page, int size, String keyword) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(size, 1), 100);
        String safeKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();
        int totalCount = mapper.selectNoticeCount(safeKeyword);
        int totalPages = (totalCount + safeSize - 1) / safeSize;
        List<Notice> contents = mapper.selectNotices(safeKeyword, (safePage - 1) * safeSize, safeSize);
        return new PageResponse<>(contents, new Pagination(safePage, safeSize, totalCount, totalPages));
    }

    @Transactional(readOnly = true)
    public Notice get(Long id) {
        Notice notice = mapper.selectNotice(id);
        if (notice == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "notice not found: " + id);
        }
        return notice;
    }

    @Transactional
    public Notice create(Notice notice) {
        mapper.insertNotice(notice);
        return mapper.selectNotice(notice.getId());
    }

    @Transactional
    public Notice update(Long id, Notice notice) {
        get(id);
        notice.setId(id);
        mapper.updateNotice(notice);
        return mapper.selectNotice(id);
    }

    @Transactional
    public void delete(Long id) {
        get(id);
        mapper.deleteNotice(id);
    }
}
