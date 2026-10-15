package com.esg.esg_reporting.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.esg.esg_reporting.entity.MetricEntry;
import com.esg.esg_reporting.service.MetricEntryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/metric-entries")
@RequiredArgsConstructor
public class MetricEntryController {

    private final MetricEntryService service;

    @PostMapping
    public MetricEntry saveMetricEntry(
            @RequestBody MetricEntry entry) {
        return service.saveMetricEntry(entry);
    }

    @GetMapping
    public List<MetricEntry> getAllMetricEntries() {
        return service.getAllMetricEntries();
    }

    @GetMapping("/{id}")
    public MetricEntry getMetricEntryById(@PathVariable Long id) {
        return service.getMetricEntryById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteMetricEntry(@PathVariable Long id) {
        service.deleteMetricEntry(id);
        return "Metric entry deleted successfully";
    }
}