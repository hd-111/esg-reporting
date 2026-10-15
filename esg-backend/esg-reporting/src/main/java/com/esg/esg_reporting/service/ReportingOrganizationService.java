package com.esg.esg_reporting.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esg.esg_reporting.entity.ReportingOrganization;
import com.esg.esg_reporting.repository.ReportingOrganizationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportingOrganizationService {

    private final ReportingOrganizationRepository repository;

    public ReportingOrganization saveOrganization(ReportingOrganization organization) {
        return repository.save(organization);
    }

    public List<ReportingOrganization> getAllOrganizations() {
        return repository.findAll();
    }

    public ReportingOrganization getOrganizationById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
    }

    public void deleteOrganization(Long id) {
        repository.deleteById(id);
    }
}