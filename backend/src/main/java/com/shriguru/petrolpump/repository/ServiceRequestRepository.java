package com.shriguru.petrolpump.repository;

import com.shriguru.petrolpump.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findAllByOrderByRequestDateDesc();
}
