package com.zyz.dao;

import com.zyz.util.DBUtil;
import com.zyz.vo.Bill;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AccountBookDAO {
    public List<Bill> queryBills() throws SQLException, ClassNotFoundException {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<Bill> bills = new ArrayList<>();
        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery("select * from bills order by time desc;");

            while (rs.next()) {
                bills.add(packBill(rs));
            }
        } finally {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }
        // 返回查询结果
        return bills;
    }

    public List<Bill> queryBills(String sortType) throws SQLException, ClassNotFoundException {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<Bill> bills = new ArrayList<>();
        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery("select * from bills order by " + sortType);

            while (rs.next()) {
                bills.add(packBill(rs));
            }
        } finally {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }
        // 返回查询结果
        return bills;
    }

    public List<Bill> onlySeeOne(int one,String sortType) throws SQLException, ClassNotFoundException {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<Bill> bills = new ArrayList<>();
        String sql = "select * from bills where amount ";

        if (one == 0)
            sql += " > 0";
        else
            sql += " < 0";

        sql += " order by " + sortType;


        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                bills.add(packBill(rs));
            }
        } finally {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }
        // 返回查询结果
        return bills;
    }

    public List<Bill> onlySeeOne(int one,String sortType,int [] ids) throws SQLException, ClassNotFoundException {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<Bill> bills = new ArrayList<>();
        String sql = "select * from bills where amount ";

        if (one == 0)
            sql += " > 0";
        else
            sql += " < 0";

        String sqlWhere = "";

        for (int i = 0; i < ids.length; i ++) {
            if (i == ids.length - 1)
                sqlWhere += ids[i];
            else
                sqlWhere += ids[i] + ",";
        }

        sql += " and id in (" + sqlWhere + ")";
        sql += " order by " + sortType;


        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                bills.add(packBill(rs));
            }
        } finally {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }
        // 返回查询结果
        return bills;
    }

    public List<Bill> searchBills(String searchContext,String condition) throws SQLException, ClassNotFoundException {
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<Bill> bills = new ArrayList<>();
        try {
            conn = DBUtil.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery("select * from bills where memo like '%" + searchContext + "%' order by " + condition);

            while (rs.next()) {
                bills.add(packBill(rs));
            }
        } finally {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }
        // 返回查询结果
        return bills;
    }

    public List<Bill> queryBillsByCondition (String condition,int [] ids) {
        List<Bill> bills = new ArrayList<>();

        Connection conn= null;
        PreparedStatement pstm = null;
        ResultSet rs = null;
        String sql = "select * from bills where ";
        String sqlWhere = "";

        for (int i = 0; i < ids.length; i ++) {
            if (i == ids.length - 1)
                sqlWhere += ids[i];
            else
                sqlWhere += ids[i] + ",";
        }
        sql += "id in (" + sqlWhere + ")";
//        for (int i = 0; i < ids.length; i ++) {
//            if (i == ids.length-1) {
//                sql += " id = " + ids[i];
//            }else {
//                sql += " id = " + ids[i] + " or";
//            }
//        }

        try {
            conn = DBUtil.getConnection();
            sql += " order by " + condition;
            System.out.println(sql);
            pstm = conn.prepareStatement(sql);

            rs = pstm.executeQuery();

            while (rs.next()) {
                bills.add(packBill(rs));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (pstm != null) pstm.close();
                if (conn != null) conn.close();
            }catch (Exception e) {
                e.printStackTrace();
            }

        }

        return bills;
    }

    public List<Bill> queryBillsByType (String type) throws Exception {
        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;
        List<Bill> bills = new ArrayList<>();

        try {

            conn = DBUtil.getConnection();
            String sql = "select * from bills where type = ?";

            pstm = conn.prepareStatement(sql);
            pstm.setString(1, type);
            rs = pstm.executeQuery();

            while (rs.next()) {
                bills.add(packBill(rs));
            }
        } finally {
            if (rs != null) rs.close();
            if (pstm != null) pstm.close();
            if (conn != null) conn.close();
        }
        return bills;
    }

    public Bill getBillById (int id) {

        Bill bill = new Bill();

        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;

        try {
            conn = DBUtil.getConnection();
            String sql = "select * from bills where id = ?";
            pstm = conn.prepareStatement(sql);
            pstm.setInt(1,id);

            rs = pstm.executeQuery();

            while (rs.next()) {
                Long amount = rs.getLong("amount");
                Timestamp time = rs.getTimestamp("time");
                String type = rs.getString("type");
                String memo = rs.getString("memo");

                bill.setId(id);
                bill.setAmount(amount);
                bill.setType(type);
                bill.setTime(time);
                bill.setMemo(memo);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return bill;
    }

    public Bill saveBill(Bill bill) throws SQLException, ClassNotFoundException {
        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;
        try {
            // 获得数据库连接对象, 参见 Code-13.2 第 19 ~ 22 行
            conn = DBUtil.getConnection();
            String sql = "insert into bills(time, amount, type, memo) values (?, ?, ?, ?)";

            // 这里使用了 PreparedStatement, 支持参数占位符"?", 与第 24 行对比一下
            // Statement.RETURN_GENERATED_KEYS 参数要求 insert 执行成功后返回此记录的主键字段值
            // 对照第12节, 建表的 SQL 语句中ID字段是"自增长"型(AUTO_INCREMENT)
            pstm = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            // 取得服务器当前系统时间
            // 若要保存的信息同时含日期和时间, 必须使用 Timestamp
            Timestamp now = new Timestamp(System.currentTimeMillis());

            // 设置 PreparedStatement 的参数, 即 SQL 语句中的那些"?"
            // 注意在 JDBC 中, 第 1 个参数序号是 1, 而不是 0
            pstm.setTimestamp(1, now);
            pstm.setLong(2, bill.getAmount());
            pstm.setString(3,bill.getType());
            pstm.setString(4, bill.getMemo());

            // 执行数据库更新, 将账单数据保存到数据库
            pstm.executeUpdate();

            // 获得数据库端生成的主键值
            rs = pstm.getGeneratedKeys();
            if (rs.next()) {
                // 将主键值和账单时间写入账单数据对象
                // 以保持数据模型与数据库中实际存储的数据一致
                bill.setId(rs.getInt(1));
                bill.setTime(now);
            } else {
                throw new SQLException("新增数据失败");
            }

        } finally {
            if (rs != null) rs.close();
            if (pstm != null) pstm.close();
            if (conn != null) conn.close();
        }
        return bill;
    }

    /**
     * 删除账单
     */
    public void removeBill(Bill bill) throws SQLException, ClassNotFoundException {
        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;

        try {
            conn = DBUtil.getConnection();
            String sql = "delete from bills where id = ?";
            pstm = conn.prepareStatement(sql);
            pstm.setInt(1, bill.getId());
            pstm.execute();
        } finally {
            if (pstm != null) pstm.close();
            if (conn != null) conn.close();
        }
    }

    /**
     * 修改账单
     * @param bill -- 账单对象
     * @throws SQLException
     * @throws ClassNotFoundException
     */
    public void updateBill (Bill bill) throws SQLException,ClassNotFoundException {
        Connection conn = null;
        PreparedStatement pstm = null;

        try {
            conn = DBUtil.getConnection();
            String sql = "update bills set time = ?,amount = ?,type = ?,memo = ? where id = ?";
            pstm = conn.prepareCall(sql);
            pstm.setTimestamp(1, (Timestamp) bill.getTime());
            pstm.setLong(2,bill.getAmount());
            pstm.setString(3,bill.getType());
            pstm.setString(4,bill.getMemo());
            pstm.setInt(5,bill.getId());

            pstm.executeUpdate();

        }finally {
            if (pstm != null) pstm.close();
            if (conn != null) conn.close();
        }
    }

    private Bill packBill(ResultSet rs) throws SQLException {
        Bill bill = new Bill();
        bill.setId(rs.getInt("id"));
        bill.setTime(rs.getTimestamp("time"));
        bill.setAmount(rs.getLong("amount"));
        bill.setType(rs.getString("type"));
        bill.setMemo(rs.getString("memo"));
        return bill;
    }
}
