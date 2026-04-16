package com.shriguru.petrolpump.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String serviceType; // Fuel Delivery, Bulk Order, etc.

    @Column(columnDefinition = "TEXT")
    private String message;

    private String status = "PENDING"; // PENDING, COMPLETED, CANCELLED

    private LocalDateTime requestDate = LocalDateTime.now();
}
