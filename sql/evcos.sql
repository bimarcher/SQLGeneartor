-- 创建数据库 Electric Vehicle Charging Operate System
DROP SCHEMA IF EXISTS evcos;
CREATE SCHEMA evcos
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

-- 客户信息表
DROP TABLE IF EXISTS evcos.t_customer;
CREATE TABLE evcos.t_customer
(
  wm_id VARCHAR(30) NULL COMMENT '威马id',
  nickname VARCHAR(10) NULL COMMENT '昵称',
  realname VARCHAR(10) NULL COMMENT '真实姓名',
  avatar VARCHAR(256) NULL COMMENT '头像地址',
  gender VARCHAR(2) NULL COMMENT '性别',
  id_card_no VARCHAR(20) NULL COMMENT '身份证号',
  birthday DATE NULL COMMENT '生日',

  r_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '本条记录的唯一标识，主键',
  r_memo VARCHAR(100) NULL COMMENT '本条记录的备注',
  r_status INT(1) DEFAULT '1' NOT NULL COMMENT '本条记录的状态 0 无效 1 有效（默认值）其他待定义',
  r_create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的创建时间',
  r_create_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的创建人',
  r_modify_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的最后一次修改时间',
  r_modify_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的最后一次修改人',
  CONSTRAINT t_customer_r_id_uindex
  UNIQUE (r_id)
) COMMENT '客户信息表';
CREATE INDEX t_customer_wm_id_uindex ON evcos.t_customer (wm_id);

-- 驾驶信息表
DROP TABLE IF EXISTS evcos.t_customer_drive;
CREATE TABLE evcos.t_customer_drive
(
  wm_id VARCHAR(30) NULL COMMENT '威马id，关联t_customer.wm_id',
  c_id BIGINT NULL COMMENT '客户id，关联t_customer.r_id',
  c_realname VARCHAR(10) NULL COMMENT '客户真实姓名',
  vehicle_model VARCHAR(100) NULL COMMENT '车型',
  vehicle_plate VARCHAR(10) NULL COMMENT '车辆牌照号',
  vehicle_license_photo VARCHAR(256) NULL COMMENT '行车证图片',
  driving_license_photo VARCHAR(256) NULL COMMENT '驾驶证图片',

  r_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '本条记录的唯一标识，主键',
  r_memo VARCHAR(100) NULL COMMENT '本条记录的备注',
  r_status INT(1) DEFAULT '1' NOT NULL COMMENT '本条记录的状态 0 无效 1 有效（默认值）其他待定义',
  r_create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的创建时间',
  r_create_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的创建人',
  r_modify_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的最后一次修改时间',
  r_modify_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的最后一次修改人',
  CONSTRAINT t_customer_drive_r_id_uindex
  UNIQUE (r_id)
) COMMENT '驾驶信息表';
CREATE INDEX t_customer_drive_wm_id_uindex ON evcos.t_customer_drive (wm_id);

-- 客户登录账户表
DROP TABLE IF EXISTS evcos.t_login_account;
CREATE TABLE evcos.t_login_account
(
  wm_id VARCHAR(30) NULL COMMENT '威马id，关联t_customer.wm_id',
  c_id BIGINT NULL COMMENT '客户id，关联t_customer.r_id',
  type INT(1) NOT NULL COMMENT '账户类型：1 手机 ，2 邮箱',
  login_account VARCHAR(100) NOT NULL COMMENT '账户名',
  password VARCHAR(255) NOT NULL COMMENT '密码',
  salt VARCHAR(255) NOT NULL COMMENT '盐值',

  r_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '本条记录的唯一标识，主键',
  r_memo VARCHAR(100) NULL COMMENT '本条记录的备注',
  r_status INT(1) DEFAULT '1' NOT NULL COMMENT '本条记录的状态 0 无效 1 有效（默认值）其他待定义',
  r_create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的创建时间',
  r_create_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的创建人',
  r_modify_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的最后一次修改时间',
  r_modify_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的最后一次修改人',
  CONSTRAINT t_login_account_r_id_uindex
  UNIQUE (r_id)
) COMMENT '客户登录账户表';
CREATE INDEX t_login_account_login_account_uindex ON evcos.t_login_account (login_account);

-- 客户预存账户表
DROP TABLE IF EXISTS evcos.t_customer_deposit_account;
CREATE TABLE evcos.t_customer_deposit_account
(
  wm_id VARCHAR(30) NULL COMMENT '威马id，关联t_customer.wm_id',
  c_id BIGINT NULL COMMENT '客户id，关联t_customer.r_id',
  pay_amount DECIMAL(20,2) NULL COMMENT '实际充值账户金额',
  present_amount DECIMAL(20,2) NULL COMMENT '赠送账户金额',
  arrearage_amount DECIMAL(20,2) NULL COMMENT '欠费账户金额',

  r_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '本条记录的唯一标识，主键',
  r_memo VARCHAR(100) NULL COMMENT '本条记录的备注',
  r_status INT(1) DEFAULT '1' NOT NULL COMMENT '本条记录的状态 0 无效 1 有效（默认值）其他待定义',
  r_create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的创建时间',
  r_create_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的创建人',
  r_modify_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的最后一次修改时间',
  r_modify_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的最后一次修改人',
  CONSTRAINT t_customer_deposit_account_r_id_uindex
  UNIQUE (r_id)
) COMMENT '客户预存账户表';
CREATE INDEX t_customer_deposit_account_wm_id_uindex ON evcos.t_customer_deposit_account (wm_id);

-- 充值增费活动
DROP TABLE IF EXISTS evcos.t_deposit_promotion;
CREATE TABLE evcos.t_deposit_promotion
(
  code VARCHAR(10) NOT NULL COMMENT '活动代码',
  rule TEXT NOT NULL COMMENT '活动规则，格式如 充值金额1:赠送金额1;充值金额2:赠送金额2',
  title VARCHAR(100) NOT NULL COMMENT '活动标题',
  inform VARCHAR(200) NOT NULL COMMENT '活动通知',
  detail TEXT NOT NULL COMMENT '活动详情',
  startTime DATETIME NOT NULL COMMENT '活动开始时间',
  finishTime DATETIME NOT NULL COMMENT '活动结束时间',

  r_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '本条记录的唯一标识，主键',
  r_memo VARCHAR(100) NULL COMMENT '本条记录的备注',
  r_status INT(1) DEFAULT '1' NOT NULL COMMENT '本条记录的状态 0 无效 1 有效（默认值）其他待定义',
  r_create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的创建时间',
  r_create_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的创建人',
  r_modify_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的最后一次修改时间',
  r_modify_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的最后一次修改人',
  CONSTRAINT t_deposit_promotion_r_id_uindex
  UNIQUE (r_id)
) COMMENT '充值增费活动';

-- 充值订单
-- r_status：0 生成订单；1 正在充值；2 充值成功；3 充值异常；4 充值取消 5 充值退款'
DROP TABLE IF EXISTS evcos.t_deposit_order;
CREATE TABLE evcos.t_deposit_order
(
  wm_id VARCHAR(30) NULL COMMENT '威马id，关联t_customer.wm_id',
  c_id BIGINT NULL COMMENT '客户id，关联t_customer.r_id',
  dp_code VARCHAR(10) NULL COMMENT '参与的充值活动代码',
  payment_term INT(1) NOT NULL COMMENT '充值方式：1 支付宝；2 微信',
  tpOrderNo VARCHAR(30) NOT NULL COMMENT '第三方订单号',
  tpOrderDetail TEXT NOT NULL COMMENT '第三方订单信息详情，可以以JSON的方式存储',
  orderNo VARCHAR(30) NOT NULL COMMENT '系统内订单号',
  amount DECIMAL(20,2) NOT NULL COMMENT '充值金额',
  pay_amount_before DECIMAL(20,2) NOT NULL COMMENT '实际充值账户金额-充值前',
  present_amount_before DECIMAL(20,2) NOT NULL COMMENT '赠送账户金额-充值前',
  arrearage_amount_before DECIMAL(20,2) NOT NULL COMMENT '欠费账户金额-充值前',
  pay_amount_after DECIMAL(20,2) NOT NULL COMMENT '实际充值账户金额-充值后',
  present_amount_after DECIMAL(20,2) NOT NULL COMMENT '赠送账户金额-充值后',
  arrearage_amount_after DECIMAL(20,2) NOT NULL COMMENT '欠费账户金额-充值后',

  r_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '本条记录的唯一标识，主键',
  r_memo VARCHAR(100) NULL COMMENT '本条记录的备注',
  r_status INT(1) DEFAULT '1' NOT NULL COMMENT '本条记录的状态 0 无效 1 有效（默认值）其他待定义',
  r_create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的创建时间',
  r_create_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的创建人',
  r_modify_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的最后一次修改时间',
  r_modify_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的最后一次修改人',
  CONSTRAINT t_deposit_order_r_id_uindex
  UNIQUE (r_id)
) COMMENT '充值订单';

-- 充值订单过程记录
-- order_status 生成订单；1 正在充值；2 充值成功；3 充值异常；4 充值取消 5 充值退款'
DROP TABLE IF EXISTS evcos.t_deposit_order_process;
CREATE TABLE evcos.t_deposit_order_process
(
  order_no VARCHAR(30) NOT NULL COMMENT '系统内订单号',
  order_status DECIMAL(20,2) NOT NULL COMMENT '订单状态',
  order_status_time TIMESTAMP NOT NULL COMMENT '订单变更至该状态时的时间',

  r_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '本条记录的唯一标识，主键',
  r_memo VARCHAR(100) NULL COMMENT '本条记录的备注',
  r_status INT(1) DEFAULT '1' NOT NULL COMMENT '本条记录的状态 0 无效 1 有效（默认值）其他待定义',
  r_create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的创建时间',
  r_create_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的创建人',
  r_modify_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的最后一次修改时间',
  r_modify_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的最后一次修改人',
  CONSTRAINT t_deposit_order_process_r_id_uindex
  UNIQUE (r_id)
) COMMENT '充值订单过程记录';

-- 评价列表库
-- r_status：0 启用；1 关闭
DROP TABLE IF EXISTS evcos.t_evaluate_tag_lib;
CREATE TABLE evcos.t_evaluate_tag_lib
(
  name VARCHAR(10) NOT NULL COMMENT '标签名称',
  memo VARCHAR(100) NOT NULL COMMENT '标签描述',
  sn INT(10) NOT NULL COMMENT '标签顺序号',

  r_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '本条记录的唯一标识，主键',
  r_memo VARCHAR(100) NULL COMMENT '本条记录的备注',
  r_status INT(1) DEFAULT '1' NOT NULL COMMENT '本条记录的状态 0 无效 1 有效（默认值）其他待定义',
  r_create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的创建时间',
  r_create_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的创建人',
  r_modify_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的最后一次修改时间',
  r_modify_by VARCHAR(20) DEFAULT 'evcos' NOT NULL COMMENT '本条记录的最后一次修改人',
  CONSTRAINT t_evaluate_tag_lib_r_id_uindex
  UNIQUE (r_id)
) COMMENT '评价列表库';
