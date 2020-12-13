package com.zyz.servlet;

import com.alibaba.fastjson.JSON;
import com.zyz.dao.AccountBookDAO;
import com.zyz.util.ParseUtil;
import com.zyz.util.SortConditionUtil;
import com.zyz.vo.Bill;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/onlySeeIn")
public class OnlySeeInServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin","*");
        resp.setContentType("text/xml;charset=utf-8");

        String oldBills = req.getParameter("oldBills");

        PrintWriter out = resp.getWriter();

        int [] ids = ParseUtil.parseArray(oldBills);

        String condition = SortConditionUtil.formatCondition(req.getParameter("sort_type"));

        List<Bill> bills = null;
        try {
            bills = new AccountBookDAO().onlySeeOne(0,condition,ids);
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
