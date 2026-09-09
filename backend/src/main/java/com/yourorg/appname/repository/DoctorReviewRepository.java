package com.yourorg.appname.repository;

import com.yourorg.appname.entity.DoctorReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorReviewRepository extends JpaRepository<DoctorReview, Long> {
    List<DoctorReview> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);
}
