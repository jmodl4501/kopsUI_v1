package kr.go.egovportal.common;

import java.util.List;

public record PageResponse<T>(List<T> contents, Pagination pagination) {
}
