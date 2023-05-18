package cn.apisium.ems.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "employees")
public final class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer staffId;
    private String staffName;
    private int staffAge;
    private int staffGender;
    private String staffPicture;
    private String staffEducation;
    private String staffDepartment;
    private String staffJob;
}
