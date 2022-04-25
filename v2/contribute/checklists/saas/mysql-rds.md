---
id: mysql-rds
title: Launching new Mysql RDS Cluster (For API Layer)
hide_title: true
---

## This needs to be executed with migrating/creating a new MySQL RDS instance. This is for API Layer (and not for SAAS)
- MySQL version: 8.0.23
- Option groups: default:mysql-8-0
- Parameter group: default.mysql8.0
- Create 2 users (apart from the root user)
    - accessMaster: should have sudo access to a the DB (only one database, not the RDS)
    - executionMaster: should have read/write access to the DB tables (should not be able to drop/delete/add tables)
- have a procedure that runs periodically to remove stale connection (check below)
- for retool if requried, create a separate user that only has read access to the DB tables. The user should also have a cap on how many active connections it can create.
- add tags:
    - VantaContainsUserData: true
    - VantaDescription: ...
    - VantaOwner: rishabh@supertokens.com
- Add CloudWatch Alarms
    - FreeableMemory Alarm
        - Name: db-{{RDS-cluster-name}} FreeableMemory
        - Type: Metric alarm
        - Namespace: AWS/RDS
        - Metric name: FreeableMemory
        - DBInstanceIdentifier: {{db-instance-identifier}}
        - Statistic: Minimum
        - Period: 15 minutes
        - Threshold type: Static
        - Whenever FreeableMemory is...: Lower
        - than…: 52428800
        - SNS
            - Select an existing SNS topic: CloudWatch_Alarms_RDS
    - FreeStorageSpace Alarm
        - Name: db-{{RDS-cluster-name}} FreeStorageSpace
        - Type: Metric alarm
        - Namespace: AWS/RDS
        - Metric name: FreeStorageSpace
        - DBInstanceIdentifier: {{db-instance-identifier}}
        - Statistic: Minimum
        - Period: 15 minutes
        - Threshold type: Static
        - Whenever FreeStorageSpace is...: Lower
        - than…: 1073741824
        - SNS
            - Select an existing SNS topic: CloudWatch_Alarms_RDS
    - CPUUtilization Alarm
        - Name: db-{{RDS-cluster-name}} CPUUtilization
        - Type: Metric alarm
        - Namespace: AWS/RDS
        - Metric name: CPUUtilization
        - DBInstanceIdentifier: {{db-instance-identifier}}
        - Statistic: Maximum
        - Period: 15 minutes
        - Threshold type: Static
        - Whenever CPUUtilization is...: Greater
        - than…: 80
        - SNS
            - Select an existing SNS topic: CloudWatch_Alarms_RDS
    - ReadIOPS Alarm
        - Name: db-{{RDS-cluster-name}} ReadIOPS
        - Type: Metric alarm
        - Namespace: AWS/RDS
        - Metric name: ReadIOPS
        - DBInstanceIdentifier: {{db-instance-identifier}}
        - Statistic: Maximum
        - Period: 15 minutes
        - Threshold type: Static
        - Whenever ReadIOPS is...: Greater
        - than…: 1000
        - SNS
            - Select an existing SNS topic: CloudWatch_Alarms_RDS
- reference sql file with minimum set of queries:

```sql
CREATE DATABASE supertokens;

CREATE USER 'executionMaster'@'%' IDENTIFIED BY 'to_be_replaced_with_execution_master_password';

CREATE USER 'accessMaster'@'%' IDENTIFIED BY 'to_be_replaced_with_access_master_password';

GRANT ALL ON *.* TO 'accessMaster'@'%';

GRANT DELETE, INSERT, SELECT, UPDATE, CREATE, REFERENCES ON supertokens.* TO 'executionMaster'@'%';

use supertokens
DELIMITER //
CREATE PROCEDURE remove_stale_connections()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE id_to_remove bigint(21) unsigned;
    DECLARE supertokens_cursor CURSOR FOR SELECT id FROM information_schema.processlist WHERE time > 250;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    open supertokens_cursor;
    read_loop: LOOP
        FETCH supertokens_cursor INTO id_to_remove;
        IF done THEN
          LEAVE read_loop;
        END IF;
        CALL mysql.rds_kill(id_to_remove);
    END LOOP;

    close supertokens_cursor;
END
//
DELIMITER ;
CREATE EVENT remove_stale_connections
    ON SCHEDULE
        EVERY 1 MINUTE
    DO CALL remove_stale_connections();
```