package cn.apisium.ems.data;

public record Result<T>(T data, String error) {
    public static <T> Result<T> success(T data) {
        return new Result<>(data, null);
    }

    public static <T> Result<T> error(String error) {
        return new Result<>(null, error);
    }
}
