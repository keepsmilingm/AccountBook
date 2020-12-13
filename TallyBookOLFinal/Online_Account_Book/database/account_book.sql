DROP DATABASE
IF
	EXISTS account_book;
CREATE DATABASE account_book CHARACTER 
SET utf8;
USE account_book;
CREATE TABLE bills ( id INT PRIMARY KEY auto_increment, time TIMESTAMP, amount BIGINT, type VARCHAR ( 20 ) NULL, memo VARCHAR ( 200 ) );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-20 23:09:24', 800000, NULL, '发工资啦啊' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-20 22:53:55', - 55800, '饮食', '开开心心充饭卡啊' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-20 20:32:35', - 12000, '学习', '买个书包背书用' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-21 13:13:19', 20000, NULL, '说出来你可能不信，' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-26 00:26:20', - 58000, '学习', '买个小显示器用一下，方便敲代码' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-20 21:56:43', - 100200, '其他', '被偷了~~~' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-20 22:58:37', - 25000, '日用', '喂猪了' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-21 13:28:47', - 2050, '日用', '交电费' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-21 14:32:40', - 60000, '其他', '扶了一个老奶奶' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-24 14:42:11', - 10000, '其他', '借给杜国龙' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-24 18:27:54', 800000, NULL, '老板发工资了' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-24 18:30:51', - 89550, '学习', '买了个键盘' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-24 18:40:04', 50000, NULL, '买彩票，小赚一笔' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-25 20:31:11', 12300, NULL, '加了搜索之后的第一条' );
INSERT INTO `bills`
VALUES
	( NULL, '2019-06-27 17:32:11', -30000, '交通', '违章停车' );
	INSERT INTO `bills`
VALUES
	( NULL, '2019-06-27 17:32:11', -60000, '娱乐', '酒吧泡泡妹子' );