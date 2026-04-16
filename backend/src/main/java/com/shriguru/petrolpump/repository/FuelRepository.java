package com.shriguru.petrolpump.repository;

import com.shriguru.petrolpump.model.Fuel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FuelRepository extends JpaRepository<Fuel, Long> {
    Optional<Fuel> findByType(String type);
}
