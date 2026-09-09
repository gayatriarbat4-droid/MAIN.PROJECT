package com.yourorg.appname.repository;

import com.yourorg.appname.entity.EmergencyRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> {
    Optional<EmergencyRequest> findByRequestCode(String requestCode);
    List<EmergencyRequest> findAllByOrderByCreatedAtDesc();
}
