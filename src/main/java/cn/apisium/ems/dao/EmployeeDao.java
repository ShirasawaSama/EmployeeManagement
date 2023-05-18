package cn.apisium.ems.dao;

import cn.apisium.ems.models.Employee;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeDao extends PagingAndSortingRepository<Employee, Integer>, CrudRepository<Employee, Integer> {
}
