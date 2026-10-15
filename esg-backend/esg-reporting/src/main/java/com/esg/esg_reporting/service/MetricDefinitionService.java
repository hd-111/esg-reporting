package com.esg.esg_reporting.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esg.esg_reporting.entity.MetricDefinition;
import com.esg.esg_reporting.repository.MetricDefinitionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MetricDefinitionService {

    private final MetricDefinitionRepository repository;

    public MetricDefinition saveMetricDefinition(MetricDefinition definition) {
        return repository.save(definition);
    }

    public List<MetricDefinition> getAllMetricDefinitions() {
        return repository.findAll();
    }

    public MetricDefinition getMetricDefinitionById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Metric definition not found"));
    }

    public void deleteMetricDefinition(Long id) {
        repository.deleteById(id);
    }
}