package com.shriguru.petrolpump.controller;

import com.shriguru.petrolpump.model.ServiceRequest;
import com.shriguru.petrolpump.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class RequestController {

    @Autowired
    private ServiceRequestRepository repository;

    @PostMapping("/submit")
    public ServiceRequest submitRequest(@RequestBody ServiceRequest request) {
        return repository.save(request);
    }

    @GetMapping("/all")
    public List<ServiceRequest> getAllRequests() {
        return repository.findAllByOrderByRequestDateDesc();
    }
    
    @PutMapping("/{id}/status")
    public ServiceRequest updateStatus(@PathVariable Long id, @RequestParam String status) {
        ServiceRequest request = repository.findById(id).orElseThrow();
        request.setStatus(status);
        return repository.save(request);
    }
}
