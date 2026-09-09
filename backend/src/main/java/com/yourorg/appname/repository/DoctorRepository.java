package com.yourorg.appname.repository;

import com.yourorg.appname.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByHospitalId(Long hospitalId);
    List<Doctor> findByDepartmentId(Long departmentId);
    List<Doctor> findBySpecialtyContainingIgnoreCase(String specialty);
    List<Doctor> findByNameContainingIgnoreCaseOrSpecialtyContainingIgnoreCase(String name, String specialty);
}
