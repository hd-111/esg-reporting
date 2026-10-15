package com.esg.esg_reporting.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.esg.esg_reporting.entity.MetricDefinition;
import com.esg.esg_reporting.service.MetricDefinitionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/metric-definitions")
@RequiredArgsConstructor
public class MetricDefinitionController {

    private final MetricDefinitionService service;

    @PostMapping
    public MetricDefinition saveMetricDefinition(
            @RequestBody MetricDefinition definition) {
        return service.saveMetricDefinition(definition);
    }

    @GetMapping
    public List<MetricDefinition> getAllMetricDefinitions() {
        return service.getAllMetricDefinitions();
    }

    @GetMapping("/{id}")
    public MetricDefinition getMetricDefinitionById(
            @PathVariable Long id) {
        return service.getMetricDefinitionById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteMetricDefinition(@PathVariable Long id) {
        service.deleteMetricDefinition(id);
        return "Metric definition deleted successfully";
    }
}