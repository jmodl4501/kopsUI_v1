package kr.go.kops.db;

import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

/** MyBatis mapper for the KOPS form tables (snake_case columns). */
public interface ReportMapper {

  List<Map<String, Object>> selectForms(@Param("formTyCd") String formTyCd);

  List<Map<String, Object>> selectMenus();

  List<Map<String, Object>> selectUriBaselines();

  List<Map<String, Object>> selectCommonCodes(@Param("codeGroup") String codeGroup);
}
