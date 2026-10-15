package com.esg.esg_reporting.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esg.esg_reporting.entity.Facility;
import com.esg.esg_reporting.repository.FacilityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepository repository;

    public Facility saveFacility(Facility facility) {
        return repository.save(facility);
    }

    public List<Facility> getAllFacilities() {
        return repository.findAll();
    }

    public Facility getFacilityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found"));
    }

    public void deleteFacility(Long id) {
        repository.deleteById(id);
    }
}