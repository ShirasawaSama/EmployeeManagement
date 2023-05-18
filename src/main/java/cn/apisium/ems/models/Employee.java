package cn.apisium.ems.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "employees")
public final class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer staff_id;
    private String staff_name;
    private int staff_age;
    private int staff_gender;
    private String staff_picture;
    private String staff_education;
    private String staff_department;
    private String staff_job;
}
