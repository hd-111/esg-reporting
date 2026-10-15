package com.esg.esg_reporting.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esg.esg_reporting.entity.MetricEntry;
import com.esg.esg_reporting.repository.MetricEntryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MetricEntryService {

    private final MetricEntryRepository repository;

    public MetricEntry saveMetricEntry(MetricEntry entry) {
        return repository.save(entry);
    }

    public List<MetricEntry> getAllMetricEntries() {
        return repository.findAll();
    }

    public MetricEntry getMetricEntryById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Metric entry not found"));
    }

    public void deleteMetricEntry(Long id) {
        repository.deleteById(id);
    }
}