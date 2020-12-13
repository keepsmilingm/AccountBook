package com.zyz.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;

public class ParseUtil {

    public static int [] parseArray (String oldBills) {
        JSONArray array = JSON.parseArray(oldBills);

        int [] ids = new int[array.size()];

        for (int i = 0; i < array.size(); i ++) {
            ids[i] = Integer.parseInt(array.get(i).toString());
        }

        return ids;
    }
}
