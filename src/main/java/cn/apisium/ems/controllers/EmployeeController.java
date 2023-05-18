package cn.apisium.ems.controllers;

import cn.apisium.ems.data.DeleteEmployeesRequest;
import cn.apisium.ems.data.EmployeeAvatarRequest;
import cn.apisium.ems.data.Result;
import cn.apisium.ems.models.Employee;
import cn.apisium.ems.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public final class EmployeeController {
    private final EmployeeService service;

    @Autowired
    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping(value = "/employees")
    public Page<Employee> getAllEmployees(Pageable pageable) {
        try {
            return service.getAllEmployees(pageable);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @DeleteMapping(value = "/employees")
    public Result<Object> deleteEmployees(@RequestBody DeleteEmployeesRequest data) {
        try {
            service.deleteEmployees(data.ids());
            return Result.success(null);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(e.getMessage());
        }
    }

    @PatchMapping(value = "/employee")
    public Result<Object> patchEmployee(@RequestBody Employee employee) {
        try {
            service.updateEmployee(employee);
            return Result.success(null);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(e.getMessage());
        }
    }

    @PostMapping(value = "/employee/avatar")
    public Result<Object> patchEmployeeAvatar(@RequestBody EmployeeAvatarRequest data) {
        try {
            if (data.avatar() == null) return Result.error("Avatar is null");
            var e = service.getEmployee(data.id());
            if (e == null) return Result.error("Employee not found");
            e.setStaffPicture(data.avatar());
            service.updateEmployee(e);
            return Result.success(null);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(e.getMessage());
        }
    }

    @PutMapping(value = "/employee")
    public Result<Object> createEmployee() {
        try {
            var employee = new Employee();
            employee.setStaffName("New Employee");
            service.updateEmployee(employee);
            return Result.success(null);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error(e.getMessage());
        }
    }
}
