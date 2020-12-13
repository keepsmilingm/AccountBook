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
import java.util.List;

@WebServlet("/sort")
public class SortServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        resp.setHeader("Access-Control-Allow-Origin","*");
        resp.setContentType("text/xml;charset=utf-8");

        PrintWriter out = resp.getWriter();

        String oldBills = req.getParameter("oldBills");

        int [] ids = ParseUtil.parseArray(oldBills);

        String condition = SortConditionUtil.formatCondition(req.getParameter("sort_type"));

        List<Bill> bills = new AccountBookDAO().queryBillsByCondition(condition,ids);

        out.write(JSON.toJSONString(bills));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req,resp);
    }
}
