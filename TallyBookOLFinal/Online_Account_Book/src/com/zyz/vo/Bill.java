package com.zyz.vo;

import com.alibaba.fastjson.annotation.JSONField;

import java.util.Date;

public class Bill {

    @JSONField(name = "id")
    private Integer id;     //账单ID
    @JSONField(name = "time")
    private Date time;      //记账时间
    @JSONField(name = "amount")
    private Long amount;    //金额
    @JSONField(name = "type")
    private String type;
    @JSONField(name = "memo")
    private String memo;    //备注

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }
}
