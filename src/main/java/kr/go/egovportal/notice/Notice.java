package kr.go.egovportal.notice;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Notice {
    private Long id;

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    private String content;

    @NotBlank
    @Size(max = 50)
    private String writer;

    private int viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
