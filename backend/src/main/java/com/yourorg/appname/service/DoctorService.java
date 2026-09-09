package com.yourorg.appname.service;

import com.yourorg.appname.dto.response.DoctorResponse;
import com.yourorg.appname.dto.response.DoctorReviewResponse;
import com.yourorg.appname.dto.response.ScheduleResponse;

import java.util.List;

public interface DoctorService {
    List<DoctorResponse> getAllDoctors(String search, Long departmentId, Long hospitalId);
    DoctorResponse getDoctorById(Long id);
    List<ScheduleResponse> getDoctorSchedules(Long doctorId, String date);
    List<DoctorReviewResponse> getDoctorReviews(Long doctorId);
}
