package com.esg.esg_reporting.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esg.esg_reporting.entity.Evidence;
import com.esg.esg_reporting.repository.EvidenceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EvidenceService {

    private final EvidenceRepository repository;

    public Evidence saveEvidence(Evidence evidence) {
        return repository.save(evidence);
    }

    public List<Evidence> getAllEvidence() {
        return repository.findAll();
    }

    public Evidence getEvidenceById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evidence not found"));
    }

    public void deleteEvidence(Long id) {
        repository.deleteById(id);
    }
}