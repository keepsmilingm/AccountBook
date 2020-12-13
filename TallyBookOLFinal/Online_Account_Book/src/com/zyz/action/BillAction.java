package com.zyz.action;

import com.bailey.web.lighter.action.ActionResult;
import com.bailey.web.lighter.action.ActionSupport;
import com.bailey.web.lighter.annotation.Inject;
import com.bailey.web.lighter.annotation.Param;
import com.bailey.web.lighter.annotation.Request;
import com.zyz.dao.AccountBookDAO;
import com.zyz.util.SortConditionUtil;
import com.zyz.vo.Bill;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

import static com.zyz.util.SortConditionUtil.formatCondition;

public class BillAction extends ActionSupport {
    
    @Request(url = "/getBills")
    public ActionResult getBills(@Inject AccountBookDAO dao) {

        try {

            // ActionResult.success() 方法将账单数据封装为 JSON 字符串
            return ActionResult.success(dao.queryBills());
        } catch (Exception e) {

            e.printStackTrace();

            return ActionResult.failure();
        }
    }

    @Request(url = "/addOrDeleteBill")
    public ActionResult addOrDeleteBill(
            @Inject AccountBookDAO dao,
            @Param(name = "action") String action,
            @Param(name = "bill") Bill bill) {

        try {
            switch (action) {
                case "append":


                    bill = dao.saveBill(bill);
                    break;
                case "remove":

                    dao.removeBill(bill);
                    break;
            }
            // 将保存后的账单数据打包成 JSON 字符串返回前端
            // 注意这里必须把保存后的账单信息带回前端
            // 因为对于新增账单而言, 账单的 ID 和时间是在服务器端生成的
            return ActionResult.success(bill);
        } catch (Exception e) {

            return ActionResult.failure();
        }
    }

    @Request(url = "/modifyBill")
    public ActionResult modifyBill (
        @Inject AccountBookDAO dao,
        @Param(name = "id") String idStr,
        @Param(name = "amount") String amountStr,
        @Param(name = "memo") String memo,
        @Param(name = "type") String type) {

        int id = 0;
        Long amount = 0l;

        try {
            id = Integer.parseInt(idStr);
            amount = Long.parseLong(amountStr);
        }catch (Exception e) {
            e.printStackTrace();
        }
        Timestamp now = new Timestamp(System.currentTimeMillis());

        Bill bill = new Bill();
        bill.setId(new Integer(id));
        bill.setAmount(amount);
        bill.setType(type);
        bill.setMemo(memo);
        bill.setTime(now);

        try {
            dao.updateBill(bill);

            List<Bill> bills = dao.queryBills();
            return ActionResult.success(bills);
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
            return null;
    }

    @Request(url = "/getBill")
    public ActionResult getBill (
            @Inject AccountBookDAO dao,
            @Param(name = "id") String idStr) {

        int id = 0;

        try {
            id = Integer.parseInt(idStr);
        }catch (Exception e) {
            e.printStackTrace();
        }

        Bill bill = dao.getBillById(id);

        return ActionResult.success(bill);
    }

    @Request(url = "/searchBills")
    public ActionResult searchBills(
            @Inject AccountBookDAO dao,
            @Param(name = "searchContext") String searchContext,
            @Param(name = "flag") String flag,
            @Param(name = "sort_type") String sort_type) {

            String condition = formatCondition(sort_type);

            try {
                if (flag.equals("1"))
                    return ActionResult.success(dao.searchBills(searchContext,condition));
                if (flag.equals("0"))
                    return ActionResult.success(dao.queryBills(condition));
            }catch (Exception e) {
                e.printStackTrace();
            }
        return null;
    }

    @Request(url = "/onlySeeIn1")
    public ActionResult onlySeeIn (
            @Inject AccountBookDAO dao,
            @Param(name = "sort_type") String sort_type) {

        String condition = SortConditionUtil.formatCondition(sort_type);

        try {
            return ActionResult.success(dao.onlySeeOne(0,condition));
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        return null;
    }

    @Request(url = "/onlySeeOut1")
    public ActionResult onlySeeOut (
            @Inject AccountBookDAO dao,
            @Param(name = "sort_type") String sort_type) {

        String condition = SortConditionUtil.formatCondition(sort_type);
        try {
            return ActionResult.success(dao.onlySeeOne(1,condition));
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        return null;
    }

    @Request(url = "/queryByType")
    public ActionResult queryByType (
            @Inject AccountBookDAO dao,
            @Param (name = "type") String type) {

        try {
            List<Bill> bills = dao.queryBillsByType(type);

            return ActionResult.success(bills);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    /*@Request(url = "/sort1")
    public ActionResult sortBills (
            @Inject AccountBookDAO dao,
            @Param(name = "sort_type") String sort_type,
            @Param(name = "oldBills") String oldBillsStr) {

        String condition = formatCondition(sort_type);

        System.out.println(oldBillsStr);
        System.out.println(oldBillsStr.substring(0,3));

//        List<Bill> bills = dao.queryBillsByCondition(condition);

//        return ActionResult.success(bills);
        return null;
    }*/

}
