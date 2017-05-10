
-- {{tableComment}}{{tableAnnotation}}
DROP TABLE IF EXISTS {{schemaName}}.{{tableName}};
CREATE TABLE {{schemaName}}.{{tableName}}
(
{{businessFileSql}}
  r_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '本条记录的唯一标识，主键',
  r_memo VARCHAR(100) NULL COMMENT '本条记录的备注',
  r_status INT(1) DEFAULT '1' NOT NULL COMMENT '本条记录的状态 0 无效 1 有效（默认值）其他待定义',
  r_create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的创建时间',
  r_create_by VARCHAR(20) DEFAULT '{{schemaName}}' NOT NULL COMMENT '本条记录的创建人',
  r_modify_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '本条记录的最后一次修改时间',
  r_modify_by VARCHAR(20) DEFAULT '{{schemaName}}' NOT NULL COMMENT '本条记录的最后一次修改人',
  CONSTRAINT {{tableName}}_r_id_uindex
  UNIQUE (r_id)
) COMMENT '{{tableComment}}';