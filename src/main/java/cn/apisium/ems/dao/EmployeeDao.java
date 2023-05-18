package cn.apisium.ems.dao;

import cn.apisium.ems.models.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeDao extends PagingAndSortingRepository<Employee, Integer>, CrudRepository<Employee, Integer> {
    @Query("SELECT p FROM Employee p WHERE " + "CONCAT(p.staffName, ' ', p.staffEducation, ' ' , p.staffDepartment, ' ' , p.staffJob)"
            + "LIKE %?1%")
    Page<Employee> findAll(String keyword, Pageable pageable);
}
