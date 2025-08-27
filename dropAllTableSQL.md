```sql

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

```

# delete table data

```sql
TRUNCATE TABLE classes, batches, groups, courses, academic_revenue, attendance, audit_logs, exams, exam_results, exams_name, expanses, fees, fine_types, fines, gallery, groups, logs, monthly_funds, notices,
others_revenue, project_revenue, receipt_sequences, reviews, salary_payments, students, todos, user_sessions,users,welfare, yearly_funds RESTART IDENTITY CASCADE;
```
