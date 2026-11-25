package kr.go.kops.notice;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

public interface NoticeMapper {
  List<Notice> selectNotices(@Param("keyword") String keyword,
                             @Param("size") int size,
                             @Param("offset") int offset);
  int selectNoticeCount(@Param("keyword") String keyword);
  Notice selectNotice(@Param("id") Long id);
  int insertNotice(Notice notice);
  int updateNotice(Notice notice);
  int deleteNotice(@Param("id") Long id);
}
