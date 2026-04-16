package com.shriguru.petrolpump.controller;

import com.shriguru.petrolpump.model.Fuel;
import com.shriguru.petrolpump.repository.FuelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuel")
@CrossOrigin(origins = "http://localhost:5173") // Vite's default port
public class FuelController {

    @Autowired
    private FuelRepository fuelRepository;

    @GetMapping("/prices")
    public List<Fuel> getAllPrices() {
        return fuelRepository.findAll();
    }

    @PostMapping("/update")
    public Fuel updatePrice(@RequestBody Fuel fuel) {
        Fuel existing = fuelRepository.findByType(fuel.getType())
                .orElse(new Fuel());
        existing.setType(fuel.getType());
        existing.setPrice(fuel.getPrice());
        return fuelRepository.save(existing);
    }
}
