package com.esg.esg_reporting.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.esg.esg_reporting.entity.Evidence;
import com.esg.esg_reporting.service.EvidenceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/evidence")
@RequiredArgsConstructor
public class EvidenceController {

    private final EvidenceService service;

    @PostMapping
    public Evidence saveEvidence(@RequestBody Evidence evidence) {
        return service.saveEvidence(evidence);
    }

    @GetMapping
    public List<Evidence> getAllEvidence() {
        return service.getAllEvidence();
    }

    @GetMapping("/{id}")
    public Evidence getEvidenceById(@PathVariable Long id) {
        return service.getEvidenceById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteEvidence(@PathVariable Long id) {
        service.deleteEvidence(id);
        return "Evidence deleted successfully";
    }
}