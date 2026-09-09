package com.yourorg.appname.repository;

import com.yourorg.appname.entity.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    List<DoctorSchedule> findByDoctorId(Long doctorId);
    List<DoctorSchedule> findByDoctorIdAndAvailableDate(Long doctorId, String availableDate);
    Optional<DoctorSchedule> findByDoctorIdAndAvailableDateAndTimeSlot(Long doctorId, String availableDate, String timeSlot);
}
