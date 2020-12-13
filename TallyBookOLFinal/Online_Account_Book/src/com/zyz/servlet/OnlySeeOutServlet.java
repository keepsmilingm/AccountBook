package com.zyz.servlet;

import com.alibaba.fastjson.JSON;
import com.zyz.dao.AccountBookDAO;
import com.zyz.util.SortConditionUtil;
import com.zyz.vo.Bill;
import com.zyz.util.ParseUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/onlySeeOut")
public class OnlySeeOutServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin","*");
        resp.setContentType("text/xml;charset=utf-8");

        PrintWriter out = resp.getWriter();

        String sort_type = req.getParameter("sort_type");
        String oldBills = req.getParameter("oldBills");

        System.out.println(oldBills);

        int []ids = ParseUtil.parseArray(oldBills);

        for (int i = 0; i < ids.length; i ++) {
            System.out.print(ids[i]);
        }

        String condition = SortConditionUtil.formatCondition(sort_type);

        List<Bill> bills = null;
        try {
            bills = new AccountBookDAO().onlySeeOne(1,condition,ids);
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        out.write(JSON.toJSONString(bills));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req,resp);
    }
}
