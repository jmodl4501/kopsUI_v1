package kr.go.egovportal.notice;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface NoticeMapper {
    List<Notice> selectNotices(@Param("keyword") String keyword, @Param("offset") int offset, @Param("size") int size);
    int selectNoticeCount(@Param("keyword") String keyword);
    Notice selectNotice(@Param("id") Long id);
    int insertNotice(Notice notice);
    int updateNotice(Notice notice);
    int deleteNotice(@Param("id") Long id);
}
