package cn.apisium.ems.services;

import cn.apisium.ems.dao.EmployeeDao;
import cn.apisium.ems.models.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public final class EmployeeService {
    private final EmployeeDao employeeDao;

    @Autowired
    public EmployeeService(EmployeeDao employeeDao) {
        this.employeeDao = employeeDao;
    }

    public Page<Employee> getAllEmployees(Pageable pageable, String keyword) {
        return keyword == null ? employeeDao.findAll(pageable) : employeeDao.findAll(keyword, pageable);
    }

    public void deleteEmployees(Iterable<Integer> ids) {
        employeeDao.deleteAllById(ids);
    }

    public void updateEmployee(Employee employee) {
        employeeDao.save(employee);
    }

    public Employee getEmployee(int id) {
        return employeeDao.findById(id).orElse(null);
    }
}
