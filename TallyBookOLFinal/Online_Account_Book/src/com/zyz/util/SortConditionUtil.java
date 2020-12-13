package com.zyz.util;

public class SortConditionUtil {
    public static String formatCondition (String sort_type) {
        String condition = null;
        switch  (sort_type) {
            case "0":
                condition = "time desc";
                break;
            case "1":
                condition = "time asc";
                break;
            case "2":
                condition = "amount asc";
                break;
            case "3":
                condition = "amount desc";
                break;
            default:
                condition = "id desc";
        }
        return condition;
    }
}
