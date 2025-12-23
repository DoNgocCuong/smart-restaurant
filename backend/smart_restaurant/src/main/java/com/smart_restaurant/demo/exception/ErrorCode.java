package com.smart_restaurant.demo.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    UNAUTHENTICATED ("1001","UNAUTHENTICATED", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("1002", "You do not have permission", HttpStatus.FORBIDDEN),
    ACCOUNT_NOT_EXITS("1003","user not exist", HttpStatus.BAD_REQUEST),
    TENANT_NOT_FOUND("1012", "User does not belong to any tenant", HttpStatus.FORBIDDEN),
    CATEGORY_ALREADY_EXISTS_FOR_TENANT("1013", "Category already exists for this tenant", HttpStatus.CONFLICT),
    ACCOUNT_EXISTED("1004","email existed", HttpStatus.BAD_REQUEST),
    OUT_OF_TIME("1005","Timed out to confirm email", HttpStatus.BAD_REQUEST),
    WRONG_TYPE("1006","wrong type", HttpStatus.BAD_REQUEST),
    WRONG_TOKEN("1007","Invalid token cannot be authenticated", HttpStatus.BAD_REQUEST),
    JWT_ERROR("1008","Failed to generate email token",HttpStatus.BAD_REQUEST),
    INVALID_KEY("1009", "Uncategorized error", HttpStatus.BAD_REQUEST),
    NOT_ENOUGHT_CHARACTER_PASSWORD("1010","Your password is less than {min} characters. Your password must be longer than {min} characters.", HttpStatus.BAD_REQUEST),
    NOT_EMAIL("1011","wrong type email", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND("1018", "Category not found", HttpStatus.BAD_REQUEST),
    ITEM_ALREADY_EXISTS("1019", "Item already exists", HttpStatus.BAD_REQUEST),
    TENANT_EXISTED("1020", "Each account can only register 1 restaurant.", HttpStatus.BAD_REQUEST),
    NOT_VERIFY_EMAIL("1021", "unverified email.", HttpStatus.BAD_REQUEST),
    MODIFIER_GROUP_NOT_FOUND("1022", "modifier group not found", HttpStatus.BAD_REQUEST),
    ITEM_NOT_FOUND("1023", "item not found", HttpStatus.BAD_REQUEST),
    MODIFIER_GROUP_ALREADY_EXISTS_FOR_TENANT("1024", "MODIFIER GROUP already exists for this tenant", HttpStatus.BAD_REQUEST),
  

    TABLE_NOT_FOUND("1027", "NOT_FOUND", HttpStatus.BAD_REQUEST),
    TABLE_NOT_BELONGS_TO_TENANT("1028", "TABLE_NOT_BELONGS_TO_TENANT", HttpStatus.BAD_REQUEST),

    TABLE_ALREADY_EXISTS("1025", "table name already exists", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN_FORMAT("1026", "Invalid token format", HttpStatus.BAD_REQUEST),


    FOBIDEN("1027","forbidden" , HttpStatus.BAD_REQUEST),
    QR_NOT_EXIST("1028","qr not exist",HttpStatus.BAD_REQUEST),
    USER_EXISTED("1029","USER_EXISTED",HttpStatus.BAD_REQUEST),
    ACCOUNT_NOT_FOUND("1030", "ACCOUNT_NOT_FOUND", HttpStatus.BAD_REQUEST),
    INVALID_ROLE("1031", "INVALID_ROLE", HttpStatus.BAD_REQUEST),
    MODIFIER_GROUP_IN_USE("1032", "MODIFIER_GROUP_IN_USE", HttpStatus.BAD_REQUEST),
    AVARTAR_NOT_DELETE("1036","Unable to delete profile picture",HttpStatus.BAD_REQUEST),
    USER_NAME_PASSWORD_NOT_NULL("1037","username or password not null",HttpStatus.BAD_REQUEST),

    MODIFIER_OPTION_ALREADY_EXISTS("1035","MODIFIER_OPTION_ALREADY_EXISTS", HttpStatus.BAD_REQUEST),
    MODIFIER_OPTION_NOT_IN_TENANT("1034", "MODIFIER_OPTION_NOT_IN_TENANT", HttpStatus.BAD_REQUEST);

    ErrorCode(String code, String message, HttpStatus httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode= httpStatusCode;
    }
    private final String code;
    private  final String message;
    private HttpStatusCode httpStatusCode;
}
