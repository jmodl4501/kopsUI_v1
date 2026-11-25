package kr.go.kops;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan({"kr.go.kops.notice", "kr.go.kops.db"})
public class KopsBackendApplication {

  public static void main(String[] args) {
    SpringApplication.run(KopsBackendApplication.class, args);
  }
}
