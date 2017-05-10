-- 创建数据库 schemaName
DROP SCHEMA IF EXISTS schemaName;
CREATE SCHEMA schemaName
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

-- 客户信息表
DROP TABLE IF EXISTS schemaName.t_customer;
CREATE TABLE schemaName.t_customer
(
  super_id VARCHAR(30) NULL COMMENT '超级id',
  nickname VARCHAR(10) NULL COMMENT '昵称',
  realname VARCHAR(10) NULL COMMENT '真实姓名',
  avatar VARCHAR(256) NULL COMMENT '头像地址',
  gender VARCHAR(2) NULL COMMENT '性别',
  id_card_no VARCHAR(20) NULL COMMENT '身份证号',
  birthday DATE NOT NULL COMMENT '生日',

  r_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '本条记录的唯一标识，主键',
  r_memo VARCHAR(100) NULL COMMENT '本条记录的备注',
  r_status INT(1) DEFAULT '1' NOT NULL COMMENT '本条记录的状态 0 无效 1 有效（默认值）其他待定义',
  r_create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的创建时间',
  r_create_by VARCHAR(20) DEFAULT 'schemaName' NOT NULL COMMENT '本条记录的创建人',
  r_modify_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的最后一次修改时间',
  r_modify_by VARCHAR(20) DEFAULT 'schemaName' NOT NULL COMMENT '本条记录的最后一次修改人',
  CONSTRAINT t_customer_r_id_uindex
  UNIQUE (r_id)
) COMMENT '客户信息表';
CREATE INDEX t_customer_super_id_uindex ON schemaName.t_customer (super_id);

-- 客户登录账户表
DROP TABLE IF EXISTS schemaName.t_login_account;
CREATE TABLE schemaName.t_login_account
(
  super_id VARCHAR(30) NULL COMMENT '超级id，关联t_customer.super_id',
  c_id BIGINT NULL COMMENT '客户id，关联t_customer.r_id',
  type INT(1) NOT NULL COMMENT '账户类型：1 手机 ，2 邮箱',
  login_account VARCHAR(100) NOT NULL COMMENT '账户名',
  password VARCHAR(255) NOT NULL COMMENT '密码',
  salt VARCHAR(255) NOT NULL COMMENT '盐值',

  r_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '本条记录的唯一标识，主键',
  r_memo VARCHAR(100) NULL COMMENT '本条记录的备注',
  r_status INT(1) DEFAULT '1' NOT NULL COMMENT '本条记录的状态 0 无效 1 有效（默认值）其他待定义',
  r_create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的创建时间',
  r_create_by VARCHAR(20) DEFAULT 'schemaName' NOT NULL COMMENT '本条记录的创建人',
  r_modify_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的最后一次修改时间',
  r_modify_by VARCHAR(20) DEFAULT 'schemaName' NOT NULL COMMENT '本条记录的最后一次修改人',
  CONSTRAINT t_login_account_r_id_uindex
  UNIQUE (r_id)
) COMMENT '客户登录账户表';
CREATE INDEX t_login_account_login_account_uindex ON schemaName.t_login_account (login_account);
