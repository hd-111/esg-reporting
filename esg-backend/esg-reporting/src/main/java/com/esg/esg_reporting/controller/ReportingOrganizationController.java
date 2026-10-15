package com.esg.esg_reporting.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.esg.esg_reporting.entity.ReportingOrganization;
import com.esg.esg_reporting.service.ReportingOrganizationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
public class ReportingOrganizationController {

    private final ReportingOrganizationService service;

    @PostMapping
    public ReportingOrganization saveOrganization(
            @RequestBody ReportingOrganization organization) {
        return service.saveOrganization(organization);
    }

    @GetMapping
    public List<ReportingOrganization> getAllOrganizations() {
        return service.getAllOrganizations();
    }

    @GetMapping("/{id}")
    public ReportingOrganization getOrganizationById(@PathVariable Long id) {
        return service.getOrganizationById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteOrganization(@PathVariable Long id) {
        service.deleteOrganization(id);
        return "Organization deleted successfully";
    }
}