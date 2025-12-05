package com.smart_restaurant.demo.exception;

import com.smart_restaurant.demo.dto.Response.ApiResponse;
import jakarta.mail.MessagingException;
import jakarta.validation.ConstraintViolation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.naming.AuthenticationException;
import java.util.Map;
import java.util.Objects;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final String MIN_ATTRIBUTE = "min";
    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ApiResponse> handlingRuntimeException(RuntimeException exception){
        ApiResponse apiResponse=new ApiResponse<>();
        apiResponse.setCode("1111");
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingRuntimeException(AppException exception) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(exception.getErrorCode().getCode());
        apiResponse.setMessage(exception.getErrorCode().getMessage());
        return ResponseEntity.status(exception.getErrorCode().getHttpStatusCode()).body(apiResponse);
    }
    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse> handlingAccessDeniedException(AccessDeniedException exception) {
        ApiResponse apiResponse = new ApiResponse();
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getHttpStatusCode()).body(apiResponse);
    }
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse> handleAuthenticationException(AuthenticationException ex) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode("401");
        apiResponse.setMessage(ex.getMessage());
        return ResponseEntity.status(401).body(apiResponse);
    }
    @ExceptionHandler(MessagingException.class)
    public ResponseEntity<ApiResponse> handleMessagingException(MessagingException ex) {
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setCode("1112");
        apiResponse.setMessage("Failed to send confirmation email. Please try again later.");
        return ResponseEntity.status(500).body(apiResponse);
    }
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handlingNotValidException(MethodArgumentNotValidException exception){
        String enumKey=exception.getFieldError().getDefaultMessage();
        ErrorCode errorCode=ErrorCode.INVALID_KEY;
        Map<String, Objects> atribute=null;
        errorCode=ErrorCode.valueOf(enumKey);
        var constrainViolation=exception.getBindingResult().getAllErrors().getFirst().unwrap(ConstraintViolation.class);
        atribute=constrainViolation.getConstraintDescriptor().getAttributes();
        ApiResponse apiResponse=new ApiResponse();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(Objects.nonNull(atribute)
                ?mapAttribute(errorCode.getMessage(),atribute)
                :errorCode.getMessage());
        return ResponseEntity.status(errorCode.getHttpStatusCode()).body(apiResponse);
    }
    private String mapAttribute(String message, Map<String, Objects> attributes) {
        String minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));

        return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);
    }

}
