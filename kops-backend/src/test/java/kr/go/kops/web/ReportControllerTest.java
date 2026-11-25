package kr.go.kops.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {
    "DB_URL=jdbc:mariadb://127.0.0.1:3306/kops?useUnicode=true&characterEncoding=utf8",
    "DB_USERNAME=kops",
    "DB_PASSWORD=kops1234"
})
@AutoConfigureMockMvc
class ReportControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void menuMasterHas84Rows() throws Exception {
    mockMvc.perform(get("/api/menus"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.source").value("mariadb"))
        .andExpect(jsonPath("$.count").value(84));
  }

  @Test
  void formSampleOffrIsSnakeCaseInDb() throws Exception {
    mockMvc.perform(get("/api/forms/S10"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.source").value("mariadb"))
        .andExpect(jsonPath("$.forms[0].smit_year").value("2025"))
        .andExpect(jsonPath("$.forms[0].yadm_nm").exists());
  }

  @Test
  void uriBaselinesSeeded() throws Exception {
    mockMvc.perform(get("/api/uri-baselines"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.source").value("mariadb"))
        .andExpect(jsonPath("$.count").value(456));
  }
}
