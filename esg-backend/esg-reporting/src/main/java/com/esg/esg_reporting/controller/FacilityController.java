package com.esg.esg_reporting.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.esg.esg_reporting.entity.Facility;
import com.esg.esg_reporting.service.FacilityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
public class FacilityController {

    private final FacilityService service;

    @PostMapping
    public Facility saveFacility(@RequestBody Facility facility) {
        return service.saveFacility(facility);
    }

    @GetMapping
    public List<Facility> getAllFacilities() {
        return service.getAllFacilities();
    }

    @GetMapping("/{id}")
    public Facility getFacilityById(@PathVariable Long id) {
        return service.getFacilityById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteFacility(@PathVariable Long id) {
        service.deleteFacility(id);
        return "Facility deleted successfully";
    }
}